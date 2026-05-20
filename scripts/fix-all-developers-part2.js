/**
 * fix-all-developers-part2.js
 *
 * Continuation from fix-all-developers.js.
 * Section 1 (31 deletions) and 3 city-fixes already ran.
 * This script handles the remaining city-reassignments and all address/type/price fixes.
 *
 * Strategy for city changes: use findFirst → update on the individual record,
 * appending a city suffix to slug to avoid (cityId, slug) unique constraint violations.
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('=== Developer Fix Part 2 (city changes + address/type/price) ===\n')

  const cityRecords = await prisma.city.findMany({ select: { id: true, slug: true, name: true } })
  const city = Object.fromEntries(cityRecords.map(c => [c.slug, c.id]))
  console.log(`Loaded ${cityRecords.length} cities\n`)

  let totalFixed = 0

  /**
   * Move a topic to a new city. Fetches the record first, then updates with a
   * slug that appends the short city code to avoid unique-constraint conflicts.
   */
  async function moveCity(findWhere, newCitySlug, extraData, label) {
    const t = await prisma.topic.findFirst({ where: findWhere, select: { id: true, slug: true } })
    if (!t) {
      console.log(`  ⚠️  ${label}: NOT FOUND — skipping`)
      return
    }
    // Check if that slug already exists in the target city
    const shortCode = {
      bengaluru: 'blr', pune: 'pune', mumbai: 'mum', delhi: 'del',
      ghaziabad: 'ghz', hyderabad: 'hyd', chennai: 'che', kolkata: 'kol',
    }[newCitySlug] || newCitySlug.slice(0, 3)
    const newSlug = `${t.slug}-${shortCode}`
    await prisma.topic.update({
      where: { id: t.id },
      data: { cityId: city[newCitySlug], slug: newSlug, ...extraData },
    })
    totalFixed++
    console.log(`  ✓  ${label}: moved → ${newCitySlug}, slug: ${newSlug}`)
  }

  async function fix(where, data, label) {
    const r = await prisma.topic.updateMany({ where, data })
    totalFixed += r.count
    console.log(`  ✓  ${label}: updated ${r.count}`)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2 (continued) — Remaining wrong-city fixes
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Section 2 (continued): Remaining City Fixes ─────────────────────\n')

  // Godrej Splendour: Chennai → Bengaluru (Whitefield)
  await moveCity(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Splendour', mode: 'insensitive' }, cityId: city['chennai'] },
    'bengaluru',
    { address: 'Whitefield, Bengaluru 560066' },
    'Godrej Splendour: Chennai → Bengaluru (Whitefield)'
  )

  // Godrej United: Hyderabad → Bengaluru
  await moveCity(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'United', mode: 'insensitive' }, cityId: city['hyderabad'] },
    'bengaluru',
    { address: 'Shivajinagar, Bengaluru 560001' },
    'Godrej United: Hyderabad → Bengaluru (Shivajinagar)'
  )

  // Godrej Woods: Lucknow → Ghaziabad (Noida)
  await moveCity(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Woods', mode: 'insensitive' }, cityId: city['lucknow'] },
    'ghaziabad',
    { address: 'Sector 43, Noida, Gautam Buddha Nagar 201303' },
    'Godrej Woods: Lucknow → Ghaziabad/Noida'
  )

  // Sobha Aranya: Bengaluru → Delhi (Gurugram)
  await moveCity(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Aranya', mode: 'insensitive' } },
    'delhi',
    { address: 'Sector 80, Gurugram, Haryana 122004' },
    'Sobha Aranya: Bengaluru → Delhi/NCR (Gurugram, Sector 80)'
  )

  // Birla Arnaa: → Bengaluru (Devanahalli)
  await moveCity(
    { developerSlug: { contains: 'birla' }, title: { contains: 'Arnaa', mode: 'insensitive' } },
    'bengaluru',
    { address: 'Devanahalli, North Bengaluru 562110' },
    'Birla Arnaa: → Bengaluru (Devanahalli)'
  )

  // Mahindra Antheia: Indore → Pune (Ravet)
  await moveCity(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Antheia', mode: 'insensitive' } },
    'pune',
    { address: 'Ravet, Pimpri-Chinchwad, Pune 412101' },
    'Mahindra Antheia: Indore → Pune (Ravet)'
  )

  // Mahindra Aura: Jaipur → Delhi (Gurugram)
  await moveCity(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Aura', mode: 'insensitive' } },
    'delhi',
    { address: 'Sector 110A, Gurugram, Haryana 122017' },
    'Mahindra Aura: Jaipur → Delhi/NCR (Gurugram)'
  )

  // Mahindra Citadel: Mumbai → Pune (Pimpri)
  await moveCity(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Citadel', mode: 'insensitive' } },
    'pune',
    { address: 'Pimpri, Pune 411018' },
    'Mahindra Citadel: Mumbai → Pune'
  )

  // Tata Amantra: Kolkata → Mumbai (Bhiwandi)
  await moveCity(
    { developerSlug: { contains: 'tata' }, title: { contains: 'Amantra', mode: 'insensitive' } },
    'mumbai',
    { address: 'Bhiwandi, Thane District, Maharashtra 421302' },
    'Tata Amantra: Kolkata → Mumbai (Bhiwandi, Thane)'
  )

  // SP Sensorium: Mumbai → Pune (Hinjewadi)
  await moveCity(
    { developerSlug: { contains: 'shapoorji' }, title: { contains: 'Sensorium', mode: 'insensitive' } },
    'pune',
    { address: 'Hinjewadi Phase 2, Pune 411057' },
    'SP Sensorium: Mumbai (Mira Road) → Pune (Hinjewadi Phase 2)'
  )

  // My Home Apas: Visakhapatnam → Hyderabad (Kokapet)
  await moveCity(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Apas', mode: 'insensitive' } },
    'hyderabad',
    { address: 'Kokapet, Hyderabad 500075' },
    'My Home Apas: Visakhapatnam → Hyderabad (Kokapet)'
  )

  // My Home Vihanga: Visakhapatnam → Hyderabad (Gachibowli)
  await moveCity(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Vihanga', mode: 'insensitive' } },
    'hyderabad',
    { address: 'Gachibowli, Hyderabad 500032' },
    'My Home Vihanga: Visakhapatnam → Hyderabad (Gachibowli)'
  )

  // Aparna Elina: Hyderabad → Bengaluru (Yeshwanthpur)
  await moveCity(
    { developerSlug: { contains: 'aparna' }, title: { contains: 'Elina', mode: 'insensitive' } },
    'bengaluru',
    { address: 'Yeshwanthpur, Bengaluru 560022' },
    'Aparna Elina: Hyderabad → Bengaluru (Yeshwanthpur)'
  )

  // Sattva Serene Life: Hyderabad → Bengaluru (Shettigere); type PLOT
  await moveCity(
    { developerSlug: { contains: 'sattva' }, title: { contains: 'Serene Life', mode: 'insensitive' } },
    'bengaluru',
    { address: 'Shettigere, Devanahalli Taluk, North Bengaluru 562157', propertyType: 'PLOT' },
    'Sattva Serene Life: Hyderabad → Bengaluru; APARTMENT → PLOT'
  )

  // TVS Emerald Jardin: Chennai → Bengaluru (Singasandra)
  await moveCity(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Jardin', mode: 'insensitive' } },
    'bengaluru',
    { address: 'Singasandra, Hosur Road, Bengaluru 560068' },
    'TVS Emerald Jardin: Chennai → Bengaluru (Singasandra)'
  )

  // Supertech Cape Town: Agra → Ghaziabad (Noida, Sector 74)
  await moveCity(
    { developerSlug: { contains: 'supertech' }, title: { contains: 'Cape Town', mode: 'insensitive' } },
    'ghaziabad',
    { address: 'Sector 74, Noida, Gautam Buddha Nagar 201304' },
    'Supertech Cape Town: Agra → Ghaziabad/Noida'
  )

  console.log(`\nSection 2 done — ${totalFixed} city fixes\n`)
  totalFixed = 0

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — Fix Address / Locality / Type (same city, no slug conflict)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Section 3: Address / Locality / Type / Price Fixes ─────────────\n')

  // ── Godrej ────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Park Retreat', mode: 'insensitive' } },
    { address: 'Sarjapur Road, off Carmelaram, Bengaluru 560035' },
    'Godrej Park Retreat: locality → Sarjapur Road, Bengaluru'
  )
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Sky Terraces', mode: 'insensitive' } },
    { address: 'Chembur, Mumbai 400074' },
    'Godrej Sky Terraces: locality → Chembur, Mumbai'
  )

  // ── Prestige ──────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'prestige' }, title: { contains: 'ELM Park', mode: 'insensitive' } },
    { address: 'Whitefield, Bengaluru 560066', priceMin: 6500000, priceMax: 14000000 },
    'Prestige ELM Park: locality → Whitefield; price corrected (₹65L–₹140L)'
  )
  await fix(
    { developerSlug: { contains: 'prestige' }, title: { contains: 'High Fields', mode: 'insensitive' } },
    { address: 'Gachibowli, Hyderabad 500032' },
    'Prestige High Fields: locality → Gachibowli, Hyderabad'
  )

  // ── Rustomjee ─────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'rustomjee' }, title: { contains: 'Azziano', mode: 'insensitive' } },
    { address: 'Majiwada, Thane West 400601' },
    'Rustomjee Azziano: locality → Majiwada, Thane West'
  )

  // ── ATS ───────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'ats' }, title: { contains: 'Destinaire', mode: 'insensitive' } },
    { address: 'Greater Noida West (Noida Extension), Gautam Buddha Nagar 201306' },
    'ATS Destinaire: locality → Greater Noida West'
  )

  // ── Kolte-Patil ───────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'kolte' }, title: { contains: 'Opula', mode: 'insensitive' } },
    { address: 'Pimple Nilakh, Pimpri-Chinchwad, Pune 411027' },
    'KP 24K Opula: locality → Pimple Nilakh, Pune'
  )

  // ── Salarpuria ────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'salarpuria' }, title: { contains: 'Cadenza', mode: 'insensitive' } },
    { address: 'Kudlu Gate, Hosur Road, Bengaluru 560068' },
    'Salarpuria Cadenza: locality → Kudlu Gate, Hosur Road, Bengaluru'
  )
  await fix(
    { developerSlug: { contains: 'salarpuria' }, title: { contains: 'Misty Charm', mode: 'insensitive' } },
    { address: 'Kanakapura Road, South Bengaluru 560062' },
    'Salarpuria Misty Charm: locality → Kanakapura Road, Bengaluru'
  )

  // ── My Home ───────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Avatar', mode: 'insensitive' } },
    { address: 'Puppalaguda, Financial District, Hyderabad 500089' },
    'My Home Avatar: locality → Puppalaguda, Financial District, Hyderabad'
  )
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Bhooja', mode: 'insensitive' } },
    { address: 'HITEC City, Hyderabad 500081', propertyType: 'APARTMENT' },
    'My Home Bhooja: locality → HITEC City; VILLA → APARTMENT'
  )

  // ── Assetz ────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'assetz' }, title: { contains: '63 Degree East', mode: 'insensitive' } },
    { address: 'Kodathi, Sarjapur Road, Bengaluru 560035' },
    'Assetz 63 Degree East: locality → Kodathi, Sarjapur Road, Bengaluru'
  )
  await fix(
    { developerSlug: { contains: 'assetz' }, title: { contains: 'Soho', mode: 'insensitive' } },
    { address: 'Jakkur, near Hebbal, North Bengaluru 560064' },
    'Assetz Soho & Sky: locality → Jakkur, Hebbal, Bengaluru'
  )

  // ── Merlin ────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'merlin' }, title: { contains: 'Serenia', mode: 'insensitive' } },
    { address: 'BT Road, Bonhooghly, North Kolkata 700058' },
    'Merlin Serenia: locality → BT Road, North Kolkata'
  )

  // ── VGN ───────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'vgn' }, title: { contains: 'Fairmont', mode: 'insensitive' } },
    { address: 'Thiru Vi Ka Industrial Estate, Guindy, Chennai 600032', priceMin: 11400000, priceMax: 38000000 },
    'VGN Fairmont: locality → Guindy; price corrected (₹114L–₹380L)'
  )
  await fix(
    { developerSlug: { contains: 'vgn' }, title: { contains: 'Stafford', mode: 'insensitive' } },
    { address: 'Thirumullaivoyal, Ambattur, Chennai 600071', priceMin: 5600000, priceMax: 8000000 },
    'VGN Stafford: locality → Ambattur/Thirumullaivoyal; price corrected (₹56L–₹80L)'
  )

  // ── TVS Emerald ───────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Aaranya', mode: 'insensitive' } },
    { address: 'Medavakkam/Vengaivasal, Chennai 600100', propertyType: 'VILLA' },
    'TVS Emerald Aaranya: locality → Medavakkam; APARTMENT → VILLA'
  )
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Hamlet', mode: 'insensitive' } },
    { address: 'Karapakkam, OMR, Chennai 600097', propertyType: 'PLOT', priceMin: 22200000, priceMax: 35000000 },
    'TVS Emerald Hamlet: locality → Karapakkam OMR; APARTMENT → PLOT; price corrected'
  )
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Verde', mode: 'insensitive' }, city: { slug: 'chennai' } },
    { address: 'Padur, OMR Phase 2, Chennai 603103' },
    'TVS Emerald Verde: locality → Padur, OMR Phase 2'
  )
  // TVS Emerald Isle of Trees (Jakkur, Bengaluru) — price understated
  await fix(
    { developerSlug: { contains: 'tvs' }, city: { slug: 'bengaluru' } },
    { priceMin: 19000000, priceMax: 35000000 },
    'TVS Emerald Isle of Trees (Bengaluru): price corrected (₹190L–₹350L)'
  )

  // ── Shriram ───────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'shriram' }, title: { contains: 'Park 63', mode: 'insensitive' } },
    { address: 'Perungalathur, GST Road, Chennai 600063', priceMin: 6500000, priceMax: 18000000 },
    'Shriram Park 63: locality → Perungalathur; price corrected (₹65L–₹180L)'
  )

  // ── Puravankara ───────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'puravankara' }, title: { contains: 'Atmosphere', mode: 'insensitive' } },
    { address: 'Thanisandra Main Road, near Hebbal, Bengaluru 560077', priceMin: 28500000, priceMax: 45000000 },
    'Purva Atmosphere: locality → Thanisandra; price corrected (₹285L–₹450L)'
  )
  await fix(
    { developerSlug: { contains: 'puravankara' }, title: { contains: 'Zenium', mode: 'insensitive' } },
    { priceMin: 10300000, priceMax: 24300000 },
    'Purva Zenium: price corrected (₹103L–₹243L; was ₹50L–₹85L)'
  )

  // ── Provident ─────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'provident' }, title: { contains: 'Deansgate', mode: 'insensitive' } },
    { address: 'IVC Road, North Bangalore 560064', propertyType: 'VILLA', priceMin: 19000000, priceMax: 25000000 },
    'Provident Deansgate: locality → IVC Road; APARTMENT → VILLA; price corrected (₹190L–₹250L)'
  )

  // ── Olympia ───────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'olympia' }, title: { contains: 'Opaline', mode: 'insensitive' } },
    { address: 'Navalur, OMR, Chennai 600130' },
    'Olympia Opaline: locality → Navalur, OMR (not Perambur)'
  )

  // ── Appaswamy ─────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'appaswamy' }, title: { contains: 'Mapleton', mode: 'insensitive' } },
    { address: 'Pallikaranai, Chennai 600100' },
    'Appaswamy Mapleton: locality → Pallikaranai (not Medavakkam)'
  )

  // ── Sobha ─────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Neopolis', mode: 'insensitive' } },
    { propertyType: 'APARTMENT' },
    'Sobha Neopolis: VILLA → APARTMENT'
  )
  await fix(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Altus', mode: 'insensitive' } },
    { priceMin: 65000000, priceMax: 96400000 },
    'Sobha Altus: price corrected (₹650L–₹964L; was ₹160L–₹280L)'
  )

  // ── Birla Estates ─────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'birla' }, title: { contains: 'Navya', mode: 'insensitive' } },
    { priceMin: 31800000, priceMax: 80200000 },
    'Birla Navya: price corrected (₹318L–₹802L; was ₹140L–₹250L)'
  )

  // ── Rustomjee (price) ─────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'rustomjee' }, title: { contains: 'Elements', mode: 'insensitive' } },
    { priceMin: 35000000, priceMax: 90000000 },
    'Rustomjee Elements: price corrected (₹350L–₹900L)'
  )

  // ── Oberoi ────────────────────────────────────────────────────────────────
  await fix(
    { developerSlug: { contains: 'oberoi' }, title: { contains: 'Elysian', mode: 'insensitive' } },
    { priceMin: 75000000, priceMax: 200000000 },
    'Oberoi Elysian: price corrected (₹750L–₹2000L; ultra-luxury)'
  )
  await fix(
    { developerSlug: { contains: 'oberoi' }, title: { contains: 'Sky City', mode: 'insensitive' } },
    { priceMin: 25000000, priceMax: 55000000 },
    'Oberoi Sky City: price corrected (₹250L–₹550L)'
  )

  console.log(`\nSection 3 done — ${totalFixed} address/type/price fixes\n`)

  // ── Final count ───────────────────────────────────────────────────────────
  const total = await prisma.topic.count({ where: { isPublished: true } })
  console.log('═══════════════════════════════════════════════════════════════')
  console.log(`DONE — ${total} published topics remain in DB`)
  console.log('═══════════════════════════════════════════════════════════════')
}

main()
  .catch(err => { console.error('Fatal error:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
