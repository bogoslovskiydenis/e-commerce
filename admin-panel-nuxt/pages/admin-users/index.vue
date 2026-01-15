<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Пользователи</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'admin-users-create' })"
        >
          Создать пользователя
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск пользователей..."
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.role"
              :items="roleOptions"
              label="Роль"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-checkbox
              v-model="filters.isActive"
              label="Активен"
              density="compact"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="users"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
            variant="flat"
          >
            {{ getRoleLabel(item.role) }}
          </v-chip>
        </template>

        <template v-slot:item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'error'"
            size="small"
            variant="flat"
          >
            {{ item.isActive ? 'Активен' : 'Заблокирован' }}
          </v-chip>
        </template>

        <template v-slot:item.twoFactorEnabled="{ item }">
          <v-chip
            :color="item.twoFactorEnabled ? 'success' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.twoFactorEnabled ? 'Включен' : 'Отключен' }}
          </v-chip>
        </template>

        <template v-slot:item.lastLogin="{ item }">
          {{ item.lastLogin ? formatDate(item.lastLogin) : 'Никогда' }}
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'admin-users-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'admin-users-edit-id', params: { id: item.id } })"
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
const users = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  role: null,
  isActive: null
})

const roleOptions = [
  { title: 'Администратор', value: 'SUPER_ADMIN' },
  { title: 'Администратор', value: 'ADMINISTRATOR' },
  { title: 'Менеджер', value: 'MANAGER' },
  { title: 'CRM Менеджер', value: 'CRM_MANAGER' }
]

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Логин', key: 'username', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Имя', key: 'firstName', sortable: true },
  { title: 'Фамилия', key: 'lastName', sortable: true },
  { title: 'Роль', key: 'role', sortable: true },
  { title: 'Статус', key: 'isActive', sortable: true },
  { title: '2FA', key: 'twoFactorEnabled', sortable: true },
  { title: 'Последний вход', key: 'lastLogin', sortable: true },
  { title: 'Создан', key: 'createdAt', sortable: true },
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

const getRoleColor = (role) => {
  const colors = {
    'SUPER_ADMIN': 'error',
    'ADMINISTRATOR': 'error',
    'MANAGER': 'warning',
    'CRM_MANAGER': 'info'
  }
  return colors[role] || 'default'
}

const getRoleLabel = (role) => {
  const labels = {
    'SUPER_ADMIN': 'Супер админ',
    'ADMINISTRATOR': 'Администратор',
    'MANAGER': 'Менеджер',
    'CRM_MANAGER': 'CRM Менеджер'
  }
  return labels[role] || role
}

const loadUsers = async () => {
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

    if (filters.role) params.role = filters.role
    if (filters.isActive !== null) params.isActive = filters.isActive

    const response = await api.getList('admin-users', params)
    users.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadUsers()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadUsers()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'admin-users-id', params: { id: row.item.id } })
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
  loadUsers()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadUsers()
})
</script>
