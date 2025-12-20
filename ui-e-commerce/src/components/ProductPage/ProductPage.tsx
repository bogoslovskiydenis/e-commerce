'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Share2, Minus, Plus, Truck, Award, RefreshCw } from 'lucide-react'

interface ProductPageProps {
    params: Promise<{
        category: string;
        id: string;
    }>;
}

// Интерфейс для товара
interface BalloonProductData {
    id: string;
    name: string;
    article: string;
    price: number;
    oldPrice?: number;
    discount?: number;
    images: string[];
    colors: { name: string; value: string; image?: string }[];
    sizes: string[];
    withHelium: boolean;
    material: string;
    category: string;
    description: string;
    features: string[];
    inStock: boolean;
    deliveryInfo: {
        free: string;
        paid: string;
        express: string;
    };
}

// Моковые данные товаров по категориям
const PRODUCTS_DATA: Record<string, Record<string, BalloonProductData>> = {
    hearts: {
        '1': {
            id: '1',
            name: 'Фольгированное сердце красное',
            article: 'Артикул: HEART001',
            price: 150,
            oldPrice: 200,
            discount: 25,
            images: [
                '/images/hard.jpg',
                '/images/hard.jpg',
                '/images/hard.jpg',
                '/images/hard.jpg'
            ],
            colors: [
                { name: 'Красный', value: 'red' },
                { name: 'Розовый', value: 'pink' },
                { name: 'Золотой', value: 'gold' }
            ],
            sizes: ['45см', '60см', '90см'],
            withHelium: true,
            material: 'Фольга',
            category: 'Сердца',
            description: 'Красивое фольгированное сердце идеально подходит для романтических событий и праздников. Высокое качество материала обеспечивает долгое время полета с гелием.',
            features: [
                'Материал: высококачественная фольга',
                'Долгое время полета с гелием (до 7 дней)',
                'Яркие и насыщенные цвета',
                'Подходит для улицы и помещений',
                'Безопасно для детей',
                'Многоразовое использование'
            ],
            inStock: true,
            deliveryInfo: {
                free: 'Бесплатно от 500 грн',
                paid: 'От 50 грн',
                express: 'От 100 грн (2 часа)'
            }
        }
    },
    stars: {
        '2': {
            id: '2',
            name: 'Звезда фольгированная золотая',
            article: 'Артикул: STAR002',
            price: 120,
            images: ['/images/hard.jpg', '/images/hard.jpg'],
            colors: [
                { name: 'Золотой', value: 'gold' },
                { name: 'Серебряный', value: 'silver' }
            ],
            sizes: ['45см', '60см'],
            withHelium: true,
            material: 'Фольга',
            category: 'Звезды',
            description: 'Яркая звезда из фольги для создания праздничной атмосферы.',
            features: [
                'Фольгированная поверхность',
                'Долго держит форму',
                'Подходит для любых праздников'
            ],
            inStock: true,
            deliveryInfo: {
                free: 'Бесплатно от 500 грн',
                paid: 'От 50 грн',
                express: 'От 100 грн (2 часа)'
            }
        }
    },
    numbers: {
        '3': {
            id: '3',
            name: 'Цифра "1" серебряная',
            article: 'Артикул: NUM003',
            price: 350,
            oldPrice: 400,
            discount: 12,
            images: ['/api/placeholder/300/300'],
            colors: [
                { name: 'Серебряный', value: 'silver' },
                { name: 'Золотой', value: 'gold' }
            ],
            sizes: ['90см', '100см'],
            withHelium: true,
            material: 'Фольга',
            category: 'Цифры',
            description: 'Большая цифра для празднования дня рождения.',
            features: [
                'Размер 90-100 см',
                'Яркий металлический цвет',
                'Отлично подходит для фото'
            ],
            inStock: true,
            deliveryInfo: {
                free: 'Бесплатно от 500 грн',
                paid: 'От 50 грн',
                express: 'От 100 грн (2 часа)'
            }
        }
    },
    bouquets: {
        '2': {
            id: '2',
            name: 'Букет "С днем рождения"',
            article: 'Артикул: BQ002',
            price: 450,
            images: ['/api/placeholder/300/300'],
            colors: [
                { name: 'Разноцветный', value: 'multicolor' }
            ],
            sizes: ['Стандартный'],
            withHelium: true,
            material: 'Фольга + Латекс',
            category: 'Букеты',
            description: 'Готовый букет из разноцветных шаров для празднования дня рождения.',
            features: [
                'Готовая композиция',
                'Включает 7-10 шаров',
                'Красивая упаковка'
            ],
            inStock: true,
            deliveryInfo: {
                free: 'Бесплатно от 500 грн',
                paid: 'От 50 грн',
                express: 'От 100 грн (2 часа)'
            }
        }
    },
    sets: {
        '4': {
            id: '4',
            name: 'Набор "Единорог"',
            article: 'Артикул: SET004',
            price: 650,
            oldPrice: 750,
            discount: 13,
            images: ['/api/placeholder/300/300'],
            colors: [
                { name: 'Розово-голубой', value: 'pink-blue' }
            ],
            sizes: ['Полный набор'],
            withHelium: true,
            material: 'Фольга + Латекс',
            category: 'Наборы',
            description: 'Волшебный набор в тематике единорога для детского праздника.',
            features: [
                'Тематические шары',
                'Фигура единорога',
                'Дополнительные аксессуары'
            ],
            inStock: false,
            deliveryInfo: {
                free: 'Бесплатно от 500 грн',
                paid: 'От 50 грн',
                express: 'От 100 грн (2 часа)'
            }
        }
    }
}

export default function ProductPage({ params }: ProductPageProps) {
    const { category, id } = use(params)
    const product = PRODUCTS_DATA[category]?.[id]

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.value || '')
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || '')
    const [withHelium, setWithHelium] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState('description')

    // Если товар не найден
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
                    <Link href="/balloons" className="text-teal-600 hover:text-teal-700">
                        Вернуться к каталогу
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

    const currentPrice = withHelium ? product.price + 30 : product.price
    const totalPrice = currentPrice * quantity

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Хлебные крошки */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-3">
                    <nav className="text-sm">
                        <ol className="flex items-center space-x-2">
                            <li><Link href="/" className="text-gray-500 hover:text-teal-600">Главная</Link></li>
                            <li className="text-gray-400">/</li>
                            <li><Link href="/balloons" className="text-gray-500 hover:text-teal-600">Шарики</Link></li>
                            <li className="text-gray-400">/</li>
                            <li className="text-gray-900">{product.name}</li>
                        </ol>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                        {/* Изображения товара */}
                        <div className="space-y-4">
                            {/* Основное изображение */}
                            <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                                {product.discount && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        -{product.discount}%
                                    </div>
                                )}
                            </div>

                            {/* Миниатюры */}
                            <div className="grid grid-cols-4 gap-3">
                                {product.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                                            selectedImage === index ? 'border-teal-600' : 'border-transparent hover:border-gray-300'
                                        }`}
                                    >
                                        <Image
                                            src={image}
                                            alt={`${product.name} ${index + 1}`}
                                            fill
                                            sizes="(max-width: 768px) 25vw, 12.5vw"
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Информация о товаре */}
                        <div className="space-y-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-2">{product.article}</p>
                                <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product.name}</h1>

                                {/* Цена */}
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-3xl font-bold">{currentPrice} ГРН</span>
                                    {product.oldPrice && (
                                        <span className="text-xl text-gray-500 line-through">{product.oldPrice} ГРН</span>
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
                                </div>
                            </div>

                            {/* Выбор цвета */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">Цвет:</h3>
                                <div className="flex gap-3">
                                    {product.colors.map((color) => (
                                        <button
                                            key={color.value}
                                            onClick={() => setSelectedColor(color.value)}
                                            className={`px-4 py-2 border rounded-lg transition-colors ${
                                                selectedColor === color.value
                                                    ? 'border-teal-600 bg-teal-50'
                                                    : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Выбор размера */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">Размер:</h3>
                                <div className="flex gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
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

                            {/* С гелием */}
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={withHelium}
                                        onChange={(e) => setWithHelium(e.target.checked)}
                                        className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                                    />
                                    <span className="text-lg">С гелием (+30 ГРН)</span>
                                </label>
                                <p className="text-sm text-gray-500 mt-1">Шар будет летать 5-7 дней</p>
                            </div>

                            {/* Количество */}
                            <div>
                                <h3 className="text-lg font-medium mb-3">Количество:</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center border rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange('decrease')}
                                            className="p-2 hover:bg-gray-100 transition-colors"
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
                                    <span className="text-lg font-medium">Итого: {totalPrice} ГРН</span>
                                </div>
                            </div>

                            {/* Кнопки действий */}
                            <div className="space-y-3">
                                {product.inStock ? (
                                    <>
                                        <button className="w-full bg-teal-600 text-white py-4 rounded-lg hover:bg-teal-700 font-medium text-lg transition-colors flex items-center justify-center gap-2">
                                            <ShoppingBag size={20} />
                                            КУПИТЬ
                                        </button>
                                        <button className="w-full border-2 border-teal-600 text-teal-600 py-4 rounded-lg hover:bg-teal-50 font-medium text-lg transition-colors">
                                            БЫСТРАЯ ПОКУПКА
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="w-full bg-gray-300 text-gray-600 py-4 rounded-lg font-medium text-lg text-center">
                                            НЕТ В НАЛИЧИИ
                                        </div>
                                        <button className="w-full border-2 border-gray-300 text-gray-600 py-4 rounded-lg font-medium text-lg transition-colors hover:border-gray-400">
                                            УВЕДОМИТЬ О ПОСТУПЛЕНИИ
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Информация о доставке */}
                            <div className="grid grid-cols-1 gap-4 pt-6 border-t">
                                <div className="flex items-start gap-3">
                                    <Truck className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">БЫСТРАЯ ДОСТАВКА</h4>
                                        <p className="text-sm text-gray-600">Доставка по Киеву за 2 часа. Новая почта, Укрпочта, Meest Express</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Award className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">ГАРАНТИЯ КАЧЕСТВА</h4>
                                        <p className="text-sm text-gray-600">Качественные материалы и фурнитура, мастерская и обслуживание</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <RefreshCw className="text-teal-600 mt-1" size={20} />
                                    <div>
                                        <h4 className="font-medium">ПРОСТОЙ ВОЗВРАТ И ОБМЕН</h4>
                                        <p className="text-sm text-gray-600">В течение 14 календарных дней</p>
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
                                    { key: 'description', label: 'ОПИСАНИЕ' },
                                    { key: 'characteristics', label: 'ХАРАКТЕРИСТИКИ' },
                                    { key: 'delivery', label: 'ДОСТАВКА' }
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
                                            <h3 className="text-xl font-bold mb-4">{product.name}: воплощение праздника и радости</h3>
                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                {product.description}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-3">Особенности:</h4>
                                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                                {product.features.map((feature, index) => (
                                                    <li key={index}>{feature}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'characteristics' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold mb-4">Основные характеристики</h4>
                                            <dl className="space-y-2">
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">Материал:</dt>
                                                    <dd className="font-medium">{product.material}</dd>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">Категория:</dt>
                                                    <dd className="font-medium">{product.category}</dd>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">С гелием:</dt>
                                                    <dd className="font-medium">{product.withHelium ? 'Да' : 'Нет'}</dd>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">Доступные размеры:</dt>
                                                    <dd className="font-medium">{product.sizes.join(', ')}</dd>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">Время полета:</dt>
                                                    <dd className="font-medium">5-7 дней</dd>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <dt className="text-gray-600">Наличие:</dt>
                                                    <dd className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'delivery' && (
                                    <div className="space-y-6">
                                        <h4 className="font-bold">Доставка в интернет-магазине шариков</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">По Киеву</h5>
                                                <p className="text-sm text-gray-600 mb-2">{product.deliveryInfo.free}</p>
                                                <p className="text-sm text-gray-600">{product.deliveryInfo.paid}</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">Экспресс доставка</h5>
                                                <p className="text-sm text-gray-600">{product.deliveryInfo.express}</p>
                                            </div>
                                            <div className="p-4 border rounded-lg">
                                                <h5 className="font-medium mb-2">Новая почта</h5>
                                                <p className="text-sm text-gray-600">По тарифам перевозчика</p>
                                            </div>
                                        </div>
                                        <div className="prose max-w-none text-gray-600">
                                            <p>
                                                Мы осуществляем быструю доставку воздушных шаров по Киеву и всей Украине.
                                                Наши курьеры бережно доставят ваш заказ в целости и сохранности.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Похожие товары */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">ПОХОЖИЕ ТОВАРЫ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Карточки похожих товаров */}
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="aspect-square bg-gray-100 relative">
                                    <Image
                                        src="/images/hard.jpg"
                                        alt="Похожий товар"
                                        fill
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium mb-2">Сердце розовое</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-teal-600 font-bold">180 ГРН</span>
                                        <span className="text-sm text-gray-500 line-through">220 ГРН</span>
                                    </div>
                                    <button className="w-full mt-3 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm">
                                        Быстрый заказ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}