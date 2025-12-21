// scripts/disableOldCategoriesNavigation.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Список старых категорий, которые нужно отключить от навигации
// НЕ включаем 'wedding', так как новая категория тоже использует этот slug
const OLD_CATEGORIES = [
    'boy-birthday',
    'girl-birthday',
    'romantic',
    'newborn',
    'graduation',
    'anniversary',
    'new-year',
    'themed',
    'foil'
];

async function disableOldCategoriesNavigation() {
    console.log('🔧 Отключение старых категорий от навигации...');

    try {
        let updatedCount = 0;

        // Список новых категорий, которые должны остаться в навигации
        const NEW_CATEGORIES = ['birthday', 'wedding', 'romance', 'kids', 'corporate'];

        for (const slug of OLD_CATEGORIES) {
            const category = await prisma.category.findUnique({
                where: { slug }
            });

            if (category) {
                // Проверяем, что это не новая категория
                if (!NEW_CATEGORIES.includes(slug)) {
                    await prisma.category.update({
                        where: { slug },
                        data: {
                            showInNavigation: false
                        }
                    });
                    console.log(`✅ Отключена от навигации: ${category.name}`);
                    updatedCount++;
                } else {
                    console.log(`⚠️ Пропущена (новая категория): ${category.name}`);
                }
            } else {
                console.log(`⚠️ Категория не найдена: ${slug}`);
            }
        }

        // Также отключаем все категории, которые не в списке новых
        const allCategories = await prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true,
                parentId: null
            }
        });

        for (const category of allCategories) {
            if (!NEW_CATEGORIES.includes(category.slug)) {
                await prisma.category.update({
                    where: { id: category.id },
                    data: {
                        showInNavigation: false
                    }
                });
                console.log(`✅ Отключена от навигации: ${category.name}`);
                updatedCount++;
            }
        }

        // Проверяем, сколько категорий осталось в навигации
        const remainingCategories = await prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true,
                parentId: null
            },
            orderBy: { sortOrder: 'asc' }
        });

        // Убеждаемся, что все новые категории включены в навигацию
        for (const slug of NEW_CATEGORIES) {
            const category = await prisma.category.findUnique({
                where: { slug }
            });

            if (category && !category.showInNavigation) {
                await prisma.category.update({
                    where: { slug },
                    data: {
                        showInNavigation: true
                    }
                });
                console.log(`✅ Включена в навигацию: ${category.name}`);
            }
        }

        // Проверяем финальный результат
        const finalCategories = await prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true,
                parentId: null
            },
            orderBy: { sortOrder: 'asc' }
        });

        console.log(`\n🎉 Отключено ${updatedCount} старых категорий от навигации`);
        console.log(`\n📊 Категорий в навигации: ${finalCategories.length}`);
        console.log('Список категорий в навигации:');
        finalCategories.forEach((cat, index) => {
            console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
        });

    } catch (error) {
        console.error('❌ Ошибка при отключении категорий:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт, если он вызывается напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
    disableOldCategoriesNavigation();
}

export default disableOldCategoriesNavigation;
