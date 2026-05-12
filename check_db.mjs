import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`;
console.log('Tables:', JSON.stringify(tables));
const topicCount = await prisma.topic.count().catch(e => 'error: ' + e.message);
const userCount = await prisma.user.count().catch(e => 'error: ' + e.message);
console.log('Topics:', topicCount, '| Users:', userCount);
await prisma.$disconnect();
