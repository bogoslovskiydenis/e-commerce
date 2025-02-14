import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Edit,
    SimpleForm,
    TextInput,
    required,
    email
} from 'react-admin';

export const CustomerList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="address" />
        </Datagrid>
    </List>
);

export const CustomerEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]} />
            <TextInput source="email" validate={[required(), email()]} />
            <TextInput source="phone" />
            <TextInput multiline source="address" />
        </SimpleForm>
    </Edit>
);