import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CategoryConfig } from '@/config/categoryConfig'
import { getLocalizedCategoryName, getLocalizedCategoryDescription } from '@/utils/categoryLocalization'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getLanguage() {
    const cookieStore = await cookies()
    return cookieStore.get('language')?.value || 'uk'
}

// Функция для получения переводов на сервере
function getServerTranslations(lang: string) {
    const translations: Record<string, Record<string, string>> = {
        uk: { home: 'Головна' },
        ru: { home: 'Главная' },
        en: { home: 'Home' }
    }
    return translations[lang] || translations.uk
}

async function getCategory(slug: string, lang: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/slug/${slug}?lang=${lang}`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) return null
        const data = await res.json()
        return data.success ? data.data : null
    } catch (error) {
        console.error('Error fetching category:', error)
        return null
    }
}

async function getCategoryProducts(categoryId: string, lang: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/products?categoryId=${categoryId}&limit=100&lang=${lang}`, {
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!res.ok) return []
        const data = await res.json()
        return data.success ? data.data : []
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category: categorySlug } = await params
    const lang = await getLanguage()
    const category = await getCategory(categorySlug, lang)
    if (!category) {
        return { title: 'Category not found', description: 'The requested category does not exist' }
    }
    return {
        title: category.metaTitle || category.name,
        description: category.metaDescription || category.description || `Buy ${category.name}`,
        keywords: category.metaKeywords || category.name
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params
    const lang = await getLanguage()
    const category = await getCategory(categorySlug, lang)
    if (!category) notFound()

    const products = await getCategoryProducts(category.id, lang)

    const localizedCategoryName = getLocalizedCategoryName(category, lang as any)
    const localizedCategoryDescription = getLocalizedCategoryDescription(category, lang as any)

    const config: CategoryConfig = {
        title: localizedCategoryName,
        description: localizedCategoryDescription,
        basePath: `/${category.slug}`,
        categoryType: category.type.toLowerCase(),
        filters: {
            colors: category.type === 'BALLOONS' || category.type === 'COLORS',
            materials: category.type === 'BALLOONS' || category.type === 'MATERIALS',
            price: true,
            helium: category.type === 'BALLOONS',
            inStock: true,
            volume: category.type === 'CUPS',
            giftTypes: category.type === 'GIFTS'
        },
        seoTitle: category.metaTitle || category.name,
        seoDescription: category.metaDescription || category.description || ''
    }

    // Получаем переводы для breadcrumbs
    const t = getServerTranslations(lang)

    const breadcrumbs = [
        { name: t.home, href: '/' },
        { name: localizedCategoryName, href: `/${category.slug}`, current: true }
    ]

    if (category.parent) {
        const localizedParentName = getLocalizedCategoryName(category.parent, lang as any)
        breadcrumbs.splice(1, 0, { name: localizedParentName, href: `/${category.parent.slug}` })
    }

    const formattedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.title,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : undefined,
        discount: product.discount ? parseFloat(product.discount) : undefined,
        image: product.images?.[0] || '/api/placeholder/300/300',
        category: category.slug,
        colors: product.attributes?.colors || [],
        material: product.attributes?.material || 'Не указан',
        inStock: product.inStock,
        withHelium: product.attributes?.withHelium || false,
        size: product.attributes?.size || '',
        volume: product.attributes?.volume || '',
        type: category.type.toLowerCase()
    }))

    return (
        <UniversalCategoryPage
            categoryKey={category.slug}
            config={config}
            products={formattedProducts}
            customBreadcrumbs={breadcrumbs}
        />
    )
}