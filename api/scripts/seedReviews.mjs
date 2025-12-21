// scripts/seedReviews.mjs
import { PrismaClient, ReviewStatus } from '@prisma/client';

const prisma = new PrismaClient();

const testReviews = [
    {
        name: 'Анна Петрова',
        email: 'anna.petrova@example.com',
        rating: 5,
        comment: 'Отличные шарики! Качество на высоте, доставка быстрая. Рекомендую!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Иван Сидоров',
        email: 'ivan.sidorov@example.com',
        rating: 4,
        comment: 'Хорошие шары, но немного дороговато. В целом доволен покупкой.',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Мария Козлова',
        email: 'maria.kozlova@example.com',
        rating: 5,
        comment: 'Потрясающее качество! Шарики держались несколько дней. Очень довольна!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Дмитрий Волков',
        email: 'dmitry.volkov@example.com',
        rating: 3,
        comment: 'Нормальные шары, но ожидал большего за такую цену.',
        status: ReviewStatus.PENDING
    },
    {
        name: 'Елена Новикова',
        email: 'elena.novikova@example.com',
        rating: 5,
        comment: 'Прекрасный сервис! Шарики пришли вовремя, все целое. Спасибо!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Сергей Морозов',
        email: 'sergey.morozov@example.com',
        rating: 2,
        comment: 'Не понравилось качество, один шарик лопнул на следующий день.',
        status: ReviewStatus.PENDING
    },
    {
        name: 'Ольга Соколова',
        email: 'olga.sokolova@example.com',
        rating: 5,
        comment: 'Идеальные шарики для праздника! Все гости были в восторге. Обязательно закажу еще!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Алексей Лебедев',
        email: 'alexey.lebedev@example.com',
        rating: 4,
        comment: 'Хорошее качество, быстрая доставка. Рекомендую для праздников.',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Татьяна Орлова',
        email: 'tatiana.orlova@example.com',
        rating: 5,
        comment: 'Лучшие шарики в городе! Яркие, качественные, долго держатся. Спасибо!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Павел Смирнов',
        email: 'pavel.smirnov@example.com',
        rating: 1,
        comment: 'Очень разочарован. Шарики не соответствуют описанию.',
        status: ReviewStatus.REJECTED
    },
    {
        name: 'Наталья Федорова',
        email: 'natalya.fedorova@example.com',
        rating: 5,
        comment: 'Отличный выбор шаров! Помогли с оформлением праздника. Всем рекомендую!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Андрей Кузнецов',
        email: 'andrey.kuznetsov@example.com',
        rating: 4,
        comment: 'Хорошие шарики, качество на уровне. Цена соответствует качеству.',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Юлия Романова',
        email: 'yulia.romanova@example.com',
        rating: 5,
        comment: 'Потрясающий сервис! Шарики превзошли все ожидания. Очень довольна!',
        status: ReviewStatus.APPROVED
    },
    {
        name: 'Максим Григорьев',
        email: 'maxim.grigoriev@example.com',
        rating: 3,
        comment: 'Нормально, но есть куда расти. Качество среднее.',
        status: ReviewStatus.PENDING
    },
    {
        name: 'Виктория Белова',
        email: 'victoria.belova@example.com',
        rating: 5,
        comment: 'Идеальные шарики для детского праздника! Дети были в восторге!',
        status: ReviewStatus.APPROVED
    }
];

async function seedReviews() {
    console.log('🌱 Создание тестовых отзывов...');

    try {
        // Получаем первые 10 активных продуктов
        const products = await prisma.product.findMany({
            where: { isActive: true },
            take: 10,
            select: { id: true, title: true }
        });

        if (products.length === 0) {
            console.log('⚠️  В базе данных нет активных продуктов. Создайте продукты перед добавлением отзывов.');
            return;
        }

        console.log(`📦 Найдено ${products.length} продуктов для добавления отзывов`);

        let createdCount = 0;
        let skippedCount = 0;

        // Создаем отзывы для каждого продукта
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const reviewData = testReviews[i % testReviews.length];

            try {
                // Проверяем, есть ли уже отзывы от этого email для этого продукта
                const existingReview = await prisma.review.findFirst({
                    where: {
                        productId: product.id,
                        email: reviewData.email
                    }
                });

                if (existingReview) {
                    console.log(`⚠️  Отзыв от ${reviewData.email} для продукта "${product.title}" уже существует`);
                    skippedCount++;
                    continue;
                }

                await prisma.review.create({
                    data: {
                        productId: product.id,
                        name: reviewData.name,
                        email: reviewData.email,
                        rating: reviewData.rating,
                        comment: reviewData.comment,
                        status: reviewData.status
                    }
                });

                console.log(`✅ Создан отзыв от ${reviewData.name} для продукта "${product.title}" (рейтинг: ${reviewData.rating}, статус: ${reviewData.status})`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Ошибка создания отзыва для продукта "${product.title}":`, error.message);
            }
        }

        // Добавляем дополнительные отзывы для первого продукта
        const firstProduct = products[0];
        const additionalReviews = testReviews.slice(products.length, products.length + 5);
        
        for (const reviewData of additionalReviews) {
            try {
                const existingReview = await prisma.review.findFirst({
                    where: {
                        productId: firstProduct.id,
                        email: reviewData.email
                    }
                });

                if (!existingReview) {
                    await prisma.review.create({
                        data: {
                            productId: firstProduct.id,
                            name: reviewData.name,
                            email: reviewData.email,
                            rating: reviewData.rating,
                            comment: reviewData.comment,
                            status: reviewData.status
                        }
                    });

                    console.log(`✅ Создан дополнительный отзыв от ${reviewData.name} для продукта "${firstProduct.title}"`);
                    createdCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка создания дополнительного отзыва:`, error.message);
            }
        }

        console.log('🎉 Создание отзывов завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}`);

    } catch (error) {
        console.error('❌ Ошибка при создании отзывов:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedReviews();

