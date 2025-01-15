'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FilterModal } from './FilterModal'

const sortOptions = [
    { value: 'popular', label: 'За популярністю' },
    { value: 'price-asc', label: 'Від дешевих до дорогих' },
    { value: 'price-desc', label: 'Від дорогих до дешевих' },
    { value: 'new', label: 'Новинки' },
]

export default function Filters() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sortBy, setSortBy] = useState('popular')

    return (
        <>
            <div className="flex items-center justify-between py-4 border-b mb-6">
                <div className="flex items-center gap-4">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="py-2 pl-3 pr-8 border rounded-lg appearance-none bg-white"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsModalOpen(true)}
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

            <FilterModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}