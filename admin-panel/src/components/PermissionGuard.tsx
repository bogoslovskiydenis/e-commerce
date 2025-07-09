import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { Lock, ArrowBack } from '@mui/icons-material';
import { usePermissions, useRedirect } from 'react-admin';
import { authProvider } from '../auth/authProvider';

interface PermissionGuardProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

// Компонент для проверки разрешений
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
                                                                    permission,
                                                                    children,
                                                                    fallback
                                                                }) => {
    const { permissions, isLoading } = usePermissions();
    const redirect = useRedirect();

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="200px"
            >
                <Typography>Проверка прав доступа...</Typography>
            </Box>
        );
    }

    const requiredPermissions = Array.isArray(permission) ? permission : [permission];
    const hasPermission = checkPermissions(permissions, requiredPermissions);

    if (!hasPermission) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
                p={3}
            >
                <Lock sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                    Недостаточно прав доступа
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center" mb={3}>
                    У вас нет разрешения для просмотра этой страницы.
                    <br />
                    Обратитесь к администратору для получения доступа.
                </Typography>

                <Alert severity="info" sx={{ mb: 2, maxWidth: 400 }}>
                    <Typography variant="body2">
                        <strong>Требуемые разрешения:</strong>
                        <br />
                        {requiredPermissions.join(', ')}
                    </Typography>
                </Alert>

                <Button
                    variant="contained"
                    startIcon={<ArrowBack />}
                    onClick={() => redirect('/')}
                >
                    Вернуться на главную
                </Button>
            </Box>
        );
    }

    return <>{children}</>;
};

// Функция проверки разрешений
export const checkPermissions = (
    userPermissions: string[] = [],
    requiredPermissions: string[]
): boolean => {
    // Супер админ имеет все права
    if (userPermissions.includes('admin.full_access')) {
        return true;
    }

    // Проверяем наличие хотя бы одного из требуемых разрешений
    return requiredPermissions.some(perm => userPermissions.includes(perm));
};

// HOC для компонентов react-admin
export const withPermissions = <P extends object>(
    Component: React.ComponentType<P>,
    permission: string | string[]
) => {
    const WrappedComponent: React.FC<P> = (props) => (
        <PermissionGuard permission={permission}>
            <Component {...props} />
        </PermissionGuard>
    );

    WrappedComponent.displayName = `withPermissions(${Component.displayName || Component.name})`;

    return WrappedComponent;
};

// Хук для проверки разрешений
export const useHasPermission = (permission: string | string[]): boolean => {
    const { permissions } = usePermissions();
    const requiredPermissions = Array.isArray(permission) ? permission : [permission];

    return checkPermissions(permissions, requiredPermissions);
};

// Хук для проверки роли
export const useHasRole = (role: string | string[]): boolean => {
    const user = authProvider.getCurrentUser();
    if (!user) return false;

    const allowedRoles = Array.isArray(role) ? role : [role];
    return allowedRoles.includes(user.role);
};

// Компонент условного рендеринга по разрешениям
interface ConditionalRenderProps {
    permission: string | string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
    mode?: 'hide' | 'disable';
}

export const ConditionalRender: React.FC<ConditionalRenderProps> = ({
                                                                        permission,
                                                                        children,
                                                                        fallback = null,
                                                                        mode = 'hide'
                                                                    }) => {
    const hasPermission = useHasPermission(permission);

    if (!hasPermission) {
        if (mode === 'disable' && React.isValidElement(children)) {
            // Отключаем элемент, но показываем его - безопасная типизация
            try {
                const childProps = children.props as any;
                return React.cloneElement(children as any, {
                    disabled: true,
                    sx: {
                        ...(childProps.sx || {}),
                        opacity: 0.5,
                        pointerEvents: 'none'
                    }
                });
            } catch (error) {
                console.warn('Cannot disable element:', error);
                return <>{fallback}</>;
            }
        }

        return <>{fallback}</>;
    }

    return <>{children}</>;
};

// Компонент для отображения информации о пользователе
export const UserPermissionsInfo: React.FC = () => {
    const { permissions, isLoading } = usePermissions();
    const user = authProvider.getCurrentUser();

    if (isLoading || !user) {
        return null;
    }

    return (
        <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
                Информация о правах доступа
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Пользователь:</strong> {user.fullName} ({user.username})
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Роль:</strong> {getRoleDisplayName(user.role)}
            </Typography>

            <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Разрешения:</strong>
            </Typography>

            <Box sx={{ ml: 2 }}>
                {permissions?.length > 0 ? (
                    permissions.map((perm: string, index: number) => (
                        <Typography key={index} variant="caption" display="block">
                            • {getPermissionDisplayName(perm)}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="caption" color="text.secondary">
                        Нет разрешений
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

// Утилиты для отображения
const getRoleDisplayName = (role: string): string => {
    const roleNames: Record<string, string> = {
        'SUPER_ADMIN': 'Супер администратор',
        'ADMINISTRATOR': 'Администратор',
        'MANAGER': 'Менеджер',
        'CRM_MANAGER': 'CRM менеджер'
    };

    return roleNames[role] || role;
};

const getPermissionDisplayName = (permission: string): string => {
    const permissionNames: Record<string, string> = {
        'admin.full_access': 'Полный доступ администратора',
        'users.view': 'Просмотр пользователей',
        'users.create': 'Создание пользователей',
        'users.edit': 'Редактирование пользователей',
        'users.delete': 'Удаление пользователей',
        'products.view': 'Просмотр товаров',
        'products.create': 'Создание товаров',
        'products.edit': 'Редактирование товаров',
        'products.delete': 'Удаление товаров',
        'orders.view': 'Просмотр заказов',
        'orders.edit': 'Редактирование заказов',
        'orders.create': 'Создание заказов',
        'orders.delete': 'Удаление заказов',
        'customers.view': 'Просмотр клиентов',
        'customers.edit': 'Редактирование клиентов',
        'callbacks.view': 'Просмотр обратных звонков',
        'callbacks.edit': 'Редактирование обратных звонков',
        'reviews.view': 'Просмотр отзывов',
        'reviews.edit': 'Редактирование отзывов',
        'categories.view': 'Просмотр категорий',
        'categories.create': 'Создание категорий',
        'categories.edit': 'Редактирование категорий',
        'website.banners': 'Управление баннерами',
        'website.pages': 'Управление страницами',
        'website.navigation': 'Управление навигацией',
        'website.settings': 'Настройки сайта',
        'analytics.view': 'Просмотр аналитики',
        'analytics.basic': 'Базовая аналитика',
        'logs.view': 'Просмотр логов',
        'api_keys.manage': 'Управление API ключами'
    };

    return permissionNames[permission] || permission;
};

// Компонент для быстрой проверки и отображения кнопок с разрешениями
interface PermissionButtonProps {
    permission: string | string[];
    children: React.ReactNode;
    fallbackText?: string;
    showFallback?: boolean;
}

export const PermissionButton: React.FC<PermissionButtonProps> = ({
                                                                      permission,
                                                                      children,
                                                                      fallbackText = 'Нет доступа',
                                                                      showFallback = false
                                                                  }) => {
    const hasPermission = useHasPermission(permission);

    if (!hasPermission) {
        if (!showFallback) {
            return null;
        }

        return (
            <Button disabled variant="outlined" size="small">
                {fallbackText}
            </Button>
        );
    }

    return <>{children}</>;
};

export default PermissionGuard;