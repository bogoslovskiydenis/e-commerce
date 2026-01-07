'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useTranslation, Language } from '@/contexts/LanguageContext'

export default function LanguageSwitcher() {
    const { language, setLanguage, t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const languages: { code: Language; label: string }[] = [
        { code: 'uk', label: 'Українська' },
        { code: 'ru', label: 'Русский' },
        { code: 'en', label: 'English' }
    ]

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const currentLanguage = languages.find(lang => lang.code === language) || languages[0]

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 sm:gap-2 text-white hover:text-teal-200 transition-colors text-xs sm:text-sm"
            >
                <Globe size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden lg:inline">{currentLanguage.label}</span>
                <span className="hidden sm:inline lg:hidden text-xs">{currentLanguage.code.toUpperCase()}</span>
                <span className="sm:hidden text-xs font-medium">{currentLanguage.code.toUpperCase()}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[150px] z-50">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code)
                                setIsOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                                language === lang.code ? 'bg-teal-50 text-teal-600 font-medium' : 'text-gray-700'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

