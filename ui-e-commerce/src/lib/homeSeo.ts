import type { Language } from '@/lib/language'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

const COPY: Record<
    Language,
    { title: string; description: string; keywords: string; ogLocale: string }
> = {
    uk: {
        title: 'Інтернет-магазин — товари онлайн з доставкою | Ecommerce',
        description:
            'Широкий каталог, зручний пошук, акції та доставка. Оформлення замовлення онлайн, актуальні пропозиції та підтримка клієнтів.',
        keywords: 'інтернет-магазин, купити онлайн, доставка, каталог товарів, акції',
        ogLocale: 'uk_UA',
    },
    ru: {
        title: 'Интернет-магазин — товары онлайн с доставкой | Ecommerce',
        description:
            'Широкий каталог, удобный поиск, акции и доставка. Оформление заказа онлайн, актуальные предложения и поддержка клиентов.',
        keywords: 'интернет-магазин, купить онлайн, доставка, каталог товаров, акции',
        ogLocale: 'ru_UA',
    },
    en: {
        title: 'Online store — shop with delivery | Ecommerce',
        description:
            'Wide catalog, easy search, offers and delivery. Order online, up-to-date deals and customer support.',
        keywords: 'online store, shop online, delivery, product catalog, deals',
        ogLocale: 'en_US',
    },
}

export function getHomeSeoCopy(lang: Language) {
    return COPY[lang] ?? COPY.uk
}

export async function getHomeOgImageUrl(): Promise<string | undefined> {
    try {
        const res = await fetch(`${API_BASE_URL}/banners/public?position=MAIN`, {
            next: { revalidate: 120 },
        })
        if (!res.ok) return undefined
        const json = await res.json()
        const banners = json?.data
        if (!Array.isArray(banners) || banners.length === 0) return undefined
        const url = banners[0]?.imageUrl as string | undefined
        if (!url) return undefined
        if (url.startsWith('http')) return url
        const origin = API_BASE_URL.replace(/\/api\/?$/, '')
        return `${origin}${url.startsWith('/') ? url : `/${url}`}`
    } catch {
        return undefined
    }
}

export function getSiteOrigin(): string | undefined {
    const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
    if (explicit) return explicit
    const vercel = process.env.VERCEL_URL
    if (vercel) return `https://${vercel.replace(/\/$/, '')}`
    return undefined
}
