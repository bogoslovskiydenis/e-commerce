import { PrismaService } from '../prisma/prisma.service';
export declare class AdminLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    getLogs(query: any): Promise<{
        success: boolean;
        data: ({
            user: {
                username: string;
                id: string;
                fullName: string;
                avatarUrl: string;
            };
        } & {
            level: import(".prisma/client").$Enums.LogLevel;
            description: string;
            username: string;
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            action: string;
            userId: string;
            resourceType: string;
            resourceId: string | null;
            ip: string;
            userAgent: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getLogById(id: string): Promise<{
        success: boolean;
        data: {
            user: {
                username: string;
                id: string;
                fullName: string;
                avatarUrl: string;
            };
        } & {
            level: import(".prisma/client").$Enums.LogLevel;
            description: string;
            username: string;
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            action: string;
            userId: string;
            resourceType: string;
            resourceId: string | null;
            ip: string;
            userAgent: string;
        };
    }>;
    createLog(data: any): Promise<{
        success: boolean;
        data: {
            user: {
                username: string;
                id: string;
                fullName: string;
                avatarUrl: string;
            };
        } & {
            level: import(".prisma/client").$Enums.LogLevel;
            description: string;
            username: string;
            id: string;
            createdAt: Date;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
            action: string;
            userId: string;
            resourceType: string;
            resourceId: string | null;
            ip: string;
            userAgent: string;
        };
    }>;
    getLogStats(period?: string): Promise<{
        success: boolean;
        data: {
            totalLogs: number;
            period: string;
            logsByAction: {
                action: string;
                count: number;
            }[];
            logsByLevel: {
                level: import(".prisma/client").$Enums.LogLevel;
                count: number;
            }[];
            logsByUser: {
                userId: string;
                username: string;
                fullName: string;
                count: number;
            }[];
            recentActivity: {
                id: string;
                action: string;
                resource: string;
                description: string;
                username: string;
                fullName: string;
                createdAt: Date;
            }[];
        };
    }>;
}
