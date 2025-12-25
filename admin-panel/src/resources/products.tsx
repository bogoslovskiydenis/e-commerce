import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    Create,
    ImageField,
    ImageInput,
    required,
    ReferenceInput,
    SelectInput,
    Show,
    SimpleShowLayout,
    DateField,
    ReferenceField,
    BooleanField,
    BooleanInput,
    useRecordContext,
    Filter,
    SearchInput,
    TopToolbar,
    CreateButton,
    ExportButton,
    FunctionField
} from 'react-admin';
import { Box, Typography, Card, CardContent, Tabs, Tab, Grid } from '@mui/material';
import { Info, AttachMoney, Description, Image as ImageIcon, Inventory, Settings } from '@mui/icons-material';
import CustomPagination from '../components/CustomPagination';

// ✅ ИСПРАВЛЕННЫЕ ФИЛЬТРЫ
const ProductFilter = () => (
    <Filter>
        <SearchInput
            source="q"
            placeholder="Поиск по названию, артикулу, бренду..."
            alwaysOn
        />
        <TextInput
            source="sku"
            label="Артикул (SKU)"
            placeholder="Введите артикул..."
        />
        <ReferenceInput source="categoryId" reference="categories">
            <SelectInput optionText="name" label="Категория" />
        </ReferenceInput>
        <TextInput source="brand" label="Бренд" />
        <BooleanInput source="isActive" label="Только активные" />
        <BooleanInput source="inStock" label="Только в наличии" />
    </Filter>
);

// ✅ ИСПРАВЛЕННЫЙ список товаров с правильными типами
export const ProductList = () => (
    <List
        filters={<ProductFilter />}
        actions={
            <TopToolbar>
                <CreateButton />
                <ExportButton />
            </TopToolbar>
        }
        perPage={10}
        sort={{ field: 'createdAt', order: 'DESC' }}
        pagination={<CustomPagination />}
    >
        <Datagrid rowClick="edit" bulkActionButtons={false}>
            {/* ✅ SKU с правильным типом */}
            <FunctionField
                source="sku"
                label="Артикул"
                render={(record: any) => record?.sku ? (
                    <span style={{
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}>
                        {record.sku}
                    </span>
                ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>Не указан</span>
                )}
            />

            {/* ✅ Изображение с показом пути */}
            <FunctionField
                source="images"
                label="Фото"
                render={(record: any) => {
                    if (!record?.images || !Array.isArray(record.images) || record.images.length === 0) {
                        return <span style={{ color: '#999' }}>Нет изображения</span>;
                    }

                    const imagePath = record.images[0];
                    const imageUrl = imagePath.startsWith('http')
                        ? imagePath
                        : `http://localhost:3001${imagePath}`;

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <img
                                src={imageUrl}
                                alt={record.title || 'Product'}
                                style={{
                                    width: 50,
                                    height: 50,
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                    border: '1px solid #ddd'
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target) {
                                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMjEuMTE5MyAyNy41IDIyLjVDMjcuNSAyMy44ODA3IDI2LjM4MDcgMjUgMjUgMjVDMjMuNjE5MyAyNSAyMi41IDIzLjg4MDcgMjIuNSAyMi41QzIyLjUgMjEuMTE5MyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTUgMzVMMjAgMzBMMjUgMzVMMzAgMjVMMzUgMzVIMTVaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';
                                    }
                                }}
                            />
                            <span style={{
                                fontSize: '10px',
                                color: '#666',
                                fontFamily: 'monospace',
                                wordBreak: 'break-all',
                                maxWidth: '80px',
                                textAlign: 'center'
                            }}>
                                {imagePath}
                            </span>
                        </div>
                    );
                }}
            />

            <TextField source="title" label="Название" />
            <TextField source="brand" label="Бренд" />

            {/* ✅ Цена в гривнах */}
            <NumberField
                source="price"
                label="Цена"
                options={{
                    style: 'currency',
                    currency: 'UAH',
                    minimumFractionDigits: 0
                }}
            />

            <NumberField
                source="oldPrice"
                label="Старая цена"
                options={{
                    style: 'currency',
                    currency: 'UAH',
                    minimumFractionDigits: 0
                }}
            />

            {/* ✅ Скидка с правильным типом */}
            <FunctionField
                source="discount"
                label="Скидка"
                render={(record: any) => record?.discount ? (
                    <span style={{
                        color: '#d32f2f',
                        fontWeight: 'bold',
                        backgroundColor: '#ffebee',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '12px'
                    }}>
                        -{record.discount}%
                    </span>
                ) : <span>—</span>}
            />

            <ReferenceField source="categoryId" reference="categories" label="Категория">
                <TextField source="name" />
            </ReferenceField>

            <BooleanField source="isActive" label="Активен" />
            <BooleanField source="inStock" label="В наличии" />
            <BooleanField source="featured" label="Хит продаж" />
            <BooleanField source="popular" label="Популярное" />

            <EditButton />
        </Datagrid>
    </List>
);

const ProductTitle = () => {
    const record = useRecordContext();
    return record ? <span>Товар: {record.title}</span> : <span>Продукт</span>;
};

// Компонент для вкладок - используем display вместо hidden, чтобы поля всегда были в DOM
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            id={`product-tabpanel-${index}`}
            aria-labelledby={`product-tab-${index}`}
            style={{ display: value !== index ? 'none' : 'block' }}
            {...other}
        >
            <Box sx={{ p: 3 }}>{children}</Box>
        </div>
    );
}

// ✅ УЛУЧШЕННАЯ форма редактирования с вкладками
export const ProductEdit = () => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Edit title={<ProductTitle />}>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="редактирование товара">
                        <Tab icon={<Info />} label="Основная информация" />
                        <Tab icon={<AttachMoney />} label="Цены и скидки" />
                        <Tab icon={<Description />} label="Описание" />
                        <Tab icon={<ImageIcon />} label="Изображения" />
                        <Tab icon={<Inventory />} label="Наличие" />
                        <Tab icon={<Settings />} label="Настройки" />
                    </Tabs>
                </Box>

                <SimpleForm>
                    {/* Основная информация */}
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Основная информация о товаре
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextInput disabled source="id" fullWidth />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="title"
                                    label="Название товара"
                                    validate={[required()]}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="sku"
                                    label="Артикул (SKU)"
                                    helperText="Уникальный код товара"
                                    fullWidth
                                    sx={{ fontFamily: 'monospace' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="brand"
                                    label="Бренд"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ReferenceInput source="categoryId" reference="categories" fullWidth>
                                    <SelectInput optionText="name" validate={[required()]} label="Категория" />
                                </ReferenceInput>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Цены и скидки */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Ценообразование
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="price"
                                    validate={[required()]}
                                    label="Цена (₴)"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="oldPrice"
                                    label="Старая цена (₴)"
                                    fullWidth
                                    helperText="Цена до скидки"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="discount"
                                    label="Скидка (%)"
                                    min={0}
                                    max={100}
                                    fullWidth
                                    helperText="Процент скидки"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Описание */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Описание товара
                        </Typography>
                        <TextInput
                            source="description"
                            label="Полное описание"
                            multiline
                            rows={12}
                            fullWidth
                            helperText="Подробное описание товара для покупателей"
                        />
                    </TabPanel>

                    {/* Изображения */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Изображения товара
                        </Typography>
                        <ImageInput
                            source="image"
                            label="Главное изображение"
                            accept="image/*"
                            placeholder={<p>Перетащите изображение сюда или нажмите для выбора</p>}
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </TabPanel>

                    {/* Наличие */}
                    <TabPanel value={tabValue} index={4}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Управление наличием
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <BooleanInput
                                    source="inStock"
                                    label="В наличии"
                                    helperText="Товар доступен для заказа"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <NumberInput
                                    source="stockQuantity"
                                    label="Количество на складе"
                                    min={0}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Настройки */}
                    <TabPanel value={tabValue} index={5}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Дополнительные настройки
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="isActive"
                                    label="Активен"
                                    helperText="Товар отображается на сайте"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="featured"
                                    label="Хит продаж"
                                    helperText="Показывать товар в разделе 'Хиты продаж' на главной странице"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="popular"
                                    label="Популярный товар"
                                    helperText="Показывать товар в разделе 'Популярные товары' на главной странице"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </SimpleForm>
            </Card>
        </Edit>
    );
};

// ✅ УЛУЧШЕННАЯ форма создания с вкладками
export const ProductCreate = () => {
    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    return (
        <Create>
            <Card>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleTabChange} aria-label="создание товара">
                        <Tab icon={<Info />} label="Основная информация" />
                        <Tab icon={<AttachMoney />} label="Цены и скидки" />
                        <Tab icon={<Description />} label="Описание" />
                        <Tab icon={<ImageIcon />} label="Изображения" />
                        <Tab icon={<Inventory />} label="Наличие" />
                        <Tab icon={<Settings />} label="Настройки" />
                    </Tabs>
                </Box>

                <SimpleForm>
                    {/* Основная информация */}
                    <TabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Основная информация о товаре
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="title"
                                    label="Название товара"
                                    validate={[required()]}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="sku"
                                    label="Артикул (SKU)"
                                    helperText="Оставьте пустым для автогенерации из названия товара"
                                    placeholder="Например: BALLOON-RED-001"
                                    fullWidth
                                    sx={{ fontFamily: 'monospace' }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextInput
                                    source="brand"
                                    label="Бренд"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ReferenceInput source="categoryId" reference="categories" fullWidth>
                                    <SelectInput optionText="name" validate={[required()]} label="Категория" />
                                </ReferenceInput>
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Цены и скидки */}
                    <TabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Ценообразование
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="price"
                                    validate={[required()]}
                                    label="Цена (₴)"
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="oldPrice"
                                    label="Старая цена (₴)"
                                    fullWidth
                                    helperText="Цена до скидки"
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <NumberInput
                                    source="discount"
                                    label="Скидка (%)"
                                    min={0}
                                    max={100}
                                    fullWidth
                                    helperText="Процент скидки"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Описание */}
                    <TabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Описание товара
                        </Typography>
                        <TextInput
                            source="description"
                            label="Полное описание"
                            multiline
                            rows={12}
                            fullWidth
                            helperText="Подробное описание товара для покупателей"
                        />
                    </TabPanel>

                    {/* Изображения */}
                    <TabPanel value={tabValue} index={3}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Изображения товара
                        </Typography>
                        <ImageInput
                            source="image"
                            label="Главное изображение"
                            accept="image/*"
                            placeholder={<p>Перетащите изображение сюда или нажмите для выбора</p>}
                        >
                            <ImageField source="src" title="title" />
                        </ImageInput>
                    </TabPanel>

                    {/* Наличие */}
                    <TabPanel value={tabValue} index={4}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Управление наличием
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <BooleanInput
                                    source="inStock"
                                    label="В наличии"
                                    defaultValue={true}
                                    helperText="Товар доступен для заказа"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <NumberInput
                                    source="stockQuantity"
                                    label="Количество на складе"
                                    min={0}
                                    defaultValue={0}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>

                    {/* Настройки */}
                    <TabPanel value={tabValue} index={5}>
                        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                            Дополнительные настройки
                        </Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="isActive"
                                    label="Активен"
                                    defaultValue={true}
                                    helperText="Товар отображается на сайте"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="featured"
                                    label="Хит продаж"
                                    defaultValue={false}
                                    helperText="Показывать товар в разделе 'Хиты продаж' на главной странице"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <BooleanInput
                                    source="popular"
                                    label="Популярный товар"
                                    defaultValue={false}
                                    helperText="Показывать товар в разделе 'Популярные товары' на главной странице"
                                />
                            </Grid>
                        </Grid>
                    </TabPanel>
                </SimpleForm>
            </Card>
        </Create>
    );
};

// ✅ ИСПРАВЛЕННАЯ страница просмотра
export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />

            {/* ✅ SKU с правильным типом */}
            <FunctionField
                source="sku"
                label="Артикул (SKU)"
                render={(record: any) => record?.sku ? (
                    <span style={{
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '1rem',
                        border: '1px solid #ddd'
                    }}>
                        {record.sku}
                    </span>
                ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>Не указан</span>
                )}
            />

            <TextField source="title" />
            <TextField source="brand" />
            <TextField source="description" />

            {/* ✅ Цены в гривнах */}
            <NumberField
                source="price"
                label="Цена"
                options={{
                    style: 'currency',
                    currency: 'UAH'
                }}
            />
            <NumberField
                source="oldPrice"
                label="Старая цена"
                options={{
                    style: 'currency',
                    currency: 'UAH'
                }}
            />
            <NumberField source="discount" label="Скидка %" />

            <ReferenceField source="categoryId" reference="categories">
                <TextField source="name" />
            </ReferenceField>

            <BooleanField source="isActive" />
            <BooleanField source="inStock" />
            <NumberField source="stockQuantity" />

            {/* ✅ Изображение с путем */}
            <FunctionField
                source="images"
                label="Изображение"
                render={(record: any) => {
                    if (!record?.images || !Array.isArray(record.images) || record.images.length === 0) {
                        return <span style={{ color: '#999' }}>Нет изображения</span>;
                    }

                    const imagePath = record.images[0];
                    const imageUrl = imagePath.startsWith('http')
                        ? imagePath
                        : `http://localhost:3001${imagePath}`;

                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <img
                                src={imageUrl}
                                alt={record.title || 'Product'}
                                style={{
                                    maxWidth: 300,
                                    maxHeight: 300,
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target && target.style) {
                                        target.style.display = 'none';
                                    }
                                }}
                            />
                            <div style={{
                                backgroundColor: '#f5f5f5',
                                padding: '8px',
                                borderRadius: '4px',
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                color: '#666',
                                wordBreak: 'break-all'
                            }}>
                                <strong>Путь:</strong> {imagePath}
                            </div>
                        </div>
                    );
                }}
            />

            <DateField source="createdAt" showTime />
            <DateField source="updatedAt" showTime />
        </SimpleShowLayout>
    </Show>
);