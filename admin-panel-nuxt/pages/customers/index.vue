<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Клиенты</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по имени, email, телефону"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="customers"
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

        <template v-slot:item.address="{ item }">
          <div style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical">
            {{ item.address || '-' }}
          </div>
        </template>

        <template v-slot:item.tags="{ item }">
          <div style="display: flex; gap: 4px; flex-wrap: wrap">
            <v-chip
              v-for="(tag, index) in (item.tags || []).slice(0, 3)"
              :key="index"
              size="small"
              variant="outlined"
            >
              {{ tag }}
            </v-chip>
          </div>
        </template>

        <template v-slot:item.stats="{ item }">
          <div>
            <div>Заказов: {{ item._count?.orders || 0 }}</div>
            <div class="text-caption text-grey">Отзывов: {{ item._count?.reviews || 0 }}</div>
          </div>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'customers-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'customers-edit-id', params: { id: item.id } })"
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
const customers = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const headers = [
  { title: 'Дата регистрации', key: 'createdAt', sortable: true },
  { title: 'Имя', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Телефон', key: 'phone', sortable: true },
  { title: 'Адрес', key: 'address', sortable: false },
  { title: 'Теги', key: 'tags', sortable: false },
  { title: 'Статистика', key: 'stats', sortable: false },
  { title: 'Активен', key: 'isActive', sortable: true },
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

const loadCustomers = async () => {
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

    const response = await api.getList('customers', params)
    customers.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки клиентов:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadCustomers()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadCustomers()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'customers-edit-id', params: { id: row.item.id } })
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
  loadCustomers()
}, 500)

watch(search, () => {
  debouncedSearch()
})

onMounted(() => {
  loadCustomers()
})
</script>
