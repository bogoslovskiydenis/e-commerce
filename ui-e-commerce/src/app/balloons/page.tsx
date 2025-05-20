'use client'

import ProductSectionPage from '@/components/ProductSectionPage/ProductSectionPage'

// Данные для каталога шариков
const BALLOON_PRODUCTS = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        type: 'foil',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/images/hard.jpg',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Красный'],
        inStock: true
    },
    {
        id: '2',
        name: 'Звезда золотая',
        type: 'foil',
        price: 120,
        image: '/images/hard.jpg',
        category: 'stars',
        withHelium: true,
        size: '50см',
        colors: ['Золотой'],
        inStock: true
    },
    {
        id: '3',
        name: 'Цифра "1" серебряная',
        type: 'foil',
        price: 350,
        oldPrice: 400,
        discount: 12,
        image: '/api/placeholder/300/300',
        category: 'numbers',
        withHelium: true,
        size: '90см',
        colors: ['Серебряный'],
        inStock: true
    },
    {
        id: '4',
        name: 'Латексный шар розовый',
        type: 'latex',
        price: 25,
        image: '/api/placeholder/300/300',
        category: 'latex',
        withHelium: true,
        size: '30см',
        colors: ['Розовый'],
        inStock: true
    },
    {
        id: '5',
        name: 'Букет "С днем рождения"',
        type: 'bouquet',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'birthday',
        withHelium: true,
        inStock: true
    },
    {
        id: '6',
        name: 'Набор "Единорог"',
        type: 'set',
        price: 650,
        oldPrice: 750,
        discount: 13,
        image: '/api/placeholder/300/300',
        category: 'kids',
        withHelium: true,
        inStock: false
    }
]

// Категории для магазина шариков
const BALLOON_CATEGORIES = [
    { name: 'Фольгированные шары', count: 245, href: '/balloons/foil' },
    { name: 'Латексные шары', count: 187, href: '/balloons/latex' },
    { name: 'Букеты из шаров', count: 156, href: '/bouquets' },
    { name: 'Цифры из шаров', count: 45, href: '/balloons/numbers' },
    { name: 'Сердца', count: 89, href: '/balloons/hearts' },
    { name: 'Звезды', count: 67, href: '/balloons/stars' },
    { name: 'Шары с рисунком', count: 134, href: '/balloons/printed' },
    { name: 'Светящиеся шары', count: 78, href: '/balloons/led' },
    { name: 'Стаканчики', count: 95, href: '/cups' },
    { name: 'Подарки', count: 203, href: '/gifts' },
    { name: 'Готовые наборы', count: 112, href: '/sets' }
]

// Активные фильтры
const BALLOON_FILTERS = [
    { name: 'С гелием', color: 'bg-teal-100 text-teal-800' },
    { name: 'Фольгированные', color: 'bg-blue-100 text-blue-800' }
]

export default function BalloonsPage() {
    return (
        <ProductSectionPage
            title="Воздушные шарики"
            description="Большой выбор фольгированных и латексных шаров с доставкой по Киеву"
            breadcrumbs={[
                { name: 'Главная', href: '/' },
                { name: 'Шарики', href: '/balloons', current: true }
            ]}
            products={BALLOON_PRODUCTS}
            seoTitle="Воздушные шарики в Киеве"
            seoDescription={[
                'Интернет-магазин "Шарики на дом" предлагает широкий выбор воздушных шаров для любого праздника. У нас вы найдете фольгированные и латексные шары, букеты, цифры, сердца и звезды.',
                'Мы осуществляем быструю доставку по Киеву в течение 2 часов. Все шары наполняются качественным гелием, который обеспечивает долгое время полета.',
                'Оформить заказ можно на сайте или по телефону. Наши консультанты помогут подобрать идеальное оформление для вашего события.'
            ]}
            sidebarCategories={BALLOON_CATEGORIES}
            filters={BALLOON_FILTERS}
        />
    )
}