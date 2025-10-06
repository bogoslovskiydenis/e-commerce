// api/src/controllers/navigation.controller.js
import { navigationService } from '../services/navigation.service.js';
import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/errors.js';

export class NavigationController {
    async getNavigationItems(req, res) {
        try {
            const { parentId, type, isActive } = req.query;

            const filters = {};
            if (parentId !== undefined) {
                filters.parentId = parentId === 'null' ? null : String(parentId);
            }
            if (type) filters.type = String(type);
            if (isActive !== undefined) filters.isActive = isActive === 'true';

            const items = await navigationService.getNavigationItems(filters);

            res.json({
                success: true,
                data: items,
                total: items.length
            });
        } catch (error) {
            logger.error('Get navigation items error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async getNavigationTree(req, res) {
        try {
            const tree = await navigationService.getNavigationTree();

            res.json({
                success: true,
                data: tree
            });
        } catch (error) {
            logger.error('Get navigation tree error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async getNavigationItem(req, res) {
        try {
            const { id } = req.params;
            const item = await navigationService.getNavigationItemById(id);

            res.json({
                success: true,
                data: item
            });
        } catch (error) {
            logger.error('Get navigation item error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async createNavigationItem(req, res) {
        try {
            const data = req.body;
            const item = await navigationService.createNavigationItem(data);

            logger.info(`Navigation item created: ${item.name} by ${req.user?.username || 'unknown'}`);

            res.status(201).json({
                success: true,
                data: item,
                message: 'Navigation item created successfully'
            });
        } catch (error) {
            logger.error('Create navigation item error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async updateNavigationItem(req, res) {
        try {
            const { id } = req.params;
            const data = req.body;

            const item = await navigationService.updateNavigationItem(id, data);

            logger.info(`Navigation item updated: ${item.name} by ${req.user?.username || 'unknown'}`);

            res.json({
                success: true,
                data: item,
                message: 'Navigation item updated successfully'
            });
        } catch (error) {
            logger.error('Update navigation item error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async reorderNavigationItems(req, res) {
        try {
            const { items } = req.body;

            await navigationService.reorderNavigationItems(items);

            logger.info(`Navigation items reordered by ${req.user?.username || 'unknown'}`);

            res.json({
                success: true,
                message: 'Navigation items reordered successfully'
            });
        } catch (error) {
            logger.error('Reorder navigation items error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }

    async deleteNavigationItem(req, res) {
        try {
            const { id } = req.params;

            await navigationService.deleteNavigationItem(id);

            logger.info(`Navigation item deleted: ${id} by ${req.user?.username || 'unknown'}`);

            res.json({
                success: true,
                message: 'Navigation item deleted successfully'
            });
        } catch (error) {
            logger.error('Delete navigation item error:', error);

            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: 'Internal server error'
            });
        }
    }
}

export const navigationController = new NavigationController();