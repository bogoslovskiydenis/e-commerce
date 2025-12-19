import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
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
    getReview(id: string): Promise<{
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
    createReview(body: any): Promise<{
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
    updateReview(id: string, body: any): Promise<{
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
