import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('orders')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getOrdersAnalytics(@Query() query: any) {
    return this.analyticsService.getOrdersAnalytics(query);
  }

  @Get('products')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getProductsAnalytics(@Query() query: any) {
    return this.analyticsService.getProductsAnalytics(query);
  }

  @Get('customers')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getCustomersAnalytics(@Query() query: any) {
    return this.analyticsService.getCustomersAnalytics(query);
  }

  @Get('revenue')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getRevenueAnalytics(@Query() query: any) {
    return this.analyticsService.getRevenueAnalytics(query);
  }

  @Get('dashboard')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('analytics.view')
  async getDashboardStats(@Query() query: any) {
    return this.analyticsService.getDashboardStats(query);
  }
}
