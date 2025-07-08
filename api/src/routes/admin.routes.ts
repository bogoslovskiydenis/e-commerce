import { Router } from 'express';

const router = Router();

router.get('/dashboard', (req, res) => {
    res.json({
        success: true,
        data: {
            stats: {
                totalUsers: 5,
                totalOrders: 150,
                totalProducts: 89,
                revenue: 25000
            }
        }
    });
});

router.get('/users', (req, res) => {
    res.json({
        success: true,
        data: [
            {
                id: '1',
                username: 'admin',
                fullName: 'Administrator',
                role: 'SUPER_ADMIN',
                isActive: true
            }
        ]
    });
});

router.get('/test', (req, res) => {
    res.json({
        success: true,
        message: 'Admin route working'
    });
});

export default router;