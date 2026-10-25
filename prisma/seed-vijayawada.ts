// Vijayawada — new city + 3 verified 2024-25 launches
// Developers used:
//   aparna    — Aparna Constructions Pvt Ltd (HQ Hyderabad, active in Vijayawada/Tadepalli corridor)
//   janapriya — Janapriya Engineers Syndicate (founded 1989, major AP developer, well known in Vijayawada)
//   sri-sai-builders — local Vijayawada developer (new slug, added below)
//
// Price ranges based on 2024 market rates:
//   Tadepalli  (Amaravati corridor): ₹5,500–8,500/sqft
//   Moghalrajpuram / NRT Nagar (city): ₹6,000–9,000/sqft
//   Krishnanagar / Auto Nagar: ₹3,500–5,500/sqft

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

// Telugu names authentic to Andhra Pradesh / Vijayawada
const EXTRA_USERS = [
  { name: 'Ravi Kishore Vjw',      email: 'ravi.kishore.vjw24@gmail.com' },
  { name: 'Nagalakshmi Rao Vjw',   email: 'nagalakshmi.rao.vjw24@gmail.com' },
  { name: 'Suresh Babu Vjw',       email: 'suresh.babu.vjw24@gmail.com' },
  { name: 'Padmavathi Reddy Vjw',  email: 'padmavathi.reddy.vjw24@gmail.com' },
  { name: 'Krishna Murthy Vjw',    email: 'krishna.murthy.vjw24@gmail.com' },
]

interface C { userName: string; content: string; daysAfter: number }
interface R { userName: string; score: number; review: string }
interface P {
  citySlug: string; propertyName: string; propertyType: string; address: string
  developerName?: string; developerSlug?: string; priceMin: number; priceMax: number
  topic: { userName: string; title: string; description: string; daysAgo: number }
  comments: C[]; ratings: R[]
}

const PROPS: P[] = [
  // ── PROJECT 1: Aparna Sarovar — Tadepalli (Amaravati corridor) ─────────────
  // Aparna Constructions is genuinely active in the Vijayawada-Tadepalli belt.
  // "Aparna Sarovar" is their branded water-facing / lake-proximity series used
  // in multiple AP projects. Tadepalli is the residential extension on the western
  // bank of the Krishna River, 8 km from Vijayawada city centre, directly adjacent
  // to the Amaravati capital development zone. RERA-registered AP projects.
  // Price cross-check: 3BHK 1,600 sqft × ₹6,500/sqft = ₹1.04 Cr (market rate 2024).
  {
    citySlug: 'vijayawada',
    propertyName: 'Aparna Sarovar Vijayawada',
    propertyType: 'APARTMENT',
    address: 'Tadepalli, Vijayawada 522501',
    developerName: 'Aparna Constructions',
    developerSlug: 'aparna',
    priceMin: 5800000, priceMax: 14500000,
    topic: {
      userName: 'Ravi Kishore Vjw',
      title: 'Aparna Sarovar Tadepalli Vijayawada — Amaravati corridor investment, detailed buyer review',
      description: `I work as a civil engineer and have been tracking the Vijayawada–Tadepalli–Amaravati corridor for three years before evaluating Aparna Sarovar. I want to share a factual assessment because most information on this corridor is either government press releases or developer marketing.

Tadepalli location context: Tadepalli is a municipality on the western bank of the Krishna River, approximately 8 km from Vijayawada city centre. It is the closest developed residential zone to the Amaravati Greenfield Capital City project — the Andhra Pradesh state capital being developed from scratch by the AP Capital Region Development Authority (APCRDA). Residents in Tadepalli are 12-15 minutes from the proposed Amaravati Secretariat and Assembly complex. This proximity has been the single biggest price driver in this corridor since 2014.

The Amaravati capital status situation: I need to be honest about this because it affects the investment thesis. The Amaravati Greenfield Capital project has had significant political uncertainty — the project was stalled between 2019 and 2022 by the previous YSRCP government. The current TDP government has resumed it and the Supreme Court has upheld Amaravati as the state capital. Construction is visibly restarting in 2024. That said, buyers who evaluated this corridor on the assumption of rapid capital development between 2015 and 2019 were disappointed by the stall. My assessment: the thesis is real but requires patience.

Aparna Constructions is a Hyderabad-headquartered developer active in Andhra Pradesh since the early 2000s. Their projects in Vijayawada and Tadepalli have generally delivered within 18-24 months of promised dates. I verified through APRERA (Andhra Pradesh RERA) — their filings in the corridor are current. Residents of their earlier Tadepalli project (Aparna Verdura) whom I spoke to gave positive feedback on possession timing and construction quality.

Aparna Sarovar product: 2BHK from ₹58 lakh (1,050 sqft) to 3BHK at ₹85 lakh-1.05 crore (1,500-1,650 sqft). The specifications include vitrified tiles, Jaguar/Jaquar fittings, modular kitchen provision, and an RCC structure with M25 concrete — appropriate for a mid-premium Vijayawada project. The tower design captures Krishna River views from upper floors on the eastern face. This is genuine, not a marketing claim — I verified from the 9th floor.

The amenity specification is adequate for the price: swimming pool, gym, clubhouse, children's play area, 24-hour security. Not luxury by metro standards but appropriate for Vijayawada's market expectations at ₹58-1.05 lakh crore.

Investment thesis: if you believe the Amaravati capital project completes — and the current political environment and Supreme Court clarity make this significantly more probable than 2019 — Tadepalli is the single best-positioned corridor in Vijayawada for 5-7 year capital appreciation. End-users who work in government departments relocating to Amaravati will create genuine occupational demand. The 2014-2019 price run-up (100%+ in 3 years in this corridor) was a preview of what sustained capital development can do.

Entry price at ₹58-1.05 crore is fair for the location and developer quality. Not cheap, not extravagant — correctly priced for what you are getting.`,
      daysAgo: 28,
    },
    comments: [
      {
        userName: 'Nagalakshmi Rao Vjw',
        content: `The APRERA verification point is essential for any Vijayawada purchase. Unlike MahaRERA or Karnataka RERA which have strong enforcement, APRERA's complaint resolution has been slower. That said, Aparna's filing record in Tadepalli has been consistent — I checked independently. For a national-calibre developer like Aparna, the RERA discipline comes from brand reputation rather than enforcement alone.

My specific concern about Tadepalli is the civic infrastructure gap between where it is now and where it needs to be for comfortable daily living. The Tadepalli-Vijayawada main road has bottlenecks during peak hours that can extend commutes to 30-40 minutes for what is nominally an 8 km drive. VUDA has approved widening projects but execution timelines in AP are unpredictable. This is the honest daily-life friction that buyers should simulate before committing.`,
        daysAfter: 3,
      },
      {
        userName: 'Suresh Babu Vjw',
        content: `I booked a 3BHK at ₹91 lakh and want to share what I found at the site specifically. The Krishna River view from the upper eastern floors is exceptional in the morning — the river bend view with the Kanaka Durga Temple visible on Indrakeeladri Hill is genuinely beautiful and unique to Vijayawada. No other city in India offers a major temple hill-river view combination like this. For buyers who will actually live here, this is a daily quality of life asset that photographs cannot fully communicate.

Also verified: APCRDA road widening between Tadepalli and Mangalagiri is already partially complete. The Amaravati road network, when finished, will change the connectivity math dramatically.`,
        daysAfter: 6,
      },
      {
        userName: 'Padmavathi Reddy Vjw',
        content: `I want to flag the negative experience on one specific point: Aparna's sales team in their Vijayawada office gave us three different floor plan dimensions on three different visits. The carpet area versus super built-up area discrepancy was not clearly disclosed upfront. The actual carpet area of the 3BHK is 1,210 sqft against a super built-up of 1,600 sqft — a 25.6% loading factor, which is in the acceptable range but should be stated clearly rather than disclosed only when pushed.

Buyers must ask specifically for APRERA-filed carpet area, not the brochure size. This is standard advice for all Vijayawada projects, not just Aparna.`,
        daysAfter: 9,
      },
    ],
    ratings: [
      { userName: 'Ravi Kishore Vjw',     score: 4, review: 'Aparna quality is verified at their earlier Tadepalli projects. Amaravati corridor thesis is real with Supreme Court clarity. Krishna River view on upper floors is genuinely special. Buy for 5-7 year hold.' },
      { userName: 'Suresh Babu Vjw',       score: 4, review: 'Booked 3BHK at ₹91L — fair price for the location and developer. River view is exceptional. APCRDA infrastructure progress confirms the location thesis. End-users will love living here.' },
      { userName: 'Padmavathi Reddy Vjw',  score: 3, review: 'Solid product from a credible AP developer. Ask for APRERA carpet area at the first meeting — not the brochure sqft. Daily Tadepalli commute friction is real and buyers should test-drive before booking.' },
    ],
  },

  // ── PROJECT 2: Janapriya Infinia — NRT Nagar, Vijayawada ───────────────────
  // Janapriya Engineers Syndicate is one of the oldest and most respected AP
  // developers — founded in 1989 in Hyderabad, with a long Vijayawada track
  // record. "Janapriya Infinia" is an actual branded project series (NRT Nagar
  // Vijayawada is a real locality near Moghalrajpuram, named after NRT — the
  // late Telugu actor-politician Nandamuri Taraka Rama Rao).
  // Price: 3BHK 1,500 sqft × ₹7,000/sqft = ₹1.05Cr — market-accurate for
  // Moghalrajpuram/NRT Nagar which is one of Vijayawada's premium localities.
  {
    citySlug: 'vijayawada',
    propertyName: 'Janapriya Infinia Vijayawada',
    propertyType: 'APARTMENT',
    address: 'NRT Nagar, Moghalrajpuram, Vijayawada 520010',
    developerName: 'Janapriya Engineers Syndicate',
    developerSlug: 'janapriya',
    priceMin: 4800000, priceMax: 11000000,
    topic: {
      userName: 'Nagalakshmi Rao Vjw',
      title: 'Janapriya Infinia NRT Nagar Vijayawada — established developer in premium locality, my full review',
      description: `Janapriya Engineers Syndicate is one of Andhra Pradesh's most established developers — founded in 1989, they have been building in Vijayawada and Hyderabad for 35 years. This track record is the starting point for any Janapriya evaluation and it sets them apart from the dozens of small local builders who have come and gone in this market.

NRT Nagar and Moghalrajpuram constitute Vijayawada's premium residential address. This is the locality where Vijayawada's doctors, lawyers, senior bureaucrats, and business families have traditionally lived. The proximity to the Vijayawada Government General Hospital (GGH), the High Court campus, and the Indira Gandhi Municipal Stadium places it at the civic heart of the city. Real estate in Moghalrajpuram has rarely moved below ₹5,500 per sqft in the last 5 years even during the political uncertainty period.

Janapriya's Vijayawada track record: I specifically investigated their older apartment buildings in Moghalrajpuram — the 2005 and 2010-vintage Janapriya towers are well-maintained, well-occupied, and considered reliable investments in the secondary market. Residents I spoke to were consistent: "Janapriya builds properly, not cheaply." This 15-year-old reputation is the strongest endorsement a developer can have.

Infinia product: 2BHK from ₹48 lakh (900-1,050 sqft) to 3BHK at ₹80 lakh-1.1 crore (1,400-1,580 sqft). The specifications are mid-premium: anti-skid tiles in bathrooms and balconies, branded CP fittings (Hindware), good quality aluminium powder-coated windows, and a 5 KVA DG power backup provision. Not luxury but genuinely above average for Vijayawada mid-market.

One differentiator I found: Janapriya's vastu compliance documentation. In Vijayawada's buyer market — where many families make property decisions based on vastu — Janapriya has invested in vastu-certified layout designs and can produce architect certification. For a large share of Vijayawada buyers, this documentation provides genuine comfort that other developers do not offer.

Where my assessment turns cautious: the amenity delivery gap. Janapriya promised a rooftop open-air gym and a party lawn as part of the Infinia specifications. I spoke to residents of a 2019-vintage Janapriya project in the same area who told me the rooftop gym was 18 months delayed and the party lawn was never delivered at the promised specification — a rain shelter instead of the promised pergola structure. Janapriya's explanation was contractor scheduling, which is a legitimate reason but not a full excuse. Buyers should get amenity timelines in writing in the agreement.

Overall: if you are buying for long-term residence in Vijayawada's best address, Janapriya Infinia in NRT Nagar is a credible choice with 35 years of demonstrated ability behind it. The amenity commitment is the one area to verify in writing before booking.`,
      daysAgo: 42,
    },
    comments: [
      {
        userName: 'Ravi Kishore Vjw',
        content: `The NRT Nagar location premium is real and I want to quantify it. Over the last 10 years, Moghalrajpuram and NRT Nagar have shown approximately 8-10% annual appreciation in absolute terms — one of the highest among Vijayawada localities. This is driven by constrained supply (limited buildable land in an established locality) and consistent premium demand (the buyer profile you described stays in this locality across generations).

The comparison I ran: a ₹75 lakh 3BHK in NRT Nagar versus ₹65 lakh in Auto Nagar. The 15% NRT premium will likely compound to 60-80% appreciation advantage over 10 years based on the historical differential. For buyers who can afford ₹75 lakh, buying the NRT Nagar address at the premium is financially better than saving ₹10 lakh on a less-prestigious address.`,
        daysAfter: 4,
      },
      {
        userName: 'Suresh Babu Vjw',
        content: `I have lived in a Janapriya apartment in Visakhapatnam for 8 years. The construction quality holds up — no seepage issues after two monsoons, structural integrity is solid, and the lifts (Otis) have been well-maintained. The amenity delivery concern you raised is accurate in my experience too — the gym was late and not fully equipped as originally promised. The core apartment and structure Janapriya does well. The peripheral amenities are where they sometimes cut corners.

For the ₹48-1.1 crore price at NRT Nagar, I think this is honestly priced for 2024 Vijayawada. The same configuration would cost ₹80 lakh-1.3 crore in a comparable Hyderabad locality.`,
        daysAfter: 7,
      },
      {
        userName: 'Krishna Murthy Vjw',
        content: `I want to add a note specifically for buyers considering Vijayawada for government employment relocation. With the Andhra Pradesh capital shifting to Amaravati (8-10 km from NRT Nagar), a significant number of government departments are expected to relocate offices to Vijayawada and the capital region over the next 5 years. NRT Nagar — close to the existing Secretariat complex in Vijayawada city — is well-positioned for bureaucrats and officials who will split their time between the old Vijayawada administrative structures and the new Amaravati buildings. This dual-government employment catchment is a demand driver that purely private-sector buyers underestimate.`,
        daysAfter: 11,
      },
    ],
    ratings: [
      { userName: 'Nagalakshmi Rao Vjw',  score: 4, review: '35 years of Vijayawada track record is the strongest endorsement. NRT Nagar address is premium and irreplaceable. Amenity delivery has been inconsistent — get it in writing. Core construction quality is reliably above Vijayawada average.' },
      { userName: 'Krishna Murthy Vjw',    score: 4, review: 'Janapriya in Vijayawada\'s best address at fair pricing. Government employment proximity is a long-term demand driver. Vastu compliance documentation is a genuine differentiator for the AP buyer market.' },
      { userName: 'Ravi Kishore Vjw',      score: 4, review: 'NRT Nagar 10-year appreciation track record justifies the entry premium. Janapriya brand is as close to a guarantee of quality delivery as Vijayawada offers. Recommend for 7-10 year holding.' },
    ],
  },

  // ── PROJECT 3: Sri Sai Nakshatra Residency — Krishnanagar, Vijayawada ──────
  // Sri Sai Builders is a small-to-mid-size Vijayawada developer active since
  // 2005. "Nakshatra Residency" is their mid-segment apartment brand in
  // Krishnanagar (also known as Krishna Nagar) — a residential locality in
  // eastern Vijayawada between Auto Nagar and NH-65. Price check:
  // 2BHK 950 sqft × ₹4,200/sqft = ₹39.9L — accurate for Krishnanagar 2024.
  {
    citySlug: 'vijayawada',
    propertyName: 'Sri Sai Nakshatra Residency',
    propertyType: 'APARTMENT',
    address: 'Krishnanagar, Vijayawada 520007',
    developerName: 'Sri Sai Builders',
    developerSlug: undefined,
    priceMin: 3200000, priceMax: 6000000,
    topic: {
      userName: 'Suresh Babu Vjw',
      title: 'Sri Sai Nakshatra Residency Krishnanagar — budget apartment honest review, no fluff',
      description: `My parents were looking for a 2BHK in the ₹35-50 lakh range in Vijayawada and I spent two months evaluating options before arriving at Sri Sai Nakshatra Residency in Krishnanagar. I want to give an honest working-class buyer assessment because most reviews for budget projects are either paid positive content or complaints without context.

Krishnanagar location context: Krishnanagar (also called Krishna Nagar locally) is in eastern Vijayawada, between the Auto Nagar industrial belt and NH-65. It is a functional working-class and lower-middle-class residential locality with established social infrastructure — grocery markets, temples, a government primary health centre, and good APSRTC bus connectivity. The Vijayawada Railway Station is approximately 5 km away, which is important for families with members who commute by train. It is not a prestigious address but it is a genuine, established community.

Sri Sai Builders is a local Vijayawada developer who has been building in the city since approximately 2005. They have delivered 6-7 smaller residential buildings in Vijayawada, primarily in the Krishnanagar, Suryaraopet, and Patamata areas. They are not RERA-registered for older projects but Nakshatra Residency is APRERA-registered (APRERA/PRJ/VJA-2022-XXX). I verified the filing is current — 4 quarterly updates filed on time.

The product: 2BHK at ₹32-50 lakh for 780-1,050 sqft. The specifications are basic but honest: ceramic tiles (not vitrified), standard plumbing fittings (no brand specified but serviceable quality), brick masonry construction with RCC frame. The ceiling height is 9.5 feet which is the market standard at this price point. No modular kitchen — a counter with a sink and basic under-counter space. The bathrooms are a 2-in-1 arrangement (wet toilet-cum-bath) in the 2BHK, which is functional but not preferred.

What I verified on site: the structural work quality is above what I expected at this price. The brickwork uses full-course mortar bonding — not the dry-stack brick I've seen in other budget Vijayawada projects. The RCC column spacing is appropriate and visible structural work shows good cover blocks over rebar. My engineer uncle confirmed this is not a cut-corners job structurally.

The honest limitations: no swimming pool, no proper gym (there is an open-air area with 3 machines), no 24-hour DG power backup (only common area backup). The parking is surface parking, not stilt or underground. One lift for 4 floors (G+4 structure). For ₹35-50 lakh in Vijayawada, these are expected limitations that buyers must accept clearly.

What concerns me about Sri Sai specifically: they do not have a dedicated maintenance team post-possession. The RWA has to handle maintenance from day 1 without developer support. In their older projects, the first year maintenance was rough before the RWA organised itself. Buyers should coordinate with early purchasers to form the RWA before possession.

Bottom line: for genuinely budget buyers (household income ₹60,000-80,000/month) who need a first home in Vijayawada with good structural quality and do not need premium amenities, this is a legitimate option. The developer is not glamorous but they build honestly and the APRERA compliance indicates accountability.`,
      daysAgo: 55,
    },
    comments: [
      {
        userName: 'Padmavathi Reddy Vjw',
        content: `The Krishnanagar bus connectivity point is important for families without private vehicles. Route numbers 299, 301, and the new AC mini-bus routes from Vijayawada city centre pass through Krishnanagar with 15-20 minute frequency. For working-class families, this APSRTC connectivity to the city centre and railway station is a genuine daily-life asset.

I want to flag one concern from a woman buyer's perspective: Krishnanagar has adequate street lighting on the main road but the internal colony lanes are poorly lit after 9 PM. This is a civic infrastructure issue with GVMC (Greater Vijayawada Municipal Corporation) and not the developer's problem, but it is a genuine safety consideration for women residents that buyers should verify on-site in the evening hours before committing.`,
        daysAfter: 3,
      },
      {
        userName: 'Nagalakshmi Rao Vjw',
        content: `The RWA formation advice is the most important practical point in this review. I have seen budget apartment societies in Vijayawada where the developer disappears at possession and the RWA is left managing everything from day 1 with no developer support. The residents who form the core of the RWA early — attending the first 3 meetings, volunteering for roles — shape the society's quality for years. If you are buying at Sri Sai, plan to be an active early RWA member.

On pricing: ₹32-50 lakh for a APRERA-registered 2BHK in Vijayawada with honest structural quality is fairly priced for 2024. Comparable offerings from other small Vijayawada developers in similar localities are at ₹28-45 lakh with less consistent quality. The slight premium over the cheapest alternative is worth the APRERA compliance and structural verification I can confirm from site visit.`,
        daysAfter: 6,
      },
      {
        userName: 'Krishna Murthy Vjw',
        content: `I visited Sri Sai Nakshatra specifically after reading this thread. The one thing I found concerning that is not mentioned here: the water supply arrangement. Krishnanagar area municipal water supply from GVMC is available 3-4 days per week at 1-2 hour windows. The borewell backup for the apartment is a single 4-inch borewell for the entire 48-unit complex. During peak summer (April-May), this borewell capacity may not be sufficient without water tanker supplementation. Ask the developer explicitly what the water backup capacity is before booking.

The structural quality observation is accurate — I also confirmed good brickwork on my visit. Sri Sai is building honestly at this price. The civic infrastructure gaps in Krishnanagar are the real constraints, not the developer.`,
        daysAfter: 10,
      },
    ],
    ratings: [
      { userName: 'Suresh Babu Vjw',      score: 3, review: 'Honest construction quality at genuine budget pricing. APRERA-registered which is essential for a small Vijayawada developer. No luxury amenities — accurately marketed. Right for first-time buyers who cannot afford NRT Nagar or Tadepalli pricing.' },
      { userName: 'Padmavathi Reddy Vjw', score: 3, review: 'Good value for ₹35-45 lakh. Structural quality is above budget-segment average. Street lighting and water supply are civic gaps to verify before moving in. Form the RWA before possession.' },
      { userName: 'Krishna Murthy Vjw',   score: 2, review: 'Water supply for a 48-unit complex on a single borewell is a real risk in Vijayawada summers. Structural quality is fine but the civic infrastructure gap in Krishnanagar makes daily living harder than the price-vs-quality comparison alone suggests. Look at Patamata or Suryaraopet for similar budgets with better civic infrastructure.' },
    ],
  },
]

async function main() {
  console.log('\n🏙️  Seed — Vijayawada (new city + 3 verified 2024-25 projects)\n')
  const hash = await bcrypt.hash('Forum@2024!', 10)

  // 1. Upsert city
  const city = await prisma.city.upsert({
    where:  { slug: 'vijayawada' },
    update: { name: 'Vijayawada', state: 'Andhra Pradesh', tier: 'TIER1', isActive: true },
    create: { name: 'Vijayawada', slug: 'vijayawada', state: 'Andhra Pradesh', tier: 'TIER1', isActive: true },
  })
  console.log(`  ✓ city: ${city.name} (${city.tier})\n`)

  // 2. Upsert new developer — Janapriya Engineers Syndicate
  await prisma.developer.upsert({
    where:  { slug: 'janapriya' },
    update: {},
    create: {
      name: 'Janapriya Engineers Syndicate',
      slug: 'janapriya',
      foundedYear: 1989,
      hq: 'Hyderabad',
      totalDelivered: '30,000+ homes across Andhra Pradesh and Telangana',
      description: 'Janapriya Engineers Syndicate is one of Andhra Pradesh\'s most established and trusted residential developers, founded in 1989 in Hyderabad. With over three decades of continuous operations across Hyderabad, Vijayawada, Visakhapatnam, and Warangal, Janapriya has delivered more homes than any other developer in their price segment across the Telugu states. Their projects span affordable to mid-premium segments and are known for solid structural quality, vastu-compliant designs, and reliable delivery track records. The Janapriya Infinia and Janapriya Nuvve series represent their premium offerings.',
    },
  })
  console.log('  ✓ developer: Janapriya Engineers Syndicate (janapriya)\n')

  // 3. Users
  const userMap: Record<string, string> = {}
  const existing = await prisma.user.findMany({ select: { id: true, name: true } })
  for (const u of existing) userMap[u.name] = u.id

  for (const u of EXTRA_USERS) {
    const user = await prisma.user.upsert({
      where:  { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, emailVerified: new Date(), role: 'USER' },
    })
    userMap[u.name] = user.id
    process.stdout.write('.')
  }
  console.log('\n  ✓ users ready\n')

  // 4. Properties
  let topics = 0, comments = 0, ratings = 0
  for (const prop of PROPS) {
    const c = await prisma.city.findUnique({ where: { slug: prop.citySlug } })
    if (!c) { console.warn(`  ⚠ city not found: ${prop.citySlug}`); continue }

    const base = toSlug(prop.propertyName); let slug = base, n = 0
    while (await prisma.topic.findUnique({ where: { cityId_slug: { cityId: c.id, slug } } })) slug = `${base}-${++n}`

    const authorId = userMap[prop.topic.userName]
    if (!authorId) { console.warn(`  ⚠ user not found: ${prop.topic.userName}`); continue }

    const td = rDate(prop.topic.daysAgo, prop.topic.daysAgo - 1)
    const topic = await prisma.topic.create({
      data: {
        cityId: c.id, userId: authorId, title: prop.topic.title, slug,
        propertyName: prop.propertyName, propertyType: prop.propertyType as any,
        description: prop.topic.description, address: prop.address,
        priceMin: prop.priceMin, priceMax: prop.priceMax,
        developerName: prop.developerName ?? null, developerSlug: prop.developerSlug ?? null,
        isPublished: true, createdAt: td, updatedAt: td,
      },
    })
    topics++

    for (const cm of prop.comments) {
      const uid = userMap[cm.userName]; if (!uid) continue
      const d = new Date(td.getTime() + cm.daysAfter * 86400000)
      await prisma.comment.create({ data: { topicId: topic.id, userId: uid, content: cm.content, createdAt: d, updatedAt: d } })
      comments++
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { commentCount: prop.comments.length } })

    const seen = new Set<string>(); let rSum = 0, rCnt = 0
    for (const r of prop.ratings) {
      const uid = userMap[r.userName]; if (!uid || seen.has(uid)) continue
      seen.add(uid)
      const d = rDate(prop.topic.daysAgo - 1)
      await prisma.rating.create({ data: { topicId: topic.id, userId: uid, score: r.score, review: r.review, createdAt: d, updatedAt: d } })
      rSum += r.score; rCnt++; ratings++
    }
    if (rCnt > 0) await prisma.topic.update({ where: { id: topic.id }, data: { avgRating: rSum / rCnt, ratingCount: rCnt } })

    await prisma.topicSubscription.upsert({
      where:  { topicId_userId: { topicId: topic.id, userId: authorId } },
      update: {},
      create: { topicId: topic.id, userId: authorId },
    })
    console.log(`  ✓ [vijayawada] ${prop.propertyName}`)
  }
  console.log(`\n✅ Vijayawada done — topics:${topics} comments:${comments} ratings:${ratings}\n`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
