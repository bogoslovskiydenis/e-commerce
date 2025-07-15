
import { Router } from 'express';
import { productsController } from '@/controllers/products.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/permissions.middleware';
import { adminActionLogger } from '@/middleware/logging.middleware';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// === ПОЛУЧЕНИЕ ДАННЫХ ===

// Получить список всех товаров
router.get('/',
    requirePermission('products.view'),
    productsController.getProducts
);

// Получить товар по ID
router.get('/:id',
    requirePermission('products.view'),
    productsController.getProduct
);

// === СОЗДАНИЕ И ОБНОВЛЕНИЕ ===

// Создать новый товар
router.post('/',
    requirePermission('products.create'),
    adminActionLogger('create', 'product'),
    productsController.createProduct
);

// Обновить товар
router.put('/:id',
    requirePermission('products.edit'),
    adminActionLogger('update', 'product'),
    productsController.updateProduct
);

// === УДАЛЕНИЕ ===

// Удалить товар
router.delete('/:id',
    requirePermission('products.delete'),
    adminActionLogger('delete', 'product'),
    productsController.deleteProduct
);

export default router;