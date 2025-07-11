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
    BooleanInput
} from 'react-admin';

export const ProductList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="brand" />
            <TextField source="title" />
            <NumberField source="price" />
            <NumberField source="oldPrice" />
            <NumberField source="discount" />
            <ImageField source="image" />
            <ReferenceField source="categoryId" reference="categories">
                <TextField source="name" />
            </ReferenceField>
            <BooleanField source="isActive" />
            <EditButton />
        </Datagrid>
    </List>
);

const ProductTitle = () => {
    return <span>Product</span>;
};

export const ProductEdit = () => (
    <Edit title={<ProductTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="brand" />
            <TextInput source="title" validate={[required()]} />
            <NumberInput source="price" validate={[required()]} />
            <NumberInput source="oldPrice" />
            <NumberInput source="discount" />
            <TextInput source="sku" />
            <TextInput multiline source="description" />
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>

            <BooleanInput source="isActive" />
            <BooleanInput source="inStock" />
            <NumberInput source="stockQuantity" />

            <ImageInput source="image" accept="image/*">
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
            <NumberInput source="oldPrice" />
            <TextInput source="brand" />
            <TextInput source="sku" />
            <TextInput multiline source="description" />
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>

            <BooleanInput source="isActive" defaultValue={true} />
            <BooleanInput source="inStock" defaultValue={true} />
            <NumberInput source="stockQuantity" defaultValue={0} />

            <ImageInput source="images" accept="image/*" multiple>
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
            <TextField source="sku" />
            <ReferenceField source="categoryId" reference="categories">
                <TextField source="name" />
            </ReferenceField>

            <BooleanField source="isActive" />
            <BooleanField source="inStock" />
            <NumberField source="stockQuantity" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);