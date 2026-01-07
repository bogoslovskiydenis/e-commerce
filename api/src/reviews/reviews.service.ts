import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getPublicReviews(query: any) {
    const { page = 1, limit = 25, productId, rating, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      status: ReviewStatus.APPROVED,
    };

    if (productId) where.productId = productId;
    if (rating) where.rating = Number(rating);

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          rating: true,
          comment: true,
          createdAt: true,
          product: { select: { id: true, title: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      success: true,
      data: reviews,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getReviews(query: any) {
    const { page = 1, limit = 25, search, status, productId, customerId, rating, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { comment: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (productId) where.productId = productId;
    if (customerId) where.customerId = customerId;
    if (rating) where.rating = Number(rating);

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { [sortBy]: sortOrder },
        include: {
          product: { select: { id: true, title: true, slug: true, images: true } },
          customer: { select: { id: true, name: true, email: true } },
          moderator: { select: { id: true, username: true, fullName: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      success: true,
      data: reviews,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    };
  }

  async getReviewById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        product: { select: { id: true, title: true, slug: true, images: true } },
        customer: { select: { id: true, name: true, email: true } },
        moderator: { select: { id: true, username: true, fullName: true } },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return { success: true, data: review };
  }

  async createReview(data: any) {
    const { productId, customerId, name, email, rating, comment } = data;

    if (!productId || !name || !rating) {
      throw new BadRequestException('ProductId, name and rating are required');
    }

    if (rating < 1 || rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }

    // Проверяем существование пользователя
    let foundCustomerId: string | null = customerId || null;
    // По умолчанию одобряем все отзывы (и гостей, и зарегистрированных)
    let reviewStatus: ReviewStatus = ReviewStatus.APPROVED;

    if (foundCustomerId) {
      // Если передан customerId, проверяем его существование
      const customer = await this.prisma.customer.findUnique({
        where: { id: foundCustomerId },
      });
      if (!customer) {
        foundCustomerId = null; // Если customer не найден, сбрасываем ID
      }
    } else if (email) {
      // Если customerId не передан, но есть email, ищем customer по email
      const customer = await this.prisma.customer.findUnique({
        where: { email: email },
      });
      if (customer) {
        foundCustomerId = customer.id;
      }
    }

    // Все отзывы (гостей и зарегистрированных пользователей) автоматически одобряются
    // Если нужно вернуть модерацию для гостей, можно добавить проверку:
    // reviewStatus = foundCustomerId ? ReviewStatus.APPROVED : ReviewStatus.PENDING;

    const review = await this.prisma.review.create({
      data: {
        productId,
        customerId: foundCustomerId,
        name,
        email: email || null,
        rating: Number(rating),
        comment: comment || null,
        status: reviewStatus,
      },
      include: {
        product: { select: { id: true, title: true, slug: true, images: true } },
        customer: { select: { id: true, name: true, email: true } },
      },
    });

    return { success: true, data: review };
  }

  async updateReview(id: string, data: any) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const updateData: any = {};
    
    // Обработка статуса - поддерживаем как строки, так и enum значения
    if (data.status !== undefined) {
      const statusValue = typeof data.status === 'string' 
        ? data.status.toUpperCase() 
        : data.status;
      updateData.status = statusValue;
    }
    
    if (data.rating !== undefined) {
      if (data.rating < 1 || data.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      updateData.rating = Number(data.rating);
    }
    if (data.comment !== undefined) updateData.comment = data.comment;
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    
    // Устанавливаем moderatorId и moderatedAt при изменении статуса
    if (data.moderatorId !== undefined) {
      updateData.moderatorId = data.moderatorId || null;
      const finalStatus = updateData.status || review.status;
      if (finalStatus === ReviewStatus.APPROVED || finalStatus === ReviewStatus.REJECTED) {
        updateData.moderatedAt = new Date();
      }
    }

    const updated = await this.prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        product: { select: { id: true, title: true, slug: true, images: true } },
        customer: { select: { id: true, name: true, email: true } },
        moderator: { select: { id: true, username: true, fullName: true } },
      },
    });

    return { success: true, data: updated };
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({ where: { id } });
    return { success: true, message: 'Review deleted successfully' };
  }
}

