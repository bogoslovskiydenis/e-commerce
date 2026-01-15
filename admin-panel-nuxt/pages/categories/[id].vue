<template>
  <div v-if="category">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'categories-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">{{ category.name }}</h1>
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
                <div class="text-h6">{{ category.id }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">URL (slug)</div>
                <div class="text-monospace">{{ category.slug || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Тип</div>
                <v-chip
                  :color="getTypeColor(category.type)"
                  size="small"
                  variant="flat"
                >
                  {{ getTypeLabel(category.type) }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Родительская категория</div>
                <div>{{ category.parent?.name || '-' }}</div>
              </v-col>
              <v-col cols="12" v-if="category.description">
                <div class="text-caption text-grey">Описание</div>
                <div style="white-space: pre-wrap">{{ category.description }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Настройки</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Активна:</span>
              <v-chip
                :color="category.isActive ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ category.isActive ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">В навигации:</span>
              <v-chip
                :color="category.showInNavigation ? 'info' : 'default'"
                size="small"
                variant="flat"
              >
                {{ category.showInNavigation ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">На главной:</span>
              <v-chip
                :color="category.showOnHomepage ? 'primary' : 'default'"
                size="small"
                variant="flat"
              >
                {{ category.showOnHomepage ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="mt-4">
              <div class="text-caption text-grey">Порядок сортировки</div>
              <div>{{ category.sortOrder || 0 }}</div>
            </div>
            <div class="mt-2">
              <div class="text-caption text-grey">Товаров в категории</div>
              <div>{{ category.productsCount || category._count?.products || 0 }}</div>
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
const category = ref(null)

const getTypeColor = (type) => {
  return 'primary'
}

const getTypeLabel = (type) => {
  const labels = {
    'products': 'Товары',
    'balloons': 'Шарики',
    'bouquets': 'Букеты',
    'gifts': 'Подарки',
    'cups': 'Стаканчики',
    'sets': 'Наборы',
    'events': 'События',
    'colors': 'Цвета',
    'materials': 'Материалы',
    'occasions': 'Поводы',
    'PRODUCTS': 'Товары',
    'BALLOONS': 'Шарики',
    'BOUQUETS': 'Букеты',
    'GIFTS': 'Подарки',
    'CUPS': 'Стаканчики',
    'SETS': 'Наборы',
    'EVENTS': 'События',
    'COLORS': 'Цвета',
    'MATERIALS': 'Материалы',
    'OCCASIONS': 'Поводы'
  }
  return labels[type] || type
}

onMounted(async () => {
  try {
    const data = await api.getOne('categories', route.params.id)
    category.value = data
  } catch (error) {
    console.error('Ошибка загрузки категории:', error)
  }
})
</script>
