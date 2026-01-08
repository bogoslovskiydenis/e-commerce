'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ChevronRight, Heart, ShoppingBag, Grid3x3, List, ArrowUpDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { apiService, Product } from '@/services/api'
import ProductCard from '@/components/ProductCard/ProductCard'
import { cartUtils } from '@/utils/cart'
import { useTranslation } from '@/contexts/LanguageContext'

// Компонент карточки товара в избранном с кнопкой сердца
function FavoriteProductCard({ 
    product, 
    onRemove, 
    isRemoving,
    removeLabel
}: { 
    product: Product
    onRemove: () => void
    isRemoving: boolean
    removeLabel: string
}) {
    const handleHeartClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onRemove()
    }

    return (
        <div className="relative group">
            <ProductCard
                id={product.id}
                name={product.title || product.name || ''}
                type="foil"
                price={Number(product.price) || 0}
                oldPrice={product.oldPrice ? Number(product.oldPrice) : undefined}
                discount={product.discount ? Number(product.discount) : undefined}
                image={product.images?.[0] || product.image || '/api/placeholder/300/300'}
                category={product.category || product.categoryId || ''}
                inStock={product.inStock}
                basePath="/product"
                showFavoriteButton={false}
            />
            <button
                onClick={handleHeartClick}
                disabled={isRemoving}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                aria-label={removeLabel}
            >
                {isRemoving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                    <Heart size={18} className="text-red-500" fill="currentColor" />
                )}
            </button>
        </div>
    )
}

type ViewMode = 'grid' | 'list'
type SortOption = 'newest' | 'oldest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export default function FavoritesPage() {
    const { t, language } = useTranslation()
    const { isAuthenticated } = useAuth()
    const [favorites, setFavorites] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [viewMode, setViewMode] = useState<ViewMode>('grid')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [removingId, setRemovingId] = useState<string | null>(null)

    useEffect(() => {
        if (isAuthenticated) {
            loadFavorites()
        } else {
            setLoading(false)
        }
    }, [isAuthenticated, language])

    const loadFavorites = async () => {
        try {
            setLoading(true)
            const data = await apiService.getFavorites(language)
            setFavorites(data)
        } catch (error) {
            console.error('Error loading favorites:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFavorite = async (productId: string) => {
        if (!isAuthenticated) return
        
        setRemovingId(productId)
        try {
            await apiService.removeFromFavorites(productId)
            setFavorites(favorites.filter(p => p.id !== productId))
        } catch (error) {
            console.error('Error removing favorite:', error)
        } finally {
            setRemovingId(null)
        }
    }

    const handleAddToCart = (product: Product) => {
        cartUtils.addToCart({
            id: product.id,
            name: product.title || product.name || '',
            price: Number(product.price) || 0,
            quantity: 1,
            image: product.images?.[0] || product.image || '/api/placeholder/300/300',
            productId: product.id,
        })
        window.dispatchEvent(new Event('cartUpdated'))
    }

    const sortedFavorites = [...favorites].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            case 'oldest':
                return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            case 'price-asc':
                return (Number(a.price) || 0) - (Number(b.price) || 0)
            case 'price-desc':
                return (Number(b.price) || 0) - (Number(a.price) || 0)
            case 'name-asc':
                return (a.title || a.name || '').localeCompare(b.title || b.name || '')
            case 'name-desc':
                return (b.title || b.name || '').localeCompare(a.title || a.name || '')
            default:
                return 0
        }
    })

    const isEmpty = !loading && favorites.length === 0

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Хлебные крошки */}
                <div className="mb-6 flex items-center text-sm">
                    <Link href="/" className="text-gray-600 hover:text-teal-600 transition-colors">
                        {t('favorites.homePage')}
                    </Link>
                    <ChevronRight size={16} className="mx-2 text-gray-400" />
                    <span className="font-medium text-gray-900">{t('favorites.title')}</span>
                </div>

                {/* Заголовок и статистика */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                            {t('favorites.title')}
                        </h1>
                        {!isEmpty && (
                            <p className="text-gray-600">
                                {favorites.length} {favorites.length === 1 ? t('favorites.item') : t('favorites.items')}
                            </p>
                        )}
                    </div>

                    {!isEmpty && (
                        <div className="flex items-center gap-3">
                            {/* Сортировка */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                                    className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                >
                                    <option value="newest">{t('favorites.sortNewest')}</option>
                                    <option value="oldest">{t('favorites.sortOldest')}</option>
                                    <option value="price-asc">{t('favorites.sortPriceAsc')}</option>
                                    <option value="price-desc">{t('favorites.sortPriceDesc')}</option>
                                    <option value="name-asc">{t('favorites.sortNameAsc')}</option>
                                    <option value="name-desc">{t('favorites.sortNameDesc')}</option>
                                </select>
                                <ArrowUpDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Переключение вида */}
                            <div className="flex items-center bg-white border border-gray-300 rounded-md overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition-colors ${
                                        viewMode === 'grid'
                                            ? 'bg-teal-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    aria-label={t('favorites.gridView')}
                                >
                                    <Grid3x3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 transition-colors ${
                                        viewMode === 'list'
                                            ? 'bg-teal-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    aria-label={t('favorites.listView')}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Пустое состояние */}
                {isEmpty && !isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                        <div className="w-32 h-32 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                            <Heart size={48} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">{t('favorites.emptyTitle')}</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {t('favorites.emptyText')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link
                                href="/login"
                                className="px-8 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors text-center"
                            >
                                {t('favorites.login')}
                            </Link>
                            <Link
                                href="/"
                                className="px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-center"
                            >
                                {t('favorites.viewProducts')}
                            </Link>
                        </div>
                    </div>
                ) : isEmpty && isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg shadow-sm">
                        <div className="w-32 h-32 mb-6 flex items-center justify-center rounded-full bg-gray-100">
                            <Heart size={48} className="text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-gray-900">{t('favorites.emptyAuthenticatedTitle')}</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            {t('favorites.emptyAuthenticatedText')}
                        </p>
                        <Link
                            href="/"
                            className="px-8 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                        >
                            {t('favorites.viewProducts')}
                        </Link>
                    </div>
                ) : loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">{t('favorites.loading')}</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedFavorites.map((product) => (
                            <FavoriteProductCard
                                key={product.id}
                                product={product}
                                onRemove={() => handleRemoveFavorite(product.id)}
                                isRemoving={removingId === product.id}
                                removeLabel={t('favorites.removeFromFavorites')}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {sortedFavorites.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                            >
                                <div className="flex gap-4">
                                    <Link
                                        href={`/product/${product.id}`}
                                        className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
                                    >
                                        <Image
                                            src={product.images?.[0] || product.image || '/api/placeholder/300/300'}
                                            alt={product.title || product.name || ''}
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>

                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex-1">
                                            <Link
                                                href={`/product/${product.id}`}
                                                className="block mb-2"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 hover:text-teal-600 transition-colors">
                                                    {product.title || product.name}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-gray-900">
                                                        {Number(product.price).toFixed(2)} ₴
                                                    </span>
                                                    {product.oldPrice && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {Number(product.oldPrice).toFixed(2)} ₴
                                                        </span>
                                                    )}
                                                </div>
                                                {product.discount && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                                                        -{Number(product.discount)}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 flex items-center gap-2">
                                                {product.inStock ? (
                                                    <span className="text-sm text-green-600 font-medium">{t('favorites.inStock')}</span>
                                                ) : (
                                                    <span className="text-sm text-red-600 font-medium">{t('favorites.outOfStock')}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {product.inStock && (
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                                                >
                                                    <ShoppingBag size={18} />
                                                    <span className="hidden sm:inline">{t('favorites.addToCart')}</span>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleRemoveFavorite(product.id)}
                                                disabled={removingId === product.id}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
                                                aria-label={t('favorites.removeFromFavorites')}
                                            >
                                                {removingId === product.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                                                ) : (
                                                    <Heart size={18} className="text-red-500" fill="currentColor" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
