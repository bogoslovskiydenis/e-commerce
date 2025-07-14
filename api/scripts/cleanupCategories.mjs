// scripts/cleanupCategories.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupCategories() {
    console.log('🧹 Очистка дублирующих категорий...');

    try {
        // Получаем все категории
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log(`📋 Найдено категорий: ${categories.length}`);

        // Группируем по slug для поиска дубликатов
        const slugGroups = {};
        categories.forEach(cat => {
            if (!slugGroups[cat.slug]) {
                slugGroups[cat.slug] = [];
            }
            slugGroups[cat.slug].push(cat);
        });

        // Находим дубликаты
        const duplicates = Object.entries(slugGroups)
            .filter(([slug, cats]) => cats.length > 1);

        if (duplicates.length === 0) {
            console.log('✅ Дубликатов не найдено!');
            return;
        }

        console.log(`🔍 Найдено дубликатов: ${duplicates.length}`);

        // Удаляем дубликаты (оставляем самую старую)
        for (const [slug, cats] of duplicates) {
            console.log(`\n📂 Обрабатываем slug: "${slug}" (${cats.length} дубликатов)`);

            // Сортируем по дате создания (оставляем первую)
            const sortedCats = cats.sort((a, b) =>
                new Date(a.createdAt) - new Date(b.createdAt)
            );

            const keepCategory = sortedCats[0];
            const toDelete = sortedCats.slice(1);

            console.log(`✅ Оставляем: ${keepCategory.name} (${keepCategory.id})`);

            for (const cat of toDelete) {
                console.log(`🗑️  Удаляем: ${cat.name} (${cat.id})`);
                await prisma.category.delete({
                    where: { id: cat.id }
                });
            }
        }

        console.log('\n🎉 Очистка завершена!');

        // Показываем оставшиеся категории
        const remainingCategories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                type: true
            },
            orderBy: [
                { sortOrder: 'asc' },
                { name: 'asc' }
            ]
        });

        console.log('\n📋 Оставшиеся категории:');
        remainingCategories.forEach((cat, index) => {
            console.log(`${index + 1}. ${cat.name} (${cat.slug}) - ${cat.type}`);
        });

    } catch (error) {
        console.error('❌ Ошибка при очистке категорий:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
cleanupCategories();