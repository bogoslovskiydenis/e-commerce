// updateFullHash.js
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateFullPasswordHash() {
    try {
        console.log('🔐 Проверка и обновление полного хеша пароля...');

        // Сначала проверим текущий хеш
        const currentUser = await prisma.user.findUnique({
            where: { username: 'admin' },
            select: {
                username: true,
                passwordHash: true
            }
        });

        console.log('📊 Текущий пользователь:', currentUser);
        console.log('📊 Длина текущего хеша:', currentUser?.passwordHash?.length);
        console.log('📊 Текущий хеш:', currentUser?.passwordHash);

        // Правильный полный хеш для пароля "admin123"
        const correctHash = '$2b$12$LQv3c1yqBwEHFx8.9rI2HO2yfuZ/5P8bC2Qht9HQ5/9FG5M6y7K7K';
        console.log('✅ Правильный хеш:', correctHash);
        console.log('✅ Длина правильного хеша:', correctHash.length);

        // Обновляем хеш
        const updatedUser = await prisma.user.update({
            where: { username: 'admin' },
            data: { passwordHash: correctHash },
            select: {
                username: true,
                passwordHash: true,
                email: true,
                isActive: true
            }
        });

        console.log('🎉 Обновленный пользователь:', updatedUser);
        console.log('📊 Новая длина хеша:', updatedUser.passwordHash.length);

        // Тестируем пароль
        const isValid = await bcrypt.compare('admin123', correctHash);
        console.log('🔐 Тест пароля admin123:', isValid ? '✅ Работает' : '❌ Не работает');

    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateFullPasswordHash();