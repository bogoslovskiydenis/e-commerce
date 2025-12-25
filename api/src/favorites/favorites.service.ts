import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  private isTableChecked = false;
  private tableCheckPromise: Promise<void> | null = null;

  constructor(private prisma: PrismaService) {
    this.tableCheckPromise = this.ensureFavoritesTable();
  }

  private async ensureFavoritesTable(): Promise<void> {
    if (this.isTableChecked) return;

    try {
      // Проверяем наличие таблицы favorites
      const result = await this.prisma.$queryRawUnsafe<any[]>(
        `SELECT table_name 
         FROM information_schema.tables 
         WHERE table_schema = 'public' AND table_name = 'favorites'`
      );

      if (result.length === 0) {
        // Таблица не существует, создаем её
        await this.prisma.$executeRawUnsafe(`
          CREATE TABLE IF NOT EXISTS favorites (
            id TEXT NOT NULL PRIMARY KEY,
            customer_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(customer_id, product_id)
          )
        `);

        // Создаем индексы
        await this.prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS favorites_customer_id_idx ON favorites(customer_id)
        `);
        await this.prisma.$executeRawUnsafe(`
          CREATE INDEX IF NOT EXISTS favorites_product_id_idx ON favorites(product_id)
        `);
      }

      this.isTableChecked = true;
    } catch (error) {
      console.error('Error ensuring favorites table:', error);
      this.isTableChecked = true;
    }
  }

  private async ensureTable() {
    if (this.tableCheckPromise) {
      await this.tableCheckPromise;
    } else {
      await this.ensureFavoritesTable();
    }
  }

  async getFavorites(customerId: string) {
    await this.ensureTable();
    const favorites = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT f.id, f.created_at as "createdAt",
              p.id as "id", p.title, p.slug, p.price, p.old_price as "oldPrice", 
              p.discount, p.images, p.in_stock as "inStock", p.stock_quantity as "stockQuantity",
              p.category_id as "categoryId", p.description, p.brand, p.sku
       FROM favorites f
       JOIN products p ON f.product_id = p.id
       WHERE f.customer_id = $1::text AND p.is_active = true
       ORDER BY f.created_at DESC`,
      customerId
    );

    // Преобразуем данные в формат Product
    const formattedFavorites = favorites.map((item) => ({
      id: item.id,
      title: item.title,
      name: item.title,
      price: Number(item.price),
      oldPrice: item.oldPrice ? Number(item.oldPrice) : undefined,
      discount: item.discount ? Number(item.discount) : undefined,
      images: item.images || [],
      image: item.images?.[0],
      inStock: item.inStock,
      stockQuantity: item.stockQuantity,
      categoryId: item.categoryId,
      category: item.categoryId,
      description: item.description,
      brand: item.brand,
      sku: item.sku,
      createdAt: item.createdAt,
    }));

    return {
      success: true,
      data: formattedFavorites,
    };
  }

  async addToFavorites(customerId: string, productId: string) {
    await this.ensureTable();
    // Проверяем существование товара
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Проверяем, не добавлен ли уже товар в избранное
    const existing = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM favorites WHERE customer_id = $1::text AND product_id = $2::text`,
      customerId,
      productId
    );

    if (existing.length > 0) {
      return {
        success: true,
        message: 'Product already in favorites',
        data: existing[0],
      };
    }

    // Добавляем в избранное
    const favoriteId = crypto.randomUUID();
    await this.prisma.$executeRawUnsafe(
      `INSERT INTO favorites (id, customer_id, product_id, created_at)
       VALUES ($1::text, $2::text, $3::text, NOW())`,
      favoriteId,
      customerId,
      productId
    );

    return {
      success: true,
      message: 'Product added to favorites',
      data: { id: favoriteId, customerId, productId },
    };
  }

  async removeFromFavorites(customerId: string, productId: string) {
    await this.ensureTable();
    const result = await this.prisma.$executeRawUnsafe(
      `DELETE FROM favorites WHERE customer_id = $1::text AND product_id = $2::text`,
      customerId,
      productId
    );

    return {
      success: true,
      message: 'Product removed from favorites',
    };
  }

  async isFavorite(customerId: string, productId: string): Promise<boolean> {
    await this.ensureTable();
    const result = await this.prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM favorites WHERE customer_id = $1::text AND product_id = $2::text`,
      customerId,
      productId
    );

    return result.length > 0;
  }

  async getFavoriteIds(customerId: string): Promise<string[]> {
    await this.ensureTable();
    const result = await this.prisma.$queryRawUnsafe<{ product_id: string }[]>(
      `SELECT product_id FROM favorites WHERE customer_id = $1::text`,
      customerId
    );

    return result.map((r) => r.product_id);
  }
}

