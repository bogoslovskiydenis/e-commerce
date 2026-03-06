<template>
  <div v-if="page">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo('/pages')"
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
        <v-tab value="content">Контент</v-tab>
        <v-tab value="lang">Языки (УКР / РУС / EN)</v-tab>
        <v-tab value="seo">SEO</v-tab>
        <v-tab value="settings">Настройки</v-tab>
      </v-tabs>

      <v-form @submit.prevent="handleSubmit">
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="content">
              <v-row>
                <v-col cols="12">
                  <v-alert type="info" density="compact" class="mb-4">Основные поля (fallback), если нет перевода для языка.</v-alert>
                  <v-text-field
                    v-model="form.title"
                    label="Заголовок"
                    variant="outlined"
                    required
                    class="mb-4"
                  />
                  <v-text-field
                    v-model="form.slug"
                    label="URL (slug)"
                    variant="outlined"
                    required
                    hint="Только латиница, цифры, дефис"
                    class="mb-4"
                  />
                  <v-textarea
                    v-model="form.excerpt"
                    label="Краткое описание"
                    variant="outlined"
                    rows="2"
                    class="mb-4"
                  />
                  <v-textarea
                    v-model="form.content"
                    label="Содержимое (HTML)"
                    variant="outlined"
                    rows="10"
                    required
                  />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="lang">
              <v-tabs v-model="langTab" density="compact">
                <v-tab value="uk">Українська</v-tab>
                <v-tab value="ru">Русский</v-tab>
                <v-tab value="en">English</v-tab>
              </v-tabs>
              <v-window v-model="langTab" class="mt-4">
                <v-window-item value="uk">
                  <v-text-field v-model="form.titleUk" label="Заголовок (УКР)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.excerptUk" label="Краткое описание (УКР)" variant="outlined" rows="2" class="mb-3" />
                  <v-textarea v-model="form.contentUk" label="Содержимое HTML (УКР)" variant="outlined" rows="8" class="mb-3" />
                  <v-text-field v-model="form.metaTitleUk" label="Meta Title (УКР)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.metaDescriptionUk" label="Meta Description (УКР)" variant="outlined" rows="2" />
                </v-window-item>
                <v-window-item value="ru">
                  <v-text-field v-model="form.titleRu" label="Заголовок (РУС)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.excerptRu" label="Краткое описание (РУС)" variant="outlined" rows="2" class="mb-3" />
                  <v-textarea v-model="form.contentRu" label="Содержимое HTML (РУС)" variant="outlined" rows="8" class="mb-3" />
                  <v-text-field v-model="form.metaTitleRu" label="Meta Title (РУС)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.metaDescriptionRu" label="Meta Description (РУС)" variant="outlined" rows="2" />
                </v-window-item>
                <v-window-item value="en">
                  <v-text-field v-model="form.titleEn" label="Title (EN)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.excerptEn" label="Excerpt (EN)" variant="outlined" rows="2" class="mb-3" />
                  <v-textarea v-model="form.contentEn" label="Content HTML (EN)" variant="outlined" rows="8" class="mb-3" />
                  <v-text-field v-model="form.metaTitleEn" label="Meta Title (EN)" variant="outlined" class="mb-3" />
                  <v-textarea v-model="form.metaDescriptionEn" label="Meta Description (EN)" variant="outlined" rows="2" />
                </v-window-item>
              </v-window>
            </v-window-item>

            <v-window-item value="seo">
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="form.metaTitle" label="Meta Title (fallback)" variant="outlined" class="mb-4" />
                  <v-textarea v-model="form.metaDescription" label="Meta Description (fallback)" variant="outlined" rows="3" class="mb-4" />
                  <v-text-field v-model="form.metaKeywords" label="Ключевые слова" variant="outlined" hint="Через запятую" />
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item value="settings">
              <v-row>
                <v-col cols="12">
                  <v-select
                    v-model="form.template"
                    :items="templateOptions"
                    label="Шаблон"
                    variant="outlined"
                    class="mb-4"
                  />
                  <v-checkbox v-model="form.isActive" label="Опубликовать страницу" />
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-card-actions>
          <v-btn type="submit" color="primary" :loading="loading" prepend-icon="mdi-content-save">Сохранить</v-btn>
          <v-btn class="ml-2" variant="text" @click="navigateTo('/pages')">Отмена</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>

  <v-progress-circular v-else indeterminate />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()
const page = ref(null)
const loading = ref(false)
const tab = ref('content')
const langTab = ref('uk')

const form = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  titleUk: '', titleRu: '', titleEn: '',
  excerptUk: '', excerptRu: '', excerptEn: '',
  contentUk: '', contentRu: '', contentEn: '',
  metaTitle: '', metaDescription: '', metaKeywords: '',
  metaTitleUk: '', metaTitleRu: '', metaTitleEn: '',
  metaDescriptionUk: '', metaDescriptionRu: '', metaDescriptionEn: '',
  template: 'default',
  isActive: true
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
    form.title = data.title ?? ''
    form.slug = data.slug ?? ''
    form.excerpt = data.excerpt ?? ''
    form.content = data.content ?? ''
    form.titleUk = data.titleUk ?? ''
    form.titleRu = data.titleRu ?? ''
    form.titleEn = data.titleEn ?? ''
    form.excerptUk = data.excerptUk ?? ''
    form.excerptRu = data.excerptRu ?? ''
    form.excerptEn = data.excerptEn ?? ''
    form.contentUk = data.contentUk ?? ''
    form.contentRu = data.contentRu ?? ''
    form.contentEn = data.contentEn ?? ''
    form.metaTitle = data.metaTitle ?? ''
    form.metaDescription = data.metaDescription ?? ''
    form.metaKeywords = data.metaKeywords ?? ''
    form.metaTitleUk = data.metaTitleUk ?? ''
    form.metaTitleRu = data.metaTitleRu ?? ''
    form.metaTitleEn = data.metaTitleEn ?? ''
    form.metaDescriptionUk = data.metaDescriptionUk ?? ''
    form.metaDescriptionRu = data.metaDescriptionRu ?? ''
    form.metaDescriptionEn = data.metaDescriptionEn ?? ''
    form.template = data.template ?? 'default'
    form.isActive = data.isActive !== undefined ? data.isActive : true
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
      titleUk: form.titleUk || undefined,
      titleRu: form.titleRu || undefined,
      titleEn: form.titleEn || undefined,
      excerptUk: form.excerptUk || undefined,
      excerptRu: form.excerptRu || undefined,
      excerptEn: form.excerptEn || undefined,
      contentUk: form.contentUk || undefined,
      contentRu: form.contentRu || undefined,
      contentEn: form.contentEn || undefined,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
      metaKeywords: form.metaKeywords || undefined,
      metaTitleUk: form.metaTitleUk || undefined,
      metaTitleRu: form.metaTitleRu || undefined,
      metaTitleEn: form.metaTitleEn || undefined,
      metaDescriptionUk: form.metaDescriptionUk || undefined,
      metaDescriptionRu: form.metaDescriptionRu || undefined,
      metaDescriptionEn: form.metaDescriptionEn || undefined,
      template: form.template,
      isActive: form.isActive
    }
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') delete updateData[key]
    })
    await api.update('pages', route.params.id, updateData)
    await navigateTo('/pages')
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => { loadPage() })
</script>
