import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class ProductsController {
    // Получить список товаров
    async getProducts(req: AuthenticatedRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 25;
            const sortBy = req.query.sortBy as string || 'createdAt';
            const sortOrder = req.query.sortOrder as string || 'desc';
            const search = req.query.search as string;
            const categoryId = req.query.categoryId as string;
            const isActive = req.query.isActive as string;

            const skip = (page - 1) * limit;

            console.log('🛍️ Получение списка товаров из БД', { page, limit, sortBy, sortOrder, search, categoryId });

            // Строим условие поиска
            const where: any = {};

            if (search) {
                where.OR = [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                    { sku: { contains: search, mode: 'insensitive' } }
                ];
            }

            if (categoryId) {
                where.categoryId = categoryId;
            }

            if (isActive !== undefined) {
                where.isActive = isActive === 'true';
            }

            // Получаем товары с категориями
            const [products, totalCount] = await Promise.all([
                prisma.product.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        [sortBy]: sortOrder
                    },
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        },
                        _count: {
                            select: {
                                orderItems: true,
                                reviews: true
                            }
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
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    reviews: {
                        take: 5,
                        orderBy: { createdAt: 'desc' },
                        include: {
                            customer: {
                                select: { name: true }
                            }
                        }
                    },
                    _count: {
                        select: {
                            orderItems: true,
                            reviews: true
                        }
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

    async createProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                description,
                price,
                oldPrice, // изменили с salePrice на oldPrice
                sku,
                categoryId,
                brand, // ✅ ДОБАВЛЕНО
                images = [],
                isActive = true,
                inStock = true,
                stockQuantity = 0,
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
                brand, // ✅ ДОБАВЛЕНО В ЛОГ
                sku,
                categoryId,
                stockQuantity
            });

            // Валидация обязательных полей
            if (!title || !price) {
                return res.status(400).json({
                    success: false,
                    error: 'Title and price are required'
                });
            }

            // Генерируем slug если не передан
            const finalSlug = slug || title.toLowerCase()
                .replace(/[^a-zа-я0-9]/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            // Проверяем уникальность SKU если указан
            if (sku) {
                const existingProduct = await prisma.product.findUnique({
                    where: { sku }
                });

                if (existingProduct) {
                    return res.status(400).json({
                        success: false,
                        error: 'Product with this SKU already exists'
                    });
                }
            }

            // Проверяем уникальность slug
            const existingSlugProduct = await prisma.product.findUnique({
                where: { slug: finalSlug }
            });

            if (existingSlugProduct) {
                // Добавляем случайное число к slug
                const randomSuffix = Math.random().toString(36).substring(2, 8);
                finalSlug = `${finalSlug}-${randomSuffix}`;
            }

            // Проверяем существование категории
            if (categoryId) {
                const category = await prisma.category.findUnique({
                    where: { id: categoryId }
                });

                if (!category) {
                    return res.status(400).json({
                        success: false,
                        error: 'Category not found'
                    });
                }
            }

            const product = await prisma.product.create({
                data: {
                    title,
                    slug: finalSlug,
                    description,
                    price: parseFloat(price),
                    oldPrice: oldPrice ? parseFloat(oldPrice) : null, // ✅ ИСПРАВЛЕНО: salePrice -> oldPrice
                    brand, // ✅ ДОБАВЛЕНО
                    sku,
                    categoryId,
                    images,
                    isActive,
                    inStock,
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

    // Обновить товар
    async updateProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            console.log('🛍️ Обновление товара:', id, Object.keys(updateData));

            // Если обновляется SKU, проверяем уникальность
            if (updateData.sku) {
                const existingProduct = await prisma.product.findFirst({
                    where: {
                        sku: updateData.sku,
                        NOT: { id }
                    }
                });

                if (existingProduct) {
                    return res.status(400).json({
                        success: false,
                        error: 'Product with this SKU already exists'
                    });
                }
            }

            // Преобразуем числовые поля
            if (updateData.price) updateData.price = parseFloat(updateData.price);
            if (updateData.salePrice) updateData.oldPrice = parseFloat(updateData.salePrice);
            if (updateData.stockQuantity) updateData.stockQuantity = parseInt(updateData.stockQuantity);
            if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

            const product = await prisma.product.update({
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
                    },
                    _count: {
                        select: {
                            orderItems: true,
                            reviews: true
                        }
                    }
                }
            });

            console.log('✅ Товар обновлен:', product.title);

            res.json({
                success: true,
                data: product
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

    // Удалить товар
    async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log('🛍️ Удаление товара:', id);

            // Проверяем, есть ли заказы с этим товаром
            const orderItemsCount = await prisma.orderItem.count({
                where: { productId: id }
            });

            if (orderItemsCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete product with ${orderItemsCount} order items. Archive the product instead.`
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