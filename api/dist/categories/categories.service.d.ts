import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    getCategories(query: any): Promise<{
        success: boolean;
        data: ({
            parent: {
                id: string;
                name: string;
                slug: string;
            };
            children: {
                id: string;
                name: string;
                slug: string;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getCategoriesTree(): Promise<{
        success: boolean;
        data: ({
            children: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    getNavigationCategories(): Promise<{
        success: boolean;
        data: ({
            children: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
    }>;
    getCategoryBySlug(slug: string): Promise<{
        success: boolean;
        data: {
            parent: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            };
            children: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    getCategoryById(id: string): Promise<{
        success: boolean;
        data: {
            parent: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            };
            children: {
                description: string | null;
                id: string;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                slug: string;
                sortOrder: number;
                metaTitle: string | null;
                metaDescription: string | null;
                type: import(".prisma/client").$Enums.CategoryType;
                parentId: string | null;
                imageUrl: string | null;
                bannerUrl: string | null;
                showInNavigation: boolean;
                metaKeywords: string | null;
                filters: import("@prisma/client/runtime/library").JsonValue | null;
            }[];
        } & {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    createCategory(data: CreateCategoryDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    updateCategory(id: string, data: UpdateCategoryDto): Promise<{
        success: boolean;
        data: {
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            sortOrder: number;
            metaTitle: string | null;
            metaDescription: string | null;
            type: import(".prisma/client").$Enums.CategoryType;
            parentId: string | null;
            imageUrl: string | null;
            bannerUrl: string | null;
            showInNavigation: boolean;
            metaKeywords: string | null;
            filters: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    deleteCategory(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateSlug;
}
