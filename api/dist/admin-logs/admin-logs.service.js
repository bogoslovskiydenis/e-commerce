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
exports.AdminLogsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdminLogsService = class AdminLogsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getLogs(query) {
        const { page = 1, limit = 50, search, action, resource, level, userId, dateFrom, dateTo, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { description: { contains: search, mode: 'insensitive' } },
                { user: { username: { contains: search, mode: 'insensitive' } } },
                { user: { fullName: { contains: search, mode: 'insensitive' } } },
            ];
        }
        if (action)
            where.action = action;
        if (resource)
            where.resourceType = resource;
        if (level)
            where.level = level;
        if (userId)
            where.userId = userId;
        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom)
                where.createdAt.gte = new Date(dateFrom);
            if (dateTo)
                where.createdAt.lte = new Date(dateTo);
        }
        const [logs, total] = await Promise.all([
            this.prisma.adminLog.findMany({
                where,
                include: {
                    user: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
                },
                orderBy: { [sortBy]: sortOrder },
                skip,
                take: Number(limit),
            }),
            this.prisma.adminLog.count({ where }),
        ]);
        return {
            success: true,
            data: logs,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        };
    }
    async getLogById(id) {
        const log = await this.prisma.adminLog.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
            },
        });
        if (!log) {
            throw new common_1.NotFoundException('Log not found');
        }
        return { success: true, data: log };
    }
    async createLog(data) {
        const { userId, username, action, resourceType, resourceId, description, ip, userAgent, metadata, level = 'INFO' } = data;
        if (!userId || !username || !action || !resourceType || !description || !ip || !userAgent) {
            throw new Error('Missing required fields: userId, username, action, resourceType, description, ip, userAgent');
        }
        const log = await this.prisma.adminLog.create({
            data: {
                userId,
                username,
                action,
                resourceType,
                resourceId: resourceId || null,
                description,
                ip,
                userAgent,
                metadata: metadata || null,
                level,
            },
            include: {
                user: { select: { id: true, username: true, fullName: true, avatarUrl: true } },
            },
        });
        return { success: true, data: log };
    }
    async getLogStats(period = '7d') {
        const now = new Date();
        let startDate;
        switch (period) {
            case '1d':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
        const [totalLogs, logsByAction, logsByLevel, logsByUser, recentActivity] = await Promise.all([
            this.prisma.adminLog.count({ where: { createdAt: { gte: startDate } } }),
            this.prisma.adminLog.groupBy({
                by: ['action'],
                _count: { action: true },
                where: { createdAt: { gte: startDate } },
                orderBy: { _count: { action: 'desc' } },
            }),
            this.prisma.adminLog.groupBy({
                by: ['level'],
                _count: { level: true },
                where: { createdAt: { gte: startDate } },
            }),
            this.prisma.adminLog.groupBy({
                by: ['userId'],
                _count: { userId: true },
                where: { createdAt: { gte: startDate } },
                orderBy: { _count: { userId: 'desc' } },
                take: 10,
            }),
            this.prisma.adminLog.findMany({
                take: 20,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { username: true, fullName: true } } },
                where: { createdAt: { gte: startDate } },
            }),
        ]);
        const userIds = logsByUser.map((item) => item.userId);
        const users = await this.prisma.user.findMany({
            where: { id: { in: userIds } },
            select: { id: true, username: true, fullName: true },
        });
        const logsByUserWithDetails = logsByUser.map((item) => {
            const user = users.find((u) => u.id === item.userId);
            return {
                userId: item.userId,
                username: user?.username,
                fullName: user?.fullName,
                count: item._count.userId,
            };
        });
        return {
            success: true,
            data: {
                totalLogs,
                period,
                logsByAction: logsByAction.map((item) => ({ action: item.action, count: item._count.action })),
                logsByLevel: logsByLevel.map((item) => ({ level: item.level, count: item._count.level })),
                logsByUser: logsByUserWithDetails,
                recentActivity: recentActivity.map((log) => ({
                    id: log.id,
                    action: log.action,
                    resource: log.resourceType,
                    description: log.description,
                    username: log.user.username,
                    fullName: log.user.fullName,
                    createdAt: log.createdAt,
                })),
            },
        };
    }
};
exports.AdminLogsService = AdminLogsService;
exports.AdminLogsService = AdminLogsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminLogsService);
//# sourceMappingURL=admin-logs.service.js.map