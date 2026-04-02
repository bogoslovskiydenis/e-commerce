import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isLanguage, parsePreferredLanguage, type Language } from './lib/language'

const COOKIE = {
    name: 'language' as const,
    path: '/' as const,
    maxAge: 31536000,
    sameSite: 'lax' as const,
}

function setLanguageCookie(response: NextResponse, lang: Language) {
    response.cookies.set(COOKIE.name, lang, {
        path: COOKIE.path,
        maxAge: COOKIE.maxAge,
        sameSite: COOKIE.sameSite,
    })
}

export function middleware(request: NextRequest) {
    const raw = request.cookies.get(COOKIE.name)?.value
    if (isLanguage(raw)) {
        return NextResponse.next()
    }
    const response = NextResponse.next()
    const lang = parsePreferredLanguage(request.headers.get('accept-language'))
    setLanguageCookie(response, lang)
    return response
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
}
