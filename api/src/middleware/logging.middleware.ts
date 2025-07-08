import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from './auth.middleware';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            contentLength: res.get('Content-Length'),
        };

        if (res.statusCode >= 400) {
            logger.warn('HTTP Request', logData);
        } else {
            logger.info('HTTP Request', logData);
        }
    });

    next();
};

export const adminActionLogger = (action: string, resource: string) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // Логируем до выполнения действия
        const originalSend = res.send;

        res.send = function(data) {
            // Логируем успешные действия
            if (res.statusCode < 400 && req.user) {
                logAdminAction(req, action, resource, 'success');
            }

            return originalSend.call(this, data);
        };

        next();
    };
};

async function logAdminAction(
    req: AuthenticatedRequest,
    action: string,
    resource: string,
    result: string
) {
    try {
        if (!req.user) return;

        await prisma.adminLog.create({
            data: {
                userId: req.user.id,
                action,
                resource,
                resourceId: req.params.id || null,
                description: `${action} ${resource} - ${result}`,
                ipAddress: req.ip || 'unknown',
                userAgent: req.get('User-Agent') || 'unknown',
                metadata: {
                    method: req.method,
                    url: req.url,
                    body: req.method !== 'GET' ? req.body : undefined,
                    params: req.params,
                    query: req.query,
                },
                level: result === 'success' ? 'INFO' : 'WARNING',
            }
        });
    } catch (error) {
        logger.error('Failed to log admin action:', error);
    }
}