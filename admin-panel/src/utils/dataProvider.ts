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

// HTTP клиент для файлов
const httpClientFile = (url: string, options: any = {}) => {
    const token = getAuthToken();

    // НЕ устанавливаем Content-Type для FormData - браузер сделает это автоматически
    if (!options.headers) {
        options.headers = new Headers();
    }

    if (token) {
        options.headers.set('Authorization', `Bearer ${token}`);
    }

    return fetch(url, options);
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

// Обработка изображений из React Admin
const processImageField = async (data: any, fieldName: string) => {
    const imageData = data[fieldName];

    if (!imageData) return null;

    // Если это массив файлов (множественная загрузка)
    if (Array.isArray(imageData)) {
        const files = imageData.filter(item => item.rawFile instanceof File);
        return files.length > 0 ? files[0].rawFile : null;
    }

    // Если это одиночный файл
    if (imageData.rawFile instanceof File) {
        return imageData.rawFile;
    }

    return null;
};

// Создание FormData для продуктов
const createProductFormData = async (data: any): Promise<FormData> => {
    const formData = new FormData();

    // Добавляем основные поля
    if (data.title) formData.append('title', data.title);
    if (data.price) formData.append('price', data.price.toString());
    if (data.oldPrice) formData.append('oldPrice', data.oldPrice.toString());
    if (data.brand) formData.append('brand', data.brand);
    if (data.sku) formData.append('sku', data.sku);
    if (data.description) formData.append('description', data.description);
    if (data.categoryId) formData.append('categoryId', data.categoryId);

    // Булевы поля
    formData.append('isActive', data.isActive !== false ? 'true' : 'false');
    formData.append('inStock', data.inStock !== false ? 'true' : 'false');

    // Числовые поля
    formData.append('stockQuantity', (data.stockQuantity || 0).toString());

    // Обрабатываем изображение
    const imageFile = await processImageField(data, 'image');
    if (imageFile) {
        formData.append('image', imageFile);
        console.log('📸 Добавлен файл изображения:', imageFile.name);
    }

    return formData;
};

// Функция конвертации параметров react-admin в API параметры
const convertRAParamsToAPI = (params: any) => {
    const { pagination, sort, filter } = params;
    const apiParams: any = {};

    if (pagination) {
        apiParams.page = pagination.page;
        apiParams.limit = pagination.perPage;
    }

    if (sort) {
        apiParams.sortBy = sort.field;
        apiParams.sortOrder = sort.order.toLowerCase();
    }

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

// Основной DataProvider
export const customDataProvider: DataProvider = {
    // Получить список записей
    getList: async (resource, params) => {
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
        apiParams[params.target] = params.id;

        const query = new URLSearchParams(apiParams).toString();
        const url = `${API_BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

        const { json } = await httpClient(url);
        return convertAPIResponseToRA(json, 'getList');
    },

    // Создать запись
    create: async (resource, params) => {
        console.log('🔍 DataProvider CREATE called:', { resource, params });

        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}`;

        // Специальная обработка для продуктов с изображениями
        if (resource === 'products') {
            try {
                const formData = await createProductFormData(params.data);

                console.log('📦 Отправка FormData для продукта');

                const response = await httpClientFile(url, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Ошибка создания продукта:', errorText);
                    throw new Error(`Server error: ${response.status} ${errorText}`);
                }

                const json = await response.json();
                return convertAPIResponseToRA(json, 'create');

            } catch (error) {
                console.error('❌ Ошибка в create products:', error);
                throw error;
            }
        }

        // Обычная обработка для других ресурсов
        const { json } = await httpClient(url, {
            method: 'POST',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'create');
    },

    // Обновить запись
    update: async (resource, params) => {
        console.log('🔍 DataProvider UPDATE called:', { resource, id: params.id, params });

        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;

        // Специальная обработка для продуктов с изображениями
        if (resource === 'products') {
            try {
                const formData = await createProductFormData(params.data);

                console.log('📦 Отправка FormData для обновления продукта');

                const response = await httpClientFile(url, {
                    method: 'PUT',
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Ошибка обновления продукта:', errorText);
                    throw new Error(`Server error: ${response.status} ${errorText}`);
                }

                const json = await response.json();
                return convertAPIResponseToRA(json, 'update');

            } catch (error) {
                console.error('❌ Ошибка в update products:', error);
                throw error;
            }
        }

        // Обычная обработка для других ресурсов
        const { json } = await httpClient(url, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        });

        return convertAPIResponseToRA(json, 'update');
    },

    // ✅ ДОБАВЛЕННАЯ ФУНКЦИЯ: Обновить несколько записей
    updateMany: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        // Для простоты делаем множественные одиночные запросы
        const promises = params.ids.map(id =>
            httpClient(`${API_BASE_URL}${endpoint}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(params.data),
            })
        );

        await Promise.all(promises);
        return { data: params.ids };
    },

    // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Удалить запись
    delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        const url = `${API_BASE_URL}${endpoint}/${params.id}`;
        await httpClient(url, {
            method: 'DELETE',
        });

        // Возвращаем данные в правильном формате для React Admin
        return { data: params.previousData as RecordType };
    },

    // ✅ ИСПРАВЛЕННАЯ ФУНКЦИЯ: Удалить несколько записей
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