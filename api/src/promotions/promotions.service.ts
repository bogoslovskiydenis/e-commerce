import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto, UpdatePromotionDto } from './dto';
import { PromotionType } from '@prisma/client';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async getPromotions(query: any) {
    const { 
      isActive, 
      type, 
      search, 
      page = 1, 
      limit = 25, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = query;
    
    const where: any = {};

    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 25;
    const skip = (pageNum - 1) * limitNum;

    const orderBy: any = {};
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'name' || sortBy === 'code') {
      orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [promotions, total] = await Promise.all([
      this.prisma.promotion.findMany({
        where,
        include: {
          products: {
            include: {
              product: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      this.prisma.promotion.count({ where }),
    ]);

    return { 
      success: true, 
      data: promotions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };
  }

  async getPromotion(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
                price: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    return { success: true, data: promotion };
  }

  async getPromotionByCode(code: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with code ${code} not found`);
    }

    const now = new Date();
    if (!promotion.isActive) {
      throw new BadRequestException('Promotion is not active');
    }

    if (promotion.startDate && promotion.startDate > now) {
      throw new BadRequestException('Promotion has not started yet');
    }

    if (promotion.endDate && promotion.endDate < now) {
      throw new BadRequestException('Promotion has expired');
    }

    if (promotion.maxUsage && promotion.usedCount >= promotion.maxUsage) {
      throw new BadRequestException('Promotion usage limit exceeded');
    }

    return { success: true, data: promotion };
  }

  async createPromotion(data: CreatePromotionDto) {
    const { productIds, ...promotionData } = data;

    if (promotionData.code) {
      const existingPromotion = await this.prisma.promotion.findUnique({
        where: { code: promotionData.code },
      });

      if (existingPromotion) {
        throw new BadRequestException(`Promotion with code ${promotionData.code} already exists`);
      }
    }

    const promotion = await this.prisma.promotion.create({
      data: {
        ...promotionData,
        isActive: promotionData.isActive ?? true,
        startDate: promotionData.startDate ? new Date(promotionData.startDate) : null,
        endDate: promotionData.endDate ? new Date(promotionData.endDate) : null,
        products: productIds && productIds.length > 0
          ? {
              create: productIds.map((productId) => ({
                productId,
              })),
            }
          : undefined,
      },
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: promotion };
  }

  async updatePromotion(id: string, data: UpdatePromotionDto) {
    const { productIds, ...promotionData } = data;

    const existingPromotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    if (promotionData.code && promotionData.code !== existingPromotion.code) {
      const codeExists = await this.prisma.promotion.findUnique({
        where: { code: promotionData.code },
      });

      if (codeExists) {
        throw new BadRequestException(`Promotion with code ${promotionData.code} already exists`);
      }
    }

    const updateData: any = { ...promotionData };
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    if (productIds !== undefined) {
      await this.prisma.promotionProduct.deleteMany({
        where: { promotionId: id },
      });

      if (productIds.length > 0) {
        updateData.products = {
          create: productIds.map((productId) => ({
            productId,
          })),
        };
      }
    }

    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: updateData,
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return { success: true, data: promotion };
  }

  async deletePromotion(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    await this.prisma.promotion.delete({
      where: { id },
    });

    return { success: true, message: 'Promotion deleted successfully' };
  }

  async incrementUsage(id: string) {
    await this.prisma.promotion.update({
      where: { id },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    return { success: true };
  }
}

