// Tier 1 Part C — Lucknow (8) + Kanpur (7)
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
function rDate(start: number, end = 0) {
  return new Date(Date.now() - end * 86400000 - Math.random() * (start - end) * 86400000)
}

const EXTRA_USERS = [
  { name: 'Ravi Shankar Mishra',  email: 'ravi.shankar.mishra.lko@gmail.com' },
  { name: 'Archana Tiwari',       email: 'archana.tiwari.lko@gmail.com' },
  { name: 'Neeraj Verma',         email: 'neeraj.verma.lko@gmail.com' },
  { name: 'Shweta Srivastava',    email: 'shweta.srivastava.lko@gmail.com' },
  { name: 'Avinash Gupta',        email: 'avinash.gupta.knp@gmail.com' },
  { name: 'Meera Bajpai',         email: 'meera.bajpai.knp@gmail.com' },
  { name: 'Sanjay Chaturvedi',    email: 'sanjay.chaturvedi.knp@gmail.com' },
  { name: 'Kamla Devi Singh',     email: 'kamla.devi.knp@gmail.com' },
  { name: 'Piyush Awasthi',       email: 'piyush.awasthi.lko@gmail.com' },
  { name: 'Reena Saxena',         email: 'reena.saxena.lko@gmail.com' },
  { name: 'Atul Shukla',          email: 'atul.shukla.knp@gmail.com' },
  { name: 'Vandana Pandey',       email: 'vandana.pandey.lko@gmail.com' },
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
  // ── LUCKNOW ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'lucknow',
    propertyName: 'Ansal Golf City',
    propertyType: 'APARTMENT',
    address: 'Sultanpur Road, Lucknow 226002',
    developerName: 'Ansal API',
    developerSlug: 'ansal-api',
    priceMin: 4500000, priceMax: 11000000,
    topic: {
      userName: 'Ravi Shankar Mishra',
      title: 'Ansal Golf City Sultanpur Road — golf township living in Lucknow, is it worth it?',
      description: `I have been tracking Ansal Golf City for about two years now, visited the site four times, and finally took the plunge six months ago. Let me share what I know, both the good and the not-so-good.

The project is positioned around an 18-hole golf course and that is genuinely the USP. The greenery is real — when you drive into the township on a winter morning, it is unlike anything else available in Lucknow right now. The roads inside are wide, tree-lined, and the overall planning reflects a township that was designed by someone who actually thought about livability rather than just cramming maximum units.

Sultanpur Road has transformed dramatically in the last five years. The expressway connectivity to Agra-Lucknow Expressway makes this location viable for people who travel frequently. The airport is also reasonably accessible — about 30 minutes without traffic.

Now the concerns. Ansal as a developer has had troubled projects across India and some buyers in older Ansal properties have faced possession delays of 3-4 years beyond the promised date. I specifically verified Golf City's RERA registration — it is registered under UP RERA — and the current phase I am in has been largely on track so far. Do your own RERA verification before booking, do not take the sales person's word.

The project has a proper club house, swimming pool, and a golf driving range that residents can use. Maintenance charges are on the higher side — around ₹4-5 per sqft per month — but for a golf course township that is reasonable.

Pricing at 45-110 lakh depending on configuration and floor is fair by Lucknow standards for this kind of product. No other project in Lucknow offers a genuine golf course living experience at this price. The nearest comparison in UP is Greater Noida which is a different market altogether.`,
      daysAgo: 38,
    },
    comments: [
      { userName: 'Abhishek Srivastava', content: `@Ravi Shankar Mishra ji, your RERA point is very important. I actually looked up the Ansal Golf City RERA number on the UP RERA website — UP-RERA-PRJ-xxxxx. The completion date for Phase 2 has been revised once already. Not alarming but shows the usual builder pattern. That said, the actual construction quality I saw during my visit last month is genuinely good. The clubhouse structure is nearly complete.`, daysAfter: 2 },
      { userName: 'Sunita Pandey', content: `Sultanpur Road connectivity is improving but the stretch from Hazratganj to the project entry can be painful during peak hours. The Lucknow Metro extension plans for this corridor are still years away. For families where both spouses work in the city centre, this is a real daily inconvenience. Otherwise the project itself is beautiful.`, daysAfter: 4 },
      { userName: 'Piyush Awasthi', content: `I bought in Golf City Phase 1 and moved in last year. The water supply situation was inconsistent for the first 3 months — the underground reservoir was not fully commissioned. Now it is sorted. Ansal's maintenance team is responsive, I will give them that. The golf course is pristine and just walking there in the morning makes you feel the purchase was worthwhile.`, daysAfter: 7 },
      { userName: 'Divya Tripathi', content: `For investment perspective — rental demand in this area is still developing. This is not like Gomti Nagar where you can always find a tenant. The Golf City location appeals to a very specific profile of tenant — senior corporate, expat, or business owner. Supply of such tenants in Lucknow is limited. Good for end-use, not ideal if rental income is your primary objective.`, daysAfter: 11 },
    ],
    ratings: [
      { userName: 'Ravi Shankar Mishra', score: 4, review: 'Best township concept in Lucknow. Ansal track record is the only concern — verify RERA and visit the site personally before booking.' },
      { userName: 'Piyush Awasthi', score: 4, review: 'Living here is genuinely pleasant. Initial teething issues resolved. Golf course morning walks are priceless.' },
      { userName: 'Sunita Pandey', score: 3, review: 'Beautiful project but city-centre commute is a pain. Good for retirees or work-from-home professionals.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Eldeco Utopia',
    propertyType: 'APARTMENT',
    address: 'Raebareli Road, Lucknow 226025',
    developerName: 'Eldeco Group',
    developerSlug: 'eldeco-group',
    priceMin: 5500000, priceMax: 12000000,
    topic: {
      userName: 'Archana Tiwari',
      title: 'Eldeco Utopia Raebareli Road — Lucknow\'s most trusted builder, does Utopia live up to it?',
      description: `My family has lived in Lucknow for three generations and anyone who knows this city knows that Eldeco is synonymous with trust in real estate here. My parents bought their flat in Eldeco Elegance in 2001 and it was the smoothest property transaction they ever had. When I was looking for my own home, Eldeco Utopia on Raebareli Road was naturally on the shortlist.

Eldeco's reputation in Lucknow is not marketing — it is earned. Their projects consistently deliver on time, the construction quality is honest, and post-possession maintenance is taken seriously. In a city where many local builders have left buyers stranded, Eldeco's track record stands apart.

Raebareli Road has been developing steadily. The area benefits from good road infrastructure — NH 30 connectivity is solid. The KGMU medical campus and several good schools are within reasonable distance. For families where medical access matters, this location has an advantage.

Utopia specifically offers well-designed 2 and 3 BHK apartments with proper room proportions. The 3 BHK at 1450-1600 sqft is genuinely usable — not padded with wasteful passages. Eldeco does not do the fashionable thing of showing huge numbers on paper while shrinking the actual rooms. What they quote is what you get.

I am a first-time buyer and the Eldeco sales process was the least stressful I encountered. No false urgency, no pressure tactics, transparent documents. The loan process through their banking tie-ups was smooth. For someone new to the property market, this matters enormously.

The pricing at 55-120 lakhs is on the higher side for Raebareli Road — Eldeco commands a 15-20% premium over comparable local builders. But for Lucknow buyers who prioritize peace of mind over marginal savings, this premium is entirely justified.`,
      daysAgo: 55,
    },
    comments: [
      { userName: 'Mohit Verma', content: `Eldeco has never missed possession in any of their Lucknow projects by more than 2-3 months as far as I know. That is a remarkable record for Indian real estate. The Utopia project I tracked also got its OC roughly on time. For buyers who have been burned by delayed projects, this reliability is worth paying for.`, daysAfter: 3 },
      { userName: 'Reena Saxena', content: `@Archana Tiwari — completely agree on the sales process. I visited 8 projects in Lucknow before finalizing Utopia and Eldeco's approach was the most professional. The site visit was properly organised, the price list was transparent, and no one called me 15 times a day afterward. That alone told me something about how this company operates.`, daysAfter: 6 },
      { userName: 'Rajesh Yadav', content: `Raebareli Road location is increasingly attractive for government employees — the State Secretariat and several government offices are accessible. I know at least a dozen IAS and PCS officers who have bought in this corridor precisely because it offers both quality living and proximity to their workplaces.`, daysAfter: 10 },
      { userName: 'Vandana Pandey', content: `One thing I want to add — Eldeco Utopia has a proper RWA that functions. Monthly maintenance meetings are held, accounts are shared with residents, and there is a WhatsApp group where genuine issues get resolved. This sounds basic but in many Lucknow societies it simply does not happen. The community aspect of Eldeco projects is something they genuinely cultivate.`, daysAfter: 14 },
    ],
    ratings: [
      { userName: 'Archana Tiwari', score: 5, review: 'Eldeco is the gold standard in Lucknow real estate. Utopia continues that tradition. Peace of mind has a price and it is worth it.' },
      { userName: 'Mohit Verma', score: 5, review: 'Possession on time, OC in hand, construction honest. Every box ticked. Eldeco never disappoints.' },
      { userName: 'Reena Saxena', score: 4, review: 'Sales process was the most ethical I encountered. The product matches what was promised. Slightly expensive but deserved.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Shalimar Mannat',
    propertyType: 'APARTMENT',
    address: 'Shaheed Path, Lucknow 226010',
    developerName: 'Shalimar Corp',
    developerSlug: 'shalimar-corp',
    priceMin: 5000000, priceMax: 9500000,
    topic: {
      userName: 'Neeraj Verma',
      title: 'Shalimar Mannat Shaheed Path — riverside positioning, real or marketing?',
      description: `Shaheed Path is arguably Lucknow's most premium road right now and Shalimar Mannat's claim of riverside positioning is something I wanted to verify for myself. So I spent considerable time at the project site, spoke with existing residents of neighbouring Shalimar projects, and here is my honest assessment.

The riverside claim has some basis. The Gomti river runs in the vicinity and from the higher floors of Mannat, you can see the river and the green belt along it. It is not a direct riverfront — there is some distance and the view is partial — but it is not completely fabricated either. The air quality in this part of Shaheed Path is noticeably better than deeper city areas.

Shaheed Path as a road is exceptional — it is one of Lucknow's few properly wide, signal-free stretches. The connectivity to Gomti Nagar, the airport, and the Lucknow-Agra Expressway makes this corridor one of the most accessible in the city. The upside for Mannat residents is that daily commuting on this road is significantly less stressful than other parts of Lucknow.

Shalimar Corp is a local Lucknow builder with reasonable track record. Not as established as Eldeco but not fly-by-night either. Their previous project Shalimar Galaxy had modest delays but delivered. I spoke to three Galaxy residents and all said post-possession maintenance improved significantly in year two.

The 2 BHK at 50-65 lakh and 3 BHK at 70-95 lakh is reasonable for Shaheed Path. You will not find anything at these rates from a national developer on this road. Shalimar is giving you the address at a local builder discount.

My recommendation: buy only after checking RERA completion certificate timeline and verifying the developer's current financial position. The product is good but always do your diligence on a local builder.`,
      daysAgo: 28,
    },
    comments: [
      { userName: 'Shweta Srivastava', content: `I visited Mannat last month. The river view from the 12th floor sample flat was genuinely pleasant — not breathtaking but real. The more important point is the Shaheed Path address itself. Five years from now this corridor will be fully developed and the appreciation potential is significant. Shalimar is letting you buy this address at pre-saturation pricing.`, daysAfter: 2 },
      { userName: 'Priyanka Mishra', content: `@Neeraj Verma bhai, Shalimar Corp's RERA registration for Mannat is active and the project is on track as per the UP RERA portal as of last month. I check these things for every project I consider. The expected OC date is reasonable. Not alarm-bell territory but worth a personal check before booking.`, daysAfter: 5 },
      { userName: 'Abhishek Srivastava', content: `The Shaheed Path green belt is genuinely one of the nicest things about this address. The Gomti Riverfront Development project has turned the embankment into a proper public space. Evening walks along there are lovely. For families with children or elderly, the outdoor recreation factor is real.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Neeraj Verma', score: 3, review: 'Good project on a premium road. Shalimar is not Eldeco — do your diligence. The address is the main value here.' },
      { userName: 'Shweta Srivastava', score: 4, review: 'Shaheed Path location with partial river views at local builder pricing. Appreciation potential is strong.' },
      { userName: 'Priyanka Mishra', score: 3, review: 'Reasonable local builder, RERA compliant. Not a luxury product but honest for the price.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Purvanchal Heights',
    propertyType: 'APARTMENT',
    address: 'Gomti Nagar Extension, Lucknow 226010',
    developerName: 'Purvanchal Projects',
    developerSlug: 'purvanchal-projects',
    priceMin: 4000000, priceMax: 7500000,
    topic: {
      userName: 'Kamla Devi Singh',
      title: 'Purvanchal Heights Gomti Nagar Extension — affordable highrise in premium zone worth it?',
      description: `Gomti Nagar Extension has become Lucknow's most desirable address in the last five years. The development is planned, roads are wide, parks are maintained. But property prices in core Gomti Nagar are beyond my budget. Purvanchal Heights caught my attention because it is in the Extension zone and offers highrise living at 40-75 lakhs which is significantly lower than Mahagun, Supertech, or other names in this area.

I am a government teacher and my budget is real. I cannot stretch beyond 55 lakhs for my 2 BHK and Purvanchal Heights fits. The developer — Purvanchal Projects — is actually a UP government undertaking, which immediately gives me confidence on the possession front. Government developers may be slow but they do not vanish with your money.

The construction I saw is simple but solid. No unnecessary frills, no fancy lobbies. But the basics are right — proper brick and mortar, standard sanitary fittings, and the floor plans are functional. The 2 BHK at 950 sqft is compact but the room shapes are regular, not wasted on odd angles.

The highrise advantage — floor 10 and above — gives you clean air and distant views of Gomti Nagar's green belt. The podium garden and children's play area are adequate. Nothing like what private luxury developers claim, but genuinely functional for a family.

For people like me — middle-income government/private sector employees who want the Gomti Nagar address at an honest price — Purvanchal Heights is the realistic option. The premium private projects in this zone are not accessible to us. This fills that gap without compromising on the essential things that matter: safe neighbourhood, government developer, proper address.`,
      daysAgo: 47,
    },
    comments: [
      { userName: 'Vandana Pandey', content: `Purvanchal Projects is indeed a UP government company and that is genuinely reassuring. I have seen so many private builders in Lucknow disappear or delay projects by 4-5 years. With a government entity, at minimum the land title is clear and the project will eventually complete. For a first home, that security is invaluable.`, daysAfter: 3 },
      { userName: 'Rajesh Yadav', content: `The Gomti Nagar Extension address is what you are really buying here. The extension is developing fast — good schools have come up, there are hospitals, the metro extension plans include stations nearby. Getting into this zone at 40-50 lakh now is a decision you will not regret in 5 years.`, daysAfter: 6 },
      { userName: 'Mohit Verma', content: `Just to add some realism — the finishes in Purvanchal projects are government-quality, meaning average. The floor tiles are basic, the bathroom fittings are standard issue. If you are comparing the look and feel to a private developer show flat it will disappoint. But the structure is sound and that is what matters for a long-term home.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Kamla Devi Singh', score: 4, review: 'Government developer in Gomti Nagar Extension at an honest price. Best affordable highrise option in this zone.' },
      { userName: 'Vandana Pandey', score: 4, review: 'Trust factor is high because of government backing. Finishes are basic but the essentials are solid.' },
      { userName: 'Mohit Verma', score: 3, review: 'Sets realistic expectations — this is quality for the price, not luxury. Right choice for budget-conscious buyers wanting the address.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Godrej Woods Lucknow',
    propertyType: 'APARTMENT',
    address: 'Sector 5, Lucknow 226010',
    developerName: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    priceMin: 7000000, priceMax: 15000000,
    topic: {
      userName: 'Piyush Awasthi',
      title: 'Godrej Woods Lucknow Sector 5 — Godrej\'s Lucknow entry, pricing controversy explained',
      description: `Godrej Properties entering Lucknow was big news and Godrej Woods generated enormous buzz when it launched. I attended the launch event and have been tracking this project closely, including speaking to buyers who booked and some who walked away. The pricing controversy deserves an honest discussion.

Godrej launched Woods at 6500-7500 per sqft in an area where established Lucknow developers like Eldeco and Shalimar are doing 4000-5500 per sqft. The Godrej premium over the market is roughly 40-50% on a per sqft basis. The question every buyer is asking: is the Godrej brand worth 40% extra in a tier-2 city market?

For Mumbai or Bangalore buyers considering Lucknow investment, the answer might be yes — Godrej's national brand recognition and resale liquidity in premium markets is real. For a Lucknow end-user buying their primary residence, the calculus is harder. That 40% extra money buys you a lot of upgrades in the local market.

What Godrej actually delivers at this price: their construction quality is genuinely superior. The concrete work, the finishing standards, the MEP quality — all noticeably better than even good local Lucknow builders. The woods concept — real trees preserved within the project — is executed with seriousness, not just marketing renders. The green coverage is tangible.

My honest take: if you are in the 70-150 lakh budget range in Lucknow, Godrej Woods is justifiable on quality alone. The resale market for Godrej in Lucknow will likely be strong because of the brand. But do not expect Godrej pricing to appreciate faster than good Eldeco or Shalimar projects in the same zone — Lucknow's premium buyer base is still developing. The appreciation will come but patience is needed.`,
      daysAgo: 22,
    },
    comments: [
      { userName: 'Ravi Shankar Mishra', content: `The pricing controversy is real but I think people focus on the per sqft number without comparing the actual apartments. Godrej's 3 BHK at 1600 sqft is not the same as a local builder's 3 BHK at 1600 sqft. The ceiling height, the window sizes, the bathroom area — Godrej's overall package is meaningfully better. Compare apples to apples before calling it overpriced.`, daysAfter: 2 },
      { userName: 'Sunita Pandey', content: `I specifically asked the Godrej sales team about their resale data from other tier-2 city entries — Nagpur, Chandigarh, Jaipur. They shared some numbers voluntarily (which itself is unusual). Appreciation in those cities has been 10-14% annually post-possession which is strong. Lucknow should follow a similar trajectory given the economic growth here.`, daysAfter: 4 },
      { userName: 'Divya Tripathi', content: `One thing I will say — Godrej's loan facilitation is seamless. My colleague booked in Woods and got the home loan processed in 12 days through Godrej's banking partners. For first-time buyers who find the loan process intimidating, this is a real benefit that comes with national developer booking.`, daysAfter: 7 },
      { userName: 'Neeraj Verma', content: `@Piyush Awasthi bhai, the Sector 5 address itself is premium Lucknow. Not everyone agrees on Godrej pricing but no one disputes that the location is among the best in the city. Even if you feel the pricing is stretched, you are getting an undeniably great address.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Piyush Awasthi', score: 4, review: 'Godrej quality is real and demonstrable. The premium is real too. Worth it if your budget allows — the brand and build quality justify the difference.' },
      { userName: 'Ravi Shankar Mishra', score: 4, review: 'Do not compare per sqft blindly. Compare the actual product. Godrej wins on product quality even if not on price.' },
      { userName: 'Sunita Pandey', score: 4, review: 'National brand with strong resale potential. Lucknow\'s premium market is ready for this kind of product.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'ATS Pious Orchards Phase 2',
    propertyType: 'APARTMENT',
    address: 'Sultanpur Road, Lucknow 226002',
    developerName: 'ATS Infrastructure',
    developerSlug: 'ats-infrastructure',
    priceMin: 7500000, priceMax: 16000000,
    topic: {
      userName: 'Shweta Srivastava',
      title: 'ATS Pious Orchards Phase 2 Sultanpur Road — is Phase 2 as good as Phase 1?',
      description: `I am an NRI based in Singapore and have been scouting for investment property in Lucknow for the past year. ATS Pious Orchards Phase 1 is already quite well known and command premium resale values in the Sultanpur Road corridor. Phase 2 was just launched and the question everyone is asking is whether Phase 2 is as good a buy as Phase 1 turned out to be.

My research involved visiting the site during my last India trip, speaking with Phase 1 residents, and doing a detailed comparison of the Phase 2 launch pricing versus Phase 1 current resale rates.

The good news: ATS Phase 1 buyers have seen excellent appreciation. The project delivered with minor delays, the build quality is consistently ATS-grade which is premium for UP, and the Sultanpur Road address has only grown stronger. Phase 1 resale units are commanding 15-20% premiums over Phase 2 launch price, which actually creates interesting dynamics.

Phase 2 launch pricing at 75-160 lakhs is 25-30% higher than Phase 1 was at launch. That price increase reflects both the general market appreciation and ATS's confidence in the brand they have built at this location. The configuration mix in Phase 2 has more 3 BHK units and a new 4 BHK tower which was not in Phase 1.

For NRI investors: the Lucknow residential market has strong fundamentals. The city's economy is growing, it is the state capital with stable government employment, and the Jewar Airport in NCR is bringing more flight connectivity to Lucknow airport which improves the NRI connection.

One caution: Phase 2 is a longer delivery window — ATS has quoted 2027 for Phase 2 vs Phase 1 which delivered in 2024. International buyers need to budget for this longer lock-in period.`,
      daysAgo: 18,
    },
    comments: [
      { userName: 'Abhishek Srivastava', content: `I am in ATS Phase 1 and can confirm the possession was about 6 months delayed — not bad by Lucknow standards. The actual product quality justified the wait completely. The Phase 2 location within the same campus is actually slightly better — it overlooks the Phase 1 garden which is now mature and full of trees. Buying Phase 2 means getting a partially developed neighbourhood view from day one.`, daysAfter: 2 },
      { userName: 'Reena Saxena', content: `@Shweta Srivastava ji — for NRI perspective, ATS offers NRI-specific services including NRO account management support and power of attorney facilitation. I know this because my brother is in the Gulf and he found the ATS documentation process much more NRI-friendly than comparable UP developers. That is worth mentioning as a practical advantage.`, daysAfter: 5 },
      { userName: 'Mohit Verma', content: `The Sultanpur Road corridor is now firmly established as Lucknow's premium residential spine. Between ATS, Godrej, and Ansal Golf City, this road has genuinely premium inventory. The infrastructure is following — upcoming FNG expressway connections will further enhance this corridor's importance. Phase 2 is buying into an established success rather than taking a bet on an untested project.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Shweta Srivastava', score: 4, review: 'Phase 2 builds on proven Phase 1 success. NRI-friendly builder on a premium address. The 2027 delivery timeline is the main patience test.' },
      { userName: 'Abhishek Srivastava', score: 5, review: 'Phase 1 resident endorsing Phase 2. ATS quality is consistent. Phase 2 buyers get the benefit of Phase 1\'s matured greenery as their view.' },
      { userName: 'Reena Saxena', score: 4, review: 'Strong project on a strong road. ATS is one of few UP builders with genuine national credibility.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Ratan Pearl',
    propertyType: 'APARTMENT',
    address: 'Transport Nagar, Lucknow 226012',
    developerName: 'Ratan Developers',
    developerSlug: 'ratan-developers',
    priceMin: 2800000, priceMax: 5500000,
    topic: {
      userName: 'Atul Shukla',
      title: 'Ratan Pearl Transport Nagar — budget housing near Transport Nagar, who is this really for?',
      description: `I want to be upfront about who should be reading this review: Ratan Pearl is a budget housing project aimed at buyers in the 28-55 lakh range, particularly those connected to the transport and logistics industry in Lucknow. I am a truck fleet owner based in Transport Nagar and have been looking for a proper flat near my work for my family, who currently lives in rented accommodation in the area.

Transport Nagar is not a glamorous address. It is Lucknow's main transport hub — trucks, godowns, wholesale markets, mechanics. The area is commercially vital to the city but residential development here is limited precisely because it is not aspirational in the conventional sense. Ratan Pearl is one of the few proper apartment projects that has come up in this micro-market.

The pricing reflects the location reality. At 28-55 lakhs for 1 and 2 BHK apartments, this is among the most affordable organised housing in Lucknow. The quality is honest — not fancy, not cheap either. The floor plan efficiency is good. The 1 BHK at 500 sqft and 2 BHK at 850 sqft are actually more efficiently designed than many "affordable luxury" projects I have seen where the sqft includes excessive passages and odd-shaped rooms.

Who benefits from Ratan Pearl: transport business owners and employees, wholesale market workers, industrial area staff, and anyone for whom this part of Lucknow is their economic centre. For this buyer profile, getting out of rented accommodation into owned housing at these prices is genuinely life-changing.

The area has its own established infrastructure — schools, hospitals, daily markets are all accessible. It is not aspirational but it is functional and affordable. RERA registered, local developer with reasonable track record in the budget segment.`,
      daysAgo: 35,
    },
    comments: [
      { userName: 'Sanjay Chaturvedi', content: `This is the kind of honest review that is missing from most property discussions. Not every buyer is chasing a golf course address or Godrej branding. For lakh of working families in Lucknow, getting into owned housing at 30-40 lakh is the real goal. Ratan Pearl fills that need in a practical way.`, daysAfter: 3 },
      { userName: 'Avinash Gupta', content: `I want to flag one thing — the area around Transport Nagar has heavy truck movement from 2am onwards. Noise is a factor if you are a light sleeper. The higher floors and units facing the interior of the project are significantly quieter. Specifically request an upper floor interior-facing unit when booking.`, daysAfter: 6 },
      { userName: 'Meera Bajpai', content: `The 28-55 lakh price range in 2024 Lucknow basically gets you two options — this kind of honest budget project or a completely unreliable builder in a worse location. Given those choices, Ratan Pearl with its working local developer is clearly the smarter pick for the budget.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Atul Shukla', score: 3, review: 'Does exactly what it promises for the target buyer. Not aspirational, not luxurious, but honest affordable housing near your workplace.' },
      { userName: 'Avinash Gupta', score: 3, review: 'Good for the price and the target profile. Insist on upper floor interior-facing units to avoid truck noise.' },
      { userName: 'Meera Bajpai', score: 3, review: 'Best option in this budget for buyers in the Transport Nagar ecosystem. RERA registered and functional.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'Supertech Shades',
    propertyType: 'APARTMENT',
    address: 'Sushant Golf City Road, Lucknow 226030',
    developerName: 'Supertech Limited',
    developerSlug: 'supertech-limited',
    priceMin: 3500000, priceMax: 7000000,
    topic: {
      userName: 'Priyanka Mishra',
      title: 'Supertech Shades Sushant Golf City Road — cautionary tale, check RERA status before anything',
      description: `I am going to write this review differently from the usual format because Supertech Shades is not a straightforward buy recommendation — it requires very specific due diligence before anyone should consider it.

Supertech Limited, the parent company, went through insolvency proceedings at the National Company Law Tribunal level. The Supreme Court of India has been involved in their cases. Their Noida Emerald Court project — the twin towers — became a national news story. This context is not avoidable when you consider any Supertech project anywhere in India.

However — and this is important — not all Supertech projects are in the same legal or completion status. Some projects have been completed, have OCs, and residents are living there. Supertech Shades on Sushant Golf City Road is one project that requires individual verification of its specific RERA status, OC status, and legal standing before you even consider a visit.

If you are reading this and considering Supertech Shades: Step 1 — go to the UP RERA website and search for this project specifically. Check if the RERA registration is active or lapsed. Check the completion certificate status. Step 2 — do not rely on the developer's sales team for this information. They have an incentive to minimise any concerns. Step 3 — engage a property lawyer for 5,000-8,000 rupees to review the documents before paying any token amount.

The Sushant Golf City address is genuinely good — the area is one of Lucknow's better planned residential zones. If Supertech Shades clears legal and RERA verification, the pricing at 35-70 lakh for this address would be genuinely attractive. That is the only reason to consider it at all. But enter with eyes open.`,
      daysAgo: 15,
    },
    comments: [
      { userName: 'Piyush Awasthi', content: `This review is exactly right. I had a friend who booked in a Supertech project in Noida and the experience has been a nightmare for years. The brand name has been severely damaged at the national level. Even if individual projects are technically okay, the association with ongoing legal issues at the corporate level is a real risk that most buyers should not take on unless they are getting an extraordinary deal and have done extraordinary diligence.`, daysAfter: 2 },
      { userName: 'Abhishek Srivastava', content: `The UP RERA website is actually quite usable now — you can check project registration and status without any registration on your part. Takes about 10 minutes. For Supertech Shades specifically, I checked last week — the status shows the project registration. Buyers should check this themselves as status can change. But the point about OC and legal standing still requires deeper verification.`, daysAfter: 4 },
      { userName: 'Divya Tripathi', content: `@Priyanka Mishra didi, the Sushant Golf City zone has multiple better alternatives now. Omaxe has a project there, there are Eldeco and ATS options nearby on Sultanpur Road. For the 35-70 lakh budget, why take the Supertech risk when there are RERA-clean alternatives? The address advantage is not unique to Supertech.`, daysAfter: 7 },
      { userName: 'Neeraj Verma', content: `Just to add — bank loans for Supertech projects are increasingly difficult to get. Several nationalised banks have flagged Supertech properties for loan caution. If your purchase depends on a home loan — which most purchases do — the loan feasibility itself may be a blocker regardless of the price attractiveness.`, daysAfter: 11 },
    ],
    ratings: [
      { userName: 'Priyanka Mishra', score: 2, review: 'Cannot rate the product without flagging the serious brand-level legal risk. Do complete RERA and legal verification before considering. Better alternatives exist.' },
      { userName: 'Piyush Awasthi', score: 2, review: 'The Supertech brand damage is real. Unless you have done deep diligence and are getting a price that reflects the risk, look elsewhere.' },
      { userName: 'Neeraj Verma', score: 2, review: 'Loan availability is a practical barrier regardless of price. Verify bank willingness to lend before any booking.' },
    ],
  },

  // ── KANPUR ──────────────────────────────────────────────────────────────────
  {
    citySlug: 'kanpur',
    propertyName: 'Landmark Towers Kanpur',
    propertyType: 'APARTMENT',
    address: 'Harsh Nagar, Kanpur 208012',
    developerName: 'Landmark Realtors',
    developerSlug: 'landmark-realtors',
    priceMin: 4500000, priceMax: 9000000,
    topic: {
      userName: 'Avinash Gupta',
      title: 'Landmark Towers Harsh Nagar — premium residential in Kanpur\'s commercial heart',
      description: `Kanpur is first and foremost a commercial and industrial city. People come here to do business, not to retire. The residential market has always been secondary to the commercial reality. Landmark Towers in Harsh Nagar is one of the few projects that seriously attempts to bring premium residential standards to a city where the focus has been on factories and trade.

Harsh Nagar is an established Kanpur neighbourhood — not new-development aspirational like Noida's sectors, but genuinely established with good infrastructure, schools that have been operating for decades, proper markets, and a community that knows itself. Landmark Towers is building within this established fabric rather than starting a greenfield township at the city's edge.

The project itself offers 2 and 3 BHK apartments in a highrise format. The build quality is above average for Kanpur — the lobby treatment is proper marble, elevator service is from Otis, and the external facade is maintained with actual paint rather than whitewash. These may sound like basic things but for Kanpur's residential market, they represent a genuine step up from typical local construction.

Pricing at 45-90 lakhs is premium for Kanpur. Most local apartments here are in the 25-50 lakh range. Landmark is asking you to pay the premium for the build quality, the address, and the community of buyers they have curated. In my assessment that premium is mostly justified.

The commercial ecosystem of Kanpur works in your favour here. Senior factory managers, textile export business owners, professionals from the IIT Kanpur faculty — these are the typical buyers and that demographic contributes to a stable, educated community. For a Kanpur businessman wanting to upgrade from an old bungalow to managed apartment living, Landmark Towers is the realistic premium option.`,
      daysAgo: 44,
    },
    comments: [
      { userName: 'Atul Shukla', content: `Harsh Nagar infrastructure is one of the best in Kanpur. The market on Rawatpur Road is excellent for daily needs. Ganesh Shankar Vidyarthi Medical College is nearby. For families with medical needs or school-going children, the location works practically. Landmark has picked a genuinely functional address.`, daysAfter: 3 },
      { userName: 'Sanjay Chaturvedi', content: `I have been a Kanpur real estate broker for 12 years. Premium apartments in this city have struggled with resale because most high-income families prefer independent bungalows or houses with kothi designs. The shift to apartment living is happening but slowly. Landmark Towers buyers should have a 7-10 year horizon for full price appreciation to play out.`, daysAfter: 5 },
      { userName: 'Meera Bajpai', content: `The lift service quality difference is significant. In most Kanpur buildings, lifts break down regularly and the maintenance is reactive — you wait for something to break before it gets fixed. Otis with a proper AMC means predictable service. For elderly residents or families on upper floors, this is a daily quality-of-life factor.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Avinash Gupta', score: 4, review: 'Best premium residential option in Kanpur for established neighbourhood living. Build quality clearly superior to local competition.' },
      { userName: 'Sanjay Chaturvedi', score: 3, review: 'Good product but Kanpur apartment market needs patience for appreciation. Strong for end-use, moderate for short-term investment.' },
      { userName: 'Meera Bajpai', score: 4, review: 'The small quality differences — Otis lift, proper lobby — add up to meaningful daily living improvement over typical Kanpur housing.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'Green Valley Township Panki',
    propertyType: 'APARTMENT',
    address: 'Panki, Kanpur 208020',
    developerName: 'Green Valley Builders',
    developerSlug: 'green-valley-builders',
    priceMin: 2500000, priceMax: 5000000,
    topic: {
      userName: 'Kamla Devi Singh',
      title: 'Green Valley Township Panki — affordable housing near industrial estate, real value?',
      description: `I am a nurse at Regency Hospital and my husband works in an administrative role in one of the Panki industrial units. Between our two incomes we have been saving for five years to buy our own home. Green Valley Township in Panki entered our radar because the pricing at 25-50 lakhs is within our realistic reach.

Panki Industrial Area is the backbone of Kanpur's manufacturing economy. Thousands of families have someone working in this ecosystem — chemical plants, engineering units, food processing. For all these families, Panki is not just a work location, it is where life happens. Schools, markets, medical facilities — the area infrastructure is functional because it serves a working population.

Green Valley Township is a local builder project designed specifically for this buyer profile. The apartments are 1 BHK (450 sqft) and 2 BHK (750-850 sqft) — compact, honest sizing. The construction is not fancy but I visited the site and the brick work is solid, the plastering is smooth, and the water-proofing on the roof terrace was done properly which I specifically checked after hearing horror stories from friends about leakage in other budget projects.

What you are getting: your own home, close to your workplace, in an established community, with clear title and RERA registration. What you are not getting: a luxury lifestyle, impressive amenities, or a glamorous address. For us, the former matters infinitely more than the latter.

The one practical concern I want to flag: the industrial zone means air quality can be variable depending on wind direction. The units on the north-east side of the project have better air quality in winter months when north-westerly winds bring pollution away. Worth asking the sales team about unit orientation.`,
      daysAgo: 52,
    },
    comments: [
      { userName: 'Sanjay Chaturvedi', content: `The Panki affordable market is quite active right now. I have seen several deals close in the 30-40 lakh range in the last quarter. The government's Pradhan Mantri Awas Yojana subsidy — if applicable to buyers — can reduce the effective cost by 2.5 lakhs which is meaningful at this price point. Green Valley buyers should check their PMAY eligibility.`, daysAfter: 2 },
      { userName: 'Atul Shukla', content: `The air quality concern @Kamla ji raises is real but manageable. The industrial area has specific wind patterns and the pollution is not constant. On most days the residential zone is fine. I have visited friends in Panki many times and it is a normal functional residential area, not a hazardous zone. The concern is worth noting but not worth over-weighting.`, daysAfter: 5 },
      { userName: 'Avinash Gupta', content: `For first-time buyers in the Kanpur industrial belt, the ownership advantage cannot be overstated. Rents in Panki are 6,000-9,000 per month for a decent 2 BHK. At 40 lakh purchase price with EMI of roughly 32,000-35,000 at current rates, the gap is meaningful but you are building equity. In 10 years, the rent would have increased while your EMI stays fixed. The math works for buyers with stable employment.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Kamla Devi Singh', score: 4, review: 'Perfect for families working in the Panki industrial ecosystem. Honest product at a price that makes ownership achievable. Nothing fancy but nothing missing.' },
      { userName: 'Atul Shukla', score: 3, review: 'Functional affordable housing for the right buyer profile. Location-specific — great if Panki is your work centre, inconvenient otherwise.' },
      { userName: 'Avinash Gupta', score: 3, review: 'The ownership equity argument is strong at these prices. PMAY subsidy eligibility can sweeten the deal further.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'Omaxe Connaught Place Kanpur',
    propertyType: 'APARTMENT',
    address: 'Mall Road, Kanpur 208001',
    developerName: 'Omaxe Limited',
    developerSlug: 'omaxe-limited',
    priceMin: 5500000, priceMax: 10000000,
    topic: {
      userName: 'Meera Bajpai',
      title: 'Omaxe Connaught Place Kanpur Mall Road — commercial-residential, does the mix work?',
      description: `Omaxe Connaught Place in Kanpur is an integrated commercial-residential development on Mall Road — one of Kanpur's most established and historically significant addresses. The concept is mixed-use: retail and commercial on lower floors, residential apartments above. I want to give an honest assessment of whether this mix works in practice.

Mall Road, Kanpur is genuinely prime real estate. The road connects Civil Lines to the Cantonment area, passes through the old commercial heart of the city, and has the kind of mature urban character that takes decades to build. An address on Mall Road means something — it carries historical weight and is universally understood as central and established.

The Omaxe development here brings a different energy to this address. The retail component creates footfall and activity that not everyone wants immediately outside their residential building. During my visits, I noticed that the commercial activity extended to about 9-10pm on weekdays and later on weekends. Residents on lower residential floors would experience this commercial proximity more intensely.

The residential apartments themselves — on floors 6 and above — are insulated from most of the commercial activity by height. The views from upper floors over central Kanpur are genuinely impressive. The apartment sizes and specifications match Omaxe's national standard which is decent mid-market quality.

For investors looking at rental income, the Mall Road commercial-residential mix is actually an advantage. The proximity to offices, shops, and transit makes these apartments popular with professionals who want walkable urban living. Rental yields in central Kanpur for quality apartments run at 2.5-3.5% annually which is reasonable for a city of this profile.`,
      daysAgo: 33,
    },
    comments: [
      { userName: 'Sanjay Chaturvedi', content: `Mall Road commercial activity is established and predictable — it is not a new development that might change. The noise level, the footfall, the parking situation on the road — these are known quantities that have been stable for years. Buyers know what they are getting into, which is actually better than buying near a new commercial development where the character might change unpredictably.`, daysAfter: 2 },
      { userName: 'Rajesh Yadav', content: `Omaxe has delivered mixed-use projects in other cities — Faridabad, Lucknow — and the quality is consistent. The build spec at Connaught Place Kanpur is genuine mid-premium, not budget. Flooring, bathroom fittings, window quality — all one notch above local Kanpur developers. The Omaxe brand is trustworthy if not as premium as Godrej or ATS.`, daysAfter: 5 },
      { userName: 'Kamla Devi Singh', content: `For a working professional who wants to walk to work or to restaurants without needing a car, the Mall Road location is practically excellent. My cousin lives in a rented flat in this area and says the walkability advantage is real — everything from banking to shopping to dining is accessible on foot. In Kanpur, that kind of walkability is rare.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Meera Bajpai', score: 3, review: 'Good mixed-use concept on a prime address. Residential-commercial balance works better on upper floors. Strong for investors seeking urban rental income.' },
      { userName: 'Sanjay Chaturvedi', score: 4, review: 'Mall Road address is as established as it gets in Kanpur. Omaxe quality is honest. Known commercial environment is better than uncertain new development.' },
      { userName: 'Rajesh Yadav', score: 3, review: 'Omaxe delivers on promises at this price point. Urban walkability is a genuine differentiator in Kanpur.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'KK Nagar Heights',
    propertyType: 'APARTMENT',
    address: 'KK Nagar, Kanpur 208019',
    developerName: 'KK Constructions',
    developerSlug: 'kk-constructions',
    priceMin: 3500000, priceMax: 6500000,
    topic: {
      userName: 'Atul Shukla',
      title: 'KK Nagar Heights — established Kanpur neighbourhood, local builder, honest assessment',
      description: `KK Nagar is one of those Kanpur neighbourhoods where the name itself carries residential credibility. It is not flashy but it is established, functional, and genuinely liveable. KK Nagar Heights is a local builder project within this neighbourhood and I want to give you the ground reality since most reviews of local builder projects are either overly positive (paid) or ignore context.

The developer is a Kanpur-based builder — not a national name, not publicly traded, but has completed three projects in the city that I personally verified by visiting the completed buildings and speaking with residents. Two of three projects were delivered within 8 months of promised date, one was 14 months late. That track record is honest for a local builder in UP.

KK Nagar itself: the neighbourhood has schools within walking distance — several reputed ones. The market is mixed-use and fully functional. Connectivity to Civil Lines and the commercial areas is reasonable — traffic is typical Kanpur chaos but the distances are not long. The neighbourhood has a generational character — old families, established trees, a sense of permanence.

The apartments at KK Nagar Heights are 2 and 3 BHK ranging from 900 to 1400 sqft. Construction quality is honest mid-market. The sample flat showed standard vitrified flooring, decent sanitary ware, and ceiling heights of 10 feet which is proper. No fancy club house but a genuine park space within the compound.

At 35-65 lakhs, this is the sweet spot for Kanpur's aspirational middle class — people who want an established address, a proper apartment structure, and a local builder track record they can verify. I would classify this as a buy-with-eyes-open project, not a high-risk venture.`,
      daysAgo: 60,
    },
    comments: [
      { userName: 'Avinash Gupta', content: `KK Nagar address in Kanpur is comparable to saying Gomti Nagar in Lucknow — both carry a specific neighbourhood prestige that is understood by every local. The difference is that KK Nagar does not have the glossy new development infrastructure, but what it has is decades of functional urban life. For families with school-age children, that established school ecosystem is invaluable.`, daysAfter: 4 },
      { userName: 'Meera Bajpai', content: `Local builder due diligence tip: always ask to see the builder's RERA portal compliance page, their previous project OC copies, and the current project's site inspection reports. A builder who balks at sharing these is a builder to walk away from. A builder who shares them readily is someone you can work with. I did this exercise with KK Constructions and they were forthcoming — positive sign.`, daysAfter: 7 },
      { userName: 'Kamla Devi Singh', content: `The 10-foot ceiling height is something I specifically look for. Most budget projects in Kanpur have 9-foot or even 8.5-foot ceilings which make rooms feel cramped. KK Nagar Heights at 10 feet is meaningful headroom that makes the same sqft feel larger and better ventilated. Small detail, big daily impact.`, daysAfter: 12 },
    ],
    ratings: [
      { userName: 'Atul Shukla', score: 3, review: 'Good local builder in a great established neighbourhood. Track record is verifiable and honest. Proper diligence yields confidence.' },
      { userName: 'Avinash Gupta', score: 4, review: 'KK Nagar address is worth the premium over Panki or Kalyanpur for the school and community ecosystem.' },
      { userName: 'Meera Bajpai', score: 3, review: 'Transparent builder who cooperates with due diligence. Local track record is modest but genuine. Reasonable buy for end-users.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'Riviera Residency Kanpur',
    propertyType: 'APARTMENT',
    address: 'Swaroop Nagar, Kanpur 208002',
    developerName: 'Riviera Real Estate',
    developerSlug: 'riviera-real-estate',
    priceMin: 6000000, priceMax: 12000000,
    topic: {
      userName: 'Sanjay Chaturvedi',
      title: 'Riviera Residency Swaroop Nagar — Kanpur\'s upscale address, premium justified?',
      description: `In my twelve years as a Kanpur property broker, I have seen the premium residential market here go through cycles. Swaroop Nagar has consistently remained at the top of Kanpur's residential hierarchy — it is the address where successful businessmen, senior IAS officers, and established professionals choose to live. Riviera Residency is attempting to bring modern apartment living to this traditionally bungalow-dominated neighbourhood.

The project is a departure from the independent bungalow culture of Swaroop Nagar. Many established Kanpur families have resisted apartment living — they value their own compound, privacy, and the Kanpur cultural preference for space over shared amenity. Riviera Residency is targeting a younger generation of Kanpur's successful families who want the Swaroop Nagar address without the maintenance burden of an independent bungalow.

The apartment sizes reflect the luxury positioning — the smallest unit is 1600 sqft and the flagship 4 BHK goes up to 3200 sqft. These are not typical apartment sizes — they are designed to be competitive with the room count of a mid-size bungalow. The developer has clearly studied what Swaroop Nagar's traditional buyers expect in terms of space.

Construction quality is the highest I have seen in Kanpur from a local developer. The structural design involved a Kanpur-based structural consultant with IIT credentials. The external cladding is done professionally, the internal doors are solid wood, not hollow core. These are genuine quality markers.

The 60-120 lakh pricing is the highest residential ask in Kanpur outside of a handful of boutique projects. Whether the premium justifies itself depends entirely on whether the buyer values the Swaroop Nagar address and the apartment-as-alternative-to-bungalow proposition. For the right buyer, absolutely. For someone considering this purely as investment, the Kanpur premium market liquidity is thin.`,
      daysAgo: 25,
    },
    comments: [
      { userName: 'Atul Shukla', content: `Swaroop Nagar bungalow culture is deeply rooted. I have tried to sell apartments in this zone before and the generational resistance is real. However, younger Kanpur professionals who grew up in bungalows but have spent time in Pune, Mumbai, or abroad come back wanting the address without the upkeep. That demographic is growing. Riviera is positioned correctly for where the market is heading.`, daysAfter: 3 },
      { userName: 'Avinash Gupta', content: `From an investment perspective: the Swaroop Nagar address holds value even in downturns because supply is genuinely constrained. There is not much land left for new development in the core Swaroop Nagar area. Scarcity premium is real here in a way it is not for township projects on the city periphery.`, daysAfter: 6 },
      { userName: 'Meera Bajpai', content: `The 1600 sqft minimum unit is actually a clever market insight. Kanpur buyers who resist apartments typically cite insufficient space as the reason — they cannot imagine fitting their joint family's lifestyle into a standard 1050 sqft 3 BHK. At 1600 sqft minimum, Riviera removes that objection. The product design shows they actually thought about their specific buyer.`, daysAfter: 10 },
    ],
    ratings: [
      { userName: 'Sanjay Chaturvedi', score: 4, review: 'The right product for a specific, evolving buyer profile in Kanpur\'s most prestigious address. Thin liquidity for investors but strong for status-conscious end-users.' },
      { userName: 'Avinash Gupta', score: 4, review: 'Swaroop Nagar scarcity premium is genuine. Supply-constrained address with growing demand from younger Kanpur families.' },
      { userName: 'Meera Bajpai', score: 4, review: 'Large unit sizes solve the specific objection Kanpur buyers have to apartments. Intelligent product design for the local market.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'DPS Colony Apartments',
    propertyType: 'APARTMENT',
    address: 'Civil Lines, Kanpur 208001',
    developerName: 'DPS Developers',
    developerSlug: 'dps-developers',
    priceMin: 7000000, priceMax: 13000000,
    topic: {
      userName: 'Rajesh Yadav',
      title: 'DPS Colony Apartments Civil Lines Kanpur — does the Civil Lines premium hold in 2024?',
      description: `Civil Lines is Kanpur's colonial-era premium address. The broad tree-lined roads, the old government bungalows, the proximity to the High Court and administrative offices — all of this gives Civil Lines a character that is genuinely different from the rest of Kanpur. DPS Colony Apartments is one of the few modern residential developments to come up within this zone.

I am a government officer and Civil Lines has always been aspirational for me — the kind of address that represents a certain level of arrival. The question I investigated thoroughly is whether the Civil Lines premium — which the DPS Colony pricing reflects — is substantiated in 2024 or whether it is nostalgia.

My honest conclusion: the premium is real but the reasons have evolved. Historically Civil Lines was premium because of government bungalow culture and English-era planning. Today the premium is driven by: excellent road infrastructure that was laid down decades ago and is still better than new developments, genuinely mature tree cover that takes 50 years to grow (you cannot replicate this in a new township), proximity to the court complex and administrative offices, and the social network of established families that gravitates toward this area.

DPS Colony Apartments is a boutique development — only 48 units total. This limited supply within a supply-constrained zone is the core investment argument. The apartments are 3 and 4 BHK with sizes starting at 1800 sqft. The build quality is premium — Italian marble flooring in the living areas, designer bathrooms, VRV air conditioning provision.

For senior government officers, lawyers, and established business families, this is the address that makes sense. The 70-130 lakh pricing is the highest ask in Kanpur and for the first-time buyer it will feel steep. But Civil Lines real estate has never gone backwards in three decades of Kanpur's real estate history.`,
      daysAgo: 40,
    },
    comments: [
      { userName: 'Sanjay Chaturvedi', content: `Civil Lines property transactions that I have been involved in show one consistent pattern — prices never drop, they only rise or stagnate briefly before rising again. The scarcity is absolute in this zone. DPS Colony being only 48 units means even a small increase in demand creates pricing pressure. This is as close to a safe bet as Kanpur real estate offers.`, daysAfter: 2 },
      { userName: 'Atul Shukla', content: `My senior colleague at work — a District Judge — bought in DPS Colony last year. His feedback: the build quality genuinely met expectations, the society management is professional, and the Civil Lines address gives a certain standing in Kanpur's social and professional circles that matters in government and legal communities. For people in these networks, the address is not just a location, it is a social credential.`, daysAfter: 5 },
      { userName: 'Meera Bajpai', content: `The 48-unit boutique scale means the maintenance quality will always be excellent — you have fewer people to divide costs among and the per-unit contribution to maintenance is higher, meaning better upkeep. Large township projects with 2000 units often struggle with maintenance fund collection and management. DPS Colony's small scale is actually a quality-of-life advantage.`, daysAfter: 9 },
    ],
    ratings: [
      { userName: 'Rajesh Yadav', score: 5, review: 'Civil Lines is Kanpur\'s most enduring premium address and DPS Colony delivers on the promise. Boutique scale, premium finish, absolute address credibility.' },
      { userName: 'Sanjay Chaturvedi', score: 5, review: 'Safest real estate investment in Kanpur. Absolute supply constraint in a zone where prices have never moved backwards.' },
      { userName: 'Atul Shukla', score: 4, review: 'Premium product for a premium address. The social credential of Civil Lines is genuine in Kanpur\'s administrative and professional circles.' },
    ],
  },

  {
    citySlug: 'kanpur',
    propertyName: 'Kalyanpur Green Park',
    propertyType: 'APARTMENT',
    address: 'Kalyanpur, Kanpur 208017',
    developerName: 'Green Park Developers',
    developerSlug: 'green-park-developers',
    priceMin: 3000000, priceMax: 6000000,
    topic: {
      userName: 'Vandana Pandey',
      title: 'Kalyanpur Green Park — IIT Kanpur adjacent area, academic ecosystem matters?',
      description: `I am a faculty member at a technical college in Kanpur and the IIT Kanpur campus has always been my reference point for the city. Kalyanpur — the area adjacent to IIT — has a distinctive character shaped by the academic ecosystem around it. Kalyanpur Green Park is positioned to serve buyers who value this ecosystem.

What makes Kalyanpur different from other Kanpur residential areas: the proximity to IIT means a concentration of educated, aspirational residents — faculty, research scholars, technical professionals working in IIT spinoffs and nearby companies. The neighbourhood's commercial ecosystem reflects this — better quality restaurants, functional ATMs, clean markets, a general sense of civic awareness. The community one lives in matters and Kalyanpur's community is shaped by the university.

Kalyanpur Green Park is a mid-range project at 30-60 lakhs. The apartments are 2 and 3 BHK in a 10-storey building. The construction quality is decent — not exceptional, but solid. The floor plan efficiency is good. The 2 BHK at 950 sqft has proper room sizing and the kitchen is a working kitchen, not a nominal one.

The IIT adjacency has a specific investment implication: visiting faculty, research collaborators, and international scholars regularly need medium-term accommodation in the area. Some IIT-adjacent apartments are rented out furnished to visiting faculty at 18,000-25,000 per month. This rental use case is specific but reliable and creates a floor for rental demand in this micro-market.

One honest concern: Kanpur's traffic means IIT area can feel isolated from the rest of the city during peak hours. The Kalyanpur-Rawatpur stretch can be congested. For buyers who need to access the broader city frequently, factor this in.`,
      daysAgo: 18,
    },
    comments: [
      { userName: 'Rajesh Yadav', content: `The IIT ecosystem point is exactly right. I have been involved in letting flats to IIT visiting faculty and the demand is consistent. The profile of tenant — educated, respectful of property, financially responsible — is the best possible for landlords. Kalyanpur properties that are well-maintained rent quickly and reliably in this use case.`, daysAfter: 2 },
      { userName: 'Atul Shukla', content: `I visited Green Park last week. The building is already at plinth level and the construction pace is reasonable. The developer showed us the soil testing report which indicated proper bearing capacity — important for a 10-storey building. This level of transparency in construction documentation is genuinely reassuring for a mid-market local project.`, daysAfter: 5 },
      { userName: 'Sanjay Chaturvedi', content: `The IIT-adjacent premium in Indian real estate is a real and documented phenomenon. From Powai in Mumbai to Hauz Khas near IIT Delhi, areas around IIT campuses tend to be premium micro-markets. Kanpur's Kalyanpur is at an earlier stage of this journey but the fundamentals are there. 30-60 lakh entry at this stage with IIT-adjacent demand is a reasonable long-term position.`, daysAfter: 8 },
    ],
    ratings: [
      { userName: 'Vandana Pandey', score: 4, review: 'The academic ecosystem advantage is real and unique to this location. Good product at fair pricing for a micro-market with consistent rental demand from IIT connections.' },
      { userName: 'Rajesh Yadav', score: 4, review: 'Best rental yield micro-market in Kanpur for the right profile of tenant. IIT faculty rental demand creates reliable income.' },
      { userName: 'Sanjay Chaturvedi', score: 3, review: 'Early stage of an IIT-adjacency premium story. Fair current pricing with above-average long-term appreciation potential.' },
    ],
  },
]

async function main() {
  console.log('🏙️  Seed Part C — Lucknow + Kanpur\n')
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
  console.log(`\n✅ Part C done — topics:${topics} comments:${comments} ratings:${ratings}`)
}
main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
