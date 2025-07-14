import { Router } from 'express';
import { categoriesController } from '@/controllers/categories.controller';
import { adminActionLogger } from '@/middleware/logging.middleware';
import { validate } from '@/middleware/validation.middleware';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/permissions.middleware';
import {
    createCategorySchema,
    updateCategorySchema,
    categoryIdParamSchema
} from '@/validation/categories.validation';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// === ПОЛУЧЕНИЕ ДАННЫХ ===

// Получить список всех категорий
router.get('/',
    requirePermission('categories.view'),
    categoriesController.getCategories
);

// Получить категорию по ID
router.get('/:id',
    requirePermission('categories.view'),
    validate(categoryIdParamSchema),
    categoriesController.getCategory
);

// Получить дерево категорий
router.get('/tree/hierarchy',
    requirePermission('categories.view'),
    categoriesController.getCategoriesTree
);

// Получить категории для навигации (активные)
router.get('/navigation/public',
    categoriesController.getNavigationCategories
);

// === СОЗДАНИЕ И ОБНОВЛЕНИЕ ===

// Создать новую категорию
router.post('/',
    requirePermission('categories.create'),
    validate(createCategorySchema),
    adminActionLogger('create', 'category'),
    categoriesController.createCategory
);

// Обновить категорию
router.put('/:id',
    requirePermission('categories.edit'),
    validate(updateCategorySchema),
    adminActionLogger('update', 'category'),
    categoriesController.updateCategory
);

// Частичное обновление категории
router.patch('/:id',
    requirePermission('categories.edit'),
    validate(categoryIdParamSchema),
    adminActionLogger('patch', 'category'),
    categoriesController.updateCategory
);

// === СПЕЦИАЛЬНЫЕ ДЕЙСТВИЯ ===

// Переключить статус активности категории
router.post('/:id/toggle-status',
    requirePermission('categories.edit'),
    validate(categoryIdParamSchema),
    adminActionLogger('toggle_status', 'category'),
    categoriesController.toggleCategoryStatus
);

// Изменить порядок категорий
router.post('/reorder',
    requirePermission('categories.edit'),
    adminActionLogger('reorder', 'category'),
    categoriesController.reorderCategories
);

// Переместить категорию
router.post('/:id/move',
    requirePermission('categories.edit'),
    validate(categoryIdParamSchema),
    adminActionLogger('move', 'category'),
    categoriesController.moveCategory
);

// === УДАЛЕНИЕ ===

// Удалить категорию
router.delete('/:id',
    requirePermission('categories.delete'),
    validate(categoryIdParamSchema),
    adminActionLogger('delete', 'category'),
    categoriesController.deleteCategory
);

export default router;