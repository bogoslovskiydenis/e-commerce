import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'

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
                                        basePath = "/balloons" // По умолчанию используем balloons
                                    }: ProductCardProps) {
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

    // Формируем правильную ссылку
    const productLink = `${basePath}/${category}/${id}`

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
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
                        aria-label="Добавить в избранное"
                    >
                        <Heart size={20} />
                    </button>
                    {inStock && (
                        <button
                            className="p-2 rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700"
                            aria-label="Добавить в корзину"
                        >
                            <ShoppingBag size={20} />
                        </button>
                    )}
                </div>

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
                        <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors">
                            Быстрый заказ
                        </button>
                    ) : (
                        <button className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                            Нет в наличии
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}