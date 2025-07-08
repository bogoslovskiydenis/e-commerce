import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';

export class DashboardController {
    async getStats(req: Request, res: Response) {
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
                case '90d':
                    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            }

            // Параллельные запросы для статистики
            const [
                totalOrders,
                totalCustomers,
                totalProducts,
                totalRevenue,
                newOrders,
                recentOrders,
                topProducts,
                ordersByStatus,
                revenueChart
            ] = await Promise.all([
                // Общее количество заказов
                prisma.order.count(),

                // Общее количество клиентов
                prisma.customer.count(),

                // Общее количество товаров
                prisma.product.count(),

                // Общая выручка
                prisma.order.aggregate({
                    _sum: {
                        totalAmount: true
                    },
                    where: {
                        paymentStatus: 'PAID'
                    }
                }),

                // Новые заказы за период
                prisma.order.count({
                    where: {
                        createdAt: {
                            gte: startDate
                        }
                    }
                }),

                // Последние заказы
                prisma.order.findMany({
                    take: 10,
                    orderBy: {
                        createdAt: 'desc'
                    },
                    include: {
                        customer: {
                            select: {
                                name: true,
                                phone: true
                            }
                        }
                    }
                }),

                // Топ товары
                prisma.orderItem.groupBy({
                    by: ['productId'],
                    _count: {
                        productId: true
                    },
                    _sum: {
                        quantity: true
                    },
                    orderBy: {
                        _sum: {
                            quantity: 'desc'
                        }
                    },
                    take: 10
                }),

                // Заказы по статусам
                prisma.order.groupBy({
                    by: ['status'],
                    _count: {
                        status: true
                    }
                }),

                // График выручки за последние 30 дней
                prisma.$queryRaw`
          SELECT 
            DATE(created_at) as date,
            COUNT(*) as orders_count,
            SUM(total_amount) as revenue
          FROM orders 
          WHERE created_at >= ${new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)}
            AND payment_status = 'PAID'
          GROUP BY DATE(created_at)
          ORDER BY date DESC
          LIMIT 30
        `
            ]);

            // Получаем информацию о топ товарах
            const topProductsWithDetails = await Promise.all(
                topProducts.map(async (item) => {
                    const product = await prisma.product.findUnique({
                        where: { id: item.productId },
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            images: true
                        }
                    });
                    return {
                        ...product,
                        totalSold: item._sum.quantity,
                        orderCount: item._count.productId
                    };
                })
            );

            const stats = {
                overview: {
                    totalOrders,
                    totalCustomers,
                    totalProducts,
                    totalRevenue: totalRevenue._sum.totalAmount || 0,
                    newOrders,
                    period
                },
                recentOrders: recentOrders.map(order => ({
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: order.customer.name,
                    customerPhone: order.customer.phone,
                    totalAmount: order.totalAmount,
                    status: order.status,
                    createdAt: order.createdAt
                })),
                topProducts: topProductsWithDetails,
                ordersByStatus: ordersByStatus.map(item => ({
                    status: item.status,
                    count: item._count.status
                })),
                revenueChart: (revenueChart as any[]).map(item => ({
                    date: item.date,
                    ordersCount: Number(item.orders_count),
                    revenue: Number(item.revenue)
                }))
            };

            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            logger.error('Get dashboard stats error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}






