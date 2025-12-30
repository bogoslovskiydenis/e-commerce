'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { login, register, isAuthenticated } = useAuth()
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    if (isAuthenticated) {
        router.push('/account')
        return null
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login(email || phone, password)
            router.push('/account')
        } catch (err: any) {
            setError(err.message || 'Помилка входу')
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!name || !phone || !password) {
            setError('Заповніть всі обов\'язкові поля')
            return
        }
        setLoading(true)
        try {
            await register({ name, email: email || undefined, phone, password })
            router.push('/account')
        } catch (err: any) {
            setError(err.message || 'Помилка реєстрації')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Spacer to account for fixed header */}
            <div className="h-16"></div>

            {/* Форма авторизации */}
            <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-6 md:p-8">
                    {/* Переключение вкладок */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <button
                            onClick={() => setActiveTab('login')}
                            className={`py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
                                activeTab === 'login'
                                    ? 'bg-teal-600 text-white font-medium'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {activeTab === 'login' && (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            У мене є акаунт
                        </button>
                        <button
                            onClick={() => setActiveTab('register')}
                            className={`py-3 rounded-md flex items-center justify-center gap-2 transition-colors ${
                                activeTab === 'register'
                                    ? 'bg-teal-600 text-white font-medium'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            {activeTab === 'register' && (
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                            У мене немає акаунта
                        </button>
                    </div>

                    {/* Ошибка */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Форма */}
                    <form onSubmit={activeTab === 'login' ? handleLogin : handleRegister} className="space-y-4">
                        {activeTab === 'register' && (
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    placeholder="Ім'я"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type={activeTab === 'login' ? 'text' : 'email'}
                                value={activeTab === 'login' ? (email || phone) : email}
                                onChange={(e) => {
                                    if (activeTab === 'login') {
                                        const value = e.target.value
                                        if (/^\d/.test(value) || value.startsWith('+')) {
                                            setPhone(value)
                                            setEmail('')
                                        } else {
                                            setEmail(value)
                                            setPhone('')
                                        }
                                    } else {
                                        setEmail(e.target.value)
                                    }
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                placeholder={activeTab === 'login' ? 'Телефон або e-mail' : 'Адреса e-mail (необов\'язково)'}
                                required={activeTab === 'login'}
                            />
                        </div>

                        {activeTab === 'register' && (
                            <div>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                    placeholder="Телефон"
                                    required
                                />
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500"
                                placeholder="Пароль"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            >
                                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Завантаження...' : (activeTab === 'login' ? 'Ввійти' : 'Створити акаунт')}
                        </button>

                        {activeTab === 'login' && (
                            <button
                                type="button"
                                className="w-full text-sm text-gray-600 hover:text-teal-600 text-center underline transition-colors"
                            >
                                Я не пам'ятаю свій пароль
                            </button>
                        )}
                    </form>

                    {/* Разделитель */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-sm text-gray-500">або продовжити через</span>
                        </div>
                    </div>

                    {/* Социальные кнопки */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <div className="w-6 h-6 relative">
                                <svg viewBox="0 0 24 24" className="w-6 h-6">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            </div>
                        </button>
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 p-3 bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.03998C6.5 2.03998 2 6.52998 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.84998C10.44 7.33998 11.93 5.95998 14.22 5.95998C15.31 5.95998 16.45 6.14998 16.45 6.14998V8.61998H15.19C13.95 8.61998 13.56 9.38998 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C15.9164 21.5878 18.0622 20.3855 19.6099 18.57C21.1576 16.7546 22.0054 14.4456 22 12.06C22 6.52998 17.5 2.03998 12 2.03998Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Футер */}
            <div className="py-6 text-center text-sm text-gray-500">
                <p>© 2025 Все права защищены.</p>
            </div>
        </div>
    )
}