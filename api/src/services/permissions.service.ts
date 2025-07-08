
import { prisma } from '@/config/database';
import { logger } from '@/utils/logger';
import { PermissionAction, UserRole } from '@prisma/client';
import {PermissionsUtils} from "@/utils/permissions.utils";

export class PermissionsService {

    // Записать изменение разрешений в историю
    static async logPermissionChange(
        userId: string,
        changedBy: string,
        action: PermissionAction,
        oldData: any,
        newData: any,
        reason?: string,
        permission?: string,
        expiresAt?: Date
    ) {
        try {
            await prisma.permissionHistory.create({
                data: {
                    userId,
                    changedBy,
                    action,
                    permission,
                    oldRole: oldData.role,
                    newRole: newData.role,
                    oldPermissions: oldData.permissions || [],
                    newPermissions: newData.permissions || [],
                    reason,
                    expiresAt
                }
            });

            logger.info('Permission change logged', {
                userId,
                changedBy,
                action,
                permission,
                reason
            });
        } catch (error) {
            logger.error('Failed to log permission change:', error);
        }
    }

    // Выдать временное разрешение
    static async grantTemporaryPermission(
        userId: string,
        permission: string,
        expiresAt: Date,
        grantedBy: string,
        reason?: string
    ) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { temporaryPermissions: true }
            });

            if (!user) {
                throw new Error('User not found');
            }

            const tempPerms = user.temporaryPermissions as Record<string, string> || {};
            tempPerms[permission] = expiresAt.toISOString();

            await prisma.user.update({
                where: { id: userId },
                data: { temporaryPermissions: tempPerms }
            });

            await this.logPermissionChange(
                userId,
                grantedBy,
                PermissionAction.TEMP_GRANT,
                {},
                { permission },
                reason,
                permission,
                expiresAt
            );

            logger.info('Temporary permission granted', {
                userId,
                permission,
                expiresAt,
                grantedBy,
                reason
            });

        } catch (error) {
            logger.error('Failed to grant temporary permission:', error);
            throw error;
        }
    }

    // Очистить истекшие временные разрешения
    static async cleanupExpiredPermissions() {
        try {
            const users = await prisma.user.findMany({
                where: {
                    temporaryPermissions: { not: null }
                },
                select: {
                    id: true,
                    username: true,
                    temporaryPermissions: true
                }
            });

            const now = new Date();
            let cleanedCount = 0;

            for (const user of users) {
                const tempPerms = user.temporaryPermissions as Record<string, string> || {};
                const activePerms: Record<string, string> = {};
                const expiredPerms: string[] = [];

                Object.entries(tempPerms).forEach(([permission, expireDate]) => {
                    if (new Date(expireDate) > now) {
                        activePerms[permission] = expireDate;
                    } else {
                        expiredPerms.push(permission);
                    }
                });

                if (expiredPerms.length > 0) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { temporaryPermissions: activePerms }
                    });

                    // Логируем истечение разрешений
                    for (const permission of expiredPerms) {
                        await this.logPermissionChange(
                            user.id,
                            'SYSTEM',
                            PermissionAction.TEMP_EXPIRE,
                            { permission },
                            {},
                            'Temporary permission expired',
                            permission
                        );
                    }

                    cleanedCount++;
                    logger.info('Cleaned expired permissions', {
                        userId: user.id,
                        username: user.username,
                        expiredPermissions: expiredPerms
                    });
                }
            }

            logger.info('Temporary permissions cleanup completed', {
                usersProcessed: users.length,
                usersWithExpiredPermissions: cleanedCount
            });

        } catch (error) {
            logger.error('Failed to cleanup expired permissions:', error);
        }
    }

    // Получить историю изменений разрешений пользователя
    static async getPermissionHistory(userId: string, limit = 50) {
        try {
            return await prisma.permissionHistory.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                take: limit,
                include: {
                    user: {
                        select: {
                            username: true,
                            fullName: true
                        }
                    }
                }
            });
        } catch (error) {
            logger.error('Failed to get permission history:', error);
            throw error;
        }
    }

    // Массовое обновление разрешений
    static async bulkUpdatePermissions(
        updates: Array<{
            userId: string;
            role?: UserRole;
            permissions?: string[];
            customPermissions?: string[];
        }>,
        updatedBy: string,
        reason?: string
    ) {
        try {
            const results = [];

            for (const update of updates) {
                const oldUser = await prisma.user.findUnique({
                    where: { id: update.userId },
                    select: {
                        role: true,
                        permissions: true,
                        customPermissions: true
                    }
                });

                if (!oldUser) {
                    continue;
                }

                const updatedUser = await prisma.user.update({
                    where: { id: update.userId },
                    data: {
                        ...(update.role && { role: update.role }),
                        ...(update.permissions && { permissions: update.permissions }),
                        ...(update.customPermissions && { customPermissions: update.customPermissions })
                    }
                });

                await this.logPermissionChange(
                    update.userId,
                    updatedBy,
                    PermissionAction.BULK_UPDATE,
                    oldUser,
                    update,
                    reason
                );

                results.push(updatedUser);
            }

            logger.info('Bulk permissions update completed', {
                updatedCount: results.length,
                totalRequested: updates.length,
                updatedBy,
                reason
            });

            return results;

        } catch (error) {
            logger.error('Failed to bulk update permissions:', error);
            throw error;
        }
    }

    // Проверить безопасность операции с разрешениями
    static async validatePermissionSecurity(
        operatorId: string,
        targetUserId: string,
        requestedPermissions: string[]
    ): Promise<{
        allowed: boolean;
        reason?: string;
        restrictedPermissions?: string[];
    }> {
        try {
            const operator = await prisma.user.findUnique({
                where: { id: operatorId },
                select: {
                    role: true,
                    permissions: true,
                    customPermissions: true
                }
            });

            const target = await prisma.user.findUnique({
                where: { id: targetUserId },
                select: { role: true }
            });

            if (!operator || !target) {
                return { allowed: false, reason: 'User not found' };
            }

            // Суперадмин может все
            const operatorPermissions = PermissionsUtils.getAllUserPermissions(operator as any);
            if (operatorPermissions.includes('admin.full_access')) {
                return { allowed: true };
            }

            // Нельзя изменять права пользователей с более высоким уровнем доступа
            const roleHierarchy = {
                'SUPER_ADMIN': 100,
                'ADMINISTRATOR': 80,
                'CONTENT_MANAGER': 60,
                'MANAGER': 50,
                'CRM_MANAGER': 50,
                'ANALYST': 40,
                'SUPPORT': 30,
                'VIEWER': 10
            };

            const operatorLevel = roleHierarchy[operator.role as keyof typeof roleHierarchy] || 0;
            const targetLevel = roleHierarchy[target.role as keyof typeof roleHierarchy] || 0;

            if (targetLevel >= operatorLevel) {
                return {
                    allowed: false,
                    reason: 'Cannot modify permissions of user with equal or higher access level'
                };
            }

            // Проверяем что оператор может назначать запрашиваемые разрешения
            const restrictedPermissions = requestedPermissions.filter(perm =>
                !operatorPermissions.includes(perm) && perm !== 'admin.full_access'
            );

            if (restrictedPermissions.length > 0) {
                return {
                    allowed: false,
                    reason: 'Cannot assign permissions that you do not have',
                    restrictedPermissions
                };
            }

            return { allowed: true };

        } catch (error) {
            logger.error('Permission security validation failed:', error);
            return { allowed: false, reason: 'Validation failed' };
        }
    }
}