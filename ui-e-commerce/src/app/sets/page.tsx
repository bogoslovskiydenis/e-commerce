'use client'

import ProductSectionPage from '@/components/ProductSectionPage/ProductSectionPage'

// Данные для наборов
const SETS_PRODUCTS = [
    {
        id: '1',
        name: 'Набор "День рождения мальчика"',
        type: 'set',
        price: 980,
        oldPrice: 1200,
        discount: 18,
        image: '/api/placeholder/300/300',
        category: 'boy-birthday',
        inStock: true
    },
    {
        id: '2',
        name: 'Набор "День рождения девочки"',
        type: 'set',
        price: 950,
        oldPrice: 1150,
        discount: 17,
        image: '/api/placeholder/300/300',
        category: 'girl-birthday',
        inStock: true
    },
    {
        id: '3',
        name: 'Набор "Романтический вечер"',
        type: 'set',
        price: 1200,
        image: '/api/placeholder/300/300',
        category: 'romantic',
        inStock: true
    },
    {
        id: '4',
        name: 'Набор "Выписка из роддома"',
        type: 'set',
        price: 1350,
        oldPrice: 1500,
        discount: 10,
        image: '/api/placeholder/300/300',
        category: 'newborn',
        inStock: true
    },
    {
        id: '5',
        name: 'Набор "Выпускной"',
        type: 'set',
        price: 1400,
        image: '/api/placeholder/300/300',
        category: 'graduation',
        inStock: true
    },
    {
        id: '6',
        name: 'Набор "Юбилей 50 лет"',
        type: 'set',
        price: 1500,
        oldPrice: 1800,
        discount: 17,
        image: '/api/placeholder/300/300',
        category: 'anniversary',
        inStock: true
    }
]

// Категории для фильтрации
const SETS_CATEGORIES = [
    { name: 'Дни рождения', count: 0, href: '#' },
    { name: 'День рождения мальчика', count: 15, href: '/sets/boy-birthday' },
    { name: 'День рождения девочки', count: 18, href: '/sets/girl-birthday' },
    { name: 'По поводу', count: 0, href: '#' },
    { name: 'Романтический вечер', count: 10, href: '/sets/romantic' },
    { name: 'Выписка из роддома', count: 12, href: '/sets/newborn' },
    { name: 'Выпускной', count: 8, href: '/sets/graduation' },
    { name: 'Юбилей', count: 14, href: '/sets/anniversary' },
    { name: 'Особые наборы', count: 0, href: '#' },
    { name: 'Конструктор наборов', count: 1, href: '/sets/constructor' },
    { name: 'Индивидуальный заказ', count: 1, href: '/sets/custom' },
]

// Активные фильтры
const SETS_FILTERS = [
    { name: 'Полный комплект', color: 'bg-purple-100 text-purple-800' },
    { name: 'Со скидкой', color: 'bg-red-100 text-red-800' }
]

// Дополнительные варианты сортировки
const SETS_SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'discount', label: 'По размеру скидки' },
    { value: 'items', label: 'По количеству предметов' },
    { value: 'new', label: 'Новинки' },
]

export default function SetsPage() {
    return (
        <ProductSectionPage
            title="Готовые наборы для праздника"
            description="Комплексные решения для оформления праздников любого типа"
            breadcrumbs={[
                { name: 'Главная', href: '/' },
                { name: 'Наборы', href: '/sets', current: true }
            ]}
            products={SETS_PRODUCTS}
            sortOptions={SETS_SORT_OPTIONS}
            seoTitle="Готовые наборы для праздников в Киеве"
            seoDescription={[
                'Наш магазин предлагает готовые наборы для оформления различных праздников и торжеств. В каждый набор входят тщательно подобранные воздушные шары, декорации, стаканчики и другие аксессуары, которые создадут неповторимую атмосферу вашего события.',
                'Мы разработали наборы для дней рождений мальчиков и девочек, выпускных, романтических вечеров, юбилеев и других особых случаев. Каждый набор можно дополнить индивидуальными элементами по вашему желанию.',
                'Вы также можете воспользоваться нашим онлайн-конструктором наборов или заказать полностью индивидуальный комплект. Доставка по Киеву осуществляется в день заказа!'
            ]}
            sidebarCategories={SETS_CATEGORIES}
            filters={SETS_FILTERS}
        />
    )
}