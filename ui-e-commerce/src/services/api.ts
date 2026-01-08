// API Service для работы с бэкендом
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Типы данных
export interface Category {
    id: string;
    name: string;
    nameUk?: string;
    nameRu?: string;
    nameEn?: string;
    slug: string;
    description?: string;
    descriptionUk?: string;
    descriptionRu?: string;
    descriptionEn?: string;
    type: string;
    parentId?: string;
    imageUrl?: string;
    bannerUrl?: string;
    active: boolean;
    showInNavigation: boolean;
    order: number;
    href?: string;
    metaTitle?: string;
    metaTitleUk?: string;
    metaTitleRu?: string;
    metaTitleEn?: string;
    metaDescription?: string;
    metaDescriptionUk?: string;
    metaDescriptionRu?: string;
    metaDescriptionEn?: string;
    metaKeywords?: string;
    filters?: any;
    createdAt?: string;
    updatedAt?: string;
    productsCount?: number;
    childrenCount?: number;
    parent?: {
        id: string;
        name: string;
        nameUk?: string;
        nameRu?: string;
        nameEn?: string;
        slug: string;
    };
    children?: Category[];
}

export interface Product {
    id: string;
    title: string;
    name?: string;
    brand?: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    category?: string;
    categoryId?: string;
    image?: string;
    images?: string[];
    description?: string;
    inStock: boolean;
    quantity?: number;
    featured?: boolean;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export interface Customer {
    id: string;
    name: string;
    email?: string;
    phone: string;
    address?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerAuthResponse {
    customer: Customer;
    token: string;
    refreshToken: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    totalAmount: number;
    discountAmount: number;
    shippingAmount: number;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    total: number;
    product: {
        id: string;
        title: string;
        images: string[];
        price: number;
    };
}

export interface Banner {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    imageUrl: string;
    mobileImageUrl?: string;
    link?: string;
    buttonText?: string;
    position: 'MAIN' | 'CATEGORY' | 'SIDEBAR' | 'FOOTER' | 'POPUP';
    isActive: boolean;
    sortOrder: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
    updatedAt: string;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Получение текущего языка
    private getCurrentLanguage(): string {
        if (typeof window === 'undefined') return 'uk';
        return localStorage.getItem('language') || 'uk';
    }

    // Базовый метод для запросов
    private async request<T>(
        endpoint: string,
        options: RequestInit = {},
        skipAuth: boolean = false,
        addLang: boolean = true
    ): Promise<T> {
        let url = `${this.baseUrl}${endpoint}`;
        const token = !skipAuth && typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
        
        // Добавляем параметр языка к URL если требуется
        if (addLang) {
            const lang = this.getCurrentLanguage();
            const separator = endpoint.includes('?') ? '&' : '?';
            url = `${url}${separator}lang=${lang}`;
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Убеждаемся, что для публичных запросов Authorization не отправляется
        if (skipAuth && headers.Authorization) {
            delete headers.Authorization;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || errorData.error || `HTTP error! status: ${response.status}`;
                const error = new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
                (error as any).status = response.status;
                (error as any).data = errorData;
                throw error;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error);
            throw error;
        }
    }

    // ==================== КАТЕГОРИИ ====================

    /**
     * Получить все категории для навигации
     */
    async getNavigationCategories(lang?: string): Promise<Category[]> {
        try {
            const endpoint = lang ? `/categories/navigation?lang=${lang}` : '/categories/navigation';
            const response = await this.request<ApiResponse<Category[]>>(
                endpoint,
                {},
                true,
                !lang // Не добавляем lang автоматически если он передан вручную
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching navigation categories:', error);
            return [];
        }
    }

    /**
     * Получить категории по типу
     */
    async getCategoriesByType(type: string, lang?: string): Promise<Category[]> {
        try {
            const langParam = lang || this.getCurrentLanguage();
            const response = await this.request<ApiResponse<Category[]>>(
                `/categories?type=${type}&active=true&limit=100&lang=${langParam}`,
                {},
                true,
                false
            );
            return response.data || [];
        } catch (error) {
            console.error(`Error fetching categories by type ${type}:`, error);
            return [];
        }
    }

    /**
     * Получить все категории с фильтрами
     */
    async getCategories(params?: {
        page?: number;
        limit?: number;
        parentId?: string;
        active?: boolean;
        search?: string;
        type?: string;
        lang?: string;
    }): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.parentId) queryParams.append('parentId', params.parentId);
            if (params?.active !== undefined) queryParams.append('active', params.active.toString());
            if (params?.search) queryParams.append('search', params.search);
            if (params?.type) queryParams.append('type', params.type);
            if (params?.lang) queryParams.append('lang', params.lang);

            const response = await this.request<ApiResponse<Category[]>>(
                `/categories?${queryParams.toString()}`,
                {},
                true,
                !params?.lang // Не добавляем lang автоматически если он передан в params
            );

            return {
                categories: response.data || [],
                total: response.pagination?.total || 0,
                page: response.pagination?.page || 1,
                limit: response.pagination?.limit || 50
            };
        } catch (error) {
            console.error('Error fetching categories:', error);
            return { categories: [], total: 0, page: 1, limit: 50 };
        }
    }

    /**
     * Получить дерево категорий
     */
    async getCategoriesTree(params?: {
        includeInactive?: boolean;
        type?: string;
        lang?: string;
    }): Promise<Category[]> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.includeInactive) {
                queryParams.append('includeInactive', 'true');
            }
            if (params?.type) {
                queryParams.append('type', params.type);
            }
            if (params?.lang) {
                queryParams.append('lang', params.lang);
            }

            const response = await this.request<ApiResponse<Category[]>>(
                `/categories/tree?${queryParams.toString()}`,
                {},
                true,
                !params?.lang
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching categories tree:', error);
            return [];
        }
    }

    /**
     * Получить категорию по ID
     */
    async getCategoryById(id: string, lang?: string): Promise<Category | null> {
        try {
            const endpoint = lang ? `/categories/${id}?lang=${lang}` : `/categories/${id}`;
            const response = await this.request<ApiResponse<Category>>(
                endpoint,
                {},
                true,
                !lang
            );
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            return null;
        }
    }

    /**
     * Получить категорию по slug
     */
    async getCategoryBySlug(slug: string, lang?: string): Promise<Category | null> {
        try {
            const endpoint = lang ? `/categories/slug/${slug}?lang=${lang}` : `/categories/slug/${slug}`;
            const response = await this.request<ApiResponse<Category>>(
                endpoint,
                {},
                true,
                !lang
            );
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching category by slug ${slug}:`, error);
            return null;
        }
    }

    /**
     * Получить популярные категории для главной страницы
     */
    async getPopularCategories(limit: number = 5, lang?: string): Promise<Category[]> {
        try {
            const langParam = lang || this.getCurrentLanguage();
            const response = await this.request<ApiResponse<Category[]>>(
                `/categories/popular?limit=${limit}&lang=${langParam}`,
                {},
                true,
                false
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching popular categories:', error);
            return [];
        }
    }

    // ==================== ТОВАРЫ ====================

    /**
     * Получить все товары с фильтрами
     */
    async getProducts(params?: {
        page?: number;
        limit?: number;
        categoryId?: string;
        search?: string;
        featured?: boolean;
        inStock?: boolean;
        minPrice?: number;
        maxPrice?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        lang?: string;
    }): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
            if (params?.search) queryParams.append('search', params.search);
            if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
            if (params?.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
            if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
            if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
            if (params?.lang) queryParams.append('lang', params.lang);

            const response = await this.request<ApiResponse<Product[]>>(
                `/products?${queryParams.toString()}`,
                {},
                true,
                !params?.lang
            );

            return {
                products: response.data || [],
                total: response.pagination?.total || 0,
                page: response.pagination?.page || 1,
                limit: response.pagination?.limit || 20
            };
        } catch (error) {
            console.error('Error fetching products:', error);
            return { products: [], total: 0, page: 1, limit: 20 };
        }
    }

    /**
     * Получить товар по ID
     */
    async getProductById(id: string, lang?: string): Promise<Product | null> {
        try {
            const endpoint = lang ? `/products/${id}?lang=${lang}` : `/products/${id}`;
            const response = await this.request<ApiResponse<Product>>(
                endpoint,
                {},
                true,
                !lang
            );
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            return null;
        }
    }

    /**
     * Получить рекомендуемые товары
     */
    async getFeaturedProducts(limit: number = 8, lang?: string): Promise<Product[]> {
        try {
            const langParam = lang || this.getCurrentLanguage();
            const response = await this.request<ApiResponse<Product[]>>(
                `/products?featured=true&limit=${limit}&lang=${langParam}`,
                {},
                true,
                false
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }

    /**
     * Получить популярные товары
     */
    async getPopularProducts(limit: number = 8, lang?: string): Promise<Product[]> {
        try {
            const langParam = lang || this.getCurrentLanguage();
            const response = await this.request<ApiResponse<Product[]>>(
                `/products?popular=true&limit=${limit}&sortBy=createdAt&sortOrder=desc&lang=${langParam}`,
                {},
                true,
                false
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching popular products:', error);
            return [];
        }
    }

    /**
     * Получить товары по категории
     */
    async getProductsByCategory(categoryId: string, params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        lang?: string;
    }): Promise<{ products: Product[]; total: number }> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('categoryId', categoryId);

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
            if (params?.lang) queryParams.append('lang', params.lang);

            const response = await this.request<ApiResponse<Product[]>>(
                `/products?${queryParams.toString()}`,
                {},
                true,
                !params?.lang
            );

            return {
                products: response.data || [],
                total: response.pagination?.total || 0
            };
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
            return { products: [], total: 0 };
        }
    }

    /**
     * Поиск товаров
     */
    async searchProducts(query: string, limit: number = 20, lang?: string): Promise<Product[]> {
        try {
            const langParam = lang || this.getCurrentLanguage();
            const response = await this.request<ApiResponse<Product[]>>(
                `/products?search=${encodeURIComponent(query)}&limit=${limit}&lang=${langParam}`,
                {},
                true,
                false
            );
            return response.data || [];
        } catch (error) {
            console.error(`Error searching products with query "${query}":`, error);
            return [];
        }
    }

    /**
     * Получение популярных поисковых запросов
     */
    async getPopularSearchQueries(limit: number = 6): Promise<string[]> {
        try {
            const response = await this.request<ApiResponse<string[]>>(
                `/products/popular-queries?limit=${limit}`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error getting popular search queries:', error);
            // Возвращаем дефолтные запросы при ошибке
            return [
                'фольгированные шары',
                'букеты из шаров',
                'день рождения',
                'свадебные шары',
            ];
        }
    }

    // ==================== КЛИЕНТСКАЯ АВТОРИЗАЦИЯ ====================

    /**
     * Регистрация нового клиента
     */
    async registerCustomer(data: {
        name: string;
        email?: string;
        phone: string;
        password: string;
        address?: string;
    }): Promise<CustomerAuthResponse> {
        const response = await this.request<ApiResponse<CustomerAuthResponse>>(
            '/customers/auth/register',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
        
        // API может вернуть данные напрямую или в поле data
        if (response.data) {
            return response.data;
        }
        
        // Если данные пришли напрямую (без обертки)
        if (response.customer && response.token) {
            return response as CustomerAuthResponse;
        }
        
        throw new Error('Invalid response format from server');
    }

    /**
     * Вход клиента
     */
    async loginCustomer(phoneOrEmail: string, password: string): Promise<CustomerAuthResponse> {
        const response = await this.request<ApiResponse<CustomerAuthResponse>>(
            '/customers/auth/login',
            {
                method: 'POST',
                body: JSON.stringify({ phoneOrEmail, password }),
            }
        );
        
        // API может вернуть данные напрямую или в поле data
        if (response.data) {
            return response.data;
        }
        
        // Если данные пришли напрямую (без обертки)
        if (response.customer && response.token) {
            return response as CustomerAuthResponse;
        }
        
        throw new Error('Invalid response format from server');
    }

    /**
     * Обновление токена
     */
    async refreshCustomerToken(refreshToken: string): Promise<CustomerAuthResponse> {
        const response = await this.request<ApiResponse<CustomerAuthResponse>>(
            '/customers/auth/refresh',
            {
                method: 'POST',
                body: JSON.stringify({ refreshToken }),
            }
        );
        return response.data!;
    }

    /**
     * Получение профиля текущего клиента
     */
    async getCustomerProfile(): Promise<Customer> {
        const response = await this.request<ApiResponse<Customer>>(
            '/customers/auth/me'
        );
        return response.data!;
    }

    /**
     * Обновление профиля клиента
     */
    async updateCustomerProfile(data: Partial<Customer>): Promise<Customer> {
        const response = await this.request<ApiResponse<Customer>>(
            '/customers/auth/profile',
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
        return response.data!;
    }

    /**
     * Получение заказов клиента
     */
    async getCustomerOrders(params?: {
        page?: number;
        limit?: number;
    }): Promise<{ orders: Order[]; pagination: any }> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await this.request<ApiResponse<{ orders: Order[]; pagination: any }>>(
            `/customers/auth/orders?${queryParams.toString()}`
        );
        return response.data!;
    }

    /**
     * Создать заказ
     */
    async createOrder(data: {
        customer: {
            name: string;
            phone: string;
            email?: string;
        };
        items: Array<{
            productId: string;
            quantity: number;
            price: number;
        }>;
        shippingAddress?: {
            city?: string;
            street?: string;
            building?: string;
            apartment?: string;
            postalCode?: string;
        };
        notes?: string;
        discountAmount?: number;
        promotionCode?: string;
    }): Promise<Order> {
        const response = await this.request<ApiResponse<Order>>('/orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data!;
    }

    // ==================== ИЗБРАННОЕ ====================

    /**
     * Получить список избранных товаров
     */
    async getFavorites(lang?: string): Promise<Product[]> {
        const langParam = lang || this.getCurrentLanguage();
        const response = await this.request<ApiResponse<Product[]>>(
            `/favorites?lang=${langParam}`,
            {},
            false,
            false
        );
        return response.data || [];
    }

    /**
     * Добавить товар в избранное
     */
    async addToFavorites(productId: string): Promise<void> {
        await this.request<ApiResponse<void>>(`/favorites/${productId}`, {
            method: 'POST',
        });
    }

    /**
     * Удалить товар из избранного
     */
    async removeFromFavorites(productId: string): Promise<void> {
        await this.request<ApiResponse<void>>(`/favorites/${productId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Проверить, находится ли товар в избранном
     */
    async isFavorite(productId: string): Promise<boolean> {
        const response = await this.request<ApiResponse<{ isFavorite: boolean }>>(
            `/favorites/check/${productId}`
        );
        return response.data?.isFavorite || false;
    }

    /**
     * Получить список ID избранных товаров
     */
    async getFavoriteIds(): Promise<string[]> {
        const response = await this.request<ApiResponse<string[]>>('/favorites/ids');
        return response.data || [];
    }

    // ==================== БАННЕРЫ ====================

    /**
     * Получить баннеры по позиции (публичный endpoint)
     */
    async getBanners(position?: 'MAIN' | 'CATEGORY' | 'SIDEBAR' | 'FOOTER' | 'POPUP'): Promise<Banner[]> {
        try {
            const queryParams = position ? `?position=${position}` : '';
            const response = await this.request<ApiResponse<Banner[]>>(
                `/banners/public${queryParams}`,
                {},
                true // Публичный запрос без авторизации
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching banners:', error);
            return [];
        }
    }

    // ==================== НАСТРОЙКИ ====================

    /**
     * Получить публичные настройки (контакты)
     */
    async getPublicSettings(): Promise<{
        contact_phone?: string;
        contact_phone_2?: string;
        contact_email?: string;
        working_hours?: string;
    }> {
        try {
            const response = await this.request<ApiResponse<any>>(
                '/settings/public',
                {},
                true // Публичный запрос без авторизации
            );
            return response.data || {};
        } catch (error) {
            console.error('Error fetching public settings:', error);
            return {};
        }
    }

    // ==================== ОТЗЫВЫ ====================

    /**
     * Получить отзывы для товара (публичный endpoint)
     */
    async getProductReviews(productId: string, params?: {
        page?: number;
        limit?: number;
        rating?: number;
    }): Promise<{ reviews: Review[]; pagination: any }> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('productId', productId);
            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.rating) queryParams.append('rating', params.rating.toString());

            const response = await this.request<ApiResponse<Review[]>>(
                `/reviews/public?${queryParams.toString()}`,
                {},
                true // Публичный запрос без авторизации
            );
            return {
                reviews: response.data || [],
                pagination: response.pagination || { page: 1, limit: 25, total: 0, pages: 0 }
            };
        } catch (error) {
            console.error('Error fetching product reviews:', error);
            return { reviews: [], pagination: { page: 1, limit: 25, total: 0, pages: 0 } };
        }
    }

    /**
     * Создать отзыв
     */
    async createReview(data: {
        productId: string;
        customerId?: string;
        name: string;
        email?: string;
        rating: number;
        comment?: string;
    }): Promise<Review> {
        const response = await this.request<ApiResponse<Review>>('/reviews', {
            method: 'POST',
            body: JSON.stringify(data),
        });
        return response.data!;
    }

    // ==================== ПРОМОКОДЫ ====================

    /**
     * Получить промокод по коду (публичный endpoint)
     */
    async getPromotionByCode(code: string): Promise<Promotion | null> {
        try {
            const response = await this.request<ApiResponse<Promotion>>(
                `/promotions/public/${code}`,
                {},
                true // Публичный запрос без авторизации
            );
            return response.data || null;
        } catch (error: any) {
            console.error(`Error fetching promotion by code ${code}:`, error);
            throw error;
        }
    }
}

export interface Review {
    id: string;
    productId: string;
    customerId?: string;
    name: string;
    email?: string;
    rating: number;
    comment?: string;
    status?: string;
    createdAt: string;
    updatedAt?: string;
    product?: {
        id: string;
        title: string;
    };
}

export interface Promotion {
    id: string;
    name: string;
    description?: string;
    code?: string;
    type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'BUY_ONE_GET_ONE';
    value: number;
    minOrderAmount?: number;
    maxUsage?: number;
    usedCount: number;
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    products?: Array<{
        product: {
            id: string;
            title: string;
            slug: string;
        };
    }>;
}

// Экспортируем единственный экземпляр сервиса
export const apiService = new ApiService();

export default apiService;