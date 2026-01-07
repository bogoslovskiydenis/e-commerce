// scripts/deleteAllCategoriesAndProducts.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllCategoriesAndProducts() {
  console.log('🗑️  Удаление всех категорий и продуктов...');

  try {
    // Сначала удаляем все связанные записи с продуктами
    console.log('📦 Удаление связанных записей с продуктами...');
    
    // Удаляем OrderItem (связаны с Product)
    const orderItemsCount = await prisma.orderItem.count();
    if (orderItemsCount > 0) {
      await prisma.orderItem.deleteMany();
      console.log(`  ✅ Удалено ${orderItemsCount} позиций заказов`);
    }

    // Удаляем Review (связаны с Product)
    const reviewsCount = await prisma.review.count();
    if (reviewsCount > 0) {
      await prisma.review.deleteMany();
      console.log(`  ✅ Удалено ${reviewsCount} отзывов`);
    }

    // Удаляем Favorite (связаны с Product)
    const favoritesCount = await prisma.favorite.count();
    if (favoritesCount > 0) {
      await prisma.favorite.deleteMany();
      console.log(`  ✅ Удалено ${favoritesCount} избранных`);
    }

    // Удаляем PromotionProduct (связаны с Product)
    const promotionProductsCount = await prisma.promotionProduct.count();
    if (promotionProductsCount > 0) {
      await prisma.promotionProduct.deleteMany();
      console.log(`  ✅ Удалено ${promotionProductsCount} связей с акциями`);
    }

    // Теперь удаляем все продукты
    console.log('📦 Удаление всех продуктов...');
    const productsCount = await prisma.product.count();
    if (productsCount > 0) {
      await prisma.product.deleteMany();
      console.log(`  ✅ Удалено ${productsCount} продуктов`);
    } else {
      console.log('  ℹ️  Продукты не найдены');
    }

    // Удаляем NavigationItem, связанные с категориями
    console.log('🔗 Удаление элементов навигации...');
    const navItemsCount = await prisma.navigationItem.count({
      where: { categoryId: { not: null } }
    });
    if (navItemsCount > 0) {
      await prisma.navigationItem.deleteMany({
        where: { categoryId: { not: null } }
      });
      console.log(`  ✅ Удалено ${navItemsCount} элементов навигации`);
    }

    // Теперь удаляем все категории (сначала дочерние, потом родительские)
    // Prisma автоматически обработает parent_id благодаря ON DELETE SET NULL
    console.log('📁 Удаление всех категорий...');
    
    // Удаляем дочерние категории (с parentId)
    const childCategoriesCount = await prisma.category.count({
      where: { parentId: { not: null } }
    });
    if (childCategoriesCount > 0) {
      await prisma.category.deleteMany({
        where: { parentId: { not: null } }
      });
      console.log(`  ✅ Удалено ${childCategoriesCount} подкатегорий`);
    }

    // Удаляем родительские категории
    const parentCategoriesCount = await prisma.category.count({
      where: { parentId: null }
    });
    if (parentCategoriesCount > 0) {
      await prisma.category.deleteMany({
        where: { parentId: null }
      });
      console.log(`  ✅ Удалено ${parentCategoriesCount} категорий`);
    }

    // Проверяем, что все удалено
    const remainingCategories = await prisma.category.count();
    const remainingProducts = await prisma.product.count();

    console.log('\n🎉 Удаление завершено!');
    console.log(`📊 Итоговая статистика:`);
    console.log(`  - Категорий осталось: ${remainingCategories}`);
    console.log(`  - Продуктов осталось: ${remainingProducts}`);

    if (remainingCategories === 0 && remainingProducts === 0) {
      console.log('✅ Все категории и продукты успешно удалены!');
    } else {
      console.log('⚠️  Внимание: остались не удаленные записи');
    }

  } catch (error) {
    console.error('❌ Ошибка при удалении:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт, если он вызывается напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  deleteAllCategoriesAndProducts();
}

export default deleteAllCategoriesAndProducts;
