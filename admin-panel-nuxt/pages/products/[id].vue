<template>
  <div v-if="product">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo('/products')"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">{{ product.title }}</h1>
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
                <div class="text-h6">{{ product.id }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Артикул (SKU)</div>
                <div v-if="product.sku" class="text-monospace" style="background: #f5f5f5; padding: 4px 8px; border-radius: 4px; display: inline-block">
                  {{ product.sku }}
                </div>
                <div v-else style="color: #999; font-style: italic">Не указан</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Бренд</div>
                <div>{{ product.brand || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Категория</div>
                <div>{{ product.category?.name || '-' }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Цены</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <div class="text-caption text-grey">Цена</div>
                <div class="text-h6">{{ Number(product.price).toFixed(2) }} грн</div>
              </v-col>
              <v-col cols="12" sm="4" v-if="product.oldPrice">
                <div class="text-caption text-grey">Старая цена</div>
                <div class="text-h6">{{ Number(product.oldPrice).toFixed(2) }} грн</div>
              </v-col>
              <v-col cols="12" sm="4" v-if="product.discount">
                <div class="text-caption text-grey">Скидка</div>
                <v-chip color="error" size="small" variant="flat">
                  -{{ product.discount }}%
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" v-if="product.description">
          <v-card-title>Описание</v-card-title>
          <v-card-text>
            <div style="white-space: pre-wrap">{{ product.description }}</div>
          </v-card-text>
        </v-card>

        <v-card v-if="product.images && product.images.length > 0">
          <v-card-title>Изображения</v-card-title>
          <v-card-text>
            <v-img
              :src="getImageUrl(product.images[0])"
              max-width="300"
              max-height="300"
              cover
            ></v-img>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="sticky-top">
          <v-card-title>Настройки</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Активен:</span>
              <v-chip
                :color="product.isActive ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ product.isActive ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">В наличии:</span>
              <v-chip
                :color="product.inStock ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ product.inStock ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between mb-2" v-if="product.stockQuantity !== undefined">
              <span class="text-grey">Количество:</span>
              <span>{{ product.stockQuantity }}</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Хит продаж:</span>
              <v-chip
                :color="product.featured ? 'primary' : 'default'"
                size="small"
                variant="flat"
              >
                {{ product.featured ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="d-flex justify-space-between">
              <span class="text-grey">Популярный:</span>
              <v-chip
                :color="product.popular ? 'primary' : 'default'"
                size="small"
                variant="flat"
              >
                {{ product.popular ? 'Да' : 'Нет' }}
              </v-chip>
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
const product = ref(null)

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

onMounted(async () => {
  try {
    const data = await api.getOne('products', route.params.id)
    product.value = data
  } catch (error) {
    console.error('Ошибка загрузки товара:', error)
  }
})
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 20px;
}
</style>
