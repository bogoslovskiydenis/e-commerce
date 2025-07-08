import cron from 'node-cron';
import { PermissionsService } from '../services/permissions.service';
import { logger } from '@/utils/logger';

// Запускаем очистку истекших разрешений каждый час
cron.schedule('0 * * * *', async () => {
    logger.info('Starting scheduled cleanup of expired permissions');
    try {
        await PermissionsService.cleanupExpiredPermissions();
    } catch (error) {
        logger.error('Scheduled permission cleanup failed:', error);
    }
});

// Запускаем проверку безопасности ежедневно в 2:00
cron.schedule('0 2 * * *', async () => {
    logger.info('Starting daily security audit');
    try {
        // Здесь можно добавить дополнительные проверки безопасности
        // Например, поиск подозрительных паттернов в правах пользователей
    } catch (error) {
        logger.error('Daily security audit failed:', error);
    }
});

export { PermissionsService };