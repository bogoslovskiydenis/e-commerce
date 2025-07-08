import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permissions.middleware';
import { adminActionLogger } from '../middleware/logging.middleware';
import { DashboardController } from '../controllers/dashboard.controller';
import { AdminUsersController } from '../controllers/adminUsers.controller';
import { AdminLogsController } from '../controllers/adminLogs.controller';

const router = Router();

// Применяем аутентификацию ко всем роутам
router.use(authenticateToken);

// Контроллеры
const dashboardController = new DashboardController();
const adminUsersController = new AdminUsersController();
const adminLogsController = new AdminLogsController();

// Dashboard
router.get('/dashboard',
    requirePermission('analytics.view'),
    dashboardController.getStats
);

// Управление администраторами
router.get('/users',
    requirePermission('users.view'),
    adminUsersController.getUsers
);

router.post('/users',
    requirePermission('users.create'),
    adminActionLogger('create', 'admin_user'),
    adminUsersController.createUser
);

router.get('/users/:id',
    requirePermission('users.view'),
    adminUsersController.getUser
);

router.put('/users/:id',
    requirePermission('users.edit'),
    adminActionLogger('edit', 'admin_user'),
    adminUsersController.updateUser
);

router.delete('/users/:id',
    requirePermission('users.delete'),
    adminActionLogger('delete', 'admin_user'),
    adminUsersController.deleteUser
);

// Логи
router.get('/logs',
    requirePermission('logs.view'),
    adminLogsController.getLogs
);

router.get('/logs/:id',
    requirePermission('logs.view'),
    adminLogsController.getLog
);

export default router;
