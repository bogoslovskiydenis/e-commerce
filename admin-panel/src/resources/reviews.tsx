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
    NumberInput
} from 'react-admin';

// Компонент для отображения звездного рейтинга
const RatingField = ({ record }: any) => {
    const rating = record?.rating || 0;
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    return <span style={{ color: '#ffa500' }}>{stars}</span>;
};

// Компонент для обрезки длинного текста
const ShortTextField = ({ record, source, maxLength = 100 }: any) => {
    const text = record?.[source] || '';
    const shortText = text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    return <span title={text}>{shortText}</span>;
};

export const ReviewList = () => (
    <List title="Комментарии и отзывы" perPage={25}>
        <Datagrid rowClick="edit">
            <DateField source="date" label="Дата" showTime />
            <TextField source="customerName" label="Комментатор" />
            <ShortTextField source="comment" label="Комментарий" maxLength={80} />
            <RatingField source="rating" label="Рейтинг" />
            <TextField source="status" label="Статус" />
            <ShortTextField source="template" label="Шаблон" maxLength={50} />
        </Datagrid>
    </List>
);

export const ReviewEdit = () => (
    <Edit title="Редактировать отзыв">
        <SimpleForm>
            <TextInput disabled source="id" />
            <DateInput source="date" label="Дата" validate={[required()]} />
            <TextInput source="customerName" label="Имя клиента" validate={[required()]} />
            <TextInput source="productName" label="Товар" validate={[required()]} />
            <NumberInput source="rating" label="Рейтинг" min={1} max={5} validate={[required()]} />
            <TextInput
                source="comment"
                label="Комментарий"
                multiline
                rows={4}
                validate={[required()]}
            />
            <SelectInput
                source="status"
                label="Статус"
                choices={[
                    { id: 'pending', name: 'На модерации' },
                    { id: 'approved', name: 'Одобрен' },
                    { id: 'rejected', name: 'Отклонен' },
                ]}
                validate={[required()]}
            />
            <TextInput
                source="template"
                label="Шаблон/Категория"
                multiline
                rows={2}
            />
        </SimpleForm>
    </Edit>
);