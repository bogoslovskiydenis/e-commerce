import {
    List,
    Datagrid,
    TextField,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    SelectInput,
    required,
    BooleanField,
    BooleanInput,
    UrlField
} from 'react-admin';

// Компонент для отображения статуса
const StatusField = ({ record }: any) => {
    const status = record?.status || 'new';
    const statusColors = {
        'new': '#f59e0b',
        'contacted': '#10b981',
        'completed': '#6b7280',
        'cancelled': '#ef4444'
    };

    const statusLabels = {
        'new': 'Новый',
        'contacted': 'Связались',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
    };

    return (
        <span
            style={{
                color: statusColors[status as keyof typeof statusColors],
                fontWeight: 'bold'
            }}
        >
            {statusLabels[status as keyof typeof statusLabels]}
        </span>
    );
};

export const CallbackList = () => (
    <List title="Обратный звонок" perPage={25}>
        <Datagrid rowClick="edit">
            <TextField source="name" label="Имя" />
            <TextField source="phone" label="Номер телефона" />
            <DateField source="date" label="Дата" showTime />
            <UrlField source="url" label="URL" />
            <StatusField source="status" label="Статус" />
            <BooleanField source="processed" label="Обработан" />
        </Datagrid>
    </List>
);

export const CallbackEdit = () => (
    <Edit title="Редактировать заявку">
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" label="Имя" validate={[required()]} />
            <TextInput source="phone" label="Телефон" validate={[required()]} />
            <DateInput source="date" label="Дата" validate={[required()]} />
            <TextInput source="url" label="URL страницы" />
            <SelectInput
                source="status"
                label="Статус"
                choices={[
                    { id: 'new', name: 'Новый' },
                    { id: 'contacted', name: 'Связались' },
                    { id: 'completed', name: 'Завершен' },
                    { id: 'cancelled', name: 'Отменен' },
                ]}
                validate={[required()]}
            />
            <BooleanInput source="processed" label="Обработано" />
            <TextInput
                source="notes"
                label="Примечания"
                multiline
                rows={3}
            />
        </SimpleForm>
    </Edit>
);