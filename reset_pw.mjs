import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  // Reset the postgres user password - this re-initializes Supavisor tenant config
  await prisma.$executeRawUnsafe(`ALTER USER postgres WITH PASSWORD 'Fourthbottle@142327'`);
  console.log('✅ Password reset successfully - Supavisor will re-initialize');
} catch (e) {
  console.error('Error:', e.message);
} finally {
  await prisma.$disconnect();
}
