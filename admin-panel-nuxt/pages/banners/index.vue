<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <h1 class="text-h4">Баннеры</h1>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="navigateTo({ name: 'banners-create' })"
        >
          Создать баннер
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-data-table
        :headers="headers"
        :items="banners"
        :loading="loading"
        :items-per-page="pagination.perPage"
        :page="pagination.page"
        :server-items-length="total"
        @update:page="handlePageChange"
        @update:items-per-page="handlePerPageChange"
        @click:row="handleRowClick"
      >
        <template v-slot:item.image="{ item }">
          <v-img
            v-if="item.imageUrl"
            :src="getImageUrl(item.imageUrl)"
            width="100"
            height="60"
            cover
            style="border-radius: 4px"
          ></v-img>
          <span v-else>Нет изображения</span>
        </template>

        <template v-slot:item.isActive="{ item }">
          <v-chip
            :color="item.isActive ? 'success' : 'default'"
            size="small"
            variant="flat"
          >
            {{ item.isActive ? 'Активен' : 'Неактивен' }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="text"
            @click.stop="navigateTo({ name: 'banners-edit-id', params: { id: item.id } })"
          ></v-btn>
          <v-btn
            icon="mdi-delete"
            size="small"
            variant="text"
            color="error"
            @click.stop="confirmDelete(item)"
          ></v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Удалить баннер?</v-card-title>
        <v-card-text>Баннер «{{ bannerToDelete?.title }}» будет удалён. Это действие необратимо.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Отмена</v-btn>
          <v-btn color="error" :loading="deleteLoading" @click="handleDelete">Удалить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const banners = ref([])
const total = ref(0)
const deleteDialog = ref(false)
const deleteLoading = ref(false)
const bannerToDelete = ref(null)

const pagination = reactive({
  page: 1,
  perPage: 25
})

const headers = [
  { title: 'ID', key: 'id', sortable: true },
  { title: 'Изображение', key: 'image', sortable: false },
  { title: 'Название', key: 'title', sortable: true },
  { title: 'Активен', key: 'isActive', sortable: true },
  { title: 'Создан', key: 'createdAt', sortable: true },
  { title: 'Действия', key: 'actions', sortable: false }
]

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:3001${imagePath}`
}

const loadBanners = async () => {
  loading.value = true
  try {
    const response = await api.getList('banners', {
      page: pagination.page,
      limit: pagination.perPage,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    banners.value = response.data
    total.value = response.total
  } catch (error) {
    console.error('Ошибка загрузки баннеров:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChange = (page) => {
  pagination.page = page
  loadBanners()
}

const handlePerPageChange = (perPage) => {
  pagination.perPage = perPage
  pagination.page = 1
  loadBanners()
}

const handleRowClick = (event, row) => {
  navigateTo({ name: 'banners-edit-id', params: { id: row.item.id } })
}

const confirmDelete = (item) => {
  bannerToDelete.value = item
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!bannerToDelete.value) return
  deleteLoading.value = true
  try {
    await api.remove('banners', bannerToDelete.value.id)
    deleteDialog.value = false
    bannerToDelete.value = null
    await loadBanners()
  } catch (error) {
    console.error('Ошибка удаления:', error)
  } finally {
    deleteLoading.value = false
  }
}

onMounted(() => {
  loadBanners()
})
</script>
