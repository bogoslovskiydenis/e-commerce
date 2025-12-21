'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { cartUtils, CartItem } from '@/utils/cart'

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Загружаем товары из корзины
        const loadCart = () => {
            try {
                const items = cartUtils.getCart()
                setCartItems(items)
            } catch (error) {
                console.error('Error loading cart:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadCart()

        // Слушаем события обновления корзины
        const handleCartUpdate = () => {
            loadCart()
        }
        window.addEventListener('cartUpdated', handleCartUpdate)

        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate)
        }
    }, [])

    const updateQuantity = (item: CartItem, newQuantity: number) => {
        cartUtils.updateQuantity(item.id, newQuantity, item.attributes)
        const updated = cartUtils.getCart()
        setCartItems(updated)
    }

    const removeItem = (item: CartItem) => {
        cartUtils.removeFromCart(item.id, item.attributes)
        const updated = cartUtils.getCart()
        setCartItems(updated)
    }

    const clearCart = () => {
        cartUtils.clearCart()
        setCartItems([])
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <p className="text-gray-600">Завантаження...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <div className="mb-6 flex items-center text-sm">
                <Link href="/" className="text-gray-600 hover:text-teal-600">Головна сторінка</Link>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="font-medium">Кошик</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Кошик</h1>

            {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-36 h-36 mb-6 flex items-center justify-center">
                        <ShoppingBag size={80} className="text-gray-300" />
                    </div>

                    <h2 className="text-2xl font-bold mb-3">Ваш кошик порожній</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Додайте товари до кошика, щоб продовжити покупки.
                    </p>

                    <Link
                        href="/"
                        className="px-8 py-3 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 text-center"
                    >
                        Перейти до покупок
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Список товаров */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Товари в кошику ({cartItems.length})</h2>
                                {cartItems.length > 0 && (
                                    <button
                                        onClick={clearCart}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        Очистити кошик
                                    </button>
                                )}
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-4 flex gap-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image || '/api/placeholder/300/300'}
                                                alt={item.name}
                                                width={96}
                                                height={96}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900 mb-1">{item.name}</h3>
                                            <p className="text-lg font-semibold text-teal-600 mb-3">
                                                {item.price} грн
                                            </p>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-gray-300 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="px-4 py-2 min-w-[3rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item)}
                                                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Итоговая информация */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h2 className="text-lg font-semibold mb-4">Підсумок замовлення</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Товарів:</span>
                                    <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Сума:</span>
                                    <span>{total} грн</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Доставка:</span>
                                    <span>За тарифами перевізника</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                                    <span>Всього:</span>
                                    <span className="text-teal-600">{total} грн</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-teal-600 text-white text-center py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors mb-3"
                            >
                                Оформити замовлення
                            </Link>

                            <Link
                                href="/"
                                className="block w-full border border-gray-300 text-gray-700 text-center py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Продовжити покупки
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
