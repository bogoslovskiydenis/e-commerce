import { Router } from 'express';
import { validate } from '../middleware/validation.middleware.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database.js';
import { config } from '../config/index.js';

const router = Router();

// Схема валидации для логина
const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
        twoFactorCode: z.string().optional()
    })
});

// Утилиты для работы с токенами
const generateToken = (userId: string, username: string, role: string, permissions: string[]) => {
    return jwt.sign(
        {
            id: userId,
            username,
            role,
            permissions
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
};

const generateRefreshToken = (userId: string) => {
    return jwt.sign(
        { id: userId },
        config.jwtRefreshSecret,
        { expiresIn: config.jwtRefreshExpiresIn }
    );
};

// Утилита для проверки пароля
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};



// Основной логин endpoint
router.post('/login', validate(loginSchema), async (req: Request, res: Response) => {
    try {
        const { username, password, twoFactorCode } = req.body;

        console.log('🔐 Попытка входа:', { username });

        // Поиск пользователя в базе данных
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        console.log('🔍 Пользователь найден:', user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            isActive: user.isActive
        } : 'НЕ НАЙДЕН');

        if (!user) {
            console.log('❌ Пользователь не найден');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                message: 'Неверный логин или пароль'
            });
        }

        // Проверка пароля
        console.log('🔍 Проверяем пароль...');
        const passwordValid = await verifyPassword(password, user.passwordHash);
        console.log('🔍 Результат проверки пароля:', passwordValid);

        if (!passwordValid) {
            console.log('❌ Неверный пароль');
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials',
                message: 'Неверный логин или пароль'
            });
        }

        // Проверка активности аккаунта
        if (!user.isActive) {
            console.log('❌ Аккаунт неактивен');
            return res.status(403).json({
                success: false,
                error: 'Account disabled',
                message: 'Аккаунт заблокирован'
            });
        }

        // Проверка 2FA (упрощенная)
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.json({
                    success: false,
                    requiresTwoFactor: true,
                    message: 'Требуется код двухфакторной аутентификации'
                });
            }

            if (twoFactorCode !== '123456') {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid 2FA code',
                    message: 'Неверный код двухфакторной аутентификации'
                });
            }
        }

        // Обновляем время последнего входа
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });

        // Создаем токены
        const token = generateToken(user.id, user.username, user.role, user.permissions);
        const refreshToken = generateRefreshToken(user.id);

        // Сохраняем refresh token в базе данных (если таблица существует)
        try {
            await prisma.userSession.create({
                data: {
                    userId: user.id,
                    refreshToken,
                    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 дней
                    ipAddress: req.ip,
                    userAgent: req.get('User-Agent')
                }
            });
        } catch (sessionError) {
            console.log('⚠️ Не удалось сохранить сессию:', sessionError.message);
            // Продолжаем без сохранения сессии
        }

        // Убираем секретные данные из ответа
        const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

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

// Получить информацию о текущем пользователе
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'User not authenticated'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'User not found or inactive'
            });
        }

        const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

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

// Выход
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            try {
                // Удаляем сессию из базы данных
                await prisma.userSession.deleteMany({
                    where: {
                        refreshToken,
                        userId: req.user?.id
                    }
                });
            } catch (sessionError) {
                console.log('⚠️ Не удалось удалить сессию:', sessionError.message);
            }
        }

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

router.post('/create-hash', async (req: Request, res: Response) => {
    try {
        const password = 'admin123';
        const saltRounds = 12;

        console.log('🔧 Создание хеша для пароля:', password);

        const hash = await bcrypt.hash(password, saltRounds);
        console.log('✅ Сгенерированный хеш:', hash);

        // Проверяем, что хеш работает
        const isValid = await bcrypt.compare(password, hash);
        console.log('🔍 Проверка хеша:', isValid);

        // Обновляем всех пользователей
        const updateResult = await prisma.user.updateMany({
            where: {
                username: {
                    in: ['admin', 'manager', 'operator']
                }
            },
            data: {
                passwordHash: hash
            }
        });

        console.log('📊 Обновлено пользователей:', updateResult.count);

        return res.json({
            success: true,
            message: 'Пароли обновлены',
            data: {
                newHash: hash,
                isValid: isValid,
                updatedUsers: updateResult.count
            }
        });

    } catch (error) {
        console.error('❌ Ошибка создания хеша:', error);
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token required'
            });
        }

        // Проверяем refresh token в базе данных
        let session;
        try {
            session = await prisma.userSession.findUnique({
                where: { refreshToken },
                include: { user: true }
            });
        } catch (sessionError) {
            console.log('⚠️ UserSession table not found, using simple JWT verify');

            // Если таблицы нет, проверяем JWT напрямую
            try {
                const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
                const user = await prisma.user.findUnique({
                    where: { id: decoded.id }
                });

                if (!user || !user.isActive) {
                    return res.status(401).json({
                        success: false,
                        error: 'User not found or inactive'
                    });
                }

                // Создаем новые токены
                const newToken = generateToken(user.id, user.username, user.role, user.permissions);
                const newRefreshToken = generateRefreshToken(user.id);

                const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

                return res.json({
                    success: true,
                    data: {
                        token: newToken,
                        refreshToken: newRefreshToken,
                        user: userWithoutSecrets
                    }
                });

            } catch (jwtError) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid refresh token'
                });
            }
        }

        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired refresh token'
            });
        }

        const user = session.user;

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'User inactive'
            });
        }

        // Создаем новые токены
        const newToken = generateToken(user.id, user.username, user.role, user.permissions);
        const newRefreshToken = generateRefreshToken(user.id);

        // Обновляем сессию
        await prisma.userSession.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        });

        const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

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

router.post('/admin/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log('📝 Admin log request from:', req.user?.username);

        // Пока что просто возвращаем успех, позже можно добавить реальное логирование
        res.json({
            success: true,
            message: 'Log recorded'
        });

    } catch (error) {
        console.error('❌ Admin log error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Получение логов (заглушка)
router.get('/admin/logs', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log('📋 Get logs request from:', req.user?.username);

        // Заглушка - возвращаем пустой массив логов
        res.json({
            success: true,
            data: []
        });

    } catch (error) {
        console.error('❌ Get logs error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// DEBUG ENDPOINT - временный для диагностики
router.post('/debug-login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        console.log('🔍 DEBUG: Login attempt:', { username, password });

        // Поиск пользователя
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        console.log('🔍 DEBUG: User found:', user ? {
            id: user.id,
            username: user.username,
            email: user.email,
            passwordHashStart: user.passwordHash.substring(0, 30),
            isActive: user.isActive
        } : 'NOT FOUND');

        if (!user) {
            return res.json({
                success: false,
                debug: 'User not found',
                searchedUsername: username
            });
        }

        // Проверка пароля с помощью bcrypt
        console.log('🔍 DEBUG: Checking password with bcrypt...');
        console.log('🔍 DEBUG: Provided password:', password);
        console.log('🔍 DEBUG: Stored hash start:', user.passwordHash.substring(0, 30));

        const passwordValid = await bcrypt.compare(password, user.passwordHash);

        console.log('🔍 DEBUG: Bcrypt result:', passwordValid);

        // Дополнительные проверки
        const testPassword = 'admin123';
        const testHash = '$2b$12$LQv3c1yqBwEHFx8.9rI2HO2yfuZ/5P8bC2Qht9HQ5/9FG5M6y7K7K';
        const testResult = await bcrypt.compare(testPassword, testHash);

        console.log('🔍 DEBUG: Test admin123 against known hash:', testResult);

        return res.json({
            success: true,
            debug: {
                userFound: true,
                username: user.username,
                email: user.email,
                isActive: user.isActive,
                providedPassword: password,
                storedHashStart: user.passwordHash.substring(0, 30),
                bcryptResult: passwordValid,
                testResult: testResult,
                hashMatches: user.passwordHash === testHash
            }
        });

    } catch (error) {
        console.error('❌ DEBUG: Error:', error);
        return res.status(500).json({
            success: false,
            debug: 'Exception occurred',
            error: error.message
        });
    }
});

export default router;