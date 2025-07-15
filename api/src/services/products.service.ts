import { prisma } from '@/config/database';
import { ApiError } from '@/utils/apiError';
import { logger } from '@/utils/logger';
import { Product, ProductCreateData, ProductUpdateData } from '../types/';

export interface ProductFilters {
    category?: string;
    search?: string;
    inStock?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    minDiscount?: number;
}

export interface ProductsResult {
    products: Product[];
    total: number;
}

export class ProductsService {
    // Получить все товары с фильтрацией
    async getProducts(
        page: number = 1,
        limit: number = 20,
        filters: ProductFilters = {}
    ): Promise<ProductsResult> {
        const skip = (page - 1) * limit;

        // Построение условий фильтрации
        const where: any = {};

        if (filters.category) {
            where.categoryId = filters.category;
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
                { brand: { contains: filters.search, mode: 'insensitive' } }
            ];
        }

        if (filters.inStock !== undefined) {
            where.inStock = filters.inStock;
        }

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined) {
                where.price.gte = filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
                where.price.lte = filters.maxPrice;
            }
        }

        if (filters.minDiscount !== undefined) {
            where.discount = { gte: filters.minDiscount };
        }

        // Сортировка
        const orderBy: any = {};

        switch (filters.sortBy) {
            case 'price':
                orderBy.price = filters.sortOrder || 'asc';
                break;
            case 'discount':
                orderBy.discount = filters.sortOrder || 'desc';
                break;
            case 'title':
                orderBy.title = filters.sortOrder || 'asc';
                break;
            case 'createdAt':
            default:
                orderBy.createdAt = filters.sortOrder || 'desc';
                break;
        }

        try {
            const [products, total] = await Promise.all([
                prisma.product.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true,
                                slug: true
                            }
                        }
                    }
                }),
                prisma.product.count({ where })
            ]);

            return {
                products: products.map(this.formatProduct),
                total
            };
        } catch (error) {
            logger.error('Error getting products:', error);
            throw new ApiError(500, 'Failed to get products');
        }
    }

    // Получить товар по ID
    async getProductById(id: string): Promise<Product | null> {
        try {
            const product = await prisma.product.findUnique({
                where: { id },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return product ? this.formatProduct(product) : null;
        } catch (error) {
            logger.error(`Error getting product ${id}:`, error);
            throw new ApiError(500, 'Failed to get product');
        }
    }

    // Создать новый товар
    async createProduct(data: ProductCreateData): Promise<Product> {
        try {
            // Проверяем существование категории
            const category = await prisma.category.findUnique({
                where: { id: data.categoryId }
            });

            if (!category) {
                throw new ApiError(400, 'Category not found');
            }

            const product = await prisma.product.create({
                data: {
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return this.formatProduct(product);
        } catch (error) {
            logger.error('Error creating product:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to create product');
        }
    }

    // Обновить товар
    async updateProduct(id: string, data: ProductUpdateData): Promise<Product> {
        try {
            // Проверяем существование товара
            const existingProduct = await prisma.product.findUnique({
                where: { id }
            });

            if (!existingProduct) {
                throw new ApiError(404, 'Product not found');
            }

            // Если меняется категория, проверяем её существование
            if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
                const category = await prisma.category.findUnique({
                    where: { id: data.categoryId }
                });

                if (!category) {
                    throw new ApiError(400, 'Category not found');
                }
            }

            const product = await prisma.product.update({
                where: { id },
                data: {
                    ...data,
                    updatedAt: new Date()
                },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return this.formatProduct(product);
        } catch (error) {
            logger.error(`Error updating product ${id}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to update product');
        }
    }

    // Удалить товар
    async deleteProduct(id: string): Promise<void> {
        try {
            const product = await prisma.product.findUnique({
                where: { id }
            });

            if (!product) {
                throw new ApiError(404, 'Product not found');
            }

            await prisma.product.delete({
                where: { id }
            });
        } catch (error) {
            logger.error(`Error deleting product ${id}:`, error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, 'Failed to delete product');
        }
    }

    // Получить товары по категории
    async getProductsByCategory(
        categoryId: string,
        page: number = 1,
        limit: number = 20,
        sortBy: string = 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc'
    ): Promise<ProductsResult> {
        return this.getProducts(page, limit, {
            category: categoryId,
            sortBy,
            sortOrder
        });
    }

    // Поиск товаров
    async searchProducts(
        query: string,
        page: number = 1,
        limit: number = 20,
        filters: ProductFilters = {}
    ): Promise<ProductsResult> {
        return this.getProducts(page, limit, {
            ...filters,
            search: query,
            sortBy: 'relevance'
        });
    }

    // Получить популярные товары
    async getPopularProducts(limit: number = 10): Promise<Product[]> {
        try {
            // Здесь можно добавить логику определения популярности
            // Пока просто возвращаем последние товары
            const products = await prisma.product.findMany({
                take: limit,
                where: { inStock: true },
                orderBy: { createdAt: 'desc' },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return products.map(this.formatProduct);
        } catch (error) {
            logger.error('Error getting popular products:', error);
            throw new ApiError(500, 'Failed to get popular products');
        }
    }

    // Получить рекомендуемые товары
    async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                take: limit,
                where: {
                    inStock: true,
                    featured: true
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return products.map(this.formatProduct);
        } catch (error) {
            logger.error('Error getting featured products:', error);
            throw new ApiError(500, 'Failed to get featured products');
        }
    }

    // Получить товары со скидкой
    async getDiscountedProducts(
        page: number = 1,
        limit: number = 20,
        filters: ProductFilters = {}
    ): Promise<ProductsResult> {
        return this.getProducts(page, limit, {
            ...filters,
            minDiscount: filters.minDiscount || 1
        });
    }

    // Обновить статус товара
    async updateProductStock(
        id: string,
        inStock: boolean,
        quantity?: number
    ): Promise<Product> {
        try {
            const updateData: any = { inStock };
            if (quantity !== undefined) {
                updateData.quantity = quantity;
            }

            const product = await prisma.product.update({
                where: { id },
                data: updateData,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true
                        }
                    }
                }
            });

            return this.formatProduct(product);
        } catch (error) {
            logger.error(`Error updating product stock ${id}:`, error);
            throw new ApiError(500, 'Failed to update product stock');
        }
    }

    // Массовое обновление товаров
    async bulkUpdateProducts(products: Array<{ id: string; [key: string]: any }>): Promise<Product[]> {
        try {
            const updatePromises = products.map(async (productData) => {
                const { id, ...updateData } = productData;
                return this.updateProduct(id, updateData);
            });

            return await Promise.all(updatePromises);
        } catch (error) {
            logger.error('Error bulk updating products:', error);
            throw new ApiError(500, 'Failed to bulk update products');
        }
    }

    // Получить статистику товаров
    async getProductStats() {
        try {
            const [
                total,
                inStock,
                outOfStock,
                withDiscount,
                featured,
                avgPrice,
                categories
            ] = await Promise.all([
                prisma.product.count(),
                prisma.product.count({ where: { inStock: true } }),
                prisma.product.count({ where: { inStock: false } }),
                prisma.product.count({ where: { discount: { gt: 0 } } }),
                prisma.product.count({ where: { featured: true } }),
                prisma.product.aggregate({
                    _avg: { price: true }
                }),
                prisma.category.count()
            ]);

            return {
                total,
                inStock,
                outOfStock,
                withDiscount,
                featured,
                avgPrice: avgPrice._avg.price || 0,
                categories
            };
        } catch (error) {
            logger.error('Error getting product stats:', error);
            throw new ApiError(500, 'Failed to get product stats');
        }
    }

    // Форматирование товара для API
    private formatProduct(product: any): Product {
        return {
            id: product.id,
            title: product.title,
            brand: product.brand,
            price: product.price,
            oldPrice: product.oldPrice,
            discount: product.discount,
            category: product.category?.name || '',
            categoryId: product.categoryId,
            image: product.image,
            description: product.description,
            inStock: product.inStock,
            quantity: product.quantity,
            featured: product.featured,
            createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: product.updatedAt?.toISOString() || new Date().toISOString()
        };
    }
}