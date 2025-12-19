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
exports.CallbacksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CallbacksService = class CallbacksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCallbacks(query) {
        const { page = 1, limit = 25, search, status, priority, managerId, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        if (priority)
            where.priority = priority;
        if (managerId)
            where.managerId = managerId;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [callbacks, total] = await Promise.all([
            this.prisma.callback.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    customer: { select: { id: true, name: true, email: true, phone: true } },
                    manager: { select: { id: true, username: true, fullName: true } },
                },
            }),
            this.prisma.callback.count({ where }),
        ]);
        return {
            success: true,
            data: callbacks,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        };
    }
    async getCallbackById(id) {
        const callback = await this.prisma.callback.findUnique({
            where: { id },
            include: {
                customer: { select: { id: true, name: true, email: true, phone: true } },
                manager: { select: { id: true, username: true, fullName: true } },
            },
        });
        if (!callback) {
            throw new common_1.NotFoundException('Callback not found');
        }
        return { success: true, data: callback };
    }
    async createCallback(data) {
        const { customerId, name, phone, email, message, status, priority, source, scheduledAt } = data;
        if (!name || !phone) {
            throw new common_1.BadRequestException('Name and phone are required');
        }
        const callback = await this.prisma.callback.create({
            data: {
                customerId: customerId || null,
                name,
                phone,
                email: email || null,
                message: message || null,
                status: status || client_1.CallbackStatus.NEW,
                priority: priority || client_1.CallbackPriority.MEDIUM,
                source: source || 'website',
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            },
            include: {
                customer: { select: { id: true, name: true, email: true, phone: true } },
                manager: { select: { id: true, username: true, fullName: true } },
            },
        });
        return { success: true, data: callback };
    }
    async updateCallback(id, data) {
        const callback = await this.prisma.callback.findUnique({ where: { id } });
        if (!callback) {
            throw new common_1.NotFoundException('Callback not found');
        }
        const updateData = {};
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.priority !== undefined)
            updateData.priority = data.priority;
        if (data.managerId !== undefined)
            updateData.managerId = data.managerId || null;
        if (data.scheduledAt !== undefined)
            updateData.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        if (data.message !== undefined)
            updateData.message = data.message;
        if (data.status === client_1.CallbackStatus.COMPLETED && !callback.completedAt) {
            updateData.completedAt = new Date();
        }
        const updated = await this.prisma.callback.update({
            where: { id },
            data: updateData,
            include: {
                customer: { select: { id: true, name: true, email: true, phone: true } },
                manager: { select: { id: true, username: true, fullName: true } },
            },
        });
        return { success: true, data: updated };
    }
    async deleteCallback(id) {
        const callback = await this.prisma.callback.findUnique({ where: { id } });
        if (!callback) {
            throw new common_1.NotFoundException('Callback not found');
        }
        await this.prisma.callback.delete({ where: { id } });
        return { success: true, message: 'Callback deleted successfully' };
    }
};
exports.CallbacksService = CallbacksService;
exports.CallbacksService = CallbacksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CallbacksService);
//# sourceMappingURL=callbacks.service.js.map