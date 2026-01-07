// scripts/updateUserPasswords.mjs
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const testUsers = [
    {
        username: 'admin',
        password: 'admin123'
    },
    {
        username: 'manager',
        password: 'manager123'
    },
    {
        username: 'crm',
        password: 'crm123'
    },
    {
        username: 'administrator',
        password: 'admin123'
    },
    {
        username: 'testuser',
        password: 'test123'
    }
];

async function updatePasswords() {
    console.log('🔐 Обновление паролей пользователей...');

    try {
        let updatedCount = 0;
        let notFoundCount = 0;

        for (const userData of testUsers) {
            try {
                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: userData.username },
                            { email: userData.username }
                        ]
                    }
                });

                if (!user) {
                    console.log(`⚠️  Пользователь не найден: ${userData.username}`);
                    notFoundCount++;
                    continue;
                }

                // Хешируем пароль заново
                const passwordHash = await bcrypt.hash(userData.password, 12);

                // Обновляем пароль
                await prisma.user.update({
                    where: { id: user.id },
                    data: { passwordHash }
                });

                console.log(`✅ Обновлен пароль для пользователя: ${userData.username} (${userData.email})`);
                console.log(`   Новый пароль: ${userData.password}`);
                updatedCount++;

            } catch (error) {
                console.error(`❌ Ошибка обновления пароля для ${userData.username}:`, error.message);
            }
        }

        console.log('\n🎉 Обновление паролей завершено!');
        console.log(`📊 Статистика: обновлено ${updatedCount}, не найдено ${notFoundCount}`);

        if (updatedCount > 0) {
            console.log('\n📝 Обновленные учетные данные:');
            testUsers.forEach(user => {
                console.log(`   ${user.username} / ${user.password}`);
            });
        }

    } catch (error) {
        console.error('❌ Ошибка при обновлении паролей:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Запускаем скрипт
updatePasswords();



