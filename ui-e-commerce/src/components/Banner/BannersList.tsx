'use client'

import Banner from './Banner'
import { Banner as BannerType } from '@/services/api'

interface BannersListProps {
    banners: BannerType[]
    className?: string
    itemClassName?: string
}

export default function BannersList({ banners, className = '', itemClassName = '' }: BannersListProps) {
    if (!banners || banners.length === 0) {
        return null
    }

    return (
        <div className={className}>
            {banners.map((banner) => (
                <Banner key={banner.id} banner={banner} className={itemClassName} />
            ))}
        </div>
    )
}
