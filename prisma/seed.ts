import { PrismaClient } from '@prisma/client'
import { INDIAN_CITIES } from '../src/lib/constants/cities'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding cities...')

  for (const city of INDIAN_CITIES) {
    await prisma.city.upsert({
      where: { slug: city.slug },
      create: {
        name: city.name,
        slug: city.slug,
        state: city.state,
        tier: city.tier,
        isActive: true,
      },
      update: {
        name: city.name,
        state: city.state,
        tier: city.tier,
        isActive: true,
      },
    })
    console.log(`  ✓ ${city.name} (${city.tier})`)
  }

  console.log(`\n✅ Seeded ${INDIAN_CITIES.length} cities successfully!`)
  console.log('\nNext steps:')
  console.log('  1. Configure your .env.local with DATABASE_URL, NEXTAUTH_SECRET, and Cloudinary credentials')
  console.log('  2. Run: npx prisma migrate dev --name init')
  console.log('  3. Run: npm run db:seed')
  console.log('  4. Run: npm run dev')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
