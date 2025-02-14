import { Card, CardContent, CardHeader } from '@mui/material';
import { Title } from 'react-admin';

export const Dashboard = () => (
    <Card>
        <Title title="Welcome to the administration" />
        <CardHeader title="E-commerce Admin Panel" />
        <CardContent>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <Card>
                    <CardHeader title="Orders" />
                    <CardContent>
                        <p>Total Orders: 150</p>
                        <p>Pending: 25</p>
                        <p>Completed: 125</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Products" />
                    <CardContent>
                        <p>Total Products: 1,234</p>
                        <p>Out of Stock: 12</p>
                        <p>Low Stock: 45</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Customers" />
                    <CardContent>
                        <p>Total Customers: 5,678</p>
                        <p>New Today: 23</p>
                        <p>Active: 3,456</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader title="Revenue" />
                    <CardContent>
                        <p>Today: $1,234</p>
                        <p>This Week: $12,345</p>
                        <p>This Month: $123,456</p>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
    </Card>
);