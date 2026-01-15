<template>
  <div>
    <h1 class="text-h4 mb-4">Настройки сайта</h1>
    <v-card>
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="basic">Основные</v-tab>
        <v-tab value="contacts">Контакты</v-tab>
        <v-tab value="seo">SEO</v-tab>
        <v-tab value="delivery">Доставка</v-tab>
        <v-tab value="payment">Оплата</v-tab>
      </v-tabs>
      <v-form @submit.prevent="handleSubmit">
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="basic">
              <v-text-field v-model="form.siteName" label="Название сайта" variant="outlined" class="mb-4"></v-text-field>
              <v-textarea v-model="form.siteDescription" label="Описание сайта" variant="outlined" rows="3" class="mb-4"></v-textarea>
              <v-text-field v-model="form.siteKeywords" label="Ключевые слова" variant="outlined"></v-text-field>
            </v-window-item>
            <v-window-item value="contacts">
              <v-text-field v-model="form.phone" label="Телефон" variant="outlined" class="mb-4"></v-text-field>
              <v-text-field v-model="form.email" label="Email" variant="outlined" class="mb-4"></v-text-field>
              <v-textarea v-model="form.address" label="Адрес" variant="outlined" rows="2"></v-textarea>
            </v-window-item>
            <v-window-item value="seo">
              <v-text-field v-model="form.googleAnalytics" label="Google Analytics ID" variant="outlined" class="mb-4"></v-text-field>
              <v-text-field v-model="form.googleTagManager" label="Google Tag Manager ID" variant="outlined"></v-text-field>
            </v-window-item>
            <v-window-item value="delivery">
              <v-text-field v-model.number="form.freeDeliveryFrom" label="Бесплатная доставка от (грн)" type="number" variant="outlined" class="mb-4"></v-text-field>
              <v-text-field v-model.number="form.deliveryPrice" label="Стоимость доставки (грн)" type="number" variant="outlined"></v-text-field>
            </v-window-item>
            <v-window-item value="payment">
              <div class="text-caption text-grey mb-2">Способы оплаты</div>
              <v-chip v-for="(method, index) in form.paymentMethods" :key="index" class="mr-2 mb-2" closable @click:close="removePaymentMethod(index)">
                {{ method }}
              </v-chip>
              <v-text-field v-model="newPaymentMethod" label="Добавить способ оплаты" variant="outlined" append-icon="mdi-plus" @click:append="addPaymentMethod" @keyup.enter="addPaymentMethod"></v-text-field>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" color="primary" :loading="loading">Сохранить настройки</v-btn>
        </v-card-actions>
      </v-form>
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
const tab = ref('basic')
const newPaymentMethod = ref('')

const form = reactive({
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  phone: '',
  email: '',
  address: '',
  googleAnalytics: '',
  googleTagManager: '',
  freeDeliveryFrom: null,
  deliveryPrice: null,
  paymentMethods: []
})

const loadSettings = async () => {
  try {
    const data = await api.getOne('settings', '1')
    Object.assign(form, data)
  } catch (error) {
    console.error('Ошибка загрузки настроек:', error)
  }
}

const addPaymentMethod = () => {
  if (newPaymentMethod.value && !form.paymentMethods.includes(newPaymentMethod.value)) {
    form.paymentMethods.push(newPaymentMethod.value)
    newPaymentMethod.value = ''
  }
}

const removePaymentMethod = (index) => {
  form.paymentMethods.splice(index, 1)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    await api.update('settings', '1', form)
  } catch (error) {
    console.error('Ошибка сохранения:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
