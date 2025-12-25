'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import ProductList from '@/components/ProductList/ProductList'
import { CategoryConfig, DEFAULT_SORT_OPTIONS } from '@/config/categoryConfig'
import SidebarFilters, { FilterState } from './components/SidebarFilters'
import ToolbarSection from './components/ToolbarSection'
import ActiveFilters from './components/ActiveFilters'
import MobileFiltersModal from './components/MobileFiltersModal'
import PaginationSection from './components/PaginationSection'
import SEOSection from './components/SEOSection'
import BannersList from '@/components/Banner/BannersList'
import { apiService, Banner } from '@/services/api'

interface UniversalCategoryPageProps {
    categoryKey: string;
    config: CategoryConfig;
    products: any[];
    customBreadcrumbs?: Array<{ name: string; href: string; current?: boolean }>;
}

export default function UniversalCategoryPage({
                                                  categoryKey,
                                                  config,
                                                  products,
                                                  customBreadcrumbs
                                              }: UniversalCategoryPageProps) {
    const [sortBy, setSortBy] = useState('popular')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [categoryBanners, setCategoryBanners] = useState<Banner[]>([])
    const productsPerPage = 20
    const [filters, setFilters] = useState<FilterState>({
        priceRange: { from: '', to: '' },
        colors: [],
        materials: [],
        withHelium: false,
        inStock: false,
        volume: [],
        giftTypes: []
    })

    // Загрузка баннеров для категорий
    useEffect(() => {
        const loadBanners = async () => {
            const banners = await apiService.getBanners('CATEGORY')
            setCategoryBanners(banners)
        }
        loadBanners()
    }, [])

    // Автоматически генерируем breadcrumbs если не переданы
    const breadcrumbs = customBreadcrumbs || [
        { name: 'Главная', href: '/' },
        { name: config.title, href: config.basePath, current: true }
    ]

    // Используем кастомные опции сортировки если есть, иначе дефолтные
    const sortOptions = config.sortOptions || DEFAULT_SORT_OPTIONS

    // Фильтрация товаров
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Фильтр по цене
            if (filters.priceRange.from && product.price < parseFloat(filters.priceRange.from)) {
                return false
            }
            if (filters.priceRange.to && product.price > parseFloat(filters.priceRange.to)) {
                return false
            }

            // Фильтр по цвету
            if (filters.colors.length > 0) {
                const productColors = product.colors || []
                const hasMatchingColor = filters.colors.some(filterColor => {
                    return productColors.some((productColor: string) => {
                        const colorMap: Record<string, string[]> = {
                            'red': ['Красный', 'красный'],
                            'blue': ['Синий', 'синий'],
                            'pink': ['Розовый', 'розовый'],
                            'gold': ['Золотой', 'золотой'],
                            'silver': ['Серебряный', 'серебряный'],
                            'green': ['Зеленый', 'зеленый']
                        }
                        return colorMap[filterColor]?.includes(productColor) || false
                    })
                })
                if (!hasMatchingColor) return false
            }

            // Фильтр по материалу
            if (filters.materials.length > 0) {
                const productMaterial = product.material || ''
                const hasMatchingMaterial = filters.materials.some(filterMaterial => {
                    const materialMap: Record<string, string[]> = {
                        'Фольга': ['Фольга', 'фольга'],
                        'Латекс': ['Латекс', 'латекс'],
                        'Бумажные': ['Бумага', 'бумага'],
                        'Пластиковые': ['Пластик', 'пластик'],
                        'Экологические': ['Эко', 'эко']
                    }
                    return materialMap[filterMaterial]?.includes(productMaterial) || false
                })
                if (!hasMatchingMaterial) return false
            }

            // Фильтр по гелию
            if (filters.withHelium && !product.withHelium) {
                return false
            }

            // Фильтр по наличию
            if (filters.inStock && !product.inStock) {
                return false
            }

            // Фильтр по объему (для стаканчиков)
            if (filters.volume && filters.volume.length > 0) {
                const productSize = product.size || ''
                const hasMatchingVolume = filters.volume.some(filterVolume => {
                    return productSize.includes(filterVolume.replace('мл', ''))
                })
                if (!hasMatchingVolume) return false
            }

            // Фильтр по типу подарка
            if (filters.giftTypes && filters.giftTypes.length > 0) {
                const productType = product.type || ''
                const hasMatchingGiftType = filters.giftTypes.some(filterType => {
                    const typeMap: Record<string, string[]> = {
                        'Мягкие игрушки': ['plush'],
                        'Сувениры': ['souvenir'],
                        'Украшения': ['jewelry'],
                        'Конфеты': ['sweets'],
                        'Цветы': ['flowers']
                    }
                    return typeMap[filterType]?.includes(productType) || false
                })
                if (!hasMatchingGiftType) return false
            }

            return true
        })
    }, [products, filters])

    // Сортировка товаров
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts]

        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) => a.price - b.price)
            case 'price-desc':
                return sorted.sort((a, b) => b.price - a.price)
            case 'name-asc':
                return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
            case 'name-desc':
                return sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
            case 'new':
                return sorted.sort((a, b) => b.id.localeCompare(a.id))
            case 'discount':
                return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0))
            case 'items':
                return sorted.sort((a, b) => (b.items?.length || 0) - (a.items?.length || 0))
            default: // popular
                return sorted
        }
    }, [filteredProducts, sortBy])

    // Пагинация товаров
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage)
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * productsPerPage
        const endIndex = startIndex + productsPerPage
        return sortedProducts.slice(startIndex, endIndex)
    }, [sortedProducts, currentPage, productsPerPage])

    // Сброс на первую страницу при изменении фильтров или сортировки
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Функция для закрытия мобильных фильтров
    const closeMobileFilters = () => {
        setShowMobileFilters(false)
    }

    // Обработка изменения фильтров
    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters)
        setCurrentPage(1) // Сброс на первую страницу при изменении фильтров
    }

    // Получение активных фильтров для отображения
    const getActiveFilters = (): string[] => {
        const active: string[] = []

        if (filters.priceRange.from || filters.priceRange.to) {
            const from = filters.priceRange.from || '0'
            const to = filters.priceRange.to || '∞'
            active.push(`Цена: ${from} - ${to} грн`)
        }

        if (filters.colors.length > 0) {
            const colorNames: Record<string, string> = {
                'red': 'Красный',
                'blue': 'Синий',
                'pink': 'Розовый',
                'gold': 'Золотой',
                'silver': 'Серебряный',
                'green': 'Зеленый'
            }
            filters.colors.forEach(color => {
                active.push(colorNames[color] || color)
            })
        }

        if (filters.materials.length > 0) {
            filters.materials.forEach(material => active.push(material))
        }

        if (filters.withHelium) {
            active.push('С гелием')
        }

        if (filters.inStock) {
            active.push('В наличии')
        }

        if (filters.volume && filters.volume.length > 0) {
            filters.volume.forEach(volume => active.push(volume))
        }

        if (filters.giftTypes && filters.giftTypes.length > 0) {
            filters.giftTypes.forEach(type => active.push(type))
        }

        return active
    }

    // Функция для удаления конкретного фильтра
    const removeFilter = (filterName: string) => {
        const newFilters = { ...filters }

        // Удаление фильтра по цене
        if (filterName.startsWith('Цена:')) {
            newFilters.priceRange = { from: '', to: '' }
        }

        // Удаление цветового фильтра
        const colorNames: Record<string, string> = {
            'Красный': 'red',
            'Синий': 'blue',
            'Розовый': 'pink',
            'Золотой': 'gold',
            'Серебряный': 'silver',
            'Зеленый': 'green'
        }
        if (colorNames[filterName]) {
            newFilters.colors = newFilters.colors.filter(c => c !== colorNames[filterName])
        }

        // Удаление материала
        if (newFilters.materials.includes(filterName)) {
            newFilters.materials = newFilters.materials.filter(m => m !== filterName)
        }

        // Удаление других фильтров
        if (filterName === 'С гелием') {
            newFilters.withHelium = false
        }
        if (filterName === 'В наличии') {
            newFilters.inStock = false
        }

        // Удаление объема
        if (newFilters.volume?.includes(filterName)) {
            newFilters.volume = newFilters.volume.filter(v => v !== filterName)
        }

        // Удаление типа подарка
        if (newFilters.giftTypes?.includes(filterName)) {
            newFilters.giftTypes = newFilters.giftTypes.filter(g => g !== filterName)
        }

        setFilters(newFilters)
    }

    // Функция для очистки всех фильтров
    const clearAllFilters = () => {
        const defaultFilters: FilterState = {
            priceRange: { from: '', to: '' },
            colors: [],
            materials: [],
            withHelium: false,
            inStock: false,
            volume: [],
            giftTypes: []
        }
        setFilters(defaultFilters)
    }

    // Определение цвета для фильтра
    const getFilterColor = (filterName: string) => {
        if (filterName.startsWith('Цена:')) return 'bg-amber-100 text-amber-800'
        if (['Красный', 'Синий', 'Розовый', 'Золотой', 'Серебряный', 'Зеленый'].includes(filterName)) {
            return 'bg-blue-100 text-blue-800'
        }
        if (['Фольга', 'Латекс', 'Бумажные', 'Пластиковые', 'Экологические'].includes(filterName)) {
            return 'bg-purple-100 text-purple-800'
        }
        if (filterName === 'С гелием') return 'bg-teal-100 text-teal-800'
        if (filterName === 'В наличии') return 'bg-green-100 text-green-800'
        return 'bg-gray-100 text-gray-800'
    }

    const activeFilters = getActiveFilters()

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
                <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
                <p className="text-gray-600">{config.description}</p>
            </div>

            {/* Баннеры для категорий */}
            {categoryBanners.length > 0 && (
                <div className="mb-8">
                    <BannersList 
                        banners={categoryBanners} 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    />
                </div>
            )}

            <div className="flex gap-8">
                {/* Боковая панель - скрыта на мобильных */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <SidebarFilters
                        categoryKey={categoryKey}
                        config={config}
                        onFiltersChange={handleFiltersChange}
                    />
                </div>

                <div className="flex-1">
                    {/* Тулбар с фильтрами и сортировкой */}
                    <ToolbarSection
                        sortBy={sortBy}
                        setSortBy={(newSort) => {
                            setSortBy(newSort)
                            setCurrentPage(1) // Сброс на первую страницу при изменении сортировки
                        }}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onShowMobileFilters={() => setShowMobileFilters(true)}
                        sortOptions={sortOptions}
                        productsCount={sortedProducts.length}
                    />

                    {/* Активные фильтры */}
                    <ActiveFilters
                        activeFilters={activeFilters}
                        onRemoveFilter={removeFilter}
                        onClearAllFilters={clearAllFilters}
                        getFilterColor={getFilterColor}
                    />

                    {/* Товары в сетке или списке */}
                    {viewMode === 'grid' ? (
                        <ProductGrid products={paginatedProducts} basePath={config.basePath} />
                    ) : (
                        <ProductList products={paginatedProducts} basePath={config.basePath} />
                    )}

                    {/* Сообщение если нет товаров */}
                    {sortedProducts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.002-5.824-2.709" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Товары не найдены</h3>
                            <p className="text-gray-500 mb-4">Попробуйте изменить параметры фильтрации</p>
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    )}

                    {/* Пагинация */}
                    {sortedProducts.length > 0 && totalPages > 1 && (
                        <PaginationSection
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Мобильные фильтры */}
            <MobileFiltersModal
                isOpen={showMobileFilters}
                onClose={closeMobileFilters}
                categoryKey={categoryKey}
                config={config}
                onFiltersChange={handleFiltersChange}
            />

            {/* SEO блок */}
            <SEOSection
                title={config.seoTitle}
                description={config.seoDescription}
            />
        </div>
    )
}