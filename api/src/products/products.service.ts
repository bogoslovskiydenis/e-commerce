import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: ProductQueryDto) {
    const { page = 1, limit = 25, sortBy = 'createdAt', sortOrder = 'desc', search, categoryId, featured, popular } = query;
    // Убеждаемся, что limit - это число
    const limitNum = Number(limit) || 25;
    const pageNum = Number(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      isActive: true, // Показываем только активные товары
    };

    if (search) {
      const searchLower = search.toLowerCase();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search, searchLower] } }, // Поиск по тегам
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured !== undefined) {
      where.featured = featured;
    }

    if (popular !== undefined) {
      where.popular = popular;
    }

    const orderBy: any = {};
    if (sortBy === 'price') {
      orderBy.price = sortOrder;
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      this.prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    // Логируем для отладки
    console.log('📦 Products API:', { 
      requestedLimit: limit, 
      actualLimit: limitNum, 
      returnedCount: products.length, 
      total, 
      page: pageNum 
    });

    return {
      success: true,
      data: products.map(this.formatProduct),
      pagination: {
        page: pageNum,
        limit: limitNum,
      total,
        totalPages,
      },
    };
  }

  async getProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return {
      success: true,
      data: this.formatProduct(product),
    };
  }

  async createProduct(data: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    const product = await this.prisma.product.create({
      data: {
        ...data,
        slug: this.generateSlug(data.title),
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return {
      success: true,
      data: this.formatProduct(product),
    };
  }

  async updateProduct(id: string, data: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product not found');
    }

    if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Category not found');
      }
    }

    // Очищаем данные от null, undefined, пустых строк и 0 для опциональных полей
    const updateData: any = {};
    
    // Копируем только определенные поля
    if (data.title !== undefined) updateData.title = data.title;
    if (data.slug !== undefined && data.slug !== '') updateData.slug = data.slug;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.sku !== undefined && data.sku !== null) updateData.sku = data.sku;
    if (data.images !== undefined) updateData.images = data.images;
    if (data.attributes !== undefined) updateData.attributes = data.attributes;
    if (data.tags !== undefined) updateData.tags = data.tags;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.inStock !== undefined) updateData.inStock = data.inStock;
    if (data.stockQuantity !== undefined) updateData.stockQuantity = data.stockQuantity;
    if (data.featured !== undefined) updateData.featured = data.featured;
    if (data.popular !== undefined) updateData.popular = data.popular;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    
    // Обрабатываем опциональные числовые поля
    if (data.oldPrice !== undefined) {
      updateData.oldPrice = (data.oldPrice === 0 || data.oldPrice === null) ? null : data.oldPrice;
    }
    if (data.discount !== undefined) {
      updateData.discount = (data.discount === 0 || data.discount === null) ? null : data.discount;
    }
    if (data.weight !== undefined) {
      updateData.weight = (data.weight === 0 || data.weight === null) ? null : data.weight;
    }
    if (data.dimensions !== undefined) {
      updateData.dimensions = data.dimensions;
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return {
      success: true,
      data: this.formatProduct(product),
    };
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }

  private formatProduct(product: any) {
    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: Number(product.price),
      oldPrice: product.oldPrice ? Number(product.oldPrice) : null,
      discount: product.discount ? Number(product.discount) : null,
      brand: product.brand,
      sku: product.sku,
      images: product.images,
      categoryId: product.categoryId,
      category: product.category,
      attributes: product.attributes,
      tags: product.tags,
      isActive: product.isActive,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      featured: product.featured,
      popular: product.popular,
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async getPopularSearchQueries(limit: number = 6): Promise<string[]> {
    // Пытаемся получить популярные запросы из Analytics
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const searchEvents = await this.prisma.analytics.findMany({
        where: {
          event: 'search',
          createdAt: { gte: last30Days },
        },
        select: {
          data: true,
        },
      });

      // Подсчитываем частоту запросов
      const queryCounts = new Map<string, number>();
      searchEvents.forEach((event) => {
        const query = (event.data as any)?.query;
        if (query && typeof query === 'string') {
          const normalizedQuery = query.toLowerCase().trim();
          queryCounts.set(normalizedQuery, (queryCounts.get(normalizedQuery) || 0) + 1);
        }
      });

      // Сортируем по частоте и возвращаем топ запросов
      const sortedQueries = Array.from(queryCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([query]) => query);

      // Если есть данные из Analytics, возвращаем их
      if (sortedQueries.length > 0) {
        return sortedQueries;
      }
    } catch (error) {
      console.error('Error getting popular queries from analytics:', error);
    }

    // Если нет данных в Analytics, возвращаем дефолтные популярные запросы
    // Можно настроить через Settings в будущем
    return [
      'фольгированные шары',
      'букеты из шаров',
      'день рождения',
      'свадебные шары',
      'детские наборы',
      'цифры из шаров',
    ].slice(0, limit);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}


