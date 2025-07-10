import { Router } from 'express';
import { adminUsersController } from '@/controllers/adminUsers.controller';
import { authenticateToken, requirePermission } from '@/middleware/auth.middleware';
import { adminActionLogger } from '@/middleware/logging.middleware';
import { validate } from '@/middleware/validation.middleware';
import {
    createUserSchema,
    updateUserSchema,
    changePasswordSchema,
    userIdParamSchema
} from '@/validation/adminUsers.validation';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// === ПОЛУЧЕНИЕ ДАННЫХ ===

// Получить список пользователей
router.get('/',
    requirePermission('users.view'),
    adminUsersController.getUsers
);

// Получить конкретного пользователя
router.get('/:id',
    requirePermission('users.view'),
    validate(userIdParamSchema),
    adminUsersController.getUser
);

// Получить роли и разрешения
router.get('/system/roles-and-permissions',
    requirePermission('users.view'),
    adminUsersController.getRolesAndPermissions
);

// === СОЗДАНИЕ И ОБНОВЛЕНИЕ ===

// Создать нового пользователя
router.post('/',
    requirePermission('users.create'),
    validate(createUserSchema),
    adminActionLogger('create', 'admin_user'),
    adminUsersController.createUser
);

// Обновить пользователя
router.put('/:id',
    requirePermission('users.edit'),
    validate(updateUserSchema),
    adminActionLogger('update', 'admin_user'),
    adminUsersController.updateUser
);

// Частичное обновление пользователя
router.patch('/:id',
    requirePermission('users.edit'),
    validate(userIdParamSchema),
    adminActionLogger('patch', 'admin_user'),
    adminUsersController.updateUser
);

// === СПЕЦИАЛЬНЫЕ ДЕЙСТВИЯ ===

// Сменить пароль пользователя
router.post('/:id/change-password',
    requirePermission('users.edit'),
    validate(changePasswordSchema),
    adminActionLogger('change_password', 'admin_user'),
    adminUsersController.changePassword
);

// Переключить статус активности
router.post('/:id/toggle-status',
    requirePermission('users.edit'),
    validate(userIdParamSchema),
    adminActionLogger('toggle_status', 'admin_user'),
    adminUsersController.toggleActiveStatus
);

// === УДАЛЕНИЕ ===

// Удалить пользователя
router.delete('/:id',
    requirePermission('users.delete'),
    validate(userIdParamSchema),
    adminActionLogger('delete', 'admin_user'),
    adminUsersController.deleteUser
);

export default router;