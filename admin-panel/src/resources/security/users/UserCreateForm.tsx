import React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    BooleanInput,
    useNotify,
    useRedirect,
    required,
    email,
    minLength,
    FormDataConsumer
} from 'react-admin';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Chip,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import { ExpandMore, Person, Security, Settings } from '@mui/icons-material';

// Роли и их описания
const USER_ROLES = [
    { id: 'SUPER_ADMIN', name: 'Супер Администратор', description: 'Полный доступ ко всем функциям системы' },
    { id: 'ADMINISTRATOR', name: 'Администратор', description: 'Управление товарами, категориями и пользователями' },
    { id: 'MANAGER', name: 'Менеджер', description: 'Управление заказами, клиентами и отзывами' },
    { id: 'CRM_MANAGER', name: 'CRM Менеджер', description: 'Управление клиентами и маркетинговыми акциями' }
];

// Разрешения по ролям
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        'admin.full_access',
        'users.create', 'users.edit', 'users.delete', 'users.view',
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit', 'reviews.delete',
        'website.banners', 'website.pages', 'website.settings', 'website.navigation',
        'analytics.view', 'logs.view', 'api_keys.manage',
        'customers.view', 'customers.edit', 'customers.delete',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'files.upload', 'files.delete'
    ],
    ADMINISTRATOR: [
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'users.create', 'users.edit', 'users.view',
        'website.banners', 'website.pages', 'website.navigation',
        'analytics.view', 'customers.view', 'customers.edit',
        'orders.view', 'orders.edit', 'reviews.view', 'reviews.edit'
    ],
    MANAGER: [
        'orders.view', 'orders.edit', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit',
        'customers.view', 'customers.edit',
        'products.view', 'analytics.basic'
    ],
    CRM_MANAGER: [
        'customers.view', 'customers.edit',
        'promotions.create', 'promotions.edit', 'promotions.view',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'orders.view', 'callbacks.view', 'callbacks.edit'
    ]
};

// Компонент для отображения разрешений роли
const RolePermissionsDisplay = ({ role }: { role: string }) => {
    if (!role || !ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
        return null;
    }

    const permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
                Разрешения роли "{USER_ROLES.find(r => r.id === role)?.name}":
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {permissions.map((permission) => (
                    <Chip
                        key={permission}
                        label={permission}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                ))}
            </Box>
        </Box>
    );
};

// Валидаторы
const validateUsername = [required(), minLength(3)];
const validateEmail = [required(), email()];
const validatePassword = [required(), minLength(6)];
const validateFullName = [required(), minLength(2)];
const validateRole = [required()];

export const UserCreate = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const handleSuccess = () => {
        notify('Пользователь успешно создан', { type: 'success' });
        redirect('/admin-users');
    };

    const handleError = (error: any) => {
        console.error('Error creating user:', error);
        notify('Ошибка при создании пользователя', { type: 'error' });
    };

    return (
        <Create
            title="Создать пользователя"
            mutationOptions={{
                onSuccess: handleSuccess,
                onError: handleError
            }}
        >
            <SimpleForm>
                <Grid container spacing={3}>
                    {/* Основная информация */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Person sx={{ mr: 1 }} />
                                    Основная информация
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <TextInput
                                            source="username"
                                            label="Имя пользователя"
                                            validate={validateUsername}
                                            fullWidth
                                            helperText="Только латинские буквы, цифры, _ и -"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextInput
                                            source="email"
                                            label="Email"
                                            validate={validateEmail}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextInput
                                            source="fullName"
                                            label="Полное имя"
                                            validate={validateFullName}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextInput
                                            source="password"
                                            label="Пароль"
                                            type="password"
                                            validate={validatePassword}
                                            fullWidth
                                            helperText="Минимум 6 символов"
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Роль и разрешения */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Security sx={{ mr: 1 }} />
                                    Роль и разрешения
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <SelectInput
                                            source="role"
                                            label="Роль"
                                            choices={USER_ROLES.map(role => ({
                                                id: role.id,
                                                name: `${role.name} - ${role.description}`
                                            }))}
                                            validate={validateRole}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>

                                <FormDataConsumer>
                                    {({ formData }) => (
                                        <RolePermissionsDisplay role={formData.role} />
                                    )}
                                </FormDataConsumer>

                                <Box sx={{ mt: 3 }}>
                                    <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMore />}>
                                            <Typography>Дополнительная информация о ролях</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Box>
                                                {USER_ROLES.map((role) => (
                                                    <Box key={role.id} sx={{ mb: 2 }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            <strong>{role.name}</strong>
                                                        </Typography>
                                                        <Typography variant="body2" color="textSecondary" paragraph>
                                                            {role.description}
                                                        </Typography>
                                                        <Typography variant="caption" color="textSecondary">
                                                            Разрешений: {ROLE_PERMISSIONS[role.id as keyof typeof ROLE_PERMISSIONS].length}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </AccordionDetails>
                                    </Accordion>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Настройки */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Settings sx={{ mr: 1 }} />
                                    Настройки
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <BooleanInput
                                            source="isActive"
                                            label="Активный пользователь"
                                            defaultValue={true}
                                        />
                                    </Grid>
                                </Grid>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    После создания пользователь получит данные для входа на указанный email.
                                    Двухфакторная аутентификация может быть настроена позже.
                                </Alert>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Create>
    );
};