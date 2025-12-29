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
                // Для промокодов q -> search
                else if (resource === 'promotions' && key === 'q') {
                    apiParams.search = filter[key];
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

// Функция для загрузки изображения на сервер
const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/banners/upload`, {
        method: 'POST',
        headers: {
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: formData,
    });
    
    if (!response.ok) {
        throw new Error('Failed to upload image');
    }
    
    const result = await response.json();
    return result.data?.url || result.data?.path || '';
};

// Функция для извлечения URL из данных изображения
const extractImageUrl = async (imageData: any): Promise<string | null> => {
    if (!imageData) return null;
    if (typeof imageData === 'string') return imageData;
    // Если это объект с rawFile (новый файл), загружаем его
    if (imageData.rawFile && imageData.rawFile instanceof File) {
        try {
            return await uploadImage(imageData.rawFile);
        } catch (error) {
            console.error('Ошибка загрузки изображения:', error);
            throw error; // Пробрасываем ошибку, чтобы форма не закрывалась молча
        }
    }
    // Если это объект со src (уже загруженный или blob URL), используем src
    if (imageData.src) {
        // Если это blob URL, возвращаем null (изображение не было загружено на сервер)
        if (typeof imageData.src === 'string' && imageData.src.startsWith('blob:')) {
            return null;
        }
        return imageData.src;
    }
    return null;
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

    const paymentStatusMap: Record<string, string> = {
        'PENDING': 'pending',
        'PAID': 'paid',
        'FAILED': 'failed',
        'REFUNDED': 'refunded',
        'PARTIALLY_REFUNDED': 'refunded'
    };

    return {
        ...order,
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt, // Маппинг createdAt -> date для react-admin
        status: statusMap[order.status] || 'new',
        paymentStatus: paymentStatusMap[order.paymentStatus] || 'pending',
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
        items: (order.items || []).map((item: any) => ({
            id: item.id,
            productId: item.productId,
            product: item.product ? {
                id: item.product.id,
                title: item.product.title || item.product.name || '',
                name: item.product.title || item.product.name || '',
                images: item.product.images || []
            } : null,
            quantity: item.quantity || 0,
            price: Number(item.price) || 0,
            total: Number(item.total || item.price * item.quantity) || 0
        })),
        processing: order.status === 'PROCESSING' || order.status === 'CONFIRMED',
        notes: order.notes || '',
        manager: order.manager || null,
        discountAmount: Number(order.discountAmount) || 0,
        shippingAmount: Number(order.shippingAmount) || 0,
        source: order.source || 'website',
        totalAmount: Number(order.totalAmount) || 0
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

            // Трансформируем данные для ресурса 'navigation'
            if (resource === 'navigation') {
                data = data.map((item: any) => ({
                    ...item,
                    id: item.id,
                    name: item.name,
                    title: item.name, // для совместимости
                    url: item.url,
                    type: item.type?.toLowerCase() || item.type,
                    categoryId: item.categoryId,
                    parentId: item.parentId,
                    sortOrder: item.sortOrder,
                    order: item.sortOrder, // для совместимости
                    isActive: item.isActive,
                    active: item.isActive, // для совместимости
                    openInNew: item.openInNew,
                    icon: item.icon,
                    category: item.category ? {
                        ...item.category,
                        parentId: item.category.parentId
                    } : null,
                    parent: item.parent,
                    children: item.children || [],
                    childrenCount: item.childrenCount || 0
                }));
            }

            // Трансформируем данные для ресурса 'banners' (API -> react-admin)
            if (resource === 'banners') {
                data = data.map((banner: any) => {
                    // Для списка не нужно преобразовывать в объект, только для формы редактирования
                    return {
                        ...banner,
                        image: banner.imageUrl, // В списке оставляем строку
                        mobileImage: banner.mobileImageUrl, // В списке оставляем строку
                        buttonUrl: banner.link,
                        active: banner.isActive !== undefined ? banner.isActive : true,
                        order: banner.sortOrder || 0,
                        position: banner.position?.toLowerCase() || 'main'
                    };
                });
            }

            // Трансформируем данные для ресурса 'promotions' (API -> react-admin)
            if (resource === 'promotions') {
                data = data.map((promotion: any) => ({
                    ...promotion,
                    productIds: promotion.products?.map((pp: any) => pp.productId) || []
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

            // Трансформируем данные для ресурса 'navigation'
            if (resource === 'navigation') {
                data = {
                    ...data,
                    id: data.id,
                    name: data.name,
                    title: data.name, // для совместимости
                    url: data.url,
                    type: data.type?.toLowerCase() || data.type,
                    categoryId: data.categoryId,
                    parentId: data.parentId,
                    sortOrder: data.sortOrder,
                    order: data.sortOrder, // для совместимости
                    isActive: data.isActive,
                    active: data.isActive, // для совместимости
                    openInNew: data.openInNew,
                    icon: data.icon,
                    category: data.category ? {
                        ...data.category,
                        parentId: data.category.parentId
                    } : null,
                    parent: data.parent,
                    children: data.children || [],
                    childrenCount: data.childrenCount || 0
                };
            }

            // Трансформируем данные для ресурса 'products' (API -> react-admin)
            if (resource === 'products') {
                // Для ImageInput нужно передать объект с src из первого элемента массива images
                const imageObj = data.images && data.images.length > 0 && data.images[0]
                    ? { src: data.images[0], title: data.title || 'Product image' }
                    : undefined;
                
                data = {
                    ...data,
                    image: imageObj, // ImageInput ожидает объект с src
                };
            }

            // Трансформируем данные для ресурса 'banners' (API -> react-admin)
            if (resource === 'banners') {
                // Для ImageInput нужно передать объект с src, если изображение уже есть
                // ImageInput ожидает объект или undefined, но не строку
                const imageObj = data.imageUrl ? { src: data.imageUrl, title: data.title || 'Banner image' } : undefined;
                const mobileImageObj = data.mobileImageUrl ? { src: data.mobileImageUrl, title: data.title || 'Banner mobile image' } : undefined;
                
                data = {
                    ...data,
                    image: imageObj,
                    mobileImage: mobileImageObj,
                    buttonUrl: data.link,
                    active: data.isActive !== undefined ? data.isActive : true,
                    order: data.sortOrder || 0,
                    position: data.position?.toLowerCase() || 'main'
                };
            }

            // Трансформируем данные для ресурса 'promotions' (API -> react-admin)
            if (resource === 'promotions') {
                data = {
                    ...data,
                    productIds: data.products?.map((pp: any) => pp.productId) || []
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

            // Трансформируем данные для ресурса 'navigation' (react-admin -> API)
            if (resource === 'navigation') {
                createData = {
                    name: params.data.name || params.data.title,
                    url: params.data.url,
                    type: params.data.type?.toUpperCase() || params.data.type || 'LINK',
                    categoryId: params.data.categoryId || null,
                    parentId: params.data.parentId || null,
                    sortOrder: params.data.sortOrder !== undefined ? params.data.sortOrder : params.data.order || 0,
                    isActive: params.data.isActive !== undefined ? params.data.isActive : params.data.active !== undefined ? params.data.active : true,
                    openInNew: params.data.openInNew || false,
                    icon: params.data.icon || null
                };
            }

            // Трансформируем данные для ресурса 'products' (react-admin -> API)
            if (resource === 'products') {
                // Обрабатываем изображение - ImageInput отправляет объект, API ожидает массив строк
                let imagesArray: string[] = [];
                
                if (params.data.image) {
                    const imageUrl = await extractImageUrl(params.data.image);
                    if (imageUrl) {
                        imagesArray = [imageUrl];
                    } else if (typeof params.data.image === 'string') {
                        imagesArray = [params.data.image];
                    } else if (params.data.image.src && !params.data.image.src.startsWith('blob:')) {
                        imagesArray = [params.data.image.src];
                    }
                }
                
                // Извлекаем categoryId из объекта category, если он есть
                let categoryId = params.data.categoryId;
                if (!categoryId && params.data.category?.id) {
                    categoryId = params.data.category.id;
                }
                
                // Формируем объект с только нужными полями для API
                createData = {
                    title: params.data.title,
                    slug: params.data.slug,
                    description: params.data.description,
                    shortDescription: params.data.shortDescription,
                    price: Number(params.data.price),
                    oldPrice: params.data.oldPrice !== undefined ? Number(params.data.oldPrice) : undefined,
                    discount: params.data.discount !== undefined ? Number(params.data.discount) : undefined,
                    categoryId: categoryId,
                    brand: params.data.brand,
                    sku: params.data.sku,
                    images: imagesArray,
                    attributes: params.data.attributes,
                    tags: params.data.tags,
                    isActive: params.data.isActive,
                    inStock: params.data.inStock,
                    stockQuantity: params.data.stockQuantity !== undefined ? Number(params.data.stockQuantity) : undefined,
                    featured: params.data.featured,
                    popular: params.data.popular,
                    weight: params.data.weight !== undefined ? Number(params.data.weight) : undefined,
                    dimensions: params.data.dimensions,
                };
                
                // Удаляем undefined значения
                Object.keys(createData).forEach(key => {
                    if (createData[key] === undefined) {
                        delete createData[key];
                    }
                });
            }

            // Трансформируем данные для ресурса 'banners' (react-admin -> API)
            if (resource === 'banners') {
                const positionMap: Record<string, string> = {
                    'main': 'MAIN',
                    'category': 'CATEGORY',
                    'sidebar': 'SIDEBAR',
                    'footer': 'FOOTER',
                    'popup': 'POPUP',
                    'promo': 'CATEGORY' // promo -> CATEGORY для совместимости
                };
                
                // Загружаем изображения, если они есть
                const imageUrl = await extractImageUrl(params.data.image) || params.data.imageUrl || '';
                const mobileImageUrl = await extractImageUrl(params.data.mobileImage) || params.data.mobileImageUrl || null;
                
                createData = {
                    title: params.data.title,
                    subtitle: params.data.subtitle,
                    description: params.data.description,
                    imageUrl,
                    mobileImageUrl,
                    link: params.data.buttonUrl || params.data.link || null,
                    buttonText: params.data.buttonText || null,
                    position: positionMap[params.data.position?.toLowerCase()] || params.data.position?.toUpperCase() || 'MAIN',
                    isActive: params.data.active !== undefined ? params.data.active : params.data.isActive !== undefined ? params.data.isActive : true,
                    sortOrder: params.data.order !== undefined ? params.data.order : params.data.sortOrder || 0,
                    startDate: params.data.startDate || null,
                    endDate: params.data.endDate || null
                };
            }

            // Трансформируем данные для ресурса 'promotions' (react-admin -> API)
            if (resource === 'promotions') {
                createData = {
                    name: params.data.name,
                    description: params.data.description,
                    code: params.data.code || null,
                    type: params.data.type,
                    value: Number(params.data.value),
                    minOrderAmount: params.data.minOrderAmount ? Number(params.data.minOrderAmount) : null,
                    maxUsage: params.data.maxUsage ? Number(params.data.maxUsage) : null,
                    isActive: params.data.isActive !== undefined ? params.data.isActive : true,
                    startDate: params.data.startDate || null,
                    endDate: params.data.endDate || null,
                    productIds: params.data.productIds && params.data.productIds.length > 0 ? params.data.productIds : undefined
                };
            }

            const { json } = await httpClient(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                body: JSON.stringify(createData),
            });

            console.log('✅ create результат:', json);

            let resultData = json.data || { ...params.data, id: json.id || json.data?.id };

            // Трансформируем ответ для ресурса 'navigation'
            if (resource === 'navigation') {
                resultData = {
                    ...resultData,
                    id: resultData.id,
                    name: resultData.name,
                    title: resultData.name, // для совместимости
                    url: resultData.url,
                    type: resultData.type?.toLowerCase() || resultData.type,
                    categoryId: resultData.categoryId,
                    parentId: resultData.parentId,
                    sortOrder: resultData.sortOrder,
                    order: resultData.sortOrder, // для совместимости
                    isActive: resultData.isActive,
                    active: resultData.isActive, // для совместимости
                    openInNew: resultData.openInNew,
                    icon: resultData.icon,
                    category: resultData.category ? {
                        ...resultData.category,
                        parentId: resultData.category.parentId
                    } : null,
                    parent: resultData.parent,
                    children: resultData.children || [],
                    childrenCount: resultData.childrenCount || 0
                };
            }

            // Трансформируем ответ для ресурса 'banners'
            if (resource === 'banners') {
                // Для ImageInput нужно передать объект с src
                const imageObj = resultData.imageUrl ? { src: resultData.imageUrl, title: resultData.title || 'Banner image' } : undefined;
                const mobileImageObj = resultData.mobileImageUrl ? { src: resultData.mobileImageUrl, title: resultData.title || 'Banner mobile image' } : undefined;
                
                resultData = {
                    ...resultData,
                    image: imageObj,
                    mobileImage: mobileImageObj,
                    buttonUrl: resultData.link,
                    active: resultData.isActive !== undefined ? resultData.isActive : true,
                    order: resultData.sortOrder || 0,
                    position: resultData.position?.toLowerCase() || 'main'
                };
            }

            // Трансформируем ответ для ресурса 'promotions'
            if (resource === 'promotions') {
                resultData = {
                    ...resultData,
                    productIds: resultData.products?.map((pp: any) => pp.productId) || []
                };
            }

            // ИСПРАВЛЕНИЕ: правильный формат возврата
            return {
                data: {
                    ...resultData,
                    id: resultData.id || json.id
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
                    'pending': 'PENDING',
                    'approved': 'APPROVED',
                    'rejected': 'REJECTED',
                    'spam': 'REJECTED'
                };
                
                // Если изменяется isVisible, обновляем статус соответственно
                let status = params.data.status;
                if (params.data.isVisible !== undefined) {
                    // Если isVisible = true, статус должен быть approved
                    // Если isVisible = false, статус должен быть pending
                    status = params.data.isVisible ? 'approved' : 'pending';
                }
                
                // Маппим статус в формат API (APPROVED, PENDING, REJECTED)
                const apiStatus = status ? (statusMap[status] || status.toUpperCase()) : undefined;
                
                updateData = {
                    ...(apiStatus && { status: apiStatus }),
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

            // Трансформируем данные обратно для ресурса 'navigation' (react-admin -> API)
            if (resource === 'navigation') {
                updateData = {
                    name: params.data.name || params.data.title,
                    url: params.data.url,
                    type: params.data.type?.toUpperCase() || params.data.type,
                    categoryId: params.data.categoryId || null,
                    parentId: params.data.parentId || null,
                    sortOrder: params.data.sortOrder !== undefined ? params.data.sortOrder : params.data.order,
                    isActive: params.data.isActive !== undefined ? params.data.isActive : params.data.active,
                    openInNew: params.data.openInNew || false,
                    icon: params.data.icon || null
                };
            }

            // Трансформируем данные обратно для ресурса 'products' (react-admin -> API)
            if (resource === 'products') {
                // Обрабатываем изображение - ImageInput отправляет объект, API ожидает массив строк
                let imagesArray: string[] = params.previousData?.images || [];
                
                if (params.data.image) {
                    const imageUrl = await extractImageUrl(params.data.image);
                    if (imageUrl) {
                        // Если есть новое изображение, добавляем его в массив
                        imagesArray = [imageUrl, ...imagesArray.filter(img => img !== imageUrl)].slice(0, 10);
                    } else if (typeof params.data.image === 'string') {
                        imagesArray = [params.data.image];
                    } else if (params.data.image.src && !params.data.image.src.startsWith('blob:')) {
                        imagesArray = [params.data.image.src];
                    }
                } else if (params.previousData?.images) {
                    // Если изображение не изменено, сохраняем существующие
                    imagesArray = params.previousData.images;
                }
                
                // Извлекаем categoryId из объекта category, если он есть
                let categoryId = params.data.categoryId;
                if (!categoryId && params.data.category?.id) {
                    categoryId = params.data.category.id;
                }
                
                // Формируем объект с только нужными полями для API
                updateData = {
                    title: params.data.title,
                    slug: params.data.slug,
                    description: params.data.description,
                    shortDescription: params.data.shortDescription,
                    price: params.data.price !== undefined ? Number(params.data.price) : undefined,
                    oldPrice: params.data.oldPrice !== undefined ? Number(params.data.oldPrice) : undefined,
                    discount: params.data.discount !== undefined ? Number(params.data.discount) : undefined,
                    categoryId: categoryId,
                    brand: params.data.brand,
                    sku: params.data.sku,
                    images: imagesArray,
                    attributes: params.data.attributes,
                    tags: params.data.tags,
                    isActive: params.data.isActive,
                    inStock: params.data.inStock,
                    stockQuantity: params.data.stockQuantity !== undefined ? Number(params.data.stockQuantity) : undefined,
                    featured: params.data.featured,
                    popular: params.data.popular,
                    weight: params.data.weight !== undefined ? Number(params.data.weight) : undefined,
                    dimensions: params.data.dimensions,
                };
                
                // Удаляем undefined значения
                Object.keys(updateData).forEach(key => {
                    if (updateData[key] === undefined) {
                        delete updateData[key];
                    }
                });
            }

            // Трансформируем данные обратно для ресурса 'banners' (react-admin -> API)
            if (resource === 'banners') {
                const positionMap: Record<string, string> = {
                    'main': 'MAIN',
                    'category': 'CATEGORY',
                    'sidebar': 'SIDEBAR',
                    'footer': 'FOOTER',
                    'popup': 'POPUP',
                    'promo': 'CATEGORY' // promo -> CATEGORY для совместимости
                };
                // Для update сохраняем существующие значения, если новое изображение не загружено
                const existingImageUrl = params.previousData?.imageUrl || params.previousData?.image;
                const existingMobileImageUrl = params.previousData?.mobileImageUrl || params.previousData?.mobileImage;
                
                // Загружаем изображения, если они есть (только если это новый файл)
                let imageUrl = existingImageUrl || '';
                let mobileImageUrl = existingMobileImageUrl || null;
                
                if (params.data.image) {
                    const uploadedUrl = await extractImageUrl(params.data.image);
                    if (uploadedUrl) {
                        imageUrl = uploadedUrl;
                    } else if (typeof params.data.image === 'string') {
                        imageUrl = params.data.image;
                    }
                }
                
                if (params.data.mobileImage) {
                    const uploadedUrl = await extractImageUrl(params.data.mobileImage);
                    if (uploadedUrl) {
                        mobileImageUrl = uploadedUrl;
                    } else if (typeof params.data.mobileImage === 'string') {
                        mobileImageUrl = params.data.mobileImage;
                    }
                }
                
                updateData = {
                    title: params.data.title,
                    subtitle: params.data.subtitle,
                    description: params.data.description,
                    imageUrl,
                    mobileImageUrl,
                    link: params.data.buttonUrl || params.data.link || null,
                    buttonText: params.data.buttonText || null,
                    position: positionMap[params.data.position?.toLowerCase()] || params.data.position?.toUpperCase() || 'MAIN',
                    isActive: params.data.active !== undefined ? params.data.active : params.data.isActive !== undefined ? params.data.isActive : true,
                    sortOrder: params.data.order !== undefined ? params.data.order : params.data.sortOrder || 0,
                    startDate: params.data.startDate || null,
                    endDate: params.data.endDate || null
                };
            }

            // Трансформируем данные обратно для ресурса 'promotions' (react-admin -> API)
            if (resource === 'promotions') {
                updateData = {
                    name: params.data.name,
                    description: params.data.description,
                    code: params.data.code || null,
                    type: params.data.type,
                    value: params.data.value !== undefined ? Number(params.data.value) : undefined,
                    minOrderAmount: params.data.minOrderAmount !== undefined ? (params.data.minOrderAmount ? Number(params.data.minOrderAmount) : null) : undefined,
                    maxUsage: params.data.maxUsage !== undefined ? (params.data.maxUsage ? Number(params.data.maxUsage) : null) : undefined,
                    isActive: params.data.isActive !== undefined ? params.data.isActive : undefined,
                    startDate: params.data.startDate !== undefined ? params.data.startDate : undefined,
                    endDate: params.data.endDate !== undefined ? params.data.endDate : undefined,
                    productIds: params.data.productIds !== undefined ? (params.data.productIds && params.data.productIds.length > 0 ? params.data.productIds : []) : undefined
                };
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

            // Трансформируем ответ для ресурса 'products'
            if (resource === 'products') {
                // Для ImageInput нужно передать объект с src из первого элемента массива images
                const imageObj = resultData.images && resultData.images.length > 0 && resultData.images[0]
                    ? { src: resultData.images[0], title: resultData.title || 'Product image' }
                    : undefined;
                
                resultData = {
                    ...resultData,
                    image: imageObj, // ImageInput ожидает объект с src
                };
            }

            // Трансформируем ответ для ресурса 'categories'
            if (resource === 'categories') {
                resultData = {
                    ...resultData,
                    active: resultData.isActive !== undefined ? resultData.isActive : true,
                    order: resultData.sortOrder || 0
                };
            }

            // Трансформируем ответ для ресурса 'navigation'
            if (resource === 'navigation') {
                resultData = {
                    ...resultData,
                    id: resultData.id,
                    name: resultData.name,
                    title: resultData.name, // для совместимости
                    url: resultData.url,
                    type: resultData.type?.toLowerCase() || resultData.type,
                    categoryId: resultData.categoryId,
                    parentId: resultData.parentId,
                    sortOrder: resultData.sortOrder,
                    order: resultData.sortOrder, // для совместимости
                    isActive: resultData.isActive,
                    active: resultData.isActive, // для совместимости
                    openInNew: resultData.openInNew,
                    icon: resultData.icon,
                    category: resultData.category ? {
                        ...resultData.category,
                        parentId: resultData.category.parentId
                    } : null,
                    parent: resultData.parent,
                    children: resultData.children || [],
                    childrenCount: resultData.childrenCount || 0
                };
            }

            // Трансформируем ответ для ресурса 'banners'
            if (resource === 'banners') {
                // Для ImageInput нужно передать объект с src
                const imageObj = resultData.imageUrl ? { src: resultData.imageUrl, title: resultData.title || 'Banner image' } : undefined;
                const mobileImageObj = resultData.mobileImageUrl ? { src: resultData.mobileImageUrl, title: resultData.title || 'Banner mobile image' } : undefined;
                
                resultData = {
                    ...resultData,
                    image: imageObj,
                    mobileImage: mobileImageObj,
                    buttonUrl: resultData.link,
                    active: resultData.isActive !== undefined ? resultData.isActive : true,
                    order: resultData.sortOrder || 0,
                    position: resultData.position?.toLowerCase() || 'main'
                };
            }

            // Трансформируем ответ для ресурса 'promotions'
            if (resource === 'promotions') {
                resultData = {
                    ...resultData,
                    productIds: resultData.products?.map((pp: any) => pp.productId) || []
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