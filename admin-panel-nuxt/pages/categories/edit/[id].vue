<template>
  <div v-if="category">
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
        <h1 class="text-h4 mb-4">Редактировать категорию: {{ category.name }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
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
                :items="parentCategories"
                item-title="name"
                item-value="id"
                label="Родительская категория"
                variant="outlined"
                clearable
              ></v-select>
            </v-card-text>
          </v-card>

          <v-card class="mb-4">
            <v-card-title>Фильтры витрины</v-card-title>
            <v-card-text>
              <CategoryFiltersBuilder
                :key="String(route.params.id)"
                v-model="filterForm"
              />
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
                class="mb-4"
              ></v-text-field>
              <v-checkbox
                v-model="form.isActive"
                label="Активна"
              ></v-checkbox>
              <v-checkbox
                v-model="form.showInNavigation"
                label="Показывать в навигации"
              ></v-checkbox>
              <v-checkbox
                v-model="form.showOnHomepage"
                label="Показывать на главной"
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
            @click="navigateTo({ name: 'categories-index' })"
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { parseFiltersFromApi, serializeFiltersForApi } from '~/composables/useCategoryFiltersForm'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()
const category = ref(null)
const categories = ref([])
const loading = ref(false)

const filterForm = ref({ useCustom: false, facets: [] })

const form = reactive({
  id: '',
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
  { title: 'Поводы', value: 'occasions' },
  { title: 'Техника', value: 'TECH' }
]

const parentCategories = computed(() => {
  return categories.value.filter(cat => cat.id !== category.value?.id)
})

const loadCategories = async () => {
  try {
    const response = await api.getList('categories', { limit: 100 })
    categories.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  }
}

const loadCategory = async () => {
  try {
    const data = await api.getOne('categories', route.params.id)

    form.id = data.id
    form.name = data.name || ''
    form.nameUk = data.nameUk || ''
    form.nameRu = data.nameRu || ''
    form.nameEn = data.nameEn || ''
    form.slug = data.slug || ''
    form.type = data.type || 'products'
    form.parentId = data.parentId || null
    form.description = data.description || ''
    form.sortOrder = data.sortOrder || 0
    form.isActive = data.isActive !== undefined ? data.isActive : true
    form.showInNavigation = data.showInNavigation !== undefined ? data.showInNavigation : true
    form.showOnHomepage = data.showOnHomepage || false
    filterForm.value = parseFiltersFromApi(data.filters)
    category.value = data
  } catch (error) {
    console.error('Ошибка загрузки категории:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const filtersPayload = serializeFiltersForApi(
      filterForm.value.useCustom,
      filterForm.value.facets
    )

    const updateData = {
      name: form.name || form.nameUk,
      nameUk: form.nameUk,
      nameRu: form.nameRu,
      nameEn: form.nameEn,
      slug: form.slug,
      type: form.type,
      parentId: form.parentId || null,
      description: form.description || undefined,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
      showInNavigation: form.showInNavigation,
      showOnHomepage: form.showOnHomepage
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    updateData.filters = filtersPayload

    await api.update('categories', route.params.id, updateData)
    await navigateTo({ name: 'categories-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadCategories()
  await loadCategory()
})
</script>
