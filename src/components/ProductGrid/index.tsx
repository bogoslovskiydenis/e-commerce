import Image from 'next/image'
import { Heart } from 'lucide-react'

interface Product {
    id: string
    title: string
    brand: string
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
}

interface ProductGridProps {
    products?: Product[]
}

// Дефолтные продукты
const DEFAULT_PRODUCTS: Product[] = [
    {
        id: '1',
        title: 'Снікерси · Білий',
        brand: 'Kappa',
        price: 2599,
        oldPrice: 3299,
        image: '/images/products/1.jpg',
        category: 'sneakers'
    },
    {
        id: '2',
        title: 'Кросівки · Чорний',
        brand: 'Nike',
        price: 3999,
        image: '/images/products/2.jpg',
        category: 'sneakers'
    }
]

export default function ProductGrid({ products = DEFAULT_PRODUCTS }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products?.map((product) => (
                <div key={product.id} className="group relative">
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={product.image}
                            alt={product.title}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Add to favorites"
                        >
                            <Heart size={20} />
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-900">{product.brand}</h3>
                        <p className="mt-1 text-sm text-gray-500">{product.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-lg font-bold">{product.price} грн</span>
                            {product.oldPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.oldPrice} грн
                                </span>
                            )}
                            {product.discount && (
                                <span className="text-sm font-medium text-red-600">
                                    -{product.discount}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}