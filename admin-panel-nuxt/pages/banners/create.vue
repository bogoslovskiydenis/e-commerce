<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'banners-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Создать баннер</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.title"
                label="Название"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.subtitle"
                label="Подзаголовок"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-textarea
                v-model="form.description"
                label="Описание"
                variant="outlined"
                rows="3"
                class="mb-4"
              ></v-textarea>
              <v-text-field
                v-model="form.buttonText"
                label="Текст кнопки"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.buttonUrl"
                label="URL кнопки"
                variant="outlined"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Изображения</v-card-title>
            <v-card-text>
              <v-file-input
                v-model="imageFile"
                label="Главное изображение"
                accept="image/*"
                prepend-icon="mdi-camera"
                variant="outlined"
                @change="handleImageChange"
                class="mb-4"
              ></v-file-input>
              <v-img
                v-if="form.imageUrl"
                :src="getImageUrl(form.imageUrl)"
                max-width="300"
                max-height="200"
                cover
              ></v-img>

              <v-file-input
                v-model="mobileImageFile"
                label="Мобильное изображение"
                accept="image/*"
                prepend-icon="mdi-camera"
                variant="outlined"
                @change="handleMobileImageChange"
                class="mb-4 mt-4"
              ></v-file-input>
              <v-img
                v-if="form.mobileImageUrl"
                :src="getImageUrl(form.mobileImageUrl)"
                max-width="300"
                max-height="200"
                cover
              ></v-img>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Настройки</v-card-title>
            <v-card-text>
              <v-select
                v-model="form.position"
                :items="positionOptions"
                label="Позиция"
                variant="outlined"
                class="mb-4"
              ></v-select>
              <v-text-field
                v-model.number="form.sortOrder"
                label="Порядок сортировки"
                type="number"
                variant="outlined"
                :model-value="0"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.startDate"
                label="Дата начала"
                type="datetime-local"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.endDate"
                label="Дата окончания"
                type="datetime-local"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-checkbox
                v-model="form.isActive"
                label="Активен"
                :model-value="true"
              ></v-checkbox>
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
            Создать
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo({ name: 'banners-index' })"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const loading = ref(false)
const imageFile = ref(null)
const mobileImageFile = ref(null)

const form = reactive({
  title: '',
  subtitle: '',
  description: '',
  buttonText: '',
  buttonUrl: '',
  imageUrl: null,
  mobileImageUrl: null,
  position: 'MAIN',
  sortOrder: 0,
  startDate: '',
  endDate: '',
  isActive: true
})

const positionOptions = [
  { title: 'Главная', value: 'MAIN' },
  { title: 'Категория', value: 'CATEGORY' },
  { title: 'Боковая панель', value: 'SIDEBAR' },
  { title: 'Подвал', value: 'FOOTER' },
  { title: 'Всплывающее', value: 'POPUP' }
]

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const config = useRuntimeConfig()
    const authStore = useAuthStore()
    const token = authStore.token

    const response = await fetch(`${config.public.apiBase}/banners/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: formData
    })

    if (response.ok) {
      const result = await response.json()
      return result.data?.url || result.data?.path || ''
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
  }
  return null
}

const handleImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const url = await uploadImage(file)
    if (url) {
      form.imageUrl = url
    }
  }
}

const handleMobileImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const url = await uploadImage(file)
    if (url) {
      form.mobileImageUrl = url
    }
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const createData = {
      title: form.title,
      subtitle: form.subtitle || undefined,
      description: form.description || undefined,
      imageUrl: form.imageUrl || '',
      mobileImageUrl: form.mobileImageUrl || null,
      link: form.buttonUrl || null,
      buttonText: form.buttonText || null,
      position: form.position,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      startDate: form.startDate || null,
      endDate: form.endDate || null
    }

    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined || createData[key] === null || createData[key] === '') {
        delete createData[key]
      }
    })

    await api.create('banners', createData)
    await navigateTo({ name: 'banners-index' })
  } catch (error) {
    console.error('Ошибка создания:', error)
  } finally {
    loading.value = false
  }
}
</script>
