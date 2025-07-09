import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    DateField,
    BooleanField,
    EditButton,
    DeleteButton,
    Edit,
    SimpleForm,
    TextInput,
    BooleanInput,
    Create,
    ImageField,
    ImageInput
} from 'react-admin';

export const BannerList = () => (
    <List>
        <Datagrid>
            <TextField source="id" />
            <TextField source="title" />
            <ImageField source="image" />
            <BooleanField source="active" />
            <DateField source="createdAt" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const BannerEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="description" multiline />
            <ImageInput source="image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <TextInput source="link" />
            <BooleanInput source="active" />
        </SimpleForm>
    </Edit>
);

export const BannerCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="description" multiline />
            <ImageInput source="image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
            <TextInput source="link" />
            <BooleanInput source="active" defaultValue={true} />
        </SimpleForm>
    </Create>
);