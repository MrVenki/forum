/**
 * Seed Part 2: More Casagrand & Gsquare ongoing projects
 * Run: node scripts/seed-casagrand-gsquare-2.js
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
    data: {
      ...data,
      viewCount: Math.floor(Math.random() * 1200) + 300,
    },
  })
}

async function addComment(topicId, userId, content, createdAt, parentId = null) {
  return prisma.comment.create({
    data: { topicId, userId, content, createdAt, parentId },
  })
}

async function main() {
  console.log('Starting seed part 2...\n')

  // ═══════════════════════════════════════════════════════
  // CASAGRAND MERCURY — Perambur, North Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Mercury...')
  const mercury = await createTopic({
    slug: 'casagrand-mercury-perambur-chennai',
    propertyName: 'Casagrand Mercury',
    title: 'Casagrand Mercury – 20-acre township in Perambur with 1678 units | Thoughts?',
    description: `Finally took the plunge and visited the Casagrand Mercury site at Perambur last weekend with my wife. We've been tracking this project since it launched – the scale is honestly impressive but I had some concerns I want to discuss.

The site spans 20 acres and they're doing 5 towers of 34 floors each. Total 1678 units across multiple RERA approvals – TN/29/Building/043/2024, TN/29/Building/055/2024, and TN/29/Building/0069/2024. The clubhouse they're calling "Club Celest" is supposed to be 89,000 sq ft which is massive, and they're promising 3 swimming pools.

We looked at a 2BHK of 1,190 sq ft priced at ₹1.02 Cr and a 3BHK at 1,659 sq ft going for around ₹1.45 Cr. Per sq ft works out to roughly ₹8,500–9,000 range.

My concerns:
1. Perambur is an established locality but the immediate micro-market around this site has some mixed neighborhoods. The stretch near Kolathur side looks better.
2. 1678 units means this will take years to complete. Phase-wise possession is supposedly Sep 2027 for early phases but RERA shows Mar 2029 for later towers.
3. Traffic on Perambur High Road is already bad – adding 1678 families will worsen it significantly.

On the positive side – the 34-floor towers will have incredible views of North Chennai, and the Kolathur–Perambur metro connectivity is a plus. Anna Nagar is 20 minutes away.

Has anyone else visited? What did you make of the pricing and construction quality? They're claiming 807 units already sold.`,
    address: 'Perambur High Road, near Kolathur, Perambur, Chennai 600011',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.karthikeyan,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 10200000,
    priceMax: 34300000,
    createdAt: pastDate(38),
  })
  {
    const c1 = await addComment(mercury.id, U.meenakshi,
      `Visited Mercury two weeks back – actually went twice, once on a weekday and once Sunday to see how busy the site is. The construction is moving well on Tower 1 and Tower 2. Tower 1 is around 12th floor already and they started Tower 3 foundation. The sample flat interior quality looked decent – Somany tiles in bathrooms, Hindware fittings, which is standard Casagrand. But what bothered me was the density – 1678 units in 20 acres is about 84 units per acre which is very high. For comparison, Casagrand Opulent at Sholinganallur has lower density. Still, for North Chennai pricing, ₹8,500/sqft isn't bad. We booked a 2BHK on 22nd floor. The high-floor views of the city skyline will be amazing.`,
      pastDate(36, 3))
    await addComment(mercury.id, U.senthil,
      `The 34-floor thing sounds great on paper but think about elevator wait times with 1678 families. Even with 4 lifts per tower that's going to be brutal during peak hours. Also asked the sales guy about the forest trails and organic farming they advertise – he said it's part of Phase 2 development and they haven't even started planning that section yet. Classic Casagrand – amenities on brochure materialise only in last phases. The RERA registration for all three phases is a good sign at least.`,
      pastDate(35, 5))
    await addComment(mercury.id, U.jayakumar,
      `I work in Kilpauk and was seriously considering Mercury for the North Chennai location. But I got a better offer from Casagrand Medora in Korattur – only 155 units, much less density, possession Jan 2026 which is much sooner. The price per sqft is similar. If you're okay with a bigger community, Mercury makes sense for the 89,000 sqft clubhouse. If you prefer quieter low-density living, smaller projects are worth considering. North Chennai options are limited so Mercury fills an important gap.`,
      pastDate(33, 2), c1.id)
    await addComment(mercury.id, U.bala,
      `Ran the numbers – ₹1.02 Cr for 1190 sqft = ₹8,571/sqft. For Perambur with metro connectivity and 34-floor tower that's competitive vs what you'll pay in Mogappair or Anna Nagar. But add GST at 5% (₹5.1L), registration (₹6-7L), maintenance deposit, car parking (₹5-6L) – all-in cost for 2BHK is ₹1.18-1.20 Cr easily. For that money you could consider Avadi stretch if budget is the concern. But if address matters, Perambur beats Avadi.`,
      pastDate(30))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND SUNCITY — Melakottaiyur, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Suncity...')
  const suncity = await createTopic({
    slug: 'casagrand-suncity-melakottaiyur-chennai',
    propertyName: 'Casagrand Suncity',
    title: 'Casagrand Suncity at Melakottaiyur – 40-acre township, Phase I launching | Pre-launch review',
    description: `Casagrand Suncity is one of the most ambitious projects I've seen announced in South Chennai in a while. 40 acres, 1992 total units across phases, on the Kelambakkam-Vandalur main road at Melakottaiyur. They're calling it a township format and I can see why.

Phase I alone covers 13 acres with 1402 units across 4 towers of 36 floors each (2B + G + 36). RERA for Phase I: TN/35/Building/0053/2024. Phase II RERA already registered: TN/35/Building/0063/2025. Possession target is Dec 2027 to Jan 2028.

Pricing: 2BHK starts at ₹59L (1,085 sqft = ₹5,437/sqft), 3BHK around ₹85L, 4BHK touching ₹1.51 Cr. These are launch prices – expect 10-15% appreciation by the time the project completes.

Location analysis:
- Melakottaiyur sits between Vandalur and Kelambakkam – good spot because it benefits from both GST Road and the OMR/ECR connectivity
- Chettinad Health City is less than 2 km away – great for employment
- The upcoming Chennai Metro Phase 2 corridor (Line 4) has a station planned near Vandalur
- SIPCOT Vandalur and the industrial belt around Oragadam make this a genuine dual-employment zone

Concerns: The stretch from Perumbakkam to Kelambakkam is getting very congested with multiple large projects – Casagrand Adora, Joie, now Suncity. Long-term infrastructure may struggle. Water table in this area also needs checking.

Anyone from Melakottaiyur or nearby Vandalur who knows the ground reality better?`,
    address: 'Kelambakkam-Vandalur Main Road, Melakottaiyur, Chennai 600127',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.priya_iyer,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 5900000,
    priceMax: 15100000,
    createdAt: pastDate(25),
  })
  {
    const c1 = await addComment(suncity.id, U.nithya,
      `I'm from Vandalur – lived here for 12 years. The Melakottaiyur belt is genuinely underrated. Until recently it was all agricultural land and small industries. The metro announcement changed everything. Land values doubled in 2 years. My main concern about Suncity is the sheer number of units – 1992 families in one community is a small town. The civic infrastructure (water, sewage, roads) around Melakottaiyur is not ready for this. CMC limits here are still being expanded. Casagrand will need to provide everything – UGD, water treatment, everything – because CMWSSB doesn't serve this area yet. That's not necessarily bad (Casagrand does have good internal infra) but factor in higher maintenance costs.`,
      pastDate(23, 4))
    await addComment(suncity.id, U.saravanan,
      `The ₹59L for 2BHK pricing is genuinely attractive if Melakottaiyur develops as planned. But that 1085 sqft is the carpet area or built-up? When I visited the Casagrand office they said 1085 is super built-up. Actual carpet by RERA calculation would be around 800-820 sqft. For a 2-adult family it's fine. For a family with kids and elderly parents, it's tight. The 36-floor towers are exciting but check how many units per floor – if it's 8 units per floor × 36 floors × 4 towers that's 1152 units in Phase I already. The lobby and parking situation needs serious thought.`,
      pastDate(21, 2))
    await addComment(suncity.id, U.chelladurai,
      `Booked a 3BHK here last month at ₹82L. My logic: I work in Oragadam industrial area (Hyundai vendor), my wife works near Vandalur medical college. This location is literally equidistant. The commute I had before from Tambaram was brutal – 45 minutes each way. Melakottaiyur puts us within 15 minutes of both offices. The 186+ amenities is clearly marketing fluff but a genuine 3-pool facility and a proper clubhouse matters for the kids. Possession Dec 2027 gives us time to save for furniture and registration costs. So far the Casagrand team has been responsive.`,
      pastDate(18, 6))
    await addComment(suncity.id, U.rajalakshmi,
      `One thing nobody mentions about Suncity – the township format means Casagrand controls everything including the maintenance vendor indefinitely. Once possession is given, you're locked into their ecosystem. Check the maintenance agreement carefully before signing. Their maintenance charges at similar projects run ₹3-4/sqft/month which for a 1200 sqft flat is ₹3600-4800/month. Over 10 years that's serious money. Also see if they allow residents association to take over management after a few years.`,
      pastDate(15, 1))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND HOLACHENNAI — Sholinganallur, OMR
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Holachennai...')
  const holachennai = await createTopic({
    slug: 'casagrand-holachennai-sholinganallur-omr',
    propertyName: 'Casagrand Holachennai',
    title: 'Casagrand Holachennai – 30 acres, 1818 units + villas in Sholinganallur | Premium OMR project discussion',
    description: `Casagrand Holachennai is their biggest bet on OMR in recent times – 30 acres in Sholinganallur with a mix of 2, 3, 4 BHK apartments AND 5 BHK standalone villas on the same campus. RERA: TN/29/Building/0352/2024. Possession target Dec 2028 (RERA certified May 2029 which is more realistic).

Total 1818 units, 13-14 towers, 25 floors each. The villa segment is what makes this unusual – having detached villas within a high-density apartment community raises some questions about privacy and exclusivity.

Pricing I got from the site visit:
- 2 BHK: ₹76L onwards (likely around 1200-1300 sqft)
- 3 BHK: ₹1.10-1.40 Cr
- 4 BHK apartment: ₹1.80-2.20 Cr
- 5 BHK Villa: ₹2.80-3.21 Cr

Sholinganallur is prime OMR – just 3-4 km from Perungudi and adjacent to the TIDEL Park and Olympia Tech Park cluster. The Sholinganallur metro station on the corridor is under discussion. Employment density here is among the highest on OMR.

My visit observations:
- Site is currently partially cleared, construction began on Tower 1 foundation
- Sales office is well organised, floor plan options are clear
- Parking: 1 car park per flat standard, additional parking at ₹7-8L
- The villa plots are marked at the southern end of the site, quieter zone

Anyone already booked here? How did you find the negotiation room on pricing?`,
    address: 'Old Mahabalipuram Road (OMR), Sholinganallur, Chennai 600119',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.vignesh,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 7600000,
    priceMax: 32100000,
    createdAt: pastDate(19),
  })
  {
    await addComment(holachennai.id, U.preethi_s,
      `Been tracking Sholinganallur launches for 2 years – works at one of the IT parks within 2 km. The Holachennai pricing at ₹76L for 2BHK is honestly on the higher side for a project whose possession is Dec 2028. When I joined my company in 2020, similar Sholinganallur flats were going for ₹55-60L. The appreciation has been strong but from here to 2028 is still 3+ years of construction risk. That said, Casagrand has never defaulted on any Chennai project so the execution risk is low. My concern is oversupply on OMR – Casagrand Opulent, now Holachennai, Tata, Brigade all landing on OMR simultaneously. Rental yields will get pressured.`,
      pastDate(17, 3))
    await addComment(holachennai.id, U.ganesan,
      `The villa concept within the community is interesting but practically awkward. The 5BHK villas at ₹3.21 Cr will have residents expecting a quieter, more private lifestyle. But they're sharing their boundary wall with 1818 apartment families. The kids playground, clubhouse noise, general foot traffic – it won't feel like villa living. I'd rather buy a proper standalone villa in Kelambakkam for ₹2.5-3 Cr than a villa sandwiched between 25-floor towers. But for people who want villa space with apartment amenities, it's an unusual proposition.`,
      pastDate(15, 7))
    await addComment(holachennai.id, U.kowsalya,
      `Visited last Sunday. Sales team confirmed they've sold around 400 units already in pre-launch phase. Our main requirement was a south-facing 3BHK with no adjoining building. The floor plans show Tower 7 and 8 face the open amenity zone – those are the better ones. Got a quote of ₹1.23 Cr for 3BHK in these towers. They offered a 2% discount for immediate booking plus a gold coin. The gold coin gimmick is common but the 2% was real. On 1.23 Cr that's ~₹2.5L off which matters.`,
      pastDate(12, 2))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND CASAMIA — Pallavaram, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Casamia...')
  const casamia = await createTopic({
    slug: 'casagrand-casamia-pallavaram-chennai',
    propertyName: 'Casagrand Casamia',
    title: 'Casagrand Casamia Pallavaram – 22 acres, Spanish-themed community | Is the location premium justified?',
    description: `Came across Casagrand Casamia while shortlisting options for my parents who want to move closer to the airport. Pallavaram is genuinely convenient – 10 minutes to the domestic terminal, close to Chromepet, Tambaram easy access, GST Road right there.

The project details: 22 acres, 1314 units across 13 blocks (B + G + 5 floors so it's low-rise which I like), Spanish architecture theme, 160+ amenities, 1.5-acre clubhouse, 67% open area. RERA: TN/35/Building/0097/2025 – freshly registered this year. No possession date announced yet which is a yellow flag.

Pricing: 2BHK from ₹61L (1,161 sqft), 3BHK from ₹87L, 4BHK at ₹1.50 Cr. The sqft rate works out to roughly ₹5,250-5,800 range which is reasonable for Pallavaram.

What I like:
- Low-rise format (B+G+5) means no elevator dependency, better community feel
- 67% open area is exceptional – most projects can't deliver this
- 22 acres for 1314 units = more land per family vs most projects
- Dual swimming pools sounds genuine for this scale

What I'm watching:
- "No possession date" on RERA usually means very early stage or planning issues
- 414 units already sold per their website which is fast – maybe there's early bird pressure
- Pallavaram has some flood risk pockets – need to check which zone this site falls in
- Spanish theme is marketing – what actually matters is construction quality

My parents are in their 60s so they need elevator access even in a low-rise (B+G+5 still needs it). Anyone visited and checked accessibility features?`,
    address: 'Pallavaram-Thoraipakkam Radial Road, Pallavaram, Chennai 600043',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.meenakshi,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 6100000,
    priceMax: 15000000,
    createdAt: pastDate(46),
  })
  {
    const c1 = await addComment(casamia.id, U.karthik_sun,
      `I'm from Chromepet – Pallavaram is our neighbouring locality. The address on OMR-Pallavaram connector near Pallavaram-Thoraipakkam radial road is actually a good one. Not exactly within Pallavaram town but the radial road access means you're 15 minutes from Velachery and 20 from OMR companies. The flooding concern is valid – the area around Pallavaram lake and the low-lying stretches near Chromepet do flood during heavy rain. But this site is slightly elevated compared to the lake zone. Still, ask the developer specifically if the site has done a flood risk assessment under CMDA norms.`,
      pastDate(44, 2))
    await addComment(casamia.id, U.deepa_nat,
      `My cousin booked here in pre-launch. She got a 2BHK at ₹61L which is the base price. By the time she added car parking (₹4.5L), power backup connection (₹75K), club membership (₹1L), the all-in was ₹67.5L before GST and registration. So the advertised ₹61L is misleading – factor in ₹8-10L of mandatory/quasi-mandatory add-ons. That said, for Pallavaram, ₹67L for 1161 sqft isn't terrible. The low-rise format really does make a difference to daily life quality – no waiting for lifts, children can run around safely.`,
      pastDate(41, 5), c1.id)
    await addComment(casamia.id, U.selvam,
      `For elderly parents, B+G+5 low-rise is genuinely the best format. Casagrand usually puts ground floor flats specifically for senior citizens at a slight premium. Worth asking. The 1.5 acre clubhouse for 1314 units is actually a good ratio – about 50 sqft of clubhouse per unit which is above average. Most projects do 20-30 sqft per unit. The Spanish theme will look nice for the first few years; after 5 years all such theme projects end up looking the same when maintenance lapses. Focus on the structural quality, not the tile patterns.`,
      pastDate(38, 3))
    await addComment(casamia.id, U.jayakumar,
      `No possession date announced at RERA stage means they've registered but haven't committed yet. This is becoming common with Casagrand's newer launches – they register RERA early to build credibility but delay the possession commitment. Once you're in the pre-launch phase and 400 units are sold, they'll announce a timeline. Probably Dec 2027-Jun 2028 given the TN/35 RERA in 2025. Just make sure your agreement clearly mentions possession date before signing. Courts have repeatedly held that RERA-registered projects must honour committed possession.`,
      pastDate(35))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND FLAGSHIP — Pallikaranai, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Flagship...')
  const flagship = await createTopic({
    slug: 'casagrand-flagship-pallikaranai-chennai',
    propertyName: 'Casagrand Flagship',
    title: 'Casagrand Flagship Pallikaranai – 3 & 4 BHK apartments + villas, nearing completion | Possession experience?',
    description: `Casagrand Flagship at Pallikaranai is one of the projects coming closest to possession – RERA TN/29/Building/0531/2022 with possession target Sep to Dec 2025. Some blocks are reportedly ready for handover already. This makes it different from everything else being discussed – actual possession experience matters here.

The project: 17.58 acres, 887 apartments (3 BHK and 4 BHK) + 54 standalone villas, 5 towers in a Stilt+5-7 floor low-rise format. 42% open space. Pricing for remaining inventory is ₹94L (3BHK) to ₹2.58 Cr (villas).

Pallikaranai is a fantastic location – bang between Velachery and OMR. The Perungudi IT park and Sholinganallur tech clusters are within 5-7 km. Velachery metro is accessible. The wetland area of Pallikaranai marsh is close by which keeps the area green but also raises some questions about groundwater and air quality.

I'm looking at a resale 3BHK here – a seller is listing at ₹1.10 Cr for a 1680 sqft unit on the 5th floor (top floor in the low-rise block) with OC expected soon. The view from the terrace level looks out over greenery which is rare.

Has anyone already got possession or done the snag list inspection? How is the fit-out quality? Any structural issues found? This will help others looking at both direct booking and resale.`,
    address: 'Pallikaranai, near Velachery-Tambaram Radial Road, Chennai 600100',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.senthil,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 9400000,
    priceMax: 25800000,
    createdAt: pastDate(55),
  })
  {
    const c1 = await addComment(flagship.id, U.kavitha_c,
      `Got possession of my 3BHK in Block C last month! Sharing the experience since it's useful. The OC was received for our block – took about 3 weeks after handover intimation letter. Snag list: we found minor plaster hairline cracks in two rooms (normal for new construction), one bathroom faucet had low water pressure (they fixed it within the week), one door frame was slightly off-alignment. Overall the quality is better than I expected based on some scary stories I'd heard about Casagrand finishing. The tiles are Kajaria/RAK quality, the kitchen granite is good, electrical is Legrand. Would rate the quality 8/10.`,
      pastDate(52, 3))
    await addComment(flagship.id, U.bala,
      `Pallikaranai marsh is both a blessing and a curse. The wetland keeps the microclimate cooler than surrounding areas – genuinely noticeable in summer. But during the northeast monsoon (Oct-Dec) the area can see standing water on roads. The project site itself is slightly elevated so internal flooding unlikely, but road access can get tricky for a few days. Pallikaranai main road gets water logging near the bus stop stretch. Factor this into your commute calculation for the 3-4 months of monsoon season.`,
      pastDate(50, 7))
    await addComment(flagship.id, U.preethi_s,
      `The 54 villas are in a separate enclave at the back of the site – they have their own entrance. I spoke to a villa owner (met at the Casagrand office) who said the villa community is very quiet and they can't even hear the apartment complex. That's impressive for a mixed project. The villa at ₹2.58 Cr for 17 acres site with independent structure is actually value for money compared to independent house plots in Pallikaranai which go for ₹1-1.5 Cr just for the land.`,
      pastDate(47, 2), c1.id)
    await addComment(flagship.id, U.ganesan,
      `Resale at ₹1.10 Cr for 1680 sqft = ₹6,547/sqft. The original launch price was around ₹5,500-5,800/sqft so the seller is marking up 12-15%. With OC expected soon and Pallikaranai location, ₹6,500/sqft is still below OMR Sholinganallur rates of ₹7,500-8,500/sqft. If you believe in Pallikaranai's growth trajectory it's worth considering. The top floor in a low-rise block is actually a good pick – no neighbour above you, potential for terrace access in some blocks, better ventilation. Negotiate the seller down to ₹1.05 Cr if possible – the market has flattened a bit.`,
      pastDate(44))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND MASSIMO — Kundrathur, West Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Massimo...')
  const massimo = await createTopic({
    slug: 'casagrand-massimo-kundrathur-west-chennai',
    propertyName: 'Casagrand Massimo',
    title: 'Casagrand Massimo – Kundrathur, West Chennai | Affordable 2-4 BHK near Porur IT corridor',
    description: `West Chennai has been crying out for quality residential options and Casagrand Massimo at Kundrathur is attempting to fill that gap. This is something I've been looking at for 6 months since I shifted jobs to the Porur-Ramapuram IT belt.

Project stats: 7.9 acres, 853 units, 3 towers of 21 floors each, Roman-themed architecture (honestly just marketing), 24,000 sqft clubhouse, 70+ amenities. RERA: TN/01/Building/0362/2024. Possession target Dec 2027 to Apr 2028.

Pricing is what makes this interesting:
- 2BHK: ₹64L (roughly 1,100-1,200 sqft at ₹5,800/sqft)
- 3BHK: ₹88L to ₹1.05 Cr
- 4BHK: ₹1.20-1.32 Cr

For Kundrathur-Porur belt, these prices make sense. Porur junction is getting too expensive (₹8,000-9,000/sqft) and Manapakkam is crowded. Kundrathur is the next logical zone.

Location notes:
- About 4 km from Porur junction – manageable daily commute to IT parks on Rajiv Gandhi Salai (Mount-Poonamallee road)
- Proposed Chennai Metro Phase 2 Line 4 passes near Kundrathur
- Kundrathur town has decent social infrastructure – temple, schools, medical shops
- The Porur lake area is nearby – good for evening walks but flooding risk nearby

My issue: 853 units in 7.9 acres is high density. 21-floor towers on 7.9 acres with 3 towers means the buildings will shadow each other for parts of the day. Ask specifically about sun direction and which units get good sunlight.`,
    address: 'Kundrathur Main Road, near Porur, Chennai 600069',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.karthikeyan,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 6400000,
    priceMax: 13200000,
    createdAt: pastDate(31),
  })
  {
    await addComment(massimo.id, U.rajalakshmi,
      `I live in Kundrathur – been here 8 years. This area has changed dramatically in the last 3 years. Earlier it was all small plots and agricultural pockets. Now it's a full residential zone. The Massimo site is on good ground – no flood history in that particular stretch unlike the Porur lake-adjacent areas. Water supply from CMWSSB comes through Kundrathur, though it can be irregular (2-3 days a week in summer). Any project here will need good borewells as backup. On the positive side, Kundrathur has excellent temple and community infrastructure, schools are good (DAV, Velammal nearby), and the GST Road is less than 10 km.`,
      pastDate(28, 4))
    await addComment(massimo.id, U.nithya,
      `Visited the Massimo site office last week. The sales team was more professional than I expected for a Kundrathur project. They showed me the 3D walkthrough – the Roman pillar theming in the entrance corridor looks quite nice actually, I'll give them that. The 24,000 sqft clubhouse for 853 units is about 28 sqft per unit which is average. I was more interested in the practical details: 2 levels of basement parking, 3 lifts per tower (for 21 floors that's okay), generator backup for common areas and 1 point per flat, rainwater harvesting, STP on site. The STP they showed in the plan is a proper capacity one, not undersized which is a common builder shortcut.`,
      pastDate(25, 2))
    await addComment(massimo.id, U.chelladurai,
      `For West Chennai IT workers, Massimo is realistically positioned. I compare it to what Casagrand Highclere also launched nearby – 2BHK at ₹58L but only 15 floors. Massimo at ₹64L gives you 6 more floors (better views), larger clubhouse, more units (more rental pool if you're investing). If you're an end user, Highclere's lower price is tempting. If it's investment, Massimo's scale will support better resale liquidity. The West Chennai tech park density is growing – L&T, Cognizant, TCS all have major offices within 8-10 km.`,
      pastDate(22, 5))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND FRENCHTOWN — Kovilancheri, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Frenchtown...')
  const frenchtown = await createTopic({
    slug: 'casagrand-frenchtown-kovilancheri-chennai',
    propertyName: 'Casagrand Frenchtown',
    title: 'Casagrand Frenchtown – 10.76 acres, Kovilancheri | 78% open space, unique 3 & 5 BHK formats',
    description: `Something different from Casagrand this time – Frenchtown at Kovilancheri is positioned as a premium low-density community. 10.76 acres with only 639 units across 3 blocks in B+S+5 floor format. 78% open green space is the headline number and frankly, if they deliver it, it's exceptional.

RERA: TN/35/Building/0337/2024. Possession Sep 2027 (their target), though RERA certified Oct 2026 which would be incredibly fast – I suspect the Oct 2026 is optimistic.

The unusual part: they're offering 3 BHK from 857 sqft (very compact) all the way to 5 BHK at 3,756 sqft. The 5 BHK at ₹1.91 Cr and above is the premium product here.

Kovilancheri location breakdown:
- Medavakkam main road is 2 km away
- Perumbakkam is adjacent – established neighbourhood with good social infra
- Sholinganallur is 6-7 km via Medavakkam road
- The SIPCOT IT park at Sholinganallur and Perungudi are the employment catchments

For 78% open space to work, the density has to be very low. 639 units on 10.76 acres = 59 units per acre. With B+S+5 floors that's actually achievable. Compare to Mercury (84 units/acre) or Suncity (107 units/acre) and you see how different the experience will be.

Anyone who's visited the site and can share actual ground-level observations? The RERA registered plots and actual site clearance sometimes differs.`,
    address: 'Kovilancheri, near Medavakkam, Chennai 600117',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.deepa_nat,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 19100000,
    priceMax: 30000000,
    createdAt: pastDate(41),
  })
  {
    const c1 = await addComment(frenchtown.id, U.vignesh,
      `The 78% open space number is impressive but technically possible only because they're using B+S+5 low-rise format with fewer floors. In a 20-floor tower, you need less land coverage per unit. In B+S+5, you need more ground footprint but Frenchtown compensates by having only 639 units on 10.76 acres. The French architectural theme will mean more ornamental facades – I just hope they don't compromise on the structural quality for the aesthetics. Visited Casagrand Palazzo which has similar premium positioning – the quality there is noticeably better than their mid-segment projects.`,
      pastDate(38, 3))
    await addComment(frenchtown.id, U.saravanan,
      `The 857 sqft 3BHK is tiny. That's 3BHK only in name – in reality it'll feel like a large 2BHK. Probably configured as 2 bedrooms + study room and they're calling the study a bedroom. This is common practice. The actual usable 3BHK here starts from around 1,300 sqft in my estimate. The 5BHK at 3,756 sqft is where the value is – if you can afford ₹2.5-3 Cr, a 3,756 sqft flat with 78% open campus is genuinely premium living. That's a ₹6,660-7,990/sqft rate for Kovilancheri which is premium but not unreasonable given the format.`,
      pastDate(36, 6))
    await addComment(frenchtown.id, U.kowsalya,
      `My family shortlisted Frenchtown vs Casagrand Flagship at Pallikaranai. Both are low-rise premium but Flagship is nearing possession while Frenchtown is 2+ years away. We went with Flagship resale ultimately – the certainty of possession matters when you have kids in school and need to plan admissions. Frenchtown looks beautiful in concept and the Kovilancheri location has been appreciating. If you have the flexibility to wait 2-3 years, Frenchtown is the better aesthetic choice. If you need to move in within 12-18 months, look at ready/near-ready options.`,
      pastDate(33, 1), c1.id)
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND JARVIS — Siruseri, OMR
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Jarvis...')
  const jarvis = await createTopic({
    slug: 'casagrand-jarvis-siruseri-omr-chennai',
    propertyName: 'Casagrand Jarvis',
    title: 'Casagrand Jarvis – Siruseri, OMR | 469 units near ELCOT SEZ | IT employee\'s view',
    description: `Casagrand Jarvis at Siruseri has been on my radar since I joined a company inside the ELCOT SEZ. The project is literally 1.5-2 km from the ELCOT campus which houses companies like HCL, Cognizant, Wipro, TCS, Infosys – basically most major IT players.

RERA: TN/35/Building/0107/2025. Possession target Sep to Dec 2027. 469 units, 3 and 4 BHK only (no 2BHK which tells you about the target segment – dual-income IT couples or senior engineers).

Pricing:
- 3BHK: ₹77L-95L (likely 1,300-1,500 sqft range = ₹5,900-6,300/sqft)
- 4BHK: ₹1.05-1.19 Cr

This pricing is VERY competitive for Siruseri. Comparable new launches on OMR Sholinganallur/Perungudi are ₹7,500-9,000/sqft. Siruseri's slightly farther-from-Chennai positioning is actually becoming less relevant as traffic on OMR has normalized work-from-home schedules.

The area around Siruseri ELCOT is well developed – the ELCOT food court, Apollo pharmacy, multiple restaurants have come up to serve the tech park population. The Kalpakkam highway (NH32) nearby makes weekend travel to ECR resorts easy.

My employer offers shuttle from Siruseri to metro stations on both OMR and ECR side. Many ELCOT companies provide this.

Only thing I want to check: what's the builder reputation specific to Siruseri? I know Casagrand has Fiona in Thalambur (nearby) – how has that project's construction quality turned out?`,
    address: 'ELCOT IT SEZ Road, Siruseri, OMR Phase 2, Chennai 603103',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.karthik_sun,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 7700000,
    priceMax: 11900000,
    createdAt: pastDate(14),
  })
  {
    await addComment(jarvis.id, U.priya_iyer,
      `I'm in Casagrand Fiona at Thalambur – have been since booking in 2022. Fiona is adjacent to the Siruseri belt. Construction quality has been consistently good – they don't cut corners on concrete and waterproofing which matters most. They did delay our block by 4 months from original commitment (blame COVID material shortages) but the overall delivery is on track now. Siruseri is transforming fast – two new hotels came up in 2024, the road from Siruseri to Old Mahabalipuram Road is widened. For someone working in ELCOT, Jarvis is literally door-to-office. Walk or 2-minute auto to work changes your life quality dramatically.`,
      pastDate(12, 4))
    await addComment(jarvis.id, U.bala,
      `The no 2BHK policy on Jarvis is actually a positive signal. It means the target buyer is senior, established IT professional, not entry-level. This helps with community quality – fellow residents will be in a similar income and lifestyle bracket. The amenities will be better maintained because residents will demand it. It also means rental prospects are good – senior IT expats and managers prefer 3BHK. ELCOT companies increasingly bring in foreign nationals for tech leadership roles and they all need 3-4BHK furnished accommodation. Rental potential: ₹35,000-45,000/month for 3BHK unfurnished.`,
      pastDate(10, 2))
    await addComment(jarvis.id, U.senthil,
      `₹77L for 3BHK in Siruseri is the kind of pricing that won't last. When Casagrand launched Fiona at Thalambur 3 years ago the opening price for 3BHK was ₹65L. Now the same units sell at ₹85L in resale. By the time Jarvis completes in Dec 2027 the price will be ₹95-1.05 Cr. If you're an investor this is solid mid-OMR exposure. If you're an end user this makes your EMI math work much better than buying at Sholinganallur prices.`,
      pastDate(8, 6))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND OSAKA — Porur / Iyyappanthangal
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Osaka...')
  const osaka = await createTopic({
    slug: 'casagrand-osaka-porur-iyyappanthangal-chennai',
    propertyName: 'Casagrand Osaka',
    title: 'Casagrand Osaka – Iyyappanthangal, Porur | Boutique 3 & 4 BHK in West Chennai growth zone',
    description: `West Chennai's Porur-Iyyappanthangal corridor is getting interesting. Casagrand Osaka is a boutique project – 6.8 acres, only 401 units across 3 towers (B+G+5 floors), 3 and 4 BHK only. RERA: TN/1/Building/0243/2025. Possession Jan 2028.

Pricing: ₹81L-₹1.40 Cr. For Iyyappanthangal that's around ₹6,700-7,500/sqft which I'd call fair-premium for this micro-market.

Why I'm interested in this location:
- DLF Cybercity in Ramapuram is less than 4 km
- Porur junction tech cluster (Mindspace, Elnet) is 3 km
- Poonamallee High Road connects to Mount Road and central Chennai in 30-40 minutes
- The Kattupakkam area (adjacent) is seeing massive development

What I found on site visit:
- 3 towers confirmed, foundation complete on Tower 1
- Sales office on site with actual sample flat (not just showroom) – rare for this stage
- 6.8 acres for 401 units = 59 units per acre, similar density to Frenchtown, excellent for west Chennai
- The B+G+5 format means no extreme height – good for families tired of 25-floor tower living

My concern is Jan 2028 possession on a RERA registered in 2025 – that's only 3 years which is tight for B+G+5 construction but doable if they start now and maintain pace. Casagrand's west Chennai execution track record is unclear – most of their history is south and north Chennai. Anyone tracking Casagrand Massimo at Kundrathur can probably comment on their west Chennai execution pace.`,
    address: 'Iyyappanthangal, near Porur, Chennai 600056',
    cityId: CITY.chennai,
    propertyType: 'APARTMENT',
    userId: U.jayakumar,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 8100000,
    priceMax: 14000000,
    createdAt: pastDate(9),
  })
  {
    await addComment(osaka.id, U.meenakshi,
      `Iyyappanthangal is one of Chennai's best-kept secrets from a real estate standpoint. It sits between Porur and Kattupakkam – both areas that have appreciated 40-50% in 5 years. The Osaka project at ₹6,700-7,500/sqft for 3-4 BHK in a boutique low-rise is genuinely appealing. The concern I have is parking – B+G+5 with basement parking for 401 units on 6.8 acres, the basement might only accommodate 1 level of parking. Ask specifically: 1 car park per unit or dedicated visitor parking too? Iyyappanthangal roads are narrow and on-street parking is already an issue in the existing colony.`,
      pastDate(7, 3))
    await addComment(osaka.id, U.chelladurai,
      `I work in DLF Cybercity. From Iyyappanthangal to DLF is 3.5 km on Google Maps – but the signal at Porur junction adds 20-25 minutes during peak hours. Reality is 40-45 minute commute, not 15. That said, compared to people commuting from OMR or Tambaram, it's still better. The Kattupakkam-Porur-Iyyappanthangal stretch will only improve with the Inner Ring Road project. The Jan 2028 possession is 3 years from RERA which is the minimum for this scale. If they start construction immediately it's achievable. Visit site every 3 months to track progress.`,
      pastDate(6, 5))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND CASABLANCA — Kanakapura Road, Bangalore
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Casablanca...')
  const casablanca = await createTopic({
    slug: 'casagrand-casablanca-kanakapura-road-bangalore',
    propertyName: 'Casagrand Casablanca',
    title: 'Casagrand Casablanca – 27 acres on Kanakapura Road Bangalore | Casagrand\'s biggest Bangalore bet yet',
    description: `Casagrand has been expanding in Bangalore and Casablanca on Kanakapura Road is their most ambitious south Bangalore launch to date. 27 acres, 805 units, 4 towers at 2B+G+17 floors. RERA Karnataka: PRM/KA/RERA/1251/310/PR/040524/006862. Possession target Aug 2027 (their marketing) but RERA committed date is May 2029 which is more realistic.

Pricing: ₹1.20 Cr to ₹3.70 Cr covering 2, 3, 4 BHK apartments, 5 BHK floor villas, and penthouses.

Kanakapura Road south Bangalore is a well-established growth corridor:
- Art of Living campus is here (social landmark)
- NICE road interchange is accessible
- South Bangalore IT offices at Bannerghatta Road and JP Nagar are 12-20 km
- BMTC well connected, Namma Metro Phase 3 corridor discussions include this stretch

What I observed during my visit (drove down from Jayanagar):
- The 27-acre site is substantial – currently showing land clearing and initial earthwork for Tower 1
- The surrounding neighbourhood is semi-developed – some good apartment complexes nearby but also undeveloped stretches
- Social infra: DPS school is within 3 km, hospitals at Banashankari are 10+ km (this is a gap)
- Water source will matter – the Bangalore water supply doesn't reliably serve this far out on Kanakapura, so the project will likely depend on tankers + borewells

The price is aggressive for Kanakapura – ₹1.20 Cr for 2BHK at this location is not cheap. Brigade and Sobha in similar zones are pricing at ₹1.30-1.50 Cr for 2BHK so Casagrand is slightly more competitive but with the tradeoff of brand perception (Casagrand is very Tamil Nadu-dominant, unknown brand in Bangalore for many buyers).

Has anyone dealt with Casagrand Vivacity in Electronic City? That's their other Bangalore project. How has the execution been?`,
    address: 'Off Kanakapura Road, near Art of Living Campus, South Bangalore 560082',
    cityId: CITY.bengaluru,
    propertyType: 'APARTMENT',
    userId: U.harish,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 12000000,
    priceMax: 37000000,
    createdAt: pastDate(28),
  })
  {
    await addComment(casablanca.id, U.meera_b,
      `Casagrand Vivacity at Electronic City resident here – gave possession in late 2024. My experience: Casagrand's construction quality in Bangalore is on par with their Chennai projects – decent materials, reasonable finishing. The delay was about 6 months which is standard for this industry. The issue I had was the maintenance team post-possession – they're using a third-party vendor who doesn't understand Bangalore's specific requirements (water pressure here is different, elevator parameters differ from Tamil Nadu norms). For Casablanca I'd say the quality will be fine but verify their Bangalore maintenance partner before committing.`,
      pastDate(25, 4))
    await addComment(casablanca.id, U.suresh_a,
      `Kanakapura Road has been one of Bangalore's consistent performers in real estate appreciation – south Bangalore always holds value. The concern here is the possession date reality: RERA says May 2029 for a project that started site work now (2024-2025). That's 4 years which is long by any standard. During this period you're paying both rent AND EMI if you've taken a home loan. Model this carefully – 4 years of dual payment on ₹80-90L loan is ₹2.5-3L per month EMI plus ₹25-35K rent = ₹3-3.5L monthly outgo. Make sure your income supports this through the period.`,
      pastDate(22, 2))
    await addComment(casablanca.id, U.harish,
      `Follow-up from my own post – went back for a second visit last week. Construction has progressed on Tower 1 – reached 4th floor slab level in one month which is good pace. Sales team confirmed 280+ units sold so far (35% of 805). The 5 BHK floor villas are almost entirely sold – apparently NRI buyers snapped them up. The penthouses have 2-3 units remaining. The bulk of unsold inventory is 2 and 3 BHK in Towers 3 and 4. If you're looking at floors above 12, negotiate hard because those are the slower-moving ones.`,
      pastDate(18, 6))
    await addComment(casablanca.id, U.meera_b,
      `The hospital gap is real – nearest decent hospital from this location is Manipal or Columbia Asia in Jayanagar which is 14-15 km. In a medical emergency at 2am from Kanakapura Road that's not reassuring. Apollo and Sakra are even farther. This is the fundamental risk of buying in emerging corridors – you get good pricing but accept infrastructure gaps that take 5-7 years to fill. Factor this into the decision especially if you have elderly parents or young children at home.`,
      pastDate(15, 1))
  }

  // ═══════════════════════════════════════════════════════
  // CASAGRAND FLAMINGO — HSR Layout, Bangalore
  // ═══════════════════════════════════════════════════════
  console.log('Creating Casagrand Flamingo...')
  const flamingo = await createTopic({
    slug: 'casagrand-flamingo-hsr-layout-bangalore',
    propertyName: 'Casagrand Flamingo',
    title: 'Casagrand Flamingo – HSR Layout Bangalore | Near delivery, 218 units | Snag list and possession updates',
    description: `Casagrand Flamingo at HSR Layout is one of their Bangalore projects approaching possession – RERA PRM/KA/RERA/1251/310/PR/041023/006307 with target Oct-Nov 2025. For buyers looking at near-ready options in premium south Bangalore, this is one to watch.

218 units, multiple towers, 13-14 floors, 3 and 4 BHK only. Premium address – HSR Layout is arguably the most sought-after residential address in south Bangalore right now.

Pricing for remaining units: ₹2.35 Cr (3 BHK, ~1,400 sqft = ₹16,785/sqft) to ₹3.11 Cr (4 BHK). Yes, HSR Layout prices these days are astronomical.

Location facts I don't need to tell most Bangalore people:
- HSR Layout Sector 2-7 has excellent connectivity to Koramangala, BTM, Bellandur
- Silk Board junction proximity is a curse (traffic) and blessing (ORR and outer connectivity)
- Social infrastructure is mature – hospitals, schools, malls, restaurants all within 5 km
- Namma Metro Phase 2 has Silk Board station opening – this changes everything

The premium pricing is justified by the address but at ₹2.35 Cr+ you're competing with Brigade, Sobha, Godrej products at similar price points. Casagrand brand doesn't carry the same premium perception in Bangalore.

Anyone who has already done the possession inspection at Flamingo? Would love to know actual construction quality and whether the Oct-Nov 2025 timeline is holding.`,
    address: '27th Main Road, Sector 2, HSR Layout, Bangalore 560102',
    cityId: CITY.bengaluru,
    propertyType: 'APARTMENT',
    userId: U.suresh_a,
    developerSlug: 'casagrand',
    developerName: 'Casagrand',
    priceMin: 23500000,
    priceMax: 31100000,
    createdAt: pastDate(62),
  })
  {
    const c1 = await addComment(flamingo.id, U.meera_b,
      `HSR Layout at ₹16,785/sqft from Casagrand is actually below the market rate – similar projects from Sobha and Prestige in HSR are quoting ₹18,000-20,000/sqft. The brand discount is real but in HSR Layout the address does most of the work. Even Casagrand-branded flats in HSR will hold value because the location itself is so strong. From investment angle, HSR Layout rentals are ₹60,000-80,000/month for 3BHK unfurnished which gives ~3% gross rental yield. Solid for Bangalore.`,
      pastDate(59, 3))
    await addComment(flamingo.id, U.harish,
      `I know someone in Block A of Flamingo who did their pre-possession inspection last month. His feedback: tiling work is clean, kitchen layout is practical, the lobby area looks premium with the marble flooring. Found 3 snags – a bedroom window frame that doesn't seal properly (letting in dust), a bathroom exhaust fan that makes noise, and a minor seepage mark near the terrace water tank area in the top floor unit. All filed and the Casagrand team gave commitment to fix before actual possession. Pretty standard stuff.`,
      pastDate(55, 7))
    await addComment(flamingo.id, U.suresh_a,
      `Update from my site visit yesterday – Block A and B look almost ready. Landscaping is happening in the common area. The amenity zone looks smaller than the renders showed – the pool area specifically seems compact for 218 units. But the interiors of the flats look genuinely good. Oct-Nov 2025 timeline seems achievable for these blocks. Blocks C and D are slightly behind but Dec 2025 is realistic. The HSR location alone makes this worthwhile at the price point. Silk Board metro will add another 10-15% appreciation in the next 2 years.`,
      pastDate(50, 2), c1.id)
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE MEADOWS — Perumbakkam, OMR
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Meadows...')
  const meadows = await createTopic({
    slug: 'gsquare-meadows-perumbakkam-omr-chennai',
    propertyName: 'G Square Meadows',
    title: 'G Square Meadows – 182 plots, Perumbakkam OMR | CMDA approved plots in IT hub | Investment or end use?',
    description: `Been following G Square Housing launches and Meadows at Perumbakkam is their most strategically placed project in recent times. 182 plots across 8.80 acres on OMR – that's practically within the Perumbakkam-Sholinganallur IT zone.

RERA: TN/29/Layout/3325/2024. They're advertising a 20,000 sqft lavish clubhouse with 100+ amenities and ready-to-construct status which is the differentiator from a standalone plot purchase.

Plot sizes: 780 sqft to 2,042 sqft
Pricing: ₹6,690/sqft onwards. So:
- 780 sqft × ₹6,690 = ₹52.2L
- 1200 sqft × ₹6,690 = ₹80.3L
- 2042 sqft × ₹6,690 = ₹1.37 Cr
Plus registration and development charges.

Early bird pricing was ₹7,250/sqft which already shows the usual G Square "early bird is the regular price" trick.

CMDA approval is the real value here – for OMR belt plots, CMDA approval means you can get bank loans easily, construction permits are straightforward, and resale is to a larger buyer pool. Many undeveloped plots in Perumbakkam lack this.

My investment thesis: Perumbakkam OMR is a strong rental catchment. If you build a 3-floor building on a 1200 sqft plot (4 units per floor × 3 floors = 12 units) you can generate ₹3.5-4L/month gross rental. At ₹80L plot cost + ₹60L construction = ₹1.4 Cr investment for ₹4L/month is 3.4% yield. Not spectacular but the capital appreciation on a CMDA OMR plot is the real return.

Has anyone done a full analysis on G Square plot investment returns vs apartment investment?`,
    address: 'Perumbakkam, Old Mahabalipuram Road, Chennai 600100',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.saravanan,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 5220000,
    priceMax: 13700000,
    createdAt: pastDate(72),
  })
  {
    const c1 = await addComment(meadows.id, U.karthikeyan,
      `Plot vs apartment debate is real. Here's my take after owning both: A plot gives you complete control – you decide the design, the number of floors, the tenant mix, everything. An apartment gives you zero control but zero headache. For someone with construction knowledge or a reliable contractor network, plots are clearly better long term. Without that network, apartments are less stress. G Square's gated community format is the middle path – you get plot ownership but with managed common infrastructure (roads, drainage, CCTV). The 20,000 sqft clubhouse for 182 plots is unusual – most plot communities have minimal amenities. If they actually build it, that's excellent.`,
      pastDate(70, 4))
    await addComment(meadows.id, U.preethi_s,
      `The 100+ amenities claim for a plot community is pure marketing – the actual amenities will be the road, streetlights, drainage, security, and maybe a small park and gym. The "100+ amenities" count includes things like "Wi-Fi enabled gates" and "solar-lit streets" as separate items. Focus on what matters: road width (minimum 30 feet for comfortable access), drainage quality (critical for Perumbakkam which has some low-lying areas), and the maintenance structure post-handover. Who runs the community once all plots are sold – resident welfare association or G Square forever?`,
      pastDate(67, 2))
    await addComment(meadows.id, U.nithya,
      `I purchased a G Square plot in an older community (Arcadia, Kelambakkam) and can share that experience. G Square's basic infrastructure quality is honest – the roads are proper 30-40 feet tarred, the drains work, compound wall is substantial. They also have a resident app for maintenance requests. The common area maintenance charges post-handover were ₹2,500/month per plot which is reasonable. My plot appreciated 32% in 18 months post purchase. For Meadows being on actual OMR with CMDA approval, the appreciation potential is higher than Kelambakkam.`,
      pastDate(64, 5), c1.id)
    await addComment(meadows.id, U.ganesan,
      `One practical concern for Perumbakkam OMR plots – the CMDA/panchayat building approval process for actual construction. Even with an approved layout, each building needs individual sanction. In Perumbakkam the approvals can take 6-12 months at Chennai Corporation or Kancheepuram municipality depending on which jurisdiction the plot falls under. G Square should clarify this. If the plot is in GCC Chennai jurisdiction the approval timeline is faster. If it's Chengalpattu district municipality (which Perumbakkam borders) it's slower. Ask specifically before booking.`,
      pastDate(61))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE PAVILLION — Singaperumal Koil
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Pavillion...')
  const pavillion = await createTopic({
    slug: 'gsquare-pavillion-singaperumal-koil-chennai',
    propertyName: 'G Square Pavillion',
    title: 'G Square Pavillion – 624 plots, sports-themed community at Singaperumal Koil | Tamil Nadu\'s largest sports plotted community?',
    description: `G Square has been making bold claims and Pavillion at Singaperumal Koil is their biggest one yet – "Tamil Nadu's first and largest sports-themed plotted development community." 624 plots across 34.53 acres. RERA: TN/35/Layout/0724/2024.

Plot sizes: 451 to 3,126 sqft
Pricing: ₹1,999/sqft onwards (₹32.98L to ₹96.45L for the full range)

The "sports-themed" concept includes: outdoor gym, badminton courts, beach volleyball, amphitheatre, hammock garden, kids play zone, skating area. Plus standard gated community infra – CCTV, roads, drainage.

The location – Singaperumal Koil – is interesting. It's on the Chengalpattu side of the GST Road belt. 1 minute walk to the Singaperumal Koil railway station (they claim). Railway connectivity directly to Chennai and Tambaram is genuinely useful. The area has the Oragadam industrial belt nearby (Hyundai, Ford, many ancillaries) and the emerging Sriperumbudur tech-industrial zone.

At ₹1,999/sqft the entry point of ₹32.98L for a 451 sqft plot is accessible. But 451 sqft is tiny – you can't build anything meaningful on it except a studio or small 1BHK. The practical plots for house construction start at 800-1000 sqft minimum.

My calculations:
- 1000 sqft plot at ₹1,999 = ₹19.99L + registration ~₹1.5L = ₹21.5L
- Construction at ₹1,800/sqft for 900 sqft = ₹16.2L
- Total: ₹37.7L for a 900 sqft 2BHK house in Singaperumal Koil

At Oragadam/Singaperumal Koil labour colony rental demand of ₹6,000-8,000/month for 2BHK, yield calculation is decent for investment.

Anyone visited the site? Is the railway station claim accurate?`,
    address: 'Near Singaperumal Koil Railway Station, GST Road, Chengalpattu 603204',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.chelladurai,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 3298000,
    priceMax: 9645000,
    createdAt: pastDate(83),
  })
  {
    await addComment(pavillion.id, U.selvam,
      `I've been to the site – the railway station claim is reasonably accurate. Singaperumal Koil station is within 500m walking distance from the main entrance of the project. The station has trains to Chennai Beach, Tambaram, and Chengalpattu frequently. This is genuinely valuable. Many Oragadam industrial workers commute daily from Chennai – owning a plot here and renting out gives you an industrial worker tenant base which is steady. The sports amenities are under development – I saw the badminton court under construction and the outdoor gym equipment had arrived. Beach volleyball will need proper sand which they're sourcing.`,
      pastDate(80, 5))
    await addComment(pavillion.id, U.rajalakshmi,
      `624 plots in 34.53 acres = 56 plots per acre. The density is appropriate for plotted layout – you'll have breathing room between properties. The 24/7 CCTV and 2-year free maintenance package from G Square is the standard now for their communities. What I'd verify: the water supply source. Singaperumal Koil has TWAD water supply for the town area but the project site may be outside TWAD coverage. Ask whether they're providing individual water connections or sump + overhead tank arrangement per plot. For a 624-plot community, a common water station with metered supply per plot is the cleanest solution.`,
      pastDate(77, 3))
    await addComment(pavillion.id, U.jayakumar,
      `The pricing of ₹1,999/sqft for Singaperumal Koil is 3-4x what you'd pay for individual plots without gated community infra in the same town. A bare plot near the GST Road in Singaperumal Koil currently goes for ₹450-600/sqft. G Square charges ₹1,999 – the ₹1,400 premium buys you DTCP approval, roads, drainage, boundary wall, CCTV, and the sports amenity zone. Whether that premium is worth it depends on your use case. For personal house construction, yes. For pure land investment to sell in 3 years, the premium narrows your appreciation margin significantly.`,
      pastDate(74))
    await addComment(pavillion.id, U.bala,
      `I actually purchased here 3 months ago – 800 sqft plot at ₹1,999 = ₹15.99L. My thinking: Oragadam industrial zone is literally next door. Hyundai, many tier-1 and tier-2 auto suppliers employ thousands of non-Chennaiites who need rental accommodation. My plan is to construct a G+2 with 3 independent units (one per floor, 500 sqft each) and rent at ₹7,000-8,000 per unit = ₹21,000-24,000/month. Loan on ₹16L plot + ₹25L construction = ₹41L at 8.5% = ₹36,000 EMI. Break-even in about 5 years with rental income. If land appreciates 50% in 5 years (conservative for GST Road belt), the total return is very good.`,
      pastDate(70, 4))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE NORTHERN CROWN — Puzhal, North Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Northern Crown...')
  const northernCrown = await createTopic({
    slug: 'gsquare-northern-crown-puzhal-north-chennai',
    propertyName: 'G Square Northern Crown',
    title: 'G Square Northern Crown – 105 DTCP plots in Puzhal, North Chennai | ORR connectivity and water reservoir proximity',
    description: `G Square is expanding into North Chennai with Northern Crown at Puzhal. This area has been underserved by quality plotted developments – most of the action has been in South Chennai (ECR, OMR belt). Northern Crown is 105 plots on 4.39 acres. RERA: TNRERA/29/LO/3108/2025.

Plot sizes: 650 to 1,700 sqft
Pricing: ₹7,999/sqft onwards (₹51.99L onwards for the 650 sqft entry plots)

Amenities: Blacktop internal roads, street lighting, EB + water + UGD connections, children's play area, jogging track, green zones, 24/7 CCTV, 1-year free maintenance. Standard G Square package but the UGD connection is notably promised which is not common in North Chennai plotted layouts.

Why Puzhal?
- Puzhal lake (Red Hills reservoir) – Chennai's major water source – is literally here. The area stays cooler and has better groundwater than most of Chennai
- Ambattur Industrial Estate is 10-12 km – significant industrial employment catchment
- The Outer Ring Road (Chennai Bypass) is accessible – ORR directly connects to the full city
- Red Hills is connected to Chennai metro outskirts discussion
- The Puzhal-Redhills area has seen government investment (prison complex relocated, new government offices)

Concerns I want the community's input on:
1. Being near a major water reservoir – are there any building height or construction restrictions near the Puzhal lake area?
2. ₹7,999/sqft for Puzhal – is this justified vs what the surrounding area commands?
3. The TNRERA registration in 2025 is fresh – how quick can G Square deliver on a 105-plot layout?`,
    address: 'Puzhal, Near Ambattur-Redhills Road, North Chennai 600066',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.meenakshi,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 5199000,
    priceMax: 13600000,
    createdAt: pastDate(18),
  })
  {
    await addComment(northernCrown.id, U.karthikeyan,
      `North Chennai resident here – Kolathur. Puzhal area has been traditionally lower on the real estate radar despite its advantages. The water availability advantage is underrated – Puzhal reservoir keeps groundwater replenished unlike OMR south Chennai which depends heavily on tanker water during summer. Building restrictions near the reservoir: the CRZ-type rules don't apply here (that's coastal), but CMWSSB does have buffer zones around water bodies. Verify specifically with G Square that the plot locations are clear of any such buffer. The TNRERA registration confirms they've gone through the municipal approval process but individual plot distances from the lake should be confirmed.`,
      pastDate(16, 3))
    await addComment(northernCrown.id, U.senthil,
      `₹7,999/sqft for Puzhal is at the higher end. Individual plots in Puzhal without gated community infra sell for ₹2,000-3,500/sqft depending on road access and shape. The G Square premium is ₹4,500-6,000/sqft for the gated infra, DTCP/RERA approval, and amenities. Whether that's worth it: if you're buying to live and build your own house, the approved infrastructure saves you massive headache and the UGD connection saves ₹2-3L in septic tank construction. If it's investment, the premium makes the appreciation math harder.`,
      pastDate(14, 5))
    await addComment(northernCrown.id, U.jayakumar,
      `Ambattur Industrial Estate as an employment catchment is seriously undervalued in property discussions. The estate employs tens of thousands in manufacturing, IT-hardware, and light industry. These employees primarily live in Ambattur, Kolathur, Anna Nagar area. Puzhal is slightly farther but with ORR connectivity becoming better, it's realistic. Rental demand for 2BHK in Puzhal from Ambattur workers is around ₹8,000-12,000/month. At ₹52L for a 650 sqft plot + construction, the numbers work but require a longer horizon than South Chennai properties.`,
      pastDate(12, 2))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE SOUTH CROWN — Medavakkam, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square South Crown...')
  const southCrown = await createTopic({
    slug: 'gsquare-south-crown-medavakkam-chennai',
    propertyName: 'G Square South Crown',
    title: 'G Square South Crown – 86 DTCP plots, Medavakkam | Resort-style plotted community in South Chennai prime',
    description: `G Square South Crown at Medavakkam is a premium product from G Square – 86 plots on 3.36 acres, DTCP + RERA approved. Plot sizes 1,057 to 2,027 sqft at ₹6,999/sqft.

What makes this stand out from most G Square launches: the amenities include a swimming pool, gym, and 3 open courtyards within the community. For a plotted development this is genuinely uncommon – most plot communities have a park and gate security and call it done. South Crown seems to be positioning as apartment-quality amenities within a plot format.

At ₹6,999/sqft:
- 1,057 sqft = ₹74L
- 1,500 sqft = ₹1.05 Cr
- 2,027 sqft = ₹1.42 Cr

Medavakkam is one of South Chennai's most established localities. GST Road and OMR are both accessible. The Pallikaranai-Medavakkam-Sholinganallur corridor has dense employment. Schools are good (Velammal, Chettinad Vidya Mandir), hospitals nearby (Chettinad Health City 5 km).

My concern: 86 plots on 3.36 acres = 25.6 plots per acre. That's dense for a plotted layout. With swimming pool and gym taking up common area, the actual building plots will be compact on a small total land parcel. The largest plot at 2,027 sqft in a dense 3.36-acre layout might not feel spacious.

But Medavakkam location with DTCP approval and swimming pool amenity – hard to find this combination in South Chennai. At ₹74L for the entry 1057 sqft, it's more accessible than a flat in Medavakkam (3BHK starts at ₹85L in this locality).

Anyone visited? How does the actual layout look on ground?`,
    address: 'Medavakkam Main Road, near GST Road junction, Chennai 600100',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.kowsalya,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 7400000,
    priceMax: 14200000,
    createdAt: pastDate(33),
  })
  {
    const c1 = await addComment(southCrown.id, U.vignesh,
      `Visited South Crown last Sunday. The site is smallish but well-organised. The entrance gate design is more premium than typical G Square projects I've seen. The swimming pool location is at the community centre – common area shared by all 86 plot owners. This creates a practical question: who maintains the pool post-handover? G Square typically maintains for 2 years then passes to residents welfare association. 86 families maintaining a pool together requires active coordination. In my experience at similar communities, pools become under-maintained within 3 years unless they have proper professional management.`,
      pastDate(31, 3))
    await addComment(southCrown.id, U.deepa_nat,
      `The plot density of 25 per acre is actually fine for a gated urban community – it's not meant to feel like farmland, it's meant to feel like a planned neighbourhood. My comparison: standalone Medavakkam plots without community infra are selling for ₹4,500-5,500/sqft. G Square's ₹6,999 is premium but the pool, gym, DTCP approval, and 2-year maintenance justifies ₹1,500-2,000 premium. The remaining ₹500-1,000 premium is for the G Square brand which does matter for resale to other buyers who recognize them.`,
      pastDate(28, 5))
    await addComment(southCrown.id, U.priya_iyer,
      `The Build Assist program G Square offers is underrated for first-time plot buyers. They connect you with vetted contractors who've worked in their communities before – they know the specific infra layout, utility connection points, etc. Makes construction smoother. I used it for my G Square Arcadia plot – the contractor knew exactly where the water main was and the electrical duct routing without needing any digging. Saved significant time and some rework costs. Ask specifically about Build Assist availability in South Crown.`,
      pastDate(25, 1), c1.id)
    await addComment(southCrown.id, U.saravanan,
      `One more practical thing about Medavakkam plots: floor space index (FSI) here is good – you can typically build G+2 or G+3 depending on road width abutting the plot. On a 1200 sqft plot you can build up to 3000-4000 sqft total built-up across 3 floors. That's 3 independent units of 1000-1300 sqft each. For rental: Medavakkam 2BHK rentals are ₹18,000-22,000/month. Three units = ₹54,000-66,000/month gross rental on a ₹85L plot + ₹45L construction = ₹1.3 Cr investment. ~4.5% gross yield which is better than apartment yield in the same area.`,
      pastDate(22))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE REGAL PARK — Vandalur, South Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Regal Park...')
  const regalPark = await createTopic({
    slug: 'gsquare-regal-park-vandalur-chennai',
    propertyName: 'G Square Regal Park',
    title: 'G Square Regal Park – 393 plots, 23.53 acres at Vandalur | GST Road belt investment | Zoo adjacency pros and cons',
    description: `G Square Regal Park at Vandalur is their biggest plotted community near the GST Road belt in recent times – 393 plots on 23.53 acres. RERA: TN/35/Layout/0336/2025. Pricing starts at ₹5,199/sqft, 1200 sqft minimum plot size.

Entry price: 1200 sqft × ₹5,199 = ₹62.39L, typical mid-range plot at ₹67.55L as advertised.

Vandalur is known for the famous Arignar Anna Zoological Park which gives the area its name recognition. The zoo adjacency is interesting – it means green belt coverage (the zoo forest area adjoins), no heavy industrial development nearby, clean air, but also some noise from the zoo animals in the morning (mainly birds, peacocks especially).

GST Road / NH48 is the primary artery. Distance to key destinations:
- Tambaram: 8 km (12-15 minutes)
- Chennai Airport: 20 km (25-30 minutes)
- Oragadam industrial: 15 km
- Chengalpattu: 20 km in the other direction
- Kelambakkam-Vandalur Road connects to OMR via Melakottaiyur

Vandalur has its own railway station on the Chennai-Tirupati/Chengalpattu line – decent train frequency. This is a USP that Perumbakkam OMR plots can't match.

23.53 acres for 393 plots = ~16.7 plots per acre which is comfortable. The layout will feel spacious.

Investment case: GST Road land has been appreciating at 15-20% annually for 5 years. Vandalur specifically benefits from both the Oragadam industrial pull and the Chengalpattu-Vandalur educational corridor (many engineering colleges nearby). Plot investors who bought in 2019-20 in this belt have doubled their money.

Flip side: the area beyond Vandalur towards Chengalpattu is still agricultural and under-serviced. CMWSSB doesn't cover Vandalur fully. Check the water source.`,
    address: 'Vandalur, Near Arignar Anna Zoological Park, Chennai 600048',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.nithya,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 6755000,
    priceMax: 12000000,
    createdAt: pastDate(27),
  })
  {
    await addComment(regalPark.id, U.karthik_sun,
      `Vandalur plot market has been one of the strongest in South Chennai for 5 years. A colleague bought a bare plot in Vandalur in 2019 for ₹1,800/sqft and sold in 2024 for ₹4,200/sqft – 133% gain in 5 years. The industrial and educational pull from both Oragadam and Chengalpattu directions is real. G Square's ₹5,199/sqft with RERA and gated infra is pricing in the future growth but you're paying for the packaging. Bare plots here without community infra are around ₹2,800-3,500/sqft. The ₹1,700-2,400 G Square premium is significant but manageable.`,
      pastDate(25, 3))
    await addComment(regalPark.id, U.bala,
      `The zoo adjacency is mostly a positive. The zoological park forest creates a natural sound and dust barrier. If your plot backs the zoo boundary, you get green views indefinitely (zoo land will never be developed). The peacock noise is real – they start at 5am. If you're an early riser it's charming, if you need silence until 7am it's annoying. Other zoo-adjacent sounds: lion roar occasionally at feeding time, elephants bathing. I grew up in Vandalur – you stop noticing after a week. More importantly there are no industries nearby, so no chemical/factory smell or noise.`,
      pastDate(23, 7))
    await addComment(regalPark.id, U.selvam,
      `Water supply: Vandalur township gets CMWSSB supply 3-4 days a week. The project site itself is in the Chengalpattu municipality zone (not GCC Chennai) – the municipality has borewells and a small overhead tank system but coverage is patchy. G Square will need to provide their own underground sump + pumping arrangement. Ask specifically: what is the per-plot water allocation, what happens if borewell levels drop in summer, and whether there's any TWAD or municipality water connection commitment. For 393 plots this is a real operational challenge.`,
      pastDate(20, 2))
    await addComment(regalPark.id, U.chelladurai,
      `The Vandalur railway station connection is underrated. Trains to Chennai Beach and Tambaram run every 30-45 minutes during peak hours. For IT employees in Guindy or Saidapet who don't want to drive on GST Road, the train option changes the daily commute calculation. Plot + own house construction vs apartment: here the argument strongly favours own house because at Vandalur land values, the construction-to-total-cost ratio works out to about 35-40% construction and 60-65% land. When you sell, land value appreciation drives returns, not construction.`,
      pastDate(17))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE CARLTON SPRING — Kuthambakkam, West Chennai
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Carlton Spring...')
  const carltonSpring = await createTopic({
    slug: 'gsquare-carlton-spring-kuthambakkam-poonamallee-chennai',
    propertyName: 'G Square Carlton Spring',
    title: 'G Square Carlton Spring – Kuthambakkam near Poonamallee | Affordable plots, DTCP approved | West Chennai option',
    description: `For people looking at West Chennai plots on a budget, G Square Carlton Spring at Kuthambakkam is one of the more accessible options. 221-250 plots on 11 acres, DTCP approved, pricing at ₹2,750/sqft onwards.

Plot sizes: 634 sqft to 2,291 sqft
Cost range:
- 634 sqft × ₹2,750 = ₹17.4L (entry level – very small)
- 900 sqft × ₹2,750 = ₹24.75L (buildable, tight)
- 1,200 sqft × ₹2,750 = ₹33L (comfortable for G+2 construction)
- 2,291 sqft × ₹2,750 = ₹63L

At ₹2,750/sqft this is the most affordable DTCP-approved gated community near West Chennai that I've found. Individual non-community plots in Kuthambakkam are around ₹1,200-1,800/sqft so G Square's ₹2,750 carries a premium but the gated community benefit is clear.

Kuthambakkam location:
- 5 km from Poonamallee town
- NH48 (Chennai-Bangalore highway) accessible
- Proposed Metro corridor near Poonamallee will serve this area
- Sriperumbudur industrial zone is 15-20 km away
- The Kuthambakkam-Poonamallee belt is seeing rapid residential development

The area is known for the Kuthambakkam model village project (an innovative social initiative) – adds a certain identity to the locality.

What's the current state of infrastructure in Kuthambakkam? It's still a panchayat area. Before booking a plot here, I want to understand: roads, water, electricity consistency. Anyone from this area?`,
    address: 'Kuthambakkam, near Poonamallee, West Chennai 602107',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.rajalakshmi,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 1935000,
    priceMax: 6300000,
    createdAt: pastDate(48),
  })
  {
    await addComment(carltonSpring.id, U.preethi_s,
      `Kuthambakkam infrastructure reality check from someone who visits often (relatives there): Roads have improved significantly in the last 3 years – the Kuthambakkam main road is tarred and in reasonable condition. Electricity: TANGEDCO supply is stable, power cuts are maximum 1-2 hours/day in summer. Water: the panchayat water supply is available but scheduled – maybe 30-45 minutes morning + evening. Borewells are functional – water table is at 40-60 feet which is good for West Chennai. Mobile network is full 4G on Airtel/Jio. Not a village in the traditional sense anymore – Poonamallee town is just 5 km for all services.`,
      pastDate(45, 4))
    await addComment(carltonSpring.id, U.jayakumar,
      `At ₹24.75L for a 900 sqft plot + ₹12-15L construction for a basic G+1 (2BHK) = ₹37-40L total investment. In the same Kuthambakkam-Poonamallee belt, 2BHK flat rentals are ₹8,000-10,000/month. On ₹40L investment that's 2.4-3% gross rental yield – lower than the plot formula. But the land alone will appreciate: GST Road/NH48 belt properties near Poonamallee have grown 60-80% in 5 years. At that trajectory, a ₹25L plot bought today becomes ₹40-45L in 5 years just on land value. The construction value depreciates but land offsets it strongly.`,
      pastDate(42, 2))
    await addComment(carltonSpring.id, U.karthikeyan,
      `The Kuthambakkam model village initiative by the Elango Panchayat President is worth mentioning – it brought genuine governance innovation here which translated to better roads, waste management, and social infrastructure compared to neighbouring panchayats. This kind of local governance quality affects the living experience more than fancy amenities. G Square choosing Kuthambakkam over some other cheaper panchayat area suggests they also believe in the area's governance credentials. The model village concept attracted NGO and government attention which means continued infrastructure improvement likelihood.`,
      pastDate(39, 6))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE SARVA — Sriperumbudur
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Sarva...')
  const sarva = await createTopic({
    slug: 'gsquare-sarva-sriperumbudur-chennai',
    propertyName: 'G Square Sarva',
    title: 'G Square Sarva – 270 plots at Sriperumbudur | Samsung, Foxconn, Kia belt | Industrial corridor investment',
    description: `G Square Sarva at Sriperumbudur is positioned as an industrial corridor investment play. 270 plots on 12.31 acres, DTCP + RERA approved, priced at ₹1,950/sqft onwards. 100% clear titles is their emphasis.

Plot sizes: 1,168 sqft onwards
Price: 1,168 × ₹1,950 = ₹22.78L to ~₹52.8L for larger plots

Sriperumbudur – where do I start. This is literally the electronics manufacturing capital of India's south:
- Samsung's India HQ manufacturing: here
- Foxconn (Apple's iPhone manufacturer in India): here and expanding
- Motorola/Lenovo: here
- Kia automotive plant: 15 km at Penukonda
- Hundreds of tier-1 and tier-2 suppliers across auto and electronics

The Apple-Samsung-Foxconn combination alone employs over 50,000 people. Most workers are migrants from other states staying in hostel accommodation. The rental market for proper housing is chronically undersupplied.

For a plot investor building rental accommodation, this is the sweet spot. Workers employed in these factories earn ₹15,000-30,000/month and need decent 1-2 BHK accommodation at ₹5,000-10,000/month. Land values here are rising as the industrial footprint expands.

At ₹1,950/sqft you're buying at near-ground level pricing. Comparable bare plots without community infra in Sriperumbudur are ₹700-1,200/sqft. The ₹750 G Square premium for DTCP approval, infrastructure, and gated community is worth it if you're building to rent or hold.

Concerns: air quality in Sriperumbudur is mediocre due to industrial activity. And occasional traffic disruption from factory shift changes on the GST Road service road.`,
    address: 'Sriperumbudur, near SIPCOT Industrial Estate, Chennai-Bangalore Highway, Kancheepuram 602105',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.ganesan,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 2278000,
    priceMax: 5280000,
    createdAt: pastDate(57),
  })
  {
    const c1 = await addComment(sarva.id, U.selvam,
      `Sriperumbudur rental market is real – I have 2 properties here (not G Square, standalone). My 1BHK rents for ₹7,500/month consistently to Samsung factory workers. My 2BHK rents for ₹11,000/month to a supervisor-level couple. The Foxconn expansion means demand is only going up. The key is to build proper quality accommodation, not cramped construction – factory workers who earn ₹20,000+ want dignity in living space. My advice: on a 1,168 sqft plot, build G+2 with 2 units per floor (3 floors) = 6 units of ~400 sqft each. At ₹5,500/month per unit = ₹33,000/month total. On ₹23L plot + ₹30L construction = ₹53L investment. 7.5% gross yield. That's excellent.`,
      pastDate(54, 5))
    await addComment(sarva.id, U.meenakshi,
      `The upcoming Metro proposal for Sriperumbudur (as part of Chennai Metro Phase 3 long-term planning) would be transformational if it happens. Currently the connectivity is GST Road bus and share auto – the train is the Chennai-Arakkonam/Tirupati line with stations at Sriperumbudur. The existing rail option already improves things compared to pure road. Air quality: Sriperumbudur is industrial but the electronics factories (Samsung, Foxconn) have better emission controls than auto factories. It's not Manali SIPCOT level pollution. Still, the prevailing wind direction matters – check if the plot is upwind or downwind of the major factories before buying.`,
      pastDate(51, 3))
    await addComment(sarva.id, U.vignesh,
      `One thing the Apple/iPhone production ramp-up means for Sriperumbudur: more management-level and engineering-level employees moving in, not just factory floor workers. Foxconn is hiring engineers and quality control professionals who earn ₹40,000-80,000/month. These people want 2-3BHK apartments or independent houses, not hostels. A 1,500+ sqft plot with a proper G+2 house with 3BHK per floor addresses this premium rental segment. Plot + good construction targeting this demographic makes sense. G Square Sarva's 270 plots in a community format also has better security perception for this demographic.`,
      pastDate(48, 1), c1.id)
    await addComment(sarva.id, U.priya_iyer,
      `DTCP + 100% clear titles for Sriperumbudur is important because this area historically had title disputes from agricultural land conversion. Many individual plots sold in Sriperumbudur 10 years ago had messy patta records. G Square's legal team is known for clearing title before launching – this is one area where their brand premium is genuinely earned. For a ₹22-50L investment, clean title is worth paying ₹5-8L extra for. Cheap unapproved plots in Sriperumbudur are available at ₹600-800/sqft but the legal risk negates the price advantage.`,
      pastDate(45))
  }

  // ═══════════════════════════════════════════════════════
  // G SQUARE VRINDAVAN — Singaperumal Koil
  // ═══════════════════════════════════════════════════════
  console.log('Creating G Square Vrindavan...')
  const vrindavan = await createTopic({
    slug: 'gsquare-vrindavan-singaperumal-koil-oragadam-chennai',
    propertyName: 'G Square Vrindavan',
    title: 'G Square Vrindavan – 450 plots near Oragadam, Singaperumal Koil | Large plot options up to 6555 sqft',
    description: `G Square Vrindavan at Singaperumal Koil is interesting because it offers large plot sizes – up to 6,555 sqft – which is rare in gated plotted communities near Chennai. Most communities cap at 2,000-2,500 sqft. If you want a genuine bungalow plot, Vrindavan has options.

450 total plots across 19.51 acres. DTCP approved. Pricing: ₹1,999/sqft onwards.
- 916 sqft (minimum) × ₹1,999 = ₹18.3L
- 1,500 sqft × ₹1,999 = ₹30L
- 3,000 sqft × ₹1,999 = ₹60L
- 6,555 sqft × ₹1,999 = ₹1.31 Cr

The Singaperumal Koil / Oragadam zone has multiple G Square projects now – Pavillion and Vrindavan are both here. Pavillion is the sports-themed community, Vrindavan appears to be the more traditional gated layout with larger plot options.

19.51 acres for 450 plots = 23 plots per acre. The larger plots mean the density feels lower despite the numbers.

Why I'm interested in the large plot option: my plan is a farmhouse-style house with garden, not a multi-unit rental property. The 6,555 sqft plot at ₹1.31 Cr gives me a 60x100 feet piece of land within a secure gated community in a growing industrial corridor – something that's almost impossible to find in GCC Chennai limits anymore.

Oragadam industrial zone nearby means the area will develop (infrastructure pressure) but also brings employment that supports property values. The GST Road connectivity makes this accessible from most of Chennai.

Has anyone bought a large plot (3000+ sqft) in any G Square community and can share the actual living experience? Do the larger plots get proper utilities?`,
    address: 'Singaperumal Koil, Oragadam-Singaperumal Koil Road, Chennai 603209',
    cityId: CITY.chennai,
    propertyType: 'PLOT',
    userId: U.bala,
    developerSlug: 'gsquare',
    developerName: 'G Square Housing',
    priceMin: 1830000,
    priceMax: 13100000,
    createdAt: pastDate(43),
  })
  {
    await addComment(vrindavan.id, U.chelladurai,
      `Large plot buyer in G Square Arcadia Kelambakkam (2,200 sqft) checking in. My experience: large plots in G Square communities do get the same utility connections as small plots – individual EB connection, water main connection point, UGDS outlet. The road abutting a large corner plot can be wider which is nice. Building on a 2,200 sqft plot: I built G+1 (ground + first floor) totalling 2,800 sqft built-up – a proper duplex with garden space remaining. Cost: ₹42L construction. The garden space (remaining ~1,000 sqft around the house) adds massive quality of life – kids have outdoor space, wife grows vegetables. This is what you can't get in any apartment.`,
      pastDate(40, 4))
    await addComment(vrindavan.id, U.rajalakshmi,
      `The farmhouse concept you mentioned requires checking local FSI and setback rules. In Chengalpattu panchayat/municipality zones, the allowable FSI and setback from boundaries varies. Typically for residential construction: 2 metre setback all sides minimum. On a 6,555 sqft (say 60×110 ft) plot, that means the buildable area after setbacks is about 56×106 = 5,936 sqft per floor. But municipality rules may cap height or require specific approvals for large houses. Verify specifically: what's the approved land use on this Singaperumal Koil layout – residential or mixed? Some layouts near industrial zones have mixed-use designation that affects what you can build.`,
      pastDate(37, 2))
    await addComment(vrindavan.id, U.saravanan,
      `₹1.31 Cr for a 6555 sqft plot in Singaperumal Koil is genuinely attractive compared to alternatives. A similarly sized plot in Vandalur or Kelambakkam would cost ₹2.5-4 Cr. You're trading off the address premium for area. But for a farmhouse or retirement home use-case, Singaperumal Koil's greenery, railway connectivity, and Oragadam industrial activity (which will bring social infrastructure over time) makes it sensible. The Vrindavan community format adds security which matters for a large property you might not occupy full-time initially.`,
      pastDate(34, 6))
  }

  console.log('\n✅ Seed Part 2 complete.\nSummary:')
  const all = [mercury, suncity, holachennai, casamia, flagship, massimo, frenchtown, jarvis, osaka, casablanca, flamingo, meadows, pavillion, northernCrown, southCrown, regalPark, carltonSpring, sarva, vrindavan]
  all.forEach(t => console.log(`  ${t.propertyName.padEnd(32)}: ${t.id}`))
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
