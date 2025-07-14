// validation/categories.validation.ts
import { z } from 'zod';

// Схема для создания категории
export const createCategorySchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'Название категории обязательно')
            .max(200, 'Название не может быть длиннее 200 символов'),

        slug: z.string()
            .min(1, 'URL (slug) обязателен')
            .max(200, 'URL не может быть длиннее 200 символов')
            .regex(/^[a-z0-9-]+$/, 'URL может содержать только латинские буквы, цифры и дефисы'),

        description: z.string()
            .max(1000, 'Описание не может быть длиннее 1000 символов')
            .optional(),

        type: z.enum([
            'products',
            'balloons',
            'gifts',
            'events',
            'colors',
            'materials',
            'occasions'
        ], {
            errorMap: () => ({ message: 'Неверный тип категории' })
        }),

        parentId: z.string()
            .uuid('Неверный ID родительской категории')
            .optional(),

        imageUrl: z.string()
            .url('Неверный URL изображения')
            .optional(),

        bannerUrl: z.string()
            .url('Неверный URL баннера')
            .optional(),

        active: z.boolean()
            .default(true),

        showInNavigation: z.boolean()
            .default(true),

        order: z.number()
            .int('Порядок должен быть целым числом')
            .min(0, 'Порядок не может быть отрицательным')
            .default(0),

        // SEO поля
        metaTitle: z.string()
            .max(60, 'Meta title не может быть длиннее 60 символов')
            .optional(),

        metaDescription: z.string()
            .max(160, 'Meta description не может быть длиннее 160 символов')
            .optional(),

        metaKeywords: z.string()
            .max(200, 'Ключевые слова не могут быть длиннее 200 символов')
            .optional(),

        // Настройки фильтров для UI
        filters: z.object({
            allowColorFilter: z.boolean().default(true),
            allowMaterialFilter: z.boolean().default(true),
            allowPriceFilter: z.boolean().default(true),
            allowBrandFilter: z.boolean().default(false),
            allowSizeFilter: z.boolean().default(false),
            customFilters: z.array(z.object({
                key: z.string(),
                label: z.string(),
                type: z.enum(['select', 'checkbox', 'range']),
                options: z.array(z.string()).optional()
            })).optional()
        }).optional()
    })
});

// Схема для обновления категории
export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string()
            .min(1, 'Название категории обязательно')
            .max(200, 'Название не может быть длиннее 200 символов')
            .optional(),

        slug: z.string()
            .min(1, 'URL (slug) обязателен')
            .max(200, 'URL не может быть длиннее 200 символов')
            .regex(/^[a-z0-9-]+$/, 'URL может содержать только латинские буквы, цифры и дефисы')
            .optional(),

        description: z.string()
            .max(1000, 'Описание не может быть длиннее 1000 символов')
            .optional(),

        type: z.enum([
            'products',
            'balloons',
            'gifts',
            'events',
            'colors',
            'materials',
            'occasions'
        ]).optional(),

        parentId: z.string()
            .uuid('Неверный ID родительской категории')
            .nullable()
            .optional(),

        imageUrl: z.string()
            .url('Неверный URL изображения')
            .nullable()
            .optional(),

        bannerUrl: z.string()
            .url('Неверный URL баннера')
            .nullable()
            .optional(),

        active: z.boolean().optional(),

        showInNavigation: z.boolean().optional(),

        order: z.number()
            .int('Порядок должен быть целым числом')
            .min(0, 'Порядок не может быть отрицательным')
            .optional(),

        // SEO поля
        metaTitle: z.string()
            .max(60, 'Meta title не может быть длиннее 60 символов')
            .nullable()
            .optional(),

        metaDescription: z.string()
            .max(160, 'Meta description не может быть длиннее 160 символов')
            .nullable()
            .optional(),

        metaKeywords: z.string()
            .max(200, 'Ключевые слова не могут быть длиннее 200 символов')
            .nullable()
            .optional(),

        // Настройки фильтров для UI
        filters: z.object({
            allowColorFilter: z.boolean().default(true),
            allowMaterialFilter: z.boolean().default(true),
            allowPriceFilter: z.boolean().default(true),
            allowBrandFilter: z.boolean().default(false),
            allowSizeFilter: z.boolean().default(false),
            customFilters: z.array(z.object({
                key: z.string(),
                label: z.string(),
                type: z.enum(['select', 'checkbox', 'range']),
                options: z.array(z.string()).optional()
            })).optional()
        }).optional()
    })
});

// Схема для параметра ID категории
export const categoryIdParamSchema = z.object({
    params: z.object({
        id: z.string().uuid('Неверный ID категории')
    })
});

// Схема для изменения порядка категорий
export const reorderCategoriesSchema = z.object({
    body: z.object({
        items: z.array(z.object({
            id: z.string().uuid('Неверный ID категории'),
            order: z.number().int('Порядок должен быть целым числом').min(0)
        })).min(1, 'Необходимо передать хотя бы одну категорию')
    })
});

// Схема для перемещения категории
export const moveCategorySchema = z.object({
    body: z.object({
        newParentId: z.string()
            .uuid('Неверный ID родительской категории')
            .nullable()
            .optional(),

        newOrder: z.number()
            .int('Порядок должен быть целым числом')
            .min(0, 'Порядок не может быть отрицательным')
            .optional()
    })
});

// Схема для удаления категории с опциями
export const deleteCategorySchema = z.object({
    query: z.object({
        moveProductsTo: z.string()
            .uuid('Неверный ID категории для перемещения товаров')
            .optional(),

        force: z.string()
            .transform(val => val === 'true')
            .optional()
    }).optional()
});

// Типы для TypeScript
export type CreateCategoryRequest = z.infer<typeof createCategorySchema>;
export type UpdateCategoryRequest = z.infer<typeof updateCategorySchema>;
export type CategoryIdParams = z.infer<typeof categoryIdParamSchema>;
export type ReorderCategoriesRequest = z.infer<typeof reorderCategoriesSchema>;
export type MoveCategoryRequest = z.infer<typeof moveCategorySchema>;
export type DeleteCategoryRequest = z.infer<typeof deleteCategorySchema>;