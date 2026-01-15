<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Отзывы</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'reviews-create' })"
        >
          Создать отзыв
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по имени, email, комментарию"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Статус"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.rating"
              :items="ratingOptions"
              label="Рейтинг"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="reviews"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.product="{ item }">
          {{ item.product?.title || '-' }}
        </template>

        <template v-slot:item.rating="{ item }">
          <span style="color: #ffa500; font-size: 1.2rem">
            {{ '★'.repeat(item.rating || 0) }}{{ '☆'.repeat(5 - (item.rating || 0)) }}
          </span>
        </template>

        <template v-slot:item.comment="{ item }">
          <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">
            {{ item.comment || '-' }}
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'reviews-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'reviews-edit-id', params: { id: item.id } })"
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
const reviews = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  status: null,
  rating: null
})

const statusOptions = [
  { title: 'На модерации', value: 'PENDING' },
  { title: 'Одобрен', value: 'APPROVED' },
  { title: 'Отклонен', value: 'REJECTED' }
]

const ratingOptions = [
  { title: '5 звезд', value: '5' },
  { title: '4 звезды', value: '4' },
  { title: '3 звезды', value: '3' },
  { title: '2 звезды', value: '2' },
  { title: '1 звезда', value: '1' }
]

const headers = [
  { title: 'Дата', key: 'createdAt', sortable: true },
  { title: 'Имя', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Товар', key: 'product', sortable: false },
  { title: 'Рейтинг', key: 'rating', sortable: true },
  { title: 'Комментарий', key: 'comment', sortable: false },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const formatDate = (date) => {
  if (!date) return 'Не указана'
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status) => {
  const colors = {
    'PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'На модерации',
    'APPROVED': 'Одобрен',
    'REJECTED': 'Отклонен'
  }
  return labels[status] || status
}

const loadReviews = async () => {
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

    if (filters.status) params.status = filters.status
    if (filters.rating) params.rating = filters.rating

    const response = await api.getList('reviews', params)
    reviews.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки отзывов:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadReviews()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadReviews()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'reviews-id', params: { id: row.item.id } })
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
  loadReviews()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadReviews()
})
</script>
