// scripts/seedStructuredData.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 5 основных категорий
const MAIN_CATEGORIES = [
    {
        name: 'День рождения',
        slug: 'birthday',
        description: 'Воздушные шары для дня рождения',
        type: 'PRODUCTS',
        sortOrder: 1,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Свадьба',
        slug: 'wedding',
        description: 'Воздушные шары для свадебных торжеств',
        type: 'PRODUCTS',
        sortOrder: 2,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Романтика',
        slug: 'romance',
        description: 'Романтические воздушные шары',
        type: 'PRODUCTS',
        sortOrder: 3,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Детские праздники',
        slug: 'kids',
        description: 'Воздушные шары для детских праздников',
        type: 'PRODUCTS',
        sortOrder: 4,
        showInNavigation: true,
        isActive: true
    },
    {
        name: 'Корпоративные',
        slug: 'corporate',
        description: 'Воздушные шары для корпоративных мероприятий',
        type: 'PRODUCTS',
        sortOrder: 5,
        showInNavigation: true,
        isActive: true
    }
];

// Подкатегории для каждой категории (по 5 штук)
const SUB_CATEGORIES = {
    'birthday': [
        { name: 'Для мальчиков', slug: 'birthday-boys', sortOrder: 1 },
        { name: 'Для девочек', slug: 'birthday-girls', sortOrder: 2 },
        { name: 'Для взрослых', slug: 'birthday-adults', sortOrder: 3 },
        { name: 'Цифры', slug: 'birthday-numbers', sortOrder: 4 },
        { name: 'Тематические', slug: 'birthday-themed', sortOrder: 5 }
    ],
    'wedding': [
        { name: 'Сердца', slug: 'wedding-hearts', sortOrder: 1 },
        { name: 'Кольца', slug: 'wedding-rings', sortOrder: 2 },
        { name: 'Буквы', slug: 'wedding-letters', sortOrder: 3 },
        { name: 'Классические', slug: 'wedding-classic', sortOrder: 4 },
        { name: 'Премиум', slug: 'wedding-premium', sortOrder: 5 }
    ],
    'romance': [
        { name: 'Сердца', slug: 'romance-hearts', sortOrder: 1 },
        { name: 'Розы', slug: 'romance-roses', sortOrder: 2 },
        { name: 'Предложение', slug: 'romance-proposal', sortOrder: 3 },
        { name: 'Годовщина', slug: 'romance-anniversary', sortOrder: 4 },
        { name: 'Свидание', slug: 'romance-date', sortOrder: 5 }
    ],
    'kids': [
        { name: 'Мультфильмы', slug: 'kids-cartoons', sortOrder: 1 },
        { name: 'Игрушки', slug: 'kids-toys', sortOrder: 2 },
        { name: 'Животные', slug: 'kids-animals', sortOrder: 3 },
        { name: 'Супергерои', slug: 'kids-superheroes', sortOrder: 4 },
        { name: 'Принцессы', slug: 'kids-princesses', sortOrder: 5 }
    ],
    'corporate': [
        { name: 'Открытие', slug: 'corporate-opening', sortOrder: 1 },
        { name: 'Презентация', slug: 'corporate-presentation', sortOrder: 2 },
        { name: 'Юбилей компании', slug: 'corporate-anniversary', sortOrder: 3 },
        { name: 'Корпоратив', slug: 'corporate-party', sortOrder: 4 },
        { name: 'Реклама', slug: 'corporate-advertising', sortOrder: 5 }
    ]
};

// Генерация названий товаров для каждой подкатегории
function generateProductTitle(categoryName, subcategoryName, index) {
    const templates = [
        `Набор "${subcategoryName}" - ${categoryName} ${index}`,
        `Композиция "${subcategoryName}" для ${categoryName}`,
        `Набор воздушных шаров "${subcategoryName}"`,
        `Специальный набор "${subcategoryName}"`,
        `Премиум набор "${subcategoryName}"`
    ];
    return templates[index - 1] || `Товар ${subcategoryName} ${index}`;
}

// Генерация описания товара
function generateProductDescription(categoryName, subcategoryName, index) {
    return `Качественный набор воздушных шаров в категории "${subcategoryName}" для ${categoryName}. Идеально подходит для создания праздничной атмосферы. Включает разнообразные шары различных размеров и цветов.`;
}

// Генерация slug из названия
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function seedStructuredData() {
    console.log('🌱 Создание структурированных данных...');
    console.log('📊 План: 5 категорий → 25 подкатегорий → 125 товаров\n');

    try {
        const createdCategories = [];
        const createdSubcategories = [];

        // Создаем основные категории
        console.log('📁 Создание основных категорий...');
        for (const categoryData of MAIN_CATEGORIES) {
            const existing = await prisma.category.findUnique({
                where: { slug: categoryData.slug }
            });

            let category;
            if (!existing) {
                category = await prisma.category.create({
                    data: categoryData
                });
                console.log(`✅ Создана категория: ${categoryData.name}`);
            } else {
                category = await prisma.category.update({
                    where: { slug: categoryData.slug },
                    data: categoryData
                });
                console.log(`🔄 Обновлена категория: ${categoryData.name}`);
            }
            createdCategories.push(category);
        }

        // Создаем подкатегории
        console.log('\n📂 Создание подкатегорий...');
        for (const category of createdCategories) {
            const subcategories = SUB_CATEGORIES[category.slug] || [];
            
            for (const subData of subcategories) {
                const subcategorySlug = subData.slug;
                const existing = await prisma.category.findUnique({
                    where: { slug: subcategorySlug }
                });

                const subcategoryData = {
                    name: subData.name,
                    slug: subcategorySlug,
                    description: `Подкатегория "${subData.name}" в категории "${category.name}"`,
                    type: 'PRODUCTS',
                    parentId: category.id,
                    sortOrder: subData.sortOrder,
                    showInNavigation: true,
                    isActive: true
                };

                let subcategory;
                if (!existing) {
                    subcategory = await prisma.category.create({
                        data: subcategoryData
                    });
                    console.log(`  ✅ Создана подкатегория: ${subData.name} (${category.name})`);
                } else {
                    subcategory = await prisma.category.update({
                        where: { slug: subcategorySlug },
                        data: subcategoryData
                    });
                    console.log(`  🔄 Обновлена подкатегория: ${subData.name}`);
                }
                createdSubcategories.push(subcategory);
            }
        }

        // Создаем товары
        console.log('\n🎈 Создание товаров...');
        let productCount = 0;
        let updatedCount = 0;
        
        for (const subcategory of createdSubcategories) {
            const parentCategory = createdCategories.find(c => c.id === subcategory.parentId);
            
            for (let i = 1; i <= 5; i++) {
                const title = generateProductTitle(
                    parentCategory.name,
                    subcategory.name,
                    i
                );
                // Делаем slug уникальным, добавляя индекс подкатегории и номер товара
                const baseSlug = `${subcategory.slug}-${i}`;
                const slug = generateSlug(baseSlug);
                const description = generateProductDescription(
                    parentCategory.name,
                    subcategory.name,
                    i
                );
                
                // Генерируем случайную цену от 500 до 2000
                const basePrice = 500 + Math.floor(Math.random() * 1500);
                const oldPrice = basePrice + Math.floor(Math.random() * 500);
                const discount = Math.floor(((oldPrice - basePrice) / oldPrice) * 100);

                const productData = {
                    title,
                    slug,
                    description,
                    shortDescription: description.substring(0, 150) + '...',
                    price: basePrice,
                    oldPrice: i % 2 === 0 ? oldPrice : null,
                    discount: i % 2 === 0 ? discount : null,
                    categoryId: subcategory.id,
                    brand: 'BalloonShop',
                    sku: `BS-${slug.toUpperCase().replace(/-/g, '')}`,
                    images: [`/images/products/${slug}-1.jpg`],
                    attributes: {
                        balloonCount: 10 + Math.floor(Math.random() * 15),
                        materials: ['фольга', 'латекс'],
                        category: parentCategory.name,
                        subcategory: subcategory.name
                    },
                    tags: [parentCategory.slug, subcategory.slug, 'набор'],
                    isActive: true,
                    inStock: true,
                    stockQuantity: 20 + Math.floor(Math.random() * 30),
                    featured: i === 1
                };

                const existing = await prisma.product.findUnique({
                    where: { slug }
                });

                if (!existing) {
                    try {
                        await prisma.product.create({
                            data: productData
                        });
                        productCount++;
                    } catch (error) {
                        // Если ошибка из-за дублирующегося SKU, генерируем уникальный
                        if (error.code === 'P2002' && error.meta?.target?.includes('sku')) {
                            const uniqueSku = `BS-${slug.toUpperCase().replace(/-/g, '')}-${Date.now().toString(36)}`;
                            await prisma.product.create({
                                data: { ...productData, sku: uniqueSku }
                            });
                            productCount++;
                        } else {
                            throw error;
                        }
                    }
                } else {
                    // Обновляем существующий товар, но сохраняем его SKU
                    await prisma.product.update({
                        where: { slug },
                        data: {
                            ...productData,
                            sku: existing.sku || productData.sku
                        }
                    });
                    updatedCount++;
                }
            }
            
            // Показываем прогресс после каждой подкатегории
            const total = productCount + updatedCount;
            if (total % 25 === 0) {
                console.log(`  📦 Обработано товаров: ${total} (создано: ${productCount}, обновлено: ${updatedCount})`);
            }
        }

        const totalProducts = productCount + updatedCount;
        console.log(`\n🎉 Создание структурированных данных завершено!`);
        console.log(`\n📊 Статистика:`);
        console.log(`  - Основных категорий: ${createdCategories.length}`);
        console.log(`  - Подкатегорий: ${createdSubcategories.length}`);
        console.log(`  - Товаров: ${totalProducts} (создано: ${productCount}, обновлено: ${updatedCount})`);
        console.log(`  - Все категории включены в навигацию (showInNavigation: true)`);

    } catch (error) {
        console.error('❌ Ошибка при создании данных:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт, если он вызывается напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    seedStructuredData();
}

export default seedStructuredData;