
import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';

export class AdminLogsController {
    // Получить список логов
    async getLogs(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 50,
                search,
                action,
                resource,
                level,
                userId,
                dateFrom,
                dateTo,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (Number(page) - 1) * Number(limit);

            const where: any = {};

            if (search) {
                where.OR = [
                    { description: { contains: search as string, mode: 'insensitive' } },
                    { user: { username: { contains: search as string, mode: 'insensitive' } } },
                    { user: { fullName: { contains: search as string, mode: 'insensitive' } } }
                ];
            }

            if (action) {
                where.action = action;
            }

            if (resource) {
                where.resource = resource;
            }

            if (level) {
                where.level = level;
            }

            if (userId) {
                where.userId = userId;
            }

            if (dateFrom || dateTo) {
                where.createdAt = {};
                if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
                if (dateTo) where.createdAt.lte = new Date(dateTo as string);
            }

            const [logs, total] = await Promise.all([
                prisma.adminLog.findMany({
                    where,
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                fullName: true,
                                avatarUrl: true
                            }
                        }
                    },
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    skip,
                    take: Number(limit),
                }),
                prisma.adminLog.count({ where })
            ]);

            res.json({
                success: true,
                data: logs,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Get admin logs error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить лог по ID
    async getLog(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const log = await prisma.adminLog.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true,
                            fullName: true,
                            avatarUrl: true
                        }
                    }
                }
            });

            if (!log) {
                return res.status(404).json({
                    error: 'Log not found'
                });
            }

            res.json({
                success: true,
                data: log
            });

        } catch (error) {
            logger.error('Get admin log error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить статистику по логам
    async getLogStats(req: Request, res: Response) {
        try {
            const { period = '7d' } = req.query;

            const now = new Date();
            let startDate: Date;

            switch (period) {
                case '1d':
                    startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                    break;
                case '7d':
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '30d':
                    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            }

            const [
                totalLogs,
                logsByAction,
                logsByLevel,
                logsByUser,
                recentActivity
            ] = await Promise.all([
                // Общее количество логов за период
                prisma.adminLog.count({
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                }),

                // Логи по действиям
                prisma.adminLog.groupBy({
                    by: ['action'],
                    _count: {
                        action: true
                    },
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    },
                    orderBy: {
                        _count: {
                            action: 'desc'
                        }
                    }
                }),

                // Логи по уровням
                prisma.adminLog.groupBy({
                    by: ['level'],
                    _count: {
                        level: true
                    },
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                }),

                // Активность по пользователям
                prisma.adminLog.groupBy({
                    by: ['userId'],
                    _count: {
                        userId: true
                    },
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    },
                    orderBy: {
                        _count: {
                            userId: 'desc'
                        }
                    },
                    take: 10
                }),

                // Последняя активность
                prisma.adminLog.findMany({
                    take: 20,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                                fullName: true
                            }
                        }
                    },
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                })
            ]);

            // Получаем информацию о пользователях для статистики
            const userIds = logsByUser.map(item => item.userId);
            const users = await prisma.user.findMany({
                where: {
                    id: {
                        in: userIds
                    }
                },
                select: {
                    id: true,
                    username: true,
                    fullName: true
                }
            });

            const logsByUserWithDetails = logsByUser.map(item => {
                const user = users.find(u => u.id === item.userId);
                return {
                    userId: item.userId,
                    username: user?.username,
                    fullName: user?.fullName,
                    count: item._count.userId
                };
            });

            const stats = {
                totalLogs,
                period,
                logsByAction: logsByAction.map(item => ({
                    action: item.action,
                    count: item._count.action
                })),
                logsByLevel: logsByLevel.map(item => ({
                    level: item.level,
                    count: item._count.level
                })),
                logsByUser: logsByUserWithDetails,
                recentActivity: recentActivity.map(log => ({
                    id: log.id,
                    action: log.action,
                    resource: log.resource,
                    description: log.description,
                    username: log.user.username,
                    fullName: log.user.fullName,
                    createdAt: log.createdAt
                }))
            };

            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            logger.error('Get log stats error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}