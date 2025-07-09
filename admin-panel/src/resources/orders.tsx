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
    required,
    NumberInput,
    BooleanField,
    BooleanInput, Show, SimpleShowLayout
} from 'react-admin';

// Компонент для отображения статуса заказа
const StatusField = ({ record }: any) => {
    const status = record?.status || 'new';
    const statusColors = {
        'new': '#f59e0b',
        'processing': '#3b82f6',
        'shipped': '#8b5cf6',
        'delivered': '#10b981',
        'cancelled': '#ef4444'
    };

    const statusLabels = {
        'new': 'Новый',
        'processing': 'Обрабатывается',
        'shipped': 'Отправлен',
        'delivered': 'Доставлен',
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

// Компонент для отображения суммы с валютой
const TotalField = ({ record }: any) => {
    return <span>{record?.total} {record?.currency || 'грн'}</span>;
};

export const OrderList = () => (
    <List title="Заказы" perPage={25}>
        <Datagrid rowClick="edit">
            <NumberField source="orderNumber" label="№ заказа" />
            <DateField source="date" label="Дата создания" showTime />
            <TextField source="customer.name" label="Клиент" />
            <TextField source="customer.phone" label="Телефон" />
            <StatusField source="status" label="Статус" />
            <TextField source="paymentMethod" label="Способ оплаты" />
            <TotalField source="total" label="Сумма" />
            <BooleanField source="processing" label="Начать обработку" />
        </Datagrid>
    </List>
);

export const OrderEdit = () => (
    <Edit title="Редактировать заказ">
        <SimpleForm>
            <NumberInput disabled source="orderNumber" label="Номер заказа" />
            <DateInput source="date" label="Дата заказа" validate={[required()]} />

            {/* Информация о клиенте */}
            <TextInput source="customer.name" label="Имя клиента" validate={[required()]} />
            <TextInput source="customer.phone" label="Телефон" validate={[required()]} />
            <TextInput source="customer.email" label="Email" />

            {/* Статус заказа */}
            <SelectInput
                source="status"
                label="Статус заказа"
                choices={[
                    { id: 'new', name: 'Новый' },
                    { id: 'processing', name: 'Обрабатывается' },
                    { id: 'shipped', name: 'Отправлен' },
                    { id: 'delivered', name: 'Доставлен' },
                    { id: 'cancelled', name: 'Отменен' },
                ]}
                validate={[required()]}
            />

            {/* Способ оплаты */}
            <SelectInput
                source="paymentMethod"
                label="Способ оплаты"
                choices={[
                    { id: 'monobank', name: 'Monobank' },
                    { id: 'privat24', name: 'Приват24' },
                    { id: 'cash', name: 'Наличными' },
                    { id: 'card', name: 'Картой при получении' },
                ]}
            />

            {/* Доставка */}
            <TextInput source="deliveryMethod" label="Способ доставки" />
            <TextInput
                source="deliveryAddress"
                label="Адрес доставки"
                multiline
                rows={3}
            />

            {/* Товары в заказе */}
            <ArrayInput source="items" label="Товары">
                <SimpleFormIterator>
                    <TextInput source="product.name" label="Название товара" />
                    <NumberInput source="quantity" label="Количество" min={1} />
                    <NumberInput source="price" label="Цена" />
                </SimpleFormIterator>
            </ArrayInput>

            {/* Сумма заказа */}
            <NumberInput source="total" label="Общая сумма" />
            <TextInput source="currency" label="Валюта" defaultValue="грн" />

            {/* Примечания */}
            <TextInput
                source="notes"
                label="Примечания"
                multiline
                rows={3}
            />

            {/* Флаг обработки */}
            <BooleanInput source="processing" label="Начать обработку" />
        </SimpleForm>
    </Edit>
);

export const OrderShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="customerName" />
            <TextField source="status" />
            <TextField source="total" />
            <DateField source="createdAt" />
        </SimpleShowLayout>
    </Show>
);