// Tier 1 Part B — Surat (6 more) + Jaipur (8 more)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()
function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) { return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000) }

const EXTRA_USERS = [
  { name: 'Vipul Kapoor',       email: 'vipul.kapoor.srt@gmail.com' },
  { name: 'Payal Mehta',        email: 'payal.mehta.srt@gmail.com' },
  { name: 'Darshan Shah',       email: 'darshan.shah.srt@gmail.com' },
  { name: 'Komal Thakkar',      email: 'komal.thakkar.srt@gmail.com' },
  { name: 'Harshad Vasavada',   email: 'harshad.vasavada.srt@gmail.com' },
  { name: 'Nidhi Joshi',        email: 'nidhi.joshi.jpr@gmail.com' },
  { name: 'Siddharth Gupta',    email: 'siddharth.gupta.jpr@gmail.com' },
  { name: 'Kavita Sharma',      email: 'kavita.sharma.jpr@gmail.com' },
  { name: 'Deepak Agarwal',     email: 'deepak.agarwal.jpr@gmail.com' },
  { name: 'Sunita Goyal',       email: 'sunita.goyal.jpr@gmail.com' },
  { name: 'Raghav Mathur',      email: 'raghav.mathur.jpr@gmail.com' },
  { name: 'Preethi Rajput',     email: 'preethi.rajput.jpr@gmail.com' },
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
  // ── SURAT ─────────────────────────────────────────────────────────────────
  {
    citySlug: 'surat',
    propertyName: 'Puraniks Aldea Espanola',
    propertyType: 'APARTMENT',
    address: 'Pal-Adajan, Surat 395009',
    developerName: 'Puranik Builders',
    developerSlug: 'puranik-builders',
    priceMin: 5800000, priceMax: 11500000,
    topic: {
      userName: 'Vipul Kapoor',
      title: 'Puraniks Aldea Espanola Surat — Mumbai builder, does the brand translate to Surat?',
      description: `Puranik Builders is a well-known name in the Mumbai-Thane belt. Their entry into Surat with Aldea Espanola on the Pal-Adajan Road raised curiosity. Does a builder known for Western suburbs of Mumbai understand the Surat market?

From the site visit: the product is unmistakably Mumbai in its design language. The lobby, the rooftop amenity deck, the sample flat layout — these are Mumbai apartment sensibilities translated to Surat. Whether this is a positive depends on your preference. Surat buyers historically prefer slightly different spatial arrangements — larger kitchen, vastu-friendly layouts. Aldea Espanola feels designed for a Thane buyer.

That said, the build quality is very good. Puranik has been consistent in Mumbai. The concrete quality, the door frames, the window sealing — these are above Surat average. The 3 BHK at 1600 sqft is generous and the balconies are genuinely usable (not the token 50 sqft balconies you get in some Surat projects).

Pal-Adajan location: this is one of Surat's most active residential corridors. The Pal Junction connecting to Adajan and the Dumas Road gives access to Vesu and the beach side. Good medical infrastructure (Khyati Hospital, Cosmoderma) nearby.

Pricing at 6500-7500 per sqft is at the top of what Pal-Adajan typically commands. The Mumbai brand premium is being asked but the Surat resale market may not fully recognize it. Vesu resale buyers won't come this far for the Puranik name alone.

Best suited: buyers who value Mumbai-style construction quality and understand that the premium is for product quality, not for address prestige.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Payal Mehta', content: `The Vastu layout concern you mention is real for the core Surat buyer. But the younger professional generation — people in their 30s buying their first home — care less about Vastu and more about layout efficiency and aesthetics. Puranik has correctly identified this shift in the Surat market.`, daysAfter: 4 },
      { userName: 'Darshan Shah', content: `Surat is getting more national builder attention because it's a high-income city with undersupply of quality organized projects. Puranik is smart to enter here. Their Surat project will likely outperform their Mumbai projects on appreciation percentage.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Vipul Kapoor', score: 3, review: 'Good Mumbai build quality. Design doesn\'t fully resonate with traditional Surat buyer preferences. Right for younger buyers.' },
      { userName: 'Darshan Shah', score: 4, review: 'National builder entering Surat is a positive signal. Quality above local average. Appreciation upside is strong.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'Radhe Icon',
    propertyType: 'APARTMENT',
    address: 'Adajan, Surat 395009',
    priceMin: 6200000, priceMax: 13000000,
    topic: {
      userName: 'Payal Mehta',
      title: 'Radhe Icon Adajan — is Adajan\'s best days behind it or still the right buy?',
      description: `Adajan has been Surat's most popular address for over a decade. The question I hear is: has it peaked? Radhe Icon is one of the current flagship projects here. Sharing my assessment.

Adajan's fundamentals are intact. Proximity to Surat Textile Market, the Adajan Patiya commercial hub, and Pal beach road make it a lifestyle-complete address. The social infrastructure — Patel Nursing Home, Kamdhenu Shopping Centre, schools — is excellent.

Radhe Developers has been building in Surat for 25+ years. Their Icon project is their current premium offering. The tower is on one of Adajan's better plots — facing the river side on upper floors you get a partial Tapi river glimpse.

The product: 3 BHK units have a split-bedroom design that works well for joint families — master and one bedroom on one side of the flat, the third bedroom (for parents or kids) on the other side with a separate entrance to the common bathroom. This layout is specifically designed for the Surat joint family structure and shows the builder understands the local buyer.

Pricing at 7000-8000 per sqft makes the 3 BHK approximately 90 lakhs to 1.1 Cr. This is Adajan's current going rate for premium product. Not cheap but Adajan commands it.

To answer the "has it peaked" question: Adajan's prices have been stable (not declining, not rising fast) for 18 months. This is a mature market settling at its natural level. Don't buy for 1-2 year flipping. Buy for 5+ year hold where the area's fundamentals guarantee steady appreciation.`,
      daysAgo: 49,
    },
    comments: [
      { userName: 'Komal Thakkar', content: `The split bedroom layout for joint families is a very Surat design choice — I've seen it in a few Surat projects and it genuinely works. Shows Radhe did their homework on local buyer needs. Mumbai or Delhi projects never think about this. It's a small detail that makes day-to-day joint family life much more comfortable.`, daysAfter: 5 },
      { userName: 'Harshad Vasavada', content: `Adajan hasn't peaked — it's matured. There's a difference. A matured market has stable prices, consistent demand, and reliable resale. None of those are bad things. For end-use, a matured market is actually better than a speculative one.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Payal Mehta', score: 4, review: 'Radhe understands Surat buyer. Split bedroom design is practical and appreciated. Adajan is mature, stable, reliable.' },
      { userName: 'Komal Thakkar', score: 4, review: 'Best joint-family-friendly layout in Adajan currently. Radhe\'s local market knowledge shows.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'NR Venus',
    propertyType: 'APARTMENT',
    address: 'Vesu Canal Road, Surat 395007',
    priceMin: 7500000, priceMax: 16000000,
    topic: {
      userName: 'Darshan Shah',
      title: 'NR Venus Vesu — canal road facing units, is the premium worth it?',
      description: `Vesu has many projects but canal-facing is a specific micro-location within Vesu. NR Venus has secured canal road frontage which gives upper floor units a linear water view — rare in Surat real estate.

NR Buildcon is a Surat-based developer with a solid local track record. Their Venus project on Vesu Canal Road has been generating interest because of the unique waterfront positioning. Surat doesn't have many genuine water-adjacent residential projects.

The canal view: on floors 10 and above, the canal view is clear and pleasant especially in the evenings. The canal itself is maintained — the Surat Municipal Corporation has done genuine beautification work on the Vesu canal stretch. Walking path along the canal is complete and used by residents. So unlike some "lake view" projects where the lake is a drainage canal, this is actually a nice urban waterway.

The apartment: 3 BHK at 1750 sqft carpet on a canal-facing unit is among the best propositions in Vesu. The balcony depth is 6 feet which is genuinely usable for sitting and watching the water. Kitchen is modular, bathrooms have decent fittings.

Pricing differential: canal-facing units are priced 8-10% higher than non-canal-facing in the same project. At 8500-9500 per sqft for canal facing, versus 7500-8000 for other orientations. The premium is fair given the uniqueness of the view.

My concern: canal view depends on no high-rise coming up on the canal's other side. Check if there's an FSI restriction on the opposite bank. The view you buy today should be protected by regulation; confirm this before paying the premium.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Vipul Kapoor', content: `The FSI restriction check is very smart advice. In Surat, the DP (Development Plan) 2035 has specific rules for canal setbacks. The canal-facing plots on the other side generally have setback requirements that prevent another high-rise from blocking your view. Verify this with a local planner or architect before paying the view premium.`, daysAfter: 3 },
      { userName: 'Harshad Vasavada', content: `NR Buildcon's earlier projects in Surat — Rajhans Residency and a couple others they've partnered on — have decent quality. Not the top tier of Sheetal or Shivalik but above the middle. For the canal view story, this is reasonable positioning.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Darshan Shah', score: 4, review: 'Canal view is genuine and protected. NR quality is decent. Verify FSI on opposite bank before paying view premium.' },
      { userName: 'Vipul Kapoor', score: 3, review: 'Good concept. Builder is mid-tier. Do legal due diligence on view protection before committing.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'Suryam Opulence',
    propertyType: 'APARTMENT',
    address: 'Vesu, Surat 395007',
    priceMin: 9500000, priceMax: 22000000,
    topic: {
      userName: 'Komal Thakkar',
      title: 'Suryam Opulence — Surat\'s most expensive residential launch, who is it for?',
      description: `Suryam Opulence is making waves in Surat real estate because it's the first project in the city to cross 1 Cr per unit as a standard offering (not penthouse). The base pricing is 9500 per sqft for 4 BHK units ranging from 3200-4500 sqft carpet. This is genuinely new territory for Surat.

Suryam Developers is a Surat family that has been building premium commercial real estate here for years. The residential foray is ambitious — they've brought in an international design firm, the lobby has art installations, and the amenity floor is genuinely luxurious by any Indian tier-2 city standard.

The product: only 4 BHK configurations. The smallest unit is 3200 sqft carpet which is approximately twice the size of what competitors call "luxury." This is ultra-luxury positioning — targeting Surat's diamond merchants, senior textile businessmen, and NRIs returning from the US and UK.

Who is this for: a Surat family that has been living in a 5000 sqft bungalow in Adajan and wants the convenience of apartment living without compromising space or status. Suryam is giving them that option for the first time in Surat.

Will the market absorb it: Surat's ultra-high-net-worth population is larger than people outside Gujarat realize. Diamond industry alone has hundreds of families in the 50 Cr+ net worth bracket who have never had a truly luxury apartment option in their home city. Suryam is targeting exactly this gap.

My honest view: this will sell slowly but it will sell. The demand exists. The risk is Suryam's execution — they're doing luxury residential for the first time. International design firm is a good sign. Track the project carefully through construction.`,
      daysAgo: 27,
    },
    comments: [
      { userName: 'Payal Mehta', content: `The 5000 sqft bungalow to apartment transition is a real demographic shift in Surat. The next generation — even in diamond family households — prefers apartment living for security and maintenance convenience. They just didn't have a product worthy of their background. Suryam addresses this.`, daysAfter: 4 },
      { userName: 'Darshan Shah', content: `The international design firm is key. One of the legitimate complaints about Surat real estate has been that even expensive projects look like expensive Surat projects — not like international luxury. If Suryam's design firm actually delivers their Mumbai-style vision, this will set a benchmark.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Komal Thakkar', score: 4, review: 'Right product for the right gap in Surat market. Track construction closely given first luxury residential attempt.' },
      { userName: 'Payal Mehta', score: 4, review: 'Targets real demand from Surat\'s HNI population. Risk is builder execution of luxury — worth watching.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'Arihant Arham',
    propertyType: 'APARTMENT',
    address: 'Dumas Road, Surat 395006',
    priceMin: 4800000, priceMax: 9000000,
    topic: {
      userName: 'Harshad Vasavada',
      title: 'Arihant Arham Dumas Road — proximity to beach, does it translate into value?',
      description: `Living near a beach sounds aspirational but in Surat the reality is nuanced. Dumas Road connects to Dumas Beach — Surat's most popular coastal destination. Arihant Arham is positioned on this road about 3 km from the beach.

Beach proximity in Surat: the humidity and salt air effect on buildings is real. Projects on Dumas Road have slightly higher maintenance requirements for external surfaces. Builders who know this (Arihant does) use appropriate exterior paint and protective coating. If you're buying resale, specifically check the exterior condition of the building.

Arihant Group in Surat: mid-market builder with 15+ years in the city. Not the top tier brand but reliable for the price point. Their Arham project is for the 50-90 lakh first-time buyer who wants a proper society with amenities but can't afford Vesu pricing.

Dumas Road location practical benefits: the beach is 10 minutes for evening walks, the NH-8 is accessible, and the area is quieter than central Adajan or Vesu. Schools in the Dumas Road catchment include a few decent English medium options.

The project: 2 BHK and 3 BHK in a mid-rise format (12 floors). Not a high-rise tower, which actually works better for the mid-segment buyer — fewer people, more community feel, lower maintenance costs. The amenity deck with sea view is the highlight.

Pricing at 5200-5800 per sqft positions this correctly between mass market Surat builders and premium Vesu projects. For first-time buyers looking for quality without the Vesu price tag, this works.`,
      daysAgo: 58,
    },
    comments: [
      { userName: 'Vipul Kapoor', content: `The salt air exterior maintenance point is important practical advice. Ask Arihant specifically what exterior coating they've used and what the maintenance interval is. If they've done it properly, 3-4 year repaint cycles are fine. If they've cut corners, you'll see staining in 18 months.`, daysAfter: 5 },
      { userName: 'Komal Thakkar', content: `Dumas Road has been appreciating faster than central Surat in the past 2 years as more people want beach proximity. Not at Vesu prices but the gap is narrowing. Good entry point for capital appreciation story.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Harshad Vasavada', score: 3, review: 'Reliable mid-market builder. Beach proximity is a lifestyle plus. Check exterior waterproofing quality carefully.' },
      { userName: 'Komal Thakkar', score: 3, review: 'Good value entry into Surat coastal belt. Appreciation potential as Dumas Road matures.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'Ashadeep Lotus',
    propertyType: 'APARTMENT',
    address: 'Althan-Bhatar Road, Surat 395017',
    priceMin: 4200000, priceMax: 8200000,
    topic: {
      userName: 'Komal Thakkar',
      title: 'Ashadeep Lotus Althan-Bhatar — budget alternative to Vesu, is it good enough?',
      description: `Been apartment hunting in Surat for 4 months. Budget is 55-65 lakhs for a 3 BHK. Vesu is completely out of reach at this budget — anything decent there is 85 lakhs plus. Althan-Bhatar corridor is where I'm looking and Ashadeep Lotus came up in my search.

Ashadeep Developers is a smaller local Surat builder. Not a national name, not even among the top 5 in Surat. But they've done a few projects in this corridor — Ashadeep Heights and Ashadeep Villa — and from what residents tell me, delivery was on time and quality was acceptable.

Lotus project: 3 BHK at 1350 sqft carpet for 55-60 lakhs. Comparing this to what 55-60 lakhs gets you elsewhere: in Vesu you'd get a 2 BHK in an older building with renovation needed. In Althan-Bhatar you get a new 3 BHK with amenities. The space trade-off is substantial.

The Althan-Bhatar location: it's midway between Vesu and Bhatar. Vesu amenities (hospitals, schools, restaurants) are 12-15 minutes. The Surat-Dumas Road junction is accessible. Outer Ring Road construction nearby will improve this area's connectivity further.

My concerns: smaller builder means less price discovery on resale — there are fewer comparables so negotiating a good exit price in 5-7 years may be harder than in an established area. Also verify RERA registration and check the builder's financial health before booking.

For a family where space matters most and budget is constrained, this is worth visiting. Just go in eyes open about the builder scale.`,
      daysAgo: 14,
    },
    comments: [
      { userName: 'Darshan Shah', content: `The resale liquidity point for smaller builder projects is very real. When you want to sell, the pool of willing buyers is smaller because fewer people know the builder. If you can stretch to a known brand, the long-term exit is cleaner. But if budget is the constraint, Althan-Bhatar corridor itself has demand regardless of builder.`, daysAfter: 3 },
      { userName: 'Harshad Vasavada', content: `Verify RERA and check if the project is under Surat Municipal Corporation or Surat Urban Development Authority limits. Tax structure and maintenance differ. Sometimes peripheral projects are outside city limits which affects municipal services access.`, daysAfter: 5 },
    ],
    ratings: [
      { userName: 'Komal Thakkar', score: 3, review: 'Honest value for budget buyers. Smaller builder — do thorough due diligence. Location is the real asset here.' },
      { userName: 'Darshan Shah', score: 2, review: 'Space is good for the price. Resale liquidity concern is real. Stretch to a known brand if at all possible.' },
    ],
  },

  // ── JAIPUR ────────────────────────────────────────────────────────────────
  {
    citySlug: 'jaipur',
    propertyName: 'Mahindra Aura',
    propertyType: 'APARTMENT',
    address: 'Ajmer Road, Jaipur 302020',
    developerName: 'Mahindra Lifespace',
    developerSlug: 'mahindra-lifespace',
    priceMin: 5200000, priceMax: 9800000,
    topic: {
      userName: 'Nidhi Joshi',
      title: 'Mahindra Aura Ajmer Road — solid builder in Jaipur\'s most active corridor?',
      description: `Ajmer Road is Jaipur's go-to corridor for mid-to-premium residential. The road itself has matured significantly — good retail, hospitals (Fortis, Manipal), quality schools, and the Sindhi Camp area for cultural touchpoints. Mahindra Aura sits on this corridor.

Mahindra Lifespace needs no introduction nationally but their Jaipur projects have had a mixed reception. Their earlier Aura Phase 1 (same project) delivered slightly late but the product quality was excellent. Phase 2 (current availability) should follow the same pattern.

The apartment: 2 BHK and 3 BHK in towers with a well-designed podium. Mahindra's signature green space — they take IGBC ratings seriously — means the landscaping is genuine, not decorative. The central park and the walking track around it are actually usable and maintained.

What I specifically checked: the ground floor units have private garden extensions which Mahindra offers in a few projects. For families with elderly parents who can't use stairs and find elevator dependence stressful, this is a real convenience. The garden extension units are priced 8-10% higher.

Ajmer Road is established enough that I don't worry about social infrastructure. My concern is the traffic — especially around Gopalbari and Sodala during peak hours, Ajmer Road becomes a parking lot. However, the project is set back from the main road so the noise and access aren't as bad as you'd think.

For Jaipur buyers looking for a proven national brand: Mahindra is the right choice. If Eldeco (local) is the trusted known quantity for Jaipur old-timers, Mahindra is the preferred choice for those who want national brand accountability.`,
      daysAgo: 41,
    },
    comments: [
      { userName: 'Siddharth Gupta', content: `The IGBC rating Mahindra projects carry is meaningful. Their water conservation systems actually work — rooftop rainwater harvesting is operational in Phase 1 and residents report their water bill is noticeably lower vs comparable societies. Sustainability that translates to actual savings is a selling point.`, daysAfter: 4 },
      { userName: 'Kavita Sharma', content: `I've been watching Ajmer Road prices for 3 years. Mahindra Aura has appreciated about 22% since Phase 1 launch prices. That's better than the Jaipur residential average of 12-15% in the same period. Brand premium translates to better appreciation.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Nidhi Joshi', score: 4, review: 'Mahindra delivers consistent quality. Ajmer Road is the right address. IGBC sustainability features are practical, not just marketing.' },
      { userName: 'Kavita Sharma', score: 5, review: 'Best appreciation in Jaipur residential over 3 years. National brand premium is real and lasting.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Amar Serenity',
    propertyType: 'APARTMENT',
    address: 'Jagatpura, Jaipur 302017',
    priceMin: 4500000, priceMax: 8500000,
    topic: {
      userName: 'Siddharth Gupta',
      title: 'Amar Serenity Jagatpura — south Jaipur is underrated, here\'s why I think so',
      description: `Every Jaipur real estate conversation focuses on Vaishali Nagar and Ajmer Road. I want to make the case for Jagatpura in south Jaipur and specifically for Amar Serenity.

Jagatpura's fundamentals: Sanganer Airport is 4 km away. This makes Jagatpura the only Jaipur residential area with true airport proximity. For frequent flyers — and Jaipur has a lot of them, given the business and tourism trade — this is genuine daily convenience. Also, Mansarovar Metro is nearby and the proposed extension toward Jagatpura is in the plan.

The RIICO industrial area in Jagatpura creates a large employed population for rental demand. SME manufacturers, textiles, and export-oriented units employ thousands who need quality housing nearby. Rental demand is consistent and growing.

Amar Group is a local Jaipur developer. Not the biggest name but they've delivered a previous project nearby — Amar Vatika — and residents I spoke to were reasonably satisfied. Serenity is a step up in quality from their previous work.

The project: 2 BHK and 3 BHK in a low-rise format (G+5). This is by design — the airport proximity means height restrictions apply in Jagatpura. If you're expecting a high-rise tower with city views, this isn't it. What you get is a ground-related community feel, garden access for lower floors, and lower elevator dependency.

Pricing at 4800-5500 per sqft is significantly below Vaishali Nagar (7000-8000 per sqft) for a comparable product. The location discount is real but so is the upside when Jagatpura's airport proximity gets appropriately valued.`,
      daysAgo: 53,
    },
    comments: [
      { userName: 'Deepak Agarwal', content: `The airport proximity point is compelling but I'd add one thing: Jaipur airport expansion (second runway, new terminal) is confirmed. This will increase passenger volume and the airport-adjacent real estate story will strengthen. Jagatpura is the direct beneficiary.`, daysAfter: 5 },
      { userName: 'Nidhi Joshi', content: `Height restriction in Jagatpura is both a constraint and a feature. Low-rise living appeals to families with kids and elderly parents. The community feel in G+5 projects is very different from 20-floor towers. Serenity's low-rise format will attract a specific buyer who values this.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Siddharth Gupta', score: 4, review: 'Airport proximity, metro extension, and RIICO employment all point to long-term demand. Underrated micro-market.' },
      { userName: 'Deepak Agarwal', score: 4, review: 'Airport expansion will be the catalyst. Buying now at a discount to Vaishali Nagar is the smart play.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Omaxe City Jaipur',
    propertyType: 'APARTMENT',
    address: 'Sitapura, Jaipur 302022',
    developerName: 'Omaxe Group',
    developerSlug: 'omaxe',
    priceMin: 4200000, priceMax: 9500000,
    topic: {
      userName: 'Kavita Sharma',
      title: 'Omaxe City Sitapura — large township, 5 years in, honest resident review',
      description: `Moved into Omaxe City Sitapura in 2020. Five years is enough time to form a proper opinion. Sharing everything from possession to today.

The township concept at Sitapura works in the broad sense — it's a complete community. Market within, school (Omaxe's own), park, clubhouse. For a family where both parents work, having essentials within walking distance reduces daily friction significantly. This was the main reason we bought.

Construction quality reality check: Omaxe is not the best builder in quality. The specific issues we faced: one bathroom tap had a constant drip (fixed under warranty after 2 visits), the external window frame on one window wasn't properly sealed and there was seepage in the first monsoon (Omaxe fixed it eventually but it took 4 months and a lot of follow-up). By year 2 most snags were resolved and since then no major issues.

Society management: this is where Omaxe has genuinely improved. The township has a professional facility management company. Cleanliness, security, and maintenance are consistently handled. Not 5-star but reliable.

Sitapura location: EPIP zone nearby means manufacturing and textile industry employment. The Jaipur-Agra Highway is accessible. The issue is distance from the old city and civil lines — for anything in the heart of Jaipur, you're 30-40 minutes away. This is a limitation if your lifestyle is city-centre dependent.

For families prioritizing township amenities and affordability over central location: Omaxe City Sitapura is a genuine option. Just go in knowing the builder quality is average and factor in a renovation budget for year 1.`,
      daysAgo: 18,
    },
    comments: [
      { userName: 'Raghav Mathur', content: `The seepage issue you mentioned is actually mentioned by multiple Omaxe residents in different projects across India. It seems to be a consistent gap in their waterproofing specification. If buying new, insist on a proper monsoon test before full possession payment.`, daysAfter: 2 },
      { userName: 'Sunita Goyal', content: `The township self-sufficiency aspect genuinely matters for families with kids. Not having to drive out for school, groceries, or a haircut saves 30-45 minutes a day across a family. Multiply by 365 days and that's a significant quality of life improvement.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Kavita Sharma', score: 3, review: 'Township concept works. Construction quality is average. Society management has improved. Be prepared for year-1 snagging.' },
      { userName: 'Sunita Goyal', score: 3, review: 'Good lifestyle for families. Omaxe quality is consistent with their national average — not stellar but acceptable.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Ansal Sushant City Phase 2',
    propertyType: 'APARTMENT',
    address: 'Ajmer Road, Jaipur 302020',
    developerName: 'Ansal API',
    developerSlug: 'ansal-api',
    priceMin: 4800000, priceMax: 9000000,
    topic: {
      userName: 'Deepak Agarwal',
      title: 'Ansal Sushant City Phase 2 — Ansal post-RERA issues, can you trust this project?',
      description: `Ansal API has had well-documented issues in Delhi NCR — delayed projects, pending OCs, NCLT proceedings. Before I looked at their Jaipur project, I did serious due diligence on whether the Jaipur operations are clean. Sharing what I found.

Important distinction: Ansal API's main entity (Delhi NCR projects) has had problems. But Ansal's Jaipur projects, including Sushant City, are under a separate operational entity and have a better track record. The Sushant City Phase 1 in Jaipur delivered and the society is functional and occupied.

Phase 2 RERA registration: active and current. The registration shows construction milestones being met. This matters — if a builder is hiding problems, they often stop updating RERA timelines. The Jaipur Phase 2 RERA page shows regular updates.

The project itself: large township in the Ajmer Road corridor. 2 BHK and 3 BHK in mid-rise format. The common areas are well-sized — central park, clubhouse, walking track. Phase 1 residents I spoke to had positive things to say about the community life.

Pricing at 5000-5500 per sqft is fair for the Ajmer Road location. It's 15-20% below Mahindra Aura and Eldeco projects on the same corridor — the Ansal brand discount is real. For a risk-adjusted buyer, that discount may be worth taking if the Jaipur entity's clean record gives confidence.

My recommendation: if you're buying this, book with a lawyer who has verified the Jaipur entity's specific RERA filings, not just Ansal's national reputation. The risk is not zero but the Jaipur project appears cleaner than the NCR operations.`,
      daysAgo: 36,
    },
    comments: [
      { userName: 'Preethi Rajput', content: `This distinction between Ansal Delhi NCR and Ansal Jaipur is important and many buyers don't know to make it. The Jaipur operations have been separately managed for years. Phase 1 residents are genuinely satisfied from what I hear. The brand stigma is unfair to the Jaipur project.`, daysAfter: 4 },
      { userName: 'Nidhi Joshi', content: `Always check RERA independently regardless of what the builder or broker tells you. Download the RERA registration certificate, check that the commencement certificate and land title are attached, and verify that quarterly progress reports are filed. This takes 30 minutes and can save you from a major headache.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Deepak Agarwal', score: 3, review: 'Jaipur entity has a cleaner record than NCR operations. Good value if you do the RERA verification homework.' },
      { userName: 'Preethi Rajput', score: 3, review: 'Phase 1 is a functioning township. Brand discount makes Phase 2 fair value. Verify legal documents carefully.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'VT Luxuria',
    propertyType: 'APARTMENT',
    address: 'Vaishali Nagar, Jaipur 302021',
    priceMin: 7800000, priceMax: 15500000,
    topic: {
      userName: 'Sunita Goyal',
      title: 'VT Luxuria Vaishali Nagar — local builder going ultra-premium, does it deliver?',
      description: `VT (Vikas Trading, the promoter group) has been a Jaipur real estate name for years but in the affordable-to-mid segment. Luxuria is their first attempt at the premium end. I've watched this closely.

Vaishali Nagar is arguably the best residential address in Jaipur. Proximity to everything — schools (Maheshwari), hospitals, markets, the Jaipur bypass. VT securing a plot in prime Vaishali Nagar for a luxury project is itself a statement.

The product: only 3 BHK and 4 BHK. All units above 2000 sqft carpet. They've spent visibly on the amenities deck — infinity pool, fully equipped gym, a proper concierge desk in the lobby. The sample flat has Italian marble, German hardware on wardrobes, and Grohe bathroom fittings. This is genuinely premium specification.

The question is execution. VT's track record is in lower segments where the specification bar is lower. Can they execute a luxury product to the specification they've shown in the sample flat? This is the honest uncertainty.

What gives me confidence: they've hired a Bangalore-based project management consultant firm with luxury residential experience. The site supervisor I spoke to was knowledgeable and specific about construction quality checks. This suggests they've taken the step up seriously.

Pricing at 8500-10000 per sqft puts a 4 BHK at 2.2-2.5 Cr. For Vaishali Nagar, I believe this will hold and appreciate — the address alone supports it. The question is whether VT the execution matches VT the ambition.

Progress is at 60% construction when I visited. Watch the next 12 months of construction quality before finalizing.`,
      daysAgo: 24,
    },
    comments: [
      { userName: 'Siddharth Gupta', content: `Vaishali Nagar's scarcity makes any project here valuable regardless of builder. The number of development plots remaining in core Vaishali Nagar can be counted on two hands. VT got one of the last good plots. The address guarantees a floor on appreciation.`, daysAfter: 3 },
      { userName: 'Raghav Mathur', content: `The Bangalore PM consultant is a smart move if true. Ask VT for the name of the consulting firm and verify they're actually engaged, not just listed in the brochure. Genuine quality oversight is what separates projects that deliver premium spec from those that advertise it.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Sunita Goyal', score: 3, review: 'Prime Vaishali Nagar location de-risks the investment. Execution uncertainty on premium spec is the watch point.' },
      { userName: 'Siddharth Gupta', score: 4, review: 'Address scarcity in Vaishali Nagar makes this low-risk on appreciation. Product execution is the variable.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Vatika India Next',
    propertyType: 'APARTMENT',
    address: 'Ajmer Road, NH-48, Jaipur 302026',
    developerName: 'Vatika Group',
    developerSlug: 'vatika-group',
    priceMin: 5500000, priceMax: 11000000,
    topic: {
      userName: 'Raghav Mathur',
      title: 'Vatika India Next — NCR builder in Jaipur, is the product as good as their Gurugram work?',
      description: `Vatika Group is well known in Gurugram — their Vatika India Next in Gurugram Sector 82-83 is among the better township projects in NCR. They've launched Vatika India Next in Jaipur on the Ajmer Road/NH-48 belt. Same brand, same concept, different city.

The Gurugram township has delivered well — I have family there and the quality is genuinely good. The question is whether Vatika's Jaipur execution replicates this.

The Jaipur project: a township spanning significant acreage on NH-48. The master plan looks good on paper — residential, retail, a school, and eventually commercial space. The apartment towers are part of the residential cluster.

Location on NH-48: this is excellent highway connectivity — Delhi is accessible, Ajmer is directly on this highway, and Jaipur's Ring Road connects here. Airport proximity via the bypass is 20-25 minutes. The challenge: NH-48 stretch here is currently semi-rural with construction all around. The area will take 3-5 years to fully settle.

Vatika's product quality based on Gurugram experience: concrete quality is good, floor plan efficiency is high, society management post-delivery is professional. I expect the same in Jaipur.

Pricing at 5800-6500 per sqft is slightly below comparable NCR Vatika pricing but appropriate for Jaipur's market. It's at the upper end for highway location projects in Jaipur but justified by the brand and product spec.

Long-term investment case: if Jaipur continues its growth trajectory (which seems likely given the metro, the airport expansion, and increasing corporate presence), a highway-connected township on this scale should do well. 7-10 year hold.`,
      daysAgo: 61,
    },
    comments: [
      { userName: 'Preethi Rajput', content: `Vatika has a good community management reputation from their Gurugram properties. The residents' portal, the app for maintenance requests, the events calendar — these are systems that take years to build and they're already proven at Vatika's other projects. Jaipur residents will inherit this.`, daysAfter: 5 },
      { userName: 'Kavita Sharma', content: `NH-48 location is far from established Jaipur today but that distance is shrinking rapidly. The city is growing westward and northwestward. 5-7 years from now, this stretch will feel much more like Ajmer Road does today. Early buyer advantage is significant.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Raghav Mathur', score: 4, review: 'Vatika\'s track record translates across cities. Good township concept, highway location has long-term upside.' },
      { userName: 'Preethi Rajput', score: 4, review: 'Professional management systems from Gurugram experience. Jaipur buyers will benefit from this institutional knowledge.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Unique Anmol',
    propertyType: 'APARTMENT',
    address: 'Mansarovar, Jaipur 302020',
    priceMin: 4000000, priceMax: 7500000,
    topic: {
      userName: 'Preethi Rajput',
      title: 'Unique Anmol Mansarovar — affordable in Jaipur\'s established residential belt',
      description: `Mansarovar is one of Jaipur's most established residential areas. Mansarovar Extension is slightly further but still within this established belt. Unique Anmol is targeting the 40-75 lakh budget here and it's genuinely one of the more honest value propositions in the city.

Unique Group is a local Jaipur developer who has been delivering projects in this part of the city for a decade. Their earlier projects — Unique Residency and Unique Park — are occupied and in decent shape. Not iconic, not award-winning, but functional and well-maintained.

Anmol project: 2 BHK and 3 BHK in a mid-rise complex. The society has a proper clubhouse, a gym that's actually equipped (not the 3-treadmill kind), and a play area for kids. Garden is maintained. Security is 24-hour with proper log system.

Mansarovar connectivity: Metro Line connects Mansarovar to City Centre and then to the airport. This metro connectivity is mature and working — not future-promise but present reality. From Anmol, the nearest metro station is 10-12 minutes by auto.

Who should buy: Government employees and teachers (multiple state government offices and schools are in the Mansarovar belt), IT employees working in the tech park on Tonk Road, and families wanting established Jaipur neighborhood living without Vaishali Nagar pricing.

The honest expectation for appreciation: Mansarovar is a mature market — steady 6-8% annual appreciation rather than the 15-20% you'd get from a developing corridor. If you need a home now and stability matters, this is right. If you're hunting for high returns, look at the peripheral corridors.`,
      daysAgo: 43,
    },
    comments: [
      { userName: 'Sunita Goyal', content: `The metro connectivity from Mansarovar is real and makes a huge difference for daily commuters. My sister lives in Mansarovar and takes the metro to her office in Raja Park — 25 minutes door to door including walking time. Before metro it was 50+ minutes by auto. This connectivity premium is sustainable and real.`, daysAfter: 4 },
      { userName: 'Deepak Agarwal', content: `Unique as a builder — small but consistent. They don't overcommit on specs and then underdeliver. What's in the brochure is what you get. For buyers burned by fancy promises that didn't materialize, this predictability is actually valuable.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Preethi Rajput', score: 4, review: 'Honest value in an established area. Metro connectivity is the real USP. Right for end-use buyers prioritizing stability.' },
      { userName: 'Sunita Goyal', score: 4, review: 'Metro access changes the calculus. Mansarovar is mature market with steady appreciation. Reliable choice.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Ashiana Utsav',
    propertyType: 'APARTMENT',
    address: 'Ajmer Road Extension, Jaipur 302020',
    developerName: 'Ashiana Housing',
    developerSlug: 'ashiana-housing',
    priceMin: 3500000, priceMax: 6200000,
    topic: {
      userName: 'Kavita Sharma',
      title: 'Ashiana Utsav Jaipur — retirement-friendly community concept, worth it for senior buyers?',
      description: `Ashiana Housing's retirement-friendly community design is what sets them apart from every other builder in India. I'm writing this from the perspective of someone looking for a home for my parents who are both in their mid-60s.

Utsav is specifically designed as a senior citizen-friendly community — wide corridors for wheelchair accessibility, ramps at every level change, medical facilities within the campus, emergency pull-cord in bathrooms, and an activity calendar that ensures social engagement. These are not cosmetic features — Ashiana has genuinely engineered their communities for senior living.

The Jaipur Utsav project on Ajmer Road Extension: the apartments are single-floor (2 BHK at 850-950 sqft), no awkward levels, everything accessible. The community hall hosts morning yoga, afternoon games, and weekend events. The in-house medical facility has a nurse available and a doctor visits three times a week.

My parents visited and the thing that struck them most: the existing residents seemed genuinely happy. We spoke to 3 couples already living there. All three said they wished they'd moved earlier. The social isolation that plagues many elderly people living alone is genuinely addressed by Ashiana's community programming.

Pricing at 4000-5000 per sqft for a 2 BHK comes to 35-50 lakhs. For parents downsizing from a 4 BHK house, the residual money can be FD for medical expenses. The total financial math of moving parents to Utsav often works out better than maintaining a large house.

This isn't an investment play — it's a quality of life decision for elderly family members. On that metric, Ashiana Utsav is genuinely the best option in Jaipur.`,
      daysAgo: 29,
    },
    comments: [
      { userName: 'Raghav Mathur', content: `Ashiana's community concept is unique in India. No other developer focuses on this with the same depth of understanding. The social programming alone — not just the physical accessibility — distinguishes them. My grandmother lived in their Chennai project and the transition from isolated to socially engaged was dramatic and positive.`, daysAfter: 3 },
      { userName: 'Nidhi Joshi', content: `For children of elderly parents who live in different cities, the Ashiana model is a significant relief. The in-house medical support and the active community means you're not constantly worried about your parents being alone. The peace of mind for the family is worth a lot.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Kavita Sharma', score: 5, review: 'Best senior living option in Jaipur by a wide margin. Ashiana genuinely understands what elderly residents need.' },
      { userName: 'Raghav Mathur', score: 5, review: 'Ashiana\'s community programming sets the gold standard. For elderly family members, this is the right choice.' },
    ],
  },
]

async function main() {
  console.log('🏙️  Seed Part B — Surat + Jaipur\n')
  const hash = await bcrypt.hash('Forum@2024!', 10)
  const userMap: Record<string, string> = {}
  const existing = await prisma.user.findMany({ select: { id: true, name: true } })
  for (const u of existing) userMap[u.name] = u.id
  for (const u of EXTRA_USERS) {
    const user = await prisma.user.upsert({ where: { email: u.email }, update: {}, create: { name: u.name, email: u.email, passwordHash: hash, emailVerified: new Date(), role: 'USER' } })
    userMap[u.name] = user.id; process.stdout.write('.')
  }
  console.log('\n  ✓ users ready\n')
  let topics = 0, comments = 0, ratings = 0
  for (const prop of PROPS) {
    const city = await prisma.city.findUnique({ where: { slug: prop.citySlug } })
    if (!city) { console.warn(`  ⚠ ${prop.citySlug}`); continue }
    const base = toSlug(prop.propertyName); let slug = base, n = 0
    while (await prisma.topic.findUnique({ where: { cityId_slug: { cityId: city.id, slug } } })) slug = `${base}-${++n}`
    const authorId = userMap[prop.topic.userName]
    if (!authorId) { console.warn(`  ⚠ ${prop.topic.userName}`); continue }
    const td = rDate(prop.topic.daysAgo, prop.topic.daysAgo - 1)
    const topic = await prisma.topic.create({ data: { cityId: city.id, userId: authorId, title: prop.topic.title, slug, propertyName: prop.propertyName, propertyType: prop.propertyType as any, description: prop.topic.description, address: prop.address, priceMin: prop.priceMin, priceMax: prop.priceMax, developerName: prop.developerName || null, developerSlug: prop.developerSlug || null, isPublished: true, createdAt: td, updatedAt: td } })
    topics++
    for (const c of prop.comments) { const uid = userMap[c.userName]; if (!uid) continue; const d = new Date(td.getTime() + c.daysAfter * 86400000); await prisma.comment.create({ data: { topicId: topic.id, userId: uid, content: c.content, createdAt: d, updatedAt: d } }); comments++ }
    await prisma.topic.update({ where: { id: topic.id }, data: { commentCount: prop.comments.length } })
    const seen = new Set<string>(); let rSum = 0, rCnt = 0
    for (const r of prop.ratings) { const uid = userMap[r.userName]; if (!uid || seen.has(uid)) continue; seen.add(uid); const d = rDate(prop.topic.daysAgo - 1); await prisma.rating.create({ data: { topicId: topic.id, userId: uid, score: r.score, review: r.review, createdAt: d, updatedAt: d } }); rSum += r.score; rCnt++; ratings++ }
    if (rCnt > 0) await prisma.topic.update({ where: { id: topic.id }, data: { avgRating: rSum / rCnt, ratingCount: rCnt } })
    await prisma.topicSubscription.upsert({ where: { topicId_userId: { topicId: topic.id, userId: authorId } }, update: {}, create: { topicId: topic.id, userId: authorId } })
    console.log(`  ✓ [${prop.citySlug}] ${prop.propertyName}`)
  }
  console.log(`\n✅ Part B done — topics:${topics} comments:${comments} ratings:${ratings}`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
