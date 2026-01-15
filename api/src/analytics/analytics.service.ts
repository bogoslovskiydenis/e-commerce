import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Вспомогательный метод для получения периода
  private getDateRange(period?: string, dateFrom?: string, dateTo?: string) {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = new Date(now);

    if (dateFrom && dateTo) {
      startDate = new Date(dateFrom);
      endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
    } else if (period) {
      switch (period) {
        case 'today':
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(0);
      }
    } else {
      startDate = new Date(0);
    }

    return { startDate, endDate };
  }

  // Аналитика по заказам
  async getOrdersAnalytics(query: any) {
    const { groupBy = 'status', period, dateFrom, dateTo } = query;
    const { startDate, endDate } = this.getDateRange(period, dateFrom, dateTo);

    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (groupBy === 'status') {
      const statusCounts = await this.prisma.order.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      });

      return {
        success: true,
        data: statusCounts.map((item) => ({
          status: item.status,
          count: item._count.id,
          totalAmount: Number(item._sum.totalAmount || 0),
        })),
      };
    }

    if (groupBy === 'paymentStatus') {
      const paymentStatusCounts = await this.prisma.order.groupBy({
        by: ['paymentStatus'],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      });

      return {
        success: true,
        data: paymentStatusCounts.map((item) => ({
          paymentStatus: item.paymentStatus,
          count: item._count.id,
          totalAmount: Number(item._sum.totalAmount || 0),
        })),
      };
    }

    if (groupBy === 'source') {
      const sourceCounts = await this.prisma.order.groupBy({
        by: ['source'],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      });

      return {
        success: true,
        data: sourceCounts.map((item) => ({
          source: item.source || 'unknown',
          count: item._count.id,
          totalAmount: Number(item._sum.totalAmount || 0),
        })),
      };
    }

    if (groupBy === 'date') {
      // Группировка по дням
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          createdAt: true,
          totalAmount: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      const dailyStats: Record<string, { date: string; count: number; totalAmount: number }> = {};

      orders.forEach((order) => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        if (!dailyStats[dateKey]) {
          dailyStats[dateKey] = {
            date: dateKey,
            count: 0,
            totalAmount: 0,
          };
        }
        dailyStats[dateKey].count++;
        dailyStats[dateKey].totalAmount += Number(order.totalAmount);
      });

      return {
        success: true,
        data: Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date)),
      };
    }

    return {
      success: true,
      data: [],
    };
  }

  // Аналитика по товарам
  async getProductsAnalytics(query: any) {
    const { limit = 10, sortBy = 'revenue', period, dateFrom, dateTo } = query;
    const { startDate, endDate } = this.getDateRange(period, dateFrom, dateTo);

    const where: any = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      status: OrderStatus.DELIVERED,
    };

    // Получаем все заказы за период
    const orders = await this.prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Подсчитываем статистику по товарам
    const productStats: Record<
      string,
      {
        productId: string;
        productTitle: string;
        productImage?: string;
        sales: number;
        revenue: number;
        orders: number;
        averagePrice: number;
      }
    > = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const productId = item.productId;
        if (!productStats[productId]) {
          productStats[productId] = {
            productId,
            productTitle: item.product.title,
            productImage: item.product.images?.[0],
            sales: 0,
            revenue: 0,
            orders: 0,
            averagePrice: 0,
          };
        }
        productStats[productId].sales += item.quantity;
        productStats[productId].revenue += Number(item.total);
        productStats[productId].orders += 1;
      });
    });

    // Вычисляем среднюю цену
    Object.values(productStats).forEach((stat) => {
      stat.averagePrice = stat.sales > 0 ? stat.revenue / stat.sales : 0;
    });

    // Всегда получаем рейтинги для всех товаров
    const productIds = Object.values(productStats).map((p) => p.productId);
    const reviews = await this.prisma.review.groupBy({
      by: ['productId'],
      where: {
        productId: { in: productIds },
        status: 'APPROVED',
      },
      _avg: { rating: true },
      _count: { id: true },
    });

    const reviewMap = new Map(reviews.map((r) => [r.productId, { rating: r._avg.rating || 0, count: r._count.id }]));

    // Добавляем рейтинги ко всем товарам
    let sorted = Object.values(productStats).map((p) => ({
      ...p,
      rating: reviewMap.get(p.productId)?.rating || 0,
      reviewsCount: reviewMap.get(p.productId)?.count || 0,
    }));

    // Сортируем
    if (sortBy === 'revenue') {
      sorted = sorted.sort((a, b) => b.revenue - a.revenue);
    } else if (sortBy === 'sales') {
      sorted = sorted.sort((a, b) => b.sales - a.sales);
    } else if (sortBy === 'rating') {
      sorted = sorted.sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0));
    }

    return {
      success: true,
      data: sorted.slice(0, Number(limit)),
    };
  }

  // Аналитика по клиентам
  async getCustomersAnalytics(query: any) {
    const { limit = 10, sortBy = 'totalSpent' } = query;

    // Получаем всех клиентов с их заказами и отзывами
    const customers = await this.prisma.customer.findMany({
      include: {
        orders: {
          where: {
            status: OrderStatus.DELIVERED,
          },
          select: {
            totalAmount: true,
            createdAt: true,
          },
        },
        reviews: {
          where: {
            status: 'APPROVED',
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Подсчитываем статистику
    const customerStats = customers.map((customer) => {
      const orders = customer.orders || [];
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
      const orderCount = orders.length;
      const lastOrderDate = orders.length > 0 
        ? orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].createdAt
        : null;
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
      const reviewsCount = customer.reviews?.length || 0;

      return {
        customerId: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        createdAt: customer.createdAt,
        totalSpent,
        orderCount,
        averageOrderValue,
        lastOrderDate,
        reviewsCount,
      };
    });

    // Сортируем
    let sorted = customerStats;
    if (sortBy === 'totalSpent') {
      sorted = customerStats.sort((a, b) => b.totalSpent - a.totalSpent);
    } else if (sortBy === 'orderCount') {
      sorted = customerStats.sort((a, b) => b.orderCount - a.orderCount);
    } else if (sortBy === 'lastOrderDate') {
      sorted = customerStats.sort((a, b) => {
        const dateA = a.lastOrderDate ? new Date(a.lastOrderDate).getTime() : 0;
        const dateB = b.lastOrderDate ? new Date(b.lastOrderDate).getTime() : 0;
        return dateB - dateA;
      });
    }

    return {
      success: true,
      data: sorted.slice(0, Number(limit)),
    };
  }

  // Аналитика по выручке
  async getRevenueAnalytics(query: any) {
    const { period, dateFrom, dateTo, groupBy = 'day' } = query;
    const { startDate, endDate } = this.getDateRange(period, dateFrom, dateTo);

    const where: any = {
      status: OrderStatus.DELIVERED,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const orders = await this.prisma.order.findMany({
      where,
      select: {
        createdAt: true,
        totalAmount: true,
        discountAmount: true,
        shippingAmount: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (groupBy === 'day') {
      const dailyRevenue: Record<string, { date: string; revenue: number; orders: number; discount: number; shipping: number }> = {};

      orders.forEach((order) => {
        const dateKey = order.createdAt.toISOString().split('T')[0];
        if (!dailyRevenue[dateKey]) {
          dailyRevenue[dateKey] = {
            date: dateKey,
            revenue: 0,
            orders: 0,
            discount: 0,
            shipping: 0,
          };
        }
        dailyRevenue[dateKey].revenue += Number(order.totalAmount);
        dailyRevenue[dateKey].orders += 1;
        dailyRevenue[dateKey].discount += Number(order.discountAmount || 0);
        dailyRevenue[dateKey].shipping += Number(order.shippingAmount || 0);
      });

      return {
        success: true,
        data: Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date)),
        summary: {
          totalRevenue: orders.reduce((sum, o) => sum + Number(o.totalAmount), 0),
          totalOrders: orders.length,
          totalDiscount: orders.reduce((sum, o) => sum + Number(o.discountAmount || 0), 0),
          totalShipping: orders.reduce((sum, o) => sum + Number(o.shippingAmount || 0), 0),
          averageOrderValue: orders.length > 0 
            ? orders.reduce((sum, o) => sum + Number(o.totalAmount), 0) / orders.length 
            : 0,
        },
      };
    }

    // Для других группировок (week, month) можно добавить аналогичную логику

    return {
      success: true,
      data: [],
      summary: {
        totalRevenue: 0,
        totalOrders: 0,
        totalDiscount: 0,
        totalShipping: 0,
        averageOrderValue: 0,
      },
    };
  }

  // Общая статистика для дашборда
  async getDashboardStats(query: any) {
    const { period, dateFrom, dateTo } = query;
    const { startDate, endDate } = this.getDateRange(period, dateFrom, dateTo);

    const where = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [
      totalOrders,
      newOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalCustomers,
      newCustomers,
      averageOrderValue,
      ordersByStatus,
      ordersByPaymentStatus,
    ] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.NEW } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.DELIVERED } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
      this.prisma.order.aggregate({
        where: { ...where, status: OrderStatus.DELIVERED },
        _sum: { totalAmount: true },
      }),
      this.prisma.customer.count(),
      this.prisma.customer.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      this.prisma.order.aggregate({
        where: { ...where, status: OrderStatus.DELIVERED },
        _avg: { totalAmount: true },
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where,
        _count: { id: true },
      }),
      this.prisma.order.groupBy({
        by: ['paymentStatus'],
        where,
        _count: { id: true },
      }),
    ]);

    return {
      success: true,
      data: {
        orders: {
          total: totalOrders,
          new: newOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          byStatus: ordersByStatus.map((item) => ({
            status: item.status,
            count: item._count.id,
          })),
          byPaymentStatus: ordersByPaymentStatus.map((item) => ({
            paymentStatus: item.paymentStatus,
            count: item._count.id,
          })),
        },
        revenue: {
          total: Number(totalRevenue._sum.totalAmount || 0),
          averageOrderValue: Number(averageOrderValue._avg.totalAmount || 0),
        },
        customers: {
          total: totalCustomers,
          new: newCustomers,
        },
      },
    };
  }
}
