import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { prisma } from '../config/database';
import { logger } from '../utils/logger';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
    // Вход в систему
    async login(req: Request, res: Response) {
        try {
            const { username, password, twoFactorCode } = req.body;

            console.log('🔐 Login attempt:', { username }); О

            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    error: 'Username and password are required'
                });
            }

            // Найти пользователя
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        { username },
                        { email: username }
                    ]
                }
            });

            console.log('👤 User found:', user ? { id: user.id, username: user.username, active: user.isActive } : 'NOT FOUND');

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid credentials'
                });
            }

            // Проверить пароль
            const validPassword = await bcrypt.compare(password, user.passwordHash);
            console.log('🔐 Password valid:', validPassword);

            if (!validPassword) {
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

                const verified = speakeasy.totp.verify({
                    secret: user.twoFactorSecret,
                    encoding: 'base32',
                    token: twoFactorCode,
                    window: 2
                });

                if (!verified) {
                    return res.status(401).json({
                        success: false,
                        error: 'Invalid two-factor code'
                    });
                }
            }

            // Создать JWT токен
            const token = jwt.sign(
                {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    permissions: user.permissions || []
                },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            // Создать refresh токен
            const refreshToken = jwt.sign(
                { id: user.id },
                config.jwtRefreshSecret,
                { expiresIn: config.jwtRefreshExpiresIn }
            );

            // Обновить последний вход
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    lastLogin: new Date(),
                    lastLoginIp: req.ip
                }
            });

            // Убираем чувствительные данные
            const { passwordHash, twoFactorSecret, ...userWithoutSecrets } = user;

            console.log('✅ Login successful for user:', user.username);

            return res.json({
                success: true,
                data: {
                    token,
                    refreshToken,
                    user: userWithoutSecrets
                }
            });

        } catch (error) {
            console.error('❌ Login error:', error);
            logger.error('Login error', { error: error.message, stack: error.stack });

            return res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Выход из системы
    async logout(req: AuthenticatedRequest, res: Response) {
        try {
            // Здесь можно добавить логику для инвалидации токенов
            // Например, добавить токен в черный список

            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            console.error('❌ Logout error:', error);
            logger.error('Logout error', { error: error.message });

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    // Получить текущего пользователя
    async me(req: AuthenticatedRequest, res: Response) {
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
                    fullName: true,
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
            console.error('❌ Get me error:', error);
            logger.error('Get me error', { error: error.message });

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}