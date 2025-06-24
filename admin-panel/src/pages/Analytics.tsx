// Analytics Page
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';
import { Title } from 'react-admin';

export const AnalyticsDashboard = () => (
    <div>
        <Title title="Аналитика" />
        <Typography variant="h4" component="h1" gutterBottom>
            Аналитика
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Продажи" />
                    <CardContent>
                        <Typography variant="body2">
                            Здесь будет аналитика продаж
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Посетители" />
                    <CardContent>
                        <Typography variant="body2">
                            Здесь будет аналитика посетителей
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
);