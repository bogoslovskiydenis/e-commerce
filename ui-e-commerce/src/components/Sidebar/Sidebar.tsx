interface Category {
    name: string
    count: number
    href: string
}

interface SidebarProps {
    categories?: Category[]
}

// Категории для магазина шариков
const BALLOON_CATEGORIES: Category[] = [
    { name: 'Фольгированные шары', count: 245, href: '/balloons/foil' },
    { name: 'Латексные шары', count: 187, href: '/balloons/latex' },
    { name: 'Букеты из шаров', count: 156, href: '/bouquets' },
    { name: 'Цифры из шаров', count: 45, href: '/balloons/numbers' },
    { name: 'Сердца', count: 89, href: '/balloons/hearts' },
    { name: 'Звезды', count: 67, href: '/balloons/stars' },
    { name: 'Шары с рисунком', count: 134, href: '/balloons/printed' },
    { name: 'Светящиеся шары', count: 78, href: '/balloons/led' },
    { name: 'Стаканчики', count: 95, href: '/cups' },
    { name: 'Подарки', count: 203, href: '/gifts' },
    { name: 'Готовые наборы', count: 112, href: '/sets' }
]

export default function Sidebar({ categories = BALLOON_CATEGORIES }: SidebarProps) {
    return (
        <aside className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border">
                <div className="p-4 border-b">
                    <h2 className="font-semibold text-lg">Категории</h2>
                </div>
                <nav className="p-2">
                    {categories?.map((category) => (
                        <a
                            key={category.href}
                            href={category.href}
                            className="flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <span className="text-gray-700">{category.name}</span>
                            <span className="text-gray-400 text-xs">({category.count})</span>
                        </a>
                    ))}
                </nav>

                {/* Фильтры */}
                <div className="border-t p-4">
                    <h3 className="font-semibold mb-3">Фильтры</h3>

                    {/* Цена */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Цена</h4>
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
                    </div>

                    {/* Цвет */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Цвет</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { name: 'Красный', color: 'bg-red-500' },
                                { name: 'Синий', color: 'bg-blue-500' },
                                { name: 'Розовый', color: 'bg-pink-500' },
                                { name: 'Золотой', color: 'bg-yellow-500' },
                                { name: 'Серебряный', color: 'bg-gray-400' },
                                { name: 'Зеленый', color: 'bg-green-500' }
                            ].map((color) => (
                                <label key={color.name} className="flex items-center gap-1 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 rounded"
                                    />
                                    <div className={`w-4 h-4 rounded-full ${color.color}`}></div>
                                    <span className="text-xs">{color.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Материал */}
                    <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Материал</h4>
                        <div className="space-y-1">
                            {['Фольга', 'Латекс', 'Миниатюрные'].map((material) => (
                                <label key={material} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-3 h-3 rounded"
                                    />
                                    <span className="text-sm">{material}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* С гелием */}
                    <div className="mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">С гелием</span>
                        </label>
                    </div>

                    <button className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 text-sm font-medium">
                        Применить фильтры
                    </button>
                </div>
            </div>
        </aside>
    )
}