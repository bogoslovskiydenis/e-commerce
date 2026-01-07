// scripts/seedGeneratedData.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Данные категорий и подкатегорий
const CATEGORIES_DATA = [
  {
    nameUk: 'Електроніка',
    nameRu: 'Электроника',
    nameEn: 'Electronics',
    slug: 'electronics',
    descriptionUk: 'Сучасна електроніка та гаджети',
    descriptionRu: 'Современная электроника и гаджеты',
    descriptionEn: 'Modern electronics and gadgets',
    subcategories: [
      {
        nameUk: 'Смартфони',
        nameRu: 'Смартфоны',
        nameEn: 'Smartphones',
        slug: 'electronics-smartphones'
      },
      {
        nameUk: 'Планшети',
        nameRu: 'Планшеты',
        nameEn: 'Tablets',
        slug: 'electronics-tablets'
      },
      {
        nameUk: 'Ноутбуки',
        nameRu: 'Ноутбуки',
        nameEn: 'Laptops',
        slug: 'electronics-laptops'
      }
    ]
  },
  {
    nameUk: 'Одяг',
    nameRu: 'Одежда',
    nameEn: 'Clothing',
    slug: 'clothing',
    descriptionUk: 'Модний одяг для всієї родини',
    descriptionRu: 'Модная одежда для всей семьи',
    descriptionEn: 'Fashionable clothing for the whole family',
    subcategories: [
      {
        nameUk: 'Чоловічий одяг',
        nameRu: 'Мужская одежда',
        nameEn: 'Men\'s Clothing',
        slug: 'clothing-mens'
      },
      {
        nameUk: 'Жіночий одяг',
        nameRu: 'Женская одежда',
        nameEn: 'Women\'s Clothing',
        slug: 'clothing-womens'
      },
      {
        nameUk: 'Дитячий одяг',
        nameRu: 'Детская одежда',
        nameEn: 'Kids\' Clothing',
        slug: 'clothing-kids'
      }
    ]
  },
  {
    nameUk: 'Дім і сад',
    nameRu: 'Дом и сад',
    nameEn: 'Home & Garden',
    slug: 'home-garden',
    descriptionUk: 'Все для вашого дому та саду',
    descriptionRu: 'Всё для вашего дома и сада',
    descriptionEn: 'Everything for your home and garden',
    subcategories: [
      {
        nameUk: 'Меблі',
        nameRu: 'Мебель',
        nameEn: 'Furniture',
        slug: 'home-garden-furniture'
      },
      {
        nameUk: 'Декор',
        nameRu: 'Декор',
        nameEn: 'Decor',
        slug: 'home-garden-decor'
      },
      {
        nameUk: 'Садовий інвентар',
        nameRu: 'Садовый инвентарь',
        nameEn: 'Garden Tools',
        slug: 'home-garden-tools'
      }
    ]
  },
  {
    nameUk: 'Спорт',
    nameRu: 'Спорт',
    nameEn: 'Sports',
    slug: 'sports',
    descriptionUk: 'Спортивні товари та аксесуари',
    descriptionRu: 'Спортивные товары и аксессуары',
    descriptionEn: 'Sports goods and accessories',
    subcategories: [
      {
        nameUk: 'Фітнес',
        nameRu: 'Фитнес',
        nameEn: 'Fitness',
        slug: 'sports-fitness'
      },
      {
        nameUk: 'Туризм',
        nameRu: 'Туризм',
        nameEn: 'Outdoor',
        slug: 'sports-outdoor'
      },
      {
        nameUk: 'Водний спорт',
        nameRu: 'Водный спорт',
        nameEn: 'Water Sports',
        slug: 'sports-water'
      }
    ]
  }
];

// Генерация товаров для подкатегории
function generateProducts(categorySlug, subcategorySlug, subcategoryIndex, categoryIndex, productIndex) {
  const products = [];
  const productTemplates = [
    {
      uk: { title: 'Преміум товар', desc: 'Високоякісний товар з чудовими характеристиками' },
      ru: { title: 'Премиум товар', desc: 'Высококачественный товар с отличными характеристиками' },
      en: { title: 'Premium Product', desc: 'High-quality product with excellent features' }
    },
    {
      uk: { title: 'Стандартний товар', desc: 'Надійний товар для повсякденного використання' },
      ru: { title: 'Стандартный товар', desc: 'Надёжный товар для повседневного использования' },
      en: { title: 'Standard Product', desc: 'Reliable product for everyday use' }
    },
    {
      uk: { title: 'Економ товар', desc: 'Оптимальне співвідношення ціни та якості' },
      ru: { title: 'Эконом товар', desc: 'Оптимальное соотношение цены и качества' },
      en: { title: 'Budget Product', desc: 'Optimal price-to-quality ratio' }
    }
  ];

  for (let i = 0; i < 3; i++) {
    const template = productTemplates[i];
    const slug = `${subcategorySlug}-product-${i + 1}`;
    const basePrice = 500 + (subcategoryIndex * 100) + (i * 50) + (categoryIndex * 10);
    
    products.push({
      title: template.uk.title,
      titleUk: template.uk.title,
      titleRu: template.ru.title,
      titleEn: template.en.title,
      slug,
      description: template.uk.desc,
      descriptionUk: template.uk.desc,
      descriptionRu: template.ru.desc,
      descriptionEn: template.en.desc,
      shortDescription: template.uk.title,
      shortDescriptionUk: template.uk.title,
      shortDescriptionRu: template.ru.title,
      shortDescriptionEn: template.en.title,
      price: basePrice,
      oldPrice: i === 0 ? basePrice * 1.2 : null,
      discount: i === 0 ? 17 : null,
      categoryId: null, // будет заполнено позже
      sku: `SKU-${categoryIndex}-${subcategoryIndex}-${i + 1}`,
      images: [],
      inStock: true,
      stockQuantity: 50 + (i * 10),
      isActive: true,
      featured: i === 0,
      popular: i === 1
    });
  }

  return products;
}

async function seedGeneratedData() {
  console.log('🌱 Генерация категорий, подкатегорий и товаров...');

  try {
    const createdCategories = [];
    const createdSubcategories = [];
    const allProducts = [];

    // Создаем основные категории
    for (let catIdx = 0; catIdx < CATEGORIES_DATA.length; catIdx++) {
      const catData = CATEGORIES_DATA[catIdx];
      
      let parentCategory = await prisma.category.findUnique({
        where: { slug: catData.slug }
      });

      if (!parentCategory) {
        parentCategory = await prisma.category.create({
          data: {
            name: catData.nameUk,
            nameUk: catData.nameUk,
            nameRu: catData.nameRu,
            nameEn: catData.nameEn,
            slug: catData.slug,
            description: catData.descriptionUk,
            descriptionUk: catData.descriptionUk,
            descriptionRu: catData.descriptionRu,
            descriptionEn: catData.descriptionEn,
            type: 'PRODUCTS',
            sortOrder: catIdx + 1,
            showInNavigation: true,
            isActive: true
          }
        });
        console.log(`✅ Создана категория: ${catData.nameUk}`);
      } else {
        await prisma.category.update({
          where: { slug: catData.slug },
          data: {
            name: catData.nameUk,
            nameUk: catData.nameUk,
            nameRu: catData.nameRu,
            nameEn: catData.nameEn,
            description: catData.descriptionUk,
            descriptionUk: catData.descriptionUk,
            descriptionRu: catData.descriptionRu,
            descriptionEn: catData.descriptionEn
          }
        });
        console.log(`🔄 Обновлена категория: ${catData.nameUk}`);
      }

      createdCategories.push(parentCategory);

      // Создаем подкатегории
      for (let subIdx = 0; subIdx < catData.subcategories.length; subIdx++) {
        const subData = catData.subcategories[subIdx];
        
        let subcategory = await prisma.category.findUnique({
          where: { slug: subData.slug }
        });

        if (!subcategory) {
          subcategory = await prisma.category.create({
            data: {
              name: subData.nameUk,
              nameUk: subData.nameUk,
              nameRu: subData.nameRu,
              nameEn: subData.nameEn,
              slug: subData.slug,
              description: `${subData.nameUk} - підкатегорія ${catData.nameUk}`,
              descriptionUk: `${subData.nameUk} - підкатегорія ${catData.nameUk}`,
              descriptionRu: `${subData.nameRu} - подкатегория ${catData.nameRu}`,
              descriptionEn: `${subData.nameEn} - subcategory of ${catData.nameEn}`,
              type: 'PRODUCTS',
              parentId: parentCategory.id,
              sortOrder: subIdx + 1,
              showInNavigation: true,
              isActive: true
            }
          });
          console.log(`  ✅ Создана подкатегория: ${subData.nameUk}`);
        } else {
          await prisma.category.update({
            where: { slug: subData.slug },
            data: {
              name: subData.nameUk,
              nameUk: subData.nameUk,
              nameRu: subData.nameRu,
              nameEn: subData.nameEn,
              parentId: parentCategory.id
            }
          });
          console.log(`  🔄 Обновлена подкатегория: ${subData.nameUk}`);
        }

        createdSubcategories.push(subcategory);

        // Генерируем товары для подкатегории
        const products = generateProducts(catData.slug, subData.slug, subIdx, catIdx, 0);
        products.forEach(p => {
          p.categoryId = subcategory.id;
          allProducts.push(p);
        });
      }
    }

    // Создаем товары
    console.log('📦 Создание товаров...');
    let createdProducts = 0;
    let updatedProducts = 0;

    for (const productData of allProducts) {
      try {
        const existingProduct = await prisma.product.findUnique({
          where: { slug: productData.slug }
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: productData
          });
          console.log(`  ✅ Создан товар: ${productData.titleUk}`);
          createdProducts++;
        } else {
          await prisma.product.update({
            where: { slug: productData.slug },
            data: productData
          });
          console.log(`  🔄 Обновлен товар: ${productData.titleUk}`);
          updatedProducts++;
        }
      } catch (error) {
        console.error(`  ❌ Ошибка создания товара ${productData.slug}:`, error.message);
      }
    }

    console.log('🎉 Генерация завершена!');
    console.log(`📊 Статистика:`);
    console.log(`  - Категорий: ${createdCategories.length}`);
    console.log(`  - Подкатегорий: ${createdSubcategories.length}`);
    console.log(`  - Товаров создано: ${createdProducts}`);
    console.log(`  - Товаров обновлено: ${updatedProducts}`);

  } catch (error) {
    console.error('❌ Ошибка при генерации данных:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт, если он вызывается напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  seedGeneratedData();
}

export default seedGeneratedData;
