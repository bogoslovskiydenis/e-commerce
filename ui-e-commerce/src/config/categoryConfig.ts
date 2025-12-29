export interface CategoryConfig {
    title: string;
    description: string;
    seoTitle: string;
    seoDescription: string | string[];
    basePath: string;
    categoryType?: string;
    filters?: {
        colors?: boolean;
        materials?: boolean;
        price?: boolean;
        helium?: boolean;
        inStock?: boolean;
        volume?: boolean;
        giftTypes?: boolean;
    };
    sortOptions?: Array<{
        value: string;
        label: string;
    }>;
}

// Дефолтные опции сортировки
export const DEFAULT_SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'name-asc', label: 'По названию А-Я' },
    { value: 'name-desc', label: 'По названию Я-А' },
    { value: 'new', label: 'Новинки' },
];