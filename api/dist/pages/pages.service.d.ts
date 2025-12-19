import { PrismaService } from '../prisma/prisma.service';
export declare class PagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getPages(query: any): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            content: string;
            excerpt: string | null;
            template: string | null;
        }[];
    }>;
    createPage(data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            content: string;
            excerpt: string | null;
            template: string | null;
        };
    }>;
    updatePage(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            slug: string;
            metaTitle: string | null;
            metaDescription: string | null;
            metaKeywords: string | null;
            content: string;
            excerpt: string | null;
            template: string | null;
        };
    }>;
    deletePage(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
