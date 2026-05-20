/**
 * seed-hyderabad-villas.js
 *
 * Adds verified Hyderabad VILLA and PLOT topics to the database.
 * Projects cross-verified against developer websites, TS-RERA portal,
 * MagicBricks, 99acres, Square Yards (May 2026).
 *
 * New developers created: Rajapushpa Properties, Vertex Homes, Incor Infrastructure
 * Existing developers used: Aparna, Ramky Group, Prestige, DLF
 *
 * Corridors covered:
 *   West  — Mokila, Gopanpally, Tellapur
 *   South — Maheshwaram, Harshaguda, Korremula, Tukkuguda, Rajendranagar, Kothur
 *   North — Medchal
 *
 * Skipped (insufficient data / not true villas):
 *   My Home Bhooja sky-villas (within apartment towers)
 *   Aliens Space Station sky-villas (within apartment towers)
 *   Brigade Gateway Neopolis (apartment duplex project)
 *   Godrej Madison Avenue (apartments only)
 *   Incorville Chapter 1 (RERA unconfirmed)
 *   Aparna Elixir (RERA unconfirmed)
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ── Hyderabad seed users ────────────────────────────────────────────────────
// Created fresh with Telugu/Hyderabad-region names; spread authorship across topics.
const HYD_USERS = [
  { name: 'Ravi Teja Reddy',       email: 'ravi.teja.reddy.hyd@gmail.com'       },
  { name: 'Srikanth Rao',           email: 'srikanth.rao.hyd@gmail.com'           },
  { name: 'Padmaja Reddy',          email: 'padmaja.reddy.hyd@gmail.com'          },
  { name: 'Venkatesh Babu',         email: 'venkatesh.babu.hyd@gmail.com'         },
  { name: 'Swapna Reddy',           email: 'swapna.reddy.hyd@gmail.com'           },
  { name: 'Suresh Chandra Goud',    email: 'suresh.chandra.goud.hyd@gmail.com'    },
  { name: 'Madhavi Latha',          email: 'madhavi.latha.hyd@gmail.com'          },
  { name: 'Krishna Murthy',         email: 'krishna.murthy.hyd@gmail.com'         },
  { name: 'Saritha Devi',           email: 'saritha.devi.hyd@gmail.com'           },
  { name: 'Prasad Rao',             email: 'prasad.rao.hyd@gmail.com'             },
  { name: 'Nagarjuna Reddy',        email: 'nagarjuna.reddy.hyd@gmail.com'        },
  { name: 'Bhavani Shankar',        email: 'bhavani.shankar.hyd@gmail.com'        },
  { name: 'Rajesh Babu',            email: 'rajesh.babu.hyd@gmail.com'            },
  { name: 'Hymavathi Rao',          email: 'hymavathi.rao.hyd@gmail.com'          },
  { name: 'Chandra Sekhar',         email: 'chandra.sekhar.hyd@gmail.com'         },
  { name: 'Lavanya Reddy',          email: 'lavanya.reddy.hyd@gmail.com'          },
  { name: 'Srinivasa Rao',          email: 'srinivasa.rao.hyd@gmail.com'          },
  { name: 'Radhika Krishna',        email: 'radhika.krishna.hyd@gmail.com'        },
  { name: 'Mahesh Reddy',           email: 'mahesh.reddy.hyd@gmail.com'           },
  { name: 'Asha Latha',             email: 'asha.latha.hyd@gmail.com'             },
  { name: 'Rambabu Naidu',          email: 'rambabu.naidu.hyd@gmail.com'          },
  { name: 'Sirisha Reddy',          email: 'sirisha.reddy.hyd@gmail.com'          },
  { name: 'Harikrishna Rao',        email: 'harikrishna.rao.hyd@gmail.com'        },
  { name: 'Pavani Goud',            email: 'pavani.goud.hyd@gmail.com'            },
  { name: 'Venkataramana Reddy',    email: 'venkataramana.reddy.hyd@gmail.com'    },
]

let userIds = []
let uIdx = 0
const nextUser = () => userIds[uIdx++ % userIds.length]

async function main() {
  console.log('=== Seed: Hyderabad Villa & Plot Projects ===\n')

  // ── 1. Create / fetch Hyderabad seed users ────────────────────────────────
  console.log('── Creating Hyderabad users ─────────────────────────────────────\n')
  for (const u of HYD_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      userIds.push(existing.id)
      console.log(`  ↩  Existing: ${u.name} (${u.email})`)
    } else {
      const created = await prisma.user.create({ data: { name: u.name, email: u.email } })
      userIds.push(created.id)
      console.log(`  ✓  Created:  ${u.name} (${u.email})`)
    }
  }
  console.log(`\n  ${userIds.length} Hyderabad users ready\n`)

  // ── 2. Ensure new developers ──────────────────────────────────────────────
  await prisma.developer.upsert({
    where: { slug: 'rajapushpa' },
    update: {},
    create: {
      slug: 'rajapushpa',
      name: 'Rajapushpa Properties',
      hq: 'Hyderabad, Telangana',
      description:
        'Rajapushpa Properties is a Hyderabad-based developer known for premium residential communities in the Financial District and Tellapur micro-market. Their projects consistently command top-tier pricing in West Hyderabad.',
    },
  })
  console.log('✓ Rajapushpa Properties developer ensured')

  await prisma.developer.upsert({
    where: { slug: 'vertex-homes' },
    update: {},
    create: {
      slug: 'vertex-homes',
      name: 'Vertex Homes',
      hq: 'Hyderabad, Telangana',
      description:
        'Vertex Homes is a Hyderabad-focused developer specialising in villa and plotted developments along the South ORR corridor — particularly Maheshwaram and Tukkuguda — near the Pharma City and IT hardware park clusters.',
    },
  })
  console.log('✓ Vertex Homes developer ensured')

  await prisma.developer.upsert({
    where: { slug: 'incor' },
    update: {},
    create: {
      slug: 'incor',
      name: 'Incor Infrastructure',
      hq: 'Hyderabad, Telangana',
      description:
        'Incor Infrastructure (also known as INDIS) is a Hyderabad developer active in plotted and villa segments across South and North Hyderabad. Their INDIS brand focuses on HMDA/RERA-approved gated plotted communities.',
    },
  })
  console.log('✓ Incor Infrastructure developer ensured\n')

  // ── 3. Hyderabad city ID ──────────────────────────────────────────────────
  const hyd = await prisma.city.findUnique({ where: { slug: 'hyderabad' }, select: { id: true } })
  if (!hyd) throw new Error('Hyderabad city not found in DB')
  const HYD = hyd.id

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
    await prisma.topic.create({ data: { ...data, cityId: HYD, userId: nextUser() } })
    added++
    console.log(`  ✓  Added: ${data.title.substring(0, 80)}`)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // WEST CORRIDOR — Mokila · Gopanpally · Tellapur · Financial District
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── West Hyderabad ──────────────────────────────────────────────\n')

  await upsertTopic({
    slug:               'aparna-western-meadows-phase-4-mokila-hyderabad',
    propertyName:       'Aparna Western Meadows Phase 4',
    title:              'Aparna Western Meadows Phase 4 – Villa plots at Mokila near ORR | RERA P02400001099',
    description:
      `Aparna Constructions' flagship plotted community returns with Phase 4 at Mokila village on the Kondakal–Shankarpalli Road, Ranga Reddy district. Spread across 37+ acres, this RERA-registered phase (P02400001099) continues the success of the earlier three phases which are all sold out and delivered.\n\nPlot sizes range from 182 to 693 sq yd (about 1,638–6,237 sq ft), covering a wide budget spectrum. The township sits close to the Nehru ORR and the upcoming Nagulapalli MMTS station, making it an attractive long-term land investment in the rapidly developing Mokila–Tellapur corridor.\n\nPhases I–III residents report excellent civic infrastructure, 30/40/60 ft internal roads, underground drainage, and 24×7 security. Has anyone booked in Phase 4? What are the current rates per sq yd and is there any flexibility on floor plan/builder tie-ups for villa construction?`,
    developerSlug:      'aparna',
    developerName:      'Aparna Constructions',
    propertyType:       'PLOT',
    address:            'Kondakal–Shankarpalli Road, Mokila Village, Ranga Reddy',
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Aparna Western Meadows Phase 4 Mokila – Villa Plots | ₹ Price, RERA',
    metaDesc:           'Aparna Western Meadows Phase 4 at Mokila, Ranga Reddy — 182–693 sq yd RERA-approved villa plots near ORR. Phases I–III delivered. RERA P02400001099.',
  })

  await upsertTopic({
    slug:               'aparna-amber-villas-gopanpally-hyderabad',
    propertyName:       'Aparna Amber Villas',
    title:              'Aparna Amber Villas Gopanpally – 99 ultra-luxury 5 BHK villas from ₹24.4 Cr | RERA P02400008385',
    description:
      `Aparna Infrahousing's Amber Villas is positioning itself as one of Hyderabad's most premium villa addresses — 99 sprawling 5 BHK villas spread across 25.52 acres in Gopanpally, just 4 km from the Nehru ORR and minutes from the Financial District and HITEC City.\n\nVilla sizes range from 4,855 sq ft to over 11,141 sq ft, with pricing starting at ₹24.4 Cr and going up to ₹32 Cr. The project was launched in April 2024 with possession targeted for April 2029. RERA registration: P02400008385.\n\nAt these price points Amber Villas competes with ultra-luxury villa communities in Banjara Hills and Jubilee Hills, but offers far more land per home and community greens. The Gopanpally micro-market has seen consistent appreciation with ORR connectivity and proximity to the tech corridor.\n\nFor buyers considering this — has anyone visited the sample villa? How does the construction quality and material spec compare to the brochure promise? Also curious about the clubhouse scale given only 99 homes.`,
    developerSlug:      'aparna',
    developerName:      'Aparna Constructions',
    propertyType:       'VILLA',
    address:            'Gopanpally, West Hyderabad, Ranga Reddy',
    priceMin:           244000000,
    priceMax:           320000000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Aparna Amber Villas Gopanpally – 5 BHK Villas from ₹24.4 Cr | RERA',
    metaDesc:           'Aparna Amber Villas at Gopanpally, Hyderabad — 99 ultra-luxury 5 BHK villas (4,855–11,141 sq ft) from ₹24.4 Cr. Possession April 2029. RERA P02400008385.',
  })

  await upsertTopic({
    slug:               'rajapushpa-serene-dale-tellapur-hyderabad',
    propertyName:       'Rajapushpa Serene Dale',
    title:              'Rajapushpa Serene Dale Tellapur – 254 luxury 4 & 5 BHK villas from ₹6.29 Cr opposite Financial District | RERA P01100005584',
    description:
      `Rajapushpa Properties' Serene Dale is one of the most talked-about villa launches in West Hyderabad — 254 villas in 28.67 acres directly opposite the Financial District at Tellapur, Ranga Reddy.\n\nConfig: 4 BHK villas (4,020–4,660 sq ft) priced ₹6.29–6.80 Cr and 5 BHK villas (5,460–6,495 sq ft) from ₹7.20–7.80 Cr. Possession is targeted for December 2027. RERA number: P01100005584.\n\nThe location is exceptional — Tellapur sits between the Financial District and Kokapet, making it convenient for employees of the large tech parks on this corridor. Prices reportedly jumped 21% in Q4 2025 alone, reflecting the demand surge for villa inventory in this micro-market.\n\nAmenoties include a 45,000 sq ft clubhouse, 80% open space, private gardens per villa, and a dedicated EV charging infrastructure. Has anyone registered or visited the model villa? Would like to understand the construction timeline and the actual buyer profile at these price points.`,
    developerSlug:      'rajapushpa',
    developerName:      'Rajapushpa Properties',
    propertyType:       'VILLA',
    address:            'Tellapur Village, near Financial District, Ranga Reddy',
    priceMin:           62900000,
    priceMax:           78000000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Rajapushpa Serene Dale Tellapur – 4 & 5 BHK Villas from ₹6.29 Cr | RERA',
    metaDesc:           'Rajapushpa Serene Dale at Tellapur, Hyderabad — 254 luxury 4 & 5 BHK villas (4,020–6,495 sq ft) from ₹6.29 Cr. Opposite Financial District. RERA P01100005584.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // SOUTH CORRIDOR — Maheshwaram · Harshaguda · Korremula · Tukkuguda · Kothur
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── South Hyderabad ─────────────────────────────────────────────\n')

  await upsertTopic({
    slug:               'ramky-discovery-city-the-huddle-maheshwaram-hyderabad',
    propertyName:       'Ramky Discovery City – The Huddle',
    title:              'Ramky Discovery City – The Huddle Maheshwaram | 3 & 4 BHK villas in 600-acre township | RERA P02400000023',
    description:
      `Ramky's The Huddle is the villa phase within Ramky Discovery City — a massive 600-acre master-planned township at Maheshwaram, just off ORR Exit 14 near Shamshabad airport.\n\nThe Huddle offers 228 villas in 3 BHK (2,038–2,600 sq ft) and 4 BHK (2,500–3,870 sq ft) configurations. RERA registration: P02400000023. Current pricing is around ₹3.75 Cr onwards for 3 BHK and higher for the 4 BHK variants.\n\nBeing part of the 600-acre Discovery City ecosystem gives residents access to a hospital, international school, retail high street, and multi-level clubhouse — amenities typically not available in standalone villa projects. The south ORR corridor here has gained a lot of traction since the Pharma City and Hyderabad Aerospace and Precision Engineering (HAPE) cluster announcements.\n\nHas anyone taken possession here or is currently in the construction phase? Would love to hear about construction quality, Ramky's project management, and how the township's social infrastructure (school, hospital) is developing.`,
    developerSlug:      'ramky-group',
    developerName:      'Ramky Group',
    propertyType:       'VILLA',
    address:            'Maheshwaram, near ORR Exit 14, Ranga Reddy',
    priceMin:           37500000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Ramky Discovery City The Huddle Maheshwaram – 3 & 4 BHK Villas | RERA',
    metaDesc:           'Ramky Discovery City The Huddle at Maheshwaram — 228 villas (3 & 4 BHK) from ₹3.75 Cr in 600-acre township near Shamshabad. RERA P02400000023.',
  })

  await upsertTopic({
    slug:               'ramky-the-reserve-harshaguda-hyderabad',
    propertyName:       'Ramky The Reserve',
    title:              'Ramky The Reserve Harshaguda – 99 ultra-luxury villas from ₹4.4 Cr near airport | RERA P02400010049',
    description:
      `Ramky's most exclusive villa product yet — The Reserve at Harshaguda, South Hyderabad, close to RGIA. Just 99 villas spread across 19.2 acres, in 4 BHK (5,500 sq ft) and 5 BHK (8,000 sq ft) configurations, with private gardens, courtyards, and private terraces.\n\nPricing: ₹4.4 Cr to ₹6.4 Cr. Possession targeted December 2030. RERA: P02400010049. All villas are Vaastu-compliant and include EV charging and solar provision as standard.\n\nHarshaguda's proximity to the upcoming Hyderabad AI City (4th City project) and the established pharma and aerospace clusters in Shamshabad is driving significant investor interest. Ramky's track record in this corridor with Discovery City (The Huddle) gives buyers confidence in execution.\n\nWith only 99 units this is a boutique community — clubhouse and amenities will feel exclusive. Has anyone enquired about The Reserve? Trying to understand how it compares to Vertex Florenza and Prestige Bellagio at similar price points in the south corridor.`,
    developerSlug:      'ramky-group',
    developerName:      'Ramky Group',
    propertyType:       'VILLA',
    address:            'Harshaguda, South Hyderabad, near RGIA, Ranga Reddy',
    priceMin:           44000000,
    priceMax:           64000000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Ramky The Reserve Harshaguda – Ultra-Luxury Villas from ₹4.4 Cr | RERA',
    metaDesc:           'Ramky The Reserve at Harshaguda, South Hyderabad — 99 boutique 4 & 5 BHK luxury villas (5,500–8,000 sq ft) from ₹4.4 Cr near airport. RERA P02400010049.',
  })

  await upsertTopic({
    slug:               'ramky-the-spectrum-korremula-hyderabad',
    propertyName:       'Ramky The Spectrum',
    title:              'Ramky The Spectrum Korremula – 151 triplex 4 BHK villas in East Hyderabad | RERA P02200010330',
    description:
      `Ramky Estates is extending its villa portfolio to East Hyderabad with The Spectrum at Korremula, Uppal Extension — a departure from their usual south-ORR geography. The project features 151 exclusive 4 BHK triplex villas spread over 13.38 acres, each with 2,457–2,913 sq ft of super built-up area plus villa plots ranging 181–467 sq yd.\n\nPossession is targeted for September 2030. RERA: P02200010330. Each villa comes with EV charging points, solar provision, and access to a 16,830 sq ft clubhouse.\n\nKorremula in the Uppal Extension micro-market is emerging as a quality residential cluster with strong connectivity to the IT hubs of L.B. Nagar, Kompally Road, and Uppal. The east Hyderabad belt is relatively underserved by villa products compared to the west and south, so Ramky's entry here is interesting.\n\nLooking for anyone who has attended the site visit or pre-launch enquiry. How does the triplex layout work practically — is there a rooftop terrace included? Also interested to hear about the plotted component of the project alongside the villas.`,
    developerSlug:      'ramky-group',
    developerName:      'Ramky Group',
    propertyType:       'VILLA',
    address:            'Korremula, Uppal Extension, East Hyderabad',
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Ramky The Spectrum Korremula – 4 BHK Triplex Villas East Hyderabad | RERA',
    metaDesc:           'Ramky The Spectrum at Korremula, Hyderabad — 151 exclusive 4 BHK triplex villas (2,457–2,913 sq ft) in 13.38 acres. Possession Sept 2030. RERA P02200010330.',
  })

  await upsertTopic({
    slug:               'vertex-florenza-maheshwaram-hyderabad',
    propertyName:       'Vertex Florenza',
    title:              'Vertex Florenza Maheshwaram – 105 villa community | 4 & 5 BHK villas from ₹5.5 Cr near airport | RERA P02400009023',
    description:
      `Vertex Homes launched Florenza in September 2024 — 105 premium 4 & 5 BHK villas spread over 16.5 acres at Maheshwaram/Tukkuguda, just 3 minutes from the ORR and 5 minutes from RGIA. Plot areas range 355–468 sq yd with villa sizes between 3,285 and 4,212 sq ft.\n\nPricing: ₹5.5 Cr to ₹7.05 Cr (approximately ₹5,100/sq ft). Possession targeted September 2029. RERA: P02400009023.\n\nVertex Homes has been active in the south ORR corridor for several years and has a reasonably good track record on delivery. Florenza is positioned around the Hyderabad Hardware Park and AI Fourth City developments that are transforming the Maheshwaram–Tukkuguda belt.\n\nWith 105 homes this is a well-sized community — not too small to feel isolated, not too large to lose the villa character. Has anyone visited the site or model home? Specifically curious about: (1) construction quality — what brands for plumbing/electrical? (2) actual water and power situation at the site today, and (3) builder flexibility on interior customisation.`,
    developerSlug:      'vertex-homes',
    developerName:      'Vertex Homes',
    propertyType:       'VILLA',
    address:            'Maheshwaram–Tukkuguda Road, near ORR & RGIA, Ranga Reddy',
    priceMin:           55000000,
    priceMax:           70500000,
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Vertex Florenza Maheshwaram – 4 & 5 BHK Villas from ₹5.5 Cr | RERA',
    metaDesc:           'Vertex Florenza at Maheshwaram, South Hyderabad — 105 premium 4 & 5 BHK villas (3,285–4,212 sq ft) from ₹5.5 Cr near airport & ORR. RERA P02400009023.',
  })

  await upsertTopic({
    slug:               'vertex-district-tukkuguda-hyderabad',
    propertyName:       'Vertex District',
    title:              'Vertex District Tukkuguda – 119 RERA-approved gated villa plots near Srisailam Highway | RERA P02400008942',
    description:
      `Vertex District is a plotted development by Vertex Homes at Tukkuguda, 750 m off the Srisailam Highway inside the ORR — strategically located to capture the IT Hardware Park and AI Fourth City (South Hyderabad) growth wave.\n\n119 villa plots with 150/100/80 ft internal roads, underground drainage, and a gated perimeter. RERA registered: P02400008942. Possession targeted September 2027.\n\nThe Tukkuguda micro-market sits at the intersection of the south ORR, the Pharma City Special Economic Zone, and the emerging IT hardware cluster. Land prices in this belt have seen consistent upward pressure, making plotted investments here attractive for end-users who want to build custom villas as well as investors looking at long-term capital appreciation.\n\nFor anyone considering a plot purchase here: what is the current market rate per sq yd? How does Vertex District compare to INDIS Springdale (also in Maheshwaram) in terms of layout quality and amenities? Also, what's the timeline for the area's GHMC/DTCP approval for residential construction?`,
    developerSlug:      'vertex-homes',
    developerName:      'Vertex Homes',
    propertyType:       'PLOT',
    address:            'Tukkuguda, near Srisailam Highway, South Hyderabad, Ranga Reddy',
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Vertex District Tukkuguda – Gated Villa Plots South Hyderabad | RERA',
    metaDesc:           'Vertex District at Tukkuguda, Hyderabad — 119 RERA-approved gated villa plots near ORR & Srisailam Highway. Possession Sept 2027. RERA P02400008942.',
  })

  await upsertTopic({
    slug:               'indis-springdale-maheshwaram-hyderabad',
    propertyName:       'INDIS Springdale',
    title:              'INDIS Springdale Maheshwaram – 319 delivered villa plots near Pharma City | RERA P02400004149',
    description:
      `INDIS Springdale by Incor Infrastructure is a completed gated plotted layout at Dubbacherla/Mansanpally Crossroads, Maheshwaram, Ranga Reddy — 319 HMDA-approved villa plots across 21.75 acres, with possession already handed over.\n\nRERA: P02400004149 (HMDA Approval: HMDA/Lr/No/13/LO/Plg/HMDA/2021). Plot sizes are 180–230 sq yd, with clear title and HMDA-approved layout. The location is near the Maheshwaram SEZ and RGIA, with easy access to the ORR.\n\nFor buyers looking to build their own home rather than buy a pre-built villa, Springdale is one of the more credible options in the south Hyderabad plot market — HMDA approval ensures the layout is legally compliant and construction-ready. INDIS also has Amara Villas in Medchal (villa product) and Divino in Nallagandla.\n\nHas anyone built their house here already? Looking to understand: (1) what construction is happening on-ground at Springdale today, (2) current resale rates per sq yd, and (3) how the Maheshwaram SEZ employment situation is affecting residential demand in this belt.`,
    developerSlug:      'incor',
    developerName:      'Incor Infrastructure',
    propertyType:       'PLOT',
    address:            'Dubbacherla, Mansanpally Crossroads, Maheshwaram, Ranga Reddy',
    constructionStatus: 'POSSESSION_DONE',
    isPublished:        true,
    metaTitle:          'INDIS Springdale Maheshwaram – 319 Delivered Villa Plots | RERA',
    metaDesc:           'INDIS Springdale by Incor at Maheshwaram, Hyderabad — 319 HMDA-approved delivered villa plots (180–230 sq yd) near Pharma City & RGIA. RERA P02400004149.',
  })

  await upsertTopic({
    slug:               'prestige-nirvana-rajendranagar-hyderabad',
    propertyName:       'Prestige Nirvana',
    title:              'Prestige Nirvana Rajendranagar – 248 villa plots from ₹2.25 Cr | Prestige\'s first Hyderabad plotted project | RERA P02400000393',
    description:
      `Prestige Nirvana at Sagar Hills, Rajendranagar Mandal marked Prestige Group's entry into the Hyderabad plotted development market and has since been fully delivered (possession November 2024). The project covers 39 acres with 248 villa plots ranging from 2,250 sq ft to over 8,100 sq ft.\n\nRERA: P02400000393. Pricing on delivery ranged from ₹2.25 Cr for smaller plots to ₹8.10 Cr for the larger plots — these are now in the active resale market.\n\nRajendranagar–Budvel is a well-established south Hyderabad residential belt connected to both the ORR and the inner ring road. The Prestige brand commands a premium in the resale market and Nirvana's delivery on time has reinforced buyer confidence.\n\nFor current owners at Prestige Nirvana: how has construction progressed on-site since possession? What are current rates per sq ft for construction in this area? Also, how does the road connectivity and water supply situation compare to when you booked?`,
    developerSlug:      'prestige',
    developerName:      'Prestige Group',
    propertyType:       'PLOT',
    address:            'Sagar Hills, Rajendranagar Mandal, South Hyderabad, Ranga Reddy',
    priceMin:           22500000,
    priceMax:           81000000,
    constructionStatus: 'POSSESSION_DONE',
    isPublished:        true,
    metaTitle:          'Prestige Nirvana Rajendranagar Hyderabad – Villa Plots from ₹2.25 Cr | RERA',
    metaDesc:           'Prestige Nirvana at Rajendranagar, Hyderabad — 248 delivered villa plots (2,250–8,100+ sq ft) from ₹2.25 Cr. Possession done Nov 2024. RERA P02400000393.',
  })

  await upsertTopic({
    slug:               'prestige-bellagio-rajendra-nagar-hyderabad',
    propertyName:       'Prestige Bellagio',
    title:              'Prestige Bellagio Rajendra Nagar – 119 G+2 villas within Prestige City Hyderabad | RERA P02400006711',
    description:
      `Prestige Bellagio is the villa component of The Prestige City Hyderabad — the group's first large-scale integrated township in the city, located at Rajendra Nagar/Budvel in South Hyderabad.\n\nThe villa phase offers 119 G+2 independent villas across 24 acres, surrounded by 4,647 apartments in the same master-planned township. Possession is targeted for July 2026. RERA: P02400006711.\n\nWhat makes Bellagio compelling is the township ecosystem — residents get access to a large clubhouse, retail precinct, and all the amenities of the integrated development while living in an independent villa format. Rajendra Nagar is a well-established residential belt with strong social infrastructure (schools, hospitals, markets).\n\nFor buyers who prefer a villa with all township amenities included in the maintenance structure, Bellagio offers a genuinely differentiated product in Hyderabad's south market. How does Bellagio's pricing compare to standalone villa communities like Ramky The Reserve or Vertex Florenza which are farther south? Keen to hear from anyone who has visited or booked.`,
    developerSlug:      'prestige',
    developerName:      'Prestige Group',
    propertyType:       'VILLA',
    address:            'Rajendra Nagar / Budvel, South Hyderabad, Ranga Reddy',
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Prestige Bellagio Rajendra Nagar Hyderabad – 119 Villas | RERA P02400006711',
    metaDesc:           'Prestige Bellagio at Rajendra Nagar, Hyderabad — 119 G+2 villas within Prestige City integrated township. Possession July 2026. RERA P02400006711.',
  })

  await upsertTopic({
    slug:               'dlf-gardencity-kothur-hyderabad',
    propertyName:       'DLF Gardencity',
    title:              'DLF Gardencity Kothur – 152-acre HMDA-approved plotted township | South ORR Hyderabad',
    description:
      `DLF Gardencity at Nandigama/Kothur in South Hyderabad is one of the largest branded plotted developments in the city — 1,172 villa plots across a sprawling 152.63 acres, with HMDA approval and clear title.\n\nPlot sizes range from 1,494 to 2,403 sq ft. The layout is fully handed over, with internal roads, compound walls, and basic civic infrastructure in place. Current resale market is active with prices significantly higher than the original launch rates.\n\nDLF's entry into Hyderabad's plotted segment with Gardencity was a significant brand endorsement for the south ORR corridor. Kothur sits on the ORR South near the Shamshabad–Kothur belt, close to the Hyderabad–Bengaluru highway, making it attractive for end-users and long-term investors.\n\nFor current plot owners: (1) What is the going resale rate per sq ft at Gardencity today? (2) Has DLF completed all the promised infrastructure within the layout? (3) With the AI Fourth City and Pharma City expansions nearby, how has the area changed over the last 2 years? Looking for genuine on-ground feedback from residents or investors.`,
    developerSlug:      'dlf',
    developerName:      'DLF',
    propertyType:       'PLOT',
    address:            'Nandigama / Kothur, South Hyderabad, Ranga Reddy',
    constructionStatus: 'POSSESSION_DONE',
    isPublished:        true,
    metaTitle:          'DLF Gardencity Kothur Hyderabad – 152-Acre Villa Plots Township | HMDA',
    metaDesc:           'DLF Gardencity at Kothur, South Hyderabad — 1,172 HMDA-approved villa plots (1,494–2,403 sq ft) across 152 acres. Fully delivered. Active resale market.',
  })

  // ══════════════════════════════════════════════════════════════════════════
  // NORTH CORRIDOR — Medchal
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n─── North Hyderabad ─────────────────────────────────────────────\n')

  await upsertTopic({
    slug:               'indis-amara-villas-medchal-hyderabad',
    propertyName:       'Indis Amara Villas',
    title:              'Indis Amara Villas Medchal – 42 boutique luxury villas in North Hyderabad | RERA P02200010660',
    description:
      `INDIS (Incor Infrastructure) launched Amara Villas at Medchal in September 2025 — a boutique community of just 42 luxury villas across 7.25 acres in North Hyderabad. Villa sizes range from 5,535 to 6,088 sq ft. RERA: P02200010660. Possession targeted September 2031.\n\nMedchal is a rapidly developing node in North Hyderabad — well connected to Kompally, Secunderabad, and the Outer Ring Road. The corridor is attracting working professionals who work in core Hyderabad and want a quieter, more spacious residential environment compared to the congested inner suburbs.\n\nWith only 42 homes, Amara Villas is among the most exclusive villa projects in Hyderabad's north zone. The project is very new (RERA September 2025) so the builder is in the early stages of construction. Incor has an established presence in Hyderabad with INDIS Springdale (delivered) and other projects.\n\nFor anyone who has enquired or attended the launch event: what is the asking price per sq ft and total price range? How does Incor's construction quality hold up in practice? North Hyderabad doesn't have many large villa supply pipelines — how does Amara Villas stack up against the few options available here?`,
    developerSlug:      'incor',
    developerName:      'Incor Infrastructure',
    propertyType:       'VILLA',
    address:            'Medchal, North Hyderabad, Medchal-Malkajgiri District',
    constructionStatus: 'ON_TRACK',
    isPublished:        true,
    metaTitle:          'Indis Amara Villas Medchal Hyderabad – 42 Luxury Villas | RERA P02200010660',
    metaDesc:           'Indis Amara Villas by Incor at Medchal, North Hyderabad — 42 boutique luxury villas (5,535–6,088 sq ft). Launched Sept 2025. Possession Sept 2031. RERA P02200010660.',
  })

  // ── Final summary ─────────────────────────────────────────────────────────
  const total = await prisma.topic.count({
    where: { city: { slug: 'hyderabad' }, propertyType: { in: ['VILLA', 'PLOT'] } },
  })
  const userCount = await prisma.user.count()

  console.log('\n' + '═'.repeat(60))
  console.log(`DONE — Added: ${added} | Skipped: ${skipped}`)
  console.log(`Total Hyderabad VILLA+PLOT topics in DB: ${total}`)
  console.log(`Total users in DB: ${userCount}`)
  console.log('═'.repeat(60) + '\n')
}

main().catch(console.error).finally(() => prisma.$disconnect())
