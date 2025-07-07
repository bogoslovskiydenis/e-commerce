import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    FunctionField,
    Filter,
    SelectInput,
    DateTimeInput,
    SearchInput,
    TopToolbar,
    ExportButton,
    Show,
    SimpleShowLayout,
    useRecordContext
} from 'react-admin';
import {
    Card,
    Typography,
    Box,
    Chip,
    Avatar,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Security,
    Login,
    Logout,
    Edit,
    Delete,
    Add,
    Visibility,
    Warning,
    Info,
    Error,
    ExpandMore
} from '@mui/icons-material';

// Интерфейс лога
interface AdminLog {
    id: string;
    userId: string;
    username: string;
    fullName: string;
    action: string;
    resource: string;
    resourceId?: string;
    description: string;
    ip: string;
    userAgent: string;
    level: 'info' | 'warning' | 'error' | 'critical';
    metadata?: any;
    timestamp: string;
}

// Компонент для отображения типа действия
const ActionTypeField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getActionInfo = (action: string) => {
        switch (action) {
            case 'login':
                return { icon: <Login />, color: 'success', label: 'Вход' };
            case 'logout':
                return { icon: <Logout />, color: 'info', label: 'Выход' };
            case 'create':
                return { icon: <Add />, color: 'primary', label: 'Создание' };
            case 'edit':
                return { icon: <Edit />, color: 'warning', label: 'Редактирование' };
            case 'delete':
                return { icon: <Delete />, color: 'error', label: 'Удаление' };
            case 'view':
                return { icon: <Visibility />, color: 'default', label: 'Просмотр' };
            case 'security':
                return { icon: <Security />, color: 'error', label: 'Безопасность' };
            default:
                return { icon: <Info />, color: 'default', label: action };
        }
    };

    const actionInfo = getActionInfo(record.action);

    return (
        <Chip
            icon={actionInfo.icon}
            label={actionInfo.label}
            color={actionInfo.color as any}
            size="small"
        />
    );
};

// Компонент для отображения уровня важности
const LogLevelField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getLevelInfo = (level: string) => {
        switch (level) {
            case 'info':
                return { icon: <Info />, color: 'info', label: 'Инфо' };
            case 'warning':
                return { icon: <Warning />, color: 'warning', label: 'Предупреждение' };
            case 'error':
                return { icon: <Error />, color: 'error', label: 'Ошибка' };
            case 'critical':
                return { icon: <Security />, color: 'error', label: 'Критично' };
            default:
                return { icon: <Info />, color: 'default', label: level };
        }
    };

    const levelInfo = getLevelInfo(record.level);

    return (
        <Chip
            icon={levelInfo.icon}
            label={levelInfo.label}
            color={levelInfo.color as any}
            size="small"
            variant={record.level === 'critical' ? 'filled' : 'outlined'}
        />
    );
};

// Компонент для отображения пользователя
const UserInfoField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                {record.fullName?.charAt(0) || record.username?.charAt(0)}
            </Avatar>
            <Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {record.fullName || record.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    @{record.username}
                </Typography>
            </Box>
        </Box>
    );
};

// Фильтры для логов
const LogFilters = () => (
    <Filter>
        <SearchInput source="q" placeholder="Поиск по действию или пользователю" alwaysOn />
        <SelectInput
            source="action"
            label="Тип действия"
            choices={[
                { id: 'login', name: 'Вход' },
                { id: 'logout', name: 'Выход' },
                { id: 'create', name: 'Создание' },
                { id: 'edit', name: 'Редактирование' },
                { id: 'delete', name: 'Удаление' },
                { id: 'view', name: 'Просмотр' },
                { id: 'security', name: 'Безопасность' }
            ]}
            emptyText="Все действия"
        />
        <SelectInput
            source="level"
            label="Уровень"
            choices={[
                { id: 'info', name: 'Информация' },
                { id: 'warning', name: 'Предупреждение' },
                { id: 'error', name: 'Ошибка' },
                { id: 'critical', name: 'Критично' }
            ]}
            emptyText="Все уровни"
        />
        <SelectInput
            source="resource"
            label="Ресурс"
            choices={[
                { id: 'products', name: 'Товары' },
                { id: 'orders', name: 'Заказы' },
                { id: 'users', name: 'Пользователи' },
                { id: 'categories', name: 'Категории' },
                { id: 'settings', name: 'Настройки' },
                { id: 'auth', name: 'Авторизация' }
            ]}
            emptyText="Все ресурсы"
        />
        <DateTimeInput source="timestamp_gte" label="С даты" />
        <DateTimeInput source="timestamp_lte" label="По дату" />
    </Filter>
);

// Список логов
export const AdminLogList = () => (
    <List
        title="Логи действий администраторов"
        filters={<LogFilters />}
        sort={{ field: 'timestamp', order: 'DESC' }}
        perPage={50}
        actions={
            <TopToolbar>
                <ExportButton />
            </TopToolbar>
        }
    >
        <Datagrid rowClick="show" sx={{
            '& .RaDatagrid-rowCell': {
                fontSize: '0.875rem'
            }
        }}>
            <DateField
                source="timestamp"
                label="Время"
                showTime
                options={{
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }}
            />
            <FunctionField label="Пользователь" render={() => <UserInfoField />} />
            <FunctionField label="Действие" render={() => <ActionTypeField />} />
            <TextField source="resource" label="Ресурс" />
            <TextField source="description" label="Описание" />
            <FunctionField label="Уровень" render={() => <LogLevelField />} />
            <TextField source="ip" label="IP" />
        </Datagrid>
    </List>
);

// Детальный просмотр лога
export const AdminLogShow = () => {
    const record = useRecordContext();

    return (
        <Show title="Детали лога">
            <Card sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Информация о действии
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <ActionTypeField />
                        <LogLevelField />
                    </Box>
                </Box>

                <SimpleShowLayout>
                    <DateField source="timestamp" label="Время" showTime />
                    <FunctionField label="Пользователь" render={() => <UserInfoField />} />
                    <TextField source="description" label="Описание" />
                    <TextField source="resource" label="Ресурс" />
                    <TextField source="resourceId" label="ID ресурса" />
                    <TextField source="ip" label="IP адрес" />

                    {/* Расширенная информация */}
                    <Box sx={{ mt: 3 }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Typography variant="subtitle1">
                                    Техническая информация
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        User Agent:
                                    </Typography>
                                    <Typography variant="body2" sx={{
                                        fontFamily: 'monospace',
                                        fontSize: '0.75rem',
                                        backgroundColor: '#f5f5f5',
                                        p: 1,
                                        borderRadius: 1,
                                        wordBreak: 'break-all'
                                    }}>
                                        {record?.userAgent}
                                    </Typography>
                                </Box>

                                {record?.metadata && (
                                    <Box>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Дополнительные данные:
                                        </Typography>
                                        <Typography variant="body2" component="pre" sx={{
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            backgroundColor: '#f5f5f5',
                                            p: 1,
                                            borderRadius: 1,
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {JSON.stringify(record.metadata, null, 2)}
                                        </Typography>
                                    </Box>
                                )}
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </SimpleShowLayout>
            </Card>
        </Show>
    );
};