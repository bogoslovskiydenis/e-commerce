import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';

@Controller('promotions')
export class PromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @Get('public/:code')
  async getPromotionByCode(@Param('code') code: string) {
    return this.promotionsService.getPromotionByCode(code);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('promotions.view')
  async getPromotions(@Query() query: any) {
    return this.promotionsService.getPromotions(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('promotions.view')
  async getPromotion(@Param('id') id: string) {
    return this.promotionsService.getPromotion(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('promotions.create')
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.createPromotion(createPromotionDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('promotions.edit')
  async updatePromotion(@Param('id') id: string, @Body() updatePromotionDto: UpdatePromotionDto) {
    return this.promotionsService.updatePromotion(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('promotions.delete')
  async deletePromotion(@Param('id') id: string) {
    return this.promotionsService.deletePromotion(id);
  }
}


