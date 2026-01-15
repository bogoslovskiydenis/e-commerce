<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12">
        <h1 class="text-h4">Управление навигацией</h1>
      </v-col>
    </v-row>

    <v-card>
      <v-card-text>
        <v-alert type="info" class="mb-4">
          Перетащите категории для изменения порядка в навигации. Используйте переключатели для показа/скрытия в меню.
        </v-alert>

        <v-list>
          <v-list-item
            v-for="category in categories"
            :key="category.id"
            class="navigation-item"
          >
            <template v-slot:prepend>
              <v-icon :color="category.parentId ? 'grey' : 'primary'">
                {{ category.parentId ? 'mdi-subdirectory-arrow-right' : 'mdi-folder' }}
              </v-icon>
            </template>

            <v-list-item-title class="navigation-title">
              {{ category.name }}
            </v-list-item-title>
            
            <v-list-item-subtitle class="navigation-subtitle">
              <div class="d-flex align-center gap-2">
                <v-chip
                  size="x-small"
                  variant="outlined"
                  color="primary"
                >
                  {{ category.type || 'CATEGORY' }}
                </v-chip>
                <span class="products-count">
                  <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                  <strong>{{ category.productsCount || 0 }}</strong> товаров
                </span>
              </div>
            </v-list-item-subtitle>

            <template v-slot:append>
              <div class="navigation-switch">
                <v-switch
                  v-model="category.showInNavigation"
                  density="compact"
                  hide-details
                  color="success"
                  :label="category.showInNavigation ? 'Включено' : 'Выключено'"
                  :class="{ 'switch-active': category.showInNavigation }"
                  @change="updateCategory(category)"
                >
                  <template v-slot:label>
                    <span :class="category.showInNavigation ? 'text-success' : 'text-grey'">
                      {{ category.showInNavigation ? 'Включено' : 'Выключено' }}
                    </span>
                  </template>
                </v-switch>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

definePageMeta({
  middleware: 'auth'
})

const api = useApi()
const categories = ref([])

const loadCategories = async () => {
  try {
    const response = await api.getList('categories', { limit: 100, sortBy: 'sortOrder', sortOrder: 'asc' })
    categories.value = response.data.map(cat => ({
      ...cat,
      showInNavigation: cat.showInNavigation !== undefined ? cat.showInNavigation : true
    }))
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error)
  }
}

const updateCategory = async (category) => {
  try {
    await api.update('categories', category.id, {
      showInNavigation: category.showInNavigation
    })
  } catch (error) {
    console.error('Ошибка обновления категории:', error)
    category.showInNavigation = !category.showInNavigation
  }
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.navigation-item {
  border-bottom: 1px solid #f0f0f0;
  padding: 12px 0;
}

.navigation-item:last-child {
  border-bottom: none;
}

.navigation-title {
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
}

.navigation-subtitle {
  margin-top: 4px;
}

.products-count {
  display: flex;
  align-items: center;
  color: #1976D2;
  font-size: 13px;
  font-weight: 500;
}

.products-count strong {
  color: #1976D2;
  font-size: 14px;
}

.navigation-switch {
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.switch-active :deep(.v-switch__track) {
  background-color: #4CAF50 !important;
}

.gap-2 {
  gap: 8px;
}
</style>
