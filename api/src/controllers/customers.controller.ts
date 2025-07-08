import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class CustomersController {
    async getCustomers(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 25,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = req.query;

            const skip = (Number(page) - 1) * Number(limit);

            const where: any = {};

            if (search) {
                where.OR = [
                    { name: { contains: search as string, mode: 'insensitive' } },
                    { email: { contains: search as string, mode: 'insensitive' } },
                    { phone: { contains: search as string, mode: 'insensitive' } }
                ];
            }

            const [customers, total] = await Promise.all([
                prisma.customer.findMany({
                    where,
                    include: {
                        orders: {
                            select: {
                                id: true,
                                totalAmount: true,
                                status: true,
                                createdAt: true
                            },
                            orderBy: {
                                createdAt: 'desc'
                            }
                        },
                        _count: {
                            select: {
                                orders: true
                            }
                        }
                    },
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    skip,
                    take: Number(limit),
                }),
                prisma.customer.count({ where })
            ]);

            const customersWithStats = customers.map(customer => ({
                ...customer,
                totalOrders: customer._count.orders,
                totalSpent: customer.orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
                lastOrderDate: customer.orders[0]?.createdAt || null
            }));

            res.json({
                success: true,
                data: customersWithStats,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            });

        } catch (error) {
            logger.error('Get customers error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async getCustomer(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const customer = await prisma.customer.findUnique({
                where: { id },
                include: {
                    orders: {
                        include: {
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
                            createdAt: 'desc'
                        }
                    },
                    callbacks: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                }
            });

            if (!customer) {
                return res.status(404).json({
                    error: 'Customer not found'
                });
            }

            res.json({
                success: true,
                data: customer
            });

        } catch (error) {
            logger.error('Get customer error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async updateCustomer(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const customer = await prisma.customer.update({
                where: { id },
                data: updateData
            });

            res.json({
                success: true,
                data: customer
            });

        } catch (error) {
            logger.error('Update customer error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}