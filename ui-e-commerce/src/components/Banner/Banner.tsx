'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Banner as BannerType } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'
import type { Language } from '@/lib/language'

const getImageUrl = (url: string) => {
    if (!url) return '/api/placeholder/800/400'
    if (url.startsWith('http')) return url
    const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api').replace('/api', '')
    return `${apiBase}${url}`
}

const getLangField = (banner: BannerType, field: 'title' | 'subtitle' | 'buttonText', lang: Language): string => {
    const map: Record<Language, string | undefined> = {
        uk: banner[`${field}Uk` as keyof BannerType] as string | undefined,
        ru: banner[`${field}Ru` as keyof BannerType] as string | undefined,
        en: banner[`${field}En` as keyof BannerType] as string | undefined,
    }
    return map[lang] || banner[field] || ''
}

interface BannerProps {
    banner: BannerType
    className?: string
}

export default function Banner({ banner, className = '' }: BannerProps) {
    const { language } = useTranslation()

    const title = getLangField(banner, 'title', language)
    const subtitle = getLangField(banner, 'subtitle', language)
    const buttonText = getLangField(banner, 'buttonText', language)

    const inner = (
        <>
            <picture>
                <source media="(max-width: 768px)" srcSet={getImageUrl(banner.mobileImageUrl || banner.imageUrl)} />
                <Image
                    src={getImageUrl(banner.imageUrl)}
                    alt={title}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                />
            </picture>
            {(title || subtitle || buttonText) && (
                <div className="absolute inset-0 bg-black bg-opacity-30 pointer-events-none flex items-center justify-center p-4">
                    <div className="text-center text-white">
                        {title && (
                            <h3 className="text-xl font-bold mb-2">{title}</h3>
                        )}
                        {subtitle && (
                            <p className="text-sm mb-4">{subtitle}</p>
                        )}
                        {buttonText && (
                            <span className="inline-block px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                                {buttonText}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </>
    )

    if (banner.link) {
        return (
            <Link href={banner.link} className={`relative overflow-hidden rounded-lg block ${className}`}>
                {inner}
            </Link>
        )
    }

    return <div className={`relative overflow-hidden rounded-lg ${className}`}>{inner}</div>
}
