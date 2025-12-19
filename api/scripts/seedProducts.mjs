// scripts/seedProducts.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testProducts = [
    {
        title: 'Фольгированный шар "С Днем Рождения"',
        slug: 'foil-balloon-birthday',
        description: 'Яркий фольгированный шар с надписью "С Днем Рождения"',
        price: 150.00,
        categoryId: null, // Будет установлена позже
        images: ['/images/sharik.png'],
        isActive: true,
        inStock: true,
        stockQuantity: 50,
        featured: true
    },
    {
        title: 'Набор латексных шаров "Радуга"',
        slug: 'latex-balloons-rainbow',
        description: 'Набор из 10 разноцветных латексных шаров',
        price: 300.00,
        oldPrice: 350.00,
        discount: 14.29,
        categoryId: null,
        images: ['/images/sharik.png'],
        isActive: true,
        inStock: true,
        stockQuantity: 30,
        featured: false
    },
    {
        title: 'Фольгированный шар "Сердце"',
        slug: 'foil-balloon-heart',
        description: 'Романтический фольгированный шар в форме сердца',
        price: 200.00,
        categoryId: null,
        images: ['/images/sharik.png'],
        isActive: true,
        inStock: true,
        stockQuantity: 25,
        featured: true
    },
    {
        title: 'Набор шаров "Детский праздник"',
        slug: 'balloon-set-kids-party',
        description: 'Яркий набор шаров для детского праздника',
        price: 450.00,
        oldPrice: 500.00,
        discount: 10.00,
        categoryId: null,
        images: ['/images/sharik.png'],
        isActive: true,
        inStock: true,
        stockQuantity: 20,
        featured: true
    },
    {
        title: 'Фольгированный шар "Цифра 1"',
        slug: 'foil-balloon-number-1',
        description: 'Фольгированный шар с цифрой 1 для первого дня рождения',
        price: 180.00,
        categoryId: null,
        images: ['/images/sharik.png'],
        isActive: true,
        inStock: true,
        stockQuantity: 15,
        featured: false
    }
];

async function seedProducts() {
    console.log('🌱 Создание тестовых продуктов...');

    try {
        // Получаем первую категорию
        const category = await prisma.category.findFirst({
            where: { isActive: true }
        });

        if (!category) {
            console.log('⚠️  В базе данных нет активных категорий. Создайте категории перед добавлением продуктов.');
            return;
        }

        console.log(`📦 Используется категория: ${category.name}`);

        let createdCount = 0;
        let skippedCount = 0;

        for (const productData of testProducts) {
            try {
                // Проверяем, существует ли продукт
                const existingProduct = await prisma.product.findUnique({
                    where: { slug: productData.slug }
                });

                if (existingProduct) {
                    console.log(`⚠️  Продукт уже существует: ${productData.title}`);
                    skippedCount++;
                    continue;
                }

                // Создаем продукт
                const product = await prisma.product.create({
                    data: {
                        ...productData,
                        categoryId: category.id
                    }
                });

                console.log(`✅ Создан продукт: ${product.title} (${product.price} грн)`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Ошибка создания продукта ${productData.title}:`, error.message);
            }
        }

        console.log('🎉 Создание продуктов завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}`);

    } catch (error) {
        console.error('❌ Ошибка при создании продуктов:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedProducts();
