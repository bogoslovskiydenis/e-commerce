'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ShoppingBag, CheckCircle2 } from 'lucide-react'
import { cartUtils, CartItem, AppliedPromotion } from '@/utils/cart'
import { apiService } from '@/services/api'
import PromoCodeInput from '@/components/PromoCodeInput/PromoCodeInput'

export default function CheckoutPage() {
    const router = useRouter()
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [appliedPromotion, setAppliedPromotion] = useState<AppliedPromotion | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        city: '',
        street: '',
        building: '',
        apartment: '',
        postalCode: '',
        notes: '',
    })

    useEffect(() => {
        const items = cartUtils.getCart()
        if (items.length === 0) {
            router.push('/cart')
            return
        }
        setCartItems(items)
        setAppliedPromotion(cartUtils.getAppliedPromotion())
        setIsLoading(false)

        const handlePromotionUpdate = () => {
            setAppliedPromotion(cartUtils.getAppliedPromotion())
        }
        window.addEventListener('promotionUpdated', handlePromotionUpdate)

        return () => {
            window.removeEventListener('promotionUpdated', handlePromotionUpdate)
        }
    }, [router])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!formData.name.trim() || !formData.phone.trim()) {
            setError('Пожалуйста, заполните имя и телефон')
            return
        }

        setIsSubmitting(true)

        try {
            const orderData = {
                customer: {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim() || undefined,
                },
                items: cartItems.map(item => ({
                    productId: item.productId || item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shippingAddress: formData.city || formData.street ? {
                    city: formData.city || undefined,
                    street: formData.street || undefined,
                    building: formData.building || undefined,
                    apartment: formData.apartment || undefined,
                    postalCode: formData.postalCode || undefined,
                } : undefined,
                notes: formData.notes.trim() || undefined,
                discountAmount: discount > 0 ? discount : undefined,
                promotionCode: appliedPromotion?.code || undefined,
            }

            const order = await apiService.createOrder(orderData)

            // Очистить корзину
            cartUtils.clearCart()

            // Перенаправить на страницу успеха
            router.push(`/checkout/success?orderNumber=${order.orderNumber}`)
        } catch (err: any) {
            console.error('Error creating order:', err)
            setError(err.message || 'Произошла ошибка при оформлении заказа. Попробуйте еще раз.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = cartUtils.calculateDiscount(subtotal, appliedPromotion, cartItems)
    const total = subtotal - discount

    if (isLoading) {
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
            <div className="mb-6 flex items-center text-sm">
                <Link href="/" className="text-gray-600 hover:text-teal-600">Главная</Link>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <Link href="/cart" className="text-gray-600 hover:text-teal-600">Корзина</Link>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="font-medium">Оформление заказа</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Оформление заказа</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-6">Контактная информация</h2>

                        {error && (
                            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Имя <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Телефон <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+380 (XX) XXX-XX-XX"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            </div>
                        </div>

                        <h2 className="text-lg font-semibold mb-4 mt-8">Адрес доставки (необязательно)</h2>

                        <div className="space-y-4 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                        Город
                                    </label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                                        Улица
                                    </label>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                                        Дом
                                    </label>
                                    <input
                                        type="text"
                                        id="building"
                                        name="building"
                                        value={formData.building}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                                        Квартира
                                    </label>
                                    <input
                                        type="text"
                                        id="apartment"
                                        name="apartment"
                                        value={formData.apartment}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        Индекс
                                    </label>
                                    <input
                                        type="text"
                                        id="postalCode"
                                        name="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Комментарий к заказу
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={4}
                                value={formData.notes}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                placeholder="Дополнительная информация о заказе..."
                            />
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                        <h2 className="text-lg font-semibold mb-4">Ваш заказ</h2>

                        <PromoCodeInput
                            onPromotionApplied={(promo) => setAppliedPromotion(promo)}
                            className="mb-4"
                        />

                        <div className="space-y-3 mb-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.image || '/api/placeholder/300/300'}
                                            alt={item.name}
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-sm text-gray-600">
                                            {item.quantity} × {item.price} грн
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {item.price * item.quantity} грн
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                            <div className="flex justify-between text-gray-600">
                                <span>Товаров:</span>
                                <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Сумма:</span>
                                <span>{subtotal} грн</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Знижка:</span>
                                    <span>-{discount} грн</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-600">
                                <span>Доставка:</span>
                                <span>По договоренности</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                                <span>Всього:</span>
                                <span className="text-teal-600">{total} грн</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-teal-600 text-white text-center py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Оформление...' : 'Оформить заказ'}
                        </button>

                        <p className="text-xs text-gray-500 mt-3 text-center">
                            Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

