import { SettingsService } from './settings.service';
export declare class SettingsController {
    private settingsService;
    constructor(settingsService: SettingsService);
    getSettings(): Promise<{
        success: boolean;
        data: any;
    }>;
    updateSettings(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
