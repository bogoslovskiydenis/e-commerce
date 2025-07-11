import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Создаем папки для загрузки если их нет
const createUploadDirs = () => {
    const uploadDirs = [
        'uploads',
        'uploads/products',
        'uploads/categories',
        'uploads/banners',
        'uploads/users',
        'uploads/temp'
    ];

    uploadDirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            logger.info(`Created upload directory: ${fullPath}`);
        }
    });
};

// Создаем папки при импорте модуля
createUploadDirs();

// Конфигурация для хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/temp'; // По умолчанию

        // Определяем папку на основе пути запроса
        if (req.baseUrl.includes('/products')) {
            uploadPath = 'uploads/products';
        } else if (req.baseUrl.includes('/categories')) {
            uploadPath = 'uploads/categories';
        } else if (req.baseUrl.includes('/banners')) {
            uploadPath = 'uploads/banners';
        } else if (req.baseUrl.includes('/users')) {
            uploadPath = 'uploads/users';
        }

        const fullPath = path.join(process.cwd(), uploadPath);

        // Убеждаемся что папка существует
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }

        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        const name = file.fieldname + '-' + uniqueSuffix + ext;
        cb(null, name);
    }
});

// Фильтр для типов файлов
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Разрешенные типы файлов
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml'
    ];

    // Разрешенные расширения
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
    }
};

// Основная конфигурация multer
const uploadConfig = {
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB по умолчанию
        files: 10, // Максимум 10 файлов за раз
        fields: 20, // Максимум 20 полей формы
        fieldNameSize: 100, // Максимальная длина имени поля
        fieldSize: 1024 * 1024 // Максимальный размер поля (1MB)
    }
};

// Экспортируем различные конфигурации загрузки
export const upload = multer(uploadConfig);

// Загрузка одного файла
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Загрузка нескольких файлов одного поля
export const uploadArray = (fieldName: string, maxCount: number = 5) =>
    upload.array(fieldName, maxCount);

// Загрузка нескольких полей с файлами
export const uploadFields = (fields: Array<{ name: string; maxCount?: number }>) =>
    upload.fields(fields);

// ✅ ИСПРАВЛЕННАЯ ТИПИЗАЦИЯ: Middleware для обработки ошибок загрузки
export const handleUploadError = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
        let errorMessage = 'Upload error';
        let statusCode = 400;

        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                errorMessage = 'File too large';
                break;
            case 'LIMIT_FILE_COUNT':
                errorMessage = 'Too many files';
                break;
            case 'LIMIT_FIELD_KEY':
                errorMessage = 'Field name too long';
                break;
            case 'LIMIT_FIELD_VALUE':
                errorMessage = 'Field value too long';
                break;
            case 'LIMIT_FIELD_COUNT':
                errorMessage = 'Too many fields';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                errorMessage = 'Unexpected file field';
                break;
            default:
                errorMessage = 'Upload error: ' + err.message;
        }

        logger.error('Upload error:', { code: err.code, message: err.message });

        return res.status(statusCode).json({
            success: false,
            error: errorMessage
        });
    }

    // Обработка других ошибок загрузки файлов
    if (err && err.message.includes('File type not allowed')) {
        logger.error('File type error:', err.message);
        return res.status(400).json({
            success: false,
            error: err.message
        });
    }

    // Если ошибка не связана с загрузкой, передаем дальше
    if (err) {
        return next(err);
    }

    next();
};

// Утилиты для работы с файлами
export const deleteFile = (filePath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const fullPath = path.join(process.cwd(), filePath);

        fs.unlink(fullPath, (err) => {
            if (err) {
                logger.error(`Failed to delete file: ${fullPath}`, err);
                reject(err);
            } else {
                logger.info(`File deleted: ${fullPath}`);
                resolve();
            }
        });
    });
};

// Получение информации о файле
export const getFileInfo = (filePath: string) => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const stats = fs.statSync(fullPath);
    const ext = path.extname(filePath).toLowerCase();

    return {
        path: filePath,
        size: stats.size,
        extension: ext,
        mimeType: getMimeType(ext),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
    };
};

// Получение MIME типа по расширению
const getMimeType = (extension: string): string => {
    const mimeTypes: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml'
    };

    return mimeTypes[extension] || 'application/octet-stream';
};

// Проверка существования файла
export const fileExists = (filePath: string): boolean => {
    const fullPath = path.join(process.cwd(), filePath);
    return fs.existsSync(fullPath);
};

// Создание URL для файла
export const createFileUrl = (filePath: string, req?: Request): string => {
    const baseUrl = req
        ? `${req.protocol}://${req.get('Host')}`
        : process.env.BASE_URL || 'http://localhost:3001';

    return `${baseUrl}/uploads/${path.basename(filePath)}`;
};