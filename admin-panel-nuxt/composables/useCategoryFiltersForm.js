/**
 * Форма фильтров витрины ↔ JSON поля category.filters
 */

export function parseFiltersFromApi(apiFilters) {
  if (!apiFilters || !Array.isArray(apiFilters.facets) || apiFilters.facets.length === 0) {
    return { useCustom: false, facets: [] }
  }
  return {
    useCustom: true,
    facets: apiFilters.facets.map((f) => ({
      id: f.id || '',
      source: f.source || 'colors',
      type: f.type || 'multi',
      labelUk: f.labelUk || '',
      labelRu: f.labelRu || '',
      labelEn: f.labelEn || '',
      options: (f.options || []).map((o) => ({
        value: o.value || '',
        labelUk: o.labelUk || '',
        labelRu: o.labelRu || '',
        labelEn: o.labelEn || '',
        colorClass: o.colorClass || '',
        _matchStr: Array.isArray(o.match) ? o.match.join(', ') : ''
      }))
    }))
  }
}

export function serializeFiltersForApi(useCustom, facets) {
  if (!useCustom) return null
  const list = (facets || []).map((f) => {
    const row = {
      id: String(f.id || '').trim(),
      source: String(f.source || '').trim(),
      type: f.type,
      labelUk: f.labelUk || undefined,
      labelRu: f.labelRu || undefined,
      labelEn: f.labelEn || undefined
    }
    if (f.type === 'multi' && f.options?.length) {
      row.options = f.options
        .map((o) => {
          const m = String(o._matchStr || '')
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
          const op = {
            value: String(o.value || '').trim(),
            labelUk: o.labelUk || undefined,
            labelRu: o.labelRu || undefined,
            labelEn: o.labelEn || undefined
          }
          if (m.length) op.match = m
          if (o.colorClass) op.colorClass = String(o.colorClass).trim()
          return op
        })
        .filter((o) => o.value)
    }
    return row
  }).filter((f) => f.id && f.source && f.type)

  return { facets: list }
}

export function previewFiltersJson(useCustom, facets) {
  try {
    return JSON.stringify(serializeFiltersForApi(useCustom, facets) || { facets: [] }, null, 2)
  } catch {
    return '{}'
  }
}
