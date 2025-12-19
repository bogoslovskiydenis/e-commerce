import { CallbacksService } from './callbacks.service';
export declare class CallbacksController {
    private callbacksService;
    constructor(callbacksService: CallbacksService);
    getCallbacks(query: any): Promise<{
        success: boolean;
        data: ({
            customer: {
                id: string;
                email: string;
                name: string;
                phone: string;
            };
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CallbackStatus;
            phone: string;
            customerId: string | null;
            managerId: string | null;
            notes: string | null;
            source: string | null;
            completedAt: Date | null;
            message: string | null;
            priority: import(".prisma/client").$Enums.CallbackPriority;
            scheduledAt: Date | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getCallback(id: string): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
                phone: string;
            };
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CallbackStatus;
            phone: string;
            customerId: string | null;
            managerId: string | null;
            notes: string | null;
            source: string | null;
            completedAt: Date | null;
            message: string | null;
            priority: import(".prisma/client").$Enums.CallbackPriority;
            scheduledAt: Date | null;
        };
    }>;
    createCallback(body: any): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
                phone: string;
            };
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CallbackStatus;
            phone: string;
            customerId: string | null;
            managerId: string | null;
            notes: string | null;
            source: string | null;
            completedAt: Date | null;
            message: string | null;
            priority: import(".prisma/client").$Enums.CallbackPriority;
            scheduledAt: Date | null;
        };
    }>;
    updateCallback(id: string, body: any): Promise<{
        success: boolean;
        data: {
            customer: {
                id: string;
                email: string;
                name: string;
                phone: string;
            };
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
        } & {
            id: string;
            email: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            status: import(".prisma/client").$Enums.CallbackStatus;
            phone: string;
            customerId: string | null;
            managerId: string | null;
            notes: string | null;
            source: string | null;
            completedAt: Date | null;
            message: string | null;
            priority: import(".prisma/client").$Enums.CallbackPriority;
            scheduledAt: Date | null;
        };
    }>;
    deleteCallback(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
