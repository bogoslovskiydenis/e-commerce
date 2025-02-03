export default function MenPage() {
    return (
        <div>
            {/* Баннер */}
            <div className="bg-neutral-300 h-[500px] relative">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-lg">
                        <h1 className="text-4xl font-bold text-white mb-6">
                            Нова колекція
                        </h1>
                        <p className="text-xl text-white mb-8">
                            Відкрийте для себе останні тренди в чоловічій моді
                        </p>
                        <button className="px-8 py-3 bg-white text-black text-sm font-medium rounded-sm hover:bg-gray-100">
                            ПЕРЕВІРИТИ
                        </button>
                    </div>
                </div>
            </div>

            {/* Категории */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Категорії</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: 'Светри', image: '/images/categories/men/sweaters.jpg' },
                        { name: 'Джинси', image: '/images/categories/men/jeans.jpg' },
                        { name: 'Куртки', image: '/images/categories/men/jackets.jpg' },
                        { name: 'Взуття', image: '/images/categories/men/shoes.jpg' },
                        { name: 'Костюми', image: '/images/categories/men/suits.jpg' },
                        { name: 'Аксесуари', image: '/images/categories/men/accessories.jpg' }
                    ].map((category) => (
                        <div
                            key={category.name}
                            className="group relative aspect-square bg-neutral-300"
                        >
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                    {category.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Популярные бренды */}
            <div className="container mx-auto px-4 py-12 border-t">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Популярні бренди</h2>
                    <a href="#" className="text-sm text-gray-600 hover:text-black">
                        Дивитися всі
                    </a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {[
                        'Hugo Boss',
                        'Tommy Hilfiger',
                        'Calvin Klein',
                        'Levi\'s',
                        'Emporio Armani',
                        'Guess'
                    ].map((brand) => (
                        <div
                            key={brand}
                            className="aspect-[3/2] bg-neutral-200 flex items-center justify-center"
                        >
                            <span className="text-gray-500">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Подписка на новости */}
            <div className="bg-gray-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold mb-4">Отримай -15% знижки на покупки</h2>
                    <p className="text-gray-600 mb-8">
                        Отримуй інформацію про новинки та акції
                    </p>
                    <div className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Введіть email"
                            className="flex-1 px-4 py-3 rounded-lg border"
                        />
                        <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800">
                            Підписатися
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}