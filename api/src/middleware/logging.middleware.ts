import { AuthenticatedRequest } from './auth.middleware';
import { NextFunction, Request, Response } from 'express';
import { logger } from "@/utils/logger";
import { prisma } from '@/config/database'; // ✅ ДОБАВИТЬ ЭТОТ ИМПОРТ

// Middleware для логирования всех запросов
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Логируем начало запроса
    logger.info('Incoming request', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Перехватываем ответ
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - start;

        logger.info('Request completed', {
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip
        });

        return originalSend.call(this, data);
    };

    next();
};

// Middleware для логирования действий администраторов
export const adminActionLogger = (action: string, resourceType: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Логируем действие
        logger.info('Admin action', {
            type: 'admin_action',
            userId: (req as any).user?.id,
            username: (req as any).user?.username,
            action,
            resourceType,
            resourceId: req.params.id,
            method: req.method,
            url: req.path,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });

        // ВАЖНО: просто пробрасываем дальше, НЕ перехватываем ошибки
        next();
    };
};