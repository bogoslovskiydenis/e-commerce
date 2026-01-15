import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './common/guards/permissions.guard';
import { RequirePermissions } from './common/decorators/permissions.decorator';

@Controller()
export class AppController {
  constructor(private prisma: PrismaService) {}

  @Get()
  getApiInfo() {
    return {
      success: true,
      message: 'Balloon Shop API',
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth/*',
        admin: '/api/admin/*',
        categories: '/api/categories/*',
        products: '/api/products/*',
        orders: '/api/orders/*',
        customers: '/api/customers/*',
        banners: '/api/banners/*',
        pages: '/api/pages/*',
        settings: '/api/settings/*',
        navigation: '/api/navigation/*',
        adminLogs: '/api/admin/logs/*',
        callbacks: '/api/callbacks/*',
        reviews: '/api/reviews/*',
        promotions: '/api/promotions/*',
        analytics: '/api/analytics/*',
      },
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getStats(@Query() query: any) {
    const { period, dateFrom, dateTo } = query;

    // Получаем диапазон дат
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
      // По умолчанию - за последние 30 дней
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const dateFilter = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalCustomers,
      completedOrders,
      newUsers,
      ordersRevenue,
      ordersInPeriod,
      completedOrdersInPeriod,
      revenueInPeriod,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.customer.count(),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.user.count({ where: dateFilter }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { totalAmount: true },
      }),
      this.prisma.order.count({ where: dateFilter }),
      this.prisma.order.count({
        where: {
          ...dateFilter,
          status: OrderStatus.DELIVERED,
        },
      }),
      this.prisma.order.aggregate({
        where: {
          ...dateFilter,
          status: OrderStatus.DELIVERED,
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      success: true,
      data: {
        // Общая статистика (за всё время)
        totalUsers,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenue: ordersRevenue._sum.totalAmount ? Number(ordersRevenue._sum.totalAmount) : 0,
        newUsers,
        completedOrders,
        // Статистика за выбранный период
        period: {
          orders: ordersInPeriod,
          completedOrders: completedOrdersInPeriod,
          revenue: revenueInPeriod._sum.totalAmount ? Number(revenueInPeriod._sum.totalAmount) : 0,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      },
    };
  }
}

