import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.url} not found`,
        timestamp: new Date().toISOString()
    });
};