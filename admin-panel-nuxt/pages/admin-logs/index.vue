<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Логи действий администраторов</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по действию или пользователю"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.action"
              :items="actionOptions"
              label="Тип действия"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.level"
              :items="levelOptions"
              label="Уровень"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.resource"
              :items="resourceOptions"
              label="Ресурс"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="logs"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.timestamp="{ item }">
          {{ formatDate(item.timestamp) }}
        </template>

        <template v-slot:item.user="{ item }">
          <div style="display: flex; align-items: center; gap: 8px">
            <v-avatar size="24" style="font-size: 0.75rem">
              {{ (item.fullName || item.username || '').charAt(0) }}
            </v-avatar>
            <div>
              <div style="font-weight: 500">{{ item.fullName || item.username }}</div>
              <div class="text-caption text-grey">@{{ item.username }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.action="{ item }">
          <v-chip
            :color="getActionColor(item.action)"
            size="small"
            variant="flat"
          >
            {{ getActionLabel(item.action) }}
          </v-chip>
        </template>

        <template v-slot:item.level="{ item }">
          <v-chip
            :color="getLevelColor(item.level)"
            size="small"
            variant="flat"
          >
            {{ getLevelLabel(item.level) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'admin-logs-id', params: { id: item.id } })"
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
const logs = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 50
})

const filters = reactive({
  action: null,
  level: null,
  resource: null
})

const actionOptions = [
  { title: 'Вход', value: 'login' },
  { title: 'Выход', value: 'logout' },
  { title: 'Создание', value: 'create' },
  { title: 'Редактирование', value: 'edit' },
  { title: 'Удаление', value: 'delete' },
  { title: 'Просмотр', value: 'view' },
  { title: 'Безопасность', value: 'security' }
]

const levelOptions = [
  { title: 'Информация', value: 'info' },
  { title: 'Предупреждение', value: 'warning' },
  { title: 'Ошибка', value: 'error' },
  { title: 'Критично', value: 'critical' }
]

const resourceOptions = [
  { title: 'Товары', value: 'products' },
  { title: 'Заказы', value: 'orders' },
  { title: 'Пользователи', value: 'users' },
  { title: 'Категории', value: 'categories' },
  { title: 'Настройки', value: 'settings' },
  { title: 'Авторизация', value: 'auth' }
]

const headers = [
  { title: 'Время', key: 'timestamp', sortable: true },
  { title: 'Пользователь', key: 'user', sortable: false },
  { title: 'Действие', key: 'action', sortable: true },
  { title: 'Ресурс', key: 'resource', sortable: true },
  { title: 'Описание', key: 'description', sortable: false },
  { title: 'Уровень', key: 'level', sortable: true },
  { title: 'IP', key: 'ip', sortable: true },
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

const getActionColor = (action) => {
  const colors = {
    'login': 'success',
    'logout': 'info',
    'create': 'primary',
    'edit': 'warning',
    'delete': 'error',
    'view': 'default',
    'security': 'error'
  }
  return colors[action] || 'default'
}

const getActionLabel = (action) => {
  const labels = {
    'login': 'Вход',
    'logout': 'Выход',
    'create': 'Создание',
    'edit': 'Редактирование',
    'delete': 'Удаление',
    'view': 'Просмотр',
    'security': 'Безопасность'
  }
  return labels[action] || action
}

const getLevelColor = (level) => {
  const colors = {
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
    'critical': 'error'
  }
  return colors[level] || 'default'
}

const getLevelLabel = (level) => {
  const labels = {
    'info': 'Инфо',
    'warning': 'Предупреждение',
    'error': 'Ошибка',
    'critical': 'Критично'
  }
  return labels[level] || level
}

const loadLogs = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'timestamp',
      sortOrder: 'desc'
    }

    if (search.value) {
      params.search = search.value
    }

    if (filters.action) params.action = filters.action
    if (filters.level) params.level = filters.level
    if (filters.resource) params.resource = filters.resource

    const response = await api.getList('admin-logs', params)
    logs.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки логов:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadLogs()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadLogs()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'admin-logs-id', params: { id: row.item.id } })
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
  loadLogs()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadLogs()
})
</script>
