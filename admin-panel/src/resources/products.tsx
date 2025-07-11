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
    useRecordContext
} from 'react-admin';

// Кастомный компонент для отображения изображения в списке
const ProductImageField = () => {
    const record = useRecordContext();

    if (!record || !record.images || !Array.isArray(record.images) || record.images.length === 0) {
        return <span>Нет изображения</span>;
    }

    const imageUrl = record.images[0].startsWith('http')
        ? record.images[0]
        : `http://localhost:3001${record.images[0]}`;

    return (
        <img
            src={imageUrl}
            alt={record.title || 'Product'}
            style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
    );
};

interface DiscountFieldProps {
    source?: string;
}

const DiscountField = ({ source = 'discount' }: DiscountFieldProps) => {
    const record = useRecordContext();

    if (!record || !record[source]) {
        return <span><strong></strong> -</span>;
    }

    return (
        <span>
            <strong>Скидка %:</strong>
            <span style={{ color: '#d32f2f', fontWeight: 'bold', marginLeft: '4px' }}>
                -{record[source]}%
            </span>
        </span>
    );


    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '14px' }}>🏷️</span>
            <strong></strong>
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
        </div>
    );
};

export const ProductList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <ProductImageField />
            <TextField source="brand" />
            <TextField source="title" />
            <NumberField source="price" />
            <NumberField source="oldPrice" />
            <DiscountField source="discount" />
            <ReferenceField source="categoryId" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <BooleanField source="isActive" />
            <BooleanField source="inStock" />
            <EditButton />
        </Datagrid>
    </List>
);

const ProductTitle = () => {
    const record = useRecordContext();
    return record ? <span>Товар: {record.title}</span> : <span>Продукт</span>;
};

export const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="brand" />
            <TextInput source="title" validate={[required()]} />
            <NumberInput source="price" validate={[required()]} />
            <NumberInput source="oldPrice" label="Старая цена" />
            <NumberInput source="discount" label="" min={0} max={100} /> {/* ✅ ДОБАВЛЕНО */}
            <TextInput source="sku" />
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

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" validate={[required()]} />
            <NumberInput source="price" validate={[required()]} />
            <NumberInput source="oldPrice" label="Старая цена" />
            <NumberInput source="discount" label="Скидка %" min={0} max={100} /> {/* ✅ ДОБАВЛЕНО */}
            <TextInput source="brand" />
            <TextInput source="sku" />
            <TextInput multiline source="description" />
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>

            <BooleanInput source="isActive" defaultValue={true} />
            <BooleanInput source="inStock" defaultValue={true} />
            <NumberInput source="stockQuantity" defaultValue={0} />

            {/* ✅ ИСПРАВЛЕННЫЙ ImageInput */}
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

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="description" />
            <NumberField source="price" />
            <NumberField source="oldPrice" />
            <NumberField source="discount" label="Скидка %" />
            <TextField source="sku" />
            <TextField source="brand" />
            <ReferenceField source="categoryId" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <BooleanField source="isActive" />
            <BooleanField source="inStock" />
            <NumberField source="stockQuantity" />
            <ProductImageField />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);