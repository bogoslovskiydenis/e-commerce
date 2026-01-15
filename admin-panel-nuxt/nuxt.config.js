// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['vuetify/styles'],
  modules: ['@pinia/nuxt'],
  build: {
    transpile: ['vuetify']
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api'
    }
  },
  ssr: false
})
