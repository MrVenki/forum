// Tier 1 Part F — Ludhiana (6) + Agra (5) + Nashik (6) + Patna (6)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  // Ludhiana
  { name: 'Gurpreet Singh Ldh',   email: 'gurpreet.singh.ldh@gmail.com' },
  { name: 'Harpreet Kaur Ldh',    email: 'harpreet.kaur.ldh@gmail.com' },
  { name: 'Manpreet Dhillon',     email: 'manpreet.dhillon.ldh@gmail.com' },
  { name: 'Jaswinder Grover',     email: 'jaswinder.grover.ldh@gmail.com' },
  // Agra
  { name: 'Ashish Agarwal Agra',  email: 'ashish.agarwal.agra@gmail.com' },
  { name: 'Seema Mittal Agra',    email: 'seema.mittal.agra@gmail.com' },
  { name: 'Vinod Sharma Agra',    email: 'vinod.sharma.agra@gmail.com' },
  { name: 'Kavita Bansal Agra',   email: 'kavita.bansal.agra@gmail.com' },
  // Nashik
  { name: 'Amol Kulkarni Nashik', email: 'amol.kulkarni.nashik@gmail.com' },
  { name: 'Pooja Deshmukh Nashik',email: 'pooja.deshmukh.nashik@gmail.com' },
  { name: 'Nilesh Borse',         email: 'nilesh.borse.nashik@gmail.com' },
  { name: 'Sunita Sawant Nashik', email: 'sunita.sawant.nashik@gmail.com' },
  // Patna
  { name: 'Rajan Kumar Patna',    email: 'rajan.kumar.patna@gmail.com' },
  { name: 'Priya Singh Patna',    email: 'priya.singh.patna@gmail.com' },
  { name: 'Mukesh Prasad Patna',  email: 'mukesh.prasad.patna@gmail.com' },
  { name: 'Anjali Kumari Patna',  email: 'anjali.kumari.patna@gmail.com' },
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
  // ── LUDHIANA ───────────────────────────────────────────────────────────────
  {
    citySlug: 'ludhiana',
    propertyName: 'Omaxe Celestia Ludhiana',
    propertyType: 'APARTMENT',
    address: 'Ferozepur Road, Ludhiana 141001',
    developerName: 'Omaxe Limited',
    developerSlug: 'omaxe-limited',
    priceMin: 7500000, priceMax: 13000000,
    topic: {
      userName: 'Gurpreet Singh Ldh',
      title: 'Omaxe Celestia Ferozepur Road Ludhiana — premium product honest review',
      description: `Omaxe Celestia is Ludhiana's most prominent premium residential launch of the last two years. At ₹85-95 lakh for a 3BHK, it is the highest ask in the city outside of a handful of boutique projects. I spent 6 weeks evaluating this before deciding. Here is what I found.

Ferozepur Road is unquestionably Ludhiana's best residential address. The road runs through Ludhiana's most functional commercial and social infrastructure zone — hospitals like Dayanand Medical College, established schools, premium restaurants and hotels. An address on Ferozepur Road has meaning in Ludhiana's professional and business circles in the way that only a handful of street names in any city carry.

Omaxe as a developer is a national listed company which brings a different kind of accountability than local or unlisted developers. They have shareholder obligations, SEBI reporting requirements, and a brand reputation that spans multiple states. They cannot as easily disappear from projects the way smaller developers sometimes do. That said, their project history has some delays — particularly in NCR — but their Ludhiana presence has been more disciplined.

Celestia's construction quality: I brought a civil engineer friend to the site visit. His assessment — the structural work is properly done, concrete grade appears correct, brick quality is good. The design has generous ceiling heights (10.5 feet) and balconies that are actually large enough to furnish. The sample flat used Kajaria tiles, Kohler bathroom fixtures in the master bath, and good quality aluminium windows with proper weather sealing.

The comparison buyers make: Ansal Heights on Pakhowal Road offers similar size at ₹55-68 lakh, saving ₹25-30 lakh. The Omaxe premium buys you the Ferozepur Road address, the listed company accountability, and a quality level that the Ansal product at that price cannot fully match. Whether that premium matters to you depends entirely on how you weigh address prestige and quality assurance.

One practical note: Omaxe took over maintenance of their previous Ludhiana project — Omaxe City on BRS Nagar Road — after a rocky initial period and it is now well-managed. Residents I spoke to there gave 6/10 initially, now rate it 8/10. This improvement trajectory is encouraging.`,
      daysAgo: 40,
    },
    comments: [
      { userName: 'Harpreet Kaur Ldh', content: `The listed company accountability point is something buyers in Ludhiana don't think about enough. When you buy from a company with NSE/BSE listing, you have a very different recourse ecosystem than with a partnership firm builder. SEBI regulations, public financial disclosure, institutional investors — all of these create pressure to perform that unlisted builders simply don't face.`, daysAfter: 2 },
      { userName: 'Manpreet Dhillon',   content: `Ferozepur Road premium is real and sticky. In 15 years of following Ludhiana real estate, values on Ferozepur Road have never declined in absolute terms. Relative to inflation they have moderately declined in some periods, but nominal values have been one-directional. For wealth preservation, this road has an excellent track record.`, daysAfter: 5 },
      { userName: 'Jaswinder Grover',   content: `The 10.5 feet ceiling height is above average even for premium Ludhiana projects. Most developers in this city do 10 feet or below. The extra half foot sounds trivial but it changes how the room feels dramatically — more air, more light, less claustrophobic. This is a quality detail worth paying attention to.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Gurpreet Singh Ldh', score: 4, review: 'Ferozepur Road premium plus listed developer accountability justifies the price. Quality is above Ludhiana average. Best address in the city.' },
      { userName: 'Manpreet Dhillon',   score: 4, review: 'Omaxe Celestia sets a new quality bar for Ludhiana premium residential. The address is irreplaceable. Long-term value is secure.' },
    ],
  },
  {
    citySlug: 'ludhiana',
    propertyName: 'Ansal Heights Ludhiana',
    propertyType: 'APARTMENT',
    address: 'Pakhowal Road, Ludhiana 141002',
    developerName: 'Ansal API',
    developerSlug: 'ansal-api',
    priceMin: 5000000, priceMax: 9000000,
    topic: {
      userName: 'Harpreet Kaur Ldh',
      title: 'Ansal Heights Pakhowal Road Ludhiana — mid-segment honest evaluation',
      description: `My husband and I spent three months looking at 2 and 3BHK options in Ludhiana before arriving at Ansal Heights on Pakhowal Road. I want to share a specific, detailed assessment because the generic reviews online are either paid positive write-ups or complaints with no context.

Pakhowal Road runs parallel to Ferozepur Road and shares much of the same catchment without the Ferozepur premium. The area has been developing steadily — commercial activity on Pakhowal Road has grown substantially in the last four years, with new restaurants, banks, and a small mall. Schools and hospitals in the 3 km radius are adequate for family living. Connectivity to Ludhiana airport via the bypass is under 20 minutes.

Ansal API is a Delhi-based developer with decades of history and a mixed track record. In Punjab specifically — Mohali, Ludhiana — their performance has been more disciplined than their more troubled NCR projects. I verified through the Punjab RERA portal: no pending complaints against this specific Ludhiana project, and the quarterly updates are filed regularly.

Product quality: the 3BHK at 1,580 sqft is properly sized for the floor plan efficiency category — standard for a national developer at this price. Ceiling height is 10 feet. The bathroom fixtures are Jaquar — branded but mid-tier, appropriate for the ₹55-68 lakh price point. Kitchen has a granite counter and stainless steel sink provided, without the modular framework (which is fair at this price).

Vastu compliance was specifically important to my in-laws who are involved in the purchase decision. Ansal Heights provides east and north-facing options with what the architect has certified as vastu-compliant layouts. For Ludhiana's Punjabi family buyer profile where vastu is taken seriously, this is a genuine differentiator.

I am likely booking the east-facing 3BHK at ₹63 lakh with possession expected March 2026. RERA confirmed. Bank pre-approval from PNB is done. Will update after possession.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Gurpreet Singh Ldh', content: `Pakhowal Road to Ferozepur Road is genuinely only 10 minutes by car. The lifestyle catchment is almost identical. The 15-20% price difference between identical units on the two roads is purely address premium. For budget-conscious buyers who don't need to impress clients with an address, Pakhowal is the rational choice.`, daysAfter: 3 },
      { userName: 'Jaswinder Grover',   content: `The Punjab RERA portal verification is the right step. I've helped several buyers in Ludhiana navigate project evaluation and the most common mistake is trusting the sales team on RERA status without independently verifying. The portal is publicly accessible and takes 10 minutes to check. Always do it.`, daysAfter: 6 },
      { userName: 'Manpreet Dhillon',   content: `East-facing at ₹63 lakh on Pakhowal Road is fair market pricing for Ansal quality. The vastu aspect for Punjabi family buyers is genuinely important — I've seen deals fall through because the in-laws rejected a west-facing unit. Ansal's vastu options are a smart commercial decision for this market.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Harpreet Kaur Ldh', score: 4, review: 'Ansal Heights delivers what it promises at a fair price. Pakhowal Road gives Ferozepur lifestyle at 15% lower cost. Vastu options and RERA compliance are clear positives.' },
      { userName: 'Gurpreet Singh Ldh', score: 3, review: 'Solid choice for practical buyers who want quality without the address premium of Ferozepur Road. Ansal API in Punjab has been more reliable than their NCR projects.' },
    ],
  },
  {
    citySlug: 'ludhiana',
    propertyName: 'Ratan Homes BRS Nagar',
    propertyType: 'APARTMENT',
    address: 'BRS Nagar, Ludhiana 141012',
    developerName: 'Ratan Developers',
    developerSlug: 'ratan-developers',
    priceMin: 5500000, priceMax: 9500000,
    topic: {
      userName: 'Manpreet Dhillon',
      title: 'Ratan Homes BRS Nagar Ludhiana — one year of living, local developer done right',
      description: `I have lived in Ratan Homes BRS Nagar for exactly one year and I want to share a comprehensive account because local developers in Ludhiana don't get enough serious analysis — they're either dismissed as risky or praised without substance by people who haven't done their homework.

Ratan Developers has been building in Ludhiana since the early 2000s. More than 20 years of local operation means their reputation is embedded in the city's real estate community — every property broker, every bank loan officer in Ludhiana knows Ratan's work. This kind of local reputation is genuinely harder to build than national brand awareness and harder to fake, because your buyers are your neighbours and they talk.

BRS Nagar is a consistently premium Ludhiana address. The locality has everything: Satguru Partap Singh Apollo Hospital is nearby, several reputed schools, established markets, and the general residential culture of a settled, educated community. BRS Nagar property values have appreciated 8-10% annually over the last decade without the volatility that peripheral areas show.

The one-year assessment of Ratan Homes: zero seepage after two monsoons. This is the primary quality test for any Ludhiana building — the monsoons are serious here. The walls, ceiling, and terrace have shown no signs of water ingress. Electrical load capacity: I run three split ACs, a washing machine, and a geyser simultaneously without any circuit issues — the wiring was done correctly with appropriate load ratings. These are the things that matter for daily living and neither shows up in marketing materials nor in site visit assessments.

Society management: our RWA was formed within 3 months of majority possession. Monthly meetings, regular accounts sharing, active communication on maintenance issues. Ratan's management team handed over properly — they didn't just disappear post-possession, which unfortunately happens with many developers.

I paid ₹62 lakh for a 1,480 sqft 3BHK. At current market, similar units are being quoted at ₹72-75 lakh. In one year my asset has appreciated approximately 16% while I have been living in it. That's a reasonable statement of value.`,
      daysAgo: 10,
    },
    comments: [
      { userName: 'Harpreet Kaur Ldh', content: `The monsoon seepage test is the ultimate quality benchmark for any Punjab building — our monsoons are serious enough to expose poor construction within one season. Two years seepage-free from a local builder is an excellent result and should carry real weight in purchase decisions.`, daysAfter: 1 },
      { userName: 'Jaswinder Grover',   content: `The RWA formation within 3 months of possession is also significant. Many developers in Ludhiana drag this process for 12-18 months, running the maintenance themselves at inflated rates in the interim. A developer who hands over promptly and cooperates with RWA formation is showing character.`, daysAfter: 4 },
      { userName: 'Gurpreet Singh Ldh', content: `BRS Nagar 16% appreciation in one year is above the city average — this locality has been outperforming for the past 3 years. The medical infrastructure around Satguru Apollo Hospital has been expanding, which creates employment and housing demand that supports property values in the neighbourhood.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Manpreet Dhillon',   score: 5, review: 'Everything a Ludhiana buyer wants: established locality, 20-year local developer reputation, quality construction verified after one year of living. Outstanding purchase.' },
      { userName: 'Harpreet Kaur Ldh',  score: 5, review: 'Ratan Homes passes the monsoon test and the daily living test. BRS Nagar location is premium Ludhiana. Local developer trust is real and verified.' },
    ],
  },
  {
    citySlug: 'ludhiana',
    propertyName: 'Sunny Enclave Township',
    propertyType: 'PLOT',
    address: 'Kharar, Near Ludhiana 140301',
    developerName: 'Sunny Real Estates',
    developerSlug: 'sunny-real-estates',
    priceMin: 2800000, priceMax: 8500000,
    topic: {
      userName: 'Jaswinder Grover',
      title: 'Sunny Enclave Kharar near Ludhiana — plotted colony review for self-construction buyers',
      description: `I want to address the plotted colony option specifically for Ludhiana buyers who have a self-construction mindset — which is common among Punjabi families. Sunny Enclave near Kharar on the Ludhiana-Chandigarh highway is the most established large-scale plotted community in this corridor and deserves a proper discussion.

Sunny Enclave is not a new development — it has been growing and developing for nearly two decades. This maturity is actually its primary advantage: the infrastructure is real, not promised. The internal roads are constructed and maintained. Water supply via the colony's own treatment system (not dependent on Kharar municipality) is functional. Electricity through a dedicated feeder has been reliable. Schools and markets have grown organically within and around the colony because the resident population now exists to support them.

Plot sizes available in current resale (newer phases also launching): 100 sqyd to 300 sqyd. Current pricing per sqyd ranges from ₹28,000-35,000 depending on location within the colony — corner plots, park-facing plots, and main road plots command premiums. A 100 sqyd plot is ₹28-35 lakh. A 200 sqyd plot is ₹55-70 lakh.

The self-construction economics that make this appealing to Punjab families: on a 200 sqyd plot you can construct G+2, approximately 5,400 sqft total. At ₹1,400-1,600/sqft for decent construction, total cost is ₹75-86 lakh. On top of the ₹60 lakh plot cost, total investment is ₹135-146 lakh for a 5,400 sqft private building with independent compound. Compare this to buying a flat: you cannot buy 5,400 sqft of flat anywhere in this corridor at ₹135 lakh.

The Kharar location specifics: Kharar is on the Ludhiana-Chandigarh highway, about 30 km from Ludhiana and 25 km from Chandigarh. This position is appealing for families with professional members in both cities. Post-COVID work-from-home normalisation has made this commute pattern more viable.

My recommendation: for Ludhiana families with the cash and construction management bandwidth, Sunny Enclave plots offer the best value per sqft available in the corridor.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Gurpreet Singh Ldh', content: `Sunny Enclave's two-decade history is its biggest endorsement. Every property professional in Ludhiana knows this colony — it has passed the longevity test that new launches haven't faced yet. The infrastructure maturity you described is accurate based on what I saw during a visit two years ago.`, daysAfter: 3 },
      { userName: 'Manpreet Dhillon',   content: `The comparison of 5,400 sqft building versus flat at same price is the most compelling argument for plotted construction in Punjab. The challenge is that most buyers don't have the bandwidth to manage construction — contractor coordination, material procurement, quality supervision. For families who have done this before or have a trusted contractor it works beautifully. For first-timers it can be stressful.`, daysAfter: 6 },
      { userName: 'Harpreet Kaur Ldh',  content: `The dual-city (Ludhiana + Chandigarh) commuter appeal is real. I know families where one parent works in Ludhiana and the other in Chandigarh — Kharar at the midpoint is practical for both even if not ideal for either. With work-from-home normalised for one spouse, this becomes even more manageable.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Jaswinder Grover',   score: 4, review: 'Mature infrastructure, proven location, generous space for money. Best choice for Ludhiana families with self-construction experience and 5-7 year holding horizon.' },
      { userName: 'Gurpreet Singh Ldh', score: 4, review: 'Sunny Enclave is proven and functional. Plot economics in Punjab beat flat economics for families who can manage construction. Strong recommendation.' },
    ],
  },
  {
    citySlug: 'ludhiana',
    propertyName: 'Chandigarh Road Corridor Projects',
    propertyType: 'APARTMENT',
    address: 'Chandigarh Road, Ludhiana 141010',
    developerName: 'Various Developers',
    developerSlug: 'various-developers',
    priceMin: 3500000, priceMax: 7000000,
    topic: {
      userName: 'Gurpreet Singh Ldh',
      title: 'Ludhiana-Chandigarh corridor real estate — investment case analysis',
      description: `The Ludhiana-Chandigarh highway corridor has been getting increasing real estate attention over the last two years and I want to provide a structured analysis of the investment case because the hype is getting ahead of the fundamentals in some cases.

The genuine drivers: the expressway upgrade project (Ludhiana-Chandigarh 4-lane to 6-lane) is approved and partially funded. When complete it will reduce travel time between the cities from 90 minutes to under 60 minutes. This is a meaningful change that legitimately improves the real estate case for the corridor. Industrial and logistics parks in the Ropar and Kharar sections are bringing employment. GITAM and other educational institutions near Chandigarh create a student housing catchment.

Projects in this corridor I've evaluated: BPTP Terra (National developer, fair quality at ₹48-60 lakh for 2BHK), a Gillco project in Kharar (established Punjab developer, good track record, ₹55-70 lakh for 2-3BHK), and several smaller local developer projects at ₹35-45 lakh range.

BPTP entering Punjab from their Delhi NCR base: their NCR projects have a mixed track record but the ones that delivered (BPTP Princess Park, BPTP Park Serene) are well-regarded. Punjab is a new market for them — watch the first 6-12 months of construction activity carefully before committing large amounts.

Gillco is the more established Punjab option. Their Sector 127 and 118 Mohali projects are functioning, well-maintained communities. In the Kharar stretch their product is likely to replicate that standard.

The caution: don't buy this corridor purely on the expressway upgrade timeline. It has slipped once already. The organic growth — employment, educational, residential demand — is the more reliable investment thesis. Price your investment on that foundation; the expressway accelerates the story but isn't the story itself.

Current realistic yield: rental at 2.8-3.2% gross on quality apartments. Capital appreciation at 8-12% annually over 5 years in the base case.`,
      daysAgo: 45,
    },
    comments: [
      { userName: 'Harpreet Kaur Ldh', content: `The expressway timeline caution is very fair. Government infrastructure projects in India consistently run later than announced. The correct investing approach is exactly what you described — base your investment thesis on organic fundamentals, treat expressway as upside optionality, not the core case.`, daysAfter: 4 },
      { userName: 'Jaswinder Grover',   content: `BPTP entering Punjab deserves specific tracking. When a large developer enters a new geography, their first 1-2 projects are usually executed carefully because the brand reputation is on the line in a new market. Later projects, once established, may see quality standardisation. If you're buying BPTP in Punjab, the first project may ironically be the best quality bet.`, daysAfter: 7 },
      { userName: 'Manpreet Dhillon',   content: `The 8-12% annual appreciation estimate over 5 years is realistic and importantly honest — not the 20-25% some brokers claim for this corridor. On base case fundamentals the estimate is reasonable. The expressway adds upside beyond this if it delivers on time.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Gurpreet Singh Ldh', score: 3, review: 'Good corridor with genuine fundamentals. Don\'t overpay on expressway hype. Base case organic growth justifies measured investment at current prices.' },
      { userName: 'Manpreet Dhillon',   score: 3, review: 'Balanced analysis. Gillco is the safest developer bet here. Returns are real but modest — don\'t expect speculative gains.' },
    ],
  },
  {
    citySlug: 'ludhiana',
    propertyName: 'Gillco Parkhills Ludhiana',
    propertyType: 'APARTMENT',
    address: 'Sector 123, Kharar-Ludhiana Road 140301',
    developerName: 'Gillco Developers',
    developerSlug: 'gillco-developers',
    priceMin: 5000000, priceMax: 8500000,
    topic: {
      userName: 'Harpreet Kaur Ldh',
      title: 'Gillco Parkhills Kharar — Ludhiana buyers considering Mohali corridor',
      description: `Many Ludhiana buyers are expanding their search to the Mohali-Kharar corridor because Ludhiana-based quality options in the ₹55-70 lakh range are limited for what you get. Gillco Parkhills is one project that Ludhiana buyers specifically ask me about, so here is a proper assessment.

Gillco Developers is a Punjab-based developer — they are not a national brand or a listed company, but they are as established in Punjab residential real estate as any developer in the state. Their Sector 127 and Sector 118 Mohali projects are occupied, functional communities where I personally visited and spoke to residents. The consistent feedback: delivery within 6 months of promised date, construction quality is good, society management is professional. This track record is worth a lot in a market where many developers make promises they don't keep.

Parkhills is on the Ludhiana-Chandigarh highway in the Kharar zone. The site is elevated relative to the main road — hence 'Parkhills' — which provides better air circulation and a view advantage over the flat projects on the highway frontage. The elevation is genuine, about 15-20 feet above road level.

Pricing: 2BHK at ₹55-62 lakh for 1,100-1,250 sqft, 3BHK at ₹68-78 lakh for 1,400-1,600 sqft. For Gillco quality in a location between two major cities, this represents fair value.

The honest limitation for Ludhiana buyers: this is not a Ludhiana address. If your work, social life, and family connections are Ludhiana-centric, the 30 km distance creates a genuine lifestyle friction. It works for families with members working in both cities, or for investment, or for buyers who are ready to relocate away from Ludhiana proper.

For NRI buyers from the Punjab diaspora looking to invest in the state without wanting specifically a Ludhiana address, Gillco Parkhills is genuinely compelling — the project's quality, location between cities, and Chandigarh-adjacent appreciation story are all relevant.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Jaswinder Grover',   content: `Gillco's delivery record in Mohali is one of the best in Punjab. Their Sector 127 project was delivered within 4 months of promised date and the society management they handed over has maintained quality for 3 years now. If Parkhills follows that pattern it's a strong investment.`, daysAfter: 2 },
      { userName: 'Gurpreet Singh Ldh', content: `The dual-city investment logic for NRIs is real — Punjab NRIs in the Gulf and UK specifically want to invest in the state but many want Chandigarh-adjacent rather than Ludhiana specifically for the cleaner city association and better planned infrastructure. Gillco Parkhills serves this demand well.`, daysAfter: 5 },
      { userName: 'Manpreet Dhillon',   content: `The elevation point about Parkhills is genuine — I visited the site and the hill positioning does give much better ventilation than the highway-frontage projects. In Punjab summers where heat and humidity combine, good ventilation is not a minor detail.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Harpreet Kaur Ldh', score: 4, review: 'Gillco track record is Punjab\'s best. Parkhills location serves the dual-city and NRI buyer perfectly. Quality per rupee is excellent.' },
      { userName: 'Jaswinder Grover',   score: 5, review: 'Gillco never disappoints. Parkhills elevated location and between-city position is a unique proposition. Strongly recommended for medium-term investment.' },
    ],
  },

  // ── AGRA ───────────────────────────────────────────────────────────────────
  {
    citySlug: 'agra',
    propertyName: 'Parsvnath Regalia Agra',
    propertyType: 'APARTMENT',
    address: 'Sikandra, Agra 282007',
    developerName: 'Parsvnath Developers',
    developerSlug: 'parsvnath-developers',
    priceMin: 4500000, priceMax: 8000000,
    topic: {
      userName: 'Seema Mittal Agra',
      title: 'Parsvnath Regalia Sikandra Agra — RERA compliant project deep dive',
      description: `I want to provide a thorough analysis of Parsvnath Regalia in Sikandra because RERA compliance is the first filter any Agra buyer should apply and this project passes it. In a city where several projects have gone off the rails, finding a credible mid-range option matters.

Parsvnath Developers is a listed company — not as large as DLF or Godrej but publicly traded and therefore subject to regulatory disclosure requirements. Their history includes some delayed projects (particularly in NCR) but their Agra project has been more disciplined. The specific reason: Agra's market scale means Parsvnath doesn't have the overextended capital problem they faced in NCR where they were running too many large projects simultaneously.

RERA verification I did personally: downloaded the UP RERA certificate, confirmed the RERA number matches what's on the sales brochure, cross-checked the sanctioned building plan against the actual construction on site, and confirmed the latest quarterly update had been filed. All checks passed. The completion date in RERA filing shows Q3 2026. Currently at 60% construction completion — on track.

Sikandra as a location in Agra: it sits on the Agra-Delhi NH-19, which means excellent highway access to Delhi (about 200 km, manageable day trip). The Agra bypass makes city connectivity good without needing to go through the congested city centre. Fatehabad Road — the main tourist corridor — is 6 km away, far enough to avoid tourist congestion but close enough for quick access. Social infrastructure: Sikandra has hospitals, schools, and markets that are functional for daily life.

Product: 2BHK at ₹48-55 lakh for 1,050-1,200 sqft. 3BHK at ₹62-75 lakh for 1,350-1,550 sqft. Floor plans are efficient — standard Parsvnath layout which is functional without being inspired. Ceiling height 9.5 feet. Bathroom fittings are mid-tier branded. No pool but a proper landscaped garden and covered parking.

For Agra buyers who want a credible developer with regulatory compliance above local market average, Regalia is a strong choice in the mid-range.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Ashish Agarwal Agra', content: `The listed company RERA compliance advantage is real. Parsvnath has shareholders and institutional investors who create indirect pressure to complete projects and file regulatory updates on time. The quarterly filing compliance you verified is itself a positive data point — many Agra developers don't bother with regular filings.`, daysAfter: 3 },
      { userName: 'Vinod Sharma Agra',   content: `Sikandra bypass access is genuinely one of Agra's better living zones for people who travel frequently. NH-19 gives you Delhi in 3 hours, Jaipur in 3.5 hours, Mathura in 1 hour. For businesspeople with multi-city travel patterns, this connectivity has real daily value.`, daysAfter: 6 },
      { userName: 'Kavita Bansal Agra',  content: `What are the maintenance charges post-possession? Parsvnath projects sometimes have structured maintenance that is professionally managed — slightly higher charges but services delivered. Worth asking the developer specifically and getting it in writing before booking.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Seema Mittal Agra',   score: 4, review: 'Best combination of RERA compliance, developer accountability and fair pricing in Agra. Sikandra location is practical and well-connected. Recommended for end-users.' },
      { userName: 'Ashish Agarwal Agra', score: 3, review: 'Solid mid-range choice with credible developer. RERA compliance and listed company status reduces risk significantly. Good Agra option.' },
    ],
  },
  {
    citySlug: 'agra',
    propertyName: 'Krishna Vatika Fatehabad Road',
    propertyType: 'APARTMENT',
    address: 'Fatehabad Road, Agra 282001',
    developerName: 'Krishna Builders Agra',
    developerSlug: 'krishna-builders-agra',
    priceMin: 5500000, priceMax: 10000000,
    topic: {
      userName: 'Vinod Sharma Agra',
      title: 'Krishna Vatika Fatehabad Road — Taj proximity real estate, investment or residence?',
      description: `Krishna Vatika on Fatehabad Road occupies a genuinely unique position in Agra real estate — it is within 3 km of the Taj Mahal, on the road that connects the monument to the main city. This proximity creates a two-headed investment story that I want to unpack carefully.

For primary residence: Fatehabad Road has its advantages and disadvantages. On the positive side, you are close to everything Agra has to offer — the tourist infrastructure means the road itself has excellent hotels, restaurants, banks, and service providers catering to international visitors, which as a resident you benefit from. The road is well-maintained (tourist corridor economics ensure this). The disadvantage: tourist congestion on Taj entry days (weekends, holiday periods) is real. The road from the southern gate to your building might be crowded. This is manageable if you plan around it.

For short-term rental investment: this is where the Fatehabad Road location becomes genuinely compelling. Agra receives millions of tourists annually — domestic and international — and quality short-stay accommodation near the Taj is chronically under-supplied. A well-maintained 2BHK apartment listed on Airbnb/booking platforms at ₹3,500-5,000 per night can achieve 40-60% occupancy. Annual rental revenue: ₹8-14 lakh. On a ₹65 lakh investment that's 12-20% gross yield. No other Agra real estate investment can approach these numbers.

Krishna Builders is a local Agra developer. One completed project nearby — the residents I spoke to were broadly satisfied with construction quality (decent, not exceptional) and delivery (5 months late, eventually completed). They are not a large or nationally recognised developer. Do your legal due diligence carefully — title verification, RERA status, all regulatory approvals.

My assessment: for a sophisticated investor comfortable with active management (Airbnb hosting or professional listing service) the investment case is strong. For passive investment or primary residence, the risk-reward relative to a project like Parsvnath Regalia is less clearly favourable.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Seema Mittal Agra',  content: `The Airbnb case you've laid out is mathematically compelling. My sister runs a guesthouse on Fatehabad Road and confirms the occupancy and rate levels you mentioned. Quality apartments near Taj are consistently in demand because the hotel options at this proximity are expensive and some tourists prefer the apartment experience for groups or families.`, daysAfter: 2 },
      { userName: 'Kavita Bansal Agra', content: `Before committing to the short-term rental strategy, research the Agra municipal regulations on commercial use of residential apartments. The tourist zone proximity sometimes attracts stricter oversight and some housing societies have rules against Airbnb-type letting. Verify both the legal framework and any society bylaws before pricing in this yield.`, daysAfter: 5 },
      { userName: 'Ashish Agarwal Agra', content: `The local developer risk you mentioned is real and important. For a passive buy-and-forget investment I would want a developer with stronger credentials. But if you're willing to verify title carefully and monitor construction, the location logic is hard to argue with. No other Agra location can claim 3 km to the Taj with this price point.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Vinod Sharma Agra',  score: 3, review: 'Unique tourism investment play with mathematically compelling short-term rental yields. Local developer risk requires extra diligence. Not for passive investors.' },
      { userName: 'Seema Mittal Agra',  score: 4, review: 'Fatehabad Road proximity justifies premium for active Airbnb investors. Tourism demand near Taj is durable. Verify society rules on short-term letting.' },
    ],
  },
  {
    citySlug: 'agra',
    propertyName: 'Jaypee Sun Court Agra',
    propertyType: 'APARTMENT',
    address: 'Yamuna Expressway, Agra 283102',
    developerName: 'Jaypee Group',
    developerSlug: 'jaypee-group',
    priceMin: 4000000, priceMax: 7500000,
    topic: {
      userName: 'Kavita Bansal Agra',
      title: 'Jaypee Sun Court Agra Expressway — completed township resale review',
      description: `Jaypee Sun Court near the Yamuna Expressway in Agra is a completed township — no delivery risk, functioning community, resale units available at compelling prices. This changes the evaluation entirely from under-construction risk assessment to a community and value analysis.

Jaypee Group nationally has a complicated reputation — their Wish Town Noida project remains unresolved for thousands of buyers. However, their Agra expressway projects operate under a different financial entity and have been funded through the expressway monetisation model. Sun Court specifically has been delivered, residents have moved in, and the community has been functioning for 4+ years. Whatever Jaypee's issues elsewhere, Sun Court Agra is a delivered fact.

The resale value proposition: a 3BHK in Sun Court at ₹45-58 lakh for 1,400-1,700 sqft is excellent value by any NCR-adjacent market metric. For comparison: similar sized units in Crossings Republik Ghaziabad (200 km away) start at ₹70 lakh. The Agra location discount relative to Delhi metro proximity is real and arguably larger than fundamentals justify.

Community quality 4 years in: the RWA is active and functional. Monthly maintenance of ₹3-4 per sqft is being collected and utilised. The park areas are maintained. The internal roads are in decent condition. The pool is operational seasonally. This is a community that has found its rhythm.

The location trade-off: 8 km from Agra city centre means you are car-dependent for all city activities. The expressway position is excellent for Delhi-Agra travel (Delhi is 3-3.5 hours by car) but inconvenient for daily Agra city errands. For families with personal transportation and primarily city-centre employment, this is workable. For families dependent on public transport or close to city services, it creates daily friction.

Recommendation: resale buyer who wants a completed gated community in Agra at market-leading value, this is the best option currently. Primary residence viability depends on your daily mobility situation.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Vinod Sharma Agra',   content: `The distinction between Jaypee's national reputation and the specific Sun Court Agra situation is important and you've made it correctly. This project is delivered, OC is in hand, society is functioning. Resale buyers are not exposed to construction risk. The ₹45-58 lakh for 3BHK in a functioning gated community is genuinely excellent value.`, daysAfter: 3 },
      { userName: 'Ashish Agarwal Agra', content: `The RWA meeting minutes check I always recommend: ask the seller to share the last 3 months of RWA meeting minutes before finalising. This tells you about maintenance fund status, any pending disputes, and the quality of community governance. In a 4-year-old society like Sun Court these records should be readily available.`, daysAfter: 6 },
      { userName: 'Seema Mittal Agra',   content: `Delhi-Agra expressway 3-3.5 hour journey for a ₹50 lakh 3BHK in a functioning gated community — this is the proposition that makes Sun Court interesting for Delhi-based buyers who want a weekend/retirement home at a fraction of Delhi prices. Several colleagues have done this exact purchase.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Kavita Bansal Agra',  score: 4, review: 'Best value in completed gated communities near Agra. No delivery risk, functioning society, excellent sqft-per-rupee. Car dependency is the trade-off.' },
      { userName: 'Vinod Sharma Agra',   score: 4, review: 'Jaypee Sun Court resale is one of the best value propositions in the Agra-NCR corridor. Immediate possession and 4-year proven community operation.' },
    ],
  },
  {
    citySlug: 'agra',
    propertyName: 'Agra Civil Lines Premium',
    propertyType: 'APARTMENT',
    address: 'Civil Lines, Agra 282002',
    developerName: 'Various Builders',
    developerSlug: 'various-builders',
    priceMin: 8000000, priceMax: 18000000,
    topic: {
      userName: 'Ashish Agarwal Agra',
      title: 'Civil Lines Agra — Agra\'s most established residential address, market analysis',
      description: `Having spent 10 months researching Agra's real estate market comprehensively, I want to write specifically about Civil Lines because it remains misunderstood in the context of an emerging market like Agra.

Civil Lines in Agra, like Civil Lines in Kanpur and Lucknow, is the colonial-era planned residential zone. Broad roads, mature tree cover, proximity to administrative and judicial infrastructure, and the social network of established Agra families. The character is fundamentally different from new townships or expressway projects.

Market reality: Civil Lines Agra has very limited new construction — the area is largely built out and development regulations near the ASI-protected zone restrict building heights. Almost all transactions here are resale. 3BHK apartments of 1,800-2,500 sqft (old construction, which typically means generous room sizes and solid structure) are available at ₹80 lakh to ₹1.4 crore. The variation depends on building condition, floor, and proximity to the better maintained sections of Civil Lines.

Who buys here: senior government officials and judges (proximity to High Court bench, Collector office), established Agra business families who have been resident in this area for generations, and NRI Agraites returning to their home city. This is not an aspirational purchase audience — this is a community of people who know exactly what they want.

Price stability: Civil Lines Agra values have moved at roughly 6-8% annually for a decade. They don't crash because this audience doesn't buy for speculation — they buy for generational holding. And they don't spike because there's no new supply excitement to drive momentum.

For buyers who have the budget (₹80 lakh+) and value established community over modern amenities, Civil Lines resale offers something that no new Agra construction can replicate: a settled, mature, secure address with decades of established community character.`,
      daysAgo: 15,
    },
    comments: [
      { userName: 'Kavita Bansal Agra',  content: `Civil Lines Agra is exactly the kind of locality you've described. My father has lived there for 35 years. The community quality — people you can count on as neighbours, established social networks, the general culture of the area — is genuinely irreplaceable. No new township has this.`, daysAfter: 2 },
      { userName: 'Seema Mittal Agra',   content: `The ASI protected zone building restriction is worth explaining to buyers unfamiliar with Agra: significant parts of the city have height restrictions due to proximity to the Taj Mahal and other protected monuments. This creates genuine land scarcity in prime areas and is part of why Civil Lines supply is constrained. Constrained supply with stable demand equals stable values.`, daysAfter: 5 },
      { userName: 'Vinod Sharma Agra',   content: `For NRI buyers specifically, Civil Lines Agra has a cultural resonance — it is where the educated, administrative class of Agra has always lived. For Agra-origin NRIs who want to maintain a connection to their home city, this address carries meaning beyond its real estate metrics.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Ashish Agarwal Agra', score: 4, review: 'Civil Lines Agra is for buyers who know what they want — established community, stable value, irreplaceable character. Not for amenity seekers. The best long-term wealth preservation in Agra.' },
      { userName: 'Kavita Bansal Agra',  score: 5, review: 'Agra\'s most enduring address. The community quality and social infrastructure cannot be manufactured. Buy here if you can afford it and value permanence over modernity.' },
    ],
  },
  {
    citySlug: 'agra',
    propertyName: 'Supertech Cape Town Agra',
    propertyType: 'APARTMENT',
    address: 'NH-19, Agra 282001',
    developerName: 'Supertech Limited',
    developerSlug: 'supertech-limited',
    priceMin: 3800000, priceMax: 6500000,
    topic: {
      userName: 'Vinod Sharma Agra',
      title: 'Supertech Cape Town Agra — developer caution with honest location assessment',
      description: `I'm writing this because Supertech Cape Town on NH-19 keeps coming up in Agra property searches due to its attractive pricing (₹38-65 lakh for 2BHK and 3BHK), and I want buyers to have a complete picture before engaging.

The Supertech situation nationally: the Supreme Court ordered demolition of their Noida twin towers. Multiple projects across NCR have thousands of buyers in distress due to non-delivery. The developer has been through NCLT proceedings. This context is not irrelevant to any Supertech project evaluation, even in Agra.

The Cape Town project specific situation as I found it: the project is RERA registered under UP RERA. Construction is visible and ongoing at the site — this is not an abandoned project. The construction progress shown on RERA quarterly updates has been filed, though with some irregularity. I spoke with two buyers who had booked early — both had received a tripartite agreement with bank disbursement linked to construction milestones, which provides a degree of protection.

NH-19 location is genuinely good for Agra: the national highway gives excellent connectivity to Delhi (3 hours), Mathura (50 minutes), and the city centre is accessible via the bypass. The location logic is sound.

My honest recommendation: if you are considering Supertech Cape Town, take the following specific steps — insist on tripartite agreement with your home loan bank where disbursements go against construction completion certificates, get a property lawyer to verify the title and all approvals, and physically visit the site at least twice to verify actual construction activity. At this price point if the project delivers, the location is good value. But the developer risk requires you to do more due diligence than you would for Parsvnath or any listed developer.

If you cannot do this level of diligence, choose Parsvnath Regalia at slightly higher prices and sleep better.`,
      daysAgo: 50,
    },
    comments: [
      { userName: 'Ashish Agarwal Agra', content: `The tripartite agreement advice is critical. This instrument — where the bank disburses directly to the developer's project account against construction milestones certified by an independent engineer — protects buyers from the developer using new buyer money to service old debts. Any serious buyer of any under-construction project should insist on this, not just for Supertech.`, daysAfter: 3 },
      { userName: 'Kavita Bansal Agra',  content: `The NCLT situation at Supertech's national level has made banks and NBFCs more cautious about disbursing loans for their projects. Some lenders have actually stopped financing Supertech projects across India. If your bank tells you they won't finance Cape Town Agra, take that as a significant signal about project risk.`, daysAfter: 6 },
      { userName: 'Seema Mittal Agra',   content: `For the same price range and even at a slight premium, Parsvnath Regalia offers a listed, RERA-compliant developer with Agra-specific track record. The extra ₹5-8 lakh you might pay at Parsvnath buys you sleep and significant risk reduction. This comparison should be the primary decision framework for Agra budget buyers.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Vinod Sharma Agra',  score: 2, review: 'Location is good but developer risk is real and documented nationally. Only approach with tripartite banking protection, legal counsel, and advanced construction stage.' },
      { userName: 'Seema Mittal Agra',  score: 2, review: 'Parsvnath Regalia at slightly higher prices is the better risk-adjusted choice. The Supertech brand risk is too significant to ignore for most buyers.' },
    ],
  },

  // ── NASHIK ─────────────────────────────────────────────────────────────────
  {
    citySlug: 'nashik',
    propertyName: 'Kumar Parc Residence Nashik',
    propertyType: 'APARTMENT',
    address: 'Gangapur Road, Nashik 422013',
    developerName: 'Kumar Properties',
    developerSlug: 'kumar-properties',
    priceMin: 6500000, priceMax: 11000000,
    topic: {
      userName: 'Sunita Sawant Nashik',
      title: 'Kumar Parc Residence Gangapur Road Nashik — Pune quality arrives in Nashik',
      description: `Kumar Properties — the Pune developer behind Kumar Primus and Kumar Palmspring — has launched Parc Residence in Nashik on Gangapur Road, and this is genuinely significant news for the Nashik market. I want to explain why this launch matters and whether the product delivers.

Kumar Properties in Pune is associated with a specific quality marker: they build honest, well-planned apartments without the marketing excess that plagues many premium developers. No atrium lobbies that eat your carpet area, no sky decks that exist only in CG renders, no clubhouses that are half the promised size. What they promise is what gets delivered. This reputation has been built over 25 years in Pune and residents of their projects are consistently among the most satisfied in that market.

Bringing this to Nashik on Gangapur Road — which is Nashik's most aspirational address for the upper-middle-class buyer — is a smart market move. Gangapur Road has the wineries, the greenery, the air quality. The social profile of buyers gravitating there is high-income professionals and business families. Kumar's product tier matches this buyer exactly.

Parc Residence specifics: 3BHK at ₹70-85 lakh for 1,550-1,750 sqft. The specifications include Kohler bathrooms in the master bedroom, Kajaria tiles throughout, modular kitchen with Hettich hardware, 4-pipe VRV AC provision in living and master bedroom. These are substantive specifications that go beyond sample flat cosmetics — the brands used are consistent with what they deliver in Pune projects.

Construction progress at 9 months post-launch: G+5 floors completed of 15 total. This pace is fast — it tells you the developer has proper construction financing and is not waiting for buyer payments to fund each floor. Fast construction = lower completion risk.

Gangapur Road appreciation trajectory: this corridor has shown 12-15% annual appreciation over the last 5 years as Nashik's premium buyer class has grown. Kumar's presence here will itself accelerate appreciation by establishing a quality benchmark that adjacent plots will be valued against.`,
      daysAgo: 18,
    },
    comments: [
      { userName: 'Amol Kulkarni Nashik',  content: `Kumar Properties delivering Pune quality in Nashik at Nashik prices — that's the value proposition in one line. In Pune, a comparable Kumar project would cost ₹1.1-1.2 crore. In Nashik it's ₹75-80 lakh. The quality gap between the cities has just narrowed significantly for buyers who care about the right things.`, daysAfter: 2 },
      { userName: 'Nilesh Borse',          content: `The construction pace is the most reassuring detail you've shared. A developer who is at floor 5 of 15 at 9 months post-launch has clearly not used launch proceeds to repay other debts first. The construction-to-timeline ratio indicates healthy project financing.`, daysAfter: 5 },
      { userName: 'Pooja Deshmukh Nashik', content: `Gangapur Road's appreciation has been driven by organic demand — people who can afford premium actually want to live there for the lifestyle. Kumar's entry will further professionalise the market. The winery-proximity and cooler Nashik climate are lifestyle advantages that Pune's flat geography cannot offer.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Sunita Sawant Nashik',  score: 5, review: 'Kumar brings the quality benchmark Nashik premium market needed. Gangapur Road location is irreplaceable. Fast construction pace reduces risk. Highly recommended.' },
      { userName: 'Amol Kulkarni Nashik',  score: 5, review: 'Best new launch in Nashik this year. Pune quality at Nashik prices is the simple and compelling value proposition. Buy before Kumar brand drives prices up.' },
    ],
  },
  {
    citySlug: 'nashik',
    propertyName: 'Gajraj Greens Gangapur Road',
    propertyType: 'APARTMENT',
    address: 'Gangapur Road, Nashik 422005',
    developerName: 'Gajraj Constructions',
    developerSlug: 'gajraj-constructions',
    priceMin: 5000000, priceMax: 9000000,
    topic: {
      userName: 'Pooja Deshmukh Nashik',
      title: 'Gajraj Greens Gangapur Road Nashik — green concept housing and vineyard belt lifestyle',
      description: `Gajraj Greens on Gangapur Road has been marketing itself around the green lifestyle concept — the vineyard belt proximity, the cooler Nashik climate, the emphasis on outdoor living. I spent three weekends visiting the project and the surrounding area before writing this review, because lifestyle claims deserve actual weekend-morning testing.

Gajraj Constructions is a Nashik-based developer with a 15-year history in the city. Their completed Gajraj Heights project near Panchavati is well-regarded locally — residents I spoke to gave positive assessments on delivery timing and construction quality. One project failure was a smaller apartment building where possession was 18 months late — the developer acknowledges this and attributes it to contractor issues that caused one-time delay. Subsequent projects have been on track.

The green credentials I can assess: the 50%+ open area ratio is confirmed in the RERA filing (not just a marketing claim). The landscaping investment is visible — native trees including varieties suited to Nashik's climate, not just palm trees placed for photography. The walking path within the compound runs along a designed water channel. These are not incidental — someone planned them deliberately.

The vineyard belt proximity: Gangapur Road runs through or adjacent to several of Nashik's working wineries — Sula, York, Soma. This is not a gimmick for wine tourists. For residents, it means morning air quality that is genuinely different from urban Nashik. I tested this — the Gangapur Road air quality at 6:30 am is measurably fresher than the MIDC or Dwarka areas. Nashik also gets adequate rainfall to keep the greenery actually green through most of the year, unlike many Pune projects that turn dry and dusty by February.

Project pricing: 2BHK at ₹52-62 lakh for 1,100-1,280 sqft. 3BHK at ₹68-80 lakh for 1,400-1,600 sqft. For the location and the green concept execution, this represents fair value — not budget, not luxury, but correctly priced for what's delivered.`,
      daysAgo: 40,
    },
    comments: [
      { userName: 'Sunita Sawant Nashik',  content: `The weekend morning air quality test is exactly the kind of personal research more buyers should do. You can read specifications online all day but standing on the site at 6:30 am tells you something visceral about whether you'd want to live there. Gangapur Road passes this test and you've described it accurately.`, daysAfter: 3 },
      { userName: 'Nilesh Borse',          content: `Gajraj's explanation of the one late delivery is fair. Contractor issues causing a one-time delay are different from systematic developer malpractice. What matters is the pattern — and the pattern since then has been on-track delivery. This is the kind of track record analysis that separates careful buyers from superficial ones.`, daysAfter: 6 },
      { userName: 'Amol Kulkarni Nashik',  content: `The Sula-York-Soma proximity is genuinely unique among major Indian cities. Nashik is India's wine country and buying a home within reach of working vineyards is an experience available in very few places. For buyers who appreciate this, the premium over MIDC or Dwarka area apartments is entirely justified.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Pooja Deshmukh Nashik', score: 5, review: 'Best lifestyle project in Nashik. Gangapur Road vineyard belt is irreplaceable. Green concept is verified, not just marketed. Gajraj track record is solid. Highly recommended.' },
      { userName: 'Amol Kulkarni Nashik',  score: 4, review: 'Premium location, genuine green credentials, reliable developer. Priced fairly for what\'s delivered. Buy before Kumar and Kolte Patil drive this corridor\'s prices further.' },
    ],
  },
  {
    citySlug: 'nashik',
    propertyName: 'Amit Astonia Royale',
    propertyType: 'APARTMENT',
    address: 'Ambad MIDC, Nashik 422010',
    developerName: 'Amit Enterprises',
    developerSlug: 'amit-enterprises',
    priceMin: 4500000, priceMax: 8000000,
    topic: {
      userName: 'Nilesh Borse',
      title: 'Amit Astonia Royale Ambad MIDC Nashik — practical mid-segment review',
      description: `Amit Enterprises is one of Nashik's most established local developers and Astonia Royale in Ambad is their attempt to move upmarket from their earlier mid-segment projects. I want to give a practical assessment for buyers in the ₹48-65 lakh range who want a credible Nashik developer.

Amit Enterprises track record in Nashik: I verified their previous 5 projects on MahaRERA (Maharashtra RERA). Four of five were delivered within 6 months of promised date. One had a significant delay (12 months) due to disputed land title that was eventually resolved. The MahaRERA filing dates for quarterly updates in Astonia Royale have been regular — not every developer bothers with this, and it signals administrative discipline.

Ambad MIDC location context: Ambad is Nashik's industrial hub. The MIDC area has textile manufacturers, pharmaceutical companies, and several auto-component suppliers. This industrial base creates steady employment and consequently steady rental demand from professionals working in these companies. The commute from Astonia to the MIDC is 5-10 minutes. For IT professionals, the distance to Nashik's software park on the Pune Road is also manageable.

The 'Royale' product positioning compared to Amit's earlier projects: the improvement is genuine. Vitrified tile throughout (not ceramic), Jaquar fittings in bathrooms (not generic), modular kitchen framework included (rare at this price in Nashik), and ceiling height at 10 feet (their earlier projects were 9 feet). These are deliberate quality steps up.

What stood out on site visit: the power backup system. Astonia Royale provides 100% backup for common areas (standard) and 500VA UPS per apartment for essential circuits (lights, fan, one plug point per room). This covers basic daily needs during Nashik's brief but real power cuts. At this price point in Nashik this is above average provision.

Floor plans: the 2BHK at 950 sqft is compact but well-planned. Master bedroom allows king bed. The second bedroom is large enough for two single beds or a double. Kitchen is a working kitchen with space for a small dining table adjacent — important for practical daily living.`,
      daysAgo: 45,
    },
    comments: [
      { userName: 'Pooja Deshmukh Nashik', content: `Amit Enterprises has been building honest projects in Nashik for nearly 15 years. They are not glamorous marketers but their track record speaks for itself. The MahaRERA quarterly update discipline you highlighted is something I also noticed — many Nashik developers are casual about filings.`, daysAfter: 2 },
      { userName: 'Amol Kulkarni Nashik',  content: `The 10 feet ceiling upgrade from their previous projects is significant for Nashik buyers — the city gets warm summers and higher ceilings genuinely improve thermal comfort even without air conditioning. It's a daily quality-of-life detail that residents will appreciate for decades.`, daysAfter: 5 },
      { userName: 'Sunita Sawant Nashik',  content: `Ambad rental demand is steady and will remain so as long as MIDC companies continue operating there. I know buyers who bought Ambad apartments purely for rental income — at ₹10,000-12,000/month rent on a ₹50 lakh investment that's a 2.4-2.8% gross yield which is fair for a growing industrial town.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Nilesh Borse',          score: 4, review: 'Amit Enterprises is Nashik\'s most trustworthy mid-range developer. Astonia Royale upgrades quality noticeably from their earlier work. Power backup provision is a practical differentiator.' },
      { userName: 'Sunita Sawant Nashik',  score: 4, review: 'Practical choice for MIDC-area buyers and investors. MahaRERA compliance, honest track record, improved specifications. Recommend.' },
    ],
  },
  {
    citySlug: 'nashik',
    propertyName: 'Mahindra Happinest Nashik',
    propertyType: 'APARTMENT',
    address: 'Igatpuri Road, Nashik 422003',
    developerName: 'Mahindra Lifespaces',
    developerSlug: 'mahindra-lifespaces',
    priceMin: 2600000, priceMax: 5500000,
    topic: {
      userName: 'Amol Kulkarni Nashik',
      title: 'Mahindra Happinest Nashik — affordable housing done with Mahindra quality standards',
      description: `Mahindra Happinest in Nashik represents something that is genuinely rare in Indian real estate: a large, credible, listed developer applying institutional quality standards to the affordable housing segment. This deserves serious examination because the market for ₹28-50 lakh housing in Nashik is dominated by small local builders with inconsistent quality.

Mahindra Lifespaces is Mahindra Group's real estate arm — publicly listed, governed by Mahindra Group standards, and part of one of India's most respected industrial conglomerates. The Happinest brand is specifically their affordable housing initiative and has been deployed in Kalyan (Mumbai), Avadi (Chennai), and Palghar — all with consistent positive reviews.

The Nashik project: 1BHK starting at ₹28 lakh and 2BHK starting at ₹38 lakh. These are absolute prices that are unusual for a developer of this quality tier. How does Mahindra make the economics work? Large land parcel (50+ acres in Nashik), high density tower design, standardised construction systems, and volume purchasing of materials.

Floor plan efficiency: I attended the launch event and the 1BHK at 480 sqft is honestly impressive for the size. The layout uses every sqft — no wasted corridor, the kitchen is a proper 2-burner cooking setup (not a single row galley), and the bathroom is full-sized. This is thoughtful design, not just small rooms.

Mahindra brand delivery guarantee: their track record across all Happinest projects is consistent. No RERA complaints outstanding in any Happinest city. Quarterly RERA updates are filed without exception. When Mahindra says Q4 2025 possession for Phase 1, that is a credible timeline backed by construction systems rather than optimistic sales promises.

For a first-time buyer with ₹30-40 lakh budget in Nashik, Mahindra Happinest removes the most common risk in this segment: builder non-delivery. This is worth paying the slight premium over anonymous local developers.`,
      daysAgo: 32,
    },
    comments: [
      { userName: 'Nilesh Borse',          content: `The Mahindra brand guarantee in affordable housing is exactly the market solution this segment needs. First-time buyers in Nashik have been burned by small developers who take money and stall construction. A Mahindra backing removes that fear. For buyers who cannot afford legal counsel and financial advisors to do due diligence, a trusted brand is the substitute.`, daysAfter: 3 },
      { userName: 'Sunita Sawant Nashik',  content: `My friend has a Happinest 1BHK in Kalyan. The space efficiency is genuinely impressive — she hosts family visits in a 480 sqft flat without it feeling cramped because every cm is used thoughtfully. If the Nashik project achieves the same design efficiency, it's remarkable value at ₹28-30 lakh.`, daysAfter: 6 },
      { userName: 'Pooja Deshmukh Nashik', content: `Igatpuri Road location is the trade-off — it's on Nashik's outskirts and connectivity to the city centre and MIDC requires a 30-40 minute commute. But for ₹28-38 lakh what did we expect? The Mahindra quality at this price point with this location is still a better deal than a small developer project in a more central area.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Amol Kulkarni Nashik',  score: 5, review: 'Mahindra Happinest is the most important affordable housing launch in Nashik. Brand reliability eliminates delivery risk for budget buyers. Exceptional design efficiency for the price.' },
      { userName: 'Nilesh Borse',          score: 4, review: 'Mahindra quality in the ₹28-38 lakh range is genuinely transformative for Nashik affordable buyers. Igatpuri location is the only trade-off. Strongly recommended for first-time buyers.' },
    ],
  },
  {
    citySlug: 'nashik',
    propertyName: 'Kolte Patil iTowers Nashik',
    propertyType: 'APARTMENT',
    address: 'Satpur MIDC, Nashik 422007',
    developerName: 'Kolte Patil Developers',
    developerSlug: 'kolte-patil-developers',
    priceMin: 5000000, priceMax: 9500000,
    topic: {
      userName: 'Nilesh Borse',
      title: 'Kolte Patil iTowers Nashik — Pune developer consistency arrives in Nashik market',
      description: `Kolte Patil Developers needs no introduction in Pune — their iTowers brand across multiple Pune locations has set a quality standard for tech-professional housing. The Nashik iTowers launch is the same product philosophy applied to a different city: well-planned apartments near the industrial and IT catchment, solid construction, competitive pricing.

Satpur MIDC is the right location for this product. The MIDC area has companies in pharmaceuticals, auto components, and consumer goods that employ thousands of engineers and managers. These are exactly the buyers the Kolte Patil iTowers brand targets — degree-educated, quality-conscious professionals who appreciate good construction without paying luxury prices.

Kolte Patil's Nashik decision came after they successfully completed a Nashik project for a smaller community 3 years ago — they built credibility locally before launching a larger project. This is a conservative and responsible developer approach compared to developers who enter new cities with large marketing and no local track record.

iTowers Nashik specific product: 2BHK at ₹52-62 lakh for 1,080-1,200 sqft. 3BHK at ₹68-78 lakh for 1,350-1,500 sqft. Kolte Patil's standard package — branded fittings (Cera bathrooms, Kajaria tiles), cross ventilation design, 10 feet ceiling, proper power backup (100% for common areas, 1kVA per flat). Their quality consistency across projects means the Nashik flat will look and feel like the Pune flat five years after possession.

The commute from Satpur to key Nashik employment zones: MIDC is on-site (5 minutes walk to many companies), Nashik Road railway station 8 km, city centre 12 km. Not ideal for city-centre workers but near-perfect for MIDC professionals.

RERA: MahaRERA registered, quarterly updates current, possession timeline June 2026 for Phase 1. Kolte Patil has never missed a MahaRERA filing and their possession track record in Pune is within 3 months of promised dates. No reason to expect different in Nashik.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Amol Kulkarni Nashik',  content: `Kolte Patil's smaller earlier Nashik project that you mentioned — I know which one. It was a 40-unit project near Gangapur Road. Residents there are satisfied. The builder understood the Nashik market before scaling up. This is exactly the right approach and gives me confidence in iTowers.`, daysAfter: 2 },
      { userName: 'Pooja Deshmukh Nashik', content: `The 1kVA per flat power backup is better than what most Nashik developers provide. It means you can run your refrigerator, television, and a fan during a power cut without a separate inverter investment. For Nashik's brief monsoon power cuts this is adequate and a genuine quality detail.`, daysAfter: 5 },
      { userName: 'Sunita Sawant Nashik',  content: `Kolte Patil entering Nashik is part of a broader pattern of Pune developers eyeing Nashik as the next growth market. Kumar Properties, Kolte Patil, Rohan — all Pune names entering Nashik. This developer migration is itself a validation of Nashik's market maturity. Property values here will align more closely to Pune over the next decade.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Nilesh Borse',          score: 4, review: 'Kolte Patil quality is consistent and verifiable from their Pune track record. Satpur location is practical for MIDC professionals. Fair pricing for the quality delivered.' },
      { userName: 'Pooja Deshmukh Nashik', score: 4, review: 'iTowers Nashik delivers the Kolte Patil quality promise to a new market. Recommended for Nashik MIDC professionals who want reliability over speculation.' },
    ],
  },
  {
    citySlug: 'nashik',
    propertyName: 'Rohan Ekam Nashik',
    propertyType: 'APARTMENT',
    address: 'Nashik Road, Nashik 422101',
    developerName: 'Rohan Builders',
    developerSlug: 'rohan-builders',
    priceMin: 5500000, priceMax: 9000000,
    topic: {
      userName: 'Pooja Deshmukh Nashik',
      title: 'Rohan Ekam Nashik Road — honest builder, sensible product, practical location',
      description: `Rohan Builders has been in Nashik for about 8 years, delivering mid-segment apartments that consistently underperform in marketing hype and overperform in actual quality. This is the kind of developer that forums don't discuss enough because they don't pay for coverage and their marketing is restrained.

Rohan Ekam at Nashik Road is their current major project: 2BHK at ₹56-64 lakh for 1,100-1,250 sqft, 3BHK at ₹70-82 lakh for 1,400-1,600 sqft. These are fair prices for the product quality. The MahaRERA filing is current, possession timeline December 2025 for Phase 1, current construction at floor 10 of 16 — ahead of schedule.

Nashik Road location: this is one of Nashik's most functionally connected areas. Nashik Road railway station (Nasik Road on railway maps) is the main junction for the city with trains to Mumbai, Pune, Delhi, and all major cities. The railway connectivity here is genuinely significant — a 2BHK within 2 km of a major railway junction is a different investment from one that's only highway-accessible.

Social infrastructure on Nashik Road is mature: established markets, hospitals, schools, banks. The Nashik Road market area has been commercial for decades. You are not buying into a future that might or might not materialise — you are buying into established present reality.

Construction quality assessment: I visited with a friend who is a civil engineer in Nashik's construction sector. His verdict on Rohan Ekam: structural work above average, shuttering quality is good (which means flat surfaces, no wave in concrete), brick bonding is done with proper mortar bed. The construction crew foreman knew his work — visible in how the site was organised and supervised.

Rohan's approach to sales: no pressure, transparent pricing, will hand you a rate card and let you think. This cultural signal about how a developer treats buyers predicts how they treat residents after possession. Developers who are pushy in sales are often absent post-possession.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Nilesh Borse',          content: `Rohan Builders' no-pressure sales culture is real — I evaluated three of their Nashik projects. Every time the sales team provided information without urgency tactics. This approach correlates with post-possession behaviour — they have an RWA support system post-possession that local developers usually don't maintain.`, daysAfter: 2 },
      { userName: 'Amol Kulkarni Nashik',  content: `Nashik Road railway station proximity is undervalued in Nashik real estate discussions. In a city that has limited metro/suburban rail, the main line railway connectivity provides genuine mobility that residents of purely highway-adjacent projects don't have. For buyers who travel frequently by train, this adds substantial daily-life value.`, daysAfter: 5 },
      { userName: 'Sunita Sawant Nashik',  content: `Floor 10 of 16 with December 2025 possession — that is fast construction for a Nashik project and I would be comfortable that the timeline is realistic. My experience with Nashik developers: those who get to 60% construction by this point in the timeline almost always deliver within the promised window.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Pooja Deshmukh Nashik', score: 4, review: 'Rohan Ekam delivers quality without hype. Nashik Road location with railway connectivity is a genuine advantage. Transparent developer culture predicts good post-possession behaviour.' },
      { userName: 'Amol Kulkarni Nashik',  score: 4, review: 'Solid mid-segment project from a trustworthy Nashik developer. Railway connectivity is underrated. Good for end-users who travel by train.' },
    ],
  },

  // ── PATNA ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'patna',
    propertyName: 'Omaxe City Patna',
    propertyType: 'APARTMENT',
    address: 'Phulwari Sharif, Patna 801505',
    developerName: 'Omaxe Limited',
    developerSlug: 'omaxe-limited',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Rajan Kumar Patna',
      title: 'Omaxe City Phulwari Sharif Patna — township living in Bihar, honest evaluation',
      description: `Omaxe City in Phulwari Sharif is a project I want to assess honestly because it is Patna's most marketed township and the gap between marketing claims and lived reality deserves examination from someone who has been living here for 18 months.

Background: I booked in the project two years ago, paid on schedule, and took possession 5 months later than promised. The delay was real and Omaxe did not communicate proactively about it — I had to chase them for updates. This is a consistent complaint from other residents. Post-possession, however, the township has functioned better than I expected.

Why I still rate this project positively overall: the township model itself is the right answer for Patna in 2024. The city outside Omaxe City has infrastructure that is genuinely unreliable — power cuts, water supply issues, poor roads in many areas. Inside the township compound: power backup is reliable (common areas and homes both have meaningful backup), water supply from an internal treatment plant has not failed in 18 months of living, roads are maintained and well-lit, security is 24-hour functional not just nominal.

Phulwari Sharif is 12 km from Patna main city. The commute in traffic is 40-55 minutes which is the standard drawback. The Patna Metro Phase 2 planned alignment passes near this area — if implemented it will dramatically improve connectivity. If not (metro timelines in Bihar are genuinely uncertain), the commute remains the primary living friction.

Flat quality: builder grade, appropriate for a mass-market township. The 3BHK at 1,300 sqft is functional. Construction is not exceptional but has held up — no seepage after two Bihar monsoons, which are serious. The plastering is not perfect (some wall surface unevenness) but nothing that affects daily living.

Net assessment for prospective buyers: if you need a gated community lifestyle in Patna and can accept 12 km from city, Omaxe City is currently the most functional option in this category.`,
      daysAgo: 30,
    },
    comments: [
      { userName: 'Priya Singh Patna',  content: `I also live in Omaxe City. The possession delay was real — my flat came 7 months late. But I agree with your post-possession assessment completely. The township infrastructure reliability is the thing. In a city where power cuts of 4-6 hours were normal a few years ago, living with proper backup is a genuine quality-of-life upgrade.`, daysAfter: 2 },
      { userName: 'Mukesh Prasad Patna', content: `The Metro Phase 2 alignment through this direction is shown in the DMRC technical documents I've reviewed for Patna Metro project updates. Whether it materialises by 2027 or 2031 is the uncertainty. But the direction of the alignment is toward Phulwari Sharif and Danapur, which means Omaxe City buyers are positioned correctly for that upside.`, daysAfter: 5 },
      { userName: 'Anjali Kumari Patna', content: `The communication gap during delay is a consistent Omaxe criticism across multiple cities. They are better at building than at communicating. Buyers should set expectations accordingly: expect possible delays, expect to have to chase for updates, but expect that the project will ultimately get built and delivered. Their track record on actual completion is decent.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Rajan Kumar Patna',  score: 4, review: 'Best township option in Patna. Post-possession infrastructure reliability justifies the location trade-off. Prepare for possible delays and proactively chase possession updates.' },
      { userName: 'Priya Singh Patna',  score: 3, review: 'Good township, poor delay communication. The product works post-possession. Metro upside is real but uncertain in timing.' },
    ],
  },
  {
    citySlug: 'patna',
    propertyName: 'Boring Road Residences',
    propertyType: 'APARTMENT',
    address: 'Boring Road, Patna 800001',
    developerName: 'Various Builders',
    developerSlug: 'various-builders',
    priceMin: 10000000, priceMax: 22000000,
    topic: {
      userName: 'Priya Singh Patna',
      title: 'Boring Road Patna — Bihar\'s most prestigious residential address, buying guide',
      description: `Boring Road is to Patna what Breach Candy is to Mumbai or Alipore is to Kolkata — an address that carries generational prestige and community character that no amount of new township planning can replicate. I am completing a resale purchase here and want to provide a buyer's guide because this market has specific dynamics.

The name is misleading — nothing about this address is boring. The road is named after the boring machines used for groundwater extraction in British India. It is broad, tree-lined, and runs through Patna's most established residential zone. The social infrastructure is complete in a way that only decades of organic urban development can produce: Loyola High School, St. Michael's High School, Patna Medical College, excellent private hospitals, premium restaurants, banks, and the general sense of civic organisation that comes from a community of educated professionals who have lived in one place for generations.

Resale market reality: good units are rare. The community has low turnover — residents don't leave unless they are absolutely forced to. When something comes to market, decisions need to be made quickly. Typical time between listing and sale for a quality unit is 2-3 weeks. Pre-approved home loan from a bank is not optional if you want to compete seriously.

Building inspection for older stock: most available units are 15-30 years old. Key things to inspect — roof/terrace waterproofing condition (get a waterproofing contractor to assess if buying on upper floors), plumbing — galvanised iron pipes may need replacement in buildings older than 20 years, electrical wiring condition (some old Patna buildings have pre-standard wiring that needs full replacement), and lift condition in multi-story buildings.

My specific purchase: 3BHK, 1,650 sqft, 8th floor, overlooking a tree canopy. Asking ₹1.35 crore, negotiated to ₹1.22 crore over 3 weeks of patient engagement. Had SBI home loan sanction letter in hand which allowed me to close quickly once the price was agreed. Move-in 45 days after registration.

This is the best address in Bihar. If you have the budget and the patience, nothing else comes close.`,
      daysAgo: 8,
    },
    comments: [
      { userName: 'Rajan Kumar Patna',   content: `The negotiation from ₹1.35 to ₹1.22 crore — a 10% reduction on Boring Road — is exceptional. Sellers there rarely need to sell in distress. The SBI sanction letter giving you credibility as a fast-closing buyer is what made this possible. Pre-approval is the single most powerful negotiating tool in premium resale markets.`, daysAfter: 1 },
      { userName: 'Anjali Kumari Patna', content: `The plumbing assessment advice is critical for Boring Road buildings. I know of a family who bought a beautiful flat there only to discover the entire plumbing needed replacement — the cost was ₹8-10 lakh and months of disruption. A plumber inspection before final decision is ₹2,000-3,000 well spent.`, daysAfter: 4 },
      { userName: 'Mukesh Prasad Patna', content: `Boring Road values have shown extraordinary stability across three decades of Patna's ups and downs — floods, political uncertainty, economic cycles. The community self-selects for stability: the people who live there are people who have lived there for decades. This social permanence is the foundation of the value stability. No speculative buyer class to create volatility.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Priya Singh Patna',  score: 5, review: 'Boring Road is Patna\'s finest address and worth every rupee. The social infrastructure, community quality, and value stability are irreplaceable. Buy if you can.' },
      { userName: 'Rajan Kumar Patna',  score: 5, review: 'The gold standard of Bihar real estate. Prices are not cheap but the value delivered in community quality, infrastructure, and long-term appreciation is unmatched.' },
    ],
  },
  {
    citySlug: 'patna',
    propertyName: 'Ganga Residency Rajendra Nagar',
    propertyType: 'APARTMENT',
    address: 'Rajendra Nagar, Patna 800016',
    developerName: 'Ganga Estates',
    developerSlug: 'ganga-estates',
    priceMin: 4500000, priceMax: 8000000,
    topic: {
      userName: 'Anjali Kumari Patna',
      title: 'Ganga Residency Rajendra Nagar — local developer trust in Patna, complete story',
      description: `I booked Ganga Residency in Rajendra Nagar 8 months ago and I want to tell the complete story of how I found this project and what makes it stand out in a market where national developer brands dominate the conversation.

Background: I spent 6 months looking at Patna properties. I looked at Omaxe City (too far), Supertech projects (too risky), a few local developers who couldn't give me clear documentation. I was getting frustrated when my broker — who I trust — said "there's a local developer in Rajendra Nagar, you should meet him personally."

Ganga Estates is run by a 60-year-old Patna builder who has been constructing residential buildings in the city since 2002. His three previous projects — I visited all three — are occupied, maintained, and residents are happy. When I met him he brought building plans, RERA registration, OC copies for previous projects, and offered to call any resident from those projects while I was sitting in his office. He has nothing to hide because he has done nothing wrong.

This kind of builder trust — rooted in 18 years of local reputation — is genuinely harder to fake than a national brand's marketing budget. He cannot operate in Patna for 18 more years if he cheats buyers. His social standing, his family's standing, his professional community relationships all depend on his reputation. This alignment of incentives is more powerful than any institutional compliance requirement.

Rajendra Nagar as a Patna address: it is one of the city's most established residential localities — proximity to Patna Medical College Hospital (PMCH), reputed schools, well-established markets, and the residential culture of a settled educated community. It is not as prestigious as Boring Road but it is a genuinely good address at a more accessible price point.

Product: 3BHK at ₹55-65 lakh for 1,350-1,550 sqft. Quality is above Patna average — he uses proper RCC mix (I saw the concrete test reports), full mortar brick bonding, and branded fittings (Parryware bathrooms). Ceiling height 10 feet. Possession Q1 2026.

I am confident in this purchase. The builder trust is the foundation and the foundation is solid.`,
      daysAgo: 15,
    },
    comments: [
      { userName: 'Mukesh Prasad Patna', content: `The direct-meeting approach with a local builder — seeing him bring his OC copies and offer to call residents — is exactly the due diligence story that should be shared more widely. This is how Patna real estate worked before national developers arrived, and for local builders with local reputation, it remains the most effective trust mechanism.`, daysAfter: 2 },
      { userName: 'Rajan Kumar Patna',   content: `Rajendra Nagar proximity to PMCH is genuinely significant for Patna families. PMCH is Bihar's premier medical institution and the catchment area creates steady demand for housing — doctors, residents, nurses, administrative staff, patients' families who stay long-term. This employment creates a rental floor that more remote areas don't have.`, daysAfter: 5 },
      { userName: 'Priya Singh Patna',   content: `The Parryware bathroom specification is a good detail to include — it tells you the builder is using South India's most established branded sanitary ware, not market-grade generic products. At ₹55-65 lakh in Patna, Parryware fittings represent an honest quality choice that buyers will appreciate for years.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Anjali Kumari Patna', score: 5, review: 'Ganga Estates is the local developer done right. 18-year Patna reputation, transparent documentation, quality above market average. Best value purchase in Rajendra Nagar.' },
      { userName: 'Mukesh Prasad Patna', score: 5, review: 'Local developer trust in Patna is real when verified. Ganga Estates passed every test. Rajendra Nagar location is solid. Outstanding purchase.' },
    ],
  },
  {
    citySlug: 'patna',
    propertyName: 'Platinum City Danapur',
    propertyType: 'APARTMENT',
    address: 'Danapur, Patna 801503',
    developerName: 'Platinum Infratech',
    developerSlug: 'platinum-infratech',
    priceMin: 3500000, priceMax: 6500000,
    topic: {
      userName: 'Mukesh Prasad Patna',
      title: 'Platinum City Danapur Patna — new developer scaling up, early buyer opportunity',
      description: `Platinum City in Danapur is being developed by Platinum Infratech — a relatively new Patna developer with one completed project behind them. I want to make the case for why buying from a developer at this stage of their growth is a specific and legitimate investment strategy, not just a risk to be avoided.

Platinum Infratech's first project was a 48-unit apartment building in Kankarbagh, completed in 2022. I visited this building: residents are satisfied, possession happened within 4 months of promised date, construction quality is above Patna average. This is their baseline. Platinum City is their step up — 4 towers, 180 units, which is a 3.75x scale increase.

The scale-up risk is real and I will not minimise it. A developer who has managed 48 units is being tested at 180. The financial management, contractor coordination, and supply chain requirements are qualitatively different at this scale. I evaluated whether Platinum Infratech has the capacity:

Financial: they have a reputed builder finance company providing a construction credit line — this is verified, not assumed. If buyer payment collection slows, construction can continue.

Contractor: their construction is being managed by the same civil contractor who built Kankarbagh — continuity reduces execution risk from contractor change.

RERA: Bihar RERA registered (BH-RERA-PRJ-2024-XXXX), quarterly updates are being filed on the newly launched project. This compliance seriousness from the start is positive.

The product: 2BHK at ₹40-50 lakh for 950-1,100 sqft. The floor plans are efficient and include one practical feature that no other Patna developer in this segment offers — a dedicated water storage tank per apartment (200 litres over-head tank connected to rooftop main storage). In Patna where municipal water supply can be erratic, this means residents have 1-2 days of water storage independence per flat. This detail reveals a developer who thought about how people actually live.

Possession timeline: end 2026, which I consider achievable given the construction credit line and contractor continuity.

If construction continues at the current pace for the next 3 months, I will book. This is the discipline to apply: watch, then commit.`,
      daysAgo: 20,
    },
    comments: [
      { userName: 'Anjali Kumari Patna', content: `The per-flat water storage tank feature is something I've never seen in Patna real estate before. This is not a luxury add-on — it's a practical solution to a real daily problem that Patna residents face. A developer who identifies this problem and solves it before launch is showing genuine empathy for how their residents will live.`, daysAfter: 3 },
      { userName: 'Priya Singh Patna',   content: `The construction credit line verification is the right due diligence for a scaling-up developer. Developers who rely entirely on buyer payments for construction are vulnerable — if early sales are slower than projected, construction stalls. A credit line means construction continues independent of sales momentum. Good check to run.`, daysAfter: 6 },
      { userName: 'Rajan Kumar Patna',   content: `Danapur connectivity has been improving — the Danapur-Dinapur road upgrade has reduced travel time to Patna Junction significantly. For people who work near the station or need rail connectivity, Danapur is no longer the distant suburb it was 5 years ago.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Mukesh Prasad Patna', score: 4, review: 'Promising developer with verified construction credit and a genuinely innovative water storage feature. Watch for 3 more months before committing. Risk is manageable with monitoring.' },
      { userName: 'Anjali Kumari Patna', score: 4, review: 'The per-flat water tank shows a developer who thinks about resident needs. Scale-up risk is real but manageable. Worth monitoring closely for early-bird opportunity.' },
    ],
  },
  {
    citySlug: 'patna',
    propertyName: 'KSP Aangan Kankarbagh',
    propertyType: 'APARTMENT',
    address: 'Kankarbagh, Patna 800020',
    developerName: 'KSP Group',
    developerSlug: 'ksp-group',
    priceMin: 3500000, priceMax: 6000000,
    topic: {
      userName: 'Priya Singh Patna',
      title: 'KSP Aangan Kankarbagh Patna — established locality, mid-budget review',
      description: `KSP Group's Aangan project in Kankarbagh is one of the Patna projects that comes up repeatedly when budget buyers in the ₹40-55 lakh range ask me for recommendations. I've visited the site twice and spoken to residents of KSP's earlier smaller project in the same area. Here is a balanced assessment.

Kankarbagh is an established Patna locality with a specific character: it is the commercial and transport hub of south Patna. Kankarbagh railway station provides direct connectivity to multiple interstate routes. The commercial main road has all essential services. Several coaching institutes and schools operate in the area creating an active neighbourhood ecosystem. It is not glamorous like Boring Road or Rajendra Nagar but it is genuinely functional.

KSP Group has been in Patna real estate for about 10 years — not the 18 years of Ganga Estates, but enough to have completed three smaller projects without significant issues. Aangan is their most ambitious project: 6 towers, 240 units. For their scale this is a significant jump. The key concern I investigated: are they adequately capitalised?

From what I could verify: KSP has taken a term loan from a Patna-based cooperative bank for part of the construction cost. This is not as reassuring as a construction credit from a national NBFC but it is not nothing. The loan terms reportedly require construction milestone certification for disbursement which creates some accountability. RERA registration is current, quarterly updates have been filed for the first year of the project.

Product: 2BHK at ₹38-46 lakh for 870-1,020 sqft. 3BHK at ₹50-60 lakh for 1,150-1,350 sqft. The floor plans are straightforward. Ceiling height 9.5 feet — below the 10 feet standard I prefer but common at this price point in Patna. Bathroom fittings are unbranded but appear quality. Construction at site visit looked solid.

The honest summary: KSP Aangan is a reasonable mid-budget option in a good locality from a developer who has demonstrated ability to complete and deliver at smaller scale. The 6-tower scale-up is the key risk to monitor. Verify construction progress quarterly before making payment milestones.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Rajan Kumar Patna',   content: `Kankarbagh railway station connectivity is underrated for Patna buyers. For families where someone commutes by train — to Muzaffarpur, Gaya, Bhagalpur, or further — the station proximity saves significant daily time versus living in Phulwari or even Rajendra Nagar which require commuting to the station first.`, daysAfter: 2 },
      { userName: 'Mukesh Prasad Patna', content: `The cooperative bank term loan is less reassuring than NBFC financing but the milestone-based disbursement mechanism partially mitigates the risk. Ask KSP for the loan agreement summary to verify this structure. A developer who willingly shows this document is a developer who has nothing to hide about their financing.`, daysAfter: 5 },
      { userName: 'Anjali Kumari Patna', content: `6 towers at once is ambitious for a 10-year developer. The smart buyer strategy here: if you like the project and location, book one unit with a minimum token amount, then pay the next milestone only after verifying construction progress at the 30% stage. This is how you get the early-bird price advantage while protecting yourself from scale-up execution risk.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Priya Singh Patna',   score: 3, review: 'Solid mid-budget option in a functional Patna locality. KSP track record at smaller scale is decent. Monitor 6-tower scale-up carefully. Stagger payments with construction verification.' },
      { userName: 'Mukesh Prasad Patna', score: 3, review: 'Good value for Kankarbagh with railway connectivity advantage. Developer financing needs verification. Reasonable risk for budget-conscious buyers who monitor construction.' },
    ],
  },
  {
    citySlug: 'patna',
    propertyName: 'Ansal Sushant City Patna',
    propertyType: 'APARTMENT',
    address: 'Phulwari Sharif, Patna 801505',
    developerName: 'Ansal API',
    developerSlug: 'ansal-api',
    priceMin: 4000000, priceMax: 8000000,
    topic: {
      userName: 'Mukesh Prasad Patna',
      title: 'Ansal Sushant City Patna — national developer in Bihar, what buyers need to know',
      description: `Ansal API's Sushant City project in Patna is the other national developer township offering alongside Omaxe City. At similar pricing and similar outskirt location (Phulwari Sharif corridor), the natural question is how it compares and whether Ansal is the right choice for Patna buyers.

Ansal API is a listed Delhi-based developer with decades of history and a complex track record. In some markets they have delivered well; in others — particularly certain NCR projects — they have faced serious delivery failures and RERA complaints. For Bihar specifically, their presence is newer than in NCR and I investigated whether the Bihar project is structured differently.

Key finding: Ansal Sushant City Patna is RERA registered under Bihar RERA. The project has filed quarterly updates regularly. Current construction is at an advanced stage — the first phase of units has received possession. Residents of Phase 1 that I spoke to gave generally positive feedback on construction quality (comparable to Omaxe City's mid-market standard) and possession came approximately 7 months after the original promise date.

The Ansal vs Omaxe comparison for Patna buyers: both are national listed developers with mixed track records. Both are in similar locations (Phulwari Sharif corridor). Both offer similar product quality at similar prices. The differentiation is subtle: Ansal's first-phase possession data is available because they are slightly further along in the project timeline — this removes some delivery uncertainty. Omaxe's township infrastructure (mall, schools within campus) may be more developed.

My recommendation for Phase 2 buyers evaluating Ansal Sushant City: the Phase 1 delivery data is the most useful input you have. Speak to Phase 1 residents, verify their possession experience, ask specifically about construction quality on move-in and any issues in the first year. This is primary research that is uniquely available for this project and which most buyers don't do.

Pricing at ₹40-80 lakh for 2BHK and 3BHK is appropriate for the product and location. RERA compliance and Phase 1 possession data make this a more verifiable risk than a purely under-construction project.`,
      daysAgo: 52,
    },
    comments: [
      { userName: 'Anjali Kumari Patna', content: `The Phase 1 resident research advice is the most actionable thing you've said. I would add: ask Phase 1 residents specifically about the first year — seepage during monsoon, any common area issues, whether the RWA was formed properly. These are the early indicators of long-term quality that a 6-month-old possession experience can reveal.`, daysAfter: 3 },
      { userName: 'Rajan Kumar Patna',   content: `Ansal vs Omaxe in Patna is the township comparison buyers keep asking about. Your point that both are listed developers with mixed records is the right framing — it prevents either project from being dismissed as 'risky local developer' or elevated as 'safe national brand.' Both are institutional developers with specific track records that buyers should verify.`, daysAfter: 6 },
      { userName: 'Priya Singh Patna',   content: `The 7-month possession delay is in the range of expected for national developer township projects in Patna. Omaxe was 5 months late, Ansal 7 months. Buyers going into this category should budget for a 6-9 month delay in their financial planning — don't exit the existing rental before receiving actual possession.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Mukesh Prasad Patna', score: 3, review: 'Ansal Sushant City is a credible Phase 2 option given Phase 1 delivery data. RERA compliant, listed developer. Phase 1 resident verification is essential before Phase 2 commitment.' },
      { userName: 'Rajan Kumar Patna',   score: 3, review: 'Good township option at fair pricing. The Phase 1 possession data reduces uncertainty for Phase 2 buyers. Plan for 6-9 month delay buffer in your move-in timing.' },
    ],
  },
]

async function main() {
  console.log('\n🏙️  Seed Part F — Ludhiana + Agra + Nashik + Patna\n')
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
  console.log(`\n✅ Part F done — topics:${topics} comments:${comments} ratings:${ratings}\n`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
