<template>
  <div v-if="customer">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'customers-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать клиента: {{ customer.name }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.id"
                label="ID"
                disabled
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.name"
                label="Имя"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.phone"
                label="Телефон"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-textarea
                v-model="form.address"
                label="Адрес"
                variant="outlined"
                rows="2"
              ></v-textarea>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Дополнительная информация</v-card-title>
            <v-card-text>
              <v-textarea
                v-model="form.notes"
                label="Примечания"
                variant="outlined"
                rows="4"
                class="mb-4"
              ></v-textarea>
              <div class="mb-4">
                <div class="text-caption text-grey mb-2">Теги</div>
                <v-chip
                  v-for="(tag, index) in form.tags"
                  :key="index"
                  class="mr-2 mb-2"
                  closable
                  @click:close="removeTag(index)"
                >
                  {{ tag }}
                </v-chip>
                <v-text-field
                  v-model="newTag"
                  label="Добавить тег"
                  variant="outlined"
                  density="compact"
                  append-icon="mdi-plus"
                  @click:append="addTag"
                  @keyup.enter="addTag"
                ></v-text-field>
              </div>
              <v-checkbox
                v-model="form.isActive"
                label="Активен"
              ></v-checkbox>
              <div class="mt-4">
                <div class="text-caption text-grey">Дата регистрации</div>
                <div>{{ formatDate(customer.createdAt) }}</div>
              </div>
              <div class="mt-2">
                <div class="text-caption text-grey">Последнее обновление</div>
                <div>{{ formatDate(customer.updatedAt) }}</div>
              </div>
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
            @click="navigateTo({ name: 'customers-index' })"
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
import { ref, reactive, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const api = useApi()
const customer = ref(null)
const loading = ref(false)
const newTag = ref('')

const form = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  tags: [],
  isActive: true
})

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

const addTag = () => {
  if (newTag.value && !form.tags.includes(newTag.value)) {
    form.tags.push(newTag.value)
    newTag.value = ''
  }
}

const removeTag = (index) => {
  form.tags.splice(index, 1)
}

const loadCustomer = async () => {
  try {
    const data = await api.getOne('customers', route.params.id)
    customer.value = data
    
    form.id = data.id
    form.name = data.name || ''
    form.email = data.email || ''
    form.phone = data.phone || ''
    form.address = data.address || ''
    form.notes = data.notes || ''
    form.tags = data.tags || []
    form.isActive = data.isActive !== undefined ? data.isActive : true
  } catch (error) {
    console.error('Ошибка загрузки клиента:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      name: form.name,
      email: form.email || undefined,
      phone: form.phone,
      address: form.address || undefined,
      notes: form.notes || undefined,
      tags: form.tags,
      isActive: form.isActive
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('customers', route.params.id, updateData)
    await navigateTo({ name: 'customers-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCustomer()
})
</script>
