import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private prisma;
    constructor(prisma: PrismaService);
    getApiInfo(): {
        success: boolean;
        message: string;
        version: string;
        endpoints: {
            auth: string;
            admin: string;
            categories: string;
            products: string;
            orders: string;
            customers: string;
            banners: string;
            pages: string;
            settings: string;
            navigation: string;
            adminLogs: string;
            callbacks: string;
            reviews: string;
        };
    };
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    getStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalOrders: number;
            totalProducts: number;
            totalCustomers: number;
            revenue: number;
            newUsers: number;
            completedOrders: number;
        };
    }>;
}
