<template>
  <div v-if="promotion">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'promotions-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать промокод: {{ promotion.name }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.id"
                label="ID"
                disabled
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.name"
                label="Название"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.code"
                label="Промокод (код)"
                variant="outlined"
                hint="Уникальный код промокода (опционально)"
                class="mb-4"
              ></v-text-field>
              <v-textarea
                v-model="form.description"
                label="Описание"
                variant="outlined"
                rows="3"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Параметры скидки</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.type"
                :items="typeOptions"
                label="Тип промокода"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-text-field
                v-model.number="form.value"
                label="Значение"
                type="number"
                variant="outlined"
                required
                hint="Для процентов: 10 = 10%, для суммы: 100 = 100 грн"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model.number="form.minOrderAmount"
                label="Минимальная сумма заказа (грн)"
                type="number"
                variant="outlined"
                hint="Минимальная сумма заказа для применения промокода"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Ограничения</v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="form.maxUsage"
                label="Максимальное количество использований"
                type="number"
                variant="outlined"
                hint="Оставьте пустым для неограниченного использования"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.startDate"
                label="Дата начала"
                type="datetime-local"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.endDate"
                label="Дата окончания"
                type="datetime-local"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-checkbox
                v-model="form.isActive"
                label="Активен"
              ></v-checkbox>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Товары</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.productIds"
                :items="products"
                item-title="title"
                item-value="id"
                label="Товары"
                variant="outlined"
                multiple
                chips
                hint="Оставьте пустым, чтобы промокод применялся ко всем товарам"
              ></v-select>
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
            @click="navigateTo({ name: 'promotions-index' })"
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
const promotion = ref(null)
const products = ref([])
const loading = ref(false)

const form = reactive({
  id: '',
  name: '',
  code: '',
  description: '',
  type: 'PERCENTAGE',
  value: 0,
  minOrderAmount: null,
  maxUsage: null,
  startDate: '',
  endDate: '',
  isActive: true,
  productIds: []
})

const typeOptions = [
  { title: 'Процент', value: 'PERCENTAGE' },
  { title: 'Фиксированная сумма (грн)', value: 'FIXED_AMOUNT' },
  { title: 'Бесплатная доставка', value: 'FREE_SHIPPING' },
  { title: '1+1 (Купи один - получи второй)', value: 'BUY_ONE_GET_ONE' }
]

const loadProducts = async () => {
  try {
    const response = await api.getList('products', { limit: 100 })
    products.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

const loadPromotion = async () => {
  try {
    const data = await api.getOne('promotions', route.params.id)
    promotion.value = data
    
    form.id = data.id
    form.name = data.name || ''
    form.code = data.code || ''
    form.description = data.description || ''
    form.type = data.type || 'PERCENTAGE'
    form.value = Number(data.value) || 0
    form.minOrderAmount = data.minOrderAmount ? Number(data.minOrderAmount) : null
    form.maxUsage = data.maxUsage ? Number(data.maxUsage) : null
    form.startDate = data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : ''
    form.endDate = data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : ''
    form.isActive = data.isActive !== undefined ? data.isActive : true
    form.productIds = data.products?.map(pp => pp.productId) || data.productIds || []
  } catch (error) {
    console.error('Ошибка загрузки промокода:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      name: form.name,
      code: form.code || null,
      description: form.description || undefined,
      type: form.type,
      value: Number(form.value),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
      maxUsage: form.maxUsage ? Number(form.maxUsage) : null,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      isActive: form.isActive,
      productIds: form.productIds && form.productIds.length > 0 ? form.productIds : undefined
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('promotions', route.params.id, updateData)
    await navigateTo({ name: 'promotions-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProducts()
  await loadPromotion()
})
</script>
