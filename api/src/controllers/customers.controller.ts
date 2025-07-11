import { Request, Response } from 'express';
import { AuthenticatedRequest } from '@/middleware/auth.middleware';
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';

export class CustomersController {
    // Получить список клиентов
    async getCustomers(req: AuthenticatedRequest, res: Response) {
        try {
            const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

            const pageNum = parseInt(page as string);
            const limitNum = parseInt(limit as string);
            const offset = (pageNum - 1) * limitNum;

            // Строим фильтры
            const where: any = {};

            if (search) {
                where.OR = [
                    { name: { contains: search as string, mode: 'insensitive' } },
                    { email: { contains: search as string, mode: 'insensitive' } },
                    { phone: { contains: search as string, mode: 'insensitive' } }
                ];
            }

            // Получаем клиентов
            const [customers, total] = await Promise.all([
                prisma.customer.findMany({
                    where,
                    skip: offset,
                    take: limitNum,
                    orderBy: {
                        [sortBy as string]: sortOrder
                    },
                    include: {
                        _count: {
                            select: {
                                orders: true,
                                reviews: true,
                                callbacks: true
                            }
                        }
                    }
                }),
                prisma.customer.count({ where })
            ]);

            console.log('👥 Получение списка клиентов:', customers.length);

            res.json({
                success: true,
                data: customers,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            });

        } catch (error) {
            logger.error('Get customers error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить клиента по ID
    async getCustomer(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            const customer = await prisma.customer.findUnique({
                where: { id },
                include: {
                    orders: {
                        orderBy: { createdAt: 'desc' },
                        take: 10
                    },
                    reviews: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    },
                    callbacks: {
                        orderBy: { createdAt: 'desc' },
                        take: 5
                    },
                    _count: {
                        select: {
                            orders: true,
                            reviews: true,
                            callbacks: true
                        }
                    }
                }
            });

            if (!customer) {
                return res.status(404).json({
                    success: false,
                    error: 'Customer not found'
                });
            }

            console.log('👤 Получение клиента по ID:', id);

            res.json({
                success: true,
                data: customer
            });

        } catch (error) {
            logger.error('Get customer error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Создать клиента
    async createCustomer(req: AuthenticatedRequest, res: Response) {
        try {
            const { name, email, phone, address, notes, tags = [] } = req.body;

            if (!name || !phone) {
                return res.status(400).json({
                    success: false,
                    error: 'Name and phone are required'
                });
            }

            const customer = await prisma.customer.create({
                data: {
                    name,
                    email,
                    phone,
                    address,
                    notes,
                    tags,
                    isActive: true
                }
            });

            console.log('👤 Клиент создан:', customer.name);
            logger.info(`Customer created: ${customer.name} by ${req.user?.username}`);

            res.status(201).json({
                success: true,
                data: customer
            });

        } catch (error) {
            logger.error('Create customer error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Обновить клиента
    async updateCustomer(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const customer = await prisma.customer.update({
                where: { id },
                data: updateData
            });

            console.log('👤 Клиент обновлен:', customer.name);
            logger.info(`Customer updated: ${customer.name} by ${req.user?.username}`);

            res.json({
                success: true,
                data: customer
            });

        } catch (error) {
            logger.error('Update customer error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Удалить клиента
    async deleteCustomer(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.customer.delete({
                where: { id }
            });

            console.log('👤 Клиент удален:', id);
            logger.info(`Customer deleted: ${id} by ${req.user?.username}`);

            res.json({
                success: true,
                message: 'Customer deleted successfully'
            });

        } catch (error) {
            logger.error('Delete customer error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const customersController = new CustomersController();