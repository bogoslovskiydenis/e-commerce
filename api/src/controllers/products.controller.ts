import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class ProductsController {
    // Получить список товаров
    async getProducts(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 25,
                search,
                category,
                inStock,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (Number(page) - 1) * Number(limit);

            const where: any = {};

            if (search) {
                where.OR = [
                    { title: { contains: search as string, mode: 'insensitive' } },
                    { description: { contains: search as string, mode: 'insensitive' } },
                    { brand: { contains: search as string, mode: 'insensitive' } }
                ];
            }

            if (category) {
                where.categoryId = category;
            }

            if (inStock !== undefined) {
                where.inStock = inStock === 'true';
            }

            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            }
                        }
                    },
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    skip,
                    take: Number(limit),
                }),
                prisma.product.count({ where })
            ]);

            res.json({
                success: true,
                data: products,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Get products error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить товар по ID
    async getProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: true,
                }
            });

            if (!product) {
                return res.status(404).json({
                    error: 'Product not found'
                });
            }

            res.json({
                success: true,
                data: product
            });

        } catch (error) {
            logger.error('Get product error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Создать товар
    async createProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                slug,
                description,
                shortDescription,
                price,
                oldPrice,
                costPrice,
                categoryId,
                brand,
                sku,
                images,
                attributes,
                isActive,
                inStock,
                stockQuantity,
                weight,
                dimensions
            } = req.body;

            const product = await prisma.product.create({
                data: {
                    title,
                    slug,
                    description,
                    shortDescription,
                    price,
                    oldPrice,
                    costPrice,
                    categoryId,
                    brand,
                    sku,
                    images: images || [],
                    attributes,
                    isActive: isActive ?? true,
                    inStock: inStock ?? true,
                    stockQuantity: stockQuantity || 0,
                    weight,
                    dimensions
                },
                include: {
                    category: true
                }
            });

            res.status(201).json({
                success: true,
                data: product
            });

        } catch (error) {
            logger.error('Create product error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Обновить товар
    async updateProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const product = await prisma.product.update({
                where: { id },
                data: updateData,
                include: {
                    category: true
                }
            });

            res.json({
                success: true,
                data: product
            });

        } catch (error) {
            logger.error('Update product error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Удалить товар
    async deleteProduct(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.product.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });

        } catch (error) {
            logger.error('Delete product error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}