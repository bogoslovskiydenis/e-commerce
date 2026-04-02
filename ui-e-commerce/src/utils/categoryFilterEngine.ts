import type { CategoryFacet, CategoryFacetOption } from '@/config/categoryFacets'
import { facetLabel, optionLabel } from '@/config/categoryFacets'

export interface FilterState {
    priceRange: { from: string; to: string }
    multi: Record<string, string[]>
    boolean: Record<string, boolean>
}

export type LangCode = 'uk' | 'ru' | 'en'

export function initialFilterState(facets: CategoryFacet[]): FilterState {
    const multi: Record<string, string[]> = {}
    const boolean: Record<string, boolean> = {}
    for (const f of facets) {
        if (f.type === 'multi') multi[f.id] = []
        if (f.type === 'boolean') boolean[f.id] = false
    }
    return { priceRange: { from: '', to: '' }, multi, boolean }
}

function getProductValue(product: Record<string, unknown>, source: string): unknown {
    const v = product[source]
    if (v !== undefined && v !== null) return v
    return undefined
}

function matchesAliases(productVal: string, option: CategoryFacetOption): boolean {
    const aliases = option.match?.length ? option.match : [option.value]
    const pv = String(productVal)
    return aliases.some((a) => pv === a || pv.toLowerCase() === a.toLowerCase() || pv.toLowerCase().includes(a.toLowerCase()))
}

function facetMatches(
    product: Record<string, unknown>,
    facet: CategoryFacet,
    state: FilterState
): boolean {
    if (facet.type === 'range' && facet.source === 'price') {
        const price = Number(product.price)
        if (Number.isNaN(price)) return true
        if (state.priceRange.from && price < parseFloat(state.priceRange.from)) return false
        if (state.priceRange.to && price > parseFloat(state.priceRange.to)) return false
        return true
    }

    if (facet.type === 'boolean') {
        if (!state.boolean[facet.id]) return true
        const v = getProductValue(product, facet.source)
        return Boolean(v)
    }

    if (facet.type === 'multi') {
        const selected = state.multi[facet.id] || []
        if (selected.length === 0) return true
        const raw = getProductValue(product, facet.source)
        const options = facet.options || []

        if (facet.source === 'colors' && Array.isArray(raw)) {
            return selected.every((sv) => {
                const opt = options.find((o) => o.value === sv)
                if (!opt) return raw.some((p) => String(p) === sv)
                return raw.some((p) => matchesAliases(String(p), opt))
            })
        }

        if (facet.source === 'brand' && typeof raw === 'string') {
            const str = String(raw).trim()
            if (!str) return selected.length === 0
            return selected.every((sv) => {
                const opt = options.find((o) => o.value === sv)
                const aliases = opt?.match?.length ? opt.match : opt ? [opt.value] : [sv]
                return aliases.some((a) => str.toLowerCase() === a.toLowerCase())
            })
        }

        if (typeof raw === 'string' || typeof raw === 'number') {
            const str = String(raw)
            return selected.every((sv) => {
                const opt = options.find((o) => o.value === sv)
                if (!opt) return str.includes(sv)
                return matchesAliases(str, opt)
            })
        }

        if (facet.source === 'size' && typeof raw === 'string') {
            return selected.every((sv) => {
                const opt = options.find((o) => o.value === sv)
                const needles = opt?.match?.length ? opt.match : [sv.replace('мл', '').trim()]
                return needles.some((n) => raw.includes(n))
            })
        }

        return true
    }

    return true
}

export function filterProductsByFacets<T extends Record<string, unknown>>(
    products: T[],
    facets: CategoryFacet[],
    state: FilterState
): T[] {
    return products.filter((p) => facets.every((f) => facetMatches(p, f, state)))
}

export interface ActiveChip {
    key: string
    label: string
}

export function buildActiveChips(facets: CategoryFacet[], state: FilterState, lang: LangCode): ActiveChip[] {
    const chips: ActiveChip[] = []
    const L = lang

    if (state.priceRange.from || state.priceRange.to) {
        const pf = facets.find((f) => f.type === 'range')
        const from = state.priceRange.from || '0'
        const to = state.priceRange.to || '∞'
        const title = pf ? facetLabel(pf, L) : 'Price'
        chips.push({ key: 'price', label: `${title}: ${from} – ${to}` })
    }

    for (const f of facets) {
        if (f.type === 'multi') {
            const sel = state.multi[f.id] || []
            for (const sv of sel) {
                const opt = f.options?.find((o) => o.value === sv)
                const label = opt ? optionLabel(opt, L) : sv
                chips.push({ key: `multi:${f.id}:${sv}`, label: `${facetLabel(f, L)}: ${label}` })
            }
        }
        if (f.type === 'boolean' && state.boolean[f.id]) {
            chips.push({ key: `bool:${f.id}`, label: facetLabel(f, L) })
        }
    }

    return chips
}

export function applyRemoveChipKey(key: string, facets: CategoryFacet[], state: FilterState): FilterState {
    const next: FilterState = {
        priceRange: { ...state.priceRange },
        multi: { ...state.multi },
        boolean: { ...state.boolean },
    }

    if (key === 'price') {
        next.priceRange = { from: '', to: '' }
        return next
    }

    if (key.startsWith('bool:')) {
        const id = key.slice(5)
        next.boolean[id] = false
        return next
    }

    if (key.startsWith('multi:')) {
        const parts = key.split(':')
        const facetId = parts[1]
        const val = parts.slice(2).join(':')
        if (facetId && next.multi[facetId]) {
            next.multi[facetId] = next.multi[facetId].filter((x) => x !== val)
        }
        return next
    }

    return next
}

export function chipColorClass(key: string): string {
    if (key === 'price') return 'bg-amber-100 text-amber-800'
    if (key.startsWith('multi:colors:')) return 'bg-blue-100 text-blue-800'
    if (key.startsWith('multi:material:')) return 'bg-purple-100 text-purple-800'
    if (key.startsWith('multi:brand:')) return 'bg-indigo-100 text-indigo-800'
    if (key.startsWith('bool:withHelium')) return 'bg-teal-100 text-teal-800'
    if (key.startsWith('bool:inStock')) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
}
