'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/contexts/LanguageContext'

/**
 * Компонент для динамического обновления lang атрибута HTML элемента
 * Работает только на клиенте после монтирования
 */
export default function LanguageHtmlLang() {
    const { language, mounted } = useTranslation()

    useEffect(() => {
        if (mounted && typeof document !== 'undefined') {
            document.documentElement.lang = language
        }
    }, [language, mounted])

    return null
}

