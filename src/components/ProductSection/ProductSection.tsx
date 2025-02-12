import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/types/Product_types'

interface ProductSectionProps {
    products: Product[]
}

export default function ProductSection({ products }: ProductSectionProps) {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
                <Link
                    key={product.id}
                    href={product.link || `/products/${product.category}/${product.id}`}
                    className="group relative"
                >
                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                            src={product.image}
                            alt={product.title}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                        />
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