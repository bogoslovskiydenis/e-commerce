<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Обратные звонки</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по имени, телефону, email"
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
              v-model="filters.priority"
              :items="priorityOptions"
              label="Приоритет"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="callbacks"
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

        <template v-slot:item.message="{ item }">
          <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
            {{ item.message || '-' }}
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

        <template v-slot:item.priority="{ item }">
          <v-chip
            :color="getPriorityColor(item.priority)"
            size="small"
            variant="flat"
          >
            {{ getPriorityLabel(item.priority) }}
          </v-chip>
        </template>

        <template v-slot:item.manager="{ item }">
          {{ item.manager?.fullName || item.manager?.username || '-' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'callbacks-edit-id', params: { id: item.id } })"
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
const callbacks = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  status: null,
  priority: null
})

const statusOptions = [
  { title: 'Новый', value: 'NEW' },
  { title: 'В работе', value: 'IN_PROGRESS' },
  { title: 'Завершен', value: 'COMPLETED' },
  { title: 'Отменен', value: 'CANCELLED' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'LOW' },
  { title: 'Средний', value: 'MEDIUM' },
  { title: 'Высокий', value: 'HIGH' },
  { title: 'Срочный', value: 'URGENT' }
]

const headers = [
  { title: 'Дата', key: 'createdAt', sortable: true },
  { title: 'Имя', key: 'name', sortable: true },
  { title: 'Телефон', key: 'phone', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Сообщение', key: 'message', sortable: false },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Приоритет', key: 'priority', sortable: true },
  { title: 'Менеджер', key: 'manager', sortable: false },
  { title: 'Источник', key: 'source', sortable: true },
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
    'NEW': 'warning',
    'IN_PROGRESS': 'info',
    'COMPLETED': 'success',
    'CANCELLED': 'error'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    'NEW': 'Новый',
    'IN_PROGRESS': 'В работе',
    'COMPLETED': 'Завершен',
    'CANCELLED': 'Отменен'
  }
  return labels[status] || status
}

const getPriorityColor = (priority) => {
  const colors = {
    'LOW': 'default',
    'MEDIUM': 'info',
    'HIGH': 'warning',
    'URGENT': 'error'
  }
  return colors[priority] || 'default'
}

const getPriorityLabel = (priority) => {
  const labels = {
    'LOW': 'Низкий',
    'MEDIUM': 'Средний',
    'HIGH': 'Высокий',
    'URGENT': 'Срочный'
  }
  return labels[priority] || priority
}

const loadCallbacks = async () => {
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
    if (filters.priority) params.priority = filters.priority

    const response = await api.getList('callbacks', params)
    callbacks.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки обратных звонков:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadCallbacks()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadCallbacks()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'callbacks-edit-id', params: { id: row.item.id } })
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
  loadCallbacks()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadCallbacks()
})
</script>
