import React from 'react';
import { Admin, Resource } from 'react-admin';
import { Dashboard } from './pages/Dashboard';
import { OrderList, OrderEdit } from './resources/orders';
import { CustomerList, CustomerEdit } from './resources/customers';
import { ProductList, ProductEdit, ProductCreate } from './resources/products';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { DiscountList, DiscountEdit, DiscountCreate } from './resources/discounts';
import { CommentList, CommentEdit, CommentShow } from './resources/comments';
import { CallbackList, CallbackEdit, CallbackCreate, CallbackShow } from './resources/callbacks';
import { AnalyticsDashboard } from './pages/Analytics';
import { SettingsPage } from './pages/Settings';
import { MarketingPage } from './pages/Marketing';
import { WebsitePage } from './pages/Website';
import { customDataProvider } from './utils/dataProvider';
import { CustomLayout } from './components/Layout/CustomLayout';

// Icons
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import WebIcon from '@mui/icons-material/Web';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CampaignIcon from '@mui/icons-material/Campaign';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SettingsIcon from '@mui/icons-material/Settings';
import CommentIcon from '@mui/icons-material/Comment';
import PhoneCallbackIcon from '@mui/icons-material/PhoneCallback';

const App = () => (
    <Admin
        dashboard={Dashboard}
        dataProvider={customDataProvider}
        layout={CustomLayout}
    >
        {/* Заказы */}
        <Resource
            name="orders"
            list={OrderList}
            edit={OrderEdit}
            icon={ShoppingCartIcon}
            options={{ label: 'Заказы' }}
        />

        {/* Комментарии и отзывы */}
        <Resource
            name="comments"
            list={CommentList}
            edit={CommentEdit}
            show={CommentShow}
            icon={CommentIcon}
            options={{ label: 'Комментарии и отзывы' }}
        />

        {/* Обратный звонок */}
        <Resource
            name="callbacks"
            list={CallbackList}
            edit={CallbackEdit}
            create={CallbackCreate}
            show={CallbackShow}
            icon={PhoneCallbackIcon}
            options={{ label: 'Обратный звонок' }}
        />

        {/* Клиенты */}
        <Resource
            name="customers"
            list={CustomerList}
            edit={CustomerEdit}
            icon={PeopleIcon}
            options={{ label: 'Клиенты' }}
        />

        {/* Товары */}
        <Resource
            name="products"
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
            icon={InventoryIcon}
            options={{ label: 'Товары' }}
        />

        {/* Категории (вспомогательный ресурс) */}
        <Resource
            name="categories"
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
        />

        {/* Сайт */}
        <Resource
            name="website"
            list={WebsitePage}
            icon={WebIcon}
            options={{ label: 'Сайт' }}
        />

        {/* Скидки */}
        <Resource
            name="discounts"
            list={DiscountList}
            edit={DiscountEdit}
            create={DiscountCreate}
            icon={LocalOfferIcon}
            options={{ label: 'Скидки' }}
        />

        {/* Маркетинг */}
        <Resource
            name="marketing"
            list={MarketingPage}
            icon={CampaignIcon}
            options={{ label: 'Маркетинг' }}
        />

        {/* Аналитика */}
        <Resource
            name="analytics"
            list={AnalyticsDashboard}
            icon={AnalyticsIcon}
            options={{ label: 'Аналитика' }}
        />

        {/* Настройки */}
        <Resource
            name="settings"
            list={SettingsPage}
            icon={SettingsIcon}
            options={{ label: 'Настройки' }}
        />
    </Admin>
);

export default App;