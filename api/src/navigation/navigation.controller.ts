import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NavigationService } from './navigation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('navigation')
export class NavigationController {
  constructor(private navigationService: NavigationService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async getNavigationItems(@Query() query: any) {
    const items = await this.navigationService.getNavigationItems(query);
    return { success: true, data: items, total: items.length };
  }

  @Get('tree')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async getNavigationTree(@Query('lang') lang?: string) {
    const tree = await this.navigationService.getNavigationTree(lang);
    return { success: true, data: tree };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async getNavigationItem(@Param('id') id: string) {
    const item = await this.navigationService.getNavigationItemById(id);
    return { success: true, data: item };
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async createNavigationItem(@Body() body: any) {
    const item = await this.navigationService.createNavigationItem(body);
    return { success: true, data: item, message: 'Navigation item created successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async updateNavigationItem(@Param('id') id: string, @Body() body: any) {
    const item = await this.navigationService.updateNavigationItem(id, body);
    return { success: true, data: item, message: 'Navigation item updated successfully' };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async patchNavigationItem(@Param('id') id: string, @Body() body: any) {
    const item = await this.navigationService.updateNavigationItem(id, body);
    return { success: true, data: item, message: 'Navigation item updated successfully' };
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async reorderNavigationItems(@Body() body: { items: Array<{ id: string; sortOrder: number }> }) {
    await this.navigationService.reorderNavigationItems(body.items);
    return { success: true, message: 'Navigation items reordered successfully' };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.navigation')
  async deleteNavigationItem(@Param('id') id: string) {
    await this.navigationService.deleteNavigationItem(id);
    return { success: true, message: 'Navigation item deleted successfully' };
  }
}
