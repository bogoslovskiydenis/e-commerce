import { PrismaClient, BannerPosition } from '@prisma/client';
import seedProducts from './products.seed';

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

        // Создаем тестовые страницы
        console.log('📄 Creating test pages...');
        const pages = [
            {
                slug: 'about',
                title: 'О нас',
                content: '<h1>О компании BalloonShop</h1><p>Мы специализируемся на создании незабываемых праздников с помощью красивых воздушных шаров.</p>',
                excerpt: 'Информация о нашей компании',
                metaTitle: 'О нас - BalloonShop',
                metaDescription: 'Узнайте больше о компании BalloonShop и наших услугах',
                active: true
            },
            {
                slug: 'delivery',
                title: 'Доставка и оплата',
                content: '<h1>Доставка и оплата</h1><p>Информация о способах доставки и оплаты заказов.</p>',
                excerpt: 'Условия доставки и оплаты',
                metaTitle: 'Доставка и оплата - BalloonShop',
                metaDescription: 'Условия доставки и способы оплаты в BalloonShop',
                active: true
            }
        ];

        for (const page of pages) {
            await prisma.page.upsert({
                where: { slug: page.slug },
                update: {
                    ...page,
                    isActive: page.active
                },
                create: {
                    ...page,
                    isActive: page.active
                }
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

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Categories: ${await prisma.category.count()}`);
        console.log(`- Products: ${await prisma.product.count()}`);
        console.log(`- Users: ${await prisma.user.count()}`);
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