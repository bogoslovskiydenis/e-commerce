// scripts/seedAll.mjs
import { PrismaClient, BannerPosition } from '@prisma/client';
import seedProducts from './seedProducts.mjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🚀 Starting database seeding...');

    try {
        // Очищаем существующие данные (осторожно!)
        console.log('🧹 Cleaning existing data...');

        // Удаляем в правильном порядке (сначала зависимые таблицы)
        await prisma.orderItem.deleteMany();
        await prisma.orderStatusHistory.deleteMany();
        await prisma.order.deleteMany();
        await prisma.review.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.callback.deleteMany();
        await prisma.user.deleteMany();
        await prisma.banner.deleteMany();
        await prisma.page.deleteMany();
        await prisma.setting.deleteMany();

        console.log('✅ Database cleaned');

        // Запускаем сидинг товаров и категорий
        await seedProducts();

        // Создаем тестового администратора
        console.log('👤 Creating admin user...');
        const adminUser = await prisma.user.create({
            data: {
                username: 'admin',
                email: 'admin@balloonshop.com',
                passwordHash: '$2b$10$K7L/VQkgf8.3VrT0lQIeHOexNBl7OjJ8gw6rKr/hGz.kKY8sT3QXu', // password: admin123
                fullName: 'Admin User',
                role: 'SUPER_ADMIN',
                isActive: true,
                permissions: ['admin.full_access']
            }
        });
        console.log(`✅ Admin user created: ${adminUser.email}`);

        // Создаем тестового менеджера
        console.log('👤 Creating manager user...');
        const managerUser = await prisma.user.create({
            data: {
                username: 'manager',
                email: 'manager@balloonshop.com',
                passwordHash: '$2b$10$K7L/VQkgf8.3VrT0lQIeHOexNBl7OjJ8gw6rKr/hGz.kKY8sT3QXu', // password: admin123
                fullName: 'Manager User',
                role: 'MANAGER',
                isActive: true,
                permissions: ['orders.view', 'orders.edit', 'orders.create', 'customers.view', 'customers.edit']
            }
        });
        console.log(`✅ Manager user created: ${managerUser.email}`);

        // Создаем тестовые заявки на обратный звонок
        console.log('📞 Creating test callbacks...');
        const callbacks = await Promise.all([
            prisma.callback.create({
                data: {
                    name: 'Мария Иванова',
                    phone: '+380501111111',
                    email: 'maria@example.com',
                    message: 'Хочу заказать шары на день рождения ребенка',
                    status: 'NEW',
                    priority: 'MEDIUM',
                    source: 'website'
                }
            }),
            prisma.callback.create({
                data: {
                    name: 'Петр Васильев',
                    phone: '+380502222222',
                    message: 'Интересует доставка воздушных шаров на свадьбу',
                    status: 'IN_PROGRESS',
                    priority: 'HIGH',
                    managerId: managerUser.id,
                    source: 'phone'
                }
            })
        ]);
        console.log(`✅ Created ${callbacks.length} test callbacks`);

        // Создаем базовые настройки сайта
        console.log('⚙️ Creating site settings...');
        const settings = [
            {
                key: 'site_name',
                value: JSON.stringify('BalloonShop - Воздушные шары'),
                type: 'string'
            },
            {
                key: 'site_description',
                value: JSON.stringify('Лучшие воздушные шары для любого праздника'),
                type: 'string'
            },
            {
                key: 'contact_phone',
                value: JSON.stringify('+380501234567'),
                type: 'string'
            },
            {
                key: 'contact_email',
                value: JSON.stringify('info@balloonshop.com'),
                type: 'string'
            },
            {
                key: 'delivery_price',
                value: JSON.stringify(150),
                type: 'number'
            },
            {
                key: 'free_delivery_from',
                value: JSON.stringify(1000),
                type: 'number'
            },
            {
                key: 'working_hours',
                value: JSON.stringify('Пн-Вс: 9:00-20:00'),
                type: 'string'
            }
        ];

        for (const setting of settings) {
            await prisma.setting.upsert({
                where: { key: setting.key },
                update: { value: JSON.parse(setting.value), type: setting.type },
                create: {
                    key: setting.key,
                    value: JSON.parse(setting.value),
                    type: setting.type
                }
            });
        }
        console.log(`✅ Created ${settings.length} site settings`);

        // Создаем тестовые страницы (с переводами uk/ru/en)
        console.log('📄 Creating test pages...');
        const pageFields = ['title', 'titleUk', 'titleRu', 'titleEn', 'content', 'contentUk', 'contentRu', 'contentEn', 'excerpt', 'excerptUk', 'excerptRu', 'excerptEn', 'metaTitle', 'metaTitleUk', 'metaTitleRu', 'metaTitleEn', 'metaDescription', 'metaDescriptionUk', 'metaDescriptionRu', 'metaDescriptionEn', 'isActive'];
        const pages = [
            {
                slug: 'about',
                title: 'О нас',
                titleUk: 'Про нас',
                titleRu: 'О нас',
                titleEn: 'About Us',
                content: '<h2>О компании</h2><p>Мы специализируемся на создании незабываемых праздников с помощью красивых воздушных шаров.</p><h2>Наши преимущества</h2><ul><li>Широкий ассортимент</li><li>Быстрая доставка</li><li>Гарантия качества</li></ul>',
                contentUk: '<h2>Про компанію</h2><p>Ми спеціалізуємося на створенні незабутніх свят за допомогою красивих повітряних кульок.</p><h2>Наші переваги</h2><ul><li>Широкий асортимент</li><li>Швидка доставка</li><li>Гарантія якості</li></ul>',
                contentRu: '<h2>О компании</h2><p>Мы специализируемся на создании незабываемых праздников с помощью красивых воздушных шаров.</p><h2>Наши преимущества</h2><ul><li>Широкий ассортимент</li><li>Быстрая доставка</li><li>Гарантия качества</li></ul>',
                contentEn: '<h2>About the company</h2><p>We specialize in creating unforgettable celebrations with beautiful balloons.</p><h2>Our advantages</h2><ul><li>Wide range</li><li>Fast delivery</li><li>Quality guarantee</li></ul>',
                excerpt: 'Информация о нашей компании',
                excerptUk: 'Інформація про нашу компанію',
                excerptRu: 'Информация о нашей компании',
                excerptEn: 'Information about our company',
                metaTitle: 'О нас - BalloonShop',
                metaTitleUk: 'Про нас - BalloonShop',
                metaTitleRu: 'О нас - BalloonShop',
                metaTitleEn: 'About Us - BalloonShop',
                metaDescription: 'Узнайте больше о компании BalloonShop и наших услугах',
                metaDescriptionUk: 'Дізнайтесь більше про компанію BalloonShop та наші послуги',
                metaDescriptionRu: 'Узнайте больше о компании BalloonShop и наших услугах',
                metaDescriptionEn: 'Learn more about BalloonShop and our services',
                isActive: true
            },
            {
                slug: 'delivery',
                title: 'Доставка и оплата',
                titleUk: 'Доставка та оплата',
                titleRu: 'Доставка и оплата',
                titleEn: 'Delivery and Payment',
                content: '<h2>Доставка и оплата</h2><p>Информация о способах доставки и оплаты заказов.</p>',
                contentUk: '<h2>Доставка та оплата</h2><p>Інформація про способи доставки та оплати замовлень.</p>',
                contentRu: '<h2>Доставка и оплата</h2><p>Информация о способах доставки и оплаты заказов.</p>',
                contentEn: '<h2>Delivery and Payment</h2><p>Information about delivery and payment methods.</p>',
                excerpt: 'Условия доставки и оплаты',
                excerptUk: 'Умови доставки та оплати',
                excerptRu: 'Условия доставки и оплаты',
                excerptEn: 'Delivery and payment terms',
                metaTitle: 'Доставка и оплата - BalloonShop',
                metaTitleUk: 'Доставка та оплата - BalloonShop',
                metaTitleRu: 'Доставка и оплата - BalloonShop',
                metaTitleEn: 'Delivery and Payment - BalloonShop',
                metaDescription: 'Условия доставки и способы оплаты в BalloonShop',
                metaDescriptionUk: 'Умови доставки та способи оплати в BalloonShop',
                metaDescriptionRu: 'Условия доставки и способы оплаты в BalloonShop',
                metaDescriptionEn: 'Delivery and payment options at BalloonShop',
                isActive: true
            }
        ];

        for (const page of pages) {
            const updateData = pageFields.reduce((acc, k) => {
                if (page[k] !== undefined) acc[k] = page[k];
                return acc;
            }, {});
            await prisma.page.upsert({
                where: { slug: page.slug },
                update: updateData,
                create: { slug: page.slug, ...page }
            });
        }
        console.log(`✅ Created ${pages.length} test pages`);

        // Создаем тестовые баннеры
        console.log('🎨 Creating test banners...');
        const banners = [
            {
                title: 'Скидка 20% на все наборы!',
                subtitle: 'Только до конца месяца',
                description: 'Не упустите возможность купить воздушные шары со скидкой',
                image: '/images/banners/discount-banner.jpg',
                buttonText: 'Купить сейчас',
                buttonUrl: '/products',
                position: BannerPosition.MAIN,
                active: true,
                order: 1
            },
            {
                title: 'Новая коллекция 2025',
                subtitle: 'Свежие дизайны',
                description: 'Откройте для себя новые тематические наборы',
                image: '/images/banners/new-collection.jpg',
                buttonText: 'Посмотреть',
                buttonUrl: '/products?filter=new',
                position: BannerPosition.MAIN,
                active: true,
                order: 2
            }
        ];

        for (const banner of banners) {
            await prisma.banner.create({
                data: {
                    title: banner.title,
                    subtitle: banner.subtitle,
                    description: banner.description,
                    imageUrl: banner.image,
                    link: banner.buttonUrl,
                    buttonText: banner.buttonText,
                    position: banner.position,
                    isActive: banner.active,
                    sortOrder: banner.order
                }
            });
        }
        console.log(`✅ Created ${banners.length} test banners`);

        // Создаем тестовых клиентов
        console.log('👥 Creating test customers...');
        const customers = await Promise.all([
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
        console.log(`✅ Created ${customers.length} test customers`);

        // Получаем товары для создания заказов
        const products = await prisma.product.findMany({ take: 5 });
        if (products.length === 0) {
            console.log('⚠️ No products found, skipping orders creation');
        } else {
            console.log('📦 Creating test orders...');
            
            // Создаем заказы
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
                        managerId: i > 2 ? managerUser.id : null,
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
            }
            console.log(`✅ Created ${orders.length} test orders`);
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Categories: ${await prisma.category.count()}`);
        console.log(`- Products: ${await prisma.product.count()}`);
        console.log(`- Users: ${await prisma.user.count()}`);
        console.log(`- Customers: ${await prisma.customer.count()}`);
        console.log(`- Orders: ${await prisma.order.count()}`);
        console.log(`- Callbacks: ${await prisma.callback.count()}`);
        console.log(`- Settings: ${await prisma.setting.count()}`);
        console.log(`- Pages: ${await prisma.page.count()}`);
        console.log(`- Banners: ${await prisma.banner.count()}`);

        console.log('\n🔑 Test accounts:');
        console.log('Admin: admin@balloonshop.com / admin123');
        console.log('Manager: manager@balloonshop.com / admin123');
        console.log('Customer: customer1@example.com / admin123');

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

