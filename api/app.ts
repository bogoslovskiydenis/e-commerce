import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Импорт роутов
import authRoutes from './src/routes/auth.routes';
import adminRoutes from './src/routes/admin.routes';
import apiRoutes from './src/routes/api.routes';

// Импорт middleware
import { errorHandler } from './src/middleware/error.middleware';
import { notFound } from './src/middleware/notFound.middleware';
import { requestLogger } from './src/middleware/logging.middleware';

// Импорт утилит
import { logger } from './src/utils/logger';
import { connectRedis } from './src/config/redis';

// Загрузка переменных окружения
dotenv.config();

// Инициализация Prisma
export const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

// Создание Express приложения
const app = express();

// Базовые настройки безопасности
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

// CORS настройки
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: process.env.NODE_ENV === 'production' ? 100 : 1000, // лимит запросов
    message: {
        error: 'Слишком много запросов с этого IP, попробуйте позже'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);

// Парсинг JSON и URL-encoded данных
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP логирование
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined', {
        stream: {
            write: (message: string) => logger.info(message.trim())
        }
    }));
}

// Кастомное логирование запросов
app.use(requestLogger);

// Статические файлы
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', apiRoutes);

// Роут для проверки версии API
app.get('/api/version', (req, res) => {
    res.json({
        version: '1.0.0',
        name: 'Balloon Shop Admin API',
        description: 'API для админ панели интернет-магазина шариков'
    });
});

// 404 handler
app.use(notFound);

// Error handler (должен быть последним)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await prisma.$disconnect();
    process.exit(0);
});

// Запуск сервера
const PORT = process.env.PORT || 3001;

async function startServer() {
    try {
        // Подключение к Redis
        await connectRedis();
        logger.info('Redis connected successfully');

        // Проверка подключения к БД
        await prisma.$connect();
        logger.info('Database connected successfully');

        // Запуск HTTP сервера
        app.listen(PORT, () => {
            logger.info(`🚀 Server is running on port ${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            logger.info(`🔗 Health check: http://localhost:${PORT}/health`);

            if (process.env.NODE_ENV === 'development') {
                logger.info(`📋 API docs available at: http://localhost:${PORT}/api/version`);
            }
        });

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Запуск приложения
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export default app;