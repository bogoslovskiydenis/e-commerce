'use client'

import { useState } from 'react'
import { ChevronDown, Grid, List, X, Filter } from 'lucide-react'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import Sidebar from '@/components/Sidebar/Sidebar'
import Link from 'next/link'

interface ProductSectionPageProps {
    title: string;
    description: string;
    breadcrumbs: { name: string; href: string; current?: boolean }[];
    products: any[];
    seoTitle: string;
    seoDescription: string[];
    sortOptions?: { value: string; label: string }[];
    sidebarCategories?: { name: string; count: number; href: string }[];
    filters?: { name: string; color?: string }[];
}

// Default sort options
const DEFAULT_SORT_OPTIONS = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price-asc', label: 'Сначала дешевые' },
    { value: 'price-desc', label: 'Сначала дорогие' },
    { value: 'name-asc', label: 'По названию А-Я' },
    { value: 'name-desc', label: 'По названию Я-А' },
    { value: 'new', label: 'Новинки' },
]

export default function ProductSectionPage({
                                               title,
                                               description,
                                               breadcrumbs,
                                               products,
                                               seoTitle,
                                               seoDescription,
                                               sortOptions = DEFAULT_SORT_OPTIONS,
                                               sidebarCategories,
                                               filters = []
                                           }: ProductSectionPageProps) {
    const [sortBy, setSortBy] = useState('popular')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [activeFilters, setActiveFilters] = useState<string[]>(filters.map(f => f.name))

    // Функция для закрытия мобильных фильтров
    const closeMobileFilters = () => {
        setShowMobileFilters(false)
    }

    // Функция для удаления фильтра
    const removeFilter = (filterName: string) => {
        setActiveFilters(activeFilters.filter(f => f !== filterName))
    }

    // Функция для очистки всех фильтров
    const clearAllFilters = () => {
        setActiveFilters([])
    }

    // Определение цвета для фильтра
    const getFilterColor = (filterName: string) => {
        const filter = filters.find(f => f.name === filterName)
        return filter?.color || 'bg-teal-100 text-teal-800'
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((item, index) => (
                        <li key={item.name}>
                            {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                            {item.current ? (
                                <span className="text-gray-900">{item.name}</span>
                            ) : (
                                <Link href={item.href} className="text-gray-500 hover:text-teal-600">
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель - скрыта на мобильных */}
                <div className="hidden lg:block">
                    <Sidebar categories={sidebarCategories} />
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
                            <span className="font-medium">{products.length} товаров</span>
                        </div>
                    </div>

                    {/* Активные фильтры */}
                    {activeFilters.length > 0 && (
                        <div className="mb-6">
                            <div className="flex flex-wrap gap-2">
                                {activeFilters.map((filter) => (
                                    <span key={filter} className={`inline-flex items-center gap-1 px-3 py-1 ${getFilterColor(filter)} rounded-full text-sm`}>
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
                    <ProductGrid products={products} />

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
                                <Sidebar categories={sidebarCategories} />
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
                <h2 className="text-xl sm:text-2xl font-bold mb-4">{seoTitle}</h2>
                <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                    {seoDescription.map((paragraph, index) => (
                        <p key={index} className={index < seoDescription.length - 1 ? "mb-4" : ""}>
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    )
}