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
    DateInput,
    SelectInput,
    NumberInput,
    BooleanInput,
    required,
    SearchInput,
    Filter,
    TopToolbar,
    CreateButton,
    ExportButton,
    FunctionField,
    NumberField,
    BooleanField,
    ReferenceInput,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    useRecordContext,
    Show,
    SimpleShowLayout,
    ShowButton,
    EditButton,
} from 'react-admin';
import { Box, Typography, Chip, Grid, Card, CardContent, Divider } from '@mui/material';
import { LocalOffer, Visibility, VisibilityOff, TrendingUp } from '@mui/icons-material';

// Компонент для отображения типа промокода
const TypeField = ({ record }: any) => {
    if (!record) return null;
    
    const type = record?.type || 'PERCENTAGE';
    const typeMap: Record<string, { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }> = {
        'PERCENTAGE': { label: 'Процент', color: 'primary' },
        'FIXED_AMOUNT': { label: 'Фиксированная сумма', color: 'success' },
        'FREE_SHIPPING': { label: 'Бесплатная доставка', color: 'info' },
        'BUY_ONE_GET_ONE': { label: '1+1', color: 'warning' }
    };

    const typeInfo = typeMap[type] || { label: type, color: 'default' };

    return (
        <Chip
            label={typeInfo.label}
            color={typeInfo.color}
            size="small"
            icon={<LocalOffer />}
        />
    );
};

// Компонент для отображения статуса активности
const StatusField = ({ record }: any) => {
    if (!record) return null;
    
    const now = new Date();
    const isActive = record?.isActive;
    const startDate = record?.startDate ? new Date(record.startDate) : null;
    const endDate = record?.endDate ? new Date(record.endDate) : null;
    
    let status = 'Неактивна';
    let color: 'default' | 'success' | 'error' | 'warning' = 'default';
    
    if (!isActive) {
        status = 'Неактивна';
        color = 'default';
    } else if (startDate && startDate > now) {
        status = 'Запланирована';
        color = 'info' as any;
    } else if (endDate && endDate < now) {
        status = 'Истекла';
        color = 'error';
    } else {
        status = 'Активна';
        color = 'success';
    }

    return (
        <Chip
            label={status}
            color={color}
            size="small"
            icon={isActive && color === 'success' ? <Visibility /> : <VisibilityOff />}
        />
    );
};

// Компонент для отображения значения промокода
const ValueField = ({ record }: any) => {
    if (!record) return null;
    
    const type = record?.type;
    const value = record?.value || 0;
    
    if (type === 'PERCENTAGE') {
        return <span>{value}%</span>;
    } else if (type === 'FIXED_AMOUNT') {
        return <span>{value} грн</span>;
    } else if (type === 'FREE_SHIPPING' || type === 'BUY_ONE_GET_ONE') {
        return <span>-</span>;
    }
    
    return <span>{value}</span>;
};

// Компонент для отображения использования
const UsageField = ({ record }: any) => {
    if (!record) return null;
    
    const usedCount = record?.usedCount || 0;
    const maxUsage = record?.maxUsage;
    
    if (maxUsage) {
        return (
            <Chip
                label={`${usedCount} / ${maxUsage}`}
                color={usedCount >= maxUsage ? 'error' : 'default'}
                size="small"
                icon={<TrendingUp />}
            />
        );
    }
    
    return <span>{usedCount}</span>;
};

// Фильтры
const PromotionFilter = () => (
    <Filter>
        <SearchInput source="q" placeholder="Поиск по названию, коду..." alwaysOn />
        <SelectInput
            source="type"
            label="Тип"
            choices={[
                { id: 'PERCENTAGE', name: 'Процент' },
                { id: 'FIXED_AMOUNT', name: 'Фиксированная сумма' },
                { id: 'FREE_SHIPPING', name: 'Бесплатная доставка' },
                { id: 'BUY_ONE_GET_ONE', name: '1+1' },
            ]}
            emptyText="Все типы"
        />
        <SelectInput
            source="isActive"
            label="Статус"
            choices={[
                { id: 'true', name: 'Активные' },
                { id: 'false', name: 'Неактивные' },
            ]}
            emptyText="Все статусы"
        />
    </Filter>
);

// Действия в тулбаре
const PromotionListActions = () => (
    <TopToolbar>
        <CreateButton />
        <ExportButton />
    </TopToolbar>
);

// Список промокодов
export const PromotionList = () => (
    <List
        title="Акции и промокоды"
        filters={<PromotionFilter />}
        actions={<PromotionListActions />}
        sort={{ field: 'createdAt', order: 'DESC' }}
        perPage={25}
    >
        <Datagrid rowClick="edit" sx={{ '& .RaDatagrid-headerCell': { fontWeight: 'bold' } }}>
            <TextField source="name" label="Название" />
            <TextField source="code" label="Код" />
            <TypeField label="Тип" />
            <FunctionField
                label="Значение"
                render={(record: any) => <ValueField record={record} />}
            />
            <NumberField source="minOrderAmount" label="Мин. сумма заказа" options={{ style: 'currency', currency: 'UAH' }} />
            <StatusField label="Статус" />
            <UsageField label="Использовано" />
            <DateField source="startDate" label="Начало" />
            <DateField source="endDate" label="Окончание" />
            <DateField source="createdAt" label="Создано" showTime />
            <ShowButton />
            <EditButton />
        </Datagrid>
    </List>
);

// Заголовок для формы
const PromotionTitle = () => {
    const record = useRecordContext();
    return record ? <span>Промокод: {record.name}</span> : <span>Создать промокод</span>;
};

// Форма создания/редактирования
export const PromotionEdit = () => (
    <Edit title={<PromotionTitle />}>
        <SimpleForm>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <TextInput disabled source="id" fullWidth />
                    <TextInput source="name" label="Название" fullWidth validate={[required()]} />
                    <TextInput source="code" label="Промокод (код)" fullWidth helperText="Уникальный код промокода (опционально)" />
                    <TextInput
                        source="description"
                        label="Описание"
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Параметры скидки</Typography>
                    <SelectInput
                        source="type"
                        label="Тип промокода"
                        choices={[
                            { id: 'PERCENTAGE', name: 'Процент' },
                            { id: 'FIXED_AMOUNT', name: 'Фиксированная сумма (грн)' },
                            { id: 'FREE_SHIPPING', name: 'Бесплатная доставка' },
                            { id: 'BUY_ONE_GET_ONE', name: '1+1 (Купи один - получи второй)' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <NumberInput
                        source="value"
                        label="Значение"
                        fullWidth
                        validate={[required()]}
                        helperText="Для процентов: 10 = 10%, для суммы: 100 = 100 грн"
                    />
                    <NumberInput
                        source="minOrderAmount"
                        label="Минимальная сумма заказа (грн)"
                        fullWidth
                        helperText="Минимальная сумма заказа для применения промокода"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Ограничения</Typography>
                    <NumberInput
                        source="maxUsage"
                        label="Максимальное количество использований"
                        fullWidth
                        helperText="Оставьте пустым для неограниченного использования"
                    />
                    <NumberField source="usedCount" label="Использовано раз" fullWidth disabled />
                    <DateInput source="startDate" label="Дата начала" fullWidth />
                    <DateInput source="endDate" label="Дата окончания" fullWidth />
                    <BooleanInput source="isActive" label="Активен" />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Товары</Typography>
                    <ReferenceArrayInput
                        source="productIds"
                        reference="products"
                        fullWidth
                    >
                        <AutocompleteArrayInput
                            optionText="title"
                            fullWidth
                            helperText="Оставьте пустым, чтобы промокод применялся ко всем товарам"
                        />
                    </ReferenceArrayInput>
                </Grid>
            </Grid>
        </SimpleForm>
    </Edit>
);

export const PromotionCreate = () => (
    <Create title="Создать промокод">
        <SimpleForm>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Основная информация</Typography>
                    <TextInput source="name" label="Название" fullWidth validate={[required()]} />
                    <TextInput source="code" label="Промокод (код)" fullWidth helperText="Уникальный код промокода (опционально)" />
                    <TextInput
                        source="description"
                        label="Описание"
                        fullWidth
                        multiline
                        rows={3}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Параметры скидки</Typography>
                    <SelectInput
                        source="type"
                        label="Тип промокода"
                        choices={[
                            { id: 'PERCENTAGE', name: 'Процент' },
                            { id: 'FIXED_AMOUNT', name: 'Фиксированная сумма (грн)' },
                            { id: 'FREE_SHIPPING', name: 'Бесплатная доставка' },
                            { id: 'BUY_ONE_GET_ONE', name: '1+1 (Купи один - получи второй)' },
                        ]}
                        validate={[required()]}
                        fullWidth
                    />
                    <NumberInput
                        source="value"
                        label="Значение"
                        fullWidth
                        validate={[required()]}
                        helperText="Для процентов: 10 = 10%, для суммы: 100 = 100 грн"
                    />
                    <NumberInput
                        source="minOrderAmount"
                        label="Минимальная сумма заказа (грн)"
                        fullWidth
                        helperText="Минимальная сумма заказа для применения промокода"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Ограничения</Typography>
                    <NumberInput
                        source="maxUsage"
                        label="Максимальное количество использований"
                        fullWidth
                        helperText="Оставьте пустым для неограниченного использования"
                    />
                    <DateInput source="startDate" label="Дата начала" fullWidth />
                    <DateInput source="endDate" label="Дата окончания" fullWidth />
                    <BooleanInput source="isActive" label="Активен" defaultValue={true} />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>Товары</Typography>
                    <ReferenceArrayInput
                        source="productIds"
                        reference="products"
                        fullWidth
                    >
                        <AutocompleteArrayInput
                            optionText="title"
                            fullWidth
                            helperText="Оставьте пустым, чтобы промокод применялся ко всем товарам"
                        />
                    </ReferenceArrayInput>
                </Grid>
            </Grid>
        </SimpleForm>
    </Create>
);

// Просмотр промокода
export const PromotionShow = () => {
    const record = useRecordContext();
    
    return (
        <Show title={<PromotionTitle />}>
            <SimpleShowLayout>
                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Основная информация</Typography>
                        <TextField source="id" label="ID" />
                        <TextField source="name" label="Название" />
                        <TextField source="code" label="Промокод (код)" />
                        <TextField source="description" label="Описание" />
                        <FunctionField
                            label="Тип"
                            render={(record: any) => <TypeField record={record} />}
                        />
                        <FunctionField
                            label="Значение"
                            render={(record: any) => <ValueField record={record} />}
                        />
                        <NumberField source="minOrderAmount" label="Минимальная сумма заказа" options={{ style: 'currency', currency: 'UAH' }} />
                    </CardContent>
                </Card>

                <Card sx={{ mb: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Ограничения и статус</Typography>
                        <FunctionField
                            label="Статус"
                            render={(record: any) => <StatusField record={record} />}
                        />
                        <FunctionField
                            label="Использовано"
                            render={(record: any) => <UsageField record={record} />}
                        />
                        <NumberField source="maxUsage" label="Максимальное количество использований" />
                        <DateField source="startDate" label="Дата начала" showTime />
                        <DateField source="endDate" label="Дата окончания" showTime />
                        <BooleanField source="isActive" label="Активен" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>Товары</Typography>
                        <FunctionField
                            label="Товары"
                            render={(record: any) => {
                                const products = record?.products || [];
                                if (products.length === 0) {
                                    return <Typography>Применяется ко всем товарам</Typography>;
                                }
                                return (
                                    <Box>
                                        {products.map((pp: any, index: number) => (
                                            <Chip
                                                key={pp.product?.id || index}
                                                label={pp.product?.title || 'Неизвестный товар'}
                                                sx={{ mr: 1, mb: 1 }}
                                            />
                                        ))}
                                    </Box>
                                );
                            }}
                        />
                    </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />
                <DateField source="createdAt" label="Создано" showTime />
                <DateField source="updatedAt" label="Обновлено" showTime />
            </SimpleShowLayout>
        </Show>
    );
};

