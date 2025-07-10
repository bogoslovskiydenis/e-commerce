import React from 'react';
import {
    Show,
    TextField,
    DateField,
    useRecordContext,
    TopToolbar,
    EditButton,
    DeleteButton
} from 'react-admin';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Avatar,
    Stack,
    Divider,
    Paper
} from '@mui/material';
import {
    Person,
    AdminPanelSettings,
    SupervisorAccount,
    Security,
    Shield,
    Block,
    CheckCircle,
    VpnKey,
    Email,
    CalendarToday,
    Update,
    AccountCircle,
    Badge,
    Fingerprint,
    Schedule
} from '@mui/icons-material';

// Компонент для отображения роли пользователя
const UserRoleChip = () => {
    const record = useRecordContext();
    if (!record) return null;

    const roleMap: Record<string, { label: string; color: 'error' | 'warning' | 'default' | 'info' | 'success'; icon: React.ReactElement }> = {
        SUPER_ADMIN: { label: 'Супер Администратор', color: 'error', icon: <AdminPanelSettings /> },
        ADMINISTRATOR: { label: 'Администратор', color: 'warning', icon: <SupervisorAccount /> },
        MANAGER: { label: 'Менеджер', color: 'info', icon: <Person /> },
        CRM_MANAGER: { label: 'CRM Менеджер', color: 'success', icon: <Shield /> }
    };

    const roleInfo = roleMap[record.role as string] || { label: record.role, color: 'default' as const, icon: <Person /> };

    return (
        <Chip
            label={roleInfo.label}
            color={roleInfo.color}
            icon={roleInfo.icon}
            size="medium"
            sx={{ fontSize: '0.875rem' }}
        />
    );
};

// Компонент для отображения статуса пользователя
const UserStatusChip = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.isActive ? 'Активен' : 'Заблокирован'}
            color={record.isActive ? 'success' : 'error'}
            icon={record.isActive ? <CheckCircle /> : <Block />}
            size="medium"
            sx={{ fontSize: '0.875rem' }}
        />
    );
};

// Компонент для отображения 2FA статуса
const TwoFactorChip = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Chip
            label={record.twoFactorEnabled ? '2FA Включен' : '2FA Отключен'}
            color={record.twoFactorEnabled ? 'success' : 'default'}
            variant={record.twoFactorEnabled ? 'filled' : 'outlined'}
            icon={<VpnKey />}
            size="medium"
            sx={{ fontSize: '0.875rem' }}
        />
    );
};

// Компонент для отображения аватара
const UserAvatar = () => {
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
            sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                bgcolor: 'primary.main',
                border: '4px solid #e3f2fd',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
        >
            {getInitials(record.fullName || record.username)}
        </Avatar>
    );
};

// Компонент для поля информации
const InfoField = ({ icon, label, children }: { icon: React.ReactElement; label: string; children: React.ReactNode }) => (
    <Box sx={{ mb: 3 }}>
        <Typography
            variant="subtitle2"
            color="textSecondary"
            gutterBottom
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                letterSpacing: '0.5px'
            }}
        >
            {icon}
            {label}
        </Typography>
        <Box sx={{
            pl: 3,
            fontSize: '1.1rem'
        }}>
            {children}
        </Box>
        <Divider sx={{ mt: 2 }} />
    </Box>
);

// Панель инструментов
const UserShowActions = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

// Главный компонент
export const UserShow = () => {
    const record = useRecordContext();

    return (
        <Show actions={<UserShowActions />}>
            <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
                {/* Заголовок профиля */}
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, textAlign: 'center' }}>
                    <UserAvatar />
                    <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
                        {record?.fullName}
                    </Typography>
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <AccountCircle />
                        @{record?.username}
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <UserRoleChip />
                        <UserStatusChip />
                        <TwoFactorChip />
                    </Stack>
                </Paper>

                {/* Основная информация */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                                Профиль пользователя
                            </Typography>

                            <InfoField icon={<Fingerprint />} label="ID пользователя">
                                <Typography sx={{
                                    fontFamily: 'monospace',
                                    fontSize: '0.9rem',
                                    backgroundColor: '#f5f5f5',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    wordBreak: 'break-all'
                                }}>
                                    {record?.id}
                                </Typography>
                            </InfoField>

                            <InfoField icon={<AccountCircle />} label="Логин">
                                <Typography sx={{
                                    fontSize: '1.2rem',
                                    fontWeight: '500',
                                    color: '#1976d2'
                                }}>
                                    @{record?.username}
                                </Typography>
                            </InfoField>

                            <InfoField icon={<Email />} label="Email">
                                <Typography sx={{
                                    fontSize: '1.1rem',
                                    fontFamily: 'monospace',
                                    color: '#666'
                                }}>
                                    {record?.email}
                                </Typography>
                            </InfoField>

                            <InfoField icon={<Person />} label="Полное имя">
                                <Typography sx={{
                                    fontSize: '1.2rem',
                                    fontWeight: '500'
                                }}>
                                    {record?.fullName}
                                </Typography>
                            </InfoField>

                            <InfoField icon={<Badge />} label="Роль">
                                <UserRoleChip />
                            </InfoField>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: 'primary.main' }}>
                                Безопасность и даты
                            </Typography>

                            <InfoField icon={<CheckCircle />} label="Статус аккаунта">
                                <UserStatusChip />
                            </InfoField>

                            <InfoField icon={<VpnKey />} label="Двухфакторная аутентификация">
                                <TwoFactorChip />
                            </InfoField>

                            <InfoField icon={<Schedule />} label="Последний вход">
                                {record?.lastLogin ? (
                                    <Typography sx={{
                                        fontSize: '1.1rem',
                                        fontFamily: 'monospace'
                                    }}>
                                        <DateField source="lastLogin" showTime />
                                    </Typography>
                                ) : (
                                    <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                                        Никогда
                                    </Typography>
                                )}
                            </InfoField>

                            <InfoField icon={<CalendarToday />} label="Дата создания">
                                <Typography sx={{
                                    fontSize: '1.1rem',
                                    fontFamily: 'monospace'
                                }}>
                                    <DateField source="createdAt" showTime />
                                </Typography>
                            </InfoField>

                            <InfoField icon={<Update />} label="Последнее обновление">
                                <Typography sx={{
                                    fontSize: '1.1rem',
                                    fontFamily: 'monospace'
                                }}>
                                    <DateField source="updatedAt" showTime />
                                </Typography>
                            </InfoField>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Разрешения */}
                {record?.permissions && record.permissions.length > 0 && (
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{
                            fontWeight: 'bold',
                            mb: 3,
                            color: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Shield />
                            Разрешения ({record.permissions.length})
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                            {record.permissions.map((permission: string, index: number) => (
                                <Chip
                                    key={index}
                                    label={permission}
                                    size="medium"
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        fontSize: '0.875rem',
                                        fontFamily: 'monospace',
                                        height: '32px'
                                    }}
                                />
                            ))}
                        </Box>
                    </Paper>
                )}
            </Box>
        </Show>
    );
};