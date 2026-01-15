<template>
  <div>
    <h1 class="text-h4 mb-4">Мой профиль</h1>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-avatar size="80">
                {{ user?.fullName?.charAt(0) || user?.username?.charAt(0) }}
              </v-avatar>
              <div class="ml-4">
                <div class="text-h5">{{ user?.fullName }}</div>
                <div class="text-caption text-grey">@{{ user?.username }}</div>
              </div>
            </div>
            <v-divider class="my-4"></v-divider>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.fullName"
                  label="Полное имя"
                  variant="outlined"
                  :disabled="!editMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.email"
                  label="Email"
                  variant="outlined"
                  :disabled="!editMode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  :model-value="user?.username"
                  label="Логин"
                  disabled
                  variant="outlined"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn v-if="!editMode" color="primary" @click="editMode = true">Редактировать</v-btn>
            <div v-else>
              <v-btn color="primary" :loading="loading" @click="handleSave">Сохранить</v-btn>
              <v-btn class="ml-2" variant="text" @click="cancelEdit">Отмена</v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Безопасность</v-card-title>
          <v-card-text>
            <v-btn block class="mb-2" @click="passwordDialog = true">Изменить пароль</v-btn>
            <v-btn block variant="outlined" @click="twoFactorDialog = true">
              {{ user?.twoFactorEnabled ? 'Отключить 2FA' : 'Настроить 2FA' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="passwordDialog" max-width="500">
      <v-card>
        <v-card-title>Изменить пароль</v-card-title>
        <v-card-text>
          <v-text-field v-model="passwordForm.current" label="Текущий пароль" type="password" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field v-model="passwordForm.new" label="Новый пароль" type="password" variant="outlined" class="mb-4"></v-text-field>
          <v-text-field v-model="passwordForm.confirm" label="Подтвердите пароль" type="password" variant="outlined"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="passwordDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="handlePasswordChange">Изменить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const editMode = ref(false)
const loading = ref(false)
const passwordDialog = ref(false)
const twoFactorDialog = ref(false)

const user = computed(() => authStore.user)

const form = reactive({
  fullName: '',
  email: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

onMounted(() => {
  if (user.value) {
    form.fullName = user.value.fullName || ''
    form.email = user.value.email || ''
  }
})

const cancelEdit = () => {
  editMode.value = false
  form.fullName = user.value?.fullName || ''
  form.email = user.value?.email || ''
}

const handleSave = async () => {
  loading.value = true
  try {
    await authStore.updateProfile(form)
    editMode.value = false
  } catch (error) {
    console.error('Ошибка обновления:', error)
  } finally {
    loading.value = false
  }
}

const handlePasswordChange = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('Пароли не совпадают')
    return
  }
  try {
    await authStore.changePassword(passwordForm.current, passwordForm.new)
    passwordDialog.value = false
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch (error) {
    console.error('Ошибка смены пароля:', error)
  }
}
</script>
