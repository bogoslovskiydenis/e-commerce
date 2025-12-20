import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async getProducts(query: ProductQueryDto) {
    const { page = 1, limit = 25, sortBy = 'createdAt', sortOrder = 'desc', search, categoryId } = query;
    // Убеждаемся, что limit - это число
    const limitNum = Number(limit) || 25;
    const pageNum = Number(page) || 1;
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
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

    const product = await this.prisma.product.update({
      where: { id },
      data,
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
      weight: product.weight ? Number(product.weight) : null,
      dimensions: product.dimensions,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}

