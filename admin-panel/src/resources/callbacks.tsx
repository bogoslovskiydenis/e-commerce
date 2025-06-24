import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    DateTimeInput,
    SelectInput,
    required,
    SearchInput,
    FilterButton,
    CreateButton,
    TopToolbar,
    useRecordContext,
    FunctionField,
    BooleanField,
    Show,
    SimpleShowLayout
} from 'react-admin';
import { Chip, Box, Typography, IconButton } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';

// Компонент для отображения статуса обратного звонка
const CallbackStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'warning';
            case 'in_progress': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Новый';
            case 'in_progress': return 'В работе';
            case 'completed': return 'Завершен';
            case 'cancelled': return 'Отменен';
            default: return status;
        }
    };

    return (
        <Chip
            label={getStatusLabel(record.status)}
            color={getStatusColor(record.status) as any}
            size="small"
        />
    );
};

// Компонент для отображения контактной информации
const ContactInfoField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box>
            <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                {record.name}
            </Typography>
            <Typography variant="body2" color="text.primary">
                {record.phone}
            </Typography>
            {record.url && (
                <Typography variant="caption" color="text.secondary">
                    Источник: {record.url}
                </Typography>
            )}
        </Box>
    );
};

// Фильтры для обратных звонков
const callbackFilters = [
    <SearchInput source="q" placeholder="Поиск по имени или телефону" alwaysOn />,
    <SelectInput
        source="status"
        label="Статус"
        choices={[
            { id: 'new', name: 'Новые' },
            { id: 'in_progress', name: 'В работе' },
            { id: 'completed', name: 'Завершенные' },
            { id: 'cancelled', name: 'Отмененные' },
        ]}
        emptyText="Все статусы"
    />,
];

// Действия в тулбаре
const CallbackListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton label="Добавить" />
    </TopToolbar>
);

// Основной компонент списка обратных звонков
export const CallbackList = () => (
    <List
        filters={callbackFilters}
        actions={<CallbackListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        title="Обратный звонок"
    >
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <FunctionField
                label="Имя"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {record.name}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            {record.phone}
                        </Typography>
                        {record.url && (
                            <Typography variant="caption" color="text.secondary">
                                Источник: {record.url}
                            </Typography>
                        )}
                    </Box>
                )}
            />
            <TextField source="phone" label="Номер телефона" />
            <DateField source="createdAt" label="Дата" showTime />
            <TextField source="url" label="URL" />
            <FunctionField
                label="Действия"
                render={(record: any) => (
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                            size="small"
                            color="primary"
                            title="Позвонить"
                            onClick={() => window.open(`tel:${record.phone}`)}
                        >
                            <PhoneIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            color="primary"
                            title="Редактировать"
                            onClick={() => window.location.href = `#/callbacks/${record.id}`}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Box>
                )}
            />
        </Datagrid>
    </List>
);

// Форма редактирования обратного звонка
export const CallbackEdit = () => (
    <Edit title="Редактирование заявки на обратный звонок">
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Контактная информация</Typography>
                    <TextInput source="name" label="Имя клиента" validate={[required()]} fullWidth />
                    <TextInput source="phone" label="Номер телефона" validate={[required()]} fullWidth />
                    <TextInput source="email" label="Email" fullWidth />
                    <DateTimeInput source="createdAt" label="Дата создания заявки" fullWidth />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Информация о звонке</Typography>
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'new', name: 'Новый' },
                            { id: 'in_progress', name: 'В работе' },
                            { id: 'completed', name: 'Завершен' },
                            { id: 'cancelled', name: 'Отменен' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <TextInput source="url" label="Источник (URL)" fullWidth />
                    <DateTimeInput source="callbackTime" label="Запланированное время звонка" fullWidth />
                    <TextInput source="manager" label="Менеджер" fullWidth />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Дополнительная информация</Typography>
                <TextInput source="comment" label="Комментарий клиента" fullWidth multiline rows={3} />
                <TextInput source="managerNote" label="Заметка менеджера" fullWidth multiline rows={3} />
                <SelectInput
                    source="priority"
                    label="Приоритет"
                    choices={[
                        { id: 'low', name: 'Низкий' },
                        { id: 'medium', name: 'Средний' },
                        { id: 'high', name: 'Высокий' },
                        { id: 'urgent', name: 'Срочный' },
                    ]}
                    fullWidth
                />
            </Box>
        </SimpleForm>
    </Edit>
);

// Форма создания обратного звонка
export const CallbackCreate = () => (
    <Create title="Создание заявки на обратный звонок">
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Контактная информация</Typography>
                    <TextInput source="name" label="Имя клиента" validate={[required()]} fullWidth />
                    <TextInput source="phone" label="Номер телефона" validate={[required()]} fullWidth />
                    <TextInput source="email" label="Email" fullWidth />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Информация о звонке</Typography>
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'new', name: 'Новый' },
                            { id: 'in_progress', name: 'В работе' },
                            { id: 'completed', name: 'Завершен' },
                            { id: 'cancelled', name: 'Отменен' },
                        ]}
                        defaultValue="new"
                        fullWidth
                    />
                    <TextInput source="url" label="Источник (URL)" fullWidth />
                    <DateTimeInput source="callbackTime" label="Запланированное время звонка" fullWidth />
                    <TextInput source="manager" label="Менеджер" fullWidth />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Дополнительная информация</Typography>
                <TextInput source="comment" label="Комментарий клиента" fullWidth multiline rows={3} />
                <TextInput source="managerNote" label="Заметка менеджера" fullWidth multiline rows={3} />
                <SelectInput
                    source="priority"
                    label="Приоритет"
                    choices={[
                        { id: 'low', name: 'Низкий' },
                        { id: 'medium', name: 'Средний' },
                        { id: 'high', name: 'Высокий' },
                        { id: 'urgent', name: 'Срочный' },
                    ]}
                    defaultValue="medium"
                    fullWidth
                />
            </Box>
        </SimpleForm>
    </Create>
);

// Просмотр заявки
export const CallbackShow = () => (
    <Show title="Просмотр заявки на обратный звонок">
        <SimpleShowLayout>
            <TextField source="name" label="Имя клиента" />
            <TextField source="phone" label="Телефон" />
            <TextField source="email" label="Email" />
            <FunctionField
                label="Статус"
                render={(record: any) => {
                    const getStatusColor = (status: string) => {
                        switch (status) {
                            case 'new': return 'warning';
                            case 'in_progress': return 'info';
                            case 'completed': return 'success';
                            case 'cancelled': return 'error';
                            default: return 'default';
                        }
                    };

                    const getStatusLabel = (status: string) => {
                        switch (status) {
                            case 'new': return 'Новый';
                            case 'in_progress': return 'В работе';
                            case 'completed': return 'Завершен';
                            case 'cancelled': return 'Отменен';
                            default: return status;
                        }
                    };

                    return (
                        <Chip
                            label={getStatusLabel(record.status)}
                            color={getStatusColor(record.status) as any}
                            size="small"
                        />
                    );
                }}
            />
            <DateField source="createdAt" label="Дата создания" showTime />
            <DateField source="callbackTime" label="Время звонка" showTime />
            <TextField source="url" label="Источник" />
            <TextField source="manager" label="Менеджер" />
            <TextField source="comment" label="Комментарий" />
            <TextField source="managerNote" label="Заметка менеджера" />
        </SimpleShowLayout>
    </Show>
);