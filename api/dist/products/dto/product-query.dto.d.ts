export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class ProductQueryDto {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
}
