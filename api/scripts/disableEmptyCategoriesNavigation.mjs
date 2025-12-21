// scripts/disableEmptyCategoriesNavigation.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function disableEmptyCategoriesNavigation() {
    console.log('🔧 Отключение категорий без товаров от навигации...\n');

    try {
        // Получаем все категории с showInNavigation: true
        const categories = await prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true
            },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });

        let disabledCount = 0;
        let keptCount = 0;

        for (const category of categories) {
            const productCount = category._count.products;

            if (productCount === 0) {
                // Проверяем, есть ли у родительской категории подкатегории с товарами
                if (!category.parentId) {
                    // Это родительская категория - проверяем дочерние
                    const childrenWithProducts = await prisma.category.count({
                        where: {
                            parentId: category.id,
                            isActive: true,
                            products: {
                                some: {}
                            }
                        }
                    });

                    if (childrenWithProducts > 0) {
                        // У родительской категории есть подкатегории с товарами - оставляем
                        console.log(`✅ Оставлена: ${category.name} (0 товаров, но есть ${childrenWithProducts} подкатегорий с товарами)`);
                        keptCount++;
                        continue;
                    }
                }

                // Отключаем категорию без товаров
                await prisma.category.update({
                    where: { id: category.id },
                    data: {
                        showInNavigation: false
                    }
                });
                console.log(`❌ Отключена: ${category.name} (0 товаров)`);
                disabledCount++;
            } else {
                console.log(`✅ Оставлена: ${category.name} (${productCount} товаров)`);
                keptCount++;
            }
        }

        console.log(`\n🎉 Завершено!`);
        console.log(`📊 Статистика:`);
        console.log(`   - Отключено категорий: ${disabledCount}`);
        console.log(`   - Оставлено в навигации: ${keptCount}`);

        // Показываем финальный список категорий в навигации
        const remainingCategories = await prisma.category.findMany({
            where: {
                isActive: true,
                showInNavigation: true
            },
            include: {
                _count: {
                    select: { products: true }
                },
                parent: {
                    select: { name: true }
                }
            },
            orderBy: { sortOrder: 'asc' }
        });

        console.log(`\n📋 Категории в навигации (${remainingCategories.length}):`);
        remainingCategories.forEach((cat, index) => {
            const parentInfo = cat.parent ? ` (${cat.parent.name})` : '';
            console.log(`   ${index + 1}. ${cat.name}${parentInfo} - ${cat._count.products} товаров`);
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
    disableEmptyCategoriesNavigation();
}

export default disableEmptyCategoriesNavigation;
