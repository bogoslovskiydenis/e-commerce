import { Controller, Get, UseGuards } from '@nestjs/common';
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
  async getStats() {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalCustomers,
      completedOrders,
      newUsers,
      ordersRevenue,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.product.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      this.prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
      this.prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
      this.prisma.order.aggregate({
        where: { status: OrderStatus.DELIVERED },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalCustomers,
        revenue: ordersRevenue._sum.totalAmount ? Number(ordersRevenue._sum.totalAmount) : 0,
        newUsers,
        completedOrders,
      },
    };
  }
}

