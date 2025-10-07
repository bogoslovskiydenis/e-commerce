import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Загрузка переменных окружения в первую очередь
dotenv.config();

// Импорт конфигурации и базы данных
import { config } from '@/config';
import { prisma, connectDatabase } from '@/config/database';

// Импорт роутов
import routes from './src/routes/index.js';

// Импорт middleware
import { errorHandler } from '@/middleware/error.middleware';
import { notFound } from '@/middleware/notFound.middleware';
import { requestLogger } from '@/middleware/logging.middleware';

// Импорт утилит
import { logger } from '@/utils/logger';

// Определяем __filename и __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Экспортируем prisma для использования в других модулях
export { prisma };

// Создание Express приложения
const app = express();

// Базовые настройки безопасности
if (config.security.helmetEnabled) {
    app.use(helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
            },
        },
    }));
}

// CORS настройки - ИСПРАВЛЕНО для поддержки нескольких портов
if (config.security.corsEnabled) {
    // Парсим FRONTEND_URL как массив URL
    const allowedOrigins = config.frontendUrl
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

    app.use(cors({
        origin: function (origin, callback) {
            // Разрешаем запросы без origin (например, Postman, curl)
            if (!origin) return callback(null, true);

            // Проверяем, есть ли origin в списке разрешенных
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                logger.warn(`CORS: Blocked request from origin: ${origin}`);
                logger.warn(`CORS: Allowed origins: ${allowedOrigins.join(', ')}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    logger.info(`✅ CORS enabled for origins: ${allowedOrigins.join(', ')}`);
}

// Rate limiting
const limiter = rateLimit({
    windowMs: config.security.rateLimitWindow,
    max: config.nodeEnv === 'production' ? config.security.rateLimitMax : 1000,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Логирование запросов
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
}
app.use(requestLogger);

// Статические файлы
app.use('/uploads', express.static(config.upload.path));

// API роуты
app.use(config.api.prefix, routes);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.env.uptime(),
        environment: config.nodeEnv,
        version: config.api.version
    });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
    logger.info('🔄 Shutting down gracefully...');

    try {
        await prisma.$disconnect();
        logger.info('✅ Database disconnected');
        process.exit(0);
    } catch (error) {
        logger.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Запуск сервера
const startServer = async () => {
    try {
        // Подключаемся к базе данных
        await connectDatabase();

        // Запускаем сервер
        const PORT = config.port;
        app.listen(PORT, () => {
            logger.info('='.repeat(50));
            logger.info(`🚀 Server running on port ${PORT}`);
            logger.info(`📝 Environment: ${config.nodeEnv}`);
            logger.info(`🌐 Frontend URL: ${config.frontendUrl}`);
            logger.info(`📦 API prefix: ${config.api.prefix}`);
            logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
            logger.info('='.repeat(50));
        });
    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
    logger.error('❌ Uncaught Exception:', error);
    gracefulShutdown();
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});

// Запускаем сервер
startServer();

export default app;