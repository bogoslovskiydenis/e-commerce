import { Router } from 'express';
import { navigationController } from '../controllers/navigation.controller.js';
import { adminActionLogger } from '../middleware/logging.middleware.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { requirePermission } from '../middleware/permissions.middleware.js';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// Получить все элементы навигации (с фильтрами)
router.get('/',
    requirePermission('website.navigation'),
    navigationController.getNavigationItems
);

// Получить дерево навигации
router.get('/tree',
    requirePermission('website.navigation'),
    navigationController.getNavigationTree
);

// Получить один элемент
router.get('/:id',
    requirePermission('website.navigation'),
    navigationController.getNavigationItem
);

// Создать элемент навигации
router.post('/',
    requirePermission('website.navigation'),
    adminActionLogger('create', 'navigation'),
    navigationController.createNavigationItem
);

// Обновить элемент
router.put('/:id',
    requirePermission('website.navigation'),
    adminActionLogger('update', 'navigation'),
    navigationController.updateNavigationItem
);

router.patch('/:id',
    requirePermission('website.navigation'),
    adminActionLogger('patch', 'navigation'),
    navigationController.updateNavigationItem
);

// Изменить порядок элементов
router.post('/reorder',
    requirePermission('website.navigation'),
    adminActionLogger('reorder', 'navigation'),
    navigationController.reorderNavigationItems
);

// Удалить элемент
router.delete('/:id',
    requirePermission('website.navigation'),
    adminActionLogger('delete', 'navigation'),
    navigationController.deleteNavigationItem
);

export default router;