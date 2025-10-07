import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CategoryConfig } from '@/config/categoryConfig'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getCategory(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/slug/${slug}`, {
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

async function getCategoryProducts(categoryId: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/products?categoryId=${categoryId}&limit=100`, {
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
    const category = await getCategory(categorySlug)
    if (!category) {
        return { title: 'Категория не найдена', description: 'Запрашиваемая категория не существует' }
    }
    return {
        title: category.metaTitle || category.name,
        description: category.metaDescription || category.description || `Купить ${category.name}`,
        keywords: category.metaKeywords || category.name
    }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params
    const category = await getCategory(categorySlug)
    if (!category) notFound()

    const products = await getCategoryProducts(category.id)

    const config: CategoryConfig = {
        title: category.name,
        description: category.description || '',
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
        seoDescription: category.metaDescription || category.description || '',
        sortOptions: [
            { value: 'popular', label: 'По популярности' },
            { value: 'price-asc', label: 'Сначала дешевые' },
            { value: 'price-desc', label: 'Сначала дорогие' },
            { value: 'name-asc', label: 'По названию А-Я' },
            { value: 'name-desc', label: 'По названию Я-А' },
            { value: 'new', label: 'Новинки' }
        ]
    }

    const breadcrumbs = [
        { name: 'Главная', href: '/' },
        { name: category.name, href: `/${category.slug}`, current: true }
    ]

    if (category.parent) {
        breadcrumbs.splice(1, 0, { name: category.parent.name, href: `/${category.parent.slug}` })
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