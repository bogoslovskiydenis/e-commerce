<template>
  <div v-if="review">
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
        <h1 class="text-h4 mb-4">Редактировать отзыв</h1>
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
                class="mb-4"
              ></v-select>
              <div class="text-caption text-grey mb-2">Дата создания</div>
              <div>{{ formatDate(review.createdAt) }}</div>
              <div class="text-caption text-grey mb-2 mt-4" v-if="review.moderatedAt">Дата модерации</div>
              <div v-if="review.moderatedAt">{{ formatDate(review.moderatedAt) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card class="mb-4">
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

        <v-col cols="12">
          <v-card>
            <v-card-title>Сообщение администратора</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.adminMessage"
                label="Сообщение администратора"
                variant="outlined"
                rows="4"
                hint="Видно только в админке"
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
            Сохранить
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
const review = ref(null)
const products = ref([])
const loading = ref(false)

const form = reactive({
  id: '',
  productId: null,
  name: '',
  email: '',
  rating: 5,
  comment: '',
  status: 'PENDING',
  adminMessage: ''
})

const statusOptions = [
  { title: 'На модерации', value: 'PENDING' },
  { title: 'Одобрен', value: 'APPROVED' },
  { title: 'Отклонен', value: 'REJECTED' }
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

const loadProducts = async () => {
  try {
    const response = await api.getList('products', { limit: 100 })
    products.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
  }
}

const loadReview = async () => {
  try {
    const data = await api.getOne('reviews', route.params.id)
    review.value = data
    
    form.id = data.id
    form.productId = data.productId
    form.name = data.name || ''
    form.email = data.email || ''
    form.rating = data.rating || 5
    form.comment = data.comment || ''
    form.status = data.status || 'PENDING'
    form.adminMessage = data.adminMessage || ''
  } catch (error) {
    console.error('Ошибка загрузки отзыва:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      status: form.status,
      name: form.name,
      email: form.email || undefined,
      comment: form.comment || undefined,
      rating: Number(form.rating),
      adminMessage: form.adminMessage || undefined
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('reviews', route.params.id, updateData)
    await navigateTo({ name: 'reviews-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadProducts()
  await loadReview()
})
</script>
