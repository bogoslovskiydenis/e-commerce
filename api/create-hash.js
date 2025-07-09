const bcrypt = require('bcrypt');

async function createHash() {
    const password = 'admin123';
    const saltRounds = 12;

    console.log('🔧 Создание хеша для пароля:', password);

    const hash = await bcrypt.hash(password, saltRounds);
    console.log('✅ Сгенерированный хеш:', hash);

    // Проверяем, что хеш работает
    const isValid = await bcrypt.compare(password, hash);
    console.log('🔍 Проверка хеша:', isValid);

    console.log('\n📋 SQL для обновления:');
    console.log(`UPDATE users SET password_hash = '${hash}' WHERE username IN ('admin', 'manager', 'operator');`);
}

createHash().catch(console.error);