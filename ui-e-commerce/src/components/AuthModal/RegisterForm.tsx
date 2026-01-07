'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useTranslation } from '@/contexts/LanguageContext'

interface RegisterFormProps {
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    name: string
    setName: (name: string) => void
    passwordVisible: boolean
    setPasswordVisible: (visible: boolean) => void
}

export function RegisterForm({
                                 email,
                                 setEmail,
                                 password,
                                 setPassword,
                                 name,
                                 setName,
                                 passwordVisible,
                                 setPasswordVisible
                             }: RegisterFormProps) {
    const { t } = useTranslation()
    
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                    {t('authModal.name')}
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={t('authModal.enterName')}
                />
            </div>

            <div>
                <label htmlFor="register-email" className="block text-sm font-medium mb-2">
                    {t('authModal.email')}
                </label>
                <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder={t('authModal.enterEmail')}
                />
            </div>

            <div>
                <label htmlFor="register-password" className="block text-sm font-medium mb-2">
                    {t('authModal.password')}
                </label>
                <div className="relative">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id="register-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder={t('authModal.createPassword')}
                    />
                    <button
                        type="button"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    {t('authModal.minimumChars')}
                </p>
            </div>

            <div className="space-y-2">
                <label className="flex items-start gap-2">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm">
                        {t('authModal.agreeNews')}
                    </span>
                </label>
            </div>

            <button className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition-colors">
                {t('authModal.createAccount')}
            </button>
        </div>
    )
}