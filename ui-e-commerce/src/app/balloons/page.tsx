'use client'

import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CATEGORY_CONFIGS } from '@/config/categoryConfig'
import { getProductsByCategory } from '@/data/productsData'

export default function BalloonsPage() {
    return (
        <UniversalCategoryPage
            categoryKey="balloons"
            config={CATEGORY_CONFIGS.balloons}
            products={getProductsByCategory('balloons')}
        />
    )
}