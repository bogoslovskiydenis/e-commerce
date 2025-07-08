import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class OrdersController {
    // Получить список заказов
    async getOrders(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 25,
                search,
                status,
                paymentStatus,
                dateFrom,
                dateTo,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (Number(page) - 1) * Number(limit);

            const where: any = {};

            if (search) {
                where.OR = [
                    { orderNumber: { contains: search as string, mode: 'insensitive' } },
                    { customer: { name: { contains: search as string, mode: 'insensitive' } } },
                    { customer: { phone: { contains: search as string, mode: 'insensitive' } } }
                ];
            }

            if (status) {
                where.status = status;
            }

            if (paymentStatus) {
                where.paymentStatus = paymentStatus;
            }

            if (dateFrom || dateTo) {
                where.createdAt = {};
                if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
                if (dateTo) where.createdAt.lte = new Date(dateTo as string);
            }

            const [orders, total] = await Promise.all([
                prisma.order.findMany({
                    where,
                    include: {
                        customer: true,
                        manager: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true
                            }
                        },
                        items: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        title: true,
                                        images: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    skip,
                    take: Number(limit),
                }),
                prisma.order.count({ where })
            ]);

            res.json({
                success: true,
                data: orders,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Get orders error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить заказ по ID
    async getOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    customer: true,
                    manager: {
                        select: {
                            id: true,
                            fullName: true,
                            username: true
                        }
                    },
                    items: {
                        include: {
                            product: true
                        }
                    }
                }
            });

            if (!order) {
                return res.status(404).json({
                    error: 'Order not found'
                });
            }

            res.json({
                success: true,
                data: order
            });

        } catch (error) {
            logger.error('Get order error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Обновить статус заказа
    async updateOrderStatus(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const { status, paymentStatus, managerNotes } = req.body;

            const updateData: any = {};
            if (status) updateData.status = status;
            if (paymentStatus) updateData.paymentStatus = paymentStatus;
            if (managerNotes) updateData.managerNotes = managerNotes;
            if (req.user) updateData.managerId = req.user.id;

            const order = await prisma.order.update({
                where: { id },
                data: updateData,
                include: {
                    customer: true,
                    manager: {
                        select: {
                            id: true,
                            fullName: true
                        }
                    }
                }
            });

            res.json({
                success: true,
                data: order
            });

        } catch (error) {
            logger.error('Update order status error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}