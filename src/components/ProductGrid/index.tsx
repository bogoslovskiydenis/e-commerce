import ProductCard from '@/components/ProductCard'
import { Product } from '@/types'

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        title: 'Снікерси · Білий',
        brand: 'Kappa',
        price: 2599,
        image: '/images/products/1.jpg',
        category: 'sneakers',
    },
    {
        id: '2',
        title: 'Снікерси · Білий',
        brand: 'Dorko',
        price: 1150,
        oldPrice: 2299,
        discount: 48,
        image: '/images/products/2.jpg',
        category: 'sneakers',
    },
    // Добавьте больше продуктов
]

export default function ProductGrid() {
    return (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {MOCK_PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}