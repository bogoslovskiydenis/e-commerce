import ProductCard from '@/components/ProductCard/ProductCard'

export interface BalloonProduct {
    id: string
    name: string
    type: 'foil' | 'latex' | 'bouquet' | 'set' | 'cup' | 'plush' | 'souvenir' | 'jewelry' | 'sweets' | 'flowers' | 'gift set'
    price: number
    oldPrice?: number
    discount?: number
    image: string
    category: string
    withHelium?: boolean
    size?: string
    colors?: string[]
    material?: string
    inStock: boolean
}

interface ProductGridProps {
    products?: BalloonProduct[]
    className?: string
    basePath?: string // Добавляем basePath для гибкости
}

// Дефолтные продукты для магазина шариков
const DEFAULT_BALLOON_PRODUCTS: BalloonProduct[] = [
    {
        id: '1',
        name: 'Сердце фольгированное красное',
        type: 'foil',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: '/images/hard.jpg',
        category: 'hearts',
        withHelium: true,
        size: '45см',
        colors: ['Красный'],
        material: 'Фольга',
        inStock: true
    },
    {
        id: '2',
        name: 'Букет "С днем рождения"',
        type: 'bouquet',
        price: 450,
        image: '/api/placeholder/300/300',
        category: 'bouquets',
        withHelium: true,
        material: 'Фольга + Латекс',
        inStock: true
    },
    {
        id: '3',
        name: 'Цифра "1" золотая',
        type: 'foil',
        price: 350,
        oldPrice: 400,
        discount: 12,
        image: '/api/placeholder/300/300',
        category: 'numbers',
        withHelium: true,
        size: '90см',
        colors: ['Золотой'],
        material: 'Фольга',
        inStock: true
    },
    {
        id: '4',
        name: 'Набор "Единорог"',
        type: 'set',
        price: 650,
        image: '/api/placeholder/300/300',
        category: 'sets',
        withHelium: true,
        material: 'Фольга + Латекс',
        inStock: false
    }
]

export default function ProductGrid({
                                        products = DEFAULT_BALLOON_PRODUCTS,
                                        className = "",
                                        basePath = "/balloons" // По умолчанию balloons, но можно переопределить
                                    }: ProductGridProps) {
    return (
        <div className={`grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${className}`}>
            {products?.map((product) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    type={product.type}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    discount={product.discount}
                    image={product.image}
                    category={product.category}
                    withHelium={product.withHelium}
                    size={product.size}
                    colors={product.colors}
                    material={product.material}
                    inStock={product.inStock}
                    basePath={basePath}
                />
            ))}
        </div>
    )
}