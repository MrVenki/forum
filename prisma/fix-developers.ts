/**
 * fix-developers.ts
 *
 * Fixes orphaned developerSlug values in the Topic table:
 *  1. Remaps duplicate slugs to canonical Developer slugs
 *  2. Nulls out fake "various-*" placeholder entries
 *  3. Creates missing Developer records for all remaining orphans
 *
 * Run: npx ts-node --project tsconfig.seed.json prisma/fix-developers.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ── 1. Duplicates → remap to canonical slug already in DB ────────────────────
const REMAP: Record<string, string> = {
  'godrej-properties':    'godrej',
  'aparna-constructions': 'aparna',
  'ats-group':            'ats',
  'ats-infrastructure':   'ats',
  'mahindra-lifespace':   'mahindra',
  'mahindra-lifespaces':  'mahindra',
  'kolte-patil-developers': 'kolte-patil',
  'my-home-constructions':  'my-home',
  'my-home-corporation':    'my-home',
  'arvind-smartspaces':     'arvind',
}

// ── 2. Fake / placeholder slugs → set to null ────────────────────────────────
const NULL_SLUGS = new Set(['various-developers', 'various-builders'])

// ── 3. New Developer records to create ───────────────────────────────────────
// name + slug + optional hq/year. Description is short and factual.
const NEW_DEVELOPERS = [
  // Slugs that came from DEVELOPER_PATTERNS but had no DB entry (developerName was null)
  { slug: 'l-and-t',   name: 'L&T Realty',         hq: 'Mumbai',    foundedYear: 2011, description: 'L&T Realty is the real estate development arm of Larsen & Toubro, one of India\'s largest engineering and construction conglomerates. Known for quality construction and RERA compliance across Mumbai, Pune, and Bengaluru.' },
  { slug: 'pbel',      name: 'PBEL City',           hq: 'Hyderabad', foundedYear: 2007, description: 'PBEL City is a large integrated township project in Hyderabad developed by Nagarjuna Construction Company in partnership with PBEL Property. Known for large-format gated community living near Hyderabad\'s IT corridors.' },
  { slug: 'aliens',    name: 'Aliens Group',        hq: 'Hyderabad', foundedYear: 2002, description: 'Aliens Group is a Hyderabad-based developer known for large-scale residential projects on the city\'s western IT corridor, including the landmark Aliens Space Station township in Tellapur.' },
  { slug: 'pacifica',  name: 'Pacifica Companies',  hq: 'Ahmedabad', foundedYear: 2000, description: 'Pacifica Companies is an Ahmedabad-based developer operating across Gujarat and South India, known for integrated township projects targeting mid-segment buyers.' },
  { slug: 'pride',     name: 'Pride Group',         hq: 'Pune',      foundedYear: 1993, description: 'Pride Group is a Pune-based developer with a track record of over 30 years in mid-to-premium residential development across Pune and Mumbai.' },
  { slug: 'greata',    name: 'Greata Builders',     hq: 'Chennai',   foundedYear: 2005, description: 'Greata Builders is a Chennai-based residential developer focused on mid-segment apartments across the city\'s suburban corridors.' },
  { slug: 'jains',     name: 'Jains Housing',       hq: 'Chennai',   foundedYear: 1988, description: 'Jains Housing & Constructions is a Chennai-based developer with over 35 years of experience delivering mid-segment and premium residential projects across the city.' },
  { slug: 'rohan',     name: 'Rohan Builders',      hq: 'Pune',      foundedYear: 1993, description: 'Rohan Builders is a Pune-based developer known for mid-segment residential projects across Pune and Bengaluru with a focus on sustainable construction practices.' },
  { slug: 'dsr',       name: 'DSR Infrastructure',  hq: 'Bengaluru', foundedYear: 2005, description: 'DSR Infrastructure is a Bengaluru-based developer focused on mid-segment residential projects along the city\'s Outer Ring Road and Whitefield corridors.' },
  { slug: 'concorde',  name: 'Concorde Group',      hq: 'Bengaluru', foundedYear: 1998, description: 'Concorde Group is a Bengaluru-based residential developer with 25+ years of experience delivering mid-to-premium apartments across the city\'s key growth corridors.' },

  // New developers from tier1 seed scripts (had developerName set)
  { slug: 'ratan-developers',       name: 'Ratan Developers',           hq: 'Nagpur',      foundedYear: null, description: 'Ratan Developers is a Nagpur-based residential developer offering mid-segment apartments across the city.' },
  { slug: 'adani-realty',           name: 'Adani Realty',               hq: 'Ahmedabad',   foundedYear: 2010, description: 'Adani Realty is the real estate arm of the Adani Group, one of India\'s largest conglomerates. Operating across Mumbai, Ahmedabad, Pune, and other cities with premium and luxury residential projects.' },
  { slug: 'ashiana-housing',        name: 'Ashiana Housing',            hq: 'New Delhi',   foundedYear: 1979, description: 'Ashiana Housing is a listed developer known for senior living and mid-segment residential projects across Jaipur, Bhiwadi, Halol, and other tier-2 markets.' },
  { slug: 'vatika-group',           name: 'Vatika Group',               hq: 'Gurugram',    foundedYear: 1986, description: 'Vatika Group is a Gurugram-based developer with a diverse portfolio of residential, commercial, and hospitality assets across Delhi NCR.' },
  { slug: 'ansal-api',              name: 'Ansal API',                  hq: 'New Delhi',   foundedYear: 1967, description: 'Ansal API is one of India\'s oldest listed real estate companies with township projects across Lucknow, Gurgaon, and other North Indian cities.' },
  { slug: 'jaypee-group',           name: 'Jaypee Group',               hq: 'Noida',       foundedYear: 1979, description: 'Jaypee Group is a large conglomerate with real estate interests primarily in Noida and Greater Noida through large-format integrated township projects.' },
  { slug: 'parsvnath-developers',   name: 'Parsvnath Developers',       hq: 'New Delhi',   foundedYear: 1990, description: 'Parsvnath Developers is a listed real estate company with a diverse portfolio across Delhi NCR, Lucknow, and other North Indian markets.' },
  { slug: 'gaursons-india',         name: 'Gaursons India',             hq: 'Noida',       foundedYear: 1995, description: 'Gaursons India is a prominent Noida-based developer known for large integrated township projects in Greater Noida West and Noida Extension.' },
  { slug: 'prateek-group',          name: 'Prateek Group',              hq: 'Noida',       foundedYear: 1999, description: 'Prateek Group is a Noida-based developer focused on mid-to-premium residential projects in Delhi NCR\'s eastern and central corridors.' },
  { slug: 'supertech-limited',      name: 'Supertech Limited',          hq: 'Noida',       foundedYear: 1988, description: 'Supertech Limited is a Noida-based developer with an extensive portfolio of residential projects across Delhi NCR and other North Indian cities.' },
  { slug: 'mahagun-group',          name: 'Mahagun Group',              hq: 'Noida',       foundedYear: 1993, description: 'Mahagun Group is a Noida-based developer known for mid-to-premium residential projects including the Mahagun Moderne and Mywoods series in Greater Noida West.' },
  { slug: 'eldeco-group',           name: 'Eldeco Group',               hq: 'Lucknow',     foundedYear: 1975, description: 'Eldeco Group is one of North India\'s oldest residential developers with a 50-year track record across Lucknow, Noida, and other UP markets.' },
  { slug: 'shivalik-group',         name: 'Shivalik Group',             hq: 'Noida',       foundedYear: 1985, description: 'Shivalik Group is a Delhi NCR-based developer with residential and commercial projects across Noida, Greater Noida, and Ghaziabad.' },
  { slug: 'omaxe',                  name: 'Omaxe Group',                hq: 'New Delhi',   foundedYear: 1987, description: 'Omaxe Group is a listed developer with a pan-India footprint across Delhi NCR, Lucknow, Chandigarh, and over 25 cities. Known for township and plotted development projects.' },
  { slug: 'omaxe-limited',          name: 'Omaxe Group',                hq: 'New Delhi',   foundedYear: 1987, description: 'Omaxe Group is a listed developer with a pan-India footprint across Delhi NCR, Lucknow, Chandigarh, and over 25 cities.' },
  { slug: 'gaur-group',             name: 'Gaur Group',                 hq: 'Noida',       foundedYear: 1995, description: 'Gaur Group (Gaursons India) is a Noida-based developer with large integrated residential townships in Greater Noida West and Noida Extension.' },
  { slug: 'shalimar-corp',          name: 'Shalimar Corp',              hq: 'Lucknow',     foundedYear: 1989, description: 'Shalimar Corp is a Lucknow-based developer focused on mid-segment residential projects across the city\'s prime and emerging corridors.' },
  { slug: 'purvanchal-projects',    name: 'Purvanchal Projects',        hq: 'Lucknow',     foundedYear: 1987, description: 'Purvanchal Projects is one of Lucknow\'s most established residential developers with projects across the city\'s prime localities and emerging corridors.' },
  { slug: 'gillco-developers',      name: 'Gillco Developers',          hq: 'Mohali',      foundedYear: 2003, description: 'Gillco Developers is a Mohali-based developer operating across Punjab with integrated township projects in Mohali, Ludhiana, and Chandigarh Tricity.' },
  { slug: 'omaxe-group',            name: 'Omaxe Group',                hq: 'New Delhi',   foundedYear: 1987, description: 'Omaxe Group is a listed developer with a pan-India presence across Delhi NCR and tier-2 cities.' },
  { slug: 'gera-developments',      name: 'Gera Developments',          hq: 'Pune',        foundedYear: 1971, description: 'Gera Developments is a Pune-based developer with over 50 years of experience in residential and commercial real estate across Pune and Goa.' },
  { slug: 'puranik-builders',       name: 'Puranik Builders',           hq: 'Thane',       foundedYear: 1970, description: 'Puranik Builders is a Thane-based developer with a 50-year track record in the Mumbai Metropolitan Region, known for mid-segment residential projects.' },
  { slug: 'paranjape-schemes',      name: 'Paranjape Schemes',          hq: 'Pune',        foundedYear: 1987, description: 'Paranjape Schemes is a Pune-based developer with 35+ years of residential real estate experience across Pune and Goa.' },
  { slug: 'db-realty',              name: 'DB Realty',                  hq: 'Mumbai',      foundedYear: 2007, description: 'DB Realty is a Mumbai-based listed developer focused on premium and mid-segment residential projects across the Mumbai Metropolitan Region.' },
  { slug: 'ramky-group',            name: 'Ramky Group',                hq: 'Hyderabad',   foundedYear: 1994, description: 'Ramky Group is a Hyderabad-based conglomerate with real estate, infrastructure, and environmental services operations across South India.' },
  { slug: 'janapriya-engineers',    name: 'Janapriya Engineers',        hq: 'Hyderabad',   foundedYear: 1986, description: 'Janapriya Engineers Syndicate is a Hyderabad-based developer known for affordable residential projects serving the city\'s growing middle-class population.' },
  { slug: 'marvel-realtors',        name: 'Marvel Realtors',            hq: 'Pune',        foundedYear: 2001, description: 'Marvel Realtors is a Pune-based developer known for premium residential projects across Kharadi, Viman Nagar, and other IT hub corridors.' },
  { slug: 'rohan-builders',         name: 'Rohan Builders',             hq: 'Pune',        foundedYear: 1993, description: 'Rohan Builders is a Pune-based developer known for quality mid-segment residential projects across Pune and Bengaluru with a focus on sustainable practices.' },
  { slug: 'aakar-developers',       name: 'Aakar Developers',           hq: 'Ahmedabad',   foundedYear: 2003, description: 'Aakar Developers is an Ahmedabad-based residential developer focused on mid-to-premium apartments across the city\'s key growth corridors.' },
  { slug: 'ds-max-properties',      name: 'DS-MAX Properties',          hq: 'Bengaluru',   foundedYear: 2003, description: 'DS-MAX Properties is a Bengaluru-based developer focused on affordable and mid-segment housing projects across the city\'s suburban corridors.' },
  { slug: 'sangath-group',          name: 'Sangath Group',              hq: 'Ahmedabad',   foundedYear: 1999, description: 'Sangath Group is an Ahmedabad-based developer with residential and commercial projects across Gujarat\'s major cities.' },
  { slug: 'goyal-group',            name: 'Goyal Group',                hq: 'Ahmedabad',   foundedYear: 1995, description: 'Goyal Group is a Surat-based developer with residential projects across Gujarat including Surat and Ahmedabad.' },
  { slug: 'nilamber-builders',      name: 'Nilamber Builders',          hq: 'Vadodara',    foundedYear: 1990, description: 'Nilamber Builders is a Vadodara-based developer known for affordable and mid-segment residential projects across Gujarat.' },
  { slug: 'parmeshwar-group',       name: 'Parmeshwar Group',           hq: 'Surat',       foundedYear: 2000, description: 'Parmeshwar Group is a Surat-based developer offering mid-segment residential projects across Gujarat.' },
  { slug: 'madhura-infra',          name: 'Madhura Infra',              hq: 'Visakhapatnam', foundedYear: 2005, description: 'Madhura Infra is a Visakhapatnam-based developer known for mid-segment residential projects across the city\'s growing corridors.' },
  { slug: 'gayatri-infrastructure', name: 'Gayatri Infrastructure',     hq: 'Visakhapatnam', foundedYear: 2000, description: 'Gayatri Infrastructure is a Visakhapatnam-based developer with residential projects across the city\'s prime and suburban areas.' },
  { slug: 'kk-constructions',       name: 'KK Constructions',           hq: 'Visakhapatnam', foundedYear: 2003, description: 'KK Constructions is a Visakhapatnam-based residential developer with mid-segment apartments across the city.' },
  { slug: 'amara-builders',         name: 'Amara Builders',             hq: 'Visakhapatnam', foundedYear: 2008, description: 'Amara Builders is a Visakhapatnam-based developer focused on quality mid-segment residential projects in the city.' },
  { slug: 'avinashi-developers',    name: 'Avinashi Developers',        hq: 'Chennai',     foundedYear: 2005, description: 'Avinashi Developers is a Chennai-based residential developer focused on mid-segment apartments across the city.' },
  { slug: 'platinum-infratech',     name: 'Platinum Infratech',         hq: 'Noida',       foundedYear: 2008, description: 'Platinum Infratech is a Noida-based developer with mid-to-premium residential projects across Delhi NCR.' },
  { slug: 'kumar-properties',       name: 'Kumar Properties',           hq: 'Pune',        foundedYear: 1986, description: 'Kumar Properties is a Pune-based developer with over 35 years of residential real estate experience across Pune\'s key localities.' },
  { slug: 'ganga-estates',          name: 'Ganga Estates',              hq: 'Nashik',      foundedYear: 2005, description: 'Ganga Estates is a Nashik-based developer offering mid-segment residential projects across the city.' },
  { slug: 'unique-builders-nagpur', name: 'Unique Builders',            hq: 'Nagpur',      foundedYear: 2003, description: 'Unique Builders is a Nagpur-based residential developer with mid-segment apartments across the city.' },
  { slug: 'trimurti-constructions', name: 'Trimurti Constructions',     hq: 'Nashik',      foundedYear: 2002, description: 'Trimurti Constructions is a Nashik-based residential developer operating in the city\'s prime residential localities.' },
  { slug: 'nandanvan-realtors',     name: 'Nandanvan Realtors',         hq: 'Nagpur',      foundedYear: 2005, description: 'Nandanvan Realtors is a Nagpur-based developer offering mid-segment residential projects across the city.' },
  { slug: 'riviera-real-estate',    name: 'Riviera Real Estate',        hq: 'Nagpur',      foundedYear: 2004, description: 'Riviera Real Estate is a Nagpur-based residential developer with projects across the city\'s key localities.' },
  { slug: 'shri-ram-builders',      name: 'Shri Ram Builders',          hq: 'Nagpur',      foundedYear: 2000, description: 'Shri Ram Builders is a Nagpur-based residential developer focused on mid-segment housing across the city.' },
  { slug: 'malwa-developers',       name: 'Malwa Developers',           hq: 'Indore',      foundedYear: 2005, description: 'Malwa Developers is an Indore-based developer offering mid-segment residential projects across Madhya Pradesh\'s commercial capital.' },
  { slug: 'landmark-realtors',      name: 'Landmark Realtors',          hq: 'Indore',      foundedYear: 2007, description: 'Landmark Realtors is an Indore-based developer with mid-to-premium residential projects in key areas of the city.' },
  { slug: 'shivom-developers',      name: 'Shivom Developers',          hq: 'Bhopal',      foundedYear: 2003, description: 'Shivom Developers is a Bhopal-based residential developer focused on affordable and mid-segment housing projects.' },
  { slug: 'tulsi-builders-bhopal',  name: 'Tulsi Builders',             hq: 'Bhopal',      foundedYear: 2000, description: 'Tulsi Builders is a Bhopal-based developer offering mid-segment residential apartments across the city.' },
  { slug: 'narmada-construction',   name: 'Narmada Construction',       hq: 'Bhopal',      foundedYear: 2004, description: 'Narmada Construction is a Bhopal-based developer with residential projects across Madhya Pradesh\'s capital city.' },
  { slug: 'sarthak-builders',       name: 'Sarthak Builders',           hq: 'Bhopal',      foundedYear: 2006, description: 'Sarthak Builders is a Bhopal-based developer offering affordable and mid-segment residential projects.' },
  { slug: 'ruchi-realty',           name: 'Ruchi Realty',               hq: 'Bhopal',      foundedYear: 2005, description: 'Ruchi Realty is a Bhopal-based developer with residential projects across Madhya Pradesh\'s capital city.' },
  { slug: 'lunkad-realtors',        name: 'Lunkad Realtors',            hq: 'Pune',        foundedYear: 2000, description: 'Lunkad Realtors is a Pune-based developer focused on premium residential projects in the city\'s key localities.' },
  { slug: 'agrawal-builders-indore',name: 'Agrawal Builders',           hq: 'Indore',      foundedYear: 2002, description: 'Agrawal Builders is an Indore-based developer offering mid-segment residential projects across the city.' },
  { slug: 'green-valley-builders',  name: 'Green Valley Builders',      hq: 'Patna',       foundedYear: 2006, description: 'Green Valley Builders is a Patna-based developer offering mid-segment residential projects across Bihar\'s capital city.' },
  { slug: 'green-park-developers',  name: 'Green Park Developers',      hq: 'Patna',       foundedYear: 2005, description: 'Green Park Developers is a Patna-based residential developer with projects across the city\'s growing corridors.' },
  { slug: 'dps-developers',         name: 'DPS Developers',             hq: 'Patna',       foundedYear: 2007, description: 'DPS Developers is a Patna-based developer offering mid-segment apartments across Bihar\'s capital.' },
  { slug: 'krishna-builders-agra',  name: 'Krishna Builders',           hq: 'Agra',        foundedYear: 2004, description: 'Krishna Builders is an Agra-based residential developer focused on mid-segment housing in the city.' },
  { slug: 'sunny-real-estates',     name: 'Sunny Real Estates',         hq: 'Agra',        foundedYear: 2006, description: 'Sunny Real Estates is an Agra-based developer offering residential projects across the city.' },
  { slug: 'amit-enterprises',       name: 'Amit Enterprises',           hq: 'Nashik',      foundedYear: 2001, description: 'Amit Enterprises is a Nashik-based developer with mid-segment residential projects in the city.' },
  { slug: 'gajraj-constructions',   name: 'Gajraj Constructions',       hq: 'Nashik',      foundedYear: 2005, description: 'Gajraj Constructions is a Nashik-based developer offering mid-segment residential apartments.' },
  { slug: 'ksp-group',              name: 'KSP Group',                  hq: 'Ludhiana',    foundedYear: 2003, description: 'KSP Group is a Ludhiana-based developer offering mid-segment residential projects across Punjab.' },
  { slug: 'vatika-group',           name: 'Vatika Group',               hq: 'Gurugram',    foundedYear: 1986, description: 'Vatika Group is a Gurugram-based developer with a diverse portfolio of residential, commercial, and hospitality assets across Delhi NCR.' },
  { slug: 'platinum-infratech',     name: 'Platinum Infratech',         hq: 'Noida',       foundedYear: 2008, description: 'Platinum Infratech is a Noida-based developer with mid-to-premium residential projects in Delhi NCR.' },
]

async function main() {
  console.log('=== Fix Developer Records ===\n')

  // ── Step 1: Null out fake placeholder slugs ──────────────────────────────
  console.log('Step 1: Nulling out placeholder developerSlugs...')
  for (const slug of NULL_SLUGS) {
    const r = await prisma.topic.updateMany({
      where: { developerSlug: slug },
      data: { developerSlug: null, developerName: null },
    })
    if (r.count > 0) console.log(`  Nulled ${r.count} topics with slug "${slug}"`)
  }

  // ── Step 2: Remap duplicates to canonical slugs ───────────────────────────
  console.log('\nStep 2: Remapping duplicate slugs to canonical slugs...')
  for (const [from, to] of Object.entries(REMAP)) {
    // Get canonical name from DB
    const canonical = await prisma.developer.findUnique({ where: { slug: to }, select: { name: true } })
    if (!canonical) { console.log(`  WARN: canonical slug "${to}" not found in DB, skipping remap of "${from}"`); continue }
    const r = await prisma.topic.updateMany({
      where: { developerSlug: from },
      data: { developerSlug: to, developerName: canonical.name },
    })
    if (r.count > 0) console.log(`  Remapped ${r.count} topics: "${from}" → "${to}" (${canonical.name})`)
  }

  // ── Step 3: Create missing Developer records ──────────────────────────────
  console.log('\nStep 3: Creating missing Developer records...')
  const seen = new Set<string>()
  for (const dev of NEW_DEVELOPERS) {
    if (seen.has(dev.slug)) continue
    seen.add(dev.slug)
    try {
      await prisma.developer.upsert({
        where: { slug: dev.slug },
        update: {},
        create: {
          slug: dev.slug,
          name: dev.name,
          hq: dev.hq ?? null,
          foundedYear: dev.foundedYear ?? null,
          description: dev.description,
        },
      })
      // Also sync developerName on topics to match canonical DB name
      await prisma.topic.updateMany({
        where: { developerSlug: dev.slug },
        data: { developerName: dev.name },
      })
      console.log(`  ✓ ${dev.name} (${dev.slug})`)
    } catch (e: unknown) {
      console.log(`  ✗ Failed: ${dev.slug} — ${(e as Error).message}`)
    }
  }

  // ── Step 4: Report any remaining orphans ─────────────────────────────────
  console.log('\nStep 4: Checking for remaining orphans...')
  const allTopics = await prisma.topic.findMany({
    where: { developerSlug: { not: null } },
    select: { developerSlug: true, developerName: true },
    distinct: ['developerSlug'],
  })
  const allDevs = await prisma.developer.findMany({ select: { slug: true } })
  const devSlugs = new Set(allDevs.map(d => d.slug))
  const remaining = allTopics.filter(t => !devSlugs.has(t.developerSlug!))
  if (remaining.length === 0) {
    console.log('  ✅ No orphaned slugs remaining!')
  } else {
    console.log(`  ⚠ ${remaining.length} slugs still orphaned:`)
    remaining.forEach(o => console.log(`    - ${o.developerSlug} | ${o.developerName}`))
  }

  console.log('\nDone.')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
