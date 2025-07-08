import { Dashboard } from './pages/Dashboard';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';
import {ProductList, ProductEdit, ProductCreate, CommentList, CommentEdit, CommentShow} from './resources';
import { OrderList, OrderEdit } from './resources';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources';
import { CustomerList, CustomerEdit } from './resources';
import { CallbackList, CallbackEdit } from './resources';
import { PermissionsWrapper, withPermissions } from './components/PermissionsWrapper';
import {
    NavigationList,
    NavigationEdit,
    NavigationCreate
} from './resources';

// Импорты секции "Сайт"
import {
    BannerList,
    BannerEdit,
    BannerCreate,
    PageList,
    PageEdit,
    PageCreate,
    PageShow,
    SiteSettingsEdit
} from './resources';

import { CustomMenu } from './components/CustomMenu';
import {authProvider} from "./auth/authProvider";
import {ApiKeyCreate, ApiKeyEdit, ApiKeyList} from "./resources/security/apiKeys";
import {AdminLogList, AdminLogShow} from "./resources/security/logs";
import {UserCreate, UserEdit, UserList, UserShow} from "./resources/security";

// Расширенный мок провайдер данных с полным набором данных
const mockDataProvider = {
    getList: (resource: string, params: any) => {
        console.log('Getting list for resource:', resource, 'with params:', params);

        switch (resource) {
            case 'orders':
                return Promise.resolve({
                    data: [
                        {
                            id: 125,
                            orderNumber: 125,
                            date: '2025-06-24T13:30:25',
                            customer: {
                                id: 1,
                                name: 'Олена Сергіївна',
                                phone: '+38 (066) 453-45-46',
                                email: 'elena@example.com'
                            },
                            status: 'new',
                            paymentMethod: 'monobank',
                            deliveryMethod: 'courier',
                            deliveryAddress: 'м. Ірпінь, Київська обл., Бучанський р-н, по тарифам перевозчика',
                            total: 126,
                            currency: 'грн',
                            items: [
                                {
                                    id: 1,
                                    product: {
                                        id: 1,
                                        name: 'Сердце фольгированное красное',
                                        price: 150
                                    },
                                    quantity: 1,
                                    price: 150
                                }
                            ],
                            notes: 'Новою поштою',
                            processing: false
                        },
                        {
                            id: 126,
                            orderNumber: 126,
                            date: '2025-06-23T10:15:30',
                            customer: {
                                id: 2,
                                name: 'Иван Петров',
                                phone: '+38 (050) 123-45-67',
                                email: 'ivan@example.com'
                            },
                            status: 'processing',
                            paymentMethod: 'cash',
                            deliveryMethod: 'pickup',
                            deliveryAddress: 'Самовывоз',
                            total: 890,
                            currency: 'грн',
                            items: [
                                {
                                    id: 2,
                                    product: {
                                        id: 2,
                                        name: 'Букет "С днем рождения"',
                                        price: 450
                                    },
                                    quantity: 2,
                                    price: 900
                                }
                            ],
                            notes: 'Срочный заказ',
                            processing: true
                        }
                    ] as any[],
                    total: 2
                });

            case 'products':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            brand: 'BalloonShop',
                            title: 'Сердце фольгированное красное',
                            price: 150,
                            oldPrice: 200,
                            discount: 25,
                            image: '/images/hard.jpg',
                            category: 'hearts',
                            categoryId: 1,
                            inStock: true,
                            description: 'Красивое фольгированное сердце красного цвета',
                            createdAt: '2024-01-15T10:00:00Z'
                        },
                        {
                            id: 2,
                            brand: 'BalloonShop',
                            title: 'Букет "С днем рождения"',
                            price: 450,
                            image: '/api/placeholder/300/300',
                            category: 'bouquets',
                            categoryId: 2,
                            inStock: true,
                            description: 'Праздничный букет из шаров для дня рождения',
                            createdAt: '2024-01-16T11:30:00Z'
                        },
                        {
                            id: 3,
                            brand: 'BalloonShop',
                            title: 'Звезда золотая',
                            price: 120,
                            image: '/images/star.jpg',
                            category: 'stars',
                            categoryId: 3,
                            inStock: true,
                            description: 'Золотая фольгированная звезда',
                            createdAt: '2024-01-17T09:15:00Z'
                        }
                    ] as any[],
                    total: 3
                });

            case 'categories':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Сердца',
                            slug: 'hearts',
                            description: 'Фольгированные сердца разных цветов',
                            active: true,
                            createdAt: '2024-01-01T00:00:00Z'
                        },
                        {
                            id: 2,
                            name: 'Букеты',
                            slug: 'bouquets',
                            description: 'Букеты из шаров для праздников',
                            active: true,
                            createdAt: '2024-01-01T00:00:00Z'
                        },
                        {
                            id: 3,
                            name: 'Цифры',
                            slug: 'numbers',
                            description: 'Цифры из шаров для дней рождения',
                            active: true,
                            createdAt: '2024-01-01T00:00:00Z'
                        },
                        {
                            id: 4,
                            name: 'Звезды',
                            slug: 'stars',
                            description: 'Фольгированные звезды',
                            active: true,
                            createdAt: '2024-01-01T00:00:00Z'
                        }
                    ] as any[],
                    total: 4
                });

            case 'customers':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Олена Сергіївна',
                            email: 'elena@example.com',
                            phone: '+38 (066) 453-45-46',
                            address: 'м. Ірпінь, Київська обл.',
                            createdAt: '2024-05-15T10:30:00Z',
                            lastOrderDate: '2025-06-24T13:30:25',
                            totalOrders: 5,
                            totalSpent: 2340
                        },
                        {
                            id: 2,
                            name: 'Иван Петров',
                            email: 'ivan@example.com',
                            phone: '+38 (050) 123-45-67',
                            address: 'г. Киев, ул. Крещатик 15',
                            createdAt: '2024-03-20T14:15:00Z',
                            lastOrderDate: '2025-06-23T10:15:30',
                            totalOrders: 3,
                            totalSpent: 1560
                        },
                        {
                            id: 3,
                            name: 'Мария Кузнецова',
                            email: 'maria@example.com',
                            phone: '+38 (067) 987-65-43',
                            address: 'г. Львов, ул. Свободы 25',
                            createdAt: '2024-06-10T16:45:00Z',
                            lastOrderDate: '2025-06-20T18:20:15',
                            totalOrders: 8,
                            totalSpent: 4200
                        }
                    ] as any[],
                    total: 3
                });

            case 'comments':
            case 'reviews':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            date: '2025-01-22T14:45:43',
                            customerName: 'Олена Сергіївна',
                            productName: 'Сердце фольгированное красное',
                            rating: 5,
                            comment: 'Отличный товар! Быстрая доставка, качественные шары. Обязательно закажу еще!',
                            status: 'approved',
                            productId: 1,
                            customerId: 1
                        },
                        {
                            id: 2,
                            date: '2025-01-22T14:45:58',
                            customerName: 'Иван Петров',
                            productName: 'Букет "С днем рождения"',
                            rating: 4,
                            comment: 'Хороший букет, но немного дороговато. В целом довольны покупкой.',
                            status: 'pending',
                            productId: 2,
                            customerId: 2
                        },
                        {
                            id: 3,
                            date: '2025-01-21T12:30:15',
                            customerName: 'Мария Кузнецова',
                            productName: 'Звезда золотая',
                            rating: 5,
                            comment: 'Прекрасные звезды! Идеально подошли для украшения праздника.',
                            status: 'approved',
                            productId: 3,
                            customerId: 3
                        }
                    ] as any[],
                    total: 3
                });

            case 'callbacks':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Олена',
                            phone: '+38 (097) 649-43-97',
                            date: '2025-06-21T08:47:07',
                            url: '/products/hearts/1',
                            status: 'new',
                            processed: false,
                            comment: 'Интересует стоимость доставки'
                        },
                        {
                            id: 2,
                            name: 'Андрей',
                            phone: '+38 (063) 555-44-33',
                            date: '2025-06-20T15:20:30',
                            url: '/products/bouquets',
                            status: 'processed',
                            processed: true,
                            comment: 'Нужна консультация по букетам'
                        },
                        {
                            id: 3,
                            name: 'Светлана',
                            phone: '+38 (095) 123-45-67',
                            date: '2025-06-19T11:15:45',
                            url: '/products/numbers',
                            status: 'new',
                            processed: false,
                            comment: 'Вопрос по цифрам из шаров'
                        }
                    ] as any[],
                    total: 3
                });

            case 'admin-users':
                return Promise.resolve({
                    data: [
                        {
                            id: '1',
                            username: 'admin',
                            email: 'admin@example.com',
                            firstName: 'Супер',
                            lastName: 'Администратор',
                            fullName: 'Супер Администратор',
                            role: 'super_admin',
                            isActive: true,
                            twoFactorEnabled: false,
                            lastLogin: '2025-07-07T10:30:00Z',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-07-07T10:30:00Z',
                            lastLoginIp: '192.168.1.100'
                        },
                        {
                            id: '2',
                            username: 'manager',
                            email: 'manager@example.com',
                            firstName: 'Иван',
                            lastName: 'Менеджеров',
                            fullName: 'Иван Менеджеров',
                            role: 'administrator',
                            isActive: true,
                            twoFactorEnabled: false,
                            lastLogin: '2025-07-06T16:45:00Z',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-07-06T16:45:00Z',
                            lastLoginIp: '192.168.1.101'
                        },
                        {
                            id: '3',
                            username: 'operator',
                            email: 'operator@example.com',
                            firstName: 'Анна',
                            lastName: 'Операторова',
                            fullName: 'Анна Операторова',
                            role: 'manager',
                            isActive: true,
                            twoFactorEnabled: true,
                            lastLogin: '2025-07-07T09:15:00Z',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-07-07T09:15:00Z',
                            lastLoginIp: '192.168.1.102'
                        },
                        {
                            id: '4',
                            username: 'crm',
                            email: 'crm@example.com',
                            firstName: 'Мария',
                            lastName: 'CRM',
                            fullName: 'Мария CRM',
                            role: 'crm_manager',
                            isActive: false,
                            twoFactorEnabled: false,
                            lastLogin: '2025-07-05T14:20:00Z',
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-07-05T14:20:00Z',
                            lastLoginIp: '192.168.1.103'
                        }
                    ] as any[],
                    total: 4
                });

            case 'admin-logs':
                return Promise.resolve({
                    data: [
                        {
                            id: '1',
                            userId: '1',
                            username: 'admin',
                            action: 'login',
                            description: 'Пользователь admin вошёл в систему',
                            ip: '192.168.1.100',
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            timestamp: '2025-07-07T10:30:00Z',
                            resource: 'auth',
                            resourceId: null
                        },
                        {
                            id: '2',
                            userId: '2',
                            username: 'manager',
                            action: 'create',
                            description: 'Создан новый товар "Шар с надписью"',
                            ip: '192.168.1.101',
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            timestamp: '2025-07-07T09:45:00Z',
                            resource: 'products',
                            resourceId: '4'
                        },
                        {
                            id: '3',
                            userId: '3',
                            username: 'operator',
                            action: 'update',
                            description: 'Обновлен статус заказа #125',
                            ip: '192.168.1.102',
                            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                            timestamp: '2025-07-07T09:15:00Z',
                            resource: 'orders',
                            resourceId: '125'
                        },
                        {
                            id: '4',
                            userId: '1',
                            username: 'admin',
                            action: 'delete',
                            description: 'Удален пользователь test_user',
                            ip: '192.168.1.100',
                            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                            timestamp: '2025-07-06T18:30:00Z',
                            resource: 'admin-users',
                            resourceId: '5'
                        }
                    ] as any[],
                    total: 4
                });

            case 'api-keys':
                return Promise.resolve({
                    data: [
                        {
                            id: '1',
                            name: 'Основной API ключ',
                            key: 'sk_live_123456789abcdef',
                            isActive: true,
                            permissions: ['read', 'write'],
                            lastUsed: '2025-07-07T08:30:00Z',
                            createdAt: '2024-01-01T00:00:00Z',
                            expiresAt: '2026-01-01T00:00:00Z',
                            createdBy: 'admin',
                            usageCount: 1247
                        },
                        {
                            id: '2',
                            name: 'Тестовый ключ',
                            key: 'sk_test_987654321fedcba',
                            isActive: false,
                            permissions: ['read'],
                            lastUsed: '2025-07-05T12:15:00Z',
                            createdAt: '2024-06-15T00:00:00Z',
                            expiresAt: '2025-12-31T23:59:59Z',
                            createdBy: 'manager',
                            usageCount: 45
                        },
                        {
                            id: '3',
                            name: 'Интеграция с сайтом',
                            key: 'sk_live_integration_456789',
                            isActive: true,
                            permissions: ['read', 'write', 'admin'],
                            lastUsed: '2025-07-07T10:00:00Z',
                            createdAt: '2024-03-01T00:00:00Z',
                            expiresAt: null,
                            createdBy: 'admin',
                            usageCount: 3456
                        }
                    ] as any[],
                    total: 3
                });

            case 'banners':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            title: 'Летняя распродажа',
                            description: 'Скидки до 50% на все шары!',
                            image: '/images/banner1.jpg',
                            link: '/sale',
                            isActive: true,
                            position: 1,
                            startDate: '2025-06-01T00:00:00Z',
                            endDate: '2025-08-31T23:59:59Z',
                            createdAt: '2025-05-15T10:00:00Z'
                        },
                        {
                            id: 2,
                            title: 'Новинки в каталоге',
                            description: 'Смотрите новые коллекции шаров',
                            image: '/images/banner2.jpg',
                            link: '/new',
                            isActive: true,
                            position: 2,
                            startDate: '2025-07-01T00:00:00Z',
                            endDate: null,
                            createdAt: '2025-06-20T14:30:00Z'
                        }
                    ] as any[],
                    total: 2
                });

            case 'pages':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            title: 'О нас',
                            slug: 'about',
                            content: 'Информация о компании...',
                            metaTitle: 'О нас - BalloonShop',
                            metaDescription: 'Узнайте больше о нашей компании',
                            isPublished: true,
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-06-15T12:00:00Z'
                        },
                        {
                            id: 2,
                            title: 'Доставка и оплата',
                            slug: 'delivery',
                            content: 'Условия доставки и оплаты...',
                            metaTitle: 'Доставка и оплата - BalloonShop',
                            metaDescription: 'Условия доставки и способы оплаты',
                            isPublished: true,
                            createdAt: '2024-01-01T00:00:00Z',
                            updatedAt: '2025-06-20T15:30:00Z'
                        }
                    ] as any[],
                    total: 2
                });

            case 'navigation':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            title: 'Главная',
                            url: '/',
                            parent: null,
                            order: 1,
                            isActive: true,
                            openInNewTab: false
                        },
                        {
                            id: 2,
                            title: 'Каталог',
                            url: '/catalog',
                            parent: null,
                            order: 2,
                            isActive: true,
                            openInNewTab: false
                        },
                        {
                            id: 3,
                            title: 'Сердца',
                            url: '/catalog/hearts',
                            parent: 2,
                            order: 1,
                            isActive: true,
                            openInNewTab: false
                        },
                        {
                            id: 4,
                            title: 'Букеты',
                            url: '/catalog/bouquets',
                            parent: 2,
                            order: 2,
                            isActive: true,
                            openInNewTab: false
                        }
                    ] as any[],
                    total: 4
                });

            default:
                return Promise.resolve({ data: [] as any[], total: 0 });
        }
    },

    getOne: (resource: string, params: any) => {
        console.log('Getting one for resource:', resource, 'with params:', params);

        // Для некоторых ресурсов возвращаем более реалистичные данные
        switch (resource) {
            case 'admin-users':
                return Promise.resolve({
                    data: {
                        id: params.id,
                        username: 'test_user',
                        email: 'test@example.com',
                        firstName: 'Тест',
                        lastName: 'Пользователь',
                        role: 'manager',
                        isActive: true,
                        twoFactorEnabled: false,
                        createdAt: '2024-01-01T00:00:00Z'
                    } as any
                });
            default:
                return Promise.resolve({
                    data: { id: params.id, name: `Mock ${resource} ${params.id}` } as any
                });
        }
    },

    getMany: (resource: string, params: any) => {
        console.log('Getting many for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: [] as any[] });
    },

    getManyReference: (resource: string, params: any) => {
        console.log('Getting many reference for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: [] as any[], total: 0 });
    },

    create: (resource: string, params: any) => {
        console.log('Creating for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: { ...params.data, id: Date.now() } as any });
    },

    update: (resource: string, params: any) => {
        console.log('Updating for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: params.data as any });
    },

    updateMany: (resource: string, params: any) => {
        console.log('Updating many for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: params.ids as any[] });
    },

    delete: (resource: string, params: any) => {
        console.log('Deleting for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: { id: params.id } as any });
    },

    deleteMany: (resource: string, params: any) => {
        console.log('Deleting many for resource:', resource, 'with params:', params);
        return Promise.resolve({ data: params.ids as any[] });
    }
};

const SecureProductList = withPermissions(ProductList, 'products.view');
const SecureProductEdit = withPermissions(ProductEdit, 'products.edit');
const SecureProductCreate = withPermissions(ProductCreate, 'products.create');

const SecureOrderList = withPermissions(OrderList, 'orders.view');
const SecureOrderEdit = withPermissions(OrderEdit, 'orders.edit');

const SecureUserList = withPermissions(UserList, 'users.view');
const SecureUserEdit = withPermissions(UserEdit, 'users.edit');
const SecureUserCreate = withPermissions(UserCreate, 'users.create');

const SecureAdminLogList = withPermissions(AdminLogList, 'logs.view');
const SecureApiKeyList = withPermissions(ApiKeyList, 'api_keys.manage');

// Кастомная страница профиля
const ProfilePage = () => (
    <div style={{ padding: 20 }}>
        <h2>Мой профиль</h2>
        <p>Здесь пользователь может изменить свои данные, настроить 2FA и т.д.</p>
    </div>
);

const App = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={mockDataProvider}
        dashboard={Dashboard}
        menu={CustomMenu}
        title="Админ панель - Шарики"
    >
        {/* Заказы и клиенты */}
        <Resource
            name="orders"
            list={SecureOrderList}
            edit={SecureOrderEdit}
            options={{ label: 'Заказы' }}
        />

        <Resource
            name="callbacks"
            list={withPermissions(CallbackList, 'callbacks.view')}
            edit={withPermissions(CallbackEdit, 'callbacks.edit')}
            options={{ label: 'Обратные звонки' }}
        />

        <Resource
            name="comments"
            list={withPermissions(CommentList, 'reviews.view')}
            edit={withPermissions(CommentEdit, 'reviews.edit')}
            show={withPermissions(CommentShow, 'reviews.view')}
            options={{ label: 'Комментарии' }}
        />

        <Resource
            name="customers"
            list={withPermissions(CustomerList, 'customers.view')}
            edit={withPermissions(CustomerEdit, 'customers.edit')}
            options={{ label: 'Клиенты' }}
        />

        {/* Каталог */}
        <Resource
            name="products"
            list={SecureProductList}
            edit={SecureProductEdit}
            create={SecureProductCreate}
            options={{ label: 'Товары' }}
        />

        <Resource
            name="categories"
            list={withPermissions(CategoryList, 'categories.view')}
            edit={withPermissions(CategoryEdit, 'categories.edit')}
            create={withPermissions(CategoryCreate, 'categories.create')}
            options={{ label: 'Категории' }}
        />

        {/* Сайт */}
        <Resource
            name="banners"
            list={withPermissions(BannerList, 'website.banners')}
            edit={withPermissions(BannerEdit, 'website.banners')}
            create={withPermissions(BannerCreate, 'website.banners')}
            options={{ label: 'Баннеры' }}
        />

        <Resource
            name="pages"
            list={withPermissions(PageList, 'website.pages')}
            edit={withPermissions(PageEdit, 'website.pages')}
            create={withPermissions(PageCreate, 'website.pages')}
            show={withPermissions(PageShow, 'website.pages')}
            options={{ label: 'Страницы' }}
        />

        <Resource
            name="navigation"
            list={withPermissions(NavigationList, 'website.navigation')}
            edit={withPermissions(NavigationEdit, 'website.navigation')}
            create={withPermissions(NavigationCreate, 'website.navigation')}
            options={{ label: 'Навигация' }}
        />

        <Resource
            name="settings"
            edit={withPermissions(SiteSettingsEdit, 'website.settings')}
            options={{ label: 'Настройки' }}
        />

        {/* Администрирование */}
        <Resource
            name="admin-users"
            list={SecureUserList}
            edit={SecureUserEdit}
            create={SecureUserCreate}
            show={withPermissions(UserShow, 'users.view')}
            options={{ label: 'Пользователи админки' }}
        />

        <Resource
            name="admin-logs"
            list={SecureAdminLogList}
            show={withPermissions(AdminLogShow, 'logs.view')}
            options={{ label: 'Логи действий' }}
        />

        <Resource
            name="api-keys"
            list={SecureApiKeyList}
            edit={withPermissions(ApiKeyEdit, 'api_keys.manage')}
            create={withPermissions(ApiKeyCreate, 'api_keys.manage')}
            options={{ label: 'API ключи' }}
        />

        {/* Кастомные маршруты */}
        <CustomRoutes>
            <Route path="/profile" element={<ProfilePage />} />
        </CustomRoutes>
    </Admin>
);

export default App;