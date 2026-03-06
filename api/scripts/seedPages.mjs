// scripts/seedPages.mjs — тестовые страницы (О нас, Доставка) с переводами uk/ru/en.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const pages = [
    {
        slug: 'about',
        title: 'О нас',
        titleUk: 'Про нас',
        titleRu: 'О нас',
        titleEn: 'About Us',
        content: '<h2>О компании</h2><p>Мы специализируемся на создании незабываемых праздников с помощью красивых воздушных шаров.</p><h2>Наши преимущества</h2><ul><li>Широкий ассортимент</li><li>Быстрая доставка</li><li>Гарантия качества</li></ul>',
        contentUk: '<h2>Про компанію</h2><p>Ми спеціалізуємося на створенні незабутніх свят за допомогою красивих повітряних кульок.</p><h2>Наші переваги</h2><ul><li>Широкий асортимент</li><li>Швидка доставка</li><li>Гарантія якості</li></ul>',
        contentRu: '<h2>О компании</h2><p>Мы специализируемся на создании незабываемых праздников с помощью красивых воздушных шаров.</p><h2>Наши преимущества</h2><ul><li>Широкий ассортимент</li><li>Быстрая доставка</li><li>Гарантия качества</li></ul>',
        contentEn: '<h2>About the company</h2><p>We specialize in creating unforgettable celebrations with beautiful balloons.</p><h2>Our advantages</h2><ul><li>Wide range</li><li>Fast delivery</li><li>Quality guarantee</li></ul>',
        excerpt: 'Информация о нашей компании',
        excerptUk: 'Інформація про нашу компанію',
        excerptRu: 'Информация о нашей компании',
        excerptEn: 'Information about our company',
        metaTitle: 'О нас - BalloonShop',
        metaTitleUk: 'Про нас - BalloonShop',
        metaTitleRu: 'О нас - BalloonShop',
        metaTitleEn: 'About Us - BalloonShop',
        metaDescription: 'Узнайте больше о компании BalloonShop и наших услугах',
        metaDescriptionUk: 'Дізнайтесь більше про компанію BalloonShop та наші послуги',
        metaDescriptionRu: 'Узнайте больше о компании BalloonShop и наших услугах',
        metaDescriptionEn: 'Learn more about BalloonShop and our services',
        isActive: true
    },
    {
        slug: 'delivery',
        title: 'Доставка и оплата',
        titleUk: 'Доставка та оплата',
        titleRu: 'Доставка и оплата',
        titleEn: 'Delivery and Payment',
        content: '<h2>Доставка и оплата</h2><p>Информация о способах доставки и оплаты заказов.</p>',
        contentUk: '<h2>Доставка та оплата</h2><p>Інформація про способи доставки та оплати замовлень.</p>',
        contentRu: '<h2>Доставка и оплата</h2><p>Информация о способах доставки и оплаты заказов.</p>',
        contentEn: '<h2>Delivery and Payment</h2><p>Information about delivery and payment methods.</p>',
        excerpt: 'Условия доставки и оплаты',
        excerptUk: 'Умови доставки та оплати',
        excerptRu: 'Условия доставки и оплаты',
        excerptEn: 'Delivery and payment terms',
        metaTitle: 'Доставка и оплата - BalloonShop',
        metaTitleUk: 'Доставка та оплата - BalloonShop',
        metaTitleRu: 'Доставка и оплата - BalloonShop',
        metaTitleEn: 'Delivery and Payment - BalloonShop',
        metaDescription: 'Условия доставки и способы оплаты в BalloonShop',
        metaDescriptionUk: 'Умови доставки та способи оплати в BalloonShop',
        metaDescriptionRu: 'Условия доставки и способы оплаты в BalloonShop',
        metaDescriptionEn: 'Delivery and payment options at BalloonShop',
        isActive: true
    },
    {
        slug: 'contacts',
        title: 'Контакты',
        titleUk: 'Контакти',
        titleRu: 'Контакты',
        titleEn: 'Contacts',
        content: '<h2>Наши контакты</h2><p>Мы всегда на связи и готовы помочь с подбором шаров и оформлением заказа.</p><h3>Телефон</h3><p><a href=\"tel:+380671111111\">+38 (067) 111-11-11</a></p><h3>График работы</h3><p>Пн–Вс: 9:00–21:00</p><h3>Адрес</h3><p>Киев, ул. Примерная, 1</p><h3>Email</h3><p><a href=\"mailto:info@balloonshop.ua\">info@balloonshop.ua</a></p>',
        contentUk: '<h2>Наші контакти</h2><p>Ми завжди на звʼязку і готові допомогти з підбором кульок та оформленням замовлення.</p><h3>Телефон</h3><p><a href=\"tel:+380671111111\">+38 (067) 111-11-11</a></p><h3>Графік роботи</h3><p>Пн–Нд: 9:00–21:00</p><h3>Адреса</h3><p>Київ, вул. Прикладна, 1</p><h3>Email</h3><p><a href=\"mailto:info@balloonshop.ua\">info@balloonshop.ua</a></p>',
        contentRu: '<h2>Наши контакты</h2><p>Мы всегда на связи и готовы помочь с подбором шаров и оформлением заказа.</p><h3>Телефон</h3><p><a href=\"tel:+380671111111\">+38 (067) 111-11-11</a></p><h3>График работы</h3><p>Пн–Вс: 9:00–21:00</p><h3>Адрес</h3><p>Киев, ул. Примерная, 1</p><h3>Email</h3><p><a href=\"mailto:info@balloonshop.ua\">info@balloonshop.ua</a></p>',
        contentEn: '<h2>Our contacts</h2><p>We are always in touch and ready to help with balloon selection and ordering.</p><h3>Phone</h3><p><a href=\"tel:+380671111111\">+38 (067) 111-11-11</a></p><h3>Working hours</h3><p>Mon–Sun: 9:00–21:00</p><h3>Address</h3><p>Kyiv, Prykladna St, 1</p><h3>Email</h3><p><a href=\"mailto:info@balloonshop.ua\">info@balloonshop.ua</a></p>',
        excerpt: 'Как с нами связаться',
        excerptUk: 'Як з нами звʼязатися',
        excerptRu: 'Как с нами связаться',
        excerptEn: 'How to contact us',
        metaTitle: 'Контакты - BalloonShop',
        metaTitleUk: 'Контакти - BalloonShop',
        metaTitleRu: 'Контакты - BalloonShop',
        metaTitleEn: 'Contacts - BalloonShop',
        metaDescription: 'Телефон, адрес и график работы BalloonShop в Киеве',
        metaDescriptionUk: 'Телефон, адреса та графік роботи BalloonShop у Києві',
        metaDescriptionRu: 'Телефон, адрес и график работы BalloonShop в Киеве',
        metaDescriptionEn: 'Phone, address and working hours of BalloonShop in Kyiv',
        isActive: true
    }
];

const pageFields = [
    'title', 'titleUk', 'titleRu', 'titleEn',
    'content', 'contentUk', 'contentRu', 'contentEn',
    'excerpt', 'excerptUk', 'excerptRu', 'excerptEn',
    'metaTitle', 'metaTitleUk', 'metaTitleRu', 'metaTitleEn',
    'metaDescription', 'metaDescriptionUk', 'metaDescriptionRu', 'metaDescriptionEn',
    'isActive'
];

async function seedPages() {
    console.log('📄 Создание тестовых страниц (uk/ru/en)...\n');
    try {
        for (const page of pages) {
            const createData = { slug: page.slug, ...page };
            const updateData = pageFields.reduce((acc, k) => {
                if (page[k] !== undefined) acc[k] = page[k];
                return acc;
            }, {});
            await prisma.page.upsert({
                where: { slug: page.slug },
                update: updateData,
                create: createData
            });
            console.log(`✅ Страница: ${page.slug} — "${page.title}"`);
        }
        console.log('\n🎉 Готово. Страницы можно редактировать в админке: Сайт → Страницы сайта.');
    } catch (error) {
        console.error('❌ Ошибка:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedPages()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
