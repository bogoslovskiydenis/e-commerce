'use client'

import { useState, useEffect } from 'react'
import FeaturedProductsSection from '@/components/HomePageComponent/FeaturedProductsSection/FeaturedProductsSection'
import CategorySection from '@/components/HomePageComponent/CategorySection/CategorySection'
import FeaturesSection from '@/components/HomePageComponent/FeaturesSection/FeaturesSection'
import TestimonialsSection from '@/components/HomePageComponent/TestimonialsSection/TestimonialsSection'
import CTASection from '@/components/HomePageComponent/CTASection/CTASection'
import QuickOrderSection from '@/components/HomePageComponent/QuickOrderSection/QuickOrderSection'
import BannerSlider from '@/components/Banner/BannerSlider'
import { apiService, Product, Category, Banner } from '@/services/api'

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
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [mainCategories, setMainCategories] = useState<Category[]>([])
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)

    // Загрузка данных из API
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                // Загружаем баннеры для главной страницы
                const mainBanners = await apiService.getBanners('MAIN')
                setBanners(mainBanners)

                // Загружаем рекомендуемые товары
                const products = await apiService.getFeaturedProducts(8)
                setFeaturedProducts(products)

                // Загружаем категории для главной страницы (только родительские)
                const categories = await apiService.getNavigationCategories()
                // Преобразуем категории в формат для CategorySection
                const formattedCategories = categories
                    .filter(cat => !cat.parentId) // Только родительские категории
                    .slice(0, 5) // Берем первые 5
                    .map(cat => ({
                        name: cat.name,
                        image: cat.imageUrl || cat.bannerUrl || '/api/placeholder/400/400',
                        href: `/${cat.slug}`,
                        count: cat.productsCount ? `${cat.productsCount}+` : '0+'
                    }))
                setMainCategories(formattedCategories as any)
            } catch (error) {
                console.error('Error loading homepage data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <div>
            {/* Слайдер баннеров */}
            <BannerSlider banners={banners} />

            {/* Быстрый заказ */}
            <QuickOrderSection
                title="Быстрый заказ"
                steps={QUICK_ORDER_STEPS}
            />

            {/* Популярные категории */}
            {!loading && mainCategories.length > 0 && (
                <CategorySection
                    title="Популярные категории"
                    categories={mainCategories}
                    columns={5}
                />
            )}

            {/* Хиты продаж */}
            {!loading && (
                <FeaturedProductsSection
                    title="Хиты продаж"
                    products={featuredProducts.map(product => ({
                        id: product.id,
                        name: product.title || product.name || '',
                        price: Number(product.price) || 0,
                        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
                        discount: product.discount ? Number(product.discount) : undefined,
                        image: product.images?.[0] || product.image || '/api/placeholder/300/300',
                        category: product.category || product.categoryId || '',
                        link: `/product/${product.id}`
                    }))}
                    viewAllLink="/products"
                    viewAllText="Посмотреть все"
                    bgColor="bg-gray-50"
                    slidesToShow={4}
                />
            )}

            {/* Преимущества */}
            <FeaturesSection
                title="Почему выбирают нас"
                features={FEATURES}
                columns={4}
            />

            {/* Отзывы - пока оставляем статичные, так как нет API для отзывов */}
            <TestimonialsSection
                title="Отзывы наших клиентов"
                testimonials={[
                    {
                        name: 'Анна',
                        text: 'Заказывала букет на день рождения дочки. Все очень красиво и качественно! Доставили точно в срок.',
                        rating: 5
                    },
                    {
                        name: 'Дмитрий',
                        text: 'Отличный сервис! Быстро оформили заказ, привезли шарики для корпоратива. Все остались довольны.',
                        rating: 5
                    },
                    {
                        name: 'Елена',
                        text: 'Красивые фольгированные шары для свадьбы. Качество отличное, продержались весь день!',
                        rating: 5
                    }
                ]}
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