import Link from 'next/link'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'
import Navigation from '@/components/Navigation'

export default function Header() {
    return (
        <>
            <div className="h-[136px]" /> {/* Плейсхолдер для фиксированного хедера */}

            <header className="fixed top-0 left-0 right-0 bg-white z-50">
                {/* Верхняя панель - Жінка, Чоловік, Дитина */}
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

                {/* Основной хедер с логотипом и поиском */}
                <div className="py-4">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-8">
                            {/* Логотип */}
                            <Link href="/" className="font-light text-2xl">
                                E
                            </Link>

                            {/* Поиск */}
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

                            {/* Действия пользователя */}
                            <nav className="flex items-center gap-6">
                                <Link href="/login" className="flex items-center gap-2 text-sm">
                                    <User size={20} />
                                    <span>Увійти</span>
                                </Link>
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

                {/* Навигация */}
                <Navigation />
            </header>
        </>
    )
}