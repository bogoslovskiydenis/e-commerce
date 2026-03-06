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
        <h1 class="text-h4 mb-4">{{ page.title }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Контент</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Заголовок</div>
                <div class="text-h6">{{ page.title }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">URL</div>
                <div class="text-monospace">{{ page.slug }}</div>
              </v-col>
              <v-col cols="12" v-if="page.excerpt">
                <div class="text-caption text-grey mb-2">Краткое описание</div>
                <div>{{ page.excerpt }}</div>
              </v-col>
              <v-col cols="12">
                <div class="text-caption text-grey mb-2">Содержимое</div>
                <div style="white-space: pre-wrap">{{ page.content }}</div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Настройки</v-card-title>
          <v-card-text>
            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Статус</div>
              <v-chip
                :color="page.active ? 'success' : 'default'"
                size="small"
                variant="flat"
              >
                {{ page.active ? 'Опубликована' : 'Черновик' }}
              </v-chip>
            </div>

            <div class="mb-4">
              <div class="text-caption text-grey mb-2">Шаблон</div>
              <div>{{ getTemplateLabel(page.template) }}</div>
            </div>

            <div class="mb-2">
              <div class="text-caption text-grey">Создана</div>
              <div>{{ formatDate(page.createdAt) }}</div>
            </div>

            <div>
              <div class="text-caption text-grey">Обновлена</div>
              <div>{{ formatDate(page.updatedAt) }}</div>
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
const page = ref(null)

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

const getTemplateLabel = (template) => {
  const labels = {
    'default': 'Стандартный',
    'full-width': 'Во всю ширину',
    'sidebar': 'С боковой панелью'
  }
  return labels[template] || template
}

onMounted(async () => {
  try {
    const data = await api.getOne('pages', route.params.id)
    page.value = data
  } catch (error) {
    console.error('Ошибка загрузки страницы:', error)
  }
})
</script>
