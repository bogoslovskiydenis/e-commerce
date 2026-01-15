<template>
  <div v-if="log">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'admin-logs-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Детали лога</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Информация о действии</v-card-title>
          <v-card-text>
            <div class="mb-4">
              <v-chip
                :color="getActionColor(log.action)"
                size="small"
                variant="flat"
                class="mr-2"
              >
                {{ getActionLabel(log.action) }}
              </v-chip>
              <v-chip
                :color="getLevelColor(log.level)"
                size="small"
                variant="flat"
              >
                {{ getLevelLabel(log.level) }}
              </v-chip>
            </div>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Время</div>
                <div>{{ formatDate(log.timestamp) }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Ресурс</div>
                <div>{{ log.resource || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6" v-if="log.resourceId">
                <div class="text-caption text-grey">ID ресурса</div>
                <div>{{ log.resourceId }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">IP адрес</div>
                <div class="text-monospace">{{ log.ip || '-' }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Описание</div>
                <div>{{ log.description || '-' }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card v-if="log.metadata">
          <v-card-title>Дополнительные данные</v-card-title>
          <v-card-text>
            <pre style="background: #f5f5f5; padding: 16px; border-radius: 4px; overflow-x: auto; font-size: 0.875rem; white-space: pre-wrap">{{ JSON.stringify(log.metadata, null, 2) }}</pre>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title>Пользователь</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar size="40" class="mr-3">
                {{ (log.fullName || log.username || '').charAt(0) }}
              </v-avatar>
              <div>
                <div style="font-weight: 500">{{ log.fullName || log.username }}</div>
                <div class="text-caption text-grey">@{{ log.username }}</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>Техническая информация</v-card-title>
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-title>User Agent</v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="text-monospace text-caption" style="word-break: break-all">
                    {{ log.userAgent || '-' }}
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
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
const log = ref(null)

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

const getActionColor = (action) => {
  const colors = {
    'login': 'success',
    'logout': 'info',
    'create': 'primary',
    'edit': 'warning',
    'delete': 'error',
    'view': 'default',
    'security': 'error'
  }
  return colors[action] || 'default'
}

const getActionLabel = (action) => {
  const labels = {
    'login': 'Вход',
    'logout': 'Выход',
    'create': 'Создание',
    'edit': 'Редактирование',
    'delete': 'Удаление',
    'view': 'Просмотр',
    'security': 'Безопасность'
  }
  return labels[action] || action
}

const getLevelColor = (level) => {
  const colors = {
    'info': 'info',
    'warning': 'warning',
    'error': 'error',
    'critical': 'error'
  }
  return colors[level] || 'default'
}

const getLevelLabel = (level) => {
  const labels = {
    'info': 'Инфо',
    'warning': 'Предупреждение',
    'error': 'Ошибка',
    'critical': 'Критично'
  }
  return labels[level] || level
}

onMounted(async () => {
  try {
    const data = await api.getOne('admin-logs', route.params.id)
    log.value = data
  } catch (error) {
    console.error('Ошибка загрузки лога:', error)
  }
})
</script>
