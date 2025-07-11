import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiError';
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
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
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
        cb(new ApiError(400, `File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`), false);
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

// Middleware для обработки ошибок загрузки
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return next(new ApiError(400, 'File too large'));
            case 'LIMIT_FILE_COUNT':
                return next(new ApiError(400, 'Too many files'));
            case 'LIMIT_FIELD_KEY':
                return next(new ApiError(400, 'Field name too long'));
            case 'LIMIT_FIELD_VALUE':
                return next(new ApiError(400, 'Field value too long'));
            case 'LIMIT_FIELD_COUNT':
                return next(new ApiError(400, 'Too many fields'));
            case 'LIMIT_UNEXPECTED_FILE':
                return next(new ApiError(400, 'Unexpected file field'));
            default:
                return next(new ApiError(400, 'Upload error: ' + err.message));
        }
    }

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
export const createFileUrl = (filePath: string, req?: any): string => {
    if (!filePath) return '';

    // Если путь уже полный URL, возвращаем как есть
    if (filePath.startsWith('http')) {
        return filePath;
    }

    // Убираем начальный слеш если есть
    const cleanPath = filePath.startsWith('/') ? filePath.slice(1) : filePath;

    // Если есть объект запроса, формируем полный URL
    if (req) {
        const protocol = req.protocol;
        const host = req.get('host');
        return `${protocol}://${host}/${cleanPath}`;
    }

    // Иначе возвращаем относительный путь
    return `/${cleanPath}`;
};

// Валидация размера изображения
export const validateImageDimensions = (
    minWidth?: number,
    minHeight?: number,
    maxWidth?: number,
    maxHeight?: number
) => {
    return async (req: any, res: any, next: any) => {
        if (!req.file) {
            return next();
        }

        try {
            // Здесь можно добавить проверку размеров изображения
            // Для этого потребуется библиотека типа sharp или jimp
            // const sharp = require('sharp');
            // const metadata = await sharp(req.file.path).metadata();
            //
            // if (minWidth && metadata.width < minWidth) {
            //     return next(new ApiError(400, `Image width must be at least ${minWidth}px`));
            // }

            next();
        } catch (error) {
            next(new ApiError(400, 'Invalid image file'));
        }
    };
};

// Сжатие изображений
export const compressImage = (quality: number = 85) => {
    return async (req: any, res: any, next: any) => {
        if (!req.file) {
            return next();
        }

        try {
            // Здесь можно добавить сжатие изображения
            // const sharp = require('sharp');
            // await sharp(req.file.path)
            //     .jpeg({ quality })
            //     .toFile(req.file.path + '_compressed');

            next();
        } catch (error) {
            next(new ApiError(500, 'Image compression failed'));
        }
    };
};

// Создание миниатюр
export const createThumbnails = (sizes: Array<{ width: number; height: number; suffix: string }>) => {
    return async (req: any, res: any, next: any) => {
        if (!req.file) {
            return next();
        }

        try {
            // Здесь можно добавить создание миниатюр
            // const sharp = require('sharp');
            // const promises = sizes.map(size => {
            //     const outputPath = req.file.path.replace(/(\.[^.]+)$/, `_${size.suffix}$1`);
            //     return sharp(req.file.path)
            //         .resize(size.width, size.height)
            //         .toFile(outputPath);
            // });
            //
            // await Promise.all(promises);

            next();
        } catch (error) {
            next(new ApiError(500, 'Thumbnail creation failed'));
        }
    };
};

// Очистка временных файлов
export const cleanupTempFiles = () => {
    const tempDir = path.join(process.cwd(), 'uploads/temp');
    const maxAge = 24 * 60 * 60 * 1000; // 24 часа

    if (!fs.existsSync(tempDir)) {
        return;
    }

    fs.readdir(tempDir, (err, files) => {
        if (err) {
            logger.error('Error reading temp directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(tempDir, file);

            fs.stat(filePath, (err, stats) => {
                if (err) return;

                const now = new Date().getTime();
                const fileTime = new Date(stats.ctime).getTime();

                if (now - fileTime > maxAge) {
                    deleteFile(`uploads/temp/${file}`)
                        .catch(err => logger.error('Error deleting temp file:', err));
                }
            });
        });
    });
};

// Запуск очистки временных файлов каждый час
setInterval(cleanupTempFiles, 60 * 60 * 1000);