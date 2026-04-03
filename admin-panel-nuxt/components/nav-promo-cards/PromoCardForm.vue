<template>
  <v-form @submit.prevent="handleSubmit">
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="mb-4">
          <v-card-title>Заголовок</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.titleUk" label="Заголовок (Українська)" variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.titleRu" label="Заголовок (Русский)" variant="outlined" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Подзаголовок</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.subtitleUk" label="Підзаголовок (Українська)" variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.subtitleRu" label="Подзаголовок (Русский)" variant="outlined" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Текст ссылки</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.linkTextUk" label="Текст ссылки (Українська)" variant="outlined" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field v-model="form.linkTextRu" label="Текст ссылки (Русский)" variant="outlined" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Иконка / Изображение</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.emoji"
              label="Эмодзи (если нет изображения)"
              variant="outlined"
              placeholder="🎁"
              class="mb-4"
            />
            <v-file-input
              label="Изображение"
              accept="image/*"
              prepend-icon="mdi-image"
              variant="outlined"
              @change="handleImageUpload"
              class="mb-2"
            />
            <v-img
              v-if="form.imageUrl"
              :src="getImageUrl(form.imageUrl)"
              max-width="120"
              max-height="120"
              class="rounded"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="mb-4">
          <v-card-title>Настройки</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="form.link"
              label="Ссылка (URL)"
              variant="outlined"
              class="mb-4"
              placeholder="/category/special"
              :rules="[v => !!v || 'Обязательное поле']"
            />
            <v-text-field
              v-model="form.categoryId"
              label="ID категории (пусто = все)"
              variant="outlined"
              class="mb-4"
              hint="Оставьте пустым, чтобы показывать во всех категориях"
              persistent-hint
            />
            <v-select
              v-model="form.colorTheme"
              :items="themeOptions"
              label="Цветовая тема"
              variant="outlined"
              class="mb-4"
            />
            <v-text-field
              v-model.number="form.sortOrder"
              label="Порядок"
              type="number"
              variant="outlined"
              class="mb-4"
            />
            <v-switch v-model="form.isActive" label="Активна" color="success" />
          </v-card-text>
        </v-card>

        <v-card class="mb-4">
          <v-card-title>Превью</v-card-title>
          <v-card-text>
            <div :class="`promo-preview-card promo-preview-card--${form.colorTheme}`">
              <div class="promo-preview-icon">
                <v-img v-if="form.imageUrl" :src="getImageUrl(form.imageUrl)" width="48" height="48" />
                <span v-else class="text-3xl">{{ form.emoji || '🎁' }}</span>
              </div>
              <div class="font-weight-semibold text-sm mt-2">
                {{ form.titleUk || form.titleRu || 'Заголовок' }}
              </div>
              <div class="text-caption text-grey">{{ form.subtitleUk || form.subtitleRu || 'Подзаголовок' }}</div>
              <div class="text-caption mt-2 promo-link-text">
                {{ form.linkTextUk || form.linkTextRu || 'Переглянути →' }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn type="submit" color="primary" :loading="loading" prepend-icon="mdi-content-save">
          Сохранить
        </v-btn>
        <v-btn class="ml-2" variant="text" @click="navigateTo('/nav-promo-cards')">
          Отмена
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  initial: { type: Object, default: null },
  loading: { type: Boolean, default: false },
})
const emit = defineEmits(['submit'])

const themeOptions = [
  { title: 'Teal (бирюзовый)', value: 'teal' },
  { title: 'Pink (розовый)', value: 'pink' },
  { title: 'Purple (фиолетовый)', value: 'purple' },
  { title: 'Orange (оранжевый)', value: 'orange' },
]

const form = reactive({
  titleUk: '',
  titleRu: '',
  subtitleUk: '',
  subtitleRu: '',
  linkTextUk: '',
  linkTextRu: '',
  emoji: '',
  imageUrl: '',
  link: '',
  categoryId: '',
  colorTheme: 'teal',
  sortOrder: 0,
  isActive: true,
})

watch(() => props.initial, (val) => {
  if (val) Object.assign(form, val)
}, { immediate: true })

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3001${url}`
}

const handleImageUpload = async (event) => {
  const file = event.target?.files?.[0]
  if (!file) return
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await fetch(`${config.public.apiBase}/banners/upload`, {
      method: 'POST',
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {},
      body: fd,
    })
    if (res.ok) {
      const data = await res.json()
      form.imageUrl = data.data?.url || data.data?.path || ''
    }
  } catch (e) {
    console.error(e)
  }
}

const handleSubmit = () => {
  const title = form.titleUk || form.titleRu || ''
  emit('submit', {
    title,
    titleUk: form.titleUk || null,
    titleRu: form.titleRu || null,
    subtitle: form.subtitleUk || form.subtitleRu || null,
    subtitleUk: form.subtitleUk || null,
    subtitleRu: form.subtitleRu || null,
    linkText: form.linkTextUk || form.linkTextRu || null,
    linkTextUk: form.linkTextUk || null,
    linkTextRu: form.linkTextRu || null,
    emoji: form.emoji || null,
    imageUrl: form.imageUrl || null,
    link: form.link,
    categoryId: form.categoryId || null,
    colorTheme: form.colorTheme,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  })
}
</script>

<style scoped>
.promo-preview-card {
  border-radius: 12px;
  padding: 16px;
  border: 1px solid;
}
.promo-preview-card--teal {
  background: linear-gradient(135deg, #e0f7f6, #b2ebf2);
  border-color: #80cbc4;
}
.promo-preview-card--pink {
  background: linear-gradient(135deg, #fce4ec, #f8bbd0);
  border-color: #f48fb1;
}
.promo-preview-card--purple {
  background: linear-gradient(135deg, #ede7f6, #d1c4e9);
  border-color: #ce93d8;
}
.promo-preview-card--orange {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
  border-color: #ffcc80;
}
.promo-preview-icon {
  width: 64px;
  height: 64px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}
.promo-link-text {
  color: #00897b;
  font-weight: 500;
}
</style>
