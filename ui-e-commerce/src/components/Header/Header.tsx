'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Heart, ShoppingBag, User, Menu, Mail, Phone } from 'lucide-react'
import Navigation from '@/components/Navigation/Navigation'
import MobileMenu from './MobileMenu'
import { AuthPrompt } from "@/components/AuthModal/AuthPrompt"
import {AuthModal} from "@/components/AuthModal/AuthModal"
import SearchAutocomplete from '@/components/Search/SearchAutocomplete'
import { cartUtils } from '@/utils/cart'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
    const { isAuthenticated, customer } = useAuth()
    const [showPrompt, setShowPrompt] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const [authType, setAuthType] = useState<'login' | 'register'>('login')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const updateCartCount = () => {
            setCartCount(cartUtils.getCartCount())
        }
        updateCartCount()
        window.addEventListener('cartUpdated', updateCartCount)
        return () => window.removeEventListener('cartUpdated', updateCartCount)
    }, [])

    return (
        <>
            {/* Top Header Bar - Fixed - скрываем на мобильных */}
            <div className="hidden lg:block fixed top-0 left-0 right-0 bg-teal-600 text-white py-2 z-[60]">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center text-sm">
                        <nav className="flex gap-6">
                            <Link href="/about" className="hover:text-teal-200">Про нас</Link>
                            <Link href="/delivery" className="hover:text-teal-200">Доставка</Link>
                            <Link href="/sale" className="hover:text-teal-200">Акції</Link>
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
                                Логотип
                            </Link>

                            <div className="flex items-center gap-5">
                                {isAuthenticated ? (
                                    <Link href="/account">
                                        <User size={24} />
                                    </Link>
                                ) : (
                                    <Link href="/login">
                                        <User size={24} />
                                    </Link>
                                )}
                                <Link href="/favorites">
                                    <Heart size={24} />
                                </Link>
                                <Link href="/cart" className="relative">
                                    <ShoppingBag size={24} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
                                </Link>
                            </div>
                        </div>

                        <div className="py-3">
                            <SearchAutocomplete
                                placeholder="Пошук шариків, подарків, стаканчиків..."
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Desktop Header */}
            <header className="hidden lg:block fixed top-[35px] left-0 right-0 bg-white z-50 shadow-sm">
                <div className="py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="text-3xl font-bold text-teal-600">
                                Логотип
                            </Link>

                            <div className="flex-1">
                                <SearchAutocomplete
                                    placeholder="Пошук шариків, подарків, стаканчиків..."
                                    className="max-w-md"
                                />
                            </div>

                            <nav className="flex items-center gap-6">
                                {isAuthenticated ? (
                                    <Link
                                        href="/account"
                                        className="flex items-center gap-2 text-sm"
                                    >
                                        <User size={20} />
                                        <span>{customer?.name || 'Кабінет'}</span>
                                    </Link>
                                ) : (
                                    <div className="relative">
                                        <Link
                                            href="/login"
                                            className="flex items-center gap-2 text-sm"
                                            onMouseEnter={() => setShowPrompt(true)}
                                        >
                                            <User size={20} />
                                            <span>Увійти</span>
                                        </Link>

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
                                )}

                                <Link href="/favorites" className="flex items-center gap-2 text-sm">
                                    <Heart size={20} />
                                    <span>Улюблене</span>
                                </Link>
                                <Link href="/cart" className="flex items-center gap-2 text-sm relative">
                                    <ShoppingBag size={20} />
                                    <span>Кошик</span>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartCount > 99 ? '99+' : cartCount}
                                        </span>
                                    )}
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