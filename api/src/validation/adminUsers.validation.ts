import { z } from 'zod';

// Доступные роли
const USER_ROLES = ['SUPER_ADMIN', 'ADMINISTRATOR', 'MANAGER', 'CRM_MANAGER'] as const;

// Базовые схемы валидации
const usernameSchema = z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens');

const emailSchema = z.string()
    .email('Invalid email format')
    .max(255, 'Email must be at most 255 characters');

const passwordSchema = z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters');

const fullNameSchema = z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be at most 100 characters');

const roleSchema = z.enum(USER_ROLES, {
    errorMap: () => ({ message: `Role must be one of: ${USER_ROLES.join(', ')}` })
});

// Схема для создания пользователя
export const createUserSchema = z.object({
    body: z.object({
        username: usernameSchema,
        email: emailSchema,
        password: passwordSchema,
        fullName: fullNameSchema,
        role: roleSchema,
        customPermissions: z.array(z.string()).optional(),
        isActive: z.boolean().optional().default(true)
    })
});

// Схема для обновления пользователя
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format')
    }),
    body: z.object({
        username: usernameSchema.optional(),
        email: emailSchema.optional(),
        fullName: fullNameSchema.optional(),
        role: roleSchema.optional(),
        customPermissions: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
        twoFactorEnabled: z.boolean().optional()
    }).refine(
        (data) => Object.keys(data).length > 0,
        { message: 'At least one field must be provided for update' }
    )
});

// Схема для смены пароля
export const changePasswordSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format')
    }),
    body: z.object({
        newPassword: passwordSchema
    })
});

// Схема для валидации ID пользователя
export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format')
    })
});

// Схема для поиска пользователей
export const getUsersQuerySchema = z.object({
    query: z.object({
        page: z.string().optional().transform(val => val ? parseInt(val) : 1),
        limit: z.string().optional().transform(val => val ? parseInt(val) : 10),
        search: z.string().optional(),
        role: roleSchema.optional(),
        active: z.enum(['true', 'false']).optional()
    })
});

// Схема для массовых операций
export const bulkOperationSchema = z.object({
    body: z.object({
        userIds: z.array(z.string().uuid()).min(1, 'At least one user ID required'),
        operation: z.enum(['activate', 'deactivate', 'delete'], {
            errorMap: () => ({ message: 'Operation must be one of: activate, deactivate, delete' })
        }),
        confirmPassword: z.string().min(1, 'Confirmation password required')
    })
});

// Схема для назначения разрешений
export const assignPermissionsSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid user ID format')
    }),
    body: z.object({
        permissions: z.array(z.string()).min(1, 'At least one permission required'),
        replace: z.boolean().optional().default(false) // true - заменить все разрешения, false - добавить к существующим
    })
});

// Схема для фильтрации по разрешениям
export const filterByPermissionsSchema = z.object({
    body: z.object({
        permissions: z.array(z.string()).min(1, 'At least one permission required'),
        matchType: z.enum(['all', 'any']).optional().default('any') // all - должны быть все разрешения, any - хотя бы одно
    })
});

// Типы для TypeScript
export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
export type UpdateUserInput = z.infer<typeof updateUserSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type GetUsersQuery = z.infer<typeof getUsersQuerySchema>['query'];
export type BulkOperationInput = z.infer<typeof bulkOperationSchema>['body'];
export type AssignPermissionsInput = z.infer<typeof assignPermissionsSchema>['body'];

// Вспомогательные функции валидации
export const validateRole = (role: string): role is typeof USER_ROLES[number] => {
    return USER_ROLES.includes(role as any);
};

export const validatePermissions = (permissions: string[]): boolean => {
    // Здесь можно добавить проверку существующих разрешений
    const validPermissions = [
        'admin.full_access',
        'users.create', 'users.edit', 'users.delete', 'users.view',
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit', 'reviews.delete',
        'website.banners', 'website.pages', 'website.settings', 'website.navigation',
        'analytics.view', 'logs.view', 'api_keys.manage',
        'customers.view', 'customers.edit', 'customers.delete',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'files.upload', 'files.delete'
    ];

    return permissions.every(permission => validPermissions.includes(permission));
};