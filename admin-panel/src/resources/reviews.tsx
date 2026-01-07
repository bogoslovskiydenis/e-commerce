import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    Create,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextInput,
    DateInput,
    SelectInput,
    required,
    NumberInput,
    ReferenceInput,
    ReferenceField,
    EmailField,
    useRecordContext,
    FormDataConsumer,
    Filter,
    SearchInput,
    TopToolbar,
    CreateButton,
    ExportButton,
    FunctionField
} from 'react-admin';
import { Box, Typography, Chip, Card, CardContent, Grid, Divider } from '@mui/material';
import { Star, CheckCircle, Cancel, Pending } from '@mui/icons-material';

// Компонент для отображения звездного рейтинга
const RatingField = ({ record }: any) => {
    const rating = record?.rating || 0;
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    return <span style={{ color: '#ffa500', fontSize: '1.2rem' }}>{stars}</span>;
};

// Компонент для отображения статуса
const StatusField = () => {
    const record = useRecordContext();
    if (!record) return null;
    
    const status = record.status?.toLowerCase() || 'pending';
    const statusConfig = {
        pending: { label: 'На модерации', color: 'warning', icon: <Pending /> },
        approved: { label: 'Одобрен', color: 'success', icon: <CheckCircle /> },
        rejected: { label: 'Отклонен', color: 'error', icon: <Cancel /> },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
        <Chip
            icon={config.icon}
            label={config.label}
            color={config.color as any}
            size="small"
        />
    );
};

// Компонент для обрезки длинного текста
const ShortTextField = ({ record, source, maxLength = 100 }: any) => {
    const text = record?.[source] || '';
    const shortText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return <span title={text}>{shortText}</span>;
};

// Фильтры
const ReviewFilter = () => (
    <Filter>
        <SearchInput source="search" placeholder="Поиск по имени, email, комментарию" alwaysOn />
        <SelectInput
            source="status"
            label="Статус"
            choices={[
                { id: 'PENDING', name: 'На модерации' },
                { id: 'APPROVED', name: 'Одобрен' },
                { id: 'REJECTED', name: 'Отклонен' },
            ]}
            emptyText="Все статусы"
        />
        <SelectInput
            source="rating"
            label="Рейтинг"
            choices={[
                { id: '5', name: '5 звезд' },
                { id: '4', name: '4 звезды' },
                { id: '3', name: '3 звезды' },
                { id: '2', name: '2 звезды' },
                { id: '1', name: '1 звезда' },
            ]}
            emptyText="Все рейтинги"
        />
        <ReferenceInput source="productId" reference="products">
            <SelectInput optionText="title" label="Товар" emptyText="Все товары" />
        </ReferenceInput>
    </Filter>
);

// Действия в тулбаре
const ReviewListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

export const ReviewList = () => (
    <List 
        title="Отзывы и комментарии" 
        perPage={25}
        filters={<ReviewFilter />}
        actions={<ReviewListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
    >
        <Datagrid rowClick="show">
            <DateField source="createdAt" label="Дата" showTime />
            <TextField source="name" label="Имя" />
            <EmailField source="email" label="Email" />
            <ReferenceField source="productId" reference="products" label="Товар">
                <TextField source="title" />
            </ReferenceField>
            <FunctionField label="Рейтинг" render={(record: any) => <RatingField record={record} />} />
            <ShortTextField source="comment" label="Комментарий" maxLength={80} />
            <FunctionField label="Статус" render={() => <StatusField />} />
        </Datagrid>
    </List>
);

export const ReviewEdit = () => (
    <Edit title="Редактировать отзыв">
        <SimpleForm>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextInput disabled source="id" fullWidth />
                    <ReferenceInput source="productId" reference="products" fullWidth>
                        <SelectInput optionText="title" label="Товар" validate={[required()]} />
                    </ReferenceInput>
                    <TextInput source="name" label="Имя клиента" validate={[required()]} fullWidth />
                    <TextInput source="email" label="Email" type="email" fullWidth />
                    <NumberInput source="rating" label="Рейтинг" min={1} max={5} validate={[required()]} fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                    <SelectInput
                        source="status"
                        label="Статус"
                        choices={[
                            { id: 'PENDING', name: 'На модерации' },
                            { id: 'APPROVED', name: 'Одобрен' },
                            { id: 'REJECTED', name: 'Отклонен' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <DateField source="createdAt" label="Дата создания" showTime />
                    <DateField source="moderatedAt" label="Дата модерации" showTime />
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        source="comment"
                        label="Комментарий"
                        multiline
                        rows={6}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        source="adminMessage"
                        label="Сообщение администратора"
                        multiline
                        rows={4}
                        fullWidth
                        helperText="Сообщение администратора к отзыву (видно только в админке)"
                    />
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
);

export const ReviewCreate = () => {
    return (
        <Create title="Создать отзыв">
            <SimpleForm>
                <ReferenceInput source="productId" reference="products" fullWidth>
                    <SelectInput optionText="title" label="Товар" validate={[required()]} />
                </ReferenceInput>
                <ReferenceInput source="customerId" reference="customers" fullWidth>
                    <SelectInput 
                        optionText={(record) => `${record.name} (${record.email || record.phone})`}
                        label="Клиент (опционально)"
                        emptyText="Гость - отзыв будет на модерации"
                        helperText="Если выбран зарегистрированный клиент, отзыв будет автоматически одобрен"
                    />
                </ReferenceInput>
                <TextInput source="name" label="Имя клиента" validate={[required()]} fullWidth />
                <TextInput source="email" label="Email" type="email" fullWidth helperText="Если email соответствует зарегистрированному клиенту, отзыв будет автоматически одобрен" />
                <NumberInput source="rating" label="Рейтинг" min={1} max={5} validate={[required()]} fullWidth />
                <TextInput
                    source="comment"
                    label="Комментарий"
                    multiline
                    rows={6}
                    fullWidth
                />
                <FormDataConsumer>
                    {({ formData }) => (
                        <SelectInput
                            source="status"
                            label="Статус"
                            choices={[
                                { id: 'PENDING', name: 'На модерации' },
                                { id: 'APPROVED', name: 'Одобрен' },
                                { id: 'REJECTED', name: 'Отклонен' },
                            ]}
                            defaultValue={formData?.customerId ? 'APPROVED' : 'PENDING'}
                            validate={[required()]}
                            fullWidth
                            helperText={formData?.customerId ? "Статус автоматически установлен в 'Одобрен' для зарегистрированных клиентов" : "Для зарегистрированных клиентов статус автоматически устанавливается в 'Одобрен'"}
                        />
                    )}
                </FormDataConsumer>
            </SimpleForm>
        </Create>
    );
};

export const ReviewShow = () => {
    const record = useRecordContext();
    
    return (
        <Show title="Просмотр отзыва">
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Информация о клиенте
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">Имя</Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                            {record?.name || 'Не указано'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">Email</Typography>
                                        <Typography variant="body1">
                                            {record?.email || 'Не указан'}
                                        </Typography>
                                    </Grid>
                                    {record?.customer && (
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">Клиент</Typography>
                                            <Typography variant="body1">
                                                {record.customer.name} ({record.customer.email})
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Информация о товаре
                                </Typography>
                                {record?.product ? (
                                    <Box>
                                        <ReferenceField source="productId" reference="products">
                                            <TextField source="title" />
                                        </ReferenceField>
                                        {record.product.images && record.product.images.length > 0 && (
                                            <Box sx={{ mt: 2 }}>
                                                <img 
                                                    src={record.product.images[0]} 
                                                    alt={record.product.title}
                                                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px' }}
                                                />
                                            </Box>
                                        )}
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">Товар не найден</Typography>
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Комментарий
                                </Typography>
                                <Card variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {record?.comment || 'Комментарий отсутствует'}
                                    </Typography>
                                </Card>
                            </Box>

                            {record?.adminMessage && (
                                <>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ mb: 3 }}>
                                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                            Сообщение администратора
                                        </Typography>
                                        <Card variant="outlined" sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
                                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                                {record.adminMessage}
                                            </Typography>
                                        </Card>
                                    </Box>
                                </>
                            )}
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card variant="outlined" sx={{ position: 'sticky', top: 20 }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                        Детали отзыва
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">Рейтинг</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <RatingField record={record} />
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">Статус</Typography>
                                        <Box sx={{ mt: 1 }}>
                                            <StatusField />
                                        </Box>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" color="text.secondary">Дата создания</Typography>
                                        <Typography variant="body2">
                                            {record?.createdAt ? new Date(record.createdAt).toLocaleString('ru-RU') : '-'}
                                        </Typography>
                                    </Box>

                                    {record?.moderatedAt && (
                                        <Box sx={{ mb: 2 }}>
                                            <Typography variant="caption" color="text.secondary">Дата модерации</Typography>
                                            <Typography variant="body2">
                                                {new Date(record.moderatedAt).toLocaleString('ru-RU')}
                                            </Typography>
                                        </Box>
                                    )}

                                    {record?.moderator && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Модератор</Typography>
                                                <Typography variant="body2">
                                                    {record.moderator.fullName || record.moderator.username}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Show>
    );
};