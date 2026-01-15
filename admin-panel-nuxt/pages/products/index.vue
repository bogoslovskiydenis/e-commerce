<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Товары</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'products-create' })"
        >
          Создать товар
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по названию, артикулу, бренду..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.sku"
              label="Артикул (SKU)"
              variant="outlined"
              density="compact"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.categoryId"
              :items="categories"
              item-title="name"
              item-value="id"
              label="Категория"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="filters.brand"
              label="Бренд"
              variant="outlined"
              density="compact"
              clearable
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3">
            <v-checkbox
              v-model="filters.isActive"
              label="Только активные"
              density="compact"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="products"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.sku="{ item }">
          <span v-if="item.sku" class="text-monospace" style="background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.875rem">
            {{ item.sku }}
          </span>
          <span v-else style="color: #999; font-style: italic">Не указан</span>
        </template>

        <template v-slot:item.images="{ item }">
          <v-img
            v-if="item.images && item.images.length > 0"
            :src="getImageUrl(item.images[0])"
            width="50"
            height="50"
            cover
            style="border-radius: 4px"
          ></v-img>
          <span v-else style="color: #999">Нет изображения</span>
        </template>

        <template v-slot:item.price="{ item }">
          {{ Number(item.price).toFixed(2) }} грн
        </template>

        <template v-slot:item.oldPrice="{ item }">
          <span v-if="item.oldPrice">{{ Number(item.oldPrice).toFixed(2) }} грн</span>
          <span v-else>—</span>
        </template>

        <template v-slot:item.discount="{ item }">
          <v-chip
            v-if="item.discount"
            color="error"
            size="small"
            variant="flat"
          >
            -{{ item.discount }}%
          </v-chip>
          <span v-else>—</span>
        </template>

        <template v-slot:item.category="{ item }">
          {{ item.category?.name || '-' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'products-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'products-edit-id', params: { id: item.id } })"
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
const products = ref([])
const categories = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 10
})

const filters = reactive({
  sku: null,
  categoryId: null,
  brand: null,
  isActive: null
})

const headers = [
  { title: 'Артикул', key: 'sku', sortable: true },
  { title: 'Фото', key: 'images', sortable: false },
  { title: 'Название', key: 'title', sortable: true },
  { title: 'Бренд', key: 'brand', sortable: true },
  { title: 'Цена', key: 'price', sortable: true },
  { title: 'Старая цена', key: 'oldPrice', sortable: true },
  { title: 'Скидка', key: 'discount', sortable: true },
  { title: 'Категория', key: 'category', sortable: false },
  { title: 'Активен', key: 'isActive', sortable: true },
  { title: 'В наличии', key: 'inStock', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

const loadCategories = async () => {
  try {
    const response = await api.getList('categories', { limit: 100 })
    categories.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  }
}

const loadProducts = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    if (search.value) {
      params.search = search.value
    }

    if (filters.sku) params.sku = filters.sku
    if (filters.categoryId) params.categoryId = filters.categoryId
    if (filters.brand) params.brand = filters.brand
    if (filters.isActive !== null) params.isActive = filters.isActive

    const response = await api.getList('products', params)
    products.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadProducts()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadProducts()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'products-edit-id', params: { id: row.item.id } })
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
  loadProducts()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>
