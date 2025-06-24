import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    color: 'primary' | 'success' | 'info' | 'warning';
}

export const StatisticCard: React.FC<StatCardProps> = ({ title, value, subtitle, color }) => (
    <Card sx={{ height: '100%' }}>
        <CardContent>
            <Typography variant="h6" component="div" gutterBottom>
                {title}
            </Typography>
            <Typography variant="h3" component="div" color={`${color}.main`} sx={{ mb: 1 }}>
                {value}
            </Typography>
            {subtitle && (
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
        </CardContent>
    </Card>
);
