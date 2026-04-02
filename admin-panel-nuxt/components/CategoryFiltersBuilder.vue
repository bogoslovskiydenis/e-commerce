<template>
  <div>
    <v-switch
      v-model="local.useCustom"
      color="primary"
      hide-details
      class="mb-2"
      label="Свои фильтры витрины (если выкл. — на сайте подставятся дефолты по типу категории)"
    />
    <v-alert v-if="!local.useCustom" type="info" variant="tonal" density="compact" class="mb-4">
      Поле <code>filters</code> в БД не задаётся. Витрина берёт набор фильтров из кода по типу категории.
    </v-alert>

    <div v-else>
      <div class="d-flex flex-wrap gap-2 mb-4">
        <v-btn size="small" variant="tonal" prepend-icon="mdi-plus" @click="addFacet">
          Добавить фильтр
        </v-btn>
        <v-btn size="small" variant="outlined" prepend-icon="mdi-content-copy" @click="addPresetBasic">
          Шаблон: цена + наличие
        </v-btn>
        <v-btn size="small" variant="outlined" prepend-icon="mdi-chip" @click="addPresetTech">
          Шаблон: техника (цена, бренд, наличие)
        </v-btn>
        <v-btn size="small" variant="text" prepend-icon="mdi-delete-sweep" @click="clearAll">
          Очистить список
        </v-btn>
      </div>

      <v-card
        v-for="(facet, fi) in local.facets"
        :key="fi"
        variant="outlined"
        class="mb-4"
      >
        <v-card-title class="d-flex align-center justify-space-between py-2 text-subtitle-1">
          <span>Фильтр {{ fi + 1 }}</span>
          <v-btn icon="mdi-close" size="small" variant="text" @click="removeFacet(fi)" />
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="facet.id"
                label="ID (латиница)"
                variant="outlined"
                density="compact"
                hint="price, colors, inStock…"
                persistent-hint
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="facet.source"
                :items="sourceItems"
                item-title="title"
                item-value="value"
                label="Поле товара"
                variant="outlined"
                density="compact"
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="facet.type"
                :items="typeItems"
                item-title="title"
                item-value="value"
                label="Тип"
                variant="outlined"
                density="compact"
              />
            </v-col>
          </v-row>
          <v-row dense class="mt-2">
            <v-col cols="12" md="4">
              <v-text-field v-model="facet.labelUk" label="Заголовок (UK)" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="facet.labelRu" label="Заголовок (RU)" variant="outlined" density="compact" />
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field v-model="facet.labelEn" label="Заголовок (EN)" variant="outlined" density="compact" />
            </v-col>
          </v-row>

          <div v-if="facet.type === 'multi'" class="mt-4">
            <div class="text-subtitle-2 mb-2">Варианты</div>
            <v-btn size="small" class="mb-2" prepend-icon="mdi-plus" variant="tonal" @click="addOption(facet)">
              Добавить вариант
            </v-btn>
            <v-table v-if="facet.options?.length" density="compact" class="border rounded">
              <thead>
                <tr>
                  <th>Value</th>
                  <th>Подписи UK / RU / EN</th>
                  <th>Совпадения в данных (через запятую)</th>
                  <th>Класс цвета</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(opt, oi) in facet.options" :key="oi">
                  <td style="min-width: 100px">
                    <v-text-field v-model="opt.value" density="compact" variant="underlined" hide-details />
                  </td>
                  <td>
                    <v-text-field v-model="opt.labelUk" density="compact" variant="underlined" hide-details placeholder="UK" class="mb-1" />
                    <v-text-field v-model="opt.labelRu" density="compact" variant="underlined" hide-details placeholder="RU" class="mb-1" />
                    <v-text-field v-model="opt.labelEn" density="compact" variant="underlined" hide-details placeholder="EN" />
                  </td>
                  <td style="min-width: 200px">
                    <v-textarea
                      v-model="opt._matchStr"
                      rows="2"
                      density="compact"
                      variant="outlined"
                      hide-details
                      placeholder="Красный, Червоний, red"
                    />
                  </td>
                  <td style="width: 130px">
                    <v-text-field
                      v-model="opt.colorClass"
                      density="compact"
                      variant="underlined"
                      hide-details
                      placeholder="bg-red-500"
                    />
                  </td>
                  <td>
                    <v-btn icon="mdi-delete" size="small" variant="text" @click="removeOption(facet, oi)" />
                  </td>
                </tr>
              </tbody>
            </v-table>
            <p v-else class="text-caption text-medium-emphasis">Добавьте варианты — иначе фильтр на сайте будет пустым.</p>
          </div>
        </v-card-text>
      </v-card>

      <v-expansion-panels variant="accordion" class="mb-2">
        <v-expansion-panel title="Просмотр JSON" elevation="0">
          <v-expansion-panel-text>
            <v-textarea
              :model-value="previewJson"
              readonly
              variant="outlined"
              rows="10"
              class="font-monospace text-caption"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import { previewFiltersJson } from '~/composables/useCategoryFiltersForm'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ useCustom: false, facets: [] })
  }
})

const emit = defineEmits(['update:modelValue'])

const local = reactive({
  useCustom: props.modelValue?.useCustom ?? false,
  facets: normalizeFacets(props.modelValue?.facets || [])
})

function normalizeFacets(list) {
  return (list || []).map((f) => ({
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
      _matchStr: Array.isArray(o.match) ? o.match.join(', ') : (o._matchStr || '')
    }))
  }))
}

function applyProps(v) {
  if (!v) return
  local.useCustom = v.useCustom ?? false
  local.facets = normalizeFacets(v.facets || [])
}

onMounted(() => applyProps(props.modelValue))

function emitUpdate() {
  emit('update:modelValue', {
    useCustom: local.useCustom,
    facets: JSON.parse(JSON.stringify(local.facets))
  })
}

watch(local, () => emitUpdate(), { deep: true })

const sourceItems = [
  { title: 'Цена (price)', value: 'price' },
  { title: 'Цвета (colors)', value: 'colors' },
  { title: 'Материал (material)', value: 'material' },
  { title: 'Бренд (brand)', value: 'brand' },
  { title: 'В наличии (inStock)', value: 'inStock' },
  { title: 'С гелием (withHelium)', value: 'withHelium' },
  { title: 'Размер / объём в строке (size)', value: 'size' },
  { title: 'Тип подарка (giftType)', value: 'giftType' }
]

const typeItems = [
  { title: 'Диапазон (цена от — до)', value: 'range' },
  { title: 'Несколько значений (чекбоксы)', value: 'multi' },
  { title: 'Да / нет', value: 'boolean' }
]

function addFacet() {
  local.facets.push({
    id: '',
    source: 'colors',
    type: 'multi',
    labelUk: '',
    labelRu: '',
    labelEn: '',
    options: []
  })
}

function removeFacet(i) {
  local.facets.splice(i, 1)
}

function addOption(facet) {
  if (!facet.options) facet.options = []
  facet.options.push({
    value: '',
    labelUk: '',
    labelRu: '',
    labelEn: '',
    colorClass: '',
    _matchStr: ''
  })
}

function removeOption(facet, oi) {
  facet.options.splice(oi, 1)
}

function clearAll() {
  local.facets = []
}

function addPresetBasic() {
  local.useCustom = true
  local.facets.push(
    {
      id: 'price',
      source: 'price',
      type: 'range',
      labelUk: 'Ціна',
      labelRu: 'Цена',
      labelEn: 'Price',
      options: []
    },
    {
      id: 'inStock',
      source: 'inStock',
      type: 'boolean',
      labelUk: 'Лише в наявності',
      labelRu: 'Только в наличии',
      labelEn: 'In stock only',
      options: []
    }
  )
}

function addPresetTech() {
  local.useCustom = true
  local.facets.push(
    {
      id: 'price',
      source: 'price',
      type: 'range',
      labelUk: 'Ціна',
      labelRu: 'Цена',
      labelEn: 'Price',
      options: []
    },
    {
      id: 'brand',
      source: 'brand',
      type: 'multi',
      labelUk: 'Бренд',
      labelRu: 'Бренд',
      labelEn: 'Brand',
      options: []
    },
    {
      id: 'inStock',
      source: 'inStock',
      type: 'boolean',
      labelUk: 'Лише в наявності',
      labelRu: 'Только в наличии',
      labelEn: 'In stock only',
      options: []
    }
  )
}

const previewJson = computed(() => previewFiltersJson(local.useCustom, local.facets))
</script>
