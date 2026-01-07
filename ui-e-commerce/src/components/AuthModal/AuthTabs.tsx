'use client'

import { useTranslation } from '@/contexts/LanguageContext'

interface AuthTabsProps {
    activeTab: 'login' | 'register'
    onTabChange: (tab: 'login' | 'register') => void
}

export function AuthTabs({activeTab, onTabChange}: AuthTabsProps) {
    const { t } = useTranslation()
    
    return (
        <div className="flex gap-2 border-b mb-6">
            <button
                onClick={() => onTabChange('login')}
                className={`pb-2 px-4 transition-colors ${activeTab === 'login' ? 'border-b-2 border-teal-600 text-teal-600 font-medium' : 'text-gray-600 hover:text-teal-600'}`}
            >
                {t('authModal.login')}
            </button>
            <button
                onClick={() => onTabChange('register')}
                className={`pb-2 px-4 transition-colors ${activeTab === 'register' ? 'border-b-2 border-teal-600 text-teal-600 font-medium' : 'text-gray-600 hover:text-teal-600'}`}
            >
                {t('authModal.createAccount')}
            </button>
        </div>
    )
}