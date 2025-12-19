import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

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
