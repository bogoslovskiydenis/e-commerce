import { Request, Response, NextFunction } from 'express';
import { ApiError, isOperationalError } from '../utils/apiError';
import { logger, logApiError } from '../utils/logger';
import { Prisma } from '@prisma/client';

/**
 * Middleware для обработки ошибок 404 (Not Found)
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};

/**
 * Основной middleware для обработки ошибок
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let apiError: ApiError;

    // Если это уже наша кастомная ошибка
    if (error instanceof ApiError) {
        apiError = error;
    } else {
        // Преобразуем различные типы ошибок в ApiError
        apiError = convertToApiError(error);
    }

    // Логируем ошибку
    logApiError(apiError, req, 'Error Handler');

    // В режиме разработки добавляем stack trace
    const response: any = {
        success: false,
        error: {
            message: apiError.message,
            statusCode: apiError.statusCode
        }
    };

    // Добавляем детали в ответ если есть
    if (apiError.details) {
        response.error.details = apiError.details;
    }

    // В development режиме добавляем stack trace
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = apiError.stack;
    }

    // Отправляем ответ
    res.status(apiError.statusCode).json(response);
};

/**
 * Преобразование различных типов ошибок в ApiError
 */
const convertToApiError = (error: Error): ApiError => {
    // Ошибки Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return handlePrismaError(error);
    }

    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        logger.error('Unknown Prisma error:', error);
        return new ApiError(500, 'Database error occurred');
    }

    if (error instanceof Prisma.PrismaClientRustPanicError) {
        logger.error('Prisma panic error:', error);
        return new ApiError(500, 'Database connection error');
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
        logger.error('Prisma initialization error:', error);
        return new ApiError(500, 'Database initialization error');
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
        return new ApiError(400, 'Invalid data provided', {
            type: 'validation',
            details: error.message
        });
    }

    // Ошибки валидации express-validator
    if (error.name === 'ValidationError') {
        return new ApiError(400, 'Validation failed', error.message);
    }

    // JWT ошибки
    if (error.name === 'JsonWebTokenError') {
        return new ApiError(401, 'Invalid token');
    }

    if (error.name === 'TokenExpiredError') {
        return new ApiError(401, 'Token expired');
    }

    // Multer ошибки (загрузка файлов)
    if (error.name === 'MulterError') {
        return handleMulterError(error as any);
    }

    // Ошибки синтаксиса JSON
    if (error instanceof SyntaxError && 'body' in error) {
        return new ApiError(400, 'Invalid JSON in request body');
    }

    // Ошибки MongoDB (если используется)
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
        return handleMongoError(error as any);
    }

    // Ошибки превышения лимита запросов
    if (error.message?.includes('Too many requests')) {
        return new ApiError(429, 'Too many requests, please try again later');
    }

    // По умолчанию - внутренняя ошибка сервера
    logger.error('Unhandled error:', error);
    return new ApiError(500, 'Internal server error');
};

/**
 * Обработка ошибок Prisma
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): ApiError => {
    switch (error.code) {
        case 'P2000':
            return new ApiError(400, 'The provided value is too long');

        case 'P2001':
            return new ApiError(404, 'Record not found');

        case 'P2002':
            const field = Array.isArray(error.meta?.target)
                ? error.meta.target.join(', ')
                : error.meta?.target;
            return new ApiError(409, `A record with this ${field} already exists`);

        case 'P2003':
            return new ApiError(400, 'Foreign key constraint violation');

        case 'P2004':
            return new ApiError(400, 'Database constraint violation');

        case 'P2005':
            return new ApiError(400, 'Invalid value provided');

        case 'P2006':
            return new ApiError(400, 'Invalid value provided');

        case 'P2007':
            return new ApiError(400, 'Data validation error');

        case 'P2008':
            return new ApiError(400, 'Failed to parse query');

        case 'P2009':
            return new ApiError(400, 'Failed to validate query');

        case 'P2010':
            return new ApiError(500, 'Raw query failed');

        case 'P2011':
            return new ApiError(400, 'Null constraint violation');

        case 'P2012':
            return new ApiError(400, 'Missing required value');

        case 'P2013':
            return new ApiError(400, 'Missing required argument');

        case 'P2014':
            return new ApiError(400, 'Relation violation');

        case 'P2015':
            return new ApiError(404, 'Related record not found');

        case 'P2016':
            return new ApiError(400, 'Query interpretation error');

        case 'P2017':
            return new ApiError(400, 'Records for relation are not connected');

        case 'P2018':
            return new ApiError(404, 'Required connected records not found');

        case 'P2019':
            return new ApiError(400, 'Input error');

        case 'P2020':
            return new ApiError(400, 'Value out of range');

        case 'P2021':
            return new ApiError(404, 'Table does not exist');

        case 'P2022':
            return new ApiError(404, 'Column does not exist');

        case 'P2023':
            return new ApiError(400, 'Inconsistent column data');

        case 'P2024':
            return new ApiError(500, 'Connection pool timeout');

        case 'P2025':
            return new ApiError(404, 'Record not found');

        default:
            logger.error('Unhandled Prisma error:', error);
            return new ApiError(500, 'Database error occurred');
    }
};

/**
 * Обработка ошибок Multer (загрузка файлов)
 */
const handleMulterError = (error: any): ApiError => {
    switch (error.code) {
        case 'LIMIT_FILE_SIZE':
            return new ApiError(400, 'File too large');

        case 'LIMIT_FILE_COUNT':
            return new ApiError(400, 'Too many files');

        case 'LIMIT_FIELD_KEY':
            return new ApiError(400, 'Field name too long');

        case 'LIMIT_FIELD_VALUE':
            return new ApiError(400, 'Field value too long');

        case 'LIMIT_FIELD_COUNT':
            return new ApiError(400, 'Too many fields');

        case 'LIMIT_UNEXPECTED_FILE':
            return new ApiError(400, 'Unexpected file field');

        case 'MISSING_FIELD_NAME':
            return new ApiError(400, 'Missing field name');

        default:
            return new ApiError(400, 'File upload error');
    }
};

/**
 * Обработка ошибок MongoDB (если используется)
 */
const handleMongoError = (error: any): ApiError => {
    switch (error.code) {
        case 11000:
            // Дубликат ключа
            const field = Object.keys(error.keyPattern || {})[0];
            return new ApiError(409, `A record with this ${field} already exists`);

        case 121:
            // Ошибка валидации документа
            return new ApiError(400, 'Document validation failed');

        default:
            return new ApiError(500, 'Database error occurred');
    }
};

/**
 * Middleware для обработки асинхронных ошибок
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Глобальный обработчик необработанных исключений
 */
export const setupGlobalErrorHandlers = () => {
    // Обработка необработанных исключений
    process.on('uncaughtException', (error: Error) => {
        logger.error('Uncaught Exception:', error);

        // Логируем и завершаем процесс
        if (!isOperationalError(error)) {
            process.exit(1);
        }
    });

    // Обработка необработанных отклонений промисов
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
        logger.error('Unhandled Rejection at:', promise, 'reason:', reason);

        // Не завершаем процесс для отклонений промисов
        // но логируем для дальнейшего анализа
    });

    // Обработка сигналов завершения
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        process.exit(0);
    });
};