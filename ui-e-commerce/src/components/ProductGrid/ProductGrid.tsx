import ProductCard from '@/components/ProductCard/ProductCard'

interface GridProduct {
    id: string
    name: string
    type?: string
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
    products?: GridProduct[]
    className?: string
    basePath?: string
}

export default function ProductGrid({
                                        products = [],
                                        className = "",
                                        basePath = "/product"
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