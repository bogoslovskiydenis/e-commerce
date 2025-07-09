import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Alert
} from '@mui/material';
import {
    Analytics as AnalyticsIcon,
    TrendingUp,
    Assessment
} from '@mui/icons-material';

const AnalyticsPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <AnalyticsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Аналитика
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Продажи
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Здесь будут отображаться графики продаж и статистика
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Отчеты
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Различные отчеты и метрики
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
                Страница аналитики находится в разработке
            </Alert>
        </Box>
    );
};

export default AnalyticsPage;