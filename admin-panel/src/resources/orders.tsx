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
    required, NumberInput
} from 'react-admin';

export const OrderList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="customer.name" label="Customer" />
            <DateField source="date" />
            <TextField source="status" />
            <NumberField source="total" />
        </Datagrid>
    </List>
);

export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <DateInput source="date" validate={[required()]} />
            <SelectInput
                source="status"
                choices={[
                    { id: 'pending', name: 'В обробці' },
                    { id: 'processing', name: 'Обробляється' },
                    { id: 'shipped', name: 'Відправлено' },
                    { id: 'delivered', name: 'Доставлено' },
                    { id: 'cancelled', name: 'Скасовано' },
                ]}
                validate={[required()]}
            />
            <ArrayInput source="items">
                <SimpleFormIterator>
                    <TextInput source="product.id" label="Product ID" />
                    <NumberInput source="quantity" />
                    <NumberInput source="price" />
                </SimpleFormIterator>
            </ArrayInput>
            <TextInput source="shippingAddress" multiline />
            <TextInput source="customer.name" />
            <TextInput source="customer.email" />
            <TextInput source="customer.phone" />
        </SimpleForm>
    </Edit>
);