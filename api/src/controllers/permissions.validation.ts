import { z } from 'zod';
import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from '@/controllers/permissions.controller';

// Схема для проверки разрешений
export const checkPermissionsSchema = z.object({
    body: z.object({
        userId: z.string().min(1, 'User ID is required'),
        permissions: z.array(z.string()).min(1, 'At least one permission required')
    })
});

// Схема для обновления разрешений пользователя
export const updateUserPermissionsSchema = z.object({
    body: z.object({
        permissions: z.array(
            z.string().refine(
                (permission) => ALL_PERMISSIONS.includes(permission),
                { message: 'Invalid permission' }
            )
        ).optional(),
        customPermissions: z.array(
            z.string().refine(
                (permission) => ALL_PERMISSIONS.includes(permission),
                { message: 'Invalid custom permission' }
            )
        ).optional(),
        role: z.enum(['SUPER_ADMIN', 'ADMINISTRATOR', 'MANAGER', 'CRM_MANAGER']).optional()
    }).refine(
        (data) => data.permissions || data.customPermissions || data.role,
        { message: 'At least one field (permissions, customPermissions, or role) must be provided' }
    )
});

// Схема для добавления одного разрешения
export const addPermissionSchema = z.object({
    body: z.object({
        permission: z.string().refine(
            (permission) => ALL_PERMISSIONS.includes(permission),
            { message: 'Invalid permission' }
        )
    })
});

// Схема для валидации роли
export const roleParamSchema = z.object({
    params: z.object({
        role: z.string().refine(
            (role) => Object.keys(ROLE_PERMISSIONS).includes(role.toUpperCase()),
            { message: 'Invalid role' }
        )
    })
});

// Схема для валидации ID пользователя
export const userIdParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required')
    })
});

// Схема для валидации разрешения в параметрах
export const permissionParamSchema = z.object({
    params: z.object({
        id: z.string().min(1, 'User ID is required'),
        permission: z.string().refine(
            (permission) => ALL_PERMISSIONS.includes(permission),
            { message: 'Invalid permission' }
        )
    })
});

// Вспомогательные функции валидации
export class PermissionValidator {

    // Проверить что разрешение существует
    static isValidPermission(permission: string): boolean {
        return ALL_PERMISSIONS.includes(permission);
    }

    // Проверить что роль существует
    static isValidRole(role: string): boolean {
        return Object.keys(ROLE_PERMISSIONS).includes(role.toUpperCase());
    }

    // Получить разрешения по категории
    static getPermissionsByCategory(category: string): string[] {
        return ALL_PERMISSIONS.filter(p => p.startsWith(`${category}.`));
    }

    // Проверить что пользователь может назначать данные разрешения
    static canAssignPermissions(userPermissions: string[], permissionsToAssign: string[]): {
        canAssign: boolean;
        forbidden: string[];
    } {
        // Суперадмин может назначать любые разрешения
        if (userPermissions.includes('admin.full_access')) {
            return { canAssign: true, forbidden: [] };
        }

        // Обычные админы могут назначать только те разрешения, которые есть у них
        const forbidden = permissionsToAssign.filter(permission =>
            !userPermissions.includes(permission) &&
            permission !== 'admin.full_access' // Обычные админы не могут назначать полный доступ
        );

        return {
            canAssign: forbidden.length === 0,
            forbidden
        };
    }

    // Валидировать массив разрешений
    static validatePermissions(permissions: string[]): {
        valid: boolean;
        invalidPermissions: string[];
        duplicates: string[];
    } {
        const invalidPermissions = permissions.filter(p => !ALL_PERMISSIONS.includes(p));
        const duplicates = permissions.filter((p, index) => permissions.indexOf(p) !== index);

        return {
            valid: invalidPermissions.length === 0 && duplicates.length === 0,
            invalidPermissions,
            duplicates
        };
    }

    // Получить описание разрешения
    static getPermissionDescription(permission: string): string {
        const descriptions: Record<string, string> = {
            // Пользователи
            'users.create': 'Создание новых пользователей',
            'users.edit': 'Редактирование пользователей',
            'users.delete': 'Удаление пользователей',
            'users.view': 'Просмотр списка пользователей',

            // Товары
            'products.create': 'Создание новых товаров',
            'products.edit': 'Редактирование товаров',
            'products.delete': 'Удаление товаров',
            'products.view': 'Просмотр каталога товаров',
            'products.import': 'Импорт товаров',
            'products.export': 'Экспорт товаров',

            // Категории
            'categories.create': 'Создание категорий',
            'categories.edit': 'Редактирование категорий',
            'categories.delete': 'Удаление категорий',
            'categories.view': 'Просмотр категорий',

            // Заказы
            'orders.view': 'Просмотр заказов',
            'orders.edit': 'Редактирование заказов',
            'orders.delete': 'Удаление заказов',
            'orders.create': 'Создание заказов',
            'orders.export': 'Экспорт заказов',
            'orders.refund': 'Возврат средств по заказам',

            // Клиенты
            'customers.view': 'Просмотр клиентов',
            'customers.edit': 'Редактирование данных клиентов',
            'customers.delete': 'Удаление клиентов',
            'customers.export': 'Экспорт базы клиентов',

            // Отзывы
            'reviews.view': 'Просмотр отзывов',
            'reviews.edit': 'Редактирование отзывов',
            'reviews.delete': 'Удаление отзывов',
            'reviews.moderate': 'Модерация отзывов',

            // Обратная связь
            'callbacks.view': 'Просмотр заявок на обратный звонок',
            'callbacks.edit': 'Редактирование заявок',
            'callbacks.delete': 'Удаление заявок',

            // Сайт и контент
            'website.banners': 'Управление баннерами',
            'website.pages': 'Управление страницами сайта',
            'website.settings': 'Настройки сайта',
            'website.navigation': 'Управление навигацией',

            // Скидки и промокоды
            'promotions.create': 'Создание промокодов и скидок',
            'promotions.edit': 'Редактирование промокодов',
            'promotions.view': 'Просмотр промокодов',
            'promotions.delete': 'Удаление промокодов',

            // Аналитика
            'analytics.view': 'Просмотр общей аналитики',
            'analytics.basic': 'Базовая аналитика',
            'analytics.marketing': 'Маркетинговая аналитика',
            'analytics.advanced': 'Расширенная аналитика',

            // Системные
            'logs.view': 'Просмотр логов системы',
            'api_keys.manage': 'Управление API ключами',
            'admin.full_access': 'Полный доступ администратора',

            // Email маркетинг
            'emails.send': 'Отправка email рассылок',
            'emails.templates': 'Управление шаблонами писем',
            'loyalty.manage': 'Управление программой лояльности',

            // Файлы
            'files.upload': 'Загрузка файлов',
            'files.delete': 'Удаление файлов',
            'files.manage': 'Управление файлами'
        };

        return descriptions[permission] || permission;
    }

    // Получить категорию разрешения
    static getPermissionCategory(permission: string): string {
        const [category] = permission.split('.');
        return category;
    }

    // Получить иконку для категории разрешений
    static getCategoryIcon(category: string): string {
        const icons: Record<string, string> = {
            users: '👥',
            products: '📦',
            categories: '📂',
            orders: '📋',
            customers: '👤',
            reviews: '⭐',
            callbacks: '📞',
            website: '🌐',
            promotions: '🎯',
            analytics: '📊',
            logs: '📝',
            api_keys: '🔑',
            admin: '⚡',
            emails: '✉️',
            loyalty: '🎁',
            files: '📁'
        };

        return icons[category] || '🔒';
    }
}