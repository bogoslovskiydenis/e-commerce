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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrders(query) {
        const { page = 1, limit = 25, search, status, paymentStatus, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { customer: { phone: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (status)
            where.status = status;
        if (paymentStatus)
            where.paymentStatus = paymentStatus;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    customer: true,
                    manager: { select: { id: true, fullName: true, username: true } },
                    items: { include: { product: { select: { id: true, title: true, images: true } } } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: Number(limit),
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            success: true,
            data: orders,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        };
    }
    async getOrderById(id) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                customer: true,
                manager: { select: { id: true, fullName: true, username: true } },
                items: { include: { product: true } },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return { success: true, data: order };
    }
    async updateOrderStatus(id, data, userId) {
        const updateData = {};
        if (data.status)
            updateData.status = data.status;
        if (data.paymentStatus)
            updateData.paymentStatus = data.paymentStatus;
        if (data.managerNotes)
            updateData.managerNotes = data.managerNotes;
        if (userId)
            updateData.managerId = userId;
        const order = await this.prisma.order.update({
            where: { id },
            data: updateData,
            include: {
                customer: true,
                manager: { select: { id: true, fullName: true } },
            },
        });
        return { success: true, data: order };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map