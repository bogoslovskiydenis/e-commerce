export const SUPPORTED_LANGUAGES = ['uk', 'ru', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export function isLanguage(value: string | undefined | null): value is Language {
    return (
        value !== undefined &&
        value !== null &&
        (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
    )
}

export function resolveLanguageCookie(value: string | undefined | null): Language {
    return isLanguage(value) ? value : 'uk'
}

function tagToLanguage(tag: string): Language | null {
    const code = tag.trim().toLowerCase().split('-')[0] ?? ''
    if (code === 'uk' || code === 'ua') return 'uk'
    if (code === 'ru') return 'ru'
    if (code === 'en') return 'en'
    return null
}

/**
 * Язык из Accept-Language браузера: учёт q и порядка приоритетов.
 * Сохранённый cookie по-прежнему важнее (middleware / getServerLanguage).
 */
export function parsePreferredLanguage(acceptLanguage: string | null): Language {
    if (!acceptLanguage) return 'uk'
    const items: { tag: string; q: number }[] = []
    for (const segment of acceptLanguage.split(',')) {
        const parts = segment.trim().split(';').map((s) => s.trim())
        const tag = parts[0]?.toLowerCase() ?? ''
        if (!tag || tag === '*') continue
        let q = 1
        for (const p of parts.slice(1)) {
            const [k, v] = p.split('=').map((s) => s.trim())
            if (k?.toLowerCase() === 'q') {
                const n = parseFloat(v)
                if (!Number.isNaN(n)) q = n
            }
        }
        items.push({ tag, q })
    }
    items.sort((a, b) => b.q - a.q)
    for (const { tag } of items) {
        const lang = tagToLanguage(tag)
        if (lang) return lang
    }
    return 'uk'
}
