import Link from 'next/link'
import { Search, Heart, ShoppingBag, User } from 'lucide-react'

export default function Header() {
    return (
        <>
            {/* Добавляем placeholder для фиксированного header */}
            <div className="h-[136px]" /> {/* Высота соответствует header */}

            <header className="fixed top-0 left-0 right-0 bg-white border-b z-50">
                {/* Верхняя панель */}
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-8 text-sm">
                        <nav className="flex gap-4">
                            <Link href="/zinka" className="hover:text-black-600">ЖІНКА</Link>
                            <Link href="/cholovik" className="hover:text-gray-600">ЧОЛОВІК</Link>
                            <Link href="/dytyna" className="hover:text-gray-600">ДИТИНА</Link>
                        </nav>
                        <div className="flex gap-4">
                            <Link href="/download" className="hover:text-gray-600">
                                Завантажити моб. додаток
                            </Link>
                            <Link href="/help" className="hover:text-gray-600">
                                Допомога
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Основной хедер */}
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold">
                            Ecommerce
                        </Link>

                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Пошук бренду, товару, стилю"
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>
                        </div>

                        <nav className="flex items-center gap-6">
                            <Link href="/login" className="flex items-center gap-2 hover:text-gray-600">
                                <User size={20} />
                                <span>Увійти</span>
                            </Link>
                            <Link href="/favorites" className="flex items-center gap-2 hover:text-gray-600">
                                <Heart size={20} />
                                <span>Улюблене</span>
                            </Link>
                            <Link href="/cart" className="flex items-center gap-2 hover:text-gray-600">
                                <ShoppingBag size={20} />
                                <span>Кошик</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Категории */}
                    <nav className="flex gap-6 mt-4">
                        <Link href="/sale" className="text-sm hover:text-gray-600">Sale %</Link>
                        <Link href="/bestsellers" className="text-sm hover:text-gray-600">Бестселери</Link>
                        <Link href="/new" className="text-sm hover:text-gray-600">Нова колекція</Link>
                        <Link href="/brands" className="text-sm hover:text-gray-600">Бренди</Link>
                        <Link href="/clothing" className="text-sm hover:text-gray-600">Одяг</Link>
                        <Link href="/shoes" className="text-sm hover:text-gray-600">Взуття</Link>
                        <Link href="/sport" className="text-sm hover:text-gray-600">Спортивні</Link>
                        <Link href="/accessories" className="text-sm hover:text-gray-600">Аксесуари</Link>
                        <Link href="/premium" className="text-sm hover:text-gray-600">Преміум</Link>
                    </nav>
                </div>
            </header>
        </>
    )
}