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
    SimpleShowLayout, DateField,

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
            <TextField source="category" />
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
            <TextInput source="brand" validate={[required()]} />
            <TextInput source="title" validate={[required()]} />
            <NumberInput source="price" validate={[required()]} />
            <NumberInput source="oldPrice" />
            <NumberInput source="discount" />
            <TextInput source="category" validate={[required()]} />
            <ImageInput source="image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="brand" validate={[required()]} />
            <TextInput source="title" validate={[required()]} />
            <NumberInput source="price" validate={[required()]} />
            <NumberInput source="oldPrice" />
            <NumberInput source="discount" />
            <TextInput source="category" validate={[required()]} />
            <ImageInput source="image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <ReferenceInput source="categoryId" reference="categories">
                <SelectInput optionText="name" validate={[required()]} />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);

export const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="price" />
            <TextField source="category" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);