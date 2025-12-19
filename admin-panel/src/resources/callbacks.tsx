import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    SelectInput,
    required,
    SearchInput,
    FilterButton,
    TopToolbar,
    FunctionField,
    EmailField
} from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';

// Компонент для отображения статуса
const StatusField = ({ record }: any) => {
    if (!record) return null;
    
    const status = record?.status || 'NEW';
    const statusMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
        'NEW': { label: 'Новый', color: 'warning' },
        'IN_PROGRESS': { label: 'В работе', color: 'info' },
        'COMPLETED': { label: 'Завершен', color: 'success' },
        'CANCELLED': { label: 'Отменен', color: 'error' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'default' };

    return (
        <Chip
            label={statusInfo.label}
            color={statusInfo.color}
            size="small"
        />
    );
};

// Компонент для отображения приоритета
const PriorityField = ({ record }: any) => {
    if (!record) return null;
    
    const priority = record?.priority || 'MEDIUM';
    const priorityMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
        'LOW': { label: 'Низкий', color: 'default' },
        'MEDIUM': { label: 'Средний', color: 'info' },
        'HIGH': { label: 'Высокий', color: 'warning' },
        'URGENT': { label: 'Срочный', color: 'error' }
    };

    const priorityInfo = priorityMap[priority] || { label: priority, color: 'default' };

    return (
        <Chip
            label={priorityInfo.label}
            color={priorityInfo.color}
            size="small"
        />
    );
};

// Фильтры
const callbackFilters = [
    <SearchInput source="search" placeholder="Поиск по имени, телефону, email" alwaysOn />,
    <SelectInput
        source="status"
        label="Статус"
        choices={[
            { id: 'NEW', name: 'Новый' },
            { id: 'IN_PROGRESS', name: 'В работе' },
            { id: 'COMPLETED', name: 'Завершен' },
            { id: 'CANCELLED', name: 'Отменен' },
        ]}
        emptyText="Все статусы"
    />,
    <SelectInput
        source="priority"
        label="Приоритет"
        choices={[
            { id: 'LOW', name: 'Низкий' },
            { id: 'MEDIUM', name: 'Средний' },
            { id: 'HIGH', name: 'Высокий' },
            { id: 'URGENT', name: 'Срочный' },
        ]}
        emptyText="Все приоритеты"
    />
];

// Действия в тулбаре
const CallbackListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);

export const CallbackList = () => (
    <List
        title="Обратные звонки"
        filters={callbackFilters}
        actions={<CallbackListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <DateField source="createdAt" label="Дата" showTime />
            <TextField source="name" label="Имя" />
            <TextField source="phone" label="Телефон" />
            <EmailField source="email" label="Email" />
            <FunctionField
                label="Сообщение"
                render={(record: any) => (
                    <Box sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {record.message || '-'}
                        </Typography>
                    </Box>
                )}
            />
            <StatusField source="status" label="Статус" />
            <PriorityField source="priority" label="Приоритет" />
            <FunctionField
                label="Менеджер"
                render={(record: any) => record.manager?.fullName || record.manager?.username || '-'}
            />
            <TextField source="source" label="Источник" />
        </Datagrid>
    </List>
);

export const CallbackEdit = () => (
    <Edit title="Редактировать заявку на обратный звонок">
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <TextInput disabled source="id" />
                    <TextInput source="name" label="Имя" fullWidth validate={[required()]} />
                    <TextInput source="phone" label="Телефон" fullWidth validate={[required()]} />
                    <TextInput source="email" label="Email" fullWidth type="email" />
                    <TextInput
                        source="message"
                        label="Сообщение"
                        fullWidth
                        multiline
                        rows={4}
                    />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Статус и управление</Typography>
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'NEW', name: 'Новый' },
                            { id: 'IN_PROGRESS', name: 'В работе' },
                            { id: 'COMPLETED', name: 'Завершен' },
                            { id: 'CANCELLED', name: 'Отменен' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <SelectInput
                        source="priority"
                        label="Приоритет"
                        choices={[
                            { id: 'LOW', name: 'Низкий' },
                            { id: 'MEDIUM', name: 'Средний' },
                            { id: 'HIGH', name: 'Высокий' },
                            { id: 'URGENT', name: 'Срочный' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <TextField source="source" label="Источник" fullWidth />
                    <DateInput source="scheduledAt" label="Запланировано на" fullWidth />
                    <DateField source="completedAt" label="Завершено" showTime />
                    <DateField source="createdAt" label="Создано" showTime />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Примечания</Typography>
                <TextInput
                    source="notes"
                    label="Примечания менеджера"
                    fullWidth
                    multiline
                    rows={4}
                />
            </Box>
        </SimpleForm>
    </Edit>
);