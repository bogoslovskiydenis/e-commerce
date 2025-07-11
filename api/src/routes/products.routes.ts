import { Router } from 'express';
import { authenticateToken, requirePermission } from '@/middleware/auth.middleware';
import { productsController } from '@/controllers/products.controller';
import { uploadSingle, handleUploadError } from '@/middleware/upload.middleware';
import { z } from 'zod';

const router = Router();

// Применяем аутентификацию ко всем маршрутам
router.use(authenticateToken);

// Схемы валидации для JSON данных (без файлов)
const createProductSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
        slug: z.string().max(255).optional(),
        description: z.string().optional(),
        price: z.number().positive('Price must be positive').or(z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format').transform(Number)),
        oldPrice: z.number().positive().optional().or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number).optional()),
        sku: z.string().max(100).optional(),
        brand: z.string().max(100).optional(),
        categoryId: z.string().uuid('Invalid category ID').optional(),
        isActive: z.boolean().optional().default(true),
        inStock: z.boolean().optional().default(true),
        stockQuantity: z.number().int().min(0).optional().default(0).or(z.string().regex(/^\d+$/).transform(Number)),
        weight: z.number().positive().optional().or(z.string().regex(/^\d+(\.\d{1,3})?$/).transform(Number).optional()),
        dimensions: z.object({
            length: z.number().positive().optional(),
            width: z.number().positive().optional(),
            height: z.number().positive().optional()
        }).optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional()
    })
});

const updateProductSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid product ID')
    }),
    body: z.object({
        title: z.string().min(1).max(255).optional(),
        slug: z.string().max(255).optional(),
        description: z.string().optional(),
        price: z.number().positive().or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)).optional(),
        oldPrice: z.number().positive().or(z.string().regex(/^\d+(\.\d{1,2})?$/).transform(Number)).optional().nullable(),
        sku: z.string().max(100).optional(),
        brand: z.string().max(100).optional(),
        categoryId: z.string().uuid().optional().nullable(),
        isActive: z.boolean().optional(),
        inStock: z.boolean().optional(),
        stockQuantity: z.number().int().min(0).or(z.string().regex(/^\d+$/).transform(Number)).optional(),
        weight: z.number().positive().or(z.string().regex(/^\d+(\.\d{1,3})?$/).transform(Number)).optional().nullable(),
        dimensions: z.object({
            length: z.number().positive().optional(),
            width: z.number().positive().optional(),
            height: z.number().positive().optional()
        }).optional(),
        metaTitle: z.string().max(255).optional(),
        metaDescription: z.string().max(500).optional()
    })
});

const productIdSchema = z.object({
    params: z.object({
        id: z.string().uuid('Invalid product ID')
    })
});

const categoryProductsSchema = z.object({
    params: z.object({
        categoryId: z.string().uuid('Invalid category ID')
    })
});

router.get('/',
    requirePermission('products.view'),
    productsController.getProducts
);

// Получить товар по ID
router.get('/:id',
    requirePermission('products.view'),
    productsController.getProduct
);

// Создать новый товар (с возможностью загрузки изображения)
router.post('/',
    requirePermission('products.create'),
    uploadSingle('image'),
    handleUploadError,
    productsController.createProduct
);

// Обновить товар (с возможностью загрузки изображения)
router.put('/:id',
    requirePermission('products.edit'),
    uploadSingle('image'),
    handleUploadError,
    productsController.updateProduct
);

// Отдельный endpoint для загрузки изображения
router.post('/:id/upload-image',
    requirePermission('products.edit'),
    uploadSingle('image'),
    handleUploadError,
    productsController.uploadProductImage
);

// Удалить товар
router.delete('/:id',
    requirePermission('products.delete'),
    productsController.deleteProduct
);

export default router;