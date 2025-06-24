import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    BooleanField,
    Edit,
    Create,
    SimpleForm,
    TextInput,
    NumberInput,
    DateInput,
    BooleanInput,
    SelectInput,
    required
} from 'react-admin';

export const DiscountList = () => (
    <List>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="name" label="Название" />
            <TextField source="code" label="Промокод" />
            <NumberField source="value" label="Размер скидки" />
            <TextField source="type" label="Тип" />
            <DateField source="startDate" label="Дата начала" />
            <DateField source="endDate" label="Дата окончания" />
            <BooleanField source="active" label="Активна" />
        </Datagrid>
    </List>
);

export const DiscountEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="name" label="Название" validate={[required()]} />
            <TextInput source="code" label="Промокод" />
            <NumberInput source="value" label="Размер скидки" validate={[required()]} />
            <SelectInput
                source="type"
                label="Тип скидки"
                choices={[
                    { id: 'percentage', name: 'Процент' },
                    { id: 'fixed', name: 'Фиксированная сумма' },
                ]}
                validate={[required()]}
            />
            <DateInput source="startDate" label="Дата начала" />
            <DateInput source="endDate" label="Дата окончания" />
            <NumberInput source="minOrderAmount" label="Минимальная сумма заказа" />
            <NumberInput source="usageLimit" label="Лимит использований" />
            <BooleanInput source="active" label="Активна" />
            <TextInput source="description" label="Описание" multiline />
        </SimpleForm>
    </Edit>
);

export const DiscountCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" label="Название" validate={[required()]} />
            <TextInput source="code" label="Промокод" />
            <NumberInput source="value" label="Размер скидки" validate={[required()]} />
            <SelectInput
                source="type"
                label="Тип скидки"
                choices={[
                    { id: 'percentage', name: 'Процент' },
                    { id: 'fixed', name: 'Фиксированная сумма' },
                ]}
                validate={[required()]}
            />
            <DateInput source="startDate" label="Дата начала" />
            <DateInput source="endDate" label="Дата окончания" />
            <NumberInput source="minOrderAmount" label="Минимальная сумма заказа" />
            <NumberInput source="usageLimit" label="Лимит использований" />
            <BooleanInput source="active" label="Активна" defaultValue={true} />
            <TextInput source="description" label="Описание" multiline />
        </SimpleForm>
    </Create>
);