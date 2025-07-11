import { DataProvider, fetchUtils, DeleteParams, Identifier } from 'react-admin';

// API базовый URL - исправляем на правильный порт
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
        throw new Error(response.error || 'API Error');
    }

    switch (type) {
        case 'getList':
            return {
                data: response.data || [],
                total: response.pagination?.total || response.data?.length || 0
            };
        case 'getOne':
        case 'create':
        case 'update':
            return { data: response.data };
        case 'getMany':
            return { data: response.data || [] };
        case 'delete':
            return { data: { id: response.id } };
        default:
            return response;
    }
};

// Специальные операции для admin-users
const handleAdminUserOperations = async (resource: string, params: any) => {
    const { meta } = params;

    if (resource === 'admin-users' && meta?.operation) {
        switch (meta.operation) {
            case 'changePassword':
                const { json: passwordResponse } = await httpClient(
                    `${API_BASE_URL}/admin/users/${params.id}/change-password`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ newPassword: meta.newPassword }),
                    }
                );
                return { data: passwordResponse.data };

            case 'toggleStatus':
                const { json: statusResponse } = await httpClient(
                    `${API_BASE_URL}/admin/users/${params.id}/toggle-status`,
                    {
                        method: 'POST',
                    }
                );
                return { data: statusResponse.data };

            case 'getRolesAndPermissions':
                const { json: rolesResponse } = await httpClient(
                    `${API_BASE_URL}/admin/users/system/roles-and-permissions`
                );
                return { data: rolesResponse.data };

            case 'bulkOperation':
                const { json: bulkResponse } = await httpClient(
                    `${API_BASE_URL}/admin/users/bulk`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            userIds: meta.userIds,
                            operation: meta.bulkOperation
                        }),
                    }
                );
                return { data: bulkResponse.data };

            default:
                throw new Error(`Unknown admin-users operation: ${meta.operation}`);
        }
    }

    return null;
};

// Основной data provider
export const customDataProvider: DataProvider = {
    // Получить список записей
    getList: async (resource, params) => {
        // Проверяем специальные операции
        const specialOperation = await handleAdminUserOperations(resource, params);
        if (specialOperation) return specialOperation;

        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const apiParams = convertRAParamsToAPI(params);
        const query = new URLSearchParams(apiParams).toString();
        const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

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
        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getOne');
    },

    // Получить несколько записей по ID
    getMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Делаем несколько запросов для каждого ID
        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`)
        );

        const responses = await Promise.all(promises);
        const data = responses.map(({ json }) => json.data);

        return { data };
    },

    // Получить несколько записей с фильтрацией
    getManyReference: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const apiParams = convertRAParamsToAPI(params);
        // Добавляем фильтр по reference
        apiParams[params.target] = params.id;

        const query = new URLSearchParams(apiParams).toString();
        const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getList');
    },

    // Создать запись - ОБНОВЛЕННАЯ ВЕРСИЯ С ОТЛАДКОЙ
    create: async (resource, params) => {
        console.log('🔍 DataProvider CREATE called:', {
            resource,
            params: JSON.stringify(params, null, 2)
        });

        // Проверяем специальные операции
        const specialOperation = await handleAdminUserOperations(resource, params);
        if (specialOperation) return specialOperation;

        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Специальная обработка для товаров
        if (resource === 'products') {
            console.log('🛍️ Product creation data:', params.data);

            // Убедимся что все поля правильно передаются
            const productData = {
                title: params.data.title,
                price: parseFloat(params.data.price) || 0,
                oldPrice: params.data.oldPrice ? parseFloat(params.data.oldPrice) : null,
                brand: params.data.brand || null,
                sku: params.data.sku || null,
                description: params.data.description || null,
                categoryId: params.data.categoryId,
                isActive: params.data.isActive !== false, // default true
                inStock: params.data.inStock !== false,   // default true
                stockQuantity: parseInt(params.data.stockQuantity) || 0,
                images: params.data.images || []
            };

            console.log('🔧 Transformed product data:', productData);

            const url = `${API_BASE_URL}${endpoint}`;
            const { json } = await httpClient(url, {
                method: 'POST',
                body: JSON.stringify(productData),
            });

            return convertAPIResponseToRA(json, 'create');
        }

        // Обычная обработка для других ресурсов
        const url = `${API_BASE_URL}${endpoint}`;
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'create');
    },

    // Обновить запись
    update: async (resource, params) => {
        // Проверяем специальные операции
        const specialOperation = await handleAdminUserOperations(resource, params);
        if (specialOperation) return specialOperation;

        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'update');
    },

    // Частично обновить запись
    updateMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Обновляем каждую запись отдельно
        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(params.data),
            })
        );

        await Promise.all(promises);
        return { data: params.ids };
    },

    // Удалить запись - исправляем тип возврата
    delete: async <RecordType extends { id: Identifier }>(resource: string, params: DeleteParams<RecordType>) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;
        await httpClient(url, {
            method: 'DELETE',
        });

        // Возвращаем правильный тип
        return {
            data: {
                ...params.previousData,
                id: params.id
            } as RecordType
        };
    },

    // Удалить несколько записей
    deleteMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Удаляем каждую запись отдельно
        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'DELETE',
            })
        );

        await Promise.all(promises);
        return { data: params.ids };
    },
};

// Вспомогательные функции для работы с admin-users
export const adminUsersHelpers = {
    // Сменить пароль пользователя
    changePassword: async (userId: string, newPassword: string) => {
        return customDataProvider.update('admin-users', {
            id: userId,
            data: {},
            previousData: {},
            meta: { operation: 'changePassword', newPassword }
        });
    },

    // Переключить статус пользователя
    toggleStatus: async (userId: string) => {
        return customDataProvider.update('admin-users', {
            id: userId,
            data: {},
            previousData: {},
            meta: { operation: 'toggleStatus' }
        });
    },

    // Получить роли и разрешения
    getRolesAndPermissions: async () => {
        return customDataProvider.update('admin-users', {
            id: 'system',
            data: {},
            previousData: {},
            meta: { operation: 'getRolesAndPermissions' }
        });
    },

    // Массовые операции
    bulkOperation: async (userIds: string[], operation: 'activate' | 'deactivate' | 'delete') => {
        return customDataProvider.update('admin-users', {
            id: 'bulk',
            data: {},
            previousData: {},
            meta: { operation: 'bulkOperation', userIds, bulkOperation: operation }
        });
    }
};