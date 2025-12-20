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
                                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAyMEMyNi4zODA3IDIwIDI3LjUgMjEuMTE5MyAyNy41IDIyLjVDMjcuNSAyMy44ODA3IDI2LjM4MDcgMjUgMjUgMjVDMjMuNjE5MyAyNSAyMi41IDIzLjg4MDcgMjIuNSAyMi41QzIyLjUgMjEuMTE5MyAyMy42MTkzIDIwIDI1IDIwWiIgZmlsbD0iIzk5OTk5OSIvPgo8cGF0aCBkPSJNMTUgMzVMMjAgMzBMMjUgMzVMMzAgMjVMMzUgMzVIMTVaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';
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

            <EditButton />
        </Datagrid>
    </List>
);

const ProductTitle = () => {
    const record = useRecordContext();
    return record ? <span>Товар: {record.title}</span> : <span>Продукт</span>;
};

// ✅ ИСПРАВЛЕННАЯ форма редактирования
export const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />

            <TextInput
                source="sku"
                label="Артикул (SKU)"
                helperText="Уникальный код товара"
                style={{ fontFamily: 'monospace' }}
            />

            <TextInput source="title" validate={[required()]} />
            <TextInput source="brand" />

            <NumberInput source="price" validate={[required()]} label="Цена (₴)" />
            <NumberInput source="oldPrice" label="Старая цена (₴)" />
            <NumberInput source="discount" label="Скидка %" min={0} max={100} />

            <TextInput multiline source="description" />

            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>

            <BooleanInput source="isActive" />
            <BooleanInput source="inStock" />
            <NumberInput source="stockQuantity" />

            <ImageInput
                source="image"
                label="Изображение товара"
                accept="image/*"
                placeholder={<p>Перетащите изображение сюда или нажмите для выбора</p>}
            >
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

// ✅ ИСПРАВЛЕННАЯ форма создания
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />

            <TextInput
                source="sku"
                label="Артикул (SKU)"
                helperText="Оставьте пустым для автогенерации из названия товара"
                placeholder="Например: BALLOON-RED-001"
                style={{ fontFamily: 'monospace' }}
            />

            <TextInput source="brand" />

            <NumberInput source="price" validate={[required()]} label="Цена (₴)" />
            <NumberInput source="oldPrice" label="Старая цена (₴)" />
            <NumberInput source="discount" label="Скидка %" min={0} max={100} />

            <TextInput multiline source="description" />

            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>

            <BooleanInput source="isActive" defaultValue={true} />
            <BooleanInput source="inStock" defaultValue={true} />
            <NumberInput source="stockQuantity" defaultValue={0} />

            <ImageInput
                source="image"
                label="Изображение товара"
                accept="image/*"
                placeholder={<p>Перетащите изображение сюда или нажмите для выбора</p>}
            >
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);

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
                                    (e.target as HTMLImageElement).style.display = 'none';
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