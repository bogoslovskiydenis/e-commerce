<template>
  <div v-if="page">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'pages-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать страницу: {{ page.title }}</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="content">
          <v-icon start>mdi-text</v-icon>
          Контент
        </v-tab>
        <v-tab value="seo">
          <v-icon start>mdi-search-web</v-icon>
          SEO
        </v-tab>
        <v-tab value="settings">
          <v-icon start>mdi-cog</v-icon>
          Настройки
        </v-tab>
      </v-tabs>

      <v-form @submit.prevent="handleSubmit">
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="content">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="form.title"
                    label="Заголовок страницы"
                    variant="outlined"
                    required
                    class="mb-4"
                  ></v-text-field>
                  <v-text-field
                    v-model="form.slug"
                    label="URL (slug)"
                    variant="outlined"
                    required
                    hint="Используйте только латинские буквы, цифры и дефисы"
                    class="mb-4"
                  ></v-text-field>
                  <v-textarea
                    v-model="form.excerpt"
                    label="Краткое описание"
                    variant="outlined"
                    rows="2"
                    hint="Краткое описание для предпросмотра"
                    class="mb-4"
                  ></v-textarea>
                  <v-textarea
                    v-model="form.content"
                    label="Содержимое страницы"
                    variant="outlined"
                    rows="10"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="seo">
              <v-row>
                <v-col cols="12">
                  <v-alert type="info" class="mb-4">
                    Заполните эти поля для улучшения позиций страницы в поисковых системах
                  </v-alert>
                  <v-text-field
                    v-model="form.metaTitle"
                    label="Meta Title"
                    variant="outlined"
                    hint="Рекомендуется до 60 символов"
                    class="mb-4"
                  ></v-text-field>
                  <v-textarea
                    v-model="form.metaDescription"
                    label="Meta Description"
                    variant="outlined"
                    rows="3"
                    hint="Рекомендуется до 160 символов"
                    class="mb-4"
                  ></v-textarea>
                  <v-text-field
                    v-model="form.metaKeywords"
                    label="Ключевые слова"
                    variant="outlined"
                    hint="Через запятую"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="settings">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="form.template"
                    :items="templateOptions"
                    label="Шаблон страницы"
                    variant="outlined"
                    class="mb-4"
                  ></v-select>
                  <v-checkbox
                    v-model="form.active"
                    label="Опубликовать страницу"
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
            Сохранить
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo({ name: 'pages-index' })"
          >
            Отмена
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
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
const page = ref(null)
const loading = ref(false)
const tab = ref('content')

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  template: 'default',
  active: true
})

const templateOptions = [
  { title: 'Стандартный', value: 'default' },
  { title: 'Во всю ширину', value: 'full-width' },
  { title: 'С боковой панелью', value: 'sidebar' }
]

const loadPage = async () => {
  try {
    const data = await api.getOne('pages', route.params.id)
    page.value = data
    
    form.title = data.title || ''
    form.slug = data.slug || ''
    form.excerpt = data.excerpt || ''
    form.content = data.content || ''
    form.metaTitle = data.metaTitle || ''
    form.metaDescription = data.metaDescription || ''
    form.metaKeywords = data.metaKeywords || ''
    form.template = data.template || 'default'
    form.active = data.active !== undefined ? data.active : true
  } catch (error) {
    console.error('Ошибка загрузки страницы:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      metaKeywords: form.metaKeywords || undefined,
      template: form.template,
      active: form.active
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('pages', route.params.id, updateData)
    await navigateTo({ name: 'pages-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPage()
})
</script>
