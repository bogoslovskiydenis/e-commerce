'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Banner } from '@/services/api'

interface PromotionsSectionProps {
    title: string;
    banners: Banner[];
}

const getImageUrl = (url: string) => {
    if (!url) return '/api/placeholder/600/300'
    if (url.startsWith('http')) return url
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')
    return `${apiBase}${url}`
}

export default function PromotionsSection({ title, banners }: PromotionsSectionProps) {
    const activeBanners = (banners || []).filter((banner) => banner.isActive)

    if (activeBanners.length === 0) {
        return null
    }

    const items = activeBanners.slice(0, 3)

    return (
        <div className="bg-gray-50 py-6 sm:py-8 lg:py-12">
            <div className="container mx-auto px-4">
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {title}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {items.map((banner) => (
                        <div
                            key={banner.id}
                            className="group relative overflow-hidden rounded-lg bg-white shadow-sm border border-gray-100"
                        >
                            <div className="relative h-40 sm:h-44 md:h-40 lg:h-44">
                                <Image
                                    src={getImageUrl(banner.imageUrl)}
                                    alt={banner.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-semibold">
                                    %
                                </div>
                            </div>

                            <div className="p-4 sm:p-5">
                                <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
                                    {banner.title}
                                </h3>
                                {banner.subtitle && (
                                    <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                                        {banner.subtitle}
                                    </p>
                                )}
                                {banner.buttonText && banner.link && (
                                    <Link
                                        href={banner.link}
                                        className="inline-flex items-center text-xs sm:text-sm font-medium text-teal-600 hover:text-teal-700"
                                    >
                                        {banner.buttonText}
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

