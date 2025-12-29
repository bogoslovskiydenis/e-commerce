import React from 'react';
import { Menu, usePermissions } from 'react-admin';
import {
    Dashboard,
    ShoppingCart,
    Inventory,
    Category,
    People,
    Phone,
    RateReview,
    Image,
    Article,
    Menu as MenuIcon,
    Settings,
    AdminPanelSettings,
    History,
    Key,
    Analytics,
    LocalOffer
} from '@mui/icons-material';

export const CustomMenu: React.FC = () => {
    const { permissions } = usePermissions();

    // Функция проверки разрешений
    const hasPermission = (permission: string): boolean => {
        if (!permissions) return false;
        return permissions.includes(permission) || permissions.includes('admin.full_access');
    };

    const resources = [
        // Дашборд - доступен всем
        {
            name: 'dashboard',
            icon: <Dashboard />,
            label: 'Дашборд'
        },

        // Заказы и клиенты
        ...(hasPermission('orders.view') ? [{
            name: 'orders',
            icon: <ShoppingCart />,
            label: 'Заказы'
        }] : []),

        ...(hasPermission('callbacks.view') ? [{
            name: 'callbacks',
            icon: <Phone />,
            label: 'Обратные звонки'
        }] : []),

        ...(hasPermission('reviews.view') ? [{
            name: 'comments',
            icon: <RateReview />,
            label: 'Отзывы'
        }] : []),

        ...(hasPermission('customers.view') ? [{
            name: 'customers',
            icon: <People />,
            label: 'Клиенты'
        }] : []),

        // Каталог
        ...(hasPermission('products.view') ? [{
            name: 'products',
            icon: <Inventory />,
            label: 'Товары'
        }] : []),

        ...(hasPermission('categories.view') ? [{
            name: 'categories',
            icon: <Category />,
            label: 'Категории'
        }] : []),

        // Контент сайта
        ...(hasPermission('website.banners') ? [{
            name: 'banners',
            icon: <Image />,
            label: 'Баннеры'
        }] : []),

        ...(hasPermission('promotions.view') ? [{
            name: 'promotions',
            icon: <LocalOffer />,
            label: 'Акции и промокоды'
        }] : []),

        ...(hasPermission('website.pages') ? [{
            name: 'pages',
            icon: <Article />,
            label: 'Страницы'
        }] : []),

        ...(hasPermission('website.navigation') ? [{
            name: 'navigation',
            icon: <MenuIcon />,
            label: 'Навигация'
        }] : []),

        ...(hasPermission('website.settings') ? [{
            name: 'settings',
            icon: <Settings />,
            label: 'Настройки'
        }] : []),

        // Аналитика
        ...(hasPermission('analytics.view') ? [{
            name: 'analytics',
            icon: <Analytics />,
            label: 'Аналитика'
        }] : []),

        // Администрирование
        ...(hasPermission('users.view') ? [{
            name: 'admin-users',
            icon: <AdminPanelSettings />,
            label: 'Пользователи'
        }] : []),

        ...(hasPermission('logs.view') ? [{
            name: 'admin-logs',
            icon: <History />,
            label: 'Журнал действий'
        }] : []),

        ...(hasPermission('api_keys.manage') ? [{
            name: 'api-keys',
            icon: <Key />,
            label: 'API ключи'
        }] : [])
    ];

    return (
        <Menu>
            {resources.map(resource => (
                <Menu.Item
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={resource.label}
                    leftIcon={resource.icon}
                />
            ))}
        </Menu>
    );
};

export default CustomMenu;