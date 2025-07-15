// utils/dataProvider.ts - Исправленная версия

import { DataProvider, fetchUtils, DeleteParams, DeleteResult, RaRecord } from 'react-admin';

// API базовый URL
const API_BASE_URL = 'http://localhost:3001/api';

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

// ✅ ИСПРАВЛЕННАЯ функция конвертации параметров React Admin в API параметры
const convertRAParamsToAPI = (params: any) => {
    const { page, perPage, sort, filter } = params;
    const apiParams: any = {};

    // Пагинация
    if (page) apiParams.page = page;
    if (perPage) apiParams.limit = perPage;

    // Сортировка
    if (sort?.field) {
        apiParams.sortBy = sort.field;
        apiParams.sortOrder = sort.order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    }

    // ✅ ФИЛЬТРЫ - передаем как JSON строку
    if (filter && Object.keys(filter).length > 0) {
        // Очищаем пустые значения из фильтров
        const cleanedFilter = Object.fromEntries(
            Object.entries(filter).filter(([key, value]) => {
                if (value === null || value === undefined || value === '') return false;
                if (Array.isArray(value) && value.length === 0) return false;
                return true;
            })
        );

        if (Object.keys(cleanedFilter).length > 0) {
            apiParams.filter = JSON.stringify(cleanedFilter);
        }
    }

    console.log('🔄 Конвертация RA параметров:', { params, result: apiParams });

    return apiParams;
};

// Функция конвертации ответа API в формат React Admin
const convertAPIResponseToRA = (response: any, type: string) => {
    console.log('📥 API ответ:', { type, response });

    switch (type) {
        case 'getList':
            return {
                data: response.data || [],
                total: response.total || response.data?.length || 0
            };

        case 'getOne':
        case 'create':
        case 'update':
            return {
                data: response.data || response
            };

        case 'delete':
            return {
                data: response.data || response
            };

        default:
            return response;
    }
};

// ✅ ОСНОВНОЙ DATA PROVIDER
export const customDataProvider: DataProvider = {
    // ✅ ИСПРАВЛЕННЫЙ getList с правильной передачей фильтров
    getList: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('📋 getList вызов:', { resource, params });

        // Конвертируем параметры React Admin в API параметры
        const apiParams = convertRAParamsToAPI(params);

        // Формируем URL с параметрами
        const query = new URLSearchParams();
        Object.entries(apiParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.append(key, String(value));
            }
        });

        const url = `${API_BASE_URL}${endpoint}${query.toString() ? `?${query}` : ''}`;

        console.log('🌐 Запрос URL:', url);

        try {
            const { json } = await httpClient(url);
            const result = convertAPIResponseToRA(json, 'getList');

            console.log('✅ getList результат:', result);
            return result;
        } catch (error) {
            console.error('❌ Ошибка getList:', error);
            throw error;
        }
    },

    // Получить одну запись
    getOne: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;
        console.log('🔍 getOne URL:', url);

        try {
            const { json } = await httpClient(url);
            return convertAPIResponseToRA(json, 'getOne');
        } catch (error) {
            console.error('❌ Ошибка getOne:', error);
            throw error;
        }
    },

    // Получить несколько записей по ID
    getMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`)
        );

        try {
            const responses = await Promise.all(promises);
            const data = responses.map(({ json }) => json.data || json);
            return { data };
        } catch (error) {
            console.error('❌ Ошибка getMany:', error);
            throw error;
        }
    },

    // Получить несколько записей с фильтрацией
    getManyReference: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Добавляем целевой ID к фильтрам
        const filter = {
            ...params.filter,
            [params.target]: params.id
        };

        const apiParams = convertRAParamsToAPI({
            ...params,
            filter
        });

        const query = new URLSearchParams();
        Object.entries(apiParams).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.append(key, String(value));
            }
        });

        const url = `${API_BASE_URL}${endpoint}${query.toString() ? `?${query}` : ''}`;

        try {
            const { json } = await httpClient(url);
            return convertAPIResponseToRA(json, 'getList');
        } catch (error) {
            console.error('❌ Ошибка getManyReference:', error);
            throw error;
        }
    },

    // Создать запись
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

            return convertAPIResponseToRA(json, 'create');
        } catch (error) {
            console.error('❌ Ошибка create:', error);
            throw error;
        }
    },

    // Обновить запись
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

            return convertAPIResponseToRA(json, 'update');
        } catch (error) {
            console.error('❌ Ошибка update:', error);
            throw error;
        }
    },

    // Обновить несколько записей
    updateMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            })
        );

        await Promise.all(promises);
        return { data: params.ids };
    },

    // ✅ ИСПРАВЛЕННАЯ функция удаления
    delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('🗑️ delete вызов:', { resource, id: params.id });

        try {
            const { json } = await httpClient(`${API_BASE_URL}${endpoint}/${params.id}`, {
                method: 'DELETE',
            });

            return { data: params.previousData as RecordType };
        } catch (error) {
            console.error('❌ Ошибка delete:', error);
            throw error;
        }
    },

    // Удалить несколько записей
    deleteMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'DELETE',
            })
        );

        await Promise.all(promises);
        return { data: params.ids };
    },
};