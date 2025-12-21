import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { RequirePermissions } from '../common/decorators/permissions.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.view')
  async getReviews(@Query() query: any) {
    return this.reviewsService.getReviews(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.view')
  async getReview(@Param('id') id: string) {
    return this.reviewsService.getReviewById(id);
  }

  @Post()
  async createReview(@Body() body: any) {
    return this.reviewsService.createReview(body);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.edit')
  async updateReview(@Param('id') id: string, @Body() body: any) {
    return this.reviewsService.updateReview(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.delete')
  async deleteReview(@Param('id') id: string) {
    return this.reviewsService.deleteReview(id);
  }
}


