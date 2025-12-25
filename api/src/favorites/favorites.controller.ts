import { Controller, Get, Post, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CustomerAuthGuard } from '../customers/guards/customer-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  @UseGuards(CustomerAuthGuard)
  async getFavorites(@Request() req) {
    return this.favoritesService.getFavorites(req.customer.id);
  }

  @Get('ids')
  @UseGuards(CustomerAuthGuard)
  async getFavoriteIds(@Request() req) {
    const ids = await this.favoritesService.getFavoriteIds(req.customer.id);
    return {
      success: true,
      data: ids,
    };
  }

  @Get('check/:productId')
  @UseGuards(CustomerAuthGuard)
  async checkFavorite(@Request() req, @Param('productId') productId: string) {
    const isFavorite = await this.favoritesService.isFavorite(req.customer.id, productId);
    return {
      success: true,
      data: { isFavorite },
    };
  }

  @Post(':productId')
  @UseGuards(CustomerAuthGuard)
  async addToFavorites(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.addToFavorites(req.customer.id, productId);
  }

  @Delete(':productId')
  @UseGuards(CustomerAuthGuard)
  async removeFromFavorites(@Request() req, @Param('productId') productId: string) {
    return this.favoritesService.removeFromFavorites(req.customer.id, productId);
  }
}

