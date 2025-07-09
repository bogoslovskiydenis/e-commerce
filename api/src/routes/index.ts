import { Router } from 'express';
import { Request, Response } from 'express';

// Импорт маршрутов
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import apiRoutes from './api.routes.js';

// Импорт middleware
import { authenticateToken } from '../middleware/auth.middleware.js';
import { rateLimitByUser } from '../middleware/auth.middleware.js';

const router = Router();

// Здоровье API
router.get('/health', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Информация об API
router.get('/info', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: {
            name: 'Shop Admin API',
            version: '1.0.0',
            description: 'API для админ панели интернет-магазина шариков',
            features: [
                'Аутентификация с JWT',
                'Двухфакторная аутентификация',
                'Система разрешений',
                'Логирование действий',
                'Rate limiting',
                'Управление товарами',
                'Управление заказами',
                'Управление клиентами',
                'Аналитика и отчеты'
            ],
            endpoints: {
                auth: '/auth/*',
                admin: '/admin/*',
                api: '/api/*'
            }
        }
    });
});

// Публичные маршруты (без аутентификации)
router.use('/auth', authRoutes);

// Защищенные маршруты администратора
router.use('/admin',
    authenticateToken,
    rateLimitByUser(200, 60000), // 200 запросов в минуту
    adminRoutes
);

// Защищенные API маршруты
router.use('/api',
    authenticateToken,
    rateLimitByUser(500, 60000), // 500 запросов в минуту
    apiRoutes
);

// Обработчик несуществующих маршрутов
router.use('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        message: `Маршрут ${req.method} ${req.originalUrl} не найден`,
        availableRoutes: [
            'GET /health - Проверка состояния API',
            'GET /info - Информация об API',
            'POST /auth/login - Вход в систему',
            'POST /auth/logout - Выход из системы',
            'GET /auth/me - Информация о пользователе',
            'GET /admin/* - Административные маршруты',
            'GET /api/* - API маршруты'
        ]
    });
});

export default router;