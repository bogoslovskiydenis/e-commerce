import { AuthenticatedRequest } from './auth.middleware';
import {NextFunction, Request, Response} from 'express';
import {logger} from "@/utils/logger";

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
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next();
        }

        // Логируем действие
        logger.info('Admin action', {
            type: 'admin_action',
            userId: user.id,
            username: user.username,
            action,
            resourceType,
            resourceId: req.params.id,
            method: req.method,
            url: req.url,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Сохраняем в базу данных (если prisma доступна)
        try {
            const { prisma } = require('../config/database');

            await prisma.adminLog.create({
                data: {
                    userId: user.id,
                    username: user.username,
                    action,
                    resourceType,
                    resourceId: req.params.id || null,
                    description: `${action} ${resourceType}`,
                    ip: req.ip,
                    userAgent: req.get('User-Agent'),
                    level: 'INFO',
                    metadata: {
                        method: req.method,
                        url: req.url,
                        body: req.body
                    }
                }
            });
        } catch (error) {
            logger.error('Failed to save admin log to database:', error);
        }

        next();
    };
};