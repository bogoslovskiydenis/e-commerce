export interface Product {
    id: string;
    title: string;
    brand?: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    category: string;
    categoryId: string;
    image?: string;
    images?: string[];
    description?: string;
    inStock: boolean;
    quantity?: number;
    featured?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCreateData {
    title: string;
    brand?: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    categoryId: string;
    image?: string;
    images?: string[];
    description?: string;
    inStock: boolean;
    quantity?: number;
    featured?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface ProductUpdateData {
    title?: string;
    brand?: string;
    price?: number;
    oldPrice?: number;
    discount?: number;
    categoryId?: string;
    image?: string;
    images?: string[];
    description?: string;
    inStock?: boolean;
    quantity?: number;
    featured?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    active: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface CategoryCreateData {
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    image?: string;
    active?: boolean;
    order?: number;
}

export interface CategoryUpdateData {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string;
    image?: string;
    active?: boolean;
    order?: number;
}