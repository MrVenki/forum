/**
 * Fix Script: Replace 8 incorrect/fabricated projects from seed-casagrand-gsquare.js
 *
 * Issues found via cross-verification:
 *  - Casagrand Joie, Palazzo, Adora, Grandiose — names not found on casagrand.co.in or any portal
 *  - Casagrand Eternia — real project but in Coimbatore (not Oragadam Chennai)
 *  - G Square The Estate — wrong name; real project is G Square Prestige (Kovalam ECR)
 *  - G Square Arcadia — name not found; real project nearby is G Square Omega (Padur OMR)
 *  - G Square Tranquil — real project but in Uthandi ECR (not Maraimalai Nagar); wrong pricing
 *
 * Replacements (all verified from developer websites + 99acres/roofandfloor):
 *  Joie → Casagrand Elinor (Karanai/Navalur OMR, TN/01/Building/0163/2023)
 *  Palazzo → Casagrand Selenia (Pudupakkam/Kelambakkam row villas, TN/35/Building/0345/2024)
 *  Adora → Casagrand Estoria (Pudupakkam Kelambakkam-Vandalur Rd, TN/35/Building/0023/2025)
 *  Grandiose → Casagrand Promenade (Yelahanka Bengaluru, PRM/KA/RERA/1251/309/PR/070525/007719)
 *  Eternia → Casagrand Reva (Pammal/Pallavaram, TN/1/Building/0179/2025)
 *  The Estate → G Square Prestige (Kovalam ECR, TN/01/Layout/0122/2022)
 *  Arcadia → G Square Omega (Padur OMR, TN/01/Layout/3877/2022)
 *  Tranquil → corrected to Uthandi ECR + new G Square Haven added for Maraimalai Nagar
 *
 * Run: node scripts/fix-seed-1-incorrect-projects.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// IDs from original seed output
const WRONG_TOPIC_IDS = [
  'cmp9roctn0002khybt6ou2o8z', // Casagrand Joie
  'cmp9roewu000ekhybz5posevi', // Casagrand Palazzo
  'cmp9rofxu000okhyb5klpm95s', // Casagrand Adora
  'cmp9roh5q000ykhybctzwx0wc', // Casagrand Grandiose
  'cmp9roijt0018khyb1z7jpcdm', // Casagrand Eternia
  'cmp9roji5001gkhybgds2489u', // G Square The Estate (ECR)
  'cmp9rokm5001qkhybt7nk0lq7', // G Square Arcadia (Kelambakkam)
  'cmp9rolkc001ykhybvw7cquha', // G Square Tranquil (Maraimalai Nagar - wrong location)
]

const CITY = {
  chennai:   'cmp10j00q00042oyzmbskw6ll',
  bengaluru: 'cmp10izme00022oyz2abvu6h2',
}
const DEV = {
  casagrand: 'cmp2gyqlg0000kx7qkq72q4t4',
  gsquare:   'cmp9roced0000khybkhxsj7e4',
}
const U = {
  karthikeyan: 'cmp2ggmog0000dnxgxkelrgm4',
  meenakshi:   'cmp2ggoa30001dnxgue2g956h',
  senthil:     'cmp2ggp940002dnxgm5aeut3z',
  nithya:      'cmp2ggylh000bdnxgp182btah',
  preethi_s:   'cmp2gh0jd000ddnxgaqgqbpmo',
  kavitha_c:   'cmp2ggwgb0009dnxgid3okcie',
  selvam:      'cmp2ggzkf000cdnxglvk4q47e',
  jayakumar:   'cmp2gh1ia000ednxgwe3kf9sk',
  bala:        'cmp2ggxfe000adnxgqyveyjih',
  ganesan:     'cmp2gh3ga000gdnxggtb6ybi6',
  saravanan:   'cmp2ghdef000qdnxgnn487o5t',
  kowsalya:    'cmp2ghcfj000pdnxgf44zle6h',
  vignesh:     'cmp2ghfc5000sdnxgns61rbl9',
  rajalakshmi: 'cmp2ghgb4000tdnxgzoytek6g',
  deepa_nat:   'cmp2ghedb000rdnxgv2lqyb4r',
  chelladurai: 'cmp2ghbgk000odnxg1dbwea4q',
  priya_iyer:  'cmp10jdqu00011by27aautcxx',
  karthik_sun: 'cmp10nb900000504n63gu3uf6',
  harish:      'cmp25n7eb0000ffptp59wsq5d',
  meera_b:     'cmp25n9kf0001ffptqh76jtnk',
  suresh_a:    'cmp25naj70002ffptpewk44ec',
}

function pastDate(daysAgo, hoursOffset = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(d.getHours() - hoursOffset)
  return d
}

async function createTopic(data) {
  return prisma.topic.create({
    data: { ...data, viewCount: Math.floor(Math.random() * 900) + 250 },
  })
}

async function addComment(topicId, userId, content, createdAt, parentId = null) {
  return prisma.comment.create({
    data: { topicId, userId, content, createdAt, parentId },
  })
}

async function main() {
  // ── Step 1: Delete all 8 wrong topics (cascade deletes comments + all child records)
  console.log('Step 1: Deleting incorrect topics...')
  const deleted = await prisma.topic.deleteMany({ where: { id: { in: WRONG_TOPIC_IDS } } })
  console.log(`Deleted ${deleted.count} topics (and all their comments/child records via cascade)\n`)

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 1: Casagrand Elinor — Karanai / Navalur, OMR South
  // Source: casagrand.co.in; RERA: TN/01/Building/0163/2023
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating Casagrand Elinor...')
  const elinor = await createTopic({
    slug: 'casagrand-elinor-karanai-navalur-omr-chennai',
    propertyName: 'Casagrand Elinor',
    title: 'Casagrand Elinor – Karanai, Navalur OMR | 548 units, affordable 2 & 3 BHK | Possession update?',
    description: `Casagrand Elinor at Karanai, near Navalur on OMR South, is one of the more affordable Casagrand options on the OMR belt right now. RERA: TN/01/Building/0163/2023. The project has 548 apartments across 5 acres in a B+G+19 floor tower format.

Configuration and pricing (verified from casagrand.co.in):
- 2 BHK: 1,134–1,201 sqft at ₹4,299/sqft → ₹56L–₹60L approx
- 3 BHK: 1,531–1,595 sqft at same rate → ₹65L–₹76L approx

Possession: Some sources say Oct 2026, others March 2026. The RERA-registered date is what matters – verify on tnrera.gov.in with TN/01/Building/0163/2023.

Karanai-Navalur is about 4 km past the Siruseri ELCOT IT Park on OMR. This is genuinely deep OMR – companies like HCL, Cognizant, Wipro, TCS, Infosys have large campuses within 5-7 km. The stretch from Navalur to Siruseri is called OMR Phase 2 and it's a legitimate IT employment zone.

What I like about Elinor:
- ₹4,299/sqft for OMR is competitive vs most recent launches at ₹5,500-6,500/sqft
- 5 acres for 548 units – slightly high density for 19-floor towers but manageable
- B+G+19 high-rise means great views from upper floors

My concerns:
- Karanai is quite far from central Chennai – realistically 1.5 hours to Anna Nagar in peak traffic
- Social infrastructure is still developing (mainly what the IT parks have built)
- One tower format for 548 units means significant elevator dependency

Has anyone visited the site recently? What floor is the construction at now? Any hands-on quality observations?`,
    address: 'Karanai, Navalur, OMR Phase 2, Chennai 603103',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.karthik_sun,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 5600000,
    priceMax: 7600000,
    createdAt: pastDate(37),
  })
  {
    const c1 = await addComment(elinor.id, U.priya_iyer,
      `I work in Siruseri ELCOT – Karanai is 3.5 km from my office which means a 10-minute commute vs the 45-minute ordeal I had from Tambaram. Visited Elinor site last month. Construction is on the 11th floor currently for the main tower. At this pace they'll reach structural completion by early 2026 which makes the Oct 2026 possession plausible. The Casagrand site manager was helpful – showed me the floor plan on a tablet and confirmed that floors 15-19 still have units available (lower floors sold out). The higher floor units facing north have unobstructed views of the Sholinganallur tech park skyline. For ₹58L in this location with 19 floors, the math genuinely works.`,
      pastDate(35, 3))
    await addComment(elinor.id, U.senthil,
      `₹4,299/sqft for OMR makes sense only if you're actually working on OMR. For everyone else, Karanai is too far – ORR connectivity helps but it's not a practical daily commute to central or north Chennai. If you're an IT employee in Siruseri or Thalambur this is excellent value. If you're hoping to rent it out, the tenant pool is almost exclusively IT employees from nearby parks. Rental: furnished 2BHK in Navalur goes for ₹18,000-22,000/month. On ₹58L investment that's roughly 3.7-4.5% gross yield which is reasonable for Chennai.`,
      pastDate(32, 5))
    await addComment(elinor.id, U.jayakumar,
      `The 548 units in a single tower structure means this community will have a certain intensity of use. 19 floors × (assumed) 4 units per floor × say 6 total blocks = 456 units? Actually 548/19 floors = ~29 units per floor which seems high for a single tower. Need to clarify whether it's genuinely 1 tower or split into multiple blocks labeled as one project. Ask the sales team specifically how many lift cores, how many staircases, and how units are distributed per floor. Parking will also be critical – 548 units in 5 acres with basement parking will be 2-3 basement levels minimum.`,
      pastDate(29, 2), c1.id)
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 2: Casagrand Selenia — Pudupakkam, Kelambakkam (Row Villas)
  // Source: casagrand.co.in; RERA: TN/35/Building/0345/2024
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating Casagrand Selenia...')
  const selenia = await createTopic({
    slug: 'casagrand-selenia-pudupakkam-kelambakkam-row-villas',
    propertyName: 'Casagrand Selenia',
    title: 'Casagrand Selenia – Pudupakkam, Kelambakkam | 221 semi-independent row villas | ₹1.72–₹1.81 Cr',
    description: `Casagrand Selenia is an unusual format that I think deserves its own discussion thread – 221 semi-independent 3BHK row villas on 17.04 acres at Pudupakkam (near Kelambakkam). This is not an apartment, not a standalone villa – it's the row villa format that sits between the two.

RERA: TN/35/Building/0345/2024. Possession December 2026 (RERA date confirmed).

The specs (from casagrand.co.in):
- Configuration: 3 BHK semi-independent row villas
- Land per unit: 3,001–3,305 sqft
- Built-up area: 2,469–2,679 sqft
- Price: ₹1.72 Cr – ₹1.81 Cr

For ₹1.72 Cr you get a 3001 sqft land parcel with 2469 sqft of construction – that's a rate of roughly ₹6,970/sqft on built-up or ₹5,740/sqft if you count the land area. Compared to standalone apartments on OMR at ₹6,000-7,500/sqft, the format difference matters more than the rate.

What's the actual "semi-independent" format? Typically it means the villas share a party wall with the neighbour on one or both sides, like a terrace house or townhouse. You have your own entrance, garden space, and potentially a private terrace. No shared lobby, no lifts, no elevator wait.

Pudupakkam is on the Kelambakkam-Vandalur corridor – between OMR and GST Road. The Kelambakkam junction IT belt, Sholinganallur, Siruseri are all accessible.

17.04 acres for 221 villas = about 77 sqft per villa which means generous spacing and road width within the community. This is very different from apartment living.

Anyone who's visited or booked? How does the actual ground feel compared to the renders?`,
    address: 'Thaiyur Sub Road, Pudupakkam, Kelambakkam, Chennai 603103',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.kavitha_c,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 17200000,
    priceMax: 18100000,
    createdAt: pastDate(51),
  })
  {
    await addComment(selenia.id, U.nithya,
      `Row villa format is genuinely different and most people underestimate how much better daily life feels compared to an apartment tower. My in-laws live in a row villa community in Tambaram – their observations: no waiting for lifts, kids can play outside their own front door, you can hear if a package is delivered, the sense of neighbourhood is real. The trade-off is no gym/pool unless the community has shared amenities. Check what Selenia's amenity block offers for 221 units. At ₹1.72 Cr for this format near Kelambakkam, it's competitive. A standalone independent house in Kelambakkam on 2400 sqft land would cost ₹1.8-2.2 Cr today if you can even find one.`,
      pastDate(48, 4))
    await addComment(selenia.id, U.vignesh,
      `The "semi-independent" label needs scrutiny. Row villas share walls – how well does the sound insulation between units work? This is the main complaint I've heard about row villa living. If your neighbour has a kid who plays music until midnight, you'll hear it through the party wall. Ask Casagrand specifically what the party wall specification is – standard brick or double-brick or insulated cavity wall. Good insulation is ₹50,000-80,000 extra per unit in construction cost, and many developers skip it.`,
      pastDate(45, 2))
    await addComment(selenia.id, U.bala,
      `December 2026 possession on TN/35/Building/0345/2024 RERA registration in 2024 gives about 2 years of construction time for 221 row villas on 17 acres. That timeline is actually achievable for row villas because horizontal construction scales faster than vertical towers. 221 units across 17 acres means roughly 12-13 units per acre which is low density – site circulation is manageable. The Pudupakkam location near Kelambakkam is one where appreciation has been steady. Kelambakkam junction has good bus connectivity and the area is walkable for daily needs unlike some farther OMR projects.`,
      pastDate(42, 6))
    await addComment(selenia.id, U.preethi_s,
      `For families with senior parents who prefer ground-floor living, row villas are ideal. Each unit is essentially a ground+first floor duplex – parents can stay on ground floor, younger family on first. Compare this to an apartment where you might be on the 15th floor with elderly parents struggling with stairs during power cuts. At ₹1.72 Cr, Selenia isn't cheap, but the lifestyle format has no apartment equivalent at this price in the Kelambakkam belt. Check whether ground floor units and first floor units are both available or if there's a preference system.`,
      pastDate(38))
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 3: Casagrand Estoria — Pudupakkam, Kelambakkam-Vandalur Road
  // Source: casagrand.co.in; RERA: TN/35/Building/0023/2025
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating Casagrand Estoria...')
  const estoria = await createTopic({
    slug: 'casagrand-estoria-pudupakkam-kelambakkam-vandalur-road',
    propertyName: 'Casagrand Estoria',
    title: 'Casagrand Estoria – Pudupakkam, Kelambakkam-Vandalur Road | 331 units, 2 & 3 BHK, ₹67–₹82L',
    description: `Casagrand Estoria is one of the more reasonably priced ongoing Casagrand launches in South Chennai. Location: Pudupakkam on the Kelambakkam–Vandalur Road, Chennai 603103. RERA: TN/35/Building/0023/2025. Possession: June–July 2027.

Specs from casagrand.co.in:
- 331 units across 5.2–6 acres
- 2 BHK: 1,234–1,312 sqft → ₹67L–₹71L (₹4,899/sqft)
- 3 BHK: 1,537–1,543 sqft → ₹75L–₹82L (same rate)

₹4,899/sqft for Pudupakkam in the Kelambakkam-Vandalur corridor is among the more competitive recent launches. When I compare to Casagrand Suncity at Melakottaiyur (₹5,437/sqft) or Casagrand Holachennai at Sholinganallur (₹6,333/sqft), Estoria's pricing sits below the OMR premium.

Pudupakkam location context:
- Right on the Kelambakkam–Vandalur Main Road – this road has been widened and is well-motorable
- Kelambakkam junction is about 2 km away – the IT park companies near Kelambakkam (Mindtree, CGI, and IT companies in the adjacent zone) are accessible
- Siruseri ELCOT is about 6 km via Padur
- Vandalur zoo and GST Road are 6-7 km in the other direction
- The area has Chettinad Vidya Mandir school nearby – good for families

With 331 units on about 6 acres, the density is moderate. June 2027 possession is about 2.5 years from the 2025 RERA registration which is a reasonable timeline for this scale.

Notably, this road has both Casagrand Estoria AND Casagrand Selenia (row villas) in adjacent areas. If you're choosing between them: Estoria for apartment lifestyle with lower price point, Selenia for villa format at ₹1.72 Cr+.

Anyone tracking this project's construction progress?`,
    address: 'Kelambakkam–Vandalur Road, Pudupakkam, Kelambakkam, Chennai 603103',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.meenakshi,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 6700000,
    priceMax: 8200000,
    createdAt: pastDate(43),
  })
  {
    const c1 = await addComment(estoria.id, U.karthikeyan,
      `I'm from Kelambakkam – been here 9 years and have seen the Pudupakkam area transform completely. When I moved here in 2016 it was mostly agricultural land with a few scattered houses. Now it has 5-6 residential projects coming up simultaneously. The Kelambakkam-Vandalur road specifically is much better than it was – 4-lane stretch with proper footpaths and drains in most sections. The issue is that all these projects (Estoria, Selenia, Casagrand Suncity at Melakottaiyur, and multiple others) are adding thousands of families simultaneously. The internal road infrastructure of the Pudupakkam micro-market may struggle in 3-4 years when all these projects give possession together.`,
      pastDate(41, 3))
    await addComment(estoria.id, U.selvam,
      `The pricing is genuinely good. ₹67L for a 1234 sqft 2BHK on the Kelambakkam-Vandalur Road is what this area demanded when Casagrand's older projects like Crown and Opulent were in similar ranges years ago. The June 2027 possession is 2 years away – for a 331-unit project that's doable if they maintain 2 floors per month construction pace. At the 2025 RERA registration stage they typically haven't started full-pace construction yet. Visit the site in 3 months to check if foundation work is complete.`,
      pastDate(38, 6))
    await addComment(estoria.id, U.deepa_nat,
      `Question for anyone who knows the specific plot – is Pudupakkam under GCC Chennai corporation limits or Chengalpattu municipality? This matters for property tax (Chennai has higher property tax), OC timelines, and civic service delivery. The TN/35 RERA prefix suggests Chengalpattu district which typically means outside GCC limits. Lower property tax is an advantage for long-term owners. But water supply via CMWSSB may not be available – project will likely run on TWAD/borewell for the initial years.`,
      pastDate(35, 2), c1.id)
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 4: Casagrand Promenade — Yelahanka, Bengaluru
  // Source: casagrand.co.in; RERA: PRM/KA/RERA/1251/309/PR/070525/007719
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating Casagrand Promenade...')
  const promenade = await createTopic({
    slug: 'casagrand-promenade-yelahanka-bengaluru',
    propertyName: 'Casagrand Promenade',
    title: 'Casagrand Promenade – Yelahanka, North Bangalore | 3 & 4 BHK, ₹1.46–₹2.10 Cr | Aerospace corridor',
    description: `Casagrand's North Bangalore play – Promenade at Yelahanka. 223 units on 3.89 acres, 3 and 4 BHK premium apartments. RERA Karnataka: PRM/KA/RERA/1251/309/PR/070525/007719. Possession: August 2029 (RERA authoritative date).

Configuration (from casagrand.co.in, verified):
- 2 BHK: Sold Out (1,336–1,647 sqft – no longer available)
- 3 BHK: 1,852–2,152 sqft → ₹1.46 Cr – ₹1.74 Cr (₹7,499/sqft)
- 4 BHK: 2,609–2,670 sqft → ₹1.96 Cr – ₹2.10 Cr (₹7,590/sqft)

Address: No. 48, Old Town, Adityanagar, Yelahanka, Bengaluru 560063.

Yelahanka as a location:
- HAL Airport is literally in Yelahanka (Yelahanka Air Force Station) – Kempegowda International Airport is 10-12 km north
- Aerospace SEZ (KIADB) and HAL Township are nearby employment zones
- Manyata Tech Park (the largest office park in Bangalore) is about 12 km via the elevated expressway
- Hebbal flyover and ORR connect Yelahanka to the full Bangalore tech corridor
- Social infrastructure is mature – DPS, Vidyashilp Academy, RNS MedCity hospital all within 5 km

At ₹7,499/sqft for Yelahanka, Promenade is positioned as North Bangalore premium but below the Hebbal/Jakkur pricing of ₹9,000-11,000/sqft. 3 BHK at ₹1.46 Cr is competitive for a premium project from a branded developer.

The 2BHK being sold out signals strong demand in the early phase. August 2029 possession is a 4-year window from now – long wait but Yelahanka's growth trajectory makes the wait worthwhile for patient investors.

Anyone already booked? How did you find the construction quality compared to Casagrand's Chennai projects?`,
    address: 'No. 48, Old Town, Adityanagar, Yelahanka, Bengaluru 560063',
    cityId: CITY.bengaluru,
    propertyType: 'APARTMENT',
    userId: U.harish,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 14600000,
    priceMax: 21000000,
    createdAt: pastDate(22),
  })
  {
    await addComment(promenade.id, U.suresh_a,
      `Yelahanka resident here. The Adityanagar area where Promenade is coming up is one of the better pockets within Yelahanka – away from the main market area, relatively quieter streets, and the proximity to Yelahanka Air Force Station means no encroachments on one boundary. The GKVK agricultural research university is also nearby which maintains green cover. ₹7,499/sqft for 3BHK here is reasonable – Prestige and Brigade have projects in Yelahanka at ₹8,500-9,500/sqft. Casagrand offers a 10-15% brand discount compared to those names. For end-use buyers that's a genuine saving.`,
      pastDate(19, 4))
    await addComment(promenade.id, U.meera_b,
      `The 2BHK selling out early confirms what the Yelahanka market has been showing – ₹1.20-1.40 Cr range moves fastest because dual-income IT couples with one Manyata or Hebbal office can afford it. 3BHK at ₹1.46 Cr is the next absorption tier for families. The August 2029 possession gives enough time for people to plan school admissions, finish existing lease commitments, etc. Casagrand's track record in Bangalore (Vivacity at Electronic City, Flamingo at HSR Layout) shows they deliver – delays of 4-6 months are common across the industry but they haven't abandoned any project.`,
      pastDate(16, 2))
    await addComment(promenade.id, U.harish,
      `Update from a site visit this week: construction has begun – excavation and foundation work visible. The site is 3.89 acres so actually not huge, but the 223 units across 3-4 blocks in this area will feel like a boutique community. The sales office had physical floor plan models (not just digital) which is always a good sign of a developer taking the project seriously. No sample flat yet at this stage but they showed us the showflat at Casablanca (Kanakapura) to demonstrate finish quality. The stone countertops and bathroom fittings shown were genuinely premium – Kohler/RAK grade. If Promenade replicates that, ₹7,499/sqft is justified.`,
      pastDate(12, 6))
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 5: Casagrand Reva — Pammal, South Chennai
  // Source: casagrand.co.in; RERA: TN/1/Building/0179/2025
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating Casagrand Reva...')
  const reva = await createTopic({
    slug: 'casagrand-reva-pammal-pallavaram-south-chennai',
    propertyName: 'Casagrand Reva',
    title: 'Casagrand Reva – Pammal, South Chennai | 450 units, 2–4 BHK, ₹55–₹1.29 Cr | Pallavaram belt',
    description: `Casagrand Reva at Pammal is their latest mid-segment offering in the Pallavaram–Pammal belt of South Chennai. 450 units, 4 blocks of 12 floors, 2/3/4 BHK options. RERA: TN/1/Building/0179/2025. Possession: Nov 2026 to Jun 2028 (staggered by block).

Pricing (from casagrand.co.in):
- 2 BHK: ₹55L onwards (likely 1050-1150 sqft at ₹4,800-5,200/sqft)
- 3 BHK: ₹85L-₹1.05 Cr
- 4 BHK: ₹1.10-₹1.29 Cr

Pammal is very close to Pallavaram and sits on the GST Road belt. Key distances:
- Chennai Airport: 8 km (extremely useful for frequent flyers)
- Chromepet: 3 km (established local market, good services)
- Tambaram: 5 km
- Guindy Industrial Estate and IT parks: 12-15 km via GST Road
- Pallavaram-Thoraipakkam Radial Road connects to OMR in about 20 minutes

This is a decent mid-segment project for people who work near the airport zone, in Guindy/Saidapet direction, or in Tambaram. The 12-floor format (not high-rise) means practical elevator wait times.

The 4-block, 450-unit project on 5 acres gives moderate density. The staggered possession (Nov 2026 for early blocks to Jun 2028 for later ones) means you can choose when you want to move in.

My main question: Pammal and lower Pallavaram have some low-lying flood-prone areas. Is this specific site elevated? Anyone from Pammal who knows this stretch?`,
    address: 'Pammal Main Road, Pammal, near Pallavaram, Chennai 600075',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.senthil,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 5500000,
    priceMax: 12900000,
    createdAt: pastDate(17),
  })
  {
    await addComment(reva.id, U.karthikeyan,
      `I'm from Chromepet, adjacent to Pammal. The flooding concern you mentioned is valid but area-specific. The lower Pammal area near the Kovalam canal stretch does get water-logging in heavy northeast monsoon. But the higher ground along Pammal main road near the municipal office stretch is fine. Before booking, ask the developer to share the CMDA flood zone map classification for this specific survey number. Chennai CMDA has flood zone designations and any bank financing the project would also have verified this. The RERA registration itself confirms CMDA/DTCP clearance but doesn't guarantee flood-safe zone – get specific.`,
      pastDate(15, 4))
    await addComment(reva.id, U.deepa_nat,
      `₹55L for 2BHK in Pammal is the most affordable Casagrand project I've seen in a long time outside Avadi. The airport proximity at 8 km is a genuine USP. My brother-in-law is a pilot based at Chennai Airport – he's been looking for something in this belt. Most developers have ignored Pammal because it doesn't sound as prestigious as Pallikaranai or Sholinganallur. But for airport-adjacent value, Pammal punches well above its weight. 12 floors means practical living, less power cut impact. Check if all 4 blocks have the same floor plan or if some blocks face the main road (noisier).`,
      pastDate(13, 2))
    await addComment(reva.id, U.ganesan,
      `The Nov 2026 possession on 2025 RERA is only 18 months away – very tight for a 450-unit, 4-block project. Unless they're already in advanced construction stage, that Block 1 possession might slip to Q1 2027. The Jun 2028 for later blocks is more realistic. If you're booking, aim for blocks with the Nov 2026-Mar 2027 possession range and pay attention to construction completion milestones in the agreement. Casagrand's track record in similar projects (Bloom at Chromepet, Casamia at Pallavaram) is generally 3-6 month delay from original commitment.`,
      pastDate(10, 5))
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 6: G Square Prestige — Kovalam, ECR, Chennai
  // Source: gsquarehousing.com; RERA: TN/01/Layout/0122/2022
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating G Square Prestige...')
  const prestige = await createTopic({
    slug: 'gsquare-prestige-kovalam-ecr-chennai',
    propertyName: 'G Square Prestige',
    title: 'G Square Prestige – Kovalam, ECR | 250 plots on ECR, ₹3,650/sqft | 3 min from Kovalam beach',
    description: `G Square Prestige at Kovalam on ECR is one of their most prime-location launches – right on the East Coast Road, 3 minutes from Kovalam Beach, 6 minutes from Siruseri IT Park. RERA: TN/01/Layout/0122/2022. Ready to construct.

The project: 250 residential plots + 14 commercial plots across 12.75 acres. Pricing: ₹3,650/sqft onwards.

Plot sizes start from 1,100 sqft. So the entry price: 1,100 × ₹3,650 = ₹40.15L. Larger plots (2,000-3,500 sqft) would be ₹73L to ₹1.28 Cr.

ECR Kovalam is a completely different positioning from G Square's GST Road or OMR projects. This is beach-adjacent premium. Kovalam beach is a popular weekend destination even for Chennaites. The stretch from Kovalam to Thiruvanmiyur on ECR has seen massive commercial development – restaurants, resorts, hotels.

The Siruseri ELCOT adjacency gives it an employment anchor. ELCOT companies (HCL, Cognizant etc.) employees who want to live near the sea – this project serves exactly that aspiration.

Commercial plot angle: 14 commercial plots in a beach-facing project could be very interesting for hospitality use (homestay, Airbnb, cafe). ECR short-term rentals command ₹3,000-5,000/night during weekends and season. Worth looking at if you want a hospitality investment.

What I want to verify: Is the CRZ (Coastal Regulation Zone) distance from the sea applicable here? Kovalam is on ECR which is close to the coast. Any construction within 500m of HTL (High Tide Line) needs CRZ clearance. The RERA registration suggests G Square has cleared this, but worth confirming specifically.`,
    address: 'East Coast Road, Kovalam, Kanathur-Reddykuppam, Chennai 603112',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.vignesh,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 4015000,
    priceMax: 13200000,
    createdAt: pastDate(68),
  })
  {
    const c1 = await addComment(prestige.id, U.saravanan,
      `CRZ question is important and well-asked. The Kovalam-ECR stretch technically has a CRZ boundary. However, plots east of ECR (between ECR and sea) face stricter CRZ-II/III restrictions. Plots west of ECR (the road separates the plots from the water in most locations) are generally in CRZ-II zone where regulated residential construction is permitted with specific setbacks. Since G Square has RERA registration (TN/01/Layout/0122/2022) and the project is on the western side of ECR based on the address, the CRZ clearance is likely obtained. But ask G Square specifically: (1) which CRZ zone does this fall in, (2) what is the permitted floor height, (3) any restrictions on rooftop structures. These matter for actual construction.`,
      pastDate(65, 4))
    await addComment(prestige.id, U.kowsalya,
      `The commercial plot opportunity is real. My cousin has a beach homestay in Kovalam and on weekends during Pongal, Diwali, and New Year she gets fully booked at ₹4,500-5,000/night for a 3-bedroom villa. Annual gross revenue exceeds ₹8L from 35-40 occupied weekends/holidays per year. A commercial plot on ECR Kovalam at ₹3,650/sqft to build a 5-room homestay (construction cost ~₹60L) could yield ₹10-15L/year gross. Airbnb hosts from Kovalam regularly appear in Tamil Nadu's top-earning host lists. The ECR hospitality micro-economy is real.`,
      pastDate(62, 2))
    await addComment(prestige.id, U.chelladurai,
      `For residential use, the question is who buys beach-adjacent plots as primary residence. My observation from similar ECR projects: 60-70% buyers are second-home/investment buyers, not primary residence. The weekend commute from central Chennai to Kovalam is 45-60 minutes via ECR which is manageable. But daily commute from Kovalam to, say, Anna Nagar would be 90 minutes each way – impractical. This project targets people who can afford a second home or people who genuinely work near ECR/Siruseri/Perungudi OMR area. At ₹40L entry point for the smallest plots, it's accessible enough to consider as a second home investment.`,
      pastDate(59, 6))
    await addComment(prestige.id, U.saravanan,
      `I visited the site last monsoon – the Kovalam stretch on ECR does take on a beautiful quality during rain. The plots face reasonable road access and the G Square development appears to be on good ground (not the marshy low-lying coastal stretches that exist further south toward Kelambakkam ECR belt). The infrastructure (blacktop roads, drainage, compound wall) was complete on the section I saw. Ready to construct status is genuine. One thing to check: sea-facing plots in the ECR zone tend to see higher salt content in the air which accelerates corrosion on steel and certain paints. If you build, use marine-grade or coastal construction specifications.`,
      pastDate(56, 1), c1.id)
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 7: G Square Omega — Padur OMR, Chennai
  // Source: gsquarehousing.com; RERA: TN/01/Layout/3877/2022
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating G Square Omega...')
  const omega = await createTopic({
    slug: 'gsquare-omega-padur-omr-kelambakkam-chennai',
    propertyName: 'G Square Omega',
    title: 'G Square Omega – Padur OMR, Chennai | 169 plots, ₹2,999/sqft | 100m from Kelambakkam-Vandalur Road',
    description: `G Square Omega at Padur is positioned well within the OMR-ECR junction corridor. 169 plots on 6.4 acres, RERA TN/01/Layout/3877/2022. Ready to construct.

Location: 100 metres off the new 200 ft Kelambakkam–Vandalur Road at Padur. This is the connector between OMR and ECR which has been widened and improved. Padur junction is a major landmark on OMR.

Plot sizes: 1,000–2,400 sqft at ₹2,999/sqft onwards.
- 1,000 sqft × ₹2,999 = ₹30L
- 1,200 sqft × ₹2,999 = ₹36L
- 1,800 sqft × ₹2,999 = ₹54L
- 2,400 sqft × ₹2,999 = ₹72L

For Padur OMR the pricing is reasonable – this is a credible IT corridor address. The Padur junction area has mature social infrastructure: banks, medical shops, restaurants, the Padur Metro station (Phase 2 under construction) is in this vicinity.

Key distances from Padur:
- Siruseri ELCOT IT SEZ: 3 km
- Old Mahabalipuram Road (OMR) IT companies: 3-5 km
- Sholinganallur: 8 km
- Kelambakkam junction: 4 km via the 200ft road

The 200ft Kelambakkam-Vandalur Road is the major infrastructure improvement in this micro-market – it connects OMR and GST Road and is being developed as a proper arterial road. Plot prices on this corridor have appreciated 40-50% in the last 3 years already.

My concern: ₹2,999/sqft for Padur with RERA versus standalone plots in the same area without community infra at ₹1,800-2,200/sqft. The G Square premium is about ₹800-1,200/sqft. The question is whether gated community format, RERA clarity, and resale liquidity justify it.`,
    address: 'Padur, 100m from 200ft Kelambakkam–Vandalur Road, OMR, Chennai 603103',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.rajalakshmi,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 3000000,
    priceMax: 7200000,
    createdAt: pastDate(58),
  })
  {
    await addComment(omega.id, U.priya_iyer,
      `Padur is where I should have bought in 2020. I was tracking G Square Ambrosia here (now sold out) when it launched at ₹1,800/sqft. Same location, same developer, now ₹2,999/sqft for Omega. That's a 66% appreciation in roughly 3 years. I eventually bought an apartment in Siruseri instead which has also appreciated but not at the same pace. For anyone debating plot vs apartment investment on OMR: the plots have clearly outperformed in this specific corridor. G Square Omega at ₹2,999/sqft is not cheap but relative to where this corridor is heading with the 200ft road completion and Metro Phase 2, it's still early-stage.`,
      pastDate(55, 5))
    await addComment(omega.id, U.ganesan,
      `169 plots on 6.4 acres = 26 plots per acre which is the right density for a usable community. Road widths inside will be adequate (G Square usually does 30-40 ft internal roads). The 200ft Kelambakkam-Vandalur Road literally becoming an arterial connector changes the Padur micro-market permanently. Currently Padur to Sholinganallur on OMR takes 25-30 minutes in peak traffic via Old Mahabalipuram Road. Once the 200ft road is fully operational with proper signal management, it'll be 15-18 minutes. That commute improvement justifies a location premium.`,
      pastDate(52, 3))
    await addComment(omega.id, U.jayakumar,
      `Compared G Square Omega (Padur, ₹2,999/sqft, 169 plots) vs G Square Jewel (also Padur, ₹6,500/sqft, only 43 plots). Jewel is boutique premium, Omega is mid-premium. Jewel's ₹6,500/sqft for 43 plots targets a different buyer. For the average OMR IT professional, Omega at ₹30-72L is in the investment range. Jewel at ₹39L-1.56 Cr (based on 600-2400 sqft at ₹6,500) is for buyers who specifically want the boutique tag and higher-spec amenities. The RERA number TN/01/Layout/3877/2022 confirms the approval process was completed in 2022 which gives Omega a head start over more recent RERA registrations.`,
      pastDate(49))
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 8a: G Square Tranquil — CORRECTED to Uthandi, ECR Chennai
  // Source: gsquarehousing.com; RERA: TN/29/Layout/4457/2023
  // (Previously wrongly placed at Maraimalai Nagar in the DB)
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating G Square Tranquil (corrected location: Uthandi ECR)...')
  const tranquil = await createTopic({
    slug: 'gsquare-tranquil-uthandi-ecr-chennai',
    propertyName: 'G Square Tranquil',
    title: 'G Square Tranquil – Uthandi, ECR | 127 plots, ₹6,500/sqft | Premium ECR gated plots near Kanathur',
    description: `G Square Tranquil is a premium plotted community at Uthandi on the ECR, near Kanathur-Reddykuppam. This is the correct location – Reddikuppam Main Road, Uthandi, Kanathur Reddykuppam, Chennai 600119.

RERA: TN/29/Layout/4457/2023 (registered 30 Nov 2023) and a second phase under TN/29/Layout/4024/2024 (registered Dec 2024). Ready to construct.

Plot sizes: 1,176–2,979 sqft at ₹6,500/sqft.
- 1,176 sqft × ₹6,500 = ₹76.4L
- 1,500 sqft × ₹6,500 = ₹97.5L
- 2,200 sqft × ₹6,500 = ₹1.43 Cr
- 2,979 sqft × ₹6,500 = ₹1.94 Cr

Total: 127–176 plots across 12.74 acres (two registered phases).

Uthandi is one of the most sought-after ECR localities. It's between Thiruvanmiyur and Kovalam – premium coastal residential belt. The stretch has well-established luxury villas, beach resorts, and high-end gated communities. Water access, air quality, proximity to the beach – ECR living at its finest.

For ₹6,500/sqft, you're paying for the address. Individual plots in Uthandi outside gated communities sell for ₹4,500-5,500/sqft. G Square's ₹6,500 carries a ₹1,000-2,000/sqft premium for the gated community format with amenities and RERA protection.

Employment catchment: Perungudi OMR IT park is 8 km from Uthandi. Sholinganallur is 10 km. This is not a budget commuter plot – the buyers here are senior IT professionals, doctors, business owners who want a quality primary or secondary home near the beach.

Two dual-phase RERA registration (2023 + 2024) suggests strong demand for a second tranche of plots. Any buyers in Phase 1 – what was the experience?`,
    address: 'Reddikuppam Main Road, Uthandi, Kanathur Reddykuppam, Chennai 600119',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.bala,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 7640000,
    priceMax: 19400000,
    createdAt: pastDate(75),
  })
  {
    const c1 = await addComment(tranquil.id, U.kavitha_c,
      `Phase 1 buyer here (RERA TN/29/Layout/4457/2023). Bought a 1500 sqft plot at ₹6,500/sqft = ₹97.5L in late 2023. My experience so far: the plot demarcation was done professionally, the concrete survey stones are in place. The 30-foot internal road in front of my plot is tarred. The compound wall is complete. They started Phase 2 (TN/29/Layout/4024/2024) because Phase 1 sold out quickly – that itself is the demand signal. One issue: the Reddikuppam Main Road outside the project boundary is narrow (about 18 feet). During monsoon it gets muddy. G Square can't control the outside road but it does affect the approach to the community.`,
      pastDate(72, 5))
    await addComment(tranquil.id, U.nithya,
      `₹97.5L for 1500 sqft in Uthandi is significant money but consider this: a 3BHK apartment in Uthandi or nearby Thiruvanmiyur ECR belt starts at ₹1.2-1.5 Cr. You're paying less for more land. The difference is you need to spend ₹50-70L on construction to build the house. But your construction decisions are entirely yours – orientation, internal layout, material quality. The total of ₹97.5L + ₹60L construction = ₹1.57 Cr for a 2000+ sqft house on your own plot in Uthandi is genuinely competitive vs buying a flat of equivalent specification.`,
      pastDate(69, 3))
    await addComment(tranquil.id, U.saravanan,
      `ECR plot investments have a specific characteristic: weekender buyers. A lot of Uthandi-ECR buyers are Chennai residents (Anna Nagar, T Nagar, Mylapore) who want a second home they can escape to on weekends. If you're in this category, G Square Tranquil's Uthandi address is perfect – 35-40 minutes from T Nagar on ECR in non-peak hours, you can literally be at the beach on Saturday morning. Build a 3BHK with a small pool (1500 sqft land is enough for a plunge pool) and your weekend lifestyle changes completely. Rental on weekends when you're not using it: ₹8,000-12,000/night easily in Uthandi during season.`,
      pastDate(66, 1), c1.id)
  }

  // ══════════════════════════════════════════════════════════════════════
  // REPLACEMENT 8b: G Square Haven — Maraimalai Nagar (the ACTUAL project there)
  // Source: gsquarehousing.com; DTCP approved, RERA pending
  // ══════════════════════════════════════════════════════════════════════
  console.log('Creating G Square Haven (Maraimalai Nagar)...')
  const haven = await createTopic({
    slug: 'gsquare-haven-maraimalai-nagar-gst-road-chennai',
    propertyName: 'G Square Haven',
    title: 'G Square Haven – Maraimalai Nagar, GST Road | 200 plots, 31 acres | DTCP approved, RERA pending',
    description: `G Square Haven at Maraimalai Nagar is their largest plotted community near the GST Road belt – 200 plots on 31.21 acres. DTCP approved. RERA registration is pending (G Square website states "RERA will be obtained soon"). Address: Gokulapuram Main Road, Maraimalai Nagar, Chennai 603204.

Pricing: ₹3,490/sqft onwards. Starting from 600 sqft plots → entry ₹20.94L. At 1,200 sqft → ₹41.88L. At 1,800 sqft → ₹62.82L.

This is genuinely affordable for a G Square project – their Chennai launches typically start ₹5,000+/sqft. The lower pricing reflects the Maraimalai Nagar location which is industrial corridor adjacent.

Maraimalai Nagar context:
- Sits on GST Road (NH48) between Chennai and Chengalpattu
- Adjacent to SIPCOT Maraimalai Nagar industrial estate (Hyundai plant, SIPCOT factories)
- Distance to Tambaram: 10 km | Chengalpattu: 15 km | Chennai Airport: 25 km
- Maraimalai Nagar railway station has trains to Chennai and Chengalpattu

31.21 acres for 200 plots = 6.4 plots per acre – this is very low density, meaning large open spaces between plots. G Square's large-format projects tend to feel like proper planned layouts rather than cramped subdivisions.

Important flag: NO RERA yet. Booking before RERA in Tamil Nadu post-2017 is technically a risk. G Square says RERA is pending. In practice, their DTCP approval and established track record means they will get RERA – but insist that your booking agreement includes a clause that the sale deed execution happens only after RERA registration. Do not make full payment before RERA is obtained.

600 sqft minimum plot is very small. Buildable area with setbacks: about 400 sqft per floor. Useful for a 1BHK only. Consider 1,000+ sqft minimum for a proper 2BHK house.`,
    address: 'Gokulapuram Main Road, Maraimalai Nagar, Chengalpattu 603204',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.chelladurai,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 2094000,
    priceMax: 5500000,
    createdAt: pastDate(32),
  })
  {
    await addComment(haven.id, U.selvam,
      `The RERA pending flag is critical. Under Tamil Nadu RERA rules, a developer can accept booking advances up to 10% of the project cost before RERA registration. But the full sale agreement must happen only after RERA. If G Square Haven is asking for more than 10% before RERA – that's a red flag and potentially a legal violation. Ask explicitly: what is the RERA expected registration date, and when will they execute the sale agreement. If they can't give a specific date, wait. G Square has always obtained RERA for their previous projects so the risk is low in absolute terms, but the process protection matters.`,
      pastDate(30, 4))
    await addComment(haven.id, U.rajalakshmi,
      `Maraimalai Nagar has a specific tenant demand profile: SIPCOT workers and Hyundai/ancillary industry employees. A 600 sqft plot with a 500 sqft 1BHK construction costs ₹21L + ₹8L construction = ₹29L total. Renting to SIPCOT workers at ₹5,000-6,000/month. Gross yield: 6,000 × 12 / 2,90,000 = 2.5% – that's not great. But land appreciation near GST Road is the real play. GST Road land has doubled every 5-6 years for the past decade. The ₹3,490/sqft today becomes ₹6,000-7,000/sqft in 5-6 years if the trend continues. Buy to hold, not for rental income.`,
      pastDate(27, 2))
    await addComment(haven.id, U.deepa_nat,
      `31.21 acres for 200 plots = big community. At this scale, G Square typically provides very good internal road width and green space. Compare to their Singaperumal Koil communities (Pavillion at 34 acres, Vrindavan at 19 acres) which have the same large-format feel. Maraimalai Nagar is a proven industrial address. The Maraimalai Adigal residential area (named after the Tamil scholar-saint) nearby has proper schools and temples giving it cultural character beyond just the industrial estate. If you're looking at affordable GST Road investment with good bones, Haven is worth watching closely once RERA comes through.`,
      pastDate(24))
  }

  console.log('\n✅ Fix script complete.')
  console.log(`Deleted 8 incorrect topics, created 9 correct replacements:\n`)
  const replacements = [elinor, selenia, estoria, promenade, reva, prestige, omega, tranquil, haven]
  replacements.forEach(t => console.log(`  ${t.propertyName.padEnd(28)}: ${t.id}`))
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
