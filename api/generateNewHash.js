// generateNewHash.js
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateAndUpdateHash() {
    try {
        const password = 'admin123';
        console.log('🔐 Создаем новый хеш для пароля:', password);

        // Генерируем новый хеш
        const saltRounds = 12;
        const newHash = await bcrypt.hash(password, saltRounds);

        console.log('🔑 Новый хеш:', newHash);
        console.log('📊 Длина нового хеша:', newHash.length);

        // Тестируем новый хеш
        const testResult = await bcrypt.compare(password, newHash);
        console.log('✅ Тест нового хеша:', testResult ? '✅ Работает' : '❌ Не работает');

        if (testResult) {
            // Обновляем в базе данных
            const updatedUser = await prisma.user.update({
                where: { username: 'admin' },
                data: { passwordHash: newHash },
                select: {
                    username: true,
                    email: true,
                    isActive: true
                }
            });

            console.log('🎉 Пароль обновлен для пользователя:', updatedUser);

            // Финальный тест
            const finalTest = await bcrypt.compare(password, newHash);
            console.log('🔐 Финальный тест пароля:', finalTest ? '✅ Успех' : '❌ Ошибка');
        }

    } catch (error) {
        console.error('❌ Ошибка:', error);
    } finally {
        await prisma.$disconnect();
    }
}

generateAndUpdateHash();