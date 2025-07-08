import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';

export interface CustomError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error('Error handler:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
    });

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({
                    error: 'Conflict',
                    message: 'Resource already exists',
                    details: error.meta?.target
                });
            case 'P2025':
                return res.status(404).json({
                    error: 'Not found',
                    message: 'Resource not found'
                });
            default:
                return res.status(400).json({
                    error: 'Database error',
                    message: 'Invalid request'
                });
        }
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
            message: 'Authentication failed'
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
            message: 'Please login again'
        });
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            message: error.message
        });
    }

    // Custom errors
    const statusCode = error.statusCode || 500;
    const message = statusCode === 500 ? 'Internal server error' : error.message;

    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal server error' : error.name,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: error.stack
        })
    });
};