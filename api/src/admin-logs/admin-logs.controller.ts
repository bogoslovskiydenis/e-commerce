import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdminLogsService } from './admin-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('admin/logs')
export class AdminLogsController {
  constructor(private adminLogsService: AdminLogsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('logs.view')
  async getLogs(@Query() query: any) {
    return this.adminLogsService.getLogs(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('logs.create')
  async createLog(@Body() body: any) {
    return this.adminLogsService.createLog(body);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('logs.view')
  async getLogStats(@Query('period') period: string) {
    return this.adminLogsService.getLogStats(period);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('logs.view')
  async getLog(@Param('id') id: string) {
    return this.adminLogsService.getLogById(id);
  }
}
