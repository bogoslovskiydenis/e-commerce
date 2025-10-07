import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UniversalCategoryPage from '@/components/UniversalCategoryPage/UniversalCategoryPage'
import { CategoryConfig } from '@/config/categoryConfig'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Функция для получения категории по slug
async function getCategory(slug: string) {
    try {
        const res = await fetch(`${API_BASE_URL}/categories/slug/${slug}`, {
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
async function getCategoryProducts(categoryId: string) {
    try {
        const res = await fetch(
            `${API_BASE_URL}/products?categoryId=${categoryId}&limit=100`,
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
export async function generateMetadata(
    { params }: { params: Promise<{ category: string; subcategory: string }> }
): Promise<Metadata> {
    const { subcategory: subcategorySlug, category: categorySlug } = await params
    const subcategory = await getCategory(subcategorySlug)
    const parentCategory = await getCategory(categorySlug)

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
            canonical: `/${params.category}/${params.subcategory}`
        }
    }
}


// Основной компонент страницы подкатегории
export default async function SubcategoryPage({
                                                  params,
                                                  searchParams
                                              }: {
    params: { category: string; subcategory: string }
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // ============================================
    // ШАГ 1: ПОЛУЧЕНИЕ ДАННЫХ КАТЕГОРИЙ
    // ============================================

    // Получаем родительскую категорию
    const parentCategory = await getCategory(params.category)

    if (!parentCategory) {
        console.error(`Parent category not found: ${params.category}`)
        notFound()
    }

    // Получаем подкатегорию
    const subcategory = await getCategory(params.subcategory)

    if (!subcategory) {
        console.error(`Subcategory not found: ${params.subcategory}`)
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


    // Получаем товары подкатегории
    const products = await getCategoryProducts(subcategory.id)


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
            `Купить ${subcategory.name.toLowerCase()} в категории ${parentCategory.name.toLowerCase()}`,

        // Опции сортировки
        sortOptions: [
            { value: 'popular', label: 'По популярности' },
            { value: 'price-asc', label: 'Сначала дешевые' },
            { value: 'price-desc', label: 'Сначала дорогие' },
            { value: 'name-asc', label: 'По названию А-Я' },
            { value: 'name-desc', label: 'По названию Я-А' },
            { value: 'new', label: 'Новинки' }
        ]
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