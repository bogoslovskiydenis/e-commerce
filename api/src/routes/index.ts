import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminUsersRoutes from './adminUsers.routes.js';
import categoriesRoutes from './categories.routes.js';
import productsRoutes from './products.routes.js';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Balloon Shop API',
        version: '1.0.0',
        endpoints: {
            auth: '/auth/*',
            admin: '/admin/*',
            categories: '/categories/*',
            products: '/products/*' // ✅ ДОБАВЛЕНО
        }
    });
});

router.use('/auth', authRoutes);
router.use('/admin/users', adminUsersRoutes);
router.use('/categories', categoriesRoutes);
router.use('/products', productsRoutes);

export default router;