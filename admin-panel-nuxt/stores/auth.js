import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    refreshToken: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    permissions: (state) => state.user?.permissions || []
  },

  actions: {
    async login(credentials) {
      const config = useRuntimeConfig()
      try {
        const response = await $fetch(`${config.public.apiBase}/auth/login`, {
          method: 'POST',
          body: credentials
        })

        if (response.success) {
          this.token = response.data.token
          this.refreshToken = response.data.refreshToken
          this.user = response.data.user

          if (process.client) {
            localStorage.setItem('auth_token', this.token)
            localStorage.setItem('refresh_token', this.refreshToken)
            localStorage.setItem('user_data', JSON.stringify(this.user))
          }

          return { success: true }
        }

        throw new Error(response.message || 'Ошибка авторизации')
      } catch (error) {
        if (error.data?.requiresTwoFactor || error.message?.includes('двухфакторной')) {
          throw new Error('Требуется код двухфакторной аутентификации')
        }
        const errorMessage = error.data?.message || error.message || 'Ошибка авторизации'
        throw new Error(errorMessage)
      }
    },

    async logout() {
      const config = useRuntimeConfig()
      
      try {
        await $fetch(`${config.public.apiBase}/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (error) {
        console.error('Ошибка при выходе:', error)
      } finally {
        this.token = null
        this.refreshToken = null
        this.user = null

        if (process.client) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('user_data')
        }
      }
    },

    async checkAuth() {
      if (process.client) {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')

        if (token && userData) {
          this.token = token
          this.user = JSON.parse(userData)

          try {
            const config = useRuntimeConfig()
            const response = await $fetch(`${config.public.apiBase}/auth/me`, {
              headers: {
                Authorization: `Bearer ${this.token}`
              }
            })

            if (response.success) {
              this.user = response.data
              localStorage.setItem('user_data', JSON.stringify(this.user))
              return true
            }
          } catch (error) {
            this.logout()
            return false
          }
        }
      }

      return false
    },

    hasPermission(permission) {
      if (!this.user || !this.user.permissions) return false
      return this.user.permissions.includes(permission) || 
             this.user.permissions.includes('admin.full_access')
    },

    hasRole(role) {
      if (!this.user) return false
      const roles = Array.isArray(role) ? role : [role]
      return roles.includes(this.user.role)
    },

    async updateProfile(updates) {
      const config = useRuntimeConfig()
      try {
        const response = await $fetch(`${config.public.apiBase}/auth/profile`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: updates
        })

        if (response.success) {
          this.user = { ...this.user, ...response.data }
          if (process.client) {
            localStorage.setItem('user_data', JSON.stringify(this.user))
          }
          return response.data
        }
        throw new Error(response.message || 'Failed to update profile')
      } catch (error) {
        console.error('Error updating profile:', error)
        throw error
      }
    },

    async changePassword(currentPassword, newPassword) {
      const config = useRuntimeConfig()
      try {
        const response = await $fetch(`${config.public.apiBase}/auth/change-password`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          body: { currentPassword, newPassword }
        })

        if (response.success) {
          return true
        }
        throw new Error(response.message || 'Failed to change password')
      } catch (error) {
        console.error('Error changing password:', error)
        throw error
      }
    }
  }
})
