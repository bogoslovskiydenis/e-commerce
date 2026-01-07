'use client'

import { X } from 'lucide-react'
import { useState, useCallback } from 'react'
import { AuthTabs } from './AuthTabs'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { useTranslation } from '@/contexts/LanguageContext'

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    type: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, type: initialType }: AuthModalProps) {
    const { t } = useTranslation()
    const [type, setType] = useState(initialType)
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose()
        }
    }, [onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleBackdropClick}>
            <div className="bg-white rounded-lg w-[480px] p-6 relative">
                <button onClick={onClose} className="absolute right-4 top-4">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-medium text-center mb-6">
                    {type === 'login' ? t('authModal.welcomeBack') : t('authModal.niceToMeet')}
                </h2>

                <AuthTabs activeTab={type} onTabChange={setType} />

                {type === 'register' ? (
                    <RegisterForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        name={name}
                        setName={setName}
                        passwordVisible={passwordVisible}
                        setPasswordVisible={setPasswordVisible}
                    />
                ) : (
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        passwordVisible={passwordVisible}
                        setPasswordVisible={setPasswordVisible}
                    />
                )}
            </div>
        </div>
    )
}