// api/src/services/navigation.service.js
import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

class NavigationService {
    // Получить все элементы навигации
    async getNavigationItems(filters = {}) {
        try {
            const where = {};

            if (filters.parentId !== undefined) {
                where.parentId = filters.parentId;
            }
            if (filters.type) {
                where.type = filters.type;
            }
            if (filters.isActive !== undefined) {
                where.isActive = filters.isActive;
            }

            const items = await prisma.navigationItem.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: { children: true }
                    }
                },
                orderBy: { sortOrder: 'asc' }
            });

            return items.map(this.formatNavigationItem);
        } catch (error) {
            logger.error('Error getting navigation items:', error);
            throw new ApiError(500, 'Failed to get navigation items');
        }
    }

    // Получить дерево навигации
    async getNavigationTree() {
        try {
            const items = await prisma.navigationItem.findMany({
                where: {
                    parentId: null,
                    isActive: true
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    },
                    children: {
                        where: { isActive: true },
                        orderBy: { sortOrder: 'asc' },
                        include: {
                            category: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true
                                }
                            },
                            children: {
                                where: { isActive: true },
                                orderBy: { sortOrder: 'asc' },
                                include: {
                                    category: {
                                        select: {
                                            id: true,
                                            name: true,
                                            slug: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { sortOrder: 'asc' }
            });

            return items.map(this.formatNavigationItem);
        } catch (error) {
            logger.error('Error getting navigation tree:', error);
            throw new ApiError(500, 'Failed to get navigation tree');
        }
    }

    // Получить один элемент
    async getNavigationItemById(id) {
        try {
            const item = await prisma.navigationItem.findUnique({
                where: { id },
                include: {
                    category: true,
                    parent: true,
                    children: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });

            if (!item) {
                throw new ApiError(404, 'Navigation item not found');
            }

            return this.formatNavigationItem(item);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            logger.error('Error getting navigation item:', error);
            throw new ApiError(500, 'Failed to get navigation item');
        }
    }

    // Создать элемент навигации
    async createNavigationItem(data) {
        try {
            // Получаем максимальный sortOrder для нового элемента
            const maxOrder = await prisma.navigationItem.findFirst({
                where: { parentId: data.parentId || null },
                orderBy: { sortOrder: 'desc' },
                select: { sortOrder: true }
            });

            const item = await prisma.navigationItem.create({
                data: {
                    name: data.name,
                    url: data.url || null,
                    type: data.type || 'LINK',
                    categoryId: data.categoryId || null,
                    parentId: data.parentId || null,
                    sortOrder: data.sortOrder ?? (maxOrder ? maxOrder.sortOrder + 1 : 0),
                    isActive: data.isActive ?? true,
                    openInNew: data.openInNew ?? false,
                    icon: data.icon || null
                },
                include: {
                    category: true,
                    parent: true
                }
            });

            return this.formatNavigationItem(item);
        } catch (error) {
            logger.error('Error creating navigation item:', error);
            throw new ApiError(500, 'Failed to create navigation item');
        }
    }

    // Обновить элемент
    async updateNavigationItem(id, data) {
        try {
            const existing = await prisma.navigationItem.findUnique({
                where: { id }
            });

            if (!existing) {
                throw new ApiError(404, 'Navigation item not found');
            }

            const updateData = {};
            if (data.name !== undefined) updateData.name = data.name;
            if (data.url !== undefined) updateData.url = data.url;
            if (data.type !== undefined) updateData.type = data.type;
            if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
            if (data.parentId !== undefined) updateData.parentId = data.parentId;
            if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
            if (data.isActive !== undefined) updateData.isActive = data.isActive;
            if (data.openInNew !== undefined) updateData.openInNew = data.openInNew;
            if (data.icon !== undefined) updateData.icon = data.icon;

            const item = await prisma.navigationItem.update({
                where: { id },
                data: updateData,
                include: {
                    category: true,
                    parent: true,
                    children: {
                        orderBy: { sortOrder: 'asc' }
                    }
                }
            });

            return this.formatNavigationItem(item);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            logger.error('Error updating navigation item:', error);
            throw new ApiError(500, 'Failed to update navigation item');
        }
    }

    // Изменить порядок элементов
    async reorderNavigationItems(items) {
        try {
            await prisma.$transaction(
                items.map(item =>
                    prisma.navigationItem.update({
                        where: { id: item.id },
                        data: { sortOrder: item.sortOrder }
                    })
                )
            );

            return { success: true };
        } catch (error) {
            logger.error('Error reordering navigation items:', error);
            throw new ApiError(500, 'Failed to reorder navigation items');
        }
    }

    // Удалить элемент
    async deleteNavigationItem(id) {
        try {
            const item = await prisma.navigationItem.findUnique({
                where: { id },
                include: {
                    children: true
                }
            });

            if (!item) {
                throw new ApiError(404, 'Navigation item not found');
            }

            if (item.children.length > 0) {
                throw new ApiError(400, 'Cannot delete navigation item with children');
            }

            await prisma.navigationItem.delete({
                where: { id }
            });

            return { success: true, message: 'Navigation item deleted' };
        } catch (error) {
            if (error instanceof ApiError) throw error;
            logger.error('Error deleting navigation item:', error);
            throw new ApiError(500, 'Failed to delete navigation item');
        }
    }

    // Форматирование элемента навигации
    formatNavigationItem = (item) => {
        return {
            id: item.id,
            name: item.name,
            url: item.url,
            type: item.type.toLowerCase(),
            categoryId: item.categoryId,
            parentId: item.parentId,
            sortOrder: item.sortOrder,
            isActive: item.isActive,
            openInNew: item.openInNew,
            icon: item.icon,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            category: item.category,
            parent: item.parent,
            children: item.children?.map((child) => this.formatNavigationItem(child)),
            childrenCount: item._count?.children || 0
        };
    }
}

export const navigationService = new NavigationService();