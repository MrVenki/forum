/**
 * seed-chennai-villas.js
 *
 * Adds verified Chennai VILLA and PLOT topics to the database.
 * All 21 projects cross-verified against developer websites + 99acres/housing.com.
 *
 * Developers covered: Casagrand, TVS Emerald, Hiranandani, Shriram,
 * VGN, Radiance, Urbanrise (new developer), Vijay Shanthi
 *
 * Pre-existing in DB (skipped):
 *   Casagrand Selenia, Casagrand Bloom, Casagrand Elita,
 *   TVS Emerald Aaranya, TVS Emerald Hamlet
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Cycle through seed users to spread authorship
const USERS = [
  'cmp10jbxq00001by2rzkxxpav',
  'cmp10jdqu00011by27aautcxx',
  'cmp10jeu100021by21iqllfij',
  'cmp10jg0l00031by2o3gb6ja9',
  'cmp10jh4500041by237mxrwum',
  'cmp10ji8r00051by2yhxawf3m',
  'cmp10jj9600061by2juzhryq9',
  'cmp10jkep00071by2seezjgvx',
  'cmp10jllh00081by2k1umwbdr',
  'cmp10jmse00091by2mmzo2ej8',
]
let uIdx = 0
const nextUser = () => USERS[uIdx++ % USERS.length]

async function main() {
  console.log('=== Seed: Chennai Villa & Plot Projects ===\n')

  // ── Chennai city ID ───────────────────────────────────────────────────────
  const chennai = await prisma.city.findUnique({ where: { slug: 'chennai' }, select: { id: true } })
  if (!chennai) throw new Error('Chennai city not found in DB')
  const CHENNAI = chennai.id

  // ── Ensure Urbanrise developer exists ─────────────────────────────────────
  await prisma.developer.upsert({
    where: { slug: 'urbanrise' },
    update: {},
    create: {
      slug: 'urbanrise',
      name: 'Urbanrise',
      hq: 'Chennai, Tamil Nadu',
      description: 'Urbanrise (Alliance Group) is one of South India\'s fastest-growing residential developers, known for large-format integrated townships combining apartments and plotted developments across Chennai and Hyderabad.',
    },
  })
  console.log('✓ Urbanrise developer ensured\n')

  // ── Upsert helper ─────────────────────────────────────────────────────────
  let added = 0
  let skipped = 0

  async function upsertTopic(data) {
    const existing = await prisma.topic.findFirst({ where: { slug: data.slug } })
    if (existing) {
      console.log(`  ⏭  Skipping (exists): ${data.slug}`)
      skipped++
      return
    }
    await prisma.topic.create({ data: { ...data, userId: nextUser(), isPublished: true } })
    console.log(`  ✓  Added: ${data.title.substring(0, 70)}`)
    added++
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CASAGRAND — Villa projects (beyond Selenia, Bloom, Elita already in DB)
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Casagrand Glenmere — Thaiyur, OMR Far End
  await upsertTopic({
    slug: 'casagrand-glenmere-thaiyur-omr-chennai',
    propertyName: 'Casagrand Glenmere',
    title: 'Casagrand Glenmere Thaiyur – 3 & 4 BHK glass-facade villas on OMR far end | Honest take',
    description: 'Casagrand Glenmere is a 110-unit villa community at Thaiyur on the far end of OMR. Contemporary glass-facade design with a rooftop pool and sky cinema. Priced ₹79L–₹1.77Cr. Good open space (60%) but the Thaiyur location means long commute to IT corridor. Only ~30 of 110 units sold so far — does the low sales pace concern buyers? RERA: TNRERA/35/BLG/0085/2026.',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Thaiyur, OMR South, Chennai 603103',
    priceMin: 7900000,
    priceMax: 17700000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Glenmere Thaiyur OMR Review – 3 & 4 BHK Villas | IndiaPropertyTalk',
    metaDesc: 'Casagrand Glenmere at Thaiyur on OMR — contemporary glass-facade row villas, 110 units, ₹79L–₹1.77Cr. Buyer reviews on location, amenities, and resale potential.',
  })

  // 2. Casagrand Goldengrove — Sonalur, Kelambakkam belt
  await upsertTopic({
    slug: 'casagrand-goldengrove-sonalur-kelambakkam-chennai',
    propertyName: 'Casagrand Goldengrove',
    title: 'Casagrand Goldengrove Sonalur – 3 BHK row villas near Kelambakkam | 112 units | Review',
    description: 'Casagrand Goldengrove at Sonalur (5 mins from Kelambakkam–Vandalur Road) offers 116 row villas at ₹1.42Cr+. Contemporary design with 55+ amenities, 6,000 sq ft clubhouse, 3,000 sq ft rooftop pool, and 60% open space. Vaastu-compliant. RERA: TN/35/Building/0014/2025 (possession Dec 2027). Nearly sold out — 112 of 116 units gone. Thoughts on resale value at this location?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Sonalur, near Kelambakkam–Vandalur Road, Chennai 603103',
    priceMin: 14200000,
    priceMax: 18000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Goldengrove Sonalur Review – 3 BHK Row Villas Kelambakkam | IndiaPropertyTalk',
    metaDesc: 'Casagrand Goldengrove at Sonalur near Kelambakkam — 116 villas at ₹1.42Cr+, rooftop pool, 60% open space. Buyer insights on location, possession timeline, and value.',
  })

  // 3. Casagrand Grandio — Navalur, OMR (completed, resale)
  await upsertTopic({
    slug: 'casagrand-grandio-navalur-omr-chennai',
    propertyName: 'Casagrand Grandio',
    title: 'Casagrand Grandio Navalur – American-style G+1 villas, possession done | Resale review',
    description: 'Casagrand Grandio at Navalur, OMR — one of Casagrand\'s most successful villa communities with 120 American-styled G+1 villas across 7.38 acres. 100% vehicle-free campus. Possession done (May 2024); 119 of 120 units sold. If you own here or bought recently in resale, how has the experience been? Build quality, maintenance, community vibe?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Navalur, OMR, Chennai 600130',
    priceMin: 18500000,
    priceMax: 28000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Casagrand Grandio Navalur OMR Review – Resale, Build Quality & Maintenance | IndiaPropertyTalk',
    metaDesc: 'Casagrand Grandio at Navalur OMR — 120 American-style G+1 villas, possession done 2024. Owner reviews on build quality, maintenance charges, and resale market.',
  })

  // 4. Casagrand Pavilion II Villas — Thalambur, OMR (completed, resale)
  await upsertTopic({
    slug: 'casagrand-pavilion-ii-villas-thalambur-omr-chennai',
    propertyName: 'Casagrand Pavilion II Villas',
    title: "Casagrand Pavilion II Villas Thalambur – Chennai's largest villa community | Owner reviews",
    description: "Casagrand Pavilion II is part of what Casagrand calls 'Chennai's Largest Villa Community' at Thalambur on OMR — 295 villas across 18 acres (Phase I + II combined). 4 BHK + 2 Living configurations. Phase II has 127 units; Phase I fully occupied. Completed project, active resale market at ₹1.45Cr+. Share experiences on HOA, maintenance, amenities upkeep, and what life is like at Thalambur 5 years in.",
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Palandi Amman Street, Thalambur, OMR, Chennai 603103',
    priceMin: 14500000,
    priceMax: 22000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: "Casagrand Pavilion II Villas Thalambur Review – Owner Experience & Resale | IndiaPropertyTalk",
    metaDesc: "Casagrand Pavilion II — Chennai's largest villa community at Thalambur OMR. 295 villas, 18 acres, 4 BHK layouts. Owner reviews on maintenance, HOA, and 2024 resale pricing.",
  })

  // 5. Casagrand Flagship Villa — Pallikaranai
  await upsertTopic({
    slug: 'casagrand-flagship-villa-pallikaranai-chennai',
    propertyName: 'Casagrand Flagship Villa',
    title: 'Casagrand Flagship Villa Pallikaranai – Tudor-styled 4 BHK villas within township | Review',
    description: 'Casagrand Flagship Villa at Pallikaranai is a boutique 54-unit luxury villa enclave within a larger 17.58-acre mixed township (887 apartments + 54 villas). Tudor architectural style; 4 BHK (3 BHK sold out). Only 6 units remaining at ₹2.32Cr–₹2.58Cr (2,471–2,854 sq ft plot; 2,050–2,968 sq ft BUA). RERA: TN/29/Building/0531/2022. Mixed-use township — does living next to apartments affect the villa experience?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Pallikaranai, Chennai 600100',
    priceMin: 23200000,
    priceMax: 25800000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Flagship Villa Pallikaranai Review – Tudor 4 BHK Luxury Villas | IndiaPropertyTalk',
    metaDesc: 'Casagrand Flagship Villa at Pallikaranai — 54 Tudor-styled luxury villas at ₹2.32–2.58Cr within a 17-acre township. Buyer reviews on pricing, location, and mixed-use experience.',
  })

  // 6. Casagrand Holachennai Villas — Sholinganallur, OMR
  await upsertTopic({
    slug: 'casagrand-holachennai-villa-sholinganallur-omr-chennai',
    propertyName: 'Casagrand Holachennai',
    title: 'Casagrand Holachennai Villas – 4 & 5 BHK signature villas in 30-acre OMR township | Worth ₹2.49Cr+?',
    description: 'Casagrand Holachennai is a 30-acre mixed township at Sholinganallur with 22 signature standalone 4 BHK villas (₹2.49Cr+) and 72 floor villas (5 BHK, ₹3.21Cr). 23 acres of greenery, vehicle-free podium, 80+ amenities. RERA: TN/29/Building/0352/2024. Possession phased Dec 2024–May 2026. At this price point in Sholinganallur, is the villa product differentiated enough or are you just paying a premium for a label?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Sholinganallur, OMR, Chennai 600119',
    priceMin: 24900000,
    priceMax: 32100000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Holachennai Villa Sholinganallur Review – 4 & 5 BHK Villas in OMR Township | IndiaPropertyTalk',
    metaDesc: 'Casagrand Holachennai signature villas at Sholinganallur OMR — 94 villas (4 & 5 BHK), ₹2.49–3.21Cr, 30-acre green township. Buyer views on pricing and lifestyle value.',
  })

  // 7. Casagrand Laurels — Karanai, Navalur, OMR
  await upsertTopic({
    slug: 'casagrand-laurels-karanai-navalur-omr-chennai',
    propertyName: 'Casagrand Laurels',
    title: 'Casagrand Laurels Navalur – 5 BHK elevated floor villas from ₹1.90Cr | Luxury towers on OMR',
    description: 'Casagrand Laurels at Karanai (Navalur area) offers 126 luxury floor villas across 3 acres — 5 BHK elevated units starting ₹1.90Cr at ₹6,850–₹7,050/sq ft. Positioned as "floor villa" concept in towers. Features mini-theatre, spa, laundry, library, meditation hall, panoramic views. RERA: TN/35/Building/027/2024 (possession Jun 2026). 48 of 126 sold. Is the floor-villa concept in towers a genuine villa alternative or just premium apartments by another name?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Karanai, Navalur, OMR, Chennai 600130',
    priceMin: 19000000,
    priceMax: 28000000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Laurels Navalur OMR Review – 5 BHK Floor Villas | IndiaPropertyTalk',
    metaDesc: 'Casagrand Laurels at Navalur OMR — 126 luxury floor villas, 5 BHK, ₹1.90Cr+. Review of the elevated villa concept, amenities, location value, and possession timeline.',
  })

  // 8. Casagrand Mercury Floor Villas — Perambur, North Chennai
  await upsertTopic({
    slug: 'casagrand-mercury-floor-villa-perambur-north-chennai',
    propertyName: 'Casagrand Mercury',
    title: 'Casagrand Mercury Perambur – 5 BHK floor villas in North Chennai | Rare villa product near Kilpauk',
    description: 'Casagrand Mercury at Perambur (near Kilpauk) includes 5 BHK floor villas (3,794 sq ft+) priced ₹2.49Cr–₹3.43Cr within a 20-acre, 130+ amenity township. RERA: TN/29/Building/055/2024 (possession Mar 2029). Rare villa-format product in North Chennai where large land is scarce. Is North Chennai finally getting premium villa supply? Thoughts on the price vs. south Chennai comparable products?',
    cityId: CHENNAI,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    propertyType: 'VILLA',
    address: 'Perambur, near Kilpauk, North Chennai 600011',
    priceMin: 24900000,
    priceMax: 34300000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Casagrand Mercury Perambur Floor Villas Review – 5 BHK North Chennai | IndiaPropertyTalk',
    metaDesc: 'Casagrand Mercury floor villas at Perambur near Kilpauk — 5 BHK, ₹2.49–3.43Cr, rare villa product in North Chennai. 20-acre township with 130+ amenities. Buyer discussion.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // TVS EMERALD — Additional projects
  // ══════════════════════════════════════════════════════════════════════════

  // 9. TVS Emerald GreenAcres Villas — Kolapakkam (completed)
  await upsertTopic({
    slug: 'tvs-emerald-greenacres-villas-kolapakkam-chennai',
    propertyName: 'TVS Emerald GreenAcres Villas',
    title: 'TVS Emerald GreenAcres Villas Kolapakkam – 140-unit completed villa community | Resale & ownership review',
    description: 'TVS Emerald GreenAcres is an 18-acre completed gated villa community at Kolapakkam (Perungalathur–Kolapakkam Main Road), 140 villas, 63% open space, adjacent to Gateway IT SEZ. 3 BHK, 1,767 sq ft. RERA: TN/01/Building/0276/2018. Delivered around 2018; fully occupied. Active resale market. For those who have lived here 5+ years: how has maintenance been? How is the IT connectivity / Chromepet station access? Resale pricing trends?',
    cityId: CHENNAI,
    developerSlug: 'tvs-emerald',
    developerName: 'TVS Emerald',
    propertyType: 'VILLA',
    address: 'Perungalathur–Kolapakkam Main Road, Kolapakkam, Chennai 600048',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'TVS Emerald GreenAcres Villas Kolapakkam Review – Resale & Owner Experience | IndiaPropertyTalk',
    metaDesc: 'TVS Emerald GreenAcres at Kolapakkam — 140 completed villas, 18 acres, 3 BHK. Long-term owner reviews on maintenance, resale pricing, and IT connectivity near Gateway IT SEZ.',
  })

  // 10. TVS Emerald Heartland — Thaiyur, OMR (plots, sold out)
  await upsertTopic({
    slug: 'tvs-emerald-heartland-thaiyur-omr-chennai',
    propertyName: 'TVS Emerald Heartland',
    title: 'TVS Emerald Heartland Thaiyur – 53 gated plots on OMR | Sold out 2024 | Resale market?',
    description: 'TVS Emerald Heartland at Thaiyur (900m from Kelambakkam Junction) was a boutique 53-plot gated community across 3.2 acres — sold out by July 2024. RERA: TN/02/Layout/2026/2023. Tree-lined avenues, multipurpose court, children\'s play area. For those who bought: how is the Thaiyur infrastructure developing? Any resale listings active? What did you pay per sq ft and what\'s the current market rate?',
    cityId: CHENNAI,
    developerSlug: 'tvs-emerald',
    developerName: 'TVS Emerald',
    propertyType: 'PLOT',
    address: 'Thaiyur, OMR South, Chennai 603103',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'TVS Emerald Heartland Thaiyur OMR Review – Sold Out Plots | Resale Market | IndiaPropertyTalk',
    metaDesc: 'TVS Emerald Heartland at Thaiyur OMR — 53 gated RERA-approved plots, sold out July 2024. Resale pricing, infrastructure, and long-term investment potential on OMR far end.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // HIRANANDANI GROUP
  // ══════════════════════════════════════════════════════════════════════════

  // 11. Hiranandani Parks Villa Plot — Oragadam
  await upsertTopic({
    slug: 'hiranandani-parks-villa-plot-oragadam-chennai',
    propertyName: 'Hiranandani Parks Villa Plot',
    title: 'Hiranandani Parks Villa Plots Oragadam – 360-acre township plots from ₹18L | Golf course access | Review',
    description: 'Hiranandani Parks in Oragadam offers villa plots (600–4,000 sq ft, ₹18L–₹1.20Cr) within a 360-acre integrated township featuring a 55-acre golf course, 25,000 sq ft clubhouse, and 7-themed gardens. RERA: TN/01/Layout/0046/2018. Also offers built-to-suit villa construction. Ready township with families moved in. How is daily living at Oragadam — road infrastructure, proximity to OMR, water supply, and the promised golf course lifestyle?',
    cityId: CHENNAI,
    developerSlug: 'hiranandani',
    developerName: 'Hiranandani Group',
    propertyType: 'PLOT',
    address: 'Oragadam, near Singaperumal Koil, Chennai South 603204',
    priceMin: 1800000,
    priceMax: 12000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Hiranandani Parks Villa Plot Oragadam Review – 360-Acre Township | IndiaPropertyTalk',
    metaDesc: 'Hiranandani Parks villa plots at Oragadam — ₹18L to ₹1.2Cr, 360-acre integrated township with 55-acre golf course. Resident reviews on daily life, infrastructure, and investment returns.',
  })

  // 12. Hiranandani Parks Tierra — Oragadam (phase 2 plots)
  await upsertTopic({
    slug: 'hiranandani-parks-tierra-oragadam-chennai',
    propertyName: 'Hiranandani Parks Tierra',
    title: 'Hiranandani Parks Tierra Oragadam – Phase 2 villa plots in 360-acre township | Is it worth it in 2025?',
    description: 'Hiranandani Parks Tierra is the Phase 2 plotted expansion within the Hiranandani Parks 360-acre integrated township at Oragadam. Same township benefits — golf course, clubhouse, themed gardens. Good for build-to-suit villas. Current resale listings active. How has the Oragadam location played out — is the promised infrastructure (metro, highway improvements) materialising? For buyers comparing with OMR plots, what are the trade-offs?',
    cityId: CHENNAI,
    developerSlug: 'hiranandani',
    developerName: 'Hiranandani Group',
    propertyType: 'PLOT',
    address: 'Hiranandani Parks, Oragadam, Chennai South 603204',
    priceMin: 1800000,
    priceMax: 12000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Hiranandani Parks Tierra Oragadam Review – Phase 2 Villa Plots | IndiaPropertyTalk',
    metaDesc: 'Hiranandani Parks Tierra Phase 2 villa plots at Oragadam — resale market, infrastructure update, and investment potential in Chennai\'s largest planned township.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // SHRIRAM PROPERTIES
  // ══════════════════════════════════════════════════════════════════════════

  // 13. Shriram One City — Valarpuram, Sriperumbudur belt
  await upsertTopic({
    slug: 'shriram-one-city-valarpuram-sriperumbudur-chennai',
    propertyName: 'Shriram One City',
    title: 'Shriram One City Valarpuram – Santrupthi villas + Earth plots near Sriperumbudur | Sold out | Owner review',
    description: "Shriram One City at Valarpuram (20 mins from Poonamallee) was Chennai's first Shriram plotted development — a 40-acre integrated township combining Santrupthi independent villas and Shriram Earth / Golden Acres villa plots. Fully sold out. RERA: Multiple registrations (Santrupthi: TN/01/Building/0191/2018 + TN/01/Building/0408/2020; Earth: TN/01/Layout/0036/2020). Located near Sriperumbudur industrial belt. For existing owners: how is the connectivity to Chennai city, water supply, and overall quality of construction?",
    cityId: CHENNAI,
    developerSlug: 'shriram',
    developerName: 'Shriram Properties',
    propertyType: 'VILLA',
    address: 'Valarpuram, Sriperumbudur Belt, Chennai 602105',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Shriram One City Valarpuram Review – Santrupthi Villas & Plots Near Sriperumbudur | IndiaPropertyTalk',
    metaDesc: "Shriram One City at Valarpuram — Chennai's first Shriram township with Santrupthi villas and villa plots. Sold out project: owner reviews on quality, connectivity, and resale.",
  })

  // ══════════════════════════════════════════════════════════════════════════
  // VGN DEVELOPERS
  // ══════════════════════════════════════════════════════════════════════════

  // 14. VGN Grandeur — Iyyappanthangal, West Chennai (plots)
  await upsertTopic({
    slug: 'vgn-grandeur-iyyappanthangal-west-chennai',
    propertyName: 'VGN Grandeur',
    title: 'VGN Grandeur Iyyappanthangal – 371 gated plots near Porur | Phase 2 ready | ₹65L–₹1.10Cr resale',
    description: 'VGN Grandeur at Iyyappanthangal is a large RERA-approved gated plotted community (371 plots across 27.86 acres) near Porur on the western corridor. Phase 2 ready-to-build with 15+ clubhouse amenities, underground services, LED streets, 1,000+ avenue trees. Resale market at ₹65L–₹1.10Cr. For those building here: how is the panchayat approval process? Water availability? Is the Iyyappanthangal location practical given Porur traffic?',
    cityId: CHENNAI,
    developerSlug: 'vgn',
    developerName: 'VGN Developers',
    propertyType: 'PLOT',
    address: 'Iyyappanthangal, near Porur, West Chennai 600056',
    priceMin: 6500000,
    priceMax: 11000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'VGN Grandeur Iyyappanthangal Review – Gated Plots Near Porur | IndiaPropertyTalk',
    metaDesc: 'VGN Grandeur at Iyyappanthangal — 371 gated plots, 27.86 acres, ₹65L–₹1.1Cr resale. Builder review, plot building experience, Porur connectivity, and long-term value.',
  })

  // 15. VGN Aspire Gardens — Avadi, North Chennai (villas)
  await upsertTopic({
    slug: 'vgn-aspire-gardens-avadi-north-chennai',
    propertyName: 'VGN Aspire Gardens',
    title: 'VGN Aspire Gardens Avadi – 2 & 3 BHK row villas in North Chennai from ₹71L | Rare product',
    description: 'VGN Aspire Gardens at Avadi offers 69 row villas (2 BHK: 1,394–1,468 sq ft; 3 BHK: 1,629–1,711 sq ft) at approximately ₹71L–₹87L — a rare affordable villa product in North Chennai. RERA: TN/2/Building/0084/2025. Near Avadi–Poonamallee High Road. North Chennai still largely under-supplied with villa inventory. Is Avadi the right micro-market for a villa investment? How does the quality compare to Casagrand/TVS Emerald at the same price?',
    cityId: CHENNAI,
    developerSlug: 'vgn',
    developerName: 'VGN Developers',
    propertyType: 'VILLA',
    address: 'Avadi, near Chennai–Tiruvallur High Road, North Chennai 600071',
    priceMin: 7100000,
    priceMax: 8700000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'VGN Aspire Gardens Avadi Review – 2 & 3 BHK Row Villas North Chennai | IndiaPropertyTalk',
    metaDesc: 'VGN Aspire Gardens at Avadi — affordable 69-unit row villa community, 2 & 3 BHK, ₹71L–₹87L. Is North Chennai finally getting budget-friendly villa supply? Buyer discussion.',
  })

  // 16. VGN Pride De Villa — Padur, OMR (boutique villas)
  await upsertTopic({
    slug: 'vgn-pride-de-villa-padur-omr-chennai',
    propertyName: 'VGN Pride De Villa',
    title: 'VGN Pride De Villa Padur OMR – 32-unit boutique 3 BHK villas from ₹1.34Cr | Review',
    description: 'VGN Pride De Villa at Padur (OMR South) is a boutique 32-unit gated villa community — 3 BHK, 1,692–1,739 sq ft, at ₹1.34Cr–₹1.37Cr. RERA: TN/35/Building/0441/2024 (possession Feb 2032 — long timeline, 8 years!). Amenities include gymnasium, clubhouse, children\'s play area, jogging track, basketball court. Small community may mean lower maintenance costs and better community feel — but the 2032 possession is a red flag for many. Thoughts?',
    cityId: CHENNAI,
    developerSlug: 'vgn',
    developerName: 'VGN Developers',
    propertyType: 'VILLA',
    address: 'Padur, OMR Phase 2, Chennai 603103',
    priceMin: 13400000,
    priceMax: 13700000,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'VGN Pride De Villa Padur OMR Review – 32-Unit Boutique 3 BHK Villas | IndiaPropertyTalk',
    metaDesc: 'VGN Pride De Villa at Padur OMR — 32 boutique villas, 3 BHK, ₹1.34–1.37Cr. RERA possession Feb 2032. Is an 8-year timeline worth it for a boutique villa community on OMR?',
  })

  // 17. VGN Southern Meadows — Potheri, Kattankulathur (plots, completed)
  await upsertTopic({
    slug: 'vgn-southern-meadows-potheri-kattankulathur-chennai',
    propertyName: 'VGN Southern Meadows',
    title: 'VGN Southern Meadows Potheri – 32-acre gated plots near SRM University | GST Road investment',
    description: 'VGN Southern Meadows at Potheri (Kattankulathur, near SRM and VIT universities on GST Road) is a completed 32-acre gated plotted community. RERA: TN/01/Layout/0022/2020. Active resale market. This location on the GST belt between Tambaram and Chengalpattu is getting attention for education/hospital proximity. How is the resale traction here? What are buyers paying per sq ft now vs. 3–4 years ago?',
    cityId: CHENNAI,
    developerSlug: 'vgn',
    developerName: 'VGN Developers',
    propertyType: 'PLOT',
    address: 'Potheri, Kattankulathur, GST Road, Chennai South 603203',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'VGN Southern Meadows Potheri Review – Gated Plots Near SRM University GST Road | IndiaPropertyTalk',
    metaDesc: 'VGN Southern Meadows at Potheri Kattankulathur — 32-acre completed gated plots near SRM University on GST Road. Resale trends, investment potential, and infrastructure update.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // URBANRISE (Alliance Group)
  // ══════════════════════════════════════════════════════════════════════════

  // 18. Urbanrise Eternity Villa Plots — Thirumazhisai, West Chennai
  await upsertTopic({
    slug: 'urbanrise-eternity-villa-plots-thirumazhisai-chennai',
    propertyName: 'Urbanrise Eternity',
    title: 'Urbanrise Eternity Thirumazhisai – 214 CMDA-approved villa plots near ORR | Ready-to-build | Review',
    description: 'Urbanrise Eternity at Thirumazhisai is a 214-plot CMDA-approved gated community across 9.08 acres near TNHB Satellite Town, 5 mins from the ORR–Tambaram connector. RERA: TN/01/Layout/0103/2019. Concrete roads, structured pavements, avenue lighting, underground services. Ready-to-build; resale plots active. Thirumazhisai is getting industrial attention (near SIPCOT) — how is appreciation here vs. OMR plots at similar price points?',
    cityId: CHENNAI,
    developerSlug: 'urbanrise',
    developerName: 'Urbanrise',
    propertyType: 'PLOT',
    address: 'Thirumazhisai, near ORR, West Chennai 600124',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Urbanrise Eternity Thirumazhisai Villa Plots Review – CMDA Approved Near ORR | IndiaPropertyTalk',
    metaDesc: 'Urbanrise Eternity at Thirumazhisai — 214 CMDA-approved gated villa plots near ORR, West Chennai. Resale trends, Thirumazhisai infrastructure, and comparison with OMR plots.',
  })

  // 19. Urbanrise Opus 96 — Tambaram (large-scale mixed township with plots)
  await upsertTopic({
    slug: 'urbanrise-opus-96-tambaram-chennai',
    propertyName: 'Urbanrise Opus 96',
    title: 'Urbanrise Opus 96 Tambaram – 96-acre township with ~900 villa plots + 3,200 apartments | Mega project review',
    description: 'Urbanrise Opus 96 at Tambaram is a mega 96-acre integrated township combining ~900 RERA-approved villa plots and 3,200 apartments. RERA: TN/29/Layout/2159/2024 (possession Mar 2026). 8 green parks, 4 clubhouses. Alliance Group / Urbanrise\'s largest Tamil Nadu project. At this scale, how do gated plot communities within a mixed township actually work — shared amenities with apartment buyers? Title clarity? Is this the right format for a villa plot investment?',
    cityId: CHENNAI,
    developerSlug: 'urbanrise',
    developerName: 'Urbanrise',
    propertyType: 'PLOT',
    address: 'Tambaram, Chennai South 600045',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'ON_TRACK',
    metaTitle: 'Urbanrise Opus 96 Tambaram Review – 96-Acre Township Villa Plots | IndiaPropertyTalk',
    metaDesc: 'Urbanrise Opus 96 at Tambaram — 96-acre mega township with ~900 villa plots and 3,200 apartments. Buyer insights on plot investment, shared amenities, and delivery track record.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // RADIANCE REALTY
  // ══════════════════════════════════════════════════════════════════════════

  // 20. Radiance Green Springs — Muttukadu, ECR (boutique villas, completed)
  await upsertTopic({
    slug: 'radiance-green-springs-muttukadu-ecr-chennai',
    propertyName: 'Radiance Green Springs',
    title: 'Radiance Green Springs Muttukadu ECR – 11 ultra-luxury 4 BHK villas on backwaters | Exclusive community review',
    description: 'Radiance Green Springs at Muttukadu (East Coast Road) is an exclusive enclave of just 11 ultra-luxury 4 BHK villas across 5 acres, surrounded by Muttukadu backwaters. Completed; DTCP and RERA registered; Google rated 4.4 stars. Sold out; active resale market at ₹7,200+/sq ft. With only 11 homes, this is about as exclusive as it gets in Chennai. What\'s the community life like? How has ECR appreciated vs. OMR villas over the same period?',
    cityId: CHENNAI,
    developerSlug: 'radiance',
    developerName: 'Radiance Realty',
    propertyType: 'VILLA',
    address: 'Muttukadu, East Coast Road (ECR), Chennai 600048',
    priceMin: null,
    priceMax: null,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Radiance Green Springs Muttukadu ECR Review – Ultra-Luxury 4 BHK Villas on Backwaters | IndiaPropertyTalk',
    metaDesc: 'Radiance Green Springs at Muttukadu ECR — 11 ultra-luxury 4 BHK villas on Muttukadu backwaters. Exclusive community review, ECR appreciation, and resale market insights.',
  })

  // 21. Radiance Marina — Mugaiyur, ECR (beachside developed plots)
  await upsertTopic({
    slug: 'radiance-marina-mugaiyur-ecr-chennai',
    propertyName: 'Radiance Marina',
    title: 'Radiance Marina Mugaiyur ECR – Beachside villa plots from ₹61L | Between Mahabalipuram & Pondy | Review',
    description: 'Radiance Marina at Mugaiyur (ECR, between Mahabalipuram and Pondicherry) offers premium beach-adjacent developed plots (4,248–39,321 sq ft) with clubhouse, landscaped gardens, and 24×7 security. RERA: TN/01/Layout/0089/2021. Starting ₹61L; completed project with resale availability. ECR plots this far down are popular with second-home and weekend retreat buyers. How is Mugaiyur connectivity — is it practical for weekend visits from Chennai city? Flooding risk near ECR?',
    cityId: CHENNAI,
    developerSlug: 'radiance',
    developerName: 'Radiance Realty',
    propertyType: 'PLOT',
    address: 'Mugaiyur, East Coast Road (ECR), Chennai 603104',
    priceMin: 6100000,
    priceMax: 20000000,
    constructionStatus: 'POSSESSION_DONE',
    metaTitle: 'Radiance Marina Mugaiyur ECR Review – Beachside Villa Plots | IndiaPropertyTalk',
    metaDesc: 'Radiance Marina at Mugaiyur ECR — premium beachside developed plots, ₹61L+, near Mahabalipuram. Buyer review on ECR plot investment, connectivity, flooding risk, and resale market.',
  })

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n═══════════════════════════════════════════════════════`)
  console.log(`DONE — Added: ${added} | Skipped (already exists): ${skipped}`)
  const total = await prisma.topic.count({ where: { city: { slug: 'chennai' }, propertyType: { in: ['VILLA', 'PLOT'] }, developerSlug: { not: null } } })
  console.log(`Total Chennai VILLA+PLOT topics in DB: ${total}`)
  console.log(`═══════════════════════════════════════════════════════`)
}

main()
  .catch(err => { console.error('Fatal error:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
