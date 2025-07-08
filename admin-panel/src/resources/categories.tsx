import React from 'react';
import {
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    required,
    SimpleForm,
    TextField,
    TextInput
} from "react-admin";

export const CategoryList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="slug" />
            <TextField source="description" />
            <EditButton />
        </Datagrid>
    </List>
);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" validate={[required()]} />
            <TextInput source="slug" validate={[required()]} />
            <TextInput multiline source="description" />
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" validate={[required()]} />
            <TextInput source="slug" validate={[required()]} />
            <TextInput multiline source="description" />
        </SimpleForm>
    </Create>
);