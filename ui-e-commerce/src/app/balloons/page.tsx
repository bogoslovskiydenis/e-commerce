'use client'

import { useState } from 'react'
import { ChevronDown, Grid, List, X, Filter } from 'lucide-react'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import Sidebar from '@/components/Sidebar/Sidebar'

// Данные для каталога шариков
const BALLOON_PRODUCTS = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        type: 'foil' as const,
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/api/placeholder/300/300',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Красный'],
        inStock: true
    },
    {
        id: '2',
        name: 'Звезда золотая',
        type: 'foil' as const,
        price: 120,
        image: '/api/placeholder/300/300',
        category: 'stars',
        withHelium: true,
        size: '50см',
        colors: ['Золотой'],
        inStock: true
    },
    {
        id: '3',
        name: 'Цифра "1" серебряная',
        type: 'foil' as const,
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
        type: 'latex' as const,
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
        type: 'bouquet' as const,
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'birthday',
        withHelium: true,
        inStock: true
    },
    {
        id: '6',
        name: 'Набор "Единорог"',
        type: 'set' as const,
        price: 650,
        oldPrice: 750,
        discount: 13,
        image: '/api/placeholder/300/300',
        category: 'kids',
        withHelium: true,
        inStock: false
    }
]

const SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'name-asc', label: 'По названию А-Я' },
    { value: 'name-desc', label: 'По названию Я-А' },
    { value: 'new', label: 'Новинки' },
]

export default function BalloonsPage() {
    const [sortBy, setSortBy] = useState('popular')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Функция для закрытия мобильных фильтров
    const closeMobileFilters = () => {
        setShowMobileFilters(false)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li><a href="/" className="text-gray-500 hover:text-teal-600">Главная</a></li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-900">Шарики</li>
                </ol>
            </nav>

            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Воздушные шарики</h1>
                <p className="text-gray-600">
                    Большой выбор фольгированных и латексных шаров с доставкой по Киеву
                </p>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель - скрыта на мобильных */}
                <div className="hidden lg:block">
                    <Sidebar />
                </div>

                <div className="flex-1">
                    {/* Фильтры и сортировка */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Кнопка фильтров - только на мобильных */}
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                <Filter size={16} />
                                Фильтры
                            </button>

                            {/* Сортировка */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 sm:flex-none py-2 pl-3 pr-8 border border-gray-300 rounded-lg appearance-none bg-white min-w-[160px] text-sm"
                            >
                                {SORT_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {/* Переключатель вида - скрыт на маленьких экранах */}
                            <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600'}`}
                                    title="Сетка"
                                >
                                    <Grid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600'}`}
                                    title="Список"
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Счетчик товаров */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                            <span>Найдено:</span>
                            <span className="font-medium">{BALLOON_PRODUCTS.length} товаров</span>
                        </div>
                    </div>

                    {/* Активные фильтры */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                С гелием
                                <button
                                    className="ml-1 text-teal-600 hover:text-teal-800"
                                    aria-label="Удалить фильтр"
                                >
                                    ×
                                </button>
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                Фольгированные
                                <button
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    aria-label="Удалить фильтр"
                                >
                                    ×
                                </button>
                            </span>
                            <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                                Очистить все
                            </button>
                        </div>
                    </div>

                    {/* Сетка товаров */}
                    <ProductGrid products={BALLOON_PRODUCTS} />

                    {/* Пагинация */}
                    <div className="mt-12 flex items-center justify-center gap-1 sm:gap-2">
                        <button className="px-2 sm:px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                            ←
                        </button>
                        <button className="px-2 sm:px-3 py-2 bg-teal-600 text-white rounded text-sm">1</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">2</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">3</button>
                        <span className="px-1 sm:px-2 text-sm">...</span>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">10</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:text-gray-900">
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильные фильтры - модальное окно */}
            {showMobileFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={closeMobileFilters}
                    />

                    {/* Модальное окно с фильтрами */}
                    <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-lg lg:hidden">
                        <div className="flex flex-col h-full">
                            {/* Заголовок модального окна */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-lg font-semibold">Фильтры</h2>
                                <button
                                    onClick={closeMobileFilters}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                    aria-label="Закрыть фильтры"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Содержимое фильтров */}
                            <div className="flex-1 overflow-y-auto">
                                <Sidebar />
                            </div>

                            {/* Кнопки действий */}
                            <div className="p-4 border-t bg-gray-50 space-y-3">
                                <button
                                    className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                                    onClick={closeMobileFilters}
                                >
                                    Применить фильтры
                                </button>
                                <button
                                    className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
                                    onClick={closeMobileFilters}
                                >
                                    Сбросить все
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* SEO блок */}
            <div className="mt-16 bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Воздушные шарики в Киеве</h2>
                <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                    <p className="mb-4">
                        Интернет-магазин "Шарики на дом" предлагает широкий выбор воздушных шаров для любого праздника.
                        У нас вы найдете фольгированные и латексные шары, букеты, цифры, сердца и звезды.
                    </p>
                    <p className="mb-4">
                        Мы осуществляем быструю доставку по Киеву в течение 2 часов. Все шары наполняются качественным
                        гелием, который обеспечивает долгое время полета.
                    </p>
                    <p>
                        Оформить заказ можно на сайте или по телефону. Наши консультанты помогут подобрать идеальное
                        оформление для вашего события.
                    </p>
                </div>
            </div>
        </div>
    )
}