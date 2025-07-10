import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { hashPassword } from '@/utils/helpers';
import { logger } from '@/utils/logger';

const prisma = new PrismaClient();

// Роли и их разрешения
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        'admin.full_access',
        'users.create', 'users.edit', 'users.delete', 'users.view',
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit', 'reviews.delete',
        'website.banners', 'website.pages', 'website.settings', 'website.navigation',
        'analytics.view', 'logs.view', 'api_keys.manage',
        'customers.view', 'customers.edit', 'customers.delete',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'files.upload', 'files.delete'
    ],
    ADMINISTRATOR: [
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'users.create', 'users.edit', 'users.view',
        'website.banners', 'website.pages', 'website.navigation',
        'analytics.view', 'customers.view', 'customers.edit',
        'orders.view', 'orders.edit', 'reviews.view', 'reviews.edit'
    ],
    MANAGER: [
        'orders.view', 'orders.edit', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit',
        'customers.view', 'customers.edit',
        'products.view', 'analytics.basic'
    ],
    CRM_MANAGER: [
        'customers.view', 'customers.edit',
        'promotions.create', 'promotions.edit', 'promotions.view',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'orders.view', 'callbacks.view', 'callbacks.edit'
    ]
};

export class AdminUsersController {
    // Получить список всех администраторов
    async getUsers(req: AuthenticatedRequest, res: Response) {
        try {
            const { page = 1, limit = 10, search, role, active } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const offset = (pageNum - 1) * limitNum;

            // Строим фильтры
            const where: any = {};

            if (search) {
                where.OR = [
                    { username: { contains: search as string, mode: 'insensitive' } },
                    { email: { contains: search as string, mode: 'insensitive' } },
                    { fullName: { contains: search as string, mode: 'insensitive' } }
                ];
            }

            if (role) {
                where.role = role;
            }

            if (active !== undefined) {
                where.isActive = active === 'true';
            }

            // Получаем пользователей
            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    skip: offset,
                    take: limitNum,
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        fullName: true,
                        role: true,
                        permissions: true,
                        isActive: true,
                        twoFactorEnabled: true,
                        lastLogin: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    orderBy: { createdAt: 'desc' }
                }),
                prisma.user.count({ where })
            ]);

            res.json({
                success: true,
                data: users,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });

        } catch (error) {
            logger.error('Get admin users error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить конкретного администратора
    async getUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    twoFactorEnabled: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            logger.error('Get admin user error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Создать нового администратора
    async createUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { username, email, password, fullName, role, customPermissions, isActive = true } = req.body;

            // Валидация обязательных полей
            if (!username || !email || !password || !fullName || !role) {
                return res.status(400).json({
                    success: false,
                    error: 'Missing required fields',
                    required: ['username', 'email', 'password', 'fullName', 'role']
                });
            }

            // Проверка роли
            if (!ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid role',
                    availableRoles: Object.keys(ROLE_PERMISSIONS)
                });
            }

            // Проверка уникальности
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email }
                    ]
                }
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    error: 'User already exists',
                    field: existingUser.username === username ? 'username' : 'email'
                });
            }

            // Хешируем пароль
            const passwordHash = await hashPassword(password);

            // Определяем разрешения
            let permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
            if (customPermissions && Array.isArray(customPermissions)) {
                permissions = [...new Set([...permissions, ...customPermissions])];
            }

            // Создаем пользователя
            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    passwordHash,
                    fullName,
                    role,
                    permissions,
                    isActive: isActive ?? true
                },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    createdAt: true
                }
            });

            logger.info(`Admin user created: ${username} by ${req.user?.username}`);

            res.status(201).json({
                success: true,
                data: user,
                message: 'User created successfully'
            });

        } catch (error) {
            logger.error('Create admin user error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Обновить администратора
    async updateUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Проверяем существование пользователя
            const existingUser = await prisma.user.findUnique({
                where: { id }
            });

            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Не позволяем обновлять пароль через этот endpoint
            delete updateData.password;
            delete updateData.passwordHash;

            // Если обновляется email или username, проверяем уникальность
            if (updateData.email || updateData.username) {
                const conflictingUser = await prisma.user.findFirst({
                    where: {
                        AND: [
                            { id: { not: id } },
                            {
                                OR: [
                                    ...(updateData.username ? [{ username: updateData.username }] : []),
                                    ...(updateData.email ? [{ email: updateData.email }] : [])
                                ]
                            }
                        ]
                    }
                });

                if (conflictingUser) {
                    return res.status(400).json({
                        success: false,
                        error: 'Username or email already exists',
                        field: conflictingUser.username === updateData.username ? 'username' : 'email'
                    });
                }
            }

            // Если обновляется роль, обновляем разрешения
            if (updateData.role) {
                if (!ROLE_PERMISSIONS[updateData.role as keyof typeof ROLE_PERMISSIONS]) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid role',
                        availableRoles: Object.keys(ROLE_PERMISSIONS)
                    });
                }

                // Обновляем разрешения согласно роли
                let permissions = ROLE_PERMISSIONS[updateData.role as keyof typeof ROLE_PERMISSIONS];
                if (updateData.customPermissions && Array.isArray(updateData.customPermissions)) {
                    permissions = [...new Set([...permissions, ...updateData.customPermissions])];
                }
                updateData.permissions = permissions;
            }

            // Если есть кастомные разрешения без изменения роли
            if (updateData.customPermissions && !updateData.role) {
                const currentPermissions = ROLE_PERMISSIONS[existingUser.role as keyof typeof ROLE_PERMISSIONS];
                updateData.permissions = [...new Set([...currentPermissions, ...updateData.customPermissions])];
            }

            // Удаляем поле customPermissions из updateData
            delete updateData.customPermissions;

            // Обновляем пользователя
            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateData,
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    twoFactorEnabled: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            logger.info(`Admin user updated: ${updatedUser.username} by ${req.user?.username}`);

            res.json({
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            });

        } catch (error) {
            logger.error('Update admin user error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Удалить администратора
    async deleteUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            // Проверяем существование пользователя
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Не позволяем удалить самого себя
            if (id === req.user?.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot delete yourself'
                });
            }

            // Удаляем пользователя
            await prisma.user.delete({
                where: { id }
            });

            logger.info(`Admin user deleted: ${user.username} by ${req.user?.username}`);

            res.json({
                success: true,
                message: 'User deleted successfully'
            });

        } catch (error) {
            logger.error('Delete admin user error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Сменить пароль пользователя
    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'Password must be at least 6 characters long'
                });
            }

            // Проверяем существование пользователя
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Хешируем новый пароль
            const passwordHash = await hashPassword(newPassword);

            // Обновляем пароль
            await prisma.user.update({
                where: { id },
                data: { passwordHash }
            });

            logger.info(`Password changed for user: ${user.username} by ${req.user?.username}`);

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            logger.error('Change password error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Переключить статус активности пользователя
    async toggleActiveStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            // Проверяем существование пользователя
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

            // Не позволяем деактивировать самого себя
            if (id === req.user?.id) {
                return res.status(400).json({
                    success: false,
                    error: 'Cannot change your own status'
                });
            }

            // Переключаем статус
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { isActive: !user.isActive },
                select: {
                    id: true,
                    username: true,
                    isActive: true
                }
            });

            logger.info(`User status toggled: ${user.username} -> ${updatedUser.isActive ? 'active' : 'inactive'} by ${req.user?.username}`);

            res.json({
                success: true,
                data: updatedUser,
                message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`
            });

        } catch (error) {
            logger.error('Toggle user status error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить доступные роли и разрешения
    async getRolesAndPermissions(req: Request, res: Response) {
        try {
            const rolesInfo = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
                role,
                label: this.getRoleLabel(role),
                permissions,
                permissionsCount: permissions.length
            }));

            res.json({
                success: true,
                data: {
                    roles: rolesInfo,
                    allPermissions: Object.values(ROLE_PERMISSIONS).flat().filter((v, i, arr) => arr.indexOf(v) === i)
                }
            });

        } catch (error) {
            logger.error('Get roles and permissions error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Вспомогательная функция для получения названия роли
    private getRoleLabel(role: string): string {
        const roleLabels: Record<string, string> = {
            'SUPER_ADMIN': 'Супер Администратор',
            'ADMINISTRATOR': 'Администратор',
            'MANAGER': 'Менеджер',
            'CRM_MANAGER': 'CRM Менеджер'
        };

        return roleLabels[role] || role;
    }
}

export const adminUsersController = new AdminUsersController();