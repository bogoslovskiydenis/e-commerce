import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Категории товаров
const CATEGORIES = [
    {
        name: 'День рождения мальчика',
        slug: 'boy-birthday',
        description: 'Воздушные шары для празднования дня рождения мальчиков',
        order: 1
    },
    {
        name: 'День рождения девочки',
        slug: 'girl-birthday',
        description: 'Воздушные шары для празднования дня рождения девочек',
        order: 2
    },
    {
        name: 'Романтические',
        slug: 'romantic',
        description: 'Воздушные шары для романтических событий',
        order: 3
    },
    {
        name: 'Выписка из роддома',
        slug: 'newborn',
        description: 'Воздушные шары для выписки из роддома',
        order: 4
    },
    {
        name: 'Выпускной',
        slug: 'graduation',
        description: 'Воздушные шары для выпускных мероприятий',
        order: 5
    },
    {
        name: 'Юбилей',
        slug: 'anniversary',
        description: 'Воздушные шары для юбилеев и годовщин',
        order: 6
    },
    {
        name: 'Новый год',
        slug: 'new-year',
        description: 'Воздушные шары для новогодних праздников',
        order: 7
    },
    {
        name: 'Свадьба',
        slug: 'wedding',
        description: 'Воздушные шары для свадебных торжеств',
        order: 8
    },
    {
        name: 'Тематические',
        slug: 'themed',
        description: 'Тематические воздушные шары',
        order: 9
    },
    {
        name: 'Фольгированные',
        slug: 'foil',
        description: 'Фольгированные воздушные шары',
        order: 10
    }
];

// Товары
const generateProducts = (categories: any[]) => {
    const products = [];

    // День рождения мальчика
    const boyBirthdayCategory = categories.find(c => c.slug === 'boy-birthday');
    products.push(
        {
            title: 'Набор "Супергерой" - день рождения мальчика',
            brand: 'BalloonShop',
            price: 850,
            oldPrice: 1000,
            discount: 15,
            categoryId: boyBirthdayCategory?.id,
            image: '/images/products/superhero-boy-set.jpg',
            images: [
                '/images/products/superhero-boy-set-1.jpg',
                '/images/products/superhero-boy-set-2.jpg',
                '/images/products/superhero-boy-set-3.jpg'
            ],
            description: 'Яркий набор воздушных шаров в стиле супергероев. Включает: фольгированные шары с изображением супергероев, латексные шары синего, красного и золотого цветов. Идеально подойдет для дня рождения мальчика от 3 до 12 лет.',
            inStock: true,
            quantity: 25,
            featured: true,
            tags: ['супергерой', 'мальчик', 'день рождения', 'фольга', 'латекс'],
            metadata: {
                balloonCount: 15,
                materials: ['фольга', 'латекс'],
                ageGroup: '3-12 лет',
                colors: ['синий', 'красный', 'золотой']
            }
        },
        {
            title: 'Набор "Машинки" - автомобильная тематика',
            brand: 'BalloonShop',
            price: 750,
            categoryId: boyBirthdayCategory?.id,
            image: '/images/products/cars-boy-set.jpg',
            description: 'Набор шаров с автомобильной тематикой. Фольгированные шары в виде машинок и латексные шары в автомобильных цветах.',
            inStock: true,
            quantity: 30,
            featured: false,
            tags: ['машинки', 'автомобили', 'мальчик', 'день рождения'],
            metadata: {
                balloonCount: 12,
                materials: ['фольга', 'латекс'],
                theme: 'автомобили'
            }
        },
        {
            title: 'Набор "Динозавры" - юрский период',
            brand: 'BalloonShop',
            price: 900,
            oldPrice: 1100,
            discount: 18,
            categoryId: boyBirthdayCategory?.id,
            image: '/images/products/dinosaur-boy-set.jpg',
            description: 'Захватывающий набор с динозаврами для маленьких палеонтологов. Фольгированные шары с изображением различных динозавров.',
            inStock: true,
            quantity: 20,
            featured: true,
            tags: ['динозавры', 'юрский период', 'мальчик', 'приключения'],
            metadata: {
                balloonCount: 18,
                materials: ['фольга', 'латекс'],
                theme: 'динозавры'
            }
        }
    );

    // День рождения девочки
    const girlBirthdayCategory = categories.find(c => c.slug === 'girl-birthday');
    products.push(
        {
            title: 'Набор "Принцесса" - розовая мечта',
            brand: 'BalloonShop',
            price: 950,
            oldPrice: 1150,
            discount: 17,
            categoryId: girlBirthdayCategory?.id,
            image: '/images/products/princess-girl-set.jpg',
            images: [
                '/images/products/princess-girl-set-1.jpg',
                '/images/products/princess-girl-set-2.jpg'
            ],
            description: 'Волшебный набор для маленькой принцессы. Включает фольгированные шары с коронами, звездами и латексные шары в нежных розовых и золотых тонах.',
            inStock: true,
            quantity: 28,
            featured: true,
            tags: ['принцесса', 'девочка', 'розовый', 'корона', 'звезды'],
            metadata: {
                balloonCount: 16,
                materials: ['фольга', 'латекс'],
                colors: ['розовый', 'золотой', 'белый']
            }
        },
        {
            title: 'Набор "Единороги" - магическое настроение',
            brand: 'BalloonShop',
            price: 1050,
            categoryId: girlBirthdayCategory?.id,
            image: '/images/products/unicorn-girl-set.jpg',
            description: 'Магический набор с единорогами в пастельных тонах. Фольгированные шары в виде единорогов и радуги.',
            inStock: true,
            quantity: 22,
            featured: true,
            tags: ['единороги', 'магия', 'девочка', 'радуга', 'пастель'],
            metadata: {
                balloonCount: 14,
                materials: ['фольга', 'латекс'],
                theme: 'единороги'
            }
        },
        {
            title: 'Набор "Бабочки и цветы" - весеннее настроение',
            brand: 'BalloonShop',
            price: 800,
            categoryId: girlBirthdayCategory?.id,
            image: '/images/products/butterfly-flower-set.jpg',
            description: 'Нежный весенний набор с бабочками и цветами. Идеален для девочек, любящих природу.',
            inStock: true,
            quantity: 25,
            tags: ['бабочки', 'цветы', 'весна', 'девочка', 'природа'],
            metadata: {
                balloonCount: 13,
                materials: ['фольга', 'латекс'],
                theme: 'природа'
            }
        }
    );

    // Романтические
    const romanticCategory = categories.find(c => c.slug === 'romantic');
    products.push(
        {
            title: 'Набор "Романтический вечер" - красные сердца',
            brand: 'BalloonShop',
            price: 1200,
            categoryId: romanticCategory?.id,
            image: '/images/products/romantic-hearts-set.jpg',
            description: 'Элегантный набор для романтического вечера. Красные и розовые шары в форме сердец, белые латексные шары.',
            inStock: true,
            quantity: 15,
            featured: true,
            tags: ['романтика', 'сердца', 'любовь', 'свидание', 'красный'],
            metadata: {
                balloonCount: 20,
                materials: ['фольга', 'латекс'],
                occasion: 'романтический вечер'
            }
        },
        {
            title: 'Набор "Предложение руки и сердца"',
            brand: 'BalloonShop',
            price: 1500,
            oldPrice: 1800,
            discount: 17,
            categoryId: romanticCategory?.id,
            image: '/images/products/proposal-set.jpg',
            description: 'Роскошный набор для предложения. Включает шары с надписями "Marry Me" и большое сердце.',
            inStock: true,
            quantity: 8,
            featured: true,
            tags: ['предложение', 'свадьба', 'marry me', 'помолвка'],
            metadata: {
                balloonCount: 25,
                materials: ['фольга', 'латекс'],
                occasion: 'предложение'
            }
        }
    );

    // Выписка из роддома
    const newbornCategory = categories.find(c => c.slug === 'newborn');
    products.push(
        {
            title: 'Набор "Выписка мальчика" - голубое счастье',
            brand: 'BalloonShop',
            price: 1350,
            oldPrice: 1500,
            discount: 10,
            categoryId: newbornCategory?.id,
            image: '/images/products/newborn-boy-set.jpg',
            description: 'Трогательный набор для встречи малыша. Голубые и белые шары, фольгированные шары "Это мальчик!"',
            inStock: true,
            quantity: 12,
            featured: true,
            tags: ['выписка', 'мальчик', 'новорожденный', 'голубой'],
            metadata: {
                balloonCount: 22,
                materials: ['фольга', 'латекс'],
                gender: 'мальчик'
            }
        },
        {
            title: 'Набор "Выписка девочки" - розовая нежность',
            brand: 'BalloonShop',
            price: 1350,
            oldPrice: 1500,
            discount: 10,
            categoryId: newbornCategory?.id,
            image: '/images/products/newborn-girl-set.jpg',
            description: 'Нежный набор для встречи маленькой принцессы. Розовые и белые шары, фольгированные шары "Это девочка!"',
            inStock: true,
            quantity: 10,
            featured: true,
            tags: ['выписка', 'девочка', 'новорожденная', 'розовый'],
            metadata: {
                balloonCount: 22,
                materials: ['фольга', 'латекс'],
                gender: 'девочка'
            }
        }
    );

    // Выпускной
    const graduationCategory = categories.find(c => c.slug === 'graduation');
    products.push(
        {
            title: 'Набор "Выпускной" - звездный час',
            brand: 'BalloonShop',
            price: 1400,
            categoryId: graduationCategory?.id,
            image: '/images/products/graduation-set.jpg',
            description: 'Торжественный набор для выпускного. Включает шары с надписями "Выпускник" и академические шапочки.',
            inStock: true,
            quantity: 18,
            featured: true,
            tags: ['выпускной', 'выпускник', 'школа', 'университет'],
            metadata: {
                balloonCount: 20,
                materials: ['фольга', 'латекс'],
                occasion: 'выпускной'
            }
        }
    );

    // Юбилей
    const anniversaryCategory = categories.find(c => c.slug === 'anniversary');
    products.push(
        {
            title: 'Набор "Юбилей 50 лет" - золотая классика',
            brand: 'BalloonShop',
            price: 1500,
            oldPrice: 1800,
            discount: 17,
            categoryId: anniversaryCategory?.id,
            image: '/images/products/anniversary-50-set.jpg',
            description: 'Элегантный набор для празднования 50-летия. Золотые и черные шары с цифрами.',
            inStock: true,
            quantity: 15,
            featured: true,
            tags: ['юбилей', '50 лет', 'золотой', 'годовщина'],
            metadata: {
                balloonCount: 18,
                materials: ['фольга', 'латекс'],
                age: 50
            }
        },
        {
            title: 'Набор "Юбилей 30 лет" - стильное торжество',
            brand: 'BalloonShop',
            price: 1300,
            categoryId: anniversaryCategory?.id,
            image: '/images/products/anniversary-30-set.jpg',
            description: 'Современный набор для празднования 30-летия. Серебряные и черные шары.',
            inStock: true,
            quantity: 20,
            tags: ['юбилей', '30 лет', 'серебряный', 'стильный'],
            metadata: {
                balloonCount: 16,
                materials: ['фольга', 'латекс'],
                age: 30
            }
        }
    );

    return products;
};

async function seedProducts() {
    console.log('🌱 Starting to seed products...');

    try {
        // Создаем категории
        console.log('📁 Creating categories...');
        const createdCategories = [];

        for (const categoryData of CATEGORIES) {
            const category = await prisma.category.upsert({
                where: { slug: categoryData.slug },
                update: categoryData,
                create: categoryData
            });
            createdCategories.push(category);
            console.log(`✅ Category created: ${category.name}`);
        }

        // Создаем товары
        console.log('🎈 Creating products...');
        const products = generateProducts(createdCategories);

        for (const productData of products) {
            // Генерируем slug из title
            const slug = productData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            
            const product = await prisma.product.upsert({
                where: {
                    slug: slug
                },
                update: {
                    ...productData,
                    slug: slug
                },
                create: {
                    ...productData,
                    slug: slug
                }
            });
            console.log(`✅ Product created: ${product.title}`);
        }

        console.log(`🎉 Seeding completed! Created ${createdCategories.length} categories and ${products.length} products`);

    } catch (error) {
        console.error('❌ Error seeding products:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

export default seedProducts;