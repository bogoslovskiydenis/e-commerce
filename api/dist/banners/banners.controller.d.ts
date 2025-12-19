import { BannersService } from './banners.service';
export declare class BannersController {
    private bannersService;
    constructor(bannersService: BannersService);
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
    createBanner(body: any): Promise<{
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
    updateBanner(id: string, body: any): Promise<{
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
