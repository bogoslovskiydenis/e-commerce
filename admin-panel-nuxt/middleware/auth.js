export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      const checked = await authStore.checkAuth()
      
      if (!checked) {
        return navigateTo('/login')
      }
    }
  }
})
