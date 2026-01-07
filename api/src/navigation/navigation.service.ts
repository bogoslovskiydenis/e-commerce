import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NavigationService {
  constructor(private prisma: PrismaService) {}

  // Вспомогательная функция для локализации категории в навигации
  private localizeCategory(category: any, lang: string = 'uk') {
    if (!category) return category;
    const localizedName = category[`name${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || category.name;
    return {
      ...category,
      name: localizedName,
    };
  }

  async getNavigationItems(filters: any = {}) {
    const { lang = 'uk', ...restFilters } = filters;
    const where: any = {};
    if (restFilters.parentId !== undefined) where.parentId = restFilters.parentId === 'null' ? null : restFilters.parentId;
    if (restFilters.type) where.type = restFilters.type;
    if (restFilters.isActive !== undefined) where.isActive = restFilters.isActive;

    const items = await this.prisma.navigationItem.findMany({
      where,
      include: {
        category: { 
          select: { 
            id: true, 
            name: true, 
            nameUk: true,
            nameRu: true,
            nameEn: true,
            slug: true, 
            parentId: true 
          } 
        },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: { 
            category: { 
              select: { 
                id: true, 
                name: true, 
                nameUk: true,
                nameRu: true,
                nameEn: true,
                slug: true, 
                parentId: true 
              } 
            } 
          },
        },
        _count: { select: { children: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return items.map(item => this.formatNavigationItem(item, lang));
  }

  async getNavigationTree(lang: string = 'uk') {
    const items = await this.prisma.navigationItem.findMany({
      where: { parentId: null, isActive: true },
      include: {
        category: { 
          select: { 
            id: true, 
            name: true, 
            nameUk: true,
            nameRu: true,
            nameEn: true,
            slug: true 
          } 
        },
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            category: { 
              select: { 
                id: true, 
                name: true, 
                nameUk: true,
                nameRu: true,
                nameEn: true,
                slug: true 
              } 
            },
            children: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              include: { 
                category: { 
                  select: { 
                    id: true, 
                    name: true, 
                    nameUk: true,
                    nameRu: true,
                    nameEn: true,
                    slug: true 
                  } 
                } 
              },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return items.map(item => this.formatNavigationItem(item, lang));
  }

  async getNavigationItemById(id: string) {
    const item = await this.prisma.navigationItem.findUnique({
      where: { id },
      include: { 
        category: { select: { id: true, name: true, slug: true, parentId: true } }, 
        parent: true, 
        children: { orderBy: { sortOrder: 'asc' } } 
      },
    });

    if (!item) {
      throw new NotFoundException('Navigation item not found');
    }

    return this.formatNavigationItem(item);
  }

  async createNavigationItem(data: any) {
    const maxOrder = await this.prisma.navigationItem.findFirst({
      where: { parentId: data.parentId || null },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const item = await this.prisma.navigationItem.create({
      data: {
        name: data.name,
        url: data.url || null,
        type: data.type || 'LINK',
        categoryId: data.categoryId || null,
        parentId: data.parentId || null,
        sortOrder: data.sortOrder ?? (maxOrder ? maxOrder.sortOrder + 1 : 0),
        isActive: data.isActive ?? true,
        openInNew: data.openInNew ?? false,
        icon: data.icon || null,
      },
      include: { category: true, parent: true },
    });

    return this.formatNavigationItem(item);
  }

  async updateNavigationItem(id: string, data: any) {
    const existing = await this.prisma.navigationItem.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Navigation item not found');
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.parentId !== undefined) updateData.parentId = data.parentId;
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.openInNew !== undefined) updateData.openInNew = data.openInNew;
    if (data.icon !== undefined) updateData.icon = data.icon;

    const item = await this.prisma.navigationItem.update({
      where: { id },
      data: updateData,
      include: { category: true, parent: true, children: { orderBy: { sortOrder: 'asc' } } },
    });

    return this.formatNavigationItem(item);
  }

  async reorderNavigationItems(items: Array<{ id: string; sortOrder: number }>) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.navigationItem.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );

    return { success: true };
  }

  async deleteNavigationItem(id: string) {
    const item = await this.prisma.navigationItem.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!item) {
      throw new NotFoundException('Navigation item not found');
    }

    if (item.children.length > 0) {
      throw new BadRequestException('Cannot delete navigation item with children');
    }

    await this.prisma.navigationItem.delete({ where: { id } });
    return { success: true, message: 'Navigation item deleted' };
  }

  private formatNavigationItem = (item: any, lang: string = 'uk') => {
    const localizedCategory = item.category ? this.localizeCategory(item.category, lang) : null;
    return {
      id: item.id,
      name: item.name,
      url: item.url,
      type: item.type.toLowerCase(),
      categoryId: item.categoryId,
      parentId: item.parentId,
      sortOrder: item.sortOrder,
      isActive: item.isActive,
      openInNew: item.openInNew,
      icon: item.icon,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      category: localizedCategory,
      parent: item.parent,
      children: item.children?.map((child: any) => this.formatNavigationItem(child, lang)),
      childrenCount: item._count?.children || 0,
    };
  };
}
