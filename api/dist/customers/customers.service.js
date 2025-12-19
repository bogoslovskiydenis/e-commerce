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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CustomersService = class CustomersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCustomers(query) {
        const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [customers, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    _count: { select: { orders: true, reviews: true, callbacks: true } },
                },
            }),
            this.prisma.customer.count({ where }),
        ]);
        return {
            success: true,
            data: customers,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        };
    }
    async getCustomerById(id) {
        const customer = await this.prisma.customer.findUnique({
            where: { id },
            include: {
                orders: { orderBy: { createdAt: 'desc' }, take: 10 },
                reviews: { orderBy: { createdAt: 'desc' }, take: 5 },
                callbacks: { orderBy: { createdAt: 'desc' }, take: 5 },
                _count: { select: { orders: true, reviews: true, callbacks: true } },
            },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer not found');
        }
        return { success: true, data: customer };
    }
    async createCustomer(data) {
        if (!data.name || !data.phone) {
            throw new common_1.BadRequestException('Name and phone are required');
        }
        const customer = await this.prisma.customer.create({
            data: { ...data, tags: data.tags || [], isActive: true },
        });
        return { success: true, data: customer };
    }
    async updateCustomer(id, data) {
        const customer = await this.prisma.customer.update({
            where: { id },
            data,
        });
        return { success: true, data: customer };
    }
    async deleteCustomer(id) {
        await this.prisma.customer.delete({ where: { id } });
        return { success: true, message: 'Customer deleted successfully' };
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map