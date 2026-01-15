<template>
  <v-app>
    <v-main class="auth-layout">
      <div class="auth-container">
        <div class="auth-content">
          <slot />
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
}

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #667eea 0%);
  padding: 20px;
}

.auth-content {
  width: 100%;
  max-width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
