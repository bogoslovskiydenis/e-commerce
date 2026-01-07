'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiService, Order } from '@/services/api'
import { User, Package, MapPin, Phone, Mail, Edit2, LogOut } from 'lucide-react'

export default function AccountPage() {
    const router = useRouter()
    const { customer, isAuthenticated, isLoading, logout, updateProfile } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [editData, setEditData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    })

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [isAuthenticated, isLoading, router])

    useEffect(() => {
        if (customer) {
            setEditData({
                name: customer.name || '',
                email: customer.email || '',
                phone: customer.phone || '',
                address: customer.address || '',
            })
        }
    }, [customer])

    useEffect(() => {
        if (isAuthenticated) {
            loadOrders()
        }
    }, [isAuthenticated])

    const loadOrders = async () => {
        try {
            setOrdersLoading(true)
            const data = await apiService.getCustomerOrders({ page: 1, limit: 20 })
            setOrders(data.orders)
        } catch (error) {
            console.error('Failed to load orders:', error)
        } finally {
            setOrdersLoading(false)
        }
    }

    const handleSaveProfile = async () => {
        try {
            await updateProfile(editData)
            setIsEditing(false)
        } catch (error: any) {
            alert(error.message || 'Помилка оновлення профілю')
        }
    }

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            NEW: 'bg-blue-100 text-blue-800',
            CONFIRMED: 'bg-yellow-100 text-yellow-800',
            PROCESSING: 'bg-purple-100 text-purple-800',
            READY: 'bg-indigo-100 text-indigo-800',
            SHIPPED: 'bg-green-100 text-green-800',
            DELIVERED: 'bg-green-200 text-green-900',
            CANCELLED: 'bg-red-100 text-red-800',
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    const getStatusText = (status: string) => {
        const texts: Record<string, string> = {
            NEW: 'Новий',
            CONFIRMED: 'Підтверджено',
            PROCESSING: 'В обробці',
            READY: 'Готово до відправки',
            SHIPPED: 'Відправлено',
            DELIVERED: 'Доставлено',
            CANCELLED: 'Скасовано',
        }
        return texts[status] || status
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Завантаження...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !customer) {
        return null
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Особистий кабінет</h1>
                    <p className="text-gray-600 mt-1">Керуйте своїм профілем та замовленнями</p>
                </div>

                {/* Табы */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'profile'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <User size={18} />
                                    Профіль
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                                    activeTab === 'orders'
                                        ? 'border-amber-500 text-amber-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Package size={18} />
                                    Мої замовлення
                                </div>
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {/* Профиль */}
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">Особиста інформація</h2>
                                    {!isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                                        >
                                            <Edit2 size={16} />
                                            Редагувати
                                        </button>
                                    )}
                                </div>

                                {isEditing ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ім'я
                                            </label>
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Телефон
                                            </label>
                                            <input
                                                type="tel"
                                                value={editData.phone}
                                                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Адреса
                                            </label>
                                            <textarea
                                                value={editData.address}
                                                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleSaveProfile}
                                                className="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                                            >
                                                Зберегти
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false)
                                                    setEditData({
                                                        name: customer.name || '',
                                                        email: customer.email || '',
                                                        phone: customer.phone || '',
                                                        address: customer.address || '',
                                                    })
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                            >
                                                Скасувати
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <User className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Ім'я</p>
                                                <p className="text-gray-900 font-medium">{customer.name}</p>
                                            </div>
                                        </div>
                                        {customer.email && (
                                            <div className="flex items-start gap-3">
                                                <Mail className="text-gray-400 mt-1" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="text-gray-900">{customer.email}</p>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-start gap-3">
                                            <Phone className="text-gray-400 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-gray-500">Телефон</p>
                                                <p className="text-gray-900">{customer.phone}</p>
                                            </div>
                                        </div>
                                        {customer.address && (
                                            <div className="flex items-start gap-3">
                                                <MapPin className="text-gray-400 mt-1" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Адреса</p>
                                                    <p className="text-gray-900">{customer.address}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-6 border-t border-gray-200">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50"
                                    >
                                        <LogOut size={16} />
                                        Вийти з акаунту
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Заказы */}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-xl font-semibold mb-6">Мої замовлення</h2>
                                {ordersLoading ? (
                                    <div className="text-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                                        <p className="mt-4 text-gray-600">Завантаження замовлень...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="mx-auto text-gray-400" size={48} />
                                        <p className="mt-4 text-gray-600">У вас поки немає замовлень</p>
                                        <button
                                            onClick={() => router.push('/')}
                                            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600"
                                        >
                                            Перейти до покупок
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            Замовлення #{order.orderNumber}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-gray-900">
                                                            {Number(order.totalAmount).toFixed(2)} ₴
                                                        </p>
                                                        <span
                                                            className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(
                                                                order.status
                                                            )}`}
                                                        >
                                                            {getStatusText(order.status)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-200 pt-4 mt-4">
                                                    <p className="text-sm font-medium text-gray-700 mb-2">Товари:</p>
                                                    <div className="space-y-2">
                                                        {order.items.map((item) => (
                                                            <div key={item.id} className="flex items-center justify-between text-sm">
                                                                <div className="flex items-center gap-3">
                                                                    {item.product.images?.[0] && (
                                                                        <img
                                                                            src={item.product.images[0]}
                                                                            alt={item.product.title}
                                                                            className="w-12 h-12 object-cover rounded"
                                                                        />
                                                                    )}
                                                                    <div>
                                                                        <p className="text-gray-900">{item.product.title}</p>
                                                                        <p className="text-gray-500">Кількість: {item.quantity}</p>
                                                                    </div>
                                                                </div>
                                                                <p className="text-gray-900 font-medium">
                                                                    {Number(item.total).toFixed(2)} ₴
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}



