'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { apiService, Product } from '@/services/api'

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

// Популярные поисковые запросы (можно загружать из API в будущем)
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
    const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([])
    const [searchResults, setSearchResults] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Загрузка истории поиска из localStorage при инициализации
    useEffect(() => {
        const savedHistory = localStorage.getItem('search_history')
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory)
                setSearchHistory(parsed)
            } catch (error) {
                console.error('Error parsing search history:', error)
                setSearchHistory([])
            }
        }
    }, [])

    // Загрузка недавно просмотренных товаров из localStorage
    useEffect(() => {
        const savedRecent = localStorage.getItem('recent_products')
        if (savedRecent) {
            try {
                const parsed = JSON.parse(savedRecent)
                setRecentProducts(parsed.slice(0, 3)) // Берем последние 3
            } catch (error) {
                console.error('Error parsing recent products:', error)
            }
        }
    }, [])

    // Загрузка результатов поиска из API при вводе запроса
    useEffect(() => {
        if (query.trim().length >= 2) {
            const searchTimeout = setTimeout(async () => {
                try {
                    setIsLoading(true)
                    const results = await apiService.searchProducts(query, 5)
                    setSearchResults(results)
                } catch (error) {
                    console.error('Error searching products:', error)
                    setSearchResults([])
                } finally {
                    setIsLoading(false)
                }
            }, 300) // Debounce 300ms

            return () => clearTimeout(searchTimeout)
        } else {
            setSearchResults([])
        }
    }, [query])
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
            setSearchHistory(prev => [newHistoryItem, ...prev.filter(item => item.query !== searchQuery.trim()).slice(0, 9)]) // Ограничиваем 10 элементами, убираем дубликаты

            // Переход на страницу результатов поиска
            window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
        }
    }

    // Сохранение товара в недавно просмотренные
    const addToRecentProducts = (product: Product) => {
        const recentProduct: RecentProduct = {
            id: product.id,
            name: product.title || product.name || '',
            price: Number(product.price) || 0,
            image: product.images?.[0] || product.image || '/api/placeholder/300/300',
            category: product.category || product.categoryId || '',
            href: `/product/${product.id}`
        }
        
        const saved = localStorage.getItem('recent_products')
        let recent: RecentProduct[] = []
        if (saved) {
            try {
                recent = JSON.parse(saved)
            } catch (error) {
                console.error('Error parsing recent products:', error)
            }
        }
        
        // Убираем дубликаты и добавляем новый товар в начало
        recent = [recentProduct, ...recent.filter(p => p.id !== product.id)].slice(0, 10)
        localStorage.setItem('recent_products', JSON.stringify(recent))
        setRecentProducts(recent.slice(0, 3))
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

                    {/* Результаты поиска */}
                    {query && searchResults.length > 0 && (
                        <div className="p-4 border-b">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">
                                Результати пошуку
                            </h3>
                            <div className="space-y-2">
                                {searchResults.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded group"
                                        onClick={() => {
                                            setIsOpen(false)
                                            addToRecentProducts(product)
                                        }}
                                    >
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.images?.[0] || product.image || '/api/placeholder/300/300'}
                                                alt={product.title || product.name || 'Product'}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate group-hover:text-teal-600">
                                                {product.title || product.name}
                                            </p>
                                            <p className="text-sm text-teal-600 font-medium">
                                                {Number(product.price) || 0} грн
                                            </p>
                                        </div>
                                    </Link>
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
                                {recentProducts.map((product) => (
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

                    {/* Индикатор загрузки */}
                    {query && isLoading && (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">Пошук...</p>
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
                    {query && !isLoading && searchResults.length === 0 && filteredHistory.length === 0 && filteredPopular.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">Нічого не знайдено</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}