import { cookies, headers } from 'next/headers'
import { isLanguage, parsePreferredLanguage, type Language } from '@/lib/language'

/** Один источник для RSC: cookie, иначе Accept-Language (как в root layout) */
export async function getServerLanguage(): Promise<Language> {
    const cookieStore = await cookies()
    const raw = cookieStore.get('language')?.value
    if (isLanguage(raw)) return raw
    const h = await headers()
    return parsePreferredLanguage(h.get('accept-language'))
}
