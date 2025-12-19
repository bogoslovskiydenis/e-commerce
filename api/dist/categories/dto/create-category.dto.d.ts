import { CategoryType } from '@prisma/client';
export declare class CreateCategoryDto {
    name: string;
    slug?: string;
    description?: string;
    type?: CategoryType;
    parentId?: string;
    imageUrl?: string;
    bannerUrl?: string;
    isActive?: boolean;
    showInNavigation?: boolean;
    sortOrder?: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    filters?: any;
}
