import React from 'react';
import { Menu } from 'react-admin';

export const CustomMenu = () => (
    <Menu>
            <Menu.DashboardItem />
            <Menu.ResourceItem name="orders" />
            <Menu.ResourceItem name="comments" />
            <Menu.ResourceItem name="callbacks" />
            <Menu.ResourceItem name="customers" />
            <Menu.ResourceItem name="products" />
            <Menu.ResourceItem name="website" />
            <Menu.ResourceItem name="discounts" />
            <Menu.ResourceItem name="marketing" />
            <Menu.ResourceItem name="analytics" />
            <Menu.ResourceItem name="settings" />
    </Menu>
);