<template>
  <div v-if="user">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'admin-users-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Информация о пользователе</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon start>mdi-account</v-icon>
            Основная информация
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">ID</div>
                <div class="text-monospace text-h6">{{ user.id }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Логин</div>
                <div class="text-h6">{{ user.username }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Email</div>
                <div class="text-monospace">{{ user.email }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Имя</div>
                <div>{{ user.firstName || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Фамилия</div>
                <div>{{ user.lastName || '-' }}</div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Роль</div>
                <v-chip
                  :color="getRoleColor(user.role)"
                  size="small"
                  variant="flat"
                >
                  {{ getRoleLabel(user.role) }}
                </v-chip>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption text-grey">Статус</div>
                <v-chip
                  :color="user.isActive ? 'success' : 'error'"
                  size="small"
                  variant="flat"
                >
                  {{ user.isActive ? 'Активен' : 'Заблокирован' }}
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>
            <v-icon start>mdi-shield-lock</v-icon>
            Безопасность и активность
          </v-card-title>
          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Двухфакторная аутентификация</div>
              <v-chip
                :color="user.twoFactorEnabled ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ user.twoFactorEnabled ? 'Включена' : 'Отключена' }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Последний вход</div>
              <div class="text-monospace">{{ user.lastLogin ? formatDate(user.lastLogin) : 'Никогда' }}</div>
            </div>

            <div class="mb-4" v-if="user.lastLoginIp">
              <div class="text-caption text-grey mb-2">IP последнего входа</div>
              <div class="text-monospace">{{ user.lastLoginIp }}</div>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Дата создания</div>
              <div class="text-monospace">{{ formatDate(user.createdAt) }}</div>
            </div>

            <div>
              <div class="text-caption text-grey mb-2">Последнее обновление</div>
              <div class="text-monospace">{{ formatDate(user.updatedAt) }}</div>
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
const user = ref(null)

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

const getRoleColor = (role) => {
  const colors = {
    'SUPER_ADMIN': 'error',
    'ADMINISTRATOR': 'error',
    'MANAGER': 'warning',
    'CRM_MANAGER': 'info'
  }
  return colors[role] || 'default'
}

const getRoleLabel = (role) => {
  const labels = {
    'SUPER_ADMIN': 'Супер админ',
    'ADMINISTRATOR': 'Администратор',
    'MANAGER': 'Менеджер',
    'CRM_MANAGER': 'CRM Менеджер'
  }
  return labels[role] || role
}

onMounted(async () => {
  try {
    const data = await api.getOne('admin-users', route.params.id)
    user.value = data
  } catch (error) {
    console.error('Ошибка загрузки пользователя:', error)
  }
})
</script>
