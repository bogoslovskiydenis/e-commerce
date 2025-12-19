import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(query: any) {
    const { page = 1, limit = 10, search, role, active } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role;
    if (active !== undefined) where.isActive = active === 'true';

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

  async getUserById(id: string) {
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
      throw new NotFoundException('User not found');
    }

    return { success: true, data: user };
  }

  async createUser(data: any) {
    const { username, email, password, fullName, firstName, lastName, role: rawRole, customPermissions, isActive = true, twoFactorEnabled } = data;

    const fullNameFinal = fullName || `${firstName || ''} ${lastName || ''}`.trim();
    const role = rawRole?.toUpperCase();

    if (!username || !email || !password || !fullNameFinal || !role) {
      throw new BadRequestException('Missing required fields');
    }

    if (!ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS]) {
      throw new BadRequestException('Invalid role');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let permissions = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
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

  async updateUser(id: string, data: any) {
    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
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
            ]},
          ],
        },
      });

      if (conflictingUser) {
        throw new ConflictException('Username or email already exists');
      }
    }

    if (updateData.role) {
      if (!ROLE_PERMISSIONS[updateData.role as keyof typeof ROLE_PERMISSIONS]) {
        throw new BadRequestException('Invalid role');
      }
      let permissions = ROLE_PERMISSIONS[updateData.role as keyof typeof ROLE_PERMISSIONS];
      if (updateData.customPermissions?.length) {
        permissions = [...new Set([...permissions, ...updateData.customPermissions])];
      }
      updateData.permissions = permissions;
    }

    if (updateData.customPermissions && !updateData.role) {
      const currentPermissions = ROLE_PERMISSIONS[existingUser.role as keyof typeof ROLE_PERMISSIONS];
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

  async deleteUser(id: string, currentUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (id === currentUserId) {
      throw new BadRequestException('Cannot delete yourself');
    }

    await this.prisma.user.delete({ where: { id } });
    return { success: true, message: 'User deleted successfully' };
  }

  async changePassword(id: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id }, data: { passwordHash } });
    return { success: true, message: 'Password changed successfully' };
  }

  async toggleActiveStatus(id: string, currentUserId: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (id === currentUserId) {
      throw new BadRequestException('Cannot change your own status');
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

  private getRoleLabel(role: string): string {
    const roleLabels: Record<string, string> = {
      'SUPER_ADMIN': 'Супер Администратор',
      'ADMINISTRATOR': 'Администратор',
      'MANAGER': 'Менеджер',
      'CRM_MANAGER': 'CRM Менеджер',
    };
    return roleLabels[role] || role;
  }
}
