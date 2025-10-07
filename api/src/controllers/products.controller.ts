import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';

export class ProductsController {

    async getProducts(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                page = 1,
                limit = 25,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                search,
                categoryId
            } = req.query;

            console.log('🛍️ Получение списка товаров из БД', {
                page: Number(page),
                limit: Number(limit),
                sortBy: String(sortBy),
                sortOrder: String(sortOrder),
                search: search ? String(search) : undefined,
                categoryId: categoryId ? String(categoryId) : undefined
            });

            const skip = (Number(page) - 1) * Number(limit);

            // Условие поиска
            const whereCondition: any = {};

            if (search) {
                whereCondition.OR = [
                    { title: { contains: String(search), mode: 'insensitive' } },
                    { description: { contains: String(search), mode: 'insensitive' } },
                    { sku: { contains: String(search), mode: 'insensitive' } },
                    { brand: { contains: String(search), mode: 'insensitive' } }
                ];
            }

            if (categoryId) {
                whereCondition.categoryId = String(categoryId);
            }

            // Определяем сортировку
            const orderBy: any = {};
            if (sortBy === 'price') {
                orderBy.price = sortOrder;
            } else if (sortBy === 'title') {
                orderBy.title = sortOrder;
            } else {
                orderBy.createdAt = sortOrder;
            }

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where: whereCondition,
                    include: {
                        category: {
                            select: { id: true, name: true, slug: true }
                        }
                    },
                    orderBy,
                    skip,
                    take: Number(limit)
                }),
                prisma.product.count({ where: whereCondition })
            ]);

            res.json({
                success: true,
                data: products.map(product => ({
                    id: product.id,
                    title: product.title,
                    slug: product.slug,
                    description: product.description,
                    shortDescription: product.shortDescription,
                    price: Number(product.price),
                    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
                    discount: product.discount ? Number(product.discount) : null,
                    brand: product.brand,
                    sku: product.sku,
                    images: product.images,
                    categoryId: product.categoryId,
                    category: product.category,
                    attributes: product.attributes,
                    tags: product.tags,
                    isActive: product.isActive,
                    inStock: product.inStock,
                    stockQuantity: product.stockQuantity,
                    featured: product.featured,
                    weight: product.weight ? Number(product.weight) : null,
                    dimensions: product.dimensions,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                })),
                total: total
            });

        } catch (error) {
            logger.error('Get products error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async getProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

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
                success: true,  // ← Вот сюда!
                data: {
                    id: product.id,
                    title: product.title,
                    slug: product.slug,
                    description: product.description,
                    shortDescription: product.shortDescription,
                    price: Number(product.price),
                    oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
                    discount: product.discount ? Number(product.discount) : null,
                    brand: product.brand,
                    sku: product.sku,
                    images: product.images,
                    categoryId: product.categoryId,
                    category: product.category,
                    attributes: product.attributes,
                    tags: product.tags,
                    isActive: product.isActive,
                    inStock: product.inStock,
                    stockQuantity: product.stockQuantity,
                    featured: product.featured,
                    weight: product.weight ? Number(product.weight) : null,
                    dimensions: product.dimensions,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt
                }
            });

        } catch (error) {
            logger.error('Get product error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    private async generateUniqueSKU(title: string): Promise<string> {
        const translit = (str: string): string => {
            const ru = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя';
            const en = 'abvgdeejzijklmnoprstufhcchshch_y_eyu';

            return str.toLowerCase().split('').map(char => {
                const index = ru.indexOf(char);
                return index !== -1 ? en[index] : char;
            }).join('');
        };

        const baseSKU = translit(title)
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 20)
            .toUpperCase();

        let sku = baseSKU;
        let counter = 1;

        while (true) {
            const existingProduct = await prisma.product.findUnique({
                where: { sku }
            });

            if (!existingProduct) {
                return sku;
            }

            sku = `${baseSKU}-${counter.toString().padStart(3, '0')}`;
            counter++;

            if (counter > 999) {
                sku = `${baseSKU}-${Date.now()}`;
                break;
            }
        }

        return sku;
    }

    async createProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const productData = req.body;

            console.log('📦 Создание товара:', productData);

            if (!productData.sku || productData.sku.trim() === '') {
                productData.sku = await this.generateUniqueSKU(productData.title);
                console.log(`🏷️ Сгенерирован SKU: ${productData.sku}`);
            } else {
                const existingProduct = await prisma.product.findUnique({
                    where: { sku: productData.sku }
                });

                if (existingProduct) {
                    return res.status(400).json({
                        success: false,
                        error: `Товар с артикулом ${productData.sku} уже существует`
                    });
                }
            }

            const slug = productData.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const product = await prisma.product.create({
                data: {
                    title: productData.title,
                    slug: slug,
                    price: parseFloat(productData.price),
                    oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
                    discount: productData.discount ? parseFloat(productData.discount) : null,
                    brand: productData.brand || null,
                    sku: productData.sku,
                    description: productData.description || null,
                    shortDescription: productData.shortDescription || null,
                    categoryId: productData.categoryId,
                    images: productData.images || [],
                    attributes: productData.attributes || {},
                    tags: productData.tags || [],
                    isActive: productData.isActive !== false,
                    inStock: productData.inStock !== false,
                    stockQuantity: parseInt(productData.stockQuantity) || 0,
                    featured: productData.featured || false,
                    weight: productData.weight ? parseFloat(productData.weight) : null,
                    dimensions: productData.dimensions || null,
                    metaTitle: productData.metaTitle || null,
                    metaDescription: productData.metaDescription || null
                },
                include: {
                    category: true
                }
            });

            console.log(`✅ Товар создан: ${product.title} (SKU: ${product.sku})`);

            res.status(201).json({
                success: true,
                data: product
            });

        } catch (error) {
            console.error('❌ Ошибка создания товара:', error);

            if (error.code === 'P2002' && error.meta?.target?.includes('sku')) {
                return res.status(400).json({
                    success: false,
                    error: 'Товар с таким артикулом уже существует'
                });
            }

            res.status(500).json({
                success: false,
                error: 'Ошибка при создании товара'
            });
        }
    }

    async updateProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const productData = req.body;

            const existingProduct = await prisma.product.findUnique({
                where: { id }
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            if (productData.sku && productData.sku !== existingProduct.sku) {
                const skuConflict = await prisma.product.findUnique({
                    where: { sku: productData.sku }
                });

                if (skuConflict) {
                    return res.status(400).json({
                        success: false,
                        error: `Product with SKU ${productData.sku} already exists`
                    });
                }
            }

            const updatedProduct = await prisma.product.update({
                where: { id },
                data: {
                    title: productData.title,
                    price: productData.price ? parseFloat(productData.price) : undefined,
                    oldPrice: productData.oldPrice ? parseFloat(productData.oldPrice) : null,
                    discount: productData.discount ? parseFloat(productData.discount) : null,
                    brand: productData.brand,
                    sku: productData.sku,
                    description: productData.description,
                    shortDescription: productData.shortDescription,
                    categoryId: productData.categoryId,
                    images: productData.images,
                    attributes: productData.attributes,
                    tags: productData.tags,
                    isActive: productData.isActive,
                    inStock: productData.inStock,
                    stockQuantity: productData.stockQuantity ? parseInt(productData.stockQuantity) : undefined,
                    featured: productData.featured,
                    weight: productData.weight ? parseFloat(productData.weight) : null,
                    dimensions: productData.dimensions,
                    metaTitle: productData.metaTitle,
                    metaDescription: productData.metaDescription
                },
                include: {
                    category: true
                }
            });

            res.json({
                success: true,
                data: updatedProduct
            });

        } catch (error) {
            logger.error('Update product error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const existingProduct = await prisma.product.findUnique({
                where: { id }
            });

            if (!existingProduct) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            await prisma.product.delete({
                where: { id }
            });

            res.json({
                success: true,
                data: existingProduct
            });

        } catch (error) {
            logger.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const productsController = new ProductsController();