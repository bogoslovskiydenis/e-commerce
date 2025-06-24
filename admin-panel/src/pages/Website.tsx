import React from 'react';
import { Card, CardContent, CardHeader, Typography, Grid } from '@mui/material';
import { Title } from 'react-admin';

export const WebsitePage = () => (
    <div>
        <Title title="Сайт" />
        <Typography variant="h4" component="h1" gutterBottom>
            Управление сайтом
        </Typography>

        <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="Контент" />
                    <CardContent>
                        <Typography variant="body2">
                            Управление контентом сайта
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={6}>
                <Card>
                    <CardHeader title="SEO" />
                    <CardContent>
                        <Typography variant="body2">
                            SEO настройки
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </div>
);