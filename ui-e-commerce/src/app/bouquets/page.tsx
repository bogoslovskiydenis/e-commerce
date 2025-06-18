'use client'

import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CATEGORY_CONFIGS } from '@/config/categoryConfig'
import { getProductsByCategory } from '@/data/productsData'

export default function BouquetsPage() {
    return (
        <UniversalCategoryPage
            categoryKey="bouquets"
            config={CATEGORY_CONFIGS.bouquets}
            products={getProductsByCategory('bouquets')}
        />
    )
}