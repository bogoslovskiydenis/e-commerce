'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiService } from '@/services/api'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [phoneOrEmail, setPhoneOrEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess(false)
        
        if (!phoneOrEmail) {
            setError('Введіть телефон або email')
            return
        }

        setLoading(true)
        try {
            await apiService.forgotPassword(phoneOrEmail)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Помилка відправки запиту')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="h-16"></div>
            <div className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-lg bg-white rounded-lg shadow-sm p-6 md:p-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Відновлення пароля</h1>
                    <p className="text-gray-600 mb-6">
                        Введіть ваш телефон або email, і ми надішлемо вам інструкції для відновлення пароля
                    </p>
                    {success ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800">
                                    Якщо акаунт з таким телефоном або email існує, ми надіслали інструкції для відновлення пароля.
                                    Перевірте вашу пошту або SMS.
                                </p>
                            </div>
                            <Link href="/login" className="block w-full text-center px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors">
                                Повернутися до входу
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
                                <label htmlFor="phoneOrEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                    Телефон або Email
                                </label>
                                <input
                                    id="phoneOrEmail"
                                    type="text"
                                    value={phoneOrEmail}
                                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                                    placeholder="+380501234567 або email@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    disabled={loading}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="w-full py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {loading ? 'Відправка...' : 'Відправити'}
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
