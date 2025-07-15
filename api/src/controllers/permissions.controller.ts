import { Request, Response } from 'express';
import { logger } from '@/utils/logger';

// Все доступные разрешения в системе
export const ALL_PERMISSIONS = [
    // Пользователи
    'users.create', 'users.edit', 'users.delete', 'users.view',

    // Товары
    'products.create', 'products.edit', 'products.delete', 'products.view',
    'products.import', 'products.export',

    // Категории
    'categories.create', 'categories.edit', 'categories.delete', 'categories.view',

    // Заказы
    'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
    'orders.export', 'orders.refund',

    // Клиенты
    'customers.view', 'customers.edit', 'customers.delete', 'customers.export',

    // Отзывы
    'reviews.view', 'reviews.edit', 'reviews.delete', 'reviews.moderate',

    // Обратная связь
    'callbacks.view', 'callbacks.edit', 'callbacks.delete',

    // Сайт и контент
    'website.banners', 'website.pages', 'website.settings', 'website.navigation',

    // Скидки и промокоды
    'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',

    // Аналитика
    'analytics.view', 'analytics.basic', 'analytics.marketing', 'analytics.advanced',

    // Системные
    'logs.view', 'api_keys.manage', 'admin.full_access',

    // Email маркетинг
    'emails.send', 'emails.templates', 'loyalty.manage',

    // Файлы
    'files.upload', 'files.delete', 'files.manage'
];

// ✅ ОБНОВЛЕННЫЕ РАЗРЕШЕНИЯ ДЛЯ РОЛЕЙ
export const ROLE_PERMISSIONS = {
    // Супер администратор - все права
    SUPER_ADMIN: ALL_PERMISSIONS,

    // Администратор - управление системой
    ADMINISTRATOR: [
        // Товары и категории - полный доступ
        'products.create', 'products.edit', 'products.delete', 'products.view', 'products.import', 'products.export',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',

        // Пользователи
        'users.create', 'users.edit', 'users.view',

        // Сайт и контент
        'website.banners', 'website.pages', 'website.navigation', 'website.settings',

        // Аналитика и файлы
        'analytics.view', 'files.upload', 'files.manage'
    ],

    // ✅ МЕНЕДЖЕР - теперь может управлять товарами и категориями
    MANAGER: [
        // 📦 ТОВАРЫ - полный доступ (кроме удаления)
        'products.create', 'products.edit', 'products.view', 'products.import',

        // 📂 КАТЕГОРИИ - полный доступ (кроме удаления)
        'categories.create', 'categories.edit', 'categories.view',

        // 📋 ЗАКАЗЫ - полный доступ
        'orders.view', 'orders.edit', 'orders.create',

        // 📞 ОБРАТНАЯ СВЯЗЬ
        'callbacks.view', 'callbacks.edit',

        // ⭐ ОТЗЫВЫ - просмотр и модерация
        'reviews.view', 'reviews.edit', 'reviews.moderate',

        // 👤 КЛИЕНТЫ - просмотр и редактирование
        'customers.view', 'customers.edit',

        // 📊 АНАЛИТИКА - базовая
        'analytics.basic',

        // 📁 ФАЙЛЫ - загрузка
        'files.upload'
    ],

    // CRM Менеджер - клиенты и маркетинг
    CRM_MANAGER: [
        // 👥 КЛИЕНТЫ - полный доступ
        'customers.view', 'customers.edit', 'customers.export',

        // 🎯 ПРОМОКОДЫ И СКИДКИ
        'promotions.create', 'promotions.edit', 'promotions.view',

        // ✉️ EMAIL МАРКЕТИНГ
        'emails.send', 'emails.templates', 'loyalty.manage',

        // 📊 МАРКЕТИНГОВАЯ АНАЛИТИКА
        'analytics.marketing',

        // 📦 ТОВАРЫ - только просмотр
        'products.view',

        // 📂 КАТЕГОРИИ - только просмотр
        'categories.view'
    ]
};

// ===== ОСТАЛЬНОЙ КОД ОСТАЕТСЯ БЕЗ ИЗМЕНЕНИЙ =====

export class PermissionsController {

    // Получить все доступные разрешения
    async getAllPermissions(req: Request, res: Response) {
        try {
            const permissionsByCategory = {
                users: ALL_PERMISSIONS.filter(p => p.startsWith('users.')),
                products: ALL_PERMISSIONS.filter(p => p.startsWith('products.')),
                categories: ALL_PERMISSIONS.filter(p => p.startsWith('categories.')),
                orders: ALL_PERMISSIONS.filter(p => p.startsWith('orders.')),
                customers: ALL_PERMISSIONS.filter(p => p.startsWith('customers.')),
                reviews: ALL_PERMISSIONS.filter(p => p.startsWith('reviews.')),
                callbacks: ALL_PERMISSIONS.filter(p => p.startsWith('callbacks.')),
                website: ALL_PERMISSIONS.filter(p => p.startsWith('website.')),
                promotions: ALL_PERMISSIONS.filter(p => p.startsWith('promotions.')),
                analytics: ALL_PERMISSIONS.filter(p => p.startsWith('analytics.')),
                system: ALL_PERMISSIONS.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: ALL_PERMISSIONS.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: ALL_PERMISSIONS.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    all: ALL_PERMISSIONS,
                    byCategory: permissionsByCategory,
                    total: ALL_PERMISSIONS.length
                }
            });
        } catch (error) {
            logger.error('Get permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Получить роли и их разрешения
    async getRoles(req: Request, res: Response) {
        try {
            const rolesWithStats = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
                role,
                permissions,
                permissionsCount: permissions.length,
                hasFullAccess: permissions.includes('admin.full_access'),
                // Добавляем описание ролей
                description: this.getRoleDescription(role)
            }));

            res.json({
                success: true,
                data: {
                    roles: rolesWithStats,
                    total: Object.keys(ROLE_PERMISSIONS).length
                }
            });
        } catch (error) {
            logger.error('Get roles error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Вспомогательная функция для получения описания роли
    private getRoleDescription(role: string): string {
        const descriptions: Record<string, string> = {
            'SUPER_ADMIN': 'Полный доступ ко всем функциям системы',
            'ADMINISTRATOR': 'Управление контентом, товарами и настройками сайта',
            'MANAGER': 'Управление товарами, категориями, заказами и клиентами',
            'CRM_MANAGER': 'Работа с клиентами, маркетинг и промокоды'
        };

        return descriptions[role] || 'Описание недоступно';
    }

    // Получить разрешения конкретной роли
    async getRolePermissions(req: Request, res: Response) {
        try {
            const { role } = req.params;
            const roleUpper = role.toUpperCase() as keyof typeof ROLE_PERMISSIONS;

            if (!ROLE_PERMISSIONS[roleUpper]) {
                return res.status(404).json({
                    error: 'Role not found',
                    availableRoles: Object.keys(ROLE_PERMISSIONS)
                });
            }

            const permissions = ROLE_PERMISSIONS[roleUpper];
            const permissionsByCategory = {
                users: permissions.filter(p => p.startsWith('users.')),
                products: permissions.filter(p => p.startsWith('products.')),
                categories: permissions.filter(p => p.startsWith('categories.')),
                orders: permissions.filter(p => p.startsWith('orders.')),
                customers: permissions.filter(p => p.startsWith('customers.')),
                reviews: permissions.filter(p => p.startsWith('reviews.')),
                callbacks: permissions.filter(p => p.startsWith('callbacks.')),
                website: permissions.filter(p => p.startsWith('website.')),
                promotions: permissions.filter(p => p.startsWith('promotions.')),
                analytics: permissions.filter(p => p.startsWith('analytics.')),
                system: permissions.filter(p => p.startsWith('logs.') || p.startsWith('api_keys.') || p.startsWith('admin.')),
                emails: permissions.filter(p => p.startsWith('emails.') || p.startsWith('loyalty.')),
                files: permissions.filter(p => p.startsWith('files.'))
            };

            res.json({
                success: true,
                data: {
                    role: roleUpper,
                    permissions,
                    permissionsByCategory,
                    total: permissions.length,
                    hasFullAccess: permissions.includes('admin.full_access'),
                    description: this.getRoleDescription(roleUpper)
                }
            });
        } catch (error) {
            logger.error('Get role permissions error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    // Остальные методы остаются без изменений...
    // (getUserPermissions, checkPermissions, getMyPermissions и т.д.)
}