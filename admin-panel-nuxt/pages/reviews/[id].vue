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
        <h1 class="text-h4 mb-4">Просмотр отзыва</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Информация о клиенте</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Имя</div>
                <div class="text-h6">{{ review.name || 'Не указано' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Email</div>
                <div>{{ review.email || 'Не указан' }}</div>
              </v-col>
              <v-col cols="12" v-if="review.customer">
                <div class="text-caption text-grey">Клиент</div>
                <div>{{ review.customer.name }} ({{ review.customer.email }})</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" v-if="review.product">
          <v-card-title>Информация о товаре</v-card-title>
          <v-card-text>
            <div>{{ review.product.title }}</div>
            <v-img
              v-if="review.product.images && review.product.images.length > 0"
              :src="getImageUrl(review.product.images[0])"
              max-width="150"
              max-height="150"
              class="mt-2"
              cover
            ></v-img>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Комментарий</v-card-title>
          <v-card-text>
            <div style="white-space: pre-wrap; background: #f5f5f5; padding: 16px; border-radius: 4px">
              {{ review.comment || 'Комментарий отсутствует' }}
            </div>
          </v-card-text>
        </v-card>

        <v-card v-if="review.adminMessage">
          <v-card-title>Сообщение администратора</v-card-title>
          <v-card-text>
            <div style="white-space: pre-wrap; background: #e3f2fd; padding: 16px; border-radius: 4px">
              {{ review.adminMessage }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="sticky-top">
          <v-card-title>Детали отзыва</v-card-title>
          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Рейтинг</div>
              <div style="color: #ffa500; font-size: 1.5rem">
                {{ '★'.repeat(review.rating || 0) }}{{ '☆'.repeat(5 - (review.rating || 0)) }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Статус</div>
              <v-chip
                :color="getStatusColor(review.status)"
                size="small"
                variant="flat"
              >
                {{ getStatusLabel(review.status) }}
              </v-chip>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-2">
              <div class="text-caption text-grey">Дата создания</div>
              <div>{{ formatDate(review.createdAt) }}</div>
            </div>

            <div class="mb-2" v-if="review.moderatedAt">
              <div class="text-caption text-grey">Дата модерации</div>
              <div>{{ formatDate(review.moderatedAt) }}</div>
            </div>

            <div v-if="review.moderator">
              <v-divider class="my-4"></v-divider>
              <div class="text-caption text-grey">Модератор</div>
              <div>{{ review.moderator.fullName || review.moderator.username }}</div>
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
const review = ref(null)

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
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
    'PENDING': 'warning',
    'APPROVED': 'success',
    'REJECTED': 'error'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    'PENDING': 'На модерации',
    'APPROVED': 'Одобрен',
    'REJECTED': 'Отклонен'
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    const data = await api.getOne('reviews', route.params.id)
    review.value = data
  } catch (error) {
    console.error('Ошибка загрузки отзыва:', error)
  }
})
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 20px;
}
</style>
