import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Edit,
    SimpleForm,
    TextInput,
    required,
    Show,
    SimpleShowLayout,
    DateField,
    SearchInput,
    FilterButton,
    TopToolbar,
    FunctionField,
    BooleanField,
    ArrayInput,
    SimpleFormIterator
} from 'react-admin';
import { Box, Typography, Chip } from '@mui/material';

// Фильтры
const customerFilters = [
    <SearchInput source="search" placeholder="Поиск по имени, email, телефону" alwaysOn />,
];

// Действия в тулбаре
const CustomerListActions = () => (
    <TopToolbar>
        <FilterButton />
    </TopToolbar>
);

export const CustomerList = () => (
    <List
        title="Клиенты"
        filters={customerFilters}
        actions={<CustomerListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <DateField source="createdAt" label="Дата регистрации" showTime />
            <TextField source="name" label="Имя" />
            <EmailField source="email" label="Email" />
            <TextField source="phone" label="Телефон" />
            <FunctionField
                label="Адрес"
                render={(record: any) => (
                    <Box sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}>
                            {record.address || '-'}
                        </Typography>
                    </Box>
                )}
            />
            <FunctionField
                label="Теги"
                render={(record: any) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {record.tags && record.tags.length > 0 ? (
                            record.tags.slice(0, 3).map((tag: string, index: number) => (
                                <Chip key={index} label={tag} size="small" />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">-</Typography>
                        )}
                    </Box>
                )}
            />
            <FunctionField
                label="Статистика"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2">
                            Заказов: {record._count?.orders || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Отзывов: {record._count?.reviews || 0}
                        </Typography>
                    </Box>
                )}
            />
            <BooleanField source="isActive" label="Активен" />
        </Datagrid>
    </List>
);

export const CustomerEdit = () => (
    <Edit title="Редактировать клиента">
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <TextInput disabled source="id" fullWidth />
                    <TextInput source="name" label="Имя" fullWidth validate={[required()]} />
                    <TextInput source="email" label="Email" fullWidth type="email" />
                    <TextInput source="phone" label="Телефон" fullWidth validate={[required()]} />
                    <TextInput
                        source="address"
                        label="Адрес"
                        fullWidth
                        multiline
                        rows={2}
                    />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Дополнительная информация</Typography>
                    <TextInput
                        source="notes"
                        label="Примечания"
                        fullWidth
                        multiline
                        rows={4}
                    />
                    <ArrayInput source="tags" label="Теги">
                        <SimpleFormIterator>
                            <TextInput source="" label="Тег" />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <BooleanField source="isActive" label="Активен" />
                    <DateField source="createdAt" label="Дата регистрации" showTime />
                    <DateField source="updatedAt" label="Последнее обновление" showTime />
                </Box>
            </Box>
        </SimpleForm>
    </Edit>
);

export const CustomerShow = () => (
    <Show title="Просмотр клиента">
        <SimpleShowLayout>
            <TextField source="name" label="Имя" />
            <EmailField source="email" label="Email" />
            <TextField source="phone" label="Телефон" />
            <TextField source="address" label="Адрес" />
            <TextField source="notes" label="Примечания" />
            <FunctionField
                label="Теги"
                render={(record: any) => (
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {record.tags && record.tags.length > 0 ? (
                            record.tags.map((tag: string, index: number) => (
                                <Chip key={index} label={tag} size="small" />
                            ))
                        ) : (
                            <Typography variant="body2" color="text.secondary">Нет тегов</Typography>
                        )}
                    </Box>
                )}
            />
            <BooleanField source="isActive" label="Активен" />
            <DateField source="createdAt" label="Дата регистрации" showTime />
            <DateField source="updatedAt" label="Последнее обновление" showTime />
            <FunctionField
                label="Статистика"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Заказов: {record._count?.orders || 0}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Отзывов: {record._count?.reviews || 0}
                        </Typography>
                        <Typography variant="body1">
                            Обратных звонков: {record._count?.callbacks || 0}
                        </Typography>
                    </Box>
                )}
            />
        </SimpleShowLayout>
    </Show>
);