'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryConfig } from '@/config/categoryConfig'
import { useTranslation } from '@/contexts/LanguageContext'

interface SidebarFiltersProps {
    categoryKey: string;
    config: CategoryConfig;
    isMobile?: boolean;
    onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
    priceRange: { from: string; to: string };
    colors: string[];
    materials: string[];
    withHelium: boolean;
    inStock: boolean;
    volume?: string[];
    giftTypes?: string[];
}

export default function SidebarFilters({
                                           categoryKey,
                                           config,
                                           isMobile = false,
                                           onFiltersChange
                                       }: SidebarFiltersProps) {
    const { t, mounted } = useTranslation()
    const [filters, setFilters] = useState<FilterState>({
        priceRange: { from: '', to: '' },
        colors: [],
        materials: [],
        withHelium: false,
        inStock: false, // По умолчанию показываем все товары
        volume: [],
        giftTypes: []
    })

    // Обновление фильтров
    const updateFilters = (newFilters: Partial<FilterState>) => {
        const updatedFilters = { ...filters, ...newFilters }
        setFilters(updatedFilters)
        onFiltersChange?.(updatedFilters)
    }

    // Обработка изменения цвета
    const handleColorChange = (colorValue: string) => {
        const newColors = filters.colors.includes(colorValue)
            ? filters.colors.filter(c => c !== colorValue)
            : [...filters.colors, colorValue]
        updateFilters({ colors: newColors })
    }

    // Обработка изменения материала
    const handleMaterialChange = (material: string) => {
        const newMaterials = filters.materials.includes(material)
            ? filters.materials.filter(m => m !== material)
            : [...filters.materials, material]
        updateFilters({ materials: newMaterials })
    }

    // Обработка изменения объема (для стаканчиков)
    const handleVolumeChange = (volume: string) => {
        const newVolumes = filters.volume?.includes(volume)
            ? filters.volume.filter(v => v !== volume)
            : [...(filters.volume || []), volume]
        updateFilters({ volume: newVolumes })
    }

    // Обработка изменения типа подарка
    const handleGiftTypeChange = (giftType: string) => {
        const newGiftTypes = filters.giftTypes?.includes(giftType)
            ? filters.giftTypes.filter(g => g !== giftType)
            : [...(filters.giftTypes || []), giftType]
        updateFilters({ giftTypes: newGiftTypes })
    }

    // Применение фильтров
    const applyFilters = () => {
        onFiltersChange?.(filters)
    }

    // Сброс фильтров
    const resetFilters = () => {
        const defaultFilters: FilterState = {
            priceRange: { from: '', to: '' },
            colors: [],
            materials: [],
            withHelium: false,
            inStock: true,
            volume: [],
            giftTypes: []
        }
        setFilters(defaultFilters)
        onFiltersChange?.(defaultFilters)
    }

    return (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border'}`}>
            {/* Категории */}
            <div className={`${isMobile ? 'p-4' : 'p-4 border-b'}`}>
                {/*<h2 className="font-semibold text-lg mb-4">Категории</h2>*/}
                {/*<nav className="space-y-1">*/}
                {/*    {config.categories.map((category) => (*/}
                {/*        <Link*/}
                {/*            key={category.href}*/}
                {/*            href={category.href}*/}
                {/*            className="flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-gray-700 hover:bg-gray-50"*/}
                {/*        >*/}
                {/*            <span>{category.name}</span>*/}
                {/*            {category.count > 0 && (*/}
                {/*                <span className="text-gray-400 text-xs">({category.count})</span>*/}
                {/*            )}*/}
                {/*        </Link>*/}
                {/*    ))}*/}
                {/*</nav>*/}
            </div>

            {/* Фильтры */}
            <div className="p-4 space-y-6">
                <h3 className="font-semibold text-base" suppressHydrationWarning>
                    {mounted ? t('category.filters') : 'Фільтри'}
                </h3>

                {/* Цена */}
                <div>
                    <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                        {mounted ? t('category.price') : 'Ціна'}
                    </h4>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={mounted ? t('category.from') : 'Від'}
                            value={filters.priceRange.from}
                            onChange={(e) => updateFilters({
                                priceRange: { ...filters.priceRange, from: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            suppressHydrationWarning
                        />
                        <input
                            type="number"
                            placeholder={mounted ? t('category.to') : 'До'}
                            value={filters.priceRange.to}
                            onChange={(e) => updateFilters({
                                priceRange: { ...filters.priceRange, to: e.target.value }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                            suppressHydrationWarning
                        />
                    </div>
                </div>

                {/* Цвет */}
                <div>
                    <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                        {mounted ? t('category.color') : 'Колір'}
                    </h4>
                    <div className="space-y-2">
                        {[
                            { name: mounted ? t('category.red') : 'Червоний', value: 'red', color: 'bg-red-500' },
                            { name: mounted ? t('category.blue') : 'Синій', value: 'blue', color: 'bg-blue-500' },
                            { name: mounted ? t('category.pink') : 'Рожевий', value: 'pink', color: 'bg-pink-500' },
                            { name: mounted ? t('category.gold') : 'Золотий', value: 'gold', color: 'bg-yellow-500' },
                            { name: mounted ? t('category.silver') : 'Срібний', value: 'silver', color: 'bg-gray-400' },
                            { name: mounted ? t('category.green') : 'Зелений', value: 'green', color: 'bg-green-500' }
                        ].map((color) => (
                            <label key={color.value} className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.colors.includes(color.value)}
                                    onChange={() => handleColorChange(color.value)}
                                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                />
                                <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                                <span className="text-sm" suppressHydrationWarning>{color.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Материал для шариков */}
                {categoryKey === 'balloons' && (
                    <div>
                        <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                            {mounted ? t('category.material') : 'Матеріал'}
                        </h4>
                        <div className="space-y-2">
                            {[
                                mounted ? t('category.foil') : 'Фольга',
                                mounted ? t('category.latex') : 'Латекс'
                            ].map((material) => (
                                <label key={material} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.materials.includes(material)}
                                        onChange={() => handleMaterialChange(material)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="text-sm" suppressHydrationWarning>{material}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Материал для стаканчиков */}
                {categoryKey === 'cups' && (
                    <div>
                        <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                            {mounted ? t('category.material') : 'Матеріал'}
                        </h4>
                        <div className="space-y-2">
                            {[
                                mounted ? t('category.paper') : 'Паперові',
                                mounted ? t('category.plastic') : 'Пластикові',
                                mounted ? t('category.eco') : 'Екологічні'
                            ].map((material) => (
                                <label key={material} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.materials.includes(material)}
                                        onChange={() => handleMaterialChange(material)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="text-sm" suppressHydrationWarning>{material}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Объем для стаканчиков */}
                {categoryKey === 'cups' && (
                    <div>
                        <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                            {mounted ? t('category.volume') : 'Об\'єм'}
                        </h4>
                        <div className="space-y-2">
                            {['200мл', '250мл', '300мл'].map((volume) => (
                                <label key={volume} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.volume?.includes(volume) || false}
                                        onChange={() => handleVolumeChange(volume)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="text-sm">{volume}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Тип подарка для подарков */}
                {categoryKey === 'gifts' && (
                    <div>
                        <h4 className="text-sm font-medium mb-3" suppressHydrationWarning>
                            {mounted ? t('category.giftType') : 'Тип подарунка'}
                        </h4>
                        <div className="space-y-2">
                            {[
                                mounted ? t('category.plush') : 'М\'які іграшки',
                                mounted ? t('category.souvenirs') : 'Сувеніри',
                                mounted ? t('category.jewelry') : 'Прикраси',
                                mounted ? t('category.sweets') : 'Цукерки',
                                mounted ? t('category.flowers') : 'Квіти'
                            ].map((type) => (
                                <label key={type} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.giftTypes?.includes(type) || false}
                                        onChange={() => handleGiftTypeChange(type)}
                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="text-sm" suppressHydrationWarning>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* С гелием - только для шариков и букетов */}
                {(categoryKey === 'balloons' || categoryKey === 'bouquets') && (
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.withHelium}
                                onChange={(e) => updateFilters({ withHelium: e.target.checked })}
                                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                            />
                            <span className="text-sm" suppressHydrationWarning>
                                {mounted ? t('category.withHelium') : 'З гелієм'}
                            </span>
                        </label>
                    </div>
                )}

                {/* В наличии - для всех категорий */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => updateFilters({ inStock: e.target.checked })}
                            className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                        />
                        <span className="text-sm" suppressHydrationWarning>
                            {mounted ? t('category.inStock') : 'В наявності'}
                        </span>
                    </label>
                </div>

                {/* Кнопки */}
                <div className="space-y-3 pt-4">
                    <button
                        onClick={applyFilters}
                        className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors"
                        suppressHydrationWarning
                    >
                        {mounted ? t('category.applyFilters') : 'Застосувати фільтри'}
                    </button>
                    <button
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