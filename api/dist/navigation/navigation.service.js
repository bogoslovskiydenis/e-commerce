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
exports.NavigationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NavigationService = class NavigationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getNavigationItems(filters = {}) {
        const where = {};
        if (filters.parentId !== undefined)
            where.parentId = filters.parentId === 'null' ? null : filters.parentId;
        if (filters.type)
            where.type = filters.type;
        if (filters.isActive !== undefined)
            where.isActive = filters.isActive;
        const items = await this.prisma.navigationItem.findMany({
            where,
            include: {
                category: { select: { id: true, name: true, slug: true } },
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    include: { category: { select: { id: true, name: true, slug: true } } },
                },
                _count: { select: { children: true } },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return items.map(this.formatNavigationItem);
    }
    async getNavigationTree() {
        const items = await this.prisma.navigationItem.findMany({
            where: { parentId: null, isActive: true },
            include: {
                category: { select: { id: true, name: true, slug: true } },
                children: {
                    where: { isActive: true },
                    orderBy: { sortOrder: 'asc' },
                    include: {
                        category: { select: { id: true, name: true, slug: true } },
                        children: {
                            where: { isActive: true },
                            orderBy: { sortOrder: 'asc' },
                            include: { category: { select: { id: true, name: true, slug: true } } },
                        },
                    },
                },
            },
            orderBy: { sortOrder: 'asc' },
        });
        return items.map(this.formatNavigationItem);
    }
    async getNavigationItemById(id) {
        const item = await this.prisma.navigationItem.findUnique({
            where: { id },
            include: { category: true, parent: true, children: { orderBy: { sortOrder: 'asc' } } },
        });
        if (!item) {
            throw new common_1.NotFoundException('Navigation item not found');
        }
        return this.formatNavigationItem(item);
    }
    async createNavigationItem(data) {
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
    async updateNavigationItem(id, data) {
        const existing = await this.prisma.navigationItem.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Navigation item not found');
        }
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.url !== undefined)
            updateData.url = data.url;
        if (data.type !== undefined)
            updateData.type = data.type;
        if (data.categoryId !== undefined)
            updateData.categoryId = data.categoryId;
        if (data.parentId !== undefined)
            updateData.parentId = data.parentId;
        if (data.sortOrder !== undefined)
            updateData.sortOrder = data.sortOrder;
        if (data.isActive !== undefined)
            updateData.isActive = data.isActive;
        if (data.openInNew !== undefined)
            updateData.openInNew = data.openInNew;
        if (data.icon !== undefined)
            updateData.icon = data.icon;
        const item = await this.prisma.navigationItem.update({
            where: { id },
            data: updateData,
            include: { category: true, parent: true, children: { orderBy: { sortOrder: 'asc' } } },
        });
        return this.formatNavigationItem(item);
    }
    async reorderNavigationItems(items) {
        await this.prisma.$transaction(items.map((item) => this.prisma.navigationItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
        })));
        return { success: true };
    }
    async deleteNavigationItem(id) {
        const item = await this.prisma.navigationItem.findUnique({
            where: { id },
            include: { children: true },
        });
        if (!item) {
            throw new common_1.NotFoundException('Navigation item not found');
        }
        if (item.children.length > 0) {
            throw new common_1.BadRequestException('Cannot delete navigation item with children');
        }
        await this.prisma.navigationItem.delete({ where: { id } });
        return { success: true, message: 'Navigation item deleted' };
    }
    formatNavigationItem = (item) => {
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
            category: item.category,
            parent: item.parent,
            children: item.children?.map((child) => this.formatNavigationItem(child)),
            childrenCount: item._count?.children || 0,
        };
    };
};
exports.NavigationService = NavigationService;
exports.NavigationService = NavigationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NavigationService);
//# sourceMappingURL=navigation.service.js.map