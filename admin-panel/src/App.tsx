import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

// Провайдеры
import { authProvider } from './auth/authProvider';
import { customDataProvider } from './utils/dataProvider';

// Кастомные компоненты
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { CustomMenu } from './components/CustomMenu';

// HOC для проверки разрешений
import { withPermissions } from './components/PermissionGuard';

// Ресурсы - Заказы и клиенты
import {
    OrderList,
    OrderEdit
} from './resources/orders';

import {
    CallbackList,
    CallbackEdit
} from './resources/callbacks';

import {
    CommentList,
    CommentEdit,
    CommentShow
} from './resources/comments';

import {
    CustomerList,
    CustomerEdit
} from './resources/customers';

// Ресурсы - Каталог
import {
    ProductList,
    ProductEdit,
    ProductCreate
} from './resources/products';

import {
    CategoryList,
    CategoryEdit,
    CategoryCreate, CategoryShow
} from './resources/categories';

// Ресурсы - Администрирование
import {
    UserList,
    UserEdit,
    UserCreate,
    UserShow
} from './resources/security/users';

import {
    ApiKeyList,
    ApiKeyEdit,
    ApiKeyCreate
} from './resources/security/apiKeys';

// Кастомные страницы
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SystemInfoPage from './pages/SystemInfoPage';

// Создаём заглушки для Show компонентов если их нет
const OrderShow = () => <div>Order Show</div>;
const ProductShow = () => <div>Product Show</div>;
const CustomerShow = () => <div>Customer Show</div>;

// Создаём заглушки для недостающих ресурсов
const BannerList = () => <div>Banner List</div>;
const BannerEdit = () => <div>Banner Edit</div>;
const BannerCreate = () => <div>Banner Create</div>;

const PageList = () => <div>Page List</div>;
const PageEdit = () => <div>Page Edit</div>;
const PageCreate = () => <div>Page Create</div>;
const PageShow = () => <div>Page Show</div>;

const NavigationList = () => <div>Navigation List</div>;
const NavigationEdit = () => <div>Navigation Edit</div>;
const NavigationCreate = () => <div>Navigation Create</div>;

const SiteSettingsEdit = () => <div>Settings Edit</div>;

const AdminLogList = () => <div>Admin Log List</div>;
const AdminLogShow = () => <div>Admin Log Show</div>;

// Создаем защищенные компоненты с проверкой разрешений
const SecureOrderList = withPermissions(OrderList, 'orders.view');
const SecureOrderEdit = withPermissions(OrderEdit, 'orders.edit');
const SecureOrderShow = withPermissions(OrderShow, 'orders.view');

const SecureProductList = withPermissions(ProductList, 'products.view');
const SecureProductEdit = withPermissions(ProductEdit, 'products.edit');
const SecureProductCreate = withPermissions(ProductCreate, 'products.create');
const SecureProductShow = withPermissions(ProductShow, 'products.view');

const SecureUserList = withPermissions(UserList, 'users.view');
const SecureUserEdit = withPermissions(UserEdit, 'users.edit');
const SecureUserCreate = withPermissions(UserCreate, 'users.create');
const SecureUserShow = withPermissions(UserShow, 'users.view');

const SecureAdminLogList = withPermissions(AdminLogList, 'logs.view');
const SecureAdminLogShow = withPermissions(AdminLogShow, 'logs.view');

const SecureApiKeyList = withPermissions(ApiKeyList, 'api_keys.manage');
const SecureApiKeyEdit = withPermissions(ApiKeyEdit, 'api_keys.manage');
const SecureApiKeyCreate = withPermissions(ApiKeyCreate, 'api_keys.manage');

const SecureAnalyticsPage = withPermissions(AnalyticsPage, 'analytics.view');
const SecureSystemInfoPage = withPermissions(SystemInfoPage, 'admin.full_access');

const App: React.FC = () => (
    <Admin
        authProvider={authProvider}
        dataProvider={customDataProvider}
        dashboard={Dashboard}
        menu={CustomMenu}
        title="Админ панель - Шарики"
        loginPage={LoginPage}
        requireAuth
    >
        {/* === ЗАКАЗЫ И КЛИЕНТЫ === */}
        <Resource
            name="orders"
            list={SecureOrderList}
            edit={SecureOrderEdit}
            show={SecureOrderShow}
            options={{
                label: 'Заказы'
            }}
        />

        <Resource
            name="callbacks"
            list={withPermissions(CallbackList, 'callbacks.view')}
            edit={withPermissions(CallbackEdit, 'callbacks.edit')}
            options={{
                label: 'Обратные звонки'
            }}
        />

        <Resource
            name="comments"
            list={withPermissions(CommentList, 'reviews.view')}
            edit={withPermissions(CommentEdit, 'reviews.edit')}
            show={withPermissions(CommentShow, 'reviews.view')}
            options={{
                label: 'Отзывы'
            }}
        />

        <Resource
            name="customers"
            list={withPermissions(CustomerList, 'customers.view')}
            edit={withPermissions(CustomerEdit, 'customers.edit')}
            show={withPermissions(CustomerShow, 'customers.view')}
            options={{
                label: 'Клиенты'
            }}
        />

        {/* === КАТАЛОГ === */}
        <Resource
            name="products"
            list={SecureProductList}
            edit={SecureProductEdit}
            create={SecureProductCreate}
            show={SecureProductShow}
            options={{
                label: 'Товары'
            }}
        />

        <Resource
            name="categories"
            list={withPermissions(CategoryList, 'categories.view')}
            edit={withPermissions(CategoryEdit, 'categories.edit')}
            create={withPermissions(CategoryCreate, 'categories.create')}
            show={withPermissions(CategoryShow, 'categories.view')}  // Добавляем Show
            options={{
                label: 'Категории'
            }}
        />

        {/* === КОНТЕНТ САЙТА === */}
        <Resource
            name="banners"
            list={withPermissions(BannerList, 'website.banners')}
            edit={withPermissions(BannerEdit, 'website.banners')}
            create={withPermissions(BannerCreate, 'website.banners')}
            options={{
                label: 'Баннеры'
            }}
        />

        <Resource
            name="pages"
            list={withPermissions(PageList, 'website.pages')}
            edit={withPermissions(PageEdit, 'website.pages')}
            create={withPermissions(PageCreate, 'website.pages')}
            show={withPermissions(PageShow, 'website.pages')}
            options={{
                label: 'Страницы'
            }}
        />

        <Resource
            name="navigation"
            list={withPermissions(NavigationList, 'website.navigation')}
            edit={withPermissions(NavigationEdit, 'website.navigation')}
            create={withPermissions(NavigationCreate, 'website.navigation')}
            options={{
                label: 'Навигация'
            }}
        />

        <Resource
            name="settings"
            edit={withPermissions(SiteSettingsEdit, 'website.settings')}
            options={{
                label: 'Настройки сайта'
            }}
        />

        {/* === АДМИНИСТРИРОВАНИЕ === */}
        <Resource
            name="admin-users"
            list={SecureUserList}
            edit={SecureUserEdit}
            create={SecureUserCreate}
            show={SecureUserShow}
            options={{
                label: 'Пользователи'
            }}
        />

        <Resource
            name="admin-logs"
            list={SecureAdminLogList}
            show={SecureAdminLogShow}
            options={{
                label: 'Журнал действий'
            }}
        />

        <Resource
            name="api-keys"
            list={SecureApiKeyList}
            edit={SecureApiKeyEdit}
            create={SecureApiKeyCreate}
            options={{
                label: 'API ключи'
            }}
        />

        {/* === КАСТОМНЫЕ МАРШРУТЫ === */}
        <CustomRoutes>
            {/* Страница профиля - доступна всем */}
            <Route path="/profile" element={<ProfilePage />} />

            {/* Аналитика - требует разрешение */}
            <Route path="/analytics" element={<SecureAnalyticsPage />} />

            {/* Системная информация - только для супер админов */}
            <Route path="/system-info" element={<SecureSystemInfoPage />} />
        </CustomRoutes>
    </Admin>
);

export default App;
