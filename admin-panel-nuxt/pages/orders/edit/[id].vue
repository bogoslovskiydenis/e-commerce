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
        <h1 class="text-h4 mb-4">Редактировать заказ #{{ order.orderNumber }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.orderNumber"
                    label="Номер заказа"
                    disabled
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="form.date"
                    label="Дата заказа"
                    type="datetime-local"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.status"
                    :items="statusOptions"
                    label="Статус заказа"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.paymentMethod"
                    :items="paymentMethods"
                    label="Способ оплаты"
                    variant="outlined"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Информация о клиенте</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="form.customer.name"
                    label="Имя клиента"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="form.customer.phone"
                    label="Телефон"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="4">
                  <v-text-field
                    v-model="form.customer.email"
                    label="Email"
                    type="email"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Товары в заказе</v-card-title>
            <v-card-text>
              <div v-for="(item, index) in form.items" :key="index" class="mb-4">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="item.product.title"
                      label="Название товара"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model.number="item.quantity"
                      label="Количество"
                      type="number"
                      min="1"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="3">
                    <v-text-field
                      v-model.number="item.price"
                      label="Цена, грн"
                      type="number"
                      variant="outlined"
                      density="compact"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>Примечания</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.notes"
                label="Комментарий к заказу"
                variant="outlined"
                rows="4"
              ></v-textarea>
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
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Скидка:</span>
                <span class="text-error">-{{ Number(form.discountAmount || 0).toFixed(2) }} грн</span>
              </div>
              <div class="d-flex justify-space-between mb-2">
                <span class="text-grey">Доставка:</span>
                <span>{{ Number(form.shippingAmount || 0).toFixed(2) }} грн</span>
              </div>
              <v-divider class="my-2"></v-divider>
              <div class="d-flex justify-space-between">
                <span class="text-h6 font-weight-bold">Всего:</span>
                <span class="text-h6 font-weight-bold text-primary">
                  {{ getFinalTotal().toFixed(2) }} {{ form.currency || 'грн' }}
                </span>
              </div>

              <v-divider class="my-4"></v-divider>

              <v-text-field
                v-model.number="form.total"
                label="Общая сумма"
                type="number"
                variant="outlined"
                density="compact"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model.number="form.totalAmount"
                label="Сумма заказа"
                type="number"
                variant="outlined"
                density="compact"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model.number="form.discountAmount"
                label="Скидка"
                type="number"
                variant="outlined"
                density="compact"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model.number="form.shippingAmount"
                label="Доставка"
                type="number"
                variant="outlined"
                density="compact"
                class="mb-2"
              ></v-text-field>
              <v-text-field
                v-model="form.currency"
                label="Валюта"
                variant="outlined"
                density="compact"
                value="грн"
              ></v-text-field>

              <v-divider class="my-4"></v-divider>

              <v-checkbox
                v-model="form.processing"
                label="В обработке"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-content-save"
          >
            Сохранить
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo({ name: 'orders' })"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>

  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()
const order = ref(null)
const loading = ref(false)

const form = reactive({
  orderNumber: '',
  date: '',
  status: 'new',
  paymentMethod: '',
  customer: {
    name: '',
    phone: '',
    email: ''
  },
  items: [],
  notes: '',
  total: 0,
  totalAmount: 0,
  discountAmount: 0,
  shippingAmount: 0,
  currency: 'грн',
  processing: false
})

const statusOptions = [
  { title: 'Новый', value: 'new' },
  { title: 'Обрабатывается', value: 'processing' },
  { title: 'Отправлен', value: 'shipped' },
  { title: 'Доставлен', value: 'delivered' },
  { title: 'Отменен', value: 'cancelled' }
]

const paymentMethods = [
  { title: 'Наличными', value: 'CASH' },
  { title: 'Картой при получении', value: 'CARD' },
  { title: 'Monobank', value: 'MONOBANK' },
  { title: 'Приват24', value: 'PRIVAT24' }
]

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

  return {
    ...data,
    status: statusMap[data.status] || 'new',
    date: data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 16) : '',
    total: Number(data.totalAmount),
    currency: 'грн'
  }
}

const transformToApi = (data) => {
  const statusMap = {
    'new': 'NEW',
    'processing': 'PROCESSING',
    'shipped': 'SHIPPED',
    'delivered': 'DELIVERED',
    'cancelled': 'CANCELLED'
  }

  return {
    status: statusMap[data.status] || data.status,
    paymentMethod: data.paymentMethod,
    notes: data.notes,
    managerNotes: data.managerNotes
  }
}

const getItemsCount = () => {
  if (!form.items) return 0
  return form.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
}

const getFinalTotal = () => {
  const itemsTotal = form.items.reduce((sum, item) => {
    return sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0))
  }, 0)
  
  return Number(form.total || form.totalAmount || itemsTotal) - 
         Number(form.discountAmount || 0) + 
         Number(form.shippingAmount || 0)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = transformToApi(form)
    await api.update('orders', route.params.id, updateData)
    await navigateTo({ name: 'orders' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const data = await api.getOne('orders', route.params.id)
    order.value = transformOrder(data)
    
    form.orderNumber = data.orderNumber
    form.date = data.createdAt ? new Date(data.createdAt).toISOString().slice(0, 16) : ''
    form.status = order.value.status
    form.paymentMethod = data.paymentMethod || ''
    form.customer = {
      name: data.customer?.name || '',
      phone: data.customer?.phone || '',
      email: data.customer?.email || ''
    }
    form.items = (data.items || []).map(item => ({
      product: {
        title: item.product?.title || item.product?.name || ''
      },
      quantity: item.quantity || 0,
      price: Number(item.price) || 0
    }))
    form.notes = data.notes || ''
    form.total = Number(data.totalAmount) || 0
    form.totalAmount = Number(data.totalAmount) || 0
    form.discountAmount = Number(data.discountAmount) || 0
    form.shippingAmount = Number(data.shippingAmount) || 0
    form.currency = 'грн'
    form.processing = data.status === 'PROCESSING' || data.status === 'CONFIRMED'
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
