import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminUsersRoutes from './adminUsers.routes.js';

const router = Router();

// Базовая информация об API
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Balloon Shop API',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/*',
            admin: '/admin/*'
        }
    });
});

// Маршруты аутентификации
router.use('/auth', authRoutes);

// Управление пользователями
router.use('/admin/users', adminUsersRoutes);

export default router;