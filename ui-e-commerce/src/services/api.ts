// API Service для работы с бэкендом
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Типы данных
export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    type: string;
    parentId?: string;
    imageUrl?: string;
    bannerUrl?: string;
    active: boolean;
    showInNavigation: boolean;
    order: number;
    href?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    filters?: any;
    createdAt?: string;
    updatedAt?: string;
    productsCount?: number;
    childrenCount?: number;
    parent?: {
        id: string;
        name: string;
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

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Базовый метод для запросов
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` }),
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
    async getNavigationCategories(): Promise<Category[]> {
        try {
            const response = await this.request<ApiResponse<Category[]>>(
                '/categories/navigation'
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
    async getCategoriesByType(type: string): Promise<Category[]> {
        try {
            const response = await this.request<ApiResponse<Category[]>>(
                `/categories?type=${type}&active=true&limit=100`
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
    }): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.parentId) queryParams.append('parentId', params.parentId);
            if (params?.active !== undefined) queryParams.append('active', params.active.toString());
            if (params?.search) queryParams.append('search', params.search);
            if (params?.type) queryParams.append('type', params.type);

            const response = await this.request<ApiResponse<Category[]>>(
                `/categories?${queryParams.toString()}`
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
    }): Promise<Category[]> {
        try {
            const queryParams = new URLSearchParams();

            if (params?.includeInactive) {
                queryParams.append('includeInactive', 'true');
            }
            if (params?.type) {
                queryParams.append('type', params.type);
            }

            const response = await this.request<ApiResponse<Category[]>>(
                `/categories/tree?${queryParams.toString()}`
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
    async getCategoryById(id: string): Promise<Category | null> {
        try {
            const response = await this.request<ApiResponse<Category>>(
                `/categories/${id}`
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
    async getCategoryBySlug(slug: string): Promise<Category | null> {
        try {
            const response = await this.request<ApiResponse<Category>>(
                `/categories/slug/${slug}`
            );
            return response.data || null;
        } catch (error) {
            console.error(`Error fetching category by slug ${slug}:`, error);
            return null;
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

            const response = await this.request<ApiResponse<Product[]>>(
                `/products?${queryParams.toString()}`
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
    async getProductById(id: string): Promise<Product | null> {
        try {
            const response = await this.request<ApiResponse<Product>>(
                `/products/${id}`
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
    async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
        try {
            const response = await this.request<ApiResponse<Product[]>>(
                `/products?featured=true&limit=${limit}`
            );
            return response.data || [];
        } catch (error) {
            console.error('Error fetching featured products:', error);
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
    }): Promise<{ products: Product[]; total: number }> {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('categoryId', categoryId);

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

            const response = await this.request<ApiResponse<Product[]>>(
                `/products?${queryParams.toString()}`
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
    async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
        try {
            const response = await this.request<ApiResponse<Product[]>>(
                `/products?search=${encodeURIComponent(query)}&limit=${limit}`
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

    // ==================== ИЗБРАННОЕ ====================

    /**
     * Получить список избранных товаров
     */
    async getFavorites(): Promise<Product[]> {
        const response = await this.request<ApiResponse<Product[]>>('/favorites');
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
}

// Экспортируем единственный экземпляр сервиса
export const apiService = new ApiService();

export default apiService;