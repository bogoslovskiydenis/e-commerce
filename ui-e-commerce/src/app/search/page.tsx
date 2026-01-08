'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { apiService, Product } from '@/services/api'
import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CategoryConfig } from '@/config/categoryConfig'
import { useTranslation } from '@/contexts/LanguageContext'

export default function SearchPage() {
    const { language, t } = useTranslation()
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const loadSearchResults = async () => {
            if (!query.trim()) {
                setProducts([])
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                setError(null)
                const results = await apiService.searchProducts(query, 100, language)
                setProducts(results)
            } catch (err) {
                console.error('Error searching products:', err)
                setError('Ошибка при поиске товаров')
                setProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        loadSearchResults()
    }, [query, language])

    const config: CategoryConfig = {
        title: query ? `Результати пошуку: "${query}"` : 'Пошук товарів',
        description: query ? `Знайдено товарів за запитом "${query}"` : 'Введіть запит для пошуку',
        basePath: `/search?q=${encodeURIComponent(query)}`,
        categoryType: 'products',
        filters: {
            colors: true,
            materials: true,
            price: true,
            helium: false,
            inStock: true,
            volume: false,
            giftTypes: false
        },
        seoTitle: query ? `Пошук: ${query}` : 'Пошук товарів',
        seoDescription: query ? `Результати пошуку для "${query}"` : 'Пошук товарів',
        sortOptions: [
            { value: 'popular', label: 'По популярности' },
            { value: 'price-asc', label: 'Сначала дешевые' },
            { value: 'price-desc', label: 'Сначала дорогие' },
            { value: 'name-asc', label: 'По названию А-Я' },
            { value: 'name-desc', label: 'По названию Я-А' },
            { value: 'new', label: 'Новинки' }
        ]
    }

    const breadcrumbs = [
        { name: t('search.home'), href: '/' },
        { name: t('search.title'), href: '/search', current: !query },
        ...(query ? [{ name: `"${query}"`, href: `/search?q=${encodeURIComponent(query)}`, current: true }] : [])
    ]

    // Форматируем товары для UniversalCategoryPage
    const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.title || product.name || '',
        price: Number(product.price) || 0,
        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
        discount: product.discount ? Number(product.discount) : undefined,
        image: product.images?.[0] || product.image || '/api/placeholder/300/300',
        category: product.category?.slug || product.categoryId || '',
        colors: (product.attributes as any)?.colors || [],
        material: (product.attributes as any)?.material || 'Не указан',
        inStock: product.inStock !== undefined ? product.inStock : true,
        withHelium: (product.attributes as any)?.withHelium || false,
        size: (product.attributes as any)?.size || '',
        volume: (product.attributes as any)?.volume || '',
        type: product.category?.type?.toLowerCase() || 'products'
    }))

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">Пошук...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        )
    }

    if (!query.trim()) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Пошук товарів</h1>
                    <p className="text-gray-600">Введіть запит для пошуку товарів</p>
                </div>
            </div>
        )
    }

    // Если нет результатов поиска
    if (products.length === 0 && !isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <nav className="mb-6">
                    <ol className="flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((item, index) => (
                            <li key={item.name}>
                                {index > 0 && <span className="text-gray-400 mx-2">/</span>}
                                {item.current ? (
                                    <span className="text-gray-900">{item.name}</span>
                                ) : (
                                    <Link href={item.href} className="text-gray-500 hover:text-teal-600">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Нічого не знайдено</h3>
                    <p className="text-gray-500 mb-4">За запитом &quot;{query}&quot; товарів не знайдено</p>
                    <p className="text-sm text-gray-400 mb-4">Спробуйте змінити запит або перевірте правильність написання</p>
                </div>
            </div>
        )
    }

    return (
        <UniversalCategoryPage
            categoryKey="search"
            config={config}
            products={formattedProducts}
            customBreadcrumbs={breadcrumbs}
        />
    )
}
