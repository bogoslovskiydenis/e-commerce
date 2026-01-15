<template>
  <NuxtLayout name="auth">
    <div class="login-card">
      <div class="login-header">
        <div class="login-icon">
          <v-icon size="48" color="primary">mdi-shield-lock</v-icon>
        </div>
        <h1 class="login-title">Вход</h1>
        <p class="login-subtitle">Введите ваши учетные данные</p>
      </div>

      <v-divider class="login-divider"></v-divider>

      <div class="login-form">
        <v-form @submit.prevent="handleLogin">
          <div class="form-field">
            <v-text-field
              v-model="form.username"
              label="Логин"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :error-messages="errors.username"
              required
              density="comfortable"
            ></v-text-field>
          </div>

          <div class="form-field">
            <v-text-field
              v-model="form.password"
              label="Пароль"
              :type="showPassword ? 'text' : 'password'"
              prepend-inner-icon="mdi-lock"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              :error-messages="errors.password"
              required
              density="comfortable"
            ></v-text-field>
          </div>

          <div class="form-field" v-if="showTwoFactor">
            <v-text-field
              v-model="form.twoFactorCode"
              label="Код двухфакторной аутентификации"
              prepend-inner-icon="mdi-shield-lock"
              variant="outlined"
              :error-messages="errors.twoFactorCode"
              density="comfortable"
              hint="Введите 6-значный код из приложения"
              persistent-hint
            ></v-text-field>
          </div>

          <div class="form-alert" v-if="errorMessage">
            <v-alert
              type="error"
              variant="tonal"
              closable
              @click:close="errorMessage = ''"
            >
              {{ errorMessage }}
            </v-alert>
          </div>

          <div class="form-button">
            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
              prepend-icon="mdi-login"
            >
              Войти
            </v-btn>
          </div>
        </v-form>
      </div>

      <v-divider class="login-divider"></v-divider>

      <div class="login-footer">
        <div class="test-accounts">
          <div class="test-accounts-title">Тестовые учетные данные:</div>
          <div class="test-accounts-list">
            <div class="test-account-item" @click="fillCredentials('admin', 'admin123')">
              <strong>admin</strong> / <code>admin123</code> <span class="role-badge">SUPER_ADMIN</span>
            </div>
            <div class="test-account-item" @click="fillCredentials('administrator', 'admin123')">
              <strong>administrator</strong> / <code>admin123</code> <span class="role-badge">ADMINISTRATOR</span>
            </div>
            <div class="test-account-item" @click="fillCredentials('manager', 'manager123')">
              <strong>manager</strong> / <code>manager123</code> <span class="role-badge">MANAGER</span>
            </div>
            <div class="test-account-item" @click="fillCredentials('crm', 'crm123')">
              <strong>crm</strong> / <code>crm123</code> <span class="role-badge">CRM_MANAGER</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.login-card {
  width: 100%;
  max-width: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  text-align: center;
  padding: 32px 24px 24px;
}

.login-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #1976D2;
  margin: 0 0 8px 0;
  text-align: center;
}

.login-subtitle {
  font-size: 14px;
  color: #757575;
  margin: 0;
  text-align: center;
}

.login-divider {
  margin: 0;
}

.login-form {
  padding: 24px;
}

.form-field {
  margin-bottom: 20px;
}

.form-field:last-of-type {
  margin-bottom: 0;
}

.form-alert {
  margin: 20px 0;
}

.form-button {
  margin-top: 24px;
}

.login-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.test-accounts {
  width: 100%;
  text-align: center;
}

.test-accounts-title {
  font-size: 12px;
  color: #757575;
  margin-bottom: 12px;
  font-weight: 500;
}

.test-accounts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.test-account-item {
  font-size: 12px;
  color: #424242;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.test-account-item:hover {
  background: #e3f2fd;
  color: #1976D2;
}

.test-account-item code {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 11px;
}

.role-badge {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  background: #1976D2;
  color: white;
  font-weight: 500;
}

@media (max-width: 600px) {
  .login-card {
    margin: 16px;
    max-width: calc(100% - 32px);
  }

  .login-header {
    padding: 24px 20px 20px;
  }

  .login-form {
    padding: 20px;
  }

  .login-title {
    font-size: 24px;
  }
}
</style>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: 'auth',
  middleware: []
})

const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')
const showTwoFactor = ref(false)
const showPassword = ref(false)

const form = reactive({
  username: '',
  password: '',
  twoFactorCode: ''
})

const errors = reactive({
  username: '',
  password: '',
  twoFactorCode: ''
})

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''
  errors.username = ''
  errors.password = ''
  errors.twoFactorCode = ''

  if (!form.username) {
    errors.username = 'Введите логин'
    loading.value = false
    return
  }

  if (!form.password) {
    errors.password = 'Введите пароль'
    loading.value = false
    return
  }

  try {
    const result = await authStore.login({
      username: form.username,
      password: form.password,
      twoFactorCode: form.twoFactorCode || undefined
    })

    if (result.success) {
      await navigateTo('/')
    }
  } catch (error) {
    if (error.message?.includes('двухфакторной')) {
      showTwoFactor.value = true
    }
    errorMessage.value = error.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}

const fillCredentials = (username, password) => {
  form.username = username
  form.password = password
  errors.username = ''
  errors.password = ''
  errorMessage.value = ''
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await navigateTo('/')
  }
})
</script>
