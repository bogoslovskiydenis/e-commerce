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
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    filters?: any;
    children?: Category[];
    productsCount: number;
    childrenCount: number;
    href?: string;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    imageUrl?: string;
    images?: string[];
    inStock: boolean;
    category?: Category;
    categoryId: string;
    colors?: string[];
    material?: string;
    withHelium?: boolean;
    size?: string;
    type?: string;
    items?: any[];
    featured?: boolean;
    new?: boolean;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                cache: 'no-store',
                ...options,
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            throw error;
        }
    }

    async getNavigationCategories(): Promise<Category[]> {
        try {
            const data = await this.request('/categories/navigation');
            return this.formatCategoriesForNavigation(data.data || data);
        } catch (error) {
            console.error('Error fetching navigation categories:', error);
            return this.getFallbackCategories();
        }
    }

    async getProductsByCategory(categorySlug: string, limit?: number): Promise<Product[]> {
        try {
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit.toString());
            params.append('active', 'true');

            const data = await this.request(`/products/category/${categorySlug}?${params.toString()}`);
            return data.data || [];
        } catch (error) {
            console.error(`Error fetching products for category ${categorySlug}:`, error);
            return [];
        }
    }

    async searchProducts(query: string, limit: number = 20): Promise<Product[]> {
        try {
            const data = await this.request(
                `/products/search?q=${encodeURIComponent(query)}&limit=${limit}`
            );
            return data.data || [];
        } catch (error) {
            console.error('Error searching products:', error);
            return [];
        }
    }

    async getFeaturedProducts(limit: number = 8, categoryType?: string): Promise<Product[]> {
        try {
            const params = new URLSearchParams();
            params.append('limit', limit.toString());
            if (categoryType) params.append('categoryType', categoryType);

            const data = await this.request(`/products/featured?${params.toString()}`);
            return data.data || [];
        } catch (error) {
            console.error('Error fetching featured products:', error);
            return [];
        }
    }

    private formatCategoriesForNavigation(categories: Category[]): Category[] {
        return categories
            .filter(cat => cat.active && cat.showInNavigation)
            .sort((a, b) => a.order - b.order)
            .map(category => ({
                ...category,
                href: this.getCategoryHref(category),
                children: category.children ? 
                    this.formatCategoriesForNavigation(category.children) : []
            }));
    }

    private getCategoryHref(category: Category): string {
        const typeMap: Record<string, string> = {
            'balloons': '/balloons',
            'bouquets': '/bouquets',
            'gifts': '/gifts',
            'cups': '/cups',
            'sets': '/sets',
            'events': '/events',
            'occasions': '/occasions'
        };

        const basePath = typeMap[category.type] || '/products';
        return category.slug ? `${basePath}/${category.slug}` : basePath;
    }

    private getFallbackCategories(): Category[] {
        return [
            {
                id: '1',
                name: 'Шарики',
                slug: 'balloons',
                type: 'balloons',
                active: true,
                showInNavigation: true,
                order: 1,
                productsCount: 245,
                childrenCount: 7,
                href: '/balloons',
                children: [
                    {
                        id: '1-1',
                        name: 'Фольгированные',
                        slug: 'foil',
                        type: 'balloons',
                        active: true,
                        showInNavigation: true,
                        order: 1,
                        productsCount: 120,
                        childrenCount: 0,
                        href: '/balloons/foil'
                    },
                    {
                        id: '1-2',
                        name: 'Латексные',
                        slug: 'latex',
                        type: 'balloons',
                        active: true,
                        showInNavigation: true,
                        order: 2,
                        productsCount: 87,
                        childrenCount: 0,
                        href: '/balloons/latex'
                    }
                ]
            },
            {
                id: '2',
                name: 'Букеты из шаров',
                slug: 'bouquets',
                type: 'bouquets',
                active: true,
                showInNavigation: true,
                order: 2,
                productsCount: 156,
                childrenCount: 4,
                href: '/bouquets'
            },
            {
                id: '3',
                name: 'Стаканчики',
                slug: 'cups',
                type: 'cups',
                active: true,
                showInNavigation: true,
                order: 3,
                productsCount: 95,
                childrenCount: 3,
                href: '/cups'
            },
            {
                id: '4',
                name: 'Подарки',
                slug: 'gifts',
                type: 'gifts',
                active: true,
                showInNavigation: true,
                order: 4,
                productsCount: 203,
                childrenCount: 4,
                href: '/gifts'
            },
            {
                id: '5',
                name: 'Наборы',
                slug: 'sets',
                type: 'sets',
                active: true,
                showInNavigation: true,
                order: 5,
                productsCount: 112,
                childrenCount: 4,
                href: '/sets'
            }
        ];
    }
}

export const apiService = new ApiService();
