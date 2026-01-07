import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async getCategories(@Query() query: any) {
    return this.categoriesService.getCategories(query);
  }

  @Get('tree')
  async getCategoriesTree(@Query() query: any) {
    return this.categoriesService.getCategoriesTree(query);
  }

  @Get('navigation')
  async getNavigationCategories(@Query() query: any) {
    return this.categoriesService.getNavigationCategories(query);
  }

  @Get('popular')
  async getPopularCategories(@Query('limit') limit?: string, @Query('lang') lang?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 5;
    return this.categoriesService.getPopularCategories(limitNum, lang);
  }

  @Get('slug/:slug')
  async getCategoryBySlug(@Param('slug') slug: string, @Query('lang') lang?: string) {
    return this.categoriesService.getCategoryBySlug(slug, lang);
  }

  @Get(':id')
  async getCategory(@Param('id') id: string, @Query('lang') lang?: string) {
    return this.categoriesService.getCategoryById(id, lang);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('categories.create')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('categories.edit')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('categories.delete')
  async deleteCategory(@Param('id') id: string, @Query('force') force?: string) {
    const forceDelete = force === 'true';
    return this.categoriesService.deleteCategory(id, forceDelete);
  }
}


