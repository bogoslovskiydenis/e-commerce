import { Router } from 'express';

// Импортируем роуты
let authRoutes: any = null;
let adminRoutes: any = null;
let permissionsRoutes: any = null;

try {
    authRoutes = (await import('./auth.routes.js')).default;
} catch (e) {
    console.log('Auth routes not found');
}

try {
    adminRoutes = (await import('./admin.routes.js')).default;
} catch (e) {
    console.log('Admin routes not found');
}

try {
    permissionsRoutes = (await import('./permissions.routes.js')).default;
} catch (e) {
    console.log('Permissions routes not found');
}

const router = Router();

// Тестовый роут
router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        availableRoutes: {
            auth: authRoutes ? 'loaded' : 'not found',
            admin: adminRoutes ? 'loaded' : 'not found',
            permissions: permissionsRoutes ? 'loaded' : 'not found'
        }
    });
});

// Подключаем роуты если они загружены
if (authRoutes) {
    router.use('/auth', authRoutes);
}

if (adminRoutes) {
    router.use('/admin', adminRoutes);
}

if (permissionsRoutes) {
    router.use('/admin', permissionsRoutes);
}

export default router;