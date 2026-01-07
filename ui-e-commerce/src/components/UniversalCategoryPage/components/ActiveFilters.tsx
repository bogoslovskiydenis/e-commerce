'use client'

import { useTranslation } from '@/contexts/LanguageContext'

interface ActiveFiltersProps {
    activeFilters: string[];
    onRemoveFilter: (filterName: string) => void;
    onClearAllFilters: () => void;
    getFilterColor: (filterName: string) => string;
}

export default function ActiveFilters({
                                          activeFilters,
                                          onRemoveFilter,
                                          onClearAllFilters,
                                          getFilterColor
                                      }: ActiveFiltersProps) {
    const { t } = useTranslation()
    if (activeFilters.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                    <span
                        key={filter}
                        className={`inline-flex items-center gap-1 px-3 py-1 ${getFilterColor(filter)} rounded-full text-sm`}
                    >
            {filter}
                        <button
                            className="ml-1 text-teal-600 hover:text-teal-800"
                            aria-label={`${t('category.resetAll')} ${filter}`}
                            onClick={() => onRemoveFilter(filter)}
                        >
              ×
            </button>
          </span>
                ))}
                <button
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                    onClick={onClearAllFilters}
                >
                    {t('category.resetAll')}
                </button>
            </div>
        </div>
    )
}