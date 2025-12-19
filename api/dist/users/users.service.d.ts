import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getUsers(query: any): Promise<{
        success: boolean;
        data: {
            permissions: string[];
            username: string;
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            twoFactorEnabled: boolean;
            lastLogin: Date;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getUserById(id: string): Promise<{
        success: boolean;
        data: {
            permissions: string[];
            username: string;
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            twoFactorEnabled: boolean;
            lastLogin: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    createUser(data: any): Promise<{
        success: boolean;
        data: {
            permissions: string[];
            username: string;
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            twoFactorEnabled: boolean;
            createdAt: Date;
        };
        message: string;
    }>;
    updateUser(id: string, data: any): Promise<{
        success: boolean;
        data: {
            permissions: string[];
            username: string;
            id: string;
            email: string;
            fullName: string;
            role: import(".prisma/client").$Enums.UserRole;
            isActive: boolean;
            twoFactorEnabled: boolean;
            lastLogin: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        message: string;
    }>;
    deleteUser(id: string, currentUserId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(id: string, newPassword: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleActiveStatus(id: string, currentUserId: string): Promise<{
        success: boolean;
        data: {
            username: string;
            id: string;
            isActive: boolean;
        };
        message: string;
    }>;
    getRolesAndPermissions(): Promise<{
        success: boolean;
        data: {
            roles: {
                role: string;
                label: string;
                permissions: string[];
                permissionsCount: number;
            }[];
            allPermissions: string[];
        };
    }>;
    private getRoleLabel;
}
