import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    getUser(id: string): Promise<{
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
    createUser(body: any): Promise<{
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
    updateUser(id: string, body: any): Promise<{
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
    deleteUser(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(id: string, body: {
        newPassword: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleActiveStatus(id: string, req: any): Promise<{
        success: boolean;
        data: {
            username: string;
            id: string;
            isActive: boolean;
        };
        message: string;
    }>;
}
