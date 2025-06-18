'use client'

import { useState } from 'react'
import Link from 'next/link'
import ProductGrid from '@/components/ProductGrid/ProductGrid'
import { CategoryConfig, DEFAULT_SORT_OPTIONS } from '@/config/categoryConfig'
import SidebarFilters from './components/SidebarFilters'
import ToolbarSection from './components/ToolbarSection'
import ActiveFilters from './components/ActiveFilters'
import MobileFiltersModal from './components/MobileFiltersModal'
import PaginationSection from './components/PaginationSection'
import SEOSection from './components/SEOSection'

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
    const [activeFilters, setActiveFilters] = useState<string[]>(config.filters.map(f => f.name))

    // Автоматически генерируем breadcrumbs если не переданы
    const breadcrumbs = customBreadcrumbs || [
        { name: 'Главная', href: '/' },
        { name: config.title, href: config.basePath, current: true }
    ]

    // Используем кастомные опции сортировки если есть, иначе дефолтные
    const sortOptions = config.sortOptions || DEFAULT_SORT_OPTIONS

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
        const filter = config.filters.find(f => f.name === filterName)
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
                <h1 className="text-3xl font-bold mb-2">{config.title}</h1>
                <p className="text-gray-600">{config.description}</p>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель - скрыта на мобильных */}
                <div className="hidden lg:block w-80 flex-shrink-0">
                    <SidebarFilters categoryKey={categoryKey} config={config} />
                </div>

                <div className="flex-1">
                    {/* Тулбар с фильтрами и сортировкой */}
                    <ToolbarSection
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                        onShowMobileFilters={() => setShowMobileFilters(true)}
                        sortOptions={sortOptions}
                        productsCount={products.length}
                    />

                    {/* Активные фильтры */}
                    <ActiveFilters
                        activeFilters={activeFilters}
                        onRemoveFilter={removeFilter}
                        onClearAllFilters={clearAllFilters}
                        getFilterColor={getFilterColor}
                    />

                    {/* Сетка товаров */}
                    <ProductGrid products={products} basePath={config.basePath} />

                    {/* Пагинация */}
                    <PaginationSection />
                </div>
            </div>

            {/* Мобильные фильтры */}
            <MobileFiltersModal
                isOpen={showMobileFilters}
                onClose={closeMobileFilters}
                categoryKey={categoryKey}
                config={config}
            />

            {/* SEO блок */}
            <SEOSection
                title={config.seoTitle}
                description={config.seoDescription}
            />
        </div>
    )
}