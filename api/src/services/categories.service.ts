import { prisma } from '../config/database';
import { ApiError } from '../utils/apiError';
import { logger } from '../utils/logger';

export interface CategoryFilters {
    active?: boolean;
    parentId?: string;
    search?: string;
    type?: string;
}

export interface GetCategoriesParams {
    page?: number;
    limit?: number;
    filters?: CategoryFilters;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetCategoriesResult {
    categories: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class CategoriesService {
    // Получить все категории с фильтрацией
    async getCategories(params: GetCategoriesParams): Promise<GetCategoriesResult> {
        try {
            const {
                page = 1,
                limit = 50,
                filters = {},
                sortBy = 'sortOrder',
                sortOrder = 'asc'
            } = params;

            const skip = (page - 1) * limit;

            // Построение условий фильтрации
            const where: any = {};

            if (filters.active !== undefined) {
                where.isActive = filters.active;
            }

            if (filters.parentId !== undefined) {
                where.parentId = filters.parentId;
            }

            if (filters.search) {
                where.OR = [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } }
                ];
            }

            if (filters.type) {
                where.type = filters.type;
            }

            // Построение сортировки
            const orderBy: any = {};

            // Маппинг полей для сортировки
            const sortFieldMap: Record<string, string> = {
                'order': 'sortOrder',
                'active': 'isActive',
                'name': 'name',
                'slug': 'slug',
                'createdAt': 'createdAt',
                'updatedAt': 'updatedAt',
                'id': 'id'
            };

            const actualSortField = sortFieldMap[sortBy] || 'sortOrder';
            orderBy[actualSortField] = sortOrder;

            const [categories, total] = await Promise.all([
                prisma.category.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        parent: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        },
                        children: {
                            where: { isActive: true },
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                imageUrl: true
                            },
                            orderBy: [
                                { sortOrder: 'asc' },
                                { name: 'asc' }
                            ]
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

            return {
                categories: categories.map(this.formatCategory),
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            };

        } catch (error) {
            logger.error('Error getting categories:', error);
            throw new ApiError(500, 'Failed to get categories');
        }
    }

    // Получить дерево категорий
    async getCategoriesTree(activeOnly: boolean = true): Promise<any[]> {
        try {
            const where: any = { parentId: null };
            if (activeOnly) {
                where.isActive = true; // ИСПРАВЛЕНО
            }

            const rootCategories = await prisma.category.findMany({
                where,
                orderBy: [
                    { sortOrder: 'asc' }, // ИСПРАВЛЕНО
                    { name: 'asc' }
                ],
                include: {
                    children: {
                        where: activeOnly ? { isActive: true } : {}, // ИСПРАВЛЕНО
                        orderBy: [
                            { sortOrder: 'asc' }, // ИСПРАВЛЕНО
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
    async getCategoryById(id: string): Promise<any | null> {
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
                        where: { isActive: true }, // ИСПРАВЛЕНО
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            imageUrl: true
                        },
                        orderBy: [
                            { sortOrder: 'asc' }, // ИСПРАВЛЕНО
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
    async getCategoryBySlug(slug: string): Promise<any | null> {
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
                        where: { isActive: true }, // ИСПРАВЛЕНО
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            imageUrl: true
                        },
                        orderBy: [
                            { sortOrder: 'asc' }, // ИСПРАВЛЕНО
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
    async createCategory(data: any): Promise<any> {
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
            if (data.sortOrder === undefined) {
                const lastCategory = await prisma.category.findFirst({
                    where: { parentId: data.parentId || null },
                    orderBy: { sortOrder: 'desc' }
                });
                data.sortOrder = (lastCategory?.sortOrder || 0) + 1;
            }

            // ИСПРАВЛЕНИЕ: Маппинг типов в правильный enum формат
            const mapCategoryType = (type: string): string => {
                const typeMapping: Record<string, string> = {
                    'products': 'PRODUCTS',
                    'balloons': 'BALLOONS',
                    'gifts': 'GIFTS',
                    'events': 'EVENTS',
                    'colors': 'COLORS',
                    'materials': 'MATERIALS',
                    'occasions': 'OCCASIONS'
                };

                return typeMapping[type.toLowerCase()] || 'PRODUCTS';
            };

            // Очищаем и подготавливаем данные для Prisma
            const createData: any = {
                name: data.name,
                slug: data.slug,
                type: mapCategoryType(data.type || 'products'), // ИСПРАВЛЕНО: правильный маппинг
                sortOrder: data.sortOrder,
                isActive: true,
                showInNavigation: data.showInNavigation !== false,
            };

            // Добавляем опциональные поля только если они определены
            if (data.description !== undefined) createData.description = data.description;
            if (data.parentId !== undefined) createData.parentId = data.parentId;
            if (data.imageUrl !== undefined) createData.imageUrl = data.imageUrl;
            if (data.bannerUrl !== undefined) createData.bannerUrl = data.bannerUrl;
            if (data.metaTitle !== undefined) createData.metaTitle = data.metaTitle;
            if (data.metaDescription !== undefined) createData.metaDescription = data.metaDescription;
            if (data.metaKeywords !== undefined) createData.metaKeywords = data.metaKeywords;
            if (data.filters !== undefined) createData.filters = data.filters;

            console.log('🔍 Creating category with data:', JSON.stringify(createData, null, 2));

            const category = await prisma.category.create({
                data: createData,
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { isActive: true },
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            imageUrl: true
                        },
                        orderBy: [
                            { sortOrder: 'asc' },
                            { name: 'asc' }
                        ]
                    },
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
    async updateCategory(id: string, data: any): Promise<any> {
        try {
            // Проверяем существование категории
            const existingCategory = await prisma.category.findUnique({
                where: { id }
            });

            if (!existingCategory) {
                throw new ApiError(404, 'Category not found');
            }

            // Маппинг полей
            const updateData: any = { ...data };
            if (updateData.active !== undefined) {
                updateData.isActive = updateData.active; // ИСПРАВЛЕНО
                delete updateData.active;
            }

            const category = await prisma.category.update({
                where: { id },
                data: updateData,
                include: {
                    parent: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { isActive: true }, // ИСПРАВЛЕНО
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            imageUrl: true
                        },
                        orderBy: [
                            { sortOrder: 'asc' }, // ИСПРАВЛЕНО
                            { name: 'asc' }
                        ]
                    },
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
            logger.error('Error updating category:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to update category');
        }
    }

    // Переключить статус активности
    async toggleCategoryStatus(id: string): Promise<any> {
        try {
            const category = await prisma.category.findUnique({
                where: { id }
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            const updatedCategory = await prisma.category.update({
                where: { id },
                data: {
                    isActive: !category.isActive // ИСПРАВЛЕНО
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
            logger.error('Error toggling category status:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to toggle category status');
        }
    }

    // Удалить категорию
    async deleteCategory(id: string, options: { moveProductsTo?: string } = {}): Promise<{ success: boolean; error?: string }> {
        try {
            const category = await prisma.category.findUnique({
                where: { id },
                include: {
                    products: true,
                    children: true
                }
            });

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            // Проверяем есть ли дочерние категории
            if (category.children.length > 0) {
                throw new ApiError(400, 'Cannot delete category with subcategories');
            }

            // Если есть товары, перемещаем их в другую категорию или ошибка
            if (category.products.length > 0) {
                if (options.moveProductsTo) {
                    await prisma.product.updateMany({
                        where: { categoryId: id },
                        data: { categoryId: options.moveProductsTo }
                    });
                } else {
                    throw new ApiError(400, 'Cannot delete category with products. Specify moveProductsTo parameter.');
                }
            }

            await prisma.category.delete({
                where: { id }
            });

            return { success: true };
        } catch (error) {
            logger.error('Error deleting category:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            return { success: false, error: 'Failed to delete category' };
        }
    }

    // Получить навигационные категории
    async getNavigationCategories(): Promise<any[]> {
        try {
            const categories = await prisma.category.findMany({
                where: {
                    isActive: true, // ИСПРАВЛЕНО
                    showInNavigation: true
                },
                orderBy: [
                    { sortOrder: 'asc' }, // ИСПРАВЛЕНО
                    { name: 'asc' }
                ],
                include: {
                    children: {
                        where: {
                            isActive: true, // ИСПРАВЛЕНО
                            showInNavigation: true
                        },
                        orderBy: [
                            { sortOrder: 'asc' }, // ИСПРАВЛЕНО
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

            return categories.map(this.formatCategory);
        } catch (error) {
            logger.error('Error getting navigation categories:', error);
            throw new ApiError(500, 'Failed to get navigation categories');
        }
    }

    // Форматирование категории
    private formatCategory = (category: any) => {
        // Маппинг типов из enum в нижний регистр для UI
        const mapCategoryTypeToUI = (type: string): string => {
            const typeMapping: Record<string, string> = {
                'PRODUCTS': 'products',
                'BALLOONS': 'balloons',
                'GIFTS': 'gifts',
                'EVENTS': 'events',
                'COLORS': 'colors',
                'MATERIALS': 'materials',
                'OCCASIONS': 'occasions'
            };

            return typeMapping[type] || 'products';
        };

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description,
            type: mapCategoryTypeToUI(category.type), // ИСПРАВЛЕНО: маппинг для UI
            parentId: category.parentId,
            imageUrl: category.imageUrl,
            bannerUrl: category.bannerUrl,
            active: category.isActive, // маппинг isActive -> active
            showInNavigation: category.showInNavigation,
            order: category.sortOrder, // маппинг sortOrder -> order
            metaTitle: category.metaTitle,
            metaDescription: category.metaDescription,
            metaKeywords: category.metaKeywords,
            filters: category.filters,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
            parent: category.parent,
            children: category.children?.map(this.formatCategory),
            productsCount: category._count?.products || 0,
            childrenCount: category._count?.children || 0
        };
    };
}

export const categoriesService = new CategoriesService();