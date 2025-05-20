'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import FeaturedProductsSection from '@/components/HomePageComponent/FeaturedProductsSection/FeaturedProductsSection'
import CategorySection from '@/components/HomePageComponent/CategorySection/CategorySection'
import FeaturesSection from '@/components/HomePageComponent/FeaturesSection/FeaturesSection'
import TestimonialsSection from '@/components/HomePageComponent/TestimonialsSection/TestimonialsSection'
import CTASection from '@/components/HomePageComponent/CTASection/CTASection'
import QuickOrderSection from '@/components/HomePageComponent/QuickOrderSection/QuickOrderSection'
import { FEATURED_PRODUCTS, MAIN_CATEGORIES, REVIEWS } from '@/data/balloonData'

// Данные для слайдера баннеров
const BANNER_SLIDES = [
    {
        id: 1,
        image: '/images/banner.png',
        title: 'Шарики на дом в Киеве',
        subtitle: 'Фольгированные и латексные шарики с доставкой по Киеву за 2 часа. Букеты, подарки и украшения для любого праздника.',
        primaryButton: { text: 'Выбрать шарики', href: '/balloons' },
        secondaryButton: { text: 'Букеты из шаров', href: '/bouquets' }
    },
    {
        id: 2,
        image: '/images/banner1.png',
        title: 'Акции до -70%',
        subtitle: 'Супер скидки на все виды шариков! Спешите воспользоваться уникальными предложениями.',
        primaryButton: { text: 'Смотреть акции', href: '/sale' },
        secondaryButton: { text: 'Каталог', href: '/balloons' }
    },
    {
        id: 3,
        image: '/images/banner.png',
        title: 'Букеты из шаров',
        subtitle: 'Готовые композиции для любого праздника. Быстрая доставка по Киеву за 2 часа.',
        primaryButton: { text: 'Заказать букет', href: '/bouquets' },
        secondaryButton: { text: 'Контакты', href: '/contacts' }
    }
]

// Данные для быстрого заказа
const QUICK_ORDER_STEPS = [
    {
        icon: '🎈',
        title: 'Выберите шарики',
        description: 'Более 500 видов воздушных шаров'
    },
    {
        icon: '🚚',
        title: 'Быстрая доставка',
        description: 'Доставим за 2 часа по Киеву'
    },
    {
        icon: '💝',
        title: 'Готовые наборы',
        description: 'Подарочные комплекты на любой повод'
    }
]

// Преимущества
const FEATURES = [
    {
        icon: '⚡',
        title: 'Быстрая доставка',
        description: 'Доставим за 2 часа в любую точку Киева'
    },
    {
        icon: '✨',
        title: 'Качество гарантировано',
        description: 'Только лучшие материалы и свежий гелий'
    },
    {
        icon: '🎨',
        title: 'Индивидуальный подход',
        description: 'Создаем уникальные композиции под ваши пожелания'
    },
    {
        icon: '💰',
        title: 'Доступные цены',
        description: 'Лучшие цены в Киеве без переплат'
    }
]

// CTA Секция
const CTA_BUTTONS = [
    {
        text: '📞 (067) 111-11-11',
        href: 'tel:(067) 111-11-11',
        primary: true
    },
    {
        text: '💬 Написать в Telegram',
        href: '/contacts',
        primary: false
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
            <QuickOrderSection
                title="Быстрый заказ"
                steps={QUICK_ORDER_STEPS}
            />

            {/* Популярные категории */}
            <CategorySection
                title="Популярные категории"
                categories={MAIN_CATEGORIES}
                columns={5}
            />

            {/* Хиты продаж */}
            <FeaturedProductsSection
                title="Хиты продаж"
                products={FEATURED_PRODUCTS}
                viewAllLink="/products"
                viewAllText="Посмотреть все"
                bgColor="bg-gray-50"
                slidesToShow={4}
            />

            {/* Преимущества */}
            <FeaturesSection
                title="Почему выбирают нас"
                features={FEATURES}
                columns={4}
            />

            {/* Отзывы */}
            <TestimonialsSection
                title="Отзывы наших клиентов"
                testimonials={REVIEWS}
                bgColor="bg-gray-50"
                slidesToShow={3}
            />

            {/* CTA секция */}
            <CTASection
                title="Готовы сделать заказ?"
                subtitle="Свяжитесь с нами любым удобным способом"
                buttons={CTA_BUTTONS}
                bgColor="bg-teal-600"
                textColor="text-white"
                align="center"
            />
        </div>
    )
}