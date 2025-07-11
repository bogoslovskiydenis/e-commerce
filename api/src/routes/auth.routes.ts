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
        } : 'NOT FOUND');

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Account is deactivated'
            });
        }

        // Проверка пароля с помощью bcrypt
        console.log('🔐 Проверка пароля...');
        console.log('🔐 Входящий пароль:', password);
        console.log('🔐 Хеш из БД:', user.passwordHash.substring(0, 50));
        const passwordValid = await verifyPassword(password, user.passwordHash);
        console.log('🔐 Результат проверки пароля:', passwordValid);

        if (!passwordValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Проверить 2FA если включен
        if (user.twoFactorEnabled) {
            if (!twoFactorCode) {
                return res.status(200).json({
                    success: false,
                    requiresTwoFactor: true,
                    message: 'Two-factor authentication required'
                });
            }

            // Здесь должна быть проверка 2FA кода
            // const verified = speakeasy.totp.verify({...});
            // if (!verified) {
            //     return res.status(401).json({
            //         success: false,
            //         error: 'Invalid two-factor code'
            //     });
            // }
        }

        // Создание токенов
        const token = generateToken(user.id, user.username, user.role, user.permissions || []);
        const refreshToken = generateRefreshToken(user.id);

        // Обновление времени последнего входа
        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date()
                // lastLoginIp поле не существует в схеме БД
            }
        });

        // Убираем чувствительные данные
        const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

        console.log('✅ Успешный вход для пользователя:', user.username);

        res.json({
            success: true,
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
            error: 'Internal server error'
        });
    }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        console.log('👋 Выход пользователя:', req.user?.username);

        // Здесь можно добавить логику для инвалидации токена
        // Например, добавить в blacklist

        res.json({
            success: true,
            message: 'Logged out successfully'
        });

    } catch (error) {
        console.error('❌ Ошибка выхода:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Получить текущего пользователя
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true, // ✅ Используем правильное поле
                role: true,
                permissions: true,
                isActive: true,
                twoFactorEnabled: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });

    } catch (error) {
        console.error('❌ Ошибка получения пользователя:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Refresh token endpoint
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                error: 'Refresh token is required'
            });
        }

        // Верификация refresh токена
        const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                error: 'Invalid refresh token'
            });
        }

        // Создание новых токенов
        const newToken = generateToken(user.id, user.username, user.role, user.permissions || []);
        const newRefreshToken = generateRefreshToken(user.id);

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
        console.error('❌ Ошибка обновления токена:', error);
        res.status(401).json({
            success: false,
            error: 'Invalid refresh token'
        });
    }
});

export default router;