'use client'

import Link from 'next/link'
import { CategoryConfig } from '@/config/categoryConfig'

interface SidebarFiltersProps {
    categoryKey: string;
    config: CategoryConfig;
    isMobile?: boolean;
}

export default function SidebarFilters({ categoryKey, config, isMobile = false }: SidebarFiltersProps) {
    return (
        <div className={`bg-white ${isMobile ? '' : 'rounded-lg border'}`}>
            {/* Категории */}
            <div className={`${isMobile ? 'p-4' : 'p-4 border-b'}`}>
                <h2 className="font-semibold text-lg mb-4">Категории</h2>
                <nav className="space-y-1">
                    {config.categories.map((category) => (
                        <Link
                            key={category.href}
                            href={category.href}
                            className="flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors text-gray-700 hover:bg-gray-50"
                        >
                            <span>{category.name}</span>
                            {category.count > 0 && (
                                <span className="text-gray-400 text-xs">({category.count})</span>
                            )}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Универсальные фильтры */}
            <div className="p-4 space-y-6">
                <h3 className="font-semibold text-base">Фильтры</h3>

                {/* Цена */}
                <div>
                    <h4 className="text-sm font-medium mb-3">Цена</h4>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="От"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                        <input
                            type="number"
                            placeholder="До"
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        />
                    </div>
                </div>

                {/* Фильтры для шариков */}
                {categoryKey === 'balloons' && (
                    <>
                        {/* Цвет */}
                        <div>
                            <h4 className="text-sm font-medium mb-3">Цвет</h4>
                            <div className="space-y-2">
                                {[
                                    { name: 'Красный', color: 'bg-red-500' },
                                    { name: 'Синий', color: 'bg-blue-500' },
                                    { name: 'Розовый', color: 'bg-pink-500' },
                                    { name: 'Золотой', color: 'bg-yellow-500' },
                                    { name: 'Серебряный', color: 'bg-gray-400' },
                                    { name: 'Зеленый', color: 'bg-green-500' }
                                ].map((color) => (
                                    <label key={color.name} className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
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
                                {['Фольга', 'Латекс'].map((material) => (
                                    <label key={material} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <span className="text-sm">{material}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* С гелием */}
                        <div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                <span className="text-sm">С гелием</span>
                            </label>
                        </div>
                    </>
                )}

                {/* Фильтры для стаканчиков */}
                {categoryKey === 'cups' && (
                    <>
                        {/* Материал */}
                        <div>
                            <h4 className="text-sm font-medium mb-3">Материал</h4>
                            <div className="space-y-2">
                                {['Бумажные', 'Пластиковые', 'Экологические'].map((material) => (
                                    <label key={material} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <span className="text-sm">{material}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Объем */}
                        <div>
                            <h4 className="text-sm font-medium mb-3">Объем</h4>
                            <div className="space-y-2">
                                {['200мл', '250мл', '300мл'].map((volume) => (
                                    <label key={volume} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <span className="text-sm">{volume}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Фильтры для подарков */}
                {categoryKey === 'gifts' && (
                    <>
                        {/* Тип подарка */}
                        <div>
                            <h4 className="text-sm font-medium mb-3">Тип подарка</h4>
                            <div className="space-y-2">
                                {['Мягкие игрушки', 'Сувениры', 'Украшения', 'Конфеты', 'Цветы'].map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                        <span className="text-sm">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* В наличии - для всех категорий */}
                <div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                        <span className="text-sm">В наличии</span>
                    </label>
                </div>

                <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">
                    Применить фильтры
                </button>
            </div>
        </div>
    )
}