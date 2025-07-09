import { Router } from 'express';
import { validate } from '../middleware/validation.middleware.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';
import { Request, Response } from 'express';

const router = Router();

// Схема валидации для логина
const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
        twoFactorCode: z.string().optional()
    })
});

// Схема для смены пароля
const changePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters')
    })
});

// Схема для обновления профиля
const updateProfileSchema = z.object({
    body: z.object({
        fullName: z.string().optional(),
        email: z.string().email().optional(),
        avatar: z.string().optional()
    })
});

// Схема для 2FA кодов
const twoFactorCodeSchema = z.object({
    body: z.object({
        code: z.string().length(6, '2FA code must be 6 digits')
    })
});

// Мок данные пользователей (в реальном проекте будет база данных)
const USERS = [
    {
        id: '1',
        username: 'admin',
        password: 'admin123', // В реальности должен быть хеш
        email: 'admin@example.com',
        fullName: 'Супер Администратор',
        role: 'SUPER_ADMIN',
        permissions: ['admin.full_access'],
        active: true,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        lastLogin: null,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '2',
        username: 'manager',
        password: 'manager123',
        email: 'manager@example.com',
        fullName: 'Иван Менеджеров',
        role: 'ADMINISTRATOR',
        permissions: [
            'products.create', 'products.edit', 'products.delete', 'products.view',
            'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
            'users.create', 'users.edit', 'users.view',
            'website.banners', 'website.pages', 'website.navigation',
            'analytics.view'
        ],
        active: true,
        twoFactorEnabled: false,
        twoFactorSecret: null,
        lastLogin: null,
        createdAt: '2024-01-01T00:00:00Z'
    },
    {
        id: '3',
        username: 'operator',
        password: 'operator123',
        email: 'operator@example.com',
        fullName: 'Анна Операторова',
        role: 'MANAGER',
        permissions: [
            'orders.view', 'orders.edit',
            'callbacks.view', 'callbacks.edit',
            'reviews.view', 'reviews.edit',
            'customers.view', 'customers.edit',
            'products.view', 'analytics.basic'
        ],
        active: true,
        twoFactorEnabled: true,
        twoFactorSecret: 'JBSWY3DPEHPK3PXP', // Мок секрет для 2FA
        lastLogin: null,
        createdAt: '2024-01-01T00:00:00Z'
    }
];

// Утилиты для работы с токенами
const generateToken = (userId: string) => {
    // В реальности использовать JWT
    return `token_${userId}_${Date.now()}`;
};

const generateRefreshToken = (userId: string) => {
    return `refresh_${userId}_${Date.now()}`;
};

// Логин
router.post('/login', validate(loginSchema), (req: Request, res: Response) => {
    try {
        const { username, password, twoFactorCode } = req.body;

        console.log('🔐 Попытка входа:', { username });

        // Поиск пользователя
        const user = USERS.find(u =>
            (u.username === username || u.email === username) && u.password === password
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                message: 'Неверный логин или пароль'
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                error: 'Account disabled',
                message: 'Аккаунт заблокирован'
            });
        }

        // Проверка 2FA
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.json({
                    success: false,
                    requiresTwoFactor: true,
                    message: 'Требуется код двухфакторной аутентификации'
                });
            }

            // Простая проверка 2FA (в реальности использовать TOTP)
            if (twoFactorCode !== '123456') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid 2FA code',
                    message: 'Неверный код двухфакторной аутентификации'
                });
            }
        }

        // Обновляем время последнего входа
        user.lastLogin = new Date().toISOString();

        // Создаем токены
        const token = generateToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Убираем пароль из ответа
        const { password: _, twoFactorSecret: __, ...userWithoutSecrets } = user;

        console.log('✅ Успешный вход:', userWithoutSecrets);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                refreshToken,
                user: userWithoutSecrets
            }
        });

    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Внутренняя ошибка сервера'
        });
    }
});

// Обновление токена
router.post('/refresh', (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken || !refreshToken.startsWith('refresh_')) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        // Извлекаем ID пользователя из токена (упрощенно)
        const userId = refreshToken.split('_')[1];
        const user = USERS.find(u => u.id === userId);

        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                error: 'User not found or inactive'
            });
        }

        // Создаем новые токены
        const newToken = generateToken(user.id);
        const newRefreshToken = generateRefreshToken(user.id);

        const { password: _, twoFactorSecret: __, ...userWithoutSecrets } = user;

        res.json({
            success: true,
            data: {
                token: newToken,
                refreshToken: newRefreshToken,
                user: userWithoutSecrets
            }
        });

    } catch (error) {
        console.error('Ошибка обновления токена:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Выход
router.post('/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
        // В реальности здесь можно добавить токен в blacklist
        console.log('👋 Выход пользователя:', req.user?.username);

        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Ошибка при выходе:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Получить информацию о текущем пользователе
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user || !user.active) {
            return res.status(401).json({
                success: false,
                error: 'User not found or inactive'
            });
        }

        const { password: _, twoFactorSecret: __, ...userWithoutSecrets } = user;

        res.json({
            success: true,
            data: userWithoutSecrets
        });

    } catch (error) {
        console.error('Ошибка получения информации о пользователе:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Обновить профиль
router.patch('/profile', authenticateToken, validate(updateProfileSchema), (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Обновляем профиль
        const { fullName, email, avatar } = req.body;

        if (fullName !== undefined) user.fullName = fullName;
        if (email !== undefined) user.email = email;
        if (avatar !== undefined) user.avatar = avatar;

        const { password: _, twoFactorSecret: __, ...userWithoutSecrets } = user;

        console.log('✏️ Обновление профиля:', userWithoutSecrets);

        res.json({
            success: true,
            data: userWithoutSecrets,
            message: 'Профиль успешно обновлен'
        });

    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Смена пароля
router.post('/change-password', authenticateToken, validate(changePasswordSchema), (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Проверяем текущий пароль
        if (user.password !== currentPassword) {
            return res.status(400).json({
                success: false,
                error: 'Invalid current password',
                message: 'Неверный текущий пароль'
            });
        }

        // Обновляем пароль
        user.password = newPassword; // В реальности нужно хешировать

        console.log('🔑 Смена пароля пользователя:', user.username);

        res.json({
            success: true,
            message: 'Пароль успешно изменен'
        });

    } catch (error) {
        console.error('Ошибка смены пароля:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Настройка 2FA
router.post('/2fa/setup', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Генерируем секрет для 2FA (в реальности использовать speakeasy)
        const secret = 'JBSWY3DPEHPK3PXP'; // Мок секрет
        user.twoFactorSecret = secret;

        const qrCodeUrl = `otpauth://totp/ShopAdmin:${user.username}?secret=${secret}&issuer=ShopAdmin`;

        console.log('🔐 Настройка 2FA для:', user.username);

        res.json({
            success: true,
            data: {
                secret,
                qrCodeUrl,
                manualEntryKey: secret
            },
            message: 'QR код для настройки 2FA сгенерирован'
        });

    } catch (error) {
        console.error('Ошибка настройки 2FA:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Подтверждение 2FA
router.post('/2fa/verify', authenticateToken, validate(twoFactorCodeSchema), (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { code } = req.body;

        // Простая проверка кода (в реальности использовать TOTP верификацию)
        if (code !== '123456') {
            return res.status(400).json({
                success: false,
                error: 'Invalid 2FA code',
                message: 'Неверный код 2FA'
            });
        }

        // Включаем 2FA
        user.twoFactorEnabled = true;

        console.log('✅ 2FA включен для:', user.username);

        res.json({
            success: true,
            message: 'Двухфакторная аутентификация успешно включена'
        });

    } catch (error) {
        console.error('Ошибка верификации 2FA:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Отключение 2FA
router.post('/2fa/disable', authenticateToken, validate(twoFactorCodeSchema), (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = USERS.find(u => u.id === req.user!.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const { code } = req.body;

        // Проверяем код для отключения
        if (code !== '123456') {
            return res.status(400).json({
                success: false,
                error: 'Invalid 2FA code',
                message: 'Неверный код 2FA'
            });
        }

        // Отключаем 2FA
        user.twoFactorEnabled = false;
        user.twoFactorSecret = null;

        console.log('❌ 2FA отключен для:', user.username);

        res.json({
            success: true,
            message: 'Двухфакторная аутентификация отключена'
        });

    } catch (error) {
        console.error('Ошибка отключения 2FA:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

export default router;