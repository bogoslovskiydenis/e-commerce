// admin-panel/src/services/api.ts
export interface Category {
    id: string;
    name: string;
    slug: string;
    type: string;
    showInNavigation: boolean;
    order: number;
    active: boolean;
    productsCount?: number;
    parentId?: string;
}

class AdminApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const token = localStorage.getItem('auth_token');
        
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return response.json();
    }

    async getNavigationCategories(): Promise<Category[]> {
        try {
            const data = await this.request('/categories?sort=order');
            return data.data || [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Возвращаем тестовые данные если API недоступно
            return [
                {
                    id: '1',
                    name: 'Шарики',
                    slug: 'balloons',
                    type: 'balloons',
                    showInNavigation: true,
                    order: 1,
                    active: true,
                    productsCount: 245
                },
                {
                    id: '2', 
                    name: 'Букеты из шаров',
                    slug: 'bouquets',
                    type: 'bouquets',
                    showInNavigation: true,
                    order: 2,
                    active: true,
                    productsCount: 156
                },
                {
                    id: '3',
                    name: 'Подарки', 
                    slug: 'gifts',
                    type: 'gifts',
                    showInNavigation: false,
                    order: 3,
                    active: true,
                    productsCount: 203
                }
            ];
        }
    }

    async updateCategoryNavigation(categoryId: string, updates: Partial<Category>) {
        return this.request(`/categories/${categoryId}`, {
            method: 'PATCH',
            body: JSON.stringify(updates),
        });
    }
}

export const adminApiService = new AdminApiService();
