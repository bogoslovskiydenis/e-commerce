
import { Router } from 'express';
import { productsController } from '@/controllers/products.controller';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/permissions.middleware';
import { adminActionLogger } from '@/middleware/logging.middleware';

const router = Router();

// Публичные маршруты (БЕЗ авторизации)
router.get('/', productsController.getProducts);
router.get('/:id', productsController.getProduct);

// Применяем аутентификацию только к защищенным маршрутам
// Создание товара
router.post('/',
    authenticateToken,
    requirePermission('products.create'),
    adminActionLogger('create', 'product'),
    productsController.createProduct
);

// Обновление товара
router.put('/:id',
    authenticateToken,
    requirePermission('products.edit'),
    adminActionLogger('update', 'product'),
    productsController.updateProduct
);

// Удаление товара
router.delete('/:id',
    authenticateToken,
    requirePermission('products.delete'),
    adminActionLogger('delete', 'product'),
    productsController.deleteProduct
);

export default router;