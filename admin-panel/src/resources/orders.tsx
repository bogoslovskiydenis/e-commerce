import React, { useState } from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    SelectInput,
    ArrayInput,
    SimpleFormIterator,
    required,
    NumberInput,
    SearchInput,
    FilterButton,
    CreateButton,
    ExportButton,
    TopToolbar,
    useRecordContext,
    FunctionField,
    ChipField,
    BooleanField,
    ReferenceField,
    useListContext
} from 'react-admin';
import { Chip, Box, Typography, Tabs, Tab } from '@mui/material';

// Компонент для вкладок фильтрации заказов
const OrderTabs = () => {
    const [value, setValue] = useState('all');
    const { filterValues, setFilters } = useListContext();

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);

        // Применяем фильтры в зависимости от выбранной вкладки
        switch (newValue) {
            case 'new':
                setFilters({ ...filterValues, status: 'new' }, {});
                break;
            case 'today':
                const today = new Date().toISOString().split('T')[0];
                setFilters({ ...filterValues, createdAt_gte: today }, {});
                break;
            case 'open':
                setFilters({ ...filterValues, status: ['new', 'processing'] }, {});
                break;
            case 'all':
            default:
                setFilters({}, {});
                break;
        }
    };

    return (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={value} onChange={handleTabChange}>
                <Tab label="Новые" value="new" />
                <Tab label="Сегодня" value="today" />
                <Tab label="Открытые" value="open" />
                <Tab label="Все" value="all" />
            </Tabs>
        </Box>
    );
};
const OrderStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'primary';
            case 'processing': return 'info';
            case 'shipped': return 'warning';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'new': return 'Новый';
            case 'processing': return 'В обработке';
            case 'shipped': return 'Отправлен';
            case 'delivered': return 'Доставлен';
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

// Компонент для отображения типа оплаты
const PaymentStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box>
            <Typography variant="body2">
                {record.paymentStatus === 'paid' ? 'Да' : 'Нет'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {record.paymentMethod || 'Онлайн-оплата банковской картой'}
            </Typography>
            {record.paymentNote && (
                <Typography variant="caption" display="block">
                    ({record.paymentNote})
                </Typography>
            )}
        </Box>
    );
};

// Компонент для отображения доставки
const DeliveryField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return (
        <Box>
            <Typography variant="body2">
                {record.deliveryMethod || 'Новою поштою'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {record.deliveryAddress || 'по тарифам перевозчика'}
            </Typography>
        </Box>
    );
};

// Фильтры для списка заказов
const orderFilters = [
    <SearchInput source="q" placeholder="Поиск по клиенту или номеру" alwaysOn />,
    <SelectInput
        source="status"
        label="Статус"
        choices={[
            { id: 'new', name: 'Новый' },
            { id: 'processing', name: 'В обработке' },
            { id: 'shipped', name: 'Отправлен' },
            { id: 'delivered', name: 'Доставлен' },
            { id: 'cancelled', name: 'Отменен' },
        ]}
        emptyText="Все статусы"
    />,
    <SelectInput
        source="paymentStatus"
        label="Оплата"
        choices={[
            { id: 'paid', name: 'Оплачен' },
            { id: 'pending', name: 'Ожидает оплаты' },
            { id: 'failed', name: 'Ошибка оплаты' },
        ]}
        emptyText="Все"
    />,
];

// Действия в тулбаре
const OrderListActions = () => (
    <TopToolbar>
        <FilterButton />
        <CreateButton label="Добавить" />
        <ExportButton label="Экспорт" />
    </TopToolbar>
);

// Кастомный список с вкладками
const OrderListWithTabs = (props: any) => (
    <List
        {...props}
        actions={<OrderListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
        title="Заказы"
    >
        <OrderTabs />
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <DateField source="createdAt" label="Дата создания" showTime />
            <FunctionField
                label="Номер"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {record.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {record.customer?.phone?.replace(/[^\d]/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5') || ''}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            (не перезванивать)
                        </Typography>
                    </Box>
                )}
            />
            <FunctionField
                label="Пользователь"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                            {record.customer?.name || 'Не указан'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {record.customer?.phone || ''}
                        </Typography>
                    </Box>
                )}
            />
            <FunctionField
                label="Заказ"
                render={(record: any) => (
                    <Box>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {record.totalAmount} грн
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {record.itemsCount || 1} товар
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                            <Chip
                                label="Чек"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ fontSize: '0.65rem', height: '16px' }}
                            />
                        </Box>
                    </Box>
                )}
            />
            <DeliveryField />
            <PaymentStatusField />
            <TextField source="source" label="Источник" />
            <TextField source="comment" label="Комментарий менеджера" />
            <TextField source="commentCustomer" label="Комментарий" />
            <TextField source="manager" label="Менеджер" />
            <FunctionField
                label="Статус"
                render={(record: any) => {
                    const getStatusColor = (status: string) => {
                        switch (status) {
                            case 'new': return 'success';
                            case 'processing': return 'info';
                            case 'shipped': return 'warning';
                            case 'delivered': return 'success';
                            case 'cancelled': return 'error';
                            default: return 'default';
                        }
                    };

                    const getStatusLabel = (status: string) => {
                        switch (status) {
                            case 'new': return 'Новый';
                            case 'processing': return 'В обработке';
                            case 'shipped': return 'Отправлен';
                            case 'delivered': return 'Доставлен';
                            case 'cancelled': return 'Отменен';
                            default: return status;
                        }
                    };

                    return (
                        <Box>
                            <Chip
                                label={getStatusLabel(record.status)}
                                color={getStatusColor(record.status) as any}
                                size="small"
                                sx={{ mb: 0.5 }}
                            />
                            <Box>
                                <Chip
                                    label="Начать обработку"
                                    size="small"
                                    color="success"
                                    sx={{ fontSize: '0.65rem', height: '20px' }}
                                />
                            </Box>
                        </Box>
                    );
                }}
            />
        </Datagrid>
    </List>
);

// Основной компонент списка заказов
export const OrderList = OrderListWithTabs;

// Форма редактирования заказа
export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <Box display="flex" gap={2} width="100%">
                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <DateInput source="createdAt" label="Дата создания" validate={[required()]} />
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'new', name: 'Новый' },
                            { id: 'processing', name: 'В обработке' },
                            { id: 'shipped', name: 'Отправлен' },
                            { id: 'delivered', name: 'Доставлен' },
                            { id: 'cancelled', name: 'Отменен' },
                        ]}
                        validate={[required()]}
                    />
                    <NumberInput source="totalAmount" label="Сумма заказа" validate={[required()]} />
                    <NumberInput source="itemsCount" label="Количество товаров" />
                </Box>

                <Box flex={1}>
                    <Typography variant="h6" gutterBottom>Клиент</Typography>
                    <TextInput source="customer.name" label="Имя клиента" validate={[required()]} />
                    <TextInput source="customer.email" label="Email" />
                    <TextInput source="customer.phone" label="Телефон" validate={[required()]} />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Доставка и оплата</Typography>
                <Box display="flex" gap={2}>
                    <TextInput source="deliveryMethod" label="Способ доставки" fullWidth />
                    <TextInput source="deliveryAddress" label="Адрес доставки" fullWidth multiline />
                </Box>
                <Box display="flex" gap={2}>
                    <SelectInput
                        source="paymentStatus"
                        label="Статус оплаты"
                        choices={[
                            { id: 'paid', name: 'Оплачен' },
                            { id: 'pending', name: 'Ожидает оплаты' },
                            { id: 'failed', name: 'Ошибка оплаты' },
                        ]}
                        fullWidth
                    />
                    <TextInput source="paymentMethod" label="Способ оплаты" fullWidth />
                </Box>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Товары в заказе</Typography>
                <ArrayInput source="items">
                    <SimpleFormIterator>
                        <TextInput source="productId" label="ID товара" />
                        <TextInput source="productName" label="Название товара" />
                        <NumberInput source="quantity" label="Количество" />
                        <NumberInput source="price" label="Цена за единицу" />
                        <NumberInput source="total" label="Сумма" />
                    </SimpleFormIterator>
                </ArrayInput>
            </Box>

            <Box width="100%" mt={3}>
                <Typography variant="h6" gutterBottom>Комментарии</Typography>
                <TextInput source="comment" label="Комментарий менеджера" fullWidth multiline />
                <TextInput source="commentCustomer" label="Комментарий клиента" fullWidth multiline />
                <TextInput source="manager" label="Менеджер" fullWidth />
                <TextInput source="source" label="Источник заказа" fullWidth />
            </Box>
        </SimpleForm>
    </Edit>
);