import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../utils/helpers';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

// Роли и их разрешения
const ROLE_PERMISSIONS = {
    SUPER_ADMIN: [
        'admin.full_access',
        'users.create', 'users.edit', 'users.delete', 'users.view',
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'orders.view', 'orders.edit', 'orders.delete',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit', 'reviews.delete',
        'website.banners', 'website.pages', 'website.settings', 'website.navigation',
        'analytics.view', 'logs.view', 'api_keys.manage'
    ],
    ADMINISTRATOR: [
        'products.create', 'products.edit', 'products.delete', 'products.view',
        'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
        'users.create', 'users.edit', 'users.view',
        'website.banners', 'website.pages', 'website.navigation',
        'analytics.view'
    ],
    MANAGER: [
        'orders.view', 'orders.edit',
        'callbacks.view', 'callbacks.edit',
        'reviews.view', 'reviews.edit',
        'customers.view', 'customers.edit',
        'products.view', 'analytics.basic'
    ],
    CRM_MANAGER: [
        'customers.view', 'customers.edit',
        'promotions.create', 'promotions.edit', 'promotions.view',
        'emails.send', 'loyalty.manage', 'analytics.marketing'
    ]
};

async function seedUsers() {
    const users = [
        {
            username: 'admin',
            email: 'admin@balloonshop.com',
            password: 'admin123',
            fullName: 'Супер Администратор',
            role: UserRole.SUPER_ADMIN,
            permissions: ROLE_PERMISSIONS.SUPER_ADMIN
        },
        {
            username: 'manager',
            email: 'manager@balloonshop.com',
            password: 'manager123',
            fullName: 'Главный Менеджер',
            role: UserRole.ADMINISTRATOR,
            permissions: ROLE_PERMISSIONS.ADMINISTRATOR
        },
        {
            username: 'orders_manager',
            email: 'orders@balloonshop.com',
            password: 'orders123',
            fullName: 'Менеджер по заказам',
            role: UserRole.MANAGER,
            permissions: ROLE_PERMISSIONS.MANAGER
        }
    ];

    for (const userData of users) {
        const existingUser = await prisma.user.findUnique({
            where: { username: userData.username }
        });

        if (!existingUser) {
            const hashedPassword = await hashPassword(userData.password);

            await prisma.user.create({
                data: {
                    username: userData.username,
                    email: userData.email,
                    passwordHash: hashedPassword,
                    fullName: userData.fullName,
                    role: userData.role,
                    permissions: userData.permissions,
                    isActive: true
                }
            });

            logger.info(`Created user: ${userData.username}`);
        }
    }
}

async function seedCategories() {
    const categories = [
        {
            name: 'Фольгированные шары',
            slug: 'foil-balloons',
            description: 'Красивые фольгированные шары разных форм и размеров'
        },
        {
            name: 'Латексные шары',
            slug: 'latex-balloons',
            description: 'Классические латексные шары всех цветов'
        },
        {
            name: 'Букеты из шаров',
            slug: 'balloon-bouquets',
            description: 'Готовые букеты из шаров для любого праздника'
        },
        {
            name: 'Цифры из шаров',
            slug: 'number-balloons',
            description: 'Цифры из шаров для дней рождения и юбилеев'
        },
        {
            name: 'Тематические наборы',
            slug: 'themed-sets',
            description: 'Наборы шаров для определенных праздников'
        }
    ];

    for (const categoryData of categories) {
        const existingCategory = await prisma.category.findUnique({
            where: { slug: categoryData.slug }
        });

        if (!existingCategory) {
            await prisma.category.create({
                data: categoryData
            });

            logger.info(`Created category: ${categoryData.name}`);
        }
    }
}

async function seedSettings() {
    const settings = [
        {
            key: 'site_name',
            value: 'Balloon Shop',
            type: 'string'
        },
        {
            key: 'site_description',
            value: 'Интернет-магазин воздушных шаров',
            type: 'string'
        },
        {
            key: 'contact_phone',
            value: '+380671234567',
            type: 'string'
        },
        {
            key: 'contact_email',
            value: 'info@balloonshop.com',
            type: 'string'
        },
        {
            key: 'free_delivery_from',
            value: 500,
            type: 'number'
        },
        {
            key: 'delivery_price',
            value: 50,
            type: 'number'
        }
    ];

    for (const settingData of settings) {
        const existingSetting = await prisma.setting.findUnique({
            where: { key: settingData.key }
        });

        if (!existingSetting) {
            await prisma.setting.create({
                data: settingData
            });

            logger.info(`Created setting: ${settingData.key}`);
        }
    }
}

async function main() {
    try {
        logger.info('Starting database seeding...');

        await seedUsers();
        await seedCategories();
        await seedSettings();

        logger.info('Database seeding completed successfully!');
    } catch (error) {
        logger.error('Error during seeding:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();