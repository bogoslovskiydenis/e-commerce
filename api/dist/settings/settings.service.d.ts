import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        success: boolean;
        data: any;
    }>;
    updateSettings(settingsData: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
