// src/config/index.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ

import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config();

// Интерфейс конфигурации
export interface Config {
    // Сервер
    port: number;
    nodeEnv: 'development' | 'production' | 'test';

    // База данных
    databaseUrl: string;

    // Redis
    redisUrl: string;
    redisDb: number;

    // JWT
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshSecret: string;
    jwtRefreshExpiresIn: string;

    // Frontend
    frontendUrl: string;
    corsOrigins: string[];

    // Email
    email: {
        host: string;
        port: number;
        user: string;
        password: string;
        from: string;
        secure: boolean;
    };

    // Файлы
    upload: {
        path: string;
        maxFileSize: number;
        allowedTypes: string[];
        publicUrl: string;
    };

    // Безопасность
    security: {
        bcryptRounds: number;
        rateLimitWindow: number;
        rateLimitMax: number;
        corsEnabled: boolean;
        helmetEnabled: boolean;
    };

    // API
    api: {
        prefix: string;
        version: string;
        keyHeader: string;
    };

    // Логирование
    logging: {
        level: string;
        file: string;
        maxSize: string;
        maxFiles: number;
        enableConsole: boolean;
        enableQueries: boolean;
    };

    // Мониторинг
    monitoring: {
        enabled: boolean;
        port: number;
        healthCheckPath: string;
    };

    // Кэширование
    cache: {
        defaultTtl: number;
        userSessionTtl: number;
        apiResponseTtl: number;
    };
}

// Функция валидации обязательных переменных
function validateRequiredEnvVars(): void {
    const required = [
        'DATABASE_URL',
        'JWT_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

// Функция преобразования строки в boolean
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true' || value === '1';
}

// Функция преобразования строки в массив
function parseArray(value: string | undefined, separator: string = ','): string[] {
    if (!value) return [];
    return value.split(separator).map(item => item.trim()).filter(Boolean);
}

// Валидируем обязательные переменные
validateRequiredEnvVars();

// ✅ ИСПРАВЛЕНО: Сначала определяем nodeEnv
const nodeEnv = (process.env.NODE_ENV as Config['nodeEnv']) || 'development';

// Основная конфигурация
export const config: Config = {
    // Сервер
    port: parseInt(process.env.PORT || '3001'),
    nodeEnv, // ✅ Используем уже определенную переменную

    // База данных
    databaseUrl: process.env.DATABASE_URL!,

    // Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
    redisDb: parseInt(process.env.REDIS_DB || '0'),

    // JWT
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

    // Frontend
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    corsOrigins: parseArray(process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000'),

    // Email
    email: {
        host: process.env.EMAIL_HOST || '',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@balloonshop.com',
        secure: parseBoolean(process.env.EMAIL_SECURE, false),
    },

    // Файлы
    upload: {
        path: process.env.UPLOAD_PATH || path.join(process.cwd(), 'uploads'),
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
        allowedTypes: parseArray(process.env.UPLOAD_ALLOWED_TYPES || 'image/jpeg,image/png,image/webp,image/gif'),
        publicUrl: process.env.UPLOAD_PUBLIC_URL || '/uploads',
    },

    // Безопасность
    security: {
        bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12'),
        rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 минут
        rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'),
        corsEnabled: parseBoolean(process.env.CORS_ENABLED, true),
        helmetEnabled: parseBoolean(process.env.HELMET_ENABLED, true),
    },

    // API
    api: {
        prefix: process.env.API_PREFIX || '/api',
        version: process.env.API_VERSION || 'v1',
        keyHeader: process.env.API_KEY_HEADER || 'X-API-Key',
    },

    // Логирование
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        file: process.env.LOG_FILE || path.join(process.cwd(), 'logs', 'app.log'),
        maxSize: process.env.LOG_MAX_SIZE || '20m',
        maxFiles: parseInt(process.env.LOG_MAX_FILES || '14'),
        enableConsole: parseBoolean(process.env.LOG_CONSOLE, nodeEnv !== 'production'), // ✅ Используем nodeEnv
        enableQueries: parseBoolean(process.env.LOG_QUERIES, nodeEnv === 'development'), // ✅ Используем nodeEnv
    },

    // Мониторинг
    monitoring: {
        enabled: parseBoolean(process.env.ENABLE_MONITORING, false),
        port: parseInt(process.env.MONITORING_PORT || '9090'),
        healthCheckPath: process.env.HEALTH_CHECK_PATH || '/health',
    },

    // Кэширование
    cache: {
        defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '3600'), // 1 час
        userSessionTtl: parseInt(process.env.CACHE_USER_SESSION_TTL || '86400'), // 24 часа
        apiResponseTtl: parseInt(process.env.CACHE_API_RESPONSE_TTL || '300'), // 5 минут
    },
};

// Функция для получения конфигурации по окружению
export function getEnvironmentConfig(): Partial<Config> {
    switch (config.nodeEnv) {
        case 'development':
            return {
                logging: {
                    ...config.logging,
                    level: 'debug',
                    enableConsole: true,
                    enableQueries: true,
                },
                security: {
                    ...config.security,
                    rateLimitMax: 1000, // Больше запросов в разработке
                },
            };

        case 'production':
            return {
                logging: {
                    ...config.logging,
                    level: 'warn',
                    enableConsole: false,
                    enableQueries: false,
                },
                security: {
                    ...config.security,
                    rateLimitMax: 100, // Строже в продакшне
                },
            };

        case 'test':
            return {
                logging: {
                    ...config.logging,
                    level: 'error',
                    enableConsole: false,
                    enableQueries: false,
                },
                cache: {
                    ...config.cache,
                    defaultTtl: 60, // Короткий TTL для тестов
                },
            };

        default:
            return {};
    }
}

// Применяем конфигурацию окружения
const environmentConfig = getEnvironmentConfig();
Object.assign(config, environmentConfig);

// Функция для логирования конфигурации (без секретов)
export function logConfiguration(): void {
    const safeConfig = {
        ...config,
        jwtSecret: '***HIDDEN***',
        jwtRefreshSecret: '***HIDDEN***',
        databaseUrl: config.databaseUrl.replace(/:\/\/.*@/, '://***:***@'),
        email: {
            ...config.email,
            password: config.email.password ? '***HIDDEN***' : '',
        },
    };

    console.log('📋 Configuration loaded:', JSON.stringify(safeConfig, null, 2));
}

// Экспорт по умолчанию
export default config;

// ===================================
// ДОПОЛНИТЕЛЬНО: Создайте минимальный .env файл для теста

// .env
/*
DATABASE_URL="postgresql://username:password@localhost:5432/balloonshop"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="test-secret-key-123"
JWT_REFRESH_SECRET="test-refresh-secret-456"
PORT=3001
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
LOG_LEVEL="debug"
LOG_CONSOLE="true"
LOG_QUERIES="true"
*/

// ===================================
// ТАКЖЕ ПРОВЕРЬТЕ app.ts - должен быть такой импорт:

/*
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Импорт конфигурации
import { config } from './config/index.js'; // ✅ Добавьте .js если используете ES modules

// Остальные импорты...
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';

// Загрузка переменных окружения
dotenv.config();

console.log('🚀 Starting server...');
console.log('📋 Config loaded:', config.nodeEnv, config.port);

const app = express();

// ... остальной код
*/