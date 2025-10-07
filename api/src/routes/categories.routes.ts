// api/src/routes/categories.routes.ts
import { Router } from 'express';
import { CategoriesController } from '@/controllers/categories.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/permissions.middleware';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema,
    reorderCategoriesSchema,
    moveCategorySchema,
    deleteCategorySchema
} from '@/validation/categories.validation';
import { validate } from '@/middleware/validation.middleware';

const router = Router();
const controller = new CategoriesController();

// ============================================
// ПУБЛИЧНЫЕ МАРШРУТЫ (без авторизации)
// ============================================

// Получить список всех активных категорий
router.get(
    '/',
    controller.getCategories.bind(controller)
);

// Получить дерево категорий
router.get(
    '/tree',
    controller.getCategoriesTree.bind(controller)
);

// Получить категории для навигации
router.get(
    '/navigation',
    controller.getNavigationCategories.bind(controller)
);

// ✅ НОВЫЙ РОУТ: Получить категорию по slug (для фронтенда)
router.get(
    '/slug/:slug',
    controller.getCategoryBySlug.bind(controller)
);

// Получить категорию по ID
router.get(
    '/:id',
    validate(categoryIdParamSchema),
    controller.getCategory.bind(controller)
);

// ============================================
// ЗАЩИЩЕННЫЕ МАРШРУТЫ (требуют авторизации)
// ============================================

// Создать новую категорию
router.post(
    '/',
    authenticateToken,
    requirePermission('categories.create'),
    validate(createCategorySchema),
    controller.createCategory.bind(controller)
);

// Обновить категорию
router.put(
    '/:id',
    authenticateToken,
    requirePermission('categories.edit'),
    validate(categoryIdParamSchema),
    validate(updateCategorySchema),
    controller.updateCategory.bind(controller)
);

// Изменить порядок категорий
router.post(
    '/reorder',
    authenticateToken,
    requirePermission('categories.edit'),
    validate(reorderCategoriesSchema),
    controller.reorderCategories.bind(controller)
);

// Переместить категорию
router.post(
    '/:id/move',
    authenticateToken,
    requirePermission('categories.edit'),
    validate(categoryIdParamSchema),
    validate(moveCategorySchema),
    controller.moveCategory.bind(controller)
);

// Удалить категорию
router.delete(
    '/:id',
    authenticateToken,
    requirePermission('categories.delete'),
    validate(categoryIdParamSchema),
    validate(deleteCategorySchema),
    controller.deleteCategory.bind(controller)
);

export default router;