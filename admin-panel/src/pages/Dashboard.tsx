import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid, Box, Chip } from '@mui/material';
import { Title, useGetList } from 'react-admin';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Типы для данных
interface StatCard {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    color: 'primary' | 'success' | 'info' | 'warning';
}

interface ChartData {
    date: string;
    visitors: number;
    orders: number;
    conversion: number;
}

// Моковые данные для графиков
const chartData: ChartData[] = [
    { date: '17.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '18.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '19.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '20.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '21.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '22.06', visitors: 0, orders: 0, conversion: 0 },
    { date: '23.06', visitors: 4, orders: 2, conversion: 0.5 },
    { date: '24.06', visitors: 0, orders: 0, conversion: 0 },
];

// Компонент карточки статистики
const StatisticCard: React.FC<StatCard> = ({ title, value, subtitle, color }) => (
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

// Компонент графика
const ChartCard: React.FC<{ title: string; dataKey: string; color: string; children: React.ReactNode }> = ({
                                                                                                               title,
                                                                                                               children
                                                                                                           }) => (
    <Card sx={{ height: 300 }}>
        <CardHeader title={title} />
        <CardContent sx={{ height: 240 }}>
            {children}
        </CardContent>
    </Card>
);

// Временные периоды
const TimePeriods = () => (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Chip label="Сегодня" variant="outlined" />
        <Chip label="Вчера" variant="outlined" />
        <Chip label="Неделя" variant="outlined" />
        <Chip label="Месяц" variant="outlined" />
        <Chip label="Квартал" variant="filled" color="primary" />
    </Box>
);

export const Dashboard = () => {
    // Получаем реальные данные заказов
    const { data: orders, isLoading: ordersLoading } = useGetList('orders', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'date', order: 'DESC' }
    });

    // Получаем данные клиентов
    const { data: customers, isLoading: customersLoading } = useGetList('customers', {
        pagination: { page: 1, perPage: 1000 }
    });

    // Статистика
    const stats: StatCard[] = [
        {
            title: 'Посетители',
            value: '0',
            subtitle: '',
            color: 'primary'
        },
        {
            title: 'Заказы',
            value: orders?.length || '2',
            subtitle: '4 товара',
            color: 'success'
        },
        {
            title: 'Конверсия',
            value: '0%',
            subtitle: '',
            color: 'info'
        }
    ];

    return (
        <div>
            <Title title="Обзор" />

            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Обзор
                </Typography>
                <TimePeriods />
            </Box>

            {/* Статистические карточки */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <StatisticCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* Графики */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <ChartCard title="Посетители" dataKey="visitors" color="#8884d8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="visitors" stroke="#9CA3AF" fill="#F3F4F6" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <ChartCard title="Заказы" dataKey="orders" color="#82ca9d">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="orders" stroke="#10B981" fill="#D1FAE5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <ChartCard title="Конверсия" dataKey="conversion" color="#ffc658">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="conversion" stroke="#06B6D4" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </Grid>
            </Grid>

            {/* Дополнительная статистика */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Последние заказы" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {ordersLoading ? 'Загрузка...' : `Всего заказов: ${orders?.length || 0}`}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardHeader title="Клиенты" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                {customersLoading ? 'Загрузка...' : `Всего клиентов: ${customers?.length || 0}`}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};