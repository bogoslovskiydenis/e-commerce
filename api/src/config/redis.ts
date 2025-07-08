import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

// Типы для Redis клиента
export type RedisClient = RedisClientType;

// Конфигурация Redis
const redisConfig = {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        connectTimeout: 60000,
        lazyConnect: true,
        reconnectStrategy: (retries: number) => {
            if (retries > 10) {
                logger.error('❌ Redis: Too many connection retries, giving up');
                return false;
            }
            const delay = Math.min(retries * 100, 3000);
            logger.warn(`🔄 Redis: Reconnecting in ${delay}ms (attempt ${retries})`);
            return delay;
        },
    },
    database: parseInt(process.env.REDIS_DB || '0'),
};

// Создание Redis клиента
export const redisClient: RedisClient = createClient(redisConfig);

// Обработка событий Redis
redisClient.on('error', (err) => {
    logger.error('❌ Redis Client Error:', {
        error: err.message,
        stack: err.stack,
    });
});

redisClient.on('connect', () => {
    logger.info('🔄 Redis Client Connecting...');
});

redisClient.on('ready', () => {
    logger.info('✅ Redis Client Ready');
});

redisClient.on('end', () => {
    logger.info('🔌 Redis Client Connection Ended');
});

redisClient.on('reconnecting', () => {
    logger.warn('🔄 Redis Client Reconnecting...');
});

// Функция подключения к Redis
export async function connectRedis(): Promise<RedisClient> {
    try {
        if (redisClient.isReady) {
            logger.info('✅ Redis already connected');
            return redisClient;
        }

        await redisClient.connect();

        // Тестируем соединение
        await redisClient.ping();
        logger.info('✅ Redis connected and ping successful');

        return redisClient;
    } catch (error) {
        logger.error('❌ Failed to connect to Redis:', error);
        throw new Error(`Redis connection failed: ${error}`);
    }
}

// Функция отключения от Redis
export async function disconnectRedis(): Promise<void> {
    try {
        if (redisClient.isOpen) {
            await redisClient.quit();
            logger.info('✅ Redis disconnected gracefully');
        }
    } catch (error) {
        logger.error('❌ Error disconnecting from Redis:', error);
        // Принудительно закрываем соединение
        await redisClient.disconnect();
    }
}

// Функция для получения статуса Redis
export async function getRedisStatus(): Promise<{
    connected: boolean;
    version?: string;
    memory?: string;
    uptime?: number;
    error?: string;
}> {
    try {
        if (!redisClient.isReady) {
            return { connected: false, error: 'Client not ready' };
        }

        const info = await redisClient.info();
        const lines = info.split('\r\n');

        const version = lines.find(line => line.startsWith('redis_version:'))?.split(':')[1];
        const memory = lines.find(line => line.startsWith('used_memory_human:'))?.split(':')[1];
        const uptime = lines.find(line => line.startsWith('uptime_in_seconds:'))?.split(':')[1];

        return {
            connected: true,
            version,
            memory,
            uptime: uptime ? parseInt(uptime) : undefined,
        };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Утилитарные функции для работы с кэшем
export class RedisCache {
    // Установка значения с TTL
    static async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
        try {
            const serializedValue = JSON.stringify(value);

            if (ttlSeconds) {
                await redisClient.setEx(key, ttlSeconds, serializedValue);
            } else {
                await redisClient.set(key, serializedValue);
            }

            logger.debug(`✅ Redis: Set key "${key}" with TTL ${ttlSeconds || 'none'}`);
        } catch (error) {
            logger.error(`❌ Redis: Failed to set key "${key}":`, error);
            throw error;
        }
    }

    // Получение значения
    static async get<T = any>(key: string): Promise<T | null> {
        try {
            const value = await redisClient.get(key);

            if (value === null) {
                logger.debug(`🔍 Redis: Key "${key}" not found`);
                return null;
            }

            const parsed = JSON.parse(value);
            logger.debug(`✅ Redis: Retrieved key "${key}"`);
            return parsed;
        } catch (error) {
            logger.error(`❌ Redis: Failed to get key "${key}":`, error);
            return null;
        }
    }

    // Удаление ключа
    static async del(key: string): Promise<boolean> {
        try {
            const result = await redisClient.del(key);
            logger.debug(`✅ Redis: Deleted key "${key}"`);
            return result > 0;
        } catch (error) {
            logger.error(`❌ Redis: Failed to delete key "${key}":`, error);
            return false;
        }
    }

    // Проверка существования ключа
    static async exists(key: string): Promise<boolean> {
        try {
            const result = await redisClient.exists(key);
            return result > 0;
        } catch (error) {
            logger.error(`❌ Redis: Failed to check existence of key "${key}":`, error);
            return false;
        }
    }

    // Установка TTL для существующего ключа
    static async expire(key: string, ttlSeconds: number): Promise<boolean> {
        try {
            const result = await redisClient.expire(key, ttlSeconds);
            return result;
        } catch (error) {
            logger.error(`❌ Redis: Failed to set TTL for key "${key}":`, error);
            return false;
        }
    }

    // Получение всех ключей по паттерну
    static async keys(pattern: string): Promise<string[]> {
        try {
            return await redisClient.keys(pattern);
        } catch (error) {
            logger.error(`❌ Redis: Failed to get keys with pattern "${pattern}":`, error);
            return [];
        }
    }

    // Очистка кэша по паттерну
    static async clearPattern(pattern: string): Promise<number> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length === 0) return 0;

            const result = await redisClient.del(keys);
            logger.info(`✅ Redis: Cleared ${result} keys matching pattern "${pattern}"`);
            return result;
        } catch (error) {
            logger.error(`❌ Redis: Failed to clear pattern "${pattern}":`, error);
            return 0;
        }
    }
}

// Экспорт для использования в других модулях
export default redisClient;
