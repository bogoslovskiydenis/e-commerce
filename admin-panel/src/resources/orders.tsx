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
    BooleanInput,
    Show,
    SimpleShowLayout,
    Filter,
    SearchInput,
    TopToolbar,
    ExportButton,
    CreateButton
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

// Фильтры для списка заказов
const OrderFilter = (props: any) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn placeholder="Поиск по номеру, клиенту, телефону" />
        <SelectInput
            source="status"
            label="Статус"
            choices={[
                { id: 'new', name: 'Новый' },
                { id: 'processing', name: 'Обрабатывается' },
                { id: 'shipped', name: 'Отправлен' },
                { id: 'delivered', name: 'Доставлен' },
                { id: 'cancelled', name: 'Отменен' },
            ]}
            alwaysOn
        />
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
        <DateInput source="date_gte" label="Дата от" />
        <DateInput source="date_lte" label="Дата до" />
    </Filter>
);

// Панель инструментов
const ListActions = () => (
    <TopToolbar>
        <ExportButton />
    </TopToolbar>
);

export const OrderList = () => (
    <List
        title="Заказы"
        perPage={25}
        filters={<OrderFilter />}
        actions={<ListActions />}
        sort={{ field: 'date', order: 'DESC' }}
    >
        <Datagrid rowClick="edit">
            <NumberField source="orderNumber" label="№ заказа" sortable />
            <DateField source="date" label="Дата создания" showTime sortable />
            <TextField source="customer.name" label="Клиент" sortable />
            <TextField source="customer.phone" label="Телефон" />
            <StatusField source="status" label="Статус" sortable />
            <TextField source="paymentMethod" label="Способ оплаты" />
            <TotalField source="total" label="Сумма" sortable />
            <BooleanField source="processing" label="Обработка" />
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
    <Show title="Просмотр заказа">
        <SimpleShowLayout>
            <NumberField source="orderNumber" label="Номер заказа" />
            <DateField source="date" label="Дата создания" showTime />
            <StatusField source="status" label="Статус" />
            
            <TextField source="customer.name" label="Имя клиента" />
            <TextField source="customer.phone" label="Телефон" />
            <TextField source="customer.email" label="Email" />
            
            <TextField source="paymentMethod" label="Способ оплаты" />
            <TextField source="deliveryMethod" label="Способ доставки" />
            <TextField source="deliveryAddress" label="Адрес доставки" />
            
            <TotalField source="total" label="Общая сумма" />
            <TextField source="currency" label="Валюта" />
            
            <TextField source="notes" label="Примечания" />
            <BooleanField source="processing" label="Обработка" />
        </SimpleShowLayout>
    </Show>
);