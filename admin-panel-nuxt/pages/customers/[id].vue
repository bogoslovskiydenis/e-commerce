<template>
  <div v-if="customer">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'customers-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Клиент: {{ customer.name }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Основная информация</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Имя</div>
                <div class="text-h6">{{ customer.name }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Email</div>
                <div>
                  <a v-if="customer.email" :href="`mailto:${customer.email}`">
                    {{ customer.email }}
                  </a>
                  <span v-else>Не указан</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Телефон</div>
                <div>
                  <a v-if="customer.phone" :href="`tel:${customer.phone}`">
                    {{ customer.phone }}
                  </a>
                  <span v-else>Не указан</span>
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Адрес</div>
                <div>{{ customer.address || 'Не указан' }}</div>
              </v-col>
              <v-col cols="12" v-if="customer.notes">
                <div class="text-caption text-grey">Примечания</div>
                <div style="white-space: pre-wrap">{{ customer.notes }}</div>
              </v-col>
              <v-col cols="12" v-if="customer.tags && customer.tags.length > 0">
                <div class="text-caption text-grey mb-2">Теги</div>
                <div>
                  <v-chip
                    v-for="(tag, index) in customer.tags"
                    :key="index"
                    class="mr-2 mb-2"
                    size="small"
                    variant="outlined"
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Статистика</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="4">
                <div class="text-caption text-grey">Заказов</div>
                <div class="text-h6">{{ customer._count?.orders || 0 }}</div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-caption text-grey">Отзывов</div>
                <div class="text-h6">{{ customer._count?.reviews || 0 }}</div>
              </v-col>
              <v-col cols="12" sm="4">
                <div class="text-caption text-grey">Обратных звонков</div>
                <div class="text-h6">{{ customer._count?.callbacks || 0 }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Дополнительная информация</v-card-title>
          <v-card-text>
            <div class="d-flex justify-space-between mb-2">
              <span class="text-grey">Активен:</span>
              <v-chip
                :color="customer.isActive ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ customer.isActive ? 'Да' : 'Нет' }}
              </v-chip>
            </div>
            <div class="mt-4">
              <div class="text-caption text-grey">Дата регистрации</div>
              <div>{{ formatDate(customer.createdAt) }}</div>
            </div>
            <div class="mt-2">
              <div class="text-caption text-grey">Последнее обновление</div>
              <div>{{ formatDate(customer.updatedAt) }}</div>
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
const customer = ref(null)

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

onMounted(async () => {
  try {
    const data = await api.getOne('customers', route.params.id)
    customer.value = data
  } catch (error) {
    console.error('Ошибка загрузки клиента:', error)
  }
})
</script>
