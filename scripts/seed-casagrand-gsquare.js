/**
 * Seed: Casagrand ongoing projects + Gsquare plots
 * Run: node scripts/seed-casagrand-gsquare.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ── IDs from DB ────────────────────────────────────────────────────
const CITY = {
  chennai:   'cmp10j00q00042oyzmbskw6ll',
  bengaluru: 'cmp10izme00022oyz2abvu6h2',
}

const DEV = {
  casagrand: 'cmp2gyqlg0000kx7qkq72q4t4',
  // Gsquare will be created
}

// Chennai users (Tamil names)
const U = {
  karthikeyan:    'cmp2ggmog0000dnxgxkelrgm4',
  meenakshi:      'cmp2ggoa30001dnxgue2g956h',
  senthil:        'cmp2ggp940002dnxgm5aeut3z',
  nithya:         'cmp2ggylh000bdnxgp182btah',
  preethi_s:      'cmp2gh0jd000ddnxgaqgqbpmo',
  kavitha_c:      'cmp2ggwgb0009dnxgid3okcie',
  selvam:         'cmp2ggzkf000cdnxglvk4q47e',
  jayakumar:      'cmp2gh1ia000ednxgwe3kf9sk',
  bala:           'cmp2ggxfe000adnxgqyveyjih',
  ganesan:        'cmp2gh3ga000gdnxggtb6ybi6',
  saravanan:      'cmp2ghdef000qdnxgnn487o5t',
  kowsalya:       'cmp2ghcfj000pdnxgf44zle6h',
  vignesh:        'cmp2ghfc5000sdnxgns61rbl9',
  rajalakshmi:    'cmp2ghgb4000tdnxgzoytek6g',
  deepa_nat:      'cmp2ghedb000rdnxgv2lqyb4r',
  chelladurai:    'cmp2ghbgk000odnxg1dbwea4q',
  priya_iyer:     'cmp10jdqu00011by27aautcxx',
  karthik_sun:    'cmp10nb900000504n63gu3uf6',
  // Bengaluru users
  harish:         'cmp25n7eb0000ffptp59wsq5d',
  meera_b:        'cmp25n9kf0001ffptqh76jtnk',
  suresh_a:       'cmp25naj70002ffptpewk44ec',
}

// ── Helpers ────────────────────────────────────────────────────────
function pastDate(daysAgo, hoursAgo = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(d.getHours() - hoursAgo)
  return d
}

async function createTopic({
  slug, propertyName, title, description, address,
  cityId, propertyType, userId, developerSlug, developerName,
  priceMin, priceMax, createdAt,
}) {
  return prisma.topic.create({
    data: {
      slug, propertyName, title, description, address,
      cityId, propertyType, userId, developerSlug, developerName,
      priceMin, priceMax, createdAt,
      viewCount: Math.floor(Math.random() * 800) + 200,
    },
  })
}

async function addComment(topicId, userId, content, createdAt, parentId = null) {
  return prisma.comment.create({
    data: { topicId, userId, content, createdAt, parentId },
  })
}

// ── Main ───────────────────────────────────────────────────────────
async function main() {

  // 1. Create Gsquare developer
  let gsquare = await prisma.developer.findUnique({ where: { slug: 'gsquare' } })
  if (!gsquare) {
    gsquare = await prisma.developer.create({
      data: {
        name: 'Gsquare Realty',
        slug: 'gsquare',
        description: 'Chennai-based plotted development company with DTCP and CMDA approved gated communities along ECR, OMR and South Chennai suburban belt. Operational since 2014 with multiple delivered communities.',
        hq: 'Chennai, Tamil Nadu',
        foundedYear: 2014,
      },
    })
    console.log('Created Gsquare developer:', gsquare.id)
  } else {
    console.log('Gsquare already exists:', gsquare.id)
  }

  // ── CASAGRAND JOIE ─────────────────────────────────────────────
  console.log('\nCreating Casagrand Joie...')
  const joie = await createTopic({
    slug:           'casagrand-joie-perumbakkam',
    propertyName:   'Casagrand Joie',
    title:          'Casagrand Joie Perumbakkam — Booked 3BHK, detailed review after 6 months of research',
    description:    `Been tracking Casagrand Joie for the last 6 months and finally decided to book a 3BHK last week. Wanted to share what I found out before and after booking.

The project is on OMR near Perumbakkam junction, about 500 metres from the main OMR signal. Access is through a 40 feet road which is being widened currently. The land is 6.83 acres with 680 units across 2 towers. Both towers are G+31 floors.

Construction update as of April 2025: Tower 1 structure is complete up to 22nd floor. Tower 2 is at 16th floor. Concrete work is ongoing, workers are visibly active. The project hoarding shows construction milestones which is reassuring.

Pricing — I got a 2BHK (1050 sqft carpet) at ₹78.5 lakhs on the 12th floor, east facing. 3BHK starts at ₹98L for standard and goes up to ₹1.14Cr for the premium variant (1520 sqft). These prices include one car parking slot and GST. The quote was all-inclusive which is honestly rare these days.

What I liked:
— Casagrand track record in Chennai is decent. Their Elita project on Medavakkam-Mambakkam road got possession without extreme delay.
— Lake view from upper floors is genuinely nice. I visited at 6pm and the view of Perumbakkam lake from 12th floor was peaceful, no hyperbole.
— Club house footprint is 40,000 sqft — includes proper lap pool (not a tiny splash pool) and a gym with actual commercial equipment.
— RERA registered. Verified on TNRERA website, all approvals are in order.
— CLP payment plan available which reduces financial risk significantly.

My concerns:
— OMR traffic during peak hours is brutal. I work in Sholinganallur and it already takes 35-40 mins. Once the area develops further I worry it could get worse.
— Perumbakkam lake flood risk. 2015 was bad. I asked the site manager about plinth level and he said it's 5 feet above FFL. Sounds okay but I'd still get an independent structural engineer to verify.
— Only 1 parking slot per unit with no option to buy a second. Dealbreaker for families with two vehicles.
— Possession is stated as December 2026 but based on current pace I'd budget for Q2 2027 realistically.

Overall: Good project from a trustworthy builder. But OMR has a massive oversupply of apartments and rental demand needs to be verified before buying as a pure investment. For end use it works well.`,
    address:        'Perumbakkam, OMR, Chennai 600100',
    cityId:         CITY.chennai,
    propertyType:   'APARTMENT',
    userId:         U.karthikeyan,
    developerSlug:  'casagrand',
    developerName:  'Casagrand Builder',
    priceMin:       7850000,
    priceMax:       11400000,
    createdAt:      pastDate(31),
  })

  const joieC1 = await addComment(joie.id, U.meenakshi,
    `Thanks for the detailed post. I'm also looking at Joie. One thing I noticed is their builder-buyer agreement has a clause allowing possession delay by up to 24 months due to "unforeseen circumstances." Is this normal or should I push back? My lawyer friend says all builders include this but some will remove it if you negotiate firmly. Did you manage to get any concession on this?`,
    pastDate(28))

  await addComment(joie.id, U.senthil,
    `Good write-up. I visited Joie 3 months ago and want to add one important point — the lake view from floors 1 to 6 is almost completely blocked by the podium structure and landscaping. You need at least 8th floor for an unobstructed view. Sales team won't mention this unless you specifically ask.

Also, Tower 2 east-facing units have a more direct lake view compared to Tower 1 east-facing which catches it at an angle. If lake view is your priority, ask specifically for Tower 2, floors 8 and above.`,
    pastDate(26))

  await addComment(joie.id, U.karthikeyan,
    `@Meenakshi — Yes that clause is standard across all builders, unfortunately. My lawyer reviewed it and said Casagrand's track record of actual delays (as opposed to the contractual window) is closer to 6-8 months rather than 2 years. The 2 year clause is legal protection for them, not a forecast.

@Senthil — I'm in Tower 2, 12th floor east-facing and the lake view was the deciding factor for me. Totally agree with your point. Lower floors in Tower 1 are a trap if you're paying for the view and not verifying on site.`,
    pastDate(24))

  await addComment(joie.id, U.priya_iyer,
    `Anyone have the TNRERA registration number handy? I want to check it directly before visiting the site. Also has anyone spoken to the Casagrand Elita residents about actual maintenance quality? That would give a better picture of what to expect after handover.`,
    pastDate(20))

  await addComment(joie.id, U.karthikeyan,
    `TNRERA number is TN/01/Building/0312/2024 — confirmed on the portal. About Elita residents, I spoke to 2 families there. Maintenance is ₹2.8/sqft, common areas are reasonably maintained, lift service was delayed 6 months post-handover (builder responsible, not residents), and the promised CCTV in all floors took 8 months to fully install. Not alarming but worth knowing what to follow up on at Joie.`,
    pastDate(18))

  // ── CASAGRAND PALAZZO ─────────────────────────────────────────
  console.log('Creating Casagrand Palazzo...')
  const palazzo = await createTopic({
    slug:           'casagrand-palazzo-perumbakkam',
    propertyName:   'Casagrand Palazzo',
    title:          'Casagrand Palazzo review — premium 3 & 4 BHK on Medavakkam-Mambakkam road, worth the price?',
    description:    `My husband and I have been searching for a 3BHK on OMR for 8 months. Visited Casagrand Palazzo twice and wanted to share a detailed review for others in the same boat.

First things first — this is positioned as a premium project compared to Joie. Palazzo is on Medavakkam-Mambakkam Road about 2km from Medavakkam junction. Not directly on OMR but in the same Perumbakkam micro-market.

The project has 4 towers, total 912 units, G+28 floors each. When I visited in March, Tower 1 was at plinth level and Tower 2 at the 8th floor. Pace is slower than I'd like. RERA registered.

What makes Palazzo different: The 3BHKs here are genuinely larger (1480-1780 sqft) and there are 4BHK premium units (2150 sqft). These are proper family apartments, not the shoebox 3BHKs (sub-1100 sqft) that so many OMR projects pass off as "3BHK."

Pricing as of March 2025:
— 3BHK 1480 sqft: ₹1.04Cr to ₹1.18Cr depending on floor and facing
— 3BHK 1780 sqft: ₹1.28Cr to ₹1.42Cr
— 4BHK 2150 sqft: ₹1.75Cr to ₹2.1Cr

The 4BHK pricing is steep. At that price you could buy ready-to-move independent floors in Velachery or Adyar with far better connectivity and established neighbourhood. The 4BHK here only makes sense if you specifically want new construction lifestyle and can afford the double burden (EMI + rent for 2.5+ years).

Positives I genuinely liked:
— Specifications are actually premium. Vitrified tiles 800x800 in living area (not the standard 600x600), proper granite kitchen counter, Italian marble in master bedroom.
— Two covered parking for all 3BHK units. Finally a builder who understands two-car families exist.
— School bus stop from Velammal Nexus has been tied up (confirmed by sales team).
— Vastu-compliant layout options available (without extra cost if chosen early).

Negatives:
— Price is ₹15-20L higher than comparable Casagrand Joie for similar floor area. Hard to justify unless you specifically need the larger 3BHK dimensions.
— Area around the project is less developed than the OMR junction side. The Medavakkam-Mambakkam road is functional but not established.
— Possession is December 2027. That's 2.5 years of paying both EMI and rent simultaneously. Run the numbers carefully before committing.

Still evaluating. If anyone has booked here or has info on the construction progress in recent weeks, please share.`,
    address:        'Medavakkam-Mambakkam Road, Perumbakkam, Chennai 600100',
    cityId:         CITY.chennai,
    propertyType:   'APARTMENT',
    userId:         U.nithya,
    developerSlug:  'casagrand',
    developerName:  'Casagrand Builder',
    priceMin:       10400000,
    priceMax:       21000000,
    createdAt:      pastDate(44),
  })

  const palazzoC1 = await addComment(palazzo.id, U.preethi_s,
    `Hi, I was at the Palazzo sales office last Saturday. They've revised prices upward by 4% — the 3BHK 1480 sqft is now starting at ₹1.08Cr. Price revision happens every quarter per the sales manager. If you're planning to book, act soon.

Also, the 7th and 8th floor units in Tower 1 with the better cross-ventilation layout are already sold out. Lower floors (2nd to 5th) have good availability. Upper floors above 18 still have most units open.`,
    pastDate(40))

  await addComment(palazzo.id, U.kavitha_c,
    `Checked the TNRERA website for Palazzo. Registration number is TN/29/Building/0189/2024, valid until 2028. Approvals look clean. One thing I noticed — the project had an earlier launch date of Q2 2023 which got delayed due to some CMDA layout approval that took longer than expected. Just worth keeping in mind when estimating actual possession date. Builders often underestimate how delays in early stages cascade.`,
    pastDate(37))

  await addComment(palazzo.id, U.nithya,
    `Thanks both. The TNRERA check is very useful. On the price revision — we're planning to decide by end of this month. The 1480 sqft 3BHK is what fits our budget. If anyone has compared Palazzo specifications with Prestige or Brigade projects in similar price range, I'd love to know how the finishing quality stacks up. My husband feels Prestige quality is a notch above but Palazzo's price is 12-15% lower.`,
    pastDate(35))

  await addComment(palazzo.id, U.karthik_sun,
    `I've visited both Palazzo and Prestige Primrose Hills (Bengaluru, so different market but same builder). Casagrand finishing is honestly 80-85% of Prestige quality at 85% of Prestige price. The gap is mainly in the common area finishing — lobby, corridors — where Prestige does marble flooring and Casagrand does tiles. Inside the apartment the difference is smaller. For end-use buyers who spend most time inside the flat, Casagrand is good value.`,
    pastDate(32))

  // ── CASAGRAND ADORA ────────────────────────────────────────────
  console.log('Creating Casagrand Adora...')
  const adora = await createTopic({
    slug:           'casagrand-adora-vandalur',
    propertyName:   'Casagrand Adora',
    title:          'Casagrand Adora Vandalur — honest review from someone who actually booked (budget 2 & 3BHK in South Chennai)',
    description:    `Looking for affordable options in South Chennai? Casagrand Adora on the Vandalur-Kelambakkam road might be worth checking. I booked here 4 months ago and wanted to share an honest review — the good, the bad, and the parts the sales team won't volunteer.

This is probably the most affordable Casagrand project right now in Chennai. 2BHK starting at ₹46.5 lakhs (795 sqft) and 3BHK from ₹58 lakhs (1025 sqft). For those targeting OMR or GST Road accessibility on a tighter budget, this makes sense.

Location reality check: VK Road (Vandalur to Kelambakkam) is gaining traction because of the OMR Phase 2 development and IT corridor expansion towards Sholinganallur. But right now the area is still largely semi-rural. Don't expect supermarkets and coffee shops at the doorstep. The nearest proper shopping is at Guduvanchery, about 4km.

Project: G+17 floors, 4 towers, 620 units. Construction is progressing — Tower A is at 11th floor, Tower B at 7th floor when I last visited. Possession target is December 2025 but looking at the current pace, mid-2026 is my realistic estimate. I've mentally budgeted for this.

Booking experience: I went directly to the Casagrand site office, no broker involved, so no brokerage added. Sales team was professional and not at all pushy — they actually gave me 3 full days to review the draft BBA before signing. That's unusual and appreciated.

Genuine pros:
— Price is genuinely affordable for Casagrand build quality. Finishing is better than most competitors at this price.
— CLP structure: 10% at booking, rest linked to construction milestones. Safe for buyers.
— RERA registered TN/01/Building/0234/2024 — verified on portal.
— The 2BHK at 795 sqft has a proper separated kitchen (not the open-plan design that makes everything smell of cooking), which my wife specifically wanted.

Genuine cons:
— The area is very quiet. No restaurants, no grocery store within walking distance, nothing to do. If you need urban conveniences nearby this is not for you.
— Public transport is weak. This is essentially a car-dependent location. If you rely on buses or autos it'll be difficult.
— Rental demand in the area is thin — this is clearly end-user territory for working professionals who need South Chennai connectivity.
— Resale in 5 years is genuinely uncertain since the area is still proving itself.

Bottom line — who should buy here: Working couple with at least one car, comfortable with a 25-35 min commute to Sholinganallur, Siruseri, or Mahindra City IT parks, and doesn't need urban amenities immediately around the flat. Not suitable for families who need school or hospital accessible on foot or by auto.`,
    address:        'Vandalur-Kelambakkam Main Road, Vandalur, Chennai 600048',
    cityId:         CITY.chennai,
    propertyType:   'APARTMENT',
    userId:         U.selvam,
    developerSlug:  'casagrand',
    developerName:  'Casagrand Builder',
    priceMin:       4650000,
    priceMax:       7000000,
    createdAt:      pastDate(58),
  })

  const adoraC1 = await addComment(adora.id, U.jayakumar,
    `I was comparing Adora vs Casagrand Supremus (Guduvanchery). Supremus is ₹10-15L more expensive but Guduvanchery area is significantly more developed — railway station, local market, schools all close by. Also the railway connectivity is a big deal: Guduvanchery station to Tambaram is 12 mins, to Beach terminus is 45 mins. Do you think the price difference is justified given your experience with Adora? Or is the savings really worth giving up that connectivity?`,
    pastDate(55))

  await addComment(adora.id, U.selvam,
    `Good question Jayakumar. For me it came down to one thing: I drive. I have a car and I commute to Siruseri IT Park which is actually closer from Adora than from Guduvanchery. So the ₹12L saved was real money.

But — and this is important — if you rely on trains or don't have a car, Supremus is absolutely worth the premium. Guduvanchery station changes everything for that lifestyle.

Adora has one advantage Supremus doesn't: it's a newer project with fresher specifications and design. The BBA shows the construction started 2 years later. So you're getting current-standard construction rather than slightly older specs. Small factor but real.`,
    pastDate(52))

  await addComment(adora.id, U.bala,
    `Went to Adora site last week. Construction looks okay overall but I noticed the compound wall on the south boundary is still incomplete — roughly 40 metres of it looked like it was disputed or delayed. Asked the site security and got a vague answer about some adjacent land issue. Worth asking the Casagrand legal team directly: is there any encroachment or boundary dispute on the southern side? Make sure the approved plan and actual plot boundary match before finalising your booking.`,
    pastDate(48))

  await addComment(adora.id, U.selvam,
    `@Bala — I raised exactly this with the project manager after your comment. He said the south wall delay is because of a temporary easement issue with the adjacent agricultural land owner, not an encroachment. A resolution is expected within 3 months and the wall will be completed then. He showed me the legal notice sent to the adjacent owner. Seems like a standard administrative issue rather than a title problem, but worth following up on if you book.`,
    pastDate(45))

  // ── CASAGRAND GRANDIOSE ────────────────────────────────────────
  console.log('Creating Casagrand Grandiose...')
  const grandiose = await createTopic({
    slug:           'casagrand-grandiose-devanahalli',
    propertyName:   'Casagrand Grandiose',
    title:          'Casagrand Grandiose Devanahalli — airport city living, real buyer review (booking done)',
    description:    `Posting my experience with Casagrand Grandiose in Devanahalli after finally booking here last month. My family spent almost a year evaluating North Bengaluru options and this is where we landed. Sharing everything honest.

Context: My office is at Manyata Tech Park. With the Hebbal elevated highway, morning commute to Manyata is 35-40 mins on most days. My wife works at Bengaluru International Airport, 15 minutes from the project. That dual connectivity is hard to beat in any other part of the city.

Project overview: Grandiose is on NH 44 near Devanahalli town, about 4km from BIAL main entrance gate. 12 acres, 1,100 units across 5 towers (G+25 floors each). Large project — community feel will be strong once occupied, there will be a proper resident community here.

Site visit observations (3 weeks ago): Tower 1 is at 20th floor. Tower 2 at 14th floor. Tower 3 has foundation started. The construction pace looked solid — it was a weekday and I counted easily 200+ workers on site. Equipment is modern, not the old-school scaffolding you see at some South Bengaluru sites.

Pricing as of April 2025:
— 2BHK 1080 sqft: ₹68L to ₹82L
— 3BHK 1420 sqft: ₹88L to ₹1.05Cr
— 3BHK Premium 1650 sqft: ₹1.08Cr to ₹1.22Cr

Against competition: Brigade Cornerstone is 8% more expensive. Shriram Blue (Yelahanka) is 12% cheaper but specifications are noticeably lower. Casagrand hits a sweet spot.

What genuinely excited me:
— The NH 44 / North Bengaluru infrastructure story is real: Peripheral Ring Road (STRR), suburban rail phase 2 approved for airport line, metro Phase 3 environmental clearance for Devanahalli branch. This is not wishful thinking, tenders are published.
— KIAL proximity for frequent flyers. I travel for work every 2 weeks — reaching the airport in 15 minutes changes quality of life.
— 24/7 power backup: 3 kVA per apartment + full common area backup.
— RERA Karnataka K-RERA/PRJ/KGA/2024/0782 — verified on portal.

Real concerns I'm tracking:
— Devanahalli micro-market has high supply. Many projects, moderate rental demand currently (mainly from airport workers and industrial area staff). Investment returns are uncertain in the short term.
— Water supply from borewell currently. BWSSB connection is 3-4 years out per the project team. Summer water stress in North Bengaluru is real, I've heard from people already living there.
— No metro yet. Without personal vehicle in this area, auto fares to Hebbal are ₹400-500 for one way. Significant operational cost.
— The area around the project has active construction dust. First year of residence will require extra air purifiers and cleaning.

Decision: Booked. The infrastructure thesis for North Bengaluru plays out over 7-10 years. If you can tolerate 4-5 years of rough edges while the area develops, the appreciation should be meaningful. Not for someone who needs everything ready now.`,
    address:        'NH 44, Devanahalli, Bengaluru 562110',
    cityId:         CITY.bengaluru,
    propertyType:   'APARTMENT',
    userId:         U.harish,
    developerSlug:  'casagrand',
    developerName:  'Casagrand Builder',
    priceMin:       6800000,
    priceMax:       12200000,
    createdAt:      pastDate(22),
  })

  await addComment(grandiose.id, U.meera_b,
    `Good detailed post. On the water concern — I asked the Casagrand sales team specifically about this. They said the project has a dedicated 3-lakh litre overhead tank fed by 3 borewells (at different depth levels), plus an STP for recycled water for garden use. They also have a tanker water agreement with a local supplier as emergency backup. The design looks reasonable on paper but actual performance post-occupation is where you'll know for sure. The first summer (likely 2027) will be the real test.`,
    pastDate(20))

  await addComment(grandiose.id, U.suresh_a,
    `I live in Devanahalli currently (not Casagrand, an older apartment nearby) and want to give ground-level reality. Water: in summer 2024 we were on tanker for 6 weeks when borewell levels dropped significantly. Not a disaster but stressful. Ask specifically about the recharge pits and groundwater recharge design for Grandiose. Good rainwater harvesting can make a real difference.

On the positives — the area is genuinely improving. Devanahalli town has a proper hospital now (Columbia Asia), decent local market, a new mall coming up on NH 44. It's not Whitefield from 5 years ago but it's moving in that direction.`,
    pastDate(18))

  await addComment(grandiose.id, U.harish,
    `Thanks Suresh — ground-level input from an actual resident is exactly what's hard to find online. I'll definitely raise the recharge pit question during the next site visit. The Columbia Asia hospital proximity is something I had noted too.

On the water issue: I've accepted this as a known risk for North Bengaluru right now. The mitigation I'm doing is budget ₹50K for RO system and water storage capacity in the flat itself. It's not ideal but it's a solvable problem.`,
    pastDate(16))

  await addComment(grandiose.id, U.meera_b,
    `One more thing worth mentioning — Casagrand Grandiose is doing construction-linked payment plan (CLP) but the plan structure is more front-loaded than usual for a Casagrand project. The 3rd milestone (which is at slab casting of 10th floor) requires 20% of the total price. For a ₹1Cr flat that's ₹20L at a relatively early stage. Compare with Joie (Chennai) where 20% is at the 20th floor slab. Just something to negotiate or plan cash flow around if you're buying on a loan.`,
    pastDate(14))

  // ── CASAGRAND ETERNIA ──────────────────────────────────────────
  console.log('Creating Casagrand Eternia...')
  const eternia = await createTopic({
    slug:           'casagrand-eternia-oragadam',
    propertyName:   'Casagrand Eternia',
    title:          'Casagrand Eternia Oragadam — is this the right pick for IT + manufacturing belt professionals?',
    description:    `Started researching Casagrand Eternia in Oragadam about 3 months back and recently decided to book. Sharing my full analysis since there's very little detailed discussion about this specific project online.

My situation: I work at a company in Mahindra World City (Chengalpattu direction) and my wife works in Sholinganallur. Oragadam is not the most obvious choice for both locations but the price point and connectivity via VK Road and NH 45 made it viable.

Project basics: Eternia is on the Oragadam-Guduvanchery Road, about 3km from the Oragadam SIPCOT industrial area entry and 5km from Guduvanchery railway station. 18 acres, 3 towers, G+20 floors, 840 units total. All RERA compliant — TN/01/Building/0267/2024 verified.

Configuration and pricing:
— 1BHK (520 sqft) — yes they have 1BHKs here, starting at ₹29.5L. Good for single professionals.
— 2BHK (870 sqft): ₹42L to ₹54L
— 2BHK Premium (1020 sqft): ₹51L to ₹62L
— 3BHK (1210 sqft): ₹64L to ₹79L

These are among the most competitive prices Casagrand has offered in the Chennai MMR in recent years. The reason is Oragadam is less premium in perception than OMR, even though the actual commute to IT parks from here is comparable for many employees.

Construction status: Saw all 3 towers under construction. Tower 1 is at 15th floor, Tower 2 at 10th floor, Tower 3 at 4th floor. Possession December 2026 is stated. Realistic estimate from me looking at pace: April-June 2027.

Why this works:
— The entire Oragadam-Guduvanchery-Padur triangle is becoming one residential cluster. Prices here today are where Guduvanchery prices were 4 years ago. Early buyer advantage is real.
— Guduvanchery railway station at 5km gives suburban rail access — trains to Tambaram every 15-20 mins during morning peak.
— The Oragadam SIPCOT has 30+ major manufacturing companies (Hyundai, Daimler, BMW plant, Saint-Gobain). A lot of mid-level managers from these companies prefer to buy here. This creates stable rental demand that's different from IT-dependent OMR.
— Casagrand specs at this price are genuinely better than most competing projects in the corridor.

What's not great:
— Oragadam itself is industrial. Air quality is better than people expect but it's not green and scenic like ECR or Pallikaranai.
— Social infrastructure is thin. No quality school, no private hospital within 2km currently.
— The 1BHK units feel slightly cramped at 520 sqft — the living + dining combined is functional but not spacious.

For end-users who need South Chennai industrial/IT connectivity at reasonable price: this is a solid option. For investors: rental demand exists but it's middle income, not premium. Yields should be around 3.5-4%.`,
    address:        'Oragadam-Guduvanchery Road, Oragadam, Chennai 602105',
    cityId:         CITY.chennai,
    propertyType:   'APARTMENT',
    userId:         U.ganesan,
    developerSlug:  'casagrand',
    developerName:  'Casagrand Builder',
    priceMin:       2950000,
    priceMax:       7900000,
    createdAt:      pastDate(17),
  })

  await addComment(eternia.id, U.priya_iyer,
    `Thanks for this. The 1BHK option is interesting — I work at Hyundai Oragadam and this would be perfect. But 520 sqft with rent from a place of this size worries me a bit. Do the 1BHK units have a proper separate kitchen or is it the studio-style open kitchen? That's a dealbreaker for me for daily cooking smells.`,
    pastDate(15))

  await addComment(eternia.id, U.ganesan,
    `The 1BHK has a semi-closed kitchen — there's a partial wall and the kitchen counter faces the living area but the cooking zone is separated by a raised counter. Not fully closed but it has a chimney provision. Better than fully open, not as good as a completely walled kitchen. For daily South Indian cooking with heavy tempering, you'd want to run the chimney constantly.

Also the 1BHK bathroom is on the smaller side (40 sqft approximately). The 2BHK units have proper bathrooms so if budget allows, go with 2BHK and rent one room out if needed.`,
    pastDate(13))

  await addComment(eternia.id, U.senthil,
    `One data point from the Hyundai plant area — I have a colleague who rents in Oragadam currently. He pays ₹8,500/month for a 2BHK in an older independent house. With a 2BHK in Eternia at around ₹55L value, EMI would be roughly ₹44,000/month assuming 85% loan at 8.75%. That gap between rental equivalent and EMI is about ₹35,500/month — which is a meaningful cost of ownership over 10 years. Make sure you're buying for long-term lifestyle/asset reasons and not expecting rental to cover EMI anytime soon.`,
    pastDate(11))

  // ── GSQUARE THE ESTATE ─────────────────────────────────────────
  console.log('Creating Gsquare The Estate...')
  const theEstate = await createTopic({
    slug:           'gsquare-the-estate-kovalam-ecr',
    propertyName:   'Gsquare The Estate',
    title:          'Gsquare The Estate ECR Kovalam — DTCP plots review, bought for retirement home (detailed)',
    description:    `After 2 years of searching for the right plot, we finalised and registered at Gsquare The Estate on ECR near Kovalam. Posting a detailed review since I found very little credible information about Gsquare online — mostly just their own marketing material.

Our situation: My parents are in their early 60s, want to build a small house with a garden near the sea. ECR appealed for the sea air, the relatively lower traffic compared to OMR, and the green surroundings. We looked at 6 plot projects on ECR before deciding.

About Gsquare Realty: Chennai-based developer focused exclusively on plotted communities. Not a big brand like Casagrand or TVS Emerald — their marketing is quiet and most of their business comes through word of mouth and broker networks. Been operating since 2014, have delivered multiple gated communities. I spoke to 3 families from their older ECR project (Gsquare Serene, now fully occupied) before deciding. All 3 confirmed registration happened as promised and the layout infrastructure is complete.

The Estate specifics:
Location: Near Kovalam junction on ECR, west side of the road (inland, not sea-facing). The sea is approximately 800m to 1km from the layout boundary depending on the plot location. You can hear the sea on quiet evenings. No direct sea access.
Total area: 25 acres, 340 plots across 2 phases. Phase 1 has 170 plots, Phase 2 is upcoming.
Plot sizes: 600 sqft (40x15), 1000 sqft (40x25), 1200 sqft (40x30), 2000 sqft (50x40), 2400 sqft (60x40)
CMDA layout approval: Yes. We physically verified the approval document in their office and cross-checked on the CMDA portal. All in order.

Pricing we paid (Phase 1, March 2025):
1200 sqft: ₹70L (₹5,833/sqft)
Corner plots: 10% premium

This is on the higher side. Comparable non-gated plots on ECR can be found for ₹4,000-4,500/sqft but without proper drainage, compound wall, or a community of like-minded buyers. The premium for Gsquare is real but so is the value.

Infrastructure inside the layout (current status):
— 30 feet BT road on main avenue: complete
— 20 feet internal roads: complete and motorable
— Compound wall and gate with security: complete
— Underground drainage and water supply lines: being laid (ongoing)
— Street lights: installed and operational
— 3 parks inside the layout: demarcated, landscaping yet to start

What I independently verified:
1. CMDA layout approval — physical document + CMDA portal ✓
2. EC (Encumbrance Certificate) for our specific plot — 30 years clear ✓
3. Patta transferred to our names — done within 60 days of full payment ✓
4. Independent lawyer's title opinion — clear ✓
5. Spoke to 3 families from their Serene layout — positive experience confirmed ✓

What I'm watching:
— Clubhouse with small pool is promised in the BBA — 18 months from handover. No construction started yet. This is the one uncertain deliverable.
— The access road from ECR main to the layout is 18 feet and gets slippery and muddy during heavy rain. Not an issue for a settled resident but worth noting.

Honest investment assessment: ECR land is genuinely scarce near Kovalam. Rental demand is seasonal (holiday rentals from December to March). Do not buy here expecting year-round rental yield. Buy if you're building and staying — or holding for 8-10 years for pure appreciation.`,
    address:        'Near Kovalam Junction, ECR, Chennai 603112',
    cityId:         CITY.chennai,
    propertyType:   'PLOT',
    userId:         U.preethi_s,
    developerSlug:  'gsquare',
    developerName:  'Gsquare Realty',
    priceMin:       3600000,
    priceMax:       13200000,
    createdAt:      pastDate(67),
  })

  const estateC1 = await addComment(theEstate.id, U.bala,
    `Very useful review — probably the most detailed I've seen about Gsquare. Quick question: you said the plots are west of ECR (inland side). Is there any CRZ (Coastal Regulation Zone) restriction that applies even 800m from the sea? I've heard that CRZ notification extends 500m from High Tide Line (HTL) for protected coastline. If 800m puts you outside the 500m buffer, you should be fine. But if it's right at the boundary it could restrict the type of structure you can build.`,
    pastDate(64))

  await addComment(theEstate.id, U.preethi_s,
    `Good point Bala. Our lawyer specifically checked this. The layout falls in CRZ-III zone where the restricted zone is 200m from HTL (not 500m — that applies to CRZ-I). The CMDA approval itself confirms no CRZ restriction applies to the layout. Our lawyer verified against the CRZ notification map from MoEFCC.

That said, when building the house, get independent CRZ clearance verification done again, especially if you want to add a rooftop terrace or go above G+1 height. Rules can be interpreted differently by approving authorities.`,
    pastDate(61))

  await addComment(theEstate.id, U.ganesan,
    `We also looked at The Estate before deciding on a different project. One clause in their sale agreement that concerned us: plot buyers cannot start construction until 70% of plots in the respective phase are sold. We asked them to cap this at 12 months (i.e., after 12 months you can build regardless of sales status) and they refused to modify the clause. We walked away because of this. May not bother everyone but if you want to start building quickly it's worth knowing.`,
    pastDate(58))

  await addComment(theEstate.id, U.preethi_s,
    `@Ganesan — Yes we saw this clause too. We negotiated differently — asked for confirmation in writing of current sales status (Phase 1 was 74% sold at the time of our booking) which meant the restriction would lift very soon. We also got a clause that if 70% isn't achieved within 18 months from our booking date, we can build regardless. They agreed to this as a side letter. Worth negotiating rather than just walking away, especially if the layout is otherwise clean.`,
    pastDate(55))

  // ── GSQUARE ARCADIA ────────────────────────────────────────────
  console.log('Creating Gsquare Arcadia...')
  const arcadia = await createTopic({
    slug:           'gsquare-arcadia-kelambakkam',
    propertyName:   'Gsquare Arcadia',
    title:          'Gsquare Arcadia Kelambakkam — plotted community near OMR, is it worth it? On-site photos and price breakdown',
    description:    `Posting about Gsquare Arcadia in Kelambakkam since there's very little genuine discussion online about this project — mostly sales-y blogs and nothing from actual visitors. I went to the site 3 weeks back with my wife and took notes on everything.

Why Kelambakkam: It sits at the junction of OMR and Vandalur-Kelambakkam road which gives it reach in two directions. OMR IT corridor (Sholinganallur, Perungudi) is 18-22km north. GST Road and Mahindra World City are 10km south via VK Road. Many dual-income IT families targeting this area for exactly this reason.

Gsquare Arcadia specifics:
— Location: About 2km from Kelambakkam main signal, turn off Padur junction, set back from the main road
— Total area: 18 acres, 260 plots in 2 phases
— Approval: DTCP Chengalpattu District (area falls outside CMDA limit). Approval number verified on Tamil Nadu DTCP portal. This is a genuine approval, not just a self-certification.
— Plot sizes: 800 sqft, 1200 sqft, 1600 sqft, 2000 sqft
— Road widths inside: 30 feet main avenue, 20 feet internal

Pricing as of March 2025:
— 800 sqft: ₹28.5L (₹3,562/sqft)
— 1200 sqft: ₹41.5L (₹3,458/sqft)
— 1600 sqft: ₹53.5L (₹3,344/sqft)
— 2000 sqft: ₹65L (₹3,250/sqft)

Compared to ECR plots (₹5,500-6,000/sqft for comparable quality) this is significantly cheaper. The gap reflects the difference in desirability — ECR has sea proximity and green surroundings; Kelambakkam is more functional than scenic.

What I saw on site:
— Compound wall is complete on all four sides
— BT roads on main avenue done. Internal roads have gravel, BT work in progress.
— Drainage lines have been laid (visible in the open trenches)
— Corner stones are placed for all plots — easy to identify your specific plot
— 78 plots sold out of 260 as per the sales register (Phase 1)
— 2 show houses inside the layout from early buyers — good to see actual construction happening

Infrastructure in surrounding area:
— Chettinad Health City hospital is at Kelambakkam junction (1.5km from the layout) — this is a good 350-bed hospital, not a clinic
— Siruseri SIPCOT with IT companies (TCS, Infosys, Zoho campus) is about 6km via OMR
— Kelambakkam government school is nearby. Private school buses from Velammal operate in the area.

What I'm less sure about:
— Gsquare is managing 3 projects simultaneously (The Estate ECR, Arcadia Kelambakkam, and one near Maraimalai Nagar). Small developer spreading across multiple sites can mean slower execution.
— Clubhouse is announced but no written commitment with timeline in the BBA. This is a negotiating point.
— Padur to Kelambakkam road connectivity is currently a 2-lane road and gets congested near the junction. There's talk of widening but nothing confirmed.

Overall sense from the visit: The project is legitimate. The approval is real. The sales team was straightforward, didn't push unrealistic timelines, and let us walk around independently. If you're looking for a DTCP approved gated plot in the OMR southern extension at a reasonable price, this is a serious option.`,
    address:        'Near Padur Junction, Kelambakkam, Chennai 603103',
    cityId:         CITY.chennai,
    propertyType:   'PLOT',
    userId:         U.saravanan,
    developerSlug:  'gsquare',
    developerName:  'Gsquare Realty',
    priceMin:       2850000,
    priceMax:       6500000,
    createdAt:      pastDate(52),
  })

  await addComment(arcadia.id, U.kowsalya,
    `We visited Gsquare Arcadia last month too. The sales team mentioned something interesting — Chengalpattu municipality is finalising a 4-lane road upgrade from Padur to Kelambakkam junction as part of the smart city road development plan. If that comes through it will significantly cut the congestion and make the layout much more accessible. But Tamil Nadu government road projects in smaller municipalities often drag 3-5 years from tender to completion. Useful upside to know, don't bank on it in your buying decision.`,
    pastDate(49))

  await addComment(arcadia.id, U.vignesh,
    `Good write-up. One important correction on the healthcare point: Chettinad Health City at Kelambakkam is actually a tertiary care hospital with cardiology, neurology, and oncology departments — not just a general hospital. For residents in this area it's genuinely strong healthcare infrastructure. I know multiple families who've had serious procedures done there. So the "no good hospital nearby" concern that people have about Kelambakkam is largely outdated now.`,
    pastDate(46))

  await addComment(arcadia.id, U.saravanan,
    `Thanks both. The Chettinad hospital point is a meaningful positive — I'd personally visited it before posting and can confirm it's a proper multi-speciality facility with 24-hour emergency. That changes the risk profile for families with elderly members.

On the road widening — I've learned to never factor government infrastructure projects into buying decisions until they're actually under construction. Appreciate the heads up though, if it happens it's a bonus.`,
    pastDate(43))

  // ── GSQUARE TRANQUIL ──────────────────────────────────────────
  console.log('Creating Gsquare Tranquil...')
  const tranquil = await createTopic({
    slug:           'gsquare-tranquil-maraimalai-nagar',
    propertyName:   'Gsquare Tranquil',
    title:          'Gsquare Tranquil Maraimalai Nagar — registered our plot last month, honest review of a smaller developer',
    description:    `I want to share a genuine experience with Gsquare Tranquil in Maraimalai Nagar since I've now been through the entire process — from initial site visit to registration. This isn't a first-time visitor review, I'm writing after actually completing the purchase.

Background: My husband and I were looking for a plot in South Chennai suburbs for about 18 months. Our requirement was simple: DTCP approved gated community, clean title, developer who actually delivers, within ₹40 lakhs. This narrowed things down considerably.

Why Maraimalai Nagar came up: The SIPCOT industrial area there is one of the more stable employment zones in South Chennai — companies like Hyundai, Ford (earlier), Ashok Leyland, Saint-Gobain have been operating there for 15-20 years. This creates a baseline demand for housing from employees who prefer to own near work. Not glamorous but stable.

Gsquare Tranquil details:
— Location: 1.5km from Maraimalai Nagar SIPCOT entry, off the main GST Road (NH 45)
— Total area: 22 acres, 310 plots across 3 phases
— Phase 1 (110 plots): Fully registered and handed over. Phase 2 (120 plots): Registration happening — this is what I bought. Phase 3 (80 plots): Pre-launch.
— DTCP Chengalpattu approval — verified on portal

We bought a 1200 sqft (40x30) plot in Phase 2. Registration happened last month — Patta is in our names, EC shows our ownership. Gsquare actually does what they promise.

Pricing Phase 2:
— 1000 sqft: ₹28.5L (₹2,850/sqft)
— 1200 sqft: ₹34.5L (₹2,875/sqft)
— 1500 sqft: ₹41.5L (₹2,767/sqft)
— 2000 sqft: ₹54L (₹2,700/sqft)

Phase 3 is pre-launching at ₹3,100/sqft (announced). Given Phase 1 and 2 track record it should sell reasonably well.

The big reassurance: Phase 1 plots are occupied. There are actual completed houses inside the layout. Families are living there. You can visit, speak to them, see their patta documents. I did this — spoke to 4 families from Phase 1. All confirmed smooth registration, roads and drainage done, compound wall maintained. One family has started building their second floor.

Infrastructure and surroundings:
— BT roads done throughout the layout
— Underground water supply and drainage lines complete
— 24-hour security at main gate
— Community hall (small, but exists and functions)
— Local buses to Tambaram junction from Maraimalai Nagar main road every 20-30 minutes during daytime

Honest limitations:
— This is an industrial suburb. Air quality is decent but not what you'd get in ECR or the residential pockets of Velachery. There's some dust from industrial activity especially in dry months.
— No luxury amenities. Gsquare doesn't promise a clubhouse or pool here — just community hall and parks. Don't come in expecting resort-style amenities.
— Resale market is middle-income. If you want to sell in 5 years, your buyers are SIPCOT employees and nearby IT professionals, not high-income families. Price appreciation is steady but not spectacular.
— The scenic appeal is low. This is functional not beautiful.

Who should buy here: Anyone who wants a plot at a reasonable price, clean title, proven developer delivery, and doesn't need ECR aspirational lifestyle. Particularly makes sense for SIPCOT employees, manufacturing sector professionals, or anyone targeting South Chennai industrial zone connectivity.

Happy to connect anyone with Phase 1 residents I spoke to if you want ground truth directly from them.`,
    address:        'Near SIPCOT Industrial Area, Maraimalai Nagar, Chennai 603209',
    cityId:         CITY.chennai,
    propertyType:   'PLOT',
    userId:         U.rajalakshmi,
    developerSlug:  'gsquare',
    developerName:  'Gsquare Realty',
    priceMin:       2850000,
    priceMax:       5400000,
    createdAt:      pastDate(82),
  })

  await addComment(tranquil.id, U.deepa_nat,
    `This is probably the most honest review of any smaller Chennai developer I've read here. My colleague at work bought a Phase 1 plot from Gsquare Tranquil about 2 years ago. Everything you said is accurate — registration was clean, roads are done, she's started construction. The community is mostly SIPCOT employees and a few IT professionals from the Perungalathur area. Decent neighbours, quiet neighbourhood. Not fancy, but real.`,
    pastDate(79))

  await addComment(tranquil.id, U.chelladurai,
    `One addition that's worth mentioning for people evaluating this location — Maraimalai Nagar has direct bus connectivity to Tambaram junction (roughly 15 minutes), from where you have trains to Chennai Central (45 minutes), Chengalpattu (20 minutes), and local EMU trains. There's also an auto stand at Maraimalai Nagar for last-mile connectivity. So this is not as car-dependent as some other peripheral locations in South Chennai. Worth knowing for families where not everyone drives.`,
    pastDate(76))

  await addComment(tranquil.id, U.rajalakshmi,
    `@Chelladurai — Yes, this was a specific factor for us. My mother visits frequently from Tambaram and she can take the direct bus without asking anyone for a drop. That kind of basic public transport connectivity matters a lot for multi-generational families. Thanks for adding this for others reading the thread.

@Deepa — Thank you for the validation from your colleague. That kind of direct confirmation from actual Phase 1 residents is what gave us confidence to proceed. If anyone wants Phase 1 resident contacts, send me a message through the forum and I'll share.`,
    pastDate(73))

  await addComment(tranquil.id, U.karthikeyan,
    `Question from someone considering this — is there any ongoing issue with the Phase 2 plots regarding document handover? I've heard from one source (unverified) that Phase 2 registration was delayed by 3 months. You mentioned yours happened last month — was the timeline smooth or was there any delay? Asking because I'm evaluating my purchase decision partly on this.`,
    pastDate(68))

  await addComment(tranquil.id, U.rajalakshmi,
    `Yes, there was a delay of about 6 weeks for our registration specifically. The reason given was that 3 adjacent plots in our block had a minor survey number discrepancy that needed a sub-registrar clearance before the entire block could proceed for registration. This was a government process delay, not a developer default. They kept us updated every 2 weeks and the process completed without any extra cost to us.

Is this concerning? Somewhat — it shows that even small administrative issues can cause delays. But the delay was 6 weeks, communication was proactive, and the registration did happen. Not a red flag in my assessment, just a reality of land registration in Tamil Nadu.`,
    pastDate(65))

  console.log('\n✅ All topics and comments created successfully.')
  console.log('Summary:')
  console.log('  Casagrand Joie (Chennai)            :', joie.id)
  console.log('  Casagrand Palazzo (Chennai)          :', palazzo.id)
  console.log('  Casagrand Adora (Chennai)            :', adora.id)
  console.log('  Casagrand Grandiose (Bengaluru)      :', grandiose.id)
  console.log('  Casagrand Eternia (Chennai)          :', eternia.id)
  console.log('  Gsquare The Estate ECR (Chennai)     :', theEstate.id)
  console.log('  Gsquare Arcadia Kelambakkam (Chennai):', arcadia.id)
  console.log('  Gsquare Tranquil Maraimalai (Chennai):', tranquil.id)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
