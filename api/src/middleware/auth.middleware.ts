import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import { config } from '@/config';
import { prisma } from '@/config/database';

export interface AuthenticatedUser {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    role: string;
    permissions: string[];
    customPermissions?: string[];
    deniedPermissions?: string[];
    temporaryPermissions?: Record<string, string>;
    isActive: boolean;
    twoFactorEnabled: boolean;
    accessStartTime?: string;
    accessEndTime?: string;
    allowedIPs?: string[];
    lastLogin?: Date;
    loginAttempts: number;
    lockedUntil?: Date;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}

export const authenticateToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                code: 'AUTH_TOKEN_MISSING'
            });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, config.jwtSecret);
        } catch (jwtError: any) {
            if (jwtError.name === 'TokenExpiredError') {
                return res.status(401).json({
                    error: 'Token expired',
                    code: 'AUTH_TOKEN_EXPIRED'
                });
            }
            return res.status(401).json({
                error: 'Invalid token',
                code: 'AUTH_TOKEN_INVALID'
            });
        }

        // Получаем пользователя из БД
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
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
                loginAttempts: true,
                lockedUntil: true
            }
        });

        if (!user) {
            return res.status(401).json({
                error: 'User not found',
                code: 'AUTH_USER_NOT_FOUND'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                error: 'Account is inactive',
                code: 'AUTH_ACCOUNT_INACTIVE'
            });
        }

        // Проверяем блокировку аккаунта
        if (user.lockedUntil && new Date() < user.lockedUntil) {
            return res.status(423).json({
                error: 'Account is temporarily locked',
                code: 'AUTH_ACCOUNT_LOCKED',
                lockedUntil: user.lockedUntil
            });
        }

        // Устанавливаем пользователя в запрос
        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            permissions: user.permissions || [],
            customPermissions: [],
            deniedPermissions: [],
            temporaryPermissions: {},
            isActive: user.isActive,
            twoFactorEnabled: user.twoFactorEnabled,
            lastLogin: user.lastLogin,
            loginAttempts: user.loginAttempts,
            lockedUntil: user.lockedUntil
        };

        logger.debug('User authenticated successfully', {
            userId: user.id,
            username: user.username,
            role: user.role,
            endpoint: req.path
        });

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            code: 'AUTH_INTERNAL_ERROR'
        });
    }
};

// Опциональная аутентификация (не требует токен)
export const optionalAuthentication = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // Если токена нет - просто продолжаем без пользователя
        return next();
    }

    // Если токен есть - пытаемся аутентифицировать
    return authenticateToken(req, res, next);
};

// Middleware для обновления времени последнего доступа
export const updateLastAccess = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    if (req.user) {
        try {
            // Обновляем время последнего доступа в фоне
            prisma.user.update({
                where: { id: req.user.id },
                data: { lastLogin: new Date() }
            }).catch((error: any) => {
                logger.error('Failed to update last access:', error);
            });
        } catch (error) {
            // Игнорируем ошибки обновления lastLogin
        }
    }
    next();
};

export default authenticateToken;