<template>
  <div v-if="comment">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'comments-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Просмотр комментария</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Основная информация</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Тема</div>
                <div class="text-h6">{{ comment.subject }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Содержание</div>
                <div style="white-space: pre-wrap">{{ comment.content }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-2">Автор</div>
                <div>{{ comment.author?.name || 'Аноним' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey mb-2">Email автора</div>
                <div>{{ comment.author?.email || '-' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Дата создания</div>
                <div>{{ formatDate(comment.createdAt) }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-if="comment.adminMessage">
          <v-card-title>Сообщение администратора</v-card-title>
          <v-card-text>
            <div style="white-space: pre-wrap; background: #e3f2fd; padding: 16px; border-radius: 4px">
              {{ comment.adminMessage }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Дополнительная информация</v-card-title>
          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Статус</div>
              <v-chip
                :color="getStatusColor(comment.status)"
                size="small"
                variant="flat"
              >
                {{ getStatusLabel(comment.status) }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Отображается</div>
              <v-chip
                :color="comment.isVisible ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ comment.isVisible ? 'Да' : 'Нет' }}
              </v-chip>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="mb-2" v-if="comment.recordType">
              <div class="text-caption text-grey">Тип записи</div>
              <div>{{ comment.recordType }}</div>
            </div>

            <div class="mb-2" v-if="comment.recordId">
              <div class="text-caption text-grey">ID записи</div>
              <div>{{ comment.recordId }}</div>
            </div>

            <div v-if="comment.template">
              <div class="text-caption text-grey">Шаблон</div>
              <div>{{ comment.template }}</div>
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
const comment = ref(null)

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
    'approved': 'success',
    'rejected': 'error',
    'spam': 'default'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    'new': 'Новый',
    'approved': 'Одобрен',
    'rejected': 'Отклонен',
    'spam': 'Спам'
  }
  return labels[status] || status
}

onMounted(async () => {
  try {
    const data = await api.getOne('comments', route.params.id)
    comment.value = data
  } catch (error) {
    console.error('Ошибка загрузки комментария:', error)
  }
})
</script>
