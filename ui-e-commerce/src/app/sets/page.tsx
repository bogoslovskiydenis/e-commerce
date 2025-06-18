'use client'

import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CATEGORY_CONFIGS } from '@/config/categoryConfig'
import { getProductsByCategory } from '@/data/productsData'

export default function SetsPage() {
    return (
        <UniversalCategoryPage
            categoryKey="sets"
            config={CATEGORY_CONFIGS.sets}
            products={getProductsByCategory('sets')}
        />
    )
}