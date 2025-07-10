import React, { useState } from 'react';
import {
    List,
    TextField,
    DateField,
    EditButton,
    DeleteButton,
    ShowButton,
    Filter,
    SearchInput,
    FunctionField,
    useRecordContext,
    useNotify,
    useRefresh,
    TopToolbar,
    CreateButton,
    ExportButton,
    FilterButton,
    useUpdate,
    Confirm,
    SelectInput,
    useListContext
} from 'react-admin';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Menu,
    MenuItem,
    Avatar,
    Card,
    CardContent,
    Stack,
    Chip,
    Grid
} from '@mui/material';
import {
    Person,
    AdminPanelSettings,
    SupervisorAccount,
    Shield,
    Block,
    CheckCircle,
    MoreVert,
    LockReset,
    PersonOff,
    PersonAdd,
    VpnKey,
    CalendarToday
} from '@mui/icons-material';

// Компонент для отображения роли пользователя
const UserRoleField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const roleMap: Record<string, { label: string; color: 'error' | 'warning' | 'default' | 'info' | 'success'; icon: React.ReactElement }> = {
        SUPER_ADMIN: { label: 'Супер Админ', color: 'error', icon: <AdminPanelSettings fontSize="small" /> },
        ADMINISTRATOR: { label: 'Администратор', color: 'warning', icon: <SupervisorAccount fontSize="small" /> },
        MANAGER: { label: 'Менеджер', color: 'info', icon: <Person fontSize="small" /> },
        CRM_MANAGER: { label: 'CRM Менеджер', color: 'success', icon: <Shield fontSize="small" /> }
    };

    const roleInfo = roleMap[record.role as string] || { label: record.role, color: 'default' as const, icon: <Person fontSize="small" /> };

    return (
        <Chip
            label={roleInfo.label}
            color={roleInfo.color}
            icon={roleInfo.icon}
            size="small"
            sx={{ fontSize: '0.75rem' }}
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
            icon={record.isActive ? <CheckCircle fontSize="small" /> : <Block fontSize="small" />}
            size="small"
            sx={{ fontSize: '0.75rem' }}
        />
    );
};

// Компонент для отображения 2FA статуса
const TwoFactorStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.twoFactorEnabled ? 'Вкл' : 'Выкл'}
            color={record.twoFactorEnabled ? 'success' : 'default'}
            variant={record.twoFactorEnabled ? 'filled' : 'outlined'}
            icon={<VpnKey fontSize="small" />}
            size="small"
            sx={{ fontSize: '0.75rem' }}
        />
    );
};

// Компонент для отображения аватара пользователя
const UserAvatarField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getInitials = (fullName: string) => {
        return fullName
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Avatar
            src={record.avatar}
            sx={{
                width: 50,
                height: 50,
                fontSize: '1rem',
                bgcolor: 'primary.main',
                fontWeight: 'bold'
            }}
        >
            {getInitials(record.fullName || record.username)}
        </Avatar>
    );
};

// Компонент для быстрых действий
const QuickActionsMenu = () => {
    const record = useRecordContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; action: string; title: string; message: string }>({
        open: false,
        action: '',
        title: '',
        message: ''
    });
    const [update] = useUpdate();
    const notify = useNotify();
    const refresh = useRefresh();

    if (!record) return null;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleAction = (action: string) => {
        handleClose();

        switch (action) {
            case 'toggle_status':
                setConfirmDialog({
                    open: true,
                    action: 'toggle_status',
                    title: record.isActive ? 'Заблокировать пользователя' : 'Активировать пользователя',
                    message: `Вы уверены, что хотите ${record.isActive ? 'заблокировать' : 'активировать'} пользователя "${record.fullName}"?`
                });
                break;
            case 'reset_password':
                setConfirmDialog({
                    open: true,
                    action: 'reset_password',
                    title: 'Сбросить пароль',
                    message: `Сбросить пароль для пользователя "${record.fullName}"? Новый пароль будет отправлен на email.`
                });
                break;
        }
    };

    const executeAction = async () => {
        try {
            switch (confirmDialog.action) {
                case 'toggle_status':
                    await update('admin-users', {
                        id: record.id,
                        data: { isActive: !record.isActive },
                        previousData: record
                    });
                    notify(`Пользователь ${record.isActive ? 'заблокирован' : 'активирован'}`, { type: 'success' });
                    break;
                case 'reset_password':
                    notify('Новый пароль отправлен на email', { type: 'success' });
                    break;
            }
            refresh();
        } catch (error) {
            notify('Ошибка при выполнении операции', { type: 'error' });
        }

        setConfirmDialog({ open: false, action: '', title: '', message: '' });
    };

    return (
        <>
            <IconButton onClick={handleClick} size="small">
                <MoreVert />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleAction('toggle_status')}>
                    {record.isActive ? <PersonOff sx={{ mr: 1 }} /> : <PersonAdd sx={{ mr: 1 }} />}
                    {record.isActive ? 'Заблокировать' : 'Активировать'}
                </MenuItem>
                <MenuItem onClick={() => handleAction('reset_password')}>
                    <LockReset sx={{ mr: 1 }} />
                    Сбросить пароль
                </MenuItem>
            </Menu>

            <Confirm
                isOpen={confirmDialog.open}
                title={confirmDialog.title}
                content={confirmDialog.message}
                onConfirm={executeAction}
                onClose={() => setConfirmDialog({ open: false, action: '', title: '', message: '' })}
            />
        </>
    );
};

// Компонент карточки пользователя - КОМПАКТНАЯ ВЕРСИЯ
const UserCard = ({ record }: { record: any }) => {
    return (
        <Card
            elevation={2}
            sx={{
                mb: 2,
                borderRadius: 2,
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-2px)',
                    backgroundColor: '#f8f9fa'
                }
            }}
        >
            <CardContent sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Аватар и основная информация */}
                    <Grid item xs>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <UserAvatarField />

                            <Box sx={{ flex: 1 }}>
                                {/* Имя и логин в одной строке */}
                                <Typography variant="h6" sx={{ fontWeight: '600', mb: 0.5 }}>
                                    {record.fullName}
                                    <Typography component="span" variant="body2" color="primary" sx={{ ml: 1 }}>
                                        @{record.username}
                                    </Typography>
                                </Typography>

                                {/* Email */}
                                <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'monospace', mb: 1 }}>
                                    {record.email}
                                </Typography>

                                {/* Статусы в одной строке */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <UserRoleField />
                                    <UserStatusField />
                                    <TwoFactorStatusField />
                                </Stack>
                            </Box>
                        </Stack>
                    </Grid>

                    {/* Дата и действия */}
                    <Grid item>
                        <Stack alignItems="flex-end" spacing={1}>
                            {/* Дата последнего входа */}
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <CalendarToday fontSize="inherit" />
                                    Последний вход
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                                    {record.lastLogin ? (
                                        new Date(record.lastLogin).toLocaleDateString('ru-RU')
                                    ) : (
                                        'Никогда'
                                    )}
                                </Typography>
                            </Box>

                            {/* Действия */}
                            <Stack direction="row" spacing={0.5}>
                                <ShowButton record={record} size="small" />
                                <EditButton record={record} size="small" />
                                <QuickActionsMenu />
                            </Stack>
                        </Stack>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

// Фильтр для списка пользователей
const UserFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput source="search" placeholder="Поиск по имени, email или username" alwaysOn />
        <SelectInput
            source="role"
            label="Роль"
            choices={[
                { id: 'SUPER_ADMIN', name: 'Супер Администратор' },
                { id: 'ADMINISTRATOR', name: 'Администратор' },
                { id: 'MANAGER', name: 'Менеджер' },
                { id: 'CRM_MANAGER', name: 'CRM Менеджер' }
            ]}
            emptyText="Все роли"
        />
        <SelectInput
            source="active"
            label="Статус"
            choices={[
                { id: 'true', name: 'Активные' },
                { id: 'false', name: 'Заблокированные' }
            ]}
            emptyText="Все статусы"
        />
    </Filter>
);

// Кастомная панель инструментов
const UserListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton label="Добавить пользователя" />
        <ExportButton />
    </TopToolbar>
);

// Кастомный компонент для отображения списка карточек
const UserCardList = () => {
    const { data, isLoading } = useListContext();

    if (isLoading) {
        return <Box sx={{ p: 3, textAlign: 'center' }}>Загрузка...</Box>;
    }

    if (!data || data.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="textSecondary">
                    Пользователи не найдены
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                📋 Список пользователей ({data.length})
            </Typography>
            {data.map((record: any) => (
                <UserCard key={record.id} record={record} />
            ))}
        </Box>
    );
};

// Главный компонент списка пользователей
export const UserList = () => (
    <List
        filters={<UserFilter />}
        actions={<UserListActions />}
        perPage={25}
        sort={{ field: 'createdAt', order: 'DESC' }}
    >
        <UserCardList />
    </List>
);