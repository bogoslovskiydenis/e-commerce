import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingBag } from 'lucide-react'

interface BalloonProduct {
    id: string
    name: string
    type: 'foil' | 'latex' | 'bouquet' | 'set' | 'cup' | 'plush' | 'souvenir' | 'jewelry' | 'sweets' | 'flowers'
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
    description?: string
}

interface ProductListProps {
    products?: BalloonProduct[]
    className?: string
    basePath?: string
}

export default function ProductList({
                                        products = [],
                                        className = "",
                                        basePath = "/balloons"
                                    }: ProductListProps) {

    // Функция для определения правильной ссылки на товар
    const getProductLink = (product: BalloonProduct) => {
        if (product.category === 'bouquets') {
            return `/bouquets/${product.id}`
        }
        if (product.category === 'sets' || product.type === 'set') {
            return `/sets/${product.id}`
        }
        if (product.category === 'cups' || product.type === 'cup') {
            return `/cups/${product.id}`
        }
        if (['plush', 'souvenir', 'jewelry', 'sweets', 'flowers'].includes(product.type)) {
            return `/gifts/${product.id}`
        }
        // Все остальное (шары) - ведем на /balloons/category/id
        return `${basePath}/${product.category}/${product.id}`
    }

    // Определяем цвет бейджа для материала
    const getMaterialBadgeColor = (material?: string) => {
        switch (material) {
            case 'Фольга':
                return 'bg-blue-100 text-blue-700'
            case 'Латекс':
                return 'bg-pink-100 text-pink-700'
            case 'Бумага':
                return 'bg-amber-100 text-amber-700'
            case 'Пластик':
                return 'bg-purple-100 text-purple-700'
            case 'Эко':
                return 'bg-green-100 text-green-700'
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

    return (
        <div className={`space-y-4 ${className}`}>
            {products?.map((product) => (
                <div
                    key={product.id}
                    className="group bg-white rounded-lg border hover:shadow-md transition-shadow p-4"
                >
                    <div className="flex gap-4">
                        {/* Изображение товара */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                            <Link href={getProductLink(product)}>
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="128px"
                                    className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                                />
                            </Link>

                            {/* Скидка */}
                            {product.discount && product.discount > 0 && (
                                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                    -{product.discount}%
                                </div>
                            )}

                            {/* Статус товара */}
                            {!product.inStock && (
                                <div className="absolute top-2 right-2 bg-gray-500 text-white px-2 py-1 rounded text-xs">
                                    Нет в наличии
                                </div>
                            )}

                            {/* Бейдж материала */}
                            {product.material && (
                                <div className="absolute bottom-2 left-2">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getMaterialBadgeColor(product.material)}`}>
                                        {product.material}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Информация о товаре */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-2">
                                <Link href={getProductLink(product)} className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900 hover:text-teal-600 line-clamp-2">
                                        {product.name}
                                    </h3>
                                </Link>

                                {/* Кнопки действий */}
                                <div className="flex gap-2 ml-4">
                                    <button
                                        className="p-2 rounded-full border hover:bg-gray-50"
                                        aria-label="Добавить в избранное"
                                    >
                                        <Heart size={18} />
                                    </button>
                                    {product.inStock && (
                                        <button
                                            className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700"
                                            aria-label="Добавить в корзину"
                                        >
                                            <ShoppingBag size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Описание */}
                            {product.description && (
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {product.description}
                                </p>
                            )}

                            {/* Характеристики товара */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 mb-3">
                                {product.size && (
                                    <div className="flex items-center gap-1">
                                        <span>📏</span>
                                        <span>{product.size}</span>
                                    </div>
                                )}

                                {product.withHelium && (
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <span>✈️</span>
                                        <span>С гелием</span>
                                    </div>
                                )}

                                {product.colors && product.colors.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            {product.colors.slice(0, 3).map((color, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-3 h-3 rounded-full ${getColorDot(color)}`}
                                                    title={color}
                                                ></div>
                                            ))}
                                            {product.colors.length > 3 && (
                                                <span className="text-xs">+{product.colors.length - 3}</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Цена и кнопка заказа */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-gray-900">{product.price} грн</span>
                                    {product.oldPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {product.oldPrice} грн
                                        </span>
                                    )}
                                </div>

                                {/* Кнопка быстрого заказа */}
                                {product.inStock ? (
                                    <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-colors">
                                        Быстрый заказ
                                    </button>
                                ) : (
                                    <button className="px-4 py-2 bg-gray-300 text-gray-600 rounded-lg text-sm font-medium cursor-not-allowed">
                                        Нет в наличии
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}