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
        let updatedCount = 0;

        // Сначала создаем родительские категории
        const createdParentCategories = [];
        for (const categoryData of CATEGORIES) {
            try {
                const existingCategory = await prisma.category.findUnique({
                    where: { slug: categoryData.slug }
                });

                if (!existingCategory) {
                    const category = await prisma.category.create({
                        data: categoryData
                    });
                    console.log(`✅ Создана категория: ${categoryData.name}`);
                    createdParentCategories.push(category);
                    createdCount++;
                } else {
                    const category = await prisma.category.update({
                        where: { slug: categoryData.slug },
                        data: categoryData
                    });
                    console.log(`🔄 Обновлена категория: ${categoryData.name}`);
                    createdParentCategories.push(category);
                    updatedCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка создания категории ${categoryData.name}:`, error.message);
            }
        }

        // Создаем подкатегории
        console.log('📁 Создание подкатегорий...');
        const subcategories = [
            // Подкатегории для "День рождения мальчика"
            {
                name: 'Супергерои',
                slug: 'boy-birthday-superheroes',
                description: 'Шары с супергероями для мальчиков',
                type: 'PRODUCTS',
                parentSlug: 'boy-birthday',
                sortOrder: 1,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Машинки',
                slug: 'boy-birthday-cars',
                description: 'Автомобильные шары для мальчиков',
                type: 'PRODUCTS',
                parentSlug: 'boy-birthday',
                sortOrder: 2,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Динозавры',
                slug: 'boy-birthday-dinosaurs',
                description: 'Шары с динозаврами',
                type: 'PRODUCTS',
                parentSlug: 'boy-birthday',
                sortOrder: 3,
                showInNavigation: true,
                isActive: true
            },
            // Подкатегории для "День рождения девочки"
            {
                name: 'Принцессы',
                slug: 'girl-birthday-princesses',
                description: 'Шары с принцессами для девочек',
                type: 'PRODUCTS',
                parentSlug: 'girl-birthday',
                sortOrder: 1,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Единороги',
                slug: 'girl-birthday-unicorns',
                description: 'Волшебные единороги для девочек',
                type: 'PRODUCTS',
                parentSlug: 'girl-birthday',
                sortOrder: 2,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Бабочки и цветы',
                slug: 'girl-birthday-butterflies',
                description: 'Нежные бабочки и цветы',
                type: 'PRODUCTS',
                parentSlug: 'girl-birthday',
                sortOrder: 3,
                showInNavigation: true,
                isActive: true
            },
            // Подкатегории для "Романтические"
            {
                name: 'Сердца',
                slug: 'romantic-hearts',
                description: 'Романтические шары в форме сердец',
                type: 'PRODUCTS',
                parentSlug: 'romantic',
                sortOrder: 1,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Предложение',
                slug: 'romantic-proposal',
                description: 'Шары для предложения руки и сердца',
                type: 'PRODUCTS',
                parentSlug: 'romantic',
                sortOrder: 2,
                showInNavigation: true,
                isActive: true
            },
            // Подкатегории для "Фольгированные"
            {
                name: 'Цифры',
                slug: 'foil-numbers',
                description: 'Фольгированные шары с цифрами',
                type: 'PRODUCTS',
                parentSlug: 'foil',
                sortOrder: 1,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Буквы',
                slug: 'foil-letters',
                description: 'Фольгированные шары с буквами',
                type: 'PRODUCTS',
                parentSlug: 'foil',
                sortOrder: 2,
                showInNavigation: true,
                isActive: true
            },
            {
                name: 'Фигуры',
                slug: 'foil-shapes',
                description: 'Фольгированные шары различных форм',
                type: 'PRODUCTS',
                parentSlug: 'foil',
                sortOrder: 3,
                showInNavigation: true,
                isActive: true
            }
        ];

        for (const subcategoryData of subcategories) {
            try {
                // Находим родительскую категорию
                const parentCategory = createdParentCategories.find(
                    cat => cat.slug === subcategoryData.parentSlug
                ) || await prisma.category.findUnique({
                    where: { slug: subcategoryData.parentSlug }
                });

                if (!parentCategory) {
                    console.log(`⚠️ Родительская категория ${subcategoryData.parentSlug} не найдена, пропускаем ${subcategoryData.name}`);
                    continue;
                }

                const existingSubcategory = await prisma.category.findUnique({
                    where: { slug: subcategoryData.slug }
                });

                const { parentSlug, ...subcategoryDataWithoutParent } = subcategoryData;

                if (!existingSubcategory) {
                    await prisma.category.create({
                        data: {
                            ...subcategoryDataWithoutParent,
                            parentId: parentCategory.id
                        }
                    });
                    console.log(`✅ Создана подкатегория: ${subcategoryData.name} (родитель: ${parentCategory.name})`);
                    createdCount++;
                } else {
                    await prisma.category.update({
                        where: { slug: subcategoryData.slug },
                        data: {
                            ...subcategoryDataWithoutParent,
                            parentId: parentCategory.id
                        }
                    });
                    console.log(`🔄 Обновлена подкатегория: ${subcategoryData.name}`);
                    updatedCount++;
                }
            } catch (error) {
                console.error(`❌ Ошибка создания подкатегории ${subcategoryData.name}:`, error.message);
            }
        }

        console.log('🎉 Создание категорий завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, обновлено ${updatedCount}`);

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
