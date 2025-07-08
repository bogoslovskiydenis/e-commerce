import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { hashPassword } from '../utils/helpers';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AdminUsersController {
    // Получить список администраторов
    async getUsers(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 25,
                search,
                role,
                active,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (Number(page) - 1) * Number(limit);

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

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        fullName: true,
                        role: true,
                        permissions: true,
                        isActive: true,
                        twoFactorEnabled: true,
                        avatarUrl: true,
                        lastLogin: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                adminLogs: true
                            }
                        }
                    },
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    skip,
                    take: Number(limit),
                }),
                prisma.user.count({ where })
            ]);

            const usersWithStats = users.map(user => ({
                ...user,
                actionsCount: user._count.adminLogs
            }));

            res.json({
                success: true,
                data: usersWithStats,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Get admin users error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить администратора по ID
    async getUser(req: Request, res: Response) {
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
                    avatarUrl: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                    adminLogs: {
                        take: 20,
                        orderBy: {
                            createdAt: 'desc'
                        },
                        select: {
                            id: true,
                            action: true,
                            resource: true,
                            description: true,
                            createdAt: true
                        }
                    }
                }
            });

            if (!user) {
                return res.status(404).json({
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
                error: 'Internal server error'
            });
        }
    }

    // Создать администратора
    async createUser(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                username,
                email,
                password,
                fullName,
                role,
                permissions,
                isActive
            } = req.body;

            // Проверяем уникальность username и email
            const existingUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email }
                    ]
                }
            });

            if (existingUser) {
                return res.status(409).json({
                    error: 'Username or email already exists'
                });
            }

            const hashedPassword = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    username,
                    email,
                    passwordHash: hashedPassword,
                    fullName,
                    role,
                    permissions: permissions || [],
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

            res.status(201).json({
                success: true,
                data: user
            });

        } catch (error) {
            logger.error('Create admin user error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Обновить администратора
    async updateUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Не позволяем обновлять пароль через этот endpoint
            delete updateData.password;
            delete updateData.passwordHash;

            // Если обновляется email или username, проверяем уникальность
            if (updateData.email || updateData.username) {
                const existingUser = await prisma.user.findFirst({
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

                if (existingUser) {
                    return res.status(409).json({
                        error: 'Username or email already exists'
                    });
                }
            }

            const user = await prisma.user.update({
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
                    avatarUrl: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            res.json({
                success: true,
                data: user
            });

        } catch (error) {
            logger.error('Update admin user error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Удалить администратора
    async deleteUser(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            // Не позволяем удалить самого себя
            if (req.user?.id === id) {
                return res.status(400).json({
                    error: 'Cannot delete yourself'
                });
            }

            // Проверяем, что пользователь существует
            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Проверяем, что это не последний супер админ
            if (user.role === 'SUPER_ADMIN') {
                const superAdminCount = await prisma.user.count({
                    where: {
                        role: 'SUPER_ADMIN',
                        isActive: true
                    }
                });

                if (superAdminCount <= 1) {
                    return res.status(400).json({
                        error: 'Cannot delete the last super admin'
                    });
                }
            }

            await prisma.user.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'User deleted successfully'
            });

        } catch (error) {
            logger.error('Delete admin user error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Сменить пароль
    async changePassword(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { currentPassword, newPassword } = req.body;

            const user = await prisma.user.findUnique({
                where: { id }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            // Проверяем текущий пароль (только если это не супер админ меняет чужой пароль)
            if (req.user?.id === id || req.user?.role !== 'SUPER_ADMIN') {
                const bcrypt = require('bcrypt');
                const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);

                if (!validPassword) {
                    return res.status(400).json({
                        error: 'Current password is incorrect'
                    });
                }
            }

            const hashedNewPassword = await hashPassword(newPassword);

            await prisma.user.update({
                where: { id },
                data: {
                    passwordHash: hashedNewPassword
                }
            });

            res.json({
                success: true,
                message: 'Password changed successfully'
            });

        } catch (error) {
            logger.error('Change password error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

