'use client'

import { useTranslation } from '@/contexts/LanguageContext'

export interface ActiveFilterChip {
    key: string
    label: string
}

interface ActiveFiltersProps {
    activeFilters: ActiveFilterChip[]
    onRemoveFilter: (key: string) => void
    onClearAllFilters: () => void
    getFilterColor: (key: string) => string
}

export default function ActiveFilters({
    activeFilters,
    onRemoveFilter,
    onClearAllFilters,
    getFilterColor,
}: ActiveFiltersProps) {
    const { t } = useTranslation()
    if (activeFilters.length === 0) return null

    return (
        <div className="mb-6">
            <div className="flex flex-wrap gap-2">
                {activeFilters.map((chip) => (
                    <span
                        key={chip.key}
                        className={`inline-flex items-center gap-1 px-3 py-1 ${getFilterColor(chip.key)} rounded-full text-sm`}
                    >
                        {chip.label}
                        <button
                            type="button"
                            className="ml-1 text-teal-600 hover:text-teal-800"
                            aria-label={`${t('category.resetAll')} ${chip.label}`}
                            onClick={() => onRemoveFilter(chip.key)}
                        >
                            ×
                        </button>
                    </span>
                ))}
                <button
                    type="button"
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                    onClick={onClearAllFilters}
                >
                    {t('category.resetAll')}
                </button>
            </div>
        </div>
    )
}
