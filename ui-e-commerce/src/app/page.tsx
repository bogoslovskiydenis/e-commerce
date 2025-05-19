import Image from 'next/image'
import Link from 'next/link'
import ProductSection from '@/components/ProductSection/ProductSection'
import { FEATURED_PRODUCTS, MAIN_CATEGORIES, REVIEWS } from '@/data/balloonData'

export default function HomePage() {
    return (
        <div>
            {/* Промо баннер */}
            <div className="relative aspect-[2/1] md:aspect-[3/1]">
                <Image
                    src="/api/placeholder/1200/600"
                    alt="Шарики на дом Киев"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                Шарики на дом в Киеве
                            </h1>
                            <p className="text-lg md:text-xl mb-8">
                                Фольгированные и латексные шарики с доставкой по Киеву за 2 часа.
                                Букеты, подарки и украшения для любого праздника.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/balloons"
                                    className="inline-block px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-center font-medium"
                                >
                                    Выбрать шарики
                                </Link>
                                <Link
                                    href="/bouquets"
                                    className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 text-center font-medium"
                                >
                                    Букеты из шаров
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Быстрый заказ */}
            <div className="bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-6">Быстрый заказ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🎈</span>
                                </div>
                                <h3 className="font-semibold mb-2">Выберите шарики</h3>
                                <p className="text-gray-600 text-sm">Более 500 видов воздушных шаров</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">🚚</span>
                                </div>
                                <h3 className="font-semibold mb-2">Быстрая доставка</h3>
                                <p className="text-gray-600 text-sm">Доставим за 2 часа по Киеву</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-2xl">💝</span>
                                </div>
                                <h3 className="font-semibold mb-2">Готовые наборы</h3>
                                <p className="text-gray-600 text-sm">Подарочные комплекты на любой повод</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Популярные категории */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Популярные категории</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {MAIN_CATEGORIES.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative aspect-square overflow-hidden rounded-lg"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                                <p className="text-sm opacity-90">{category.count} товаров</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Хиты продаж */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Хиты продаж</h2>
                    <ProductSection products={FEATURED_PRODUCTS} />
                </div>
            </div>

            {/* Преимущества */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-3xl font-bold text-center mb-8">Почему выбирают нас</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">⚡</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Быстрая доставка</h3>
                        <p className="text-gray-600">Доставим за 2 часа в любую точку Киева</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">✨</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Качество гарантировано</h3>
                        <p className="text-gray-600">Только лучшие материалы и свежий гелий</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">🎨</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Индивидуальный подход</h3>
                        <p className="text-gray-600">Создаем уникальные композиции под ваши пожелания</p>
                    </div>
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">💰</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">Доступные цены</h3>
                        <p className="text-gray-600">Лучшие цены в Киеве без переплат</p>
                    </div>
                </div>
            </div>

            {/* Отзывы */}
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Отзывы наших клиентов</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {REVIEWS.map((review, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-3">
                                    <span className="font-semibold">{review.name}</span>
                                    <div className="ml-auto flex">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400">⭐</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA секция */}
            <div className="bg-teal-600 text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Готовы сделать заказ?</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Свяжитесь с нами любым удобным способом
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:(067) 11111"
                            className="inline-block px-8 py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 font-medium"
                        >
                            📞 (067) 11111
                        </a>
                        <Link
                            href="/contacts"
                            className="inline-block px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 font-medium"
                        >
                            💬 Написать в Telegram
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}