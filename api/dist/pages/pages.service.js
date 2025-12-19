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
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PagesService = class PagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPages(query) {
        const { active } = query;
        const where = {};
        if (active !== undefined)
            where.isActive = active === 'true';
        const pages = await this.prisma.page.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
        });
        return { success: true, data: pages };
    }
    async createPage(data) {
        const page = await this.prisma.page.create({
            data: {
                ...data,
                template: data.template || 'default',
                isActive: data.isActive ?? true,
            },
        });
        return { success: true, data: page };
    }
    async updatePage(id, data) {
        const page = await this.prisma.page.update({
            where: { id },
            data,
        });
        return { success: true, data: page };
    }
    async deletePage(id) {
        await this.prisma.page.delete({ where: { id } });
        return { success: true, message: 'Page deleted successfully' };
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagesService);
//# sourceMappingURL=pages.service.js.map