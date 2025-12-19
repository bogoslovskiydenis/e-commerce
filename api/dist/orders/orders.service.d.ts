import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    getOrders(query: any): Promise<{
        success: boolean;
        data: ({
            customer: {
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
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
            items: ({
                product: {
                    id: string;
                    title: string;
                    images: string[];
                };
            } & {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                price: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
                productId: string;
                quantity: number;
            })[];
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getOrderById(id: string): Promise<{
        success: boolean;
        data: {
            customer: {
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
            manager: {
                username: string;
                id: string;
                fullName: string;
            };
            items: ({
                product: {
                    description: string | null;
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    title: string;
                    slug: string;
                    shortDescription: string | null;
                    price: import("@prisma/client/runtime/library").Decimal;
                    oldPrice: import("@prisma/client/runtime/library").Decimal | null;
                    discount: import("@prisma/client/runtime/library").Decimal | null;
                    categoryId: string;
                    brand: string | null;
                    sku: string | null;
                    images: string[];
                    attributes: import("@prisma/client/runtime/library").JsonValue | null;
                    tags: string[];
                    inStock: boolean;
                    stockQuantity: number;
                    featured: boolean;
                    weight: import("@prisma/client/runtime/library").Decimal | null;
                    dimensions: import("@prisma/client/runtime/library").JsonValue | null;
                    metaTitle: string | null;
                    metaDescription: string | null;
                };
            } & {
                id: string;
                total: import("@prisma/client/runtime/library").Decimal;
                price: import("@prisma/client/runtime/library").Decimal;
                orderId: string;
                productId: string;
                quantity: number;
            })[];
        } & {
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
        };
    }>;
    updateOrderStatus(id: string, data: any, userId: string): Promise<{
        success: boolean;
        data: {
            customer: {
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
            manager: {
                id: string;
                fullName: string;
            };
        } & {
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
        };
    }>;
}
