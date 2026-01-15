<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <v-btn
          prepend-icon="mdi-arrow-left"
          variant="text"
          @click="navigateTo({ name: 'admin-users-index' })"
        >
          Назад к списку
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Создать пользователя</h1>
      </v-col>
    </v-row>

    <v-form @submit.prevent="handleSubmit">
      <v-row>
        <v-col cols="12" md="6">
          <v-card class="mb-4">
            <v-card-title>Основная информация</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.username"
                label="Логин"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.firstName"
                label="Имя"
                variant="outlined"
                required
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="form.lastName"
                label="Фамилия"
                variant="outlined"
                required
              ></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Настройки</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.password"
                label="Пароль"
                type="password"
                variant="outlined"
                required
                hint="Минимум 8 символов"
                class="mb-4"
              ></v-text-field>
              <v-select
                v-model="form.role"
                :items="roleOptions"
                label="Роль"
                variant="outlined"
                required
                class="mb-4"
              ></v-select>
              <v-checkbox
                v-model="form.isActive"
                label="Активен"
                :model-value="true"
              ></v-checkbox>
              <v-checkbox
                v-model="form.twoFactorEnabled"
                label="Включить 2FA"
                :model-value="false"
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
            Создать
          </v-btn>
          <v-btn
            class="ml-2"
            variant="text"
            @click="navigateTo({ name: 'admin-users-index' })"
          >
            Отмена
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  firstName: '',
  lastName: '',
  password: '',
  role: 'MANAGER',
  isActive: true,
  twoFactorEnabled: false
})

const roleOptions = [
  { title: 'Супер админ', value: 'SUPER_ADMIN' },
  { title: 'Администратор', value: 'ADMINISTRATOR' },
  { title: 'Менеджер', value: 'MANAGER' },
  { title: 'CRM Менеджер', value: 'CRM_MANAGER' }
]

const handleSubmit = async () => {
  loading.value = true
  try {
    const createData = {
      username: form.username,
      email: form.email,
      firstName: form.firstName,
      lastName: form.lastName,
      password: form.password,
      role: form.role,
      isActive: form.isActive,
      twoFactorEnabled: form.twoFactorEnabled
    }

    await api.create('admin-users', createData)
    await navigateTo({ name: 'admin-users-index' })
  } catch (error) {
    console.error('Ошибка создания:', error)
  } finally {
    loading.value = false
  }
}
</script>
