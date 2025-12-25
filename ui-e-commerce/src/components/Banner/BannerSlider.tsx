'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Banner } from '@/services/api'

const getImageUrl = (url: string) => {
    if (!url) return '/api/placeholder/800/400'
    if (url.startsWith('http')) return url
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')
    return `${apiBase}${url}`
}

interface BannerSliderProps {
    banners: Banner[]
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        if (banners.length <= 1) return

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [banners.length])

    if (!banners || banners.length === 0) {
        return null
    }

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
    }

    return (
        <div className="relative aspect-[3/2] sm:aspect-[5/2] md:aspect-[3/1] lg:aspect-[7/2] overflow-hidden">
            {banners.map((banner, index) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <picture>
                        <source media="(max-width: 768px)" srcSet={getImageUrl(banner.mobileImageUrl || banner.imageUrl)} />
                        <Image
                            src={getImageUrl(banner.imageUrl)}
                            alt={banner.title}
                            fill
                            sizes="100vw"
                            className="object-cover"
                            priority={index === 0}
                        />
                    </picture>
                    <div className="absolute inset-0 bg-black bg-opacity-30" />
                    <div className="absolute inset-0 flex items-center">
                        <div className="container mx-auto px-4">
                            <div className="max-w-xl lg:max-w-2xl text-white">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                                    {banner.title}
                                </h1>
                                {banner.subtitle && (
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.buttonText && banner.link && (
                                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                                        <Link
                                            href={banner.link}
                                            className="inline-block w-44 px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-center font-medium text-xs sm:text-sm transition-colors"
                                        >
                                            {banner.buttonText}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {banners.length > 1 && (
                <>
                    <button
                        onClick={goToPrevSlide}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        aria-label="Предыдущий слайд"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <button
                        onClick={goToNextSlide}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                        aria-label="Следующий слайд"
                    >
                        <ChevronRight size={20} className="text-white" />
                    </button>

                    <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                                aria-label={`Перейти к слайду ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
