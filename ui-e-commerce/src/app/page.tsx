'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ProductSection from '@/components/ProductSection/ProductSection'
import type { CompatibleProduct } from '@/types/BalloonShop_types'

const CATEGORIES = [
    { name: 'Фольгированные шары', count: 245 },
    { name: 'Латексные шары', count: 187 },
    { name: 'Букеты из шаров', count: 156 },
    { name: 'Цифры из шаров', count: 45 },
    { name: 'Сердца', count: 89 },
    { name: 'Звезды', count: 67 }
]

const SALE_PRODUCTS: CompatibleProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/api/placeholder/300/300',
        category: 'hearts',
        link: '/products/hearts/1'
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'bouquets',
        link: '/products/bouquets/2'
    },
    {
        id: '3',
        name: 'Цифра "1" золотая',
        price: 350,
        oldPrice: 400,
        discount: 12,
        image: '/api/placeholder/300/300',
        category: 'numbers',
        link: '/products/numbers/3'
    }
]

export default function SalePage() {
    const [sortBy, setSortBy] = useState('popularity')
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок категории */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Распродажа</h1>
                <p className="text-gray-600 mt-2">
                    Скидки до 70% на выбранный ассортимент шариков
                </p>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель с категориями */}
                <aside className="w-64 flex-shrink-0">
                    <nav className="space-y-2">
                        {CATEGORIES.map((category) => (
                            <a
                                key={category.name}
                                href="#"
                                className="flex items-center justify-between px-2 py-2 text-sm rounded-lg hover:bg-gray-50"
                            >
                                <span>{category.name}</span>
                                <span className="text-gray-500">({category.count})</span>
                            </a>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1">
                    {/* Фильтры и сортировка */}
                    <div className="flex items-center justify-between mb-6 pb-4 border-b">
                        <div className="flex items-center gap-4">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="py-2 pl-3 pr-8 border rounded-lg appearance-none bg-white"
                            >
                                <option value="popularity">По популярности</option>
                                <option value="price-asc">От дешевых к дорогим</option>
                                <option value="price-desc">От дорогих к дешевым</option>
                                <option value="new">Новинки</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                Фильтры
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Найдено:</span>
                            <span className="font-medium">{SALE_PRODUCTS.length} товаров</span>
                        </div>
                    </div>

                    {/* Сетка товаров */}
                    <ProductSection products={SALE_PRODUCTS} />
                </div>
            </div>
        </div>
    )
}