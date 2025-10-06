import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateToken);

// Временный endpoint для логов (пока полноценный не готов)
router.post('/', async (req, res) => {
    console.log('📝 Admin log:', req.body);
    res.json({ success: true });
});

router.get('/', async (req, res) => {
    res.json({
        success: true,
        data: [],
        total: 0
    });
});

export default router;