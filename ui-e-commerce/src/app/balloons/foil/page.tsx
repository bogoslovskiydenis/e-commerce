'use client'

import { useState } from 'react'
import { ChevronDown, Grid, List, X, Filter } from 'lucide-react'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import Link from 'next/link'
import Image from 'next/image'

// Данные для фольгированных шаров
const FOIL_BALLOONS_PRODUCTS = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        type: 'foil' as const,
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/images/hard.jpg',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Красный'],
        material: 'Фольга',
        inStock: true
    },
    {
        id: '2',
        name: 'Звезда золотая',
        type: 'foil' as const,
        price: 120,
        image: '/images/hard.jpg',
        category: 'stars',
        withHelium: true,
        size: '50см',
        colors: ['Золотой'],
        material: 'Фольга',
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
        material: 'Фольга',
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
        material: 'Латекс',
        inStock: true
    },
    {
        id: '5',
        name: 'Сердце розовое',
        type: 'foil' as const,
        price: 150,
        image: '/api/placeholder/300/300',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Розовый'],
        material: 'Фольга',
        inStock: false
    },
    {
        id: '6',
        name: 'Звезда серебряная',
        type: 'foil' as const,
        price: 120,
        oldPrice: 140,
        discount: 15,
        image: '/api/placeholder/300/300',
        category: 'stars',
        withHelium: true,
        size: '50см',
        colors: ['Серебряный'],
        material: 'Фольга',
        inStock: false
    }
]

// Категории для боковой панели
const CATEGORIES = [
    { name: 'Фольгированные шары', count: 245, href: '/balloons/foil', active: true },
    { name: 'Латексные шары', count: 187, href: '/balloons/latex' },
    { name: 'Цифры из шаров', count: 45, href: '/balloons/numbers' },
    { name: 'Сердца', count: 89, href: '/balloons/hearts' },
    { name: 'Звезды', count: 67, href: '/balloons/stars' },
    { name: 'Шары с рисунком', count: 134, href: '/balloons/printed' },
    { name: 'Светящиеся шары', count: 78, href: '/balloons/led' },
    { name: 'Букеты из шаров', count: 156, href: '/bouquets' },
    { name: 'Стаканчики', count: 95, href: '/cups' },
    { name: 'Подарки', count: 203, href: '/gifts' },
    { name: 'Готовые наборы', count: 112, href: '/sets' }
]

const sortOptions = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'name-asc', label: 'По названию А-Я' },
    { value: 'name-desc', label: 'По названию Я-А' },
    { value: 'new', label: 'Новинки' },
]

// Фильтры
const COLORS = [
    { name: 'Красный', value: 'red', color: 'bg-red-500' },
    { name: 'Синий', value: 'blue', color: 'bg-blue-500' },
    { name: 'Розовый', value: 'pink', color: 'bg-pink-500' },
    { name: 'Золотой', value: 'gold', color: 'bg-yellow-500' },
    { name: 'Серебряный', value: 'silver', color: 'bg-gray-400' },
    { name: 'Зеленый', value: 'green', color: 'bg-green-500' }
]

const MATERIALS = ['Фольга', 'Латекс']

export default function FoilBalloonsPage() {
    const [sortBy, setSortBy] = useState('popular')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [activeFilters, setActiveFilters] = useState(['С гелием', 'Фольгированные'])
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Фольга'])
    const [priceRange, setPriceRange] = useState({ from: '', to: '' })

    // Функция для закрытия мобильных фильтров
    const closeMobileFilters = () => {
        setShowMobileFilters(false)
    }

    // Функция для удаления фильтра
    const removeFilter = (filterName: string) => {
        setActiveFilters(activeFilters.filter(f => f !== filterName))
        if (filterName === 'Фольгированные') {
            setSelectedMaterials([])
        }
    }

    // Функция для очистки всех фильтров
    const clearAllFilters = () => {
        setActiveFilters([])
        setSelectedColors([])
        setSelectedMaterials([])
        setPriceRange({ from: '', to: '' })
    }

    // Обработка изменения цвета
    const handleColorChange = (colorValue: string) => {
        setSelectedColors(prev =>
            prev.includes(colorValue)
                ? prev.filter(c => c !== colorValue)
                : [...prev, colorValue]
        )
    }

    // Обработка изменения материала
    const handleMaterialChange = (material: string) => {
        setSelectedMaterials(prev =>
            prev.includes(material)
                ? prev.filter(m => m !== material)
                : [...prev, material]
        )
    }

    // Компонент боковой панели фильтров
    const SidebarFilters = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border'}`}>
            {/* Категории */}
            <div className={`${isMobile ? 'p-4' : 'p-4 border-b'}`}>
                <h2 className="font-semibold text-lg mb-4">Категории</h2>
                <nav className="space-y-1">
                    {CATEGORIES.map((category) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                                category.active
                                    ? 'bg-teal-50 text-teal-600 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <span>{category.name}</span>
                            <span className="text-gray-400 text-xs">({category.count})</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Фильтры */}
            <div className="p-4 space-y-6">
                <h3 className="font-semibold text-base">Фильтры</h3>

                {/* Цена */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Цена</h4>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="От"
                            value={priceRange.from}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, from: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                            type="number"
                            placeholder="До"
                            value={priceRange.to}
                            onChange={(e) => setPriceRange(prev => ({ ...prev, to: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                    </div>
                </div>

                {/* Цвет */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Цвет</h4>
                    <div className="space-y-2">
                        {COLORS.map((color) => (
                            <label key={color.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedColors.includes(color.value)}
                                    onChange={() => handleColorChange(color.value)}
                                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                />
                                <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                                <span className="text-sm">{color.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Материал */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Материал</h4>
                    <div className="space-y-2">
                        {MATERIALS.map((material) => (
                            <label key={material} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selectedMaterials.includes(material)}
                                    onChange={() => handleMaterialChange(material)}
                                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                />
                                <span className="text-sm">{material}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* С гелием */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm">С гелием</span>
                    </label>
                </div>

                <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">
                    Применить фильтры
                </button>
            </div>
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li><Link href="/" className="text-gray-500 hover:text-teal-600">Главная</Link></li>
                    <li className="text-gray-400">/</li>
                    <li><Link href="/balloons" className="text-gray-500 hover:text-teal-600">Шарики</Link></li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-900">Фольгированные шары</li>
                </ol>
            </nav>

            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Воздушные шарики</h1>
                <p className="text-gray-600">Большой выбор фольгированных и латексных шаров с доставкой по Киеву</p>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель - скрыта на мобильных */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <SidebarFilters />
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
                                {sortOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {/* Переключатель вида */}
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
                            <span className="font-medium">{FOIL_BALLOONS_PRODUCTS.length} товаров</span>
                        </div>
                    </div>

                    {/* Активные фильтры */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter) => (
                                    <span key={filter} className="inline-flex items-center gap-1 px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">
                                        {filter}
                                        <button
                                            className="ml-1 text-teal-600 hover:text-teal-800"
                                            aria-label={`Удалить фильтр ${filter}`}
                                            onClick={() => removeFilter(filter)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                <button
                                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                                    onClick={clearAllFilters}
                                >
                                    Очистить все
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Сетка товаров */}
                    <ProductGrid products={FOIL_BALLOONS_PRODUCTS} basePath="/balloons" />

                    {/* Пагинация */}
                    <div className="mt-12 flex items-center justify-center gap-1 sm:gap-2">
                        <button className="px-2 sm:px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                            ←
                        </button>
                        <button className="px-2 sm:px-3 py-2 bg-teal-600 text-white rounded text-sm">1</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">2</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">3</button>
                        <span className="px-1 sm:px-2 text-sm">...</span>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">8</button>
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
                                <SidebarFilters isMobile={true} />
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
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Фольгированные воздушные шары в Киеве</h2>
                <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                    <p className="mb-4">
                        Интернет-магазин "Шарики на дом" предлагает широкий выбор фольгированных воздушных шаров для любого праздника.
                        Фольгированные шары отличаются долговечностью, яркими цветами и способностью долго держать гелий.
                    </p>
                    <p className="mb-4">
                        В нашем каталоге представлены фольгированные шары различных форм: сердца, звезды, цифры, буквы и фигурные шары.
                        Все шары изготовлены из качественной фольги и безопасны для использования.
                    </p>
                    <p>
                        Мы осуществляем быструю доставку фольгированных шаров по Киеву в течение 2 часов.
                        Все шары наполняются качественным гелием, который обеспечивает полет до 7 дней.
                    </p>
                </div>
            </div>
        </div>
    )
}