export declare class CreateProductDto {
    title: string;
    slug?: string;
    description?: string;
    shortDescription?: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    categoryId: string;
    brand?: string;
    sku?: string;
    images?: string[];
    attributes?: any;
    tags?: string[];
    isActive?: boolean;
    inStock?: boolean;
    stockQuantity?: number;
    featured?: boolean;
    weight?: number;
    dimensions?: any;
}
