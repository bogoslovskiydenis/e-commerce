'use client'

import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CATEGORY_CONFIGS } from '@/config/categoryConfig'
import { getProductsByCategory } from '@/data/productsData'

export default function GiftsPage() {
    return (
        <UniversalCategoryPage
            categoryKey="gifts"
            config={CATEGORY_CONFIGS.gifts}
            products={getProductsByCategory('gifts')}
        />
    )
}