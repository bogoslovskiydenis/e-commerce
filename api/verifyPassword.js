import bcrypt from 'bcrypt';

async function testPasswordHash() {
    const password = 'admin123';
    const storedHash = '$2b$12$LQv3c1yqBwEHFx8.9rI2HO2yfuZ/5P8bC2Qht9HQ5/9FG5M6y7K7K';
    const currentDbHash = '$2b$12$LQv3c1yqBwEHFx8.9rI2HO2'; // Из вашей базы данных

    console.log('🔐 Тестируем пароль:', password);
    console.log('📊 Хеш из базы данных (начало):', currentDbHash);
    console.log('📊 Правильный хеш (полный):', storedHash);

    // Тестируем известный правильный хеш
    const test1 = await bcrypt.compare(password, storedHash);
    console.log('✅ Тест с правильным хешем:', test1);

    // Генерируем новый хеш
    const newHash = await bcrypt.hash(password, 12);
    console.log('🔑 Новый сгенерированный хеш:', newHash);

    const test2 = await bcrypt.compare(password, newHash);
    console.log('✅ Тест с новым хешем:', test2);

    // Тестируем другие возможные пароли
    const possiblePasswords = ['admin', 'password', '123456', 'admin1234'];

    for (const testPassword of possiblePasswords) {
        const result = await bcrypt.compare(testPassword, storedHash);
        console.log(`🔍 Тест пароля "${testPassword}":`, result);
    }
}

testPasswordHash().catch(console.error);