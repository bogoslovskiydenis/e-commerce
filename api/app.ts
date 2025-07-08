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

// CORS настройки
if (config.security.corsEnabled) {
    app.use(cors({
        origin: config.frontendUrl,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: config.security.rateLimitWindow,
    max: config.nodeEnv === 'production' ? config.security.rateLimitMax : 1000, // Больше лимит в dev
    message: {
        error: 'Too many requests',
        message: 'Please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

// Логирование запросов
if (config.nodeEnv === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Middleware для парсинга JSON
app.use(express.json({
    limit: '10mb',
    strict: true
}));

app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
}));

// Кастомное логирование запросов
app.use(requestLogger);

// Статические файлы (для загруженных изображений)
app.use('/uploads', express.static(config.upload.path));

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Проверяем подключение к базе данных
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.nodeEnv,
            version: process.env.npm_package_version || '1.0.0',
            database: 'connected',
            memory: process.memoryUsage()
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// API роуты
app.use(config.api.prefix, routes);

// 404 middleware
app.use(notFound);

// Error handling middleware (должен быть последним)
app.use(errorHandler);

// Функция запуска сервера
async function startServer() {
    try {
        logger.info('🚀 Starting Balloon Shop API server...');

        // Подключение к Redis (опционально)
        if (config.redisUrl) {
            logger.info('🔄 Connecting to Redis...');
            try {
                const { connectRedis } = await import('./src/config/redis.js');
                await connectRedis();
                logger.info('✅ Redis connected successfully');
            } catch (redisError) {
                logger.warn('⚠️ Redis connection failed, continuing without Redis:', redisError);
            }
        }

        // Подключение к базе данных
        logger.info('🔄 Connecting to database...');
        await connectDatabase();

        // Запуск сервера
        const server = app.listen(config.port, () => {
            logger.info(`🎉 Server is running on port ${config.port}`);
            logger.info(`🌍 Environment: ${config.nodeEnv}`);
            logger.info(`📍 API endpoint: http://localhost:${config.port}${config.api.prefix}`);
            logger.info(`🏥 Health check: http://localhost:${config.port}/health`);

            if (config.nodeEnv === 'development') {
                logger.info(`🎯 Frontend URL: ${config.frontendUrl}`);
                logger.info(`📝 Logs level: ${config.logging.level}`);
            }
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`📝 Received ${signal}, shutting down gracefully...`);

            server.close(async () => {
                logger.info('✅ HTTP server closed');

                try {
                    await prisma.$disconnect();
                    logger.info('✅ Database connection closed');
                } catch (error) {
                    logger.error('❌ Error closing database connection:', error);
                }

                logger.info('✅ Graceful shutdown completed');
                process.exit(0);
            });

            // Форсируем выход если graceful shutdown не завершился за 30 секунд
            setTimeout(() => {
                logger.error('❌ Graceful shutdown timed out, forcing exit');
                process.exit(1);
            }, 30000);
        };

        // Обработчики сигналов
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Обработка необработанных ошибок
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            logger.error('❌ Uncaught Exception:', error);
            process.exit(1);
        });

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Запускаем сервер
startServer();

export default app;