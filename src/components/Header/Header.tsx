'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import Navigation from '@/components/Navigation/Navigation'
import { AuthModal } from '@/components/AuthModal/AuthModal'
import { AuthPrompt } from './AuthPrompt'

export default function Header() {
    const [showPrompt, setShowPrompt] = useState(false)
    const [showAuth, setShowAuth] = useState(false)
    const [authType, setAuthType] = useState<'login' | 'register'>('login')

    return (
        <>
            <div className="h-[136px]" />

            <header className="fixed top-0 left-0 right-0 bg-white z-50">
                <div className="border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex justify-between items-center h-8 text-sm">
                            <nav className="flex gap-4">
                                <Link href="/zinka" className="hover:text-gray-600">ЖІНКА</Link>
                                <Link href="/cholovik" className="text-gray-500 hover:text-gray-600">ЧОЛОВІК</Link>
                                <Link href="/dytyna" className="text-gray-500 hover:text-gray-600">ДИТИНА</Link>
                            </nav>
                            <div className="flex gap-4 text-gray-500">
                                <Link href="/download" className="hover:text-gray-600">
                                    Завантажити моб. додаток
                                </Link>
                                <Link href="/help" className="hover:text-gray-600">
                                    Допомога
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="font-light text-2xl">
                                E
                            </Link>

                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="search"
                                        placeholder="Пошук бренду, товару, стилю"
                                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-md text-sm"
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
                                            className="absolute right-0 z-[100]" // z-index больше чем у хедера (z-50)
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

            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                type={authType}
            />
        </>
    )
}