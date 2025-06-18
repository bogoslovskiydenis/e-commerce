'use client'

import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CATEGORY_CONFIGS } from '@/config/categoryConfig'
import { getProductsByCategory } from '@/data/productsData'

export default function CupsPage() {
    return (
        <UniversalCategoryPage
            categoryKey="cups"
            config={CATEGORY_CONFIGS.cups}
            products={getProductsByCategory('cups')}
        />
    )
}