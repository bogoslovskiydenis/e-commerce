import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CategoryConfig } from '@/config/categoryConfig'
import { PageProps, resolveParams } from '@/types/next'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

async function getLanguage() {
    const cookieStore = await cookies()
    return cookieStore.get('language')?.value || 'uk'
}

// Функция для получения категории по slug
async function getCategory(slug: string, lang: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/slug/${slug}?lang=${lang}`, {
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!res.ok) {
            return null
        }

        const data = await res.json()
        return data.success ? data.data : null
    } catch (error) {
        console.error('Error fetching category:', error)
        return null
    }
}

// Функция для получения товаров подкатегории
async function getCategoryProducts(categoryId: string, lang: string) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/products?categoryId=${categoryId}&limit=100&lang=${lang}`,
            {
                cache: 'no-store',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        )

        if (!res.ok) {
            return []
        }

        const data = await res.json()
        return data.success ? data.data : []
    } catch (error) {
        console.error('Error fetching products:', error)
        return []
    }
}

// Генерация метаданных для SEO
export async function generateMetadata({
                                           params
                                       }: PageProps<{ category: string; subcategory: string }>): Promise<Metadata> {
    const { subcategory: subcategorySlug, category: categorySlug } = await resolveParams(params)
    const lang = await getLanguage()
    const subcategory = await getCategory(subcategorySlug, lang)
    const parentCategory = await getCategory(categorySlug, lang)

    if (!subcategory) {
        return {
            title: 'Категория не найдена',
            description: 'Запрашиваемая категория не существует'
        }
    }

    // Формируем title с учетом родительской категории
    const fullTitle = parentCategory
        ? `${subcategory.name} - ${parentCategory.name}`
        : subcategory.name

    return {
        title: subcategory.metaTitle || fullTitle,
        description: subcategory.metaDescription || subcategory.description || `Купить ${subcategory.name}`,
        keywords: subcategory.metaKeywords || `${subcategory.name}, ${parentCategory?.name}`,
        openGraph: {
            title: subcategory.metaTitle || fullTitle,
            description: subcategory.metaDescription || subcategory.description,
            images: subcategory.bannerUrl ? [subcategory.bannerUrl] : [],
            type: 'website'
        },
        alternates: {
            canonical: `/${categorySlug}/${subcategorySlug}`
        }
    }
}

// Основной компонент страницы подкатегории
export default async function SubcategoryPage({
                                                  params,
                                                  searchParams
                                              }: PageProps<{ category: string; subcategory: string }>) {
    // Получаем параметры (работает и с Promise и без)
    const { category: categorySlug, subcategory: subcategorySlug } = await resolveParams(params)
    const lang = await getLanguage()

    // ============================================
    // ШАГ 1: ПОЛУЧЕНИЕ ДАННЫХ КАТЕГОРИЙ
    // ============================================

    // Получаем родительскую категорию
    const parentCategory = await getCategory(categorySlug, lang)

    if (!parentCategory) {
        console.error(`Parent category not found: ${categorySlug}`)
        notFound()
    }

    // Получаем подкатегорию
    const subcategory = await getCategory(subcategorySlug, lang)

    if (!subcategory) {
        console.error(`Subcategory not found: ${subcategorySlug}`)
        notFound()
    }

    // Проверяем, что подкатегория действительно дочерняя для родительской
    if (subcategory.parentId !== parentCategory.id) {
        console.error(
            `Invalid hierarchy: ${subcategory.name} (${subcategory.id}) ` +
            `is not a child of ${parentCategory.name} (${parentCategory.id})`
        )
        notFound()
    }

    // ============================================
    // ШАГ 3: ЗАГРУЗКА ТОВАРОВ
    // ============================================

    // Получаем товары подкатегории
    const products = await getCategoryProducts(subcategory.id, lang)

    // ============================================
    // ШАГ 4: КОНФИГУРАЦИЯ СТРАНИЦЫ
    // ============================================

    // Формируем конфигурацию для UniversalCategoryPage
    const config: CategoryConfig = {
        title: subcategory.name,
        description: subcategory.description || '',
        basePath: `/${parentCategory.slug}/${subcategory.slug}`,
        categoryType: subcategory.type.toLowerCase(),

        // Фильтры на основе типа категории
        filters: {
            colors: ['BALLOONS', 'COLORS'].includes(subcategory.type),
            materials: ['BALLOONS', 'MATERIALS'].includes(subcategory.type),
            price: true,
            helium: subcategory.type === 'BALLOONS',
            inStock: true,
            volume: subcategory.type === 'CUPS',
            giftTypes: subcategory.type === 'GIFTS'
        },

        // SEO оптимизация
        seoTitle: subcategory.metaTitle || `${subcategory.name} - ${parentCategory.name}`,
        seoDescription: subcategory.metaDescription || subcategory.description ||
            `Купить ${subcategory.name.toLowerCase()} в категории ${parentCategory.name.toLowerCase()}`
    }

    // ============================================
    // ШАГ 5: ФОРМИРОВАНИЕ BREADCRUMBS
    // ============================================

    // Формируем breadcrumbs с учетом иерархии
    const breadcrumbs = [
        { name: 'Главная', href: '/' },
        {
            name: parentCategory.name,
            href: `/${parentCategory.slug}`
        },
        {
            name: subcategory.name,
            href: `/${parentCategory.slug}/${subcategory.slug}`,
            current: true
        }
    ]

    // Если у родительской категории есть свой родитель, добавляем его
    if (parentCategory.parent) {
        breadcrumbs.splice(1, 0, {
            name: parentCategory.parent.name,
            href: `/${parentCategory.parent.slug}`
        })
    }

    // ============================================
    // ШАГ 6: ФОРМАТИРОВАНИЕ ТОВАРОВ
    // ============================================

    // Преобразуем товары в формат для отображения
    const formattedProducts = products.map((product: any) => ({
        id: product.id,
        name: product.title,
        price: parseFloat(product.price),
        oldPrice: product.oldPrice ? parseFloat(product.oldPrice) : undefined,
        discount: product.discount ? parseFloat(product.discount) : undefined,
        image: product.images?.[0] || '/api/placeholder/300/300',
        category: subcategory.slug,

        // Атрибуты для фильтрации
        colors: product.attributes?.colors || [],
        material: product.attributes?.material || 'Не указан',
        inStock: product.inStock,
        withHelium: product.attributes?.withHelium || false,
        size: product.attributes?.size || '',
        volume: product.attributes?.volume || '',

        // Мета-информация
        type: subcategory.type.toLowerCase(),
        slug: product.slug,
        featured: product.featured || false
    }))

    // ============================================
    // ШАГ 7: РЕНДЕРИНГ
    // ============================================

    return (
        <UniversalCategoryPage
            categoryKey={subcategory.slug}
            config={config}
            products={formattedProducts}
            customBreadcrumbs={breadcrumbs}
        />
    )
}