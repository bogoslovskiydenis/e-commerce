'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { apiService } from '@/services/api'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState(false)
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            setError('Токен відновлення відсутній')
        }
    }, [token])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        if (!token) {
            setError('Токен відновлення відсутній')
            return
        }
        if (!password || password.length < 6) {
            setError('Пароль повинен містити мінімум 6 символів')
            return
        }
        if (password !== confirmPassword) {
            setError('Паролі не співпадають')
            return
        }
        setLoading(true)
        try {
            await apiService.resetPassword(token, password)
            setSuccess(true)
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message || 'Помилка відновлення пароля')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="h-16"></div>
            <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Встановлення нового пароля</h1>
                    <p className="text-gray-600 mb-6">Введіть новий пароль для вашого акаунту</p>
                    {success ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800">
                                    Пароль успішно змінено! Ви будете перенаправлені на сторінку входу через кілька секунд.
                                </p>
                            </div>
                            <Link href="/login" className="block w-full text-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                                Перейти до входу
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-red-800 text-sm">{error}</p>
                                </div>
                            )}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Новий пароль
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Мінімум 6 символів"
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        disabled={loading || !token}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                    Підтвердіть пароль
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        type={confirmPasswordVisible ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Повторіть пароль"
                                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        disabled={loading || !token}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {confirmPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Збереження...' : 'Змінити пароль'}
                            </button>
                            <div className="text-center">
                                <Link href="/login" className="text-sm text-amber-600 hover:text-amber-700">
                                    Повернутися до входу
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
