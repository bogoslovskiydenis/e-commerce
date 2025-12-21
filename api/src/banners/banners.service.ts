import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BannersService {
  constructor(private prisma: PrismaService) {}

  async getBanners(query: any) {
    const { position, active } = query;
    const where: any = {};
    if (position) where.position = position;
    if (active !== undefined) where.isActive = active === 'true';

    const banners = await this.prisma.banner.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return { success: true, data: banners };
  }

  async getBanner(id: string) {
    const banner = await this.prisma.banner.findUnique({
      where: { id },
    });

    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }

    return { success: true, data: banner };
  }

  async createBanner(data: any) {
    const banner = await this.prisma.banner.create({
      data: {
        ...data,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder || 0,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return { success: true, data: banner };
  }

  async updateBanner(id: string, data: any) {
    const updateData = { ...data };
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

    const banner = await this.prisma.banner.update({
      where: { id },
      data: updateData,
    });

    return { success: true, data: banner };
  }

  async deleteBanner(id: string) {
    await this.prisma.banner.delete({ where: { id } });
    return { success: true, message: 'Banner deleted successfully' };
  }

  async uploadImage(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('File not provided');
    }

    const imageUrl = `/uploads/banners/${file.filename}`;
    return { success: true, data: { url: imageUrl, path: imageUrl } };
  }
}
