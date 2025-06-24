import React from 'react';
import { Layout } from 'react-admin';
import { CustomSidebar } from './CustomSidebar';

export const CustomLayout = (props: any) => (
    <Layout {...props} sidebar={CustomSidebar} />
);