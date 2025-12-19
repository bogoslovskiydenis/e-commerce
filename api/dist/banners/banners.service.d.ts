import { PrismaService } from '../prisma/prisma.service';
export declare class BannersService {
    private prisma;
    constructor(prisma: PrismaService);
    getBanners(query: any): Promise<{
        success: boolean;
        data: {
            link: string | null;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            sortOrder: number;
            imageUrl: string;
            position: import(".prisma/client").$Enums.BannerPosition;
            subtitle: string | null;
            mobileImageUrl: string | null;
            buttonText: string | null;
            startDate: Date | null;
            endDate: Date | null;
        }[];
    }>;
    createBanner(data: any): Promise<{
        success: boolean;
        data: {
            link: string | null;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            sortOrder: number;
            imageUrl: string;
            position: import(".prisma/client").$Enums.BannerPosition;
            subtitle: string | null;
            mobileImageUrl: string | null;
            buttonText: string | null;
            startDate: Date | null;
            endDate: Date | null;
        };
    }>;
    updateBanner(id: string, data: any): Promise<{
        success: boolean;
        data: {
            link: string | null;
            description: string | null;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            sortOrder: number;
            imageUrl: string;
            position: import(".prisma/client").$Enums.BannerPosition;
            subtitle: string | null;
            mobileImageUrl: string | null;
            buttonText: string | null;
            startDate: Date | null;
            endDate: Date | null;
        };
    }>;
    deleteBanner(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
