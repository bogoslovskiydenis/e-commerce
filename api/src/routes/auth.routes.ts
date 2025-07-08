import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { z } from 'zod';

const router = Router();
const authController = new AuthController();

// Схемы валидации
const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
        twoFactorCode: z.string().optional()
    })
});

const refreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().min(1, 'Refresh token is required')
    })
});

// Роуты
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authenticateToken, authController.logout);
router.post('/refresh', validate(refreshSchema), authController.refresh);
router.get('/me', authenticateToken, authController.getProfile);

export default router;



