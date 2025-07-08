import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class BannersController {
    async getBanners(req: Request, res: Response) {
        try {
            const { position, active } = req.query;

            const where: any = {};

            if (position) {
                where.position = position;
            }

            if (active !== undefined) {
                where.isActive = active === 'true';
            }

            const banners = await prisma.banner.findMany({
                where,
                orderBy: [
                    { sortOrder: 'asc' },
                    { createdAt: 'desc' }
                ]
            });

            res.json({
                success: true,
                data: banners
            });

        } catch (error) {
            logger.error('Get banners error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async createBanner(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                title,
                subtitle,
                description,
                imageUrl,
                mobileImageUrl,
                buttonText,
                buttonUrl,
                position,
                isActive,
                sortOrder,
                startDate,
                endDate
            } = req.body;

            const banner = await prisma.banner.create({
                data: {
                    title,
                    subtitle,
                    description,
                    imageUrl,
                    mobileImageUrl,
                    buttonText,
                    buttonUrl,
                    position,
                    isActive: isActive ?? true,
                    sortOrder: sortOrder || 0,
                    startDate: startDate ? new Date(startDate) : null,
                    endDate: endDate ? new Date(endDate) : null
                }
            });

            res.status(201).json({
                success: true,
                data: banner
            });

        } catch (error) {
            logger.error('Create banner error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async updateBanner(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = { ...req.body };

            // Преобразуем даты если они есть
            if (updateData.startDate) {
                updateData.startDate = new Date(updateData.startDate);
            }
            if (updateData.endDate) {
                updateData.endDate = new Date(updateData.endDate);
            }

            const banner = await prisma.banner.update({
                where: { id },
                data: updateData
            });

            res.json({
                success: true,
                data: banner
            });

        } catch (error) {
            logger.error('Update banner error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async deleteBanner(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.banner.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Banner deleted successfully'
            });

        } catch (error) {
            logger.error('Delete banner error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}
