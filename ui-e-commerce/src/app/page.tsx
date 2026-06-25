import type { Metadata } from 'next'
import { getServerLanguage } from '@/lib/serverLanguage'
import { getHomeOgImageUrl, getHomeSeoCopy, getSiteOrigin } from '@/lib/homeSeo'
import HomePageClient from './HomePageClient'

export const revalidate = 120

export async function generateMetadata(): Promise<Metadata> {
    const lang = await getServerLanguage()
    const seo = getHomeSeoCopy(lang)
    const ogImage = await getHomeOgImageUrl()
    const origin = getSiteOrigin()

    return {
        title: { absolute: seo.title },
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.description,
            locale: seo.ogLocale,
            type: 'website',
            ...(origin ? { url: `${origin}/` } : {}),
            ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630, alt: seo.title }] } : {}),
        },
        alternates: origin ? { canonical: `${origin}/` } : { canonical: '/' },
    }
}

export default function HomePage() {
    return <HomePageClient />
}
