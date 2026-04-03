<template>
  <div>
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
        <h1 class="text-h4 mb-4">Создать товар</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="basic">
          <v-icon start>mdi-information</v-icon>
          Основная информация
        </v-tab>
        <v-tab value="price">
          <v-icon start>mdi-currency-usd</v-icon>
          Цены и скидки
        </v-tab>
        <v-tab value="description">
          <v-icon start>mdi-text</v-icon>
          Описание
        </v-tab>
        <v-tab value="image">
          <v-icon start>mdi-image</v-icon>
          Изображения
        </v-tab>
        <v-tab value="stock">
          <v-icon start>mdi-package-variant</v-icon>
          Наличие
        </v-tab>
        <v-tab value="settings">
          <v-icon start>mdi-cog</v-icon>
          Настройки
        </v-tab>
      </v-tabs>

      <v-form @submit.prevent="handleSubmit">
        <v-card-text>
          <v-window v-model="tab" class="product-form-tabs-window">
            <!-- Основная информация -->
            <v-window-item value="basic">
              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 mb-2">Название товара (многоязычное)</h3>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.titleUk"
                    label="Название (Украинский)"
                    variant="outlined"
                    required
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
                    label="Название (English)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    label="Название (основное, fallback)"
                    hint="Используется как резервное значение"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.sku"
                    label="Артикул (SKU)"
                    hint="Оставьте пустым для автогенерации"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="form.brand"
                    label="Бренд"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="form.categoryId"
                    :items="categories"
                    item-title="name"
                    item-value="id"
                    label="Категория"
                    variant="outlined"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Цены и скидки -->
            <v-window-item value="price">
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="form.price"
                    label="Цена (₴)"
                    type="number"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="form.oldPrice"
                    label="Старая цена (₴)"
                    type="number"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model.number="form.discount"
                    label="Скидка (%)"
                    type="number"
                    min="0"
                    max="100"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Описание -->
            <v-window-item value="description">
              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 mb-2">Полное описание</h3>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionUk"
                    label="Описание (Украинский)"
                    variant="outlined"
                    rows="8"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionRu"
                    label="Описание (Русский)"
                    variant="outlined"
                    rows="8"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.descriptionEn"
                    label="Описание (English)"
                    variant="outlined"
                    rows="8"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.description"
                    label="Описание (основное, fallback)"
                    variant="outlined"
                    rows="4"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <h3 class="text-h6 mb-2">Краткое описание</h3>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.shortDescriptionUk"
                    label="Краткое описание (Украинский)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.shortDescriptionRu"
                    label="Краткое описание (Русский)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12" md="4">
                  <v-textarea
                    v-model="form.shortDescriptionEn"
                    label="Краткое описание (English)"
                    variant="outlined"
                    rows="3"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.shortDescription"
                    label="Краткое описание (основное, fallback)"
                    variant="outlined"
                    rows="2"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Изображения -->
            <v-window-item value="image">
              <v-row>
                <v-col cols="12">
                  <h3 class="text-h6 mb-2">Изображения товара</h3>
                  <v-file-input
                    v-model="imageFile"
                    label="Главное изображение"
                    accept="image/*"
                    prepend-icon="mdi-camera"
                    variant="outlined"
                    @change="handleImageChange"
                  ></v-file-input>
                  <v-img
                    v-if="form.imageUrl"
                    :src="getImageUrl(form.imageUrl)"
                    max-width="300"
                    max-height="300"
                    class="mt-4"
                    cover
                  ></v-img>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Наличие -->
            <v-window-item value="stock">
              <v-row>
                <v-col cols="12" md="6">
                  <v-checkbox
                    v-model="form.inStock"
                    label="В наличии"
                    :model-value="true"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model.number="form.stockQuantity"
                    label="Количество на складе"
                    type="number"
                    min="0"
                    :model-value="0"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <!-- Настройки -->
            <v-window-item value="settings">
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    v-model="form.isActive"
                    label="Активен"
                    :model-value="true"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="form.featured"
                    label="Хит продаж"
                    :model-value="false"
                  ></v-checkbox>
                </v-col>
                <v-col cols="12">
                  <v-checkbox
                    v-model="form.popular"
                    label="Популярный товар"
                    :model-value="false"
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-card-actions>
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            prepend-icon="mdi-content-save"
          >
            Создать
          </v-btn>
          <v-btn
            variant="text"
            @click="navigateTo('/products')"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const categories = ref([])
const loading = ref(false)
const tab = ref('basic')
const imageFile = ref(null)

const form = reactive({
  title: '',
  titleUk: '',
  titleRu: '',
  titleEn: '',
  sku: '',
  brand: '',
  categoryId: null,
  price: 0,
  oldPrice: null,
  discount: null,
  description: '',
  descriptionUk: '',
  descriptionRu: '',
  descriptionEn: '',
  shortDescription: '',
  shortDescriptionUk: '',
  shortDescriptionRu: '',
  shortDescriptionEn: '',
  imageUrl: null,
  inStock: true,
  stockQuantity: 0,
  isActive: true,
  featured: false,
  popular: false
})

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

const handleImageChange = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

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
      const relativeUrl = result.data?.url || result.data?.path || ''
      const apiBase = config.public.apiBase.replace('/api', '')
      form.imageUrl = relativeUrl.startsWith('http') ? relativeUrl : `${apiBase}${relativeUrl}`
    }
  } catch (error) {
    console.error('Ошибка загрузки изображения:', error)
  }
}

const loadCategories = async () => {
  try {
    const response = await api.getList('categories', { limit: 100 })
    categories.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const createData = {
      title: form.title || form.titleUk,
      titleUk: form.titleUk,
      titleRu: form.titleRu,
      titleEn: form.titleEn,
      sku: form.sku || undefined,
      brand: form.brand || undefined,
      categoryId: form.categoryId,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      discount: form.discount ? Number(form.discount) : undefined,
      description: form.description || form.descriptionUk,
      descriptionUk: form.descriptionUk,
      descriptionRu: form.descriptionRu,
      descriptionEn: form.descriptionEn,
      shortDescription: form.shortDescription || form.shortDescriptionUk,
      shortDescriptionUk: form.shortDescriptionUk,
      shortDescriptionRu: form.shortDescriptionRu,
      shortDescriptionEn: form.shortDescriptionEn,
      images: form.imageUrl ? [form.imageUrl] : [],
      inStock: form.inStock,
      stockQuantity: form.stockQuantity ? Number(form.stockQuantity) : undefined,
      isActive: form.isActive,
      featured: form.featured,
      popular: form.popular
    }

    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined || createData[key] === null || createData[key] === '') {
        delete createData[key]
      }
    })

    await api.create('products', createData)
    await navigateTo('/products')
  } catch (error) {
    console.error('Ошибка создания:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
})
</script>

<style scoped>
.product-form-tabs-window :deep(.v-window__container) {
  margin-top: 10px;
}
</style>
