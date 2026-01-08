'use client'

import { Grid, List, Filter } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

interface ToolbarSectionProps {
    sortBy: string;
    setSortBy: (value: string) => void;
    viewMode: 'grid' | 'list';
    setViewMode: (mode: 'grid' | 'list') => void;
    onShowMobileFilters: () => void;
    sortOptions: Array<{ value: string; label: string }>;
    productsCount: number;
}

export default function ToolbarSection({
                                           sortBy,
                                           setSortBy,
                                           viewMode,
                                           setViewMode,
                                           onShowMobileFilters,
                                           sortOptions,
                                           productsCount
                                       }: ToolbarSectionProps) {
    const { t, mounted } = useTranslation()
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Кнопка фильтров - только на мобильных */}
                <button
                    onClick={onShowMobileFilters}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    suppressHydrationWarning
                >
                    <Filter size={16} />
                    {mounted ? t('category.filters') : 'Фільтри'}
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
                        title={mounted ? t('category.grid') : 'Сітка'}
                        suppressHydrationWarning
                    >
                        <Grid size={18} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-white text-gray-600'}`}
                        title={mounted ? t('category.list') : 'Список'}
                        suppressHydrationWarning
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {/* Счетчик товаров */}
            <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                <span suppressHydrationWarning>
                    {mounted ? t('category.found') : 'Знайдено:'}
                </span>
                <span className="font-medium" suppressHydrationWarning>
                    {productsCount} {mounted ? t('category.items') : 'товарів'}
                </span>
            </div>
        </div>
    )
}