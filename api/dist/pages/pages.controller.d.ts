import { PagesService } from './pages.service';
export declare class PagesController {
    private pagesService;
    constructor(pagesService: PagesService);
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
    createPage(body: any): Promise<{
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
    updatePage(id: string, body: any): Promise<{
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
