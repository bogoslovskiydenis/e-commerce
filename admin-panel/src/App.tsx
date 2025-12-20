// admin-panel/src/App.tsx - Обновить существующий файл
import React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin';
import { Route } from 'react-router-dom';

// Провайдеры (существующие)
import { authProvider } from './auth/authProvider';
import dataProvider from './utils/dataProvider'

// Кастомные компоненты (существующие)
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { CustomMenu } from './components/CustomMenu';

// HOC для проверки разрешений (существующий)
import { withPermissions } from './components/PermissionGuard';

// 🆕 НОВЫЙ ИМПОРТ - Компонент управления навигацией
import NavigationManager from './components/Navigation/NavigationManager';

// Ресурсы - Заказы и клиенты (существующие)
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

// Ресурсы - Каталог (существующие)
import {
    ProductList,
    ProductEdit,
    ProductCreate
} from './resources/products';

// 🆕 ОБНОВЛЕННЫЙ ИМПОРТ - Категории с новыми полями навигации
import {
    CategoryList,
    CategoryEdit,
    CategoryCreate,
    CategoryShow
} from './resources/categories';

// Ресурсы - Администрирование (существующие)
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

// Кастомные страницы (существующие)
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import SystemInfoPage from './pages/SystemInfoPage';

// Создаём заглушки для Show компонентов если их нет (существующие)
const OrderShow = () => <div>Order Show</div>;
const ProductShow = () => <div>Product Show</div>;
const CustomerShow = () => <div>Customer Show</div>;

// Создаём заглушки для недостающих ресурсов (существующие)
const BannerList = () => <div>Banner List</div>;
const BannerEdit = () => <div>Banner Edit</div>;
const BannerCreate = () => <div>Banner Create</div>;

const PageList = () => <div>Page List</div>;
const PageEdit = () => <div>Page Edit</div>;
const PageCreate = () => <div>Page Create</div>;
const PageShow = () => <div>Page Show</div>;

const SiteSettingsEdit = () => <div>Settings Edit</div>;

const AdminLogList = () => <div>Admin Log List</div>;
const AdminLogShow = () => <div>Admin Log Show</div>;

// Создаем защищенные компоненты с проверкой разрешений (существующие)
const SecureOrderList = withPermissions(OrderList, 'orders.view');
const SecureOrderEdit = withPermissions(OrderEdit, 'orders.edit');
const SecureOrderShow = withPermissions(OrderShow, 'orders.view');

const SecureProductList = withPermissions(ProductList, 'products.view');
const SecureProductEdit = withPermissions(ProductEdit, 'products.edit');
const SecureProductCreate = withPermissions(ProductCreate, 'products.create');
const SecureProductShow = withPermissions(ProductShow, 'products.view');

// 🆕 ЗАЩИЩЕННЫЕ КОМПОНЕНТЫ КАТЕГОРИЙ
const SecureCategoryList = withPermissions(CategoryList, 'categories.view');
const SecureCategoryEdit = withPermissions(CategoryEdit, 'categories.edit');
const SecureCategoryCreate = withPermissions(CategoryCreate, 'categories.create');
const SecureCategoryShow = withPermissions(CategoryShow, 'categories.view');

// 🆕 ЗАЩИЩЕННЫЙ КОМПОНЕНТ НАВИГАЦИИ
const SecureNavigationManager = withPermissions(NavigationManager, 'website.navigation');

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
        dataProvider={dataProvider}
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
            name="customers"
            list={CustomerList}
            edit={CustomerEdit}
            show={CustomerShow}
            options={{
                label: 'Клиенты'
            }}
        />

        <Resource
            name="callbacks"
            list={CallbackList}
            edit={CallbackEdit}
            options={{
                label: 'Обратные звонки'
            }}
        />

        <Resource
            name="comments"
            list={CommentList}
            edit={CommentEdit}
            show={CommentShow}
            options={{
                label: 'Комментарии'
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

        {/* 🆕 ОБНОВЛЕННЫЙ РЕСУРС КАТЕГОРИЙ */}
        <Resource
            name="categories"
            list={SecureCategoryList}
            edit={SecureCategoryEdit}
            create={SecureCategoryCreate}
            show={SecureCategoryShow}
            options={{
                label: 'Категории'
            }}
        />

        {/* === КОНТЕНТ И САЙТ === */}
        <Resource
            name="banners"
            list={BannerList}
            edit={BannerEdit}
            create={BannerCreate}
            options={{
                label: 'Баннеры'
            }}
        />

        <Resource
            name="pages"
            list={PageList}
            edit={PageEdit}
            create={PageCreate}
            show={PageShow}
            options={{
                label: 'Страницы'
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
                label: 'Логи'
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

        {/* 🆕 КАСТОМНЫЕ РОУТЫ */}
        <CustomRoutes>
            {/* Явный роут для дашборда */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Страница управления навигацией */}
            <Route
                path="/navigation"
                element={<SecureNavigationManager />}
            />

            {/* Существующие кастомные страницы */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/analytics" element={<SecureAnalyticsPage />} />
            <Route path="/system" element={<SecureSystemInfoPage />} />
            <Route path="/settings" element={<SiteSettingsEdit />} />
        </CustomRoutes>
    </Admin>
);

export default App;