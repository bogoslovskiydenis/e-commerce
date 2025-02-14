import { Admin, Resource } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { Dashboard } from './pages/Dashboard';
import { ProductList, ProductEdit, ProductCreate } from './resources/products';
import { OrderList, OrderEdit } from './resources/orders';
import { CategoryList, CategoryEdit, CategoryCreate } from './resources/categories';
import { CustomerList, CustomerEdit } from './resources/customers';

// Временный провайдер данных (замените на свой API endpoint)
const dataProvider = jsonServerProvider('http://localhost:3000/api');

const App = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource
            name="products"
            list={ProductList}
            edit={ProductEdit}
            create={ProductCreate}
        />
        <Resource
            name="orders"
            list={OrderList}
            edit={OrderEdit}
        />
        <Resource
            name="categories"
            list={CategoryList}
            edit={CategoryEdit}
            create={CategoryCreate}
        />
        <Resource
            name="customers"
            list={CustomerList}
            edit={CustomerEdit}
        />
    </Admin>
);

export default App;