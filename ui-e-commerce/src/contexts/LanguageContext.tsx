'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import ukTranslations from '@/locales/uk'
import ruTranslations from '@/locales/ru'
import enTranslations from '@/locales/en'
import type { Language } from '@/lib/language'

export type { Language } from '@/lib/language'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
    mounted: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, any>> = {
    uk: ukTranslations,
    ru: ruTranslations,
    en: enTranslations,
}

export function LanguageProvider({
    children,
    initialLanguage,
}: {
    children: ReactNode
    initialLanguage: Language
}) {
    const [language, setLanguageState] = useState<Language>(() => initialLanguage)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const setLanguage = (lang: Language) => {
        if (typeof window === 'undefined') return
        document.documentElement.lang = lang
        localStorage.setItem('language', lang)
        document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`
        window.location.href = window.location.pathname + window.location.search + window.location.hash
    }

    const t = (key: string): string => {
        const keys = key.split('.')
        let value: any = translations[language]

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k]
            } else {
                return key
            }
        }

        return typeof value === 'string' ? value : key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, mounted }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useTranslation must be used within a LanguageProvider')
    }
    return context
}
