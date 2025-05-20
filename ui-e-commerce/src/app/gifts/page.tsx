'use client'

import ProductSectionPage from '@/components/ProductSectionPage/ProductSectionPage'

// Данные для подарков
const GIFTS_PRODUCTS = [
    {
        id: '1',
        name: 'Мягкая игрушка "Медвежонок"',
        type: 'plush',
        price: 250,
        image: '/api/placeholder/300/300',
        category: 'plush',
        inStock: true
    },
    {
        id: '2',
        name: 'Сувенир "С днем рождения"',
        type: 'souvenir',
        price: 180,
        oldPrice: 220,
        discount: 18,
        image: '/api/placeholder/300/300',
        category: 'souvenirs',
        occasion: 'birthday',
        inStock: true
    },
    {
        id: '3',
        name: 'Браслет "Для лучшей подруги"',
        type: 'jewelry',
        price: 320,
        image: '/api/placeholder/300/300',
        category: 'jewelry',
        occasion: 'friendship',
        inStock: true
    },
    {
        id: '4',
        name: 'Набор конфет "Праздничный"',
        type: 'sweets',
        price: 350,
        image: '/api/placeholder/300/300',
        category: 'sweets',
        occasion: 'celebration',
        inStock: true
    },
    {
        id: '5',
        name: 'Букет цветов "Весенний"',
        type: 'flowers',
        price: 450,
        oldPrice: 550,
        discount: 18,
        image: '/api/placeholder/300/300',
        category: 'flowers',
        inStock: true
    },
    {
        id: '6',
        name: 'Подарочный набор "Новорожденному"',
        type: 'gift set',
        price: 720,
        image: '/api/placeholder/300/300',
        category: 'newborn',
        inStock: true
    }
]

// Категории для фильтрации
const GIFTS_CATEGORIES = [
    { name: 'Мягкие игрушки', count: 25, href: '/gifts/plush' },
    { name: 'Сувениры', count: 32, href: '/gifts/souvenirs' },
    { name: 'Украшения', count: 18, href: '/gifts/jewelry' },
    { name: 'Конфеты', count: 15, href: '/gifts/sweets' },
    { name: 'Цветы', count: 20, href: '/gifts/flowers' },
    { name: 'По поводу', count: 0, href: '#' },
    { name: 'День рождения', count: 28, href: '/gifts/birthday' },
    { name: 'Юбилей', count: 15, href: '/gifts/anniversary' },
    { name: 'Свадьба', count: 12, href: '/gifts/wedding' },
    { name: 'Новорожденному', count: 18, href: '/gifts/newborn' },
]

// Активные фильтры
const GIFTS_FILTERS = [
    { name: 'В наличии', color: 'bg-green-100 text-green-800' },
    { name: 'Со скидкой', color: 'bg-red-100 text-red-800' }
]

export default function GiftsPage() {
    return (
        <ProductSectionPage
            title="Подарки и сувениры"
            description="Оригинальные подарки для любого праздника и торжества"
            breadcrumbs={[
                { name: 'Главная', href: '/' },
                { name: 'Подарки', href: '/gifts', current: true }
            ]}
            products={GIFTS_PRODUCTS}
            seoTitle="Подарки и сувениры в Киеве"
            seoDescription={[
                'В нашем магазине представлен широкий выбор подарков и сувениров для любого повода. Мы предлагаем мягкие игрушки, стильные украшения, вкусные конфеты, свежие цветы и многое другое.',
                'Каждый подарок тщательно подобран, чтобы принести радость и оставить яркие впечатления. Мы помогаем вам выразить свои чувства через особенные подарки для ваших близких.',
                'Доставка подарков осуществляется по Киеву в течение дня. Сделайте заказ прямо сейчас и порадуйте своих близких оригинальным и запоминающимся подарком!'
            ]}
            sidebarCategories={GIFTS_CATEGORIES}
            filters={GIFTS_FILTERS}
        />
    )
}