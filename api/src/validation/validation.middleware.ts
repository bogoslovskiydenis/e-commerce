import { Request, Response, NextFunction } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { ApiError } from '@/utils/apiError';

// Валидация создания товара
export const validateProduct = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('oldPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Old price must be a positive number'),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),

    body('categoryId')
        .notEmpty()
        .withMessage('Category ID is required')
        .isUUID()
        .withMessage('Category ID must be a valid UUID'),

    body('description')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters'),

    body('brand')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Brand must be less than 100 characters'),

    body('inStock')
        .isBoolean()
        .withMessage('In stock must be a boolean'),

    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),

    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),

    body('metadata')
        .optional()
        .isObject()
        .withMessage('Metadata must be an object'),

    handleValidationErrors
];

// Валидация обновления товара
export const validateProductUpdate = [
    body('title')
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),

    body('price')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('oldPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Old price must be a positive number'),

    body('discount')
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage('Discount must be between 0 and 100'),

    body('categoryId')
        .optional()
        .isUUID()
        .withMessage('Category ID must be a valid UUID'),

    body('description')
        .optional()
        .isLength({ max: 5000 })
        .withMessage('Description must be less than 5000 characters'),

    body('brand')
        .optional()
        .isLength({ max: 100 })
        .withMessage('Brand must be less than 100 characters'),

    body('inStock')
        .optional()
        .isBoolean()
        .withMessage('In stock must be a boolean'),

    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),

    body('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),

    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array'),

    body('metadata')
        .optional()
        .isObject()
        .withMessage('Metadata must be an object'),

    handleValidationErrors
];

// Валидация создания категории
export const validateCategory = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('slug')
        .notEmpty()
        .withMessage('Slug is required')
        .isSlug()
        .withMessage('Slug must be a valid slug'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('parentId')
        .optional()
        .isUUID()
        .withMessage('Parent ID must be a valid UUID'),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),

    handleValidationErrors
];

// Валидация обновления категории
export const validateCategoryUpdate = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('slug')
        .optional()
        .isSlug()
        .withMessage('Slug must be a valid slug'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('parentId')
        .optional()
        .isUUID()
        .withMessage('Parent ID must be a valid UUID'),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),

    handleValidationErrors
];

// Валидация создания заказа
export const validateOrder = [
    body('customerName')
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Customer name must be between 2 and 100 characters'),

    body('customerEmail')
        .notEmpty()
        .withMessage('Customer email is required')
        .isEmail()
        .withMessage('Must be a valid email'),

    body('customerPhone')
        .notEmpty()
        .withMessage('Customer phone is required')
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number'),

    body('deliveryAddress')
        .notEmpty()
        .withMessage('Delivery address is required')
        .isLength({ min: 10, max: 500 })
        .withMessage('Delivery address must be between 10 and 500 characters'),

    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),

    body('items.*.productId')
        .isUUID()
        .withMessage('Product ID must be a valid UUID'),

    body('items.*.quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),

    body('notes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Notes must be less than 1000 characters'),

    body('deliveryDate')
        .optional()
        .isISO8601()
        .withMessage('Delivery date must be a valid date'),

    body('paymentMethod')
        .optional()
        .isIn(['cash', 'card', 'online', 'transfer'])
        .withMessage('Invalid payment method'),

    handleValidationErrors
];

// Валидация обновления заказа
export const validateOrderUpdate = [
    body('status')
        .optional()
        .isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERING', 'DELIVERED', 'CANCELLED', 'REFUNDED'])
        .withMessage('Invalid order status'),

    body('paymentStatus')
        .optional()
        .isIn(['pending', 'paid', 'failed', 'refunded'])
        .withMessage('Invalid payment status'),

    body('managerNotes')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Manager notes must be less than 1000 characters'),

    body('deliveryDate')
        .optional()
        .isISO8601()
        .withMessage('Delivery date must be a valid date'),

    handleValidationErrors
];

// Валидация создания обратного звонка
export const validateCallback = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),

    body('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number'),

    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email'),

    body('message')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Message must be less than 1000 characters'),

    body('source')
        .optional()
        .isIn(['website', 'phone', 'email', 'social', 'referral', 'advertising'])
        .withMessage('Invalid source'),

    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
        .withMessage('Invalid priority'),

    handleValidationErrors
];

// Валидация обновления обратного звонка
export const validateCallbackUpdate = [
    body('status')
        .optional()
        .isIn(['NEW', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
        .withMessage('Invalid callback status'),

    body('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
        .withMessage('Invalid priority'),

    body('callbackTime')
        .optional()
        .isISO8601()
        .withMessage('Callback time must be a valid date'),

    body('manager')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Manager name must be between 2 and 100 characters'),

    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Comment must be less than 1000 characters'),

    body('managerNote')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Manager note must be less than 1000 characters'),

    handleValidationErrors
];

// Валидация создания пользователя
export const validateUser = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('First name must contain only letters, spaces, and hyphens'),

    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Last name must contain only letters, spaces, and hyphens'),

    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number'),

    body('role')
        .optional()
        .isIn(['ADMIN', 'MANAGER', 'SUPPORT', 'CUSTOMER'])
        .withMessage('Invalid role'),

    handleValidationErrors
];

// Валидация обновления пользователя
export const validateUserUpdate = [
    body('email')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),

    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('First name must contain only letters, spaces, and hyphens'),

    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .isAlpha('en-US', { ignore: ' -' })
        .withMessage('Last name must contain only letters, spaces, and hyphens'),

    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number'),

    body('role')
        .optional()
        .isIn(['ADMIN', 'MANAGER', 'SUPPORT', 'CUSTOMER'])
        .withMessage('Invalid role'),

    body('isActive')
        .optional()
        .isBoolean()
        .withMessage('Is active must be a boolean'),

    handleValidationErrors
];

// Валидация входа в систему
export const validateLogin = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    handleValidationErrors
];

// Валидация регистрации
export const validateRegister = [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Must be a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    body('firstName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('phone')
        .optional()
        .isMobilePhone('any')
        .withMessage('Must be a valid phone number'),

    handleValidationErrors
];

// Валидация смены пароля
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 6, max: 100 })
        .withMessage('New password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Password confirmation does not match new password');
            }
            return true;
        }),

    handleValidationErrors
];

// Валидация сброса пароля
export const validatePasswordReset = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),

    body('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password must be between 6 and 100 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),

    handleValidationErrors
];

// Валидация отзыва
export const validateReview = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isUUID()
        .withMessage('Product ID must be a valid UUID'),

    body('customerName')
        .notEmpty()
        .withMessage('Customer name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Customer name must be between 2 and 100 characters'),

    body('customerEmail')
        .optional()
        .isEmail()
        .withMessage('Must be a valid email'),

    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),

    body('comment')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Comment must be less than 1000 characters'),

    handleValidationErrors
];

// Валидация баннера
export const validateBanner = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),

    body('subtitle')
        .optional()
        .isLength({ max: 300 })
        .withMessage('Subtitle must be less than 300 characters'),

    body('description')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('image')
        .notEmpty()
        .withMessage('Image is required'),

    body('buttonText')
        .optional()
        .isLength({ max: 50 })
        .withMessage('Button text must be less than 50 characters'),

    body('buttonUrl')
        .optional()
        .isURL()
        .withMessage('Button URL must be a valid URL'),

    body('position')
        .optional()
        .isIn(['main', 'category', 'sidebar', 'promo', 'footer'])
        .withMessage('Invalid banner position'),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),

    body('order')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Order must be a non-negative integer'),

    body('startDate')
        .optional()
        .isISO8601()
        .withMessage('Start date must be a valid date'),

    body('endDate')
        .optional()
        .isISO8601()
        .withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (value && req.body.startDate && new Date(value) <= new Date(req.body.startDate)) {
                throw new Error('End date must be after start date');
            }
            return true;
        }),

    handleValidationErrors
];

// Валидация страницы
export const validatePage = [
    body('slug')
        .notEmpty()
        .withMessage('Slug is required')
        .isSlug()
        .withMessage('Slug must be a valid slug'),

    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Title must be between 2 and 200 characters'),

    body('content')
        .notEmpty()
        .withMessage('Content is required')
        .isLength({ min: 10 })
        .withMessage('Content must be at least 10 characters'),

    body('excerpt')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Excerpt must be less than 500 characters'),

    body('metaTitle')
        .optional()
        .isLength({ max: 60 })
        .withMessage('Meta title must be less than 60 characters'),

    body('metaDescription')
        .optional()
        .isLength({ max: 160 })
        .withMessage('Meta description must be less than 160 characters'),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('Active must be a boolean'),

    body('template')
        .optional()
        .isIn(['default', 'full-width', 'sidebar', 'landing'])
        .withMessage('Invalid template'),

    handleValidationErrors
];

// Валидация настроек
export const validateSetting = [
    body('key')
        .notEmpty()
        .withMessage('Setting key is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Setting key must be between 2 and 100 characters')
        .matches(/^[a-zA-Z0-9_.-]+$/)
        .withMessage('Setting key can only contain letters, numbers, dots, hyphens, and underscores'),

    body('value')
        .notEmpty()
        .withMessage('Setting value is required'),

    body('type')
        .optional()
        .isIn(['string', 'number', 'boolean', 'json', 'array'])
        .withMessage('Invalid setting type'),

    handleValidationErrors
];

// Валидация ID параметра
export const validateIdParam = [
    param('id')
        .isUUID()
        .withMessage('ID must be a valid UUID'),

    handleValidationErrors
];

// Валидация slug параметра
export const validateSlugParam = [
    param('slug')
        .isSlug()
        .withMessage('Slug must be a valid slug'),

    handleValidationErrors
];

// Валидация query параметров для пагинации
export const validatePaginationQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sortBy')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('Sort by field must be between 1 and 50 characters'),

    query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Sort order must be asc or desc'),

    handleValidationErrors
];

// Валидация query параметров для поиска
export const validateSearchQuery = [
    query('q')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Search query must be between 1 and 100 characters'),

    query('category')
        .optional()
        .isUUID()
        .withMessage('Category must be a valid UUID'),

    query('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Minimum price must be a positive number'),

    query('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Maximum price must be a positive number'),

    query('inStock')
        .optional()
        .isBoolean()
        .withMessage('In stock must be a boolean'),

    query('featured')
        .optional()
        .isBoolean()
        .withMessage('Featured must be a boolean'),

    handleValidationErrors
];

// Общий обработчик ошибок валидации
function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        throw new ApiError(400, 'Validation failed', errorMessages);
    }
    next();
}

// Кастомные валидаторы
export const customValidators = {
    // Проверка уникальности email
    isUniqueEmail: async (email: string, { req }: any) => {
        const { prisma } = await import('../config/database');
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        // Если это обновление пользователя, исключаем текущего пользователя
        if (existingUser && req.params.id !== existingUser.id) {
            throw new Error('Email already exists');
        }
        return true;
    },

    // Проверка уникальности slug категории
    isUniqueCategorySlug: async (slug: string, { req }: any) => {
        const { prisma } = await import('../config/database');
        const existingCategory = await prisma.category.findUnique({
            where: { slug }
        });

        if (existingCategory && req.params.id !== existingCategory.id) {
            throw new Error('Category slug already exists');
        }
        return true;
    },

    // Проверка существования категории
    categoryExists: async (categoryId: string) => {
        const { prisma } = await import('../config/database');
        const category = await prisma.category.findUnique({
            where: { id: categoryId }
        });

        if (!category) {
            throw new Error('Category does not exist');
        }
        return true;
    },

    // Проверка существования товара
    productExists: async (productId: string) => {
        const { prisma } = await import('../config/database');
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new Error('Product does not exist');
        }
        return true;
    }
};