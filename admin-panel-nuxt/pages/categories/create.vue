<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'categories-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Создать категорию</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <h3 class="text-h6 mb-2">Название категории (многоязычное)</h3>
              <v-row>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.nameUk"
                    label="Название (Украинский)"
                    variant="outlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.nameRu"
                    label="Название (Русский)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="form.nameEn"
                    label="Название (English)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-text-field
                v-model="form.name"
                label="Название (основное, fallback)"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.slug"
                label="URL (slug)"
                variant="outlined"
                class="mb-4"
                hint="Оставьте пустым для автогенерации"
              ></v-text-field>
              <v-select
                v-model="form.type"
                :items="typeOptions"
                label="Тип категории"
                variant="outlined"
                class="mb-4"
              ></v-select>
              <v-select
                v-model="form.parentId"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Родительская категория"
                variant="outlined"
                clearable
              ></v-select>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Описание</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.description"
                label="Описание"
                variant="outlined"
                rows="4"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="mb-4">
            <v-card-title>Настройки</v-card-title>
            <v-card-text>
              <v-text-field
                v-model.number="form.sortOrder"
                label="Порядок сортировки"
                type="number"
                variant="outlined"
                :model-value="0"
                class="mb-4"
              ></v-text-field>
              <v-checkbox
                v-model="form.isActive"
                label="Активна"
                :model-value="true"
              ></v-checkbox>
              <v-checkbox
                v-model="form.showInNavigation"
                label="Показывать в навигации"
                :model-value="true"
              ></v-checkbox>
              <v-checkbox
                v-model="form.showOnHomepage"
                label="Показывать на главной"
                :model-value="false"
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
            @click="navigateTo({ name: 'categories-index' })"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
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

const form = reactive({
  name: '',
  nameUk: '',
  nameRu: '',
  nameEn: '',
  slug: '',
  type: 'products',
  parentId: null,
  description: '',
  sortOrder: 0,
  isActive: true,
  showInNavigation: true,
  showOnHomepage: false
})

const typeOptions = [
  { title: 'Товары', value: 'products' },
  { title: 'Шарики', value: 'balloons' },
  { title: 'Букеты', value: 'bouquets' },
  { title: 'Подарки', value: 'gifts' },
  { title: 'Стаканчики', value: 'cups' },
  { title: 'Наборы', value: 'sets' },
  { title: 'События', value: 'events' },
  { title: 'Цвета', value: 'colors' },
  { title: 'Материалы', value: 'materials' },
  { title: 'Поводы', value: 'occasions' }
]

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
      name: form.name || form.nameUk,
      nameUk: form.nameUk,
      nameRu: form.nameRu,
      nameEn: form.nameEn,
      slug: form.slug || undefined,
      type: form.type,
      parentId: form.parentId || null,
      description: form.description || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
      showInNavigation: form.showInNavigation,
      showOnHomepage: form.showOnHomepage
    }

    Object.keys(createData).forEach(key => {
      if (createData[key] === undefined || createData[key] === null || createData[key] === '') {
        delete createData[key]
      }
    })

    await api.create('categories', createData)
    await navigateTo({ name: 'categories-index' })
  } catch (error) {
    console.error('Ошибка создания:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategories()
})
</script>
