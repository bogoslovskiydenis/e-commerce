import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения
dotenv.config();

// Вспомогательные функции
function parseBoolean(value: string | undefined, defaultValue: boolean = false): boolean {
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
}

function parseArray(value: string | undefined, defaultValue: string[] = []): string[] {
    if (!value) return defaultValue;
    return value.split(',').map(item => item.trim()).filter(Boolean);
}

const nodeEnv = process.env.NODE_ENV || 'development';

export const config = {
    // Основные настройки
    nodeEnv,
    port: parseInt(process.env.PORT || '3001'),

    // База данных
    databaseUrl: process.env.DATABASE_URL || '',

    // Redis
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

    // JWT
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-in-production',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',

    // Frontend
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    // Email (для будущего использования)
    email: {
        host: process.env.EMAIL_HOST || '',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        user: process.env.EMAIL_USER || '',
        password: process.env.EMAIL_PASSWORD || '',
        from: process.env.EMAIL_FROM || 'noreply@balloonshop.com',
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
        enableConsole: parseBoolean(process.env.LOG_CONSOLE, nodeEnv !== 'production'),
        enableQueries: parseBoolean(process.env.LOG_QUERIES, nodeEnv === 'development'),
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
        redisTtl: parseInt(process.env.CACHE_REDIS_TTL || '7200'), // 2 часа
    },

    // 2FA
    twoFactor: {
        serviceName: process.env.TWO_FACTOR_SERVICE_NAME || 'Balloon Shop Admin',
        issuer: process.env.TWO_FACTOR_ISSUER || 'Balloon Shop',
    },

    // Webhooks
    webhooks: {
        secret: process.env.WEBHOOK_SECRET || 'webhook-secret-change-in-production',
    }
} as const;

// Валидация обязательных переменных окружения
const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET',
];

// В продакшене требуем дополнительные переменные
if (nodeEnv === 'production') {
    requiredEnvVars.push(
        'JWT_REFRESH_SECRET',
        'FRONTEND_URL'
    );
}

// Проверяем наличие обязательных переменных
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Логируем конфигурацию при загрузке (без секретов)
if (nodeEnv === 'development') {
    console.log('🔧 Configuration loaded:', {
        nodeEnv: config.nodeEnv,
        port: config.port,
        databaseUrl: config.databaseUrl ? '***configured***' : 'NOT SET',
        frontendUrl: config.frontendUrl,
        jwtSecret: config.jwtSecret ? '***configured***' : 'NOT SET',
        redisUrl: config.redisUrl,
        logLevel: config.logging.level
    });
}

export default config;