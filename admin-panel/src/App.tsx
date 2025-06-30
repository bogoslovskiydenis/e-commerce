import { Admin, Resource } from 'react-admin';
import { Dashboard } from './pages/Dashboard';

// Импорты ресурсов
import { ProductList, ProductEdit, ProductCreate } from './resources';
import { OrderList, OrderEdit } from './resources';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources';
import { CustomerList, CustomerEdit } from './resources';
import { ReviewList, ReviewEdit } from './resources';
import { CallbackList, CallbackEdit } from './resources';

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

// Простой мок провайдер данных
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
                        }
                    ] as any[],
                    total: 1
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
                            inStock: true
                        },
                        {
                            id: 2,
                            brand: 'BalloonShop',
                            title: 'Букет "С днем рождения"',
                            price: 450,
                            image: '/api/placeholder/300/300',
                            category: 'bouquets',
                            categoryId: 2,
                            inStock: true
                        }
                    ] as any[],
                    total: 2
                });

            case 'categories':
                return Promise.resolve({
                    data: [
                        { id: 1, name: 'Сердца', slug: 'hearts', description: 'Фольгированные сердца' },
                        { id: 2, name: 'Букеты', slug: 'bouquets', description: 'Букеты из шаров' },
                        { id: 3, name: 'Цифры', slug: 'numbers', description: 'Цифры из шаров' }
                    ] as any[],
                    total: 3
                });

            case 'customers':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Олена Сергіївна',
                            email: 'elena@example.com',
                            phone: '+38 (066) 453-45-46',
                            address: 'м. Ірпінь, Київська обл.'
                        }
                    ] as any[],
                    total: 1
                });

            case 'reviews':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            date: '2025-01-22T14:45:43',
                            customerName: 'Шановний клієнте',
                            productName: 'Поліетилен високої щільності',
                            rating: 5,
                            comment: 'Ми, компанія Kayi Plastik, є надійним іменем у галузі пластмас, що базується в Стамбулі, Туреччина. Завдяки багаторічному досвіду у міжнародній торгівлі, ми успішно експортуємо високоякісні матеріали до таких країн, як Італія, Болгарія, Ірак, Північна Македонія...',
                            status: 'pending',
                            template: 'Сучасні пакувальні матеріали: повний огляд для бізнесу та приватного використання'
                        },
                        {
                            id: 2,
                            date: '2025-01-22T14:45:58',
                            customerName: 'Шановний клієнте',
                            productName: 'Поліетилен високої щільності',
                            rating: 5,
                            comment: 'Ми, компанія Kayi Plastik, є надійним іменем у галузі пластмас, що базується в Стамбулі, Туреччина. Завдяки багаторічному досвіду у міжнародній торгівлі, ми успішно експортуємо високоякісні матеріали до таких країн, як Італія, Болгарія, Ірак, Північна Македонія...',
                            status: 'pending',
                            template: 'Сучасні пакувальні матеріали: повний огляд для бізнесу та приватного використання'
                        }
                    ] as any[],
                    total: 2
                });

            case 'callbacks':
                return Promise.resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Олена',
                            phone: '+38 (097) 649-43-97',
                            date: '2025-06-21T08:47:07',
                            url: '/ru/struzhka-derevyna-1-kh/',
                            status: 'new',
                            processed: false
                        }
                    ] as any[],
                    total: 1
                });

            default:
                return Promise.resolve({ data: [] as any[], total: 0 });
        }
    },

    getOne: (resource: string, params: any) => {
        console.log('Getting one for resource:', resource, 'with params:', params);
        return Promise.resolve({
            data: { id: params.id, name: `Mock ${resource}` } as any
        });
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

const App = () => (
    <Admin
        dashboard={Dashboard}
        dataProvider={mockDataProvider}
        title="E-commerce Admin"
        menu={CustomMenu}
    >
        {/* Секция "Сайт" */}
        <Resource
            name="banners"
            list={BannerList}
            edit={BannerEdit}
            create={BannerCreate}
            options={{ label: 'Баннеры' }}
        />
        <Resource
            name="pages"
            list={PageList}
            edit={PageEdit}
            create={PageCreate}
            show={PageShow}
            options={{ label: 'Страницы' }}
        />
        <Resource
            name="settings"
            edit={SiteSettingsEdit}
            options={{ label: 'Настройки сайта' }}
        />

        {/* Секция "Заказы" */}
        <Resource
            name="orders"
            list={OrderList}
            edit={OrderEdit}
            options={{ label: 'Заказы' }}
        />
        <Resource
            name="callbacks"
            list={CallbackList}
            edit={CallbackEdit}
            options={{ label: 'Обратный звонок' }}
        />
        <Resource
            name="reviews"
            list={ReviewList}
            edit={ReviewEdit}
            options={{ label: 'Комментарии и отзывы' }}
        />

        {/* Секция "Каталог" */}
        <Resource
            name="products"
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
            options={{ label: 'Товары' }}
        />
        <Resource
            name="categories"
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
            options={{ label: 'Категории' }}
        />

        {/* Секция "Клиенты" */}
        <Resource
            name="customers"
            list={CustomerList}
            edit={CustomerEdit}
            options={{ label: 'Клиенты' }}
        />
    </Admin>
);

export default App;