import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'

interface BalloonProduct {
    id: string
    name: string
    type: 'foil' | 'latex' | 'bouquet' | 'set'
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
    withHelium?: boolean
    size?: string
    colors?: string[]
    inStock: boolean
}

interface ProductGridProps {
    products?: BalloonProduct[]
}

// Дефолтные продукты для магазина шариков
const DEFAULT_BALLOON_PRODUCTS: BalloonProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        type: 'foil',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/images/hard.jpg',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Красный'],
        inStock: true
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        type: 'bouquet',
        price: 450,
        image: '/images/bouquets/birthday.jpg',
        category: 'birthday',
        withHelium: true,
        inStock: true
    },
    {
        id: '3',
        name: 'Цифра "1" золотая',
        type: 'foil',
        price: 350,
        oldPrice: 400,
        discount: 12,
        image: '/images/balloons/number-1-gold.jpg',
        category: 'numbers',
        withHelium: true,
        size: '90см',
        colors: ['Золотой'],
        inStock: true
    },
    {
        id: '4',
        name: 'Набор "Единорог"',
        type: 'set',
        price: 650,
        image: '/images/sets/unicorn.jpg',
        category: 'kids',
        withHelium: true,
        inStock: false
    }
]

export default function ProductGrid({ products = DEFAULT_BALLOON_PRODUCTS }: ProductGridProps) {
    // Функция для определения правильной ссылки на товар
    const getProductLink = (product: BalloonProduct) => {
        // Если это букет - ведем на /bouquets/id
        if (product.type === 'bouquet') {
            return `/bouquets/${product.id}`
        }
        // Если это набор - ведем на /sets/id
        if (product.type === 'set') {
            return `/sets/${product.id}`
        }
        // Все остальное (шары) - ведем на /balloons/category/id
        return `/balloons/${product.category}/${product.id}`
    }

    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map((product) => (
                <div key={product.id} className="group relative flex flex-col h-full">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
                        <Link href={getProductLink(product)}>
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={300}
                                height={300}
                                className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            />
                        </Link>

                        {/* Скидка */}
                        {product.discount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                                -{product.discount}%
                            </div>
                        )}

                        {/* Статус товара */}
                        {!product.inStock && (
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
                            {product.inStock && (
                                <button
                                    className="p-2 rounded-full bg-teal-600 text-white shadow-md hover:bg-teal-700"
                                    aria-label="Добавить в корзину"
                                >
                                    <ShoppingBag size={20} />
                                </button>
                            )}
                        </div>

                        {/* Тип товара */}
                        <div className="absolute bottom-3 left-3">
                            <span className="inline-block bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                                {product.type === 'foil' && '✨ Фольга'}
                                {product.type === 'latex' && '🎈 Латекс'}
                                {product.type === 'bouquet' && '💐 Букет'}
                                {product.type === 'set' && '🎁 Набор'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col flex-grow">
                        <Link href={getProductLink(product)} className="mb-1">
                            <h3 className="text-sm font-medium text-gray-900 hover:text-teal-600 line-clamp-2 h-10">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Дополнительная информация */}
                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                            {product.size && (
                                <span className="bg-gray-100 px-2 py-0.5 rounded">
                                    📏 {product.size}
                                </span>
                            )}
                            {product.withHelium && (
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                    ✈️ С гелием
                                </span>
                            )}
                            {product.colors && product.colors.length > 0 && (
                                <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                    🎨 {product.colors.join(', ')}
                                </span>
                            )}
                        </div>

                        {/* Цена */}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-bold text-teal-600">{product.price} грн</span>
                            {product.oldPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.oldPrice} грн
                                </span>
                            )}
                        </div>

                        {/* Кнопка быстрого заказа - перемещена в конец для выравнивания */}
                        <div className="mt-auto pt-3">
                            {product.inStock ? (
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
            ))}
        </div>
    )
}