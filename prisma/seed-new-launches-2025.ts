// New 2024-2025 Major City Launches — Mumbai, Bengaluru, Hyderabad, Pune, Delhi NCR
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  // Mumbai
  { name: 'Aditya Mehta Mumbai',     email: 'aditya.mehta.mumbai24@gmail.com' },
  { name: 'Kavya Joshi Mumbai',      email: 'kavya.joshi.mumbai24@gmail.com' },
  { name: 'Prashant Naik Mumbai',    email: 'prashant.naik.mumbai24@gmail.com' },
  { name: 'Shreya Patkar Mumbai',    email: 'shreya.patkar.mumbai24@gmail.com' },
  // Bengaluru
  { name: 'Arjun Rao Bangalore',     email: 'arjun.rao.blr24@gmail.com' },
  { name: 'Divya Krishnamurthy',     email: 'divya.krishnamurthy.blr24@gmail.com' },
  { name: 'Saurabh Tiwari Blr',      email: 'saurabh.tiwari.blr24@gmail.com' },
  { name: 'Meghana Shetty Blr',      email: 'meghana.shetty.blr24@gmail.com' },
  // Hyderabad
  { name: 'Rahul Reddy Hyd',         email: 'rahul.reddy.hyd24@gmail.com' },
  { name: 'Sravani Nair Hyd',        email: 'sravani.nair.hyd24@gmail.com' },
  { name: 'Karthik Varma Hyd',       email: 'karthik.varma.hyd24@gmail.com' },
  // Pune
  { name: 'Nikhil Kulkarni Pune',    email: 'nikhil.kulkarni.pune24@gmail.com' },
  { name: 'Sneha Bhosale Pune',      email: 'sneha.bhosale.pune24@gmail.com' },
  { name: 'Rohan Pawar Pune',        email: 'rohan.pawar.pune24@gmail.com' },
  // Delhi NCR
  { name: 'Ankit Sharma NCR',        email: 'ankit.sharma.ncr24@gmail.com' },
  { name: 'Ritu Malhotra NCR',       email: 'ritu.malhotra.ncr24@gmail.com' },
  { name: 'Vikram Kapoor NCR',       email: 'vikram.kapoor.ncr24@gmail.com' },
  { name: 'Priya Gupta NCR',         email: 'priya.gupta.ncr24@gmail.com' },
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
  // ── MUMBAI ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'mumbai',
    propertyName: 'Mahindra Alcove Powai',
    propertyType: 'APARTMENT',
    address: 'Central Avenue, Powai, Mumbai 400076',
    developerName: 'Mahindra Lifespaces',
    developerSlug: 'mahindra',
    priceMin: 22000000, priceMax: 45000000,
    topic: {
      userName: 'Aditya Mehta Mumbai',
      title: 'Mahindra Alcove Powai Mumbai — detailed review after 4 site visits and 3 months of research',
      description: `I spent three months evaluating Mahindra Alcove in Powai before deciding to book a 3BHK. I want to share everything I found because most reviews online are either PR copy or vague impressions from a single site visit.

Powai as a Mumbai address needs no explanation to the tech and finance crowd — it has been Mumbai's most steadily appreciating mid-premium locality for the last 15 years. The reason is simple: Hiranandani Gardens created a self-contained urban ecosystem — schools, hospitals, restaurants, weekend infrastructure — and its gravity has extended across the entire Powai lake belt. Mahindra Alcove sits on Central Avenue which gives it direct visual access to Powai lake from higher floors. This is not a marketing claim: I verified from the 14th floor terrace on my third visit.

Mahindra Lifespaces is the real estate arm of Mahindra Group — a publicly listed company with strong corporate governance. Their Mahindra World City projects in Chennai and Jaipur set benchmarks for what listed developer delivery looks like in practice. The Alcove project is RERA registered under MahaRERA and quarterly updates are current. I checked the RERA portal directly — no complaints logged against this project.

Construction quality observation: I brought my contractor uncle on the fourth visit. His assessment was that the RCC frame quality is good — no visible honeycombing, proper cover blocks visible at construction joints, the formwork appears high quality based on the surface finish on poured sections. These are small details that separate developers who build to specification from those who cut corners on structural work.

Where I have concerns: the pricing. At ₹2.25-4.5 crore for a Powai apartment with a Mahindra brand premium, you are paying approximately 15-20% above comparable size in the wider Powai market. The premium is real — the Mahindra brand, the lake view premium on upper floors, and the construction quality justify some of it. Whether the full premium is justified depends on how long you plan to hold. For a 10-year hold, Powai will appreciate and the brand will hold value. For a 3-5 year flip, you need to buy the right floor and configuration.

The lake view floors (14+) command an additional ₹15-20 lakh over mid-floor pricing. The view genuinely justifies this — sitting on the terrace with Powai lake in front of you on a clear morning is one of those Mumbai moments. But verify which floors your specific unit is on and whether adjacent construction blocks the view trajectory in the next 5 years.

One thing I specifically confirmed: Mahindra's maintenance arm (MELT) manages all their residential projects post-possession. Existing Mahindra residents I spoke to — in their Kandivali and Thane projects — rate MELT maintenance at 7-8/10. This post-possession quality assurance is worth something in Mumbai where society maintenance can deteriorate rapidly under poor management.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Kavya Joshi Mumbai', content: `The Powai lake view from upper floors is the real differentiator here. I visited a friend in Hiranandani Meadows and the morning view of the lake with Sanjay Gandhi National Park behind it is genuinely special. Not many Mumbai addresses can offer that. The question of whether ₹2.5 crore is right for Powai lake view depends on your income and holding period — but the view itself is not overstated.`, daysAfter: 2 },
      { userName: 'Prashant Naik Mumbai', content: `I compared Mahindra Alcove with Hiranandani Atlantis on the same road last month. Hiranandani's older towers are cheaper by ₹40-60 lakh for similar size but they are 18-year-old buildings with the associated maintenance issues. Alcove is new construction with modern specifications. If you're spending 2.5 crore in Powai, buying new makes more sense than buying aged Hiranandani at a 'discount' that will widen as the building ages.`, daysAfter: 5 },
      { userName: 'Shreya Patkar Mumbai', content: `I will add the downside that this review doesn't sufficiently address: the builder premium in Powai is real but so is the entry barrier. At ₹22 lakh all-in (including stamp duty, registration, GST on under-construction), a 2BHK at Mahindra Alcove requires a household income of at least ₹3 lakh per month to be financially manageable. This price point excludes the bulk of Mumbai's working professional class. The product is good but the addressable buyer pool is narrow.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Aditya Mehta Mumbai', score: 4, review: 'Mahindra brand quality in the best Powai location. Lake view units are genuinely special. MELT post-possession management reduces long-term risk. Justified premium for buyers with a 10-year horizon.' },
      { userName: 'Shreya Patkar Mumbai', score: 3, review: 'Good product with genuine quality markers but the pricing leaves limited upside for early buyers. Better value exists in neighbouring Powai micro-pockets. Suits buyers prioritising brand over yield.' },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'L&T Evara Heights Thane',
    propertyType: 'APARTMENT',
    address: 'Majiwada, Thane West, Thane 400601',
    developerName: 'L&T Realty',
    developerSlug: 'l-and-t',
    priceMin: 13500000, priceMax: 28000000,
    topic: {
      userName: 'Kavya Joshi Mumbai',
      title: 'L&T Evara Heights Thane West — engineering company builds apartments, what you actually get',
      description: `L&T Realty launching a premium project in Thane West should attract a specific kind of attention: when an engineering conglomerate — the company that builds nuclear plants, metro tunnels, and defense equipment — decides to build residential apartments, what does that actually mean for construction quality?

I visited Evara Heights in Majiwada three times over six weeks to find out. Here is the specific answer.

The structural work is the most observable quality signal. L&T's civil engineering team runs the construction directly — this is not a typical developer-contractor arrangement where the developer is a financial promoter who outsources everything. The formwork used is European-grade aluminium form system (MIVAN technology equivalent) which produces slab flatness and finish quality that conventional timber shuttering cannot match. On my site visit, I asked the site engineer to show me the concrete cube test records. They produced them without hesitation — 3 months of records, all showing 30+ MPa compressive strength at 28 days, which is M30 grade concrete. This is above minimum specification.

The Majiwada location in Thane West is the micro-market question. Majiwada sits at the junction of Ghodbunder Road and the Eastern Express Highway — this is the commercial heart of Thane West. It has good connectivity to BKC via the EEH, and to MIDC Thane for the manufacturing and pharma professionals who live in Thane. The downside is traffic — Ghodbunder Road has among the worst peak-hour congestion in the Mumbai Metropolitan Region. My morning drive from Majiwada to BKC at 9:00 am took 85 minutes. This is the trade-off that Thane buyers must accept honestly.

L&T's pricing here is at a significant premium over typical Thane West developers: ₹13,500 to ₹28,000/sqft depending on floor and configuration. For context, Lodha Splendora on Ghodbunder Road is at ₹11,000-14,000/sqft. The L&T premium is approximately 20-30% and it is entirely driven by brand and construction quality differentiation. Whether that premium is worth it depends on how much construction quality matters to you versus price per sqft.

For my household — engineer husband, we care about structural quality — the L&T premium is justified. For a buyer who is primarily price-optimizing or viewing this as an investment, the Lodha product in the same area at a lower PSF may pencil out better.

One positive surprise: L&T's RERA compliance is immaculate. The quarterly updates are filed within the first week of every quarter with detailed construction progress reports including photographs. This is not common even among large developers. It signals administrative discipline that post-possession maintenance will likely inherit.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Prashant Naik Mumbai', content: `The MIVAN technology point is worth expanding. MIVAN produces apartments where the walls are cast-in-situ concrete rather than brick walls — this eliminates the seepage issues that Mumbai apartments typically develop at the brick-mortar interface after 5-7 years. In a Mumbai monsoon context, this structural difference has significant long-term quality implications. L&T using MIVAN at this price point is a genuine value add.`, daysAfter: 3 },
      { userName: 'Shreya Patkar Mumbai', content: `The Ghodbunder Road traffic reality check is something the developer brochure will never show you. I have a cousin who lives in Lodha Splendora and her 9 am commute to Bandra takes 90-105 minutes consistently. This is the price of Thane's land affordability relative to Mumbai. If your workplace is in Thane itself, or in Airoli/Ghansoli direction, the location math works. BKC/South Mumbai commuters are the ones who suffer.`, daysAfter: 6 },
      { userName: 'Aditya Mehta Mumbai', content: `I looked at Evara Heights before deciding on Powai. The L&T construction quality argument is compelling — the structural difference between L&T and typical developer builds is visible and real. What made me choose Powai over Thane was the workplace: my office is in Andheri and the Powai commute is 20-25 minutes versus 75-90 from Majiwada. For Thane-based professionals the calculus would be reversed. Location fit matters as much as product quality.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Kavya Joshi Mumbai', score: 4, review: 'L&T construction quality is genuinely differentiated. MIVAN construction, immaculate RERA compliance, M30 concrete. Worth the premium for buyers who value structural quality over price. Location traffic is the honest trade-off.' },
      { userName: 'Prashant Naik Mumbai', score: 4, review: 'Best construction quality in Thane West — not close. The engineering company advantage is real and visible. Ghodbunder Road traffic is manageable if your workplace is Thane-based. Recommend for long-term holding.' },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Godrej Woodenville Kandivali',
    propertyType: 'APARTMENT',
    address: 'Thakur Village, Kandivali East, Mumbai 400101',
    developerName: 'Godrej Properties',
    developerSlug: 'godrej',
    priceMin: 16000000, priceMax: 32000000,
    topic: {
      userName: 'Prashant Naik Mumbai',
      title: 'Godrej Woodenville Kandivali East — Thakur Village micro-market and the Godrej premium, evaluated',
      description: `Godrej Properties has been on an acquisition spree across Mumbai and Woodenville in Kandivali East is one of their more interesting launches — a premium project in a mid-market area that is being repositioned by the entry of national developers.

Thakur Village in Kandivali East is a micro-market with a specific identity: it is the address that upwardly mobile western suburbs families graduate to from Borivali East and Malad East. The area has good schools (Thakur International School, Gundecha Education Academy nearby), developed retail infrastructure, and reasonable connectivity to the Western Express Highway. For families who work in the western corridor — Malad BKC, Andheri MIDC, or are willing to commute to Bandra — Kandivali East works well. It does not work for South Mumbai or Thane corridor professionals.

Godrej Properties as a developer: listed, publicly audited, consistently delivering. Their track record in Mumbai is stronger than their NCR and Pune projects — I say this based on verified RERA records and conversations with 8 residents across different Godrej Mumbai projects. The specific complaint I hear about Godrej is that they acquired many lands simultaneously and some projects experience management attention gaps. Woodenville being a single-site project (not a large township spread) reduces this risk.

The product: 2BHK at ₹1.6-2 crore (715-900 sqft) and 3BHK at ₹2.2-3.2 crore (1,050-1,450 sqft). The specifications include vitrified tiles throughout, Kohler bathrooms in the master, concealed plumbing (important for Mumbai apartments where plumbing leaks create recurrent problems), and a modular kitchen framework with European hardware — actual usable modular structure, not just a counter with a sink.

The 'Woodenville' branding around green credentials: the 40% open area claim is verified in the MahaRERA filing. The landscaping design I saw in the presentation had native Sahyadri species with year-round foliage — this matters in Kandivali's summer months when non-native decorative plantings go brown by February.

Where I think Godrej leaves value on the table: their maintenance charges here are ₹6.5/sqft/month from possession — this will likely be ₹8-10/sqft within 3 years based on how Godrej maintenance has escalated in their other Mumbai societies. Budget for this when calculating long-term holding costs. It is not a dealbreaker but it is a genuine recurring cost that most buyers underestimate.`,
      daysAgo: 42,
    },
    comments: [
      { userName: 'Shreya Patkar Mumbai', content: `The Thakur Village micro-market characterisation is accurate — it is the aspiration locality for Borivali and Malad families moving up. What I'd add is that the appreciation in this belt has been significant: Kandivali East properties have appreciated 35-40% in the last 3 years on the back of national developer entry (Godrej, Rustomjee, Runwal). Buyers entering now are getting the Godrej quality but at post-appreciation pricing.`, daysAfter: 3 },
      { userName: 'Aditya Mehta Mumbai', content: `The maintenance charges point is important and underappreciated. I have a Godrej property in Vikhroli and our maintenance has gone from ₹5.5/sqft to ₹8.8/sqft in 4 years — a 60% increase. The quality of maintenance has also improved proportionally, to be fair. But the budget impact is real. For a 1,200 sqft 3BHK, that is ₹10,560/month maintenance by year 5. Factor this into your monthly housing cost calculation alongside the EMI.`, daysAfter: 6 },
      { userName: 'Kavya Joshi Mumbai', content: `I evaluated Woodenville against Rustomjee Elanza in nearby Borivali East. Rustomjee is about 15% cheaper per sqft with a slightly smaller project scope. For buyers where the Godrej brand matters — corporate job transfers, potential for future resale to NRIs who recognize the Godrej name — Woodenville commands a premium that will hold. For purely end-use buyers without resale concerns in the next 10 years, Rustomjee's lower entry price deserves consideration.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Prashant Naik Mumbai', score: 4, review: 'Godrej quality in the right Kandivali micro-market. Concealed plumbing, proper modular kitchen, 40% verified open area. Budget for escalating maintenance. Strong long-term value for western corridor professionals.' },
      { userName: 'Kavya Joshi Mumbai', score: 4, review: 'Solid premium product in a rising micro-market. Godrej brand creates resale liquidity. Entry pricing reflects post-appreciation levels — buy for 7+ year hold. Good choice for Malad-Borivali upgraders.' },
    ],
  },
  // ── BENGALURU ───────────────────────────────────────────────────────────────
  {
    citySlug: 'bengaluru',
    propertyName: 'Prestige Somerville Whitefield',
    propertyType: 'APARTMENT',
    address: 'Whitefield Main Road, Bengaluru 560066',
    developerName: 'Prestige Group',
    developerSlug: 'prestige',
    priceMin: 12000000, priceMax: 25000000,
    topic: {
      userName: 'Arjun Rao Bangalore',
      title: 'Prestige Somerville Whitefield — honest review from someone who almost booked but did not',
      description: `I spent two months seriously evaluating Prestige Somerville and came very close to booking a 3BHK before deciding against it. I want to explain both why it is a good project and specifically why I chose not to book — both sides of the decision are useful for buyers in this market.

Prestige Group is Bengaluru's most consistent premium developer. I've tracked their project delivery record across 15 projects over 6 years — the average delay is 14 months, which is below the Bengaluru average of 18-22 months for comparable projects. Their construction quality is genuinely above market standard: I've visited 4 completed Prestige projects and the structural quality, common area maintenance, and internal finishing quality are consistently better than Sobha at similar pricing (I know this will be controversial but it reflects my actual assessments across multiple project site visits).

Somerville on Whitefield Main Road has the right address for ITPL-corridor professionals. If you work in ITPL, Bagmane Tech Park, or RMZ Ecoworld — or if your spouse does — the Whitefield location is a simple commute calculation that works. The proximity to Phoenix Marketcity, the ITPL food and entertainment ecosystem, and the recently improved Whitefield metro connectivity makes the lifestyle math compelling.

Why I did not book: the pricing. At ₹12,000-25,000 per sqft for Whitefield, Somerville is priced at a 20-25% premium over Prestige's own comparable projects in Electronic City and Sarjapur Road from two years ago. The Whitefield corridor has seen pricing catch up to North Bengaluru levels driven by ITPL employment density — but the infrastructure quality (roads, drainage, water supply) has not caught up to the pricing. When I drove through Whitefield in the August 2024 monsoon, the waterlogging and road conditions were genuinely bad. I do not want to pay North Bengaluru prices for infrastructure that is still catching up.

The 14-month average Prestige delay also means you should plan possession for mid-2027 if the promised date is end-2025, and your EMI+rent double burden needs to be financially planned for accordingly.

For buyers whose workplace is genuinely in Whitefield and who have the financial buffer to absorb the double burden period, Somerville is the right product at the right address. For buyers stretching to get into the Prestige brand from other parts of the city, the value calculus does not work at current Whitefield pricing.`,
      daysAgo: 45,
    },
    comments: [
      { userName: 'Divya Krishnamurthy', content: `The Whitefield waterlogging point is something the builder brochures will never mention. I work at an ITPL company and during both July and August last year, the stretch near Hoodi junction — which you would cross daily from Somerville — was flooded for an average of 3 hours each heavy rain day. BBMP has announced Whitefield road and drainage upgrades but the timeline is at least 2-3 years. Buy with this in mind.`, daysAfter: 3 },
      { userName: 'Saurabh Tiwari Blr', content: `I booked in Somerville and I want to offer the counter perspective: the metro connectivity change is real. The Purple Line extension to Whitefield is now operational and my commute from the Whitefield metro to Indiranagar takes 38 minutes. If you take the metro rather than driving, the Whitefield traffic becomes irrelevant. The buyer profile that benefits most from Somerville is the metro-commuter, not the car-dependent commuter.`, daysAfter: 6 },
      { userName: 'Meghana Shetty Blr', content: `The double-burden financial planning point cannot be overstated. My colleague bought in a Prestige project with a 2025 Q2 possession promise. It is now September 2024 and they are at 60% construction completion. Possession in Q2 2025 is not going to happen — even Prestige knows this, their RERA update shows Q4 2025 revised. She is paying ₹52,000 EMI and ₹28,000 rent simultaneously. That is ₹80,000/month in housing costs on a ₹1.4 lakh household income. Plan for this.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Arjun Rao Bangalore', score: 3, review: 'Excellent developer, strong construction quality, right Whitefield address for ITPL professionals. Overpriced relative to infrastructure quality. Budget for 14-18 month delay and double burden. Right product for metro commuters.' },
      { userName: 'Saurabh Tiwari Blr', score: 4, review: 'Best Whitefield launch of 2024. Prestige quality and on-track RERA updates. Metro connectivity changes the commute math for non-drivers. Priced appropriately for the brand and address.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Sobha Neopolis Panathur',
    propertyType: 'APARTMENT',
    address: 'Panathur Road, Bengaluru 560103',
    developerName: 'Sobha Limited',
    developerSlug: 'sobha',
    priceMin: 10500000, priceMax: 21000000,
    topic: {
      userName: 'Divya Krishnamurthy',
      title: 'Sobha Neopolis Panathur — 4,000 units in one project, what that density actually means for residents',
      description: `Sobha Neopolis in Panathur is one of the largest single-project launches in Bengaluru's history — over 4,000 units across 21 towers on 80+ acres. The scale is a key feature of this review because it changes the nature of what you are buying relative to a typical 300-500 unit Sobha project.

Sobha Limited is the developer I have the most trust in among Bengaluru's premium segment. The reason is concrete and verifiable: Sobha is a backward-integrated developer who owns their own construction workforce, their own concrete plants, their own manufacturing for doors and windows. This vertical integration eliminates the contractor quality variability that plagues other developers. When Sobha promises M35 grade concrete, they do not have to trust a third-party contractor — their own production team executes it. The quality consistency across Sobha projects is the most verifiable track record in Bengaluru premium real estate.

Neopolis at Panathur also has the right macro-location: it is positioned in the Bellandur-Panathur-Kadubeesanahalli employment corridor where a large share of Bengaluru's IT workforce is concentrated. The ORR to both north and south is accessible. Carmelram, Sarjapur Road, and Marathahalli are all within 15-20 minutes without traffic.

Now the honest concerns. 4,000+ units means this project will have 12,000-15,000 residents at maturity. The internal traffic movement within the complex, the lift wait times during peak hours, and the common amenity competition at peak times (pool, gym, clubhouse) are genuinely different experiences from what 300-unit Sobha projects offer. I visited a friend at Sobha Dream Acres — a similar large-format Sobha project — and the morning gym wait time and evening pool crowding were significant. This is not a dealbreaker but it is a quality-of-life difference from what the Sobha brand typically implies.

The Panathur Road itself: the road quality is improving but the stretch between ORR and the site still has infrastructure gaps. The main road is narrow for the traffic volume it will carry when 4,000 units are occupied. I expect congestion similar to Bellandur lake road.

The investment math: Sobha Neopolis sold at ₹8,800-10,500 per sqft at launch. Secondary market prices are already 12-18% above launch for the Phase 1 inventory, which indicates genuine demand from the IT professional buyer segment. The pricing does reflect the market's verdict on Sobha quality at this location.

My recommendation: for the verified Sobha quality commitment and the right ORR micro-location, Neopolis is a good purchase if you go in understanding that this is a township experience rather than a boutique community.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Arjun Rao Bangalore', content: `The Dream Acres comparison is apt. I visited Dream Acres in Balagere and the scale management challenges you describe are real — the project has approximately 6,000 units and the peak-hour internal movement is significant. That said, Sobha's RWA management is more professional than developer-managed societies — they set up proper systems before handover. The transition from construction to community is smoother than most large projects.`, daysAfter: 4 },
      { userName: 'Meghana Shetty Blr', content: `I want to flag the pricing trajectory concern. Neopolis is currently at ₹10,500-12,000 per sqft for available inventory after early appreciation. At that price, comparable quality from Prestige in the Whitefield and Sarjapur corridors is available. The Sobha brand commands a premium that was more defensible at launch prices. New buyers entering now are paying for two layers of appreciation — original Sobha quality premium plus post-launch secondary market appreciation.`, daysAfter: 7 },
      { userName: 'Saurabh Tiwari Blr', content: `The vertical integration point about Sobha is real and underappreciated. I visited their manufacturing unit in Thrissur during a Sobha investor day — they literally make the door frames, window profiles, and concrete batches in-house. No other Indian developer does this at this scale. When you buy Sobha, you are buying a product manufactured with consistency that no contractor-dependent developer can match. The density concern is valid but the quality foundation is unique in India.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Divya Krishnamurthy', score: 4, review: 'Sobha quality at the right ORR location. Township scale is a lifestyle trade-off buyers must understand. Vertical integration means genuine quality consistency. Best for buyers who prioritise build quality over boutique community feel.' },
      { userName: 'Meghana Shetty Blr', score: 3, review: 'Quality is undeniable but post-launch entry pricing reduces the margin of safety for new buyers. Township density means amenity competition at peak hours. Worth it only at pre-launch or early launch pricing.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Mana Verdant Sarjapur Road',
    propertyType: 'APARTMENT',
    address: 'Sarjapur Road, Attibele, Bengaluru 562107',
    developerName: 'Mana Projects',
    developerSlug: 'mana',
    priceMin: 8000000, priceMax: 15000000,
    topic: {
      userName: 'Saurabh Tiwari Blr',
      title: 'Mana Verdant Sarjapur Road — new-age developer with sustainability focus, independent evaluation',
      description: `Mana Projects is a Bengaluru developer that has emerged in the last 5 years with a specific positioning: sustainability-focused premium housing with a genuine commitment to green design rather than the greenwashing common in this segment. Verdant on Sarjapur Road is their most ambitious project and I evaluated it independently to separate the marketing claims from verifiable substance.

Mana's earlier project — Mana Dale in Sarjapur — gave me a baseline. I visited completed residents there. The sustainability claims translate into a few observable realities: the solar power generation system is functional and genuinely offsets common area electricity costs by 60-70% in residents' experience. The rainwater harvesting system is properly engineered — not a show system that runs during site visits. The STP (sewage treatment plant) output is used for landscaping, which keeps the green areas actually green without municipal water dependence. These are infrastructure details that most developers claim and few execute properly.

Verdant's location on the Attibele stretch of Sarjapur Road is the most honest part of the evaluation to get right. This is outer Sarjapur Road — not the Carmelram or Hosa Road stretch that has walkable infrastructure. Attibele is where Sarjapur Road transitions from urban Bengaluru to semi-urban fringe. The trade-offs are clear: more land per unit, lower pricing than inner Sarjapur, but genuine dependence on private vehicle for daily needs. There is no walkable grocery, medical clinic, or restaurant near the site currently.

This will change. Sarjapur Road has been developing outward consistently. The social infrastructure lag of 3-5 years is a reasonable estimate based on how the Carmelram and Hosa Road stretches developed after similar projects were announced there 6-7 years ago. But the buyer needs to be honest about this 3-5 year wait period.

Mana as a developer: they have completed one medium-scale project (Mana Dale) without significant issues. Verdant is their 2.8x scale increase. I asked them directly about financing: they have a construction credit line from a Bengaluru-based NBFC and quarterly construction milestone draws. This is the right financing structure for a developer at this scale.

Pricing at ₹8,000-15,000 per sqft makes Mana Verdant one of Sarjapur Road's more affordable premium options — and the sustainability execution at Mana Dale justifies a premium over anonymous local developers. For buyers comfortable with Attibele's current fringe-urban character and the 3-5 year infrastructure catch-up wait, this is a well-priced product from a developer whose quality claims are verifiable.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Arjun Rao Bangalore', content: `The Mana Dale verification is the right approach. I did the same — visited Mana Dale residents before evaluating Verdant. The solar offset at 60-70% is confirmed by multiple residents. What I also found: the Mana community has a WhatsApp group where residents flag issues and the developer responds directly — this responsiveness is rare and indicates a developer who cares about reputation beyond the sale.`, daysAfter: 3 },
      { userName: 'Divya Krishnamurthy', content: `The Attibele location fringe-urban characterisation is accurate and buyers should sit with this honestly before booking. I have a colleague who bought in a similar Sarjapur fringe project 4 years ago — she says the first 18 months were genuinely inconvenient. No cab coverage at odd hours, no walkable food options, no clinic nearby. By year 3 the infrastructure had improved meaningfully. Buy knowing you are signing up for this transition period.`, daysAfter: 6 },
      { userName: 'Meghana Shetty Blr', content: `Mana Projects is one of the few Bengaluru developers where I feel the sustainability positioning is genuine rather than marketing. The solar and STP engineering at Dale is properly done. Verdant is larger but the developer track record at Dale gives me more confidence than a first-project developer. At ₹8,000 per sqft for Mana quality in the Sarjapur corridor, this is genuinely interesting pricing compared to what Prestige and Sobha charge for similar-era projects on the same road.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Saurabh Tiwari Blr', score: 4, review: 'Best sustainability execution among Bengaluru developers. Mana Dale verifies the claims. Attibele location requires accepting 3-5 year infrastructure catch-up. Strong value for buyers with patience and a long holding horizon.' },
      { userName: 'Arjun Rao Bangalore', score: 4, review: 'Genuine sustainability rather than greenwash, verified at Mana Dale. Developer responsiveness is above average. Fringe location is the honest trade-off. Worth it at current pricing for outer Sarjapur believers.' },
    ],
  },
  // ── HYDERABAD ───────────────────────────────────────────────────────────────
  {
    citySlug: 'hyderabad',
    propertyName: 'Prestige Waterford Kokapet',
    propertyType: 'APARTMENT',
    address: 'Kokapet, Hyderabad 500075',
    developerName: 'Prestige Group',
    developerSlug: 'prestige',
    priceMin: 18000000, priceMax: 40000000,
    topic: {
      userName: 'Rahul Reddy Hyd',
      title: 'Prestige Waterford Kokapet — Bangalore developer enters Hyderabad premium, my full assessment',
      description: `Prestige Group's entry into Hyderabad's Kokapet Financial District corridor with Waterford is significant. Hyderabad's premium residential market has been dominated by My Home, Aparna, and Aliens — national developers like Sobha, Godrej, and Prestige entering the market brings a quality and governance benchmark that the local developers are having to respond to.

Kokapet as a location needs explanation for non-Hyderabad buyers. Kokapet is the residential extension of HITEC City and Gachibowli — Hyderabad's primary IT employment corridor. The Financial District (the Hyderabad equivalent of Bengaluru's Embassy Tech Village or Mumbai's BKC) is within 5-10 minutes of Kokapet. Google, Amazon, Microsoft, Infosys, and 50+ other tech companies operate within 20 minutes of this address. The outer ring road connectivity to the airport (35 minutes) and to the northern IT hubs (Madhapur, Hitech) makes Kokapet the single best residential address in Hyderabad for IT professionals.

What Prestige brings: their Bengaluru construction quality standards. The specifications at Waterford include Italian marble in living areas, Kohler fittings throughout (not just master bath), VRF air conditioning provision in all bedrooms, and 11-foot ceiling heights. I compared these specifications with competing Kokapet projects from My Home and Aparna — the Prestige specifications are noticeably more detailed and use better-specified branded fittings. The floor plan efficiency is also superior: the 3BHK at 2,100 sqft has a genuinely usable 400+ sqft living-dining area.

Pricing concern: at ₹18,000-40,000 per sqft, Waterford is priced at a 25-35% premium over the best Hyderabad local developer equivalent. For comparison, My Home Tarkshya in the same Kokapet corridor is at ₹13,000-17,000 per sqft with comparable configuration sizes. The Prestige premium is being priced on brand and specification quality.

Hyderabad's real estate market has undergone significant pricing appreciation — Kokapet prices have doubled from ₹6,000-8,000 per sqft in 2020 to current levels. Buyers entering at current Prestige pricing need to assess whether the Prestige brand premium is additive to an already-appreciated market price.

My assessment: for end-use Financial District professionals who want the best quality product in the best Hyderabad address without budget constraint, Prestige Waterford is the unambiguous answer. For investment buyers, the entry point is high and yield compression is real.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Sravani Nair Hyd', content: `The Kokapet location assessment is accurate for Financial District employees. My husband works at a major US tech company's Hyderabad campus and his commute from our Kokapet apartment is 8 minutes door to desk. No other Hyderabad location matches this for Financial District professionals. The Prestige premium at Waterford is high but the location convenience is a genuine daily quality-of-life advantage that compounds over years of living there.`, daysAfter: 3 },
      { userName: 'Karthik Varma Hyd', content: `I want to add the GST context that Hyderabad buyers often miss. Prestige Waterford is under-construction and attracts 5% GST (without ITC) on the agreement value. On a ₹3 crore apartment, that is ₹15 lakhs in GST that does not appear in the headline price but is payable during construction. For completed resale apartments in Kokapet, GST is not applicable. This tax differential between new launch and resale needs to be factored into the total cost comparison.`, daysAfter: 6 },
      { userName: 'Rahul Reddy Hyd', content: `I want to update my original review: Prestige has confirmed that Waterford is using pre-certified green building standards (IGBC Green Homes rating) which translates to lower utility bills post-possession. For the ₹18,000-40,000 per sqft price point, this is an expected specification. But the honest thing to note is that Hyderabad's Kokapet already has consistent 24/7 power supply (unlike many other Hyderabad locations) so the solar provision benefits are less dramatic here than in locations with frequent outages.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Rahul Reddy Hyd', score: 4, review: 'Best specification product in the best Hyderabad address. Prestige brings Bengaluru quality standards to a market hungry for them. Entry pricing is high — right for end-use Financial District professionals, less compelling for pure investors.' },
      { userName: 'Sravani Nair Hyd', score: 5, review: 'Kokapet Financial District location is irreplaceable for HITEC City professionals. Prestige quality is noticeably above local developer standards. The premium is justified for buyers who will live here long-term.' },
    ],
  },
  {
    citySlug: 'hyderabad',
    propertyName: 'My Home Lionsgate Mokila',
    propertyType: 'APARTMENT',
    address: 'Mokila, Hyderabad 502032',
    developerName: 'My Home Constructions',
    developerSlug: 'my-home',
    priceMin: 8500000, priceMax: 18000000,
    topic: {
      userName: 'Sravani Nair Hyd',
      title: 'My Home Lionsgate Mokila — budget alternative to Kokapet or overpriced fringe? Full analysis',
      description: `My Home Corporation is Hyderabad's most prolific large-scale developer and Lionsgate in Mokila represents their push into the ORR western corridor. I spent 6 weeks evaluating whether Lionsgate is a genuine value opportunity or a case of outer-ring fringe pricing that benefits the developer more than the buyer.

My Home as a developer: they have delivered more Hyderabad apartments than any other single developer in the last decade. The scale is impressive — My Home Jewel, Tarkshya, Bhooja, and a dozen other projects cover virtually every Hyderabad corridor. The quality at these projects is consistently mid-premium: not Prestige or Sobha specification, but genuinely above anonymous Hyderabad local developer quality. RERA compliance is consistent. I have not been able to find a sustained delivery complaint against any of their completed projects.

Mokila's location context: it is on the western ORR corridor, approximately 15-20 km from HITEC City (without traffic) and 25-30 km from the Financial District. For Hyderabad's IT workers, this requires a 40-60 minute commute on the ORR — the ORR is good quality road but the distance is real. Mokila is adjacent to Appa Junction on the ORR. The area is currently fringe-urban with limited walkable infrastructure.

What Mokila has in its favour: lower entry pricing, larger apartment sizes at the same budget, and a genuine chance at infrastructure catching up as ORR development continues westward. Several IT parks have been announced for this ORR corridor — if even half materialize, Mokila will benefit from proximity employment.

The honest concerns I came away with: Hyderabad has seen a lot of "ORR corridor growth" promises over the last decade. Some areas (Financial District to Kokapet) have materially improved. Others (parts of the ORR south toward Shamshabad) have been slower. Mokila's infrastructure catch-up depends on employment anchor development that is currently planned but not confirmed.

My Home Lionsgate's pricing at ₹8,500-18,000 per sqft feels on the higher end for the Mokila micro-market — it is at a 20-25% premium over comparable My Home projects in more established Hyderabad corridors. I suspect the developer is pricing future potential into current units, which transfers some development risk to buyers.

Recommendation: Lionsgate makes sense for Hyderabad government employees, non-IT professionals, or families with primary incomes in the western corridor where the commute math works. For IT professionals whose primary workplace is HITEC City or Financial District, the distance creates daily friction that compounds. At ₹85-180 lakh, there are established Hyderabad locations with better connectivity at similar pricing — research before committing to the fringe premium.`,
      daysAgo: 40,
    },
    comments: [
      { userName: 'Karthik Varma Hyd', content: `The ORR corridor growth promise assessment is fair and appropriately cautious. I want to add a specific data point: Patancheru and Sangareddy on the northern ORR were supposed to be IT hubs 8 years ago. Today, Patancheru is still primarily pharmaceutical and petrochemical industrial — not IT. The western ORR Mokila corridor may have better prospects given existing residential demand, but buyers should treat the IT park announcements as potential upside, not guaranteed infrastructure.`, daysAfter: 4 },
      { userName: 'Rahul Reddy Hyd', content: `My Home's pricing at Lionsgate surprised me when I checked it. ₹8,500-18,000 per sqft at Mokila is approaching Miyapur-Bachupally pricing on the northern ORR — a corridor with significantly better existing connectivity. I think My Home is pricing on project scale and brand premium more than location reality at Mokila. The value calculation only works for buyers who have specifically researched why Mokila over Miyapur.`, daysAfter: 7 },
      { userName: 'Sravani Nair Hyd', content: `I will add a positive counter: the land parcel at Lionsgate is genuinely large (60+ acres) and the open area ratio is above 50% — uncommon for Hyderabad projects of this scale. Families with children who prioritise open space, parks, and a low-density community feel will find Mokila's fringe location acceptable in exchange for the space. The project is not for metro commuters but it is genuinely good for a certain buyer profile.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Sravani Nair Hyd', score: 3, review: 'My Home quality is consistent and verifiable. Mokila location is genuinely fringe — suits buyers with western ORR employment or those prioritising space over connectivity. Overpriced relative to established Hyderabad corridors at same budget.' },
      { userName: 'Karthik Varma Hyd', score: 3, review: 'Good developer, wrong pricing for the location. ORR growth potential is real but not guaranteed at the timeline you need. Compare with Miyapur or Bachupally before committing to the Mokila premium.' },
    ],
  },
  // ── PUNE ────────────────────────────────────────────────────────────────────
  {
    citySlug: 'pune',
    propertyName: 'Birla Vanya Mundhwa',
    propertyType: 'APARTMENT',
    address: 'Mundhwa, Pune 411036',
    developerName: 'Birla Estates',
    developerSlug: 'birla',
    priceMin: 9500000, priceMax: 20000000,
    topic: {
      userName: 'Nikhil Kulkarni Pune',
      title: 'Birla Vanya Mundhwa Pune — Birla Estates enters Pune, what their debut project reveals',
      description: `Birla Estates (part of the Aditya Birla Group) launching in Pune with Vanya in Mundhwa is a significant market development. The Aditya Birla Group's entry into real estate brings institutional governance, a conglomerate balance sheet, and a brand reputation that is genuinely different from most developers. This is Birla Estates' first Pune project and I evaluated it specifically to understand what the Birla quality standard means in practice.

Mundhwa as a Pune address: it sits in East Pune's technology corridor along the Kharadi-Mundhwa belt. The proximity to EON IT Park (Kharadi), World Trade Center (Kharadi), and the extended Yerwada-Kalyani Nagar belt gives this address genuine employment catchment. The Magarpatta Township is 3 km away and its schools, hospitals, and lifestyle infrastructure are accessible. Mundhwa itself is a transitional locality — not yet fully urbanised but developing fast on the back of IT employment demand.

Birla Estates' construction quality claim: I went to their completed project in Mumbai (Birla Niyaara in Worli) to assess what their actual quality standard is. The internal finishing quality is genuinely premium: large format Italian marble, 12-foot ceilings, concealed plumbing throughout, proper thermal insulation specification in external walls (uncommon in Pune construction). The common areas at Niyaara are maintained at hotel lobby standards. If Vanya delivers to Niyaara standards, it will be the best specification product in the Mundhwa micro-market.

The RERA filing for Vanya is current with quarterly updates. Birla Estates has the Aditya Birla Group financial backing that removes construction financing risk entirely — this developer is not going to stall because of cash flow. For Pune buyers who have experienced delays from smaller developers, this institutional backing removes the most common completion risk.

Pricing reality: at ₹9,500-20,000 per sqft, Vanya is priced at a 25-35% premium over comparable Mundhwa projects from Shapoorji Pallonji and Rohan Builders. The Birla premium is being taken upfront. Given that Birla Estates is in their first Pune project, I believe the price will be justified by delivery — but buyers are paying for potential quality rather than a local verified track record. This is the honest risk distinction.

My recommendation: for buyers who can afford the Birla premium and want institutional-quality construction in East Pune's IT belt, Vanya is the best option available. The Kharadi-Mundhwa employment location is right. The developer financial backing is genuinely superior. Verify that your specific configuration and floor provide adequate ventilation — I found that lower floors of the eastern towers have limited direct sunlight due to the setback geometry.`,
      daysAgo: 33,
    },
    comments: [
      { userName: 'Sneha Bhosale Pune', content: `The Birla Niyaara quality verification approach is exactly the right way to evaluate a developer's debut project in a new city. I visited Birla Niyaara on your recommendation and the quality is genuinely impressive — the kind of specification detail you usually see in commercial Grade A office buildings applied to a residential building. If Vanya delivers 80% of that specification quality, it will still be significantly above anything else in Mundhwa.`, daysAfter: 3 },
      { userName: 'Rohan Pawar Pune', content: `Mundhwa's Kharadi proximity is valuable but the road connectivity between Mundhwa and Kharadi needs honest assessment. The Mundhwa-Kharadi road via Ghorpadi is acceptable. The alternative via Hadapsar is longer but avoids the worst congestion. For EON IT Park employees, the 15-20 minute commute is manageable. For WTC Kharadi employees, the same calculation holds. This is a workable IT commute address in East Pune.`, daysAfter: 6 },
      { userName: 'Sneha Bhosale Pune', content: `I want to raise the floor plan concern more explicitly. I reviewed the Vanya floor plans for the B Tower and found that 2BHK units on floors 5-8 on the north-facing side have bedrooms that are 9'6" wide — below the comfortable 10' minimum. This is a floor plan efficiency issue that reveals where cost reduction happened. Inspect the actual floor plan dimensions for your specific unit before booking, not just the total carpet area.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Nikhil Kulkarni Pune', score: 4, review: 'Birla Estates debut in Pune brings institutional quality to East Pune for the first time. Aditya Birla Group financial backing eliminates completion risk. Premium pricing is justified for buyers who can afford it. Verify floor plan dimensions for lower north-facing units.' },
      { userName: 'Rohan Pawar Pune', score: 4, review: 'Correct Kharadi-belt address, institutional developer quality, strong RERA compliance from a conglomerate with reputational stakes. Best new launch in Mundhwa. Worth the premium for long-term end-users.' },
    ],
  },
  {
    citySlug: 'pune',
    propertyName: 'Sobha Nesara Hinjewadi',
    propertyType: 'APARTMENT',
    address: 'Hinjewadi Phase 2, Pune 411057',
    developerName: 'Sobha Limited',
    developerSlug: 'sobha',
    priceMin: 8000000, priceMax: 17000000,
    topic: {
      userName: 'Sneha Bhosale Pune',
      title: 'Sobha Nesara Hinjewadi — great developer, problematic location. My honest verdict after booking and reconsidering.',
      description: `I want to share an honest account of my Sobha Nesara evaluation because I went through the full cycle: researched, got excited, almost booked, reconsidered, and ultimately decided against it. The product quality story is genuine. The location story is more complicated than the brochure suggests.

Sobha Limited is the developer I trust most among premium Indian builders. The vertical integration, the backward-integrated construction, the consistent quality track record across 100+ completed projects — this is well-documented. Nesara in Hinjewadi benefits from Sobha quality standards that I will not dispute. The specification is genuine: M35 concrete, Kohler fixtures throughout, 10.5 feet ceiling height, concealed wiring with German switches. This is a well-built product.

Hinjewadi is Pune's IT hub — Rajiv Gandhi Infotech Park Phase 1, 2, and 3 house nearly 200,000 IT professionals across Infosys, Wipro, Persistent, Amdocs, and dozens more. If you work in Hinjewadi, the location logic is obvious. Nesara Phase 2 is approximately 2 km from the Phase 2 tech park — walkable for some configurations, a short auto for others.

Here is the honest problem I could not resolve: I drove the Hinjewadi commute for 5 consecutive days before evaluating this project. The morning peak-hour traffic on Hinjewadi Phata (Phase 1 to Phase 2) consistently took 35-50 minutes for a 2.3 km stretch. The Phase 3 flyover construction has improved some of this but the fundamental issue — a 2-lane road serving 200,000+ daily IT commuters — has not been solved. Pune Metro Phase 3 includes a Hinjewadi line but construction is years away from completion.

The traffic was a dealbreaker for me personally because my office is in Hinjewadi Phase 3 — I would sit in the internal Hinjewadi traffic for 40 minutes after an hour-long commute from the rest of Pune. For someone whose office is in Phase 1 or Phase 2, the Nesara walk or 5-minute drive may work.

What I ultimately chose instead: Sobha Neopolis in Panathur, where the ORR connectivity is genuinely superior even though it requires driving further. For buyers who are specifically Hinjewadi Phase 2 or Phase 3 employees and do not need to commute elsewhere, Nesara is arguably the best address you can buy. For buyers with any mixed-location commute requirements, the Hinjewadi trap needs honest evaluation before committing.

RERA registration is current. Possession timeline is Q2 2026, which I consider achievable by Sobha's historical standards (average 9-month delay, so Q1 2027 in planning).`,
      daysAgo: 25,
    },
    comments: [
      { userName: 'Rohan Pawar Pune', content: `I work at Infosys Hinjewadi and I want to confirm the traffic assessment from the resident perspective. The Phase 1 to Phase 2 morning commute is exactly as described — 35-45 minutes for 2 km on bad days. I cope with this by leaving before 8 am and returning after 7 pm. If you can adjust your hours, Hinjewadi is manageable. If you need 9-to-6 flexibility, the traffic removes that option. Nesara buyers who work in the phase 2 corridor and own two-wheelers for the short internal ride will have the best quality of life here.`, daysAfter: 3 },
      { userName: 'Nikhil Kulkarni Pune', content: `The comparison to Panathur and ORR is fair but missing one point: Hinjewadi pricing for Sobha is approximately ₹2,000-3,500 per sqft below comparable Sobha projects in Bengaluru's ORR corridor. Pune buyers are getting Sobha quality at a meaningful Pune discount. For end-users who work in Hinjewadi and accept the traffic realities, the per-sqft value argument is compelling. The product is undeniably well-built.`, daysAfter: 6 },
      { userName: 'Rohan Pawar Pune', content: `Water supply needs a mention for Hinjewadi specifically. PMC water supply in Phase 2 is intermittent — 2-3 days per week in non-monsoon months. Sobha Nesara has a dedicated borewell backup and rooftop storage that compensates. But the tanker dependency in severe summer months (April-May) remains a real possibility for Hinjewadi residents generally. Check what Sobha's specific water backup capacity is for the number of units, not just the system description.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Sneha Bhosale Pune', score: 3, review: 'Sobha quality is non-negotiable — the build will be excellent. Hinjewadi traffic is a location reality that eliminates this project for mixed-commute buyers. Right choice only for dedicated Hinjewadi Phase 2-3 employees with flexible work hours.' },
      { userName: 'Nikhil Kulkarni Pune', score: 4, review: 'Best product in Hinjewadi by significant margin. Sobha vertical integration quality at Pune pricing. Traffic is the known trade-off. Suits Hinjewadi IT professionals who prioritise build quality over commute flexibility.' },
    ],
  },
  // ── DELHI NCR ───────────────────────────────────────────────────────────────
  {
    citySlug: 'delhi',
    propertyName: 'DLF Privana South Gurugram',
    propertyType: 'APARTMENT',
    address: 'Sector 76-77, Gurugram 122004',
    developerName: 'DLF Limited',
    developerSlug: 'dlf',
    priceMin: 30000000, priceMax: 65000000,
    topic: {
      userName: 'Ankit Sharma NCR',
      title: 'DLF Privana South Sector 76-77 Gurugram — sold out in days, but was it worth it? My analysis.',
      description: `DLF Privana South sold out its entire ₹7,200 crore inventory within 72 hours of launch in November 2023. I was one of the people who booked. I want to give an honest post-booking assessment rather than the cheerleading that typically follows a sold-out luxury launch.

DLF Limited is India's most recognised developer brand — listed on NSE/BSE, 70+ years of history, delivered multiple million units, and India's largest commercial real estate portfolio alongside residential. The brand quality and delivery track record in Gurugram specifically is the strongest of any NCR developer. DLF Camellias, DLF The Crest, DLF Ultima — the quality at these completed Gurugram projects is consistently at the top of the market. When you buy DLF in Gurugram, you are buying a developer whose failure to deliver has never been a concern — only delivery timeline is the question.

Privana South in Sector 76-77 occupies the 116-acre DLF 5 Markit development zone that DLF has been assembling land for since 2015. The location on Golf Course Road Extension (GCRE) is the continuation of Gurugram's primary luxury residential spine — Phase 3 (Sectors 43-67 on the GCRE) established the premium market and Sectors 76-77 represent the next phase of that same corridor. The NH-48 access (Sohna Road) is 5 minutes. The proposed MRTS extension will have a stop within 1.5 km of the project. The airport is 25 minutes via the NH-48 without traffic.

Product specifications: 4BHK (3,800-4,500 sqft) and 5BHK (5,200-6,100 sqft) ultra-luxury configurations. Private lift lobbies per floor, multi-layer security, DLF's Umang Club recreation infrastructure on-site, and the DLF maintenance team for post-possession management. These are specifications at the Rs. 35,000-55,000 per sqft range that justify the category.

My honest concerns post-booking: the delivery timeline. DLF has given Q2 2028 possession for Phase 1. DLF's historical track record on luxury projects shows 18-24 month average delays. Realistically, plan for Q4 2029 to Q2 2030 possession. At ₹3-6.5 crore of equity deployed, this is a 5-6 year deployment horizon — the opportunity cost of capital over this period needs to be in your financial model.

The secondary market has already moved: Privana South units are trading at 35-45% above launch pricing in secondary market listings within 6 months of booking. This appreciation validates the demand but also reflects that some early buyers priced risk correctly and are taking profit. For post-launch secondary buyers, the original appreciation cushion has already been consumed.`,
      daysAgo: 20,
    },
    comments: [
      { userName: 'Ritu Malhotra NCR', content: `The 72-hour sellout and the immediate secondary market appreciation of 35-45% is the most relevant data point for anyone evaluating this project now. The original launch buyers got exceptional terms — pre-appreciation pricing, structured payment plan, DLF launch inventory selection. Post-secondary buyers are entering at post-appreciation levels without the payment plan benefit. This is a fundamentally different risk-return profile. Evaluate honestly which category you would be in.`, daysAfter: 3 },
      { userName: 'Vikram Kapoor NCR', content: `I looked at Privana South seriously but ultimately chose DLF Privana West (launched subsequently). The West phase is essentially the same product at similar quality with slightly different tower configurations — at ₹28,000-40,000 per sqft launch pricing it was more accessible than South's ₹30,000-50,000+ secondary market pricing. The product quality difference is marginal. Buyers who missed South should evaluate West before going secondary on South.`, daysAfter: 6 },
      { userName: 'Priya Gupta NCR', content: `The DLF maintenance quality argument is the strongest long-term case for Privana. I have lived in DLF The Crest for 4 years — the maintenance standard is genuinely hotel-level. Common areas are serviced daily, the helpdesk response time for maintenance requests is same-day, and the security protocols are multiple-layer. For a ₹3-6 crore primary residence, this post-possession quality assurance is a real part of the value proposition that other luxury NCR developers cannot consistently match.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Ankit Sharma NCR', score: 5, review: 'Best luxury product in NCR from India\'s strongest developer in the best Gurugram corridor. Secondary market premium reflects genuine demand. Post-possession maintenance is DLF\'s real moat. Right for long-horizon buyers who can absorb 5-6 year deployment.' },
      { userName: 'Priya Gupta NCR', score: 5, review: 'DLF quality in the Golf Course Extension corridor is unmatched. The post-possession maintenance standard at DLF properties is the benchmark other NCR developers aspire to. Luxury buyer\'s first choice in Gurugram.' },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'M3M Golf Hills Sector 79',
    propertyType: 'APARTMENT',
    address: 'Sector 79, Gurugram 122004',
    developerName: 'M3M India',
    developerSlug: 'm3m',
    priceMin: 16000000, priceMax: 35000000,
    topic: {
      userName: 'Ritu Malhotra NCR',
      title: 'M3M Golf Hills Sector 79 — golf course luxury at a price, with important delivery caveats',
      description: `M3M Golf Hills in Sector 79 is one of the more visually impressive Gurugram luxury launches of the last two years — the golf course frontage, the ultra-luxury specifications, and M3M's marketing budget create a compelling first impression. I spent 8 weeks doing a thorough evaluation before deciding. Here is the complete picture.

M3M India has emerged as one of NCR's most active developers — their Motorway, Merlin, Crown, and now Golf Hills projects dot the Golf Course Road Extension corridor. The marketing is sophisticated and the product specifications on paper are premium. However, M3M has a delivery track record that needs direct examination.

I researched M3M's RERA filing history across 6 of their Gurugram projects. The finding: every one of their large projects has experienced delays ranging from 18 months (M3M Crown) to 36+ months (M3M Merlin). Some projects are in litigation with buyers over possession delays. This is not a marginal detail — it is the central risk factor for any M3M evaluation. The developer has capacity for marketing and specification quality but has not demonstrated execution consistency at the scale of their ambitions.

The Golf Hills product: 3BHK from ₹1.6 crore to 4BHK at ₹3.5 crore in a project that physically fronts a 9-hole golf course (The Karma Lakelands golf facility). The golf course frontage is real — it is not a future promise but an existing facility. Upper floors provide genuine golf course views. The specifications include Italian marble, VRF air conditioning, private lobbies, and a 5-acre amenity deck. On paper, this is a ₹25,000-35,000 per sqft luxury product for which M3M is asking ₹18,000-28,000 per sqft.

The pricing is where M3M creates apparent value — they are 15-20% below DLF and Sobha NCR projects of comparable specification. This price gap is real but it partly reflects the delivery risk premium that the market assigns to M3M. You are being compensated for uncertainty.

My evaluation conclusion: for buyers who can do the following, M3M Golf Hills is a reasonable buy — (a) negotiate subvention scheme or construction-linked payment to limit upfront capital at risk; (b) budget for 24-30 month delivery delay beyond the promised Q3 2026 possession; and (c) include a legal remedy clause for significant delay in the buyer agreement. Without these provisions, the delivery risk is uncompensated.

For buyers who need certainty and cannot absorb extended delay, DLF or Sobha NCR projects at a higher price are the better choice.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Ankit Sharma NCR', content: `The M3M delivery track record research is the most valuable part of this review. I want to confirm from personal experience: my cousin booked M3M Merlin in 2019 with a Q2 2022 possession promise. It is now late 2024 and possession is still not given for all towers. The delay is now 30+ months and climbing. The legal remedies through HRERA are real but slow. For M3M Golf Hills, price the delay insurance value into your decision.`, daysAfter: 4 },
      { userName: 'Vikram Kapoor NCR', content: `The golf course frontage claim deserves verification. The Karma Lakelands golf course is an existing operational facility — this is not a future amenity promise. For Golf Hills upper floor units, the view is genuine. I visited and it is visually impressive. But the golf course is a separate company's facility — M3M does not control it. The continuation of this view depends on the golf course remaining operational, which requires verification of the golf facility's own operational health and land ownership.`, daysAfter: 7 },
      { userName: 'Priya Gupta NCR', content: `I will add the positive counterpoint: M3M has improved their delivery track record in recent years. Their Sector 65 Motorway project delivered approximately 14 months late, which is significantly better than the Merlin or Crown delays. If Golf Hills benefits from this improved execution discipline, the risk calculus changes. Buyers should request current construction progress documentation at the HRERA portal before judging only by the older project delays.`, daysAfter: 11 },
    ],
    ratings: [
      { userName: 'Ritu Malhotra NCR', score: 3, review: 'Golf course frontage is real and impressive. Pricing gap versus DLF reflects genuine delivery risk. M3M has 30+ month delays in recent projects. Structure payment plan to limit exposure and budget for delay. Right for risk-tolerant buyers with long horizons.' },
      { userName: 'Vikram Kapoor NCR', score: 3, review: 'Good product on paper, problematic delivery track record in practice. The 15-20% price discount versus DLF is real but partially risk-compensation. Use construction-linked payment plan. Verify Karma Lakelands operational status before banking on the golf view long-term.' },
    ],
  },
]

async function main() {
  console.log('\n🏙️  Seed — 2024-2025 New Launches (Mumbai, Bengaluru, Hyderabad, Pune, Delhi NCR)\n')
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
  console.log(`\n✅ Done — topics:${topics} comments:${comments} ratings:${ratings}\n`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
