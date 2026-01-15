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
        <h1 class="text-h4 mb-4">Редактирование комментария</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.subject"
                label="Тема"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-textarea
                v-model="form.content"
                label="Содержание"
                variant="outlined"
                rows="6"
                required
                class="mb-4"
              ></v-textarea>
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Статус"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-select
                v-model="form.type"
                :items="typeOptions"
                label="Тип"
                variant="outlined"
                required
              ></v-select>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Автор</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.author.name"
                label="Имя автора"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.author.email"
                label="Email автора"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.author.phone"
                label="Телефон автора"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-divider class="my-4"></v-divider>
              <div class="text-subtitle-2 mb-2">Связанная запись</div>
              <v-text-field
                v-model="form.recordType"
                label="Тип записи"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.recordId"
                label="ID записи"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.template"
                label="Шаблон"
                variant="outlined"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12">
          <v-card>
            <v-card-title>Настройки отображения</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.isVisible"
                :items="visibilityOptions"
                label="Отображать на сайте"
                variant="outlined"
                class="mb-4"
              ></v-select>
              <v-textarea
                v-model="form.adminMessage"
                label="Сообщение администратора"
                variant="outlined"
                rows="4"
                hint="Видно только в админке"
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
            @click="navigateTo({ name: 'comments-index' })"
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
const comment = ref(null)
const loading = ref(false)

const form = reactive({
  subject: '',
  content: '',
  status: 'new',
  type: 'comment',
  author: {
    name: '',
    email: '',
    phone: ''
  },
  recordType: '',
  recordId: '',
  template: '',
  isVisible: true,
  adminMessage: ''
})

const statusOptions = [
  { title: 'Новый', value: 'new' },
  { title: 'Одобрен', value: 'approved' },
  { title: 'Отклонен', value: 'rejected' },
  { title: 'Спам', value: 'spam' }
]

const typeOptions = [
  { title: 'Комментарий', value: 'comment' },
  { title: 'Отзыв', value: 'review' }
]

const visibilityOptions = [
  { title: 'Да', value: true },
  { title: 'Нет', value: false }
]

const loadComment = async () => {
  try {
    const data = await api.getOne('comments', route.params.id)
    comment.value = data
    
    form.subject = data.subject || ''
    form.content = data.content || ''
    form.status = data.status || 'new'
    form.type = data.type || 'comment'
    form.author = {
      name: data.author?.name || '',
      email: data.author?.email || '',
      phone: data.author?.phone || ''
    }
    form.recordType = data.recordType || ''
    form.recordId = data.recordId || ''
    form.template = data.template || ''
    form.isVisible = data.isVisible !== undefined ? data.isVisible : true
    form.adminMessage = data.adminMessage || ''
  } catch (error) {
    console.error('Ошибка загрузки комментария:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const statusMap = {
      'new': 'PENDING',
      'approved': 'APPROVED',
      'rejected': 'REJECTED',
      'spam': 'REJECTED'
    }

    const updateData = {
      status: statusMap[form.status] || form.status.toUpperCase(),
      name: form.author.name,
      email: form.author.email || undefined,
      comment: form.content,
      isVisible: form.isVisible,
      adminMessage: form.adminMessage || undefined
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('comments', route.params.id, updateData)
    await navigateTo({ name: 'comments-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadComment()
})
</script>
