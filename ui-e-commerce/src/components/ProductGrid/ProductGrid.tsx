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

export default function ProductGrid({
                                        products = [],
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