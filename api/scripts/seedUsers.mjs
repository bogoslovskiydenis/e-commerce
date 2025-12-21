// scripts/seedUsers.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    'admin.full_access',
    'users.create', 'users.edit', 'users.delete', 'users.view',
    'products.create', 'products.edit', 'products.delete', 'products.view',
    'orders.view', 'orders.edit', 'orders.delete', 'orders.create',
    'callbacks.view', 'callbacks.edit',
    'reviews.view', 'reviews.edit', 'reviews.delete',
    'website.banners', 'website.pages', 'website.settings', 'website.navigation',
    'analytics.view', 'logs.view', 'api_keys.manage',
    'customers.view', 'customers.edit', 'customers.delete',
    'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
    'promotions.create', 'promotions.edit', 'promotions.view', 'promotions.delete',
    'emails.send', 'loyalty.manage', 'analytics.marketing',
    'files.upload', 'files.delete'
  ],
  ADMINISTRATOR: [
    'products.create', 'products.edit', 'products.delete', 'products.view',
    'categories.create', 'categories.edit', 'categories.delete', 'categories.view',
    'users.create', 'users.edit', 'users.view',
    'website.banners', 'website.pages', 'website.navigation',
    'analytics.view', 'customers.view', 'customers.edit',
    'orders.view', 'orders.edit', 'reviews.view', 'reviews.edit'
  ],
  MANAGER: [
    'orders.view', 'orders.edit', 'orders.create',
    'callbacks.view', 'callbacks.edit',
    'reviews.view', 'reviews.edit',
    'customers.view', 'customers.edit',
    'products.view', 'analytics.basic'
  ],
  CRM_MANAGER: [
    'customers.view', 'customers.edit',
    'promotions.create', 'promotions.edit', 'promotions.view',
    'emails.send', 'loyalty.manage', 'analytics.marketing',
    'orders.view', 'callbacks.view', 'callbacks.edit'
  ]
};

const testUsers = [
    {
        username: 'admin',
        email: 'admin@balloonshop.com',
        password: 'admin123',
        fullName: 'Администратор',
        role: 'SUPER_ADMIN'
    },
    {
        username: 'manager',
        email: 'manager@balloonshop.com',
        password: 'manager123',
        fullName: 'Менеджер',
        role: 'MANAGER'
    },
    {
        username: 'crm',
        email: 'crm@balloonshop.com',
        password: 'crm123',
        fullName: 'CRM Менеджер',
        role: 'CRM_MANAGER'
    },
    {
        username: 'administrator',
        email: 'administrator@balloonshop.com',
        password: 'admin123',
        fullName: 'Администратор Системы',
        role: 'ADMINISTRATOR'
    },
    {
        username: 'testuser',
        email: 'test@balloonshop.com',
        password: 'test123',
        fullName: 'Тестовый Пользователь',
        role: 'MANAGER'
    }
];

async function seedUsers() {
    console.log('🌱 Создание тестовых пользователей...');

    try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const userData of testUsers) {
            try {
                // Проверяем, существует ли пользователь
                const existingUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: userData.username },
                            { email: userData.email }
                        ]
                    }
                });

                if (existingUser) {
                    console.log(`⚠️  Пользователь уже существует: ${userData.username} (${userData.email})`);
                    skippedCount++;
                    continue;
                }

                // Хешируем пароль
                const passwordHash = await bcrypt.hash(userData.password, 12);
                
                // Получаем права доступа для роли
                const permissions = ROLE_PERMISSIONS[userData.role] || [];

                // Создаем пользователя
                const user = await prisma.user.create({
                    data: {
                        username: userData.username,
                        email: userData.email,
                        passwordHash,
                        fullName: userData.fullName,
                        role: userData.role,
                        permissions,
                        isActive: true,
                        twoFactorEnabled: false
                    }
                });

                console.log(`✅ Создан пользователь: ${userData.username} (${userData.email}) - ${userData.role}`);
                console.log(`   Пароль: ${userData.password}`);
                console.log(`   Права доступа: ${permissions.length} разрешений`);
                createdCount++;

            } catch (error) {
                console.error(`❌ Ошибка создания пользователя ${userData.username}:`, error.message);
            }
        }

        console.log('🎉 Создание пользователей завершено!');
        console.log(`📊 Статистика: создано ${createdCount}, пропущено ${skippedCount}`);

        if (createdCount > 0) {
            console.log('\n📝 Учетные данные для входа:');
            testUsers.forEach(user => {
                console.log(`   ${user.username} / ${user.password} (${user.role})`);
            });
        }

    } catch (error) {
        console.error('❌ Ошибка при создании пользователей:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
seedUsers();

