import { AuthProvider } from 'react-admin';

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'SUPER_ADMIN' | 'ADMINISTRATOR' | 'MANAGER' | 'CRM_MANAGER';
    permissions: string[];
    avatar?: string;
    active: boolean;
    twoFactorEnabled: boolean;
    lastLogin?: string;
    createdAt: string;
}

// API базовый URL - можно вынести в переменные окружения
const API_BASE_URL = 'http://localhost:3001/api';

// Утилиты для работы с токенами
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
const getStoredRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
const getStoredUser = () => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
};

const storeAuthData = (token: string, refreshToken: string, user: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// Функция для выполнения API запросов с обработкой токена
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getStoredToken();

    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Если токен истек, пробуем обновить
    if (response.status === 401) {
        const refreshed = await refreshAuthToken();
        if (refreshed) {
            // Повторяем запрос с новым токеном
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${getStoredToken()}`,
            };
            return fetch(`${API_BASE_URL}${endpoint}`, config);
        } else {
            // Не удалось обновить токен, перенаправляем на логин
            clearAuthData();
            throw new Error('Session expired');
        }
    }

    return response;
};

// Функция обновления токена (если API поддерживает refresh tokens)
const refreshAuthToken = async (): Promise<boolean> => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                storeAuthData(data.data.token, data.data.refreshToken, data.data.user);
                return true;
            }
        }
    } catch (error) {
        console.error('Error refreshing token:', error);
    }

    return false;
};

class ApiAuthProvider implements AuthProvider {

    async login({ username, password, twoFactorCode }: {
        username: string;
        password: string;
        twoFactorCode?: string;
    }) {
        try {
            console.log('🔐 Попытка входа через API:', { username });

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    twoFactorCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Ошибка авторизации');
            }

            if (!data.success) {
                // Если требуется 2FA, не выбрасываем ошибку, а возвращаем информацию
                if (data.requiresTwoFactor) {
                    throw new Error('Требуется код двухфакторной аутентификации');
                }
                throw new Error(data.message || 'Неверные учетные данные');
            }

            // Сохраняем данные авторизации
            const { token, refreshToken, user } = data.data;
            storeAuthData(token, refreshToken, user);

            console.log('✅ Успешный вход:', user);

            // Логируем успешный вход
            await this.logUserAction('login', 'Успешный вход в систему');

            return Promise.resolve();

        } catch (error) {
            console.error('❌ Ошибка входа:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const token = getStoredToken();

            if (token) {
                // Уведомляем сервер о выходе
                await apiRequest('/auth/logout', {
                    method: 'POST',
                });

                // Логируем выход
                await this.logUserAction('logout', 'Выход из системы');
            }

        } catch (error) {
            console.error('Ошибка при выходе:', error);
        } finally {
            // Очищаем локальные данные в любом случае
            clearAuthData();
        }

        return Promise.resolve();
    }

    async checkAuth() {
        try {
            const token = getStoredToken();
            const user = getStoredUser();

            if (!token || !user) {
                console.log('❌ Нет токена или данных пользователя');
                throw new Error('No auth data');
            }

            // Проверяем актуальность токена через API
            const response = await apiRequest('/auth/me');

            if (!response.ok) {
                throw new Error('Token invalid');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error('Auth check failed');
            }

            // Обновляем данные пользователя если нужно
            const apiUser = data.data;
            if (JSON.stringify(apiUser) !== JSON.stringify(user)) {
                localStorage.setItem(USER_KEY, JSON.stringify(apiUser));
            }

            console.log('✅ Авторизация актуальна:', apiUser);
            return Promise.resolve();

        } catch (error) {
            console.log('❌ Проверка авторизации не пройдена:', error);
            clearAuthData();
            throw error;
        }
    }

    async checkError(error: any) {
        const status = error.status;

        if (status === 401 || status === 403) {
            console.log('❌ Ошибка авторизации, очищаем данные');
            clearAuthData();
            return Promise.reject();
        }

        return Promise.resolve();
    }

    async getPermissions() {
        const user = getStoredUser();
        return user ? user.permissions : [];
    }

    async getIdentity() {
        const user = getStoredUser();

        if (!user) {
            throw new Error('No user data');
        }

        return {
            id: user.id,
            fullName: user.fullName,
            avatar: user.avatar,
            email: user.email,
            role: user.role
        };
    }

    // Дополнительные методы для работы с пользователем
    getCurrentUser(): User | null {
        return getStoredUser();
    }

    hasPermission(permission: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        return user.permissions.includes(permission) ||
            user.permissions.includes('admin.full_access');
    }

    hasRole(role: string | string[]): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        const allowedRoles = Array.isArray(role) ? role : [role];
        return allowedRoles.includes(user.role);
    }

    // Получить всех пользователей администрации
    async getAdminUsers() {
        try {
            const response = await apiRequest('/admin/users');
            const data = await response.json();

            if (data.success) {
                return data.data;
            }

            throw new Error('Failed to fetch users');
        } catch (error) {
            console.error('Error fetching admin users:', error);
            return [];
        }
    }

    // Логирование действий пользователей
    private async logUserAction(action: string, description: string) {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            // Отправляем лог на сервер
            await apiRequest('/admin/logs', {
                method: 'POST',
                body: JSON.stringify({
                    action,
                    description,
                    userAgent: navigator.userAgent,
                }),
            });

            console.log('📝 Действие залогировано:', { action, description });
        } catch (error) {
            console.error('Ошибка логирования:', error);
        }
    }

    // Получить логи действий (для административного интерфейса)
    async getAdminLogs(params?: { page?: number; limit?: number }) {
        try {
            const queryParams = new URLSearchParams();
            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());

            const response = await apiRequest(`/admin/logs?${queryParams}`);
            const data = await response.json();

            if (data.success) {
                return data.data;
            }

            throw new Error('Failed to fetch logs');
        } catch (error) {
            console.error('Error fetching admin logs:', error);
            return [];
        }
    }

    // Обновление профиля пользователя
    async updateProfile(updates: Partial<User>) {
        try {
            const response = await apiRequest('/auth/profile', {
                method: 'PATCH',
                body: JSON.stringify(updates),
            });

            const data = await response.json();

            if (data.success) {
                // Обновляем локальные данные
                const currentUser = getStoredUser();
                if (currentUser) {
                    const updatedUser = { ...currentUser, ...data.data };
                    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                }

                await this.logUserAction('profile_update', 'Обновление профиля');
                return data.data;
            }

            throw new Error(data.message || 'Failed to update profile');
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    }

    // Изменение пароля
    async changePassword(currentPassword: string, newPassword: string) {
        try {
            const response = await apiRequest('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                await this.logUserAction('password_change', 'Смена пароля');
                return true;
            }

            throw new Error(data.message || 'Failed to change password');
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }

    // Настройка 2FA
    async setup2FA() {
        try {
            const response = await apiRequest('/auth/2fa/setup', {
                method: 'POST',
            });

            const data = await response.json();

            if (data.success) {
                return data.data; // Возвращает QR код и секрет
            }

            throw new Error(data.message || 'Failed to setup 2FA');
        } catch (error) {
            console.error('Error setting up 2FA:', error);
            throw error;
        }
    }

    async verify2FA(code: string) {
        try {
            const response = await apiRequest('/auth/2fa/verify', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.success) {
                await this.logUserAction('2fa_enabled', 'Включена двухфакторная аутентификация');
                return true;
            }

            throw new Error(data.message || 'Invalid 2FA code');
        } catch (error) {
            console.error('Error verifying 2FA:', error);
            throw error;
        }
    }

    async disable2FA(code: string) {
        try {
            const response = await apiRequest('/auth/2fa/disable', {
                method: 'POST',
                body: JSON.stringify({ code }),
            });

            const data = await response.json();

            if (data.success) {
                await this.logUserAction('2fa_disabled', 'Отключена двухфакторная аутентификация');
                return true;
            }

            throw new Error(data.message || 'Invalid 2FA code');
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            throw error;
        }
    }
}

export const authProvider = new ApiAuthProvider();