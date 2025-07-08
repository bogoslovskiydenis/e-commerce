import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import apiRoutes from './api.routes';

const router = Router();

// Подключение роутов
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/', apiRoutes);

export default router;