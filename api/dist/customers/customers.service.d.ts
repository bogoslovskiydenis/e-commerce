import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    getCustomers(query: any): Promise<{
        success: boolean;
        data: ({
            _count: {
                reviews: number;
                orders: number;
                callbacks: number;
            };
        } & {
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tags: string[];
            phone: string;
            notes: string | null;
            address: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getCustomerById(id: string): Promise<{
        success: boolean;
        data: {
            _count: {
                reviews: number;
                orders: number;
                callbacks: number;
            };
            reviews: {
                comment: string | null;
                id: string;
                email: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                status: import(".prisma/client").$Enums.ReviewStatus;
                customerId: string | null;
                productId: string;
                rating: number;
                moderatorId: string | null;
                moderatedAt: Date | null;
            }[];
            orders: {
                totalAmount: import("@prisma/client/runtime/library").Decimal;
                discountAmount: import("@prisma/client/runtime/library").Decimal;
                shippingAmount: import("@prisma/client/runtime/library").Decimal;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import(".prisma/client").$Enums.OrderStatus;
                paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
                orderNumber: string;
                customerId: string;
                managerId: string | null;
                paymentMethod: string | null;
                shippingAddress: import("@prisma/client/runtime/library").JsonValue | null;
                notes: string | null;
                managerNotes: string | null;
                source: string | null;
                deliveryDate: Date | null;
                completedAt: Date | null;
            }[];
            callbacks: {
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
            }[];
        } & {
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tags: string[];
            phone: string;
            notes: string | null;
            address: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    createCustomer(data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tags: string[];
            phone: string;
            notes: string | null;
            address: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    updateCustomer(id: string, data: any): Promise<{
        success: boolean;
        data: {
            id: string;
            email: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            tags: string[];
            phone: string;
            notes: string | null;
            address: string | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        };
    }>;
    deleteCustomer(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
