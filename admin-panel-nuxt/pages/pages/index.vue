<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Страницы сайта</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'pages-create' })"
        >
          Создать страницу
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="pages"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.active="{ item }">
          <v-chip
            :color="item.active ? 'success' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.active ? 'Опубликована' : 'Черновик' }}
          </v-chip>
        </template>

        <template v-slot:item.updatedAt="{ item }">
          {{ formatDate(item.updatedAt) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'pages-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'pages-edit-id', params: { id: item.id } })"
          ></v-btn>
        </template>
      </v-data-table>
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
const loading = ref(false)
const pages = ref([])
const total = ref(0)

const pagination = reactive({
  page: 1,
  perPage: 25
})

const headers = [
  { title: 'Заголовок', key: 'title', sortable: true },
  { title: 'URL', key: 'slug', sortable: true },
  { title: 'Краткое описание', key: 'excerpt', sortable: false },
  { title: 'Шаблон', key: 'template', sortable: true },
  { title: 'Статус', key: 'active', sortable: true },
  { title: 'Обновлена', key: 'updatedAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

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

const loadPages = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }

    const response = await api.getList('pages', params)
    pages.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки страниц:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadPages()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadPages()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'pages-edit-id', params: { id: row.item.id } })
}

onMounted(() => {
  loadPages()
})
</script>
