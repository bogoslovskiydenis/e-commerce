import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';
import { Category, CategoryCreateData, CategoryUpdateData } from '../types/product.types';

export interface CategoryFilters {
    active?: boolean;
    parentId?: string;
}

export class CategoriesService {
    // Получить все категории с фильтрацией
    async getCategories(filters: CategoryFilters = {}): Promise<Category[]> {
        try {
            const where: any = {};

            if (filters.active !== undefined) {
                where.active = filters.active;
            }

            if (filters.parentId !== undefined) {
                where.parentId = filters.parentId;
            }

            const categories = await prisma.category.findMany({
                where,
                orderBy: [
                    { order: 'asc' },
                    { name: 'asc' }
                ],
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return categories.map(this.formatCategory);
        } catch (error) {
            logger.error('Error getting categories:', error);
            throw new ApiError(500, 'Failed to get categories');
        }
    }

    // Получить дерево категорий
    async getCategoriesTree(activeOnly: boolean = true): Promise<Category[]> {
        try {
            const where: any = { parentId: null };
            if (activeOnly) {
                where.active = true;
            }

            const rootCategories = await prisma.category.findMany({
                where,
                orderBy: [
                    { order: 'asc' },
                    { name: 'asc' }
                ],
                include: {
                    children: {
                        where: activeOnly ? { active: true } : {},
                        orderBy: [
                            { order: 'asc' },
                            { name: 'asc' }
                        ],
                        include: {
                            _count: {
                                select: {
                                    products: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            return rootCategories.map(category => ({
                ...this.formatCategory(category),
                children: category.children?.map(this.formatCategory) || []
            }));
        } catch (error) {
            logger.error('Error getting categories tree:', error);
            throw new ApiError(500, 'Failed to get categories tree');
        }
    }

    // Получить категорию по ID
    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { active: true },
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            image: true
                        },
                        orderBy: [
                            { order: 'asc' },
                            { name: 'asc' }
                        ]
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            return category ? this.formatCategory(category) : null;
        } catch (error) {
            logger.error(`Error getting category ${id}:`, error);
            throw new ApiError(500, 'Failed to get category');
        }
    }

    // Получить категорию по slug
    async getCategoryBySlug(slug: string): Promise<Category | null> {
        try {
            const category = await prisma.category.findUnique({
                where: { slug },
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { active: true },
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            image: true
                        },
                        orderBy: [
                            { order: 'asc' },
                            { name: 'asc' }
                        ]
                    },
                    _count: {
                        select: {
                            products: true
                        }
                    }
                }
            });

            return category ? this.formatCategory(category) : null;
        } catch (error) {
            logger.error(`Error getting category by slug ${slug}:`, error);
            throw new ApiError(500, 'Failed to get category');
        }
    }

    // Создать новую категорию
    async createCategory(data: CategoryCreateData): Promise<Category> {
        try {
            // Проверяем уникальность slug
            const existingCategory = await prisma.category.findUnique({
                where: { slug: data.slug }
            });

            if (existingCategory) {
                throw new ApiError(400, 'Category with this slug already exists');
            }

            // Если указан родитель, проверяем его существование
            if (data.parentId) {
                const parent = await prisma.category.findUnique({
                    where: { id: data.parentId }
                });

                if (!parent) {
                    throw new ApiError(400, 'Parent category not found');
                }
            }

            // Если порядок не указан, ставим в конец
            if (data.order === undefined) {
                const lastCategory = await prisma.category.findFirst({
                    where: { parentId: data.parentId || null },
                    orderBy: { order: 'desc' }
                });
                data.order = (lastCategory?.order || 0) + 1;
            }

            const category = await prisma.category.create({
                data: {
                    ...data,
                    active: data.active ?? true
                },
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return this.formatCategory(category);
        } catch (error) {
            logger.error('Error creating category:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to create category');
        }
    }

    // Обновить категорию
    async updateCategory(id: string, data: CategoryUpdateData): Promise<Category> {
        try {
            // Проверяем существование категории
            const existingCategory = await prisma.category.findUnique({
                where: { id }
            });

            if (!existingCategory) {
                throw new ApiError(404, 'Category not found');
            }

            // Проверяем уникальность slug, если он изменяется
            if (data.slug && data.slug !== existingCategory.slug) {
                const categoryWithSlug = await prisma.category.findUnique({
                    where: { slug: data.slug }
                });

                if (categoryWithSlug) {
                    throw new ApiError(400, 'Category with this slug already exists');
                }
            }

            // Если меняется родитель, проверяем его существование
            if (data.parentId && data.parentId !== existingCategory.parentId) {
                const parent = await prisma.category.findUnique({
                    where: { id: data.parentId }
                });

                if (!parent) {
                    throw new ApiError(400, 'Parent category not found');
                }

                // Проверяем, что категория не становится родителем самой себе
                if (data.parentId === id) {
                    throw new ApiError(400, 'Category cannot be parent of itself');
                }
            }

            const category = await prisma.category.update({
                where: { id },
                data,
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return this.formatCategory(category);
        } catch (error) {
            logger.error(`Error updating category ${id}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to update category');
        }
    }

    // Удалить категорию
    async deleteCategory(id: string): Promise<void> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    children: true,
                    products: true
                }
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            // Проверяем, есть ли дочерние категории
            if (category.children && category.children.length > 0) {
                throw new ApiError(400, 'Cannot delete category with subcategories');
            }

            // Проверяем, есть ли товары в категории
            if (category.products && category.products.length > 0) {
                throw new ApiError(400, 'Cannot delete category with products');
            }

            await prisma.category.delete({
                where: { id }
            });
        } catch (error) {
            logger.error(`Error deleting category ${id}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to delete category');
        }
    }

    // Обновить порядок категорий
    async reorderCategories(categories: Array<{ id: string; order: number }>): Promise<Category[]> {
        try {
            const updatePromises = categories.map(async (categoryData) => {
                return await prisma.category.update({
                    where: { id: categoryData.id },
                    data: { order: categoryData.order }
                });
            });

            await Promise.all(updatePromises);

            // Возвращаем обновленные категории
            const updatedCategories = await prisma.category.findMany({
                where: {
                    id: { in: categories.map(c => c.id) }
                },
                orderBy: { order: 'asc' },
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return updatedCategories.map(this.formatCategory);
        } catch (error) {
            logger.error('Error reordering categories:', error);
            throw new ApiError(500, 'Failed to reorder categories');
        }
    }

    // Получить статистику категорий
    async getCategoriesStats() {
        try {
            const [
                total,
                active,
                withProducts,
                rootCategories
            ] = await Promise.all([
                prisma.category.count(),
                prisma.category.count({ where: { active: true } }),
                prisma.category.count({
                    where: {
                        products: {
                            some: {}
                        }
                    }
                }),
                prisma.category.count({ where: { parentId: null } })
            ]);

            return {
                total,
                active,
                inactive: total - active,
                withProducts,
                withoutProducts: total - withProducts,
                rootCategories
            };
        } catch (error) {
            logger.error('Error getting categories stats:', error);
            throw new ApiError(500, 'Failed to get categories stats');
        }
    }

    // Получить популярные категории (по количеству товаров)
    async getPopularCategories(limit: number = 10): Promise<Category[]> {
        try {
            const categories = await prisma.category.findMany({
                where: { active: true },
                take: limit,
                orderBy: {
                    products: {
                        _count: 'desc'
                    }
                },
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return categories.map(this.formatCategory);
        } catch (error) {
            logger.error('Error getting popular categories:', error);
            throw new ApiError(500, 'Failed to get popular categories');
        }
    }

    // Переместить категорию в другого родителя
    async moveCategory(categoryId: string, newParentId: string | null): Promise<Category> {
        try {
            const category = await prisma.category.findUnique({
                where: { id: categoryId }
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            // Проверяем нового родителя если указан
            if (newParentId) {
                const newParent = await prisma.category.findUnique({
                    where: { id: newParentId }
                });

                if (!newParent) {
                    throw new ApiError(400, 'New parent category not found');
                }

                // Проверяем, что категория не становится родителем самой себе
                if (newParentId === categoryId) {
                    throw new ApiError(400, 'Category cannot be parent of itself');
                }

                // Проверяем циклические зависимости
                const isDescendant = await this.isDescendant(categoryId, newParentId);
                if (isDescendant) {
                    throw new ApiError(400, 'Cannot move category to its descendant');
                }
            }

            // Получаем новый порядок
            const lastCategory = await prisma.category.findFirst({
                where: { parentId: newParentId },
                orderBy: { order: 'desc' }
            });

            const newOrder = (lastCategory?.order || 0) + 1;

            const updatedCategory = await prisma.category.update({
                where: { id: categoryId },
                data: {
                    parentId: newParentId,
                    order: newOrder
                },
                include: {
                    _count: {
                        select: {
                            products: true,
                            children: true
                        }
                    }
                }
            });

            return this.formatCategory(updatedCategory);
        } catch (error) {
            logger.error(`Error moving category ${categoryId}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to move category');
        }
    }

    // Проверка, является ли категория потомком другой категории
    private async isDescendant(ancestorId: string, descendantId: string): Promise<boolean> {
        try {
            const descendant = await prisma.category.findUnique({
                where: { id: descendantId },
                select: { parentId: true }
            });

            if (!descendant || !descendant.parentId) {
                return false;
            }

            if (descendant.parentId === ancestorId) {
                return true;
            }

            return await this.isDescendant(ancestorId, descendant.parentId);
        } catch (error) {
            logger.error('Error checking descendant relationship:', error);
            return false;
        }
    }

    // Получить путь категории (breadcrumbs)
    async getCategoryPath(categoryId: string): Promise<Category[]> {
        try {
            const path: Category[] = [];
            let currentId: string | null = categoryId;

            while (currentId) {
                const category = await prisma.category.findUnique({
                    where: { id: currentId },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        parentId: true,
                        image: true,
                        active: true,
                        order: true,
                        description: true,
                        createdAt: true,
                        updatedAt: true
                    }
                });

                if (!category) break;

                path.unshift({
                    id: category.id,
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    parentId: category.parentId,
                    image: category.image,
                    active: category.active,
                    order: category.order,
                    createdAt: category.createdAt.toISOString(),
                    updatedAt: category.updatedAt.toISOString()
                });

                currentId = category.parentId;
            }

            return path;
        } catch (error) {
            logger.error(`Error getting category path for ${categoryId}:`, error);
            throw new ApiError(500, 'Failed to get category path');
        }
    }

    // Форматирование категории для API
    private formatCategory = (category: any): Category => {
        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            parentId: category.parentId,
            image: category.image,
            active: category.active,
            order: category.order,
            createdAt: category.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: category.updatedAt?.toISOString() || new Date().toISOString(),
            // Дополнительные поля
            productsCount: category._count?.products || 0,
            childrenCount: category._count?.children || 0,
            parent: category.parent ? {
                id: category.parent.id,
                name: category.parent.name,
                slug: category.parent.slug
            } : undefined,
            children: category.children || []
        };
    };
}