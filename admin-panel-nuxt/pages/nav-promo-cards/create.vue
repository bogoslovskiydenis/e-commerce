<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center gap-3">
          <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/nav-promo-cards')" />
          <h1 class="text-h4">Новая карточка</h1>
        </div>
      </v-col>
    </v-row>

    <PromoCardForm :loading="loading" @submit="handleCreate" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApi } from '~/composables/useApi'
import PromoCardForm from '~/components/nav-promo-cards/PromoCardForm.vue'

definePageMeta({ middleware: 'auth' })

const api = useApi()
const loading = ref(false)

const handleCreate = async (data) => {
  loading.value = true
  try {
    await api.create('nav-promo-cards', data)
    await navigateTo('/nav-promo-cards')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>
