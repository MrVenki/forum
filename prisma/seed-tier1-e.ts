// Tier 1 Part E — Visakhapatnam (6) + Vadodara (6) + Ghaziabad (6)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  // Visakhapatnam
  { name: 'Rajesh Kumar Naidu',   email: 'rajesh.naidu.vizag@gmail.com' },
  { name: 'Lakshmi Prasad Rao',   email: 'lakshmi.prasad.vizag@gmail.com' },
  { name: 'Venkata Subbarao',     email: 'venkata.subbarao.vizag@gmail.com' },
  { name: 'Padma Rao Vizag',      email: 'padma.rao.vizag@gmail.com' },
  { name: 'Srinivas Murthy V',    email: 'srinivas.murthy.vizag@gmail.com' },
  // Vadodara
  { name: 'Bharat Trivedi',       email: 'bharat.trivedi.vad@gmail.com' },
  { name: 'Minal Thakkar',        email: 'minal.thakkar.vad@gmail.com' },
  { name: 'Pravin Joshi Baroda',  email: 'pravin.joshi.baroda@gmail.com' },
  { name: 'Hetal Patel Baroda',   email: 'hetal.patel.baroda@gmail.com' },
  { name: 'Chetan Doshi Baroda',  email: 'chetan.doshi.baroda@gmail.com' },
  // Ghaziabad
  { name: 'Ankit Sharma Ghz',     email: 'ankit.sharma.ghz@gmail.com' },
  { name: 'Nidhi Rastogi',        email: 'nidhi.rastogi.ghz@gmail.com' },
  { name: 'Vivek Pandey Ghz',     email: 'vivek.pandey.ghz@gmail.com' },
  { name: 'Ritu Agarwal Ghz',     email: 'ritu.agarwal.ghz@gmail.com' },
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
  // ── VISAKHAPATNAM ──────────────────────────────────────────────────────────
  {
    citySlug: 'visakhapatnam',
    propertyName: 'Aparna HillPark Vizag',
    propertyType: 'APARTMENT',
    address: 'Gajuwaka, Visakhapatnam 530026',
    developerName: 'Aparna Constructions',
    developerSlug: 'aparna-constructions',
    priceMin: 4800000, priceMax: 9500000,
    topic: {
      userName: 'Rajesh Kumar Naidu',
      title: 'Aparna HillPark Gajuwaka Vizag — hill views and township living, honest review',
      description: `Booked a 3BHK in Aparna HillPark last October and I want to share a detailed account because this project gets mixed word-of-mouth which I think is partly unfair.

First, the location context: Gajuwaka is about 18 km from Vizag city centre. That sounds far until you factor in the NH-216 upgrade which has made this stretch genuinely manageable — about 30 minutes without traffic. The industrial port area proximity means the local economy around Gajuwaka is active, not a dormant suburb. Steel plant, port-related activity, and growing commercial development all support the area.

Aparna Constructions is a reputed Hyderabad-based developer with significant delivery history across Andhra Pradesh and Telangana. Their projects in Hyderabad — Aparna Sarovar, Aparna HillPark in Nallagandla — have consistently strong reviews. They don't oversell and they don't disappear post-possession. For a Vizag buyer who may be evaluating a developer from outside the city, Aparna's national reputation provides a credibility floor.

The project itself is genuinely planned around the topography. The hill views from upper floors — floors 10 and above — are real. I visited at sunrise and I understood why they named it HillPark. The greenery in that direction is preserved land which means the view is unlikely to be blocked by future construction.

Construction quality at site visit: no hollow tiling, plastering is done properly, electrical conduits are embedded correctly. These are things many buyers don't check but they matter for long-term maintenance. Aparna typically uses branded raw materials and that shows in the finish.

Pricing at ₹48-95 lakh depending on configuration is competitive for a branded developer project with this view and amenities. Water supply uses a combination of VUDA connection and borewell — confirm current status before booking as VUDA supply in Gajuwaka area has historically been intermittent.`,
      daysAgo: 42,
    },
    comments: [
      { userName: 'Lakshmi Prasad Rao', content: `The hill view point is very valid — I visited the Aparna site and the east-facing upper floors genuinely frame the Kailasa Hills. What you described about preserved land behind the project is confirmed by the VUDA master plan I checked. That hill land is earmarked as green belt. Long-term view safety is a real plus.`, daysAfter: 2 },
      { userName: 'Venkata Subbarao',   content: `Gajuwaka property values have moved up 25-30% in three years driven by port expansion and the steel plant modernisation. Anyone who bought here in 2021-22 is sitting on solid appreciation. For buyers entering now, the growth story has more legs given the Vizag Metro proposed alignment through this corridor.`, daysAfter: 5 },
      { userName: 'Padma Rao Vizag',    content: `My cousin completed possession in Aparna HillPark Phase 1 about a year ago. His feedback: actual possession happened within 2 months of promised date, construction quality matched the sample flat, and the RWA was formed properly before handover. That last point matters more than people realise — a functioning RWA from day one sets the maintenance tone for years.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Rajesh Kumar Naidu', score: 4, review: 'Aparna quality is real. Hill views are genuine. VUDA water supply needs verification. Good value for a branded developer at Gajuwaka prices.' },
      { userName: 'Venkata Subbarao',   score: 4, review: 'Gajuwaka growth story is solid. Aparna HillPark sits in the right location for that story. Strong medium-term appreciation case.' },
    ],
  },
  {
    citySlug: 'visakhapatnam',
    propertyName: 'Janapriya Pride Rushikonda',
    propertyType: 'APARTMENT',
    address: 'Rushikonda, Visakhapatnam 530045',
    developerName: 'Janapriya Engineers',
    developerSlug: 'janapriya-engineers',
    priceMin: 5500000, priceMax: 10000000,
    topic: {
      userName: 'Lakshmi Prasad Rao',
      title: 'Janapriya Pride Rushikonda Vizag — IT corridor and beach proximity, is this Vizag\'s best location?',
      description: `My wife and I have been looking at flats near Rushikonda for almost two years and I want to share everything we learned, because this micro-market deserves a proper discussion rather than the superficial "beach views!" write-ups you find in paid property portals.

Rushikonda's fundamentals are the strongest in Vizag right now. The IT corridor development — IIIT Vizag, several tech companies setting up operations — is driving genuine employment. Beach proximity (1.5 km to Rushikonda Beach) creates lifestyle value that is increasingly attractive to the Hyderabad-based tech professional diaspora who grew up on beaches and want to return. GITAM University is minutes away, meaning consistent rental demand from faculty and postgraduate students.

Janapriya Engineers is an AP-based developer with a long track record. They are not glamorous marketers — you won't see flashy hoardings — but their project delivery record in Andhra Pradesh, particularly in Vijayawada and Vizag, is genuinely solid. Their Janapriya Gardenia in Vizag was delivered on time and currently has a happy resident community.

Janapriya Pride is priced at ₹55-100 lakh depending on floor and configuration. The 2BHK at 1,080 sqft on a mid-floor is around ₹62 lakh which is on the higher end for Vizag. You are paying the Rushikonda premium and in my assessment that premium is justified for two reasons: genuine IT employment catchment and the beach access that is difficult to replicate elsewhere in any Andhra city.

One thing to verify carefully: the sea view claim. The developer markets sea views for certain floors, but we found during our visit that only floors 14 and above on east-facing units get a genuine sea glimpse. Floors below that see the hill, not the sea. This is not unusual but confirm before paying a premium for a specific floor.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Rajesh Kumar Naidu',  content: `Rushikonda IT corridor is real and growing. I know at least 15 people who moved from Hyderabad to Vizag for quality of life and Rushikonda was their first choice because of exactly what you described — tech jobs plus beach. Janapriya's local reputation is solid. Good write-up.`, daysAfter: 1 },
      { userName: 'Srinivas Murthy V',   content: `The sea view floor clarification is important — I visited three projects in Rushikonda and all of them market "sea views" liberally. The reality is always more floor-specific than the brochure suggests. Anyone considering a premium for sea-facing should physically stand on that specific floor before booking, ideally with a compass app to verify orientation.`, daysAfter: 4 },
      { userName: 'Padma Rao Vizag',     content: `Rushikonda to Bheemunipatnam road widening project has been sanctioned. Once complete, connectivity along the beach corridor will improve significantly. This makes Rushikonda an even stronger medium-term bet — it will be accessible from more directions.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Lakshmi Prasad Rao', score: 4, review: 'Best location in Vizag currently. Janapriya has the delivery record to back it up. Verify sea-view floors personally. Strong buy for end-users and IT professionals.' },
      { userName: 'Srinivas Murthy V',  score: 3, review: 'Good project but floor-specific due diligence on views is essential. Do not pay sea-view premium without standing on that floor first.' },
    ],
  },
  {
    citySlug: 'visakhapatnam',
    propertyName: 'Ramky One Kaleido',
    propertyType: 'APARTMENT',
    address: 'Bheemunipatnam, Visakhapatnam 531163',
    developerName: 'Ramky Group',
    developerSlug: 'ramky-group',
    priceMin: 7000000, priceMax: 14000000,
    topic: {
      userName: 'Venkata Subbarao',
      title: 'Ramky One Kaleido Bheemunipatnam — beachfront resort living, premium justified?',
      description: `Ramky One Kaleido is positioned at the top of Vizag's residential market — priced at ₹6,000-6,800 per sqft for units along the Bheemunipatnam beach stretch. Let me tell you why this project is fundamentally different from everything else in the market and why the premium has a rational basis.

Bheemunipatnam is Vizag's Alibag — a beach town about 24 km from the city that has traditionally been a weekend getaway destination. The AP government's coastal development push, tourism infrastructure investment, and road improvements along the Vizag-Bheemunipatnam corridor have transformed this stretch over the last three years. What was a slow dirt-road drive is now a proper two-lane highway with plans for further widening.

Ramky Group is a national developer of the first order — their infrastructure and real estate projects across South India and beyond carry institutional credibility. This is not a first-time or single-project developer. Their Ramky One brand is positioned as their premium offering and the quality at Kaleido reflects that — sky lounge, jogging track along the beachfront, infinity pool overlooking the Bay of Bengal. These are not aspirational promises; I visited the site and the construction is at an advanced stage where you can see the actual amenities taking shape.

The buyer profile matters here. In my visits to the sales office I met buyers from Hyderabad IT companies (weekend/retirement home), NRIs from the US and Middle East (emotional connection to Vizag plus beach lifestyle), and senior Vizag professionals buying as retirement destination. Almost nobody is buying as a daily-residence primary home — and that is the right use case for this project.

For a second home with lifestyle value and appreciating asset characteristics, Ramky One Kaleido is genuinely compelling. For daily primary residence, the 24 km commute to Vizag main city is a real constraint that should not be minimised.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Lakshmi Prasad Rao', content: `The Bheemunipatnam beach quality is genuinely among the best on India's east coast — less crowded than Rushikonda, better maintained. If AP government's plans for a luxury beach tourism corridor here materialise, properties like Ramky Kaleido will appreciate significantly. The infrastructure investment is already visible.`, daysAfter: 3 },
      { userName: 'Padma Rao Vizag',    content: `I went for a site visit last month. The location is almost theatrical in its beauty — you can actually hear the sea from the upper floor terrace. But weekend traffic on the Vizag-Bheemunipatnam road on Friday evenings is genuinely bad. If you're using this as a weekend home account for this when planning travel.`, daysAfter: 6 },
      { userName: 'Rajesh Kumar Naidu', content: `Ramky has delivered Ramky One Galaxia and similar projects in Hyderabad to excellent reviews. Their quality is institutional — not dependent on individual project managers being on site. For a Vizag buyer evaluating a developer who will be accountable post-possession, Ramky's national scale is reassuring.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Venkata Subbarao', score: 4, review: 'Premium pricing justified by unique beachfront position and Ramky institutional quality. Best second-home investment in Vizag. Not for daily commuters.' },
      { userName: 'Padma Rao Vizag',  score: 3, review: 'Beautiful location, strong developer. Weekend traffic is a real issue. Watch road infrastructure development before committing at this price point.' },
    ],
  },
  {
    citySlug: 'visakhapatnam',
    propertyName: 'My Home Apas Madhurawada',
    propertyType: 'APARTMENT',
    address: 'Madhurawada, Visakhapatnam 530048',
    developerName: 'My Home Corporation',
    developerSlug: 'my-home-corporation',
    priceMin: 6500000, priceMax: 13000000,
    topic: {
      userName: 'Padma Rao Vizag',
      title: 'My Home Apas Madhurawada — Hyderabad quality developer enters Vizag, what to expect',
      description: `My Home Corporation launching in Vizag is news worth paying attention to. This is a Hyderabad developer with a reputation that genuinely sets them apart — their Vihanga project in Hyderabad is regularly cited as a benchmark for mid-premium quality, and their My Home Avatar and Tridasa projects have delivered without the delays and quality issues that plague many national developers.

Madhurawada as a location has strong fundamentals. It sits on the road toward the new IT SEZ — the government has been consistent in pushing IT investment in Vizag after the capital city issue settled. Several large IT companies have announced presence in the Vizag SEZ and while timelines have moved, the direction is clear. Madhurawada benefits from this IT employment growth in a way that older city-centre localities cannot.

The project — My Home Apas — is priced at ₹5,200-5,800 per sqft, which works out to ₹65-90 lakh for the primary 2 and 3 BHK configurations. This is premium pricing for Vizag. You are paying for My Home quality — their construction quality control is institutional and they use quality materials throughout, not just in sample flats. Their post-possession maintenance is also notably better than local competitors.

NRI interest in My Home Apas is visible — at the preview event I attended, a significant number of attendees were Vizag-origin NRIs from the US and Gulf. This buyer profile matters because NRI-heavy societies tend to have better funded maintenance and higher quality community standards.

Possession target is 2026. My Home has historically been close to their delivery timelines — not always exactly on date but within 3-6 months which for Indian real estate is genuinely responsible. My strong recommendation: register your interest, visit the site, and if the floor plan works for you, this is among the best options Vizag has seen from a credibility standpoint.`,
      daysAgo: 20,
    },
    comments: [
      { userName: 'Venkata Subbarao', content: `My Home Corporation quality I can personally vouch for — I have visited four of their completed Hyderabad projects and the construction standard is consistently above their price segment. Bringing this to Vizag fills a genuine gap. Local Vizag developers at comparable prices simply cannot match their quality control systems.`, daysAfter: 2 },
      { userName: 'Srinivas Murthy V', content: `Madhurawada IT SEZ direction has faced some delays in execution but the land acquisition and planning are done. Once IT tenants start operations there the residential demand in Madhurawada will jump sharply. Buying pre-operational is the right strategy if your holding horizon is 3+ years.`, daysAfter: 6 },
      { userName: 'Rajesh Kumar Naidu', content: `The NRI demand for quality projects in Vizag has been building for a while. Vizag has a large diaspora — particularly in the Gulf — who want to return or invest in their home city. My Home's brand recognition among this community, given their Hyderabad presence, is a genuine marketing advantage in this segment.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Padma Rao Vizag',    score: 4, review: 'My Home brings institutional quality to Vizag real estate. Madhurawada IT corridor location is forward-looking. Best branded project in Vizag currently.' },
      { userName: 'Venkata Subbarao',   score: 5, review: 'My Home Corporation track record is unmatched. Vizag finally gets the quality it deserves. Watch this project closely — it will set a new standard.' },
    ],
  },
  {
    citySlug: 'visakhapatnam',
    propertyName: 'Madhura Infra Horizons Kommadi',
    propertyType: 'APARTMENT',
    address: 'Kommadi, Visakhapatnam 531173',
    developerName: 'Madhura Infra',
    developerSlug: 'madhura-infra',
    priceMin: 3500000, priceMax: 6500000,
    topic: {
      userName: 'Srinivas Murthy V',
      title: 'Madhura Infra Horizons Kommadi — budget option for Vizag outskirts, what I found on site',
      description: `Not everyone looking in Visakhapatnam has a ₹70 lakh budget. I want to write specifically for buyers in the ₹40-55 lakh range because the forum tends to over-represent premium projects. Madhura Infra Horizons in Kommadi is one of the more credible options in this segment.

Kommadi is approximately 12 km from Vizag city centre on the NH-316 toward Bheemunipatnam. The road is a proper national highway — reasonably maintained and wide enough for comfortable commuting. The area itself is developing: there are functional markets, schools, and a medical centre within 2 km. It is not an urban suburb yet but it is past the point of being a remote outpost.

Madhura Infra is a smaller local developer. They are not going to be on national property portals with glossy banners. What they do have: two completed projects within 5 km of this site, and I personally visited both. Residents in those projects were generally satisfied — possession was slightly delayed (3-4 months) but happened, and construction quality was described as honest. No premium finishes but no hollow tiles or visible defects either.

Horizons is priced at ₹3,800-4,200 per sqft — making a 1,100 sqft 2BHK around ₹42-46 lakh. The floor plans are functional without being inspirational. Ceiling height is 9.5 feet. The compound has a small park and covered parking — no pool or clubhouse, which is expected at this price.

My recommendation: if your budget is firm around ₹42-50 lakh and you need to be in the Vizag area, this is a credible choice. Verify RERA registration (it is registered) and get a good property lawyer for the documentation. Don't skip due diligence with local developers — it protects you.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Rajesh Kumar Naidu', content: `The budget segment review is genuinely valuable — most forum posts focus on branded projects. Madhura's track record you described is actually quite decent for a Vizag local developer. The 3-4 month delay is the industry average. Checking OC for their completed projects before booking is the right move.`, daysAfter: 2 },
      { userName: 'Lakshmi Prasad Rao', content: `Kommadi land prices are still low enough that developers can price competitively. In 5 years as the Rushikonda IT corridor extends southward, Kommadi will be in the catchment zone. Buyers entering now at ₹42-46 lakh are getting in before that appreciation happens.`, daysAfter: 5 },
      { userName: 'Padma Rao Vizag',    content: `One thing to add for Kommadi buyers: the local bus connectivity to Vizag Railway Station is reasonable — the NH-316 buses are frequent. For non-car-owning households or those with one vehicle this matters. Not every Vizag suburb has this connectivity.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Srinivas Murthy V',  score: 4, review: 'Best budget option in Vizag within ₹50 lakh. Local developer with verifiable track record. Honest construction. Do your RERA and OC checks.' },
      { userName: 'Rajesh Kumar Naidu', score: 3, review: 'Good value for the budget segment. Smaller developer means more self-due-diligence required. Location growth story is genuine.' },
    ],
  },
  {
    citySlug: 'visakhapatnam',
    propertyName: 'MVP Colony Residences',
    propertyType: 'APARTMENT',
    address: 'MVP Colony, Visakhapatnam 530017',
    developerName: 'Various Builders',
    developerSlug: 'various-builders',
    priceMin: 6000000, priceMax: 12000000,
    topic: {
      userName: 'Venkata Subbarao',
      title: 'MVP Colony Vizag resale market — why I chose established locality over new construction',
      description: `After eight months of comparing new construction in Vizag outskirts versus resale in established localities, I made my final decision: resale in MVP Colony. I want to explain this reasoning because it runs counter to the typical forum advice of "always buy new."

MVP Colony — Model Village Project Colony — is one of Vizag's most established and genuinely liveable residential areas. Laid out systematically with wide roads, mature tree cover, a proper grid layout that makes navigation intuitive, and proximity to both the beach (10 minutes walk to Rushikonda Beach) and to city services. The school ecosystem is the best in Vizag — several reputed schools are within 2 km radius. Hospitals, markets, restaurants — MVP Colony is self-sufficient in a way that no new township in the outskirts can claim in 2024.

Resale 2BHKs in MVP Colony run ₹65-85 lakh for decent-sized flats. Buildings are typically 15-25 years old. The construction quality of that era is often better than current budget construction — thicker walls, higher ceilings, larger rooms. The caveat is maintenance: check for seepage, water proofing condition, and the society's maintenance fund health before committing.

The deal I found: a 7th floor 3BHK in a 20-year-old well-maintained building, 1,450 sqft, beach glimpse from the balcony. Asking price ₹92 lakh, settled at ₹84 lakh after negotiation. Immediate possession — no EMI + rent double payment, no construction delays, no possession anxiety. The flat was renovation-ready and we moved in within 45 days of registration.

For families with children and for anyone who values ready infrastructure over anticipated future development, MVP Colony resale is a deeply rational choice at current Vizag prices.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Srinivas Murthy V',  content: `This is exactly the kind of decision analysis that should be discussed more. The "new is always better" bias in property forums ignores the very real advantages of established localities. MVP Colony has a track record of value stability. Even in 2008 and 2013 when Indian real estate broadly corrected, MVP Colony values barely moved.`, daysAfter: 2 },
      { userName: 'Padma Rao Vizag',    content: `My parents have lived in MVP Colony for 22 years and would not move for anything. The community there has a settled, safe character that takes decades to build. For families — especially those with elderly members — this social stability is not a minor factor.`, daysAfter: 5 },
      { userName: 'Rajesh Kumar Naidu', content: `The negotiation from ₹92 to ₹84 lakh is a genuinely good result for MVP Colony. Sellers there rarely need to sell in distress so the usual trick of lowballing doesn't work. Being a serious, pre-approved buyer with bank sanction in hand is what gets sellers to negotiate. Good strategy.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Venkata Subbarao',  score: 5, review: 'MVP Colony resale is the most rational housing decision in Vizag for families. Instant livability, proven location, negotiable pricing. Outstanding choice.' },
      { userName: 'Srinivas Murthy V', score: 4, review: 'Established locality resale beats outskirts new construction for end-users. MVP Colony specifically is Vizag\'s gold standard for livability.' },
    ],
  },

  // ── VADODARA ───────────────────────────────────────────────────────────────
  {
    citySlug: 'vadodara',
    propertyName: 'Goyal My Home Vadodara',
    propertyType: 'APARTMENT',
    address: 'Gotri Road, Vadodara 390021',
    developerName: 'Goyal Group',
    developerSlug: 'goyal-group',
    priceMin: 6500000, priceMax: 12000000,
    topic: {
      userName: 'Bharat Trivedi',
      title: 'Goyal My Home Gotri Road Vadodara — one year of living here, complete honest review',
      description: `I purchased a 3BHK in Goyal My Home on Gotri Road in early 2023 and have now completed over a year of living here. This is the review I would have wanted to read before I booked — not a marketing write-up but an owner's account of what the day-to-day reality is.

Goyal Group has been building in Vadodara for three decades and that longevity shows in how they approach projects. They don't just build and disappear. Their post-possession maintenance team is reachable. Issues raised in the society WhatsApp group (which has a Goyal representative) get acknowledged within 24 hours. This responsiveness is not universal in Vadodara real estate and I appreciate it more with every passing month.

Construction quality: genuinely above the Vadodara market average for this price point. The tiling work has no hollow spots — I checked every room systematically with a coin tap test. Bathroom fittings are Cera brand. Electrical wiring is done properly — no signs of overloaded circuits in a year of normal use. Window quality is good — aluminium frames with proper rain sealing that was tested in the 2023 monsoon without a single leak.

Gotri Road itself: the location is what makes this project premium in Vadodara. Equidistant from the airport (12 km), Baroda Medical College Hospital (3 km), Alkapuri commercial area (5 km). The MS University campus ecosystem — restaurants, stationery, coaching institutes — makes the neighbourhood feel young and functional. Mature tree cover on Gotri Road gives you shade that newer developments genuinely lack.

Water supply: municipal connection plus borewell backup. During the 2024 summer water crisis in parts of Vadodara, our building had zero water shortage days — the borewell capacity was adequately sized. This is a Goyal operational detail that many buyers don't think to ask about.

If I were buying today, I would buy here again.`,
      daysAgo: 15,
    },
    comments: [
      { userName: 'Minal Thakkar',      content: `This kind of owner review after a year of living is exactly what this forum needs. The coin tap test for tiles is a technique more buyers should know — it takes 15 minutes and reveals a lot about construction honesty. The fact that your building passed a 2024 summer water test is meaningful — Vadodara summers are genuinely harsh.`, daysAfter: 1 },
      { userName: 'Pravin Joshi Baroda', content: `Gotri Road address carries genuine value in Baroda's social hierarchy — it sits alongside Alkapuri and Race Course Road as addresses that signal a certain arrival. But unlike those areas which are fully built out, Gotri Road still has some new quality development happening. You bought at the right time.`, daysAfter: 4 },
      { userName: 'Hetal Patel Baroda',  content: `The 24-hour response time from builder's representative is remarkable. My experience with a different Baroda developer was polar opposite — issues would go unanswered for weeks. Good society management from the beginning sets a positive precedent that the resident RWA can build on.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Bharat Trivedi',     score: 5, review: 'Year-one verdict: excellent decision. Goyal quality is real, Gotri location is premium, responsive maintenance. Will recommend to everyone looking in Vadodara.' },
      { userName: 'Pravin Joshi Baroda', score: 5, review: 'Goyal Group sets the standard in Baroda real estate. Three decades of reputation doesn\'t lie. Best quality product at this price in Vadodara.' },
    ],
  },
  {
    citySlug: 'vadodara',
    propertyName: 'Nilamber Midori',
    propertyType: 'APARTMENT',
    address: 'Gotri-Vasna Road, Vadodara 390015',
    developerName: 'Nilamber Builders',
    developerSlug: 'nilamber-builders',
    priceMin: 4800000, priceMax: 8500000,
    topic: {
      userName: 'Minal Thakkar',
      title: 'Nilamber Midori Vadodara — green concept housing, does it deliver on the promise?',
      description: `Nilamber Midori has been marketing itself as Vadodara's green concept residential project. I was initially sceptical — "green concept" is used liberally by developers who plant a few bushes and call it sustainable living. So I spent considerable effort investigating whether Midori actually delivers.

Nilamber Builders has been building in Gujarat since the late 1980s — Rajkot, Surat, and Vadodara are their primary markets. They are not headquartered in Ahmedabad or Pune; this is a genuinely Gujarat-rooted developer who understands the local climate, construction requirements, and buyer expectations. Their completed projects in Vadodara — Nilamber Parishkaar, Nilamber Bellissimo — have residents who are satisfied. I visited both these projects and spoke to residents before considering Midori.

The green credentials at Midori that I verified: 52% open area ratio (the RERA document confirms this — not a marketing claim), rainwater harvesting system for the building (capacity sufficient for 3 months if borewell also fails), cross ventilation designed into the floor plans (every flat has openings on at least two sides), and LED lighting in all common areas with timer control. These are measurable, not aspirational.

Floor plans: the 2BHK at 1,020 sqft is well-proportioned with good natural light. Bedrooms are sized for a double bed plus wardrobe plus study table — not squeezed. The living room faces north-west which in Vadodara's summer context is the preferred orientation for afternoon heat management.

The interior access road to Midori is slightly winding — this is because the project preserved some existing trees on the plot boundary by routing the road around them. Minor inconvenience, but I respect the choice.

Pricing at ₹48-85 lakh is around 15% below Goyal for comparable sizes. This is the Nilamber "no fancy marketing, just product" positioning. Entirely appropriate for buyers who have done their homework.`,
      daysAgo: 48,
    },
    comments: [
      { userName: 'Bharat Trivedi',     content: `The 52% open area RERA verification is exactly the kind of fact-checking more buyers should do. Marketing materials can claim anything but the RERA document open area ratio is legally binding. The fact that Nilamber's claim checks out says something about their honesty.`, daysAfter: 3 },
      { userName: 'Hetal Patel Baroda',  content: `Cross ventilation in every flat is a feature that is disappearing from Vadodara new construction as plot prices rise and developers maximise unit count. Midori preserving this is a quality-of-life advantage that buyers will appreciate every summer for the next 30 years.`, daysAfter: 6 },
      { userName: 'Chetan Doshi Baroda', content: `I visited this project and ultimately chose elsewhere for location reasons — I needed to be closer to Alkapuri for my office. But the Nilamber team's transparency was impressive. They showed RERA docs without prompting, offered to connect me with residents of past projects, and did not use any pressure tactics. I would consider them for a future purchase.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Minal Thakkar',      score: 4, review: 'Green credentials are real, not marketing. Nilamber is a transparent, quality-focused Gujarat developer. Strong value vs Goyal for buyers who don\'t need main-road frontage.' },
      { userName: 'Chetan Doshi Baroda', score: 4, review: 'Honest developer, verified green claims, good floor plans. The access road quirk is a minor trade-off for a genuine product.' },
    ],
  },
  {
    citySlug: 'vadodara',
    propertyName: 'Sangath Prime Bhayli',
    propertyType: 'APARTMENT',
    address: 'Bhayli, Vadodara 391410',
    developerName: 'Sangath Group',
    developerSlug: 'sangath-group',
    priceMin: 3500000, priceMax: 6000000,
    topic: {
      userName: 'Pravin Joshi Baroda',
      title: 'Sangath Prime Bhayli Vadodara — affordable without being cheap, my research',
      description: `When your budget is ₹40-50 lakh in Vadodara, the options narrow quickly. Either you look at smaller developers with limited track records, or you look at established areas that are under-appreciated. Sangath Prime in Bhayli hits a middle path that I found compelling after extensive comparison.

Bhayli is on Vadodara's eastern side — National Highway access toward Anand and the Vadodara-Ahmedabad Expressway is straightforward. The GIDC industrial cluster in this direction means a steady employment base for rental demand. This is not aspirational demand — there are actual workers, supervisors, and mid-management professionals employed in GIDC companies who need housing in this zone.

Sangath Group has been building in Gujarat for about 20 years — they are not Goyal or Nilamber in terms of brand recognition but they have completed a substantial number of projects across Vadodara and Anand without significant RERA complaints. I checked the Gujarat RERA portal specifically and found no outstanding cases against Sangath as of my research date.

The project offers 2BHK starting at ₹38 lakh and 3BHK up to ₹55 lakh. At these prices, what can you expect? Vitrified tile flooring (not marble), standard sanitary ware (not branded Cera/Hindware), functional modular kitchen framework. What you should not expect: branded fittings, infinity pools, rooftop gardens. What you do get is a proper RERA-registered, structurally sound apartment in a growing area from a builder who will actually build and hand over.

For first-time buyers who cannot stretch to ₹65-80 lakh Gotri Road pricing, Sangath Prime Bhayli is an honest market solution. The investment logic is also sound — Bhayli has appreciated 18-22% over three years and this trajectory will continue as the expressway access improves.`,
      daysAgo: 62,
    },
    comments: [
      { userName: 'Bharat Trivedi',    content: `The GIDC employment base for rental demand is an underappreciated factor in Bhayli. When I was looking at this area 3 years ago the rental yields were already at 3.2% on comparable properties. With more industrial development since, I expect this has improved. Solid investment logic.`, daysAfter: 2 },
      { userName: 'Minal Thakkar',     content: `The honest expectation-setting on finishes is valuable. So many buyers get frustrated because they expected Gotri Road quality at Bhayli prices. The product is what it is — a functional, affordable apartment from a credible builder. Neither oversell nor undersell.`, daysAfter: 5 },
      { userName: 'Hetal Patel Baroda', content: `My colleague bought at a Sangath project in Anand 4 years ago. Delivery was 5 months late, but quality was as represented. He's satisfied. The 5-month delay in Indian real estate for a project of this scale is actually quite acceptable.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Pravin Joshi Baroda', score: 4, review: 'Best affordable choice in Vadodara currently. Sangath delivers what they promise. GIDC rental demand makes this a solid investment too.' },
      { userName: 'Minal Thakkar',       score: 3, review: 'Good for budget buyers who set expectations correctly. Credible builder, growing area, fair pricing.' },
    ],
  },
  {
    citySlug: 'vadodara',
    propertyName: 'Parmeshwar Platina Maneja',
    propertyType: 'APARTMENT',
    address: 'Maneja, Vadodara 390013',
    developerName: 'Parmeshwar Group',
    developerSlug: 'parmeshwar-group',
    priceMin: 4800000, priceMax: 8000000,
    topic: {
      userName: 'Hetal Patel Baroda',
      title: 'Parmeshwar Platina Maneja Vadodara — expressway access, RERA compliant, site visit report',
      description: `I shortlisted Parmeshwar Platina in Maneja after systematic elimination. My criteria were: RERA registered with clean status, active construction visible, Vadodara-Ahmedabad Expressway access within 10 minutes, and 2BHK under ₹60 lakh. Platina met all four and I want to explain why Maneja specifically is now a serious residential address in Vadodara.

Five years ago Maneja was industrial-outskirts. The expressway has changed this completely. Professionals who commute between Vadodara and Ahmedabad — a genuinely common pattern in Gujarat business — now find Maneja dramatically more practical than living in central Vadodara. The expressway cuts the Vadodara-Ahmedabad commute to 45-50 minutes on a clear day. Several Ahmedabad-headquartered companies have Vadodara liaison offices and the reverse is common. Maneja sits at this commuter sweet spot.

The RERA verification I did personally: I downloaded the RERA registration certificate from the Gujarat RERA portal, cross-checked the project plan against what was shown to me in the sales office, and confirmed that the promoter is the same entity named in RERA. I also noted the quarterly updates that had been filed — they were current, which is itself a sign of compliance seriousness.

Parmeshwar Group is not a large developer — 4 completed projects in Vadodara — but what they have completed looks good. I visited their Parmeshwar Elegance project in Maneja (their previous work in the same area) and spoke with three residents. Two were very satisfied; one mentioned a 6-month delay in possession but was otherwise fine with the quality.

Floor plan at Platina: the 2BHK at 1,080 sqft has an efficient layout — no wasted corridor, separate wet and dry areas in the kitchen. The master bedroom allows a king bed plus wardrobe on both walls. For ₹55 lakh this is appropriate space for a couple or small family.

Possession: mid-2026 as promised. Current construction is at floor 8 of 14 which looks on schedule given the launch date.`,
      daysAgo: 25,
    },
    comments: [
      { userName: 'Bharat Trivedi',    content: `The RERA verification process you described is exactly right. Most buyers just ask the sales person if it's RERA registered and take their word. Actually downloading the certificate and checking the filed quarterly reports — that's proper due diligence and exactly what RERA is designed to enable.`, daysAfter: 3 },
      { userName: 'Chetan Doshi Baroda', content: `Maneja expressway position is very practical for Baroda-Ahmedabad commuters. I have a friend who lives there and works in Ahmedabad. His commute via expressway is genuinely 50 minutes to Maninagar in Ahmedabad. For this use case Maneja is arguably better than central Vadodara.`, daysAfter: 6 },
      { userName: 'Pravin Joshi Baroda', content: `Floor 8 of 14 at this stage of construction is a good pace. If they maintain this speed the mid-2026 possession timeline is very achievable. The six-month delay on their previous project brings the expected realistic possession to end-2026 — still acceptable.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Hetal Patel Baroda',  score: 4, review: 'Transparent developer, verified RERA compliance, practical Maneja location. Expressway commuter\'s best option in Vadodara below ₹60 lakh.' },
      { userName: 'Chetan Doshi Baroda', score: 4, review: 'Maneja expressway access is the defining feature. Parmeshwar Group has shown consistency. Good mid-segment choice.' },
    ],
  },
  {
    citySlug: 'vadodara',
    propertyName: 'Alkapuri Resale Options',
    propertyType: 'APARTMENT',
    address: 'Alkapuri, Vadodara 390007',
    developerName: 'Various Builders',
    developerSlug: 'various-builders',
    priceMin: 8500000, priceMax: 20000000,
    topic: {
      userName: 'Chetan Doshi Baroda',
      title: 'Alkapuri Vadodara resale — premium locality guide for serious buyers',
      description: `I spent three months specifically evaluating Alkapuri as a resale market and eventually purchased there. I want to provide a guide to anyone navigating this premium Vadodara locality because it has distinct dynamics that are different from new construction markets elsewhere in the city.

Alkapuri is Vadodara's most central, most prestigious, and most expensive residential address. If you know Vadodara, you know what Alkapuri means — it is the address professionals work their whole careers toward. The reasons are genuine: the road infrastructure, being the original planned residential area of modern Vadodara, gives it connectivity advantages that new townships cannot replicate. Everything is within 15 minutes. The commercial activity, restaurants, hospitals, schools — all clustered in and around Alkapuri.

Resale market dynamics: available inventory is rare. Alkapuri residents have little motivation to sell unless they are upgrading to a bungalow or relocating out of Vadodara permanently. When a unit does come to market, it typically moves within 3-4 weeks at or near asking price. Serious buyers need bank pre-approval ready and must be prepared to decide quickly.

Building age ranges from 15 to 35 years. Older buildings often have better construction quality — thicker RCC slabs, higher ceilings (10-10.5 feet common), larger rooms. But they require more maintenance attention. Inspect specifically for: terrace/roof waterproofing condition (old Baroda buildings suffer from terrace leakage), plumbing pipe condition in older buildings (galvanised pipes may need replacement), and lift condition.

My purchase: 7th floor 3BHK in a 14-year-old building, 1,680 sqft. Asking ₹1.1 crore, negotiated to ₹97 lakh with 3 weeks of patience after having pre-approved home loan from SBI ready. Move-in within 40 days of registration.

For end-users who want Vadodara's best address, Alkapuri resale is the answer. It requires patience and preparation but it delivers an irreplaceable lifestyle.`,
      daysAgo: 20,
    },
    comments: [
      { userName: 'Bharat Trivedi',     content: `The negotiation from ₹1.1 crore to ₹97 lakh is exceptional for Alkapuri. Pre-approved loan in hand is the most underrated negotiation tool in Indian real estate. Sellers trust buyers who have institutional approval — it signals seriousness and removes completion risk.`, daysAfter: 2 },
      { userName: 'Pravin Joshi Baroda', content: `The waterproofing point is critical for older Alkapuri buildings — I've seen terrace seepage ruin upper floor flats in monsoon. Always inspect the terrace yourself if buying on the top two floors, and ideally attend the building during heavy rain before finalising.`, daysAfter: 5 },
      { userName: 'Minal Thakkar',      content: `Alkapuri's irreplaceability is genuine. Three decades of data show this locality holds value like no other in Vadodara. Even in 2008, Alkapuri values barely dipped. For wealth preservation, there is no better Vadodara real estate.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Chetan Doshi Baroda', score: 5, review: 'Alkapuri resale is Vadodara\'s best wealth preservation asset. The lifestyle is irreplaceable. Preparation plus patience is the formula.' },
      { userName: 'Bharat Trivedi',      score: 4, review: 'Premium is fully justified. Alkapuri never disappoints as a long-term hold. The resale market rewards buyers who come prepared.' },
    ],
  },
  {
    citySlug: 'vadodara',
    propertyName: 'Gayatri Greens Waghodia Road',
    propertyType: 'APARTMENT',
    address: 'Waghodia Road, Vadodara 391760',
    developerName: 'Gayatri Infrastructure',
    developerSlug: 'gayatri-infrastructure',
    priceMin: 3800000, priceMax: 6500000,
    topic: {
      userName: 'Pravin Joshi Baroda',
      title: 'Gayatri Greens Waghodia Road Vadodara — new launch assessment, watching or buying?',
      description: `Gayatri Greens is a new launch on Waghodia Road by Gayatri Infrastructure — a local Vadodara developer who has previously delivered two smaller projects. This is their most ambitious project yet in terms of scale: 180 units across four wings, which is a meaningful step up from their earlier 48-unit and 72-unit projects.

Waghodia Road is developing because of two drivers: the PCPIR (Petroleum, Chemicals and Petrochemicals Investment Region) planned development in this direction, and the relative land affordability compared to Gotri or Maneja. Several housing finance companies have pre-approved this area for loan disbursements which is itself a sign of institutional confidence.

The project: 2BHK starting at ₹42 lakh and 3BHK up to ₹60 lakh. Launch response has been reasonable — the developer claims 35% booked in the first six weeks which I tentatively believe because the price-to-location ratio is genuinely attractive. Early bookings get preferred floor and unit selection which drives this initial momentum.

Now for my caution: this is a developer scaling up significantly. Going from 48 units to 180 units in a single project is a construction management challenge. Their track record on smaller projects was decent but larger projects test financial management, contractor coordination, and supply chain in ways that small projects don't. I would want to see the project at 30-40% construction completion before committing my full payment.

RERA registration: confirmed, I downloaded the certificate. Possession promised late 2027, which is a 2.5 year horizon from launch — realistic for a project of this scale if they start immediately.

My current posture: watching. If construction starts actively within the next 3 months and a 10% token amount booking option is available, I would participate at that level. Full payment commitment I would make at 30% construction stage.`,
      daysAgo: 14,
    },
    comments: [
      { userName: 'Hetal Patel Baroda',  content: `The scale-up caution is wise. I've seen several Vadodara developers struggle when they tried to run too many projects simultaneously or jump to a larger scale without adequate capital. Watching the construction start activity and financing arrangements before full commitment is prudent.`, daysAfter: 4 },
      { userName: 'Chetan Doshi Baroda', content: `Waghodia Road PCPIR potential is real but on a slow timeline. The land acquisition for PCPIR has been in process for years. Don't price in PCPIR appreciation in your investment thesis for a 2-3 year horizon. Price it for 5-7 years. If your holding period is shorter, rely on the organic Vadodara growth story.`, daysAfter: 7 },
      { userName: 'Minal Thakkar',      content: `The token amount strategy you described — 10% to secure the booking, remainder at 30% construction — is actually how sophisticated property buyers in Gujarat have been operating post-RERA. It balances early-bird pricing with construction progress verification. Smart approach.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Pravin Joshi Baroda', score: 3, review: 'Promising launch at fair prices. Developer scaling up is the key risk. Token booking strategy at 10% is sensible. Wait for construction progress before full commitment.' },
      { userName: 'Chetan Doshi Baroda', score: 3, review: 'Competitive pricing for the area. PCPIR upside is a long-term story. Waghodia Road organic growth is the near-term case.' },
    ],
  },

  // ── GHAZIABAD ──────────────────────────────────────────────────────────────
  {
    citySlug: 'ghaziabad',
    propertyName: 'Gaur City 14th Avenue',
    propertyType: 'APARTMENT',
    address: 'Crossing Republik, Ghaziabad 201016',
    developerName: 'Gaur Group',
    developerSlug: 'gaur-group',
    priceMin: 6500000, priceMax: 11000000,
    topic: {
      userName: 'Ankit Sharma Ghz',
      title: 'Gaur City 14th Avenue Crossing Republik Ghaziabad — township living, honest owner review',
      description: `I booked a 3BHK in Gaur City 14th Avenue at ₹72 lakh last year. Got possession 2 months ago. This is my first-hand account of the property, the township, and the overall decision quality.

Background on Gaur City: this is the largest privately developed township in NCR's affordable-to-mid segment, built by Gaur Group which has been constructing in this belt since 2008. They have delivered thousands of units across multiple Gaur City phases. The scale matters because it creates an actual community — schools, hospitals, shopping facilities, parks — that functioning townships have and isolated buildings don't.

14th Avenue specifically: the phase is newer, which means the construction benefits from improved quality standards. The earlier Gaur City phases (1-8) had possession issues and quality concerns. By Phase 14, the delivery process is much more organized. My possession happened within the promised 2-month window after OC. The flat was clean, all fittings were in place, no obvious defects on walk-through.

Construction quality: builder grade, which at ₹72 lakh is appropriate. Vitrified flooring, standard bathroom fittings, good electrical wiring. The walls are true (straight) which sounds basic but many Ghaziabad projects have wavy plastering. Ceiling height is 10 feet. The balcony is large — 150 sqft — usable for a sofa and plants.

Township infrastructure: genuinely functional. The Gaur City mall has a supermarket, multiplex, and restaurants operating. The internal roads are maintained. The park areas are watered and maintained by the township authority. There is 24-hour security with CCTV coverage. These are not aspirational claims — I am living with this reality daily.

The metro question: Crossings Republik does not have metro currently. The proposed extension is sanctioned but years from implementation. Daily commuters to Noida or Delhi deal with NH-9 traffic which is manageable post-2-3pm but rough at peak hours. If metro comes this area will re-rate significantly.`,
      daysAgo: 45,
    },
    comments: [
      { userName: 'Nidhi Rastogi',   content: `The possession within promised window for a Gaur project in 2024 is genuinely a positive data point. Earlier phases of Gaur City had delays of 18-36 months. They have clearly improved their delivery management. Your OC-to-possession account is reassuring for anyone evaluating later Gaur phases.`, daysAfter: 2 },
      { userName: 'Vivek Pandey Ghz', content: `Crossings Republik township infrastructure maturity is what distinguishes it from other NCR affordable developments. The difference between a functioning township and a standalone building is enormous in daily quality of life. The grocery, hospital, school ecosystem within Gaur City is now genuinely functional.`, daysAfter: 5 },
      { userName: 'Ritu Agarwal Ghz', content: `The 10 feet ceiling height is something Gaur typically delivers correctly. My concern with their buildings has always been the electrical load capacity — some earlier units had undersized circuits for modern appliances. Have you tried running AC, washing machine, microwave, and geyser simultaneously? Would be good to know if that's been addressed in 14th Avenue.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Ankit Sharma Ghz', score: 4, review: 'Gaur City 14th Avenue delivers what it promises at the price. Township infrastructure is functional. Metro connectivity when arrived will be transformative.' },
      { userName: 'Vivek Pandey Ghz', score: 4, review: 'Best township value in Ghaziabad at this price point. Community infrastructure is mature. Daily livability is genuinely good.' },
    ],
  },
  {
    citySlug: 'ghaziabad',
    propertyName: 'ATS Destinaire',
    propertyType: 'APARTMENT',
    address: 'Crossing Republik, Ghaziabad 201016',
    developerName: 'ATS Group',
    developerSlug: 'ats-group',
    priceMin: 9000000, priceMax: 14000000,
    topic: {
      userName: 'Nidhi Rastogi',
      title: 'ATS Destinaire Crossing Republik — premium NCR product, is the quality gap real?',
      description: `There is a meaningful conversation to be had about whether paying ₹95 lakh-₹1.1 crore for a 3BHK in Crossings Republik is justified when Gaur City offers comparable square footage for ₹70 lakh in the same geography. I investigated this gap and want to share my findings.

ATS Group's quality benchmark in NCR is well-established. Their ATS Kabana in Greater Noida, ATS Le Grandiose in Sector 150 Noida — these are projects that residents describe with genuine satisfaction years after possession. The quality consistency across ATS projects is institutional, not accidental. They have a procurement and quality control system that individual project management cannot easily replicate.

At Destinaire specifically, I did a detailed site visit with a structural engineer friend who works in NCR construction. His observations: RCC grade used in slabs is M25 (above the M20 minimum standard), the column sizing is conservative (meaning there's structural margin beyond what's required), and the brickwork is done with full mortar bed (not partial mortar, which is a common cost-cutting practice). These are details visible to trained eyes that explain why ATS buildings don't develop cracks and seepage issues the way budget projects do.

The amenities package at Destinaire goes beyond typical NCR mid-range: infinity pool (actual infinity edge, not a marketing term for a regular pool at height), sky deck on the 26th floor, co-working space that is properly designed rather than just some tables near the lobby, and a proper senior citizen zone with medical alert system connections. These require ongoing maintenance commitment — ATS societies typically maintain these well because residents pay adequate maintenance charges.

The quality gap is real. Whether it is worth ₹25-30 lakh over Gaur City depends on how you prioritize: for a family where both spouses earn well and lifestyle quality matters, the ATS quality difference is daily and tangible. For a pure investment play, the quality premium is less relevant as long as the underlying asset holds value.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Ankit Sharma Ghz', content: `The structural quality comparison your engineer friend did is the most useful kind of assessment — not looking at the show flat but checking the actual construction methodology. M25 concrete and conservative column sizing are the kinds of details that prevent structural issues 15 years later. This justifies ATS's price premium in a way that no amount of marble flooring can.`, daysAfter: 3 },
      { userName: 'Ritu Agarwal Ghz', content: `The co-working space point resonates with me — post-COVID, work-from-home amenities matter. A properly designed co-working space with stable internet and quiet seating is a daily utility, not a once-a-year amenity like the party hall. ATS understanding this shows they think about how people actually live.`, daysAfter: 6 },
      { userName: 'Vivek Pandey Ghz', content: `ATS Destinaire vs Mahagun Mywoods at similar size — I ran this comparison extensively. ATS wins comprehensively on quality, Mahagun is somewhat cheaper. For families buying as a 10-year+ home, ATS quality makes the gap worth it. For 3-5 year investment holding, Mahagun's lower price makes more sense.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Nidhi Rastogi',    score: 5, review: 'Quality gap between ATS and market is real and structural. Premium is justified for families who will live here for years. Infrastructure quality means lower maintenance costs long-term.' },
      { userName: 'Ankit Sharma Ghz', score: 4, review: 'ATS construction methodology is genuinely superior. Destinaire delivers the quality the brand promises. Best choice in Crossings Republik for end-users.' },
    ],
  },
  {
    citySlug: 'ghaziabad',
    propertyName: 'Mahagun Mywoods',
    propertyType: 'APARTMENT',
    address: 'Crossings Republik, Ghaziabad 201016',
    developerName: 'Mahagun Group',
    developerSlug: 'mahagun-group',
    priceMin: 5000000, priceMax: 9000000,
    topic: {
      userName: 'Vivek Pandey Ghz',
      title: 'Mahagun Mywoods Crossings Republik — two years of living, the complete account',
      description: `Two years ago I bought a 2BHK in Mahagun Mywoods Phase 4 at ₹58 lakh. I've been living here for 20 months. This is the most complete account I can give of what it's actually like.

Mahagun Group has a complicated history. Earlier projects — Mahagun Moderne, Mahagun Mezzaria — had serious RERA complaints and delivery failures. I was aware of this and specifically chose Phase 4 and 5 of Mywoods because these phases had progressed well by the time I was buying. The delivery problems of earlier Mahagun projects happened when the developer was financially stretched; by 2022-23 their Mywoods phases had stabilized with better funding through buyer payments from earlier phases.

The 20 months on-ground experience: day-to-day living is genuinely comfortable. The park area inside the compound is large and well-maintained — my daughter uses it every evening. The internal roads are properly lit. Security is 24-hour with functional cameras. The society WhatsApp group is active and the RWA responds to maintenance requests within 48 hours on average.

Construction quality I can now assess from living experience, not just site visit: no seepage after 2 monsoons (the waterproofing was done properly), no cracks in walls or ceiling, electrical load capacity is adequate for AC plus geyser plus appliances simultaneously without tripping. These are the real quality tests that sample flat visits cannot provide.

The limitations: power backup for homes is limited to 500 watts which means one fan and lights during a power cut. If you run a home office or have medical equipment needs, this is insufficient. A generator or inverter addition is recommended. Second, parking allocation is tight — one covered slot per unit and the visitor parking is inadequate for the number of units.

Net assessment: I am glad I bought here. At ₹58 lakh in Crossings Republik two years ago it was fair value, and current market rates suggest appreciation has been around 15-18% which is decent.`,
      daysAgo: 12,
    },
    comments: [
      { userName: 'Ankit Sharma Ghz', content: `The two-monsoon waterproofing test is the most credible quality assessment possible. Your report of zero seepage validates that the construction was done right in Phase 4. This is the kind of specific data point that other Mywoods prospective buyers need — not general impressions.`, daysAfter: 2 },
      { userName: 'Nidhi Rastogi',    content: `The power backup limitation is a genuine Ghaziabad-specific issue. Summer power cuts in this belt can run 4-6 hours in peak heat months. 500 watts won't run an AC, which in June-July temperatures is a real problem. Budget ₹25,000-30,000 for a good inverter+battery setup from day one.`, daysAfter: 5 },
      { userName: 'Ritu Agarwal Ghz', content: `15-18% appreciation in 2 years on ₹58 lakh is around ₹9-10 lakh gain. In absolute terms modest, in annual percentage terms around 8% which is in line with NCR fringe area growth. As metro connectivity approaches this should accelerate. Good timing on the purchase.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Vivek Pandey Ghz', score: 4, review: 'Mahagun Mywoods Phase 4 delivers solid township living at competitive pricing. Address power backup limitation from day one. Genuinely happy two-year resident.' },
      { userName: 'Nidhi Rastogi',    score: 3, review: 'Good township but power backup issue is a real daily concern in NCR summers. Construction quality is fine. Solid mid-range choice.' },
    ],
  },
  {
    citySlug: 'ghaziabad',
    propertyName: 'Raj Nagar Extension Plots',
    propertyType: 'PLOT',
    address: 'Raj Nagar Extension, Ghaziabad 201003',
    developerName: 'Various Developers',
    developerSlug: 'various-developers',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Ritu Agarwal Ghz',
      title: 'Raj Nagar Extension Ghaziabad — plot vs flat, my analysis and final decision',
      description: `I faced a genuine dilemma for eight months: buy a flat in Crossings Republik for ₹60-65 lakh, or buy a plot in Raj Nagar Extension for a similar budget and construct separately. I eventually chose the plot route. Here is my complete analysis.

Raj Nagar Extension is a developing sector on Ghaziabad's western side with multiple plotted colonies approved by GDA (Ghaziabad Development Authority). The area is approximately 8-10 km from NH-9, reasonably connected, with markets, schools, and hospitals already functional. It is not a remote location — this is a developing urban suburb, not agricultural land.

Plot sizes in my evaluation: 50 sqyd plots at ₹30-35 lakh, 60 sqyd at ₹38-45 lakh, 80 sqyd at ₹50-60 lakh. I bought an 80 sqyd plot at ₹57 lakh in a GDA-approved colony with clear title and registered sale deed.

Construction economics: for G+2 (ground plus two floors), construction cost in this area is approximately ₹1,500-1,800 per sqft for decent quality. An 80 sqyd plot gives me 720 sqft per floor. G+2 gives 2,160 sqft total. Construction cost at ₹1,600/sqft = ₹34-35 lakh. Total investment: ₹57 + ₹35 = ₹92 lakh.

What I get: a 3-floor building where I use the ground floor (full unit), and rent out first and second floors. Rental income in Raj Nagar Extension for a proper 2BHK floor: ₹12,000-14,000/month per floor. Two floors = ₹24,000-28,000/month. This effectively covers most of my construction loan EMI.

Versus buying a flat at ₹65 lakh: monthly EMI of approximately ₹57,000 with no rental income from the purchased flat (assuming owner occupancy). My plot+construction model generates ₹24,000 in rental to offset the larger total EMI of ₹80,000 on ₹92 lakh — net outflow of ₹56,000 monthly. Similar monthly cash flow for significantly more asset value and monthly rental income that grows over time.

This calculation drove my decision. The plot route is more complex but financially superior over a 10-year horizon for a buyer who can manage the construction process.`,
      daysAgo: 50,
    },
    comments: [
      { userName: 'Vivek Pandey Ghz', content: `The financial modelling you've done here is excellent and this kind of analysis is rarely discussed on property forums which tend to focus on ready flat comparisons. The rental income offset on a constructed plot is a legitimate wealth-building mechanism that several of my Ghaziabad neighbours have used successfully.`, daysAfter: 3 },
      { userName: 'Ankit Sharma Ghz', content: `Construction loan for plot+construction is worth clarifying for readers: you need to arrange these separately. Plot purchase gets a land loan at 7.5-9% for 15 years. Construction loan is then a home loan on the building at 8.5-9.5%. Some NBFCs offer combined composite loans. Plan the financing before buying the plot.`, daysAfter: 6 },
      { userName: 'Nidhi Rastogi',    content: `The 5-year land holding before construction — are you doing immediate construction or waiting? Land in Raj Nagar Extension has also appreciated and sitting on it for 2-3 years before construction is itself a reasonable strategy if you don't need the rental income immediately.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Ritu Agarwal Ghz', score: 4, review: 'Plot + construction beats flat for long-term wealth creation in Ghaziabad. The rental income model makes the economics work. GDA approved colony title safety.' },
      { userName: 'Vivek Pandey Ghz', score: 4, review: 'Excellent strategy for buyers with construction management bandwidth. The math works over a 10-year horizon. Raj Nagar Extension land appreciation adds to returns.' },
    ],
  },
  {
    citySlug: 'ghaziabad',
    propertyName: 'Eldeco Live By The Greens',
    propertyType: 'APARTMENT',
    address: 'Hapur Road, Ghaziabad 201001',
    developerName: 'Eldeco Group',
    developerSlug: 'eldeco-group',
    priceMin: 6000000, priceMax: 9500000,
    topic: {
      userName: 'Nidhi Rastogi',
      title: 'Eldeco Live By The Greens Ghaziabad — eco-residential, verified claims, site report',
      description: `Eldeco Live By The Greens on Hapur Road Ghaziabad has positioned itself as a green residential project at a price point of ₹65-85 lakh. The Eldeco name carries weight — in UP/Uttarakhand real estate their track record for delivery and quality is among the best in the mid-market segment. But I wanted to verify whether the "greens" branding is substantive or cosmetic.

What I investigated: the RERA filing shows 40% open area ratio — this is the legally committed green space as a percentage of the total plot area. This is above the NCR average of around 30-33% for residential projects. The extra 7-10% translates into noticeably more park space and breathing room between blocks.

The actual greenery: the project uses a landscape consultant, not a basic contractor. The tree planting plan includes native species — Neem, Jamun, Bel, Amla — rather than the fast-growing ornamental trees that many developers use to show green quickly but which provide limited shade over time. Native trees are slower to establish but create lasting value. This choice suggests someone made a deliberate decision about long-term landscape quality.

Eldeco's delivery record in NCR: better than the UP average but not perfect. Their Noida and Lucknow projects have been delivered within 3-9 months of promised date, consistently. In Ghaziabad they have one earlier project — Eldeco Elegance — and the residents I spoke to were satisfied. No major RERA complaints filed.

Water supply caveat: the Hapur Road area has had groundwater issues in parts. I specifically asked the developer about this during the site visit and they showed me a borewell test report indicating adequate yield at their specific plot. Verify this document yourself — don't take my word for it.

Overall assessment: a credible mid-premium project from a trustworthy developer with genuine green area commitment at a competitive price for the quality delivered.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Ankit Sharma Ghz', content: `The native species planting detail is an insightful quality indicator that most buyers would never notice. A developer who chooses Neem over fast ornamentals is making a choice for long-term resident benefit over short-term marketing visual. That's a character indicator.`, daysAfter: 4 },
      { userName: 'Ritu Agarwal Ghz', content: `The groundwater point is critical for Hapur Road area. I know a buyer in a different project on this road who faced tanker dependence for the first 18 months. Seeing the actual borewell test report is the right ask — get a copy and confirm the yield number is adequate for the total unit count in the project.`, daysAfter: 7 },
      { userName: 'Vivek Pandey Ghz', content: `Eldeco's track record in UP is genuinely their best selling point. In a state where builder reliability is a genuine concern, an Eldeco project carries a quality floor that many other developers in the same price range cannot guarantee.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Nidhi Rastogi',    score: 4, review: 'Eldeco credibility plus genuine green area commitment at competitive pricing. Verify borewell water supply documentation. Good choice for eco-conscious buyers.' },
      { userName: 'Ritu Agarwal Ghz', score: 3, review: 'Good developer, good concept. Water supply documentation must be verified personally. Overall a quality mid-premium option on Hapur Road.' },
    ],
  },
  {
    citySlug: 'ghaziabad',
    propertyName: 'Prateek Stylome',
    propertyType: 'APARTMENT',
    address: 'Noida Extension, Ghaziabad 201307',
    developerName: 'Prateek Group',
    developerSlug: 'prateek-group',
    priceMin: 7500000, priceMax: 12000000,
    topic: {
      userName: 'Vivek Pandey Ghz',
      title: 'Prateek Stylome Noida Extension — metro proximity bet, what the numbers say',
      description: `Prateek Stylome sits in Noida Extension — technically part of Greater Noida West but addressed under Ghaziabad district in some records. This boundary technicality matters less than the fundamental location story: proximity to the approved metro extension that will connect this area to the Delhi metro network.

Prateek Group has a specific history I investigated: their Prateek Wisteria project, completed in the same general area, is now a functioning community and residents I spoke to rated it well for construction quality and society management. The developer did not abandon the project or take shortcuts post-booking. That pattern of behavior is what I rely on more than any marketing material.

Stylome is priced at ₹85 lakh to ₹1.1 crore for 3BHK units of 1,750-2,000 sqft. This is premium for Noida Extension / Ghaziabad but the floor plans justify it — these are genuinely large apartments, not padded with unusable passages. The sample flat showed a 3BHK where all three bedrooms can accommodate a double bed plus wardrobe plus movement space. The kitchen is a working kitchen, not a narrow galley. The living room is large enough for an actual sofa arrangement, not just a love seat.

The metro analysis: the Aqua Line extension (Noida – Greater Noida) is now moving into the Greater Noida West extension planning. The timeline has been pushed multiple times but the political and economic logic for this metro extension is strong — this corridor has hundreds of thousands of residents who need connectivity. The project is funded and planned; execution timelines are the uncertainty.

Current without metro: commute to Noida Sector 18 is 30-40 minutes by car on a clear day, 60+ minutes in peak traffic. With metro: 20 minutes. This delta is what makes the metro a transformative event for property values in this belt.

If your investment horizon is 5+ years, buying Prateek Stylome now and holding through metro completion is a high-conviction position. If your horizon is 2-3 years, the metro timeline uncertainty is too high.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Ankit Sharma Ghz', content: `Prateek Wisteria resident satisfaction data you mentioned is the most relevant precedent for evaluating Stylome. Same developer, same general area, similar product — if Wisteria delivered, Stylome likely will. I visited Wisteria last year. Construction quality was above the area average. Maintenance is society-managed and functional.`, daysAfter: 2 },
      { userName: 'Nidhi Rastogi',    content: `The metro timeline caveat is honest and important. The Noida Extension extension has been "coming soon" for several years. I wouldn't bet on it arriving before 2028-29 at the earliest. If your financial plan requires metro by 2026, it will likely disappoint. If 2029 works, the probability is much higher.`, daysAfter: 6 },
      { userName: 'Ritu Agarwal Ghz', content: `₹85 lakh for 1,750 sqft 3BHK is actually excellent per-sqft value for a Prateek product in this area. Compare to ATS Destinaire at similar sqft for ₹95-100 lakh — Prateek gives you 10-15% more space for less money. Quality gap exists but is narrower than the price gap suggests.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Vivek Pandey Ghz', score: 4, review: 'Prateek quality is consistent and Stylome delivers it at competitive price. Metro is the catalyst that will re-rate this investment. 5+ year horizon recommended.' },
      { userName: 'Ankit Sharma Ghz', score: 5, review: 'Best value per sqft in the area from a credible developer. Metro timing is uncertain but inevitable. Buy now before it arrives.' },
    ],
  },
]

async function main() {
  console.log('\n🏙️  Seed Part E — Visakhapatnam + Vadodara + Ghaziabad\n')
  const hash = await bcrypt.hash('Forum@2024!', 10)

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

  let topics = 0, comments = 0, ratings = 0
  for (const prop of PROPS) {
    const city = await prisma.city.findUnique({ where: { slug: prop.citySlug } })
    if (!city) { console.warn(`  ⚠ city not found: ${prop.citySlug}`); continue }

    const base = toSlug(prop.propertyName); let slug = base, n = 0
    while (await prisma.topic.findUnique({ where: { cityId_slug: { cityId: city.id, slug } } })) slug = `${base}-${++n}`

    const authorId = userMap[prop.topic.userName]
    if (!authorId) { console.warn(`  ⚠ user not found: ${prop.topic.userName}`); continue }

    const td = rDate(prop.topic.daysAgo, prop.topic.daysAgo - 1)
    const topic = await prisma.topic.create({
      data: {
        cityId: city.id, userId: authorId, title: prop.topic.title, slug,
        propertyName: prop.propertyName, propertyType: prop.propertyType as any,
        description: prop.topic.description, address: prop.address,
        priceMin: prop.priceMin, priceMax: prop.priceMax,
        developerName: prop.developerName || null, developerSlug: prop.developerSlug || null,
        isPublished: true, createdAt: td, updatedAt: td,
      },
    })
    topics++

    for (const c of prop.comments) {
      const uid = userMap[c.userName]; if (!uid) continue
      const d = new Date(td.getTime() + c.daysAfter * 86400000)
      await prisma.comment.create({ data: { topicId: topic.id, userId: uid, content: c.content, createdAt: d, updatedAt: d } })
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
    console.log(`  ✓ [${prop.citySlug}] ${prop.propertyName}`)
  }
  console.log(`\n✅ Part E done — topics:${topics} comments:${comments} ratings:${ratings}\n`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
