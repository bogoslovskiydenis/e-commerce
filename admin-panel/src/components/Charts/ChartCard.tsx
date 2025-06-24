import React from 'react';
import { Card, CardHeader, CardContent } from '@mui/material';

interface ChartCardProps {
    title: string;
    children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
    <Card sx={{ height: 300 }}>
        <CardHeader title={title} />
        <CardContent sx={{ height: 240 }}>
            {children}
        </CardContent>
    </Card>
);

