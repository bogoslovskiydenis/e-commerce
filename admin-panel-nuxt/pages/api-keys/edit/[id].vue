<template>
  <div v-if="apiKey">
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'api-keys-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Редактировать API ключ: {{ apiKey.name }}</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.name"
                label="Название ключа"
                variant="outlined"
                required
                hint="Описательное название для идентификации"
                class="mb-4"
              ></v-text-field>
              <v-select
                v-model="form.type"
                :items="typeOptions"
                label="Тип ключа"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-text-field
                v-model.number="form.rateLimit"
                label="Лимит запросов в час"
                type="number"
                variant="outlined"
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.expiresAt"
                label="Дата истечения"
                type="datetime-local"
                variant="outlined"
                hint="Оставьте пустым для бессрочного ключа"
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Права доступа</v-card-title>
            <v-card-text>
              <div class="mb-4">
                <div class="text-caption text-grey mb-2">Разрешения</div>
                <v-chip
                  v-for="(perm, index) in form.permissions"
                  :key="index"
                  class="mr-2 mb-2"
                  closable
                  @click:close="removePermission(index)"
                >
                  {{ perm }}
                </v-chip>
                <v-select
                  v-model="newPermission"
                  :items="permissionOptions"
                  label="Добавить разрешение"
                  variant="outlined"
                  density="compact"
                  append-icon="mdi-plus"
                  @click:append="addPermission"
                  @update:model-value="addPermission"
                ></v-select>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="mb-4">
                <div class="text-caption text-grey mb-2">Разрешённые IP адреса</div>
                <v-chip
                  v-for="(ip, index) in form.allowedIPs"
                  :key="index"
                  class="mr-2 mb-2"
                  closable
                  @click:close="removeIP(index)"
                >
                  {{ ip }}
                </v-chip>
                <v-text-field
                  v-model="newIP"
                  label="Добавить IP адрес"
                  variant="outlined"
                  density="compact"
                  hint="Например: 192.168.1.100 или 192.168.1.0/24"
                  append-icon="mdi-plus"
                  @click:append="addIP"
                  @keyup.enter="addIP"
                ></v-text-field>
              </div>

              <v-checkbox
                v-model="form.active"
                label="Активный ключ"
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
            @click="navigateTo({ name: 'api-keys-index' })"
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
const apiKey = ref(null)
const loading = ref(false)
const newPermission = ref(null)
const newIP = ref('')

const form = reactive({
  name: '',
  type: 'private',
  rateLimit: 1000,
  expiresAt: '',
  permissions: [],
  allowedIPs: [],
  active: true
})

const typeOptions = [
  { title: 'Публичный (фронтенд)', value: 'public' },
  { title: 'Приватный (бэкенд)', value: 'private' },
  { title: 'Webhook (уведомления)', value: 'webhook' },
  { title: 'Интеграция (внешние сервисы)', value: 'integration' }
]

const permissionOptions = [
  { title: 'Чтение товаров', value: 'products.read' },
  { title: 'Запись товаров', value: 'products.write' },
  { title: 'Чтение заказов', value: 'orders.read' },
  { title: 'Запись заказов', value: 'orders.write' },
  { title: 'Чтение клиентов', value: 'customers.read' },
  { title: 'Запись клиентов', value: 'customers.write' },
  { title: 'Аналитика', value: 'analytics.read' },
  { title: 'Получение webhook\'ов', value: 'webhooks.receive' }
]

const addPermission = () => {
  if (newPermission.value && !form.permissions.includes(newPermission.value)) {
    form.permissions.push(newPermission.value)
    newPermission.value = null
  }
}

const removePermission = (index) => {
  form.permissions.splice(index, 1)
}

const addIP = () => {
  if (newIP.value && !form.allowedIPs.includes(newIP.value)) {
    form.allowedIPs.push(newIP.value)
    newIP.value = ''
  }
}

const removeIP = (index) => {
  form.allowedIPs.splice(index, 1)
}

const loadApiKey = async () => {
  try {
    const data = await api.getOne('api-keys', route.params.id)
    apiKey.value = data
    
    form.name = data.name || ''
    form.type = data.type || 'private'
    form.rateLimit = data.rateLimit || 1000
    form.expiresAt = data.expiresAt ? new Date(data.expiresAt).toISOString().slice(0, 16) : ''
    form.permissions = data.permissions || []
    form.allowedIPs = data.allowedIPs || []
    form.active = data.active !== undefined ? data.active : true
  } catch (error) {
    console.error('Ошибка загрузки API ключа:', error)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const updateData = {
      name: form.name,
      type: form.type,
      rateLimit: Number(form.rateLimit),
      expiresAt: form.expiresAt || null,
      permissions: form.permissions,
      allowedIPs: form.allowedIPs.length > 0 ? form.allowedIPs : undefined,
      active: form.active
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
        delete updateData[key]
      }
    })

    await api.update('api-keys', route.params.id, updateData)
    await navigateTo({ name: 'api-keys-index' })
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadApiKey()
})
</script>
