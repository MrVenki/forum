/**
 * seed-dac-dra-chennai.js
 *
 * Adds verified Chennai projects by DAC Developers and DRA Homes
 * launched in 2025 and 2026. All projects cross-verified against
 * TNRERA portal, developer websites, 99acres, SquareYards, NoBroker,
 * and Business Standard press releases (May 2026).
 *
 * New developers created: DAC Developers, DRA Homes
 *
 * Projects included (9 total):
 *   DAC Developers (5):
 *     1. DAC Prospera           – Porur, Chennai West         (RERA 2025, APARTMENT)
 *     2. DAC Napa Valley        – Sithalapakkam, OMR          (RERA 2025, APARTMENT)
 *     3. DAC Santa Clara        – Kattupakkam, OMR            (RERA 2025, VILLA)
 *     4. DAC Cambridge          – Semmancheri, OMR            (RERA 2025-26, APARTMENT)
 *     5. DAC Luxe               – Perungalathur, SW Chennai   (RERA 2026, APARTMENT)
 *   DRA Homes (4):
 *     6. DRA Astra              – Madhavaram, Chennai North   (RERA 2025, APARTMENT)
 *     7. DRA Inara              – Navalur, OMR               (RERA 2025, VILLA)
 *     8. DRA iHeart             – Egattur, OMR              (RERA 2025, APARTMENT)
 *     9. DRA Marina 100         – Egattur / Navalur, OMR    (RERA 2026, APARTMENT)
 *
 * Skipped (RERA 2024 — outside the 2025/2026 window):
 *   DAC Nakshathra Avenue (TN/2/Layout/3567/2024)
 *   DAC Avenue One        (TN/35/Layout/2645/2024)
 *   DRA Avalon            (TN/1/Layout/1171/2024)
 *
 * Skipped (no confirmed RERA number):
 *   DAC Rhythm (Madambakkam, pre-launch only)
 *
 * Run: node scripts/seed-dac-dra-chennai.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ── Chennai seed users ──────────────────────────────────────────────────────
// Tamil/Chennai-region names; spread authorship across topics.
const CHN_USERS = [
  { name: 'Karthik Subramanian',    email: 'karthik.subramanian.chn@gmail.com'    },
  { name: 'Priya Venkataraman',     email: 'priya.venkataraman.chn@gmail.com'     },
  { name: 'Senthil Kumar',          email: 'senthil.kumar.chn@gmail.com'           },
  { name: 'Deepa Krishnamurthy',    email: 'deepa.krishnamurthy.chn@gmail.com'    },
  { name: 'Balaji Rajan',           email: 'balaji.rajan.chn@gmail.com'           },
  { name: 'Anitha Selvam',          email: 'anitha.selvam.chn@gmail.com'          },
  { name: 'Vijay Chandrasekaran',   email: 'vijay.chandrasekaran.chn@gmail.com'   },
  { name: 'Meena Sundaram',         email: 'meena.sundaram.chn@gmail.com'         },
  { name: 'Rajesh Natarajan',       email: 'rajesh.natarajan.chn@gmail.com'       },
  { name: 'Kavitha Murugesan',      email: 'kavitha.murugesan.chn@gmail.com'      },
  { name: 'Suresh Pandian',         email: 'suresh.pandian.chn@gmail.com'         },
  { name: 'Lakshmi Narayanan',      email: 'lakshmi.narayanan.chn@gmail.com'      },
  { name: 'Arun Shanmugam',         email: 'arun.shanmugam.chn@gmail.com'         },
  { name: 'Saranya Palanisamy',     email: 'saranya.palanisamy.chn@gmail.com'     },
  { name: 'Murugan Pillai',         email: 'murugan.pillai.chn@gmail.com'         },
  { name: 'Geetha Ramalingam',      email: 'geetha.ramalingam.chn@gmail.com'      },
  { name: 'Dinesh Balasubramanian', email: 'dinesh.balasubramanian.chn@gmail.com' },
  { name: 'Revathi Gopalakrishnan', email: 'revathi.gopalakrishnan.chn@gmail.com' },
  { name: 'Saravanan Thirumalai',   email: 'saravanan.thirumalai.chn@gmail.com'   },
  { name: 'Nithya Srinivasan',      email: 'nithya.srinivasan.chn@gmail.com'      },
]

let userIds = []
let uIdx = 0
const nextUser = () => userIds[uIdx++ % userIds.length]

async function main() {
  console.log('=== Seed: DAC Developers & DRA Homes – Chennai (2025–2026) ===\n')

  // ── 1. Create / fetch Chennai seed users ─────────────────────────────────
  console.log('── Creating Chennai users ────────────────────────────────────────\n')
  for (const u of CHN_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      userIds.push(existing.id)
      console.log(`  ↩  Existing: ${u.name}`)
    } else {
      const created = await prisma.user.create({ data: { name: u.name, email: u.email } })
      userIds.push(created.id)
      console.log(`  ✓  Created:  ${u.name}`)
    }
  }
  console.log(`\n  ${userIds.length} Chennai users ready\n`)

  // ── 2. Ensure developers ──────────────────────────────────────────────────
  await prisma.developer.upsert({
    where:  { slug: 'dac-developers' },
    update: {},
    create: {
      slug:        'dac-developers',
      name:        'DAC Developers',
      hq:          'Chennai, Tamil Nadu',
      foundedYear: 2014,
      description:
        'DAC Developers is a Chennai-based real estate company known for delivering residential projects across the city\'s key corridors — Porur, OMR, Tambaram, and Perungalathur. They market themselves on transparency and buyer-friendly innovations, including their flagship women-friendly housing concept launched with DAC Prospera.',
    },
  })
  console.log('✓ DAC Developers developer ensured')

  await prisma.developer.upsert({
    where:  { slug: 'dra-homes' },
    update: {},
    create: {
      slug:        'dra-homes',
      name:        'DRA Homes',
      hq:          'Chennai, Tamil Nadu',
      foundedYear: 1986,
      totalDelivered: '12,000+ homes, 10M+ sq ft developed across Chennai',
      description:
        'DRA Homes is one of Chennai\'s most established residential developers with nearly four decades of experience. Founded in 1986, they have delivered 12,000+ homes across Chennai including major corridors like OMR, Madhavaram, and Perambur. Their 2025–2026 launches signal an aggressive push into the luxury and villa segment.',
    },
  })
  console.log('✓ DRA Homes developer ensured\n')

  // ── 3. Chennai city ID ────────────────────────────────────────────────────
  const chn = await prisma.city.findUnique({ where: { slug: 'chennai' }, select: { id: true } })
  if (!chn) throw new Error('Chennai city not found in DB')
  const CHN = chn.id

  // ── 4. Upsert helper ──────────────────────────────────────────────────────
  let added = 0
  let skipped = 0

  async function upsertTopic(data) {
    const existing = await prisma.topic.findFirst({ where: { slug: data.slug } })
    if (existing) {
      skipped++
      console.log(`  ↩  Skipped (exists): ${data.title.substring(0, 70)}`)
      return
    }
    await prisma.topic.create({ data: { ...data, cityId: CHN, userId: nextUser() } })
    added++
    console.log(`  ✓  Added: ${data.title.substring(0, 80)}`)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DAC DEVELOPERS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── DAC Developers ──────────────────────────────────────────────\n')

  // 1. DAC Prospera — Porur
  await upsertTopic({
    slug:               'dac-prospera-porur-chennai',
    propertyName:       'DAC Prospera',
    title:              'DAC Prospera Porur – India\'s first women-friendly apartments, 2 & 3 BHK from ₹84 L | RERA TN/1/Building/0125/2025',
    description:
      `DAC Developers launched Prospera in April 2025 at Porur, West Chennai — marketing it as India's first women-friendly housing community. RERA registered under TN/1/Building/0125/2025.\n\nThe project spans 1.66 acres offering 165 units in 2 BHK (932–1,010 sq ft) and 3 BHK (1,145–1,186 sq ft) configurations. Pricing runs from ₹84 L to ₹1.24 Cr at approximately ₹8,440/sq ft. Possession is expected from January 2027.\n\nThe women-friendly concept includes a dedicated She-Corner, women-only gym, crèche with live camera access for working mothers, and robotic vacuum cleaners in each apartment. Porur's location near DLF, Olympia Tech Park, and Ramachandra Medical Centre makes it attractive for IT and healthcare professionals.\n\nHas anyone visited the site? The concept sounds interesting but the ₹8,440/sq ft pricing for Porur seems at a premium compared to nearby projects. Would appreciate genuine feedback on build quality and whether the women-centric amenities are more marketing or actually functional.`,
    developerSlug:      'dac-developers',
    developerName:      'DAC Developers',
    propertyType:       'APARTMENT',
    address:            'Porur, West Chennai',
    priceMin:           8400000,
    priceMax:           12400000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DAC Prospera Porur – 2 & 3 BHK Apartments from ₹84 L | RERA 2025',
    metaDesc:           'DAC Prospera at Porur, Chennai — 165 units, 2 & 3 BHK (932–1,186 sq ft) from ₹84 L. Women-friendly community near DLF & Olympia Tech Park. RERA TN/1/Building/0125/2025.',
  })

  // 2. DAC Napa Valley — Sithalapakkam, OMR
  await upsertTopic({
    slug:               'dac-napa-valley-sithalapakkam-omr-chennai',
    propertyName:       'DAC Napa Valley',
    title:              'DAC Napa Valley Sithalapakkam OMR – 2 & 3 BHK from ₹58 L | RERA TN/35/Building/0166/2025',
    description:
      `DAC Developers' Napa Valley launched in May 2025 at Sithalapakkam (Ottiambakkam), just off the Old Mahabalipuram Road (OMR). RERA registration: TN/35/Building/0166/2025.\n\nThe project covers 0.99 acres with 110 units spread across stilt + 4 floors. Sizes range across 2 and 3 BHK configurations with pricing starting from ₹58 L up to ₹1.05 Cr at approximately ₹6,810/sq ft. Possession is targeted for May–June 2027.\n\nSithalapakkam on the inner OMR is increasingly popular for mid-budget buyers — it offers OMR connectivity without the premium pricing of Sholinganallur or Perumbakkam. The area has good access to IT parks and is close to schools and hospitals.\n\nAt ₹6,810/sq ft, Napa Valley is priced competitively for the inner OMR belt. Has anyone inquired or booked? Keen to understand the actual construction progress and DAC's track record in delivering on time — their other projects like DAC Alder and DAC Hillgrove seem to have reasonable reviews.`,
    developerSlug:      'dac-developers',
    developerName:      'DAC Developers',
    propertyType:       'APARTMENT',
    address:            'Sithalapakkam (Ottiambakkam Road), OMR, Chennai South',
    priceMin:           5800000,
    priceMax:           10500000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DAC Napa Valley Sithalapakkam OMR – 2 & 3 BHK from ₹58 L | RERA 2025',
    metaDesc:           'DAC Napa Valley at Sithalapakkam (Ottiambakkam), OMR Chennai — 110 units, 2 & 3 BHK from ₹58 L. Possession June 2027. RERA TN/35/Building/0166/2025.',
  })

  // 3. DAC Santa Clara — Kattupakkam, OMR (VILLA)
  await upsertTopic({
    slug:               'dac-santa-clara-kattupakkam-omr-chennai',
    propertyName:       'DAC Santa Clara',
    title:              'DAC Santa Clara Kattupakkam OMR – 3 & 4 BHK independent villas from ₹1.30 Cr | RERA TNRERA/35/BLG/0337/2025',
    description:
      `DAC Santa Clara is a 2025 luxury independent villa launch at Kattupakkam, a quiet pocket near OMR in Chennai South. RERA number: TNRERA/35/BLG/0337/2025. Possession expected August 2027.\n\nThe project offers 60 independent 3 and 4 BHK villas spread across 2 acres, sized 1,445–2,010 sq ft, priced from ₹1.30 Cr to ₹2.17 Cr. Amenities include a swimming pool, AC gym, and multi-purpose hall.\n\nKattupakkam sits approximately 3 km from OMR and is within 10–15 minutes of Sholinganallur, Medavakkam, and Siruseri SIPCOT — making it accessible for tech park employees while offering the independent villa lifestyle. Independent villas at this price point in Chennai's OMR corridor are rare and have historically seen strong appreciation.\n\nWith only 60 units this will be a tight-knit community. Curious if anyone has visited — how does the villa layout and site feel compare to the renders? Also interested in understanding the land ownership structure and whether it includes a common amenity area or is purely residential plots with built villas.`,
    developerSlug:      'dac-developers',
    developerName:      'DAC Developers',
    propertyType:       'VILLA',
    address:            'Kattupakkam, near OMR, Chennai South',
    priceMin:           13000000,
    priceMax:           21700000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DAC Santa Clara Kattupakkam – 3 & 4 BHK Villas from ₹1.30 Cr | RERA 2025',
    metaDesc:           'DAC Santa Clara at Kattupakkam, OMR Chennai — 60 independent 3 & 4 BHK villas (1,445–2,010 sq ft) from ₹1.30 Cr. Possession August 2027. RERA TNRERA/35/BLG/0337/2025.',
  })

  // 4. DAC Cambridge — Semmancheri, OMR
  await upsertTopic({
    slug:               'dac-cambridge-semmancheri-omr-chennai',
    propertyName:       'DAC Cambridge',
    title:              'DAC Cambridge Semmancheri OMR – 2 & 3 BHK apartments from ₹83 L | RERA TNRERA/35/LO/2844/2025',
    description:
      `DAC Cambridge is a mixed residential development at Semmancheri on the OMR South corridor, with RERA layout registration in 2025 (TNRERA/35/LO/2844/2025) and the apartment building registered in 2026 (TNRERA/29/BLG/0041/2026), reflecting a phased approach.\n\nThe project offers 140 apartments across three blocks (A, B, C) in stilt + 5-floor format. Unit sizes cover 958–1,551 sq ft in 2 and 3 BHK configurations, with pricing between ₹83 L and ₹1.66 Cr at approximately ₹7,000–₹10,800/sq ft. Possession is targeted for August 2027.\n\nSemmancheri is a well-established micro-market on the OMR–Pallavaram–Thoraipakkam connector road, with proximity to Sholinganallur, Perumbakkam, and Medavakkam. It offers better value than the prime OMR stretch while retaining good connectivity to the IT corridor.\n\nDAC's phased RERA approach — layout first, then building — is common for mixed (apartment + villa) developments in Tamil Nadu. Has anyone been tracking this project? Would like to understand how the community layout is planned and whether the villa component (if any) is on a separate parcel.`,
    developerSlug:      'dac-developers',
    developerName:      'DAC Developers',
    propertyType:       'APARTMENT',
    address:            'Semmancheri, OMR, Chennai South',
    priceMin:           8300000,
    priceMax:           16600000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DAC Cambridge Semmancheri OMR – 2 & 3 BHK from ₹83 L | RERA 2025',
    metaDesc:           'DAC Cambridge at Semmancheri, OMR Chennai — 140 units, 2 & 3 BHK (958–1,551 sq ft) from ₹83 L. Possession August 2027. RERA TNRERA/35/LO/2844/2025.',
  })

  // 5. DAC Luxe — Perungalathur
  await upsertTopic({
    slug:               'dac-luxe-perungalathur-chennai',
    propertyName:       'DAC Luxe',
    title:              'DAC Luxe Perungalathur – Boutique 2 & 3 BHK from ₹1.06 Cr | RERA TNRERA/35/BLG/0112/2026',
    description:
      `DAC Luxe is one of the developer's 2026 launches under their "1,000 homes" expansion plan, located at Perungalathur in Southwest Chennai near the Sriperumbudur Road corridor. RERA: TNRERA/35/BLG/0112/2026. Possession from September 2027 to February 2028.\n\nA boutique development of 58 units at 967 sq ft per home in 2 and 3 BHK configurations, priced between ₹1.06 Cr and ₹1.28 Cr. The "Luxe" branding positions this at the premium end of the Perungalathur micro-market.\n\nPerungalathur is a rapidly developing suburb in Southwest Chennai, known for affordability relative to the OMR/ECR corridors. The Sriperumbudur link makes it viable for employees of the manufacturing and industrial belt. GST Road connectivity ensures access to the airport and Tambaram hub.\n\nThe pricing at ₹1 Cr+ for a sub-1,000 sq ft apartment in Perungalathur raises questions about whether the location supports this price point long-term. Curious if anyone has compared this to other 2026 launches in the area — and what DAC is offering as justification for the premium positioning here.`,
    developerSlug:      'dac-developers',
    developerName:      'DAC Developers',
    propertyType:       'APARTMENT',
    address:            'Perungalathur, Southwest Chennai',
    priceMin:           10600000,
    priceMax:           12800000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DAC Luxe Perungalathur – 2 & 3 BHK Apartments from ₹1.06 Cr | RERA 2026',
    metaDesc:           'DAC Luxe at Perungalathur, Southwest Chennai — 58 boutique units, 967 sq ft, 2 & 3 BHK from ₹1.06 Cr. Possession 2027–28. RERA TNRERA/35/BLG/0112/2026.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // DRA HOMES
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── DRA Homes ────────────────────────────────────────────────────\n')

  // 6. DRA Astra — Madhavaram
  await upsertTopic({
    slug:               'dra-astra-madhavaram-chennai',
    propertyName:       'DRA Astra',
    title:              'DRA Astra Madhavaram – 132 Vastu-compliant 2 & 3 BHK near upcoming metro from ₹83 L | RERA TN/29/Building/0018/2025',
    description:
      `DRA Homes officially launched DRA Astra on January 31, 2025 at Madhavaram High Road in North Chennai — their first major residential launch of the year. RERA: TN/29/Building/0018/2025. Possession expected October 2027.\n\nThe project sits on 1.22 acres offering 132 apartments: 2 BHK+2T (1,066–1,275 sq ft) and 3 BHK+2T/3T (1,345–1,695 sq ft). Pricing starts at ₹83 L and goes up to ₹1.31 Cr at approximately ₹6,599/sq ft. All homes are 100% Vastu-compliant and three-side ventilated.\n\nThe standout selling point is adjacency to an upcoming Chennai metro station on the Phase 2 expansion, which if delivered will dramatically improve connectivity from Madhavaram to the rest of the city. Amenities include a Zen garden, AC gym, open amphitheater, and dedicated play areas — 30+ total amenities for a project of this size.\n\nMadhavaram is North Chennai's fastest-growing residential corridor, with prices rising steadily as infrastructure catches up. DRA has a long track record in North Chennai (including DRA Polaris and DRA Trinity). Has anyone visited Astra? Want to understand the exact distance to the proposed metro station and whether that line is actually on schedule.`,
    developerSlug:      'dra-homes',
    developerName:      'DRA Homes',
    propertyType:       'APARTMENT',
    address:            'Madhavaram High Road, Madhavaram, Chennai North',
    priceMin:           8300000,
    priceMax:           13100000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DRA Astra Madhavaram – 2 & 3 BHK Apartments from ₹83 L | RERA 2025',
    metaDesc:           'DRA Astra at Madhavaram, North Chennai — 132 units, 2 & 3 BHK (1,066–1,695 sq ft) from ₹83 L near upcoming metro. Possession October 2027. RERA TN/29/Building/0018/2025.',
  })

  // 7. DRA Inara — Navalur, OMR (VILLA)
  await upsertTopic({
    slug:               'dra-inara-navalur-omr-chennai',
    propertyName:       'DRA Inara',
    title:              'DRA Inara Navalur OMR – DRA\'s first luxury independent villa community, 118 villas from ₹1.70 Cr | RERA TN/35/Building/0053/2025',
    description:
      `DRA Inara is a landmark launch — DRA Homes' first-ever luxury independent villa community, launched in March 2025 at Navalur on the OMR IT corridor. This is a ₹100 Crore project investment. RERA: TN/35/Building/0053/2025.\n\nSpread across 6 acres, Inara offers 118 independent villas in 3 BHK (1,952 sq ft), 4 BHK, and 5 BHK (up to 3,697 sq ft) configurations with complete land ownership per villa. Pricing starts from ₹1.70 Cr for the 3 BHK variants. The project includes 50+ amenities and sits in one of OMR's most established stretches near Navalur junction.\n\nDRA pivoting to independent villas after decades of apartment delivery is significant. Navalur is a mature micro-market on the OMR South corridor with excellent access to Sholinganallur IT parks, Siruseri SIPCOT, and the proposed metro extension. Independent villas at 6 acres with 118 units means reasonable density and good green space per home.\n\nWith DRA's 38-year track record in apartments, how well does their execution translate to villa construction? The land ownership model (vs leasehold/strata) needs to be verified in the agreement documents. Has anyone attended the launch event or visited the site? Would like buyer perspectives on the villa specifications and pricing.`,
    developerSlug:      'dra-homes',
    developerName:      'DRA Homes',
    propertyType:       'VILLA',
    address:            'Navalur, Old Mahabalipuram Road (OMR), Chennai South',
    priceMin:           17000000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DRA Inara Navalur OMR – Luxury Villas from ₹1.70 Cr | RERA 2025',
    metaDesc:           'DRA Inara at Navalur, OMR Chennai — 118 independent 3–5 BHK luxury villas (1,952–3,697 sq ft) from ₹1.70 Cr. DRA\'s first villa community. RERA TN/35/Building/0053/2025.',
  })

  // 8. DRA iHeart — Egattur, Navalur, OMR
  await upsertTopic({
    slug:               'dra-iheart-egattur-omr-chennai',
    propertyName:       'DRA iHeart',
    title:              'DRA iHeart Egattur OMR – Chennai\'s first sea-view residences, 3 & 4 BHK high-rise from ₹2.15 Cr | RERA TNRERA/35/BLG/0293/2025',
    description:
      `DRA iHeart launched October 23, 2025 at Egattur (Navalur area) on the OMR — positioned as "Chennai's first branded sea-view residences." RERA: TNRERA/35/BLG/0293/2025. Possession expected July 2033.\n\nThis is a high-rise of B+S+19 floors offering 271 units across 3.42 acres. Unit sizes: 1,595–2,927 sq ft in 3 BHK and 4 BHK with select maid room configurations. Pricing runs from ₹2.15 Cr to ₹3.41 Cr at approximately ₹8,050/sq ft.\n\nThe "sea-view" branding stems from the OMR South proximity to the Bay of Bengal — upper floors on the 19-storey tower would have unobstructed views depending on orientation. DRA is the first Indian developer to use Slate AI construction intelligence technology, enabling real-time build quality monitoring.\n\nAt ₹2.15–3.41 Cr for a Chennai apartment, this is firmly in the luxury bracket and will compete with projects like Casagrand Titanium and Godrej Park Estate on OMR. The 2033 possession (8 years out) is a long commitment — longer than typical Chennai projects. Has anyone evaluated iHeart? Is the sea-view claim validated by the floor plan data, and how does Slate AI actually translate to buyer benefit during construction?`,
    developerSlug:      'dra-homes',
    developerName:      'DRA Homes',
    propertyType:       'APARTMENT',
    address:            'Egattur, Navalur, Old Mahabalipuram Road (OMR), Chennai South',
    priceMin:           21500000,
    priceMax:           34100000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DRA iHeart Egattur OMR – Sea-View 3 & 4 BHK from ₹2.15 Cr | RERA 2025',
    metaDesc:           'DRA iHeart at Egattur, OMR Chennai — 271 units, 3 & 4 BHK (1,595–2,927 sq ft) high-rise from ₹2.15 Cr. Chennai\'s first sea-view residences. RERA TNRERA/35/BLG/0293/2025.',
  })

  // 9. DRA Marina 100 — Egattur / Navalur, OMR
  await upsertTopic({
    slug:               'dra-marina-100-egattur-navalur-omr-chennai',
    propertyName:       'DRA Marina 100',
    title:              'DRA Marina 100 Egattur OMR – Boutique 100-home community, 2 & 3 BHK from ₹1.03 Cr | RERA TNRERA/35/BLG/0115/2026',
    description:
      `DRA Marina 100 is a deliberately limited boutique development — exactly 100 homes in Egattur on the OMR South corridor, launched with RERA registration in 2026 (TNRERA/35/BLG/0115/2026). Possession expected February 2031.\n\nUnit configurations are 2 BHK (1,245 sq ft) and 3 BHK (1,938 sq ft), priced from ₹1.03 Cr to ₹2.79 Cr on the Rajiv Gandhi Salai. The exclusivity of exactly 100 homes means the community clubhouse, pool, and amenities serve a far smaller resident base than typical apartment complexes in this corridor.\n\nEgattur/Navalur on the OMR is one of Chennai South's most active real estate micro-markets — well past the congestion of Perumbakkam and Sholinganallur, with good access to SIPCOT Siruseri and the existing IT campuses along Old Mahabalipuram Road. DRA has two simultaneous launches here (iHeart and Marina 100), suggesting confidence in the micro-market absorption.\n\nThe name "Marina 100" is interesting — does it imply proximity to Marina Beach or is it purely branding? Also wondering how the ₹1.03–2.79 Cr range is so wide for what seems like two configuration types. Would appreciate any info from people who have attended site visits or enquired about unit allocation.`,
    developerSlug:      'dra-homes',
    developerName:      'DRA Homes',
    propertyType:       'APARTMENT',
    address:            'Egattur, Navalur, Rajiv Gandhi Salai (OMR), Chennai South',
    priceMin:           10300000,
    priceMax:           27900000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'DRA Marina 100 Egattur OMR – Boutique 2 & 3 BHK from ₹1.03 Cr | RERA 2026',
    metaDesc:           'DRA Marina 100 at Egattur, OMR Chennai — 100 exclusive 2 & 3 BHK units (1,245–1,938 sq ft) from ₹1.03 Cr. Possession Feb 2031. RERA TNRERA/35/BLG/0115/2026.',
  })

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log(`\n${'═'.repeat(60)}`)
  console.log(`✅  Done — ${added} added, ${skipped} skipped`)
  console.log(`${'═'.repeat(60)}\n`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
