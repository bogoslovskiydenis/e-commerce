import { Request, Response, NextFunction } from 'express';

// Временные заглушки для валидации
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validatePasswordChange = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validatePasswordReset = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validateProductUpdate = (req: Request, res: Response, next: NextFunction) => {
    next();
};

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
    next();
};