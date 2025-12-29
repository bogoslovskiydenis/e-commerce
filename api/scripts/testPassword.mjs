import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function testPassword() {
    try {
        const username = process.argv[2] || 'admin';
        const password = process.argv[3] || 'admin123';

        console.log(`🔍 Testing password for user: ${username}`);
        console.log(`📝 Password to test: ${password}`);

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username }
                ]
            }
        });

        if (!user) {
            console.error(`❌ User not found: ${username}`);
            process.exit(1);
        }

        console.log(`✅ User found: ${user.username} (${user.email})`);
        console.log(`📊 User role: ${user.role}`);
        console.log(`📊 User isActive: ${user.isActive}`);
        console.log(`📊 Password hash length: ${user.passwordHash?.length || 0}`);

        if (!user.passwordHash) {
            console.error(`❌ User has no password hash!`);
            process.exit(1);
        }

        console.log(`\n🔐 Comparing password...`);
        const isValid = await bcrypt.compare(password, user.passwordHash);
        
        if (isValid) {
            console.log(`✅ Password is VALID!`);
        } else {
            console.log(`❌ Password is INVALID!`);
            
            // Попробуем создать новый хеш и сравнить
            console.log(`\n🔄 Generating new hash for comparison...`);
            const newHash = await bcrypt.hash(password, 12);
            console.log(`New hash: ${newHash.substring(0, 30)}...`);
            console.log(`Old hash: ${user.passwordHash.substring(0, 30)}...`);
            
            const isValidNew = await bcrypt.compare(password, newHash);
            console.log(`New hash comparison: ${isValidNew ? '✅ VALID' : '❌ INVALID'}`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testPassword();
