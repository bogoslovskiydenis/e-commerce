import { AuthProvider } from 'react-admin';

export interface User {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: 'super_admin' | 'administrator' | 'manager' | 'crm_manager';
    permissions: string[];
    avatar?: string;
    active: boolean;
    twoFactorEnabled: boolean;
    lastLogin?: string;
    createdAt: string;
}

// Определяем права доступа для каждой роли
const ROLE_PERMISSIONS = {
    super_admin: [
        'admin.full_access',
        'users.create',
        'users.edit',
        'users.delete',
        'users.view',
        'products.create',
        'products.edit',
        'products.delete',
        'products.view',
        'orders.view',
        'orders.edit',
        'orders.delete',
        'callbacks.view',
        'callbacks.edit',
        'reviews.view',
        'reviews.edit',
        'reviews.delete',
        'website.banners',
        'website.pages',
        'website.settings',
        'website.navigation',
        'analytics.view',
        'logs.view',
        'api_keys.manage'
    ],
    administrator: [
        'products.create',
        'products.edit',
        'products.delete',
        'products.view',
        'categories.create',
        'categories.edit',
        'categories.delete',
        'categories.view',
        'users.create',
        'users.edit',
        'users.view',
        'website.banners',
        'website.pages',
        'website.navigation',
        'analytics.view'
    ],
    manager: [
        'orders.view',
        'orders.edit',
        'callbacks.view',
        'callbacks.edit',
        'reviews.view',
        'reviews.edit',
        'customers.view',
        'customers.edit',
        'products.view',
        'analytics.basic'
    ],
    crm_manager: [
        'customers.view',
        'customers.edit',
        'promotions.create',
        'promotions.edit',
        'promotions.view',
        'emails.send',
        'loyalty.manage',
        'analytics.marketing'
    ]
};

// Мок пользователи для разработки
const MOCK_USERS = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123',
        email: 'admin@example.com',
        fullName: 'Супер Администратор',
        role: 'super_admin' as const,
        permissions: ROLE_PERMISSIONS.super_admin,
        active: true,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        username: 'manager',
        password: 'manager123',
        email: 'manager@example.com',
        fullName: 'Иван Менеджеров',
        role: 'administrator' as const,
        permissions: ROLE_PERMISSIONS.administrator,
        active: true,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        username: 'operator',
        password: 'operator123',
        email: 'operator@example.com',
        fullName: 'Анна Операторова',
        role: 'manager' as const,
        permissions: ROLE_PERMISSIONS.manager,
        active: true,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '4',
        username: 'crm',
        password: 'crm123',
        email: 'crm@example.com',
        fullName: 'Мария CRM',
        role: 'crm_manager' as const,
        permissions: ROLE_PERMISSIONS.crm_manager,
        active: true,
        twoFactorEnabled: false,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z'
    }
];

class AuthProviderImpl implements AuthProvider {
    async login({ username, password, twoFactorCode }: {
        username: string;
        password: string;
        twoFactorCode?: string;
    }) {
        try {
            console.log('Попытка входа:', { username, password });

            // Ищем пользователя в моковых данных
            const user = MOCK_USERS.find(u =>
                (u.username === username || u.email === username) && u.password === password
            );

            if (!user) {
                throw new Error('Неверный логин или пароль');
            }

            if (!user.active) {
                throw new Error('Аккаунт заблокирован');
            }

            // Имитируем 2FA для пользователей с включенной 2FA
            if (user.twoFactorEnabled && !twoFactorCode) {
                return { requiresTwoFactor: true };
            }

            if (user.twoFactorEnabled && twoFactorCode) {
                // Простая проверка 2FA кода (в реальности должно быть сложнее)
                if (twoFactorCode !== '123456') {
                    throw new Error('Неверный код двухфакторной аутентификации');
                }
            }

            // Создаем объект пользователя без пароля
            const { password: _, ...userWithoutPassword } = user;
            const userData = {
                ...userWithoutPassword,
                lastLogin: new Date().toISOString()
            };

            // Сохраняем токен и данные пользователя
            const mockToken = `mock_token_${user.id}_${Date.now()}`;
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('user', JSON.stringify(userData));

            console.log('Успешный вход:', userData);

            // Логируем вход
            this.logUserAction('login', `Пользователь ${user.username} вошёл в систему`);

            return Promise.resolve();
        } catch (error) {
            console.error('Ошибка входа:', error);
            return Promise.reject(error);
        }
    }

    async logout() {
        const user = this.getCurrentUser();
        if (user) {
            this.logUserAction('logout', `Пользователь ${user.username} вышел из системы`);
        }

        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        return Promise.resolve();
    }

    async checkAuth() {
        const token = localStorage.getItem('auth_token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            return Promise.reject(new Error('Не авторизован'));
        }

        try {
            // В моковом режиме просто проверяем наличие данных
            const userData = JSON.parse(user);
            if (!userData || !userData.id) {
                throw new Error('Некорректные данные пользователя');
            }

            return Promise.resolve();
        } catch (error) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return Promise.reject(error);
        }
    }

    async checkError(error: any) {
        const status = error.status;
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            return Promise.reject();
        }
        return Promise.resolve();
    }

    async getPermissions() {
        const user = this.getCurrentUser();
        if (!user) return Promise.reject();

        const permissions = ROLE_PERMISSIONS[user.role] || [];
        return Promise.resolve(permissions);
    }

    getCurrentUser(): User | null {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    hasPermission(permission: string): boolean {
        const user = this.getCurrentUser();
        if (!user) return false;

        const userPermissions = ROLE_PERMISSIONS[user.role] || [];
        return userPermissions.includes(permission) || userPermissions.includes('admin.full_access');
    }

    // Получить всех пользователей (для административных целей)
    getAllUsers(): User[] {
        return MOCK_USERS.map(({ password, ...user }) => user);
    }

    // Логирование действий пользователей (мок версия)
    private async logUserAction(action: string, description: string) {
        const user = this.getCurrentUser();
        if (!user) return;

        try {
            const logEntry = {
                id: Date.now().toString(),
                userId: user.id,
                username: user.username,
                action,
                description,
                ip: await this.getUserIP(),
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };

            // Сохраняем логи в localStorage для демонстрации
            const existingLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
            existingLogs.unshift(logEntry);

            // Ограничиваем количество логов до 100
            if (existingLogs.length > 100) {
                existingLogs.splice(100);
            }

            localStorage.setItem('admin_logs', JSON.stringify(existingLogs));

            console.log('Logged action:', logEntry);
        } catch (error) {
            console.error('Ошибка логирования:', error);
        }
    }

    private async getUserIP(): Promise<string> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    }

    // Получить логи (для административного интерфейса)
    getAdminLogs() {
        return JSON.parse(localStorage.getItem('admin_logs') || '[]');
    }
}

export const authProvider = new AuthProviderImpl();