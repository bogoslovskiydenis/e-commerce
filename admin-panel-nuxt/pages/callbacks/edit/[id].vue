<template>
  <div v-if="callback">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'callbacks-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать заявку на обратный звонок</h1>
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
              <v-text-field
                v-model="form.name"
                label="Имя"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.phone"
                label="Телефон"
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
              <v-textarea
                v-model="form.message"
                label="Сообщение"
                variant="outlined"
                rows="4"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Статус и управление</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Статус"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-select
                v-model="form.priority"
                :items="priorityOptions"
                label="Приоритет"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-text-field
                v-model="form.source"
                label="Источник"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.scheduledAt"
                label="Запланировано на"
                type="datetime-local"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <div class="text-caption text-grey mb-2">Создано</div>
              <div>{{ formatDate(callback.createdAt) }}</div>
              <div class="text-caption text-grey mb-2 mt-4" v-if="callback.completedAt">Завершено</div>
              <div v-if="callback.completedAt">{{ formatDate(callback.completedAt) }}</div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>Примечания</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.notes"
                label="Примечания менеджера"
                variant="outlined"
                rows="4"
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
            @click="navigateTo({ name: 'callbacks-index' })"
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
const callback = ref(null)
const loading = ref(false)

const form = reactive({
  id: '',
  name: '',
  phone: '',
  email: '',
  message: '',
  status: 'NEW',
  priority: 'MEDIUM',
  source: '',
  scheduledAt: '',
  notes: ''
})

const statusOptions = [
  { title: 'Новый', value: 'NEW' },
  { title: 'В работе', value: 'IN_PROGRESS' },
  { title: 'Завершен', value: 'COMPLETED' },
  { title: 'Отменен', value: 'CANCELLED' }
]

const priorityOptions = [
  { title: 'Низкий', value: 'LOW' },
  { title: 'Средний', value: 'MEDIUM' },
  { title: 'Высокий', value: 'HIGH' },
  { title: 'Срочный', value: 'URGENT' }
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

const loadCallback = async () => {
  try {
    const data = await api.getOne('callbacks', route.params.id)
    callback.value = data
    
    form.id = data.id
    form.name = data.name || ''
    form.phone = data.phone || ''
    form.email = data.email || ''
    form.message = data.message || ''
    form.status = data.status || 'NEW'
    form.priority = data.priority || 'MEDIUM'
    form.source = data.source || ''
    form.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : ''
    form.notes = data.notes || ''
  } catch (error) {
    console.error('Ошибка загрузки обратного звонка:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      message: form.message || undefined,
      status: form.status,
      priority: form.priority,
      source: form.source || undefined,
      scheduledAt: form.scheduledAt || null,
      notes: form.notes || undefined
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('callbacks', route.params.id, updateData)
    await navigateTo({ name: 'callbacks-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCallback()
})
</script>
