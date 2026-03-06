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

    <v-row class="mb-2">
      <v-col cols="8">
        <h1 class="text-h4">Заказ #{{ order.orderNumber }}</h1>
      </v-col>
      <v-col cols="4" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-file-pdf-box"
          size="small"
          @click="downloadPdf"
        >
          Скачать PDF
        </v-btn>
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
          <v-card-title class="d-flex justify-space-between align-center">
            <span>Товары в заказе</span>
            <v-btn
              v-if="order.source === 'admin' || !order.source"
              color="primary"
              size="small"
              prepend-icon="mdi-plus"
              @click="showAddItemDialog = true"
            >
              Добавить товар
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-table v-if="order.items && order.items.length > 0">
              <thead>
                <tr>
                  <th>Товар</th>
                  <th class="text-right">Количество</th>
                  <th class="text-right">Цена</th>
                  <th class="text-right">Сумма</th>
                  <th class="text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in order.items" :key="index">
                  <td>
                    <div>{{ item.product?.title || item.product?.name || 'Товар не найден' }}</div>
                    <v-img
                      v-if="item.product?.images?.[0]"
                      :src="getImageUrl(item.product.images[0])"
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
                  <td class="text-right">
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      variant="text"
                      color="error"
                      @click="removeItem(item.id)"
                    ></v-btn>
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div v-else class="text-center text-grey py-8">
              Товары не добавлены
            </div>
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

  <!-- Диалог добавления товара -->
  <v-dialog v-model="showAddItemDialog" max-width="800">
    <v-card>
      <v-card-title>Добавить товар</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="productSearch"
          label="Поиск товара"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
          @input="searchProducts"
        ></v-text-field>

        <v-list v-if="foundProducts.length > 0" style="max-height: 300px; overflow-y: auto;">
          <v-list-item
            v-for="product in foundProducts"
            :key="product.id"
            @click="selectProduct(product)"
          >
            <template v-slot:prepend>
              <v-img
                v-if="product.images?.[0]"
                :src="getImageUrl(product.images[0])"
                width="50"
                height="50"
                cover
                class="mr-3"
              ></v-img>
            </template>
            <v-list-item-title>{{ product.title || product.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ Number(product.price).toFixed(2) }} грн</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <div v-if="selectedProduct" class="mt-4">
          <v-divider class="mb-4"></v-divider>
          <div class="mb-4">
            <strong>Выбранный товар:</strong> {{ selectedProduct.title || selectedProduct.name }}
            <br>
            <strong>Цена:</strong> {{ Number(selectedProduct.price).toFixed(2) }} грн
          </div>
          <v-text-field
            v-model.number="itemQuantity"
            label="Количество"
            type="number"
            min="1"
            variant="outlined"
            density="compact"
          ></v-text-field>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="showAddItemDialog = false">Отмена</v-btn>
        <v-btn
          color="primary"
          :disabled="!selectedProduct || !itemQuantity || itemQuantity < 1"
          @click="addItemToOrder"
        >
          Добавить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
const showAddItemDialog = ref(false)
const productSearch = ref('')
const foundProducts = ref([])
const selectedProduct = ref(null)
const itemQuantity = ref(1)

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
    date: data.createdAt,
    items: data.items || [] // Сохраняем товары
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

const downloadPdf = async () => {
  if (!order.value) return

  const pdfMake = (await import('pdfmake/build/pdfmake')).default
  
  // Импортируем шрифты
  try {
    const pdfFonts = await import('pdfmake/build/vfs_fonts')
    if (pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) {
      pdfMake.vfs = pdfFonts.default.pdfMake.vfs
    } else if (pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
      pdfMake.vfs = pdfFonts.pdfMake.vfs
    }
  } catch (e) {
    console.warn('Не удалось загрузить шрифты, используем стандартные', e)
  }

  const total = Number(order.value.total || order.value.totalAmount || 0)
  const discount = Number(order.value.discountAmount || 0)
  const shipping = Number(order.value.shippingAmount || 0)

  const docDefinition = {
    content: [
      { text: `Заказ #${order.value.orderNumber}`, style: 'header', margin: [0, 0, 0, 20] },
      {
        columns: [
          {
            width: '*',
            text: [
              { text: 'Дата: ', bold: true },
              { text: formatDate(order.value.date || order.value.createdAt) + '\n' },
              { text: 'Клиент: ', bold: true },
              { text: (order.value.customer?.name || '-') + '\n' },
              { text: 'Телефон: ', bold: true },
              { text: (order.value.customer?.phone || '-') + '\n' },
              ...(order.value.customer?.email ? [
                { text: 'Email: ', bold: true },
                { text: order.value.customer.email + '\n' }
              ] : [])
            ]
          }
        ],
        margin: [0, 0, 0, 20]
      },
      { text: 'Товары', style: 'subheader', margin: [0, 10, 0, 10] },
      {
        table: {
          headerRows: 1,
          widths: ['*', 60, 70, 70],
          body: [
            [
              { text: 'Товар', style: 'tableHeader' },
              { text: 'Кол-во', style: 'tableHeader', alignment: 'center' },
              { text: 'Цена', style: 'tableHeader', alignment: 'right' },
              { text: 'Сумма', style: 'tableHeader', alignment: 'right' }
            ],
            ...order.value.items.map(item => {
              const title = item.product?.title || item.product?.name || 'Товар'
              const qty = item.quantity || 0
              const price = Number(item.price || 0)
              const itemTotal = Number(item.total || price * qty)
              return [
                title,
                { text: String(qty), alignment: 'center' },
                { text: `${price.toFixed(2)} грн`, alignment: 'right' },
                { text: `${itemTotal.toFixed(2)} грн`, alignment: 'right', bold: true }
              ]
            })
          ]
        },
        margin: [0, 0, 0, 20]
      },
      {
        text: [
          { text: 'Товаров: ', bold: true },
          { text: `${getItemsCount()} шт.\n` },
          ...(discount ? [
            { text: 'Скидка: ', bold: true },
            { text: `-${discount.toFixed(2)} грн\n` }
          ] : []),
          ...(shipping ? [
            { text: 'Доставка: ', bold: true },
            { text: `${shipping.toFixed(2)} грн\n` }
          ] : []),
          { text: 'Итого: ', bold: true, fontSize: 14 },
          { text: `${total.toFixed(2)} ${order.value.currency || 'грн'}`, bold: true, fontSize: 14 }
        ],
        margin: [0, 10, 0, 0]
      }
    ],
    styles: {
      header: {
        fontSize: 20,
        bold: true
      },
      subheader: {
        fontSize: 14,
        bold: true
      },
      tableHeader: {
        bold: true,
        fontSize: 10
      }
    },
    defaultStyle: {
      font: 'Roboto'
    }
  }

  pdfMake.createPdf(docDefinition).download(`order-${order.value.orderNumber}.pdf`)
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

const searchProducts = async () => {
  if (!productSearch.value || productSearch.value.length < 2) {
    foundProducts.value = []
    return
  }

  try {
    const response = await api.getList('products', {
      search: productSearch.value,
      limit: 10,
      isActive: true
    })
    foundProducts.value = response.data || []
  } catch (error) {
    console.error('Ошибка поиска товаров:', error)
    foundProducts.value = []
  }
}

const selectProduct = (product) => {
  selectedProduct.value = product
  itemQuantity.value = 1
}

const addItemToOrder = async () => {
  if (!selectedProduct.value || !itemQuantity.value || itemQuantity.value < 1) return

  try {
    const items = [{
      productId: selectedProduct.value.id,
      quantity: itemQuantity.value,
      price: Number(selectedProduct.value.price)
    }]

    await api.request(`/orders/${route.params.id}/items`, {
      method: 'POST',
      body: { items }
    })
    
    // Перезагружаем заказ
    await loadOrder()
    
    // Сбрасываем форму
    showAddItemDialog.value = false
    productSearch.value = ''
    foundProducts.value = []
    selectedProduct.value = null
    itemQuantity.value = 1
  } catch (error) {
    console.error('Ошибка добавления товара:', error)
    alert('Ошибка при добавлении товара')
  }
}

const removeItem = async (itemId) => {
  if (!confirm('Удалить товар из заказа?')) return

  try {
    // Удаляем товар через обновление заказа
    // Для этого нужно будет добавить метод удаления в API
    // Пока просто перезагружаем страницу
    alert('Функция удаления товара будет добавлена')
  } catch (error) {
    console.error('Ошибка удаления товара:', error)
  }
}

const loadOrder = async () => {
  try {
    const data = await api.getOne('orders', route.params.id)
    order.value = transformOrder(data)
  } catch (error) {
    console.error('Ошибка загрузки заказа:', error)
  }
}

onMounted(async () => {
  await loadOrder()
})
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 20px;
}
</style>
