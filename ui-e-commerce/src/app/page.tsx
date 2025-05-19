'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductSection from '@/components/ProductSection/ProductSection'
import { FEATURED_PRODUCTS, MAIN_CATEGORIES, REVIEWS } from '@/data/balloonData'

// Данные для слайдера баннеров
const BANNER_SLIDES = [
    {
        id: 1,
        image: '/api/placeholder/1200/600',
        title: 'Шарики на дом в Киеве',
        subtitle: 'Фольгированные и латексные шарики с доставкой по Киеву за 2 часа. Букеты, подарки и украшения для любого праздника.',
        primaryButton: { text: 'Выбрать шарики', href: '/balloons' },
        secondaryButton: { text: 'Букеты из шаров', href: '/bouquets' }
    },
    {
        id: 2,
        image: '/api/placeholder/1200/600',
        title: 'Акции до -70%',
        subtitle: 'Супер скидки на все виды шариков! Спешите воспользоваться уникальными предложениями.',
        primaryButton: { text: 'Смотреть акции', href: '/sale' },
        secondaryButton: { text: 'Каталог', href: '/balloons' }
    },
    {
        id: 3,
        image: '/api/placeholder/1200/600',
        title: 'Букеты из шаров',
        subtitle: 'Готовые композиции для любого праздника. Быстрая доставка по Киеву за 2 часа.',
        primaryButton: { text: 'Заказать букет', href: '/bouquets' },
        secondaryButton: { text: 'Контакты', href: '/contacts' }
    }
]

export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Автоматическое переключение слайдов
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
        }, 5000) // Переключение каждые 5 секунд

        return () => clearInterval(timer)
    }, [])

    const goToSlide = (index: number) => {
        setCurrentSlide(index)
    }

    const goToPrevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + BANNER_SLIDES.length) % BANNER_SLIDES.length)
    }

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % BANNER_SLIDES.length)
    }

    return (
        <div>
            {/* Слайдер баннеров */}
            <div className="relative aspect-[3/2] sm:aspect-[5/2] md:aspect-[3/1] lg:aspect-[7/2] overflow-hidden">
                {BANNER_SLIDES.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${
                            index === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <Image
                            src={slide.image}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30" />
                        <div className="absolute inset-0 flex items-center">
                            <div className="container mx-auto px-4">
                                <div className="max-w-xl lg:max-w-2xl text-white">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 leading-tight">
                                        {slide.title}
                                    </h1>
                                    <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-8 leading-relaxed">
                                        {slide.subtitle}
                                    </p>
                                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                                        <Link
                                            href={slide.primaryButton.href}
                                            className="inline-block w-44 px-4 sm:px-6 py-2 sm:py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-center font-medium text-xs sm:text-sm transition-colors"
                                        >
                                            {slide.primaryButton.text}
                                        </Link>
                                        <Link
                                            href={slide.secondaryButton.href}
                                            className="inline-block w-44 px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-teal-600 rounded-lg hover:bg-gray-100 text-center font-medium text-xs sm:text-sm transition-colors"
                                        >
                                            {slide.secondaryButton.text}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Кнопки навигации */}
                <button
                    onClick={goToPrevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Предыдущий слайд"
                >
                    <ChevronLeft size={20} className="text-white" />
                </button>
                <button
                    onClick={goToNextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                    aria-label="Следующий слайд"
                >
                    <ChevronRight size={20} className="text-white" />
                </button>

                {/* Индикаторы слайдов */}
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {BANNER_SLIDES.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                            }`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Быстрый заказ */}
            <div className="bg-gray-50 py-6 sm:py-8 lg:py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6 lg:mb-8">
                            Быстрый заказ
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl">🎈</span>
                                </div>
                                <h3 className="font-semibold mb-2 text-sm sm:text-base">Выберите шарики</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Более 500 видов воздушных шаров</p>
                            </div>
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl">🚚</span>
                                </div>
                                <h3 className="font-semibold mb-2 text-sm sm:text-base">Быстрая доставка</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Доставим за 2 часа по Киеву</p>
                            </div>
                            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center sm:col-span-2 lg:col-span-1">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-xl sm:text-2xl">💝</span>
                                </div>
                                <h3 className="font-semibold mb-2 text-sm sm:text-base">Готовые наборы</h3>
                                <p className="text-gray-600 text-xs sm:text-sm">Подарочные комплекты на любой повод</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Популярные категории */}
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10">
                    Популярные категории
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
                    {MAIN_CATEGORIES.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                                <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 leading-tight">
                                    {category.name}
                                </h3>
                                <p className="text-xs sm:text-sm opacity-90">
                                    {category.count} товаров
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Хиты продаж */}
            <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10">
                        Хиты продаж
                    </h2>
                    <ProductSection products={FEATURED_PRODUCTS} />
                </div>
            </div>

            {/* Преимущества */}
            <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10">
                    Почему выбирают нас
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl">⚡</span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Быстрая доставка</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Доставим за 2 часа в любую точку Киева</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl">✨</span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Качество гарантировано</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Только лучшие материалы и свежий гелий</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl">🎨</span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Индивидуальный подход</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Создаем уникальные композиции под ваши пожелания</p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl sm:text-3xl">💰</span>
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg mb-2">Доступные цены</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Лучшие цены в Киеве без переплат</p>
                    </div>
                </div>
            </div>

            {/* Отзывы */}
            <div className="bg-gray-50 py-8 sm:py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 lg:mb-10">
                        Отзывы наших клиентов
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {REVIEWS.map((review, index) => (
                            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-3">
                                    <span className="font-semibold text-sm sm:text-base">{review.name}</span>
                                    <div className="ml-auto flex">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-sm sm:text-base">⭐</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm">{review.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA секция */}
            <div className="bg-teal-600 text-white py-12 sm:py-16 lg:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                        Готовы сделать заказ?
                    </h2>
                    <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto">
                        Свяжитесь с нами любым удобным способом
                    </p>
                    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center max-w-lg mx-auto">
                        <a
                            href="tel:(067) 111-11-11"
                            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-teal-600 rounded-lg hover:bg-gray-100 font-medium text-sm sm:text-base transition-colors"
                        >
                            📞 (067) 111-11-11
                        </a>
                        <Link
                            href="/contacts"
                            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-teal-600 font-medium text-sm sm:text-base transition-colors"
                        >
                            💬 Написать в Telegram
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}