import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function toSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function randomDate(daysAgoStart: number, daysAgoEnd = 0) {
  const end = Date.now() - daysAgoEnd * 86400000
  const start = Date.now() - daysAgoStart * 86400000
  return new Date(start + Math.random() * (end - start))
}

// ─── Regional Users ──────────────────────────────────────────────────────────

const USERS_TIER1 = [
  // Gujarat / Ahmedabad / Surat / Vadodara
  { name: 'Dhruv Patel',           email: 'dhruv.patel.ahm@gmail.com' },
  { name: 'Hiral Shah',            email: 'hiral.shah.srt@gmail.com' },
  { name: 'Nishant Desai',         email: 'nishant.desai.vdr@gmail.com' },
  { name: 'Foram Mehta',           email: 'foram.mehta.guj@gmail.com' },
  { name: 'Jigar Kapadia',         email: 'jigar.kapadia.ahm@gmail.com' },
  { name: 'Ruchita Bhatt',         email: 'ruchita.bhatt.srt@gmail.com' },

  // Pune / Nagpur / Nashik (Marathi)
  { name: 'Sachin Kulkarni',       email: 'sachin.kulkarni.pun@gmail.com' },
  { name: 'Prachi Deshpande',      email: 'prachi.deshpande.pun@gmail.com' },
  { name: 'Omkar Joshi',           email: 'omkar.joshi.ngp@gmail.com' },
  { name: 'Shraddha Patil',        email: 'shraddha.patil.nsk@gmail.com' },
  { name: 'Kedar Bhosale',         email: 'kedar.bhosale.pun@gmail.com' },
  { name: 'Manasi Kadam',          email: 'manasi.kadam.pun@gmail.com' },

  // Rajasthan / Jaipur
  { name: 'Vikas Sharma',          email: 'vikas.sharma.jpr@gmail.com' },
  { name: 'Pooja Agarwal',         email: 'pooja.agarwal.jpr@gmail.com' },
  { name: 'Ankit Mathur',          email: 'ankit.mathur.jpr@gmail.com' },
  { name: 'Rekha Goyal',           email: 'rekha.goyal.raj@gmail.com' },

  // UP — Lucknow / Kanpur / Agra / Ghaziabad
  { name: 'Abhishek Srivastava',   email: 'abhishek.srivastava.lko@gmail.com' },
  { name: 'Sunita Pandey',         email: 'sunita.pandey.knp@gmail.com' },
  { name: 'Rajesh Yadav',          email: 'rajesh.yadav.agr@gmail.com' },
  { name: 'Priyanka Mishra',       email: 'priyanka.mishra.ghz@gmail.com' },
  { name: 'Mohit Verma',           email: 'mohit.verma.lko@gmail.com' },
  { name: 'Divya Tripathi',        email: 'divya.tripathi.lko@gmail.com' },
  { name: 'Sandeep Gautam',        email: 'sandeep.gautam.ghz@gmail.com' },

  // MP — Indore / Bhopal
  { name: 'Prakash Jain',          email: 'prakash.jain.ind@gmail.com' },
  { name: 'Ankita Solanki',        email: 'ankita.solanki.bhp@gmail.com' },
  { name: 'Vivek Chouhan',         email: 'vivek.chouhan.ind@gmail.com' },

  // Andhra — Visakhapatnam
  { name: 'Venkata Rao',           email: 'venkata.rao.vizag@gmail.com' },
  { name: 'Padmavathi Raju',       email: 'padmavathi.raju.vzg@gmail.com' },
  { name: 'Srinivas Murthy',       email: 'srinivas.murthy.vizag@gmail.com' },

  // Bihar — Patna
  { name: 'Sunil Kumar Singh',     email: 'sunil.kumar.singh.pat@gmail.com' },
  { name: 'Asha Devi',             email: 'asha.devi.patna@gmail.com' },

  // Punjab — Ludhiana
  { name: 'Gurpreet Singh',        email: 'gurpreet.singh.ldh@gmail.com' },
  { name: 'Harpreet Kaur',         email: 'harpreet.kaur.ldh@gmail.com' },
  { name: 'Mandeep Dhaliwal',      email: 'mandeep.dhaliwal.ldh@gmail.com' },
]

interface RatingEntry { userName: string; score: number; review: string }
interface CommentEntry { userName: string; content: string; daysAfter: number }
interface TopicEntry   { userName: string; title: string; content: string; daysAgo: number }
interface PropertyData {
  citySlug: string
  propertyName: string
  propertyType: string
  address: string
  developerName?: string
  developerSlug?: string
  description: string
  priceMin: number
  priceMax: number
  topic: TopicEntry
  comments: CommentEntry[]
  ratings: RatingEntry[]
}

// ─── Properties ──────────────────────────────────────────────────────────────

const PROPERTIES: PropertyData[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // PUNE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'pune',
    propertyName: 'Kolte-Patil Life Republic',
    propertyType: 'APARTMENT',
    address: 'Marunji Road, Hinjewadi Phase 2, Pune 411057',
    developerName: 'Kolte-Patil Developers',
    developerSlug: 'kolte-patil-developers',
    description: 'Kolte-Patil Life Republic is one of Pune\'s largest integrated townships spread across 395 acres in Hinjewadi Phase 2, right next to the IT corridor. The project offers 1 BHK, 2 BHK and 3 BHK apartments across multiple phases, along with plots and villas. Currently Phase 4 and Phase 5 are under construction, with possession expected in Q3 2026. The township has its own school (ORCHIDS International), a shopping street, and a central park spanning 40 acres. Connectivity to Hinjewadi IT Park is under 2 km. Metro Phase 3 station is proposed within 500 metres of the township entrance.',
    priceMin: 5800000,
    priceMax: 14500000,
    topic: {
      userName: 'Sachin Kulkarni',
      title: 'Life Republic Phase 5 — real ground situation from a Phase 2 resident',
      content: `Bought in Phase 2 back in 2019 and moved in mid-2022. Thought I'd share an honest picture since I see a lot of first-time buyers asking about this project on various groups.

The good: infrastructure inside the township is genuinely excellent. The 40-acre central park is maintained well, roads are wide, garbage pickup is consistent, and the school is convenient for families. Hinjewadi Phase 1 and 2 offices are under 15 mins by bike.

The not so good: Phase 2 construction dragged 18 months past the original date. Water was dependent on tankers for almost 6 months after possession. The situation improved after the township's own water treatment plant came online, but those first months were rough. Maintenance charges have gone up every year — currently ₹3.80/sqft per month which feels high.

For Phase 5 buyers — the location is better (closer to proposed metro station), but I'd factor in a minimum 12-15 month delay from whatever date Kolte-Patil gives you. These are large-scale projects and delays are baked in. That said, this is a genuine township that actually delivers on its promises eventually, unlike a lot of standalone projects in this price range.

Prices for Phase 5 are hovering around 7000-7500 per sqft, which is fair for the location. Just don't expect possession in 2026 if they're telling you 2026.`,
      daysAgo: 38,
    },
    comments: [
      {
        userName: 'Prachi Deshpande',
        content: `This matches my experience too. I'm in Phase 3 and possession came 14 months late. Though I'll say — the builder's customer portal is decent, they do give updates. Resale market is reasonably active here, I've seen 2 BHK units going at 75-80 lakhs now which is a decent return from the Phase 3 booking prices.`,
        daysAfter: 2,
      },
      {
        userName: 'Kedar Bhosale',
        content: `The metro connectivity point is crucial. Once Hinjewadi metro is operational, demand here will spike. For end-use buyers this is a solid choice. For investment, the appreciation from metro connectivity hasn't been priced in yet fully.`,
        daysAfter: 5,
      },
      {
        userName: 'Manasi Kadam',
        content: `Can someone clarify — is Phase 5 RERA registered? I keep getting different answers from different brokers. Also curious about the floor plans, are the balconies counted in carpet area or excluded?`,
        daysAfter: 8,
      },
      {
        userName: 'Sachin Kulkarni',
        content: `@Manasi — Yes Phase 5 is RERA registered, the number is visible on their website. Balconies are excluded from RERA carpet area as per regulations — so the usable area number you see is genuinely usable. Builders sometimes quote super built-up which is higher, make sure you're comparing apples to apples.`,
        daysAfter: 9,
      },
    ],
    ratings: [
      { userName: 'Sachin Kulkarni',   score: 3, review: 'Good project overall but delays are a real issue. Infrastructure is solid once delivered.' },
      { userName: 'Prachi Deshpande',  score: 4, review: 'Delayed possession but the township quality is genuinely good. Worth it for families.' },
      { userName: 'Kedar Bhosale',     score: 4, review: 'Best township in Hinjewadi belt. Metro will change the game here.' },
    ],
  },

  {
    citySlug: 'pune',
    propertyName: 'Godrej River Royale',
    propertyType: 'APARTMENT',
    address: 'Rajiwadi, Khopoli Road, Pune 410203',
    developerName: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    description: 'Godrej River Royale is a premium riverside residential project located along the Bhima river at Rajiwadi, off the Pune-Solapur highway. The project features 2 BHK and 3 BHK apartments with river-facing balconies. Amenities include a clubhouse, swimming pool, landscaped gardens, and jogging tracks along the riverfront. The project has received its OC for Phase 1 towers and possession is underway. It is positioned as a weekend home / second home investment as well as a primary residence for those working in Hadapsar or Fursungi IT clusters.',
    priceMin: 6500000,
    priceMax: 12000000,
    topic: {
      userName: 'Omkar Joshi',
      title: 'Godrej River Royale — OC received, actual possession experience?',
      content: `Finally got possession of my 2 BHK in Tower B last month after waiting since 2022. Sharing what I found on the day.

Flat was handed over in decent condition — minor snagging items (a couple of door hinges loose, one tile slightly chipped in the bathroom) but Godrej's team was responsive and most were fixed within 2 weeks of submitting the list. Fitting quality is above average for this price range.

The river view from my unit is genuinely beautiful, especially in the mornings. The riverfront walking path is also done and maintained. Clubhouse is functional — pool was filled on the day I got possession.

Negatives: the road from the highway to the society is still not fully developed — it's a narrow lane and gets muddy in monsoon. I'm told the developer is working on widening it with the local gram panchayat but there's no timeline. Also, water is borwell right now, Pune municipal supply connection is pending. This matters if you're moving in full time.

For those on the fence — Godrej as a builder is reliable, finishing is good. Just factor in the access road and water situation for now. The area will develop over the next 2-3 years.`,
      daysAgo: 18,
    },
    comments: [
      {
        userName: 'Manasi Kadam',
        content: `Thanks for the detailed update. I've been waiting on this before making a decision. The road situation is concerning for daily commute. How long does it take to reach Hadapsar from here on a regular working day?`,
        daysAfter: 1,
      },
      {
        userName: 'Omkar Joshi',
        content: `Hadapsar is about 35-40 mins off-peak, 55-65 mins in peak hours. Not ideal for daily commute to be honest. Best suited if you're working from home or only going to office 2-3 days a week. As a weekend home it's perfect.`,
        daysAfter: 3,
      },
      {
        userName: 'Shraddha Patil',
        content: `I visited the site last weekend, the river view is stunning. Tower A has better views than Tower B apparently. Is pricing similar for both towers currently?`,
        daysAfter: 6,
      },
    ],
    ratings: [
      { userName: 'Omkar Joshi',      score: 4, review: 'Good finishing, beautiful location. Access road needs development. Godrej is reliable on delivery.' },
      { userName: 'Shraddha Patil',   score: 4, review: 'Visited the completed units, quality is evident. River view is the real USP.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AHMEDABAD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'ahmedabad',
    propertyName: 'Adani Shantigram',
    propertyType: 'APARTMENT',
    address: 'South Bopal, Ahmedabad 380058',
    developerName: 'Adani Realty',
    developerSlug: 'adani-realty',
    description: 'Adani Shantigram is a large integrated township in South Bopal, Ahmedabad, spread across 600 acres. It offers 2 BHK, 3 BHK, and 4 BHK luxury apartments, row houses, and villas. The township has its own school (Adani Vidya Mandir), a 100-bed hospital, retail street, and extensive sports facilities including a cricket ground. Multiple phases have been delivered. Latest offering is the S World tower cluster — high-rises with clubhouse views. The project is RERA compliant and closely monitored.',
    priceMin: 7200000,
    priceMax: 18000000,
    topic: {
      userName: 'Dhruv Patel',
      title: 'Shantigram S World — is the premium pricing justified vs older phases?',
      content: `Been living in Phase 3 of Shantigram for 2.5 years now. Considering upgrading to S World. Sharing thoughts from an insider's perspective.

Shantigram as a township genuinely works. Roads are maintained, society security is tight, the school is top-notch if you have kids. Power cuts are rare — I can count on one hand the number of times power went out in 2.5 years. The hospital is a big convenience.

S World pricing: they're quoting around 8500-9000 per sqft for a 3 BHK which feels rich even by Shantigram standards. Older Phase 3 units are reselling at 5500-6000 per sqft, so the premium is steep. The justification is the high-rise views, upgraded lobby and fittings, and proximity to the clubhouse.

South Bopal connectivity to SG Highway is smooth now since the flyover opened. DP Road extension has helped a lot. If you work near Prahlad Nagar or SG Highway area, commute is 20-25 minutes which is genuinely good for Ahmedabad.

My honest take: if you're looking for primary residence and have budget, S World makes sense. As pure investment, older phases offer better value per rupee. The township premium is already priced into the older phases now.`,
      daysAgo: 52,
    },
    comments: [
      {
        userName: 'Hiral Shah',
        content: `I looked at S World last month. The sample flat is very impressive — Italian marble flooring, modular kitchen fittings are premium. But the maintenance charges they quoted for S World towers were ₹5.20 per sqft which is significantly higher than regular Shantigram phases. That's a big ongoing cost.`,
        daysAfter: 3,
      },
      {
        userName: 'Foram Mehta',
        content: `As an Ahmedabad investor, Shantigram has given the most consistent returns of any township in the city. Phase 1 buyers from 2010 are sitting on 3x appreciation. The brand premium is real. S World will likely appreciate faster given the product positioning.`,
        daysAfter: 7,
      },
      {
        userName: 'Jigar Kapadia',
        content: `For families relocating from outside Gujarat, this is the easiest recommendation I make. Everything is within the township. You don't need to figure out the city immediately. The community is very family-oriented. Guajarati community is dominant which may or may not be a factor depending on your background.`,
        daysAfter: 12,
      },
      {
        userName: 'Dhruv Patel',
        content: `@Jigar — very fair point. The community has a strong Gujarati business family character. Cultural fit matters and most people find it very welcoming. Navratri celebrations here are something else entirely.`,
        daysAfter: 13,
      },
    ],
    ratings: [
      { userName: 'Dhruv Patel',   score: 5, review: 'Best township in Ahmedabad. Consistent delivery, excellent maintenance, strong community.' },
      { userName: 'Hiral Shah',    score: 4, review: 'Premium product with premium maintenance costs. Factor that in before buying.' },
      { userName: 'Foram Mehta',   score: 5, review: 'Consistent appreciation, well-run township. Solid long-term hold.' },
    ],
  },

  {
    citySlug: 'ahmedabad',
    propertyName: 'Vardan Panorama',
    propertyType: 'APARTMENT',
    address: 'Bopal-Shilaj Road, Bopal, Ahmedabad 380058',
    description: 'Vardan Panorama is a mid-premium residential project in Bopal, offering 2 BHK and 3 BHK apartments. Located off the Bopal-Shilaj connector road, it is well-connected to SG Highway and the upcoming metro corridor. The project features a rooftop garden, swimming pool, gym, and children\'s play area. Currently under construction with possession expected in late 2025.',
    priceMin: 4800000,
    priceMax: 8500000,
    topic: {
      userName: 'Jigar Kapadia',
      title: 'Vardan Panorama Bopal — visiting this weekend, any owners or buyers here?',
      content: `Planning to visit the Vardan Panorama site this Sunday with my wife. We're looking for a 2 BHK in Bopal in the 55-65 lakh range. The Vardan Panorama brochure looks good but I can't find much independent feedback online.

From what I've gathered: the location on Bopal-Shilaj Road is decent — Bopal Circle is 10 minutes away, Pakwan Cross Road is about 20-25 mins. The floor plans look efficient with no hallway wastage which I appreciate. They're claiming 72% open space which sounds high.

Main concerns: builder track record. Vardan has done a few projects in Ahmedabad but I'm not super familiar with their quality. Anyone who has bought with them before?

Also curious — what floor would you recommend for 2 BHK? I generally prefer 5th-8th floor range to avoid too much street noise while still not being dependent on lifts.`,
      daysAgo: 14,
    },
    comments: [
      {
        userName: 'Foram Mehta',
        content: `I know someone who bought in their earlier Vardan Heights project in Satellite. Delivery was on time, fitting quality was decent. Not the best in the city but reliable. Bopal is a good micro-market for long term, especially once the metro station at Bopal comes up.`,
        daysAfter: 1,
      },
      {
        userName: 'Ruchita Bhatt',
        content: `For the floor preference — floors 6-9 are usually the sweet spot in Ahmedabad projects. Below 5 you get more noise and less breeze. Above 10 gets hot in summer and maintenance becomes an issue if lifts act up. Ask them about the lift brand during the visit.`,
        daysAfter: 2,
      },
      {
        userName: 'Nishant Desai',
        content: `The 72% open space claim — verify that on the RERA filing. Some builders count the space between two buildings as open area. Ask them to show you the actual landscaped area on the site plan. It should be a clearly defined green zone, not just the gap between towers.`,
        daysAfter: 4,
      },
    ],
    ratings: [
      { userName: 'Foram Mehta',    score: 3, review: 'Decent builder, good location. Go with eyes open on their track record.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SURAT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'surat',
    propertyName: 'Sheetal Westpark',
    propertyType: 'APARTMENT',
    address: 'Vesu, Surat 395007',
    description: 'Sheetal Westpark is one of Vesu\'s most sought-after residential complexes, comprising premium 3 BHK and 4 BHK apartments across multiple towers. Located in the heart of Vesu — Surat\'s premium residential belt — the project offers skyline views, a rooftop pool, and high-spec interiors. The complex has 24-hour security, covered parking, and a well-maintained society. Multiple towers have received OC and possession is complete. The project is known for its strong resale market.',
    priceMin: 8500000,
    priceMax: 17000000,
    topic: {
      userName: 'Hiral Shah',
      title: 'Sheetal Westpark Vesu — resale buying experience, what to watch out for',
      content: `Bought a resale 3 BHK in Westpark Tower 3 last year. Sharing what I learned through the process.

Vesu is genuinely Surat's best residential address — the area is clean, well-developed, and has all facilities within walking distance. Shyamal-Rawat Road proximity means eating options are abundant and the Diamond Market connectivity matters for Surat's trading community.

The project itself: Tower 3 (older) has slightly smaller lobby versus the newer Tower 5. Society is well-maintained, maintenance staff is responsive, and the pool is operational and clean. Parking is clearly demarcated with ownership documents.

What to watch out for in resale: there are units where owners have made structural changes (broken walls to create open plans) without society permission. On paper these are issues if you try to sell later or if the society disputes it. Get an NOC from the society before finalizing any resale unit. Also check the maintenance dues status — a couple of owners have outstanding dues that get transferred to the buyer in some cases.

Current resale asking is 9000-10500 per sqft depending on floor and view. River-facing units command a premium. Worth it for the lifestyle, Vesu is genuinely a cut above.`,
      daysAgo: 33,
    },
    comments: [
      {
        userName: 'Ruchita Bhatt',
        content: `Vesu has become Surat's answer to Banjara Hills or Koregaon Park. The infrastructure development in the last 4 years is dramatic. I also looked at Westpark — the Tower 5 units are priced higher but the lobby and common area are significantly better. Worth the premium if budget allows.`,
        daysAfter: 2,
      },
      {
        userName: 'Jigar Kapadia',
        content: `The maintenance dues check is critical advice. Also verify stamp duty and registration is done properly — Surat has had a few cases where resale chain documents have gaps. Use a good local lawyer for the chain search, don't rely on the broker for this.`,
        daysAfter: 5,
      },
      {
        userName: 'Nishant Desai',
        content: `Is anyone tracking rental yields here? I'm looking at this for investment. What is a furnished 3 BHK renting for in Westpark currently?`,
        daysAfter: 9,
      },
      {
        userName: 'Hiral Shah',
        content: `@Nishant — furnished 3 BHK is renting for ₹35,000-42,000 per month depending on floor and furniture quality. On a 90 lakh purchase, that's about 4.5-5% gross yield which is decent for Surat. Professionals from the diamond and textile industries are the typical tenants here.`,
        daysAfter: 10,
      },
    ],
    ratings: [
      { userName: 'Hiral Shah',    score: 4, review: 'Premium location, well-maintained society. Resale process needs careful document check.' },
      { userName: 'Ruchita Bhatt', score: 5, review: 'Best address in Surat. Worth every rupee for the lifestyle it offers.' },
    ],
  },

  {
    citySlug: 'surat',
    propertyName: 'Shivalik The Cliff',
    propertyType: 'APARTMENT',
    address: 'Althan, Surat 395017',
    developerName: 'Shivalik Group',
    developerSlug: 'shivalik-group',
    description: 'Shivalik The Cliff is a premium high-rise residential project in Althan, one of Surat\'s fastest-growing residential corridors. The project offers 3 BHK and 4 BHK residences with large balconies, modular kitchen, and quality fittings. Althan connects to Vesu and the Surat bypass road, making it convenient for both south and north Surat. The project features a sky club on the 30th floor with panoramic city views. Possession of initial towers is underway.',
    priceMin: 9000000,
    priceMax: 18500000,
    topic: {
      userName: 'Ruchita Bhatt',
      title: 'Shivalik The Cliff Althan — comparing with Vesu options in same budget',
      content: `Did a detailed comparison between Shivalik The Cliff and a couple of Vesu projects in the 1-1.5 Cr range. Sharing my notes.

Location: Althan vs Vesu is honestly close now. Althan used to feel more remote 4-5 years ago but the infrastructure gap has closed. Travel time to Citylight or Adajan is similar from both areas. Althan has slightly better bypass access.

Product: The Cliff is genuinely impressive for Surat. The tower height (36 floors) is unusual for the city and the views from upper floors are fantastic. Sky club on floor 30 is a nice touch — pool with a view, which is unusual. Shivalik's construction quality in their completed projects (The Silver Creek, The Valley) is above average for Surat.

Pricing: they are at a premium vs older Vesu projects. 4 BHK at 1.5-1.7 Cr is aggressive. The comparable in Vesu would be 1.2-1.4 Cr.

The RERA delivery date is Q1 2026. Given Shivalik's track record, I'd estimate Q3 2026 realistically.

My conclusion: if you want a new, premium product with sky views and don't mind Althan's slightly longer establishment, The Cliff is a great pick. If you want an established neighborhood and quicker rental yield, older Vesu resale makes more sense.`,
      daysAgo: 27,
    },
    comments: [
      {
        userName: 'Dhruv Patel',
        content: `The Shivalik brand in Surat is solid. Their Silver Creek project had very few snagging issues — unusual for a high-rise project. The sky club concept is novel for Surat. I'd lean towards this if I were buying in Althan.`,
        daysAfter: 3,
      },
      {
        userName: 'Foram Mehta',
        content: `One thing to consider — Althan has seen a lot of new launches in the last 18 months. There's more supply here vs Vesu. This affects resale liquidity in the short term. Long term both areas should do well as Surat continues growing.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Ruchita Bhatt', score: 4, review: 'Excellent product quality, sky views are unique. Premium pricing but justified for top floors.' },
      { userName: 'Dhruv Patel',   score: 4, review: 'Shivalik is a reliable builder in Surat. This is their best product yet.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JAIPUR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'jaipur',
    propertyName: 'Mahindra World City',
    propertyType: 'APARTMENT',
    address: 'Kalwar Road, Mahindra World City, Jaipur 302042',
    developerName: 'Mahindra Lifespace',
    developerSlug: 'mahindra-lifespace',
    description: 'Mahindra World City Jaipur is an integrated business city and residential township located on Kalwar Road, about 25 km from Jaipur city centre. The residential component — Happinest — offers 1 BHK and 2 BHK affordable homes within the larger township framework. The township hosts major corporates including Infosys and HCL IT campuses, creating genuine employment-led housing demand. Connectivity is via NH 48 (Delhi-Mumbai Expressway) and the upcoming Metro Phase 2 extension.',
    priceMin: 3200000,
    priceMax: 6500000,
    topic: {
      userName: 'Vikas Sharma',
      title: 'MWC Jaipur Happinest — honest review after 1 year of living here',
      content: `Moved into Happinest MWC in early 2024 after being on the site for 1 year. Real life experience vs marketing brochure.

The township concept works if you're employed within MWC or at nearby IT campuses. Infosys, Genpact, and a few manufacturing units are operational so there's a genuine working population. The retail within the township is limited — one supermarket and a couple of food joints. For proper shopping you need to go to Ajmer Road or closer to the city which is a good 30-40 minutes away.

Housing quality: Mahindra's 2 BHK is genuinely efficient in layout, no wasted space. Build quality is above average. Society management is professional. Pest control, water supply, power backup — all handled properly.

The challenge: isolation. This is a peripheral location and you need a vehicle. If your family is not employed nearby, it's a bit cut off. The social infrastructure is building up slowly.

Rental demand is rising as more companies set up in the township. I've seen 2 BHKs going at 12,000-14,000 per month — not great in absolute terms but decent yield on the 35-40 lakh booking price.

Best suited for working professionals within MWC, or as an investment play on the IT corridor growth thesis.`,
      daysAgo: 21,
    },
    comments: [
      {
        userName: 'Pooja Agarwal',
        content: `The isolation concern is real. My colleague lives there and jokes that you need to plan a Jaipur trip like you're going to a different city. But the prices are genuinely attractive compared to Vaishali Nagar or Jagatpura for similar configuration. It's a trade-off.`,
        daysAfter: 2,
      },
      {
        userName: 'Ankit Mathur',
        content: `From an investment angle — MWC Jaipur has consistent IT absorption. The land bank there is substantial so development will continue. Phase-wise price appreciation has been steady at 8-10% annually, which is good for Jaipur. I'd treat it as a 5-7 year hold and not expect quick flipping.`,
        daysAfter: 4,
      },
      {
        userName: 'Rekha Goyal',
        content: `Is the Kalwar Road getting proper development now? Last time I visited in 2022 the road condition was bad. And what about the medical facilities nearby — any hospital?`,
        daysAfter: 7,
      },
      {
        userName: 'Vikas Sharma',
        content: `@Rekha — road has improved significantly after the NH development work. There's a Fortis clinic in the township and Fortis main hospital is about 35 minutes. Ambulance response is decent. For regular checkups it's fine, for emergencies the distance is a legitimate concern.`,
        daysAfter: 8,
      },
    ],
    ratings: [
      { userName: 'Vikas Sharma',  score: 3, review: 'Good product quality, professional management. Location isolation is the main drawback.' },
      { userName: 'Ankit Mathur',  score: 4, review: 'Strong investment thesis if you hold for 5+ years. Rental demand will rise with IT expansion.' },
      { userName: 'Pooja Agarwal', score: 3, review: 'Best for those working within MWC. Not recommended for those with Jaipur city jobs.' },
    ],
  },

  {
    citySlug: 'jaipur',
    propertyName: 'Eldeco Saubhagya',
    propertyType: 'APARTMENT',
    address: 'Vaishali Nagar Extension, Jaipur 302021',
    developerName: 'Eldeco Group',
    developerSlug: 'eldeco-group',
    description: 'Eldeco Saubhagya is a residential project in Vaishali Nagar Extension, one of Jaipur\'s most established and sought-after areas. The project offers 2 BHK and 3 BHK apartments in a well-planned layout with quality construction. Vaishali Nagar is known for excellent social infrastructure — quality schools, hospitals, and markets are all within close proximity. The project targets the aspirational middle-class buyer looking for established neighborhood living.',
    priceMin: 5500000,
    priceMax: 9800000,
    topic: {
      userName: 'Pooja Agarwal',
      title: 'Eldeco Saubhagya — is Vaishali Nagar Extension worth paying more than MWC?',
      content: `Looking at Eldeco Saubhagya and comparing with MWC Happinest for a 2 BHK purchase. Budget is 65-70 lakhs.

Vaishali Nagar is the established choice. Schools like Maheshwari Public and Oxford Senior Secondary are within 3 km. Columbia Asia and Narayana hospitals are close. The market areas are excellent. Everything about the social infrastructure is better than any peripheral project.

Eldeco as a builder has a solid Jaipur record. Their older projects — Utopia, Eden, Greens — have appreciated well and society management is decent. Saubhagya is a mid-scale project by their standards.

The price difference: Saubhagya 2 BHK is 60-70 lakhs vs 35-40 lakhs at MWC. That's a significant gap. But if I look at it from a lifestyle lens, the daily convenience of Vaishali Nagar is worth a lot.

My concern with Saubhagya specifically: the layout — some of the 2 BHK units are oddly shaped. The corner units are good but mid-block units have elongated living rooms that feel cramped. Verify this on the actual floor plan before booking.

Leaning towards Saubhagya for the lifestyle, but want to hear from anyone who has visited or booked here.`,
      daysAgo: 9,
    },
    comments: [
      {
        userName: 'Ankit Mathur',
        content: `The Vaishali vs MWC comparison is location vs value. For end-use with family, Vaishali Nagar wins hands down — better schools, better hospital access, established social life. The premium is justified if this is your primary home for 10+ years.`,
        daysAfter: 1,
      },
      {
        userName: 'Rekha Goyal',
        content: `I visited Saubhagya last month. The B and C type 2 BHK are the ones with the awkward shape. The A type corner 2 BHK is actually very well laid out — ask specifically for A type. The sample flat they show is usually the best unit, ask to see the actual floor plan of whatever unit you're considering.`,
        daysAfter: 3,
      },
    ],
    ratings: [
      { userName: 'Rekha Goyal',   score: 4, review: 'Eldeco is a trusted name in Jaipur. Vaishali Nagar location is unbeatable for families. Verify your unit layout.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LUCKNOW
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'lucknow',
    propertyName: 'Omaxe The Residency',
    propertyType: 'APARTMENT',
    address: 'Gomti Nagar Extension, Lucknow 226010',
    developerName: 'Omaxe Group',
    developerSlug: 'omaxe',
    description: 'Omaxe The Residency is a premium residential development in Gomti Nagar Extension, Lucknow\'s most sought-after address. The project offers 2 BHK, 3 BHK, and 4 BHK apartments in high-rise towers. Gomti Nagar Extension is home to Lucknow\'s best schools (Sunbeam, City Montessori), the Ekana International Cricket Stadium, and numerous IT and corporate offices. The project has multiple delivered phases with active resale market.',
    priceMin: 5800000,
    priceMax: 14000000,
    topic: {
      userName: 'Abhishek Srivastava',
      title: 'Omaxe Residency Gomti Nagar — buying in 2025, what should I know?',
      content: `Planning to buy a 3 BHK in Omaxe Residency. Budget is up to 80 lakhs. Looking for genuine feedback from existing residents or those who have bought resale here.

Gomti Nagar Extension has transformed dramatically in the last 5 years. When the project launched, the area was semi-developed. Now there's everything you need within 2-3 km. Shaheed Path connectivity has made the commute to Civil Lines and city centre bearable.

What I've heard about the project: early phases had some construction quality concerns — reportedly there were water leakage issues in some units in the 2018-2019 towers. The newer phases are supposed to be better. Resale market is active which is a good sign.

I'm specifically looking at resale in Tower 12 which seems to be in the newer cluster. Asking price is 72 lakhs for a 1600 sqft 3 BHK. Is this reasonable?

Also, how is parking? I have two vehicles. And is the society maintenance reasonable — I've heard some societies in Lucknow have very high maintenance charges.`,
      daysAgo: 17,
    },
    comments: [
      {
        userName: 'Divya Tripathi',
        content: `I'm in Tower 8 (older cluster). The leakage issue in the first rains of 2020 was real — external wall junction had a problem. It was fixed under warranty but took 3 visits to actually resolve. Tower 12 and newer ones should be fine, they apparently changed their waterproofing contractor after the complaints.

On parking — each flat gets one dedicated covered space. Second vehicle goes into visitor parking which is first-come-first-served after 8 PM. For two cars it can be annoying.`,
        daysAfter: 1,
      },
      {
        userName: 'Mohit Verma',
        content: `72 lakhs for 1600 sqft in Tower 12 sounds fair for current market. Gomti Nagar Extension has been appreciating at around 8-12% annually. The Ekana Stadium has added a lot of prestige to the micro-market. CMS school branch in the vicinity means good rental demand from teachers and families too.`,
        daysAfter: 3,
      },
      {
        userName: 'Sunita Pandey',
        content: `Maintenance is ₹2.50/sqft per month here which is reasonable for Lucknow. Society management is through a residents' welfare association, not builder-managed. The RWA is reasonably active. Cleanliness and security are acceptable.`,
        daysAfter: 5,
      },
      {
        userName: 'Abhishek Srivastava',
        content: `Thank you everyone — this is exactly the ground-level info I needed. Going ahead with the Tower 12 unit. Will update after possession.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Divya Tripathi',       score: 3, review: 'Early towers had issues but resolved. Good location, fair maintenance. Check the specific tower before buying.' },
      { userName: 'Mohit Verma',          score: 4, review: 'Great micro-market, steady appreciation. Omaxe delivers, sometimes with delays.' },
      { userName: 'Abhishek Srivastava',  score: 4, review: 'Good project in one of Lucknow\'s best locations. Newer towers are the right choice.' },
    ],
  },

  {
    citySlug: 'lucknow',
    propertyName: 'ATS Pious Orchards',
    propertyType: 'APARTMENT',
    address: 'Sultanpur Road, Lucknow 226002',
    developerName: 'ATS Group',
    developerSlug: 'ats-group',
    description: 'ATS Pious Orchards is a premium residential project on Sultanpur Road, Lucknow — part of the Lucknow-Agra expressway belt. The project offers 3 BHK and 4 BHK spacious apartments with large balconies and club-level amenities. ATS is a reputed NCR-based developer known for premium construction quality. Sultanpur Road has emerged as a key residential corridor with the new airport terminal, SGPGI medical institute, and several IT parks driving demand.',
    priceMin: 7200000,
    priceMax: 14500000,
    topic: {
      userName: 'Mohit Verma',
      title: 'ATS Pious Orchards — premium pricing on Sultanpur Road, is it worth it vs Gomti Nagar?',
      content: `Did a site visit to ATS Pious Orchards last week. Sharing observations.

The project is genuinely well-built — you can tell the difference walking through the corridors vs most Lucknow projects. ATS constructs differently, the slab thickness feels right, fittings are brand name (Kohler bathrooms, Hettich wardrobes). The lobby design is proper premium.

Location on Sultanpur Road: the area has improved a lot since the expressway expanded. Upcoming airport terminal means this corridor will appreciate. SGPGI and Ram Manohar Lohia hospitals are within 20-25 minutes. The downside is that the immediate neighborhood is still developing — you're looking at open land and scattered construction around the project, not an established residential pocket like Gomti Nagar.

Pricing: they're asking 8500-9000 per sqft for 3 BHK. That's higher than Gomti Nagar Extension pricing for most projects. The justification is product quality and ATS brand.

My take: if you want the best-built product in Lucknow and are comfortable with a developing neighborhood, ATS is the pick. If you want immediate social infrastructure and established area, Gomti Nagar Extension at lower per sqft is smarter.

The project has RERA registration and ATS has a clean delivery record which matters.`,
      daysAgo: 11,
    },
    comments: [
      {
        userName: 'Abhishek Srivastava',
        content: `ATS in NCR has never had a delayed project in the premium segment as far as I know. Their Noida and Greater Noida projects always deliver. Brings credibility to this Lucknow launch. The brand premium might actually be worth it just for delivery certainty.`,
        daysAfter: 2,
      },
      {
        userName: 'Divya Tripathi',
        content: `The new terminal at Lucknow airport will make Sultanpur Road extremely accessible. Currently the road has some bottlenecks near Singar Nagar but the expressway bypass takes you around it. Long-term this is a strong corridor.`,
        daysAfter: 4,
      },
    ],
    ratings: [
      { userName: 'Mohit Verma',         score: 4, review: 'Best build quality in Lucknow premium segment. Location will appreciate with airport and corridor development.' },
      { userName: 'Abhishek Srivastava', score: 5, review: 'ATS delivery record is the biggest USP here. Premium product at premium price — justified.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NAGPUR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'nagpur',
    propertyName: 'Gera World of Joy',
    propertyType: 'APARTMENT',
    address: 'Kharbi Road, Nagpur 441001',
    developerName: 'Gera Developments',
    developerSlug: 'gera-developments',
    description: 'Gera World of Joy is a large integrated township in Kharbi, one of Nagpur\'s emerging residential belts on the eastern side. The project features 1 BHK, 2 BHK, and 3 BHK apartments along with the unique child-focused design — the project integrates a dedicated children\'s area and programming as part of the Gera World of Joy concept. Nagpur\'s zero-mile connectivity advantage makes it attractive for buyers seeking a centrally-located Indian city. MIHAN (Maharashtra Industrial Hub and Airport Node) development is the key demand driver.',
    priceMin: 3800000,
    priceMax: 8000000,
    topic: {
      userName: 'Omkar Joshi',
      title: 'Gera World of Joy Nagpur — is MIHAN proximity actually affecting prices here?',
      content: `Based in Pune, considering an investment in Nagpur. Looking at Gera World of Joy specifically because of the MIHAN angle. Looking for perspective from Nagpur locals.

MIHAN has been in the planning stage for so long that a lot of people stopped taking it seriously. But in the last 2 years things seem to be actually moving — Boeing has its MRO (maintenance facility) operational, SpiceJet had some presence, and Haldiram's expansion is creating employment. Is the employment actually materializing in a way that drives residential demand?

Also specifically about Gera — the World of Joy concept is interesting for families. The Gera brand from Pune is reliable, I know their work here. But Nagpur pricing seems attractive, 4000-5000 per sqft range for delivered product.

Kharbi Road — what is the infrastructure like now? Markets, schools, hospitals in accessible range?`,
      daysAgo: 28,
    },
    comments: [
      {
        userName: 'Shraddha Patil',
        content: `MIHAN employment is real but it's different from what was originally projected. It's more manufacturing and logistics than IT. The workforce accommodation demand is more for smaller 1 BHK units than premium housing. Don't expect Hinjewadi-type rental demand. That said, Nagpur prices have genuinely moved up 20-25% in last 2 years so the market is active.`,
        daysAfter: 3,
      },
      {
        userName: 'Kedar Bhosale',
        content: `Gera's child-centric concept works well for families. But as a pure investment play, you're better off looking at properties closer to Wardha Road or the inner ring road if you want better resale liquidity. Kharbi is developing but still peripheral.`,
        daysAfter: 6,
      },
      {
        userName: 'Omkar Joshi',
        content: `Thanks for the honest perspective. I think I'll look at a Wardha Road option instead given the liquidity concern. Nagpur as a city makes sense for investment, just need to pick the right micro-market.`,
        daysAfter: 9,
      },
    ],
    ratings: [
      { userName: 'Omkar Joshi',    score: 3, review: 'Good product concept, Gera is reliable. Kharbi location limits near-term investment returns.' },
      { userName: 'Shraddha Patil', score: 3, review: 'Solid builder, good for end-use. MIHAN demand is real but different from what was promised.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INDORE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'indore',
    propertyName: 'Mahindra Antheia',
    propertyType: 'APARTMENT',
    address: 'Super Corridor, Indore 452016',
    developerName: 'Mahindra Lifespace',
    developerSlug: 'mahindra-lifespace',
    description: 'Mahindra Antheia is a premium residential project on Indore\'s Super Corridor, the city\'s most rapidly developing IT and residential belt. The project offers 2 BHK, 3 BHK, and 4 BHK apartments with landscape views. Located adjacent to Indore\'s IT Park and close to IIM Indore, the Super Corridor has attracted significant professional housing demand. Mahindra Lifespace brings its nationally trusted brand to one of central India\'s fastest-growing cities.',
    priceMin: 6200000,
    priceMax: 13000000,
    topic: {
      userName: 'Prakash Jain',
      title: 'Mahindra Antheia Indore — Super Corridor is exploding, is now the right time?',
      content: `Indore local here, 15 years in the city. Watching the Super Corridor transform has been unbelievable. Sharing my read on Mahindra Antheia specifically.

The Super Corridor 5-6 years ago was barren land. Now it has IIM Indore, Infosys campus, multiple IT companies, and residential projects from every major builder. Infrastructure was the concern — road quality, water supply, public transport. The AB Road bypass has resolved most commute issues. Water has improved as the municipal supply network extended.

Mahindra Antheia: site visited twice. Build quality is what you expect from Mahindra — solid construction, clean finishes, professional project management. Layout is efficient, the 3 BHK is genuinely 3 bedroom without any sacrificed space. The landscaping around the towers is well-designed.

Pricing at 6500-7500 per sqft is the highest on the Super Corridor. Competitors are 4500-5500. The premium is the brand and product quality.

For Indore buyers: this is genuinely a premium product in a city where most launches are mid-market. If your budget allows, the quality difference from typical Indore builders is tangible.

Investment thesis: Super Corridor has years of runway. IT absorption continues, IIM proximity adds prestige. 10-12% annual appreciation is realistic based on last 5 years of data.`,
      daysAgo: 44,
    },
    comments: [
      {
        userName: 'Ankita Solanki',
        content: `The Super Corridor development story is one of the best in Tier 2 India. Indore being India's cleanest city 7 years running adds to the livability premium. My husband works at the IT park — commute from Antheia site would be under 10 minutes. Very tempted.`,
        daysAfter: 2,
      },
      {
        userName: 'Vivek Chouhan',
        content: `One concern I have — there are 15-20 active projects on the Super Corridor right now. A lot of supply coming at once. Rental yields might be compressed for a few years as all this stock gets delivered. End-use decision is fine, pure investment you need to factor in the supply overhang.`,
        daysAfter: 5,
      },
      {
        userName: 'Prakash Jain',
        content: `@Vivek — fair point on supply. Mahindra specifically will have better demand resilience than local builders in a supply-heavy scenario. Tenants (especially from Infosys, IIM) tend to prefer branded projects. Brand matters when there's excess supply.`,
        daysAfter: 6,
      },
    ],
    ratings: [
      { userName: 'Prakash Jain',   score: 5, review: 'Best product quality on the Super Corridor. Mahindra brand adds significant value in a cluttered market.' },
      { userName: 'Ankita Solanki', score: 5, review: 'Perfect for IT professionals. Location, quality, and brand tick every box.' },
      { userName: 'Vivek Chouhan',  score: 4, review: 'Great product, watch the supply overhang on the corridor. Long-term strong investment.' },
    ],
  },

  {
    citySlug: 'indore',
    propertyName: 'Ashiana Surbhi',
    propertyType: 'APARTMENT',
    address: 'Scheme 78, AB Road, Indore 452010',
    developerName: 'Ashiana Housing',
    developerSlug: 'ashiana-housing',
    description: 'Ashiana Surbhi is an established residential community in Scheme 78, one of Indore\'s most sought-after addresses on the AB Road corridor. The project is a ready-to-move development with multiple towers fully delivered and occupied. It offers 2 BHK and 3 BHK apartments in a well-maintained green campus. Ashiana Housing is known nationally for community living and active senior citizen-friendly design. The project has a fully operational clubhouse, pool, and tennis court.',
    priceMin: 5200000,
    priceMax: 9000000,
    topic: {
      userName: 'Ankita Solanki',
      title: 'Ashiana Surbhi Scheme 78 — resale market and actual living experience',
      content: `My parents moved into Ashiana Surbhi in 2021, I visit often. Sharing what living here is actually like vs the marketing.

Ashiana's community design is genuinely different. The way they design the common spaces encourages people to interact — morning walk paths, garden seating, activity rooms. My parents have made more friends here in 2 years than in their previous society of 15 years. For retired couples and senior citizens especially, this works really well.

Scheme 78 is a prime Indore location. AB Road access is 5 minutes, Bombay Hospital is 10 minutes, Treasure Island mall is 15 minutes. Everything my parents need is accessible without needing to travel far.

Build quality: Ashiana is known for this and it shows. 3 years in, there are no structural issues, waterproofing has held through three monsoons. Society maintenance is through Ashiana's own management company — professional and responsive.

Resale market: 2 BHKs are available at 55-65 lakhs, 3 BHK at 75-90 lakhs. These are ready-to-move with proven society. For end-use buyers this is arguably the most risk-free option in Indore.

The only negative: the project is sold out from builder, so you're going through resale which involves negotiation. Some sellers are inflexible on pricing. Be patient.`,
      daysAgo: 36,
    },
    comments: [
      {
        userName: 'Vivek Chouhan',
        content: `Ashiana's management model is their real moat. Once you experience a well-run society, going back to RWA-managed chaos is tough. The pricing premium vs average Indore projects is worth it for the lifestyle assurance.`,
        daysAfter: 4,
      },
      {
        userName: 'Prakash Jain',
        content: `For investors: rental demand from working professionals is more for Super Corridor projects. Ashiana Surbhi is more of a lifestyle/end-use play. Rental yield is moderate (3-4%) but capital appreciation in Scheme 78 is solid.`,
        daysAfter: 8,
      },
    ],
    ratings: [
      { userName: 'Ankita Solanki', score: 5, review: 'Best society management in Indore. Ideal for families and seniors. Worth the premium.' },
      { userName: 'Vivek Chouhan',  score: 5, review: 'Ashiana model works. Don\'t think twice if budget allows.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BHOPAL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'bhopal',
    propertyName: 'Saket Callista',
    propertyType: 'APARTMENT',
    address: 'Ayodhya Bypass Road, Bhopal 462022',
    description: 'Saket Callista is a premium residential development on the Ayodhya Bypass Road in Bhopal, offering 3 BHK and 4 BHK luxury apartments with modern amenities. The project features a swimming pool, clubhouse, gym, and landscaped grounds. Located on one of Bhopal\'s fastest-developing residential corridors, the project benefits from proximity to the state capital\'s administrative hub and the upcoming Ring Road. Saket is a well-regarded Bhopal developer with multiple successful deliveries.',
    priceMin: 5800000,
    priceMax: 11500000,
    topic: {
      userName: 'Ankita Solanki',
      title: 'Saket Callista Bhopal — anyone with firsthand experience with this builder?',
      content: `Looking to buy in Bhopal — I work with a central government department posted here for 3 years (might extend). Budget is 60-70 lakhs for a 3 BHK. Saket Callista on Ayodhya Bypass came up in my search.

From what I've researched: Saket as a builder has been in Bhopal for 20+ years. Their older projects — Shantinagar, Samta Colony — are established and in good shape. Callista is their premium offering.

The Ayodhya Bypass location: the road was proposed as a key infrastructure upgrade. Has the actual road development happened? My concern is whether this is still a "developing" location or whether it's become genuinely connected to Bhopal's main arteries.

Also — for government employees who may need to sell/rent after 3 years, is the resale market liquid on this corridor?`,
      daysAgo: 22,
    },
    comments: [
      {
        userName: 'Vivek Chouhan',
        content: `Saket has a good reputation in Bhopal. Callista is their cleanest product yet. Ayodhya Bypass is now fully connected — the 4-laning is done and access to AIIMS Bhopal and the Manit area is straightforward. The Bairagarh to Ayodhya Bypass stretch was the problem and that's been resolved.`,
        daysAfter: 2,
      },
      {
        userName: 'Prakash Jain',
        content: `For a 3-year posting with possible extension, buying makes sense if the numbers work. Bhopal government employees' housing demand is constant — there will always be a buyer or tenant for a quality 3 BHK. The market here is not as liquid as Indore but the government administration buyer base means steady demand.`,
        daysAfter: 5,
      },
    ],
    ratings: [
      { userName: 'Vivek Chouhan', score: 4, review: 'Saket is a trusted name in Bhopal. Callista is their best work. Bypass road issue is now resolved.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VISAKHAPATNAM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'visakhapatnam',
    propertyName: 'My Home Vihanga',
    propertyType: 'APARTMENT',
    address: 'Kommadi, Visakhapatnam 530048',
    developerName: 'My Home Constructions',
    developerSlug: 'my-home-constructions',
    description: 'My Home Vihanga is a large residential township in Kommadi, one of Visakhapatnam\'s fastest-growing suburban areas located along the Bheemunipatnam Road. The project offers 2 BHK, 3 BHK, and 4 BHK apartments across multiple towers with extensive amenities including a 2-acre central park, clubhouse, rooftop pool, and community spaces. My Home Constructions is Hyderabad\'s leading developer with an outstanding delivery record. Visakhapatnam\'s emergence as Andhra Pradesh\'s executive capital has dramatically boosted demand in this corridor.',
    priceMin: 5200000,
    priceMax: 12500000,
    topic: {
      userName: 'Venkata Rao',
      title: 'My Home Vihanga — Kommadi real estate is booming, is Vihanga worth the price?',
      content: `Born and raised in Vizag, watching Kommadi transform has been surreal. Sharing my perspective on Vihanga and the broader Bheemunipatnam Road corridor.

The AP capital effect is real. Ever since Amaravati was announced and then Vizag was discussed as executive capital, there's been genuine administrative and business activity influx. Government offices are coming up, PSU expansions are happening, and the Navy presence was always strong here.

My Home as a builder — I know them from Hyderabad. They've delivered every single project on time in Hyderabad. That track record matters. No other builder in this corridor has a comparable delivery record.

Vihanga specifically: the site is well-laid out. The 2-acre park is genuinely open space, not the cosmetic greenery you see in most projects. The towers are well-positioned for cross-ventilation — Vizag gets strong sea breeze from the east and most units face the right way to catch it. Build quality on the sample flat was impressive.

The concern: pricing. At 5500-6500 per sqft they're 20-30% above local Vizag projects. The premium is the brand. Whether the city appreciates to bridge that gap depends heavily on the capital status decision.

Beach Road area and the Navy belt will always hold value. Kommadi is the expansion zone — risk and reward are both higher.`,
      daysAgo: 31,
    },
    comments: [
      {
        userName: 'Padmavathi Raju',
        content: `The sea breeze point is so important in Vizag. Projects that don't account for orientation end up needing AC round the clock. My Home clearly did the homework on this. I've visited twice and the natural ventilation difference is noticeable.`,
        daysAfter: 2,
      },
      {
        userName: 'Srinivas Murthy',
        content: `Vizag is genuinely undervalued vs Hyderabad even now. If the executive capital status materializes fully, this city will see 40-50% price appreciation in the premium segment. Buying in the established builder projects now is the smart play. My Home is the safest name here.`,
        daysAfter: 4,
      },
      {
        userName: 'Venkata Rao',
        content: `@Srinivas — agree, though I'd caveat that capital status decisions in AP have been politically volatile. Don't bank entirely on that thesis. The city's own natural strengths — Navy, pharma, port, tourism — are enough to justify a positive long-term view without needing capital status.`,
        daysAfter: 6,
      },
    ],
    ratings: [
      { userName: 'Venkata Rao',     score: 4, review: 'My Home\'s delivery record is the key differentiator. Premium pricing justified by quality and brand.' },
      { userName: 'Padmavathi Raju', score: 5, review: 'Best designed project in Kommadi. Ventilation and layout thinking is exceptional.' },
      { userName: 'Srinivas Murthy', score: 5, review: 'Best investment bet in Vizag for premium segment. Long-term appreciation story is strong.' },
    ],
  },

  {
    citySlug: 'visakhapatnam',
    propertyName: 'Aparna HillPark',
    propertyType: 'APARTMENT',
    address: 'Seethammadhara, Visakhapatnam 530013',
    developerName: 'Aparna Constructions',
    developerSlug: 'aparna-constructions',
    description: 'Aparna HillPark is a premium hillside residential development in Seethammadhara, one of Visakhapatnam\'s most prestigious addresses. The project is built on a natural hill with apartments offering panoramic bay views and the Eastern Ghats. The project features tiered landscaping, a sky lounge, infinity pool, and private lift lobbies for select floors. Aparna Constructions from Hyderabad is known for delivering premium quality and is one of south India\'s most trusted developers.',
    priceMin: 9000000,
    priceMax: 22000000,
    topic: {
      userName: 'Padmavathi Raju',
      title: 'Aparna HillPark Seethammadhara — visiting next week, what to focus on?',
      content: `Planning to visit Aparna HillPark with my husband next Saturday. We're serious buyers in the 1.2-1.5 Cr range for a 3 BHK. Have done preliminary research but want to know what specific things to look for on the site visit.

Background: we currently live in Seethammadhara, renting. The area is our first choice — medical infrastructure (King George Hospital, Apollo, Manipal all within range), established markets, and the cosmopolitan feel. Aparna HillPark seems like the most premium product in this micro-market.

What I want to verify on the visit:
1. Actual view from the floors available in our budget (not just top floors)
2. Whether the lift access is convenient or involves too much walking given the hill terrain
3. Status of the infinity pool — is it operational?
4. Parking — hill projects sometimes have tricky parking arrangements

Has anyone visited recently?`,
      daysAgo: 8,
    },
    comments: [
      {
        userName: 'Venkata Rao',
        content: `Visited 3 months ago. For views — floors 8 and above in the main tower give you partial bay view even in the lower-priced units. Below floor 6 it's mostly tree line and surrounding buildings. Insist on seeing the view from the exact floor/unit you're considering, not the show flat.

Lifts are 4 per tower, fast. The walkway from parking to lobby has a slight incline but it's manageable and actually nicely landscaped. Not a problem for regular use.`,
        daysAfter: 1,
      },
      {
        userName: 'Srinivas Murthy',
        content: `Aparna's finishing is always excellent. Their tile selection, paint quality, and bathroom fittings are a notch above what Vizag buyers are used to. Pool was operational when I visited 2 months ago.

One thing: negotiate on the parking. Some floors come with a single parking only. If you need two, clarify in writing before booking. Don't rely on verbal assurances.`,
        daysAfter: 3,
      },
    ],
    ratings: [
      { userName: 'Venkata Rao',     score: 5, review: 'Best premium product in Seethammadhara. Views, quality, and location are unmatched.' },
      { userName: 'Srinivas Murthy', score: 4, review: 'Aparna delivers premium quality. Verify parking arrangements carefully.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VADODARA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'vadodara',
    propertyName: 'Rajvi Regalia',
    propertyType: 'APARTMENT',
    address: 'Akota, Vadodara 390020',
    description: 'Rajvi Regalia is a premium residential project in Akota, Vadodara\'s most coveted address. The project offers spacious 3 BHK and 4 BHK apartments with high-quality interiors, large balconies, and landscaped podium. Akota is known for its established residential character — proximity to Fatehgunj, Race Course, and the city\'s commercial hubs makes it the first choice for Vadodara\'s professional and business community. The project is near-complete with possession of initial towers done.',
    priceMin: 7800000,
    priceMax: 16500000,
    topic: {
      userName: 'Nishant Desai',
      title: 'Rajvi Regalia Akota — living here for 8 months, honest assessment',
      content: `Moved into Rajvi Regalia Tower A in September last year. Time for an honest update.

First the positives: Akota as a location is genuinely unbeatable in Vadodara. Fatehgunj market is 5 minutes, Race Course Road is a 3-minute drive, Sindhvai temple for those who care about that, and the Old Padra Road has every facility. The social fabric here is established Vadodara — you're among the city's professionals and old-money business families.

The apartment quality: better than most Vadodara builders at this price point. Italian marble in the lobby is real (not laminate). Bathroom fittings are Jaquar/Hindware. Kitchen platform is granite. Bedroom sizes are generous — the master bedroom at 175 sqft is comfortable.

What's not great: the soundproofing between floors is average. I can hear my upstairs neighbors' footsteps clearly. This is a common issue in Indian construction even at premium prices and I don't blame the builder specifically, but worth noting. Also the water pressure in the morning peak hour (7-9 AM) is on the lower side.

The society is professionally managed — dues are ₹4.50 per sqft per month. Slightly high but the cleaning staff is evident and lift maintenance is regular.

Overall for Vadodara standards, this is genuinely premium. Would buy again.`,
      daysAgo: 19,
    },
    comments: [
      {
        userName: 'Foram Mehta',
        content: `Akota is Vadodara's equivalent of Navrangpura in Ahmedabad. You pay for the address and the established community. For Vadodara business families, living in Akota is a statement. The Rajvi brand has a good local reputation.`,
        daysAfter: 3,
      },
      {
        userName: 'Hiral Shah',
        content: `The soundproofing issue you mention is common across India at any price point — only truly luxury projects (above 2 Cr per unit) tend to address this properly. Not a dealbreaker for Vadodara pricing. The location advantage more than compensates.`,
        daysAfter: 6,
      },
      {
        userName: 'Nishant Desai',
        content: `@Hiral — agreed, it's not a dealbreaker but buyers should know. Use thick rugs in the living room if you're sensitive to noise from above — makes a big difference.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Nishant Desai', score: 4, review: 'Best product in Akota. Location is unmatched. Minor gripes on soundproofing, manageable overall.' },
      { userName: 'Foram Mehta',   score: 4, review: 'Rajvi is a solid Vadodara builder. Akota address adds lasting value.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GHAZIABAD
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'ghaziabad',
    propertyName: 'Gaur City 2',
    propertyType: 'APARTMENT',
    address: 'Greater Noida West (Noida Extension), Ghaziabad 201318',
    developerName: 'Gaursons India',
    developerSlug: 'gaursons-india',
    description: 'Gaur City 2 is one of the most successful large-scale township projects in NCR, located in Greater Noida West (Noida Extension). The township spans multiple phases with thousands of delivered units and an active community. It offers 2 BHK, 3 BHK, and 4 BHK apartments along with Gaur Chowk — a large retail and entertainment complex within the township. The project is known for its strong resident community, good society management, and active resale market.',
    priceMin: 5500000,
    priceMax: 10000000,
    topic: {
      userName: 'Priyanka Mishra',
      title: 'Gaur City 2 resale — buying in 2025, what has changed since the Supertech era?',
      content: `Looking at a resale 3 BHK in Gaur City 2 after spending almost a year comparing options in Greater Noida West. Sharing what I've found out.

The GNOW market was shattered by the Supertech fiasco a few years ago. Genuine buyers disappeared, sentiment was terrible. But Gaur City 2 is a completely different story — these towers are standing, occupied, and the society is functioning. Don't club it with the troubled developers.

Current resale market in Gaur City 2: 3 BHK asking prices are 55-70 lakhs depending on tower, floor, and condition. The spread is wide because some owners have done extensive renovation and some haven't touched the flat since possession. Negotiate hard — sellers in the resale market here are flexible.

The township itself has matured nicely. Gaur Chowk has a Big Bazaar, cinema, and decent food court. The internal road network is maintained. School buses operate within the campus.

Metro: this is the key upside. The Aqua Line extension to Greater Noida West is operational now and the sector stations are accessible from Gaur City 2. Connectivity to Noida City Centre and eventually Delhi has changed the calculus on this area entirely.

Issues to check before buying: builder maintenance dues on the specific flat (some resellers have unpaid maintenance), seepage in lower floors from surrounding areas during heavy rain, and verify that the specific tower has received OC.`,
      daysAgo: 25,
    },
    comments: [
      {
        userName: 'Sandeep Gautam',
        content: `Been living in Gaur City 2 for 4 years. The metro operational was a genuine game-changer — both for daily commute to Noida and for property demand. Prices in the last 12 months have moved 15-18% which is significant. Anyone who bought 2 years ago is sitting pretty.`,
        daysAfter: 2,
      },
      {
        userName: 'Mohit Verma',
        content: `The Supertech comparison is important — Gaur has delivered every project in this area. Their reputation is intact. The association of GNOW with the Supertech collapse is unfair to genuinely delivered projects like Gaur City. The stigma is fading as more buyers recognize the difference.`,
        daysAfter: 4,
      },
      {
        userName: 'Priyanka Mishra',
        content: `@Sandeep — 15-18% in 12 months is significant. Any sense of whether this is sustainable or whether it's run ahead of fundamentals? Don't want to buy at a peak.`,
        daysAfter: 6,
      },
      {
        userName: 'Sandeep Gautam',
        content: `My read: the metro-led demand is structural, not speculative. GNOW has been undervalued for 5 years post-Supertech. The current run is catch-up to fundamentals more than irrational exuberance. That said, at 65+ lakhs for 3 BHK, the easy gains are made. Further appreciation will be slower and more in line with broader NCR market.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Priyanka Mishra', score: 4, review: 'Solid delivered township with active community. Metro connectivity changed the game. Good resale market.' },
      { userName: 'Sandeep Gautam',  score: 4, review: 'Best value large township in NCR post-metro. Gaur delivers, unlike many in this area.' },
    ],
  },

  {
    citySlug: 'ghaziabad',
    propertyName: 'Apex Splendour',
    propertyType: 'APARTMENT',
    address: 'Crossing Republik, Ghaziabad 201016',
    description: 'Apex Splendour is a mid-premium residential project in Crossing Republik, Ghaziabad\'s most developed township along NH-9. The project offers 2 BHK and 3 BHK apartments in a well-planned layout with modern amenities. Crossing Republik is a self-contained township with its own market, schools, and healthcare facilities. The area benefits from excellent NH-9 connectivity to Delhi and the eastern UP belt.',
    priceMin: 4500000,
    priceMax: 7800000,
    topic: {
      userName: 'Sandeep Gautam',
      title: 'Apex Splendour Crossing Republik — under-discussed but genuinely good project?',
      content: `Crossing Republik doesn't get as much attention as GNOW or Raj Nagar Extension but I think it's underrated. Apex Splendour is one of the better projects here. Here's why I think so.

Crossing Republik has the most developed social infrastructure among Ghaziabad's township areas. The market at Crossings has banks, restaurants, a multiplex, and daily needs sorted. This matters if you've ever lived in a half-developed township waiting for a grocery store to open.

NH-9 / NH-58 junction means you're well-connected to both Delhi Meerut Expressway and the regular Delhi route. For those working in East Delhi or Noida, commute times are manageable — 45-60 mins to Connaught Place off-peak.

Apex as a builder: have delivered a few projects in this area. Not a national brand but local track record is decent. The specific project — Splendour — is largely delivered and occupied, so you can verify the actual product before committing.

Pricing is the USP: 4500-5000 per sqft for a 2-3 BHK ready unit is among the most competitive in NCR for what you get. If I compare this to anything in South Delhi or even Noida proper, you're getting significantly more space for the money.

The sacrifice: you're further from Delhi than Dwarka or Noida. Public transport beyond the NH-9 bus route is limited.`,
      daysAgo: 41,
    },
    comments: [
      {
        userName: 'Priyanka Mishra',
        content: `Crossing Republik has strong community feel — lots of established middle-class families. The resident composition is different from GNOW which is more young professional. If you have school-age kids and want a stable, established neighborhood, Crossings might actually suit better.`,
        daysAfter: 3,
      },
      {
        userName: 'Rajesh Yadav',
        content: `The NH-9 Delhi-Meerut Expressway has made Crossing Republik extremely accessible from east Delhi. I do this commute daily to Mayur Vihar — 35-40 minutes door to door now. Would have been unthinkable 5 years ago.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Sandeep Gautam', score: 4, review: 'Best value in Ghaziabad for developed neighborhood living. Underrated vs GNOW.' },
      { userName: 'Rajesh Yadav',   score: 4, review: 'Expressway connectivity is a genuine upgrade. Good for Delhi-side commuters.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LUDHIANA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'ludhiana',
    propertyName: 'Omaxe The Lake',
    propertyType: 'APARTMENT',
    address: 'Ferozepur Road, Ludhiana 141012',
    developerName: 'Omaxe Group',
    developerSlug: 'omaxe',
    description: 'Omaxe The Lake is a premium residential and commercial township on Ferozepur Road, Ludhiana\'s most active real estate corridor. The project offers 2 BHK, 3 BHK, and 4 BHK apartments centered around a man-made lake. The address is prestigious — Ferozepur Road hosts Ludhiana\'s most established commercial activity and connects the city to the Chandigarh highway. The project has delivered initial phases with occupied towers.',
    priceMin: 6800000,
    priceMax: 14000000,
    topic: {
      userName: 'Gurpreet Singh',
      title: 'Omaxe The Lake Ludhiana — is Ferozepur Road still the right address in 2025?',
      content: `Fifth generation Ludhiana family, been watching the city's real estate evolve for decades. Sharing my perspective on Omaxe The Lake and Ferozepur Road.

Ferozepur Road was always Ludhiana's Gold Address — the industrial and trading families have historically preferred this side. The road connects to the airport and to the NH toward Chandigarh. The social infrastructure on Ferozepur Road is the best in the city — Schools like Shivalik Public, hospitals, restaurants, everything is here.

Omaxe The Lake specifically: the man-made lake is a genuine feature, not just a marketing gimmick. The landscaping around it is maintained and the morning walk circuit is actively used by residents. Tower views facing the lake command a 5-10% premium over other-facing units — worth it.

Build quality: Omaxe has been inconsistent nationally. In Ludhiana specifically, The Lake is one of their better executions. There were snag issues in Tower 1 during initial possession but these were resolved. Newer towers (3, 4, 5) have fewer complaints based on what I've heard from buyers.

The honest concern for Ludhiana as a market: the city has been relatively flat in appreciation over the last 3-4 years compared to Chandigarh or Mohali. Industrial slowdown in the textile and hosiery sectors has kept sentiment muted. The property market here is driven by local business families rather than speculative investment. It's stable but not high-growth.

For end-use as a primary home in Ludhiana, this is a top-3 address. As pure investment, look carefully at the city's growth fundamentals before committing.`,
      daysAgo: 47,
    },
    comments: [
      {
        userName: 'Harpreet Kaur',
        content: `Ludhiana's market is driven by businessmen, not IT or salaried class. This gives it a different character — less speculation, more end-use. The people who buy on Ferozepur Road are buying for 20+ year holds. Price stability might frustrate investors but reassures end-users.`,
        daysAfter: 3,
      },
      {
        userName: 'Mandeep Dhaliwal',
        content: `The industrial slowdown concern is valid for the mass market but the premium segment (above 80 lakhs) in Ludhiana has held up well. The business community doesn't stop buying quality real estate even in a slowdown — they diversify their business profits into property. Omaxe The Lake sits in this segment.`,
        daysAfter: 6,
      },
      {
        userName: 'Gurpreet Singh',
        content: `@Mandeep — fair point. The 1 Cr+ segment in Ludhiana has a different buyer profile. I should have distinguished that. For this specific product, the buyer is the Ludhiana business family, not the IT professional. And that buyer is always present here.`,
        daysAfter: 8,
      },
    ],
    ratings: [
      { userName: 'Gurpreet Singh',  score: 4, review: 'Best address in Ludhiana. Lake feature is genuine. City appreciation slower than Punjab peers.' },
      { userName: 'Harpreet Kaur',   score: 4, review: 'Stable market, good end-use product. Not a flipper\'s market.' },
      { userName: 'Mandeep Dhaliwal',score: 4, review: 'Premium segment holds well. The business buyer community is the backbone.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AGRA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'agra',
    propertyName: 'Omaxe City Agra',
    propertyType: 'APARTMENT',
    address: 'Sikandra-Bodla Road, Agra 282007',
    developerName: 'Omaxe Group',
    developerSlug: 'omaxe',
    description: 'Omaxe City Agra is a large integrated township on Sikandra-Bodla Road, part of the Agra-Lucknow Expressway belt. The project offers apartments, plots, and villas in a master-planned layout. The township concept brings Agra its first large-scale organized residential community. The location benefits from Agra\'s tourism economy, the Delhi-Agra Yamuna Expressway (2-hour Delhi access), and the new Agra Metro which is under construction.',
    priceMin: 3500000,
    priceMax: 9000000,
    topic: {
      userName: 'Rajesh Yadav',
      title: 'Omaxe City Agra — tourism economy + metro, is this finally Agra\'s breakout moment?',
      content: `Agra has always been undervalued as a real estate market given its famous location between Delhi and Lucknow. I believe this is finally changing. Sharing my analysis on Omaxe City Agra.

Agra's tourism economy is massive and growing — 70+ lakh visitors annually means there's strong hospitality and service sector employment. But historically, the residential market has been dominated by old haveli stock and unorganized construction. Omaxe City is genuinely the first large-scale organized township.

The Yamuna Expressway is a major plus. You're 2 hours from Delhi which is actually better than some Delhi NCR locations for road-based access. The proposed metro (Agra Metro Phase 1 construction is underway on the Taj Mahal to Agra Cantonment corridor) will change intra-city mobility.

Omaxe City itself: visited the township area — the infrastructure within the township (internal roads, park, market area) is developed. The plots have seen construction activity which indicates genuine buyer base. The apartment towers in the newer phase are a step up in quality from the initial launches.

Risk factors: Agra has a significant air quality problem (the AQI regularly ranks poorly nationally, and the Taj Mahal Environmental Zone restrictions affect some construction near it). Also, employment growth beyond tourism and handicrafts is limited. Appreciation will be moderate compared to IT-driven cities.

Best suited for: tourism economy professionals, Agra-based business families, and those looking for an affordable second home within Yamuna Expressway range.`,
      daysAgo: 62,
    },
    comments: [
      {
        userName: 'Priyanka Mishra',
        content: `The Yamuna Expressway point is often underestimated. Agra is closer to Delhi in time than Gurgaon sector 90 on a congestion-free day. And the plot prices are dramatically lower. For weekend home buyers from Delhi, this is worth considering.`,
        daysAfter: 4,
      },
      {
        userName: 'Abhishek Srivastava',
        content: `The Taj Environmental Zone restrictions were always a concern for development. Make sure any specific plot or unit you're considering is outside the 300m and 500m buffer zones. The NGT has been strict on this. Verify the environment clearance on the specific parcel.`,
        daysAfter: 8,
      },
      {
        userName: 'Rajesh Yadav',
        content: `@Abhishek — good point. Omaxe City Agra is on Sikandra Road which is outside the Taj Buffer Zone. The township has full environmental clearance. But this is an important check for anyone buying individual plots in Agra — many of the old city plots are within restricted zones and construction there is heavily regulated.`,
        daysAfter: 10,
      },
    ],
    ratings: [
      { userName: 'Rajesh Yadav',    score: 3, review: 'Good township infrastructure. Agra market is awakening but appreciation will be gradual. Verify environmental clearances.' },
      { userName: 'Priyanka Mishra', score: 3, review: 'Weekend home or affordable primary home thesis works. Not a high-appreciation market.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // NASHIK
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'nashik',
    propertyName: 'Godrej Nirvaan',
    propertyType: 'APARTMENT',
    address: 'Bhagur, Nashik-Pune Highway, Nashik 422502',
    developerName: 'Godrej Properties',
    developerSlug: 'godrej-properties',
    description: 'Godrej Nirvaan is a large integrated township by Godrej Properties on the Nashik-Pune Highway at Bhagur, covering over 100 acres. The project offers 1 RK, 1 BHK, 2 BHK, and 3 BHK apartments along with plots across multiple phases. The location benefits from the Nashik-Pune Expressway, proximity to Nashik city while being on the greener outskirts. The township features a central amenity zone, multiple schools within the campus, and Godrej\'s signature Green Building standards.',
    priceMin: 3200000,
    priceMax: 8500000,
    topic: {
      userName: 'Shraddha Patil',
      title: 'Godrej Nirvaan Bhagur — Phase 5 launch, is Nashik\'s outskirts worth betting on?',
      content: `Nashik based here, considering Phase 5 of Godrej Nirvaan at Bhagur. Been tracking this project since Phase 1 launched 8 years ago. Here's what the journey has looked like from the sidelines.

Phase 1 buyers paid around 2800-3200 per sqft. Current prices are 4500-5000 per sqft. That's about 50-60% appreciation in 8 years — decent but not spectacular compared to Pune or Hyderabad in the same period. The township has genuinely developed — multiple schools operational, the central amenity zone is functional, community is established.

Phase 5 is being positioned as more premium — taller towers, better views. They're asking 5000-5500 per sqft which puts total cost at 40-55 lakhs for a 2 BHK. For Nashik, this is at the higher end.

Bhagur location: it's 15-18 km from Nashik city centre (Nashik Road station, CBS). Traffic on the Nashik-Pune Highway can be heavy in the mornings. The immediate surroundings are semi-rural which some people love and others find limiting. Nashik has excellent quality of life — air quality, water (Godavari), temperate climate — but it's not a high-velocity city.

Godrej's delivery here has been consistent — every phase delivered within 6 months of announced date. That track record is worth a premium.

My dilemma: price for Phase 5 feels fully valued. There's less cushion for appreciation vs early phases. But Godrej is Godrej — product quality and brand are unmatched.`,
      daysAgo: 16,
    },
    comments: [
      {
        userName: 'Omkar Joshi',
        content: `Nashik is increasingly becoming a retirement and weekend home destination for Mumbai/Pune professionals. Bhagur specifically is known for vineyards (Sula is 3 km away). This gives it a lifestyle angle that pure residential projects don't have. Don't underestimate the second-home demand from Mumbai.`,
        daysAfter: 2,
      },
      {
        userName: 'Kedar Bhosale',
        content: `I know a few Phase 1 buyers. Their main advice: buy lower floors for easier lift independence, and avoid the west-facing units in summer — Nashik summers are manageable but west-facing still gets intense afternoon sun. East and north-facing units are preferred.`,
        daysAfter: 4,
      },
      {
        userName: 'Shraddha Patil',
        content: `@Omkar — the Sula proximity for a Nashik property is something I mention to every Mumbai friend. It changes their perception of what "living in Nashik" means. You're 5 minutes from wine country, not 5 minutes from a Nashik bus stand.`,
        daysAfter: 6,
      },
    ],
    ratings: [
      { userName: 'Shraddha Patil', score: 4, review: 'Godrej delivers consistently. Phase 5 pricing is full but product quality justifies it for end-use.' },
      { userName: 'Omkar Joshi',    score: 4, review: 'Great township, lifestyle angle is underrated. Second home demand from Mumbai will drive long-term value.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PATNA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'patna',
    propertyName: 'Ambika Green Woods',
    propertyType: 'APARTMENT',
    address: 'Phulwari Sharif, Patna 801505',
    description: 'Ambika Green Woods is a residential township project in Phulwari Sharif, one of Patna\'s emerging residential corridors on the southern edge of the city. The project offers 2 BHK and 3 BHK apartments in a green campus setting. Patna has seen significant real estate activity following state government investment in infrastructure, including the metro rail project, Ganga bridge expansions, and multiple IT park announcements. The project caters to Patna\'s growing salaried professional class.',
    priceMin: 3800000,
    priceMax: 7200000,
    topic: {
      userName: 'Sunil Kumar Singh',
      title: 'Ambika Green Woods Patna — are Patna property prices finally justified?',
      content: `Patna-based government officer here, been in the city my whole life. Real estate here is a complicated story. Sharing an honest perspective.

Patna's property market is unique in India. Prices in premium areas like Boring Road, Patliputra, and Kadamkuan are surprisingly high — in the same range as smaller cities like Indore or Nashik — despite lower income levels. This is partly due to land scarcity in the Ganga riverine area and partly due to undisclosed cash transactions that inflate headline numbers.

Phulwari Sharif is a southern suburb with lower prices and more organized development. Ambika Green Woods is one of the cleaner projects here in terms of documentation and RERA compliance. Most Patna real estate has been deeply unorganized — cash-heavy transactions, unclear titles, no RERA. Any project with clear RERA registration is immediately more trustworthy.

The 2 BHK at 40-45 lakhs is fair for what you get. The campus is maintained, green area is genuine, not a cramped layout. Build quality is average by Pune/Bangalore standards but above average for what Patna offers.

Connectivity to Patna city and the railway station is manageable — 20-25 minutes to the main areas. The metro Phase 1 corridor doesn't directly serve this area but the broader infrastructure investment is positive.

If you're working in Patna long-term, this is a reasonable entry into organized housing. Don't expect Pune-style appreciation.`,
      daysAgo: 54,
    },
    comments: [
      {
        userName: 'Asha Devi',
        content: `The RERA compliance point is critical. I've heard stories of buyers in Patna stuck with projects where the builder took money and construction stopped. Any project with active RERA registration and visible construction progress is inherently safer than 90% of what's available here.`,
        daysAfter: 5,
      },
      {
        userName: 'Sunil Kumar Singh',
        content: `@Asha — absolutely. The Patna buyer needs to be especially careful about title verification. Bihar land records have historical complications. Always get a lawyer to do a 30-year title search on the underlying land before booking anything here. Don't skip this step even if the project looks legitimate.`,
        daysAfter: 7,
      },
    ],
    ratings: [
      { userName: 'Sunil Kumar Singh', score: 3, review: 'Cleaner project than most in Patna. RERA compliance is the key differentiator. Moderate appreciation expected.' },
      { userName: 'Asha Devi',         score: 3, review: 'One of the better organized options in Patna. Due diligence on title is mandatory.' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KANPUR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    citySlug: 'kanpur',
    propertyName: 'Shri Ram Developers Shivam',
    propertyType: 'APARTMENT',
    address: 'Panki Power House Road, Kanpur 208020',
    description: 'Shri Ram Shivam is a mid-premium residential project in Panki, one of Kanpur\'s developing residential areas near the power hub. The project offers 2 BHK and 3 BHK apartments with modern amenities. Kanpur\'s real estate market has historically been driven by leather, textile, and defence-related professionals. The Kanpur Metro Phase 1 (IIT Kanpur to Naubasta) has brought renewed interest in the city\'s residential market. Panki connects to the Agra-Lucknow Expressway.',
    priceMin: 3200000,
    priceMax: 6500000,
    topic: {
      userName: 'Sunita Pandey',
      title: 'Kanpur property — is it worth buying now given the metro and expressway development?',
      content: `Kanpur has always been underrated in the UP real estate conversation — everyone talks about Lucknow and Noida but Kanpur rarely comes up. I think this is changing and here's why.

The Metro Phase 1 is operational on the IIT Kanpur to Naubasta stretch. This is Kanpur's first modern mass transit and it's changing the connectivity fundamentals of the city. IIT Kanpur is a significant employment hub — faculty, research staff, and contractors create substantial housing demand. The metro connecting them to the city is a genuine infrastructure upgrade.

The Agra-Lucknow Expressway passes through Kanpur's periphery — this gives excellent inter-city connectivity. The UP Expressway Industrial Authority is also promoting Kanpur as an industrial hub which could bring white-collar employment if the investment materializes.

Shri Ram Shivam specifically: it's a local builder but they've been doing projects in Kanpur for 15+ years. The specific project is in Panki which benefits from industrial employment (BPCL, NTPC plants nearby) and proximity to the Kanpur-Lucknow Highway.

Prices are extremely affordable by any comparison — 3200-3800 per sqft for a 2 BHK is lower than almost any city of similar size in India. The risk is Kanpur's historical under-performance as a market. But if the metro and industrial investment thesis plays out, the upside from current prices could be significant.

I'm a fence-sitter currently but leaning towards buying a 2 BHK for end use.`,
      daysAgo: 39,
    },
    comments: [
      {
        userName: 'Divya Tripathi',
        content: `Kanpur doesn't appreciate like Lucknow because the employment growth story is weaker. But for end-use, prices are genuinely attractive. If you're employed here or planning to be long-term, it makes complete sense to own rather than rent at these prices.`,
        daysAfter: 4,
      },
      {
        userName: 'Abhishek Srivastava',
        content: `IIT Kanpur generates good tenants — professors and research staff look for quality housing near the campus. If you're looking at investment for rental income specifically, target areas near the IIT campus rather than Panki. Rental demand from IIT community is consistent.`,
        daysAfter: 8,
      },
    ],
    ratings: [
      { userName: 'Sunita Pandey',       score: 3, review: 'Affordable, local builder with track record. Kanpur appreciation is slow but metro brings fresh hope.' },
      { userName: 'Abhishek Srivastava', score: 3, review: 'Good end-use option. Investment returns will be modest unless industrial employment picks up significantly.' },
    ],
  },

]

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🏙️  Seeding Tier 1 cities content...\n')

  // 1. Upsert users
  console.log('👤  Creating users...')
  const hash = await bcrypt.hash('Forum@2024!', 10)
  const userMap: Record<string, string> = {}

  for (const u of USERS_TIER1) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        passwordHash: hash,
        emailVerified: new Date(),
        role: 'USER',
      },
    })
    userMap[u.name] = user.id
    process.stdout.write('.')
  }
  console.log(`\n  ✓ ${USERS_TIER1.length} users ready\n`)

  let topicsCreated = 0
  let commentsCreated = 0
  let ratingsCreated = 0

  for (const prop of PROPERTIES) {
    // 2. Get city
    const city = await prisma.city.findUnique({ where: { slug: prop.citySlug } })
    if (!city) {
      console.warn(`  ⚠ City not found: ${prop.citySlug} — skipping`)
      continue
    }

    // 3. Generate unique slug
    const baseSlug = toSlug(prop.propertyName)
    let slug = baseSlug
    let suffix = 0
    while (true) {
      const existing = await prisma.topic.findUnique({ where: { cityId_slug: { cityId: city.id, slug } } })
      if (!existing) break
      suffix++
      slug = `${baseSlug}-${suffix}`
    }

    // 4. Get author
    const authorId = userMap[prop.topic.userName]
    if (!authorId) {
      console.warn(`  ⚠ User not found: ${prop.topic.userName}`)
      continue
    }

    // 5. Create topic
    const topicDate = randomDate(prop.topic.daysAgo, prop.topic.daysAgo - 1)
    const topic = await prisma.topic.create({
      data: {
        cityId: city.id,
        userId: authorId,
        title: prop.topic.title,
        slug,
        propertyName: prop.propertyName,
        propertyType: prop.propertyType as any,
        description: prop.description,
        address: prop.address,
        priceMin: prop.priceMin,
        priceMax: prop.priceMax,
        developerName: prop.developerName || null,
        developerSlug: prop.developerSlug || null,
        isPublished: true,
        createdAt: topicDate,
        updatedAt: topicDate,
      },
    })
    topicsCreated++

    // 6. Create comments
    for (const c of prop.comments) {
      const commentUserId = userMap[c.userName]
      if (!commentUserId) continue
      const commentDate = new Date(topicDate.getTime() + c.daysAfter * 86400000)
      await prisma.comment.create({
        data: {
          topicId: topic.id,
          userId: commentUserId,
          content: c.content,
          createdAt: commentDate,
          updatedAt: commentDate,
        },
      })
      commentsCreated++
    }

    // Update comment count
    await prisma.topic.update({
      where: { id: topic.id },
      data: { commentCount: prop.comments.length },
    })

    // 7. Create ratings
    const ratingUsersSeen = new Set<string>()
    let ratingSum = 0
    let ratingCount = 0

    for (const r of prop.ratings) {
      const ratingUserId = userMap[r.userName]
      if (!ratingUserId || ratingUsersSeen.has(ratingUserId)) continue
      ratingUsersSeen.add(ratingUserId)

      const ratingDate = randomDate(prop.topic.daysAgo - 1, 0)
      await prisma.rating.create({
        data: {
          topicId: topic.id,
          userId: ratingUserId,
          score: r.score,
          review: r.review,
          createdAt: ratingDate,
          updatedAt: ratingDate,
        },
      })
      ratingSum += r.score
      ratingCount++
      ratingsCreated++
    }

    // Update avg rating
    if (ratingCount > 0) {
      await prisma.topic.update({
        where: { id: topic.id },
        data: {
          avgRating: ratingSum / ratingCount,
          ratingCount,
        },
      })
    }

    // 8. Auto-subscribe topic author
    await prisma.topicSubscription.upsert({
      where: { topicId_userId: { topicId: topic.id, userId: authorId } },
      update: {},
      create: { topicId: topic.id, userId: authorId },
    })

    console.log(`  ✓ [${prop.citySlug}] ${prop.propertyName}`)
  }

  console.log(`
✅ Tier 1 seed complete!
   Topics   : ${topicsCreated}
   Comments : ${commentsCreated}
   Ratings  : ${ratingsCreated}
  `)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
