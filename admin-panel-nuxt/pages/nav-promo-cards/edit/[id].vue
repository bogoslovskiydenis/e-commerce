<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center gap-3">
          <v-btn icon="mdi-arrow-left" variant="text" @click="navigateTo('/nav-promo-cards')" />
          <h1 class="text-h4">Редактировать карточку</h1>
        </div>
      </v-col>
    </v-row>

    <v-skeleton-loader v-if="fetchLoading" type="card" />
    <PromoCardForm v-else :initial="card" :loading="loading" @submit="handleUpdate" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import PromoCardForm from '~/components/nav-promo-cards/PromoCardForm.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const api = useApi()
const loading = ref(false)
const fetchLoading = ref(true)
const card = ref(null)

const loadCard = async () => {
  try {
    card.value = await api.getOne('nav-promo-cards', route.params.id)
  } catch (e) {
    console.error(e)
  } finally {
    fetchLoading.value = false
  }
}

const handleUpdate = async (data) => {
  loading.value = true
  try {
    await api.update('nav-promo-cards', route.params.id, data)
    await navigateTo('/nav-promo-cards')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(loadCard)
</script>
