'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import ProductList from '@/components/ProductList/ProductList'
import { CategoryConfig, DEFAULT_SORT_OPTIONS } from '@/config/categoryConfig'
import SidebarFilters from './components/SidebarFilters'
import ToolbarSection from './components/ToolbarSection'
import ActiveFilters from './components/ActiveFilters'
import MobileFiltersModal from './components/MobileFiltersModal'
import type { FilterState } from '@/utils/categoryFilterEngine'
import {
    initialFilterState,
    filterProductsByFacets,
    buildActiveChips,
    applyRemoveChipKey,
    chipColorClass,
} from '@/utils/categoryFilterEngine'
import PaginationSection from './components/PaginationSection'
import SEOSection from './components/SEOSection'
import BannersList from '@/components/Banner/BannersList'
import { apiService, Banner } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'

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
    const { t, language } = useTranslation()
    const [sortBy, setSortBy] = useState('popular')
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [showMobileFilters, setShowMobileFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [categoryBanners, setCategoryBanners] = useState<Banner[]>([])
    const productsPerPage = 20
    const [filters, setFilters] = useState<FilterState>(() => initialFilterState(config.facets))

    useEffect(() => {
        setFilters(initialFilterState(config.facets))
        setCurrentPage(1)
    }, [categoryKey, config.basePath])

    // Загрузка баннеров для категорий
    useEffect(() => {
        const loadBanners = async () => {
            const banners = await apiService.getBanners('CATEGORY')
            setCategoryBanners(banners)
        }
        loadBanners()
    }, [])

    // Автоматически генерируем breadcrumbs если не переданы
    const breadcrumbs = (customBreadcrumbs || [
        { name: 'Home', href: '/' },
        { name: config.title, href: config.basePath, current: true }
    ]).map(breadcrumb => ({
        ...breadcrumb,
        name: breadcrumb.name === 'Home' ? t('category.homePage') : breadcrumb.name
    }))

    // Используем кастомные опции сортировки если есть, иначе дефолтные с переводами
    const sortOptions = config.sortOptions || [
        { value: 'popular', label: t('category.sortPopular') },
        { value: 'price-asc', label: t('category.sortPriceAsc') },
        { value: 'price-desc', label: t('category.sortPriceDesc') },
        { value: 'name-asc', label: t('category.sortNameAsc') },
        { value: 'name-desc', label: t('category.sortNameDesc') },
        { value: 'new', label: t('category.sortNew') }
    ]

    const filteredProducts = useMemo(
        () => filterProductsByFacets(products, config.facets, filters),
        [products, config.facets, filters]
    )

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

    const handleFiltersChange = (newFilters: FilterState) => {
        setFilters(newFilters)
        setCurrentPage(1)
    }

    const lang = (language === 'ru' || language === 'en' ? language : 'uk') as 'uk' | 'ru' | 'en'
    const activeFilterChips = useMemo(
        () => buildActiveChips(config.facets, filters, lang),
        [config.facets, filters, lang]
    )

    const removeFilter = (key: string) => {
        setFilters(applyRemoveChipKey(key, config.facets, filters))
    }

    const clearAllFilters = () => {
        setFilters(initialFilterState(config.facets))
    }

    const getFilterColor = (key: string) => chipColorClass(key)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbs.map((item, index) => (
                        <li key={item.name} suppressHydrationWarning>
                            {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                            {item.current ? (
                                <span className="text-gray-900" suppressHydrationWarning>{item.name}</span>
                            ) : (
                                <Link href={item.href} className="text-gray-500 hover:text-teal-600" suppressHydrationWarning>
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
                        config={config}
                        filters={filters}
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
                        activeFilters={activeFilterChips}
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('category.noProducts')}</h3>
                            <p className="text-gray-500 mb-4">{t('category.tryChangeFilters')}</p>
                            <button
                                onClick={clearAllFilters}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                {t('category.resetFilters')}
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
                config={config}
                filters={filters}
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