import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';

// Все доступные разрешения в системе
export const ALL_PERMISSIONS = [
    // Пользователи
    'users.create', 'users.edit', 'users.delete', 'users.view',

    // Товары
    'products.create', 'products.edit', 'products.delete', 'products.view',
    'products.import', 'products.export',

    // Категории
    'categories.create', 'categories.edit', 'categories.delete', 'categories.view',

    // Заказы
    'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
    'orders.export', 'orders.refund',

    // Клиенты
    'customers.view', 'customers.edit', 'customers.delete', 'customers.export',

    // Отзывы
    'reviews.view', 'reviews.edit', 'reviews.delete', 'reviews.moderate',

    // Обратная связь
    'callbacks.view', 'callbacks.edit', 'callbacks.delete',

    // Сайт и контент
    'website.banners', 'website.pages', 'website.settings', 'website.navigation',

    // Скидки и промокоды
    'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',

    // Аналитика
    'analytics.view', 'analytics.basic', 'analytics.marketing', 'analytics.advanced',

    // Системные
    'logs.view', 'api_keys.manage', 'admin.full_access',

    // Email маркетинг
    'emails.send', 'emails.templates', 'loyalty.manage',

    // Файлы
    'files.upload', 'files.delete', 'files.manage'
];

export const ROLE_PERMISSIONS = {
    SUPER_ADMIN: ALL_PERMISSIONS,
    ADMINISTRATOR: [
        'products.create', 'products.edit', 'products.delete', 'products.view', 'products.import', 'products.export',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'users.create', 'users.edit', 'users.view',
        'website.banners', 'website.pages', 'website.navigation',
        'analytics.view', 'files.upload', 'files.manage'
    ],
    MANAGER: [
        'orders.view', 'orders.edit', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit', 'reviews.moderate',
        'customers.view', 'customers.edit',
        'products.view', 'analytics.basic'
    ],
    CRM_MANAGER: [
        'customers.view', 'customers.edit', 'customers.export',
        'promotions.create', 'promotions.edit', 'promotions.view',
        'emails.send', 'emails.templates', 'loyalty.manage',
        'analytics.marketing'
    ]
};

export class PermissionsController {

    // Получить все доступные разрешения
    async getAllPermissions(req: Request, res: Response) {
        try {
            const permissionsByCategory = {
                users: ALL_PERMISSIONS.filter(p => p.startsWith('users.')),
                products: ALL_PERMISSIONS.filter(p => p.startsWith('products.')),
                categories: ALL_PERMISSIONS.filter(p => p.startsWith('categories.')),
                orders: ALL_PERMISSIONS.filter(p => p.startsWith('orders.')),
                customers: ALL_PERMISSIONS.filter(p => p.startsWith('customers.')),
                reviews: ALL_PERMISSIONS.filter(p => p.startsWith('reviews.')),
                callbacks: ALL_PERMISSIONS.filter(p => p.startsWith('callbacks.')),
                website: ALL_PERMISSIONS.filter(p => p.startsWith('website.')),
                promotions: ALL_PERMISSIONS.filter(p => p.startsWith('promotions.')),
                analytics: ALL_PERMISSIONS.filter(p => p.startsWith('analytics.')),
                system: ALL_PERMISSIONS.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: ALL_PERMISSIONS.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: ALL_PERMISSIONS.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    all: ALL_PERMISSIONS,
                    byCategory: permissionsByCategory,
                    total: ALL_PERMISSIONS.length
                }
            });
        } catch (error) {
            logger.error('Get permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить роли и их разрешения
    async getRoles(req: Request, res: Response) {
        try {
            const rolesWithStats = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
                role,
                permissions,
                permissionsCount: permissions.length,
                hasFullAccess: permissions.includes('admin.full_access')
            }));

            res.json({
                success: true,
                data: {
                    roles: rolesWithStats,
                    total: Object.keys(ROLE_PERMISSIONS).length
                }
            });
        } catch (error) {
            logger.error('Get roles error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить разрешения конкретной роли
    async getRolePermissions(req: Request, res: Response) {
        try {
            const { role } = req.params;
            const roleUpper = role.toUpperCase() as keyof typeof ROLE_PERMISSIONS;

            if (!ROLE_PERMISSIONS[roleUpper]) {
                return res.status(404).json({
                    error: 'Role not found',
                    availableRoles: Object.keys(ROLE_PERMISSIONS)
                });
            }

            const permissions = ROLE_PERMISSIONS[roleUpper];
            const permissionsByCategory = {
                users: permissions.filter(p => p.startsWith('users.')),
                products: permissions.filter(p => p.startsWith('products.')),
                categories: permissions.filter(p => p.startsWith('categories.')),
                orders: permissions.filter(p => p.startsWith('orders.')),
                customers: permissions.filter(p => p.startsWith('customers.')),
                reviews: permissions.filter(p => p.startsWith('reviews.')),
                callbacks: permissions.filter(p => p.startsWith('callbacks.')),
                website: permissions.filter(p => p.startsWith('website.')),
                promotions: permissions.filter(p => p.startsWith('promotions.')),
                analytics: permissions.filter(p => p.startsWith('analytics.')),
                system: permissions.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: permissions.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: permissions.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    role: roleUpper,
                    permissions,
                    permissionsByCategory,
                    total: permissions.length,
                    hasFullAccess: permissions.includes('admin.full_access')
                }
            });
        } catch (error) {
            logger.error('Get role permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить разрешения пользователя
    async getUserPermissions(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    customPermissions: true,
                    isActive: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Получаем базовые разрешения роли
            const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

            // Объединяем с кастомными разрешениями если есть
            const allPermissions = Array.from(new Set([
                ...rolePermissions,
                ...(user.permissions || []),
                ...(user.customPermissions || [])
            ]));

            const permissionsByCategory = {
                users: allPermissions.filter(p => p.startsWith('users.')),
                products: allPermissions.filter(p => p.startsWith('products.')),
                categories: allPermissions.filter(p => p.startsWith('categories.')),
                orders: allPermissions.filter(p => p.startsWith('orders.')),
                customers: allPermissions.filter(p => p.startsWith('customers.')),
                reviews: allPermissions.filter(p => p.startsWith('reviews.')),
                callbacks: allPermissions.filter(p => p.startsWith('callbacks.')),
                website: allPermissions.filter(p => p.startsWith('website.')),
                promotions: allPermissions.filter(p => p.startsWith('promotions.')),
                analytics: allPermissions.filter(p => p.startsWith('analytics.')),
                system: allPermissions.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: allPermissions.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: allPermissions.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        username: user.username,
                        fullName: user.fullName,
                        role: user.role,
                        isActive: user.isActive
                    },
                    rolePermissions,
                    customPermissions: user.customPermissions || [],
                    allPermissions,
                    permissionsByCategory,
                    total: allPermissions.length,
                    hasFullAccess: allPermissions.includes('admin.full_access')
                }
            });
        } catch (error) {
            logger.error('Get user permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Обновить разрешения пользователя
    async updateUserPermissions(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { permissions, customPermissions, role } = req.body;

            // Проверяем что изменяемый пользователь существует
            const targetUser = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    permissions: true,
                    customPermissions: true
                }
            });

            if (!targetUser) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Проверяем права на изменение разрешений
            if (!req.user?.permissions.includes('admin.full_access') &&
                !req.user?.permissions.includes('users.edit')) {
                return res.status(403).json({
                    error: 'Insufficient permissions to modify user permissions'
                });
            }

            // Запрещаем обычным админам изменять суперадминов
            if (targetUser.role === 'SUPER_ADMIN' &&
                !req.user?.permissions.includes('admin.full_access')) {
                return res.status(403).json({
                    error: 'Cannot modify super admin permissions'
                });
            }

            const updateData: any = {};

            if (permissions) {
                // Валидируем что все разрешения существуют
                const invalidPermissions = permissions.filter((p: string) => !ALL_PERMISSIONS.includes(p));
                if (invalidPermissions.length > 0) {
                    return res.status(400).json({
                        error: 'Invalid permissions',
                        invalid: invalidPermissions,
                        valid: ALL_PERMISSIONS
                    });
                }
                updateData.permissions = permissions;
            }

            if (customPermissions) {
                const invalidCustomPermissions = customPermissions.filter((p: string) => !ALL_PERMISSIONS.includes(p));
                if (invalidCustomPermissions.length > 0) {
                    return res.status(400).json({
                        error: 'Invalid custom permissions',
                        invalid: invalidCustomPermissions,
                        valid: ALL_PERMISSIONS
                    });
                }
                updateData.customPermissions = customPermissions;
            }

            if (role && ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
                updateData.role = role;
            } else if (role) {
                return res.status(400).json({
                    error: 'Invalid role',
                    validRoles: Object.keys(ROLE_PERMISSIONS)
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    customPermissions: true,
                    updatedAt: true
                }
            });

            // Логируем изменение прав
            logger.info('User permissions updated', {
                updatedBy: req.user?.username,
                updatedUser: updatedUser.username,
                changes: updateData
            });

            res.json({
                success: true,
                data: updatedUser,
                message: 'User permissions updated successfully'
            });

        } catch (error) {
            logger.error('Update user permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Проверить права пользователя
    async checkPermissions(req: Request, res: Response) {
        try {
            const { userId, permissions } = req.body;

            if (!userId || !permissions || !Array.isArray(permissions)) {
                return res.status(400).json({
                    error: 'userId and permissions array are required'
                });
            }

            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    role: true,
                    permissions: true,
                    customPermissions: true,
                    isActive: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            if (!user.isActive) {
                return res.status(403).json({
                    error: 'User is inactive'
                });
            }

            const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
            const allUserPermissions = Array.from(new Set([
                ...rolePermissions,
                ...(user.permissions || []),
                ...(user.customPermissions || [])
            ]));

            const hasAllPermissions = permissions.every(permission =>
                allUserPermissions.includes(permission) ||
                allUserPermissions.includes('admin.full_access')
            );

            const permissionResults = permissions.map(permission => ({
                permission,
                hasPermission: allUserPermissions.includes(permission) ||
                    allUserPermissions.includes('admin.full_access')
            }));

            res.json({
                success: true,
                data: {
                    userId,
                    username: user.username,
                    role: user.role,
                    isActive: user.isActive,
                    hasAllPermissions,
                    permissions: permissionResults,
                    userPermissions: allUserPermissions,
                    hasFullAccess: allUserPermissions.includes('admin.full_access')
                }
            });

        } catch (error) {
            logger.error('Check permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить мои текущие права
    async getMyPermissions(req: AuthenticatedRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    error: 'Authentication required'
                });
            }

            const rolePermissions = ROLE_PERMISSIONS[req.user.role as keyof typeof ROLE_PERMISSIONS] || [];
            const allPermissions = Array.from(new Set([
                ...rolePermissions,
                ...(req.user.permissions || [])
            ]));

            const permissionsByCategory = {
                users: allPermissions.filter(p => p.startsWith('users.')),
                products: allPermissions.filter(p => p.startsWith('products.')),
                categories: allPermissions.filter(p => p.startsWith('categories.')),
                orders: allPermissions.filter(p => p.startsWith('orders.')),
                customers: allPermissions.filter(p => p.startsWith('customers.')),
                reviews: allPermissions.filter(p => p.startsWith('reviews.')),
                callbacks: allPermissions.filter(p => p.startsWith('callbacks.')),
                website: allPermissions.filter(p => p.startsWith('website.')),
                promotions: allPermissions.filter(p => p.startsWith('promotions.')),
                analytics: allPermissions.filter(p => p.startsWith('analytics.')),
                system: allPermissions.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: allPermissions.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: allPermissions.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    user: {
                        id: req.user.id,
                        username: req.user.username,
                        fullName: req.user.fullName,
                        role: req.user.role
                    },
                    rolePermissions,
                    allPermissions,
                    permissionsByCategory,
                    total: allPermissions.length,
                    hasFullAccess: allPermissions.includes('admin.full_access')
                }
            });

        } catch (error) {
            logger.error('Get my permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Добавить разрешение пользователю
    async addUserPermission(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { permission } = req.body;

            if (!permission || !ALL_PERMISSIONS.includes(permission)) {
                return res.status(400).json({
                    error: 'Invalid permission',
                    validPermissions: ALL_PERMISSIONS
                });
            }

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    customPermissions: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const currentCustomPermissions = user.customPermissions || [];

            if (currentCustomPermissions.includes(permission)) {
                return res.status(400).json({
                    error: 'User already has this permission'
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    customPermissions: [...currentCustomPermissions, permission]
                },
                select: {
                    id: true,
                    username: true,
                    customPermissions: true
                }
            });

            logger.info('Permission added to user', {
                addedBy: req.user?.username,
                user: updatedUser.username,
                permission
            });

            res.json({
                success: true,
                data: updatedUser,
                message: `Permission "${permission}" added to user`
            });

        } catch (error) {
            logger.error('Add user permission error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Удалить разрешение у пользователя
    async removeUserPermission(req: AuthenticatedRequest, res: Response) {
        try {
            const { id, permission } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    customPermissions: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const currentCustomPermissions = user.customPermissions || [];

            if (!currentCustomPermissions.includes(permission)) {
                return res.status(400).json({
                    error: 'User does not have this permission'
                });
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: {
                    customPermissions: currentCustomPermissions.filter(p => p !== permission)
                },
                select: {
                    id: true,
                    username: true,
                    customPermissions: true
                }
            });

            logger.info('Permission removed from user', {
                removedBy: req.user?.username,
                user: updatedUser.username,
                permission
            });

            res.json({
                success: true,
                data: updatedUser,
                message: `Permission "${permission}" removed from user`
            });

        } catch (error) {
            logger.error('Remove user permission error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}