<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
    >
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
        :title="user?.fullName || 'Администратор'"
        :subtitle="user?.email || ''"
      >
        <template v-slot:append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="Дашборд"
          value="dashboard"
          to="/"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-shopping"
          title="Заказы"
          value="orders"
          to="/orders"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-group"
          title="Клиенты"
          value="customers"
          to="/customers"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-package-variant"
          title="Товары"
          value="products"
          to="/products"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-folder"
          title="Категории"
          value="categories"
          to="/categories"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-tag"
          title="Акции"
          value="promotions"
          to="/promotions"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-star"
          title="Отзывы"
          value="reviews"
          to="/reviews"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-image"
          title="Баннеры"
          value="banners"
          to="/banners"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-menu"
          title="Навигация"
          value="navigation"
          to="/navigation"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-file-document-outline"
          title="Страницы"
          value="pages"
          to="/pages"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account-cog"
          title="Пользователи"
          value="users"
          to="/admin-users"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-key"
          title="API ключи"
          value="api-keys"
          to="/api-keys"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-file-document"
          title="Логи"
          value="logs"
          to="/admin-logs"
        ></v-list-item>

        <v-divider class="my-2"></v-divider>

        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Аналитика"
          value="analytics"
          to="/analytics"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account"
          title="Профиль"
          value="profile"
          to="/profile"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-cog"
          title="Настройки"
          value="settings"
          to="/settings"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-information"
          title="Система"
          value="system"
          to="/system"
        ></v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-2">
          <v-btn
            block
            prepend-icon="mdi-logout"
            @click="handleLogout"
          >
            Выход
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar
      :elevation="2"
    >
      <v-app-bar-nav-icon
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Админ панель - Шарики</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon="mdi-bell-outline"></v-btn>
      <v-btn icon="mdi-account-circle"></v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

const drawer = ref(true)
const rail = ref(false)
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const handleLogout = async () => {
  await authStore.logout()
  await navigateTo('/login')
}
</script>
