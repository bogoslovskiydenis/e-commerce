// scripts/seedCustomers.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testCustomers = [
    {
        name: 'Иван Петров',
        email: 'ivan.petrov@example.com',
        phone: '+380501234567',
        address: 'г. Киев, ул. Хрещатик, 1',
        notes: 'Постоянный клиент. Предпочитает фольгированные шары.',
        tags: ['постоянный', 'vip'],
        metadata: {
            totalOrders: 5,
            totalSpent: 4500,
            lastOrderDate: '2024-12-15',
            preferences: ['фольга', 'день рождения']
        }
    },
    {
        name: 'Мария Сидорова',
        email: 'maria.sidorova@example.com',
        phone: '+380671234568',
        address: 'г. Львов, пр. Свободы, 15',
        notes: 'Заказывает шары для детских праздников.',
        tags: ['дети', 'праздники'],
        metadata: {
            totalOrders: 3,
            totalSpent: 2100,
            lastOrderDate: '2024-12-10',
            preferences: ['детские', 'тематические']
        }
    },
    {
        name: 'Алексей Козлов',
        email: 'alexey.kozlov@example.com',
        phone: '+380931234569',
        address: 'г. Одесса, ул. Дерибасовская, 5',
        notes: 'Корпоративный клиент. Заказывает для мероприятий.',
        tags: ['корпоративный', 'опт'],
        metadata: {
            totalOrders: 12,
            totalSpent: 15000,
            lastOrderDate: '2024-12-18',
            preferences: ['корпоратив', 'опт']
        }
    },
    {
        name: 'Ольга Волкова',
        email: 'olga.volkova@example.com',
        phone: '+380501234570',
        address: 'г. Харьков, пр. Науки, 20',
        notes: 'Любит романтические композиции.',
        tags: ['романтика', 'свадьба'],
        metadata: {
            totalOrders: 4,
            totalSpent: 3200,
            lastOrderDate: '2024-12-12',
            preferences: ['романтика', 'сердца']
        }
    },
    {
        name: 'Дмитрий Новиков',
        email: 'dmitry.novikov@example.com',
        phone: '+380671234571',
        address: 'г. Днепр, ул. Европейская, 8',
        notes: 'Новый клиент. Интересуется выписками из роддома.',
        tags: ['новый', 'выписка'],
        metadata: {
            totalOrders: 1,
            totalSpent: 850,
            lastOrderDate: '2024-12-20',
            preferences: ['выписка', 'новорожденные']
        }
    },
    {
        name: 'Елена Соколова',
        email: 'elena.sokolova@example.com',
        phone: '+380931234572',
        address: 'г. Запорожье, пр. Ленина, 100',
        notes: 'Организует детские праздники. Частый заказчик.',
        tags: ['дети', 'часто'],
        metadata: {
            totalOrders: 8,
            totalSpent: 6400,
            lastOrderDate: '2024-12-17',
            preferences: ['детские', 'тематические', 'персонажи']
        }
    },
    {
        name: 'Сергей Лебедев',
        email: 'sergey.lebedev@example.com',
        phone: '+380501234573',
        address: 'г. Винница, ул. Соборная, 25',
        notes: 'Заказывает шары на юбилеи.',
        tags: ['юбилей', 'праздник'],
        metadata: {
            totalOrders: 2,
            totalSpent: 1800,
            lastOrderDate: '2024-11-25',
            preferences: ['юбилей', 'цифры']
        }
    },
    {
        name: 'Татьяна Орлова',
        email: 'tatiana.orlova@example.com',
        phone: '+380671234574',
        address: 'г. Полтава, ул. Европейская, 12',
        notes: 'VIP клиент. Высокие требования к качеству.',
        tags: ['vip', 'качество'],
        metadata: {
            totalOrders: 15,
            totalSpent: 25000,
            lastOrderDate: '2024-12-19',
            preferences: ['премиум', 'эксклюзив']
        }
    },
    {
        name: 'Андрей Морозов',
        email: 'andrey.morozov@example.com',
        phone: '+380931234575',
        address: 'г. Чернигов, пр. Мира, 45',
        notes: 'Заказывает для свадебных торжеств.',
        tags: ['свадьба', 'торжество'],
        metadata: {
            totalOrders: 6,
            totalSpent: 7200,
            lastOrderDate: '2024-12-14',
            preferences: ['свадьба', 'элегантность']
        }
    },
    {
        name: 'Наталья Федорова',
        email: 'natalya.fedorova@example.com',
        phone: '+380501234576',
        address: 'г. Сумы, ул. Соборная, 30',
        notes: 'Любит яркие цвета и необычные композиции.',
        tags: ['яркие', 'креатив'],
        metadata: {
            totalOrders: 3,
            totalSpent: 2400,
            lastOrderDate: '2024-12-08',
            preferences: ['яркие цвета', 'необычные формы']
        }
    },
    {
        name: 'Виктор Григорьев',
        email: 'viktor.grigoriev@example.com',
        phone: '+380671234577',
        address: 'г. Николаев, ул. Советская, 18',
        notes: 'Корпоративный клиент. Заказывает для офисных мероприятий.',
        tags: ['корпоративный', 'офис'],
        metadata: {
            totalOrders: 7,
            totalSpent: 5600,
            lastOrderDate: '2024-12-16',
            preferences: ['корпоратив', 'деловой стиль']
        }
    },
    {
        name: 'Юлия Белова',
        email: 'yulia.belova@example.com',
        phone: '+380931234578',
        address: 'г. Хмельницкий, пр. Мира, 22',
        notes: 'Новый клиент. Интересуется доставкой.',
        tags: ['новый', 'доставка'],
        metadata: {
            totalOrders: 1,
            totalSpent: 650,
            lastOrderDate: '2024-12-21',
            preferences: ['доставка', 'быстро']
        }
    },
    {
        name: 'Павел Смирнов',
        email: 'pavel.smirnov@example.com',
        phone: '+380501234579',
        address: 'г. Житомир, ул. Киевская, 7',
        notes: 'Заказывает шары на дни рождения детей.',
        tags: ['дети', 'день рождения'],
        metadata: {
            totalOrders: 4,
            totalSpent: 2800,
            lastOrderDate: '2024-12-11',
            preferences: ['день рождения', 'детские темы']
        }
    },
    {
        name: 'Анна Кузнецова',
        email: 'anna.kuznetsova@example.com',
        phone: '+380671234580',
        address: 'г. Ровно, ул. Грушевского, 14',
        notes: 'Постоянный клиент. Всегда довольна качеством.',
        tags: ['постоянный', 'довольный'],
        metadata: {
            totalOrders: 9,
            totalSpent: 7200,
            lastOrderDate: '2024-12-13',
            preferences: ['качество', 'надежность']
        }
    },
    {
        name: 'Максим Попов',
        email: 'maxim.popov@example.com',
        phone: '+380931234581',
        address: 'г. Тернополь, пр. Степана Бандеры, 10',
        notes: 'Заказывает для выпускных вечеров.',
        tags: ['выпускной', 'школа'],
        metadata: {
            totalOrders: 2,
            totalSpent: 1600,
            lastOrderDate: '2024-11-30',
            preferences: ['выпускной', 'академический стиль']
        }
    }
];

async function seedCustomers() {
    console.log('🌱 Создание тестовых клиентов...');

    try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const customerData of testCustomers) {
            try {
                // Проверяем, существует ли клиент с таким телефоном или email
                const existingCustomer = await prisma.customer.findFirst({
                    where: {
                        OR: [
                            { phone: customerData.phone },
                            ...(customerData.email ? [{ email: customerData.email }] : [])
                        ]
                    }
                });

                if (existingCustomer) {
                    console.log(`⚠️  Клиент уже существует: ${customerData.name} (${customerData.phone})`);
                    skippedCount++;
                    continue;
                }

                // Создаем клиента
                const customer = await prisma.customer.create({
                    data: {
                        name: customerData.name,
                        email: customerData.email,
                        phone: customerData.phone,
                        address: customerData.address,
                        notes: customerData.notes,
                        tags: customerData.tags,
                        metadata: customerData.metadata,
                        isActive: true
                    }
                });

                console.log(`✅ Создан клиент: ${customerData.name} (${customerData.phone})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Ошибка создания клиента ${customerData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание клиентов завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}`);

    } catch (error) {
        console.error('❌ Ошибка при создании клиентов:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedCustomers();

