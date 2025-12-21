import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Массив ID категорий для удаления (можно оставить пустым для удаления всех)
const CATEGORIES_TO_DELETE = [
  // Добавьте сюда ID категорий, которые нужно удалить
  // Например: 'category-id-1', 'category-id-2'
];

// Опции удаления
const FORCE_DELETE = false; // true - удалит даже если есть товары
const DELETE_ALL = false; // true - удалит все категории (осторожно!)
const LIST_ONLY = false; // true - только показать список категорий без удаления

async function listAllCategories() {
  try {
    console.log('📋 Список всех категорий в базе данных:\n');
    
    const allCategories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true, children: true }
        },
        parent: {
          select: { name: true, slug: true }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { sortOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    console.log(`Всего категорий: ${allCategories.length}\n`);
    console.log('='.repeat(80));
    
    allCategories.forEach((cat, index) => {
      const indent = cat.parentId ? '  └─ ' : '';
      const parentInfo = cat.parent ? ` (родитель: ${cat.parent.name})` : '';
      const productsCount = cat._count?.products || 0;
      const childrenCount = cat._count?.children || 0;
      
      console.log(`${index + 1}. ${indent}${cat.name}`);
      console.log(`   ID: ${cat.id}`);
      console.log(`   Slug: ${cat.slug}${parentInfo}`);
      console.log(`   Товаров: ${productsCount} | Подкатегорий: ${childrenCount}`);
      console.log(`   Активна: ${cat.isActive ? '✅' : '❌'} | В навигации: ${cat.showInNavigation ? '✅' : '❌'}`);
      console.log('');
    });
    
    console.log('='.repeat(80));
    console.log('\n💡 Скопируйте нужные ID в массив CATEGORIES_TO_DELETE в файле скрипта');
    
  } catch (error) {
    console.error('❌ Ошибка при получении списка категорий:', error);
    throw error;
  }
}

async function deleteCategories() {
  try {
    // Если нужно только показать список
    if (LIST_ONLY) {
      await listAllCategories();
      return;
    }

    console.log('🗑️  Начинаем удаление категорий...\n');

    let categoriesToDelete;

    if (DELETE_ALL) {
      console.log('⚠️  ВНИМАНИЕ: Удаление ВСЕХ категорий из базы данных!');
      categoriesToDelete = await prisma.category.findMany({
        select: { id: true, name: true }
      });
    } else if (CATEGORIES_TO_DELETE.length > 0) {
      categoriesToDelete = await prisma.category.findMany({
        where: {
          id: { in: CATEGORIES_TO_DELETE }
        },
        select: { id: true, name: true }
      });
    } else {
      console.log('❌ Не указаны категории для удаления.');
      console.log('   Варианты:');
      console.log('   1. Установите DELETE_ALL=true для удаления всех категорий');
      console.log('   2. Добавьте ID в массив CATEGORIES_TO_DELETE');
      console.log('   3. Установите LIST_ONLY=true для просмотра списка категорий');
      return;
    }

    if (categoriesToDelete.length === 0) {
      console.log('✅ Категории для удаления не найдены.');
      return;
    }

    console.log(`📋 Найдено категорий для удаления: ${categoriesToDelete.length}\n`);

    let deletedCount = 0;
    let skippedCount = 0;
    const errors = [];

    // Сначала удаляем дочерние категории (подкатегории)
    for (const category of categoriesToDelete) {
      try {
        const fullCategory = await prisma.category.findUnique({
          where: { id: category.id },
          include: {
            children: true,
            _count: {
              select: { products: true }
            }
          }
        });

        if (!fullCategory) {
          console.log(`⚠️  Категория ${category.name} (${category.id}) не найдена, пропускаем`);
          skippedCount++;
          continue;
        }

        // Проверяем дочерние категории
        if (fullCategory.children && fullCategory.children.length > 0) {
          console.log(`📁 Удаляем дочерние категории для: ${fullCategory.name}`);
          
          for (const child of fullCategory.children) {
            const childWithProducts = await prisma.category.findUnique({
              where: { id: child.id },
              include: {
                _count: {
                  select: { products: true }
                }
              }
            });

            const childProductsCount = childWithProducts?._count?.products || 0;

            if (childProductsCount > 0 && !FORCE_DELETE) {
              console.log(`   ⚠️  Пропущена подкатегория "${child.name}" (${childProductsCount} товаров)`);
              errors.push(`Подкатегория "${child.name}": ${childProductsCount} товаров`);
              continue;
            }

            if (childProductsCount > 0 && FORCE_DELETE) {
              console.log(`   🗑️  Удаляем ${childProductsCount} товаров из подкатегории "${child.name}"`);
              
              // Сначала удаляем связанные записи из order_items
              const productsToDelete = await prisma.product.findMany({
                where: { categoryId: child.id },
                select: { id: true }
              });
              
              for (const product of productsToDelete) {
                await prisma.orderItem.deleteMany({
                  where: { productId: product.id }
                });
              }
              
              await prisma.product.deleteMany({
                where: { categoryId: child.id }
              });
            }

            await prisma.category.delete({
              where: { id: child.id }
            });
            console.log(`   ✅ Удалена подкатегория: ${child.name}`);
          }
        }

        // Проверяем товары в основной категории
        const productsCount = fullCategory._count?.products || 0;
        if (productsCount > 0 && !FORCE_DELETE) {
          console.log(`⚠️  Пропущена категория "${fullCategory.name}" (${productsCount} товаров)`);
          errors.push(`Категория "${fullCategory.name}": ${productsCount} товаров`);
          skippedCount++;
          continue;
        }

        if (productsCount > 0 && FORCE_DELETE) {
          console.log(`🗑️  Удаляем ${productsCount} товаров из категории "${fullCategory.name}"`);
          
          // Сначала удаляем связанные записи из order_items
          const productsToDelete = await prisma.product.findMany({
            where: { categoryId: fullCategory.id },
            select: { id: true }
          });
          
          for (const product of productsToDelete) {
            await prisma.orderItem.deleteMany({
              where: { productId: product.id }
            });
          }
          
          await prisma.product.deleteMany({
            where: { categoryId: fullCategory.id }
          });
        }

        // Удаляем саму категорию
        await prisma.category.delete({
          where: { id: fullCategory.id }
        });

        console.log(`✅ Удалена категория: ${fullCategory.name}`);
        deletedCount++;

      } catch (error) {
        console.error(`❌ Ошибка при удалении категории ${category.name}:`, error.message);
        errors.push(`Категория "${category.name}": ${error.message}`);
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Итоги удаления:');
    console.log(`   ✅ Удалено: ${deletedCount}`);
    console.log(`   ⚠️  Пропущено: ${skippedCount}`);
    
    if (errors.length > 0) {
      console.log(`\n❌ Ошибки (${errors.length}):`);
      errors.forEach((err, i) => console.log(`   ${i + 1}. ${err}`));
      console.log('\n💡 Для принудительного удаления установите FORCE_DELETE=true');
    }

    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Критическая ошибка:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем удаление
deleteCategories()
  .then(() => {
    console.log('\n✅ Скрипт завершен');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Скрипт завершен с ошибкой:', error);
    process.exit(1);
  });
