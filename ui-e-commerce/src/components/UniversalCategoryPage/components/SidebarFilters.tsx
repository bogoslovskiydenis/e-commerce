'use client'

import { CategoryConfig } from '@/config/categoryConfig'
import type { CategoryFacet } from '@/config/categoryFacets'
import { facetLabel, optionLabel } from '@/config/categoryFacets'
import type { FilterState } from '@/utils/categoryFilterEngine'
import { useTranslation } from '@/contexts/LanguageContext'

interface SidebarFiltersProps {
    config: CategoryConfig
    filters: FilterState
    isMobile?: boolean
    onFiltersChange: (next: FilterState) => void
}

export default function SidebarFilters({
    config,
    filters,
    isMobile = false,
    onFiltersChange,
}: SidebarFiltersProps) {
    const { t, mounted, language } = useTranslation()
    const lang = language as 'uk' | 'ru' | 'en'

    const setFull = (next: FilterState) => {
        onFiltersChange(next)
    }

    const toggleMulti = (facetId: string, value: string) => {
        const cur = filters.multi[facetId] || []
        const nextArr = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]
        setFull({
            ...filters,
            multi: { ...filters.multi, [facetId]: nextArr },
        })
    }

    const setBool = (facetId: string, v: boolean) => {
        setFull({
            ...filters,
            boolean: { ...filters.boolean, [facetId]: v },
        })
    }

    const setPrice = (from: string, to: string) => {
        setFull({
            ...filters,
            priceRange: { from, to },
        })
    }

    const resetFilters = () => {
        const emptyMulti: Record<string, string[]> = {}
        const emptyBool: Record<string, boolean> = {}
        for (const f of config.facets) {
            if (f.type === 'multi') emptyMulti[f.id] = []
            if (f.type === 'boolean') emptyBool[f.id] = false
        }
        setFull({
            priceRange: { from: '', to: '' },
            multi: emptyMulti,
            boolean: emptyBool,
        })
    }

    const renderFacet = (f: CategoryFacet) => {
        if (f.type === 'range' && f.source === 'price') {
            return (
                <div key={f.id}>
                    <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                        {facetLabel(f, lang)}
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={mounted ? t('category.from') : 'Від'}
                            value={filters.priceRange.from}
                            onChange={(e) => setPrice(e.target.value, filters.priceRange.to)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            suppressHydrationWarning
                        />
                        <input
                            type="number"
                            placeholder={mounted ? t('category.to') : 'До'}
                            value={filters.priceRange.to}
                            onChange={(e) => setPrice(filters.priceRange.from, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            suppressHydrationWarning
                        />
                    </div>
                </div>
            )
        }

        if (f.type === 'boolean') {
            return (
                <div key={f.id}>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!filters.boolean[f.id]}
                            onChange={(e) => setBool(f.id, e.target.checked)}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm" suppressHydrationWarning>
                            {facetLabel(f, lang)}
                        </span>
                    </label>
                </div>
            )
        }

        if (f.type === 'multi' && f.options?.length) {
            const colorMode = f.id === 'colors'
            return (
                <div key={f.id}>
                    <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                        {facetLabel(f, lang)}
                    </h4>
                    <div className="space-y-2">
                        {f.options.map((opt) => (
                            <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={(filters.multi[f.id] || []).includes(opt.value)}
                                    onChange={() => toggleMulti(f.id, opt.value)}
                                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                />
                                {colorMode && opt.colorClass ? (
                                    <div className={`w-4 h-4 rounded-full ${opt.colorClass}`} />
                                ) : null}
                                <span className="text-sm" suppressHydrationWarning>
                                    {optionLabel(opt, lang)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )
        }

        return null
    }

    return (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border'}`}>
            <div className={`${isMobile ? 'p-4' : 'p-4 border-b'}`} />
            <div className="p-4 space-y-6">
                <h3 className="font-semibold text-base" suppressHydrationWarning>
                    {mounted ? t('category.filters') : 'Фільтри'}
                </h3>
                {config.facets.map((f) => renderFacet(f))}
                <div className="space-y-3 pt-4">
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                        suppressHydrationWarning
                    >
                        {mounted ? t('category.resetAll') : 'Скинути все'}
                    </button>
                </div>
            </div>
        </div>
    )
}
