// scripts/seedCategories.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
    console.log('🌱 Создание тестовых категорий...');

    try {
        // Создаем основные категории по типам
        const categories = [
            {
                name: 'Фольгированные шарики',
                slug: 'foil-balloons',
                description: 'Яркие и долговечные фольгированные шары для любого праздника',
                type: 'BALLOONS',
                sortOrder: 1,
                showInNavigation: true,
                metaTitle: 'Фольгированные шарики - купить в Киеве',
                metaDescription: 'Большой выбор фольгированных шаров различных форм и размеров.',
                metaKeywords: 'фольгированные шары, шарики из фольги, праздничные шары'
            },
            {
                name: 'Латексные шарики',
                slug: 'latex-balloons',
                description: 'Классические латексные шары различных размеров и цветов',
                type: 'BALLOONS',
                sortOrder: 2,
                showInNavigation: true,
                metaTitle: 'Латексные шарики - широкий выбор цветов',
                metaDescription: 'Качественные латексные шары для оформления праздников.',
                metaKeywords: 'латексные шары, воздушные шарики, цветные шары'
            },
            {
                name: 'День рождения',
                slug: 'birthday-balloons',
                description: 'Праздничные шары и композиции для незабываемого дня рождения',
                type: 'EVENTS',
                sortOrder: 3,
                showInNavigation: true,
                metaTitle: 'Шарики на день рождения',
                metaDescription: 'Широкий выбор шаров для дня рождения.',
                metaKeywords: 'шары день рождения, праздничные шары'
            },
            {
                name: 'Свадебные шарики',
                slug: 'wedding-balloons',
                description: 'Элегантные шары и композиции для свадебного торжества',
                type: 'EVENTS',
                sortOrder: 4,
                showInNavigation: true,
                metaTitle: 'Свадебные шарики',
                metaDescription: 'Элегантные воздушные шары для свадебного оформления.',
                metaKeywords: 'свадебные шары, шары на свадьбу'
            },
            {
                name: 'Красные шарики',
                slug: 'red-balloons',
                description: 'Яркие красные шары для создания праздничного настроения',
                type: 'COLORS',
                sortOrder: 5,
                showInNavigation: true,
                metaTitle: 'Красные шарики',
                metaDescription: 'Красные воздушные шары различных оттенков.',
                metaKeywords: 'красные шары, алые шары'
            },
            {
                name: 'Подарочные наборы',
                slug: 'gift-sets',
                description: 'Готовые композиции и наборы шаров для подарка',
                type: 'GIFTS',
                sortOrder: 6,
                showInNavigation: true,
                metaTitle: 'Подарочные наборы шаров',
                metaDescription: 'Красивые подарочные наборы из воздушных шаров.',
                metaKeywords: 'подарочные наборы, букеты шаров'
            }
        ];

        // Создаем категории
        for (const categoryData of categories) {
            try {
                const existingCategory = await prisma.category.findUnique({
                    where: { slug: categoryData.slug }
                });

                if (!existingCategory) {
                    await prisma.category.create({
                        data: {
                            ...categoryData,
                            isActive: true
                        }
                    });
                    console.log(`✅ Создана категория: ${categoryData.name}`);
                } else {
                    console.log(`⚠️  Категория уже существует: ${categoryData.name}`);
                }
            } catch (error) {
                console.error(`❌ Ошибка создания категории ${categoryData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание категорий завершено!');

    } catch (error) {
        console.error('❌ Ошибка при создании категорий:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedCategories();