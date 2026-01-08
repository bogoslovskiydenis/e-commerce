'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import ukTranslations from '@/locales/uk'
import ruTranslations from '@/locales/ru'
import enTranslations from '@/locales/en'

export type Language = 'uk' | 'ru' | 'en'

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
    en: enTranslations
}

// Функция для чтения cookie на клиенте
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null
    return null
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    // Инициализируем язык из cookies или localStorage
    const [language, setLanguageState] = useState<Language>(() => {
        if (typeof window === 'undefined') return 'uk'
        
        // Сначала проверяем cookies (приоритет для серверных компонентов)
        const cookieLang = getCookie('language') as Language
        if (cookieLang && ['uk', 'ru', 'en'].includes(cookieLang)) {
            return cookieLang
        }
        
        // Затем localStorage
        const storageLang = localStorage.getItem('language') as Language
        if (storageLang && ['uk', 'ru', 'en'].includes(storageLang)) {
            return storageLang
        }
        
        return 'uk'
    })
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Синхронизируем язык с cookies и localStorage
        document.documentElement.lang = language
        document.cookie = `language=${language}; path=/; max-age=31536000; SameSite=Lax`
        localStorage.setItem('language', language)
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        if (mounted) {
            localStorage.setItem('language', lang)
            document.documentElement.lang = lang
            // Сохраняем также в cookies для серверных компонентов
            document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`
            // Перезагружаем страницу для обновления серверных компонентов
            window.location.reload()
        }
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

