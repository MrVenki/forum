// Tier 1 Part D — Nagpur (7) + Indore (6) + Bhopal (7)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  { name: 'Amol Deshmukh',      email: 'amol.deshmukh.ngp@gmail.com' },
  { name: 'Priya Raut',         email: 'priya.raut.ngp@gmail.com' },
  { name: 'Vinayak Ingle',      email: 'vinayak.ingle.ngp@gmail.com' },
  { name: 'Sneha Bhagat',       email: 'sneha.bhagat.ngp@gmail.com' },
  { name: 'Rajendra Patidar',   email: 'rajendra.patidar.ind@gmail.com' },
  { name: 'Sunita Malviya',     email: 'sunita.malviya.ind@gmail.com' },
  { name: 'Dhruv Agrawal',      email: 'dhruv.agrawal.ind@gmail.com' },
  { name: 'Kiran Sharma',       email: 'kiran.sharma.bhp@gmail.com' },
  { name: 'Manoj Tiwari',       email: 'manoj.tiwari.bhp@gmail.com' },
  { name: 'Anita Verma',        email: 'anita.verma.bhp@gmail.com' },
  { name: 'Rohit Saxena',       email: 'rohit.saxena.bhp@gmail.com' },
  { name: 'Deepa Joshi',        email: 'deepa.joshi.bhp@gmail.com' },
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
  // ── NAGPUR ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'nagpur',
    propertyName: 'Aakar La Paloma',
    propertyType: 'APARTMENT',
    address: 'Besa Road, Nagpur 440034',
    developerName: 'Aakar Developers',
    developerSlug: 'aakar-developers',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Amol Deshmukh',
      title: 'Aakar La Paloma Besa Road — mid-premium in growing Nagpur east, worth the bet?',
      description: `Nagpur east has been the story of the last decade and Besa Road specifically has transformed from semi-agricultural land to a proper residential corridor in a remarkably short time. I have been tracking this area since 2019 when I was doing research on Nagpur's expansion corridors, and Aakar La Paloma on Besa Road is one of the projects that genuinely deserves serious evaluation.

Besa Road connects Nagpur's city centre to the MIHAN-SEZ and the new airport's passenger terminal expansion. The MIHAN development — which houses MRO facilities, IT parks, and manufacturing zones — is the single biggest driver of new residential demand in eastern Nagpur. Thousands of professionals working in MIHAN need quality housing within 20-25 minute commute distance, and Besa fits that precisely.

Aakar La Paloma is positioned at the mid-premium point — not budget, not luxury. The project offers 2 and 3 BHK apartments with an honest approach to specifications. The tile quality in the sample flat was Kajaria grade, bathroom fittings were Jaquar, and the lift system is functional and properly sized for the building. No gold-plated promises, no cheap shortcuts either.

The developer Aakar has completed two previous Nagpur projects. Their Besa Heights project, which I visited specifically, is well-maintained two years post-possession. Lift is working, the society fund is properly collected, and the compound is clean. That kind of post-possession functioning is rare enough in Nagpur to be worth calling out.

My concern: Besa Road traffic during peak hours — particularly the Katol Road crossing — can be genuinely bad. The infrastructure is catching up with development but is not there yet. For buyers who will commute daily, the realistic peak-hour commute time to central Nagpur should be part of the decision.`,
      daysAgo: 40,
    },
    comments: [
      { userName: 'Omkar Joshi', content: `The MIHAN employment point is crucial for understanding Nagpur east demand. I know colleagues at Infosys BPO's MIHAN campus who have specifically been looking at Besa and Nari Road options. The commute to MIHAN from Besa is genuine 15-20 minutes on normal days — it works for the IT crowd. Aakar La Paloma fits their budget range too.`, daysAfter: 3 },
      { userName: 'Priya Raut', content: `I visited the site last weekend. One observation — the project has a dedicated security cabin and CCTV coverage at the main gate, which matters for a family where both adults work. The surrounding Besa area is generally safe but the project-level security adds confidence. Small thing but noticed.`, daysAfter: 6 },
      { userName: 'Kedar Bhosale', content: `@Amol bhai, the Katol Road crossing traffic you mentioned is genuine. But I want to add context — the Nagpur Municipal Corporation road widening from Besa to Butibori is partially complete. The section past the crossing has already been widened. The congestion point is a specific 800-metre stretch which is expected to be addressed in the next phase. Not an eternal problem.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Amol Deshmukh', score: 4, review: 'Solid mid-premium product in the right location for MIHAN-era Nagpur growth. Traffic concern is temporary and should not be a dealbreaker.' },
      { userName: 'Omkar Joshi', score: 4, review: 'Perfect positioning for the MIHAN professional demographic. Good specification balance between quality and affordability.' },
      { userName: 'Priya Raut', score: 3, review: 'Good project fundamentals. Security attention and developer track record give confidence for a growing but still-developing area.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Nandanvan Heights',
    propertyType: 'APARTMENT',
    address: 'Nandanvan, Nagpur 440009',
    developerName: 'Nandanvan Realtors',
    developerSlug: 'nandanvan-realtors',
    priceMin: 5500000, priceMax: 10000000,
    topic: {
      userName: 'Shraddha Patil',
      title: 'Nandanvan Heights — Nagpur\'s most established address, how does the project measure up?',
      description: `Anyone who has lived in Nagpur for more than five years knows that Nandanvan is one of the city's most respected residential addresses. Not flashy in the way that Wardha Road's new developments try to be — Nandanvan is established in the way that only decades of quality residential occupancy can create. Tree-lined streets, good neighbours, functioning civic infrastructure, proximity to the city's best schools and hospitals. This is why I chose Nandanvan Heights as my home after fourteen years of renting in various parts of Nagpur.

The project is a highrise development — unusual for the traditionally low-rise Nandanvan character. The developer made an interesting choice here: they have restricted the building height to 12 floors rather than the permissible 20+, specifically to maintain neighbourhood compatibility. That kind of self-restraint in a developer is genuinely rare and reflects an understanding of what makes this address valuable.

I am an upgrade buyer — moving from a 2 BHK flat in Dharampeth to a 3 BHK in Nandanvan. The price jump is real but the reasons are concrete. First, Nandanvan's central Nagpur location means my children's school commute goes from 25 minutes to 8 minutes. Second, the Indora Hospital and Government Medical College are within 10 minutes — critical when you have elderly parents. Third, the social networks in Nandanvan are Nagpur's establishment circles — judges, doctors, senior government officers — and the community quality that implies is tangible.

The apartment specifications at Nandanvan Heights match the premium promise. Italian marble in the living and dining, branded modular kitchen provision, vitrified tiles in bedrooms, and a terrace garden on the top floor that is genuinely beautiful — not a terrace with a few pots but a properly landscaped green space.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Amol Deshmukh', content: `Nandanvan real estate has one characteristic I respect as a market observer — it does not participate in the city-wide boom-bust cycles as dramatically as periphery areas. Values in established Nagpur addresses hold even when the broader market softens. For buyers who are risk-averse about real estate values, the established addresses are where you want to be.`, daysAfter: 2 },
      { userName: 'Vinayak Ingle', content: `The school proximity argument from @Shraddha ji is something my family also weighted heavily. Our son goes to Bhavan's Bhagwandas Purohit Vidyamandir which is walking distance from Nandanvan. Removing 40-50 minutes of daily commute from a school-age child's schedule genuinely improves their quality of life. This kind of location advantage is not measurable in rupees per sqft.`, daysAfter: 5 },
      { userName: 'Manasi Kadam', content: `The 12-floor limit decision by the developer shows rare market wisdom. Nandanvan's premium is partly built on its low-rise character and greenery. A 20-floor tower would have generated more revenue but damaged the address. Keeping height limited protects both the neighbourhood and the project's long-term value proposition. I respect this call.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Shraddha Patil', score: 5, review: 'Nandanvan address is Nagpur\'s finest and this project delivers on the promise. Upgrade buyers who can stretch to this zone should not hesitate.' },
      { userName: 'Vinayak Ingle', score: 5, review: 'School and hospital proximity in the best Nagpur residential neighbourhood. Location advantages are real, lasting, and not captured by per-sqft comparison.' },
      { userName: 'Manasi Kadam', score: 4, review: 'Developer\'s decision to limit height shows genuine understanding of what makes this address valuable. Rare and commendable market wisdom.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Unique Imperia',
    propertyType: 'APARTMENT',
    address: 'Wardha Road, Nagpur 440025',
    developerName: 'Unique Builders Nagpur',
    developerSlug: 'unique-builders-nagpur',
    priceMin: 5000000, priceMax: 9500000,
    topic: {
      userName: 'Kedar Bhosale',
      title: 'Unique Imperia Wardha Road — Nagpur\'s IT corridor, right time to buy?',
      description: `I work in IT and have been in Nagpur's tech sector for eight years. When people talk about Wardha Road as Nagpur's IT corridor, I can confirm from personal experience that this is not marketing hype. The TCS campus, Infosys' MIHAN operations, and dozens of smaller tech firms along this stretch genuinely employ tens of thousands of professionals. The residential demand along this corridor is real and growing.

Unique Imperia is one of the more considered projects on Wardha Road — not the biggest, not the cheapest, but among the better-thought-out options in the mid-premium segment. I spent three visits evaluating it before deciding.

The developer, Unique Builders, is Nagpur-centric which means they understand the local market better than a national brand deploying a generic template. The building placement on the site takes advantage of Wardha Road's east-west orientation to maximise cross-ventilation — a detail that shows someone thought about Nagpur's climate specifically. Nagpur summers are brutal and an apartment with poor ventilation becomes genuinely uncomfortable from April to June.

The 2 BHK at 1050 sqft and 3 BHK at 1450 sqft are properly sized. The kitchen is separate from the dining area — a layout preference that Nagpur buyers consistently cite, and which national developers sometimes miss when they bring Mumbai-style open kitchen concepts.

Wardha Road itself has infrastructure improving. The Metro Phase 2 extension towards the airport will add stations on or near this corridor, which will transform commute options for IT workers. I expect this metro connection to add meaningful appreciation to Wardha Road properties once construction progresses visibly.

One concern: the stretch near MIHAN sees heavy construction and truck traffic that will persist for 3-4 more years. Dust and noise are an ongoing reality. Units positioned away from the main road facing east are significantly more pleasant.`,
      daysAgo: 32,
    },
    comments: [
      { userName: 'Omkar Joshi', content: `The cross-ventilation design point @Kedar ji makes deserves emphasis. I visited Unique Imperia specifically to check the wind direction in the flats on the 8th floor on a summer afternoon. The breeze was genuinely present in the units facing north-east. In Nagpur's climate, this is not a luxury, it is a health necessity for the months before monsoon arrives.`, daysAfter: 3 },
      { userName: 'Sneha Bhagat', content: `I compared Unique Imperia with three other Wardha Road projects. What stood out here: the floor-to-floor height is 3.2 metres versus the standard 2.9 metres in competing projects. In a city where the heat index in May crosses 48 degrees, the extra headroom makes a significant difference to room temperature. Unique has invested in the right places.`, daysAfter: 6 },
      { userName: 'Priya Raut', content: `The metro extension to Wardha Road is the big wildcard for appreciation. In Nagpur, the metro has demonstrably improved prices along Phase 1 (Ajni-Khapri corridor) by 18-25% over construction to operational period. Wardha Road Phase 2 route is confirmed though construction timeline is longer. Long-term buyers should factor this positively.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Kedar Bhosale', score: 4, review: 'Thoughtfully designed for Nagpur\'s specific climate and IT corridor needs. Local developer intelligence shows in the small details that matter daily.' },
      { userName: 'Sneha Bhagat', score: 4, review: '3.2 metre floor height is the right call for Nagpur heat. Metro extension upside makes this a strong medium-term investment on top of solid end-use value.' },
      { userName: 'Omkar Joshi', score: 4, review: 'Ventilation quality verified personally during a summer visit. Developer clearly designed for the climate, not for the render images.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Marvel Hemingway Nagpur',
    propertyType: 'APARTMENT',
    address: 'Manish Nagar, Nagpur 440015',
    developerName: 'Marvel Realtors',
    developerSlug: 'marvel-realtors',
    priceMin: 6500000, priceMax: 13000000,
    topic: {
      userName: 'Vinayak Ingle',
      title: 'Marvel Hemingway Nagpur Manish Nagar — Pune-style premium coming to Nagpur?',
      description: `Marvel Realtors is one of Pune's established luxury developers and Hemingway Nagpur is their attempt to transplant their premium brand and product quality into the Nagpur market. As someone who has worked in Pune for four years before returning to Nagpur, I have personal experience with Marvel's Pune projects and can make a meaningful comparison.

The honest answer to the "Pune-style premium" question is: mostly yes, with some Nagpur-market adaptations. Marvel's signature in Pune is attention to finish quality — material selection, joinery precision, tile alignment, paint coats. These signatures are present in the Nagpur project. The sample flat I saw had wall-to-floor tile alignment that I rarely see in Nagpur developer projects. The ceiling cornices were neatly done. The kitchen counter height was ergonomically correct. These are things that only matter if you live there but matter enormously once you do.

Manish Nagar is one of Nagpur's better-regarded central addresses. Established school ecosystem, good market access, proximity to Orange City Hospital. The community in this neighbourhood is educated and professional — the kind of neighbours who maintain their spaces and participate in society matters.

Marvel Hemingway is priced at 65-130 lakhs — the highest end of the Nagpur mid-premium market. The Pune comparison helps contextualise this: a comparable Marvel product in Pune would cost 2-2.5x as much. Nagpur buyers are getting Pune-quality product at a Nagpur price. That is genuinely good value if you prioritise finish quality.

The caveat: Nagpur's premium market is smaller than Pune's. Resale liquidity at this price point in Nagpur is thinner. This is a strong end-use buy and a reasonable investment if you have 7+ year horizon. Do not expect quick resale at a significant premium.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Shraddha Patil', content: `The tile alignment point is something I verify on every site visit by looking at the grout line consistency. Most Nagpur developers' grout lines are irregular because they are not using experienced tilers. Marvel's sample flat had perfectly consistent 3mm grout lines throughout — this is only possible with skilled labour and quality supervision. The finish quality claim is real.`, daysAfter: 2 },
      { userName: 'Kedar Bhosale', content: `My Pune-based colleague came to visit and was surprised that a comparable Marvel product was available in Nagpur at roughly half the Pune price. He said if he had not committed to Pune he would have considered Nagpur seriously at these valuations. The relative value argument for Nagpur premium real estate versus Pune/Mumbai is genuinely compelling for buyers who can be location-flexible.`, daysAfter: 5 },
      { userName: 'Manasi Kadam', content: `I want to raise the post-possession service question. In Nagpur, Marvel is new — they do not have the local maintenance infrastructure that Pune-established developers have built over years. The first 2-3 years of society management will determine whether the Nagpur Marvel project maintains its quality. Worth tracking and perhaps speaking to residents of other builder societies that Marvel manages in Maharashtra before committing.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Vinayak Ingle', score: 4, review: 'Pune-quality finish at Nagpur pricing is genuine value. Strong end-use buy. Long-term investment on 7+ year horizon. Resale liquidity is the only caveat.' },
      { userName: 'Shraddha Patil', score: 5, review: 'Finish quality is the best I have seen in any Nagpur project in this price range. Marvel\'s craftsmanship standards are visibly different.' },
      { userName: 'Kedar Bhosale', score: 4, review: 'Relative value versus Pune pricing is compelling. Nagpur buyers are getting a premium product that would cost significantly more in any other major Maharashtra city.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Godrej Nurture Nagpur',
    propertyType: 'APARTMENT',
    address: 'Hingna Road, Nagpur 440016',
    developerName: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    priceMin: 4000000, priceMax: 8500000,
    topic: {
      userName: 'Sneha Bhagat',
      title: 'Godrej Nurture Hingna Road Nagpur — Godrej brand enters Nagpur, what to expect?',
      description: `Godrej Properties entering Nagpur was significant news in the local real estate market. The city has been dominated by local and regional developers — Unique, Aakar, Nandanvan Realtors — so a national giant like Godrej creates a useful reference point for quality expectations.

I am an IT professional in my late twenties buying my first home. The Godrej brand matters to me because my bank loan process is simpler with a nationally recognised developer — my bank manager told me Godrej gets priority processing and slightly better rate consideration because of their documented track record on RERA compliance and possession history.

Hingna Road has mixed character. The industrial belt on Hingna Road is real — you are not getting the pristine residential atmosphere of Nandanvan or Dharampeth. But Godrej Nurture is positioned at the residential part of Hingna Road, closer to Ring Road, where the industrial character diminishes and the connectivity advantage remains. The Ring Road access to the airport and to Wardha Road IT corridor is the commute advantage.

What Godrej delivers here: their construction methodology is standardised nationally, which means quality consistency. The concrete quality, the structural design, the waterproofing of roofs and external walls — all done to Godrej's documented national standard, not to a local builder's judgment call. The specifications in the sample flat — Kohler sanitary ware, Havells wiring, UPVC windows — are premium tier for Nagpur.

At 40-85 lakhs, Godrej Nurture is not the cheapest option on Hingna Road but the 20-25% premium over local developers is justified by the brand reliability and the practical benefits: bank loan ease, guaranteed RERA compliance, and a developer who will answer your call post-possession.`,
      daysAgo: 18,
    },
    comments: [
      { userName: 'Amol Deshmukh', content: `The bank loan ease point is practical and under-discussed. I have seen first-time buyers struggle to get timely loan approval for local developer projects because banks do extra due diligence on unfamiliar developers. Godrej's pre-approved status with most major banks saves 3-4 weeks in the purchase process and reduces uncertainty for buyers financing their purchase.`, daysAfter: 2 },
      { userName: 'Omkar Joshi', content: `Hingna Road industrialisation concern is valid but I want to contextualise it. The industrial belt is concentrated in the 2-4 km stretch near the MIDC. The Ring Road side where Nurture is located is predominantly residential and commercial with limited heavy industry. Drive the actual route before forming an opinion based on the road's name alone.`, daysAfter: 5 },
      { userName: 'Priya Raut', content: `Godrej's Nurture brand is their more affordable product line compared to Godrej City or Godrej Infinity. It is premium compared to local Nagpur developers but not top-tier Godrej. Understanding this positioning helps set the right expectations. You are getting Godrej's reliability and systems at a below-flagship price — which is actually the sweet spot for practical first-time buyers.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Sneha Bhagat', score: 4, review: 'First home with Godrej brand reliability is the right choice for buyers who value the post-possession support and loan process ease. Premium is justified.' },
      { userName: 'Amol Deshmukh', score: 4, review: 'National brand, RERA compliant, bank-friendly. The process advantages save time and stress that first-time buyers cannot afford to lose.' },
      { userName: 'Omkar Joshi', score: 3, review: 'Good product on an address that needs site visit to properly evaluate. Location concern is overstated but worth verifying personally.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Trimurti Heights',
    propertyType: 'APARTMENT',
    address: 'Dharampeth, Nagpur 440010',
    developerName: 'Trimurti Constructions',
    developerSlug: 'trimurti-constructions',
    priceMin: 8000000, priceMax: 16000000,
    topic: {
      userName: 'Manasi Kadam',
      title: 'Trimurti Heights Dharampeth — Nagpur\'s old prestigious address, the last big ticket option',
      description: `Dharampeth is to Nagpur what Napean Sea Road is to Mumbai or Alipore is to Kolkata — the address that represents the city's established elite. Old money, old families, old trees, and the kind of civic infrastructure that only comes from decades of high-income residents caring about their neighbourhood. Trimurti Heights is one of the very few new residential projects in this zone because land availability in Dharampeth is extraordinarily constrained.

I am a practising doctor at Wockhardt Hospital and I have wanted a Dharampeth address for fifteen years. The reasons are not just social — the practical advantages are concrete. Orange City Hospital, Wockhardt, and Nagpur's best medical infrastructure cluster in and around Dharampeth. The schools — Bhavan's, DPS, Ambika — are within 5-10 minutes. The Sitabuldi market and the established commercial zones are accessible without the traffic chaos of outer Nagpur.

Trimurti Heights is a boutique project — only 32 units across 14 floors. This limited inventory within Dharampeth's essentially zero-development zone is the core value proposition. There will not be another project like this in Dharampeth for the foreseeable future because there is simply no land left. Scarcity in the right location is the most reliable driver of real estate value.

The apartments — 3 BHK of 1800-2200 sqft and a 4 BHK penthouse at 3500 sqft — are designed for the Dharampeth buyer. Italian marble throughout, DG backup for 100% of load, home automation provision, three-tier security system. The interiors reflect Nagpur's version of luxury which tends to be understated and functional rather than the over-designed aesthetic you see in Mumbai luxury projects.

At 80-160 lakhs, this is Nagpur's most expensive residential offer. It is priced correctly for what it is: the rarest residential opportunity in the city's most desirable address.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Shraddha Patil', content: `The 32-unit limit is the key number to absorb. When demand from Nagpur's top professional and business families concentrates on 32 units, the price discovery is always in the seller's favour. I know people who have been waiting for anything to come up in Dharampeth for 5-6 years. The demand pipeline for these units is unlike anything else in Nagpur.`, daysAfter: 2 },
      { userName: 'Kedar Bhosale', content: `@Manasi ji, for investment analysis — Dharampeth properties have historically appreciated at 8-10% annually, significantly above Nagpur's broader market average of 5-6%. The absolute price point is high but the relative return has been consistently above market. Capital preservation with above-average return is as safe as it gets in Nagpur real estate.`, daysAfter: 5 },
      { userName: 'Vinayak Ingle', content: `I want to add a practical note on the DG backup specification — 100% DG backup in Nagpur is not a luxury, it is necessary infrastructure. Nagpur's power cuts during summer peak load can extend to 6-8 hours daily in non-Dharampeth areas. Dharampeth itself gets better supply but even there, 100% DG backup means zero disruption to work-from-home, medical equipment for elderly, and daily life during cuts. This is a genuinely important specification for Nagpur specifically.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Manasi Kadam', score: 5, review: 'Rarest residential opportunity in Nagpur\'s finest address. Boutique inventory with absolute scarcity premium. The right product at the right address for Nagpur\'s established professionals.' },
      { userName: 'Shraddha Patil', score: 5, review: 'Dharampeth demand is deep and the supply of 32 units will be absorbed quickly. No regret purchase for anyone who can manage the price point.' },
      { userName: 'Kedar Bhosale', score: 5, review: 'Consistent 8-10% annual appreciation history in a city where broader market averages 5-6%. Capital safety with above-market return. Textbook premium real estate investment.' },
    ],
  },

  {
    citySlug: 'nagpur',
    propertyName: 'Lunkad Colonnade',
    propertyType: 'APARTMENT',
    address: 'Wathoda Road, Nagpur 440035',
    developerName: 'Lunkad Realtors',
    developerSlug: 'lunkad-realtors',
    priceMin: 3500000, priceMax: 7000000,
    topic: {
      userName: 'Priya Raut',
      title: 'Lunkad Colonnade Wathoda Road — township on Nagpur periphery, growth story or wait?',
      description: `Wathoda Road is the eastern periphery of Nagpur — genuinely peripheral in the sense that five years ago this area was farmland and villages, and today it has a mix of industrial units, planned residential layouts, and projects like Lunkad Colonnade attempting to create township living at the city's edge.

I want to be honest about what buying in Wathoda Road means in 2024. You are making a bet on Nagpur's eastward expansion. The fundamentals supporting this bet: MIHAN is east of the city and the employment it generates creates eastward residential pressure; the Ring Road makes Wathoda Road accessible to the rest of the city; the land cost differential from central Nagpur is significant enough that developers can offer better specifications per rupee.

Lunkad Realtors is a Pune-based developer expanding to Nagpur. Their Pune projects — I researched two of them in Hadapsar — have been delivered roughly on time with decent quality. The Nagpur project represents their first tier-2 city foray, which means they are being careful about the product to establish their reputation here.

Lunkad Colonnade is a township concept — 12 towers, over 1200 units, amenities including swimming pool, clubhouse, jogging track, and a dedicated commercial zone within the campus. At this scale, the economics of amenities work: the per-unit maintenance cost for a swimming pool across 1200 residents is negligible compared to the same pool for 200 residents.

The challenge: Wathoda Road's social infrastructure is still developing. The nearest established school is 20-25 minutes away. The nearest hospital is a similar distance. For a young family with school-age children, this periphery trade-off is real. For a young professional couple or investors, the trade-off is manageable given the price.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Amol Deshmukh', content: `The Ring Road connectivity point deserves more weight. Nagpur's Ring Road from Wathoda connects to the airport in about 20 minutes — this is actually faster than from some central Nagpur locations stuck in city traffic. For business travellers and NRI buyers, the airport accessibility is a genuine plus that is not reflected in the land pricing yet.`, daysAfter: 3 },
      { userName: 'Vinayak Ingle', content: `The 1200-unit scale has investment implications worth understanding. Large township projects in Nagpur's periphery have historically shown slow initial appreciation followed by step-function increases when the social infrastructure (schools, hospitals) catches up. The patience horizon is 5-8 years. Investors who understand this pattern buy early, accept slow initial years, and benefit when the area matures.`, daysAfter: 6 },
      { userName: 'Sneha Bhagat', content: `I specifically asked Lunkad about their Pune project delivery record. They shared OC copies for their Hadapsar project which was delivered 4 months ahead of RERA deadline. That is unusual in Indian real estate and worth noting. A developer who can deliver ahead of schedule has a process discipline that is valuable for buyers.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Priya Raut', score: 3, review: 'Good township product on Nagpur\'s growth frontier. Right for investors with 5-8 year patience or young professionals comfortable with periphery trade-offs.' },
      { userName: 'Amol Deshmukh', score: 3, review: 'Ring Road airport connectivity is underappreciated advantage. Land price differential from central Nagpur makes the specifications-per-rupee compelling.' },
      { userName: 'Sneha Bhagat', score: 4, review: 'Pune developer with a documented ahead-of-schedule delivery record. Process discipline is evident and the product quality in sample flats reflects it.' },
    ],
  },

  // ── INDORE ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'indore',
    propertyName: 'Ruchi Life Space',
    propertyType: 'APARTMENT',
    address: 'Bypass Road, Indore 452001',
    developerName: 'Ruchi Realty',
    developerSlug: 'ruchi-realty',
    priceMin: 3800000, priceMax: 7500000,
    topic: {
      userName: 'Rajendra Patidar',
      title: 'Ruchi Life Space Bypass Road Indore — large township on main bypass, honest review',
      description: `Indore's Bypass Road is the city's most important arterial connector — it links the Agra-Mumbai highway, the Delhi-Mumbai Expressway access, and effectively circles the commercial and industrial zones of the city. Real estate along this stretch serves a very specific buyer: people whose lives revolve around the commercial-industrial ecosystem that the bypass enables.

I am a transport business owner — I have six trucks and my daily operations take me along the bypass at least twice. Ruchi Life Space's location means my office, my godowns, and my home are all within a 15-minute corridor. That functional logic is why I am here.

Ruchi Realty is an established Indore developer. Not a national brand but Indore-specific with real track record. Their completed projects — Life Towers in Navlakha, Life Square near Vijay Nagar — are maintained properly and the builders have a reputation for not making promises they cannot keep. In Indore's local developer ecosystem, Ruchi is considered reliable.

Ruchi Life Space is a large township — 20 acres, multiple towers, a commercial zone, and extensive green areas. At this scale, the amenities are properly resourced. The clubhouse is not a token room with a TT table — it has a proper gym, a swimming pool of Olympic training dimensions, and a dedicated children's area. The commercial zone within the township has a pharmacy, a grocery, and food outlets that are already operational — the township is not waiting for the residential fill-up to develop its retail.

The 2 BHK at 38-50 lakhs and 3 BHK at 55-75 lakhs is honest pricing for Bypass Road. This is not Vijay Nagar premium territory — the bypass location is commercial-adjacent and pricing reflects that. For buyers who need bypass connectivity, this is the right trade-off.`,
      daysAgo: 48,
    },
    comments: [
      { userName: 'Prakash Jain', content: `Indore's Bypass Road has excellent commercial utility but the residential question is about what happens during the evening and night. The heavy commercial traffic on the bypass reduces significantly after 9-10pm. The Ruchi Life Space internal roads are separate from the bypass traffic. From inside the township, the bypass presence is less intrusive than you might imagine from looking at a map.`, daysAfter: 3 },
      { userName: 'Sunita Malviya', content: `The operational commercial zone within the township is something I specifically verified before my parents considered booking here. Too many Indore townships promise commercial facilities that materialise only 3-4 years after first possession. Ruchi Life Space already has a pharmacy, a grocery (Jai Bharat), and a dhaba. My parents — both in their 60s — can manage daily needs without a car. This matters enormously for senior buyers.`, daysAfter: 6 },
      { userName: 'Dhruv Agrawal', content: `Investment perspective: the Bypass Road is being upgraded as part of the Delhi-Mumbai Industrial Corridor infrastructure improvements. Land along the upgraded bypass has appreciated strongly in comparable cities along this corridor (Surat, Vadodara). Indore's bypass upgrading is creating similar pressure. Bypass Road properties at current pricing may look conservative in 4-5 years.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Rajendra Patidar', score: 4, review: 'Perfect functional location for bypass-dependent businesses. Ruchi track record is genuine. Operational amenities set this apart from township projects that promise and delay.' },
      { userName: 'Sunita Malviya', score: 4, review: 'Operational commercial zone within township is the decisive factor for senior buyers. Parents can be independent here from day one of possession.' },
      { userName: 'Dhruv Agrawal', score: 4, review: 'DMIC corridor infrastructure upgrades make Bypass Road a medium-term investment story. Current pricing has not fully reflected this upside.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'Agrawal Siddhi Vinayak',
    propertyType: 'APARTMENT',
    address: 'MR-10 Scheme 140, Indore 452010',
    developerName: 'Agrawal Builders Indore',
    developerSlug: 'agrawal-builders-indore',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Sunita Malviya',
      title: 'Agrawal Siddhi Vinayak MR-10 Scheme 140 — Vijay Nagar adjacent, best value in this zone?',
      description: `Vijay Nagar is Indore's commercial and residential heart. The area has everything — malls, hospitals, schools of national repute, restaurants, and a social energy that no other Indore neighbourhood can match. Properties inside Vijay Nagar proper are increasingly unaffordable for middle-class buyers. MR-10 Scheme 140, which is directly adjacent to Vijay Nagar, has become the practical alternative.

I am a school principal and my school is in Vijay Nagar. Living in MR-10 Scheme 140 means my commute to work is 8 minutes. The access to Vijay Nagar's commercial ecosystem — Big Bazaar, Bombay Hospital, the multiplexes — is equally accessible from Scheme 140 as from the core area. The address is technically different but practically equivalent for daily living.

Agrawal Siddhi Vinayak is a well-regarded local project in this zone. Agrawal Builders has multiple completed projects in Indore. Their Siddhi Sadan project in Rajendra Nagar, which I visited to verify quality, is well-maintained seven years post-completion. The lifts are original and serviced, the external paint is being done for the second time now, and the RWA is functional. This post-possession quality is what I look for in any developer evaluation.

The apartment configuration at Siddhi Vinayak — 2 BHK from 950 sqft and 3 BHK from 1350 sqft — is well-suited to Indore's typical buyer profile. The rooms are spacious relative to the sqft count because there are no wasted passages or awkward shapes. The kitchen, specifically, is a working Indian kitchen with proper ventilation shaft and a window — not the token windowless kitchens you see in newer projects optimising for look over functionality.

At 45-90 lakhs for the Vijay Nagar-adjacent zone, this represents genuine value. Core Vijay Nagar apartments at similar specification would be 65-110 lakhs. The 20-25% saving by being 5 minutes away is real money.`,
      daysAgo: 62,
    },
    comments: [
      { userName: 'Prakash Jain', content: `MR-10 Scheme 140 is a planned area — the road widths are proper, the utility infrastructure was laid correctly from the beginning. This is not an ad-hoc colony that grew without planning. The result: water supply is consistent, drainage works, and the road quality has lasted. These infrastructure basics are often overlooked in excitement over project specifications.`, daysAfter: 3 },
      { userName: 'Rajendra Patidar', content: `@Sunita ji, the kitchen window point is important. In Indore's summer when you are cooking and the temperature outside is 44 degrees, a kitchen with a proper window and natural ventilation is the difference between a functional cooking space and an oven. Agrawal's decision to maintain this practical feature rather than adopt the open-kitchen trend reflects good sense about who actually lives in their projects.`, daysAfter: 6 },
      { userName: 'Dhruv Agrawal', content: `For investment angle: MR-10 Scheme 140 properties track Vijay Nagar appreciation with a lag of 6-12 months. When Vijay Nagar rises 10%, Scheme 140 follows at 7-8% within the year. This makes the adjacent zone a leveraged play on Vijay Nagar growth at a lower entry price. Has been consistent for the last decade of Indore real estate history.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Sunita Malviya', score: 4, review: 'Vijay Nagar equivalent functionality at a 20-25% discount. Agrawal post-possession track record verified. Practical kitchen design shows builder\'s connection to actual users.' },
      { userName: 'Prakash Jain', score: 4, review: 'Planned zone infrastructure is a long-term advantage. Road and utility quality in Scheme 140 outlasts ad-hoc colony alternatives.' },
      { userName: 'Dhruv Agrawal', score: 4, review: 'Consistent appreciation track record tracking Vijay Nagar. Good entry point for buyers who want established zone exposure at adjacent-zone pricing.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'Omaxe City Indore',
    propertyType: 'APARTMENT',
    address: 'Pipliyahana, Indore 452016',
    developerName: 'Omaxe Limited',
    developerSlug: 'omaxe-limited',
    priceMin: 4000000, priceMax: 8000000,
    topic: {
      userName: 'Dhruv Agrawal',
      title: 'Omaxe City Indore Pipliyahana — integrated township, years in and what\'s the reality?',
      description: `Omaxe City Indore is not a new launch — it has been under various stages of development for several years and there are already residents in the earlier completed phases. This makes it one of the few large Indore projects where you can evaluate reality rather than promises. I have visited the site twice, spoken with four current residents, and done detailed secondary research before forming my opinion.

The township scale is real. Omaxe has delivered schools within the campus (DPS is operational there), a hospital has come up, and the commercial zone has functional shops and restaurants. This is the integrated township promise that most developers make and fail to deliver — Omaxe has partially delivered it, which is significantly better than average.

The earlier phase residents I spoke to had mixed feedback. Phase 1 buyers (who bought 8-10 years ago) have seen good appreciation — the project has matured and the township is becoming established. Phase 3 and 4 buyers who bought more recently are in a waiting phase — their blocks are nearing completion but the township facilities they were promised in their phase are 2-3 years away. This is the classic integrated township sequencing problem: the township gets better over time but you might have to live through the construction phase before the full promise materialises.

Current pricing at 40-80 lakhs for ongoing phases is reasonable for what you are getting. The township location in Pipliyahana has good connectivity — it is not remote. The AB Road is accessible, the airport is 30 minutes.

My recommendation: buy in a phase that is at least structurally complete. The risk-reward of buying in very early phases of large Omaxe townships has been studied across India and the pattern is consistent — early buyers face construction chaos and delayed phase-specific amenities. Buy once you can see walls standing.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Sunita Malviya', content: `The DPS operational within the campus is the biggest selling point for families. In Indore, DPS has only one campus and this is it. Parents pay significant premium to live within walking distance of a school of this calibre. Omaxe City gives you that proximity — this is not a small benefit, it is potentially ₹20-30 lakhs worth of annual school transport and time saving over a school career.`, daysAfter: 2 },
      { userName: 'Rajendra Patidar', content: `I know a family in Phase 1 — they bought in 2015 and have seen their property value roughly triple. The township is now fully functional in the early phases. The lesson from their experience: patience rewarded. But you need the financial and psychological capacity to wait through the construction phase years.`, daysAfter: 5 },
      { userName: 'Prakash Jain', content: `For anyone considering Omaxe City: the RERA registration for the current phase has a specific completion date. Check this on the MP RERA website against the current construction progress photos you can find on the project's social media. The gap between promised completion and visible progress tells you a lot about whether the deadline will be met.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Dhruv Agrawal', score: 3, review: 'Integrated township promise is being partially delivered — better than most. Buy in phases with visible progress. DPS within campus is a genuine family differentiator.' },
      { userName: 'Sunita Malviya', score: 4, review: 'DPS within the campus changes the family value calculation significantly. For school-stage families, this single factor justifies the Omaxe City choice.' },
      { userName: 'Rajendra Patidar', score: 3, review: 'Long-term appreciation track record in early phases is strong. Patience is required but the data supports the investment thesis for those who can wait.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'Malwa Residency Vijay Nagar',
    propertyType: 'APARTMENT',
    address: 'Vijay Nagar, Indore 452010',
    developerName: 'Malwa Developers',
    developerSlug: 'malwa-developers',
    priceMin: 6000000, priceMax: 12000000,
    topic: {
      userName: 'Prakash Jain',
      title: 'Malwa Residency Vijay Nagar — Indore\'s premium commercial-residential hub, right to pay this premium?',
      description: `I have been an Indore-based chartered accountant for twenty years and I have watched Vijay Nagar transform from a decent residential area to the city's indisputable commercial and social centre. Today, Vijay Nagar is where Indore's best malls, hospitals, restaurants, coaching institutes, and corporate offices concentrate. The question of whether to pay the Vijay Nagar premium is one my clients ask me regularly.

My answer, having bought in Malwa Residency myself: yes, the premium is justified — but only if you understand what you are paying for. The premium over comparable properties 10 minutes away is roughly 30-40%. That extra money is buying you three things: zero commute cost to Indore's best commercial ecosystem, a social address that carries meaning in the city's business and professional circles, and historically better liquidity when you eventually sell.

Malwa Residency specifically is a boutique development — 24 units in a 7-storey building. The small scale means each resident gets disproportionate attention from the developer and society management. I have a WhatsApp line to the building supervisor. My maintenance requests are addressed within 24 hours. This responsiveness is simply not possible in a 500-unit township.

The apartment design reflects the premium positioning. The 3 BHK at 1600 sqft has been designed by a Pune-based interior architect — the room proportions, the storage planning, the window placement are all thoughtfully done rather than architecturally templated. The master bathroom has a separate shower enclosure and bathtub — this is not standard in Indore even in premium projects.

For Indore's established professional and business families who want the city's best address with boutique-scale maintenance, Malwa Residency is the correct answer.`,
      daysAgo: 45,
    },
    comments: [
      { userName: 'Dhruv Agrawal', content: `The liquidity point CA Jain ji makes is statistically supported. Vijay Nagar properties in Indore sell in 30-45 days on average when correctly priced. Properties in comparable zones on the periphery take 90-150 days. This liquidity advantage has practical value — if you need to sell quickly for any reason, being in the right zone is the difference between a fast clean exit and a prolonged negotiation.`, daysAfter: 3 },
      { userName: 'Sunita Malviya', content: `The 24-unit scale means the society fund is collected from people who are both financially capable and personally invested in the building's quality. I know two residents in Malwa Residency and the society fund has three years of reserves. This is rare — most large societies in Indore run maintenance on a hand-to-mouth basis. Financial preparedness in the society is a real quality-of-life advantage.`, daysAfter: 6 },
      { userName: 'Rajendra Patidar', content: `The Pune-based architect detail is something that shows in the actual flat. The storage wall in the living room — a full-height built-in unit that is structural, not add-on furniture — is the kind of design feature you associate with good residential architects. It saves the resident 1.5-2 lakhs in post-possession furniture costs while looking far better integrated. Small detail, real value.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Prakash Jain', score: 5, review: 'Vijay Nagar premium is justified by the combination of location, liquidity, and boutique-scale maintenance quality. Right product in the right address.' },
      { userName: 'Dhruv Agrawal', score: 5, review: 'Vijay Nagar liquidity advantage is documented. For buyers who value flexibility of eventual exit, the premium location pays for itself.' },
      { userName: 'Sunita Malviya', score: 4, review: 'Three-year society reserve fund is exceptional and reflects the calibre of residents and developer in this boutique building.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'DS Max Serene Super Corridor',
    propertyType: 'APARTMENT',
    address: 'Super Corridor, Indore 452020',
    developerName: 'DS Max Properties',
    developerSlug: 'ds-max-properties',
    priceMin: 3200000, priceMax: 6500000,
    topic: {
      userName: 'Ankita Solanki',
      title: 'DS Max Serene Super Corridor Indore — affordable on the corridor, what\'s the catch?',
      description: `Super Corridor in Indore is the city's planned IT and institutional development zone — IIM Indore, several IT parks, and planned smart city infrastructure are all here. Premium developers like Godrej and Prestige have announced or launched projects on Super Corridor at premium pricing. DS Max Serene positions itself as the affordable alternative on the same corridor.

I am a software engineer at an IT company in Indore's Super Corridor zone. My commute from a rented 2 BHK in Vijay Nagar is 45 minutes each way in peak traffic. DS Max Serene, being on the corridor itself, would reduce my commute to 10 minutes. That commute saving alone — 70 minutes per day, 18 days a month — represents meaningful quality of life improvement that has no rupee equivalent.

DS Max is a Bangalore-based developer with projects across South India and a growing presence in Central India. Their South Indian projects have reasonable track records — I researched three Bangalore DS Max projects on MahaRERA equivalent and found delivery within 8-12 months of promised dates in most cases. Not perfect but honest.

The 32-65 lakh pricing is genuinely affordable for Super Corridor. What does the lower price mean in reality? Specifications are mid-market rather than premium — Somany tiles instead of Kajaria, standard sanitary ware instead of Jaquar. The building common areas are functional without being impressive. The amenities are the basics — kids' play area, indoor games room, small gym. No swimming pool at this price.

The bet here is on the Super Corridor's trajectory rather than the product's luxury. IIM Indore's presence and the planned IT park cluster will drive demand for years. At 32-65 lakhs you are buying into a location story at an early, affordable price. The product is honest, not exceptional.`,
      daysAgo: 20,
    },
    comments: [
      { userName: 'Prakash Jain', content: `IIM Indore's presence has the same effect on the Super Corridor that IIT proximity has on Kanpur's Kalyanpur — it creates a sustained demand for quality residential options from visiting faculty, executive education participants, and the academic community. DS Max pricing is accessible enough for this demographic and the Super Corridor positioning captures that demand.`, daysAfter: 2 },
      { userName: 'Dhruv Agrawal', content: `I want to frame the DS Max pricing differently: this is a commute-saving investment. At the standard Indore market calculation of commute time valued at ₹300 per hour (conservative professional rate), 70 minutes daily saved is ₹3,500 per day, ₹84,000 per month. Over 5 years, that is ₹50 lakhs in time value. The ₹32-65 lakh housing cost looks different when you calculate the commute savings it generates.`, daysAfter: 5 },
      { userName: 'Sunita Malviya', content: `One practical check I always recommend for affordable projects: visit the actual construction site on a weekday morning unannounced. Count the labour present and the pace of work. DS Max Serene when I visited had active work on all three towers simultaneously. That is a positive sign of a developer with financial confidence in the project.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Ankita Solanki', score: 3, review: 'Super Corridor location at affordable pricing is the pitch and it is honest. Product specifications are mid-market as the price suggests. The commute-saving calculation makes this worthwhile for corridor workers.' },
      { userName: 'Prakash Jain', score: 3, review: 'IIM adjacency demand is real and lasting. DS Max captures this at an accessible price point. Right for buyers choosing location over product luxury.' },
      { userName: 'Dhruv Agrawal', score: 3, review: 'Time-value of commute saving is the underappreciated argument here. Infrastructure appreciation on the corridor adds medium-term investment upside to the commute convenience.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'Shri Ram Residency Scheme 78',
    propertyType: 'APARTMENT',
    address: 'Scheme 78, Indore 452010',
    developerName: 'Shri Ram Builders',
    developerSlug: 'shri-ram-builders',
    priceMin: 4800000, priceMax: 9500000,
    topic: {
      userName: 'Vivek Chouhan',
      title: 'Shri Ram Residency Scheme 78 — mid-market honesty in a prime location, deserves attention',
      description: `Scheme 78 is one of Indore's best-planned residential zones. The roads are 30-40 metres wide, the plots are correctly sized, the parks are maintained, and the neighbourhood has a functional urban quality that newer areas struggle to replicate. Real estate in Scheme 78 has consistently held value because the planning was done correctly from the beginning.

Shri Ram Residency is a mid-market apartment project within Scheme 78 and I want to celebrate what it does well — not every property review should be about premium or luxury. There is enormous value in an honest mid-market product that delivers exactly what it promises without pretension.

I am an IAS officer posted in Indore and my apartment requirements are specific: RERA registered, clear title (no encumbrances), honest builder with verifiable track record, established neighbourhood with good connectivity, and within my budget of 65-70 lakhs for a 3 BHK. Shri Ram Residency satisfies every one of these requirements without attempting to be something it is not.

The developer — Shri Ram Builders — has completed five projects in Indore. I personally visited three of them as part of my due diligence. All three are maintained well, all delivered within 12 months of promised date, and all have functioning RWAs with proper accounts. This kind of verifiable track record is the due diligence every serious buyer should do but very few actually complete.

The apartment specifications are honest mid-market: Kajaria tiles, Hindware sanitary ware, Havells electrical fittings. Not the cheapest options, not the most premium. Everything is functional and will last without premium maintenance costs. The 3 BHK at 1400 sqft has proper room proportions — the rooms are square or nearly square, not stretched to inflate the paper sqft count.

For government employees, professionals, and middle-class families who want the Scheme 78 address at honest mid-market pricing, this is the correct choice.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Ankita Solanki', content: `@Vivek ji, your track record verification approach is exactly what every buyer should do. Most people visit the sample flat and check the tiles — almost no one actually goes to completed projects and speaks to residents. The information gap this creates is exploited by every developer who has a beautiful sample flat and a terrible delivery record. Your due diligence methodology deserves to be the standard.`, daysAfter: 3 },
      { userName: 'Rajendra Patidar', content: `Scheme 78 road width is a hidden long-term asset. In Indore's old colonies, narrow roads create parking chaos that degrades quality of life incrementally over years. In Scheme 78, the 30-40 metre road widths mean parking, pedestrian movement, and vehicular traffic coexist without the daily friction that plagues older colonies. This planning quality translates to maintained property values.`, daysAfter: 6 },
      { userName: 'Dhruv Agrawal', content: `The IAS officer endorsement — however indirectly stated — actually carries specific weight for Shri Ram Residency. A senior government official doing rigorous due diligence and choosing this project above others at this price point in this zone is the highest credibility signal available. Government buyers are the most careful, least sentimental property purchasers in India.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Vivek Chouhan', score: 4, review: 'Honest mid-market product in one of Indore\'s best-planned zones. Five-project track record personally verified. Every requirement met without pretension.' },
      { userName: 'Ankita Solanki', score: 4, review: 'The verification methodology this buyer used should be replicated. Product result — a reliable project in a prime zone at honest pricing.' },
      { userName: 'Rajendra Patidar', score: 4, review: 'Scheme 78 planning quality is the base advantage and Shri Ram delivers a matching product quality. Long-term value maintenance is structural.' },
    ],
  },

  // ── BHOPAL ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'bhopal',
    propertyName: 'Shivom Misty Hills',
    propertyType: 'APARTMENT',
    address: 'Kerwa Dam Road, Bhopal 462044',
    developerName: 'Shivom Developers',
    developerSlug: 'shivom-developers',
    priceMin: 5500000, priceMax: 11000000,
    topic: {
      userName: 'Kiran Sharma',
      title: 'Shivom Misty Hills Kerwa Dam Road — lake-adjacent living in Bhopal, is the nature story real?',
      description: `Bhopal has a unique asset among Indian cities: genuine lakes and forest areas within or immediately adjacent to the city limits. Kerwa Dam and its surrounding forest is one such asset — it is a real lake, surrounded by real trees, with genuine wildlife including deer and birds. When Shivom Misty Hills claims nature-adjacent living, they are describing something real, not a landscaped fantasy.

I am a nature enthusiast and my primary reason for considering this project was the Kerwa Dam proximity. I visited four times across different seasons — including once in the monsoon and once in winter — to verify the nature experience is consistent and genuine. It is. The winter morning mist that gives the project its name is real. The deer I saw from the boundary of the site are real. The bird count in this zone is remarkable even by Bhopal standards.

Shivom Developers has designed Misty Hills to genuinely integrate with the landscape rather than just marketing it. The building orientation has been done with shadow path analysis — no tower blocks the Kerwa Dam view from the other towers. The green buffer between the project boundary and the Kerwa forest has been maintained per the forest department guidelines rather than being encroached or minimised.

The apartment configurations — 2 BHK at 1100 sqft and 3 BHK at 1550 sqft — have large balconies specifically designed for nature-viewing. The 3 BHK balcony is 180 sqft, which is disproportionately large by apartment standards, but makes sense when you have a lake view to contemplate.

One concern that potential buyers should understand: the Kerwa Dam catchment area has environmental restrictions that limit future commercial development in the vicinity. This is actually positive for existing residents — the nature experience is protected — but it means social infrastructure (schools, hospitals, daily markets) will not develop nearby organically. This project suits buyers who consciously trade urban convenience for nature proximity.`,
      daysAgo: 42,
    },
    comments: [
      { userName: 'Manoj Tiwari', content: `The environmental restriction point is important and nuanced. The Kerwa Dam forest area has Supreme Court-level green zone protection which means no commercial development within a kilometre radius. For residents, this means the deer and birds are permanent neighbours. The trade-off is no future supermarket walking distance. For Bhopal's nature-valuing professional class, this is a feature not a bug.`, daysAfter: 3 },
      { userName: 'Anita Verma', content: `I visited specifically to verify the mist claim. Went at 6am in February — the mist from the lake is genuine and extends to the project site for about two hours after sunrise. Standing on the balcony of the sample flat in that mist, with the forest visible through it, is a quality-of-life moment that no Bhopal city-centre apartment can replicate. I understood immediately why this project is priced above comparable city-centre alternatives.`, daysAfter: 6 },
      { userName: 'Rohit Saxena', content: `For working professionals who are remote-work-enabled, the Kerwa Dam area offers something valuable: cognitive restoration. Research shows that nature proximity improves mental health outcomes and sustained concentration in knowledge workers. The pandemic normalised remote work for many professions. If you can work remotely most days, the Shivom Misty Hills trade-off (nature access in exchange for urban-convenience commute) becomes a clear win for wellbeing.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Kiran Sharma', score: 5, review: 'Nature story is real and verified across four site visits in different seasons. The mist, the lake, the deer — all genuine. Best nature-adjacent project in Bhopal without question.' },
      { userName: 'Anita Verma', score: 5, review: 'February morning balcony experience in the lake mist is unforgettable. No city-centre apartment competes on this dimension. Right choice for nature-valuing buyers.' },
      { userName: 'Manoj Tiwari', score: 4, review: 'Environmental restrictions protect the nature experience permanently. The urban convenience trade-off is real but for remote workers it is easily manageable.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'DB Realty Orchid Bhopal',
    propertyType: 'APARTMENT',
    address: 'Maharana Pratap Nagar, Bhopal 462011',
    developerName: 'DB Realty',
    developerSlug: 'db-realty',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Manoj Tiwari',
      title: 'DB Realty Orchid Maharana Pratap Nagar — IT Park adjacent Bhopal, right time?',
      description: `Maharana Pratap Nagar in Bhopal is the district adjacent to the Bhopal IT Park — which houses offices of Infosys, TCS, and several mid-size IT companies. For someone working in this ecosystem, MP Nagar and Maharana Pratap Nagar offer the most practical commute options. DB Realty Orchid is positioned to serve exactly this demographic.

I am a project manager at an IT company in the Bhopal IT Park. I have been renting in Arera Colony for three years and the 30-minute daily commute across the city has accumulated to meaningful lost time. Moving to Maharana Pratap Nagar would reduce my commute to 10 minutes. The financial saving in commute cost — fuel, vehicle wear — is secondary to the time recovery.

DB Realty is a Mumbai-based developer with a mixed national track record. I want to be transparent about this. DB Realty has had troubled projects in Mumbai — some buyers in their Mumbai projects have faced significant delays. However, their regional projects in Tier 2 cities have generally been more straightforward. This dichotomy exists because their Mumbai projects were often larger and more complex, with more regulatory intersections.

The Bhopal Orchid project is smaller and more manageable — 6 towers, about 480 units. The RERA registration is active and the MP RERA compliance record for this project shows no major defaults. I verified this before considering further.

The apartment specifications are mid-premium: Somany tiles, Hindware sanitary ware, adequately sized rooms. The 2 BHK at 1050 sqft and 3 BHK at 1450 sqft are honest sizes without phantom sqft. The IT Park proximity is the headline and the project delivers on that positioning.

My caveat: verify DB Realty's current financial health at the time of your booking. Developer financial position changes over time and what was true when this review was written may have evolved.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Kiran Sharma', content: `The MP RERA portal for Bhopal is well-maintained and easy to navigate. I checked DB Realty Orchid specifically — project registration is active, the compliance report shows timely updates in the last two quarters, and the financial escrow mechanism appears intact. Current compliance status positive, subject to future changes as @Manoj ji rightly cautions.`, daysAfter: 2 },
      { userName: 'Deepa Joshi', content: `Maharana Pratap Nagar location has been improving steadily. The new flyover on the IT Park approach has resolved the major congestion bottleneck that used to exist at the crossing near the park entrance. The commute time to IT Park from this location is now genuinely 10 minutes on most mornings, which makes it practically walkable for someone with a bicycle or two-wheeler.`, daysAfter: 5 },
      { userName: 'Rohit Saxena', content: `For Bhopal IT professionals considering investment versus end-use: rental demand in the Maharana Pratap Nagar zone from IT Park employees is consistent. 2 BHK furnished units rent at 14,000-18,000 per month. At 45-55 lakh purchase price, the rental yield is roughly 3-4% — decent for a tier-2 city with strong appreciation potential. Both end-use and investment cases work here.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Manoj Tiwari', score: 3, review: 'Right location for IT Park professionals. DB Realty track record needs watching — RERA compliance currently good but ongoing monitoring is prudent.' },
      { userName: 'Kiran Sharma', score: 3, review: 'MP RERA compliance currently positive. Location advantage for IT corridor is genuine. Adequate mid-premium product for the price.' },
      { userName: 'Rohit Saxena', score: 4, review: 'Dual-purpose investment and end-use case both work at this location. Rental yield above Bhopal average supports the investment thesis.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'Amara Township Bhopal',
    propertyType: 'APARTMENT',
    address: 'Ayodhya Bypass, Bhopal 462022',
    developerName: 'Amara Builders',
    developerSlug: 'amara-builders',
    priceMin: 3800000, priceMax: 7500000,
    topic: {
      userName: 'Anita Verma',
      title: 'Amara Township Ayodhya Bypass — large township for Bhopal government worker buyers',
      description: `Bhopal is a government city in a way that most Indian state capitals have diluted over time. The MP government and Central government establishments here employ hundreds of thousands of people — civil servants, defence personnel, railway officers, doctors, teachers. This government-worker population is the backbone of Bhopal's residential demand and Amara Township on Ayodhya Bypass is designed specifically for this buyer.

I am an assistant professor at a Bhopal government college and my husband is a state government employee. Between us we qualify for government housing loan benefits — lower interest rates, specific bank schemes for government employees. Amara Township has partnered with SBI and Indian Bank for preferential government employee loan terms, which was the initial hook that brought us to the project.

The township scale is genuine — 18 towers, approximately 1800 units, on a 30-acre campus. At this scale, the amenity economics work. The swimming pool, badminton and basketball courts, jogging track, and the large central garden are properly sized and funded by the large resident base. The society fees — ₹2.5 per sqft per month for a 3 BHK — are genuinely affordable because the costs are spread over 1800 units.

The government employee buyer profile creates specific community qualities. Society elections are run properly, maintenance fund accounts are audited annually (government employees understand accountability mechanisms), and disputes are resolved through established RWA processes rather than degenerating into the chaos common in other Bhopal societies. These community governance qualities are real and valuable for long-term living quality.

The Ayodhya Bypass location has excellent road connectivity — the bypass is wide and well-maintained. The drive to the Secretariat and other central government offices takes 25-30 minutes which is acceptable for Bhopal's government worker community.`,
      daysAgo: 58,
    },
    comments: [
      { userName: 'Deepa Joshi', content: `The SBI preferential government employee loan term is something I verified directly at the State Bank branch. The rate differential for government employees at approved projects like Amara Township is 25-50 basis points below standard rates. On a 40 lakh home loan, this saves roughly 35,000-70,000 rupees annually in interest. Over a 15-year loan tenure, that is a meaningful financial benefit that directly reduces the effective cost of the property.`, daysAfter: 3 },
      { userName: 'Rohit Saxena', content: `The community governance point @Anita ji makes is under-discussed in property reviews. I have lived in two Bhopal societies and the difference between a well-governed RWA and a dysfunctional one is the difference between a peaceful life and daily friction. A buyer base of government employees — people habituated to institutional processes and accountability — tends to produce better-governed societies statistically.`, daysAfter: 6 },
      { userName: 'Manoj Tiwari', content: `Ayodhya Bypass road quality is maintained by NHAI standards since it is a national highway-adjacent stretch. This means the road outside the project will stay in repair rather than degenerating into the pothole-ridden city roads that plague inner Bhopal. For daily commuters, road quality outside your gate affects commute time and vehicle wear significantly over years.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Anita Verma', score: 4, review: 'Purpose-built for Bhopal\'s government employee community. The financial benefits from preferential loans and the governance quality of the resulting community are genuine advantages.' },
      { userName: 'Deepa Joshi', score: 4, review: '25-50 basis point interest saving for government employees is financially significant over loan tenure. Township amenities at affordable society fees from large-community economics.' },
      { userName: 'Manoj Tiwari', score: 4, review: 'NHAI-maintained road quality outside the gate is a durable daily commute advantage. Good community governance likely from the buyer profile.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'Sarthak Meadows',
    propertyType: 'APARTMENT',
    address: 'Hoshangabad Road, Bhopal 462026',
    developerName: 'Sarthak Builders',
    developerSlug: 'sarthak-builders',
    priceMin: 4200000, priceMax: 8500000,
    topic: {
      userName: 'Rohit Saxena',
      title: 'Sarthak Meadows Hoshangabad Road — along the Narmada belt, Bhopal\'s growing south corridor',
      description: `Hoshangabad Road — now officially called Narmada Road — is Bhopal's southern development corridor that ultimately connects to the Narmada river belt and eventually Hoshangabad. In recent years, the road has seen significant residential development as Bhopal's southward expansion accelerates. Sarthak Meadows is one of the projects that is credibly participating in this growth story.

I am originally from Hoshangabad district and the Narmada road direction has personal meaning beyond real estate. But I want to write an objective review. The Hoshangabad Road corridor from Bhopal's Ring Road outward has genuine growth catalysts: the planned industrial development zones south of Bhopal, the Narmada Expressway project that will improve connectivity to Jabalpur, and the general southward expansion of Bhopal's residential footprint as city-centre land exhausts.

Sarthak Meadows is positioned about 12 km from MP Nagar on Hoshangabad Road. The distance from the city centre is real and requires honest acknowledgement. This is not a city-convenient project — it is a corridor investment where you are betting on Bhopal's southern expansion materialising into residential maturation within 5-8 years.

The project itself is carefully planned for its location. The 12-acre campus has the full township amenities appropriate for a project that is asking buyers to move beyond convenient city distance: swimming pool, gym, clubhouse, indoor games hall, and importantly a dedicated shuttle service that runs to MP Nagar twice in the morning and twice in the evening. This shuttle concretely addresses the commute problem for working residents during the years before the corridor infrastructure matures.

Sarthak Builders is a Bhopal-local developer with three completed projects. Their Sarthak Homes project in Ayodhya Nagar delivered 6 months late but the post-possession quality has been well-regarded by residents I spoke to. Local developer, honest track record.`,
      daysAgo: 25,
    },
    comments: [
      { userName: 'Kiran Sharma', content: `The dedicated shuttle service is a concrete, operational solution to the distance problem rather than a vague promise of "developing infrastructure." I want to know: does the shuttle actually run? I called the project office and they confirmed the shuttle schedule — 7am and 8:30am from site to MP Nagar, 6pm and 8pm return. This specificity indicates a real service rather than marketing collateral.`, daysAfter: 3 },
      { userName: 'Anita Verma', content: `Hoshangabad Road has been gradually improving. The 4-laning of the stretch from Ring Road outward is partially complete — the section from Ring Road to Patel Nagar is done. This directly improves drive time for Sarthak Meadows residents to the city. Infrastructure improvements follow a schedule you can track on the PWD Bhopal website, which I recommend corridor investors do periodically.`, daysAfter: 6 },
      { userName: 'Deepa Joshi', content: `For nature-appreciating buyers who could not afford Shivom Misty Hills' Kerwa Dam pricing, Hoshangabad Road at 12 km out gives you genuine countryside ambience. The road passes through agricultural land and there are open fields visible from the project boundary. Not as dramatic as lake-adjacent living but a genuine green respite from city density at a more accessible price point.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Rohit Saxena', score: 3, review: 'Honest corridor investment requiring patience. Shuttle service is real and operational. Right for buyers who understand the 5-8 year maturation timeline and can plan accordingly.' },
      { userName: 'Kiran Sharma', score: 3, review: 'Shuttle service verified operationally — concrete solution to the distance problem. Developer track record is honest if not perfect. Fair entry on a growing corridor.' },
      { userName: 'Anita Verma', score: 3, review: '4-laning road improvement trackable on PWD website. Infrastructure progress is documentable which reduces the corridor investment uncertainty somewhat.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'Tulsi Heights MP Nagar',
    propertyType: 'APARTMENT',
    address: 'MP Nagar, Bhopal 462011',
    developerName: 'Tulsi Builders Bhopal',
    developerSlug: 'tulsi-builders-bhopal',
    priceMin: 6500000, priceMax: 13000000,
    topic: {
      userName: 'Deepa Joshi',
      title: 'Tulsi Heights MP Nagar — Bhopal\'s commercial heart, premium ask justified?',
      description: `MP Nagar is to Bhopal what MG Road is to Bangalore or Nariman Point is to Mumbai — the commercial, institutional, and social centre where everything important happens. The state's major banks, insurance companies, high courts, hospitals, and the densest concentration of restaurants, malls, and offices all cluster in and around MP Nagar. Living here means living at the centre of Bhopal's economic gravity.

I am a lawyer practising at the Bhopal High Court and MP Nagar is where I spend most of my professional life. The Tulsi Heights project caught my attention because it offers residential accommodation in this zone at a price that, while premium by Bhopal standards, is not outrageous given what you are getting access to.

The project is a 16-storey highrise in a zone that has traditionally been predominantly commercial. Residential towers in MP Nagar proper are rare — most of the zone is commercial use and residential development is limited by planning regulations. Tulsi Heights has obtained all necessary permissions and is the first truly premium residential highrise within the MP Nagar zone rather than adjacent to it.

The 3 BHK at 65-90 lakhs and 4 BHK at 100-130 lakhs is the premium tier for Bhopal. What does this premium buy? In practical terms: walking distance to the High Court complex for lawyers, to the major hospitals for medical professionals, and to the commercial district for business families. For a certain professional profile, this walkability is not a luxury but a professional necessity.

The construction quality reflects the premium positioning. The lobby has been designed by a Bhopal-based architect who has worked on hospitality projects — the design sensibility shows in the use of natural stone, the lighting design, and the proportions. The apartments have 3.3-metre floor-to-floor heights, floor-to-ceiling windows in the living area, and provision for automated curtains in the master bedroom.

For Bhopal's professional and business elite — lawyers, senior doctors, industrialists — this is the answer to living in the city's centre without compromising on residential standards.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Anita Verma', content: `The High Court proximity that @Deepa ji mentions is genuinely significant. Senior lawyers in Bhopal have traditionally maintained chambers and homes near the court complex. Tulsi Heights formalises this with a premium product rather than the aging kothi-style houses that have served this purpose until now. The lawyer community buyer base for this project is specific and real.`, daysAfter: 3 },
      { userName: 'Rohit Saxena', content: `MP Nagar real estate investment thesis is simple: supply is permanently constrained by planning regulations and the commercial zoning of the area. What exists will not be significantly added to. Demand from Bhopal's growing professional class will only increase. Price dynamics in supply-constrained premium zones are as close to a one-direction bet as real estate offers.`, daysAfter: 5 },
      { userName: 'Kiran Sharma', content: `The 3.3-metre ceiling height combined with floor-to-ceiling windows means the living area is genuinely dramatic. I visited the sample flat and the sense of space from the 10th floor, with that ceiling height and the MP Nagar commercial skyline visible below, was striking. This is not an apartment that feels like an apartment — it feels like a proper premium residence in the city's heart.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Deepa Joshi', score: 5, review: 'MP Nagar address with premium product for Bhopal\'s top professionals. Walking distance to everything that matters in the city. Justified premium for the right buyer profile.' },
      { userName: 'Rohit Saxena', score: 5, review: 'Supply-constrained premium address with sustained demand growth. Best investment thesis in Bhopal real estate for buyers who can access this price point.' },
      { userName: 'Kiran Sharma', score: 4, review: 'The physical experience of the apartment — ceiling, windows, views — is genuinely premium. Not just an address premium but a product premium that is visible and liveable.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'Narmada Residency Berasia Road',
    propertyType: 'APARTMENT',
    address: 'Berasia Road, Bhopal 462038',
    developerName: 'Narmada Construction',
    developerSlug: 'narmada-construction',
    priceMin: 2800000, priceMax: 5500000,
    topic: {
      userName: 'Vivek Chouhan',
      title: 'Narmada Residency Berasia Road — affordable north Bhopal, who should actually buy here?',
      description: `I want to write this review for a specific audience — the Bhopal buyer with a genuine budget constraint who is tired of reading reviews about premium projects they cannot afford. Narmada Residency on Berasia Road is honest affordable housing in north Bhopal and deserves an honest review addressed to the buyer it is actually serving.

Berasia Road is Bhopal's north corridor — traditional, working-class in character, with strong Bhopal-specific culture and community. The area is not aspirational in the glossy sense but it is functional, established, and genuinely liveable for families connected to the commercial and industrial base of north Bhopal. The district hospital is accessible, the schools are adequate (government schools of reasonable quality plus a few private options), and the markets are excellent — Berasia Road's weekly haat is one of Bhopal's most functional and affordable fresh produce sources.

Narmada Construction is a small local builder — this is their third project. The previous two — Narmada Apartments in Bairagarh and Narmada Towers in Nishatpura — I visited specifically. Both are properly maintained, the lifts are working, and residents I spoke to confirmed delivery was within 10 months of the promised date for both. That kind of track record from a small local builder is respectable.

The apartments at Narmada Residency are simple. The 1 BHK is 420 sqft — not padded, not tight. The 2 BHK is 750 sqft with a working kitchen, a proper bathroom, and balconies on both the bedroom and living room sides. The specification is basic — standard tiles, standard fittings, nothing branded. But it is functional and will serve a family for 15-20 years without significant replacement cost.

At 28-55 lakhs, this is genuine affordability. Not subsidised housing, not a government scheme — privately built at a price that actually works for Bhopal's large population of government-grade-3 employees, teachers, small shopkeepers, and working families.`,
      daysAgo: 50,
    },
    comments: [
      { userName: 'Manoj Tiwari', content: `Berasia Road community is one of Bhopal's most cohesive. The neighbourhood festivals, the weekly markets, the mohalla-level community — these are things that glossy new developments cannot manufacture. For buyers who value authentic community over aspirational address, north Bhopal and Berasia Road offer something that Kerwa Dam Road nature projects and MP Nagar premium towers cannot.`, daysAfter: 3 },
      { userName: 'Anita Verma', content: `The 420 sqft 1 BHK floor plan matters enormously at this price. I asked for the architect's drawing — which this builder actually provided without drama — and the plan is surprisingly efficient. The passage width is 900mm (minimum functional), the kitchen counter is full length, and the bathroom has proper turning space. Good space planning in a small footprint is harder than it looks and Narmada has done it well.`, daysAfter: 6 },
      { userName: 'Deepa Joshi', content: `For the PMAY subsidy eligibility question: Narmada Residency is approved under the Pradhan Mantri Awas Yojana urban scheme for income groups up to ₹18 lakh annual household income. Eligible buyers can claim up to ₹2.67 lakh subsidy on home loans. At a purchase price of 28-45 lakh, this subsidy represents 6-9% of the cost — meaningful. Always verify your eligibility before booking.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Vivek Chouhan', score: 3, review: 'Right product for the right buyer at an honest price. No pretension, no false promises. Small local builder with verifiable track record. Best affordable option in north Bhopal.' },
      { userName: 'Manoj Tiwari', score: 3, review: 'Berasia Road authentic community is a genuine asset not found in new developments. Right for buyers who value community over address aspiration.' },
      { userName: 'Anita Verma', score: 3, review: 'Efficient small-footprint floor planning verified from drawings. Functional design in a constrained size is respectable work from a small builder.' },
    ],
  },

  {
    citySlug: 'bhopal',
    propertyName: 'Avinashi Enclave',
    propertyType: 'APARTMENT',
    address: 'Kolar Road, Bhopal 462042',
    developerName: 'Avinashi Developers',
    developerSlug: 'avinashi-developers',
    priceMin: 3500000, priceMax: 7000000,
    topic: {
      userName: 'Ankita Solanki',
      title: 'Avinashi Enclave Kolar Road — south Bhopal emerging residential, right time to enter?',
      description: `I relocated to Bhopal from Indore two years ago for a private sector job and had to make a housing decision quickly. Kolar Road was recommended by colleagues as Bhopal's emerging residential corridor in the south and Avinashi Enclave was the project that made the most sense after my evaluation. I am writing this review a year after booking, having visited the site multiple times and tracked the development progress.

Kolar Road in Bhopal's south is genuinely emerging — not in the wishful-thinking sense that peripheral developers typically use, but measurably. The road was widened 18 months ago and the work quality is proper. A new private school (Kidzee chain) has opened within 2 km of the project. A medical clinic with two doctors and an X-ray facility opened at the Kolar Road junction. These are indicators of an area gaining real population and consequently real services.

Avinashi Developers is a relatively new Bhopal builder — this is their second project. Their first project, Avinashi Homes in Ayodhya Bypass area, was delivered 7 months late. Not great, but the quality post-possession has been maintained and the residents I spoke to have no major complaints about the product itself. A 7-month delay on a first project is less alarming than a company with a long pattern of delays.

The Enclave is a mid-size project — 8 towers, 520 units on 10 acres. The design is straightforward — no gimmicks, standard highrise format with podium parking. The amenities are appropriate for the price: children's play area, small gym, jogging track, and a garden. The sample flat showed honest mid-market specification — Nitco tiles, standard sanitary ware, UPVC windows.

At 35-70 lakhs for south Bhopal, the pricing is competitive. For comparison: Hoshangabad Road at this price point is further from the city and has less developed social infrastructure. Kolar Road's proximity to the Ring Road and the existing schools and medical facilities make it more immediately liveable.`,
      daysAgo: 15,
    },
    comments: [
      { userName: 'Kiran Sharma', content: `The road widening observation is correct and verifiable. The Kolar Road stretch from Ring Road to the 11th km mark has been properly widened with footpaths on both sides. This is not a half-done government road work but an apparently completed job. Good road infrastructure at the beginning of a corridor's residential growth phase is critical — you want to arrive before the road gets clogged.`, daysAfter: 2 },
      { userName: 'Rohit Saxena', content: `South Bhopal's growth trajectory makes sense from a city planning perspective. The north is industrialising (Berasia Road direction), the west already has Bairagarh's airport zone, and the east has government quarter saturation. South is the natural residential expansion direction and Kolar Road is the arterial that carries this expansion. Early entry at 35-70 lakh is rational corridor positioning.`, daysAfter: 5 },
      { userName: 'Manoj Tiwari', content: `@Ankita ji, the 7-month delay on the first project deserves context — Avinashi's Ayodhya Bypass project was affected by the post-2020 material cost surge that hit every Bhopal builder simultaneously. Their delay pattern is not characteristic but systemic to that period. The quality post-possession, which you mention is maintained, is the more meaningful indicator of the developer's actual commitment. Cautiously positive signal.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Ankita Solanki', score: 3, review: 'Emerging corridor with measurable development indicators. Developer track record requires watching but first-project delay has contextual explanation. Fair entry for south Bhopal at reasonable pricing.' },
      { userName: 'Kiran Sharma', score: 3, review: 'Road widening verified. Good infrastructure start for a developing corridor. Right timing to enter before the area fully matures and prices adjust.' },
      { userName: 'Rohit Saxena', score: 4, review: 'South Bhopal is the logical expansion direction and Kolar Road is the corridor. 35-70 lakh entry before maturation is a well-reasoned corridor play for patient investors.' },
    ],
  },
]

async function main() {
  console.log('🏙️  Seed Part D — Nagpur + Indore + Bhopal\n')
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
  console.log(`\n✅ Part D done — topics:${topics} comments:${comments} ratings:${ratings}`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
