<template>
  <div>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Дашборд</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Всего заказов</div>
            <div class="text-h4">{{ stats.totalOrders || 0 }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Товаров</div>
            <div class="text-h4">{{ stats.totalProducts || 0 }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Клиентов</div>
            <div class="text-h4">{{ stats.totalCustomers || 0 }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Выручка</div>
            <div class="text-h4">{{ stats.revenue || 0 }} грн</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const stats = ref({
  totalOrders: 0,
  totalProducts: 0,
  totalCustomers: 0,
  revenue: 0
})

onMounted(async () => {
  try {
    const response = await api.request('/stats')
    if (response.data) {
      stats.value = response.data
    }
  } catch (error) {
    console.error('Ошибка загрузки статистики:', error)
  }
})
</script>
