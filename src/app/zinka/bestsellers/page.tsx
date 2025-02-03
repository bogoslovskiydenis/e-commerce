import Image from 'next/image'
import Link from 'next/link'
import ProductSection from '@/components/ProductSection'

// Моковые данные
// Моковые данные
const SALE_PRODUCTS = [
    {
        id: '1',
        brand: 'Desigual',
        title: 'Пуховик Aarhus 24WWEWAC Оранжевий',
        price: 3620,
        oldPrice: 8350,
        discount: 57,
        image: '/images/products/women/desigual-jacket.jpg',
        link: '/products/desigual-jacket',
        category: 'jackets'  // Добавили поле category
    },
    {
        id: '2',
        brand: 'Marciano Guess',
        title: 'Пуховик 4BGL01 7176A Сріблястий',
        price: 5280,
        oldPrice: 13250,
        discount: 60,
        image: '/images/products/women/marciano-jacket.jpg',
        link: '/products/marciano-jacket',
        category: 'jackets'  // Добавили поле category
    }
]

export default function HomePage() {
    return (
        <div>
            {/* Промо баннер */}
            <div className="relative aspect-[2/1] md:aspect-[3/1]">
                <Image
                    src="/images/banners/final-sale.jpg"
                    alt="Final Sale"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="max-w-lg text-white">
                            <h1 className="text-4xl font-bold mb-4">FINAL SALE</h1>
                            <p className="text-lg mb-6">
                                Фінал зимового розпродажу! Зберіть свій стиль за низькими цінами
                            </p>
                            <Link
                                href="/sale"
                                className="inline-block px-8 py-3 bg-white text-black rounded hover:bg-gray-100"
                            >
                                ПЕРЕВІРИТИ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Секция со скидками */}
            <div className="container mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold mb-8">Найкращі пропозиції</h2>
                <ProductSection products={SALE_PRODUCTS} />
            </div>

            {/* Бренды */}
            <div className="container mx-auto px-4 py-12 border-t">
                <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                    {['adidas', 'guess', 'calvin-klein', 'tommy-hilfiger'].map((brand) => (
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
        </div>
    )
}