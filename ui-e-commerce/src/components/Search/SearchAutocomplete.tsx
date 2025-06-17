'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SearchHistory {
    id: string
    query: string
    timestamp: number
}

interface RecentProduct {
    id: string
    name: string
    price: number
    image: string
    category: string
    href: string
}

interface SearchAutocompleteProps {
    placeholder?: string
    className?: string
}

// Моковые данные для истории поиска
const MOCK_SEARCH_HISTORY: SearchHistory[] = [
    { id: '1', query: 'фольгированные сердца', timestamp: Date.now() - 1000 * 60 * 30 },
    { id: '2', query: 'букет день рождения', timestamp: Date.now() - 1000 * 60 * 60 * 2 },
    { id: '3', query: 'шары с гелием', timestamp: Date.now() - 1000 * 60 * 60 * 24 },
]

// Моковые данные для недавно просмотренных товаров
const MOCK_RECENT_PRODUCTS: RecentProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        price: 150,
        image: '/images/hard.jpg',
        category: 'hearts',
        href: '/balloons/hearts/1'
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'bouquets',
        href: '/products/bouquets/2'
    },
    {
        id: '3',
        name: 'Звезда золотая',
        price: 120,
        image: '/images/hard.jpg',
        category: 'stars',
        href: '/products/stars/2'
    }
]

// Популярные поисковые запросы
const POPULAR_SEARCHES = [
    'фольгированные шары',
    'букеты из шаров',
    'день рождения',
    'свадебные шары',
    'детские наборы',
    'цифры из шаров'
]

export default function SearchAutocomplete({
                                               placeholder = "Пошук шариків, подарків, стаканчиків...",
                                               className = ""
                                           }: SearchAutocompleteProps) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])

    // Загрузка истории поиска из localStorage при инициализации
    useEffect(() => {
        const savedHistory = localStorage.getItem('search_history')
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory)
                setSearchHistory(parsed)
            } catch (error) {
                console.error('Error parsing search history:', error)
                setSearchHistory(MOCK_SEARCH_HISTORY)
            }
        } else {
            setSearchHistory(MOCK_SEARCH_HISTORY)
        }
    }, [])
    const [recentProducts] = useState<RecentProduct[]>(MOCK_RECENT_PRODUCTS)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Сохранение истории поиска в localStorage при изменении
    useEffect(() => {
        if (searchHistory.length > 0) {
            localStorage.setItem('search_history', JSON.stringify(searchHistory))
        }
    }, [searchHistory])

    // Закрытие дропдауна при клике вне его
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Обработка поиска
    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim()) {
            // Добавляем в историю
            const newHistoryItem: SearchHistory = {
                id: Date.now().toString(),
                query: searchQuery.trim(),
                timestamp: Date.now()
            }
            setSearchHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]) // Ограничиваем 10 элементами

            // Выполняем поиск (здесь можно добавить логику перехода на страницу результатов)
            console.log('Searching for:', searchQuery)
            setQuery('')
            setIsOpen(false)
        }
    }

    // Обработка нажатия Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(query)
        }
        if (e.key === 'Escape') {
            setIsOpen(false)
            inputRef.current?.blur()
        }
    }

    // Удаление элемента из истории
    const removeFromHistory = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setSearchHistory(prev => prev.filter(item => item.id !== id))
    }

    // Очистка всей истории
    const clearHistory = () => {
        setSearchHistory([])
        localStorage.removeItem('search_history')
    }

    // Обработка клика по элементу истории или популярному запросу
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion)
        handleSearch(suggestion)
    }

    // Фильтрованные результаты
    const filteredHistory = query
        ? searchHistory.filter(item =>
            item.query.toLowerCase().includes(query.toLowerCase())
        )
        : searchHistory

    const filteredPopular = query
        ? POPULAR_SEARCHES.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        )
        : POPULAR_SEARCHES.slice(0, 4)

    return (
        <div ref={searchRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
                />
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                />
                {query && (
                    <button
                        onClick={() => {
                            setQuery('')
                            inputRef.current?.focus()
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Dropdown с результатами */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {/* История поиска */}
                    {filteredHistory.length > 0 && (
                        <div className="p-4 border-b">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                    <Clock size={16} />
                                    Історія перегляду
                                </h3>
                                {searchHistory.length > 0 && (
                                    <button
                                        onClick={clearHistory}
                                        className="text-xs text-teal-600 hover:text-teal-700"
                                    >
                                        Видалити
                                    </button>
                                )}
                            </div>
                            <div className="space-y-1">
                                {filteredHistory.slice(0, 5).map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
                                        onClick={() => handleSuggestionClick(item.query)}
                                    >
                                        <span className="text-sm text-gray-700 flex-1">
                                            {item.query}
                                        </span>
                                        <button
                                            onClick={(e) => removeFromHistory(item.id, e)}
                                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 p-1"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Недавно просмотренные товары */}
                    {!query && recentProducts.length > 0 && (
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Нещодавно переглянуті
                            </h3>
                            <div className="space-y-2">
                                {recentProducts.slice(0, 3).map((product) => (
                                    <Link
                                        key={product.id}
                                        href={product.href}
                                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded group"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-teal-600">
                                                {product.name}
                                            </p>
                                            <p className="text-sm text-teal-600 font-medium">
                                                {product.price} грн
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Популярные запросы */}
                    {filteredPopular.length > 0 && (
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                                <TrendingUp size={16} />
                                Популярні запити
                            </h3>
                            <div className="space-y-1">
                                {filteredPopular.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="block w-full text-left text-sm text-gray-700 hover:bg-gray-50 px-2 py-1 rounded"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Пустое состояние */}
                    {query && filteredHistory.length === 0 && filteredPopular.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">Нічого не знайдено</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}