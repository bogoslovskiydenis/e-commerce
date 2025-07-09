import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        role: string;
        permissions: string[];
        active: boolean;
    };
}

// Мок данные пользователей (должны совпадать с auth.routes.ts)
const USERS = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        fullName: 'Супер Администратор',
        role: 'SUPER_ADMIN',
        permissions: ['admin.full_access'],
        active: true
    },
    {
        id: '2',
        username: 'manager',
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
        active: true
    },
    {
        id: '3',
        username: 'operator',
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
        active: true
    }
];

// Функция для извлечения пользователя из токена
const getUserFromToken = (token: string) => {
    try {
        // В реальности здесь должна быть JWT верификация
        // Сейчас используем простую проверку формата токена
        if (!token.startsWith('token_')) {
            return null;
        }

        const userId = token.split('_')[1];
        const user = USERS.find(u => u.id === userId);

        return user && user.active ? user : null;
    } catch (error) {
        console.error('Ошибка парсинга токена:', error);
        return null;
    }
};

// Middleware для проверки аутентификации
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access token required',
                message: 'Требуется токен доступа'
            });
        }

        const user = getUserFromToken(token);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired token',
                message: 'Недействительный или истекший токен'
            });
        }

        if (!user.active) {
            return res.status(403).json({
                success: false,
                error: 'Account disabled',
                message: 'Аккаунт заблокирован'
            });
        }

        // Добавляем пользователя в request
        req.user = user;

        console.log('🔓 Аутентификация прошла успешно:', user.username);
        next();

    } catch (error) {
        console.error('❌ Ошибка аутентификации:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication error',
            message: 'Ошибка аутентификации'
        });
    }
};

// Middleware для проверки разрешений
export const requirePermission = (permission: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                message: 'Требуется аутентификация'
            });
        }

        const userPermissions = req.user.permissions;
        const requiredPermissions = Array.isArray(permission) ? permission : [permission];

        // Супер админ имеет все права
        if (userPermissions.includes('admin.full_access')) {
            console.log('🔐 Доступ разрешен (супер админ):', req.user.username);
            return next();
        }

        // Проверяем наличие нужных разрешений
        const hasPermission = requiredPermissions.some(perm =>
            userPermissions.includes(perm)
        );

        if (!hasPermission) {
            console.log('❌ Недостаточно прав:', {
                user: req.user.username,
                required: requiredPermissions,
                current: userPermissions
            });

            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                message: 'Недостаточно прав доступа',
                required: requiredPermissions,
                current: userPermissions
            });
        }

        console.log('✅ Доступ разрешен:', {
            user: req.user.username,
            permission: requiredPermissions
        });

        next();
    };
};

// Middleware для проверки роли
export const requireRole = (roles: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required',
                message: 'Требуется аутентификация'
            });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            console.log('❌ Недостаточный уровень роли:', {
                user: req.user.username,
                userRole: req.user.role,
                requiredRoles: allowedRoles
            });

            return res.status(403).json({
                success: false,
                error: 'Insufficient role permissions',
                message: 'Недостаточный уровень роли',
                required: allowedRoles,
                current: req.user.role
            });
        }

        console.log('✅ Роль подтверждена:', {
            user: req.user.username,
            role: req.user.role
        });

        next();
    };
};

// Middleware для логирования действий администратора
export const adminActionLogger = (action: string, resourceType: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next();
        }

        // Сохраняем оригинальную функцию json
        const originalJson = res.json;

        // Переопределяем функцию json для логирования после ответа
        res.json = function(body) {
            // Логируем действие только если операция прошла успешно
            if (res.statusCode >= 200 && res.statusCode < 300) {
                logAdminAction(req.user!, action, resourceType, req, body);
            }

            // Вызываем оригинальную функцию
            return originalJson.call(this, body);
        };

        next();
    };
};

// Функция логирования действий администратора
const logAdminAction = (
    user: AuthenticatedRequest['user'],
    action: string,
    resourceType: string,
    req: Request,
    responseBody: any
) => {
    try {
        const logEntry = {
            id: Date.now().toString(),
            userId: user!.id,
            username: user!.username,
            action,
            resourceType,
            resourceId: req.params.id || responseBody?.data?.id || null,
            method: req.method,
            path: req.path,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent'),
            timestamp: new Date().toISOString(),
            success: true
        };

        console.log('📝 Действие администратора:', logEntry);

        // В реальности здесь должно быть сохранение в базу данных
        // Сейчас просто выводим в консоль

    } catch (error) {
        console.error('Ошибка логирования действия администратора:', error);
    }
};

// Middleware для проверки статуса аккаунта
export const checkAccountStatus = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required'
        });
    }

    if (!req.user.active) {
        return res.status(403).json({
            success: false,
            error: 'Account disabled',
            message: 'Ваш аккаунт заблокирован. Обратитесь к администратору.'
        });
    }

    next();
};

// Middleware для ограничения частоты запросов по пользователю
const userRequestCount = new Map<string, { count: number; resetTime: number }>();

export const rateLimitByUser = (maxRequests: number = 100, windowMs: number = 60000) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return next();
        }

        const userId = req.user.id;
        const now = Date.now();
        const userLimit = userRequestCount.get(userId);

        if (!userLimit || now > userLimit.resetTime) {
            // Создаем новую запись или сбрасываем счетчик
            userRequestCount.set(userId, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        if (userLimit.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                message: 'Слишком много запросов. Попробуйте позже.',
                retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
            });
        }

        // Увеличиваем счетчик
        userLimit.count++;
        next();
    };
};

// Middleware для проверки IP адреса (опционально)
export const checkIPWhitelist = (allowedIPs: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (allowedIPs.length === 0) {
            return next(); // Если whitelist пустой, пропускаем все
        }

        const clientIP = req.ip || req.connection.remoteAddress || '';

        if (!allowedIPs.includes(clientIP)) {
            console.log('❌ IP адрес не в whitelist:', clientIP);
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                message: 'Доступ запрещен с вашего IP адреса'
            });
        }

        next();
    };
};

// Middleware для проверки времени работы (опционально)
export const checkWorkingHours = (startHour: number = 0, endHour: number = 24) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const currentHour = new Date().getHours();

        if (currentHour < startHour || currentHour >= endHour) {
            return res.status(403).json({
                success: false,
                error: 'Access denied',
                message: `Доступ к системе разрешен только с ${startHour}:00 до ${endHour}:00`
            });
        }

        next();
    };
};

// Экспорт всех middleware
export {
    getUserFromToken,
    logAdminAction
};