import { useState, useEffect, useCallback } from 'react';
import { Category, Product, apiService } from '@/services/api';
import { getLocalizedCategoryName } from '@/utils/categoryLocalization';
import { useTranslation } from '@/contexts/LanguageContext';

export interface NavigationState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;
    lastUpdated: Date | null;
}

export interface UseNavigationOptions {
    autoRefresh?: boolean;
    refreshInterval?: number;
    enableCache?: boolean;
    cacheTimeout?: number;
}

const DEFAULT_OPTIONS: UseNavigationOptions = {
    autoRefresh: false,
    refreshInterval: 5 * 60 * 1000,
    enableCache: true,
    cacheTimeout: 2 * 60 * 1000,
};

const CACHE_KEY_PREFIX = 'navigation_categories';
const CACHE_VERSION = '5'; // Увеличиваем версию при изменении структуры навигации (добавлена поддержка языков)

export function useNavigation(options: UseNavigationOptions = {}) {
    const config = { ...DEFAULT_OPTIONS, ...options };
    const { language } = useTranslation();

    const [state, setState] = useState<NavigationState>({
        categories: [],
        isLoading: true,
        error: null,
        lastUpdated: null
    });

    // ИСПРАВЛЕНИЕ: SSR-безопасная функция кеширования с учетом языка
    const loadFromCache = useCallback((): Category[] | null => {
        if (!config.enableCache) return null;

        // Проверяем что мы на клиенте
        if (typeof window === 'undefined') return null;

        try {
            const CACHE_KEY = `${CACHE_KEY_PREFIX}_${language}`;
            const cached = localStorage.getItem(CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp, version } = JSON.parse(cached);
            
            // Проверяем версию кеша
            if (version !== CACHE_VERSION) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }
            
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
    }, [config.enableCache, config.cacheTimeout, language]);

    const saveToCache = useCallback((data: Category[]) => {
        if (!config.enableCache) return;

        // Проверяем что мы на клиенте
        if (typeof window === 'undefined') return;

        try {
            const CACHE_KEY = `${CACHE_KEY_PREFIX}_${language}`;
            const cacheData = {
                data,
                timestamp: Date.now(),
                version: CACHE_VERSION
            };
            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        } catch (error) {
            console.error('Error saving navigation to cache:', error);
        }
    }, [config.enableCache, language]);

    const loadNavigation = useCallback(async (useCache: boolean = true) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            // Только на клиенте пытаемся загрузить из кеша
            if (useCache && typeof window !== 'undefined') {
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

            // Загружаем с сервера с текущим языком
            const categories = await apiService.getNavigationCategories(language);

            setState({
                categories,
                isLoading: false,
                error: null,
                lastUpdated: new Date()
            });

            // Сохраняем в кеш только на клиенте
            if (typeof window !== 'undefined') {
                saveToCache(categories);
            }

            return categories;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки навигации';

            console.log('API недоступно, используем резервные данные');

            // Используем резервные данные при ошибке
            const fallbackCategories = await apiService.getNavigationCategories(language);

            setState({
                categories: fallbackCategories,
                isLoading: false,
                error: `${errorMessage} (резервные данные)`,
                lastUpdated: new Date()
            });

            return fallbackCategories;
        }
    }, [loadFromCache, saveToCache]);

    const refreshNavigation = useCallback(() => {
        return loadNavigation(false);
    }, [loadNavigation]);

    const clearCache = useCallback(() => {
        if (typeof window !== 'undefined') {
            // Очищаем кеш для всех языков
            ['uk', 'ru', 'en'].forEach(lang => {
                localStorage.removeItem(`${CACHE_KEY_PREFIX}_${lang}`);
            });
        }
    }, []);

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

    const getBreadcrumbs = useCallback((categorySlug: string, language: 'uk' | 'ru' | 'en' = 'uk') => {
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
                    name: getLocalizedCategoryName(category, language),
                    href: category.href || `/${category.slug}`,
                    current: index === path.length - 1
                });
            });
        }

        return breadcrumbs;
    }, [state.categories]);

    // ИСПРАВЛЕНИЕ: Загружаем только на клиенте и перезагружаем при смене языка
    useEffect(() => {
        if (typeof window !== 'undefined') {
            loadNavigation().catch(console.error);
        }
    }, [loadNavigation, language]);

    return {
        ...state,
        refresh: refreshNavigation,
        clearCache,
        findCategoryBySlug,
        getBreadcrumbs,
        isStale: state.lastUpdated ?
            Date.now() - state.lastUpdated.getTime() > config.cacheTimeout! : true
    };
}

export function useCategoryProducts(categorySlug: string, options: { limit?: number } = {}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        if (!categorySlug) {
            setProducts([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await apiService.getProductsByCategory(categorySlug, options.limit);
            setProducts(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка загрузки товаров';
            setError(errorMessage);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    }, [categorySlug, options.limit]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            loadProducts();
        }
    }, [loadProducts]);

    return {
        products,
        isLoading,
        error,
        refresh: loadProducts
    };
}

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