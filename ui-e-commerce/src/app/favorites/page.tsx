import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

export default function FavoritesPage() {
    // Пустая страница избранного
    const isEmpty = true

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <div className="mb-6 flex items-center text-sm">
                <Link href="/" className="text-gray-600 hover:text-amber-500">Головна сторінка</Link>
                <ChevronRight size={16} className="mx-2 text-gray-400" />
                <span className="font-medium">Улюблене</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Улюблене</h1>

            {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-36 h-36 mb-6">
                        <Image
                            src="/api/placeholder/150/150"
                            alt="Пустая страница избранного"
                            width={150}
                            height={150}
                            className="mx-auto"
                        />
                    </div>

                    <h2 className="text-2xl font-bold mb-3">Чогось тут не вистачає?</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Увійди і перейди до раніше збережених товарів.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/login" className="px-8 py-3 bg-amber-500 text-white font-medium rounded-md hover:bg-amber-600 text-center">
                            Ввійти
                        </Link>
                        <button className="px-8 py-3 border border-gray-300 rounded-md hover:bg-gray-50">
                            Переглянути новинки
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Здесь будут товары в избранном, когда они появятся */}
                </div>
            )}
        </div>
    )
}