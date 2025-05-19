'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Heart, ShoppingBag, User, Menu, Mail, Phone } from 'lucide-react'
import Navigation from '@/components/Navigation/Navigation'
import { AuthModal } from '@/components/AuthModal/AuthModal'
import { AuthPrompt } from './AuthPrompt'
import MobileMenu from './MobileMenu'

export default function Header() {
    const [showPrompt, setShowPrompt] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const [authType, setAuthType] = useState<'login' | 'register'>('login')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <>
            {/* Top Header Bar - Fixed - скрываем на мобильных */}
            <div className="hidden lg:block fixed top-0 left-0 right-0 bg-teal-600 text-white py-2 z-[60]">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <nav className="flex gap-6">
                            <Link href="/about" className="hover:text-teal-200">Про нас</Link>
                            <Link href="/delivery" className="hover:text-teal-200">Доставка</Link>
                            <Link href="/promotions" className="hover:text-teal-200">Акції</Link>
                            <Link href="/contacts" className="hover:text-teal-200">Контакти</Link>
                        </nav>

                        <div className="flex items-center gap-6">
                            <a href="tel:(067) 111-11-11" className="flex items-center gap-1 hover:text-teal-200">
                                <Phone size={16} />
                                (067) 111-11-11
                            </a>
                            <a href="tel:(067) 111-11-11" className="flex items-center gap-1 hover:text-teal-200">
                                <Phone size={16} />
                                (067) 111-11-11
                            </a>
                            <a href="mailto:google@gmail.com" className="flex items-center gap-1 hover:text-teal-200">
                                <Mail size={16} />
                                google@gmail.com
                            </a>
                            <a href="#" className="hover:text-teal-200">Instagram</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
                <div className="border-b">
                    <div className="px-4">
                        <div className="flex items-center justify-between h-14">
                            <button onClick={() => setMobileMenuOpen(true)}>
                                <Menu size={24} />
                            </button>

                            <Link href="/" className="text-2xl font-bold text-teal-600">
                                ШАРИКИ НА ДОМ
                            </Link>

                            <div className="flex items-center gap-5">
                                <Link href="/account">
                                    <User size={24} />
                                </Link>
                                <Link href="/favorites">
                                    <Heart size={24} />
                                </Link>
                                <Link href="/cart">
                                    <ShoppingBag size={24} />
                                </Link>
                            </div>
                        </div>

                        <div className="py-3">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Пошук шариків, подарків, стаканчиків..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm"
                                />
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    size={20}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:block fixed top-[40px] left-0 right-0 bg-white z-50 shadow-sm">
                <div className="py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-3xl font-bold text-teal-600">
                                ШАРИКИ НА ДОМ
                            </Link>

                            <div className="flex-1">
                                <div className="relative max-w-md">
                                    <input
                                        type="search"
                                        placeholder="Пошук шариків, подарків, стаканчиків..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
                                    />
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                </div>
                            </div>

                            <nav className="flex items-center gap-6">
                                <div className="relative">
                                    <button
                                        className="flex items-center gap-2 text-sm"
                                        onMouseEnter={() => setShowPrompt(true)}
                                    >
                                        <User size={20} />
                                        <span>Увійти</span>
                                    </button>

                                    {showPrompt && (
                                        <div
                                            className="absolute right-0 z-[100]"
                                            onMouseLeave={() => setShowPrompt(false)}
                                        >
                                            <AuthPrompt
                                                onLogin={() => {
                                                    setAuthType('login')
                                                    setShowAuth(true)
                                                    setShowPrompt(false)
                                                }}
                                                onRegister={() => {
                                                    setAuthType('register')
                                                    setShowAuth(true)
                                                    setShowPrompt(false)
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Link href="/favorites" className="flex items-center gap-2 text-sm">
                                    <Heart size={20} />
                                    <span>Улюблене</span>
                                </Link>
                                <Link href="/cart" className="flex items-center gap-2 text-sm">
                                    <ShoppingBag size={20} />
                                    <span>Кошик</span>
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                <Navigation />
            </header>

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />

            {/* Spacer - разные отступы для мобильных и десктопа */}
            <div className="h-[128px] lg:h-[176px]" />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                type={authType}
            />
        </>
    )
}