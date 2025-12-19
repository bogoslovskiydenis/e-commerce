"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
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
    ],
    ADMINISTRATOR: [
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'users.create', 'users.edit', 'users.view',
        'website.banners', 'website.pages', 'website.navigation',
        'analytics.view', 'customers.view', 'customers.edit',
        'orders.view', 'orders.edit', 'reviews.view', 'reviews.edit'
    ],
    MANAGER: [
        'orders.view', 'orders.edit', 'orders.create',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit',
        'customers.view', 'customers.edit',
        'products.view', 'analytics.basic'
    ],
    CRM_MANAGER: [
        'customers.view', 'customers.edit',
        'promotions.create', 'promotions.edit', 'promotions.view',
        'emails.send', 'loyalty.manage', 'analytics.marketing',
        'orders.view', 'callbacks.view', 'callbacks.edit'
    ]
};
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUsers(query) {
        const { page = 1, limit = 10, search, role, active } = query;
        const skip = (Number(page) - 1) * Number(limit);
        const where = {};
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { fullName: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (role)
            where.role = role;
        if (active !== undefined)
            where.isActive = active === 'true';
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                select: {
                    id: true,
                    username: true,
                    email: true,
                    fullName: true,
                    role: true,
                    permissions: true,
                    isActive: true,
                    twoFactorEnabled: true,
                    lastLogin: true,
                    createdAt: true,
                    updatedAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            success: true,
            data: users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                permissions: true,
                isActive: true,
                twoFactorEnabled: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return { success: true, data: user };
    }
    async createUser(data) {
        const { username, email, password, fullName, firstName, lastName, role: rawRole, customPermissions, isActive = true, twoFactorEnabled } = data;
        const fullNameFinal = fullName || `${firstName || ''} ${lastName || ''}`.trim();
        const role = rawRole?.toUpperCase();
        if (!username || !email || !password || !fullNameFinal || !role) {
            throw new common_1.BadRequestException('Missing required fields');
        }
        if (!ROLE_PERMISSIONS[role]) {
            throw new common_1.BadRequestException('Invalid role');
        }
        const existingUser = await this.prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(password, 12);
        let permissions = ROLE_PERMISSIONS[role];
        if (customPermissions?.length) {
            permissions = [...new Set([...permissions, ...customPermissions])];
        }
        const user = await this.prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
                fullName: fullNameFinal,
                role,
                permissions,
                isActive,
                twoFactorEnabled: twoFactorEnabled ?? false,
            },
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                permissions: true,
                isActive: true,
                twoFactorEnabled: true,
                createdAt: true,
            },
        });
        return { success: true, data: user, message: 'User created successfully' };
    }
    async updateUser(id, data) {
        const existingUser = await this.prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const updateData = { ...data };
        delete updateData.password;
        delete updateData.passwordHash;
        if (updateData.email || updateData.username) {
            const conflictingUser = await this.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: id } },
                        { OR: [
                                ...(updateData.username ? [{ username: updateData.username }] : []),
                                ...(updateData.email ? [{ email: updateData.email }] : []),
                            ] },
                    ],
                },
            });
            if (conflictingUser) {
                throw new common_1.ConflictException('Username or email already exists');
            }
        }
        if (updateData.role) {
            if (!ROLE_PERMISSIONS[updateData.role]) {
                throw new common_1.BadRequestException('Invalid role');
            }
            let permissions = ROLE_PERMISSIONS[updateData.role];
            if (updateData.customPermissions?.length) {
                permissions = [...new Set([...permissions, ...updateData.customPermissions])];
            }
            updateData.permissions = permissions;
        }
        if (updateData.customPermissions && !updateData.role) {
            const currentPermissions = ROLE_PERMISSIONS[existingUser.role];
            updateData.permissions = [...new Set([...currentPermissions, ...updateData.customPermissions])];
        }
        delete updateData.customPermissions;
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                role: true,
                permissions: true,
                isActive: true,
                twoFactorEnabled: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return { success: true, data: updatedUser, message: 'User updated successfully' };
    }
    async deleteUser(id, currentUserId) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (id === currentUserId) {
            throw new common_1.BadRequestException('Cannot delete yourself');
        }
        await this.prisma.user.delete({ where: { id } });
        return { success: true, message: 'User deleted successfully' };
    }
    async changePassword(id, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new common_1.BadRequestException('Password must be at least 6 characters long');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({ where: { id }, data: { passwordHash } });
        return { success: true, message: 'Password changed successfully' };
    }
    async toggleActiveStatus(id, currentUserId) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (id === currentUserId) {
            throw new common_1.BadRequestException('Cannot change your own status');
        }
        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { isActive: !user.isActive },
            select: { id: true, username: true, isActive: true },
        });
        return {
            success: true,
            data: updatedUser,
            message: `User ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
        };
    }
    async getRolesAndPermissions() {
        const rolesInfo = Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => ({
            role,
            label: this.getRoleLabel(role),
            permissions,
            permissionsCount: permissions.length,
        }));
        return {
            success: true,
            data: {
                roles: rolesInfo,
                allPermissions: Array.from(new Set(Object.values(ROLE_PERMISSIONS).flat())),
            },
        };
    }
    getRoleLabel(role) {
        const roleLabels = {
            'SUPER_ADMIN': 'Супер Администратор',
            'ADMINISTRATOR': 'Администратор',
            'MANAGER': 'Менеджер',
            'CRM_MANAGER': 'CRM Менеджер',
        };
        return roleLabels[role] || role;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map