'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { cartUtils } from '@/utils/cart'
import { apiService } from '@/services/api'
import { useAuth } from '@/contexts/AuthContext'

interface ProductCardProps {
    id: string
    name: string
    type: 'foil' | 'latex' | 'bouquet' | 'set' | 'cup' | 'plush' | 'souvenir' | 'jewelry' | 'sweets' | 'flowers' | 'gift set'
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
    withHelium?: boolean
    size?: string
    colors?: string[]
    material?: string
    inStock: boolean
    className?: string
    basePath?: string // Добавляем возможность указать базовый путь
    showFavoriteButton?: boolean // Показывать ли кнопку избранного
}

export default function ProductCard({
                                        id,
                                        name,
                                        type,
                                        price,
                                        oldPrice,
                                        discount,
                                        image,
                                        category,
                                        withHelium = false,
                                        size,
                                        colors = [],
                                        material,
                                        inStock = true,
                                        className = "",
                                        basePath = "/balloons", // По умолчанию используем balloons
                                        showFavoriteButton = true // По умолчанию показываем
                                    }: ProductCardProps) {
    const { isAuthenticated } = useAuth()
    const [isAdded, setIsAdded] = useState(false)
    const [isFavorite, setIsFavorite] = useState(false)
    const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
    const showFavorite = showFavoriteButton !== false // По умолчанию показываем

    useEffect(() => {
        if (isAuthenticated && showFavorite) {
            checkFavorite()
        }
    }, [isAuthenticated, id, showFavorite])

    const checkFavorite = async () => {
        try {
            const favorite = await apiService.isFavorite(id)
            setIsFavorite(favorite)
        } catch (error) {
            console.error('Error checking favorite:', error)
        }
    }

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated) {
            window.location.href = '/login'
            return
        }

        setIsLoadingFavorite(true)
        try {
            if (isFavorite) {
                await apiService.removeFromFavorites(id)
                setIsFavorite(false)
            } else {
                await apiService.addToFavorites(id)
                setIsFavorite(true)
            }
        } catch (error) {
            console.error('Error toggling favorite:', error)
        } finally {
            setIsLoadingFavorite(false)
        }
    }

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!inStock) return

        cartUtils.addToCart({
            id,
            name,
            price,
            image: image || '/api/placeholder/300/300',
            productId: id,
            attributes: {
                size: size,
                withHelium: withHelium,
                color: colors[0]
            }
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleQuickOrder = (e: React.MouseEvent) => {
        e.preventDefault()
        handleAddToCart(e)
        // Можно добавить редирект на страницу быстрого заказа
    }
    // Определяем цвет бейджа для материала
    const getMaterialBadgeColor = (material?: string) => {
        switch (material) {
            case 'Фольга':
                return 'bg-blue-100 text-blue-700'
            case 'Латекс':
                return 'bg-pink-100 text-pink-700'
            default:
                return 'bg-gray-100 text-gray-700'
        }
    }

    // Определяем цвет точки для цветов
    const getColorDot = (colorName: string) => {
        const colorMap: Record<string, string> = {
            'Красный': 'bg-red-500',
            'Синий': 'bg-blue-500',
            'Розовый': 'bg-pink-500',
            'Золотой': 'bg-yellow-500',
            'Серебряный': 'bg-gray-400',
            'Зеленый': 'bg-green-500',
        }
        return colorMap[colorName] || 'bg-gray-400'
    }

    // Формируем правильную ссылку на товар
    // Используем универсальный роут /product/[id] для всех товаров
    const productLink = `/product/${id}`

    return (
        <div className={`group relative flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${className}`}>
            <div className="aspect-square overflow-hidden bg-gray-100 relative">
                <Link href={productLink}>
                    <Image
                        src={image}
                        alt={name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>

                {/* Скидка */}
                {discount && discount > 0 && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        -{discount}%
                    </div>
                )}

                {/* Статус товара */}
                {!inStock && (
                    <div className="absolute top-3 right-3 bg-gray-500 text-white px-2 py-1 rounded text-sm">
                        Нет в наличии
                    </div>
                )}

                {/* Кнопки действий */}
                {showFavorite && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={handleToggleFavorite}
                            disabled={isLoadingFavorite}
                            className={`p-2 rounded-full shadow-md transition-colors ${
                                isFavorite
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : 'bg-white hover:bg-gray-50'
                            }`}
                            aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                        >
                            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                    {inStock && (
                        <button
                            onClick={handleAddToCart}
                            className={`p-2 rounded-full shadow-md transition-colors ${
                                isAdded 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                            aria-label="Добавить в корзину"
                            title={isAdded ? 'Додано в кошик' : 'Додати в кошик'}
                        >
                            {isAdded ? <Check size={20} /> : <ShoppingBag size={20} />}
                        </button>
                    )}
                    </div>
                )}

                {/* Бейдж материала в левом нижнем углу */}
                {material && (
                    <div className="absolute bottom-3 left-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMaterialBadgeColor(material)}`}>
                            {material}
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <Link href={productLink} className="mb-2">
                    <h3 className="text-sm font-medium text-gray-900 hover:text-teal-600 line-clamp-2 h-10">
                        {name}
                    </h3>
                </Link>

                {/* Характеристики товара */}
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                    {size && (
                        <div className="flex items-center gap-1 text-gray-600">
                            <span>📏</span>
                            <span>{size}</span>
                        </div>
                    )}

                    {withHelium && (
                        <div className="flex items-center gap-1 text-blue-600">
                            <span>✈️</span>
                            <span>С гелием</span>
                        </div>
                    )}

                    {colors && colors.length > 0 && (
                        <div className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded-full ${getColorDot(colors[0])}`}></div>
                            <span className="text-gray-600">{colors[0]}</span>
                        </div>
                    )}
                </div>

                {/* Цена */}
                <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gray-900">{price} грн</span>
                        {oldPrice && (
                            <span className="text-sm text-gray-500 line-through">
                                {oldPrice} грн
                            </span>
                        )}
                    </div>

                    {/* Кнопка быстрого заказа */}
                    {inStock ? (
                        <button 
                            onClick={handleQuickOrder}
                            className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                                isAdded
                                    ? 'bg-green-600 text-white'
                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                            }`}
                        >
                            {isAdded ? '✓ Додано в кошик' : 'Швидке замовлення'}
                        </button>
                    ) : (
                        <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                            Немає в наявності
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}