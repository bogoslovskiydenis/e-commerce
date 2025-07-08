
import { Request, Response } from 'express';
import { prisma } from '../../app';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

export class PagesController {
    async getPages(req: Request, res: Response) {
        try {
            const { active } = req.query;

            const where: any = {};

            if (active !== undefined) {
                where.isActive = active === 'true';
            }

            const pages = await prisma.page.findMany({
                where,
                orderBy: {
                    updatedAt: 'desc'
                }
            });

            res.json({
                success: true,
                data: pages
            });

        } catch (error) {
            logger.error('Get pages error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async createPage(req: AuthenticatedRequest, res: Response) {
        try {
            const {
                slug,
                title,
                content,
                excerpt,
                metaTitle,
                metaDescription,
                metaKeywords,
                template,
                isActive
            } = req.body;

            const page = await prisma.page.create({
                data: {
                    slug,
                    title,
                    content,
                    excerpt,
                    metaTitle,
                    metaDescription,
                    metaKeywords,
                    template: template || 'default',
                    isActive: isActive ?? true
                }
            });

            res.status(201).json({
                success: true,
                data: page
            });

        } catch (error) {
            logger.error('Create page error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async updatePage(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const page = await prisma.page.update({
                where: { id },
                data: updateData
            });

            res.json({
                success: true,
                data: page
            });

        } catch (error) {
            logger.error('Update page error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }

    async deletePage(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.page.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Page deleted successfully'
            });

        } catch (error) {
            logger.error('Delete page error:', error);
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}