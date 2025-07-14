export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    imageUrl?: string;
    bannerUrl?: string;
    active: boolean;
    showInNavigation: boolean;
    order: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    type: CategoryType;
    filters?: CategoryFilters;
    createdAt: string;
    updatedAt: string;

    // Дополнительные поля для включения связанных данных
    productsCount?: number;
    childrenCount?: number;
    parent?: {
        id: string;
        name: string;
        slug: string;
    };
    children?: Category[];
}

export enum CategoryType {
    PRODUCTS = 'products',
    BALLOONS = 'balloons',
    GIFTS = 'gifts',
    EVENTS = 'events',
    COLORS = 'colors',
    MATERIALS = 'materials',
    OCCASIONS = 'occasions'
}

export interface CategoryFilters {
    allowColorFilter: boolean;
    allowMaterialFilter: boolean;
    allowPriceFilter: boolean;
    allowBrandFilter: boolean;
    allowSizeFilter: boolean;
    customFilters?: Array<{
        key: string;
        label: string;
        type: 'select' | 'checkbox' | 'range';
        options?: string[];
    }>;
}

export interface CategoryCreateData {
    name: string;
    slug: string;
    description?: string;
    type: CategoryType;
    parentId?: string;
    imageUrl?: string;
    bannerUrl?: string;
    active?: boolean;
    showInNavigation?: boolean;
    order?: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    filters?: CategoryFilters;
}

export interface CategoryUpdateData {
    name?: string;
    slug?: string;
    description?: string;
    type?: CategoryType;
    parentId?: string | null;
    imageUrl?: string | null;
    bannerUrl?: string | null;
    active?: boolean;
    showInNavigation?: boolean;
    order?: number;
    metaTitle?: string | null;
    metaDescription?: string | null;
    metaKeywords?: string | null;
    filters?: CategoryFilters;
}

export interface GetCategoriesOptions {
    page: number;
    limit: number;
    filters: {
        parentId?: string;
        active?: boolean;
        search?: string;
        type?: CategoryType;
    };
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export interface GetCategoriesResult {
    categories: Category[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface GetCategoriesTreeOptions {
    includeInactive?: boolean;
    type?: CategoryType;
}

export interface MoveCategoryOptions {
    newParentId?: string | null;
    newOrder?: number;
}

export interface DeleteCategoryOptions {
    moveProductsTo?: string;
}

export interface DeleteCategoryResult {
    success: boolean;
    error?: string;
}