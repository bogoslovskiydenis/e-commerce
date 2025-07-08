import { Router } from 'express';
import { validate } from '../middleware/validation.middleware.js';
import { z } from 'zod';

const router = Router();

// Схема валидации для логина
const loginSchema = z.object({
    body: z.object({
        username: z.string().min(1, 'Username is required'),
        password: z.string().min(1, 'Password is required'),
        twoFactorCode: z.string().optional()
    })
});

// Простой контроллер для тестирования
router.post('/login', validate(loginSchema), (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin123') {
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: 'mock-jwt-token-' + Date.now(),
                refreshToken: 'mock-refresh-token',
                user: {
                    id: '1',
                    username: 'admin',
                    fullName: 'Administrator',
                    role: 'SUPER_ADMIN',
                    permissions: ['admin.full_access']
                }
            }
        });
    } else {
        res.status(401).json({
            error: 'Invalid credentials',
            message: 'Username or password is incorrect'
        });
    }
});

router.post('/logout', (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

router.get('/me', (req, res) => {
    res.json({
        success: true,
        data: {
            id: '1',
            username: 'admin',
            fullName: 'Administrator',
            role: 'SUPER_ADMIN',
            permissions: ['admin.full_access']
        }
    });
});

export default router;