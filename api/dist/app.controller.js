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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const permissions_guard_1 = require("./common/guards/permissions.guard");
const permissions_decorator_1 = require("./common/decorators/permissions.decorator");
let AppController = class AppController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getApiInfo() {
        return {
            success: true,
            message: 'Balloon Shop API',
            version: '1.0.0',
            endpoints: {
                auth: '/api/auth/*',
                admin: '/api/admin/*',
                categories: '/api/categories/*',
                products: '/api/products/*',
                orders: '/api/orders/*',
                customers: '/api/customers/*',
                banners: '/api/banners/*',
                pages: '/api/pages/*',
                settings: '/api/settings/*',
                navigation: '/api/navigation/*',
                adminLogs: '/api/admin/logs/*',
            },
        };
    }
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async getStats() {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const [totalUsers, totalOrders, totalProducts, totalCustomers, completedOrders, newUsers, ordersRevenue,] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.order.count(),
            this.prisma.product.count({ where: { isActive: true } }),
            this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
            this.prisma.order.count({ where: { status: client_1.OrderStatus.DELIVERED } }),
            this.prisma.user.count({ where: { createdAt: { gte: last30Days } } }),
            this.prisma.order.aggregate({
                where: { status: client_1.OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            success: true,
            data: {
                totalUsers,
                totalOrders,
                totalProducts,
                totalCustomers,
                revenue: ordersRevenue._sum.totalAmount ? Number(ordersRevenue._sum.totalAmount) : 0,
                newUsers,
                completedOrders,
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getApiInfo", null);
__decorate([
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    (0, permissions_decorator_1.RequirePermissions)('analytics.view'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getStats", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map