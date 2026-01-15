export const usePermissions = () => {
  const authStore = useAuthStore()

  const hasPermission = (permission, requireAll = false) => {
    const permissions = authStore.permissions

    if (!permissions || !Array.isArray(permissions)) return false

    if (permissions.includes('admin.full_access')) return true

    if (typeof permission === 'string') {
      return permissions.includes(permission)
    }

    if (Array.isArray(permission)) {
      if (requireAll) {
        return permission.every(perm => permissions.includes(perm))
      } else {
        return permission.some(perm => permissions.includes(perm))
      }
    }

    return false
  }

  return {
    hasPermission,
    permissions: authStore.permissions
  }
}
