'use client'

import ProductSectionPage from '@/components/ProductSectionPage/ProductSectionPage'

// Данные для букетов из шаров
const BOUQUET_PRODUCTS = [
    {
        id: '1',
        name: 'Букет "С днем рождения"',
        type: 'bouquet',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'birthday',
        withHelium: true,
        inStock: true
    },
    {
        id: '2',
        name: 'Букет "Романтический вечер"',
        type: 'bouquet',
        price: 550,
        oldPrice: 650,
        discount: 15,
        image: '/api/placeholder/300/300',
        category: 'romantic',
        withHelium: true,
        inStock: true
    },
    {
        id: '3',
        name: 'Букет "Для выпускника"',
        type: 'bouquet',
        price: 480,
        image: '/api/placeholder/300/300',
        category: 'graduation',
        withHelium: true,
        inStock: true
    },
    {
        id: '4',
        name: 'Букет "Детский праздник"',
        type: 'bouquet',
        price: 400,
        image: '/api/placeholder/300/300',
        category: 'kids',
        withHelium: true,
        inStock: true
    },
    {
        id: '5',
        name: 'Букет "Юбилей"',
        type: 'bouquet',
        price: 750,
        oldPrice: 850,
        discount: 12,
        image: '/api/placeholder/300/300',
        category: 'anniversary',
        withHelium: true,
        inStock: true
    },
    {
        id: '6',
        name: 'Букет "Свадебный"',
        type: 'bouquet',
        price: 850,
        image: '/api/placeholder/300/300',
        category: 'wedding',
        withHelium: true,
        inStock: true
    }
]

// Категории для фильтрации
const BOUQUET_CATEGORIES = [
    { name: 'Дни рождения', count: 45, href: '/bouquets/birthday' },
    { name: 'Романтика', count: 32, href: '/bouquets/romantic' },
    { name: 'Свадьба', count: 20, href: '/bouquets/wedding' },
    { name: 'Детские праздники', count: 38, href: '/bouquets/kids' },
    { name: 'Выпускные', count: 15, href: '/bouquets/graduation' },
    { name: 'Корпоративные', count: 22, href: '/bouquets/corporate' },
    { name: 'Юбилеи', count: 18, href: '/bouquets/anniversary' },
]

// Активные фильтры
const BOUQUET_FILTERS = [
    { name: 'С гелием', color: 'bg-teal-100 text-teal-800' },
    { name: 'Стойкие', color: 'bg-blue-100 text-blue-800' }
]

export default function BouquetsPage() {
    return (
        <ProductSectionPage
            title="Букеты из воздушных шаров"
            description="Красивые букеты из шаров для любого праздника с доставкой по Киеву"
            breadcrumbs={[
                { name: 'Главная', href: '/' },
                { name: 'Букеты из шаров', href: '/bouquets', current: true }
            ]}
            products={BOUQUET_PRODUCTS}
            seoTitle="Букеты из воздушных шаров в Киеве"
            seoDescription={[
                'Наш интернет-магазин предлагает широкий выбор букетов из воздушных шаров для любого события. У нас вы найдете букеты для дня рождения, свадьбы, юбилея, выпускного и других праздников.',
                'Мы используем только качественные материалы и наполняем шары гелием, что обеспечивает долгое время полета. Доставка по Киеву осуществляется в течение 2 часов.',
                'Закажите букет из шаров прямо сейчас и порадуйте своих близких ярким и оригинальным подарком!'
            ]}
            sidebarCategories={BOUQUET_CATEGORIES}
            filters={BOUQUET_FILTERS}
        />
    )
}