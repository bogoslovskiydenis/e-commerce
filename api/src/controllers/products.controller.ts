import { Response } from 'express';
import { prisma } from '../config/database';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ProductsController {
    // Получить список товаров
    async getProducts(req: AuthenticatedRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const sortBy = req.query.sortBy as string || 'createdAt';
            const sortOrder = req.query.sortOrder as string || 'desc';
            const search = req.query.search as string;
            const categoryId = req.query.categoryId as string;

            const skip = (page - 1) * limit;

            console.log('🛍️ Получение списка товаров из БД', {
                page, limit, sortBy, sortOrder, search, categoryId
            });

            // Строим условие поиска
            const where: any = {};
            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { brand: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (categoryId) {
                where.categoryId = categoryId;
            }

            const [products, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { [sortBy]: sortOrder },
                    include: {
                        category: {
                            select: { id: true, name: true, slug: true }
                        }
                    }
                }),
                prisma.product.count({ where })
            ]);

            res.json({
                success: true,
                data: products,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            });

        } catch (error) {
            console.error('❌ Ошибка получения товаров:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить товар по ID
    async getProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log('🛍️ Получение товара по ID:', id);

            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: {
                        select: { id: true, name: true, slug: true }
                    }
                }
            });

            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            res.json({
                success: true,
                data: product
            });

        } catch (error) {
            console.error('❌ Ошибка получения товара:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Создание товара
    async createProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                description,
                price,
                oldPrice,
                discount, // ✅ ДОБАВЛЕНО
                sku,
                categoryId,
                brand,
                isActive = 'true',
                inStock = 'true',
                stockQuantity = '0',
                weight,
                dimensions,
                metaTitle,
                metaDescription,
                slug
            } = req.body;

            console.log('🛍️ Создание нового товара:', {
                title,
                price,
                oldPrice,
                discount, // ✅ ДОБАВЛЕНО В ЛОГ
                brand,
                sku,
                categoryId,
                stockQuantity,
                hasFile: !!req.file
            });

            // Валидация обязательных полей
            if (!title || !price) {
                return res.status(400).json({
                    success: false,
                    error: 'Title and price are required'
                });
            }

            // ✅ ИСПРАВЛЕНО: Обработка загруженного файла
            let images: string[] = [];
            if (req.file) {
                const imageUrl = `/uploads/${req.file.filename}`;
                images = [imageUrl];
                console.log('📸 Изображение загружено:', imageUrl);
            }

            // Проверяем уникальность SKU
            if (sku) {
                const existingProduct = await prisma.product.findFirst({
                    where: { sku }
                });

                if (existingProduct) {
                    return res.status(400).json({
                        success: false,
                        error: 'Product with this SKU already exists'
                    });
                }
            }

            // Проверяем существование категории
            if (categoryId) {
                const categoryExists = await prisma.category.findUnique({
                    where: { id: categoryId }
                });

                if (!categoryExists) {
                    return res.status(400).json({
                        success: false,
                        error: 'Category not found'
                    });
                }
            }

            // ✅ ИСПРАВЛЕНО: Правильное преобразование типов
            const product = await prisma.product.create({
                data: {
                    title,
                    slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
                    description,
                    price: parseFloat(price),
                    oldPrice: oldPrice ? parseFloat(oldPrice) : null,
                    discount: discount ? parseFloat(discount) : null, // ✅ ДОБАВЛЕНО
                    brand,
                    sku,
                    categoryId,
                    images,
                    isActive: isActive === 'true' || isActive === true, // ✅ ИСПРАВЛЕНО
                    inStock: inStock === 'true' || inStock === true,   // ✅ ИСПРАВЛЕНО
                    stockQuantity: parseInt(stockQuantity) || 0,
                    weight: weight ? parseFloat(weight) : null,
                    dimensions,
                    metaTitle,
                    metaDescription
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            console.log('✅ Товар создан:', product.title);

            res.status(201).json({
                success: true,
                data: product
            });

        } catch (error) {
            console.error('❌ Ошибка создания товара:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Обновление товара
    async updateProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            console.log('🛍️ Обновление товара:', id, Object.keys(updateData), 'hasFile:', !!req.file);

            // Проверяем существование товара
            const existingProduct = await prisma.product.findUnique({
                where: { id }
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            // ✅ ИСПРАВЛЕНО: Обработка загруженного файла
            if (req.file) {
                const imageUrl = `/uploads/${req.file.filename}`;
                console.log('📸 Новое изображение загружено:', imageUrl);
                updateData.images = [imageUrl];
            }

            // Проверяем уникальность SKU при обновлении
            if (updateData.sku && updateData.sku !== existingProduct.sku) {
                const existingProductWithSku = await prisma.product.findFirst({
                    where: {
                        sku: updateData.sku,
                        id: { not: id }
                    }
                });

                if (existingProductWithSku) {
                    return res.status(400).json({
                        success: false,
                        error: 'Product with this SKU already exists'
                    });
                }
            }

            // Проверяем существование категории
            if (updateData.categoryId && updateData.categoryId !== existingProduct.categoryId) {
                const categoryExists = await prisma.category.findUnique({
                    where: { id: updateData.categoryId }
                });

                if (!categoryExists) {
                    return res.status(400).json({
                        success: false,
                        error: 'Category not found'
                    });
                }
            }

            // ✅ ИСПРАВЛЕНО: Правильное преобразование типов данных
            if (updateData.price) updateData.price = parseFloat(updateData.price);
            if (updateData.oldPrice) updateData.oldPrice = parseFloat(updateData.oldPrice);
            if (updateData.discount) updateData.discount = parseFloat(updateData.discount); // ✅ ДОБАВЛЕНО
            if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);
            if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

            // ✅ ИСПРАВЛЕНО: Преобразование строк в булевы значения
            if (updateData.isActive !== undefined) {
                updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
            }
            if (updateData.inStock !== undefined) {
                updateData.inStock = updateData.inStock === 'true' || updateData.inStock === true;
            }

            // Обновляем товар
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            console.log('✅ Товар обновлен:', updatedProduct.title);

            res.json({
                success: true,
                data: updatedProduct
            });

        } catch (error) {
            console.error('❌ Ошибка обновления товара:', error);
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // ✅ НОВАЯ ФУНКЦИЯ: Отдельный endpoint для загрузки изображений
    async uploadProductImage(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'No image file provided'
                });
            }

            const imageUrl = `/uploads/${req.file.filename}`;
            console.log('📸 Загрузка изображения для товара:', id, imageUrl);

            // Обновляем товар с новым изображением
            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    images: [imageUrl],
                    updatedAt: new Date()
                }
            });

            res.json({
                success: true,
                data: {
                    imageUrl,
                    product: updatedProduct
                }
            });

        } catch (error) {
            console.error('❌ Ошибка загрузки изображения:', error);
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Удалить товар
    async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log('🛍️ Удаление товара:', id);

            // Проверяем, не используется ли товар в заказах
            const orderItemsCount = await prisma.orderItem.count({
                where: { productId: id }
            });

            if (orderItemsCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete product used in ${orderItemsCount} orders. Archive the product instead.`
                });
            }

            const deletedProduct = await prisma.product.delete({
                where: { id }
            });

            console.log('✅ Товар удален:', deletedProduct.title);

            res.json({
                success: true,
                data: deletedProduct
            });

        } catch (error) {
            console.error('❌ Ошибка удаления товара:', error);
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить товары по категории
    async getProductsByCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { categoryId } = req.params;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 25;

            const skip = (page - 1) * limit;

            console.log('🛍️ Получение товаров по категории:', categoryId);

            const [products, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where: {
                        categoryId,
                        isActive: true
                    },
                    skip,
                    take: limit,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        category: {
                            select: { id: true, name: true }
                        }
                    }
                }),
                prisma.product.count({
                    where: {
                        categoryId,
                        isActive: true
                    }
                })
            ]);

            res.json({
                success: true,
                data: products,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            });

        } catch (error) {
            console.error('❌ Ошибка получения товаров по категории:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const productsController = new ProductsController();