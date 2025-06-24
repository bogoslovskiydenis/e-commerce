import React from 'react';
import { Sidebar } from 'react-admin';
import { CustomMenu } from './CustomMenu';

export const CustomSidebar = (props: any) => (
    <Sidebar {...props}>
        <CustomMenu />
    </Sidebar>
);