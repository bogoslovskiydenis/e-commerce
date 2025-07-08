
import { ROLE_PERMISSIONS } from '@/controllers/permissions.controller';

export class PermissionsUtils {

    // Получить все разрешения пользователя с учетом временных и исключений
    static getAllUserPermissions(user: AuthenticatedUser): string[] {
        const rolePermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];

        let allPermissions = Array.from(new Set([
            ...rolePermissions,
            ...(user.permissions || []),
            ...(user.customPermissions || [])
        ]));

        // Убираем запрещенные разрешения
        if (user.deniedPermissions?.length) {
            allPermissions = allPermissions.filter(perm =>
                !user.deniedPermissions!.includes(perm)
            );
        }

        // Добавляем временные разрешения (если не истекли)
        if (user.temporaryPermissions) {
            const now = new Date();
            Object.entries(user.temporaryPermissions).forEach(([permission, expireDate]) => {
                if (new Date(expireDate) > now && !allPermissions.includes(permission)) {
                    allPermissions.push(permission);
                }
            });
        }

        return allPermissions;
    }

    // Проверить имеет ли пользователь конкретное разрешение
    static hasPermission(user: AuthenticatedUser, permission: string): boolean {
        const allPermissions = this.getAllUserPermissions(user);
        return allPermissions.includes(permission) || allPermissions.includes('admin.full_access');
    }

    // Проверить имеет ли пользователь хотя бы одно из разрешений
    static hasAnyPermission(user: AuthenticatedUser, permissions: string[]): boolean {
        return permissions.some(permission => this.hasPermission(user, permission));
    }

    // Проверить имеет ли пользователь все разрешения
    static hasAllPermissions(user: AuthenticatedUser, permissions: string[]): boolean {
        return permissions.every(permission => this.hasPermission(user, permission));
    }

    // Проверить доступ в рамках временных ограничений
    static isWithinAccessTime(user: AuthenticatedUser): boolean {
        if (!user.accessStartTime || !user.accessEndTime) {
            return true; // Нет ограничений
        }

        const now = new Date();
        const currentTime = now.getHours() * 100 + now.getMinutes();
        const startTime = parseInt(user.accessStartTime.replace(':', ''));
        const endTime = parseInt(user.accessEndTime.replace(':', ''));

        return currentTime >= startTime && currentTime <= endTime;
    }

    // Проверить доступ с разрешенного IP
    static isAllowedIP(user: AuthenticatedUser, ip: string): boolean {
        if (!user.allowedIPs?.length) {
            return true; // Нет ограничений
        }

        return user.allowedIPs.includes(ip);
    }

    // Проверить заблокирован ли аккаунт
    static isAccountLocked(user: AuthenticatedUser): boolean {
        if (!user.lockedUntil) {
            return false;
        }

        return new Date() < user.lockedUntil;
    }

    // Получить разрешения по категориям
    static getPermissionsByCategory(permissions: string[]): Record<string, string[]> {
        const categories: Record<string, string[]> = {};

        permissions.forEach(permission => {
            const [category] = permission.split('.');
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(permission);
        });

        return categories;
    }

    // Сравнить разрешения между двумя пользователями
    static comparePermissions(user1: AuthenticatedUser, user2: AuthenticatedUser): {
        common: string[];
        user1Only: string[];
        user2Only: string[];
    } {
        const permissions1 = this.getAllUserPermissions(user1);
        const permissions2 = this.getAllUserPermissions(user2);

        const common = permissions1.filter(p => permissions2.includes(p));
        const user1Only = permissions1.filter(p => !permissions2.includes(p));
        const user2Only = permissions2.filter(p => !permissions1.includes(p));

        return { common, user1Only, user2Only };
    }
}