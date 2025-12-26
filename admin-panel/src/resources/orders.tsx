import React from 'react';
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
    BooleanField,
    BooleanInput,
    Show,
    SimpleShowLayout,
    Filter,
    SearchInput,
    TopToolbar,
    ExportButton,
    useRecordContext
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { Box, Card, CardContent, Typography, Divider, Chip, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// Компонент для отображения статуса заказа
const StatusField = ({ record }: any) => {
    const status = record?.status || 'new';
    const statusColors = {
        'new': '#f59e0b',
        'processing': '#3b82f6',
        'shipped': '#8b5cf6',
        'delivered': '#10b981',
        'cancelled': '#ef4444'
    };

    const statusLabels = {
        'new': 'Новый',
        'processing': 'Обрабатывается',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
        'cancelled': 'Отменен'
    };

    return (
        <Chip
            label={statusLabels[status as keyof typeof statusLabels]}
            sx={{
                backgroundColor: statusColors[status as keyof typeof statusColors],
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
            }}
        />
    );
};

// Компонент для отображения статуса оплаты
const PaymentStatusField = ({ record }: any) => {
    const paymentStatus = record?.paymentStatus || 'pending';
    const statusColors = {
        'pending': '#f59e0b',
        'paid': '#10b981',
        'failed': '#ef4444',
        'refunded': '#8b5cf6'
    };

    const statusLabels = {
        'pending': 'Ожидает оплаты',
        'paid': 'Оплачен',
        'failed': 'Ошибка оплаты',
        'refunded': 'Возврат'
    };

    return (
        <Chip
            label={statusLabels[paymentStatus as keyof typeof statusLabels] || paymentStatus}
            sx={{
                backgroundColor: statusColors[paymentStatus as keyof typeof statusColors] || '#gray',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.875rem'
            }}
        />
    );
};

// Компонент для отображения суммы с валютой
const TotalField = ({ record }: any) => {
    return <span>{record?.total} {record?.currency || 'грн'}</span>;
};

// Фильтры для списка заказов
const OrderFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn placeholder="Поиск по номеру, клиенту, телефону" />
        <SelectInput
            source="status"
            label="Статус"
            choices={[
                { id: 'new', name: 'Новый' },
                { id: 'processing', name: 'Обрабатывается' },
                { id: 'shipped', name: 'Отправлен' },
                { id: 'delivered', name: 'Доставлен' },
                { id: 'cancelled', name: 'Отменен' },
            ]}
            alwaysOn
        />
        <SelectInput
            source="paymentMethod"
            label="Способ оплаты"
            choices={[
                { id: 'monobank', name: 'Monobank' },
                { id: 'privat24', name: 'Приват24' },
                { id: 'cash', name: 'Наличными' },
                { id: 'card', name: 'Картой при получении' },
            ]}
        />
        <DateInput source="date_gte" label="Дата от" />
        <DateInput source="date_lte" label="Дата до" />
    </Filter>
);

// Панель инструментов
const ListActions = () => (
    <TopToolbar>
        <ExportButton />
    </TopToolbar>
);

export const OrderList = () => (
    <List
        title="Заказы"
        perPage={25}
        filters={<OrderFilter />}
        actions={<ListActions />}
        sort={{ field: 'date', order: 'DESC' }}
    >
        <Datagrid rowClick="edit">
            <NumberField source="orderNumber" label="№ заказа" sortable />
            <DateField source="date" label="Дата создания" showTime sortable />
            <TextField source="customer.name" label="Клиент" sortable />
            <TextField source="customer.phone" label="Телефон" />
            <StatusField source="status" label="Статус" sortable />
            <TextField source="paymentMethod" label="Способ оплаты" />
            <TotalField source="total" label="Сумма" sortable />
            <BooleanField source="processing" label="Обработка" />
        </Datagrid>
    </List>
);


// Компонент для отображения итогов с актуальными данными из формы
const OrderSummary = () => {
    const { watch } = useFormContext();
    const record = useRecordContext();
    
    const items = watch('items') || record?.items || [];
    const total = watch('total') || record?.total;
    const totalAmount = watch('totalAmount') || record?.totalAmount;
    const discountAmount = watch('discountAmount') ?? record?.discountAmount ?? 0;
    const shippingAmount = watch('shippingAmount') ?? record?.shippingAmount ?? 0;
    const currency = watch('currency') || record?.currency || 'грн';
    
    const itemsCount = items.reduce((sum: number, item: any) => sum + (Number(item?.quantity) || 0), 0);
    const itemsTotal = items.reduce((sum: number, item: any) => {
        const itemTotal = (Number(item?.price) || 0) * (Number(item?.quantity) || 0);
        return sum + itemTotal;
    }, 0);
    
    const finalTotal = Number(total || totalAmount || itemsTotal) - Number(discountAmount) + Number(shippingAmount);
    
    return (
        <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                    Товаров:
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {itemsCount} шт.
                </Typography>
            </Box>
            {Number(discountAmount) > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        Скидка:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                        -{Number(discountAmount).toFixed(2)} {currency}
                    </Typography>
                </Box>
            )}
            {Number(shippingAmount) > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'medium' }}>
                        Доставка:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {Number(shippingAmount).toFixed(2)} {currency}
                    </Typography>
                </Box>
            )}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Всего:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {finalTotal.toFixed(2)} {currency}
                </Typography>
            </Box>
        </Box>
    );
};

export const OrderEdit = () => {
    const record = useRecordContext();
    
    return (
        <Edit title="Редактировать заказ">
            <SimpleForm>
                <Grid container spacing={3}>
                    {/* Левая колонка - основная информация */}
                    <Grid item xs={12} md={8}>
                        {/* Основная информация */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Основная информация
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextInput disabled source="orderNumber" label="Номер заказа" fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DateInput source="date" label="Дата заказа" validate={[required()]} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <SelectInput
                                            source="status"
                                            label="Статус заказа"
                                            choices={[
                                                { id: 'new', name: 'Новый' },
                                                { id: 'processing', name: 'Обрабатывается' },
                                                { id: 'shipped', name: 'Отправлен' },
                                                { id: 'delivered', name: 'Доставлен' },
                                                { id: 'cancelled', name: 'Отменен' },
                                            ]}
                                            validate={[required()]}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <SelectInput
                                            source="paymentMethod"
                                            label="Способ оплаты"
                                            choices={[
                                                { id: 'CASH', name: 'Наличными' },
                                                { id: 'CARD', name: 'Картой при получении' },
                                                { id: 'MONOBANK', name: 'Monobank' },
                                                { id: 'PRIVAT24', name: 'Приват24' },
                                            ]}
                                            fullWidth
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Информация о клиенте */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Информация о клиенте
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextInput source="customer.name" label="Имя клиента" validate={[required()]} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextInput source="customer.phone" label="Телефон" validate={[required()]} fullWidth />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextInput source="customer.email" label="Email" type="email" fullWidth />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Доставка */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Доставка
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextInput source="deliveryMethod" label="Способ доставки" fullWidth />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextInput
                                            source="deliveryAddress"
                                            label="Адрес доставки (JSON)"
                                            multiline
                                            rows={4}
                                            fullWidth
                                            helperText='Формат: {"city":"Киев","street":"Улица","building":"1","apartment":"10"}'
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        {/* Товары в заказе */}
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                                    Товары в заказе
                                </Typography>
                                <ArrayInput source="items" label="">
                                    <SimpleFormIterator>
                                        <Grid container spacing={2} sx={{ width: '100%', mb: 2 }}>
                                            <Grid item xs={12} sm={6}>
                                                <TextInput 
                                                    source="product.title" 
                                                    label="Название товара" 
                                                    fullWidth 
                                                    sx={{ '& .MuiInputBase-root': { fontSize: '1rem', minHeight: '56px' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <NumberInput 
                                                    source="quantity" 
                                                    label="Количество" 
                                                    min={1} 
                                                    fullWidth
                                                    sx={{ '& .MuiInputBase-root': { fontSize: '1rem', minHeight: '56px' } }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3}>
                                                <NumberInput 
                                                    source="price" 
                                                    label="Цена, грн" 
                                                    fullWidth
                                                    sx={{ '& .MuiInputBase-root': { fontSize: '1rem', minHeight: '56px' } }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </SimpleFormIterator>
                                </ArrayInput>
                            </CardContent>
                        </Card>

                        {/* Примечания */}
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Примечания
                                </Typography>
                                <TextInput
                                    source="notes"
                                    label="Комментарий к заказу"
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Правая колонка - итоги и дополнительные настройки */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ position: 'sticky', top: 20 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Итого
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                
                                <OrderSummary />

                                <Divider sx={{ my: 2 }} />

                                <Box sx={{ mb: 2 }}>
                                    <NumberInput source="total" label="Общая сумма" fullWidth />
                                    <NumberInput source="totalAmount" label="Сумма заказа" fullWidth sx={{ mt: 2 }} />
                                    <NumberInput source="discountAmount" label="Скидка" fullWidth sx={{ mt: 2 }} />
                                    <NumberInput source="shippingAmount" label="Доставка" fullWidth sx={{ mt: 2 }} />
                                    <TextInput source="currency" label="Валюта" defaultValue="грн" fullWidth sx={{ mt: 2 }} />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <BooleanInput source="processing" label="В обработке" />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleForm>
        </Edit>
    );
};

// Компонент для форматирования адреса
const AddressField = ({ source }: any) => {
    const record = useRecordContext();
    const address = record?.[source];
    
    if (!address) return <Typography variant="body2" color="text.secondary">Не указан</Typography>;
    
    try {
        const parsed = typeof address === 'string' ? JSON.parse(address) : address;
        const parts = [];
        if (parsed.city) parts.push(parsed.city);
        if (parsed.street) parts.push(`ул. ${parsed.street}`);
        if (parsed.building) parts.push(`д. ${parsed.building}`);
        if (parsed.apartment) parts.push(`кв. ${parsed.apartment}`);
        if (parsed.postalCode) parts.push(`индекс: ${parsed.postalCode}`);
        
        return <Typography variant="body2">{parts.join(', ') || address}</Typography>;
    } catch {
        return <Typography variant="body2">{address}</Typography>;
    }
};

// Компонент для отображения товаров
const OrderItemsTable = () => {
    const record = useRecordContext();
    const items = record?.items || [];
    
    if (items.length === 0) {
        return <Typography variant="body2" color="text.secondary">Товары не найдены</Typography>;
    }
    
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Товар</strong></TableCell>
                        <TableCell align="right"><strong>Количество</strong></TableCell>
                        <TableCell align="right"><strong>Цена</strong></TableCell>
                        <TableCell align="right"><strong>Сумма</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell>
                                {item.product?.title || item.product?.name || 'Товар не найден'}
                                {item.product?.images?.[0] && (
                                    <Box sx={{ mt: 1 }}>
                                        <img 
                                            src={item.product.images[0]} 
                                            alt={item.product.title || ''}
                                            style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </Box>
                                )}
                            </TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{Number(item.price).toFixed(2)} грн</TableCell>
                            <TableCell align="right"><strong>{Number(item.total || item.price * item.quantity).toFixed(2)} грн</strong></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Компонент карточки информации
const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card sx={{ mb: 2 }}>
        <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                {title}
            </Typography>
            {children}
        </CardContent>
    </Card>
);

const OrderShowContent = () => {
    const record = useRecordContext();
    
    if (!record) return null;
    
    const formatDate = (date: string) => {
        if (!date) return 'Не указана';
        return new Date(date).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
                Заказ #{record.orderNumber}
            </Typography>
                <Grid container spacing={3}>
                    {/* Основная информация */}
                    <Grid item xs={12} md={8}>
                        <InfoCard title="Основная информация">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Номер заказа</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                        #{record.orderNumber}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Дата создания</Typography>
                                    <Typography variant="body1">{formatDate(record.date || record.createdAt)}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Статус заказа</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <StatusField record={record} />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Статус оплаты</Typography>
                                    <Box sx={{ mt: 1 }}>
                                        <PaymentStatusField record={record} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </InfoCard>

                        {/* Информация о клиенте */}
                        <InfoCard title="Информация о клиенте">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Имя</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                        {record.customer?.name || 'Не указано'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Телефон</Typography>
                                    <Typography variant="body1">
                                        <a href={`tel:${record.customer?.phone}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            {record.customer?.phone || 'Не указан'}
                                        </a>
                                    </Typography>
                                </Grid>
                                {record.customer?.email && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">
                                            <a href={`mailto:${record.customer.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                {record.customer.email}
                                            </a>
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </InfoCard>

                        {/* Доставка и оплата */}
                        <InfoCard title="Доставка и оплата">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Способ оплаты</Typography>
                                    <Typography variant="body1">
                                        {record.paymentMethod || 'Не указан'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">Способ доставки</Typography>
                                    <Typography variant="body1">
                                        {record.deliveryMethod || 'Не указан'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">Адрес доставки</Typography>
                                    <AddressField source="deliveryAddress" />
                                </Grid>
                            </Grid>
                        </InfoCard>

                        {/* Товары в заказе */}
                        <InfoCard title="Товары в заказе">
                            <OrderItemsTable />
                        </InfoCard>

                        {/* Примечания */}
                        {record.notes && (
                            <InfoCard title="Примечания">
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {record.notes}
                                </Typography>
                            </InfoCard>
                        )}
                    </Grid>

                    {/* Боковая панель с итогами */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ position: 'sticky', top: 20 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Итого
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                
                                <Box sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Товаров:
                                        </Typography>
                                        <Typography variant="body2">
                                            {record.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0} шт.
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Скидка:
                                        </Typography>
                                        <Typography variant="body2">
                                            {record.discountAmount ? `${Number(record.discountAmount).toFixed(2)} грн` : '0.00 грн'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Доставка:
                                        </Typography>
                                        <Typography variant="body2">
                                            {record.shippingAmount ? `${Number(record.shippingAmount).toFixed(2)} грн` : 'По договоренности'}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            Всего:
                                        </Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                            {Number(record.total || record.totalAmount || 0).toFixed(2)} {record.currency || 'грн'}
                                        </Typography>
                                    </Box>
                                </Box>

                                {record.manager && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Менеджер</Typography>
                                            <Typography variant="body2">
                                                {record.manager.fullName || record.manager.username || 'Не назначен'}
                                            </Typography>
                                        </Box>
                                    </>
                                )}

                                {record.source && (
                                    <>
                                        <Divider sx={{ my: 2 }} />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Источник</Typography>
                                            <Typography variant="body2">{record.source}</Typography>
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
    );
};

export const OrderShow = () => (
    <Show>
        <OrderShowContent />
    </Show>
);