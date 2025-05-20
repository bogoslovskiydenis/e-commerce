'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface FeaturedProductsSectionProps {
    title: string;
    subtitle?: string;
    products: any[];
    viewAllLink?: string;
    viewAllText?: string;
    bgColor?: string;
    slidesToShow?: number;
}

export default function FeaturedProductsSection({
                                                    title,
                                                    subtitle,
                                                    products,
                                                    viewAllLink,
                                                    viewAllText = 'Посмотреть все',
                                                    bgColor = 'bg-gray-50',
                                                    slidesToShow = 4
                                                }: FeaturedProductsSectionProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const maxSlides = Math.max(0, products.length - slidesToShow)

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => Math.max(0, prev - 1))
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => Math.min(maxSlides, prev + 1))
    }

    const canGoBack = currentSlide > 0
    const canGoForward = currentSlide < maxSlides

    return (
        <div className={`${bgColor} py-8 sm:py-12 lg:py-16`}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8 lg:mb-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-gray-600 mt-2">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center mt-4 md:mt-0">
                        {viewAllLink && (
                            <Link href={viewAllLink} className="text-teal-600 hover:text-teal-700 text-sm font-medium mr-6">
                                {viewAllText}
                            </Link>
                        )}
                        <div className="flex gap-2">
                            <button
                                onClick={goToPrevSlide}
                                disabled={!canGoBack}
                                className={`p-2 rounded-full border ${canGoBack ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                aria-label="Предыдущие товары"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={goToNextSlide}
                                disabled={!canGoForward}
                                className={`p-2 rounded-full border ${canGoForward ? 'border-gray-300 hover:bg-gray-100' : 'border-gray-200 text-gray-300 cursor-not-allowed'}`}
                                aria-label="Следующие товары"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Продукты */}
                <div className="relative overflow-hidden">
                    <div
                        className="flex transition-transform duration-300"
                        style={{ transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)` }}
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-2"
                                style={{ width: `${100 / slidesToShow}%` }}
                            >
                                <Link
                                    href={product.link || `/products/${product.category}/${product.id}`}
                                    className="group block"
                                >
                                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-3">
                                        <Image
                                            src={product.image}
                                            alt={product.title || product.name || 'Product'}
                                            width={300}
                                            height={300}
                                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                        />
                                        {product.discount && product.discount > 0 && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                                -{product.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-teal-600">
                                            {product.title || product.name}
                                        </h3>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className="text-lg font-bold text-teal-600">{product.price} грн</span>
                                            {product.oldPrice && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    {product.oldPrice} грн
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}