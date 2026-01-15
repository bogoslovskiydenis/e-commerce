<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Категории</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'categories-create' })"
        >
          Создать категорию
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по названию категории..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-checkbox
              v-model="filters.active"
              label="Только активные"
              density="compact"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3">
            <v-checkbox
              v-model="filters.showInNavigation"
              label="В навигации"
              density="compact"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.type"
              :items="typeOptions"
              label="Тип категории"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="categories"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.type="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            size="small"
            variant="flat"
          >
            {{ getTypeLabel(item.type) }}
          </v-chip>
        </template>

        <template v-slot:item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.isActive ? 'Активна' : 'Неактивна' }}
          </v-chip>
        </template>

        <template v-slot:item.showInNavigation="{ item }">
          <v-chip
            :color="item.showInNavigation ? 'info' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.showInNavigation ? 'Да' : 'Нет' }}
          </v-chip>
        </template>

        <template v-slot:item.parent="{ item }">
          {{ item.parent?.name || '-' }}
        </template>

        <template v-slot:item.productsCount="{ item }">
          {{ item.productsCount || item._count?.products || 0 }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'categories-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'categories-edit-id', params: { id: item.id } })"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const loading = ref(false)
const categories = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  active: null,
  showInNavigation: null,
  type: null
})

const typeOptions = [
  { title: 'Товары', value: 'products' },
  { title: 'Шарики', value: 'balloons' },
  { title: 'Букеты', value: 'bouquets' },
  { title: 'Подарки', value: 'gifts' },
  { title: 'Стаканчики', value: 'cups' },
  { title: 'Наборы', value: 'sets' },
  { title: 'События', value: 'events' },
  { title: 'Цвета', value: 'colors' },
  { title: 'Материалы', value: 'materials' },
  { title: 'Поводы', value: 'occasions' }
]

const headers = [
  { title: 'Название', key: 'name', sortable: true },
  { title: 'Тип', key: 'type', sortable: true },
  { title: 'Активна', key: 'isActive', sortable: true },
  { title: 'В навигации', key: 'showInNavigation', sortable: true },
  { title: 'Родитель', key: 'parent', sortable: false },
  { title: 'Товаров', key: 'productsCount', sortable: false },
  { title: 'Порядок', key: 'sortOrder', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const getTypeColor = (type) => {
  return 'primary'
}

const getTypeLabel = (type) => {
  const labels = {
    'products': 'Товары',
    'balloons': 'Шарики',
    'bouquets': 'Букеты',
    'gifts': 'Подарки',
    'cups': 'Стаканчики',
    'sets': 'Наборы',
    'events': 'События',
    'colors': 'Цвета',
    'materials': 'Материалы',
    'occasions': 'Поводы',
    'PRODUCTS': 'Товары',
    'BALLOONS': 'Шарики',
    'BOUQUETS': 'Букеты',
    'GIFTS': 'Подарки',
    'CUPS': 'Стаканчики',
    'SETS': 'Наборы',
    'EVENTS': 'События',
    'COLORS': 'Цвета',
    'MATERIALS': 'Материалы',
    'OCCASIONS': 'Поводы'
  }
  return labels[type] || type
}

const loadCategories = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'sortOrder',
      sortOrder: 'asc'
    }

    if (search.value) {
      params.search = search.value
    }

    if (filters.active !== null) params.active = filters.active
    if (filters.showInNavigation !== null) params.showInNavigation = filters.showInNavigation
    if (filters.type) params.type = filters.type

    const response = await api.getList('categories', params)
    categories.value = response.data.map(cat => ({
      ...cat,
      active: cat.isActive,
      order: cat.sortOrder
    }))
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadCategories()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadCategories()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'categories-edit-id', params: { id: row.item.id } })
}

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const debouncedSearch = debounce(() => {
  pagination.page = 1
  loadCategories()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadCategories()
})
</script>
