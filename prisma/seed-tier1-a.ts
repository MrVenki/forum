// Tier 1 Part A — Pune (8 more) + Ahmedabad (8 more)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  { name: 'Tejas Kulkarni',      email: 'tejas.kulkarni.pun@gmail.com' },
  { name: 'Rutuja Shinde',       email: 'rutuja.shinde.pun@gmail.com' },
  { name: 'Aditya Pawar',        email: 'aditya.pawar.pun@gmail.com' },
  { name: 'Snehal Deshmukh',     email: 'snehal.deshmukh.pun@gmail.com' },
  { name: 'Gaurav Jadhav',       email: 'gaurav.jadhav.pun@gmail.com' },
  { name: 'Pooja Gaikwad',       email: 'pooja.gaikwad.pun@gmail.com' },
  { name: 'Nilesh Mane',         email: 'nilesh.mane.pun@gmail.com' },
  { name: 'Ashwini More',        email: 'ashwini.more.pun@gmail.com' },
  { name: 'Kalpesh Patel',       email: 'kalpesh.patel.ahm@gmail.com' },
  { name: 'Minal Shah',          email: 'minal.shah.ahm@gmail.com' },
  { name: 'Bhavin Desai',        email: 'bhavin.desai.ahm@gmail.com' },
  { name: 'Shreya Joshi',        email: 'shreya.joshi.ahm@gmail.com' },
  { name: 'Chirag Modi',         email: 'chirag.modi.ahm@gmail.com' },
  { name: 'Heena Trivedi',       email: 'heena.trivedi.ahm@gmail.com' },
  { name: 'Rushabh Gandhi',      email: 'rushabh.gandhi.ahm@gmail.com' },
  { name: 'Avni Parikh',         email: 'avni.parikh.ahm@gmail.com' },
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
  // ── PUNE ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'pune',
    propertyName: 'Shapoorji Pallonji Joyville',
    propertyType: 'APARTMENT',
    address: 'Hadapsar, Pune 411028',
    developerName: 'Shapoorji Pallonji Real Estate',
    developerSlug: 'shapoorji-pallonji',
    priceMin: 4900000, priceMax: 9800000,
    topic: {
      userName: 'Tejas Kulkarni',
      title: 'Shapoorji Joyville Hadapsar — worth the SP premium in Pune east?',
      description: `Working in Magarpatta City, so Hadapsar was always going to be my target. Shortlisted Joyville among 4-5 options and visited twice before deciding. Here's what I found.

SP as a brand needs no introduction. Their worksmanship in Pune — Parkwest, Sanctuarii — is consistently above average. Joyville is their more affordable offering but the construction quality genes carry over. Slabs are thick, corridor widths are generous, lobby treatment is proper.

Hadapsar location is very practical for IT belt workers. Magarpatta, EONAN, and Fursungi campuses are all within 15-20 minutes. The challenge is peak hour traffic on Solapur Road — it can double your commute time. The Hadapsar metro station on line 1 is about 2 km away which helps.

What I specifically liked: the 2 BHK layout is efficient, no funny shapes. Master bedroom is 12x14 which is actually usable. Ventilation is good — cross-ventilation in most units because of the tower orientation.

Pricing at 5200-5800 per sqft is not cheap for Hadapsar but the SP premium is real and demonstrable. Local Hadapsar builders at 4000-4500 per sqft offer inferior product. The gap is justified.

Main concern: the project is a large one with multiple phases. Phase 1 delivery was slightly delayed (about 8 months). Phase 2 is ongoing and I'm in Phase 3. If Shapoorji follows their national pattern, Phase 3 delivery will likely be 6-10 months after the promised date. Not deal-breaking for SP but plan accordingly.`,
      daysAgo: 42,
    },
    comments: [
      { userName: 'Rutuja Shinde', content: `I'm in Phase 1 Joyville, moved in last year. The delay was 9 months for me. Post-possession, the society is well-managed — Shapoorji runs their own management company and it shows. Lifts serviced regularly, security is professional. If you're comparing with local Hadapsar options, the difference in day-to-day society management quality is enormous.`, daysAfter: 2 },
      { userName: 'Gaurav Jadhav', content: `The Hadapsar metro connectivity point is going to matter a lot. Once Line 1 is fully operational, Joyville residents will have direct metro access to Shivajinagar and Pimpri-Chinchwad. That changes the commute math significantly for non-Magarpatta IT workers.`, daysAfter: 5 },
      { userName: 'Nilesh Mane', content: `Looked at this vs Godrej Infinity which is also nearby. Joyville has better tower spacing and more green area. Godrej Infinity's layout felt more cramped. Both are reliable builders — pick based on the specific unit you're getting.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Tejas Kulkarni', score: 4, review: 'SP quality is genuine. Delay is a factor but worth it for the build quality difference vs local builders.' },
      { userName: 'Rutuja Shinde', score: 4, review: 'Post-possession experience is excellent. Society management sets the benchmark for Hadapsar.' },
      { userName: 'Gaurav Jadhav', score: 4, review: 'Metro upside not priced in yet. Good medium-term investment in addition to strong end-use.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Marvel Brisa',
    propertyType: 'APARTMENT',
    address: 'Wadgaon Sheri, Kharadi, Pune 411014',
    priceMin: 7200000, priceMax: 15000000,
    topic: {
      userName: 'Aditya Pawar',
      title: 'Marvel Brisa Kharadi — overpriced or justified for the IT hub location?',
      description: `Kharadi is where I work (EON IT Park) so this is as good as location gets for me. Marvel Brisa is one of the top 3 premium options in the micro-market. Sharing detailed notes from site visit and research.

Marvel as a developer has a polarizing reputation in Pune. Their older projects — Marvel Fria, Marvel Isola — have quality that clearly stands out from the crowd. Brisa is their flagship current launch in Kharadi and it shows — the lobby design alone tells you this is a different league.

Product: 3 BHK units are generous in size (1550-1850 sqft carpet area). The terrace units on higher floors are genuinely beautiful. Panoramic windows in the living room face the Eon Free Zone which looks spectacular at night. Fittings are European — Grohe taps, Hettich wardrobes, Bosch appliances in kitchen.

Pricing is the discussion point. At 8500-9500 per sqft, Brisa is the most expensive ready project in Kharadi by a significant margin. The closest comparable is Godrej Infinity at 6500-7000. Can the Marvel premium justify 25-30% higher price?

My take: for end-use, if you can stretch the budget, yes — the daily living experience difference is tangible. For investment/rental, the yield differential might not justify the extra cost since tenants don't pay 30% more for the Marvel brand.

The project is largely delivered. OC for most towers is in place. This is a major plus — you're buying into a live society, not a promise.`,
      daysAgo: 29,
    },
    comments: [
      { userName: 'Snehal Deshmukh', content: `My colleague bought in Marvel Isola 3 years ago and I've visited her flat. The quality difference vs typical Kharadi projects is very visible — in the thickness of the tiles, the smoothness of the door operation, even the way the windows seal. Marvel charges premium and justifies most of it.`, daysAfter: 3 },
      { userName: 'Pooja Gaikwad', content: `For rental investment in Kharadi — the upper band of furnished rentals is around 60-70k for a good 3 BHK. That's a yield of around 4.5-5% on a 1.4 Cr investment which is decent but not spectacular. The capital appreciation story is stronger than the rental yield story here.`, daysAfter: 6 },
      { userName: 'Aditya Pawar', content: `@Pooja — agree. Kharadi has appreciated 18% in the last 2 years. If the IT park expansion continues (which seems likely given the new blocks coming up on Nagar Road), the corridor has legs. Marvel units will hold premium even in a flat market.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Aditya Pawar', score: 4, review: 'Genuine premium product. End-use buyers can justify the price. Investment yield modest but capital appreciation strong.' },
      { userName: 'Snehal Deshmukh', score: 5, review: 'Marvel quality is consistently above Pune market average. Brisa is their best yet.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Rohan Ekam',
    propertyType: 'APARTMENT',
    address: 'Balewadi, Pune 411045',
    developerName: 'Rohan Builders',
    developerSlug: 'rohan-builders',
    priceMin: 8500000, priceMax: 18000000,
    topic: {
      userName: 'Snehal Deshmukh',
      title: 'Rohan Ekam Balewadi — ultra-premium positioning, does Balewadi support these prices?',
      description: `Balewadi is Pune's lifestyle address. Stadium, Baner proximity, the restaurant culture along Balewadi High Street, connectivity to the Mumbai expressway — it all works. Rohan Ekam is their most ambitious project, targeting the 1.5-3 Cr buyer.

Rohan Builders has been a Pune institution for 30 years. Rohan Mithila, Rohan Vasantha — these are names that longtime Pune residents trust. Ekam is a step up in positioning from anything they've done before.

The product is genuinely impressive. Floor-to-ceiling glass in the main living area of the sample flat is stunning. Sky decks on alternate floors as common areas are a nice concept — gives a place to sit outside without being on the terrace. The gym is the largest I've seen in a Pune residential project.

The 3 BHK I looked at is 2100 sqft carpet which is very generous. Price is 10500 per sqft which comes to around 2.2 Cr for that unit. By any Pune standard except Koregaon Park / Kalyani Nagar, this is aggressive pricing.

Is Balewadi worth these prices? I think yes for the right buyer. Proximity to DIAC (upcoming), international schools, Symbiosis institutions, and the expressway makes this an NRI-return and senior corporate buyer market. These buyers pay for the address and product quality, not primarily for investment return.

Rohan as builder — construction quality will not disappoint. That's the one certainty here.`,
      daysAgo: 37,
    },
    comments: [
      { userName: 'Gaurav Jadhav', content: `Balewadi prices have gone insane in 3 years. But so have Mumbai prices, and Pune is increasingly the preferred destination for Mumbai professionals moving or buying second home. Ekam's target buyer is that Mumbai executive who wants Pune quality of life. The price is actually competitive vs anything comparable in Bandra or Andheri.`, daysAfter: 4 },
      { userName: 'Pooja Gaikwad', content: `I know a family who moved from Koregaon Park to Balewadi specifically for the school proximity — DPS and Indus International are in this zone. Once you have school-aged kids, that micro-location premium makes total sense. Ekam's pricing targets exactly this family profile.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Snehal Deshmukh', score: 4, review: 'Rohan\'s quality assurance is reliable. Balewadi pricing is stretched but so is the entire Pune premium market.' },
      { userName: 'Gaurav Jadhav', score: 4, review: 'Correct positioning for the NRI/senior executive segment. Not a mass market pick.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Paranjape Blue Ridge',
    propertyType: 'APARTMENT',
    address: 'Hinjewadi Phase 1, Pune 411057',
    developerName: 'Paranjape Schemes',
    developerSlug: 'paranjape-schemes',
    priceMin: 6500000, priceMax: 12500000,
    topic: {
      userName: 'Pooja Gaikwad',
      title: 'Paranjape Blue Ridge Hinjewadi — comparing established society vs new launches nearby',
      description: `Blue Ridge is one of the oldest and most established large societies in Hinjewadi. Been occupied for 8+ years. I'm comparing it against newer launches for a resale purchase.

The advantage of buying into an established society is massive and underappreciated. You know exactly what you're getting — the pool is filled, the gym is equipped, the trees are grown, the society culture is established. In Blue Ridge, there's a genuine community — events, kids playing in the park, security that knows the residents by face.

Paranjape as a builder has delivered here and the quality has held up well for 8 years. No major structural issues I've heard about from current residents. The exterior hasn't aged badly either which speaks to the waterproofing quality.

Resale pricing is 5800-6800 per sqft depending on tower, floor, and renovation state. That's below new launch pricing in the same area, which is unusual — normally established societies command a premium. The discount exists because new launches are competing hard on specs.

My calculation: if I buy Blue Ridge resale at 70 lakhs for a 2 BHK vs a new launch at 80-85 lakhs, I'm saving 10-15 lakhs and getting a ready society with established social life. The trade-off is slightly older fixtures and decor which a moderate renovation can address.

Hinjewadi Phase 1 vs Phase 2/3 debate: Phase 1 has better infrastructure (road development, retail, hospital) but Phase 2/3 has better metro access. Blue Ridge in Phase 1 wins on current liveability, future phases win on metro.`,
      daysAgo: 19,
    },
    comments: [
      { userName: 'Nilesh Mane', content: `Blue Ridge resident for 5 years. The community is genuinely vibrant — Ganesh festival, Diwali, sports events all happen. Kids have friends in the same society. This social capital is invisible in spreadsheet comparisons but very real in daily life. New launches are empty shells for 2-3 years post-possession.`, daysAfter: 2 },
      { userName: 'Ashwini More', content: `The resale discount vs new launch is temporary. Once new launches deliver and fill up (3-5 years), Blue Ridge's established nature becomes a premium. I'd buy Blue Ridge resale now and hold — you get the social infrastructure advantage immediately plus the appreciation when the discount narrows.`, daysAfter: 5 },
    ],
    ratings: [
      { userName: 'Pooja Gaikwad', score: 4, review: 'Established society advantage is real. Paranjape quality has held well. Good resale value proposition.' },
      { userName: 'Nilesh Mane', score: 5, review: 'Best community in Hinjewadi. New launches can\'t replicate the social fabric of an 8-year-old society.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Nyati Elan',
    propertyType: 'APARTMENT',
    address: 'Undri, Pune 411060',
    priceMin: 4200000, priceMax: 8500000,
    topic: {
      userName: 'Nilesh Mane',
      title: 'Nyati Elan Undri — south Pune is often overlooked, is this a mistake?',
      description: `Undri gets little love in the Pune real estate conversation. Everyone talks about Hinjewadi, Kharadi, Baner. But south Pune — Undri, Pisoli, Mohammadwadi — has been quietly appreciating and offers genuinely good value.

Nyati Elan is one of the better organized projects here. Nyati Group is a known name in Pune with a solid delivery track record. Elan offers 2 and 3 BHK at 4500-5200 per sqft which is 30-40% lower than comparable quality in Hinjewadi.

The location case: Hadapsar IT belt (Magarpatta, EONAN) is 15 minutes. Katraj area is well-connected. The Katraj-Dehu Road Bypass road has improved south Pune connectivity dramatically. Bibwewadi and Swargate are accessible without going through Pune's congested center.

Society is partially delivered and occupied. The portion I walked through was clean and well-maintained. The park area is large for the price point — 40% open space is evident, not cosmetic. Nyati has delivered it properly.

Undri's growth story: a major IT campus expansion is coming up on Mohammadwadi Road. Several mid-sized IT companies are setting up near Hadapsar which will drive demand for affordable housing in the south Pune belt. Undri will benefit.

The downside: metro doesn't reach here yet and public transport is limited. You need a vehicle. For young professionals without families, Hinjewadi's walk-to-office appeal is stronger. For families, Undri's quieter character and affordability is attractive.`,
      daysAgo: 54,
    },
    comments: [
      { userName: 'Ashwini More', content: `South Pune has been my tip for the past 2 years and nobody listens. The infrastructure investment is happening, prices are still 30% below equivalent quality in north/east Pune. In 5 years the gap will narrow. Undri and Pisoli will be where Kharadi was in 2017.`, daysAfter: 3 },
      { userName: 'Rutuja Shinde', content: `The water supply in Undri has historically been a concern — many buildings relied on tankers. Nyati Elan specifically has its own borewell and water storage. Confirm this before booking and check if Pune municipal connection is in place.`, daysAfter: 6 },
      { userName: 'Tejas Kulkarni', content: `Good point on water. The Bhama Askhed dam pipeline extension was supposed to reach south Pune by 2024. Check the current status with the local gram panchayat — if municipal water supply is now reliable, the historic concern is resolved.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Nilesh Mane', score: 4, review: 'Solid builder, good open space, great value vs Pune IT corridor projects. Check water supply situation before finalizing.' },
      { userName: 'Ashwini More', score: 4, review: 'South Pune is undervalued. Nyati is reliable. Good medium-term appreciation bet.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Kumar Primus',
    propertyType: 'APARTMENT',
    address: 'Punawale, Pune 411033',
    developerName: 'Kumar Properties',
    developerSlug: 'kumar-properties',
    priceMin: 5800000, priceMax: 11500000,
    topic: {
      userName: 'Ashwini More',
      title: 'Kumar Primus Punawale — is Punawale the new Wakad?',
      description: `Three years ago I was telling people to look at Wakad before it got expensive. Now Wakad is fully priced. My current recommendation is Punawale — and Kumar Primus is the project I'd specifically look at.

Kumar Properties is one of Pune's oldest and most reliable builders. Their Signia, Epitome, and Palmridge projects have all delivered on time and held value extremely well. Primus continues this legacy.

Punawale sits between Wakad and Hinjewadi Phase 3. This positioning is key — you get the benefit of both micro-markets. Wakad's established retail and restaurant scene is 10 minutes away. Hinjewadi Phase 3 IT campuses are 12-15 minutes. The upcoming Punawale metro station on Line 3 is the big catalyst.

The project: towers are 18-20 floors. Sample flat was impressive — good ceiling height (9.5 feet), quality tile, and Kumar's signature attention to kitchen layout. The 2.5 BHK configuration is an interesting option for small families where the extra room becomes study or work-from-home space.

Current pricing at 6000-6800 per sqft is Punawale's highest but justified by Kumar's brand and product quality. There are cheaper options in Punawale from local builders but the quality and resale liquidity gap is significant.

If Wakad is 2020 prices and you missed it, Punawale is 2024's equivalent window. I genuinely believe this.`,
      daysAgo: 31,
    },
    comments: [
      { userName: 'Gaurav Jadhav', content: `The Punawale metro station ETA keeps shifting. Don't bet on the metro being a near-term catalyst. Buy because the location fundamentally works — it does. The metro is a bonus when it finally arrives.`, daysAfter: 4 },
      { userName: 'Tejas Kulkarni', content: `Kumar's resale market is consistently liquid. Palmridge units change hands quickly whenever they come up. That's the real test of a builder's brand — resale velocity. Primus will be the same.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Ashwini More', score: 5, review: 'Kumar is the most reliable Pune builder with 30 years of consistent delivery. Punawale is the value play of this cycle.' },
      { userName: 'Tejas Kulkarni', score: 4, review: 'Strong builder, good location thesis. Metro delay is a risk but fundamental connectivity already works.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Kolte-Patil 24K Opula',
    propertyType: 'APARTMENT',
    address: 'Wakad, Pune 411057',
    developerName: 'Kolte-Patil Developers',
    developerSlug: 'kolte-patil-developers',
    priceMin: 9500000, priceMax: 22000000,
    topic: {
      userName: 'Rutuja Shinde',
      title: 'KP 24K Opula Wakad — flagship luxury from Kolte-Patil, reality vs brochure?',
      description: `Kolte-Patil's 24K series is their ultra-premium offering. I've been tracking this brand extension since they launched 24K Sereno in Pune and 24K in Nashik. Opula in Wakad is their most ambitious yet. Visited last week with a serious mind.

The lobby alone sets the tone — double height, imported marble, professional art installation. Not the kind of lobby you see in most Pune projects including many called "luxury." This is genuine premium positioning.

The apartments: 3 BHK at 2200-2800 sqft carpet. The living room is 500+ sqft which sounds absurd until you walk into it and understand what a properly large living room feels like. Private lift lobby for penthouse floors. Sky terrace access on floor 28.

Pricing at 10000-12000 per sqft puts the total ticket at 2.2-3.3 Cr. This is Koregaon Park pricing in Wakad. Can Wakad sustain this? It's a genuine question.

The demand angle: remote/hybrid work has changed the buyer profile. Senior tech professionals who used to buy in South Bombay for location access now care more about quality of home since they're in it 4-5 days a week. Opula targets this buyer directly.

Kolte-Patil's track record: they've delivered the 24K series on time or very close in other cities. The brand is staking its premium reputation on this — they cannot afford a delay.

If budget allows, this is genuinely exciting. If stretching beyond comfort zone — wait and buy resale in 3-4 years when the project is delivered and the initial buyer who overextended wants to exit.`,
      daysAgo: 23,
    },
    comments: [
      { userName: 'Aditya Pawar', content: `Wakad is ready for this price point. The buyer demographic here has shifted dramatically — the software engineers who bought at 3500 per sqft 7 years ago are now senior managers buying upgrade homes at 10000 per sqft. The market has matured.`, daysAfter: 3 },
      { userName: 'Pooja Gaikwad', content: `The private lift lobby concept is borrowed from South Bombay luxury. Genuinely changes the feel of arrival. Once you experience it you can't un-experience it. KP is smart to bring this to Pune at a price point that's half of Mumbai luxury.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Rutuja Shinde', score: 5, review: 'Benchmark luxury product for Pune. KP\'s 24K series consistently delivers on its premium promise.' },
      { userName: 'Aditya Pawar', score: 4, review: 'Right product at the right time for Wakad\'s evolved buyer base. Pricing is aggressive but sustainable.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Mahindra Happinest Tathawade',
    propertyType: 'APARTMENT',
    address: 'Tathawade, Pune 411033',
    developerName: 'Mahindra Lifespace',
    developerSlug: 'mahindra-lifespace',
    priceMin: 4500000, priceMax: 7800000,
    topic: {
      userName: 'Gaurav Jadhav',
      title: 'Mahindra Happinest Tathawade — affordable Mahindra in the Hinjewadi catchment',
      description: `Happinest is Mahindra Lifespace's affordable housing brand and Tathawade is arguably the best location they've chosen for it. Located directly off the Hinjewadi-Wakad Road, this is genuinely walking distance from multiple IT campuses in Hinjewadi Phase 1.

For buyers priced out of Wakad and Hinjewadi projects (which are now firmly in the 7000-9000 per sqft range from any credible builder), Happinest at 5000-5500 per sqft offers a meaningful price entry. The Mahindra brand means delivery certainty and professional society management.

What you're getting and not getting: Happinest units are compact — 2 BHK is 650-750 sqft carpet, 3 BHK is 900-1000 sqft. No wasted space. The common amenities are functional but not luxurious. This is value-focused design.

Quality: Mahindra's construction quality doesn't vary by brand. Even in Happinest, the concrete and waterproofing quality is consistent with their premium projects. Where they save money is in the fittings and common area finishes — tiles are Indian, fittings are local brands, lobby is functional rather than impressive. But the structure and living experience is solid.

For first-time buyers and young working couples, this is a genuinely honest value proposition. You're buying Mahindra quality at 30-40% below their premium products. In a city where builders without the Mahindra brand charge 5500-6000 per sqft for inferior product, this is a fair deal.

Possession is 2026. Mahindra's Pune track record suggests this will be on time or within 3 months of it.`,
      daysAgo: 47,
    },
    comments: [
      { userName: 'Nilesh Mane', content: `The compact unit sizes are a trade-off worth discussing. Tathawade rents for 18-22k for a 2 BHK. On a 50 lakh investment that's about 4.5-5% yield which is among the better rental plays near Hinjewadi. For investment buyers the math works even with compact sizes.`, daysAfter: 3 },
      { userName: 'Ashwini More', content: `I always recommend Mahindra projects to first-time buyers from outside Pune who aren't sure of the local builders. The brand gives peace of mind that the project will deliver and the society will be professionally managed. Worth the slight premium over unknown local builders.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Gaurav Jadhav', score: 4, review: 'Best value proposition near Hinjewadi for budget-conscious buyers. Mahindra quality assurance is the key differentiator.' },
      { userName: 'Nilesh Mane', score: 4, review: 'Compact but efficient. Rental yield is strong for the location. Good first purchase.' },
    ],
  },

  // ── AHMEDABAD ─────────────────────────────────────────────────────────────
  {
    citySlug: 'ahmedabad',
    propertyName: 'Safal Parisar II',
    propertyType: 'APARTMENT',
    address: 'Makarba, Ahmedabad 380051',
    priceMin: 5800000, priceMax: 11000000,
    topic: {
      userName: 'Kalpesh Patel',
      title: 'Safal Parisar II Makarba — best value near SG Highway or overrated?',
      description: `Makarba has been Ahmedabad's quiet achiever in real estate. Located just off SG Highway but more affordable than Prahlad Nagar and Bodakdev, it offers what I'd call the best value proposition on the western corridor. Safal Parisar II is the flagship project here.

Safal is an Ahmedabad builder with 25+ years of history. Their earlier Parisar project nearby is occupied and in excellent shape — I visited a unit in the original Parisar before looking at Parisar II. The build quality has aged well, waterproofing has held, and the society is self-sustaining.

Parisar II is bigger, taller, and has more amenities than the first project. The rooftop infinity pool (one of the few genuine rooftop pools in mid-segment Ahmedabad) is the showpiece. The floor plates are efficient — 3 BHK at 1650 sqft with no hallway wastage.

Makarba location works: SG Highway is 5 minutes, Prahlad Nagar for shopping is 10 minutes, Ahmedabad airport is 20 minutes (important for frequent flyers), and the corporate offices in the GIFT City corridor are accessible via SG Highway.

Pricing at 6200-7000 per sqft is 25-30% below comparable Prahlad Nagar projects. This gap is sustained by the "Makarba is not Prahlad Nagar" perception, but the physical distance is 2 km. As Makarba fills in with more quality projects, this gap will narrow.

My recommendation: Parisar II is a solid buy for long-term end-use or investment. Safal delivers on time and the product quality justifies the price. Just don't buy expecting Prahlad Nagar resale liquidity immediately — that will take 3-5 more years as the address matures.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Minal Shah', content: `The rooftop pool is genuinely impressive — I've been to the site twice and the pool area on the terrace with the SG Highway skyline in the background is a great experience. Safal has paid attention to the amenity experience which is rare in this price range in Ahmedabad.`, daysAfter: 3 },
      { userName: 'Bhavin Desai', content: `Makarba vs Prahlad Nagar debate: Prahlad Nagar has better walk-to options — restaurants, salons, pharmacies. Makarba is still car-dependent for most needs. For the 30% price advantage it's a fair trade but verify your lifestyle requirements.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Kalpesh Patel', score: 4, review: 'Safal is a reliable Ahmedabad builder. Makarba offers SG Highway access at Bopal prices. Good long-term bet.' },
      { userName: 'Minal Shah', score: 4, review: 'Premium amenities for a mid-market price. The rooftop pool alone justifies the slightly higher price vs competition.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Goyal My Home',
    propertyType: 'APARTMENT',
    address: 'Gota, Ahmedabad 382481',
    priceMin: 4200000, priceMax: 8500000,
    topic: {
      userName: 'Minal Shah',
      title: 'Goyal My Home Gota — north Ahmedabad getting serious attention finally?',
      description: `Gota has always been north Ahmedabad's promising locality that never quite broke through. The perception was: good price, but too far from SG Highway and the "real" Ahmedabad. That perception is changing and Goyal My Home is a good example of why.

Goyal Realty has been in Ahmedabad for decades. Their My Home brand is their affordable-to-mid segment offering and they've done it in multiple locations. The Gota project is one of their cleaner executions.

Location case for Gota: Gandhinagar is 20 minutes by Sarkhej-Gandhinagar Highway. For government and public sector workers (a massive employment base in this region), Gota is actually a superior location to SG Highway-centric projects. The district courts, government secretariat, and GIFT City back office operations are all accessible.

Infrastructure in Gota has improved significantly. Naranpura-Gota Road widening has helped. The upcoming metro extension (the Motera-Gym Khana corridor) will eventually connect this area better.

Product: Goyal My Home Gota is a mid-segment project, not premium. Tiles are Kajaria, fittings are decent local brands, lobby is functional. For 4500-5000 per sqft, you're getting a correctly delivered apartment, not a luxury experience.

Who should buy: government sector employees based in Gandhinagar / north Ahmedabad, families looking for affordable space without the SG Highway premium, or investors targeting the rental demand from Gandhinagar office belt.

Don't buy if you want SG Highway lifestyle access or a premium address. This is honest value, not prestige.`,
      daysAgo: 61,
    },
    comments: [
      { userName: 'Kalpesh Patel', content: `The Gandhinagar connection is underplayed. GIFT City is going to create massive demand for affordable housing in the 45-80 lakh range. Gota is within 25 minutes of GIFT City. As GIFT City's financial services workforce grows, Gota will benefit from spillover demand.`, daysAfter: 5 },
      { userName: 'Chirag Modi', content: `Goyal delivers on time in my experience — I know a family in their Thaltej project and possession was exactly as promised. That's the core value proposition for Goyal buyers — reliability without the Adani/Shivalik premium.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Minal Shah', score: 3, review: 'Honest value proposition for north Ahmedabad. Not premium but reliable. Right for Gandhinagar-side buyers.' },
      { userName: 'Kalpesh Patel', score: 4, review: 'GIFT City proximity underappreciated. Good investment thesis for patient holders.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Shivalik Sharda',
    propertyType: 'APARTMENT',
    address: 'Science City Road, Sola, Ahmedabad 380060',
    developerName: 'Shivalik Group',
    developerSlug: 'shivalik-group',
    priceMin: 6500000, priceMax: 13500000,
    topic: {
      userName: 'Bhavin Desai',
      title: 'Shivalik Sharda Science City Road — mid-premium done right in Ahmedabad?',
      description: `Science City Road is Ahmedabad's tech and education corridor — IIT Gandhinagar influence, ISRO SAC campus, Science City itself, and an emerging cluster of research institutions. Shivalik Sharda sits on this corridor and targets the professional class working in these institutions.

Shivalik Group is one of Ahmedabad's most established builders. Their track record across 40+ years is almost entirely positive. Projects like Silver Oak, Shaligram, and their township projects have delivered and aged well. Sharda is a premium offering from them in a prime location.

The product: 3 BHK and 4 BHK in a 25-floor tower. The apartment layout is well thought through — the kind of floor plan where you can tell an experienced architect was involved. Master bedroom with attached study nook is a detail I particularly liked. Kitchen counter depth is wider than standard which matters if you actually cook.

The Science City Road location: ISRO campus proximity brings government scientist and officer families who are excellent long-term residents and tenants. These are stable, senior professionals who pay their maintenance and rent on time and look after their homes. If you're planning to rent, this is a premium tenant profile.

Pricing is 6800-7500 per sqft. Shivalik commands and deserves a premium. The resale market for Shivalik projects in Ahmedabad is consistently liquid. Their older projects rarely stay in resale market more than 60 days.

One thing to check: parking in the specific tower — in the Sharda project, towers A and B have better parking allocation than C and D apparently. Verify your allocated parking space before finalizing.`,
      daysAgo: 44,
    },
    comments: [
      { userName: 'Heena Trivedi', content: `The ISRO/IIT professional tenant profile is exactly right. My friend rents to an ISRO scientist in a Shivalik project in Bodakdev — 4 years, no issues, no complaints, paid on time every month. This demographic is exceptional as tenants.`, daysAfter: 3 },
      { userName: 'Rushabh Gandhi', content: `Shivalik's resale liquidity is their biggest asset. You're never stuck with a Shivalik flat — there are always buyers. This matters enormously when life circumstances change and you need to exit. Local builders can't offer this.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Bhavin Desai', score: 5, review: 'Shivalik quality is the Ahmedabad benchmark. Science City Road location is underrated. Strong buy.' },
      { userName: 'Rushabh Gandhi', score: 5, review: 'Shivalik resale liquidity is unmatched in Ahmedabad. That alone justifies the brand premium.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Navratna Corporate Park Residences',
    propertyType: 'APARTMENT',
    address: 'Ambli-Bopal Road, Ahmedabad 380058',
    priceMin: 7200000, priceMax: 16000000,
    topic: {
      userName: 'Chirag Modi',
      title: 'Navratna Ambli — corporate park attached residences, unique concept for Ahmedabad',
      description: `Navratna Corporate Park is one of Ahmedabad's premium commercial addresses. The residential component — built next to the corporate park — is an interesting concept: live where you (or your tenants) work. Sharing thoughts after an extensive visit.

The concept: corporate tenants in the park include HDFC, ICICI, and several MNC back offices. The residential towers are literally adjacent — a covered walkway connects the two. For the right tenant profile, this is the ultimate convenience. No commute.

The residential product is genuinely premium — Navratna has maintained consistency between their commercial and residential specs. Lobby treatment, corridor width, and the overall finish feel closer to a commercial building (which is a compliment) than most residential projects.

Units are large — 3 BHK here is 2000+ sqft carpet. The pricing at 7500-8500 per sqft reflects this. Total ticket for a 3 BHK is 1.5-1.7 Cr.

From a rental investment perspective, this is compelling. HDFC and ICICI senior managers need housing close to work and will pay a premium rent for the walkway access. Furnished 3 BHK I'd estimate at 50-65k per month — that's 4-4.5% gross yield on investment which is solid for Ahmedabad.

For end-use: works perfectly if you work in the Ambli-Bopal corporate belt. The area has established restaurants and social life nearby (Sindhu Bhavan Road is 10-12 minutes). Not isolated despite the corporate park character.

The development around Navratna is still maturing — some adjacent plots are under construction. 2-3 more years before the immediate streetscape is fully settled.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Avni Parikh', content: `The walkway-to-office concept is unique in Ahmedabad and genuinely valuable. In Bangalore, projects with similar proximity to tech parks command 20-30% premium. Navratna is doing it before the market fully values it. Early buyers are getting a good deal.`, daysAfter: 4 },
      { userName: 'Shreya Joshi', content: `I work at an HDFC office in the corporate park. The walkway is real and it's covered and air-conditioned. In Ahmedabad's summer heat, this is not a minor feature — it's the difference between hating your commute and not having one. Very seriously considering a unit here.`, daysAfter: 6 },
    ],
    ratings: [
      { userName: 'Chirag Modi', score: 4, review: 'Unique and practical concept. Premium but justified for the right buyer profile — corporate belt workers and investors.' },
      { userName: 'Shreya Joshi', score: 5, review: 'The walkway to office is genuinely life-changing in Ahmedabad summer. Worth the premium for those who work in the park.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Ganesh Meridian',
    propertyType: 'APARTMENT',
    address: 'Sola, Ahmedabad 380060',
    priceMin: 5200000, priceMax: 10500000,
    topic: {
      userName: 'Heena Trivedi',
      title: 'Ganesh Meridian Sola — ready to move in 2025, worth the wait?',
      description: `Ganesh Meridian has been under construction in Sola for 3 years. It's now ready for possession. I was among the early bookers and want to share the experience of the wait and what I found on possession day.

Sola is a well-established Ahmedabad neighborhood. SA Road, Sola Civil Hospital proximity, and the multiple schools in the vicinity make it a solid family address. It's not as glamorous as Bopal or Prahlad Nagar but it's been a residential area for 20+ years with proper infrastructure.

Ganesh Builders have been doing Ahmedabad real estate for decades. Their older projects in Navrangpura and Memnagar are well-maintained and have held value. Meridian is their premium offering and the first high-rise they've done.

Possession experience: flat was handed over in good condition. The snagging list had about 12 items — minor things like a wardrobe hinge misaligned, one tap with low pressure, a tile that wasn't properly grouted. All resolved within 10 days of submission. Positive possession experience.

The apartment: my 3 BHK is 1750 sqft carpet. The master bedroom has a window seat nook which I love — small detail but shows design thought. Kitchen is modular from the builder with adequate storage. Not luxury fittings but correct quality for the price.

What surprised me negatively: the road in front of the project is still narrow. Ganesh committed to working with the local authority on road widening — unclear when this will happen. Entry/exit from the society can get congested in peak hours.

Overall: worth the 3-year wait. Sola is a reliable long-term address. Ganesh delivered a clean product.`,
      daysAgo: 16,
    },
    comments: [
      { userName: 'Avni Parikh', content: `The road widening issue you mention is the one thing that has held Sola back from being a truly premium address. The Sola-Ghatlodia Road is too narrow for the residential density it's now supporting. Keep pressure on Ganesh and the local ward to resolve this.`, daysAfter: 2 },
      { userName: 'Minal Shah', content: `Ganesh's track record on snagging resolution is above average for Ahmedabad mid-market. 10 days to resolve snagging items is fast — most builders take 30-60 days and some never properly close them. Your experience confirms what I'd heard.`, daysAfter: 5 },
    ],
    ratings: [
      { userName: 'Heena Trivedi', score: 4, review: 'Clean possession, responsive builder, good Sola location. Road width is the one drawback to watch.' },
      { userName: 'Minal Shah', score: 4, review: 'Ganesh is a reliable mid-market builder in Ahmedabad. Delivered what was promised.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Arvind Aavishkaar',
    propertyType: 'APARTMENT',
    address: 'Gota-Tragad Road, Ahmedabad 382481',
    developerName: 'Arvind SmartSpaces',
    developerSlug: 'arvind-smartspaces',
    priceMin: 3800000, priceMax: 7500000,
    topic: {
      userName: 'Rushabh Gandhi',
      title: 'Arvind SmartSpaces Aavishkaar — listed builder brings trust to Gota-Tragad belt',
      description: `Arvind SmartSpaces is a publicly listed company (listed on BSE/NSE) which brings a different accountability level compared to private developers. Their quarterly filings show project progress and financial health. For a risk-averse buyer this matters.

Aavishkaar on the Gota-Tragad corridor is targeting the 40-80 lakh first-time buyer. Arvind's previous projects — Uplands in Ahmedabad, Sporcia in Bangalore — show a clear design sensibility: modern, clean, good open spaces.

The Gota-Tragad belt: this is north Ahmedabad's fastest developing corridor. The connection to Sabarmati Riverfront (via the new connectivity road) and to Gandhinagar via SG Highway extension has improved significantly. New malls and retail developments are coming up on this road.

Product at Aavishkaar: 1 BHK, 2 BHK, and 3 BHK in a tower layout. The 2 BHK at 900-950 sqft carpet is efficiently designed. Arvind's hallmark — the garden and landscape design — is evident here too. The central green zone is generously sized.

Pricing at 4200-5000 per sqft is competitive for an Arvind-brand product. Local comparable projects are cheaper but Arvind's listing and accountability structure gives comfort.

One important note: Arvind SmartSpaces has a JDA (Joint Development Agreement) model for some projects — meaning they don't own the underlying land but develop it for the landowner. Verify whether Aavishkaar is a JDA project or own land. This affects the legal structure of your purchase. If JDA, ensure the landowner's consent and agreement terms are clear.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Chirag Modi', content: `The listed company accountability point is real. Arvind files quarterly updates where they disclose project completion percentages and any regulatory issues. You can literally track your building's progress on BSE. No private developer gives you this transparency.`, daysAfter: 5 },
      { userName: 'Kalpesh Patel', content: `The JDA structure point is important advice. Always clarify the underlying land ownership before booking any Arvind project. Their investor relations team is usually responsive if you call and ask directly. This is actually a positive — you can actually get answers, unlike many private builders.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Rushabh Gandhi', score: 4, review: 'Listed company accountability is a genuine differentiator. Good product for north Ahmedabad value buyers.' },
      { userName: 'Chirag Modi', score: 4, review: 'Transparency from BSE filings is the hidden USP of Arvind SmartSpaces. Recommend for risk-averse first-time buyers.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Iscon Platinum',
    propertyType: 'APARTMENT',
    address: 'Bopal, Ahmedabad 380058',
    priceMin: 5500000, priceMax: 10800000,
    topic: {
      userName: 'Avni Parikh',
      title: 'Iscon Platinum Bopal — established Bopal society, resale or new which way to go?',
      description: `Iscon Platinum has been one of Bopal's most recognized societies for nearly a decade. I'm looking at resale here vs buying in a newer Bopal project. Sharing my analysis.

Iscon Group in Ahmedabad is synonymous with quality at a Gujarati value-oriented price point. Their Elegance, Iscon Exotica, and Platinum projects all have a consistent character — good construction, generous parking, proper maintenance. Platinum specifically has aged very gracefully.

Bopal's established character now vs 8 years ago: Bopal has completely transformed. When Platinum launched, it was on the edge of development. Now it's in the heart of a fully developed residential area. Schools (DPS, Udgam), hospitals, markets, restaurants — everything is established.

Resale pricing in Iscon Platinum: 2 BHK is going at 60-75 lakhs, 3 BHK at 80-100 lakhs. This is 15-20% below new Bopal launches from comparable builders. The discount reflects the age of the building rather than any quality concern.

The argument for resale: you get immediate possession, established society life, known maintenance costs, and a proven neighborhood. The argument against: older kitchen and bathroom fittings may need renovation (budget 3-5 lakhs extra for this).

New Bopal launch comparison: new launches are 6000-7000 per sqft with 2-year wait and the usual uncertainty. For the same money in resale you get an immediately usable flat in a mature society.

My view: for end-use, the Iscon Platinum resale makes more sense than a new Bopal launch unless you specifically need a certain floor plan that's only available new. The community is established and proven.`,
      daysAgo: 32,
    },
    comments: [
      { userName: 'Bhavin Desai', content: `Totally agree on the resale thesis for established Bopal societies. The 3-5 lakh renovation you mention pays back in 6 months of not paying rent while waiting for a new project. The net math strongly favors ready resale in this market.`, daysAfter: 3 },
      { userName: 'Heena Trivedi', content: `Iscon Platinum's parking is one thing that stands out — 2 covered parking spaces per unit in a 10-year-old society is uncommon. Most older projects in Ahmedabad had 1 parking per flat. This is a detail that becomes very apparent daily.`, daysAfter: 7 },
    ],
    ratings: [
      { userName: 'Avni Parikh', score: 4, review: 'Proven society in prime Bopal. Resale is the smarter buy vs equivalent new launches. Strong long-term hold.' },
      { userName: 'Bhavin Desai', score: 4, review: 'Ready possession + established community = real value. Iscon quality stands the test of time.' },
    ],
  },
]

// ─── Runner ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('🏙️  Seed Part A — Pune + Ahmedabad\n')
  const hash = await bcrypt.hash('Forum@2024!', 10)
  const userMap: Record<string, string> = {}

  // Load existing users first
  const existing = await prisma.user.findMany({ select: { id: true, name: true } })
  for (const u of existing) userMap[u.name] = u.id

  // Create new users
  for (const u of EXTRA_USERS) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, emailVerified: new Date(), role: 'USER' },
    })
    userMap[u.name] = user.id
    process.stdout.write('.')
  }
  console.log(`\n  ✓ users ready\n`)

  let topics = 0, comments = 0, ratings = 0
  for (const prop of PROPS) {
    const city = await prisma.city.findUnique({ where: { slug: prop.citySlug } })
    if (!city) { console.warn(`  ⚠ ${prop.citySlug} not found`); continue }

    const base = toSlug(prop.propertyName)
    let slug = base, n = 0
    while (await prisma.topic.findUnique({ where: { cityId_slug: { cityId: city.id, slug } } })) slug = `${base}-${++n}`

    const authorId = userMap[prop.topic.userName]
    if (!authorId) { console.warn(`  ⚠ user ${prop.topic.userName} not found`); continue }

    const topicDate = rDate(prop.topic.daysAgo, prop.topic.daysAgo - 1)
    const topic = await prisma.topic.create({
      data: {
        cityId: city.id, userId: authorId, title: prop.topic.title, slug,
        propertyName: prop.propertyName, propertyType: prop.propertyType as any,
        description: prop.topic.description, address: prop.address,
        priceMin: prop.priceMin, priceMax: prop.priceMax,
        developerName: prop.developerName || null, developerSlug: prop.developerSlug || null,
        isPublished: true, createdAt: topicDate, updatedAt: topicDate,
      },
    })
    topics++

    for (const c of prop.comments) {
      const uid = userMap[c.userName]
      if (!uid) continue
      const d = new Date(topicDate.getTime() + c.daysAfter * 86400000)
      await prisma.comment.create({ data: { topicId: topic.id, userId: uid, content: c.content, createdAt: d, updatedAt: d } })
      comments++
    }
    await prisma.topic.update({ where: { id: topic.id }, data: { commentCount: prop.comments.length } })

    const seen = new Set<string>()
    let rSum = 0, rCnt = 0
    for (const r of prop.ratings) {
      const uid = userMap[r.userName]
      if (!uid || seen.has(uid)) continue
      seen.add(uid)
      const d = rDate(prop.topic.daysAgo - 1)
      await prisma.rating.create({ data: { topicId: topic.id, userId: uid, score: r.score, review: r.review, createdAt: d, updatedAt: d } })
      rSum += r.score; rCnt++; ratings++
    }
    if (rCnt > 0) await prisma.topic.update({ where: { id: topic.id }, data: { avgRating: rSum / rCnt, ratingCount: rCnt } })
    await prisma.topicSubscription.upsert({ where: { topicId_userId: { topicId: topic.id, userId: authorId } }, update: {}, create: { topicId: topic.id, userId: authorId } })
    console.log(`  ✓ [${prop.citySlug}] ${prop.propertyName}`)
  }
  console.log(`\n✅ Part A done — topics:${topics} comments:${comments} ratings:${ratings}`)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
