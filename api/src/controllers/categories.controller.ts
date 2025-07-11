import { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export class CategoriesController {
    // Получить список категорий
    async getCategories(req: AuthenticatedRequest, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 25;
            const sortBy = req.query.sortBy as string || 'createdAt';
            const sortOrder = req.query.sortOrder as string || 'desc';
            const search = req.query.search as string;

            const skip = (page - 1) * limit;

            console.log('📂 Получение списка категорий из БД', { page, limit, sortBy, sortOrder, search });

            // Строим условие поиска
            const where: any = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ];
            }

            // Получаем категории с подсчетом товаров
            const [categories, totalCount] = await Promise.all([
                prisma.category.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        [sortBy]: sortOrder
                    },
                    include: {
                        parent: {
                            select: { id: true, name: true }
                        },
                        _count: {
                            select: {
                                products: true,
                                children: true
                            }
                        }
                    }
                }),
                prisma.category.count({ where })
            ]);

            res.json({
                success: true,
                data: categories,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            });

        } catch (error) {
            console.error('❌ Ошибка получения категорий:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить категорию по ID
    async getCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log('📂 Получение категории по ID:', id);

            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    parent: {
                        select: { id: true, name: true, slug: true }
                    },
                    children: {
                        select: { id: true, name: true, slug: true, isActive: true }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

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
            console.error('❌ Ошибка получения категории:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Создать новую категорию
    async createCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { name, description, slug, parentId, isActive = true, sortOrder = 0, metaTitle, metaDescription } = req.body;

            console.log('📂 Создание новой категории:', { name, description, slug, parentId });

            // Генерируем slug если не передан
            const finalSlug = slug || name.toLowerCase()
                .replace(/[^a-zа-я0-9]/gi, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            // Проверяем уникальность slug
            const existingCategory = await prisma.category.findUnique({
                where: { slug: finalSlug }
            });

            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    error: 'Category with this slug already exists'
                });
            }

            const category = await prisma.category.create({
                data: {
                    name,
                    description,
                    slug: finalSlug,
                    parentId: parentId || null,
                    isActive,
                    sortOrder,
                    metaTitle,
                    metaDescription
                },
                include: {
                    parent: {
                        select: { id: true, name: true }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            console.log('✅ Категория создана:', category.name);

            res.status(201).json({
                success: true,
                data: category
            });

        } catch (error) {
            console.error('❌ Ошибка создания категории:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Обновить категорию
    async updateCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            console.log('📂 Обновление категории:', id, updateData);

            // Если обновляется slug, проверяем уникальность
            if (updateData.slug) {
                const existingCategory = await prisma.category.findFirst({
                    where: {
                        slug: updateData.slug,
                        NOT: { id }
                    }
                });

                if (existingCategory) {
                    return res.status(400).json({
                        success: false,
                        error: 'Category with this slug already exists'
                    });
                }
            }

            const category = await prisma.category.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    parent: {
                        select: { id: true, name: true }
                    },
                    children: {
                        select: { id: true, name: true, slug: true }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            console.log('✅ Категория обновлена:', category.name);

            res.json({
                success: true,
                data: category
            });

        } catch (error) {
            console.error('❌ Ошибка обновления категории:', error);
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Удалить категорию
    async deleteCategory(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            console.log('📂 Удаление категории:', id);

            // Проверяем, есть ли товары в категории
            const productsCount = await prisma.product.count({
                where: { categoryId: id }
            });

            if (productsCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete category with ${productsCount} products. Move or delete products first.`
                });
            }

            // Проверяем, есть ли дочерние категории
            const childrenCount = await prisma.category.count({
                where: { parentId: id }
            });

            if (childrenCount > 0) {
                return res.status(400).json({
                    success: false,
                    error: `Cannot delete category with ${childrenCount} subcategories. Delete subcategories first.`
                });
            }

            const deletedCategory = await prisma.category.delete({
                where: { id }
            });

            console.log('✅ Категория удалена:', deletedCategory.name);

            res.json({
                success: true,
                data: deletedCategory
            });

        } catch (error) {
            console.error('❌ Ошибка удаления категории:', error);
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Category not found'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const categoriesController = new CategoriesController();