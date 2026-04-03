import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavPromoCardsService {
  constructor(private prisma: PrismaService) {}

  async getPublicCards(categoryId?: string) {
    const where: any = { isActive: true };
    if (categoryId) where.categoryId = categoryId;

    const cards = await this.prisma.navPromoCard.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: cards };
  }

  async getCards(query: any) {
    const { categoryId, active } = query;
    const where: any = {};
    if (categoryId) where.categoryId = categoryId;
    if (active !== undefined) where.isActive = active === 'true';

    const cards = await this.prisma.navPromoCard.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: cards };
  }

  async getCard(id: string) {
    const card = await this.prisma.navPromoCard.findUnique({ where: { id } });
    if (!card) throw new NotFoundException(`NavPromoCard ${id} not found`);
    return { success: true, data: card };
  }

  async createCard(data: any) {
    const card = await this.prisma.navPromoCard.create({
      data: {
        title: data.title,
        titleUk: data.titleUk || null,
        titleRu: data.titleRu || null,
        subtitle: data.subtitle || null,
        subtitleUk: data.subtitleUk || null,
        subtitleRu: data.subtitleRu || null,
        emoji: data.emoji || null,
        imageUrl: data.imageUrl || null,
        link: data.link,
        linkText: data.linkText || null,
        linkTextUk: data.linkTextUk || null,
        linkTextRu: data.linkTextRu || null,
        colorTheme: data.colorTheme || 'teal',
        categoryId: data.categoryId || null,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
      },
    });
    return { success: true, data: card };
  }

  async updateCard(id: string, data: any) {
    const card = await this.prisma.navPromoCard.update({
      where: { id },
      data,
    });
    return { success: true, data: card };
  }

  async deleteCard(id: string) {
    await this.prisma.navPromoCard.delete({ where: { id } });
    return { success: true, message: 'Deleted' };
  }
}
