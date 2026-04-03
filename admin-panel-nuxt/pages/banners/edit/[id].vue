<template>
  <div v-if="banner">
    <v-row class="mb-4">
      <v-col cols="12" class="d-flex align-center justify-space-between">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo('/banners')"
        >
          Назад к списку
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-delete"
          @click="deleteDialog = true"
        >
          Удалить баннер
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать баннер: {{ banner.title }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <h3 class="text-subtitle-1 mb-3">Название</h3>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.titleUk"
                    label="Назва (Українська)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.titleRu"
                    label="Название (Русский)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.titleEn"
                    label="Title (English)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <h3 class="text-subtitle-1 mb-3 mt-2">Подзаголовок</h3>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.subtitleUk"
                    label="Підзаголовок (Українська)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.subtitleRu"
                    label="Подзаголовок (Русский)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.subtitleEn"
                    label="Subtitle (English)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <h3 class="text-subtitle-1 mb-3 mt-2">Описание</h3>
              <v-row>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionUk"
                    label="Опис (Українська)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionRu"
                    label="Описание (Русский)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionEn"
                    label="Description (English)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>

              <h3 class="text-subtitle-1 mb-3 mt-2">Текст кнопки</h3>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.buttonTextUk"
                    label="Текст кнопки (Українська)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.buttonTextRu"
                    label="Текст кнопки (Русский)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.buttonTextEn"
                    label="Button text (English)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-text-field
                v-model="form.buttonUrl"
                label="URL кнопки"
                variant="outlined"
                class="mt-2"
              ></v-text-field>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Изображения</v-card-title>
            <v-card-text>
              <div class="mb-4">
                <v-file-input
                  v-model="imageFile"
                  label="Главное изображение"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  @change="handleImageChange"
                ></v-file-input>
                <div v-if="form.imageUrl || banner.imageUrl" class="mt-2 d-flex align-start gap-2">
                  <v-img
                    :src="getImageUrl(form.imageUrl || banner.imageUrl)"
                    max-width="300"
                    max-height="200"
                    cover
                  ></v-img>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    color="error"
                    variant="tonal"
                    class="ml-2"
                    @click="form.imageUrl = ''"
                  ></v-btn>
                </div>
              </div>

              <div>
                <v-file-input
                  v-model="mobileImageFile"
                  label="Мобильное изображение"
                  accept="image/*"
                  prepend-icon="mdi-camera"
                  variant="outlined"
                  @change="handleMobileImageChange"
                ></v-file-input>
                <div v-if="form.mobileImageUrl || banner.mobileImageUrl" class="mt-2 d-flex align-start gap-2">
                  <v-img
                    :src="getImageUrl(form.mobileImageUrl || banner.mobileImageUrl)"
                    max-width="300"
                    max-height="200"
                    cover
                  ></v-img>
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    color="error"
                    variant="tonal"
                    class="ml-2"
                    @click="form.mobileImageUrl = ''"
                  ></v-btn>
                </div>
              </div>
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
            Сохранить
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo('/banners')"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Удалить баннер?</v-card-title>
        <v-card-text>Это действие необратимо. Баннер будет удалён.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="handleDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <v-progress-circular v-else indeterminate></v-progress-circular>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()
const banner = ref(null)
const loading = ref(false)
const deleteLoading = ref(false)
const deleteDialog = ref(false)
const imageFile = ref(null)
const mobileImageFile = ref(null)

const form = reactive({
  title: '',
  titleUk: '',
  titleRu: '',
  titleEn: '',
  subtitleUk: '',
  subtitleRu: '',
  subtitleEn: '',
  descriptionUk: '',
  descriptionRu: '',
  descriptionEn: '',
  buttonTextUk: '',
  buttonTextRu: '',
  buttonTextEn: '',
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
        ...(token && { Authorization: `Bearer ${token}` })
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
    if (url) form.imageUrl = url
  }
}

const handleMobileImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const url = await uploadImage(file)
    if (url) form.mobileImageUrl = url
  }
}

const loadBanner = async () => {
  try {
    const data = await api.getOne('banners', route.params.id)
    banner.value = data

    form.title = data.title || ''
    form.titleUk = data.titleUk || ''
    form.titleRu = data.titleRu || ''
    form.titleEn = data.titleEn || ''
    form.subtitleUk = data.subtitleUk || ''
    form.subtitleRu = data.subtitleRu || ''
    form.subtitleEn = data.subtitleEn || ''
    form.descriptionUk = data.descriptionUk || ''
    form.descriptionRu = data.descriptionRu || ''
    form.descriptionEn = data.descriptionEn || ''
    form.buttonTextUk = data.buttonTextUk || ''
    form.buttonTextRu = data.buttonTextRu || ''
    form.buttonTextEn = data.buttonTextEn || ''
    form.buttonUrl = data.link || ''
    form.imageUrl = data.imageUrl || null
    form.mobileImageUrl = data.mobileImageUrl || null
    form.position = data.position || 'MAIN'
    form.sortOrder = data.sortOrder || 0
    form.startDate = data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : ''
    form.endDate = data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : ''
    form.isActive = data.isActive !== undefined ? data.isActive : true
  } catch (error) {
    console.error('Ошибка загрузки баннера:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      title: form.title || form.titleUk || form.titleRu || form.titleEn,
      titleUk: form.titleUk || undefined,
      titleRu: form.titleRu || undefined,
      titleEn: form.titleEn || undefined,
      subtitleUk: form.subtitleUk || undefined,
      subtitleRu: form.subtitleRu || undefined,
      subtitleEn: form.subtitleEn || undefined,
      descriptionUk: form.descriptionUk || undefined,
      descriptionRu: form.descriptionRu || undefined,
      descriptionEn: form.descriptionEn || undefined,
      buttonText: form.buttonTextUk || form.buttonTextRu || form.buttonTextEn || undefined,
      buttonTextUk: form.buttonTextUk || undefined,
      buttonTextRu: form.buttonTextRu || undefined,
      buttonTextEn: form.buttonTextEn || undefined,
      imageUrl: form.imageUrl || banner.value.imageUrl,
      mobileImageUrl: form.mobileImageUrl || null,
      link: form.buttonUrl || null,
      position: form.position,
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
      startDate: form.startDate || null,
      endDate: form.endDate || null
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key]
    })

    await api.update('banners', route.params.id, updateData)
    await navigateTo('/banners')
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  deleteLoading.value = true
  try {
    await api.remove('banners', route.params.id)
    await navigateTo('/banners')
  } catch (error) {
    console.error('Ошибка удаления:', error)
  } finally {
    deleteLoading.value = false
    deleteDialog.value = false
  }
}

onMounted(() => {
  loadBanner()
})
</script>
