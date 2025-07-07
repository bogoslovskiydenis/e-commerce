import React, { useState } from 'react';
import {
    Menu,
    MenuItemLink,
    DashboardMenuItem,
    useResourceDefinitions
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
    Settings as SettingsIcon
} from '@mui/icons-material';

export const CustomMenu = (props: any) => {
    const [websiteOpen, setWebsiteOpen] = useState(false);
    const [ordersOpen, setOrdersOpen] = useState(false);
    const [catalogOpen, setCatalogOpen] = useState(false);
    const resources = useResourceDefinitions();

    return (
        <Menu {...props}>
            <DashboardMenuItem />

            {/* Секция Сайт */}
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
                    <MenuItemLink
                        to="/navigation"
                        primaryText="Навигация"
                        leftIcon={<Menu fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/banners"
                        primaryText="Баннеры"
                        leftIcon={<Image fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/pages"
                        primaryText="Страницы"
                        leftIcon={<Article fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/settings/1"
                        primaryText="Настройки сайта"
                        leftIcon={<SettingsIcon fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                </List>
            </Collapse>

            {/* Секция Заказы */}
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
                    <MenuItemLink
                        to="/orders"
                        primaryText="Заказы"
                        leftIcon={<ShoppingCart fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/callbacks"
                        primaryText="Обратный звонок"
                        leftIcon={<Phone fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/reviews"
                        primaryText="Комментарии и отзывы"
                        leftIcon={<Reviews fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                </List>
            </Collapse>

            {/* Секция Каталог */}
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
                    <MenuItemLink
                        to="/products"
                        primaryText="Товары"
                        leftIcon={<Inventory fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                    <MenuItemLink
                        to="/categories"
                        primaryText="Категории"
                        leftIcon={<Category fontSize="small" />}
                        sx={{ paddingLeft: 4 }}
                    />
                </List>
            </Collapse>

            {/* Клиенты */}
            <MenuItemLink
                to="/customers"
                primaryText="Клиенты"
                leftIcon={<People />}
                sx={{ paddingLeft: 2 }}
            />
        </Menu>
    );
};