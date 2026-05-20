/**
 * seed-bengaluru-villas.js
 *
 * Adds verified Bengaluru VILLA and PLOT topics to the database.
 * All 28 projects cross-verified against developer websites + 99acres/housing.com/magicbricks.
 *
 * Pre-existing in DB (skipped):
 *   Adarsh Welkin Park (VILLA), Brigade Oasis (PLOT),
 *   Prestige Gardenia Estates (PLOT), Provident Deansgate (VILLA),
 *   Sattva Serene Life (PLOT, moved from Hyd)
 *
 * Skipped (UNCERTAIN / pre-launch / no pricing):
 *   Godrej Varanya (RERA pending), Urbanrise Jigani (pre-launch),
 *   Prestige Raintree Park villas (unconfirmed unit count),
 *   Shriram Pristine Estates (RERA unconfirmed)
 *
 * New developer added: Embassy Group
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const USERS = [
  'cmp10jbxq00001by2rzkxxpav', 'cmp10jdqu00011by27aautcxx',
  'cmp10jeu100021by21iqllfij', 'cmp10jg0l00031by2o3gb6ja9',
  'cmp10jh4500041by237mxrwum', 'cmp10ji8r00051by2yhxawf3m',
  'cmp10jj9600061by2juzhryq9', 'cmp10jkep00071by2seezjgvx',
  'cmp10jllh00081by2k1umwbdr', 'cmp10jmse00091by2mmzo2ej8',
  'cmp10jo3g000a1by23kp5rx1x', 'cmp10jpig000b1by24q00toa1',
]
let uIdx = 0
const nextUser = () => USERS[uIdx++ % USERS.length]

async function main() {
  console.log('=== Seed: Bengaluru Villa & Plot Projects ===\n')

  const bengaluru = await prisma.city.findUnique({ where: { slug: 'bengaluru' }, select: { id: true } })
  if (!bengaluru) throw new Error('Bengaluru city not found in DB')
  const BLRU = bengaluru.id

  // ── Ensure Embassy Group developer exists ─────────────────────────────────
  await prisma.developer.upsert({
    where: { slug: 'embassy-group' },
    update: {},
    create: {
      slug: 'embassy-group',
      name: 'Embassy Group',
      hq: 'Bengaluru, Karnataka',
      description: 'Embassy Group is one of South India\'s largest real estate developers, known for premium office parks (Embassy Office Parks REIT), luxury residential projects, and integrated townships across Bengaluru.',
    },
  })
  console.log('✓ Embassy Group developer ensured\n')

  let added = 0, skipped = 0

  async function upsertTopic(data) {
    const existing = await prisma.topic.findFirst({ where: { slug: data.slug } })
    if (existing) { console.log(`  ⏭  Skipping (exists): ${data.slug}`); skipped++; return }
    await prisma.topic.create({ data: { ...data, userId: nextUser(), isPublished: true } })
    console.log(`  ✓  Added: ${data.title.substring(0, 72)}`)
    added++
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SARJAPUR ROAD CORRIDOR
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Sarjapur Road ──────────────────────────────────────────────────\n')

  await upsertTopic({
    slug: 'sobha-crystal-meadows-mullur-sarjapur-road-bengaluru',
    propertyName: 'Sobha Crystal Meadows',
    title: 'Sobha Crystal Meadows Mullur – Victorian G+3 quadruplex villas at ₹10.5–12.9Cr | Sarjapur Rd | Review',
    description: 'Sobha Crystal Meadows at Mullur on Sarjapur Road offers 290 super-luxury Victorian-themed quadruplex/triplex row villas across 26 acres. Each 4 BHK home (4,237–4,815 sq ft) includes a private garden and two car parks; 18 acres of greenery surrounds the community. RERA: PRM/KA/RERA/1251/446/PR/280324/006733 (possession Dec 2028). At ₹10.5–12.9Cr this is among Bangalore\'s priciest row villa launches — is the Victorian-themed design a genuine differentiator or just marketing?',
    cityId: BLRU,
    developerSlug: 'sobha',
    developerName: 'Sobha Limited',
    propertyType: 'VILLA',
    address: 'Mullur, off Sarjapur Road, Bengaluru 560035',
    priceMin: 105000000,
    priceMax: 129000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Sobha Crystal Meadows Mullur Sarjapur Road Review – Victorian Villas ₹10.5Cr+ | IndiaPropertyTalk',
    metaDesc: 'Sobha Crystal Meadows at Mullur — 290 Victorian quadruplex villas, ₹10.5–12.9Cr, 26 acres on Sarjapur Road. Buyer reviews on pricing, design, and investment value vs. alternatives.',
  })

  await upsertTopic({
    slug: 'prestige-aspen-greens-prestige-city-sarjapur-bengaluru',
    propertyName: 'Prestige Aspen Greens',
    title: 'Prestige Aspen Greens @ Prestige City Sarjapur – 149 luxury 4 BHK villas from ₹2.99Cr | Possession review',
    description: 'Prestige Aspen Greens is the villa enclave within the 180-acre Prestige City township at Yamare, off Sarjapur Road — 149 ultra-luxury 4 BHK villas across 20 acres (3,344–3,612 sq ft, ₹2.99Cr–₹4.99Cr). RERA: PRM/KA/RERA/1251/308/PR/211007/004346. Phase 1 handovers are underway (Oct 2024). Owners: how is the build quality, township facilities, and the experience of living next to a massive apartment complex? Is the villa lifestyle maintained?',
    cityId: BLRU,
    developerSlug: 'prestige',
    developerName: 'Prestige Group',
    propertyType: 'VILLA',
    address: 'Yamare Village, off Marathahalli–Sarjapur Road, Bengaluru 560035',
    priceMin: 29900000,
    priceMax: 49900000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Prestige Aspen Greens Sarjapur Review – 4 BHK Villas in Prestige City Township | IndiaPropertyTalk',
    metaDesc: 'Prestige Aspen Greens at Prestige City Sarjapur — 149 villas, ₹2.99–4.99Cr, possession underway. Owner reviews on build quality, township living, and resale potential.',
  })

  await upsertTopic({
    slug: 'prestige-great-acres-plots-prestige-city-sarjapur-bengaluru',
    propertyName: 'Prestige Great Acres',
    title: 'Prestige Great Acres – 808 villa plots within Prestige City Sarjapur | ₹69–82L | Investment review',
    description: 'Prestige Great Acres is the 80-acre plotted development within the Prestige City 180-acre township at Yamare, Sarjapur Road — 808 premium villa plots (1,683–2,000 sq ft; ₹69L–₹82L). RERA: PRM/KA/RERA/1251/308/PR/210824/004289. Plots are ready for registration and buyers get access to all township amenities. With the township filling up, how have plot prices moved since the 2021 launch? Good for self-construction or purely an investment?',
    cityId: BLRU,
    developerSlug: 'prestige',
    developerName: 'Prestige Group',
    propertyType: 'PLOT',
    address: 'Yamare Village, off Marathahalli–Sarjapur Road, Bengaluru 560035',
    priceMin: 6900000,
    priceMax: 8200000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Prestige Great Acres Sarjapur Villa Plots Review – 808 Plots in Prestige City Township | IndiaPropertyTalk',
    metaDesc: 'Prestige Great Acres at Prestige City Sarjapur — 808 villa plots, ₹69–82L, ready for registration. Investment review, price appreciation since 2021, and self-construction tips.',
  })

  await upsertTopic({
    slug: 'mana-daintree-kodathi-sarjapur-road-bengaluru',
    propertyName: 'Mana Daintree',
    title: 'Mana Daintree Kodathi – Rainforest-inspired 3 & 4 BHK courtyard villas from ₹2.60Cr | Sarjapur Rd',
    description: 'Mana Daintree at Kodathi, off Sarjapur Road, is a 10-acre, 110-unit biophilic luxury villa community inspired by Australian rainforests. Each 3 or 4 BHK courtyard villa (2,932–5,000 sq ft, ₹2.60Cr–₹5.22Cr) includes a private garden, French windows, double-height courtyards, rainwater recycling, and solar provisions. RERA registered. Phase 1 near possession. This is one of the few genuinely biophilic villa communities in Bangalore — how does Total Environment compare at similar price points?',
    cityId: BLRU,
    developerSlug: 'mana',
    developerName: 'Mana Projects',
    propertyType: 'VILLA',
    address: 'Kodathi, off Sarjapur Road, Bengaluru 560035',
    priceMin: 26000000,
    priceMax: 52200000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Mana Daintree Kodathi Sarjapur Review – Rainforest Villa Community ₹2.60–5.22Cr | IndiaPropertyTalk',
    metaDesc: 'Mana Daintree at Kodathi Sarjapur Road — 110 biophilic courtyard villas, ₹2.60–5.22Cr, 10 acres. Buyer reviews on sustainable design, build quality, and resale value.',
  })

  await upsertTopic({
    slug: 'assetz-18-and-oak-sarjapur-attibele-road-bengaluru',
    propertyName: 'Assetz 18 & Oak',
    title: 'Assetz 18 & Oak – Golf-front villa plots & 3–5 BHK villas at Clover Greens | Sarjapur | Review',
    description: 'Assetz 18 & Oak at Sevaganapalli abuts the 107-acre Clover Greens 18-hole par-71 golf course on the Sarjapur–Attibele Road. The 39-acre community offers both open plots and finished 3–5 BHK villas (₹3.67Cr–₹9.91Cr). Possession done since 2021; active resale market. One of Bangalore\'s most distinctive luxury enclaves with genuine golf-front positioning. Owners — how does living on a golf course actually translate day-to-day? What are the maintenance charges?',
    cityId: BLRU,
    developerSlug: 'assetz',
    developerName: 'Assetz Property Group',
    propertyType: 'VILLA',
    address: 'Sevaganapalli, off Sarjapur–Attibele Road, Bengaluru 562125',
    priceMin: 36700000,
    priceMax: 99100000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Assetz 18 & Oak Sarjapur Review – Golf-Front Villas & Plots at Clover Greens | IndiaPropertyTalk',
    metaDesc: 'Assetz 18 & Oak at Clover Greens, Sarjapur Attibele Road — golf-front 3–5 BHK villas, ₹3.67–9.91Cr. Long-term owner reviews on golf course living, maintenance, and resale.',
  })

  await upsertTopic({
    slug: 'assetz-melodies-of-life-hosa-road-sarjapur-bengaluru',
    propertyName: 'Assetz Melodies of Life',
    title: 'Assetz Melodies of Life – 505 luxury villa plots off Hosa Road from ₹1.71Cr | Sarjapur belt | 2026',
    description: 'Assetz Melodies of Life off Hosa Road (east Bengaluru) offers 505 villa-sized gated plots across 39 acres — plot sizes 1,500–3,000 sq ft starting ₹1.71Cr. RERA: PRM/KA/RERA/1251/310/AG/170824/000174 (possession Aug 2026). Over 60% open space with fully equipped clubhouse. Assetz\'s established track record at 63 Degree East and Soho & Sky gives confidence. At ₹1.71Cr for a 1,500 sq ft plot off Hosa Road — fair pricing or overpriced?',
    cityId: BLRU,
    developerSlug: 'assetz',
    developerName: 'Assetz Property Group',
    propertyType: 'PLOT',
    address: 'Off Hosa Road, near Sarjapur Road, East Bengaluru 560068',
    priceMin: 17100000,
    priceMax: 30000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Assetz Melodies of Life Hosa Road Review – 505 Luxury Villa Plots | IndiaPropertyTalk',
    metaDesc: 'Assetz Melodies of Life off Hosa Road — 505 villa plots, ₹1.71Cr+, 39 acres, possession Aug 2026. Buyer insights on Hosa Road investment, Assetz track record, and plot value.',
  })

  await upsertTopic({
    slug: 'shriram-chirping-grove-sarjapur-road-carmelaram-bengaluru',
    propertyName: 'Shriram Chirping Grove',
    title: 'Shriram Chirping Grove Carmelaram – 217-unit 3 & 4 BHK row villas from ₹1.53Cr | OC received | Review',
    description: 'Shriram Chirping Grove on Sarjapur Road at Carmelaram is a 12-acre, 217-unit gated row villa community. 3 & 4 BHK, 1,850–2,628 sq ft, ₹1.53Cr–₹2.56Cr. RERA: two phase registrations. Phase 1 OC received and buyers in possession; Phase 2 Dec 2025. One of the more accessible villa price points on the Sarjapur belt. Owners in Phase 1: how has the build quality held up? How is the Carmelaram connectivity to ORR and IT parks?',
    cityId: BLRU,
    developerSlug: 'shriram',
    developerName: 'Shriram Properties',
    propertyType: 'VILLA',
    address: 'Carmelaram, Sarjapur Road, Bengaluru 560035',
    priceMin: 15300000,
    priceMax: 25600000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Shriram Chirping Grove Sarjapur Road Review – 3 & 4 BHK Row Villas OC Received | IndiaPropertyTalk',
    metaDesc: 'Shriram Chirping Grove at Carmelaram Sarjapur Road — 217 row villas, ₹1.53–2.56Cr, OC received Phase 1. Owner reviews on build quality, connectivity, and maintenance.',
  })

  await upsertTopic({
    slug: 'adarsh-garden-estate-plots-gattahalli-sarjapur-road-bengaluru',
    propertyName: 'Adarsh Garden Estate',
    title: 'Adarsh Garden Estate Gattahalli – 374 BDA-approved villa plots near Kodathi | ₹85–295L | Ready',
    description: 'Adarsh Garden Estate at Gattahalli (near Kodathi/Carmelaram, Sarjapur Road) is a 27-acre, 374-plot BDA-approved gated community. Plot sizes 1,200–4,000 sq ft, priced ₹85L–₹2.95Cr. RERA: PRM/KA/RERA/1251/308/PR/110722/005048. Plots ready for registration (possession Dec 2023). Strategically between Carmelaram and Hadosiddapura with good ORR and EC access. How does the resale and self-construction market look here vs. Prestige Great Acres at similar locations?',
    cityId: BLRU,
    developerSlug: 'adarsh',
    developerName: 'Adarsh Developers',
    propertyType: 'PLOT',
    address: 'Gattahalli, near Kodathi, Sarjapur Road, Bengaluru 560035',
    priceMin: 8500000,
    priceMax: 29500000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Adarsh Garden Estate Gattahalli Sarjapur Road Review – 374 BDA-Approved Villa Plots | IndiaPropertyTalk',
    metaDesc: 'Adarsh Garden Estate at Gattahalli near Kodathi — 374 BDA-approved plots, ₹85L–₹2.95Cr, ready for registration. Investment review and comparison with alternatives on Sarjapur Road.',
  })

  await upsertTopic({
    slug: 'purva-tranquility-plots-medihalli-sarjapur-attibele-bengaluru',
    propertyName: 'Purva Tranquility',
    title: 'Purva Tranquility – 800 green-living villa plots off Sarjapur–Attibele Road from ₹69L | Purva Land',
    description: 'Purva Tranquility (Purva Land) at S. Medihalli, just off the Sarjapur–Attibele Road, is a 71-acre, 800-plot nature-themed plotted development. Cottage plots (600 sq ft) to villa plots (2,400 sq ft), starting ₹69L+. Launched early 2024 at ₹6,500/sq ft. Possession targeted Dec 2025. Puravankara\'s plotted arm offers branded trust in a competitive segment. At this scale, does plot infrastructure get completed on time? How is the location for daily commutes?',
    cityId: BLRU,
    developerSlug: 'puravankara',
    developerName: 'Puravankara',
    propertyType: 'PLOT',
    address: 'S. Medihalli, off Sarjapur–Attibele Road, Bengaluru 562125',
    priceMin: 6900000,
    priceMax: 15000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Purva Tranquility Medihalli Sarjapur Plots Review – 800 Villa Plots ₹69L+ | IndiaPropertyTalk',
    metaDesc: 'Purva Tranquility by Purva Land at S. Medihalli — 71 acres, 800 villa plots, ₹69L+ on Sarjapur–Attibele Road. Buyer insights on possession timeline, infrastructure, and Puravankara track record.',
  })

  await upsertTopic({
    slug: 'mana-foliage-gopasandra-sarjapur-road-bengaluru',
    propertyName: 'Mana Foliage',
    title: 'Mana Foliage Gopasandra – 190-unit completed 3 & 4 BHK villas near EC & Sarjapur | Resale review',
    description: 'Mana Foliage at Gopasandra (near Electronic City and Sarjapur Road junction) is a completed 12-acre, 190-villa gated community — 3 & 4 BHK, 1,522–1,935 sq ft. Fully occupied; available only in the resale market (₹66L–₹94L). An affordable completed villa option in the E-City belt. Long-term owners: how does the build quality hold up years after completion? How is property value appreciation and the rental market here?',
    cityId: BLRU,
    developerSlug: 'mana',
    developerName: 'Mana Projects',
    propertyType: 'VILLA',
    address: 'Gopasandra, off Sarjapur Road, near Electronic City, Bengaluru 560099',
    priceMin: 6600000,
    priceMax: 9400000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Mana Foliage Gopasandra Review – Completed 3 & 4 BHK Villas Near Electronic City | IndiaPropertyTalk',
    metaDesc: 'Mana Foliage at Gopasandra near Electronic City — 190 completed villas, ₹66L–₹94L resale. Owner reviews on build quality, appreciation, and rental yield near EC belt.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // WHITEFIELD / ITPL CORRIDOR
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── Whitefield / Budigere ──────────────────────────────────────────\n')

  await upsertTopic({
    slug: 'sobha-galera-budigere-cross-whitefield-bengaluru',
    propertyName: 'Sobha Galera',
    title: 'Sobha Galera Budigere Cross – 40 Spanish 4 BHK row villas from ₹4.73Cr | Boutique | 2026 possession',
    description: 'Sobha Galera at Huskur Road, Budigere Cross (near Whitefield) is an exclusive 4.08-acre enclave of just 40 Spanish-themed 4 BHK row villas — 32 duplexes (3,032 sq ft, ₹4.73Cr) and 8 rarer triplex units (4,340 sq ft, ₹6.77Cr). RERA: PRM/KA/RERA/1251/446/PR/050123/005601 (possession Dec 2026). With only 40 homes, this may be Whitefield\'s most boutique luxury villa community. Is the scarcity premium justified at ₹4.73Cr+ in the Budigere micro-market?',
    cityId: BLRU,
    developerSlug: 'sobha',
    developerName: 'Sobha Limited',
    propertyType: 'VILLA',
    address: 'Huskur Road, Budigere Cross, near Whitefield, Bengaluru 562129',
    priceMin: 47300000,
    priceMax: 67700000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Sobha Galera Budigere Cross Review – 40-Unit Spanish 4 BHK Villas ₹4.73–6.77Cr | IndiaPropertyTalk',
    metaDesc: 'Sobha Galera at Budigere Cross near Whitefield — boutique 40-unit Spanish-themed 4 BHK villas, ₹4.73–6.77Cr, possession Dec 2026. Buyer review on exclusivity, pricing, and location.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // NORTH BANGALORE / DEVANAHALLI CORRIDOR
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── North Bengaluru / Devanahalli / Yelahanka ───────────────────────\n')

  await upsertTopic({
    slug: 'total-environment-after-the-rain-yelahanka-bengaluru',
    propertyName: 'Total Environment After The Rain',
    title: 'Total Environment After The Rain Yelahanka – 219 earth-sheltered villas from ₹5Cr | 55 acres | Review',
    description: 'Total Environment After The Rain at MVIT College Road, Yelahanka is a 55-acre, 219-villa landmark community with Total Environment\'s signature earth-sheltered, climate-responsive architecture. Each 4 BHK villa (3,184–5,120 sq ft, ₹5Cr–₹10Cr) features earth roofing, central courtyards, and passive cooling. Phase 1 & 2A complete and in possession since 2021; Phase 2B nearing completion. Total Environment\'s biophilic approach is unique in India — owners of Phase 1 villas, how has the earth-sheltered design performed in Bangalore\'s climate?',
    cityId: BLRU,
    developerSlug: 'total-environment',
    developerName: 'Total Environment',
    propertyType: 'VILLA',
    address: 'MVIT College Road, Yelahanka, Bengaluru 560064',
    priceMin: 49900000,
    priceMax: 100000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Total Environment After The Rain Yelahanka Review – Earth-Sheltered Villas ₹5–10Cr | IndiaPropertyTalk',
    metaDesc: 'Total Environment After The Rain at Yelahanka — 219 earth-sheltered 4 BHK villas, ₹5–10Cr, 55 acres. Owner reviews on biophilic design, passive cooling, Phase 1 possession quality.',
  })

  await upsertTopic({
    slug: 'brigade-orchards-villas-devanahalli-bengaluru',
    propertyName: 'Brigade Orchards',
    title: 'Brigade Orchards Villas Devanahalli – 4 BHK villas from ₹4.56Cr in 135-acre township | Airport Road',
    description: 'Brigade Orchards at Devanahalli includes a premium 4 BHK villa component (4,900–4,920 sq ft, ₹4.56Cr–₹5.06Cr) within a massive 135-acre self-sustained township near the airport — with a premium mall, hospital, cricket ground, and club. RERA: PRM/KA/RERA/1250/303/PR/220104/004626 (possession Dec 2028; currently 10% complete). Living in an integrated township vs. a standalone gated community — what trade-offs do buyers make? How does the Devanahalli location hold up for IT professionals?',
    cityId: BLRU,
    developerSlug: 'brigade',
    developerName: 'Brigade Group',
    propertyType: 'VILLA',
    address: 'Devanahalli, North Bengaluru 562110',
    priceMin: 45600000,
    priceMax: 50600000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Brigade Orchards Villas Devanahalli Review – 4 BHK Villas in 135-Acre Township | IndiaPropertyTalk',
    metaDesc: 'Brigade Orchards villa component at Devanahalli — 4 BHK, ₹4.56–5.06Cr, 135-acre airport township with mall, hospital, club. Buyer discussion on township living and Devanahalli connectivity.',
  })

  await upsertTopic({
    slug: 'prestige-sanctuary-nandi-hills-road-devanahalli-bengaluru',
    propertyName: 'Prestige Sanctuary',
    title: 'Prestige Sanctuary Devanahalli – 85 ultra-luxury 4 BHK villas near Nandi Hills from ₹6.90Cr | Review',
    description: 'Prestige Sanctuary at Karahalli Post on Nandi Hills Road, Devanahalli is an exclusive 23-acre community of just 85 standalone 4 BHK villas (4,095–6,680 sq ft, ₹6.90Cr–₹11.25Cr). RERA: PRM/KA/RERA/1250/303/PR/101122/005448 (possession Nov 2025–Nov 2026). With fewer than 4 villas per acre, this is one of North Bangalore\'s lowest-density luxury communities. Is the Nandi Hills Road location practical for daily living? How does it compare to Embassy Springs and Prestige Raintree Park at similar price points?',
    cityId: BLRU,
    developerSlug: 'prestige',
    developerName: 'Prestige Group',
    propertyType: 'VILLA',
    address: 'Karahalli Post, Nandi Hills Road, Kundana Hobli, Devanahalli, Bengaluru 562110',
    priceMin: 69000000,
    priceMax: 112500000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Prestige Sanctuary Devanahalli Review – Ultra-Luxury 4 BHK Villas Near Nandi Hills ₹6.90–11.25Cr | IndiaPropertyTalk',
    metaDesc: 'Prestige Sanctuary at Devanahalli near Nandi Hills — 85 villas, ₹6.90–11.25Cr, 23 acres. Buyer discussion on low-density living, Nandi Hills Road practicality, and investment case.',
  })

  await upsertTopic({
    slug: 'godrej-reserve-plots-devanahalli-airport-road-bengaluru',
    propertyName: 'Godrej Reserve',
    title: 'Godrej Reserve Devanahalli – 950-plot gated community near airport from ₹74L | ₹6,100/sqft | Ready',
    description: 'Godrej Reserve at Devanahalli, Airport Road, is a 95.7-acre, 950-plot gated plotted development — 1,200–2,400 sq ft plots at ₹74L–₹120L. RERA: PRM/KA/RERA/1250/303/PR/181122/002158. Launched Feb 2024; plots now ready to move as of late 2025. Godrej\'s branded trust in the airport plotted segment is a strong plus. At ₹6,100/sq ft for a plot in Devanahalli — is this fair value or is the Godrej premium too steep versus Tata Swaram and Adarsh Savana nearby?',
    cityId: BLRU,
    developerSlug: 'godrej',
    developerName: 'Godrej Properties',
    propertyType: 'PLOT',
    address: 'Devanahalli, Airport Road, North Bengaluru 562110',
    priceMin: 7400000,
    priceMax: 12000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Godrej Reserve Devanahalli Review – 950-Plot Gated Community Near Airport ₹74–120L | IndiaPropertyTalk',
    metaDesc: 'Godrej Reserve at Devanahalli Airport Road — 95.7 acres, 950 plots, ₹74–120L, plots ready. Investment review and comparison vs Tata Swaram and Adarsh Savana in the airport corridor.',
  })

  await upsertTopic({
    slug: 'tata-swaram-plots-shettigere-devanahalli-bengaluru',
    propertyName: 'Tata Swaram',
    title: 'Tata Swaram Shettigere Devanahalli – Branded plotted development in 140-acre Tata Carnatica township | ₹84–200L',
    description: 'Tata Swaram at Shettigere, Doddajala, Devanahalli offers RERA-approved villa plots (1,200–2,400 sq ft, ₹84L–₹200L) within Tata\'s flagship 140-acre mega-city development alongside the Tata Carnatica apartment towers. Phase 1 RERA: PRM/KA/RERA/1250/303/PR/250222/004734 (possession Mar 2025); Phase 2: Dec 2025. Rare Tata brand pedigree in the airport plotted segment. Buyers who have received possession — how is the infrastructure quality? Any delays on possession dates?',
    cityId: BLRU,
    developerSlug: 'tata-housing',
    developerName: 'Tata Housing',
    propertyType: 'PLOT',
    address: 'Shettigere, Doddajala, Devanahalli, Bengaluru 562157',
    priceMin: 8400000,
    priceMax: 20000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Tata Swaram Shettigere Devanahalli Review – Villa Plots in 140-Acre Tata Township ₹84–200L | IndiaPropertyTalk',
    metaDesc: 'Tata Swaram at Shettigere Devanahalli — 182 villa plots per phase in Tata\'s 140-acre township, ₹84–200L. Owner reviews on possession quality, infrastructure, and Tata brand premium.',
  })

  await upsertTopic({
    slug: 'embassy-springs-villa-plots-devanahalli-bengaluru',
    propertyName: 'Embassy Springs',
    title: 'Embassy Springs Devanahalli – Premium villa plots from ₹1.94Cr in 288-acre township near KIA | Review',
    description: 'Embassy Springs at Sadahalli Gate (15 mins from Kempegowda International Airport) is part of Embassy Group\'s 288-acre integrated township. Villa plots range from 2,100 to 13,000 sq ft at ₹9,000/sq ft base (₹1.94Cr+). Plot registrations underway; a dedicated row villa and villa component is planned. Embassy\'s reputation from commercial real estate (REIT-quality assets) brings significant brand trust. At ₹1.94Cr for a 2,100 sq ft plot near KIA — is this the right price for the Devanahalli corridor?',
    cityId: BLRU,
    developerSlug: 'embassy-group',
    developerName: 'Embassy Group',
    propertyType: 'PLOT',
    address: 'Sadahalli Gate, MSEC Road, Devanahalli, Bengaluru 562110',
    priceMin: 19400000,
    priceMax: 60000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Embassy Springs Devanahalli Villa Plots Review – 288-Acre Township Near KIA Airport | IndiaPropertyTalk',
    metaDesc: 'Embassy Springs at Devanahalli — premium villa plots 2,100–13,000 sq ft, ₹1.94Cr+, in 288-acre township 15 mins from KIA airport. Investment review and Embassy Group credibility check.',
  })

  await upsertTopic({
    slug: 'arvind-the-park-plots-devanahalli-doddajala-bengaluru',
    propertyName: 'Arvind The Park',
    title: 'Arvind The Park Devanahalli – 340 gated plots near Doddajala Metro from ₹78L | 80% open space | 2027',
    description: 'Arvind The Park at Doddajala, Devanahalli (near the upcoming metro station) is a 24-acre, 340-plot premium plotted development launched March 2025. Plot sizes 1,200–2,000 sq ft, starting ₹78L. RERA: PRM/KA/RERA/1250/303/PR/050325/007549. 80% open space, 7 landscaped parks, infinity rooftop pool, underground utilities. Possession 2027. Arvind SmartSpaces has a consistent track record in Gujarat and Bengaluru — is ₹78L+ for Devanahalli plots reasonable given the metro proximity?',
    cityId: BLRU,
    developerSlug: 'arvind',
    developerName: 'Arvind SmartSpaces',
    propertyType: 'PLOT',
    address: 'Near Doddajala Metro Station, Devanahalli, Bengaluru 562157',
    priceMin: 7800000,
    priceMax: 15000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Arvind The Park Devanahalli Review – 340 Plots Near Doddajala Metro ₹78L+ | IndiaPropertyTalk',
    metaDesc: 'Arvind The Park at Doddajala Devanahalli — 340 gated plots, ₹78L+, 80% open space, near upcoming metro station. Buyer review on Arvind track record, metro premium, and 2027 delivery.',
  })

  await upsertTopic({
    slug: 'arvind-greatlands-plots-kundana-hobli-devanahalli-bengaluru',
    propertyName: 'Arvind Greatlands',
    title: 'Arvind Greatlands Devanahalli – 612 villa plots near airport from ₹84L | Dec 2026 possession',
    description: 'Arvind Greatlands in Kundana Hobli, Devanahalli (near Adarsh Savana and Nandi Hills Road) is a 24-acre, 612-plot premium gated community. Plot sizes 1,200–2,400 sq ft, priced ₹84L–₹2.10Cr. RERA: PRM/KA/RERA/1250/303/PR/181122/005480 (possession Dec 2026). Nature-inspired design with well-established infrastructure norms. Given the number of competing plotted projects in Devanahalli (Tata Swaram, Godrej Reserve, Adarsh Savana), how does Arvind Greatlands differentiate itself?',
    cityId: BLRU,
    developerSlug: 'arvind',
    developerName: 'Arvind SmartSpaces',
    propertyType: 'PLOT',
    address: 'Adarsh College Road, Kundana Hobli, Devanahalli, Bengaluru 562110',
    priceMin: 8400000,
    priceMax: 21000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Arvind Greatlands Devanahalli Review – 612 Villa Plots ₹84L–₹2.10Cr | IndiaPropertyTalk',
    metaDesc: 'Arvind Greatlands in Devanahalli — 612 plots, ₹84L–₹2.10Cr, 24 acres, possession Dec 2026. Comparison with Tata Swaram, Godrej Reserve, Adarsh Savana in the airport corridor.',
  })

  await upsertTopic({
    slug: 'adarsh-savana-plots-devanahalli-bengaluru',
    propertyName: 'Adarsh Savana',
    title: 'Adarsh Savana Devanahalli – 99-acre multi-phase plotted community | Phase 2 ready | ₹65–107L',
    description: 'Adarsh Savana at Chapparkallu Road, Hegganahalli, Devanahalli is a sprawling 99-acre, multi-phase plotted villa community — one of the largest in North Bangalore. Phase 1 sold out and handed over; Phase 2 (249 plots, 22 acres) at possession from Oct 2022 (₹65L–₹107L); Phase 3 under development. RERA: PRM/KA/RERA/1250/303/PR/201001/003613. The project includes a putting green, skating park, and amphitheatre. Owners across phases — how has the community grown over the years? Any infrastructure delays in Phase 3?',
    cityId: BLRU,
    developerSlug: 'adarsh',
    developerName: 'Adarsh Developers',
    propertyType: 'PLOT',
    address: 'Chapparkallu Road, Hegganahalli, Devanahalli, Bengaluru 562110',
    priceMin: 6500000,
    priceMax: 10700000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Adarsh Savana Devanahalli Review – 99-Acre Multi-Phase Villa Plots ₹65–107L | IndiaPropertyTalk',
    metaDesc: 'Adarsh Savana at Devanahalli — 99-acre multi-phase plotted community, Phase 2 at possession, ₹65–107L. Long-term owner review on infrastructure, community growth, and Phase 3 progress.',
  })

  await upsertTopic({
    slug: 'sattva-bhumi-plots-vijayapura-devanahalli-bengaluru',
    propertyName: 'Sattva Bhumi',
    title: 'Sattva Bhumi Devanahalli – 356 affordable villa plots near SH96 from ₹38L | 2026 possession',
    description: 'Sattva Bhumi at Chikkatatamangala, Vijayapura, Devanahalli is a 20-acre, 356-plot residential development launched December 2024. Plot sizes 600–1,800 sq ft (20×30, 30×40, 30×50), starting ₹38L. RERA: PRM/KA/RERA/1250/303/PR/211024/007160 (possession Dec 2026). Salarpuria Sattva\'s entry-level plotted offering in the airport corridor — one of the most accessible price points in North Bangalore. At ₹38L for a 600 sq ft plot, is this viable for self-construction or purely an investment play?',
    cityId: BLRU,
    developerSlug: 'sattva',
    developerName: 'Sattva Group',
    propertyType: 'PLOT',
    address: 'Chikkatatamangala, Vijayapura Town, Devanahalli, Bengaluru 562135',
    priceMin: 3800000,
    priceMax: 10800000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Sattva Bhumi Devanahalli Review – 356 Affordable Villa Plots from ₹38L | IndiaPropertyTalk',
    metaDesc: 'Sattva Bhumi at Vijayapura Devanahalli — 356 villa plots, ₹38L–₹108L, 20 acres, possession Dec 2026. Budget plotted option near Bengaluru airport: investment or self-construction review.',
  })

  await upsertTopic({
    slug: 'purva-tivoli-hills-plots-bellary-road-devanahalli-bengaluru',
    propertyName: 'Purva Tivoli Hills',
    title: 'Purva Tivoli Hills Devanahalli – 839-plot Italian-themed villa plots near Nandi Hills from ₹61L | 61 acres',
    description: 'Purva Tivoli Hills (Purva Land) off Bellary Road (NH-44) near Nandi Hills, Devanahalli is a 61-acre, 839-plot Italian Renaissance-themed plotted township. Plot sizes 1,100–2,600 sq ft, ₹61L–₹1.56Cr. RERA: Multiple phase registrations (PRM/KA/RERA/1251/309/PR/211008/004355 + others). 16,000 sq ft clubhouse, 50+ amenities. Plots near registration-ready with possession Jun 2026. What\'s the Italian Renaissance theme actually translate to on the ground — quality infrastructure or just a marketing name?',
    cityId: BLRU,
    developerSlug: 'puravankara',
    developerName: 'Puravankara',
    propertyType: 'PLOT',
    address: 'Off Bellary Road (NH-44), near Nandi Hills, Devanahalli, Bengaluru 562110',
    priceMin: 6100000,
    priceMax: 15600000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Purva Tivoli Hills Devanahalli Review – 839 Villa Plots Near Nandi Hills ₹61L+ | IndiaPropertyTalk',
    metaDesc: 'Purva Tivoli Hills by Purva Land near Nandi Hills Devanahalli — 61 acres, 839 plots, ₹61L–₹1.56Cr. Review of Italian-themed plotted township, infrastructure quality, and airport corridor investment.',
  })

  await upsertTopic({
    slug: 'birla-trimaya-row-villas-shettigere-devanahalli-bengaluru',
    propertyName: 'Birla Trimaya',
    title: 'Birla Trimaya Shettigere – 4 BHK duplex villaments & row houses in 52-acre smart township from ₹3.32Cr',
    description: 'Birla Trimaya at Shettigere Road, Devanahalli is a 52-acre, 2,600-home integrated smart township with approximately 40 row houses and multiple 4 BHK duplex villaments alongside 28 high-rise towers. Villa/row house units from ₹3.32Cr. RERA: PRM/KA/RERA/1250/303/PR/300823/006200. Phase 1 & 2 sold out; Phase 4 possession Dec 2031. The limited villa inventory within a large apartment township — does this create a genuinely premium experience or does the scale of apartments undermine villa exclusivity?',
    cityId: BLRU,
    developerSlug: 'birla',
    developerName: 'Birla Estates',
    propertyType: 'VILLA',
    address: 'Shettigere Road, Devanahalli, Bengaluru 562157',
    priceMin: 33200000,
    priceMax: 60000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Birla Trimaya Shettigere Devanahalli Review – 4 BHK Villaments & Row Houses in Smart Township | IndiaPropertyTalk',
    metaDesc: 'Birla Trimaya at Shettigere Devanahalli — 4 BHK duplex villaments and row houses from ₹3.32Cr in 52-acre smart township. Buyer discussion on villa exclusivity within a 2,600-home project.',
  })

  await upsertTopic({
    slug: 'purva-oakshire-plots-rampura-hennur-road-bengaluru',
    propertyName: 'Purva Oakshire',
    title: 'Purva Oakshire Hennur Road – 175 garden villa plots from ₹82L in boutique 34-acre community | Dec 2026',
    description: 'Purva Oakshire (Purva Land) at Rampura, off Hennur Road, North Bengaluru is a boutique 34-acre, 175-plot gated garden community. Plot sizes 1,200–2,400 sq ft (30×40, 30×50, 40×60), priced ₹82L–₹3.38Cr. Features 17,600 sq ft clubhouse, cycling track, and organic farming area. RERA: PR/150323/005796 (possession Dec 2026). Near Jakkur and Yelahanka. At 175 plots on 34 acres this is genuinely low-density — good for a premium self-build or too far north for IT professionals?',
    cityId: BLRU,
    developerSlug: 'puravankara',
    developerName: 'Puravankara',
    propertyType: 'PLOT',
    address: 'Rampura, off Hennur Road, North Bengaluru 560045',
    priceMin: 8200000,
    priceMax: 33800000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Purva Oakshire Hennur Road Review – 175 Garden Villa Plots ₹82L–₹3.38Cr | IndiaPropertyTalk',
    metaDesc: 'Purva Oakshire at Rampura Hennur Road — boutique 34-acre, 175-plot gated community, ₹82L–₹3.38Cr, possession Dec 2026. Is low-density North Bangalore the right call for IT professionals?',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // KANAKAPURA ROAD / BANNERGHATTA ROAD CORRIDOR
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── Kanakapura Road / Bannerghatta Road ─────────────────────────────\n')

  await upsertTopic({
    slug: 'sattva-springs-kanakapura-road-south-bengaluru',
    propertyName: 'Sattva Springs',
    title: 'Sattva Springs Kanakapura Road – 66 ultra-luxury 4 BHK row villas from ₹4.41Cr | Art of Living belt',
    description: 'Sattva Springs off Kanakapura Road near the Art of Living ashram, South Bengaluru, is a boutique 5.5-acre enclave of just 66 ultra-luxury 4 BHK row villas (3,607–5,236 sq ft, ₹4.41Cr–₹7.27Cr). RERA: PRM/KA/RERA/1251/310/PR/240724/006948 (possession Sep 2027). Launched July 2024 — a rare under-construction villa product on the Kanakapura corridor where supply is scarce. Is the Kanakapura Road location for a ₹4.41Cr+ villa genuinely premium, or is Whitefield/Sarjapur Rd a safer bet at this price?',
    cityId: BLRU,
    developerSlug: 'sattva',
    developerName: 'Sattva Group',
    propertyType: 'VILLA',
    address: 'Off Kanakapura Road, near Art of Living Centre, South Bengaluru 562112',
    priceMin: 44100000,
    priceMax: 72700000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Sattva Springs Kanakapura Road Review – 66 Ultra-Luxury 4 BHK Row Villas ₹4.41–7.27Cr | IndiaPropertyTalk',
    metaDesc: 'Sattva Springs at Kanakapura Road near Art of Living — 66 boutique row villas, ₹4.41–7.27Cr, possession Sep 2027. Buyer discussion on Kanakapura Road villa investment and Sattva track record.',
  })

  await upsertTopic({
    slug: 'concorde-napa-valley-kaggalipura-kanakapura-road-bengaluru',
    propertyName: 'Concorde Napa Valley',
    title: 'Concorde Napa Valley Kaggalipura – 636-unit 3 & 4 BHK villa township on Kanakapura Rd | Resale review',
    description: 'Concorde Napa Valley at Kaggalipura, Kanakapura Road (NH 209) is one of South Bangalore\'s largest villa townships — 110 acres, 636 villas, 3 & 4 BHK (1,885–4,424 sq ft, ₹1.92Cr–₹4.53Cr). Possession since May 2016; fully occupied and active in the resale market. With 600+ villas across 110 acres, community life here is established and infrastructure is mature. For buyers considering resale: how have prices appreciated since 2016? And how is the Kanakapura Road connectivity vs. when the project launched?',
    cityId: BLRU,
    developerSlug: 'concorde',
    developerName: 'Concorde Group',
    propertyType: 'VILLA',
    address: 'NH 209, Kaggalipura, Kanakapura Road, Bengaluru 562112',
    priceMin: 19200000,
    priceMax: 45300000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Concorde Napa Valley Kanakapura Road Review – 636-Unit Villa Township Resale & Appreciation | IndiaPropertyTalk',
    metaDesc: 'Concorde Napa Valley at Kaggalipura, Kanakapura Road — 636 villas, 110 acres, possession since 2016. Long-term resale market, price appreciation, and infrastructure review.',
  })

  await upsertTopic({
    slug: 'prestige-kings-county-plots-rajapura-jigani-bengaluru',
    propertyName: 'Prestige Kings County',
    title: 'Prestige Kings County – 806 villa plots near Electronic City & Jigani from ₹97L | 73 acres | Dec 2026',
    description: 'Prestige Kings County at Rajapura on the Jigani–Bommasandra Road (off Bannerghatta Road) offers 806 premium villa plots across 73 acres. Plot sizes 1,200–3,200+ sq ft, priced ₹97L–₹2.70Cr (₹6,500–8,500/sq ft). RERA: PR/290624/006936 (launched Jul 2024; possession Dec 2026). Located near Electronic City Phase 2 and Jigani Industrial Area; upcoming Bommasandra Metro adds upside. The flagship plotted launch in this belt — is Jigani–Bommasandra Road accessible enough for daily IT commutes?',
    cityId: BLRU,
    developerSlug: 'prestige',
    developerName: 'Prestige Group',
    propertyType: 'PLOT',
    address: 'Rajapura, Jigani–Bommasandra Road, off Bannerghatta Road, Bengaluru 560105',
    priceMin: 9700000,
    priceMax: 27000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Prestige Kings County Jigani Rajapura Review – 806 Villa Plots Near Electronic City ₹97L+ | IndiaPropertyTalk',
    metaDesc: 'Prestige Kings County at Rajapura Jigani — 73 acres, 806 plots, ₹97L–₹2.70Cr, possession Dec 2026. Is the Jigani–Bommasandra–EC corridor the next big plotted investment zone?',
  })

  await upsertTopic({
    slug: 'urbanrise-paradise-on-earth-kanakapura-road-bengaluru',
    propertyName: 'Urbanrise Paradise on Earth',
    title: 'Urbanrise Paradise on Earth Kanakapura Road – 219 4 BHK villas from ₹3.04Cr | 24 acres | Possession Jan 2026',
    description: 'Urbanrise Paradise on Earth at Gangasandra, off Kanakapura Road (near BGS International School) is a 24-acre, 219-villa community — 4 BHK, 2,472–3,009 sq ft, ₹3.04Cr–₹3.77Cr. RERA: PRM/KA/RERA/1251/310/PR/080223/005704 (possession Jan 2026). At 9 villas per acre and 1,500+ natural trees preserved, this is genuinely spacious. At ₹3Cr+ on Kanakapura Road, buyers often compare this against Concorde Napa Valley resale and Sattva Springs. What tips the balance?',
    cityId: BLRU,
    developerSlug: 'urbanrise',
    developerName: 'Urbanrise',
    propertyType: 'VILLA',
    address: 'Gangasandra, off Kanakapura Road, South Bengaluru 560083',
    priceMin: 30400000,
    priceMax: 37700000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Urbanrise Paradise on Earth Kanakapura Road Review – 219 4 BHK Villas ₹3.04–3.77Cr | IndiaPropertyTalk',
    metaDesc: 'Urbanrise Paradise on Earth at Gangasandra Kanakapura Road — 219 villas, ₹3.04–3.77Cr, 24 acres, possession Jan 2026. Buyer reviews on villa quality, Kanakapura Road investment, and Urbanrise track record.',
  })

  // ── Final count ───────────────────────────────────────────────────────────
  const total = await prisma.topic.count({ where: { city: { slug: 'bengaluru' }, propertyType: { in: ['VILLA', 'PLOT'] }, isPublished: true } })
  console.log(`\n═══════════════════════════════════════════════════════`)
  console.log(`DONE — Added: ${added} | Skipped: ${skipped}`)
  console.log(`Total Bengaluru VILLA+PLOT topics in DB: ${total}`)
  console.log(`═══════════════════════════════════════════════════════`)
}

main()
  .catch(err => { console.error('Fatal error:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
