import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NavPromoCardsService } from './nav-promo-cards.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('nav-promo-cards')
export class NavPromoCardsController {
  constructor(private service: NavPromoCardsService) {}

  @Get('public')
  getPublic(@Query('categoryId') categoryId?: string) {
    return this.service.getPublicCards(categoryId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.banners')
  getAll(@Query() query: any) {
    return this.service.getCards(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.banners')
  getOne(@Param('id') id: string) {
    return this.service.getCard(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.banners')
  create(@Body() body: any) {
    return this.service.createCard(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.banners')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.updateCard(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('website.banners')
  remove(@Param('id') id: string) {
    return this.service.deleteCard(id);
  }
}
