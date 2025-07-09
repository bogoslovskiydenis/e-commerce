import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';
import rateLimit from 'express-rate-limit';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        role: string;
        permissions: string[];
    };
}

export const rateLimitByUser = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // максимум 100 запросов на пользователя
    keyGenerator: (req: AuthenticatedRequest) => {
        return req.user?.id || req.ip; // Используем ID пользователя или IP
    },
    message: {
        error: 'Too many requests',
        message: 'Слишком много запросов от этого пользователя'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Строгий rate limiting для критических операций
export const strictRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 запросов
    keyGenerator: (req: AuthenticatedRequest) => {
        return req.user?.id || req.ip;
    },
    message: {
        error: 'Rate limit exceeded',
        message: 'Превышен лимит запросов для критических операций'
    }
});

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;

        console.log('🔍 Auth header:', authHeader ? 'Bearer ***' : 'Missing');
        console.log('🔍 Token extracted:', token ? 'Present' : 'Missing');

        if (!token) {
            console.log('❌ No token provided');
            return res.status(401).json({
                success: false,
                error: 'Access token required',
                message: 'Токен доступа обязателен'
            });
        }

        // Верифицируем JWT токен
        const decoded = jwt.verify(token, config.jwtSecret) as any;
        console.log('✅ Token verified for user:', decoded.username);

        req.user = {
            id: decoded.id,
            username: decoded.username,
            role: decoded.role,
            permissions: decoded.permissions || []
        };

        next();
    } catch (error) {
        console.error('❌ Token verification failed:', error.message);

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token expired',
                message: 'Токен истек'
            });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token',
                message: 'Недействительный токен'
            });
        } else {
            return res.status(401).json({
                success: false,
                error: 'Token verification failed',
                message: 'Ошибка проверки токена'
            });
        }
    }
};

// Middleware для проверки разрешений
export const requirePermission = (permission: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const hasPermission = req.user.permissions.includes(permission) ||
            req.user.permissions.includes('admin.full_access');

        if (!hasPermission) {
            console.log(`❌ Permission denied: ${req.user.username} tried to access ${permission}`);
            return res.status(403).json({
                success: false,
                error: 'Permission denied',
                message: 'Недостаточно прав доступа'
            });
        }

        console.log(`✅ Permission granted: ${req.user.username} can access ${permission}`);
        next();
    };
};

// Middleware для проверки роли
export const requireRole = (roles: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        const hasRole = allowedRoles.includes(req.user.role);

        if (!hasRole) {
            console.log(`❌ Role denied: ${req.user.username} (${req.user.role}) tried to access roles: ${allowedRoles.join(', ')}`);
            return res.status(403).json({
                success: false,
                error: 'Insufficient role',
                message: 'Недостаточный уровень доступа'
            });
        }

        console.log(`✅ Role granted: ${req.user.username} (${req.user.role}) can access`);
        next();
    };
};