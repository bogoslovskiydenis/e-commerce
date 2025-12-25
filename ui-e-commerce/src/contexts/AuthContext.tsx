'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService, Customer, CustomerAuthResponse } from '@/services/api'

interface AuthContextType {
    customer: Customer | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (phoneOrEmail: string, password: string) => Promise<void>
    register: (data: {
        name: string
        email?: string
        phone: string
        password: string
        address?: string
    }) => Promise<void>
    logout: () => void
    updateProfile: (data: Partial<Customer>) => Promise<void>
    refreshCustomer: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('customer_token')
            if (token) {
                const customerData = await apiService.getCustomerProfile()
                setCustomer(customerData)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            localStorage.removeItem('customer_token')
            localStorage.removeItem('customer_refresh_token')
        } finally {
            setIsLoading(false)
        }
    }

    const login = async (phoneOrEmail: string, password: string) => {
        try {
            const response = await apiService.loginCustomer(phoneOrEmail, password)
            localStorage.setItem('customer_token', response.token)
            localStorage.setItem('customer_refresh_token', response.refreshToken)
            setCustomer(response.customer)
        } catch (error: any) {
            let errorMessage = 'Помилка входу'
            
            if (error.status === 401) {
                errorMessage = 'Невірний email/телефон або пароль'
            } else if (error.message) {
                errorMessage = error.message
            } else if (error.data?.message) {
                errorMessage = error.data.message
            } else if (error.data?.error) {
                errorMessage = typeof error.data.error === 'string' ? error.data.error : 'Помилка входу'
            }
            
            throw new Error(errorMessage)
        }
    }

    const register = async (data: {
        name: string
        email?: string
        phone: string
        password: string
        address?: string
    }) => {
        try {
            const response = await apiService.registerCustomer(data)
            localStorage.setItem('customer_token', response.token)
            localStorage.setItem('customer_refresh_token', response.refreshToken)
            setCustomer(response.customer)
        } catch (error: any) {
            let errorMessage = 'Ошибка регистрации'
            
            if (error.status === 409) {
                errorMessage = error.message || 'Користувач з таким email або телефоном вже існує'
            } else if (error.message) {
                errorMessage = error.message
            } else if (error.data?.message) {
                errorMessage = error.data.message
            } else if (error.data?.error) {
                errorMessage = typeof error.data.error === 'string' ? error.data.error : 'Помилка реєстрації'
            }
            
            throw new Error(errorMessage)
        }
    }

    const logout = () => {
        localStorage.removeItem('customer_token')
        localStorage.removeItem('customer_refresh_token')
        setCustomer(null)
    }

    const updateProfile = async (data: Partial<Customer>) => {
        try {
            const updated = await apiService.updateCustomerProfile(data)
            setCustomer(updated)
        } catch (error: any) {
            throw new Error(error.message || 'Ошибка обновления профиля')
        }
    }

    const refreshCustomer = async () => {
        try {
            const customerData = await apiService.getCustomerProfile()
            setCustomer(customerData)
        } catch (error) {
            console.error('Failed to refresh customer:', error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                customer,
                isAuthenticated: !!customer,
                isLoading,
                login,
                register,
                logout,
                updateProfile,
                refreshCustomer,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

