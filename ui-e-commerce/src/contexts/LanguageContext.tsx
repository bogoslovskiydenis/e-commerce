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
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations: Record<Language, Record<string, any>> = {
    uk: ukTranslations,
    ru: ruTranslations,
    en: enTranslations
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('uk')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const savedLang = localStorage.getItem('language') as Language
        if (savedLang && ['uk', 'ru', 'en'].includes(savedLang)) {
            setLanguageState(savedLang)
            document.documentElement.lang = savedLang
        } else {
            document.documentElement.lang = 'uk'
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        if (mounted) {
            localStorage.setItem('language', lang)
            document.documentElement.lang = lang
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
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
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

