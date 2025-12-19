import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    TrendingUp,
    People,
    ShoppingCart,
    Inventory,
    AttachMoney
} from '@mui/icons-material';
import { useDataProvider, useNotify } from 'react-admin';

interface DashboardStats {
    totalUsers: number;
    totalOrders: number;
    totalProducts: number;
    revenue: number;
    newUsers: number;
    completedOrders: number;
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const dataProvider = useDataProvider();
    const notify = useNotify();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);

            // Используем кастомный метод dataProvider для получения статистики
            const statsData = await dataProvider.getStats();
            // Извлекаем data из ответа и устанавливаем значения по умолчанию для отсутствующих полей
            setStats({
                totalUsers: statsData.data?.totalUsers ?? 0,
                totalOrders: statsData.data?.totalOrders ?? 0,
                totalProducts: statsData.data?.totalProducts ?? 0,
                revenue: statsData.data?.revenue ?? 0,
                newUsers: statsData.data?.newUsers ?? 0,
                completedOrders: statsData.data?.completedOrders ?? 0
            });

        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
            notify('Ошибка загрузки статистики', { type: 'error' });

            // Устанавливаем значения по умолчанию
            setStats({
                totalUsers: 0,
                totalOrders: 0,
                totalProducts: 0,
                revenue: 0,
                newUsers: 0,
                completedOrders: 0
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (!stats) {
        return (
            <Alert severity="error">
                Не удалось загрузить данные дашборда
            </Alert>
        );
    }

    const statCards = [
        {
            title: 'Всего пользователей',
            value: stats.totalUsers,
            icon: <People sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
        },
        {
            title: 'Всего заказов',
            value: stats.totalOrders,
            icon: <ShoppingCart sx={{ fontSize: 40 }} />,
            color: '#388e3c',
            bgColor: '#e8f5e8'
        },
        {
            title: 'Товаров в каталоге',
            value: stats.totalProducts,
            icon: <Inventory sx={{ fontSize: 40 }} />,
            color: '#f57c00',
            bgColor: '#fff3e0'
        },
        {
            title: 'Общая выручка',
            value: `$${stats.revenue.toLocaleString()}`,
            icon: <AttachMoney sx={{ fontSize: 40 }} />,
            color: '#7b1fa2',
            bgColor: '#f3e5f5'
        },
        {
            title: 'Новые пользователи',
            value: stats.newUsers,
            icon: <TrendingUp sx={{ fontSize: 40 }} />,
            color: '#d32f2f',
            bgColor: '#ffebee'
        },
        {
            title: 'Выполненные заказы',
            value: stats.completedOrders,
            icon: <ShoppingCart sx={{ fontSize: 40 }} />,
            color: '#1976d2',
            bgColor: '#e3f2fd'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Дашборд
            </Typography>

            <Typography variant="body1" color="text.secondary" gutterBottom>
                Добро пожаловать в панель управления интернет-магазином шариков
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
                {statCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            elevation={2}
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            backgroundColor: card.bgColor,
                                            color: card.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        {card.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" component="div" color={card.color}>
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {card.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Быстрые действия
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Добавить новый товар<br />
                                • Просмотреть новые заказы<br />
                                • Обработать обратные звонки<br />
                                • Проверить отзывы клиентов
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Системная информация
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                • Версия: 1.0.0<br />
                                • Последнее обновление: {new Date().toLocaleDateString()}<br />
                                • Статус API: Подключено<br />
                                • Аутентификация: Активна
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;