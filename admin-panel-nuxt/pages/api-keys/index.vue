<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">API ключи</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'api-keys-create' })"
        >
          Создать API ключ
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="apiKeys"
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

        <template v-slot:item.key="{ item }">
          <div style="display: flex; align-items: center; gap: 8px">
            <span class="text-monospace" style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; font-size: 0.875rem">
              {{ showKeys[item.id] ? item.key : getMaskedKey(item.key) }}
            </span>
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click.stop="toggleKey(item.id)"
            >
              <v-icon>{{ showKeys[item.id] ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
            </v-btn>
            <v-btn
              icon
              size="x-small"
              variant="text"
              @click.stop="copyKey(item.key)"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </div>
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

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'api-keys-edit-id', params: { id: item.id } })"
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
const apiKeys = ref([])
const total = ref(0)
const showKeys = ref({})

const pagination = reactive({
  page: 1,
  perPage: 25
})

const headers = [
  { title: 'Название', key: 'name', sortable: true },
  { title: 'Тип', key: 'type', sortable: true },
  { title: 'Ключ', key: 'key', sortable: false },
  { title: 'Лимит запросов/час', key: 'rateLimit', sortable: true },
  { title: 'Использований', key: 'usageCount', sortable: true },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Создан', key: 'createdAt', sortable: true },
  { title: 'Истекает', key: 'expiresAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const getTypeColor = (type) => {
  const colors = {
    'public': 'info',
    'private': 'warning',
    'webhook': 'success',
    'integration': 'primary'
  }
  return colors[type] || 'default'
}

const getTypeLabel = (type) => {
  const labels = {
    'public': 'Публичный',
    'private': 'Приватный',
    'webhook': 'Webhook',
    'integration': 'Интеграция'
  }
  return labels[type] || type
}

const getMaskedKey = (key) => {
  if (!key) return ''
  return `${key.substring(0, 8)}${'*'.repeat(24)}${key.substring(key.length - 4)}`
}

const getStatusColor = (item) => {
  const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date()
  const isActive = item.active && !isExpired
  return isActive ? 'success' : 'error'
}

const getStatusLabel = (item) => {
  const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date()
  const isActive = item.active && !isExpired
  if (isActive) return 'Активен'
  if (isExpired) return 'Истёк'
  return 'Отключен'
}

const toggleKey = (id) => {
  showKeys.value[id] = !showKeys.value[id]
}

const copyKey = async (key) => {
  try {
    await navigator.clipboard.writeText(key)
    // Можно добавить уведомление
  } catch (error) {
    console.error('Ошибка копирования:', error)
  }
}

const loadApiKeys = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    const response = await api.getList('api-keys', params)
    apiKeys.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки API ключей:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadApiKeys()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadApiKeys()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'api-keys-edit-id', params: { id: row.item.id } })
}

onMounted(() => {
  loadApiKeys()
})
</script>
