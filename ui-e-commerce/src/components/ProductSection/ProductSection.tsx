import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/services/api'

interface ProductSectionProps {
    products: Product[]
}

export default function ProductSection({ products }: ProductSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group relative flex flex-col h-full"
                >
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
                        <Image
                            src={product.images?.[0] || product.image || '/api/placeholder/300/300'}
                            alt={product.title || product.name || 'Product'}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Скидка */}
                        {product.discount && product.discount > 0 && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                -{product.discount}%
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-col flex-grow">
                        <div className="flex-grow">
                            {product.brand && (
                                <h3 className="text-sm font-medium text-gray-900">{product.brand}</h3>
                            )}
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2 h-10">
                                {product.title || product.name}
                            </p>
                        </div>

                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-lg font-bold text-teal-600">{product.price} грн</span>
                            {product.oldPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    {product.oldPrice} грн
                                </span>
                            )}
                            {product.discount && product.discount > 0 && (
                                <span className="text-sm font-medium text-red-600">
                                    -{product.discount}%
                                </span>
                            )}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}