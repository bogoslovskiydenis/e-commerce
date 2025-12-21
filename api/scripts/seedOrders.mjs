import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
    console.log('📦 Starting to seed orders...');

    try {
        // Получаем существующих клиентов или создаем новых
        let customers = await prisma.customer.findMany();
        
        if (customers.length === 0) {
            console.log('👥 Creating test customers...');
            customers = await Promise.all([
                prisma.customer.create({
                    data: {
                        name: 'Иван Петров',
                        email: 'ivan@example.com',
                        phone: '+380501234567',
                        address: 'ул. Главная, 1, Киев',
                        isActive: true
                    }
                }),
                prisma.customer.create({
                    data: {
                        name: 'Мария Сидорова',
                        email: 'maria@example.com',
                        phone: '+380502345678',
                        address: 'ул. Центральная, 15, Львов',
                        isActive: true
                    }
                }),
                prisma.customer.create({
                    data: {
                        name: 'Алексей Коваленко',
                        email: 'alex@example.com',
                        phone: '+380503456789',
                        address: 'пр. Победы, 25, Одесса',
                        isActive: true
                    }
                })
            ]);
            console.log(`✅ Created ${customers.length} customers`);
        }

        // Получаем товары
        const products = await prisma.product.findMany({ take: 5 });
        if (products.length === 0) {
            console.log('⚠️ No products found. Please seed products first.');
            return;
        }

        // Получаем менеджера
        const manager = await prisma.user.findFirst({
            where: { role: 'MANAGER' }
        });

        console.log('📦 Creating test orders...');
        
        const orders = [];
        for (let i = 0; i < 5; i++) {
            const customer = customers[i % customers.length];
            const orderNumber = `ORD-${String(Date.now() + i).slice(-8)}`;
            const statuses = ['NEW', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
            const paymentStatuses = ['PENDING', 'PAID', 'PAID', 'PAID', 'PAID'];
            const paymentMethods = ['monobank', 'privat24', 'cash', 'card', 'monobank'];
            
            // Выбираем случайные товары для заказа
            const orderProducts = products.slice(0, Math.min(2 + Math.floor(Math.random() * 3), products.length));
            const items = orderProducts.map((product) => {
                const quantity = 1 + Math.floor(Math.random() * 3);
                const price = Number(product.price);
                return {
                    productId: product.id,
                    quantity,
                    price,
                    total: price * quantity
                };
            });
            
            const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
            const discountAmount = i % 2 === 0 ? totalAmount * 0.1 : 0;
            const shippingAmount = totalAmount < 1000 ? 150 : 0;
            
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    customerId: customer.id,
                    managerId: i > 2 && manager ? manager.id : null,
                    status: statuses[i],
                    paymentStatus: paymentStatuses[i],
                    paymentMethod: paymentMethods[i],
                    totalAmount: totalAmount - discountAmount + shippingAmount,
                    discountAmount,
                    shippingAmount,
                    shippingAddress: {
                        city: customer.address?.split(',')[1]?.trim() || 'Киев',
                        street: customer.address || 'ул. Неизвестная',
                        apartment: `${10 + i}`
                    },
                    notes: i === 0 ? 'Срочная доставка' : null,
                    source: 'website',
                    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
                    items: {
                        create: items
                    }
                },
                include: {
                    items: true,
                    customer: true
                }
            });
            orders.push(order);
            console.log(`✅ Created order ${order.orderNumber} for ${customer.name}`);
        }
        
        console.log(`✅ Created ${orders.length} orders successfully!`);
        
    } catch (error) {
        console.error('❌ Error seeding orders:', error);
        throw error;
    }
}

seedOrders()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

