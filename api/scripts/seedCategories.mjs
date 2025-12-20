// scripts/seedCategories.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Категории товаров
const CATEGORIES = [
    {
        name: 'День рождения мальчика',
        slug: 'boy-birthday',
        description: 'Воздушные шары для празднования дня рождения мальчиков',
        type: 'PRODUCTS',
        sortOrder: 1,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'День рождения девочки',
        slug: 'girl-birthday',
        description: 'Воздушные шары для празднования дня рождения девочек',
        type: 'PRODUCTS',
        sortOrder: 2,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Романтические',
        slug: 'romantic',
        description: 'Воздушные шары для романтических событий',
        type: 'PRODUCTS',
        sortOrder: 3,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Выписка из роддома',
        slug: 'newborn',
        description: 'Воздушные шары для выписки из роддома',
        type: 'PRODUCTS',
        sortOrder: 4,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Выпускной',
        slug: 'graduation',
        description: 'Воздушные шары для выпускных мероприятий',
        type: 'PRODUCTS',
        sortOrder: 5,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Юбилей',
        slug: 'anniversary',
        description: 'Воздушные шары для юбилеев и годовщин',
        type: 'PRODUCTS',
        sortOrder: 6,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Новый год',
        slug: 'new-year',
        description: 'Воздушные шары для новогодних праздников',
        type: 'PRODUCTS',
        sortOrder: 7,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Свадьба',
        slug: 'wedding',
        description: 'Воздушные шары для свадебных торжеств',
        type: 'PRODUCTS',
        sortOrder: 8,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Тематические',
        slug: 'themed',
        description: 'Тематические воздушные шары',
        type: 'PRODUCTS',
        sortOrder: 9,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Фольгированные',
        slug: 'foil',
        description: 'Фольгированные воздушные шары',
        type: 'PRODUCTS',
        sortOrder: 10,
        showInNavigation: true,
        isActive: true
    }
];

async function seedCategories() {
    console.log('🌱 Создание категорий...');

    try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const categoryData of CATEGORIES) {
            try {
                const existingCategory = await prisma.category.findUnique({
                    where: { slug: categoryData.slug }
                });

                if (!existingCategory) {
                    await prisma.category.create({
                        data: categoryData
                    });
                    console.log(`✅ Создана категория: ${categoryData.name}`);
                    createdCount++;
                } else {
                    // Обновляем существующую категорию
                    await prisma.category.update({
                        where: { slug: categoryData.slug },
                        data: categoryData
                    });
                    console.log(`🔄 Обновлена категория: ${categoryData.name}`);
                    skippedCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка создания категории ${categoryData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание категорий завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, обновлено ${skippedCount}`);

    } catch (error) {
        console.error('❌ Ошибка при создании категорий:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт, если он вызывается напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    seedCategories();
}

export default seedCategories;
