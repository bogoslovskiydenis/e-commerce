<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Акции и промокоды</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'promotions-create' })"
        >
          Создать промокод
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по названию, коду..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.type"
              :items="typeOptions"
              label="Тип"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.isActive"
              :items="statusOptions"
              label="Статус"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="promotions"
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

        <template v-slot:item.value="{ item }">
          {{ getValueDisplay(item) }}
        </template>

        <template v-slot:item.minOrderAmount="{ item }">
          <span v-if="item.minOrderAmount">
            {{ Number(item.minOrderAmount).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} грн
          </span>
          <span v-else>—</span>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item)"
            size="small"
            variant="flat"
          >
            {{ getStatusLabel(item) }}
          </v-chip>
        </template>

        <template v-slot:item.usage="{ item }">
          <v-chip
            :color="getUsageColor(item)"
            size="small"
            variant="flat"
          >
            {{ getUsageDisplay(item) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'promotions-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'promotions-edit-id', params: { id: item.id } })"
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
const promotions = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  type: null,
  isActive: null
})

const typeOptions = [
  { title: 'Процент', value: 'PERCENTAGE' },
  { title: 'Фиксированная сумма', value: 'FIXED_AMOUNT' },
  { title: 'Бесплатная доставка', value: 'FREE_SHIPPING' },
  { title: '1+1', value: 'BUY_ONE_GET_ONE' }
]

const statusOptions = [
  { title: 'Активные', value: 'true' },
  { title: 'Неактивные', value: 'false' }
]

const headers = [
  { title: 'Название', key: 'name', sortable: true },
  { title: 'Код', key: 'code', sortable: true },
  { title: 'Тип', key: 'type', sortable: true },
  { title: 'Значение', key: 'value', sortable: true },
  { title: 'Мин. сумма', key: 'minOrderAmount', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Использовано', key: 'usage', sortable: true },
  { title: 'Начало', key: 'startDate', sortable: true },
  { title: 'Окончание', key: 'endDate', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const getTypeColor = (type) => {
  const colors = {
    'PERCENTAGE': 'primary',
    'FIXED_AMOUNT': 'success',
    'FREE_SHIPPING': 'info',
    'BUY_ONE_GET_ONE': 'warning'
  }
  return colors[type] || 'default'
}

const getTypeLabel = (type) => {
  const labels = {
    'PERCENTAGE': 'Процент',
    'FIXED_AMOUNT': 'Фиксированная сумма',
    'FREE_SHIPPING': 'Бесплатная доставка',
    'BUY_ONE_GET_ONE': '1+1'
  }
  return labels[type] || type
}

const getValueDisplay = (item) => {
  if (item.type === 'PERCENTAGE') {
    return `${item.value}%`
  } else if (item.type === 'FIXED_AMOUNT') {
    return `${item.value} грн`
  } else {
    return '—'
  }
}

const getStatusColor = (item) => {
  const now = new Date()
  const isActive = item.isActive
  const startDate = item.startDate ? new Date(item.startDate) : null
  const endDate = item.endDate ? new Date(item.endDate) : null

  if (!isActive) return 'default'
  if (startDate && startDate > now) return 'info'
  if (endDate && endDate < now) return 'error'
  return 'success'
}

const getStatusLabel = (item) => {
  const now = new Date()
  const isActive = item.isActive
  const startDate = item.startDate ? new Date(item.startDate) : null
  const endDate = item.endDate ? new Date(item.endDate) : null

  if (!isActive) return 'Неактивна'
  if (startDate && startDate > now) return 'Запланирована'
  if (endDate && endDate < now) return 'Истекла'
  return 'Активна'
}

const getUsageColor = (item) => {
  const usedCount = item.usedCount || 0
  const maxUsage = item.maxUsage
  if (maxUsage && usedCount >= maxUsage) return 'error'
  return 'default'
}

const getUsageDisplay = (item) => {
  const usedCount = item.usedCount || 0
  const maxUsage = item.maxUsage
  if (maxUsage) {
    return `${usedCount} / ${maxUsage}`
  }
  return usedCount.toString()
}

const loadPromotions = async () => {
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

    if (filters.type) params.type = filters.type
    if (filters.isActive !== null) params.isActive = filters.isActive === 'true'

    const response = await api.getList('promotions', params)
    promotions.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки промокодов:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadPromotions()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadPromotions()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'promotions-edit-id', params: { id: row.item.id } })
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
  loadPromotions()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadPromotions()
})
</script>
