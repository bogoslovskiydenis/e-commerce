<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Спецпредложения в меню</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" prepend-icon="mdi-plus" @click="navigateTo('/nav-promo-cards/create')">
          Создать карточку
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="cards"
        :loading="loading"
        @click:row="handleRowClick"
      >
        <template v-slot:item.preview="{ item }">
          <div class="d-flex align-center gap-2 py-2">
            <div
              :class="`promo-preview promo-preview--${item.colorTheme || 'teal'}`"
              class="promo-preview"
            >
              <span v-if="!item.imageUrl">{{ item.emoji || '🎁' }}</span>
              <v-img v-else :src="getImageUrl(item.imageUrl)" width="24" height="24" />
            </div>
            <div>
              <div class="font-weight-medium">{{ item.title }}</div>
              <div class="text-caption text-grey">{{ item.subtitle }}</div>
            </div>
          </div>
        </template>

        <template v-slot:item.colorTheme="{ item }">
          <v-chip :color="themeColor(item.colorTheme)" size="small" variant="flat">
            {{ item.colorTheme || 'teal' }}
          </v-chip>
        </template>

        <template v-slot:item.categoryId="{ item }">
          <span class="text-caption">{{ item.categoryId || 'Все категории' }}</span>
        </template>

        <template v-slot:item.isActive="{ item }">
          <v-chip :color="item.isActive ? 'success' : 'default'" size="small" variant="flat">
            {{ item.isActive ? 'Активна' : 'Неактивна' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo(`/nav-promo-cards/edit/${item.id}`)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click.stop="confirmDelete(item)"
          />
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Удалить карточку?</v-card-title>
        <v-card-text>«{{ cardToDelete?.title }}» будет удалена. Действие необратимо.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="handleDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const loading = ref(false)
const cards = ref([])
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const cardToDelete = ref(null)

const headers = [
  { title: 'Карточка', key: 'preview', sortable: false },
  { title: 'Ссылка', key: 'link', sortable: false },
  { title: 'Тема', key: 'colorTheme', sortable: false },
  { title: 'Категория', key: 'categoryId', sortable: false },
  { title: 'Порядок', key: 'sortOrder', sortable: true },
  { title: 'Статус', key: 'isActive', sortable: false },
  { title: 'Действия', key: 'actions', sortable: false },
]

const themeColor = (theme) => {
  const map = { teal: 'teal', pink: 'pink', purple: 'purple', orange: 'orange' }
  return map[theme] || 'teal'
}

const getImageUrl = (url) => {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `http://localhost:3001${url}`
}

const loadCards = async () => {
  loading.value = true
  try {
    const response = await api.getList('nav-promo-cards')
    cards.value = response.data
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const handleRowClick = (event, row) => navigateTo(`/nav-promo-cards/edit/${row.item.id}`)

const confirmDelete = (item) => {
  cardToDelete.value = item
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!cardToDelete.value) return
  deleteLoading.value = true
  try {
    await api.remove('nav-promo-cards', cardToDelete.value.id)
    deleteDialog.value = false
    cardToDelete.value = null
    await loadCards()
  } catch (e) {
    console.error(e)
  } finally {
    deleteLoading.value = false
  }
}

onMounted(loadCards)
</script>

<style scoped>
.promo-preview {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}
.promo-preview--teal { background: linear-gradient(135deg, #e0f7f6, #b2ebf2); }
.promo-preview--pink { background: linear-gradient(135deg, #fce4ec, #f8bbd0); }
.promo-preview--purple { background: linear-gradient(135deg, #ede7f6, #d1c4e9); }
.promo-preview--orange { background: linear-gradient(135deg, #fff3e0, #ffe0b2); }
</style>
