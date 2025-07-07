import React, { useState } from 'react';
import {
    Menu,
    MenuItemLink,
    DashboardMenuItem,
    useResourceDefinitions,
    usePermissions
} from 'react-admin';
import { Collapse, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import {
    ExpandLess,
    ExpandMore,
    Dashboard,
    ShoppingCart,
    Phone,
    Reviews,
    Inventory,
    Category,
    People,
    Language,
    Image,
    Article,
    Settings as SettingsIcon,
    Menu as MenuIcon,
    Security,
    History,
    Key,
    AdminPanelSettings
} from '@mui/icons-material';
import { PermissionsWrapper } from './PermissionsWrapper';

export const CustomMenu = (props: any) => {
    const [websiteOpen, setWebsiteOpen] = useState(false);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const [securityOpen, setSecurityOpen] = useState(false);
    const resources = useResourceDefinitions();

    return (
        <Menu {...props}>
            <DashboardMenuItem />

            {/* Секция Сайт */}
            <PermissionsWrapper permission={['website.banners', 'website.pages', 'website.settings']}>
                <ListItem
                    button
                    onClick={() => setWebsiteOpen(!websiteOpen)}
                    sx={{
                        paddingLeft: 2,
                        backgroundColor: websiteOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                    }}
                >
                    <ListItemIcon>
                        <Language />
                    </ListItemIcon>
                    <ListItemText primary="Сайт" />
                    {websiteOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={websiteOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <PermissionsWrapper permission="website.navigation">
                            <MenuItemLink
                                to="/navigation"
                                primaryText="Навигация"
                                leftIcon={<MenuIcon fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="website.banners">
                            <MenuItemLink
                                to="/banners"
                                primaryText="Баннеры"
                                leftIcon={<Image fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="website.pages">
                            <MenuItemLink
                                to="/pages"
                                primaryText="Страницы"
                                leftIcon={<Article fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="website.settings">
                            <MenuItemLink
                                to="/settings/1"
                                primaryText="Настройки сайта"
                                leftIcon={<SettingsIcon fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>
                    </List>
                </Collapse>
            </PermissionsWrapper>

            {/* Секция Заказы */}
            <PermissionsWrapper permission={['orders.view', 'callbacks.view', 'reviews.view']}>
                <ListItem
                    button
                    onClick={() => setOrdersOpen(!ordersOpen)}
                    sx={{
                        paddingLeft: 2,
                        backgroundColor: ordersOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                    }}
                >
                    <ListItemIcon>
                        <ShoppingCart />
                    </ListItemIcon>
                    <ListItemText primary="Заказы" />
                    {ordersOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={ordersOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <PermissionsWrapper permission="orders.view">
                            <MenuItemLink
                                to="/orders"
                                primaryText="Заказы"
                                leftIcon={<ShoppingCart fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="callbacks.view">
                            <MenuItemLink
                                to="/callbacks"
                                primaryText="Обратный звонок"
                                leftIcon={<Phone fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="reviews.view">
                            <MenuItemLink
                                to="/reviews"
                                primaryText="Комментарии и отзывы"
                                leftIcon={<Reviews fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>
                    </List>
                </Collapse>
            </PermissionsWrapper>

            {/* Секция Каталог */}
            <PermissionsWrapper permission={['products.view', 'categories.view']}>
                <ListItem
                    button
                    onClick={() => setCatalogOpen(!catalogOpen)}
                    sx={{
                        paddingLeft: 2,
                        backgroundColor: catalogOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                    }}
                >
                    <ListItemIcon>
                        <Inventory />
                    </ListItemIcon>
                    <ListItemText primary="Каталог" />
                    {catalogOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={catalogOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <PermissionsWrapper permission="products.view">
                            <MenuItemLink
                                to="/products"
                                primaryText="Товары"
                                leftIcon={<Inventory fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="categories.view">
                            <MenuItemLink
                                to="/categories"
                                primaryText="Категории"
                                leftIcon={<Category fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>
                    </List>
                </Collapse>
            </PermissionsWrapper>

            {/* Клиенты */}
            <PermissionsWrapper permission="customers.view">
                <MenuItemLink
                    to="/customers"
                    primaryText="Клиенты"
                    leftIcon={<People />}
                    sx={{ paddingLeft: 2 }}
                />
            </PermissionsWrapper>

            {/* Секция Безопасность и Администрирование */}
            <PermissionsWrapper permission={['users.view', 'logs.view', 'api_keys.manage']}>
                <ListItem
                    button
                    onClick={() => setSecurityOpen(!securityOpen)}
                    sx={{
                        paddingLeft: 2,
                        backgroundColor: securityOpen ? 'rgba(0, 0, 0, 0.04)' : 'transparent'
                    }}
                >
                    <ListItemIcon>
                        <Security />
                    </ListItemIcon>
                    <ListItemText primary="Админ" />
                    {securityOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItem>

                <Collapse in={securityOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <PermissionsWrapper permission="users.view">
                            <MenuItemLink
                                to="/admin-users"
                                primaryText="Пользователи"
                                leftIcon={<AdminPanelSettings fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="logs.view">
                            <MenuItemLink
                                to="/admin-logs"
                                primaryText="Логи действий"
                                leftIcon={<History fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>

                        <PermissionsWrapper permission="api_keys.manage">
                            <MenuItemLink
                                to="/api-keys"
                                primaryText="API ключи"
                                leftIcon={<Key fontSize="small" />}
                                sx={{ paddingLeft: 4 }}
                            />
                        </PermissionsWrapper>
                    </List>
                </Collapse>
            </PermissionsWrapper>
        </Menu>
    );
};