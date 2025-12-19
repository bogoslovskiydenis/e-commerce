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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCategories(query) {
        const { page = 1, limit = 50, parentId, active, search, type, sortBy = 'sortOrder', sortOrder = 'asc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
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
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
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
                },
                orderBy,
                skip,
                take: limit,
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
        const categories = await this.prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true,
            },
            include: {
                children: {
                    where: { isActive: true, showInNavigation: true },
                    orderBy: { sortOrder: 'asc' },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return {
            success: true,
            data: categories,
        };
    }
    async getCategoryBySlug(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            success: true,
            data: category,
        };
    }
    async getCategoryById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return {
            success: true,
            data: category,
        };
    }
    async createCategory(data) {
        if (data.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: data.parentId },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
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
    async updateCategory(id, data) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (data.parentId && data.parentId !== category.parentId) {
            const parent = await this.prisma.category.findUnique({
                where: { id: data.parentId },
            });
            if (!parent) {
                throw new common_1.BadRequestException('Parent category not found');
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
    async deleteCategory(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return {
            success: true,
            message: 'Category deleted successfully',
        };
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map