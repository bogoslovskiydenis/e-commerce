import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async getPageBySlug(slug: string, lang?: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, isActive: true },
    });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    const data = this.localizePage(page, lang || 'uk');
    return { success: true, data };
  }

  private localizePage(page: any, lang: string) {
    const key = lang === 'ru' ? 'Ru' : lang === 'en' ? 'En' : 'Uk';
    return {
      id: page.id,
      slug: page.slug,
      title: page[`title${key}`] ?? page.title,
      content: page[`content${key}`] ?? page.content,
      excerpt: page[`excerpt${key}`] ?? page.excerpt ?? undefined,
      metaTitle: page[`metaTitle${key}`] ?? page.metaTitle ?? undefined,
      metaDescription: page[`metaDescription${key}`] ?? page.metaDescription ?? undefined,
      metaKeywords: page.metaKeywords ?? undefined,
      template: page.template ?? undefined,
      isActive: page.isActive,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }

  async getPageById(id: string) {
    const page = await this.prisma.page.findUnique({ where: { id } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return { success: true, data: page };
  }

  async getPages(query: any) {
    const { active } = query;
    const where: any = {};
    if (active !== undefined) where.isActive = active === 'true';

    const pages = await this.prisma.page.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
    });

    return { success: true, data: pages };
  }

  async createPage(data: any) {
    const page = await this.prisma.page.create({
      data: {
        ...data,
        template: data.template || 'default',
        isActive: data.isActive ?? true,
      },
    });

    return { success: true, data: page };
  }

  async updatePage(id: string, data: any) {
    const page = await this.prisma.page.update({
      where: { id },
      data,
    });

    return { success: true, data: page };
  }

  async deletePage(id: string) {
    await this.prisma.page.delete({ where: { id } });
    return { success: true, message: 'Page deleted successfully' };
  }
}
