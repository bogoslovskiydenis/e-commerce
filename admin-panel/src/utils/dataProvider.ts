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
    'comments': '/reviews',
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

const convertRAParamsToAPI = (params: any, resource?: string) => {
    const { pagination, sort, filter } = params;
    const page = pagination?.page;
    const perPage = pagination?.perPage;
    const apiParams: any = {};

    // Всегда передаем параметры пагинации (используем переданные значения или дефолты)
    apiParams.page = page !== undefined ? page : 1;
    apiParams.limit = perPage !== undefined ? perPage : 25;

    if (sort?.field) {
        // Маппинг полей сортировки
        let sortField = sort.field;
        if (sortField === 'order') sortField = 'sortOrder';
        if (sortField === 'date') sortField = 'createdAt';
        
        apiParams.sortBy = sortField;
        apiParams.sortOrder = sort.order?.toLowerCase() === 'desc' ? 'desc' : 'asc';
    }

    if (filter) {
        Object.keys(filter).forEach(key => {
            if (filter[key] !== undefined && filter[key] !== null && filter[key] !== '') {
                // Трансформируем q -> search для поиска
                if (key === 'q') {
                    apiParams.search = filter[key];
                }
                // Трансформируем статус для ресурса 'comments' (new -> PENDING, approved -> APPROVED, rejected -> REJECTED)
                else if (resource === 'comments' && key === 'status') {
                    const statusMap: Record<string, string> = {
                        'new': 'PENDING',
                        'approved': 'APPROVED',
                        'rejected': 'REJECTED',
                        'spam': 'REJECTED'
                    };
                    apiParams[key] = statusMap[filter[key]] || filter[key];
                } 
                // Трансформируем active -> isActive для категорий
                else if (resource === 'categories' && key === 'active') {
                    apiParams.isActive = filter[key];
                }
                else {
                    apiParams[key] = filter[key];
                }
            }
        });
    }

    console.log('🔄 Конвертация RA параметров:', { params, result: apiParams });
    return apiParams;
};

// Трансформация Review в формат Comment для совместимости с компонентом comments.tsx
const transformReviewToComment = (review: any) => {
    const statusMap: Record<string, string> = {
        'PENDING': 'new',
        'APPROVED': 'approved',
        'REJECTED': 'rejected'
    };

    return {
        id: review.id,
        subject: review.product?.title || 'Отзыв о товаре',
        content: review.comment || '',
        status: statusMap[review.status] || 'new',
        type: 'review',
        author: {
            name: review.name || '',
            email: review.email || '',
            phone: review.customer?.phone || ''
        },
        user: review.customer ? {
            name: review.customer.name || '',
            role: 'customer'
        } : undefined,
        recordType: review.product?.title || 'Товар',
        recordId: review.productId || '',
        template: `Рейтинг: ${review.rating}/5`,
        isVisible: review.status === 'APPROVED',
        moderatorNote: review.moderator ? `Модератор: ${review.moderator.fullName || review.moderator.username}` : '',
        createdAt: review.createdAt,
        // Дополнительные поля из Review для совместимости
        rating: review.rating,
        product: review.product
    };
};

// Трансформация Order из API формата в формат react-admin
const transformOrder = (order: any) => {
    const statusMap: Record<string, string> = {
        'NEW': 'new',
        'CONFIRMED': 'processing',
        'PROCESSING': 'processing',
        'READY': 'processing',
        'SHIPPED': 'shipped',
        'DELIVERED': 'delivered',
        'CANCELLED': 'cancelled',
        'REFUNDED': 'cancelled'
    };

    return {
        ...order,
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt, // Маппинг createdAt -> date для react-admin
        status: statusMap[order.status] || 'new',
        total: Number(order.totalAmount),
        currency: 'грн',
        customer: order.customer ? {
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email
        } : null,
        paymentMethod: order.paymentMethod || '',
        deliveryMethod: order.shippingAddress ? 'Доставка' : 'Самовывоз',
        deliveryAddress: order.shippingAddress ? JSON.stringify(order.shippingAddress) : '',
        items: order.items || [],
        processing: order.status === 'PROCESSING' || order.status === 'CONFIRMED',
        notes: order.notes || ''
    };
};

const dataProvider: DataProvider = {
    getList: async (resource, params) => {
        const endpoint = RESOURCE_ENDPOINTS[resource];
        if (!endpoint) {
            throw new Error(`Unknown resource: ${resource}`);
        }

        console.log('📋 getList вызов:', { 
            resource, 
            params, 
            perPage: params.pagination?.perPage, 
            page: params.pagination?.page 
        });

        const apiParams = convertRAParamsToAPI(params, resource);
        
        // Убеждаемся, что числовые параметры передаются как числа в строке
        const queryParams = new URLSearchParams();
        Object.keys(apiParams).forEach(key => {
            const value = apiParams[key];
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, String(value));
            }
        });
        
        const url = `${API_BASE_URL}${endpoint}?${queryParams.toString()}`;

        console.log('🌐 Запрос URL:', url);
        console.log('📊 API параметры:', apiParams);

        try {
            const { json } = await httpClient(url);
            console.log('📥 API ответ:', { type: 'getList', response: json });

            let data = json.data || [];
            // Правильная обработка пагинации - сначала проверяем pagination объект
            const total = json.pagination?.total || json.total || data.length;
            
            // Логируем для отладки
            console.log('📦 Получено данных:', data.length, 'Ожидалось:', apiParams.limit, 'Всего:', total);

            // Трансформируем данные для ресурса 'comments'
            if (resource === 'comments') {
                data = data.map(transformReviewToComment);
            }

            // Трансформируем данные для ресурса 'orders'
            if (resource === 'orders') {
                data = data.map(transformOrder);
            }

            // Трансформируем данные для ресурса 'categories'
            if (resource === 'categories') {
                data = data.map((category: any) => ({
                    ...category,
                    active: category.isActive !== undefined ? category.isActive : true,
                    order: category.sortOrder || 0
                }));
            }

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

            let data = json.data || json;
            
            // Трансформируем данные для ресурса 'comments'
            if (resource === 'comments') {
                data = transformReviewToComment(data);
            }

            // Трансформируем данные для ресурса 'orders'
            if (resource === 'orders') {
                data = transformOrder(data);
            }

            // Трансформируем данные для ресурса 'categories'
            if (resource === 'categories') {
                data = {
                    ...data,
                    active: data.isActive !== undefined ? data.isActive : true,
                    order: data.sortOrder || 0
                };
            }

            return { data };
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

        const apiParams = convertRAParamsToAPI(params, resource);
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
            let createData = params.data;
            
            // Трансформируем данные для ресурса 'categories' (react-admin -> API)
            if (resource === 'categories') {
                createData = {
                    ...params.data,
                    isActive: params.data.active !== undefined ? params.data.active : params.data.isActive,
                    sortOrder: params.data.order !== undefined ? params.data.order : params.data.sortOrder
                };
                delete createData.active;
                delete createData.order;
            }

            const { json } = await httpClient(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(createData),
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
            let updateData = params.data;
            
            // Трансформируем данные обратно для ресурса 'comments' (Comment -> Review)
            if (resource === 'comments') {
                const statusMap: Record<string, string> = {
                    'new': 'PENDING',
                    'approved': 'APPROVED',
                    'rejected': 'REJECTED',
                    'spam': 'REJECTED'
                };
                
                updateData = {
                    status: statusMap[params.data.status] || params.data.status,
                    name: params.data.author?.name || params.data.name,
                    email: params.data.author?.email || params.data.email,
                    comment: params.data.content || params.data.comment,
                    rating: params.data.rating
                };
            }

            // Трансформируем данные обратно для ресурса 'orders' (react-admin -> API)
            if (resource === 'orders') {
                const statusMap: Record<string, string> = {
                    'new': 'NEW',
                    'processing': 'PROCESSING',
                    'shipped': 'SHIPPED',
                    'delivered': 'DELIVERED',
                    'cancelled': 'CANCELLED'
                };
                
                updateData = {
                    status: statusMap[params.data.status] || params.data.status,
                    paymentMethod: params.data.paymentMethod,
                    notes: params.data.notes,
                    managerNotes: params.data.managerNotes
                };
            }

            // Трансформируем данные обратно для ресурса 'categories' (react-admin -> API)
            if (resource === 'categories') {
                updateData = {
                    ...params.data,
                    isActive: params.data.active !== undefined ? params.data.active : params.data.isActive,
                    sortOrder: params.data.order !== undefined ? params.data.order : params.data.sortOrder
                };
                // Удаляем временные поля
                delete updateData.active;
                delete updateData.order;
            }

            const { json } = await httpClient(`${API_BASE_URL}${endpoint}/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(updateData),
            });

            console.log('✅ update результат:', json);

            let resultData = json.data || { ...params.data, id: params.id };
            
            // Трансформируем ответ для ресурса 'comments'
            if (resource === 'comments') {
                resultData = transformReviewToComment(resultData);
            }

            // Трансформируем ответ для ресурса 'orders'
            if (resource === 'orders') {
                resultData = transformOrder(resultData);
            }

            // Трансформируем ответ для ресурса 'categories'
            if (resource === 'categories') {
                resultData = {
                    ...resultData,
                    active: resultData.isActive !== undefined ? resultData.isActive : true,
                    order: resultData.sortOrder || 0
                };
            }

            return { data: resultData };
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
                    totalUsers: 0,
                    totalOrders: 0,
                    totalProducts: 0,
                    totalCustomers: 0,
                    revenue: 0,
                    newUsers: 0,
                    completedOrders: 0
                }
            };
        }
    },
};

export default dataProvider;