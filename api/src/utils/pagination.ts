export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: PaginationMeta;
    total: number;
}

/**
 * Создать объект пагинации для ответа API
 */
export const createPaginationResponse = (
    total: number,
    page: number = 1,
    limit: number = 20
): PaginationMeta => {
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
    };
};

/**
 * Валидация и нормализация параметров пагинации
 */
export const validatePaginationParams = (
    page?: string | number,
    limit?: string | number,
    maxLimit: number = 100
): PaginationParams => {
    let normalizedPage = 1;
    let normalizedLimit = 20;

    // Валидация page
    if (page !== undefined) {
        const pageNum = typeof page === 'string' ? parseInt(page, 10) : page;
        if (!isNaN(pageNum) && pageNum > 0) {
            normalizedPage = pageNum;
        }
    }

    // Валидация limit
    if (limit !== undefined) {
        const limitNum = typeof limit === 'string' ? parseInt(limit, 10) : limit;
        if (!isNaN(limitNum) && limitNum > 0) {
            normalizedLimit = Math.min(limitNum, maxLimit);
        }
    }

    return {
        page: normalizedPage,
        limit: normalizedLimit
    };
};

/**
 * Вычислить offset для базы данных
 */
export const calculateOffset = (page: number, limit: number): number => {
    return (page - 1) * limit;
};

/**
 * Создать параметры для Prisma
 */
export const createPrismaPageParams = (page: number, limit: number) => {
    return {
        skip: calculateOffset(page, limit),
        take: limit
    };
};

/**
 * Создать полный ответ с пагинацией
 */
export const createPaginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number
): PaginatedResponse<T> => {
    return {
        data,
        pagination: createPaginationResponse(total, page, limit),
        total
    };
};

/**
 * Типы для параметров сортировки
 */
export interface SortParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * Валидация параметров сортировки
 */
export const validateSortParams = (
    sortBy?: string,
    sortOrder?: string,
    allowedFields: string[] = []
): SortParams => {
    const result: SortParams = {};

    // Валидация поля сортировки
    if (sortBy && allowedFields.length > 0) {
        if (allowedFields.includes(sortBy)) {
            result.sortBy = sortBy;
        }
    } else if (sortBy) {
        result.sortBy = sortBy;
    }

    // Валидация направления сортировки
    if (sortOrder && ['asc', 'desc'].includes(sortOrder.toLowerCase())) {
        result.sortOrder = sortOrder.toLowerCase() as 'asc' | 'desc';
    }

    return result;
};

/**
 * Создать параметры сортировки для Prisma
 */
export const createPrismaOrderBy = (
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'desc',
    defaultSort: any = { createdAt: 'desc' }
): any => {
    if (!sortBy) {
        return defaultSort;
    }

    // Поддержка вложенных полей (например, 'category.name')
    if (sortBy.includes('.')) {
        const [relation, field] = sortBy.split('.');
        return {
            [relation]: {
                [field]: sortOrder
            }
        };
    }

    return {
        [sortBy]: sortOrder
    };
};

/**
 * Интерфейс для фильтрации
 */
export interface FilterParams {
    [key: string]: any;
}

/**
 * Создать where условие для Prisma из параметров фильтрации
 */
export const createPrismaWhereFromFilters = (
    filters: FilterParams,
    searchFields: string[] = []
): any => {
    const where: any = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') {
            return;
        }

        switch (key) {
            case 'search':
                if (searchFields.length > 0 && typeof value === 'string') {
                    where.OR = searchFields.map(field => ({
                        [field]: {
                            contains: value,
                            mode: 'insensitive'
                        }
                    }));
                }
                break;

            case 'active':
                if (typeof value === 'boolean' || value === 'true' || value === 'false') {
                    where.active = value === 'true' || value === true;
                }
                break;

            case 'inStock':
                if (typeof value === 'boolean' || value === 'true' || value === 'false') {
                    where.inStock = value === 'true' || value === true;
                }
                break;

            case 'categoryId':
                if (typeof value === 'string') {
                    where.categoryId = value;
                }
                break;

            case 'minPrice':
                if (typeof value === 'number' || !isNaN(parseFloat(value))) {
                    if (!where.price) where.price = {};
                    where.price.gte = parseFloat(value);
                }
                break;

            case 'maxPrice':
                if (typeof value === 'number' || !isNaN(parseFloat(value))) {
                    if (!where.price) where.price = {};
                    where.price.lte = parseFloat(value);
                }
                break;

            case 'minDiscount':
                if (typeof value === 'number' || !isNaN(parseFloat(value))) {
                    where.discount = {
                        gte: parseFloat(value)
                    };
                }
                break;

            case 'featured':
                if (typeof value === 'boolean' || value === 'true' || value === 'false') {
                    where.featured = value === 'true' || value === true;
                }
                break;

            case 'tags':
                if (Array.isArray(value)) {
                    where.tags = {
                        hasSome: value
                    };
                } else if (typeof value === 'string') {
                    where.tags = {
                        has: value
                    };
                }
                break;

            default:
                // Для остальных полей просто устанавливаем значение
                where[key] = value;
                break;
        }
    });

    return where;
};

/**
 * Извлечь параметры пагинации из запроса Express
 */
export const extractPaginationFromRequest = (req: any, maxLimit: number = 100) => {
    const { page, limit, sortBy, sortOrder, ...filters } = req.query;

    const paginationParams = validatePaginationParams(page, limit, maxLimit);
    const sortParams = validateSortParams(sortBy, sortOrder);

    return {
        pagination: paginationParams,
        sort: sortParams,
        filters
    };
};