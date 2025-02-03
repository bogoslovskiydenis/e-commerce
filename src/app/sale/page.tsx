'use client'

import { useState } from 'react'
import ProductSection from '@/components/ProductSection'
import { ChevronDown } from 'lucide-react'
import type { Product } from '@/types'

const CATEGORIES = [
    { name: 'Плаття', count: 1234 },
    { name: 'Блузи', count: 856 },
    { name: 'Джинси', count: 654 },
    { name: 'Спідниці', count: 432 },
    { name: 'Взуття', count: 1567 },
    { name: 'Аксесуари', count: 987 }
]

const SALE_PRODUCTS: Product[] = [
    {
        id: '1',
        brand: 'Zara',
        title: 'Платье · Чорний',
        price: 2199,
        oldPrice: 2899,
        discount: 24,
        image: '/images/products/women/zara-dress.jpg',
        category: 'dresses',
        link: '/products/zara-dress'
    },
    {
        id: '2',
        brand: 'H&M',
        title: 'Блуза · Білий',
        price: 1299,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/hm-blouse.jpg',
        category: 'blouses',
        link: '/products/hm-blouse'
    },
    {
        id: '3',
        brand: "Levi's",
        title: 'Джинси · Синій',
        price: 2899,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/levis-jeans.jpg',
        category: 'jeans',
        link: '/products/levis-jeans'
    }
]

export default function SalePage() {
    const [sortBy, setSortBy] = useState('popularity')
    const [showFilters, setShowFilters] = useState(false)

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Заголовок категории */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Розпродаж</h1>
                <p className="text-gray-600 mt-2">
                    Знижки до -70% на обраний асортимент
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
                                <span className="text-gray-500">{category.count}</span>
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
                                <option value="popularity">За популярністю</option>
                                <option value="price-asc">Від дешевих до дорогих</option>
                                <option value="price-desc">Від дорогих до дешевих</option>
                                <option value="new">Новинки</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                Фільтри
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Знайдено:</span>
                            <span className="font-medium">123 товари</span>
                        </div>
                    </div>

                    {/* Сетка товаров */}
                    <ProductSection products={SALE_PRODUCTS} />
                </div>
            </div>
        </div>
    )
}