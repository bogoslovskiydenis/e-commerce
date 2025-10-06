import { Request, Response } from 'express';
import { categoriesService } from '@/services/categories.service';
import { logger } from '@/utils/logger';
import { ApiError } from '@/utils/apiError';  // ← ИСПРАВЛЕНО
import { AuthenticatedRequest } from "@/middleware/auth.middleware";

export class CategoriesController {
    // Получить список всех категорий
    async getCategories(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 50,
                parentId,
                active,
                search,
                type,
                sortBy = 'sortOrder', // Изменено с 'order' на 'sortOrder'
                sortOrder = 'asc'
            } = req.query;

            const filters = {
                parentId: parentId ? String(parentId) : undefined,
                active: active !== undefined ? active === 'true' : undefined,
                search: search ? String(search) : undefined,
                type: type ? String(type) : undefined
            };

            const result = await categoriesService.getCategories({
                page: Number(page),
                limit: Number(limit),
                filters,
                sortBy: String(sortBy),
                sortOrder: sortOrder as 'asc' | 'desc'
            });

            res.json({
                success: true,
                data: result.categories,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: result.totalPages
                }
            });

        } catch (error) {
            logger.error('Get categories error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить категорию по ID
    async getCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await categoriesService.getCategoryById(id);

            if (!category) {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }

            res.json({
                success: true,
                data: category
            });

        } catch (error) {
            logger.error('Get category error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить дерево категорий
    async getCategoriesTree(req: Request, res: Response) {
        try {
            const { includeInactive = false, type } = req.query;

            const tree = await categoriesService.getCategoriesTree({
                includeInactive: includeInactive === 'true',
                type: type ? String(type) as any : undefined
            });

            res.json({
                success: true,
                data: tree
            });

        } catch (error) {
            logger.error('Get categories tree error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить категории для навигации (публичные)
    async getNavigationCategories(req: Request, res: Response) {
        try {
            const categories = await categoriesService.getNavigationCategories();

            res.json({
                success: true,
                data: categories
            });

        } catch (error) {
            logger.error('Get navigation categories error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }


    async createCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const categoryData = req.body;

            // Логируем полученные данные
            console.log('🐛 Received category data:', JSON.stringify(categoryData, null, 2));

            // Очищаем данные и проверяем обязательные поля
            const cleanCategoryData = {
                name: categoryData.name,
                slug: categoryData.slug,
                type: categoryData.type || 'PRODUCTS',
                description: categoryData.description,
                parentId: categoryData.parentId,
                imageUrl: categoryData.imageUrl,
                bannerUrl: categoryData.bannerUrl,
                showInNavigation: categoryData.showInNavigation,
                metaTitle: categoryData.metaTitle,
                metaDescription: categoryData.metaDescription,
                metaKeywords: categoryData.metaKeywords,
                filters: categoryData.filters,
                sortOrder: categoryData.sortOrder || categoryData.order // Поддержка order -> sortOrder
            };

            // Удаляем undefined значения
            Object.keys(cleanCategoryData).forEach(key => {
                if (cleanCategoryData[key] === undefined) {
                    delete cleanCategoryData[key];
                }
            });

            console.log('🧹 Cleaned category data:', JSON.stringify(cleanCategoryData, null, 2));

            // Проверяем обязательные поля
            if (!cleanCategoryData.name || !cleanCategoryData.slug) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and slug are required'
                });
            }

            const category = await categoriesService.createCategory(cleanCategoryData);

            logger.info(`Category created: ${category.name} by ${req.user?.username}`);

            res.status(201).json({
                success: true,
                data: category,
                message: 'Category created successfully'
            });

        } catch (error) {
            logger.error('Create category error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
    // Обновить категорию
    async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const category = await categoriesService.updateCategory(id, updateData);

            logger.info(`Category updated: ${category.name} by ${(req as any).user?.username || 'unknown'}`);

            res.json({
                success: true,
                data: category,
                message: 'Category updated successfully'
            });

        } catch (error) {
            logger.error('Update category error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Переключить статус активности категории
    async toggleCategoryStatus(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const category = await categoriesService.toggleCategoryStatus(id);

            logger.info(`Category ${category.active ? 'activated' : 'deactivated'}: ${category.name} by ${(req as any).user?.username || 'unknown'}`);

            res.json({
                success: true,
                data: category,
                message: `Category ${category.active ? 'activated' : 'deactivated'} successfully`
            });

        } catch (error) {
            logger.error('Toggle category status error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Изменить порядок категорий
    async reorderCategories(req: Request, res: Response) {
        try {
            const { items } = req.body; // [{ id: string, order: number }]

            await categoriesService.reorderCategories(items);

            logger.info(`Categories reordered by ${(req as any).user?.username || 'unknown'}`);

            res.json({
                success: true,
                message: 'categories reordered successfully'
            });

        } catch (error) {
            logger.error('Reorder categories error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Переместить категорию
    async moveCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { newParentId, newOrder } = req.body;

            const category = await categoriesService.moveCategory(id, {
                newParentId,
                newOrder
            });

            logger.info(`Category moved: ${category.name} by ${(req as any).user?.username || 'unknown'}`);

            res.json({
                success: true,
                data: category,
                message: 'Category moved successfully'
            });

        } catch (error) {
            logger.error('Move category error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Удалить категорию
// Удалить категорию
    async deleteCategory(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { moveProductsTo, force } = req.query;

            const result = await categoriesService.deleteCategory(id, {
                moveProductsTo: moveProductsTo ? String(moveProductsTo) : undefined,
                force: force === 'true'
            });

            logger.info(`Category deleted: ${id} by ${(req as any).user?.username || 'unknown'}`);

            res.json({
                success: true,
                message: result.message || 'Category deleted successfully'
            });

        } catch (error) {
            logger.error('Delete category error:', error);

            if (error instanceof ApiError) {
                // ИСПРАВЛЕНИЕ: используем error.statusCode вместо 500
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            // Только если это не ApiError, возвращаем 500
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

}

export const categoriesController = new CategoriesController();