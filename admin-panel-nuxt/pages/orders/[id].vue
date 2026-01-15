<template>
  <div v-if="order">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'orders' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Заказ #{{ order.orderNumber }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Основная информация</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Номер заказа</div>
                <div class="text-h6">#{{ order.orderNumber }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Дата создания</div>
                <div>{{ formatDate(order.date || order.createdAt) }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Статус заказа</div>
                <v-chip
                  :color="getStatusColor(order.status)"
                  size="small"
                  variant="flat"
                  class="mt-1"
                >
                  {{ getStatusLabel(order.status) }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Статус оплаты</div>
                <v-chip
                  :color="getPaymentStatusColor(order.paymentStatus)"
                  size="small"
                  variant="flat"
                  class="mt-1"
                >
                  {{ getPaymentStatusLabel(order.paymentStatus) }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Информация о клиенте</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Имя</div>
                <div>{{ order.customer?.name || 'Не указано' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Телефон</div>
                <div>
                  <a :href="`tel:${order.customer?.phone}`">
                    {{ order.customer?.phone || 'Не указан' }}
                  </a>
                </div>
              </v-col>
              <v-col cols="12" sm="6" v-if="order.customer?.email">
                <div class="text-caption text-grey">Email</div>
                <div>
                  <a :href="`mailto:${order.customer.email}`">
                    {{ order.customer.email }}
                  </a>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Товары в заказе</v-card-title>
          <v-card-text>
            <v-table>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th class="text-right">Количество</th>
                  <th class="text-right">Цена</th>
                  <th class="text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order.items" :key="index">
                  <td>
                    <div>{{ item.product?.title || item.product?.name || 'Товар не найден' }}</div>
                    <v-img
                      v-if="item.product?.images?.[0]"
                      :src="item.product.images[0]"
                      width="60"
                      height="60"
                      class="mt-2"
                      cover
                    ></v-img>
                  </td>
                  <td class="text-right">{{ item.quantity }}</td>
                  <td class="text-right">{{ Number(item.price).toFixed(2) }} грн</td>
                  <td class="text-right">
                    <strong>{{ Number(item.total || item.price * item.quantity).toFixed(2) }} грн</strong>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>

        <v-card v-if="order.notes">
          <v-card-title>Примечания</v-card-title>
          <v-card-text>
            <div style="white-space: pre-wrap">{{ order.notes }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="sticky-top">
          <v-card-title>Итого</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Товаров:</span>
              <span>{{ getItemsCount() }} шт.</span>
            </div>
            <div v-if="order.discountAmount" class="d-flex justify-space-between mb-2">
              <span class="text-grey">Скидка:</span>
              <span class="text-error">-{{ Number(order.discountAmount).toFixed(2) }} грн</span>
            </div>
            <div v-if="order.shippingAmount" class="d-flex justify-space-between mb-2">
              <span class="text-grey">Доставка:</span>
              <span>{{ Number(order.shippingAmount).toFixed(2) }} грн</span>
            </div>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex justify-space-between">
              <span class="text-h6 font-weight-bold">Всего:</span>
              <span class="text-h6 font-weight-bold text-primary">
                {{ Number(order.total || order.totalAmount || 0).toFixed(2) }} {{ order.currency || 'грн' }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()
const order = ref(null)

const transformOrder = (data) => {
  const statusMap = {
    'NEW': 'new',
    'CONFIRMED': 'processing',
    'PROCESSING': 'processing',
    'READY': 'processing',
    'SHIPPED': 'shipped',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled',
    'REFUNDED': 'cancelled'
  }

  const paymentStatusMap = {
    'PENDING': 'pending',
    'PAID': 'paid',
    'FAILED': 'failed',
    'REFUNDED': 'refunded',
    'PARTIALLY_REFUNDED': 'refunded'
  }

  return {
    ...data,
    status: statusMap[data.status] || 'new',
    paymentStatus: paymentStatusMap[data.paymentStatus] || 'pending',
    total: Number(data.totalAmount),
    currency: 'грн',
    date: data.createdAt
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

const getItemsCount = () => {
  if (!order.value?.items) return 0
  return order.value.items.reduce((sum, item) => sum + (item.quantity || 0), 0)
}

onMounted(async () => {
  try {
    const data = await api.getOne('orders', route.params.id)
    order.value = transformOrder(data)
  } catch (error) {
    console.error('Ошибка загрузки заказа:', error)
  }
})
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 20px;
}
</style>
