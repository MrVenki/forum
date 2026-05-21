/**
 * ping-indexnow.js
 *
 * One-time bulk submission of all published topic URLs to IndexNow.
 * IndexNow notifies Google, Bing, Yandex, and other engines simultaneously.
 *
 * Run: node scripts/ping-indexnow.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const INDEXNOW_KEY = 'c3f8a2e1b4d5f6a7b8c9d0e1f2a3b4c5'
const SITE_HOST    = 'indiapropertytalk.com'
const BASE_URL     = `https://${SITE_HOST}`
const BATCH_SIZE   = 10000 // IndexNow max per request

async function main() {
  console.log('=== IndexNow Bulk Ping ===\n')

  // Collect all indexable URLs
  const topics = await prisma.topic.findMany({
    where: { isPublished: true },
    select: { slug: true, city: { select: { slug: true } } },
  })

  const cities = [
    'mumbai','delhi','bengaluru','hyderabad','chennai','kolkata',
    'ahmedabad','pune','surat','jaipur','lucknow','kanpur','nagpur',
    'indore','bhopal','visakhapatnam','patna','vadodara','ghaziabad',
    'ludhiana','agra','nashik',
  ]

  const staticUrls = [
    BASE_URL,
    `${BASE_URL}/cities`,
    `${BASE_URL}/developers`,
    `${BASE_URL}/tools`,
    `${BASE_URL}/tools/emi-calculator`,
    `${BASE_URL}/tools/stamp-duty-calculator`,
    `${BASE_URL}/tools/home-loan-eligibility`,
    `${BASE_URL}/tools/rent-vs-buy`,
    `${BASE_URL}/about`,
    `${BASE_URL}/contact`,
    ...cities.map(c => `${BASE_URL}/${c}`),
  ]

  const topicUrls = topics.map(t => `${BASE_URL}/${t.city.slug}/${t.slug}`)

  const allUrls = [...new Set([...staticUrls, ...topicUrls])]
  console.log(`Total URLs to submit: ${allUrls.length}`)
  console.log(`  Static pages : ${staticUrls.length}`)
  console.log(`  Topic pages  : ${topicUrls.length}\n`)

  // Submit in batches
  const batches = []
  for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
    batches.push(allUrls.slice(i, i + BATCH_SIZE))
  }

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i]
    console.log(`Submitting batch ${i + 1}/${batches.length} (${batch.length} URLs)...`)

    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: batch,
      }),
    })

    if (res.ok || res.status === 202) {
      console.log(`  ✓ Accepted (HTTP ${res.status})`)
    } else {
      const body = await res.text().catch(() => '')
      console.log(`  ✗ Failed (HTTP ${res.status}) ${body}`)
    }
  }

  console.log('\n✅ Done — Google/Bing will now prioritise crawling these URLs.')
  console.log('   Check GSC "Discovered – currently not indexed" count over next 1–2 weeks.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
