'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Banner as BannerType } from '@/services/api'

const getImageUrl = (url: string) => {
    if (!url) return '/api/placeholder/800/400'
    if (url.startsWith('http')) return url
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')
    return `${apiBase}${url}`
}

interface BannerProps {
    banner: BannerType
    className?: string
}

export default function Banner({ banner, className = '' }: BannerProps) {
    const content = (
        <div className={`relative overflow-hidden rounded-lg ${className}`}>
            <picture>
                <source media="(max-width: 768px)" srcSet={getImageUrl(banner.mobileImageUrl || banner.imageUrl)} />
                <Image
                    src={getImageUrl(banner.imageUrl)}
                    alt={banner.title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                />
            </picture>
            {(banner.title || banner.subtitle || banner.buttonText) && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
                    <div className="text-center text-white">
                        {banner.title && (
                            <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
                        )}
                        {banner.subtitle && (
                            <p className="text-sm mb-4">{banner.subtitle}</p>
                        )}
                        {banner.buttonText && banner.link && (
                            <Link
                                href={banner.link}
                                className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                            >
                                {banner.buttonText}
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    )

    if (banner.link && !banner.buttonText) {
        return (
            <Link href={banner.link} className="block">
                {content}
            </Link>
        )
    }

    return content
}
