<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'reviews-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Создать отзыв</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.productId"
                :items="products"
                item-title="title"
                item-value="id"
                label="Товар"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-select
                v-model="form.customerId"
                :items="customers"
                item-title="name"
                item-value="id"
                label="Клиент (опционально)"
                variant="outlined"
                clearable
                class="mb-4"
                hint="Если выбран зарегистрированный клиент, отзыв будет автоматически одобрен"
              ></v-select>
              <v-text-field
                v-model="form.name"
                label="Имя клиента"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                variant="outlined"
                class="mb-4"
                hint="Если email соответствует зарегистрированному клиенту, отзыв будет автоматически одобрен"
              ></v-text-field>
              <v-text-field
                v-model.number="form.rating"
                label="Рейтинг"
                type="number"
                min="1"
                max="5"
                variant="outlined"
                required
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Статус</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Статус"
                variant="outlined"
                required
                :hint="form.customerId ? 'Статус автоматически установлен в Одобрен для зарегистрированных клиентов' : ''"
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>Комментарий</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.comment"
                label="Комментарий"
                variant="outlined"
                rows="6"
              ></v-textarea>
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
            Создать
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo({ name: 'reviews-index' })"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const products = ref([])
const customers = ref([])
const loading = ref(false)

const form = reactive({
  productId: null,
  customerId: null,
  name: '',
  email: '',
  rating: 5,
  comment: '',
  status: 'PENDING'
})

const statusOptions = [
  { title: 'На модерации', value: 'PENDING' },
  { title: 'Одобрен', value: 'APPROVED' },
  { title: 'Отклонен', value: 'REJECTED' }
]

watch(() => form.customerId, (newVal) => {
  if (newVal) {
    form.status = 'APPROVED'
  }
})

const loadProducts = async () => {
  try {
    const response = await api.getList('products', { limit: 100 })
    products.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

const loadCustomers = async () => {
  try {
    const response = await api.getList('customers', { limit: 100 })
    customers.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки клиентов:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const createData = {
      productId: form.productId,
      customerId: form.customerId || undefined,
      name: form.name,
      email: form.email || undefined,
      rating: Number(form.rating),
      comment: form.comment || undefined,
      status: form.status
    }

    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined || createData[key] === null || createData[key] === '') {
        delete createData[key]
      }
    })

    await api.create('reviews', createData)
    await navigateTo({ name: 'reviews-index' })
  } catch (error) {
    console.error('Ошибка создания:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProducts()
  await loadCustomers()
})
</script>
