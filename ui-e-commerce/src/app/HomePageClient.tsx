'use client'

import { useState, useEffect } from 'react'
import FeaturedProductsSection from '@/components/HomePageComponent/FeaturedProductsSection/FeaturedProductsSection'
import CategorySection from '@/components/HomePageComponent/CategorySection/CategorySection'
import FeaturesSection from '@/components/HomePageComponent/FeaturesSection/FeaturesSection'
import CTASection from '@/components/HomePageComponent/CTASection/CTASection'
import BannerSlider from '@/components/Banner/BannerSlider'
import { apiService, Product, Banner } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'
import Link from 'next/link'

type HomeCategoryCard = { name: string; image: string; href: string; count: string }

export default function HomePageClient() {
    const { t, language } = useTranslation()
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [popularProducts, setPopularProducts] = useState<Product[]>([])
    const [mainCategories, setMainCategories] = useState<HomeCategoryCard[]>([])
    const [banners, setBanners] = useState<Banner[]>([])
    const [loading, setLoading] = useState(true)
    const [ctaPhone, setCtaPhone] = useState<string>('(067) 111-11-11')

    const FEATURES = [
        { icon: '⚡', title: t('home.fastDeliveryTitle'), description: t('home.fastDeliveryDesc') },
        { icon: '✨', title: t('home.qualityGuaranteed'), description: t('home.qualityGuaranteedDesc') },
        { icon: '🎨', title: t('home.individualApproach'), description: t('home.individualApproachDesc') },
        { icon: '💰', title: t('home.affordablePrices'), description: t('home.affordablePricesDesc') },
    ]

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const [mainBanners, settings] = await Promise.all([
                    apiService.getBanners('MAIN'),
                    apiService.getPublicSettings().catch(() => null),
                ])
                setBanners(mainBanners)
                if (settings?.contact_phone) {
                    setCtaPhone(String(settings.contact_phone))
                }

                const products = await apiService.getFeaturedProducts(8, language)
                setFeaturedProducts(products)

                const popular = await apiService.getPopularProducts(8, language)
                setPopularProducts(popular)

                const categories = await apiService.getPopularCategories(5, language)
                const formattedCategories = categories.map((cat) => ({
                    name: cat.name,
                    image: cat.imageUrl || cat.bannerUrl || '/api/placeholder/400/400',
                    href: `/${cat.slug}`,
                    count: cat.productsCount ? `${cat.productsCount}+` : '0+',
                }))
                setMainCategories(formattedCategories)
            } catch (error) {
                console.error('Error loading homepage data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [language])

    const telHref = `tel:${ctaPhone.replace(/\s/g, '').replace(/[()]/g, '')}`
    const CTA_BUTTONS = [
        { text: `📞 ${ctaPhone}`, href: telHref, primary: true },
        { text: t('home.writeToTelegram'), href: '/contacts', primary: false },
    ]

    return (
        <div>
            <BannerSlider banners={banners} />

            {!loading && mainCategories.length > 0 && (
                <CategorySection title={t('home.popularCategories')} categories={mainCategories} columns={5} />
            )}

            {!loading && (
                <FeaturedProductsSection
                    title={t('home.featuredProducts')}
                    products={featuredProducts.map((product) => ({
                        id: product.id,
                        name: product.title || product.name || '',
                        price: Number(product.price) || 0,
                        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
                        discount: product.discount ? Number(product.discount) : undefined,
                        image: product.images?.[0] || product.image || '/api/placeholder/300/300',
                        category: product.category || product.categoryId || '',
                        link: `/product/${product.id}`,
                    }))}
                    viewAllLink="/products?featured=true"
                    viewAllText={t('home.viewAll')}
                    bgColor="bg-gray-50"
                    slidesToShow={4}
                />
            )}

            {!loading && popularProducts.length > 0 && (
                <FeaturedProductsSection
                    title={t('home.popularProducts')}
                    products={popularProducts.map((product) => ({
                        id: product.id,
                        name: product.title || product.name || '',
                        price: Number(product.price) || 0,
                        oldPrice: product.oldPrice ? Number(product.oldPrice) : undefined,
                        discount: product.discount ? Number(product.discount) : undefined,
                        image: product.images?.[0] || product.image || '/api/placeholder/300/300',
                        category: product.category || product.categoryId || '',
                        link: `/product/${product.id}`,
                    }))}
                    viewAllLink="/products"
                    viewAllText={t('home.viewAll')}
                    bgColor="bg-white"
                    slidesToShow={4}
                />
            )}

            <FeaturesSection title={t('home.whyChooseUs')} features={FEATURES} columns={4} />

            <section className="bg-gray-50 border-t border-gray-100 py-8 sm:py-10" aria-labelledby="home-intro-heading">
                <div className="container mx-auto px-4 max-w-3xl text-center sm:text-left">
                    <h2 id="home-intro-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                        {t('home.introTitle')}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{t('home.introBody')}</p>
                    <Link
                        href="/delivery"
                        className="inline-flex text-sm font-medium text-teal-700 hover:text-teal-800 underline-offset-2 hover:underline"
                    >
                        {t('header.delivery')}
                    </Link>
                </div>
            </section>

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
