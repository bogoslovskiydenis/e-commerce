<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Заказы</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'orders-create' })"
        >
          Создать заказ
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск"
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
              v-model="filters.paymentMethod"
              :items="paymentMethods"
              label="Способ оплаты"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="orders"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.orderNumber="{ item }">
          <strong>#{{ item.orderNumber }}</strong>
        </template>

        <template v-slot:item.date="{ item }">
          {{ formatDate(item.date || item.createdAt) }}
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

        <template v-slot:item.paymentStatus="{ item }">
          <v-chip
            :color="getPaymentStatusColor(item.paymentStatus)"
            size="small"
            variant="flat"
          >
            {{ getPaymentStatusLabel(item.paymentStatus) }}
          </v-chip>
        </template>

        <template v-slot:item.total="{ item }">
          {{ item.total || item.totalAmount }} {{ item.currency || 'грн' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'orders-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'orders-edit-id', params: { id: item.id } })"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const loading = ref(false)
const orders = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  status: null,
  paymentMethod: null
})

const statusOptions = [
  { title: 'Новый', value: 'new' },
  { title: 'Обрабатывается', value: 'processing' },
  { title: 'Отправлен', value: 'shipped' },
  { title: 'Доставлен', value: 'delivered' },
  { title: 'Отменен', value: 'cancelled' }
]

const paymentMethods = [
  { title: 'Monobank', value: 'monobank' },
  { title: 'Приват24', value: 'privat24' },
  { title: 'Наличными', value: 'cash' },
  { title: 'Картой при получении', value: 'card' }
]

const headers = [
  { title: '№ заказа', key: 'orderNumber', sortable: true },
  { title: 'Дата', key: 'date', sortable: true },
  { title: 'Клиент', key: 'customer.name', sortable: true },
  { title: 'Телефон', key: 'customer.phone' },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Оплата', key: 'paymentStatus' },
  { title: 'Сумма', key: 'total', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const loadOrders = async () => {
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

    if (filters.status) {
      params.status = filters.status
    }

    if (filters.paymentMethod) {
      params.paymentMethod = filters.paymentMethod
    }

    const response = await api.getList('orders', params)
    orders.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки заказов:', error)
  } finally {
    loading.value = false
  }
}


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
    'new': 'warning',
    'processing': 'info',
    'shipped': 'purple',
    'delivered': 'success',
    'cancelled': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    'new': 'Новый',
    'processing': 'Обрабатывается',
    'shipped': 'Отправлен',
    'delivered': 'Доставлен',
    'cancelled': 'Отменен'
  }
  return labels[status] || status
}

const getPaymentStatusColor = (status) => {
  const colors = {
    'pending': 'warning',
    'paid': 'success',
    'failed': 'error',
    'refunded': 'purple'
  }
  return colors[status] || 'grey'
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    'pending': 'Ожидает оплаты',
    'paid': 'Оплачен',
    'failed': 'Ошибка оплаты',
    'refunded': 'Возврат'
  }
  return labels[status] || status
}

const handlePageChange = (page) => {
  pagination.page = page
  loadOrders()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadOrders()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'orders-edit-id', params: { id: row.item.id } })
}

const debouncedSearch = debounce(() => {
  pagination.page = 1
  loadOrders()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadOrders()
})
</script>
