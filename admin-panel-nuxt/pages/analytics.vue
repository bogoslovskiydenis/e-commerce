<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Аналитика</h1>
      </v-col>
    </v-row>

    <!-- Фильтры периода -->
    <v-card class="mb-6">
      <v-card-title class="pb-2">Фильтры</v-card-title>
      <v-card-text class="pt-0">
        <v-row align="center" class="ma-0">
          <v-col cols="12" sm="6" md="3" class="pa-2">
            <v-select
              v-model="selectedPeriod"
              :items="periodOptions"
              label="Период"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="loadData"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="pa-2">
            <v-text-field
              v-model="dateFrom"
              type="date"
              label="Дата от"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="loadData"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="pa-2">
            <v-text-field
              v-model="dateTo"
              type="date"
              label="Дата до"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="loadData"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3" class="pa-2 d-flex align-center">
            <v-btn
              color="primary"
              prepend-icon="mdi-refresh"
              @click="loadData"
              :loading="loading"
              block
            >
              Обновить
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Карточки метрик -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card height="100%">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="flex-grow-1">
                <div class="text-caption text-grey mb-1">Всего заказов</div>
                <div class="text-h5 font-weight-bold mb-1">{{ dashboardStats.orders?.total || 0 }}</div>
                <div v-if="dashboardStats.orders?.new" class="text-caption text-success">
                  <v-icon size="14" class="mr-1">mdi-arrow-up</v-icon>
                  +{{ dashboardStats.orders.new }} новых
                </div>
              </div>
              <v-avatar color="primary" size="56">
                <v-icon color="white" size="28">mdi-cart</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card height="100%">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="flex-grow-1">
                <div class="text-caption text-grey mb-1">Завершено</div>
                <div class="text-h5 font-weight-bold mb-1">{{ dashboardStats.orders?.completed || 0 }}</div>
                <div class="text-caption text-grey">
                  {{ dashboardStats.orders?.total ? 
                    Math.round((dashboardStats.orders.completed / dashboardStats.orders.total) * 100) : 0 }}% от всех
                </div>
              </div>
              <v-avatar color="success" size="56">
                <v-icon color="white" size="28">mdi-check-circle</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card height="100%">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="flex-grow-1">
                <div class="text-caption text-grey mb-1">Выручка</div>
                <div class="text-h5 font-weight-bold mb-1">
                  {{ formatCurrency(dashboardStats.revenue?.total || 0) }}
                </div>
                <div class="text-caption text-grey">
                  Средний чек: {{ formatCurrency(dashboardStats.revenue?.averageOrderValue || 0) }}
                </div>
              </div>
              <v-avatar color="info" size="56">
                <v-icon color="white" size="28">mdi-currency-usd</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card height="100%">
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <div class="flex-grow-1">
                <div class="text-caption text-grey mb-1">Клиентов</div>
                <div class="text-h5 font-weight-bold mb-1">{{ dashboardStats.customers?.total || 0 }}</div>
                <div v-if="dashboardStats.customers?.new" class="text-caption text-success">
                  <v-icon size="14" class="mr-1">mdi-arrow-up</v-icon>
                  +{{ dashboardStats.customers.new }} новых
                </div>
              </div>
              <v-avatar color="warning" size="56">
                <v-icon color="white" size="28">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- График продаж и статистика по статусам -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card height="100%">
          <v-card-title class="pb-2">
            <v-icon start>mdi-chart-line</v-icon>
            Динамика продаж
          </v-card-title>
          <v-card-text class="pt-2">
            <div v-if="revenueData.length === 0" class="text-center py-12 text-grey">
              <v-icon size="48" class="mb-2">mdi-chart-line-variant</v-icon>
              <div>Нет данных за выбранный период</div>
            </div>
            <div v-else class="revenue-chart">
              <div
                v-for="(item, index) in revenueData"
                :key="index"
                class="d-flex align-center mb-3"
              >
                <div class="text-caption text-grey" style="width: 110px; flex-shrink: 0">
                  {{ formatDate(item.date) }}
                </div>
                <div class="flex-grow-1 mx-3">
                  <v-progress-linear
                    :model-value="(item.revenue / maxRevenue) * 100"
                    color="primary"
                    height="24"
                    rounded
                    class="mb-1"
                  >
                    <template v-slot:default="{ value }">
                      <span class="text-caption font-weight-medium text-white">
                        {{ formatCurrency(item.revenue) }}
                      </span>
                    </template>
                  </v-progress-linear>
                </div>
                <div class="text-caption text-grey" style="width: 80px; text-align: right; flex-shrink: 0">
                  {{ item.orders }} зак.
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card height="100%">
          <v-card-title class="pb-2">
            <v-icon start>mdi-chart-pie</v-icon>
            Статусы заказов
          </v-card-title>
          <v-card-text class="pt-2">
            <div v-if="!dashboardStats.orders?.byStatus?.length" class="text-center py-12 text-grey">
              <v-icon size="48" class="mb-2">mdi-chart-pie</v-icon>
              <div>Нет данных</div>
            </div>
            <div v-else>
              <div
                v-for="(status, index) in dashboardStats.orders.byStatus"
                :key="index"
                class="d-flex align-center justify-space-between mb-3 pa-2 rounded"
                :style="{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }"
              >
                <div class="flex-grow-1">
                  <v-chip 
                    size="small" 
                    :color="getStatusColor(status.status)"
                    class="mb-1"
                  >
                    {{ getStatusLabel(status.status) }}
                  </v-chip>
                  <div class="text-caption text-grey mt-1">{{ status.count }} заказов</div>
                </div>
                <div class="text-h6 font-weight-bold ml-3">
                  {{ status.count }}
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Популярные товары и топ клиентов -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card height="100%">
          <v-card-title class="pb-2">
            <v-icon start>mdi-star</v-icon>
            Популярные товары
            <v-spacer></v-spacer>
            <v-select
              v-model="productsSortBy"
              :items="productsSortOptions"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 160px"
              @update:model-value="loadProductsAnalytics"
            ></v-select>
          </v-card-title>
          <v-card-text class="pt-2">
            <div v-if="loadingProducts" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="productsData.length === 0" class="text-center py-12 text-grey">
              <v-icon size="48" class="mb-2">mdi-package-variant</v-icon>
              <div>Нет данных</div>
            </div>
            <v-list v-else class="pa-0">
              <v-list-item
                v-for="(product, index) in productsData"
                :key="index"
                class="pa-3 mb-2 rounded"
                :style="{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }"
              >
                <template v-slot:prepend>
                  <v-avatar
                    :image="getProductImageUrl(product.productImage)"
                    color="grey-lighten-2"
                    size="64"
                    rounded
                    class="mr-3"
                  >
                    <v-icon v-if="!product.productImage" size="32">mdi-package-variant</v-icon>
                  </v-avatar>
                </template>
                <div class="flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <v-list-item-title class="font-weight-medium text-body-1">
                      {{ product.productTitle }}
                    </v-list-item-title>
                    <v-chip 
                      v-if="product.rating > 0" 
                      size="x-small" 
                      color="warning" 
                      variant="flat"
                      class="ml-2"
                    >
                      <v-icon size="12" class="mr-1">mdi-star</v-icon>
                      {{ product.rating.toFixed(1) }}
                    </v-chip>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2 mb-1">
                    <span class="text-caption text-grey">
                      <v-icon size="14" class="mr-1">mdi-package-variant-closed</v-icon>
                      Продано: <strong>{{ product.sales }}</strong> шт.
                    </span>
                    <span class="text-caption text-grey">
                      <v-icon size="14" class="mr-1">mdi-cart</v-icon>
                      <strong>{{ product.orders }}</strong> {{ product.orders === 1 ? 'заказ' : 'заказов' }}
                    </span>
                    <span class="text-caption text-grey" v-if="product.reviewsCount > 0">
                      <v-icon size="14" class="mr-1">mdi-comment-text</v-icon>
                      <strong>{{ product.reviewsCount }}</strong> {{ product.reviewsCount === 1 ? 'отзыв' : 'отзывов' }}
                    </span>
                  </div>
                  <div class="text-caption text-grey">
                    Средняя цена: <strong>{{ formatCurrency(product.averagePrice) }}</strong>
                  </div>
                </div>
                <template v-slot:append>
                  <div class="text-right ml-4">
                    <div class="text-h6 font-weight-bold text-primary mb-1">
                      {{ formatCurrency(product.revenue) }}
                    </div>
                    <div class="text-caption text-grey">Выручка</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card height="100%">
          <v-card-title class="pb-2">
            <v-icon start>mdi-account-star</v-icon>
            Топ клиентов
            <v-spacer></v-spacer>
            <v-select
              v-model="customersSortBy"
              :items="customersSortOptions"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 160px"
              @update:model-value="loadCustomersAnalytics"
            ></v-select>
          </v-card-title>
          <v-card-text class="pt-2">
            <div v-if="loadingCustomers" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="customersData.length === 0 || customersData.every(c => c.totalSpent === 0 && c.orderCount === 0)" 
                 class="text-center py-12 text-grey">
              <v-icon size="48" class="mb-2">mdi-account-group</v-icon>
              <div>Нет активных клиентов</div>
            </div>
            <v-list v-else class="pa-0">
              <v-list-item
                v-for="(customer, index) in customersData.filter(c => c.totalSpent > 0 || c.orderCount > 0)"
                :key="index"
                class="pa-3 mb-2 rounded"
                :style="{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }"
              >
                <template v-slot:prepend>
                  <v-avatar color="primary" size="52" class="mr-3">
                    <span class="text-white text-h6">{{ customer.name.charAt(0).toUpperCase() }}</span>
                  </v-avatar>
                </template>
                <div class="flex-grow-1">
                  <div class="d-flex align-center mb-1">
                    <v-list-item-title class="font-weight-medium text-body-1">
                      {{ customer.name }}
                    </v-list-item-title>
                    <v-chip 
                      v-if="customer.orderCount > 5" 
                      size="x-small" 
                      color="success" 
                      variant="flat"
                      class="ml-2"
                    >
                      <v-icon size="12" class="mr-1">mdi-star</v-icon>
                      Постоянный
                    </v-chip>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2 mb-1">
                    <span class="text-caption text-grey" v-if="customer.email">
                      <v-icon size="14" class="mr-1">mdi-email</v-icon>
                      {{ customer.email }}
                    </span>
                    <span class="text-caption text-grey" v-if="customer.phone">
                      <v-icon size="14" class="mr-1">mdi-phone</v-icon>
                      {{ customer.phone }}
                    </span>
                  </div>
                  <div class="d-flex align-center flex-wrap gap-2">
                    <span class="text-caption text-grey">
                      <v-icon size="14" class="mr-1">mdi-cart</v-icon>
                      <strong>{{ customer.orderCount }}</strong> {{ customer.orderCount === 1 ? 'заказ' : 'заказов' }}
                    </span>
                    <span class="text-caption text-grey" v-if="customer.averageOrderValue > 0">
                      <v-icon size="14" class="mr-1">mdi-cash</v-icon>
                      Средний чек: <strong>{{ formatCurrency(customer.averageOrderValue) }}</strong>
                    </span>
                    <span class="text-caption text-grey" v-if="customer.reviewsCount > 0">
                      <v-icon size="14" class="mr-1">mdi-comment-text</v-icon>
                      <strong>{{ customer.reviewsCount }}</strong> {{ customer.reviewsCount === 1 ? 'отзыв' : 'отзывов' }}
                    </span>
                  </div>
                  <div class="text-caption text-grey mt-1" v-if="customer.lastOrderDate">
                    Последний заказ: {{ formatDate(customer.lastOrderDate) }}
                  </div>
                </div>
                <template v-slot:append>
                  <div class="text-right ml-4">
                    <div class="text-h6 font-weight-bold text-primary mb-1">
                      {{ formatCurrency(customer.totalSpent) }}
                    </div>
                    <div class="text-caption text-grey">Всего потрачено</div>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Аналитика по заказам -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="pb-2">
            <v-icon start>mdi-chart-bar</v-icon>
            Аналитика по заказам
            <v-spacer></v-spacer>
            <v-select
              v-model="ordersGroupBy"
              :items="ordersGroupOptions"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 200px"
              @update:model-value="loadOrdersAnalytics"
            ></v-select>
          </v-card-title>
          <v-card-text class="pt-2">
            <div v-if="loadingOrders" class="text-center py-8">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
            </div>
            <div v-else-if="ordersData.length === 0" class="text-center py-12 text-grey">
              <v-icon size="48" class="mb-2">mdi-chart-bar</v-icon>
              <div>Нет данных</div>
            </div>
            <v-table v-else>
              <thead>
                <tr>
                  <th class="text-left">Группа</th>
                  <th class="text-center">Количество</th>
                  <th class="text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, index) in ordersData" 
                  :key="index"
                  :style="{ backgroundColor: index % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent' }"
                >
                  <td class="py-3">
                    <v-chip 
                      v-if="item.status" 
                      :color="getStatusColor(item.status)" 
                      size="small"
                      variant="flat"
                    >
                      {{ getStatusLabel(item.status) }}
                    </v-chip>
                    <v-chip 
                      v-else-if="item.paymentStatus" 
                      :color="getPaymentStatusColor(item.paymentStatus)" 
                      size="small"
                      variant="flat"
                    >
                      {{ getPaymentStatusLabel(item.paymentStatus) }}
                    </v-chip>
                    <span v-else class="font-weight-medium">{{ item.source || formatDate(item.date) || '-' }}</span>
                  </td>
                  <td class="text-center py-3">
                    <span class="font-weight-medium">{{ item.count }}</span>
                  </td>
                  <td class="text-right py-3">
                    <span class="font-weight-bold text-primary">
                      {{ formatCurrency(item.totalAmount || 0) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

definePageMeta({
  middleware: 'auth'
})

const { request } = useApi()
const loading = ref(false)
const loadingProducts = ref(false)
const loadingCustomers = ref(false)
const loadingOrders = ref(false)

const selectedPeriod = ref('month')
const dateFrom = ref('')
const dateTo = ref('')

const dashboardStats = ref({
  orders: {},
  revenue: {},
  customers: {}
})

const revenueData = ref([])
const productsData = ref([])
const customersData = ref([])
const ordersData = ref([])

const productsSortBy = ref('revenue')
const customersSortBy = ref('totalSpent')
const ordersGroupBy = ref('status')

const periodOptions = [
  { title: 'Сегодня', value: 'today' },
  { title: 'Неделя', value: 'week' },
  { title: 'Месяц', value: 'month' },
  { title: 'Квартал', value: 'quarter' },
  { title: 'Год', value: 'year' },
  { title: 'Произвольный период', value: 'custom' }
]

const productsSortOptions = [
  { title: 'По выручке', value: 'revenue' },
  { title: 'По продажам', value: 'sales' },
  { title: 'По рейтингу', value: 'rating' }
]

const customersSortOptions = [
  { title: 'По сумме', value: 'totalSpent' },
  { title: 'По заказам', value: 'orderCount' },
  { title: 'По дате', value: 'lastOrderDate' }
]

const ordersGroupOptions = [
  { title: 'По статусу', value: 'status' },
  { title: 'По оплате', value: 'paymentStatus' },
  { title: 'По источнику', value: 'source' },
  { title: 'По дате', value: 'date' }
]

const maxRevenue = computed(() => {
  if (revenueData.value.length === 0) return 1
  return Math.max(...revenueData.value.map(item => item.revenue), 1)
})

const loadDashboardStats = async () => {
  try {
    loading.value = true
    const params = {}
    if (selectedPeriod.value !== 'custom') {
      params.period = selectedPeriod.value
    } else {
      if (dateFrom.value) params.dateFrom = dateFrom.value
      if (dateTo.value) params.dateTo = dateTo.value
    }

    const query = new URLSearchParams(params).toString()
    const response = await request(`/analytics/dashboard${query ? `?${query}` : ''}`)
    dashboardStats.value = response.data || {}
  } catch (error) {
    console.error('Error loading dashboard stats:', error)
  } finally {
    loading.value = false
  }
}

const loadRevenueAnalytics = async () => {
  try {
    const params = { groupBy: 'day' }
    if (selectedPeriod.value !== 'custom') {
      params.period = selectedPeriod.value
    } else {
      if (dateFrom.value) params.dateFrom = dateFrom.value
      if (dateTo.value) params.dateTo = dateTo.value
    }

    const query = new URLSearchParams(params).toString()
    const response = await request(`/analytics/revenue${query ? `?${query}` : ''}`)
    revenueData.value = response.data || []
  } catch (error) {
    console.error('Error loading revenue analytics:', error)
    revenueData.value = []
  }
}

const loadProductsAnalytics = async () => {
  try {
    loadingProducts.value = true
    const params = { limit: 10, sortBy: productsSortBy.value }
    if (selectedPeriod.value !== 'custom') {
      params.period = selectedPeriod.value
    } else {
      if (dateFrom.value) params.dateFrom = dateFrom.value
      if (dateTo.value) params.dateTo = dateTo.value
    }

    const query = new URLSearchParams(params).toString()
    const response = await request(`/analytics/products${query ? `?${query}` : ''}`)
    productsData.value = response.data || []
  } catch (error) {
    console.error('Error loading products analytics:', error)
    productsData.value = []
  } finally {
    loadingProducts.value = false
  }
}

const loadCustomersAnalytics = async () => {
  try {
    loadingCustomers.value = true
    const params = { limit: 10, sortBy: customersSortBy.value }
    const query = new URLSearchParams(params).toString()
    const response = await request(`/analytics/customers${query ? `?${query}` : ''}`)
    customersData.value = response.data || []
  } catch (error) {
    console.error('Error loading customers analytics:', error)
    customersData.value = []
  } finally {
    loadingCustomers.value = false
  }
}

const loadOrdersAnalytics = async () => {
  try {
    loadingOrders.value = true
    const params = { groupBy: ordersGroupBy.value }
    if (selectedPeriod.value !== 'custom') {
      params.period = selectedPeriod.value
    } else {
      if (dateFrom.value) params.dateFrom = dateFrom.value
      if (dateTo.value) params.dateTo = dateTo.value
    }

    const query = new URLSearchParams(params).toString()
    const response = await request(`/analytics/orders${query ? `?${query}` : ''}`)
    ordersData.value = response.data || []
  } catch (error) {
    console.error('Error loading orders analytics:', error)
    ordersData.value = []
  } finally {
    loadingOrders.value = false
  }
}

const loadData = async () => {
  await Promise.all([
    loadDashboardStats(),
    loadRevenueAnalytics(),
    loadProductsAnalytics(),
    loadCustomersAnalytics(),
    loadOrdersAnalytics()
  ])
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const getProductImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  const apiBase = useRuntimeConfig().public.apiBase.replace('/api', '')
  return `${apiBase}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

const getStatusLabel = (status) => {
  const labels = {
    'NEW': 'Новый',
    'CONFIRMED': 'Подтвержден',
    'PROCESSING': 'В обработке',
    'READY': 'Готов к отправке',
    'SHIPPED': 'Отправлен',
    'DELIVERED': 'Доставлен',
    'CANCELLED': 'Отменен',
    'REFUNDED': 'Возвращен'
  }
  return labels[status] || status
}

const getStatusColor = (status) => {
  const colors = {
    'NEW': 'blue',
    'CONFIRMED': 'yellow',
    'PROCESSING': 'purple',
    'READY': 'indigo',
    'SHIPPED': 'green',
    'DELIVERED': 'success',
    'CANCELLED': 'red',
    'REFUNDED': 'orange'
  }
  return colors[status] || 'grey'
}

const getPaymentStatusLabel = (status) => {
  const labels = {
    'PENDING': 'Ожидает оплаты',
    'PAID': 'Оплачен',
    'FAILED': 'Ошибка оплаты',
    'REFUNDED': 'Возврат средств',
    'PARTIALLY_REFUNDED': 'Частичный возврат'
  }
  return labels[status] || status
}

const getPaymentStatusColor = (status) => {
  const colors = {
    'PENDING': 'yellow',
    'PAID': 'success',
    'FAILED': 'red',
    'REFUNDED': 'orange',
    'PARTIALLY_REFUNDED': 'warning'
  }
  return colors[status] || 'grey'
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.revenue-chart {
  min-height: 300px;
}

:deep(.v-card-title) {
  padding: 16px 16px 8px 16px;
}

:deep(.v-card-text) {
  padding: 8px 16px 16px 16px;
}

:deep(.v-list-item) {
  min-height: auto;
}
</style>
