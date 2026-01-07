import { PrismaClient } from '@prisma/client';

// Prisma автоматически загружает переменные окружения из .env
const prisma = new PrismaClient();

async function addModeratorNoteColumn() {
  try {
    console.log('Добавление колонки moderator_note в таблицу reviews...');
    
    // Выполняем SQL запрос напрямую
    await prisma.$executeRawUnsafe(`
      ALTER TABLE reviews 
      ADD COLUMN IF NOT EXISTS moderator_note TEXT;
    `);
    
    console.log('✅ Колонка moderator_note успешно добавлена!');
  } catch (error) {
    console.error('❌ Ошибка при добавлении колонки:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addModeratorNoteColumn();

