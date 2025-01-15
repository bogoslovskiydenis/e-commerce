import Image from 'next/image'
import { Heart } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { title, brand, price, oldPrice, discount, image } = product

    return (
        <div className="group relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <Image
                    src={image}
                    alt={title}
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
                <h3 className="text-sm font-medium text-gray-900">{brand}</h3>
                <p className="mt-1 text-sm text-gray-500">{title}</p>
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold">{price} грн</span>
                    {oldPrice && (
                        <span className="text-sm text-gray-500 line-through">
            {oldPrice} грн
    </span>
                    )}
                    {discount && (
                        <span className="text-sm font-medium text-red-600">
            -{discount}%
            </span>
                    )}
                </div>
            </div>
        </div>
    )
}