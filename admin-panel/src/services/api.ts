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
    parent?: {
        id: string;
        name: string;
    } | null;
    children?: Category[];
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
            // Получаем все категории для управления навигацией (включая подкатегории)
            const data = await this.request('/categories?limit=100&sortBy=sortOrder&sortOrder=asc');
            const categories = data.data || [];
            
            // Трансформируем данные из API формата в формат Category
            return categories.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
                type: cat.type,
                showInNavigation: cat.showInNavigation !== undefined ? cat.showInNavigation : true,
                order: cat.sortOrder || 0,
                active: cat.isActive !== undefined ? cat.isActive : true,
                productsCount: cat.products?.length || cat._count?.products || 0,
                parentId: cat.parentId,
                parent: cat.parent ? {
                    id: cat.parent.id,
                    name: cat.parent.name
                } : null,
                children: cat.children || []
            }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }

    async updateCategoryNavigation(categoryId: string, updates: Partial<Category>) {
        // Трансформируем данные: order -> sortOrder, active -> isActive
        const apiUpdates: any = {};
        if (updates.showInNavigation !== undefined) {
            apiUpdates.showInNavigation = updates.showInNavigation;
        }
        if (updates.order !== undefined) {
            apiUpdates.sortOrder = updates.order;
        }
        if (updates.active !== undefined) {
            apiUpdates.isActive = updates.active;
        }
        
        return this.request(`/categories/${categoryId}`, {
            method: 'PUT',
            body: JSON.stringify(apiUpdates),
        });
    }
}

export const adminApiService = new AdminApiService();
