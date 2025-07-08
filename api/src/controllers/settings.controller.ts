
import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class SettingsController {
    async getSettings(req: Request, res: Response) {
        try {
            const settings = await prisma.setting.findMany();

            // Преобразуем в объект для удобства
            const settingsObject = settings.reduce((acc, setting) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {} as any);

            res.json({
                success: true,
                data: settingsObject
            });

        } catch (error) {
            logger.error('Get settings error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async updateSettings(req: AuthenticatedRequest, res: Response) {
        try {
            const settingsData = req.body;

            // Обновляем каждую настройку
            const updatePromises = Object.entries(settingsData).map(([key, value]) =>
                prisma.setting.upsert({
                    where: { key },
                    update: { value: value as any },
                    create: {
                        key,
                        value: value as any,
                        type: typeof value
                    }
                })
            );

            await Promise.all(updatePromises);

            res.json({
                success: true,
                message: 'Settings updated successfully'
            });

        } catch (error) {
            logger.error('Update settings error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}