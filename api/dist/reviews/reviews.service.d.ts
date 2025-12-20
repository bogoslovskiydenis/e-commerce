import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReviews(query: any): Promise<{
        success: boolean;
        data: ({
            customer: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            moderator: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            comment: string | null;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            customerId: string | null;
            productId: string;
            rating: number;
            moderatorId: string | null;
            moderatedAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getReviewById(id: string): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            moderator: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            comment: string | null;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            customerId: string | null;
            productId: string;
            rating: number;
            moderatorId: string | null;
            moderatedAt: Date | null;
        };
    }>;
    createReview(data: any): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
        } & {
            comment: string | null;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            customerId: string | null;
            productId: string;
            rating: number;
            moderatorId: string | null;
            moderatedAt: Date | null;
        };
    }>;
    updateReview(id: string, data: any): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
            };
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            moderator: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            comment: string | null;
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.ReviewStatus;
            customerId: string | null;
            productId: string;
            rating: number;
            moderatorId: string | null;
            moderatedAt: Date | null;
        };
    }>;
    deleteReview(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
