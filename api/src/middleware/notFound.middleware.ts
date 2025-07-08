import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.path} not found`,
        path: req.path,
        method: req.method
    });
};