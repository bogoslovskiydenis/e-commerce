import { useState, useEffect, useCallback } from 'react';
import { Category, Product, apiService } from '@/services/api';

export interface NavigationState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

export interface UseNavigationOptions {
    autoRefresh?: boolean;
    refreshInterval?: number; // в миллисекундах
    enableCache?: boolean;
    cacheTimeout?: number; // в миллисекундах
}

const DEFAULT_OPTIONS: UseNavigationOptions = {
    autoRefresh: true,
    refreshInterval: 5 * 60 * 1000, // 5 минут
    enableCache: true,
    cacheTimeout: 2 * 60 * 1000, // 2 минуты
};

const CACHE_KEY = 'navigation_categories';

export function useNavigation(options: UseNavigationOptions = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };

    const [state, setState] = useState<NavigationState>({
        categories: [],
        isLoading: true,
        error: null,
        lastUpdated: null
    });

    // Загрузка данных из кеша
    const loadFromCache = useCallback((): Category[] | null => {
        if (!config.enableCache || typeof window === 'undefined') return null;

        try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp > config.cacheTimeout!) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            return data;
        } catch (error) {
            console.error('Error loading navigation from cache:', error);
            return null;
        }
    }, [config.enableCache, config.cacheTimeout]);

    // Сохранение данных в кеш
    const saveToCache = useCallback((data: Category[]) => {
        if (!config.enableCache || typeof window === 'undefined') return;

        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving navigation to cache:', error);
        }
    }, [config.enableCache]);

    // Загрузка навигации
    const loadNavigation = useCallback(async (useCache: boolean = true) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Сначала пробуем загрузить из кеша
            if (useCache) {
                const cached = loadFromCache();
                if (cached) {
                    setState({
                        categories: cached,
                        isLoading: false,
                        error: null,
                        lastUpdated: new Date()
                    });
                    return cached;
                }
            }

            // Загружаем с сервера
            const categories = await apiService.getNavigationCategories();

            setState({
                categories,
                isLoading: false,
                error: null,
                lastUpdated: new Date()
            });

            // Сохраняем в кеш
            saveToCache(categories);

            return categories;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки навигации';
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));

            // Пробуем загрузить из кеша даже при ошибке
            const cached = loadFromCache();
            if (cached) {
                setState(prev => ({
                    ...prev,
                    categories: cached,
                    error: `${errorMessage} (показаны кешированные данные)`
                }));
            }

            throw error;
        }
    }, [loadFromCache, saveToCache]);

    // Принудительное обновление
    const refreshNavigation = useCallback(() => {
        return loadNavigation(false);
    }, [loadNavigation]);

    // Очистка кеша
    const clearCache = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(CACHE_KEY);
        }
    }, []);

    // Поиск категории по slug
    const findCategoryBySlug = useCallback((slug: string): Category | null => {
        const findInCategories = (categories: Category[]): Category | null => {
            for (const category of categories) {
                if (category.slug === slug) return category;
                if (category.children) {
                    const found = findInCategories(category.children);
                    if (found) return found;
                }
            }
            return null;
        };

        return findInCategories(state.categories);
    }, [state.categories]);

    // Получение хлебных крошек для категории
    const getBreadcrumbs = useCallback((categorySlug: string) => {
        const breadcrumbs: Array<{ name: string; href: string; current?: boolean }> = [
            { name: 'Главная', href: '/' }
        ];

        const findPath = (categories: Category[], path: Category[] = []): Category[] | null => {
            for (const category of categories) {
                const newPath = [...path, category];

                if (category.slug === categorySlug) {
                    return newPath;
                }

                if (category.children) {
                    const found = findPath(category.children, newPath);
                    if (found) return found;
                }
            }
            return null;
        };

        const path = findPath(state.categories);
        if (path) {
            path.forEach((category, index) => {
                breadcrumbs.push({
                    name: category.name,
                    href: category.href || `/${category.slug}`,
                    current: index === path.length - 1
                });
            });
        }

        return breadcrumbs;
    }, [state.categories]);

    // Автообновление
    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (config.autoRefresh && config.refreshInterval) {
            intervalId = setInterval(() => {
                loadNavigation(false).catch(console.error);
            }, config.refreshInterval);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [config.autoRefresh, config.refreshInterval, loadNavigation]);

    // Начальная загрузка
    useEffect(() => {
        loadNavigation().catch(console.error);
    }, []);

    return {
        // Состояние
        ...state,

        // Методы
        refresh: refreshNavigation,
        clearCache,
        findCategoryBySlug,
        getBreadcrumbs,

        // Утилиты
        isStale: state.lastUpdated ?
            Date.now() - state.lastUpdated.getTime() > config.cacheTimeout! : true
    };
}

// Хук для работы с продуктами категории
export function useCategoryProducts(categorySlug: string, options: { limit?: number } = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        if (!categorySlug) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await apiService.getProductsByCategory(categorySlug, options.limit);
            setProducts(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки товаров';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [categorySlug, options.limit]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        products,
        isLoading,
        error,
        refresh: loadProducts
    };
}

// Хук для поиска
export function useProductSearch() {
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const search = useCallback(async (query: string, limit: number = 20) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        setSearchError(null);

        try {
            const results = await apiService.searchProducts(query, limit);
            setSearchResults(results);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка поиска';
            setSearchError(errorMessage);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setSearchResults([]);
        setSearchError(null);
    }, []);

    return {
        searchResults,
        isSearching,
        searchError,
        search,
        clearSearch
    };
}