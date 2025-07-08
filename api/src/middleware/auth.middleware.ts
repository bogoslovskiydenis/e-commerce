import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { config } from '../config';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        permissions: string[];
    };
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
                error: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, config.jwtSecret) as any;

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
            }
        });

        if (!user || !user.isActive) {
            return res.status(401).json({
                error: 'Invalid or inactive user'
            });
        }

        req.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
        };

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        return res.status(403).json({
            error: 'Invalid token'
        });
    }
};
