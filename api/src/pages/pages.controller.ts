import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('pages')
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.pages')
  async getPages(@Query() query: any) {
    return this.pagesService.getPages(query);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.pages')
  async createPage(@Body() body: any) {
    return this.pagesService.createPage(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.pages')
  async updatePage(@Param('id') id: string, @Body() body: any) {
    return this.pagesService.updatePage(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.pages')
  async deletePage(@Param('id') id: string) {
    return this.pagesService.deletePage(id);
  }
}
