<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Комментарии и отзывы</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Поиск по комментарию или автору"
          single-line
          hide-details
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <v-row>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.status"
              :items="statusOptions"
              label="Статус"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="filters.type"
              :items="typeOptions"
              label="Тип"
              variant="outlined"
              density="compact"
              clearable
            ></v-select>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="comments"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.createdAt="{ item }">
          {{ formatDate(item.createdAt) }}
        </template>

        <template v-slot:item.comment="{ item }">
          <div style="max-width: 400px">
            <div style="font-weight: 500; margin-bottom: 4px">{{ item.subject }}</div>
            <div style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical">
              {{ item.content }}
            </div>
          </div>
        </template>

        <template v-slot:item.record="{ item }">
          <div>
            <div style="color: primary">{{ item.recordType }}</div>
            <div class="text-caption text-grey">ID: {{ item.recordId }}</div>
          </div>
        </template>

        <template v-slot:item.author="{ item }">
          <div>
            <div>{{ item.author?.name || 'Аноним' }}</div>
            <div class="text-caption text-grey">{{ item.author?.email }}</div>
          </div>
        </template>

        <template v-slot:item.user="{ item }">
          <div>
            <div>{{ item.user?.name || 'Гость' }}</div>
            <div class="text-caption text-grey" v-if="item.user?.role">{{ item.user.role }}</div>
          </div>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="flat"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <template v-slot:item.isVisible="{ item }">
          {{ item.isVisible ? 'Да' : 'Нет' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-eye"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'comments-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'comments-edit-id', params: { id: item.id } })"
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
const comments = ref([])
const total = ref(0)
const search = ref('')

const pagination = reactive({
  page: 1,
  perPage: 25
})

const filters = reactive({
  status: null,
  type: null
})

const statusOptions = [
  { title: 'Новые', value: 'new' },
  { title: 'Одобренные', value: 'approved' },
  { title: 'Отклоненные', value: 'rejected' },
  { title: 'Спам', value: 'spam' }
]

const typeOptions = [
  { title: 'Комментарий', value: 'comment' },
  { title: 'Отзыв', value: 'review' }
]

const headers = [
  { title: 'Дата', key: 'createdAt', sortable: true },
  { title: 'Комментарий', key: 'comment', sortable: false },
  { title: 'Шаблон', key: 'template', sortable: false },
  { title: 'Запись', key: 'record', sortable: false },
  { title: 'Комментатор', key: 'author', sortable: false },
  { title: 'Пользователь', key: 'user', sortable: false },
  { title: 'Статус', key: 'status', sortable: true },
  { title: 'Отображать', key: 'isVisible', sortable: true },
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

const getStatusColor = (status) => {
  const colors = {
    'new': 'warning',
    'approved': 'success',
    'rejected': 'error',
    'spam': 'default'
  }
  return colors[status] || 'default'
}

const getStatusLabel = (status) => {
  const labels = {
    'new': 'Новый',
    'approved': 'Одобрен',
    'rejected': 'Отклонен',
    'spam': 'Спам'
  }
  return labels[status] || status
}

const loadComments = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }

    if (search.value) {
      params.search = search.value
    }

    if (filters.status) params.status = filters.status
    if (filters.type) params.type = filters.type

    const response = await api.getList('comments', params)
    comments.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки комментариев:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadComments()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadComments()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'comments-edit-id', params: { id: row.item.id } })
}

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

const debouncedSearch = debounce(() => {
  pagination.page = 1
  loadComments()
}, 500)

watch([search, filters], () => {
  debouncedSearch()
})

onMounted(() => {
  loadComments()
})
</script>
