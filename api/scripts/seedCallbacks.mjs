// scripts/seedCallbacks.mjs
import { PrismaClient, CallbackStatus, CallbackPriority } from '@prisma/client';

const prisma = new PrismaClient();

const testCallbacks = [
    {
        name: 'Иван Петров',
        phone: '+380501234567',
        email: 'ivan.petrov@example.com',
        message: 'Хочу заказать набор шаров на день рождения. Нужна консультация по выбору.',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.HIGH,
        source: 'website'
    },
    {
        name: 'Мария Сидорова',
        phone: '+380671234568',
        email: 'maria.sidorova@example.com',
        message: 'Интересует доставка шаров на свадьбу. Когда можно обсудить детали?',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.MEDIUM,
        source: 'website'
    },
    {
        name: 'Алексей Козлов',
        phone: '+380931234569',
        email: null,
        message: 'Нужны шары на выписку из роддома. Срочно!',
        status: CallbackStatus.IN_PROGRESS,
        priority: CallbackPriority.URGENT,
        source: 'phone',
        notes: 'Клиент просит перезвонить сегодня до 18:00'
    },
    {
        name: 'Ольга Волкова',
        phone: '+380501234570',
        email: 'olga.volkova@example.com',
        message: 'Хочу узнать о скидках на оптовые заказы.',
        status: CallbackStatus.COMPLETED,
        priority: CallbackPriority.LOW,
        source: 'website',
        notes: 'Отправлен прайс-лист на email. Клиент заинтересован.'
    },
    {
        name: 'Дмитрий Новиков',
        phone: '+380671234571',
        email: 'dmitry.novikov@example.com',
        message: 'Вопрос по оформлению зала на корпоратив.',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.MEDIUM,
        source: 'website'
    },
    {
        name: 'Елена Соколова',
        phone: '+380931234572',
        email: 'elena.sokolova@example.com',
        message: 'Нужна помощь в выборе шаров для детского праздника.',
        status: CallbackStatus.IN_PROGRESS,
        priority: CallbackPriority.HIGH,
        source: 'website',
        notes: 'Ожидает звонка менеджера'
    },
    {
        name: 'Сергей Лебедев',
        phone: '+380501234573',
        email: null,
        message: 'Хочу заказать шары на 8 марта. Нужна консультация.',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.MEDIUM,
        source: 'phone'
    },
    {
        name: 'Татьяна Орлова',
        phone: '+380671234574',
        email: 'tatiana.orlova@example.com',
        message: 'Интересует аренда оборудования для надувания шаров.',
        status: CallbackStatus.COMPLETED,
        priority: CallbackPriority.LOW,
        source: 'website',
        notes: 'Предложена альтернатива - услуга надувания на месте'
    },
    {
        name: 'Андрей Морозов',
        phone: '+380931234575',
        email: 'andrey.morozov@example.com',
        message: 'Срочно нужны шары на сегодня! Есть ли возможность?',
        status: CallbackStatus.IN_PROGRESS,
        priority: CallbackPriority.URGENT,
        source: 'website',
        notes: 'Срочный заказ. Нужно проверить наличие.'
    },
    {
        name: 'Наталья Федорова',
        phone: '+380501234576',
        email: 'natalya.fedorova@example.com',
        message: 'Хочу заказать набор шаров на юбилей. Нужна помощь в выборе.',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.MEDIUM,
        source: 'website'
    },
    {
        name: 'Виктор Григорьев',
        phone: '+380671234577',
        email: null,
        message: 'Вопрос по доставке в другой город.',
        status: CallbackStatus.CANCELLED,
        priority: CallbackPriority.LOW,
        source: 'phone',
        notes: 'Клиент отменил запрос - нашел другого поставщика'
    },
    {
        name: 'Юлия Белова',
        phone: '+380931234578',
        email: 'yulia.belova@example.com',
        message: 'Интересует постоянное сотрудничество для мероприятий.',
        status: CallbackStatus.NEW,
        priority: CallbackPriority.HIGH,
        source: 'website'
    }
];

async function seedCallbacks() {
    console.log('🌱 Создание тестовых обратных звонков...');

    try {
        // Получаем первого менеджера для назначения на некоторые звонки
        const manager = await prisma.user.findFirst({
            where: {
                role: { in: ['MANAGER', 'ADMINISTRATOR', 'SUPER_ADMIN'] },
                isActive: true
            }
        });

        let createdCount = 0;
        let skippedCount = 0;

        for (const callbackData of testCallbacks) {
            try {
                // Проверяем, существует ли уже такой callback (по телефону и дате создания)
                const existingCallback = await prisma.callback.findFirst({
                    where: {
                        phone: callbackData.phone,
                        createdAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                });

                if (existingCallback) {
                    console.log(`⚠️  Обратный звонок уже существует: ${callbackData.name} (${callbackData.phone})`);
                    skippedCount++;
                    continue;
                }

                // Назначаем менеджера для звонков в процессе или завершенных
                const managerId = (callbackData.status === CallbackStatus.IN_PROGRESS || 
                                  callbackData.status === CallbackStatus.COMPLETED) && manager
                    ? manager.id
                    : null;

                // Устанавливаем completedAt для завершенных звонков
                const completedAt = callbackData.status === CallbackStatus.COMPLETED
                    ? new Date()
                    : null;

                // Создаем обратный звонок
                const callback = await prisma.callback.create({
                    data: {
                        name: callbackData.name,
                        phone: callbackData.phone,
                        email: callbackData.email,
                        message: callbackData.message,
                        status: callbackData.status,
                        priority: callbackData.priority,
                        source: callbackData.source,
                        managerId: managerId,
                        notes: callbackData.notes || null,
                        completedAt: completedAt
                    }
                });

                console.log(`✅ Создан обратный звонок: ${callbackData.name} (${callbackData.phone}) - ${callbackData.status}`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Ошибка создания обратного звонка ${callbackData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание обратных звонков завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}`);

    } catch (error) {
        console.error('❌ Ошибка при создании обратных звонков:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedCallbacks();

