import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
    // Вход в систему
    async login(req: Request, res: Response) {
        try {
            const { username, password, twoFactorCode } = req.body;

            if (!username || !password) {
                return res.status(400).json({
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

            if (!user || !user.isActive) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Проверить пароль
            const validPassword = await bcrypt.compare(password, user.passwordHash);
            if (!validPassword) {
                return res.status(401).json({
                    error: 'Invalid credentials'
                });
            }

            // Проверить 2FA если включен
            if (user.twoFactorEnabled) {
                if (!twoFactorCode) {
                    return res.status(200).json({
                        requires2FA: true,
                        message: 'Two-factor authentication required'
                    });
                }

                const verified = speakeasy.totp.verify({
                    secret: user.twoFactorSecret!,
                    encoding: 'base32',
                    token: twoFactorCode,
                    window: 1
                });

                if (!verified) {
                    return res.status(401).json({
                        error: 'Invalid two-factor code'
                    });
                }
            }

            // Создать токены
            const accessToken = jwt.sign(
                { userId: user.id, username: user.username },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            const refreshToken = jwt.sign(
                { userId: user.id },
                config.jwtRefreshSecret,
                { expiresIn: config.jwtRefreshExpiresIn }
            );

            // Обновить время последнего входа
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLogin: new Date() }
            });

            // Логировать вход
            await prisma.adminLog.create({
                data: {
                    userId: user.id,
                    action: 'login',
                    resource: 'auth',
                    description: 'User logged in',
                    ipAddress: req.ip || 'unknown',
                    userAgent: req.get('User-Agent') || 'unknown',
                    metadata: {},
                    level: 'INFO'
                }
            });

            res.json({
                success: true,
                accessToken,
                refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    permissions: user.permissions,
                }
            });

        } catch (error) {
            logger.error('Login error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Выход из системы
    async logout(req: AuthenticatedRequest, res: Response) {
        try {
            if (req.user) {
                // Логировать выход
                await prisma.adminLog.create({
                    data: {
                        userId: req.user.id,
                        action: 'logout',
                        resource: 'auth',
                        description: 'User logged out',
                        ipAddress: req.ip || 'unknown',
                        userAgent: req.get('User-Agent') || 'unknown',
                        metadata: {},
                        level: 'INFO'
                    }
                });
            }

            res.json({
                success: true,
                message: 'Logged out successfully'
            });

        } catch (error) {
            logger.error('Logout error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Обновление токена
    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({
                    error: 'Refresh token required'
                });
            }

            const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    isActive: true,
                }
            });

            if (!user || !user.isActive) {
                return res.status(401).json({
                    error: 'Invalid refresh token'
                });
            }

            const newAccessToken = jwt.sign(
                { userId: user.id, username: user.username },
                config.jwtSecret,
                { expiresIn: config.jwtExpiresIn }
            );

            res.json({
                success: true,
                accessToken: newAccessToken
            });

        } catch (error) {
            logger.error('Token refresh error:', error);
            res.status(401).json({
                error: 'Invalid refresh token'
            });
        }
    }

    // Получить профиль текущего пользователя
    async getProfile(req: AuthenticatedRequest, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.id },
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    twoFactorEnabled: true,
                    avatarUrl: true,
                    lastLogin: true,
                    createdAt: true,
                }
            });

            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            res.json({
                success: true,
                user
            });

        } catch (error) {
            logger.error('Get profile error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

