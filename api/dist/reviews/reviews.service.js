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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReviews(query) {
        const { page = 1, limit = 25, search, status, productId, customerId, rating, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { comment: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status)
            where.status = status;
        if (productId)
            where.productId = productId;
        if (customerId)
            where.customerId = customerId;
        if (rating)
            where.rating = Number(rating);
        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { [sortBy]: sortOrder },
                include: {
                    product: { select: { id: true, title: true, slug: true, images: true } },
                    customer: { select: { id: true, name: true, email: true } },
                    moderator: { select: { id: true, username: true, fullName: true } },
                },
            }),
            this.prisma.review.count({ where }),
        ]);
        return {
            success: true,
            data: reviews,
            pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        };
    }
    async getReviewById(id) {
        const review = await this.prisma.review.findUnique({
            where: { id },
            include: {
                product: { select: { id: true, title: true, slug: true, images: true } },
                customer: { select: { id: true, name: true, email: true } },
                moderator: { select: { id: true, username: true, fullName: true } },
            },
        });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        return { success: true, data: review };
    }
    async createReview(data) {
        const { productId, customerId, name, email, rating, comment } = data;
        if (!productId || !name || !rating) {
            throw new common_1.BadRequestException('ProductId, name and rating are required');
        }
        if (rating < 1 || rating > 5) {
            throw new common_1.BadRequestException('Rating must be between 1 and 5');
        }
        const review = await this.prisma.review.create({
            data: {
                productId,
                customerId: customerId || null,
                name,
                email: email || null,
                rating: Number(rating),
                comment: comment || null,
                status: client_1.ReviewStatus.PENDING,
            },
            include: {
                product: { select: { id: true, title: true, slug: true, images: true } },
                customer: { select: { id: true, name: true, email: true } },
            },
        });
        return { success: true, data: review };
    }
    async updateReview(id, data) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        const updateData = {};
        if (data.status !== undefined)
            updateData.status = data.status;
        if (data.rating !== undefined) {
            if (data.rating < 1 || data.rating > 5) {
                throw new common_1.BadRequestException('Rating must be between 1 and 5');
            }
            updateData.rating = Number(data.rating);
        }
        if (data.comment !== undefined)
            updateData.comment = data.comment;
        if (data.moderatorId !== undefined) {
            updateData.moderatorId = data.moderatorId || null;
            if (data.status === client_1.ReviewStatus.APPROVED || data.status === client_1.ReviewStatus.REJECTED) {
                updateData.moderatedAt = new Date();
            }
        }
        const updated = await this.prisma.review.update({
            where: { id },
            data: updateData,
            include: {
                product: { select: { id: true, title: true, slug: true, images: true } },
                customer: { select: { id: true, name: true, email: true } },
                moderator: { select: { id: true, username: true, fullName: true } },
            },
        });
        return { success: true, data: updated };
    }
    async deleteReview(id) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) {
            throw new common_1.NotFoundException('Review not found');
        }
        await this.prisma.review.delete({ where: { id } });
        return { success: true, message: 'Review deleted successfully' };
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map