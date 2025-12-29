// scripts/seedPromotions.mjs
import { PrismaClient, PromotionType } from '@prisma/client';

const prisma = new PrismaClient();

const promotions = [
    {
        name: 'Скидка 15% на первый заказ',
        code: 'FIRST15',
        description: 'Специальная скидка 15% для новых клиентов на первый заказ',
        type: PromotionType.PERCENTAGE,
        value: 15,
        minOrderAmount: 500,
        maxUsage: 100,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // через 90 дней
    },
    {
        name: 'Скидка 200 грн при заказе от 1000 грн',
        code: 'SAVE200',
        description: 'Экономия 200 грн при заказе на сумму от 1000 грн',
        type: PromotionType.FIXED_AMOUNT,
        value: 200,
        minOrderAmount: 1000,
        maxUsage: 50,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // через 60 дней
    },
    {
        name: 'Бесплатная доставка',
        code: 'FREESHIP',
        description: 'Бесплатная доставка по Киеву при заказе от 800 грн',
        type: PromotionType.FREE_SHIPPING,
        value: 0,
        minOrderAmount: 800,
        maxUsage: null, // неограниченное количество
        isActive: true,
        startDate: new Date(),
        endDate: null, // без ограничения по дате
    },
    {
        name: 'Акция 1+1 на фольгированные шары',
        code: 'BUY1GET1',
        description: 'Купи один фольгированный шар - получи второй в подарок',
        type: PromotionType.BUY_ONE_GET_ONE,
        value: 0,
        minOrderAmount: null,
        maxUsage: 30,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // через 30 дней
    },
];

async function seedPromotions() {
    console.log('🎁 Создание промокодов...\n');

    try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const promotionData of promotions) {
            try {
                // Проверяем, существует ли промокод с таким кодом
                if (promotionData.code) {
                    const existingPromotion = await prisma.promotion.findUnique({
                        where: { code: promotionData.code },
                    });

                    if (existingPromotion) {
                        console.log(`⚠️  Промокод уже существует: ${promotionData.code} - ${promotionData.name}`);
                        skippedCount++;
                        continue;
                    }
                }

                // Создаем промокод
                const promotion = await prisma.promotion.create({
                    data: {
                        name: promotionData.name,
                        code: promotionData.code,
                        description: promotionData.description,
                        type: promotionData.type,
                        value: promotionData.value,
                        minOrderAmount: promotionData.minOrderAmount,
                        maxUsage: promotionData.maxUsage,
                        isActive: promotionData.isActive,
                        startDate: promotionData.startDate,
                        endDate: promotionData.endDate,
                        usedCount: 0,
                    },
                });

                console.log(`✅ Создан промокод: ${promotion.name}`);
                if (promotion.code) {
                    console.log(`   Код: ${promotion.code}`);
                }
                console.log(`   Тип: ${promotion.type}`);
                console.log(`   Значение: ${promotion.value}`);
                if (promotion.minOrderAmount) {
                    console.log(`   Мин. сумма заказа: ${promotion.minOrderAmount} грн`);
                }
                if (promotion.maxUsage) {
                    console.log(`   Макс. использований: ${promotion.maxUsage}`);
                }
                console.log('');

                createdCount++;
            } catch (error) {
                console.error(`❌ Ошибка создания промокода ${promotionData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание промокодов завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}\n`);
    } catch (error) {
        console.error('❌ Ошибка при создании промокодов:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем функцию, если файл выполняется напрямую
seedPromotions()
    .then(() => {
        console.log('✅ Скрипт выполнен успешно');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Ошибка выполнения скрипта:', error);
        process.exit(1);
    });

