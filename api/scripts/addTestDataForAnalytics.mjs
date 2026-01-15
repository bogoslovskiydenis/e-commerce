import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function addTestDataForAnalytics() {
    console.log('📊 Добавление тестовых данных для аналитики...');

    try {
        // Получаем или создаем клиентов
        let customers = await prisma.customer.findMany({ take: 5 });
        
        if (customers.length < 3) {
            console.log('👥 Создание тестовых клиентов...');
            const newCustomers = await Promise.all([
                prisma.customer.create({
                    data: {
                        name: 'Олег Топ-Клиент',
                        email: 'top1@example.com',
                        phone: '+380501111111',
                        address: 'ул. Топовая, 1, Киев',
                        isActive: true
                    }
                }),
                prisma.customer.create({
                    data: {
                        name: 'Анна Покупатель',
                        email: 'top2@example.com',
                        phone: '+380502222222',
                        address: 'ул. Покупательская, 2, Львов',
                        isActive: true
                    }
                }),
                prisma.customer.create({
                    data: {
                        name: 'Дмитрий Постоянный',
                        email: 'top3@example.com',
                        phone: '+380503333333',
                        address: 'пр. Постоянный, 3, Одесса',
                        isActive: true
                    }
                })
            ]);
            customers = [...customers, ...newCustomers];
            console.log(`✅ Создано ${newCustomers.length} новых клиентов`);
        }

        // Получаем товары
        const products = await prisma.product.findMany({ take: 10 });
        if (products.length === 0) {
            console.log('⚠️ Товары не найдены. Сначала создайте товары.');
            return;
        }

        // Помечаем несколько товаров как популярные
        const popularProducts = products.slice(0, Math.min(3, products.length));
        for (const product of popularProducts) {
            await prisma.product.update({
                where: { id: product.id },
                data: { popular: true }
            });
        }
        console.log(`✅ Помечено ${popularProducts.length} товаров как популярные`);

        // Создаем заказы со статусом DELIVERED за последний месяц
        const now = new Date();
        const orders = [];
        
        for (let i = 0; i < 15; i++) {
            const customer = customers[i % customers.length];
            const orderNumber = `ORD-${String(Date.now() + i).slice(-8)}`;
            
            // Создаем заказы за последние 30 дней
            const daysAgo = Math.floor(Math.random() * 30);
            const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
            
            // Выбираем случайные товары
            const orderProducts = products.slice(0, Math.min(1 + Math.floor(Math.random() * 4), products.length));
            const items = orderProducts.map((product) => {
                const quantity = 1 + Math.floor(Math.random() * 5);
                const price = Number(product.price);
                return {
                    productId: product.id,
                    quantity,
                    price,
                    total: price * quantity
                };
            });
            
            const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
            const discountAmount = Math.random() > 0.7 ? totalAmount * 0.1 : 0;
            const shippingAmount = totalAmount < 1000 ? 150 : 0;
            
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    customerId: customer.id,
                    status: OrderStatus.DELIVERED,
                    paymentStatus: PaymentStatus.PAID,
                    paymentMethod: ['monobank', 'privat24', 'cash'][Math.floor(Math.random() * 3)],
                    totalAmount: totalAmount - discountAmount + shippingAmount,
                    discountAmount,
                    shippingAmount,
                    shippingAddress: {
                        city: customer.address?.split(',')[1]?.trim() || 'Киев',
                        street: customer.address || 'ул. Неизвестная',
                        apartment: `${10 + i}`
                    },
                    source: 'website',
                    createdAt,
                    items: {
                        create: items
                    }
                }
            });
            orders.push(order);
        }
        
        console.log(`✅ Создано ${orders.length} доставленных заказов`);
        console.log('\n📊 Тестовые данные готовы!');
        console.log('Теперь в аналитике должны отображаться:');
        console.log('- Популярные товары (с флагом popular)');
        console.log('- Топ клиенты (с доставленными заказами)');
        
    } catch (error) {
        console.error('❌ Ошибка при добавлении тестовых данных:', error);
        throw error;
    }
}

addTestDataForAnalytics()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
