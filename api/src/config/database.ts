import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Расширяем глобальный объект для хранения Prisma Client в development
declare global {
    var __prisma: PrismaClient | undefined;
}

// Создаем единственный экземпляр Prisma Client
export const prisma = globalThis.__prisma ?? new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// В development режиме сохраняем клиент глобально для избежания переподключений
if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}

// Настройка логирования для Prisma
prisma.$on('query', (e) => {
    if (process.env.NODE_ENV === 'development' && process.env.LOG_QUERIES === 'true') {
        logger.debug('Prisma Query', {
            query: e.query,
            params: e.params,
            duration: `${e.duration}ms`,
            timestamp: e.timestamp,
        });
    }
});

prisma.$on('error', (e) => {
    logger.error('Prisma Error', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
    });
});

prisma.$on('info', (e) => {
    logger.info('Prisma Info', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
    });
});

prisma.$on('warn', (e) => {
    logger.warn('Prisma Warning', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp,
    });
});

// Функция для проверки подключения к базе данных
export async function connectDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        logger.info('✅ Database connected successfully');

        // Проверяем соединение запросом
        await prisma.$queryRaw`SELECT 1`;
        logger.info('✅ Database health check passed');

    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        throw new Error(`Database connection failed: ${error}`);
    }
}

// Функция для отключения от базы данных
export async function disconnectDatabase(): Promise<void> {
    try {
        await prisma.$disconnect();
        logger.info('✅ Database disconnected successfully');
    } catch (error) {
        logger.error('❌ Database disconnection failed:', error);
        throw error;
    }
}

// Функция для получения статуса подключения
export async function getDatabaseStatus(): Promise<{
    connected: boolean;
    version?: string;
    error?: string;
}> {
    try {
        const result = await prisma.$queryRaw<Array<{ version: string }>>`
      SELECT version() as version
    `;

        return {
            connected: true,
            version: result[0]?.version || 'Unknown',
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Функция для выполнения транзакций
export async function withTransaction<T>(
    callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
    return await prisma.$transaction(async (tx) => {
        return await callback(tx as PrismaClient);
    });
}

// Экспорт для использования в других модулях
export default prisma;


