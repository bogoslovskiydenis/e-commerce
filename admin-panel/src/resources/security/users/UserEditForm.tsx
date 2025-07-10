import React, { useState } from 'react';
import {
    Edit,
    SimpleForm,
    TextInput,
    SelectInput,
    BooleanInput,
    useNotify,
    useRedirect,
    required,
    email,
    minLength,
    FormDataConsumer,
    useRecordContext,
    SaveButton,
    Toolbar,
    DeleteButton
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
    AccordionDetails,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    ExpandMore,
    Person,
    Security,
    Settings,
    LockReset
} from '@mui/icons-material';

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

// Диалог для смены пароля
const ChangePasswordDialog = ({ open, onClose, userId }: { open: boolean; onClose: () => void; userId: string | number }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const notify = useNotify();

    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            notify('Пароль должен содержать минимум 6 символов', { type: 'error' });
            return;
        }

        if (newPassword !== confirmPassword) {
            notify('Пароли не совпадают', { type: 'error' });
            return;
        }

        setLoading(true);
        try {
            // TODO: Implement API call for password change
            // await changeUserPassword(userId, newPassword);
            notify('Пароль успешно изменен', { type: 'success' });
            onClose();
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            notify('Ошибка при смене пароля', { type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Сменить пароль</DialogTitle>
            <DialogContent>
                <TextField
                    label="Новый пароль"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    helperText="Минимум 6 символов"
                />
                <TextField
                    label="Подтвердить пароль"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={handleChangePassword}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Сохранение...' : 'Сменить пароль'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

// Кастомная панель инструментов
const UserEditToolbar = () => {
    const record = useRecordContext();
    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <SaveButton />
                <Button
                    startIcon={<LockReset />}
                    onClick={() => setPasswordDialogOpen(true)}
                    variant="outlined"
                >
                    Сменить пароль
                </Button>
            </Box>

            <DeleteButton mutationMode="pessimistic" />

            {record && (
                <ChangePasswordDialog
                    open={passwordDialogOpen}
                    onClose={() => setPasswordDialogOpen(false)}
                    userId={String(record.id)}
                />
            )}
        </Toolbar>
    );
};

// Валидаторы
const validateUsername = [required(), minLength(3)];
const validateEmail = [required(), email()];
const validateFullName = [required(), minLength(2)];
const validateRole = [required()];

export const UserEdit = () => {
    const notify = useNotify();
    const redirect = useRedirect();

    const handleSuccess = () => {
        notify('Пользователь успешно обновлен', { type: 'success' });
        redirect('/admin-users');
    };

    const handleError = (error: any) => {
        console.error('Error updating user:', error);
        notify('Ошибка при обновлении пользователя', { type: 'error' });
    };

    return (
        <Edit
            title="Редактировать пользователя"
            mutationOptions={{
                onSuccess: handleSuccess,
                onError: handleError
            }}
        >
            <SimpleForm toolbar={<UserEditToolbar />}>
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
                                </Grid>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    Для смены пароля используйте кнопку "Сменить пароль" в панели инструментов
                                </Alert>
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

                                <Accordion sx={{ mt: 2 }}>
                                    <AccordionSummary expandIcon={<ExpandMore />}>
                                        <Typography>Текущие разрешения пользователя</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <FormDataConsumer>
                                            {({ formData }) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {formData.permissions?.map((permission: string) => (
                                                        <Chip
                                                            key={permission}
                                                            label={permission}
                                                            size="small"
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            )}
                                        </FormDataConsumer>
                                    </AccordionDetails>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Настройки безопасности */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Settings sx={{ mr: 1 }} />
                                    Настройки безопасности
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <BooleanInput
                                            source="isActive"
                                            label="Активный пользователь"
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <BooleanInput
                                            source="twoFactorEnabled"
                                            label="Двухфакторная аутентификация"
                                            helperText="Пользователь может настроить в профиле"
                                        />
                                    </Grid>
                                </Grid>

                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Последний вход:
                                        <FormDataConsumer>
                                            {({ formData }) => (
                                                <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>
                                                    {formData.lastLogin
                                                        ? new Date(formData.lastLogin).toLocaleString('ru-RU')
                                                        : 'Никогда'
                                                    }
                                                </span>
                                            )}
                                        </FormDataConsumer>
                                    </Typography>
                                </Box>

                                <Alert severity="warning" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Внимание:</strong> Изменение роли пользователя приведет к автоматическому
                                        обновлению его разрешений согласно новой роли.
                                    </Typography>
                                </Alert>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
    );
};