import Filters from '@/components/Filters'
import Sidebar from '@/components/Sidebar'
import ProductGrid from '@/components/ProductGrid'
import { WOMEN_PRODUCTS, WOMEN_CATEGORIES } from './mock-data'

export default function WomenPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Жіночий одяг</h1>
                <p className="text-gray-600 mt-2">
                    Відкрийте для себе останні тренди в жіночій моді
                </p>
            </div>

            <div className="flex gap-8">
                <Sidebar categories={WOMEN_CATEGORIES} />

                <div className="flex-1">
                    <Filters />
                    <ProductGrid products={WOMEN_PRODUCTS} />
                </div>
            </div>
        </div>
    )
}