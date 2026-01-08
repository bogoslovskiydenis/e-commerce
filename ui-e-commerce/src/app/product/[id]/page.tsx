'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Minus, Plus, Truck, Award, RefreshCw, Check } from 'lucide-react'
import { apiService } from '@/services/api'
import { cartUtils } from '@/utils/cart'
import ProductReviews from '@/components/ProductReviews/ProductReviews'
import { useTranslation } from '@/contexts/LanguageContext'

interface ProductPageProps {
    params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
    const { t, language } = useTranslation()
    const { id } = use(params)
    const router = useRouter()
    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [withHelium, setWithHelium] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')
    const [isAdded, setIsAdded] = useState(false)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true)
                const productData = await apiService.getProductById(id, language)
                if (productData) {
                    setProduct(productData)
                    // Устанавливаем значения по умолчанию
                    if (productData.attributes?.colors?.[0]) {
                        setSelectedColor(productData.attributes.colors[0].value || productData.attributes.colors[0])
                    }
                    if (productData.attributes?.sizes?.[0]) {
                        setSelectedSize(productData.attributes.sizes[0])
                    }
                } else {
                    router.push('/404')
                }
            } catch (error) {
                console.error('Error loading product:', error)
                router.push('/404')
            } finally {
                setLoading(false)
            }
        }
        loadProduct()
    }, [id, router, language])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t('product.loading')}</p>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">{t('product.notFound')}</h1>
                    <Link href="/" className="text-teal-600 hover:text-teal-700">
                        {t('product.backToHome')}
                    </Link>
                </div>
            </div>
        )
    }

    const handleQuantityChange = (action: 'increase' | 'decrease') => {
        if (action === 'increase') {
            setQuantity(prev => prev + 1)
        } else if (action === 'decrease' && quantity > 1) {
            setQuantity(prev => prev - 1)
        }
    }

    const handleAddToCart = () => {
        if (!inStock) return

        cartUtils.addToCart({
            id: product.id,
            name: product.title || product.name || '',
            price: currentPrice,
            image: images[0],
            productId: product.id,
            quantity: quantity,
            attributes: {
                color: selectedColor,
                size: selectedSize,
                withHelium: withHelium
            }
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    const handleQuickOrder = () => {
        handleAddToCart()
        // Можно добавить редирект на страницу быстрого заказа
        router.push('/checkout')
    }

    const currentPrice = withHelium ? Number(product.price) + 30 : Number(product.price)
    const totalPrice = currentPrice * quantity
    const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : ['/api/placeholder/300/300']
    const colors = product.attributes?.colors || []
    const sizes = product.attributes?.sizes || []
    const inStock = product.inStock !== false && (product.stockQuantity || 0) > 0

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Хлебные крошки */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="text-sm">
                        <ol className="flex items-center space-x-2">
                            <li><Link href="/" className="text-gray-500 hover:text-teal-600">{t('product.homePage')}</Link></li>
                            {product.category && (
                                <>
                                    <li className="text-gray-400">/</li>
                                    <li><Link href={`/${product.category.slug || product.categoryId}`} className="text-gray-500 hover:text-teal-600">{product.category.name || t('product.category')}</Link></li>
                                </>
                            )}
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900">{product.title || product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        {/* Изображения товара */}
                        <div className="space-y-4">
                            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={images[selectedImage] || images[0]}
                                    alt={product.title || product.name || 'Product'}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                                {product.discount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        -{product.discount}%
                                    </div>
                                )}
                                {!inStock && (
                                    <div className="absolute top-4 right-4 bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {t('product.outOfStock')}
                                    </div>
                                )}
                            </div>

                            {/* Миниатюры */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {images.map((image: string, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImage(index)}
                                            className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                                                selectedImage === index ? 'border-teal-600' : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`${product.title || product.name} ${index + 1}`}
                                                fill
                                                sizes="(max-width: 768px) 25vw, 12.5vw"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Информация о товаре */}
                        <div className="space-y-6">
                            <div>
                                {product.sku && <p className="text-sm text-gray-500 mb-2">{t('product.sku')} {product.sku}</p>}
                                <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.title || product.name}</h1>

                                {/* Цена */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-bold">{currentPrice} {t('product.currency')}</span>
                                    {product.oldPrice && (
                                        <span className="text-xl text-gray-500 line-through">{Number(product.oldPrice)} {t('product.currency')}</span>
                                    )}
                                    {product.discount && (
                                        <span className="text-lg text-red-600">-{product.discount}%</span>
                                    )}
                                </div>

                                {/* Действия */}
                                <div className="flex items-center gap-3 mb-6">
                                    <button className="p-2 border rounded-lg hover:border-teal-600 transition-colors">
                                        <Heart size={20} />
                                    </button>
                                    <button className="p-2 border rounded-lg hover:border-teal-600 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                    <div className="ml-auto">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                            inStock
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {inStock ? t('product.inStock') : t('product.outOfStock')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Выбор цвета */}
                            {colors.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-3">{t('product.color')}</h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {colors.map((color: any, index: number) => {
                                            const colorValue = typeof color === 'string' ? color : color.value || color.name
                                            const colorName = typeof color === 'string' ? color : color.name || color.value
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedColor(colorValue)}
                                                    className={`px-4 py-2 border rounded-lg transition-colors ${
                                                        selectedColor === colorValue
                                                            ? 'border-teal-600 bg-teal-50'
                                                            : 'border-gray-300 hover:border-gray-400'
                                                    }`}
                                                >
                                                    {colorName}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Выбор размера */}
                            {sizes.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-medium mb-3">{t('product.size')}</h3>
                                    <div className="flex gap-3 flex-wrap">
                                        {sizes.map((size: string, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedSize(size)}
                                                className={`px-4 py-2 border rounded-lg transition-colors ${
                                                    selectedSize === size
                                                        ? 'border-teal-600 bg-teal-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* С гелием */}
                            {product.attributes?.withHelium !== undefined && (
                                <div>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={withHelium}
                                            onChange={(e) => setWithHelium(e.target.checked)}
                                            className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                        />
                                        <span className="text-lg">{t('product.withHelium')}</span>
                                    </label>
                                    <p className="text-sm text-gray-500 mt-1">{t('product.withHeliumDesc')}</p>
                                </div>
                            )}

                            {/* Количество */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">{t('product.quantity')}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                            disabled={quantity <= 1}
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange('increase')}
                                            className="p-2 hover:bg-gray-100 transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <span className="text-lg font-medium">{t('product.total')}: {totalPrice} {t('product.currency')}</span>
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="space-y-3">
                                {inStock ? (
                                    <>
                                        <button 
                                            onClick={handleAddToCart}
                                            className={`w-full py-4 rounded-lg font-medium text-lg transition-colors flex items-center justify-center gap-2 ${
                                                isAdded
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-teal-600 text-white hover:bg-teal-700'
                                            }`}
                                        >
                                            {isAdded ? (
                                                <>
                                                    <Check size={20} />
                                                    {t('product.addedToCart')}
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingBag size={20} />
                                                    {t('product.addToCart')}
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={handleQuickOrder}
                                            className="w-full border-2 border-teal-600 text-teal-600 py-4 rounded-lg hover:bg-teal-50 font-medium text-lg transition-colors"
                                        >
                                            {t('product.quickOrder')}
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-medium text-lg text-center">
                                            {t('product.outOfStock')}
                                        </div>
                                        <button className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-lg font-medium text-lg transition-colors hover:border-gray-400">
                                            {t('product.notifyArrival')}
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Информация о доставке */}
                            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
                                <div className="flex items-start gap-3">
                                    <Truck className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">{t('product.fastDelivery')}</h4>
                                        <p className="text-sm text-gray-600">{t('product.fastDeliveryDesc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Award className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">{t('product.qualityGuarantee')}</h4>
                                        <p className="text-sm text-gray-600">{t('product.qualityGuaranteeDesc')}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RefreshCw className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">{t('product.easyReturn')}</h4>
                                        <p className="text-sm text-gray-600">{t('product.easyReturnDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Табы с информацией */}
                    <div className="border-t">
                        <div className="container mx-auto px-6">
                            <div className="flex border-b">
                                {[
                                    { key: 'description', label: t('product.description') },
                                    { key: 'characteristics', label: t('product.characteristics') },
                                    { key: 'delivery', label: t('product.delivery') }
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`px-6 py-4 font-medium transition-colors ${
                                            activeTab === tab.key
                                                ? 'border-b-2 border-teal-600 text-teal-600'
                                                : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="py-8">
                                {activeTab === 'description' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-4">{product.title || product.name}</h3>
                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                {product.description || product.shortDescription || t('product.noDescription')}
                                            </p>
                                        </div>
                                        {product.attributes?.features && product.attributes.features.length > 0 && (
                                            <div>
                                                <h4 className="font-bold mb-3">{t('product.features')}</h4>
                                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                                    {product.attributes.features.map((feature: string, index: number) => (
                                                        <li key={index}>{feature}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'characteristics' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold mb-4">{t('product.characteristics')}</h4>
                                            <dl className="space-y-2">
                                                {product.attributes?.material && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <dt className="text-gray-600">{t('product.material')}</dt>
                                                        <dd className="font-medium">{product.attributes.material}</dd>
                                                    </div>
                                                )}
                                                {product.category && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <dt className="text-gray-600">{t('product.categoryLabel')}</dt>
                                                        <dd className="font-medium">{product.category.name || product.categoryId}</dd>
                                                    </div>
                                                )}
                                                {product.attributes?.withHelium !== undefined && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <dt className="text-gray-600">{t('product.withHeliumLabel')}</dt>
                                                        <dd className="font-medium">{product.attributes.withHelium ? t('product.yes') : t('product.no')}</dd>
                                                    </div>
                                                )}
                                                {sizes.length > 0 && (
                                                    <div className="flex justify-between py-2 border-b">
                                                        <dt className="text-gray-600">{t('product.availableSizes')}</dt>
                                                        <dd className="font-medium">{sizes.join(', ')}</dd>
                                                    </div>
                                                )}
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">{t('product.availability')}</dt>
                                                    <dd className={`font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                                                        {inStock ? t('product.inStock') : t('product.outOfStock')}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'delivery' && (
                                    <div className="space-y-6">
                                        <h4 className="font-bold">{t('product.deliveryTitle')}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">{t('product.deliveryKyiv')}</h5>
                                                <p className="text-sm text-gray-600 mb-2">{t('product.deliveryKyivFree')}</p>
                                                <p className="text-sm text-gray-600">{t('product.deliveryKyivPrice')}</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">{t('product.deliveryExpress')}</h5>
                                                <p className="text-sm text-gray-600">{t('product.deliveryExpressPrice')}</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">{t('product.deliveryNovaPoshta')}</h5>
                                                <p className="text-sm text-gray-600">{t('product.deliveryNovaPoshtaPrice')}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Отзывы */}
            <div className="container mx-auto px-4 py-8">
                <ProductReviews productId={id} />
            </div>
        </div>
    )
}
