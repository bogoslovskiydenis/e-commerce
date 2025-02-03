import Image from 'next/image'
import Link from 'next/link'
import ProductSection from '@/components/ProductSection'

// Моковые данные для женской одежды
const WOMEN_PRODUCTS = [
    {
        id: 'w1',
        brand: 'Zara',
        title: 'Платье · Чорний',
        price: 2199,
        oldPrice: 2899,
        discount: 24,
        image: '/images/products/women/zara-dress.jpg',
        link: '/products/zara-dress',
        category: 'dresses'  // Добавлено поле category
    },
    {
        id: 'w2',
        brand: 'H&M',
        title: 'Блуза · Білий',
        price: 1299,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/hm-blouse.jpg',
        link: '/products/hm-blouse',
        category: 'blouses'  // Добавлено поле category
    },
    {
        id: 'w3',
        brand: "Levi's",
        title: 'Джинси · Синій',
        price: 2899,
        oldPrice: null,
        discount: 0,
        image: '/images/products/women/levis-jeans.jpg',
        link: '/products/levis-jeans',
        category: 'jeans'  // Добавлено поле category
    }
]

export default function WomenPage() {
    return (
        <div>
            {/* Промо баннер */}
            <div className="relative aspect-[2/1] md:aspect-[3/1]">
                <Image
                    src="/images/banners/women-banner.jpg"
                    alt="Жіночий одяг"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-lg text-white">
                            <h1 className="text-4xl font-bold mb-4">Нова колекція</h1>
                            <p className="text-lg mb-6">
                                Відкрийте для себе останні тренди в жіночій моді
                            </p>
                            <Link
                                href="/zinka/new"
                                className="inline-block px-8 py-3 bg-white text-black rounded hover:bg-gray-100"
                            >
                                ПЕРЕВІРИТИ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Категории */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Категорії</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                        { name: 'Плаття', image: '/images/categories/dresses.jpg' },
                        { name: 'Блузи', image: '/images/categories/blouses.jpg' },
                        { name: 'Джинси', image: '/images/categories/jeans.jpg' },
                        { name: 'Спідниці', image: '/images/categories/skirts.jpg' },
                        { name: 'Взуття', image: '/images/categories/shoes.jpg' },
                        { name: 'Аксесуари', image: '/images/categories/accessories.jpg' }
                    ].map((category) => (
                        <Link
                            key={category.name}
                            href={`/zinka/${category.name.toLowerCase()}`}
                            className="group relative aspect-square"
                        >
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all rounded-lg" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white font-medium text-lg">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Секция товаров со скидками */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold">Найкращі пропозиції</h2>
                    <Link href="/zinka/sale" className="text-sm text-gray-600 hover:text-black">
                        Дивитися всі
                    </Link>
                </div>
                <ProductSection products={WOMEN_PRODUCTS} />
            </div>

            {/* Бренды */}
            <div className="container mx-auto px-4 py-12 border-t">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {['zara', 'hm', 'levis', 'mango'].map((brand) => (
                        <Image
                            key={brand}
                            src={`/images/brands/${brand}.png`}
                            alt={brand}
                            width={120}
                            height={40}
                            className="object-contain"
                        />
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