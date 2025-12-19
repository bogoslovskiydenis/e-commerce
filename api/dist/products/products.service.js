"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProducts(query) {
        const { page = 1, limit = 25, sortBy = 'createdAt', sortOrder = 'desc', search, categoryId } = query;
        const skip = (page - 1) * limit;
        const where = {};
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
        const orderBy = {};
        if (sortBy === 'price') {
            orderBy.price = sortOrder;
        }
        else if (sortBy === 'title') {
            orderBy.title = sortOrder;
        }
        else {
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
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            success: true,
            data: products.map(this.formatProduct),
            total,
        };
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: {
                    select: { id: true, name: true, slug: true },
                },
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return {
            success: true,
            data: this.formatProduct(product),
        };
    }
    async createProduct(data) {
        const category = await this.prisma.category.findUnique({
            where: { id: data.categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Category not found');
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
    async updateProduct(id, data) {
        const existingProduct = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!existingProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (data.categoryId && data.categoryId !== existingProduct.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: data.categoryId },
            });
            if (!category) {
                throw new common_1.BadRequestException('Category not found');
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
    async deleteProduct(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Product deleted successfully',
        };
    }
    formatProduct(product) {
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
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map