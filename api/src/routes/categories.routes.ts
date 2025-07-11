import { Router } from 'express';
import { authenticateToken, requirePermission } from '@/middleware/auth.middleware';
import { categoriesController } from '@/controllers/categories.controller';
import { validate } from '@/middleware/validation.middleware';
import { z } from 'zod';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// Схемы валидации
const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
        description: z.string().optional(),
        slug: z.string().optional(),
        parentId: z.string().uuid().optional().nullable(),
        isActive: z.boolean().optional().default(true),
        sortOrder: z.number().int().min(0).optional().default(0),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional()
    })
});

const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid category ID')
    }),
    body: z.object({
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        parentId: z.string().uuid().optional().nullable(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().int().min(0).optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional()
    })
});

const categoryIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid category ID')
    })
});

// Получить список категорий
router.get('/',
    requirePermission('categories.view'),
    categoriesController.getCategories
);

// Получить категорию по ID
router.get('/:id',
    requirePermission('categories.view'),
    validate(categoryIdSchema),
    categoriesController.getCategory
);

// Создать новую категорию
router.post('/',
    requirePermission('categories.create'),
    validate(createCategorySchema),
    categoriesController.createCategory
);

// Обновить категорию
router.put('/:id',
    requirePermission('categories.edit'),
    validate(updateCategorySchema),
    categoriesController.updateCategory
);

// Удалить категорию
router.delete('/:id',
    requirePermission('categories.delete'),
    validate(categoryIdSchema),
    categoriesController.deleteCategory
);

export default router;