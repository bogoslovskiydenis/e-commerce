import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class CategoriesController {
    async getCategories(req: Request, res: Response) {
        try {
            const { includeProducts = false } = req.query;

            const categories = await prisma.category.findMany({
                include: {
                    parent: true,
                    children: true,
                    ...(includeProducts === 'true' && {
                        products: {
                            select: {
                                id: true,
                                title: true,
                                price: true,
                                isActive: true
                            }
                        }
                    }),
                    _count: {
                        select: {
                            products: true
                        }
                    }
                },
                orderBy: [
                    { sortOrder: 'asc' },
                    { name: 'asc' }
                ]
            });

            res.json({
                success: true,
                data: categories
            });

        } catch (error) {
            logger.error('Get categories error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async createCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                name,
                slug,
                description,
                parentId,
                imageUrl,
                isActive,
                sortOrder
            } = req.body;

            const category = await prisma.category.create({
                data: {
                    name,
                    slug,
                    description,
                    parentId,
                    imageUrl,
                    isActive: isActive ?? true,
                    sortOrder: sortOrder || 0
                },
                include: {
                    parent: true,
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            res.status(201).json({
                success: true,
                data: category
            });

        } catch (error) {
            logger.error('Create category error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async updateCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const category = await prisma.category.update({
                where: { id },
                data: updateData,
                include: {
                    parent: true,
                    children: true,
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            res.json({
                success: true,
                data: category
            });

        } catch (error) {
            logger.error('Update category error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async deleteCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            // Проверяем, есть ли товары в категории
            const productsCount = await prisma.product.count({
                where: { categoryId: id }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    error: 'Cannot delete category with products'
                });
            }

            await prisma.category.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Category deleted successfully'
            });

        } catch (error) {
            logger.error('Delete category error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}