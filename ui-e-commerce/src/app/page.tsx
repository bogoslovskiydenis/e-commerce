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
import { useTranslation } from '@/contexts/LanguageContext'

export default function HomePage() {
    const { t, language } = useTranslation()
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [popularProducts, setPopularProducts] = useState<Product[]>([])
    const [mainCategories, setMainCategories] = useState<Category[]>([])
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)

    // Данные для быстрого заказа
    const QUICK_ORDER_STEPS = [
        {
            icon: '🎈',
            title: t('home.chooseBalloons'),
            description: t('home.chooseBalloonsDesc')
        },
        {
            icon: '🚚',
            title: t('home.fastDelivery'),
            description: t('home.fastDeliveryDesc')
        },
        {
            icon: '💝',
            title: t('home.readySets'),
            description: t('home.readySetsDesc')
        }
    ]

    // Преимущества
    const FEATURES = [
        {
            icon: '⚡',
            title: t('home.fastDeliveryTitle'),
            description: t('home.fastDeliveryDesc')
        },
        {
            icon: '✨',
            title: t('home.qualityGuaranteed'),
            description: t('home.qualityGuaranteedDesc')
        },
        {
            icon: '🎨',
            title: t('home.individualApproach'),
            description: t('home.individualApproachDesc')
        },
        {
            icon: '💰',
            title: t('home.affordablePrices'),
            description: t('home.affordablePricesDesc')
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
            text: t('home.writeToTelegram'),
            href: '/contacts',
            primary: false
        }
    ]

    // Загрузка данных из API - перезагружаем при смене языка
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                // Загружаем баннеры для главной страницы
                const mainBanners = await apiService.getBanners('MAIN')
                setBanners(mainBanners)

                // Загружаем рекомендуемые товары (хиты продаж) с текущим языком
                const products = await apiService.getFeaturedProducts(8, language)
                setFeaturedProducts(products)

                // Загружаем популярные товары с текущим языком
                const popular = await apiService.getPopularProducts(8, language)
                setPopularProducts(popular)

                // Загружаем популярные категории для главной страницы с текущим языком
                const categories = await apiService.getPopularCategories(5, language)
                // Преобразуем категории в формат для CategorySection
                const formattedCategories = categories.map(cat => ({
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
    }, [language])

    return (
        <div>
            {/* Слайдер баннеров */}
            <BannerSlider banners={banners} />

            {/* Быстрый заказ */}
            <QuickOrderSection
                title={t('home.quickOrder')}
                steps={QUICK_ORDER_STEPS}
            />

            {/* Популярные категории */}
            {!loading && mainCategories.length > 0 && (
                <CategorySection
                    title={t('home.popularCategories')}
                    categories={mainCategories}
                    columns={5}
                />
            )}

            {/* Хиты продаж */}
            {!loading && (
                <FeaturedProductsSection
                    title={t('home.featuredProducts')}
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
                    viewAllLink="/products?featured=true"
                    viewAllText={t('home.viewAll')}
                    bgColor="bg-gray-50"
                    slidesToShow={4}
                />
            )}

            {/* Популярные товары */}
            {!loading && popularProducts.length > 0 && (
                <FeaturedProductsSection
                    title={t('home.popularProducts')}
                    products={popularProducts.map(product => ({
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
                    viewAllText={t('home.viewAll')}
                    bgColor="bg-white"
                    slidesToShow={4}
                />
            )}

            {/* Преимущества */}
            <FeaturesSection
                title={t('home.whyChooseUs')}
                features={FEATURES}
                columns={4}
            />

            {/* Отзывы - пока оставляем статичные, так как нет API для отзывов */}
            <TestimonialsSection
                title={t('home.testimonials')}
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
                title={t('home.readyToOrder')}
                subtitle={t('home.readyToOrderSubtitle')}
                buttons={CTA_BUTTONS}
                bgColor="bg-teal-600"
                textColor="text-white"
                align="center"
            />
        </div>
    )
}