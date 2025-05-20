'use client'

import ProductSectionPage from '@/components/ProductSectionPage/ProductSectionPage'

// Данные для стаканчиков
const CUPS_PRODUCTS = [
    {
        id: '1',
        name: 'Стаканчики "День рождения" бумажные',
        type: 'cup',
        price: 80,
        image: '/api/placeholder/300/300',
        category: 'birthday',
        material: 'paper',
        size: '200мл',
        colors: ['Разноцветный'],
        inStock: true
    },
    {
        id: '2',
        name: 'Стаканчики "Единорог" картонные',
        type: 'cup',
        price: 95,
        oldPrice: 120,
        discount: 21,
        image: '/api/placeholder/300/300',
        category: 'unicorn',
        material: 'paper',
        size: '250мл',
        colors: ['Розовый', 'Голубой'],
        inStock: true
    },
    {
        id: '3',
        name: 'Стаканчики "Супергерои" пластиковые',
        type: 'cup',
        price: 110,
        image: '/api/placeholder/300/300',
        category: 'superhero',
        material: 'plastic',
        size: '300мл',
        colors: ['Красный', 'Синий'],
        inStock: true
    },
    {
        id: '4',
        name: 'Стаканчики "Принцессы" бумажные',
        type: 'cup',
        price: 90,
        image: '/api/placeholder/300/300',
        category: 'princess',
        material: 'paper',
        size: '200мл',
        colors: ['Розовый'],
        inStock: true
    },
    {
        id: '5',
        name: 'Стаканчики "Свадебные" экологические',
        type: 'cup',
        price: 150,
        oldPrice: 180,
        discount: 17,
        image: '/api/placeholder/300/300',
        category: 'wedding',
        material: 'eco',
        size: '250мл',
        colors: ['Белый', 'Золотой'],
        inStock: true
    },
    {
        id: '6',
        name: 'Стаканчики "Новый год" картонные',
        type: 'cup',
        price: 100,
        image: '/api/placeholder/300/300',
        category: 'newyear',
        material: 'paper',
        size: '300мл',
        colors: ['Зеленый', 'Красный'],
        inStock: true
    }
]

// Категории для фильтрации
const CUPS_CATEGORIES = [
    { name: 'Бумажные', count: 28, href: '/cups/paper' },
    { name: 'Пластиковые', count: 15, href: '/cups/plastic' },
    { name: 'Экологические', count: 10, href: '/cups/eco' },
    { name: '200мл', count: 18, href: '/cups/200ml' },
    { name: '250мл', count: 20, href: '/cups/250ml' },
    { name: '300мл', count: 15, href: '/cups/300ml' },
    { name: 'День рождения', count: 22, href: '/cups/birthday' },
    { name: 'Единорог', count: 8, href: '/cups/unicorn' },
    { name: 'Супергерои', count: 12, href: '/cups/superhero' },
    { name: 'Принцессы', count: 10, href: '/cups/princess' },
]

// Активные фильтры
const CUPS_FILTERS = [
    { name: 'Детская тематика', color: 'bg-pink-100 text-pink-800' },
    { name: 'Бумажные', color: 'bg-amber-100 text-amber-800' }
]

export default function CupsPage() {
    return (
        <ProductSectionPage
            title="Праздничные стаканчики"
            description="Бумажные и пластиковые стаканчики с яркими принтами для вашего праздника"
            breadcrumbs={[
                { name: 'Главная', href: '/' },
                { name: 'Стаканчики', href: '/cups', current: true }
            ]}
            products={CUPS_PRODUCTS}
            seoTitle="Праздничные стаканчики в Киеве"
            seoDescription={[
                'Наш магазин предлагает широкий ассортимент праздничных стаканчиков для любого мероприятия. У нас вы найдете бумажные, пластиковые и экологические стаканчики различных размеров и дизайнов.',
                'Мы предлагаем стаканчики с яркими принтами для детских праздников, дней рождения, свадеб и других торжеств. Все изделия изготовлены из качественных материалов и безопасны для использования.',
                'Заказывайте праздничные стаканчики с доставкой по Киеву и создавайте незабываемую атмосферу на вашем празднике!'
            ]}
            sidebarCategories={CUPS_CATEGORIES}
            filters={CUPS_FILTERS}
        />
    )
}