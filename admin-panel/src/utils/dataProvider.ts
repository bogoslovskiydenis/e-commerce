// admin-panel/src/utils/dataProvider.ts
import { DataProvider, fetchUtils, DeleteParams, DeleteResult, RaRecord } from 'react-admin';

const API_BASE_URL = 'http://localhost:3001/api';

const getAuthToken = () => localStorage.getItem('auth_token');

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

const RESOURCE_ENDPOINTS: Record<string, string> = {
    'products': '/products',
    'categories': '/categories',
    'orders': '/orders',
    'customers': '/customers',
    'callbacks': '/callbacks',
    'comments': '/comments',
    'reviews': '/reviews',
    'banners': '/banners',
    'pages': '/pages',
    'navigation': '/navigation',
    'settings': '/settings',
    'promotions': '/promotions',
    'coupons': '/coupons',
    'newsletters': '/newsletters',
    'admin-users': '/admin/users',
    'admin-logs': '/admin/logs',
    'api-keys': '/admin/api-keys',
    'analytics': '/analytics',
    'stats': '/stats',
};

const convertRAParamsToAPI = (params: any) => {
    const { page, perPage, sort, filter } = params;
    const apiParams: any = {};

    if (page) apiParams.page = page;
    if (perPage) apiParams.limit = perPage;

    if (sort?.field) {
        apiParams.sortBy = sort.field;
        apiParams.sortOrder = sort.order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    }

    if (filter) {
        Object.keys(filter).forEach(key => {
            if (filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
                apiParams[key] = filter[key];
            }
        });
    }

    console.log('🔄 Конвертация RA параметров:', { params, result: apiParams });
    return apiParams;
};

const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('📋 getList вызов:', { resource, params });

        const apiParams = convertRAParamsToAPI(params);
        const query = new URLSearchParams(apiParams as any).toString();
        const url = `${API_BASE_URL}${endpoint}?${query}`;

        console.log('🌐 Запрос URL:', url);

        try {
            const { json } = await httpClient(url);
            console.log('📥 API ответ:', { type: 'getList', response: json });

            const data = json.data || [];
            const total = json.total || json.pagination?.total || data.length;

            console.log('✅ getList результат:', { data, total });

            return {
                data,
                total,
            };
        } catch (error) {
            console.error('❌ Ошибка getList:', error);
            throw error;
        }
    },

    getOne: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('🔍 getOne вызов:', { resource, id: params.id });

        try {
            const { json } = await httpClient(`${API_BASE_URL}${endpoint}/${params.id}`);
            console.log('📥 API ответ getOne:', json);

            return { data: json.data || json };
        } catch (error) {
            console.error('❌ Ошибка getOne:', error);
            throw error;
        }
    },

    getMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('📚 getMany вызов:', { resource, ids: params.ids });

        try {
            const requests = params.ids.map(id =>
                httpClient(`${API_BASE_URL}${endpoint}/${id}`)
            );

            const responses = await Promise.all(requests);
            const data = responses.map(({ json }) => json.data || json);

            console.log('✅ getMany результат:', data);

            return { data };
        } catch (error) {
            console.error('❌ Ошибка getMany:', error);
            throw error;
        }
    },

    getManyReference: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('🔗 getManyReference вызов:', { resource, params });

        const apiParams = convertRAParamsToAPI(params);
        apiParams[params.target] = params.id;

        const query = new URLSearchParams(apiParams as any).toString();
        const url = `${API_BASE_URL}${endpoint}?${query}`;

        try {
            const { json } = await httpClient(url);

            return {
                data: json.data || [],
                total: json.total || json.pagination?.total || 0,
            };
        } catch (error) {
            console.error('❌ Ошибка getManyReference:', error);
            throw error;
        }
    },

    create: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('➕ create вызов:', { resource, data: params.data });

        try {
            const { json } = await httpClient(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(params.data),
            });

            console.log('✅ create результат:', json);

            // ИСПРАВЛЕНИЕ: правильный формат возврата
            return {
                data: {
                    ...json.data,
                    id: json.data?.id || json.id
                }
            };
        } catch (error) {
            console.error('❌ Ошибка create:', error);
            throw error;
        }
    },

    update: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('✏️ update вызов:', { resource, id: params.id, data: params.data });

        try {
            const { json } = await httpClient(`${API_BASE_URL}${endpoint}/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            });

            console.log('✅ update результат:', json);

            return { data: json.data || { ...params.data, id: params.id } };
        } catch (error) {
            console.error('❌ Ошибка update:', error);
            throw error;
        }
    },

    updateMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('✏️✏️ updateMany вызов:', { resource, ids: params.ids, data: params.data });

        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            })
        );

        try {
            await Promise.all(promises);
            return { data: params.ids };
        } catch (error) {
            console.error('❌ Ошибка updateMany:', error);
            throw error;
        }
    },

    delete: async <RecordType extends RaRecord = any>(
        resource: string,
        params: DeleteParams<RecordType>
    ): Promise<DeleteResult<RecordType>> => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('🗑️ delete вызов:', { resource, id: params.id, meta: params.meta });

        // Формируем URL с query параметрами из meta
        let url = `${API_BASE_URL}${endpoint}/${params.id}`;
        if (params.meta?.force) {
            url += `?force=${params.meta.force}`;
        }

        console.log('🌐 DELETE URL:', url);

        try {
            await httpClient(url, {
                method: 'DELETE',
            });

            return { data: params.previousData as RecordType };
        } catch (error) {
            console.error('❌ Ошибка delete:', error);
            throw error;
        }
    },

    deleteMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('🗑️🗑️ deleteMany вызов:', { resource, ids: params.ids });

        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'DELETE',
            })
        );

        try {
            await Promise.all(promises);
            return { data: params.ids };
        } catch (error) {
            console.error('❌ Ошибка deleteMany:', error);
            throw error;
        }
    },

    // ДОБАВЛЕНО: функция для получения статистики
    getStats: async () => {
        console.log('📊 getStats вызов');

        try {
            const { json } = await httpClient(`${API_BASE_URL}/stats`);
            console.log('✅ getStats результат:', json);

            return { data: json.data || {} };
        } catch (error) {
            console.warn('⚠️ Stats endpoint not implemented yet:', error);
            // Возвращаем пустые данные вместо ошибки
            return {
                data: {
                    totalOrders: 0,
                    totalRevenue: 0,
                    totalProducts: 0,
                    totalCustomers: 0
                }
            };
        }
    },
};

export default dataProvider;