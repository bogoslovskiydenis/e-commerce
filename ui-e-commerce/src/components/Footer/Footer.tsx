'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import BannersList from '@/components/Banner/BannersList'
import { apiService, Banner } from '@/services/api'
import { useTranslation } from '@/contexts/LanguageContext'

export default function Footer() {
    const { t } = useTranslation()
    const [footerBanners, setFooterBanners] = useState<Banner[]>([])

    useEffect(() => {
        const loadBanners = async () => {
            const banners = await apiService.getBanners('FOOTER')
            setFooterBanners(banners)
        }
        loadBanners()
    }, [])

    return (
        <footer className="bg-gray-100 pt-16 pb-8">
            {/* Баннеры в футере */}
            {footerBanners.length > 0 && (
                <div className="container mx-auto px-4 mb-12">
                    <BannersList 
                        banners={footerBanners} 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    />
                </div>
            )}
            {/* Преимущества */}
            {/*<div className="container mx-auto px-4 mb-16">*/}
            {/*    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">*/}
            {/*        <div className="flex flex-col items-center text-center">*/}
            {/*            <div className="mb-4">*/}
            {/*                <Image src="/images/return.svg" alt="Повернення" width={48} height={48} />*/}
            {/*            </div>*/}
            {/*            <h3 className="font-medium">Зручні способи повернення</h3>*/}
            {/*        </div>*/}
            {/*        <div className="flex flex-col items-center text-center">*/}
            {/*            <div className="mb-4">*/}
            {/*                <Image src="/images/delivery.svg" alt="Доставка" width={48} height={48} />*/}
            {/*            </div>*/}
            {/*            <h3 className="font-medium">Безкоштовна доставка з Європи від 2500 грн</h3>*/}
            {/*        </div>*/}
            {/*        <div className="flex flex-col items-center text-center">*/}
            {/*            <div className="mb-4">*/}
            {/*                <Image src="/images/payment.svg" alt="Оплата" width={48} height={48} />*/}
            {/*            </div>*/}
            {/*            <h3 className="font-medium">Зручні платежі</h3>*/}
            {/*        </div>*/}
            {/*        <div className="flex flex-col items-center text-center">*/}
            {/*            <div className="mb-4">*/}
            {/*                <Image src="/images/brands.svg" alt="Бренди" width={48} height={48} />*/}
            {/*            </div>*/}
            {/*            <h3 className="font-medium">Понад 1000 брендів</h3>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            {/* Основной контент футера */}
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                    <div>
                        <h4 className="font-bold mb-4">{t('footer.help')}</h4>
                        <nav className="space-y-2">
                            <Link href="/account" className="block text-gray-600 hover:text-black">{t('footer.yourAccount')}</Link>
                            <Link href="/returns" className="block text-gray-600 hover:text-black">{t('footer.returns')}</Link>
                            <Link href="/order-status" className="block text-gray-600 hover:text-black">{t('footer.orderStatus')}</Link>
                            <Link href="/contact" className="block text-gray-600 hover:text-black">{t('footer.contact')}</Link>
                            <Link href="/help-center" className="block text-gray-600 hover:text-black">{t('footer.helpCenter')}</Link>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">{t('footer.information')}</h4>
                        <nav className="space-y-2">
                            <Link href="/club" className="block text-gray-600 hover:text-black">Ecommerce</Link>
                            <Link href="/delivery" className="block text-gray-600 hover:text-black">{t('footer.deliveryTime')}</Link>
                            <Link href="/payment" className="block text-gray-600 hover:text-black">{t('footer.paymentMethods')}</Link>
                            <Link href="/size-guide" className="block text-gray-600 hover:text-black">{t('footer.sizeGuide')}</Link>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Ecommerce</h4>
                        <nav className="space-y-2">
                            <Link href="/about" className="block text-gray-600 hover:text-black">{t('footer.about')}</Link>
                            <Link href="/company" className="block text-gray-600 hover:text-black">{t('footer.companyData')}</Link>
                            <Link href="/partnership" className="block text-gray-600 hover:text-black">{t('footer.partnership')}</Link>
                            <Link href="/reviews" className="block text-gray-600 hover:text-black">{t('footer.reviews')}</Link>
                        </nav>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">{t('footer.downloadApp')}</h4>
                        <div className="space-y-4">
                            <Image src="/images/qr-code.png" alt="QR код" width={120} height={120} />
                            <div className="flex flex-col gap-2">
                                <Link href="#" className="block">
                                    <Image src="/images/google-play.png" alt="Google Play" width={140} height={42} />
                                </Link>
                                <Link href="#" className="block">
                                    <Image src="/images/app-store.png" alt="App Store" width={140} height={42} />
                                </Link>
                                <Link href="#" className="block">
                                    <Image src="/images/app-gallery.png" alt="App Gallery" width={140} height={42} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Нижняя часть футера */}
                <div className="pt-8 border-t">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex gap-4">
                            <Link href="https://instagram.com" className="text-gray-600 hover:text-black">
                                {/*<Instagram size={24} />*/}
                            </Link>
                            <Link href="https://youtube.com" className="text-gray-600 hover:text-black">
                                {/*<Youtube size={24} />*/}
                            </Link>
                            <Link href="https://facebook.com" className="text-gray-600 hover:text-black">
                                {/*<Facebook size={24} />*/}
                            </Link>
                        </div>

                        <div className="flex gap-4 text-sm text-gray-600">
                            <span>© Ecommerce 2025</span>
                            <Link href="/privacy" className="hover:text-black">{t('footer.privacyPolicy')}</Link>
                            <Link href="/terms" className="hover:text-black">{t('footer.terms')}</Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">{t('footer.changeCountry')}:</span>
                            <button className="text-sm hover:text-black">{t('footer.country')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}