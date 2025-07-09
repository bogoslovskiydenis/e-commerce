import { DataProvider, fetchUtils } from 'react-admin';

// API базовый URL
const API_BASE_URL = 'http://localhost:3000/api';

// Утилита для получения токена
const getAuthToken = () => localStorage.getItem('auth_token');

// Создаем HTTP клиент с автоматической авторизацией
const httpClient = (url: string, options: any = {}) => {
    const token = getAuthToken();

    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }

    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetchUtils.fetchJson(url, options);
};

// Маппинг ресурсов к API endpoints
const RESOURCE_ENDPOINTS: Record<string, string> = {
    // Основные ресурсы
    'products': '/products',
    'categories': '/categories',
    'orders': '/orders',
    'customers': '/customers',
    'callbacks': '/callbacks',
    'comments': '/comments',
    'reviews': '/reviews',

    // Контент и сайт
    'banners': '/banners',
    'pages': '/pages',
    'navigation': '/navigation',
    'settings': '/settings',

    // Промо и маркетинг
    'promotions': '/promotions',
    'coupons': '/coupons',
    'newsletters': '/newsletters',

    // Администрирование
    'admin-users': '/admin/users',
    'admin-logs': '/admin/logs',
    'api-keys': '/admin/api-keys',

    // Аналитика
    'analytics': '/analytics',
    'stats': '/stats',
};

// Функция конвертации параметров react-admin в API параметры
const convertRAParamsToAPI = (params: any) => {
    const { pagination, sort, filter } = params;

    const apiParams: any = {};

    // Пагинация
    if (pagination) {
        apiParams.page = pagination.page;
        apiParams.limit = pagination.perPage;
    }

    // Сортировка
    if (sort) {
        apiParams.sortBy = sort.field;
        apiParams.sortOrder = sort.order.toLowerCase();
    }

    // Фильтры
    if (filter) {
        Object.keys(filter).forEach(key => {
            if (filter[key] !== undefined && filter[key] !== '') {
                apiParams[key] = filter[key];
            }
        });
    }

    return apiParams;
};

// Функция конвертации ответа API в формат react-admin
const convertAPIResponseToRA = (response: any, type: string) => {
    if (!response.success) {
        throw new Error(response.message || 'API Error');
    }

    switch (type) {
        case 'getList':
        case 'getManyReference':
            return {
                data: response.data.items || response.data,
                total: response.data.total || response.data.length,
            };

        case 'getOne':
        case 'create':
        case 'update':
            return { data: response.data };

        case 'delete':
            return { data: { id: response.data.id } };

        case 'getMany':
            return { data: response.data };

        default:
            return response.data;
    }
};

// Основной DataProvider
export const apiDataProvider: DataProvider = {

    // Получить список записей
    getList: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const apiParams = convertRAParamsToAPI(params);
        const query = new URLSearchParams(apiParams).toString();
        const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

        console.log(`📋 Получение списка ${resource}:`, url);

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getList');
    },

    // Получить одну запись
    getOne: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;

        console.log(`📄 Получение записи ${resource}:`, url);

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getOne');
    },

    // Получить множество записей по ID
    getMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const ids = params.ids.join(',');
        const url = `${API_BASE_URL}${endpoint}?ids=${ids}`;

        console.log(`📋 Получение записей ${resource} по ID:`, url);

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getMany');
    },

    // Получить связанные записи
    getManyReference: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const apiParams = convertRAParamsToAPI(params);
        apiParams[params.target] = params.id;

        const query = new URLSearchParams(apiParams).toString();
        const url = `${API_BASE_URL}${endpoint}?${query}`;

        console.log(`🔗 Получение связанных записей ${resource}:`, url);

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getManyReference');
    },

    // Создать запись
    create: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}`;

        console.log(`➕ Создание записи ${resource}:`, params.data);

        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'create');
    },

    // Обновить запись
    update: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;

        console.log(`✏️ Обновление записи ${resource}:`, params.data);

        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'update');
    },

    // Частичное обновление записи
    updateMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/bulk`;

        console.log(`✏️ Массовое обновление ${resource}:`, params);

        await httpClient(url, {
            method: 'PATCH',
            body: JSON.stringify({
                ids: params.ids,
                data: params.data,
            }),
        });

        return { data: params.ids };
    },

    // Удалить запись
    delete: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;

        console.log(`🗑️ Удаление записи ${resource}:`, params.id);

        await httpClient(url, {
            method: 'DELETE',
        });

        // Используем previousData если доступно, иначе создаём минимальный объект
        return {
            data: params.previousData ?? { id: params.id } as any
        };
    },

    // Массовое удаление
    deleteMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/bulk`;

        console.log(`🗑️ Массовое удаление ${resource}:`, params.ids);

        await httpClient(url, {
            method: 'DELETE',
            body: JSON.stringify({ ids: params.ids }),
        });

        return { data: params.ids };
    },
} as DataProvider;

// Расширенный DataProvider с кастомными методами
export const customDataProvider = {
    ...apiDataProvider,

    // Получить статистику для дашборда
    getStats: async () => {
        try {
            const { json } = await httpClient(`${API_BASE_URL}/stats`);
            return json.data;
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalUsers: 0,
                totalOrders: 0,
                totalProducts: 0,
                revenue: 0,
                newUsers: 0,
                completedOrders: 0,
            };
        }
    },

    // Получить аналитику
    getAnalytics: async (params: {
        type: string;
        period?: string;
        startDate?: string;
        endDate?: string
    }) => {
        try {
            const query = new URLSearchParams(params).toString();
            const { json } = await httpClient(`${API_BASE_URL}/analytics?${query}`);
            return json.data;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            return {};
        }
    },

    // Обновить статус заказа
    updateOrderStatus: async (id: string, status: string) => {
        try {
            const { json } = await httpClient(`${API_BASE_URL}/orders/${id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            });
            return json.data;
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    },

    // Экспорт данных
    exportData: async (resource: string, params: any = {}) => {
        try {
            const endpoint = RESOURCE_ENDPOINTS[resource];
            if (!endpoint) {
                throw new Error(`Unknown resource: ${resource}`);
            }

            const apiParams = convertRAParamsToAPI(params);
            apiParams.export = 'true';
            apiParams.format = params.format || 'csv';

            const query = new URLSearchParams(apiParams).toString();
            const url = `${API_BASE_URL}${endpoint}/export?${query}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error('Export failed');
            }

            // Возвращаем Blob для скачивания
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);

            // Создаем ссылку для скачивания
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${resource}_export_${new Date().toISOString().split('T')[0]}.${params.format || 'csv'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(downloadUrl);

            return { success: true };
        } catch (error) {
            console.error('Error exporting data:', error);
            throw error;
        }
    },

    // Получить настройки сайта
    getSiteSettings: async () => {
        try {
            const { json } = await httpClient(`${API_BASE_URL}/settings`);
            return json.data;
        } catch (error) {
            console.error('Error fetching site settings:', error);
            return {};
        }
    },

    // Обновить настройки сайта
    updateSiteSettings: async (settings: any) => {
        try {
            const { json } = await httpClient(`${API_BASE_URL}/settings`, {
                method: 'PUT',
                body: JSON.stringify(settings),
            });
            return json.data;
        } catch (error) {
            console.error('Error updating site settings:', error);
            throw error;
        }
    },
};

export default customDataProvider;