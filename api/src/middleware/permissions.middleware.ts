import {NextFunction} from "express";
import {AuthenticatedRequest} from "@/middleware/auth.middleware";
import { Request, Response } from 'express';

export const requirePermission = (permission: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const userPermissions = req.user.permissions;
        const requiredPermissions = Array.isArray(permission) ? permission : [permission];

        // Супер админ имеет все права
        if (userPermissions.includes('admin.full_access')) {
            return next();
        }

        // Проверяем наличие нужных разрешений
        const hasPermission = requiredPermissions.some(perm =>
            userPermissions.includes(perm)
        );

        if (!hasPermission) {
            return res.status(403).json({
                error: 'Insufficient permissions',
                required: requiredPermissions,
                current: userPermissions
            });
        }

        next();
    };
};

export const requireRole = (roles: string | string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'Authentication required'
            });
        }

        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Insufficient role permissions',
                required: allowedRoles,
                current: req.user.role
            });
        }

        next();
    };
};