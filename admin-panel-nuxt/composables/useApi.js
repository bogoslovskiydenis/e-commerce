export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()

  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    }

    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }

    return headers
  }

  const request = async (endpoint, options = {}) => {
    const url = `${config.public.apiBase}${endpoint}`
    const headers = { ...getAuthHeaders(), ...options.headers }

    try {
      const response = await $fetch(url, {
        ...options,
        headers
      })

      return response
    } catch (error) {
      if (error.status === 401 || error.statusCode === 401) {
        await authStore.logout()
        if (process.client) {
          await navigateTo('/login')
        }
      }
      throw error
    }
  }

  const getList = async (resource, params = {}) => {
    const endpoint = getResourceEndpoint(resource)
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder)
    if (params.search) queryParams.append('search', params.search)

    Object.keys(params).forEach(key => {
      if (!['page', 'limit', 'sortBy', 'sortOrder', 'search'].includes(key) && params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key])
      }
    })

    const query = queryParams.toString()
    const url = query ? `${endpoint}?${query}` : endpoint

    const response = await request(url)
    let data = response.data || []

    // Трансформация данных для comments
    if (resource === 'comments') {
      data = data.map(item => {
        const statusMap = {
          'PENDING': 'new',
          'APPROVED': 'approved',
          'REJECTED': 'rejected'
        }
        return {
          ...item,
          status: statusMap[item.status] || 'new',
          isVisible: item.status === 'APPROVED'
        }
      })
    }

    // Трансформация данных для orders
    if (resource === 'orders') {
      data = data.map(order => {
        const statusMap = {
          'NEW': 'new',
          'CONFIRMED': 'processing',
          'PROCESSING': 'processing',
          'READY': 'processing',
          'SHIPPED': 'shipped',
          'DELIVERED': 'delivered',
          'CANCELLED': 'cancelled',
          'REFUNDED': 'cancelled'
        }

        const paymentStatusMap = {
          'PENDING': 'pending',
          'PAID': 'paid',
          'FAILED': 'failed',
          'REFUNDED': 'refunded',
          'PARTIALLY_REFUNDED': 'refunded'
        }

        return {
          ...order,
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          status: statusMap[order.status] || 'new',
          paymentStatus: paymentStatusMap[order.paymentStatus] || 'pending',
          total: Number(order.totalAmount),
          currency: 'грн',
          customer: order.customer ? {
            name: order.customer.name,
            phone: order.customer.phone,
            email: order.customer.email
          } : null
        }
      })
    }

    return {
      data,
      total: response.pagination?.total || response.total || 0
    }
  }

  const getOne = async (resource, id) => {
    const endpoint = getResourceEndpoint(resource)
    const response = await request(`${endpoint}/${id}`)
    return response.data || response
  }

  const create = async (resource, data) => {
    const endpoint = getResourceEndpoint(resource)
    const response = await request(endpoint, {
      method: 'POST',
      body: data
    })
    return response.data || { ...data, id: response.id }
  }

  const update = async (resource, id, data) => {
    const endpoint = getResourceEndpoint(resource)
    const response = await request(`${endpoint}/${id}`, {
      method: 'PUT',
      body: data
    })
    return response.data || { ...data, id }
  }

  const remove = async (resource, id, meta = {}) => {
    const endpoint = getResourceEndpoint(resource)
    let url = `${endpoint}/${id}`
    
    if (meta.force) {
      url += `?force=${meta.force}`
    }

    await request(url, {
      method: 'DELETE'
    })
  }

  const getResourceEndpoint = (resource) => {
    const endpoints = {
      'products': '/products',
      'categories': '/categories',
      'orders': '/orders',
      'customers': '/customers',
      'callbacks': '/callbacks',
      'comments': '/reviews',
      'reviews': '/reviews',
      'banners': '/banners',
      'pages': '/pages',
      'navigation': '/navigation',
      'settings': '/settings',
      'promotions': '/promotions',
      'nav-promo-cards': '/nav-promo-cards',
      'coupons': '/coupons',
      'newsletters': '/newsletters',
      'admin-users': '/admin/users',
      'admin-logs': '/admin/logs',
      'api-keys': '/admin/api-keys',
      'analytics': '/analytics',
      'stats': '/stats'
    }

    return endpoints[resource] || `/${resource}`
  }

  return {
    request,
    getList,
    getOne,
    create,
    update,
    remove
  }
}
