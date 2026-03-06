'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { apiService, Product } from '@/services/api'
import ProductSection from '@/components/ProductSection/ProductSection'
import { useTranslation } from '@/contexts/LanguageContext'

export default function SalePage() {
    const { t } = useTranslation()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                setError(null)

                // Берём первую партию товаров и фильтруем только те, у которых есть скидка/старая цена
                const { products: all } = await apiService.getProducts({
                    page: 1,
                    limit: 100
                })

                const discounted = all.filter((product) => {
                    const price = Number(product.price) || 0
                    const discount = product.discount !== undefined && product.discount !== null
                        ? Number(product.discount)
                        : 0
                    const oldPrice = product.oldPrice !== undefined && product.oldPrice !== null
                        ? Number(product.oldPrice)
                        : 0

                    const hasDiscount = discount > 0
                    const hasOldPrice = oldPrice > price

                    return hasDiscount || hasOldPrice
                })

                setProducts(discounted)
            } catch (e: any) {
                console.error('Error loading sale products:', e)
                setError(typeof e?.message === 'string' ? e.message : 'Не удалось загрузить акционные товары')
                setProducts([])
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li>
                        <Link href="/" className="text-gray-500 hover:text-teal-600">
                            {t('cart.homePage')}
                        </Link>
                    </li>
                    <li className="text-gray-400 mx-2">/</li>
                    <li>
                        <span className="text-gray-900">
                            {t('navigation.sale')}
                        </span>
                    </li>
                </ol>
            </nav>

            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{t('navigation.sale')}</h1>
                <p className="text-gray-600">
                    Товары с активными скидками и специальными предложениями.
                </p>
            </div>

            {loading && (
                <div className="py-10 text-center text-gray-500">
                    Загрузка акционных товаров...
                </div>
            )}

            {!loading && error && (
                <div className="py-10 text-center text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                    Сейчас нет товаров со скидкой. Загляните позже!
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <div>
                    <div className="mb-4 text-sm text-gray-600">
                        Найдено: <span className="font-medium">{products.length}</span> товаров
                    </div>
                    <ProductSection products={products} />
                </div>
            )}
        </div>
    )
}

