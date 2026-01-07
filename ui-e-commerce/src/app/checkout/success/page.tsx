'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react'

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [orderNumber, setOrderNumber] = useState<string | null>(null)

    useEffect(() => {
        const order = searchParams.get('orderNumber')
        if (!order) {
            router.push('/')
            return
        }
        setOrderNumber(order)
    }, [searchParams, router])

    if (!orderNumber) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">Загрузка...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={48} className="text-green-600" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold mb-4">Заказ успешно оформлен!</h1>

                    <p className="text-gray-600 mb-2">
                        Номер вашего заказа:
                    </p>
                    <p className="text-2xl font-bold text-teal-600 mb-6">
                        {orderNumber}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                        <h2 className="font-semibold mb-3">Что дальше?</h2>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>• Мы свяжемся с вами в ближайшее время для подтверждения заказа</li>
                            <li>• Вы получите информацию о доставке и оплате</li>
                            <li>• Статус заказа можно отслеживать в личном кабинете</li>
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Home size={20} />
                            На главную
                        </Link>
                        <Link
                            href="/"
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            Продолжить покупки
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}



