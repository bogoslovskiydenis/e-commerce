import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    getReviews(query: any): Promise<{
        success: boolean;
        data: ({
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            customer: {
                id: string;
                name: string;
                email: string;
            };
            moderator: {
                id: string;
                username: string;
                fullName: string;
            };
        } & {
            id: string;
            productId: string;
            customerId: string | null;
            name: string;
            email: string | null;
            rating: number;
            comment: string | null;
            status: import(".prisma/client").$Enums.ReviewStatus;
            moderatorId: string | null;
            moderatedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
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
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            customer: {
                id: string;
                name: string;
                email: string;
            };
            moderator: {
                id: string;
                username: string;
                fullName: string;
            };
        } & {
            id: string;
            productId: string;
            customerId: string | null;
            name: string;
            email: string | null;
            rating: number;
            comment: string | null;
            status: import(".prisma/client").$Enums.ReviewStatus;
            moderatorId: string | null;
            moderatedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    createReview(data: any): Promise<{
        success: boolean;
        data: {
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            customer: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            productId: string;
            customerId: string | null;
            name: string;
            email: string | null;
            rating: number;
            comment: string | null;
            status: import(".prisma/client").$Enums.ReviewStatus;
            moderatorId: string | null;
            moderatedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    updateReview(id: string, data: any): Promise<{
        success: boolean;
        data: {
            product: {
                id: string;
                title: string;
                slug: string;
                images: string[];
            };
            customer: {
                id: string;
                name: string;
                email: string;
            };
            moderator: {
                id: string;
                username: string;
                fullName: string;
            };
        } & {
            id: string;
            productId: string;
            customerId: string | null;
            name: string;
            email: string | null;
            rating: number;
            comment: string | null;
            status: import(".prisma/client").$Enums.ReviewStatus;
            moderatorId: string | null;
            moderatedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    deleteReview(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
