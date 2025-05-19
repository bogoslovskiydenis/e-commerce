'use client'

import { useState } from 'react'
import { ChevronDown, X, Filter } from 'lucide-react'
import ProductSection from '@/components/ProductSection/ProductSection'
import type { CompatibleProduct } from '@/types/BalloonShop_types'

const CATEGORIES = [
    { name: 'Фольгированные шары', count: 245 },
    { name: 'Латексные шары', count: 187 },
    { name: 'Букеты из шаров', count: 156 },
    { name: 'Цифры из шаров', count: 45 },
    { name: 'Сердца', count: 89 },
    { name: 'Звезды', count: 67 },
    { name: 'Стаканчики', count: 95 },
    { name: 'Подарки', count: 203 }
]

const SALE_PRODUCTS: CompatibleProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/api/placeholder/300/300',
        category: 'hearts',
        link: '/products/hearts/1'
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        price: 450,
        oldPrice: 550,
        discount: 18,
        image: '/api/placeholder/300/300',
        category: 'bouquets',
        link: '/products/bouquets/2'
    },
    {
        id: '3',
        name: 'Цифра "1" золотая',
        price: 280,
        oldPrice: 350,
        discount: 20,
        image: '/api/placeholder/300/300',
        category: 'numbers',
        link: '/products/numbers/3'
    },
    {
        id: '4',
        name: 'Набор "Единорог"',
        price: 520,
        oldPrice: 650,
        discount: 20,
        image: '/api/placeholder/300/300',
        category: 'sets',
        link: '/products/sets/4'
    },
    {
        id: '5',
        name: 'Звезда серебряная',
        price: 90,
        oldPrice: 120,
        discount: 25,
        image: '/api/placeholder/300/300',
        category: 'stars',
        link: '/products/stars/5'
    },
    {
        id: '6',
        name: 'Стаканчики "День рождения"',
        price: 60,
        oldPrice: 80,
        discount: 25,
        image: '/api/placeholder/300/300',
        category: 'cups',
        link: '/products/cups/6'
    }
]

// Компонент фильтров для переиспользования
const SaleFilters = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`bg-white ${isMobile ? '' : 'rounded-lg border p-4'}`}>
        <h3 className={`font-semibold mb-4 ${isMobile ? 'sr-only' : ''}`}>Категории</h3>
        <nav className="space-y-2">
            {CATEGORIES.map((category) => (
                <a
                    key={category.name}
                    href="#"
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <span>{category.name}</span>
                    <span className="text-gray-500 text-xs">({category.count})</span>
                </a>
            ))}
        </nav>

        {/* Фильтр по скидке */}
        <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Размер скидки</h4>
            <div className="space-y-2">
                {['До 30%', '30-50%', '50-70%', 'Свыше 70%'].map((discount) => (
                    <label key={discount} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded w-4 h-4 text-red-600" />
                        <span className="text-sm">{discount}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Фильтр по цене */}
        <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Цена</h4>
            <div className="space-y-2">
                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="От"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                        type="number"
                        placeholder="До"
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </div>
                <button className="w-full bg-teal-600 text-white py-2 rounded text-sm hover:bg-teal-700">
                    Применить
                </button>
            </div>
        </div>

        {/* Дополнительные фильтры для акций */}
        <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Тип товара</h4>
            <div className="space-y-2">
                {['С гелием', 'Без гелия', 'Светящиеся', 'Музыкальные'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded w-4 h-4 text-red-600" />
                        <span className="text-sm">{type}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Фильтр по цвету */}
        <div className="mt-6 pt-6 border-t">
            <h4 className="font-medium mb-3">Цвет</h4>
            <div className="grid grid-cols-3 gap-2">
                {[
                    { name: 'Красный', color: 'bg-red-500' },
                    { name: 'Синий', color: 'bg-blue-500' },
                    { name: 'Розовый', color: 'bg-pink-500' },
                    { name: 'Золотой', color: 'bg-yellow-500' },
                    { name: 'Серебряный', color: 'bg-gray-400' },
                    { name: 'Зеленый', color: 'bg-green-500' }
                ].map((color) => (
                    <label key={color.name} className="flex items-center gap-1 cursor-pointer text-xs">
                        <input type="checkbox" className="w-3 h-3 rounded" />
                        <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                        <span>{color.name}</span>
                    </label>
                ))}
            </div>
        </div>
    </div>
)

export default function SalePage() {
    const [sortBy, setSortBy] = useState('popularity')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    // Функция для закрытия мобильных фильтров
    const closeMobileFilters = () => {
        setShowMobileFilters(false)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Хлебные крошки */}
            <nav className="mb-6">
                <ol className="flex items-center space-x-2 text-sm">
                    <li><a href="/" className="text-gray-500 hover:text-teal-600">Главная</a></li>
                    <li className="text-gray-400">/</li>
                    <li className="text-gray-900">Акции</li>
                </ol>
            </nav>

            {/* Заголовок категории */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold">🔥 Акции и скидки</h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                    Скидки до 70% на воздушные шары, букеты и подарки. Ограниченное предложение!
                </p>
            </div>

            {/* Промо баннер */}
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 sm:p-6 rounded-lg mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">Супер скидки до 70%!</h2>
                        <p className="text-red-100 text-sm sm:text-base">Успейте купить шарики по сниженным ценам</p>
                    </div>
                    <div className="text-center sm:text-right">
                        <div className="text-2xl sm:text-3xl font-bold">-70%</div>
                        <div className="text-sm text-red-100">на все товары</div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Боковая панель с категориями - скрыта на мобильных */}
                <aside className="w-64 flex-shrink-0 hidden lg:block">
                    <SaleFilters />
                </aside>

                <div className="flex-1">
                    {/* Фильтры и сортировка */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b gap-4">
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            {/* Кнопка фильтров - только на мобильных */}
                            <button
                                onClick={() => setShowMobileFilters(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                <Filter size={16} />
                                Фильтры
                            </button>

                            {/* Сортировка */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 sm:flex-none py-2 pl-3 pr-8 border border-gray-300 rounded-lg appearance-none bg-white min-w-[160px] text-sm"
                            >
                                <option value="popularity">По популярности</option>
                                <option value="discount-desc">По размеру скидки</option>
                                <option value="price-asc">От дешевых к дорогим</option>
                                <option value="price-desc">От дорогих к дешевым</option>
                                <option value="new">Новинки</option>
                            </select>
                        </div>

                        {/* Счетчик товаров */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 w-full sm:w-auto justify-between sm:justify-end">
                            <span>Найдено:</span>
                            <span className="font-medium text-red-600">{SALE_PRODUCTS.length} товаров со скидкой</span>
                        </div>
                    </div>

                    {/* Активные фильтры */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                Только со скидкой
                                <button className="ml-1 text-red-600 hover:text-red-800" aria-label="Удалить фильтр">×</button>
                            </span>
                            <button className="text-sm text-gray-500 hover:text-gray-700 underline">
                                Очистить все
                            </button>
                        </div>
                    </div>

                    {/* Сетка товаров */}
                    <ProductSection products={SALE_PRODUCTS} />

                    {/* Пагинация */}
                    <div className="mt-12 flex items-center justify-center gap-1 sm:gap-2">
                        <button className="px-2 sm:px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled>
                            ←
                        </button>
                        <button className="px-2 sm:px-3 py-2 bg-teal-600 text-white rounded text-sm">1</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">2</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">3</button>
                        <span className="px-1 sm:px-2 text-sm">...</span>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm">8</button>
                        <button className="px-2 sm:px-3 py-2 text-gray-700 hover:text-gray-900">
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* Мобильные фильтры - модальное окно */}
            {showMobileFilters && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={closeMobileFilters}
                    />

                    {/* Модальное окно с фильтрами */}
                    <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white z-50 shadow-lg lg:hidden">
                        <div className="flex flex-col h-full">
                            {/* Заголовок модального окна */}
                            <div className="flex items-center justify-between p-4 border-b">
                                <h2 className="text-lg font-semibold">Фильтры</h2>
                                <button
                                    onClick={closeMobileFilters}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                    aria-label="Закрыть фильтры"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Содержимое фильтров */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <SaleFilters isMobile={true} />
                            </div>

                            {/* Кнопки действий */}
                            <div className="p-4 border-t bg-gray-50 space-y-3">
                                <button
                                    className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                                    onClick={closeMobileFilters}
                                >
                                    Применить фильтры
                                </button>
                                <button
                                    className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm"
                                    onClick={closeMobileFilters}
                                >
                                    Сбросить все
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* SEO блок */}
            <div className="mt-16 bg-gray-50 p-6 sm:p-8 rounded-lg">
                <h2 className="text-xl sm:text-2xl font-bold mb-4">Акции на воздушные шары в Киеве</h2>
                <div className="prose max-w-none text-gray-600 text-sm sm:text-base">
                    <p className="mb-4">
                        Воспользуйтесь нашими выгодными акциями на воздушные шары! В разделе "Акции" вы найдете
                        фольгированные и латексные шары со скидками до 70%.
                    </p>
                    <p className="mb-4">
                        Мы регулярно проводим распродажи букетов из шаров, цифр, подарочных наборов и стаканчиков.
                        Следите за обновлениями, чтобы не пропустить самые выгодные предложения!
                    </p>
                    <p>
                        Доставка товаров по акции осуществляется по Киеву в обычном режиме - за 2 часа.
                        Спешите сделать заказ, количество товаров по акционным ценам ограничено!
                    </p>
                </div>
            </div>
        </div>
    )
}