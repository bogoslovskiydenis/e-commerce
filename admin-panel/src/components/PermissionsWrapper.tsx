import React, { ReactNode } from 'react';
import { usePermissions } from 'react-admin';
import { Box, Alert, Typography } from '@mui/material';
import { Security } from '@mui/icons-material';

interface PermissionsWrapperProps {
    permission: string | string[];
    children: ReactNode;
    fallback?: ReactNode;
    requireAll?: boolean; // Если true, требуются ВСЕ права из массива
}

export const PermissionsWrapper: React.FC<PermissionsWrapperProps> = ({
                                                                          permission,
                                                                          children,
                                                                          fallback,
                                                                          requireAll = false
                                                                      }) => {
    const { permissions, isLoading } = usePermissions();

    if (isLoading) {
        return <Box>Проверка прав доступа...</Box>;
    }

    const hasPermission = (perm: string): boolean => {
        if (!permissions || !Array.isArray(permissions)) return false;
        return permissions.includes(perm) || permissions.includes('admin.full_access');
    };

    const checkPermissions = (): boolean => {
        if (typeof permission === 'string') {
            return hasPermission(permission);
        }

        if (Array.isArray(permission)) {
            if (requireAll) {
                return permission.every(perm => hasPermission(perm));
            } else {
                return permission.some(perm => hasPermission(perm));
            }
        }

        return false;
    };

    if (!checkPermissions()) {
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <Alert severity="warning" icon={<Security />}>
                <Typography variant="body2">
                    У вас нет прав для просмотра этого раздела
                </Typography>
            </Alert>
        );
    }

    return <>{children}</>;
};

// HOC для оборачивания целых компонентов
export const withPermissions = (
    Component: React.ComponentType<any>,
    permission: string | string[],
    requireAll = false
) => {
    return (props: any) => (
        <PermissionsWrapper permission={permission} requireAll={requireAll}>
            <Component {...props} />
        </PermissionsWrapper>
    );
};

// Хук для использования в компонентах
export const useHasPermission = () => {
    const { permissions } = usePermissions();

    return (permission: string | string[], requireAll = false): boolean => {
        if (!permissions || !Array.isArray(permissions)) return false;

        const hasPermission = (perm: string): boolean => {
            return permissions.includes(perm) || permissions.includes('admin.full_access');
        };

        if (typeof permission === 'string') {
            return hasPermission(permission);
        }

        if (Array.isArray(permission)) {
            if (requireAll) {
                return permission.every(perm => hasPermission(perm));
            } else {
                return permission.some(perm => hasPermission(perm));
            }
        }

        return false;
    };
};