import jsonServerProvider from 'ra-data-json-server';

// Создаем провайдер данных для JSON Server
export const dataProvider = jsonServerProvider('http://localhost:3001/api');

// Расширяем провайдер для кастомных методов если нужно
export const customDataProvider = {
    ...dataProvider,

    // Кастомный метод для получения статистики
    getStats: async () => {
        try {
            const response = await fetch('http://localhost:3001/api/stats');
            return await response.json();
        } catch (error) {
            console.error('Error fetching stats:', error);
            return { visitors: 0, orders: 0, conversion: 0 };
        }
    },

    // Кастомный метод для обновления статуса заказа
    updateOrderStatus: async (id: string, status: string) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
};

export default customDataProvider;