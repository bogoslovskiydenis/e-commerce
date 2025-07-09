import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
    Chip
} from '@mui/material';
import {
    Computer,
    Memory,
    NetworkCheck
} from '@mui/icons-material';

const SystemInfoPage: React.FC = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                <Computer sx={{ mr: 1, verticalAlign: 'middle' }} />
                Системная информация
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <Memory sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Система
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Версия приложения"
                                        secondary="1.0.0"
                                    />
                                    <Chip label="Стабильная" color="success" size="small" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Node.js"
                                        secondary="v18.0.0"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="React"
                                        secondary="v18.0.0"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                <NetworkCheck sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Подключения
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="API"
                                        secondary="http://localhost:3000"
                                    />
                                    <Chip label="Активно" color="success" size="small" />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="База данных"
                                        secondary="PostgreSQL"
                                    />
                                    <Chip label="Подключено" color="success" size="small" />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SystemInfoPage;