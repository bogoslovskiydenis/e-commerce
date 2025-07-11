import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth.middleware';
import { requirePermission } from '@/middleware/permissions.middleware';
import { adminActionLogger } from '@/middleware/logging.middleware';

// Контроллеры
import { ProductsController } from '@/controllers/products.controller';
import { OrdersController } from '@/controllers/orders.controller';
import { CustomersController } from '@/controllers/customers.controller';
import { CategoriesController } from '@/controllers/categories.controller';
import { BannersController } from '@/controllers/banners.controller';
import { PagesController } from '@/controllers/pages.controller';
import { SettingsController } from '@/controllers/settings.controller';

import adminUsersRoutes from './adminUsers.routes';

const router = Router();

router.use(authenticateToken);

router.use('/admin/users', adminUsersRoutes);

const productsController = new ProductsController();
const ordersController = new OrdersController();
const customersController = new CustomersController();
const categoriesController = new CategoriesController();
const bannersController = new BannersController();
const pagesController = new PagesController();
const settingsController = new SettingsController();

router.get('/products',
    requirePermission('products.view'),
    productsController.getProducts
);

router.post('/products',
    requirePermission('products.create'),
    adminActionLogger('create', 'product'),
    productsController.createProduct
);

router.get('/products/:id',
    requirePermission('products.view'),
    productsController.getProduct
);

router.put('/products/:id',
    requirePermission('products.edit'),
    adminActionLogger('edit', 'product'),
    productsController.updateProduct
);

router.delete('/products/:id',
    requirePermission('products.delete'),
    adminActionLogger('delete', 'product'),
    productsController.deleteProduct
);

// === ЗАКАЗЫ ===
router.get('/orders',
    requirePermission('orders.view'),
    ordersController.getOrders
);

router.get('/orders/:id',
    requirePermission('orders.view'),
    ordersController.getOrder
);

router.patch('/orders/:id/status',
    requirePermission('orders.edit'),
    adminActionLogger('edit', 'order'),
    ordersController.updateOrderStatus
);

// === КЛИЕНТЫ ===
router.get('/customers',
    requirePermission('customers.view'),
    customersController.getCustomers
);

router.get('/customers/:id',
    requirePermission('customers.view'),
    customersController.getCustomer
);

router.put('/customers/:id',
    requirePermission('customers.edit'),
    adminActionLogger('edit', 'customer'),
    customersController.updateCustomer
);

// === КАТЕГОРИИ ===
router.get('/categories',
    requirePermission('categories.view'),
    categoriesController.getCategories
);

router.post('/categories',
    requirePermission('categories.create'),
    adminActionLogger('create', 'category'),
    categoriesController.createCategory
);

router.put('/categories/:id',
    requirePermission('categories.edit'),
    adminActionLogger('edit', 'category'),
    categoriesController.updateCategory
);

router.delete('/categories/:id',
    requirePermission('categories.delete'),
    adminActionLogger('delete', 'category'),
    categoriesController.deleteCategory
);

// === БАННЕРЫ ===
router.get('/banners',
    requirePermission('website.banners'),
    bannersController.getBanners
);

router.post('/banners',
    requirePermission('website.banners'),
    adminActionLogger('create', 'banner'),
    bannersController.createBanner
);

router.put('/banners/:id',
    requirePermission('website.banners'),
    adminActionLogger('edit', 'banner'),
    bannersController.updateBanner
);

router.delete('/banners/:id',
    requirePermission('website.banners'),
    adminActionLogger('delete', 'banner'),
    bannersController.deleteBanner
);

// === СТРАНИЦЫ ===
router.get('/pages',
    requirePermission('website.pages'),
    pagesController.getPages
);

router.post('/pages',
    requirePermission('website.pages'),
    adminActionLogger('create', 'page'),
    pagesController.createPage
);

router.put('/pages/:id',
    requirePermission('website.pages'),
    adminActionLogger('edit', 'page'),
    pagesController.updatePage
);

router.delete('/pages/:id',
    requirePermission('website.pages'),
    adminActionLogger('delete', 'page'),
    pagesController.deletePage
);

// === НАСТРОЙКИ ===
router.get('/settings',
    requirePermission('website.settings'),
    settingsController.getSettings
);

router.put('/settings',
    requirePermission('website.settings'),
    adminActionLogger('edit', 'settings'),
    settingsController.updateSettings
);

router.get('/customers',
    requirePermission('customers.view'),
    customersController.getCustomers
);

router.get('/customers/:id',
    requirePermission('customers.view'),
    customersController.getCustomer
);

router.post('/customers',
    requirePermission('customers.edit'),
    adminActionLogger('create', 'customer'),
    customersController.createCustomer
);

router.put('/customers/:id',
    requirePermission('customers.edit'),
    adminActionLogger('update', 'customer'),
    customersController.updateCustomer
);

router.delete('/customers/:id',
    requirePermission('customers.delete'),
    adminActionLogger('delete', 'customer'),
    customersController.deleteCustomer
);

export default router;