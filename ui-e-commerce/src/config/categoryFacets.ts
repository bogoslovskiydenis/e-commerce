export type FacetType = 'multi' | 'boolean' | 'range'

export interface CategoryFacetOption {
    value: string
    labelUk?: string
    labelRu?: string
    labelEn?: string
    /** Значения в attributes / полях товара */
    match?: string[]
    colorClass?: string
}

export interface CategoryFacet {
    id: string
    /** Поле на отформатированном товаре: price, colors, material, inStock, withHelium, size, giftType */
    source: string
    type: FacetType
    labelUk?: string
    labelRu?: string
    labelEn?: string
    options?: CategoryFacetOption[]
}

const priceFacet = (): CategoryFacet => ({
    id: 'price',
    source: 'price',
    type: 'range',
    labelUk: 'Ціна',
    labelRu: 'Цена',
    labelEn: 'Price',
})

const inStockFacet = (): CategoryFacet => ({
    id: 'inStock',
    source: 'inStock',
    type: 'boolean',
    labelUk: 'Лише в наявності',
    labelRu: 'Только в наличии',
    labelEn: 'In stock only',
})

const colorFacet = (): CategoryFacet => ({
    id: 'colors',
    source: 'colors',
    type: 'multi',
    labelUk: 'Колір',
    labelRu: 'Цвет',
    labelEn: 'Color',
    options: [
        { value: 'red', labelUk: 'Червоний', labelRu: 'Красный', labelEn: 'Red', colorClass: 'bg-red-500', match: ['Красный', 'красный', 'Червоний', 'червоний', 'Red'] },
        { value: 'blue', labelUk: 'Синій', labelRu: 'Синий', labelEn: 'Blue', colorClass: 'bg-blue-500', match: ['Синий', 'синий', 'Синій', 'синій'] },
        { value: 'pink', labelUk: 'Рожевий', labelRu: 'Розовый', labelEn: 'Pink', colorClass: 'bg-pink-500', match: ['Розовый', 'розовий', 'Рожевий', 'рожевий'] },
        { value: 'gold', labelUk: 'Золотий', labelRu: 'Золотой', labelEn: 'Gold', colorClass: 'bg-yellow-500', match: ['Золотой', 'золотий', 'Золотий'] },
        { value: 'silver', labelUk: 'Срібний', labelRu: 'Серебряный', labelEn: 'Silver', colorClass: 'bg-gray-400', match: ['Серебряный', 'срібний', 'Срібний', 'серебряный'] },
        { value: 'green', labelUk: 'Зелений', labelRu: 'Зеленый', labelEn: 'Green', colorClass: 'bg-green-500', match: ['Зеленый', 'зелений', 'Зелений', 'зелений'] },
    ],
})

const balloonMaterialFacet = (): CategoryFacet => ({
    id: 'material',
    source: 'material',
    type: 'multi',
    labelUk: 'Матеріал',
    labelRu: 'Материал',
    labelEn: 'Material',
    options: [
        { value: 'foil', labelUk: 'Фольга', labelRu: 'Фольга', labelEn: 'Foil', match: ['Фольга', 'фольга', 'Foil'] },
        { value: 'latex', labelUk: 'Латекс', labelRu: 'Латекс', labelEn: 'Latex', match: ['Латекс', 'латекс'] },
    ],
})

const cupMaterialFacet = (): CategoryFacet => ({
    id: 'material',
    source: 'material',
    type: 'multi',
    labelUk: 'Матеріал',
    labelRu: 'Материал',
    labelEn: 'Material',
    options: [
        { value: 'paper', labelUk: 'Паперові', labelRu: 'Бумажные', labelEn: 'Paper', match: ['Папера', 'Бумага', 'бумага', 'Паперові', 'paper'] },
        { value: 'plastic', labelUk: 'Пластикові', labelRu: 'Пластиковые', labelEn: 'Plastic', match: ['Пластик', 'пластик', 'Пластикові'] },
        { value: 'eco', labelUk: 'Екологічні', labelRu: 'Экологичные', labelEn: 'Eco', match: ['Эко', 'еко', 'Екологічні', 'Eco'] },
    ],
})

const volumeFacet = (): CategoryFacet => ({
    id: 'volume',
    source: 'size',
    type: 'multi',
    labelUk: "Об'єм",
    labelRu: 'Объем',
    labelEn: 'Volume',
    options: [
        { value: '200мл', labelUk: '200 мл', labelRu: '200 мл', labelEn: '200 ml', match: ['200'] },
        { value: '250мл', labelUk: '250 мл', labelRu: '250 мл', labelEn: '250 ml', match: ['250'] },
        { value: '300мл', labelUk: '300 мл', labelRu: '300 мл', labelEn: '300 ml', match: ['300'] },
    ],
})

const giftTypeFacet = (): CategoryFacet => ({
    id: 'giftType',
    source: 'giftType',
    type: 'multi',
    labelUk: 'Тип подарунка',
    labelRu: 'Тип подарка',
    labelEn: 'Gift type',
    options: [
        { value: 'plush', labelUk: "М'які іграшки", labelRu: 'Мягкие игрушки', labelEn: 'Plush', match: ['plush', 'Plush'] },
        { value: 'souvenir', labelUk: 'Сувеніри', labelRu: 'Сувениры', labelEn: 'Souvenirs', match: ['souvenir', 'Souvenir'] },
        { value: 'jewelry', labelUk: 'Прикраси', labelRu: 'Украшения', labelEn: 'Jewelry', match: ['jewelry', 'Jewelry'] },
        { value: 'sweets', labelUk: 'Цукерки', labelRu: 'Конфеты', labelEn: 'Sweets', match: ['sweets', 'Sweets'] },
        { value: 'flowers', labelUk: 'Квіти', labelRu: 'Цветы', labelEn: 'Flowers', match: ['flowers', 'Flowers'] },
    ],
})

const heliumFacet = (): CategoryFacet => ({
    id: 'withHelium',
    source: 'withHelium',
    type: 'boolean',
    labelUk: 'З гелієм',
    labelRu: 'С гелием',
    labelEn: 'With helium',
})

/** Техника: бренд из поля product.brand — варианты задаются в админке (filters) или вручную в опциях */
const brandFacet = (): CategoryFacet => ({
    id: 'brand',
    source: 'brand',
    type: 'multi',
    labelUk: 'Бренд',
    labelRu: 'Бренд',
    labelEn: 'Brand',
    options: [],
})

function normType(t: string): string {
    return String(t || 'PRODUCTS').toUpperCase()
}

/** Дефолтные фасеты по enum категории в БД (если filters.facets пусто) */
export function getDefaultFacets(categoryType: string): CategoryFacet[] {
    const T = normType(categoryType)
    const out: CategoryFacet[] = [priceFacet()]

    if (T === 'BALLOONS' || T === 'COLORS') {
        out.push(colorFacet())
    }
    if (T === 'BALLOONS') {
        out.push(balloonMaterialFacet(), heliumFacet())
    }
    if (T === 'MATERIALS') {
        out.push(balloonMaterialFacet())
    }
    if (T === 'GIFTS') {
        out.push(giftTypeFacet())
    }
    if (T === 'CUPS') {
        out.push(cupMaterialFacet(), volumeFacet())
    }
    if (T === 'TECH') {
        out.push(brandFacet())
    }

    out.push(inStockFacet())
    return out
}

/** Поиск: широкий набор без гелия */
export function getSearchFacets(): CategoryFacet[] {
    return [
        priceFacet(),
        colorFacet(),
        {
            id: 'material',
            source: 'material',
            type: 'multi',
            labelUk: 'Матеріал',
            labelRu: 'Материал',
            labelEn: 'Material',
            options: [
                ...(balloonMaterialFacet().options || []),
                ...(cupMaterialFacet().options || []),
            ],
        },
        inStockFacet(),
    ]
}

export function resolveFacets(category: { type?: string; filters?: unknown }): CategoryFacet[] {
    const raw = category?.filters as { facets?: CategoryFacet[] } | null | undefined
    if (raw && Array.isArray(raw.facets) && raw.facets.length > 0) {
        const cleaned = raw.facets.filter((f) => f && typeof f.id === 'string' && typeof f.source === 'string' && f.type)
        if (cleaned.length > 0) return cleaned
    }
    return getDefaultFacets(category?.type || 'PRODUCTS')
}

export function facetLabel(f: CategoryFacet, lang: string): string {
    const L = (lang || 'uk').toLowerCase()
    if (L === 'ru') return f.labelRu || f.labelUk || f.id
    if (L === 'en') return f.labelEn || f.labelUk || f.id
    return f.labelUk || f.labelRu || f.id
}

export function optionLabel(o: CategoryFacetOption, lang: string): string {
    const L = (lang || 'uk').toLowerCase()
    if (L === 'ru') return o.labelRu || o.labelUk || o.value
    if (L === 'en') return o.labelEn || o.labelUk || o.value
    return o.labelUk || o.labelRu || o.value
}
