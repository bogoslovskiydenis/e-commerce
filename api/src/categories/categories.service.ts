import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async getCategories(query: any) {
    const { page = 1, limit = 50, parentId, active, search, type, sortBy = 'sortOrder', sortOrder = 'asc' } = query;
    // Преобразуем строковые значения в числа для Prisma
    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (active !== undefined) {
      where.isActive = active === 'true' || active === true;
    }

    if (parentId) {
      where.parentId = parentId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type) {
      where.type = type;
    }

    // Маппинг полей сортировки: 'order' -> 'sortOrder'
    const sortField = sortBy === 'order' ? 'sortOrder' : sortBy;
    const orderBy: any = {};
    orderBy[sortField] = sortOrder;

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: {
          parent: {
            select: { id: true, name: true, slug: true },
          },
          children: {
            select: { id: true, name: true, slug: true },
          },
          products: {
            select: { id: true },
            where: { isActive: true }
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      success: true,
      data: categories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getCategoriesTree() {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const tree = categories.filter((cat) => !cat.parentId);

    return {
      success: true,
      data: tree,
    };
  }

  async getNavigationCategories() {
    // Получаем только родительские категории с showInNavigation: true
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        showInNavigation: true,
        parentId: null, // Только родительские категории для навигации
      },
      include: {
        children: {
          where: { isActive: true, showInNavigation: true },
          orderBy: { sortOrder: 'asc' },
          include: {
            _count: {
              select: { products: true }
            }
          }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sortOrder: 'asc' },
    });

    // Добавляем информацию о количестве товаров в дочерних категориях
    const categoriesWithChildrenInfo = await Promise.all(
      categories.map(async (category) => {
        // Подсчитываем товары в дочерних категориях
        const childrenWithProducts = await this.prisma.category.findMany({
          where: {
            parentId: category.id,
            isActive: true,
            showInNavigation: true,
          },
          include: {
            _count: {
              select: { products: true }
            }
          }
        });

        const totalChildrenProducts = childrenWithProducts.reduce(
          (sum, child) => sum + child._count.products,
          0
        );

        // Добавляем количество товаров к каждой дочерней категории
        const childrenWithCounts = category.children.map(child => {
          const childData = childrenWithProducts.find(c => c.id === child.id);
          return {
            ...child,
            productsCount: childData?._count?.products || 0,
          };
        });

        return {
          ...category,
          children: childrenWithCounts,
          childrenProductsCount: totalChildrenProducts,
        };
      })
    );

    return {
      success: true,
      data: categoriesWithChildrenInfo,
    };
  }

  async getPopularCategories(limit: number = 5) {
    // Получаем только родительские категории с showOnHomepage: true
    const categories = await this.prisma.category.findMany({
      where: {
        isActive: true,
        showOnHomepage: true,
        parentId: null, // Только родительские категории
      },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      },
      orderBy: { sortOrder: 'asc' },
      take: limit,
    });

    // Форматируем категории с количеством товаров
    const formattedCategories = categories.map(category => ({
      ...category,
      productsCount: category._count.products,
    }));

    return {
      success: true,
      data: formattedCategories,
    };
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      data: category,
    };
  }

  async getCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      success: true,
      data: category,
    };
  }

  async createCategory(data: CreateCategoryDto) {
    if (data.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }

    const category = await this.prisma.category.create({
      data: {
        ...data,
        slug: data.slug || this.generateSlug(data.name),
      },
    });

    return {
      success: true,
      data: category,
    };
  }

  async updateCategory(id: string, data: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.parentId && data.parentId !== category.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: data.parentId },
      });

      if (!parent) {
        throw new BadRequestException('Parent category not found');
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data,
    });

    return {
      success: true,
      data: updated,
    };
  }

  async deleteCategory(id: string, force: boolean = false) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Проверяем наличие дочерних категорий
    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        `Cannot delete category: it has ${category.children.length} subcategories. Delete subcategories first or use force delete.`
      );
    }

    // Проверяем наличие товаров
    const productsCount = category._count?.products || 0;
    if (productsCount > 0 && !force) {
      throw new BadRequestException(
        `Cannot delete category: it has ${productsCount} products. Delete products first or use force delete.`
      );
    }

    // Если force=true, удаляем все товары категории
    if (force && productsCount > 0) {
      await this.prisma.product.deleteMany({
        where: { categoryId: id }
      });
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}


