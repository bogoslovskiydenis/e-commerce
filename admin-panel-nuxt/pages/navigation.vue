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
          <template v-for="category in categories" :key="category.id">
            <!-- Родительская категория -->
            <v-list-item
              class="navigation-item"
            >
              <template v-slot:prepend>
                <v-btn
                  icon
                  size="small"
                  variant="text"
                  @click="toggleCategory(category.id)"
                >
                  <v-icon>
                    {{ expandedCategories[category.id] ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                  </v-icon>
                </v-btn>
                <v-icon color="primary" class="ml-2">
                  mdi-folder
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
                  <span v-if="category.children && category.children.length > 0" class="text-caption text-grey">
                    ({{ category.children.length }} подкатегорий)
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

            <!-- Подкатегории (показываются только для родительских категорий) -->
            <v-list-item
              v-if="expandedCategories[category.id] && category.children && category.children.length > 0"
              v-for="child in category.children"
              :key="child.id"
              class="navigation-item navigation-subitem"
            >
              <template v-slot:prepend>
                <div style="width: 40px;"></div>
                <v-icon color="grey" class="ml-2">
                  mdi-subdirectory-arrow-right
                </v-icon>
              </template>

              <v-list-item-title class="navigation-title">
                {{ child.name }}
              </v-list-item-title>
              
              <v-list-item-subtitle class="navigation-subtitle">
                <div class="d-flex align-center gap-2">
                  <span class="products-count">
                    <v-icon size="14" class="mr-1">mdi-package-variant</v-icon>
                    <strong>{{ child.productsCount || 0 }}</strong> товаров
                  </span>
                </div>
              </v-list-item-subtitle>

              <template v-slot:append>
                <div class="navigation-switch">
                  <v-switch
                    v-model="child.showInNavigation"
                    density="compact"
                    hide-details
                    color="success"
                    :label="child.showInNavigation ? 'Включено' : 'Выключено'"
                    :class="{ 'switch-active': child.showInNavigation }"
                    @change="updateCategory(child)"
                  >
                    <template v-slot:label>
                      <span :class="child.showInNavigation ? 'text-success' : 'text-grey'">
                        {{ child.showInNavigation ? 'Включено' : 'Выключено' }}
                      </span>
                    </template>
                  </v-switch>
                </div>
              </template>
            </v-list-item>
          </template>
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
const expandedCategories = ref({})

const toggleCategory = (categoryId) => {
  expandedCategories.value[categoryId] = !expandedCategories.value[categoryId]
}

const loadCategories = async () => {
  try {
    const response = await api.getList('categories', { limit: 100, sortBy: 'sortOrder', sortOrder: 'asc' })
    // Фильтруем только родительские категории для отображения
    const parentCategories = response.data.filter(cat => !cat.parentId)
    categories.value = parentCategories.map(cat => ({
      ...cat,
      showInNavigation: cat.showInNavigation !== undefined ? cat.showInNavigation : true,
      productsCount: cat.productsCount || cat._count?.products || 0,
      children: (cat.children || []).map(child => ({
        ...child,
        showInNavigation: child.showInNavigation !== undefined ? child.showInNavigation : true,
        productsCount: child.productsCount || child._count?.products || 0
      }))
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

.navigation-subitem {
  background-color: #f9f9f9;
  padding-left: 48px !important;
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
