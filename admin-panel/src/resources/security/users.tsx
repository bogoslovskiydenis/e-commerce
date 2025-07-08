import React, { useState } from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    ShowButton,
    Show,
    SimpleShowLayout,
    Create,
    SimpleForm,
    TextInput,
    BooleanInput,
    SelectInput,
    Edit,
    Filter,
    SearchInput,
    FunctionField,
    useRecordContext,
    useNotify,
    useRefresh,
    Button as RaButton,
    TopToolbar,
    CreateButton,
    ExportButton,
    FilterButton,
    useUpdate,
    Confirm,
    WrapperField,
    Labeled
} from 'react-admin';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    IconButton,
    Tooltip,
    Button
} from '@mui/material';
import {
    Person,
    AdminPanelSettings,
    SupervisorAccount,
    Security,
    Shield,
    Block,
    CheckCircle
} from '@mui/icons-material';

// Компонент для отображения роли пользователя
const UserRoleField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const roleMap: Record<string, { label: string; color: 'error' | 'warning' | 'default' | 'info' | 'success'; icon: React.ReactElement }> = {
        admin: { label: 'Администратор', color: 'error', icon: <AdminPanelSettings /> },
        manager: { label: 'Менеджер', color: 'warning', icon: <SupervisorAccount /> },
        user: { label: 'Пользователь', color: 'default', icon: <Person /> },
        moderator: { label: 'Модератор', color: 'info', icon: <Security /> },
        support: { label: 'Поддержка', color: 'success', icon: <Shield /> }
    };

    const roleInfo = roleMap[record.role as string] || { label: record.role, color: 'default' as const, icon: <Person /> };

    return (
        <Chip
            label={roleInfo.label}
            color={roleInfo.color}
            size="small"
            icon={roleInfo.icon}
        />
    );
};

// Компонент для отображения статуса пользователя
const UserStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.isActive ? 'Активен' : 'Заблокирован'}
            color={record.isActive ? 'success' : 'error'}
            size="small"
            icon={record.isActive ? <CheckCircle /> : <Block />}
        />
    );
};

// Компонент для отображения 2FA статуса
const TwoFactorStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.twoFactorEnabled ? 'Включен' : 'Отключен'}
            color={record.twoFactorEnabled ? 'success' : 'default'}
            size="small"
            icon={<Security />}
        />
    );
};

// Фильтр для пользователей
const UserFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn placeholder="Поиск пользователей..." />
        <SelectInput
            source="role"
            label="Роль"
            choices={[
                { id: 'admin', name: 'Администратор' },
                { id: 'manager', name: 'Менеджер' },
                { id: 'user', name: 'Пользователь' },
                { id: 'moderator', name: 'Модератор' },
                { id: 'support', name: 'Поддержка' }
            ]}
            emptyText="Все роли"
        />
        <BooleanInput source="isActive" label="Активен" />
        <BooleanInput source="twoFactorEnabled" label="2FA включен" />
    </Filter>
);

// Действия для списка пользователей
const UserListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Быстрые действия для строки
const UserRowActions = () => {
    const record = useRecordContext();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    const handleToggleStatus = async () => {
        try {
            await update('users', {
                id: record.id,
                data: { isActive: !record.isActive },
                previousData: record
            });
            notify(
                record.isActive ? 'Пользователь заблокирован' : 'Пользователь разблокирован',
                { type: 'success' }
            );
            refresh();
        } catch (error) {
            notify('Ошибка при изменении статуса', { type: 'error' });
        }
    };

    return (
        <Box sx={{ display: 'flex', gap: 1 }}>
            <ShowButton />
            <EditButton />
            <Tooltip title={record.isActive ? 'Заблокировать' : 'Разблокировать'}>
                <IconButton
                    onClick={() => setConfirmOpen(true)}
                    color={record.isActive ? 'error' : 'success'}
                    size="small"
                >
                    {record.isActive ? <Block /> : <CheckCircle />}
                </IconButton>
            </Tooltip>
            <DeleteButton />

            <Confirm
                isOpen={confirmOpen}
                loading={false}
                title={`${record.isActive ? 'Заблокировать' : 'Разблокировать'} пользователя`}
                content={`Вы уверены, что хотите ${record.isActive ? 'заблокировать' : 'разблокировать'} пользователя ${record.username}?`}
                onConfirm={handleToggleStatus}
                onClose={() => setConfirmOpen(false)}
            />
        </Box>
    );
};

// Компонент для настройки 2FA
const TwoFactorModal = ({ open, onClose, userId }: { open: boolean; onClose: () => void; userId: string }) => {
    const notify = useNotify();
    const refresh = useRefresh();
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState<'setup' | 'verify'>('setup');

    const generateQRCode = React.useCallback(async () => {
        try {
            // Здесь должен быть запрос к API для генерации QR кода
            // Временно используем заглушку
            const secret = 'JBSWY3DPEHPK3PXP'; // Это заглушка
            console.log(`QR Code URL for user ${userId}: otpauth://totp/YourApp:${userId}?secret=${secret}&issuer=YourApp`);
        } catch (error) {
            notify('Ошибка при генерации QR кода', { type: 'error' });
        }
    }, [userId, notify]);

    const verifyCode = async () => {
        try {
            // Здесь должен быть запрос к API для верификации кода
            notify('2FA успешно настроен', { type: 'success' });
            refresh();
            onClose();
        } catch (error) {
            notify('Неверный код верификации', { type: 'error' });
        }
    };

    React.useEffect(() => {
        if (open) {
            generateQRCode();
        }
    }, [open, generateQRCode]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                Настройка двухфакторной аутентификации
            </DialogTitle>
            <DialogContent>
                {step === 'setup' && (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                        <Typography variant="body1" gutterBottom>
                            1. Установите приложение Google Authenticator или Authy
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            2. Отсканируйте QR код:
                        </Typography>
                        <Box sx={{ my: 2, p: 2, border: '1px solid #ddd', display: 'inline-block' }}>
                            {/* Здесь должен быть QR код */}
                            <Typography variant="body2" color="textSecondary">
                                QR код будет здесь
                            </Typography>
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Секретный ключ: JBSWY3DPEHPK3PXP
                            </Typography>
                        </Box>
                        <Typography variant="body1">
                            3. Введите код из приложения для подтверждения
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setStep('verify')}
                            sx={{ mt: 2 }}
                        >
                            Далее
                        </Button>
                    </Box>
                )}

                {step === 'verify' && (
                    <Box sx={{ py: 2 }}>
                        <TextInput
                            source="verificationCode"
                            label="Код подтверждения"
                            value={verificationCode}
                            onChange={(e: any) => setVerificationCode(e.target.value)}
                            fullWidth
                            helperText="Введите 6-значный код из приложения"
                        />
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                {step === 'verify' && (
                    <Button onClick={verifyCode} variant="contained">
                        Подтвердить
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

// Список пользователей
export const UsersList = () => (
    <List
        filters={<UserFilter />}
        actions={<UserListActions />}
        title="Пользователи"
        perPage={25}
        sort={{ field: 'createdAt', order: 'DESC' }}
    >
        <Datagrid
            rowClick="show"
            sx={{
                '& .RaDatagrid-headerCell': {
                    backgroundColor: '#f5f5f5',
                    fontWeight: 'bold'
                }
            }}
        >
            <TextField source="id" label="ID" />
            <TextField source="username" label="Логин" />
            <TextField source="email" label="Email" />
            <TextField source="firstName" label="Имя" />
            <TextField source="lastName" label="Фамилия" />
            <FunctionField
                label="Роль"
                render={() => <UserRoleField />}
            />
            <FunctionField
                label="Статус"
                render={() => <UserStatusField />}
            />
            <FunctionField
                label="2FA"
                render={() => <TwoFactorStatusField />}
            />
            <DateField source="lastLogin" label="Последний вход" showTime />
            <DateField source="createdAt" label="Создан" showTime />
            <FunctionField
                label="Действия"
                render={() => <UserRowActions />}
            />
        </Datagrid>
    </List>
);

// Экспорт для совместимости с именованием UserList
export const UserList = UsersList;

// Просмотр пользователя
export const UserShow = () => {
    const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
    const record = useRecordContext();

    return (
        <Show title="Информация о пользователе">
            <SimpleShowLayout>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Основная информация
                                </Typography>
                                <Labeled label="ID">
                                    <TextField source="id" />
                                </Labeled>
                                <Labeled label="Логин">
                                    <TextField source="username" />
                                </Labeled>
                                <Labeled label="Email">
                                    <TextField source="email" />
                                </Labeled>
                                <Labeled label="Имя">
                                    <TextField source="firstName" />
                                </Labeled>
                                <Labeled label="Фамилия">
                                    <TextField source="lastName" />
                                </Labeled>
                                <Labeled label="Роль">
                                    <WrapperField>
                                        <UserRoleField />
                                    </WrapperField>
                                </Labeled>
                                <Labeled label="Статус">
                                    <WrapperField>
                                        <UserStatusField />
                                    </WrapperField>
                                </Labeled>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Безопасность
                                </Typography>
                                <Labeled label="2FA">
                                    <WrapperField>
                                        <TwoFactorStatusField />
                                    </WrapperField>
                                </Labeled>
                                <Labeled label="Последний вход">
                                    <DateField source="lastLogin" showTime />
                                </Labeled>
                                <Labeled label="IP последнего входа">
                                    <TextField source="lastLoginIp" />
                                </Labeled>
                                <Labeled label="Создан">
                                    <DateField source="createdAt" showTime />
                                </Labeled>
                                <Labeled label="Обновлен">
                                    <DateField source="updatedAt" showTime />
                                </Labeled>

                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<Security />}
                                        onClick={() => setTwoFactorModalOpen(true)}
                                    >
                                        Настроить 2FA
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <TwoFactorModal
                    open={twoFactorModalOpen}
                    onClose={() => setTwoFactorModalOpen(false)}
                    userId={record?.id?.toString() || ''}
                />
            </SimpleShowLayout>
        </Show>
    );
};

// Создание пользователя
export const UserCreate = () => (
    <Create title="Создать пользователя">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="username"
                        label="Логин"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <TextInput
                        source="email"
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        validate={[required(), email()]}
                    />
                    <TextInput
                        source="firstName"
                        label="Имя"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <TextInput
                        source="lastName"
                        label="Фамилия"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="password"
                        label="Пароль"
                        type="password"
                        fullWidth
                        required
                        validate={[required(), minLength(8)]}
                    />
                    <SelectInput
                        source="role"
                        label="Роль"
                        choices={[
                            { id: 'admin', name: 'Администратор' },
                            { id: 'manager', name: 'Менеджер' },
                            { id: 'user', name: 'Пользователь' },
                            { id: 'moderator', name: 'Модератор' },
                            { id: 'support', name: 'Поддержка' }
                        ]}
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <BooleanInput
                        source="isActive"
                        label="Активен"
                        defaultValue={true}
                    />
                    <BooleanInput
                        source="twoFactorEnabled"
                        label="Включить 2FA"
                        defaultValue={false}
                    />
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
);

// Редактирование пользователя
export const UserEdit = () => (
    <Edit title="Редактировать пользователя">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="username"
                        label="Логин"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <TextInput
                        source="email"
                        label="Email"
                        type="email"
                        fullWidth
                        required
                        validate={[required(), email()]}
                    />
                    <TextInput
                        source="firstName"
                        label="Имя"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <TextInput
                        source="lastName"
                        label="Фамилия"
                        fullWidth
                        required
                        validate={[required()]}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextInput
                        source="password"
                        label="Новый пароль"
                        type="password"
                        fullWidth
                        helperText="Оставьте пустым, если не хотите менять пароль"
                    />
                    <SelectInput
                        source="role"
                        label="Роль"
                        choices={[
                            { id: 'admin', name: 'Администратор' },
                            { id: 'manager', name: 'Менеджер' },
                            { id: 'user', name: 'Пользователь' },
                            { id: 'moderator', name: 'Модератор' },
                            { id: 'support', name: 'Поддержка' }
                        ]}
                        fullWidth
                        required
                        validate={[required()]}
                    />
                    <BooleanInput
                        source="isActive"
                        label="Активен"
                    />
                    <BooleanInput
                        source="twoFactorEnabled"
                        label="2FA включен"
                    />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
);

// Валидаторы (добавьте в импорты, если нужно)
const required = () => (value: any) => value ? undefined : 'Обязательное поле';
const email = () => (value: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? undefined : 'Некорректный email';
};
const minLength = (min: number) => (value: any) =>
    value && value.length >= min ? undefined : `Минимум ${min} символов`;

export default UsersList;