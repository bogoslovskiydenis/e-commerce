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
        <h1 class="text-h4 mb-4">Промокод: {{ promotion.name }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Основная информация</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">ID</div>
                <div class="text-h6">{{ promotion.id }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Код</div>
                <div class="text-h6">{{ promotion.code || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Тип</div>
                <v-chip
                  :color="getTypeColor(promotion.type)"
                  size="small"
                  variant="flat"
                >
                  {{ getTypeLabel(promotion.type) }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Значение</div>
                <div class="text-h6">{{ getValueDisplay(promotion) }}</div>
              </v-col>
              <v-col cols="12" v-if="promotion.description">
                <div class="text-caption text-grey">Описание</div>
                <div>{{ promotion.description }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-if="promotion.products && promotion.products.length > 0">
          <v-card-title>Товары</v-card-title>
          <v-card-text>
            <div>
              <v-chip
                v-for="(pp, index) in promotion.products"
                :key="pp.product?.id || index"
                class="mr-2 mb-2"
                size="small"
                variant="outlined"
              >
                {{ pp.product?.title || 'Неизвестный товар' }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Ограничения и статус</v-card-title>
          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Статус</div>
              <v-chip
                :color="getStatusColor(promotion)"
                size="small"
                variant="flat"
              >
                {{ getStatusLabel(promotion) }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Использовано</div>
              <v-chip
                :color="getUsageColor(promotion)"
                size="small"
                variant="flat"
              >
                {{ getUsageDisplay(promotion) }}
              </v-chip>
            </div>

            <div class="mb-2" v-if="promotion.minOrderAmount">
              <div class="text-caption text-grey">Мин. сумма заказа</div>
              <div>{{ Number(promotion.minOrderAmount).toLocaleString('uk-UA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }} грн</div>
            </div>

            <div class="mb-2" v-if="promotion.maxUsage">
              <div class="text-caption text-grey">Макс. использований</div>
              <div>{{ promotion.maxUsage }}</div>
            </div>

            <div class="mb-2" v-if="promotion.startDate">
              <div class="text-caption text-grey">Дата начала</div>
              <div>{{ formatDate(promotion.startDate) }}</div>
            </div>

            <div class="mb-2" v-if="promotion.endDate">
              <div class="text-caption text-grey">Дата окончания</div>
              <div>{{ formatDate(promotion.endDate) }}</div>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-2">
              <div class="text-caption text-grey">Создано</div>
              <div>{{ formatDate(promotion.createdAt) }}</div>
            </div>

            <div>
              <div class="text-caption text-grey">Обновлено</div>
              <div>{{ formatDate(promotion.updatedAt) }}</div>
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
const promotion = ref(null)

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

const getTypeColor = (type) => {
  const colors = {
    'PERCENTAGE': 'primary',
    'FIXED_AMOUNT': 'success',
    'FREE_SHIPPING': 'info',
    'BUY_ONE_GET_ONE': 'warning'
  }
  return colors[type] || 'default'
}

const getTypeLabel = (type) => {
  const labels = {
    'PERCENTAGE': 'Процент',
    'FIXED_AMOUNT': 'Фиксированная сумма',
    'FREE_SHIPPING': 'Бесплатная доставка',
    'BUY_ONE_GET_ONE': '1+1'
  }
  return labels[type] || type
}

const getValueDisplay = (item) => {
  if (item.type === 'PERCENTAGE') {
    return `${item.value}%`
  } else if (item.type === 'FIXED_AMOUNT') {
    return `${item.value} грн`
  } else {
    return '—'
  }
}

const getStatusColor = (item) => {
  const now = new Date()
  const isActive = item.isActive
  const startDate = item.startDate ? new Date(item.startDate) : null
  const endDate = item.endDate ? new Date(item.endDate) : null

  if (!isActive) return 'default'
  if (startDate && startDate > now) return 'info'
  if (endDate && endDate < now) return 'error'
  return 'success'
}

const getStatusLabel = (item) => {
  const now = new Date()
  const isActive = item.isActive
  const startDate = item.startDate ? new Date(item.startDate) : null
  const endDate = item.endDate ? new Date(item.endDate) : null

  if (!isActive) return 'Неактивна'
  if (startDate && startDate > now) return 'Запланирована'
  if (endDate && endDate < now) return 'Истекла'
  return 'Активна'
}

const getUsageColor = (item) => {
  const usedCount = item.usedCount || 0
  const maxUsage = item.maxUsage
  if (maxUsage && usedCount >= maxUsage) return 'error'
  return 'default'
}

const getUsageDisplay = (item) => {
  const usedCount = item.usedCount || 0
  const maxUsage = item.maxUsage
  if (maxUsage) {
    return `${usedCount} / ${maxUsage}`
  }
  return usedCount.toString()
}

onMounted(async () => {
  try {
    const data = await api.getOne('promotions', route.params.id)
    promotion.value = data
  } catch (error) {
    console.error('Ошибка загрузки промокода:', error)
  }
})
</script>
