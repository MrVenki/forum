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

const USERS3 = [
  { name: 'Harish Gowda',           email: 'harish.gowda@gmail.com' },
  { name: 'Meera Balachandran',     email: 'meera.balachandran@gmail.com' },
  { name: 'Suresh Anand',           email: 'suresh.anand@gmail.com' },
  { name: 'Deepa Murthy',           email: 'deepa.murthy@gmail.com' },
  { name: 'Rahul Shetty',           email: 'rahul.shetty@gmail.com' },
  { name: 'Aparna Reddy',           email: 'aparna.reddy@gmail.com' },
  { name: 'Vinay Krishnamurthy',    email: 'vinay.krishnamurthy@gmail.com' },
  { name: 'Padma Venkataramaiah',   email: 'padma.venkataramaiah@gmail.com' },
  { name: 'Sathish Kumar',          email: 'sathish.kumar@gmail.com' },
  { name: 'Lata Shankar',           email: 'lata.shankar@gmail.com' },
  { name: 'Vikram Hegde',           email: 'vikram.hegde@gmail.com' },
  { name: 'Preeti Dasgupta',        email: 'preeti.dasgupta@gmail.com' },
  { name: 'Arjun Chandrasekhar',    email: 'arjun.chandrasekhar@gmail.com' },
  { name: 'Nisha Bhat',             email: 'nisha.bhat@gmail.com' },
  { name: 'Keshav Subramaniam',     email: 'keshav.subramaniam@gmail.com' },
  { name: 'Bhavana Rao',            email: 'bhavana.rao@gmail.com' },
  { name: 'Chetan Naik',            email: 'chetan.naik@gmail.com' },
  { name: 'Revathi Balakrishnan',   email: 'revathi.balakrishnan@gmail.com' },
  { name: 'Naveen Gowda',           email: 'naveen.gowda@gmail.com' },
  { name: 'Pradeep Shenoy',         email: 'pradeep.shenoy@gmail.com' },
  { name: 'Shalini Rao',            email: 'shalini.rao@gmail.com' },
  { name: 'Ranjit Nair',            email: 'ranjit.nair@gmail.com' },
  { name: 'Ananya Suresh',          email: 'ananya.suresh@gmail.com' },
  { name: 'Mohan Krishnaswamy',     email: 'mohan.krishnaswamy@gmail.com' },
  { name: 'Kavitha Ramaswamy',      email: 'kavitha.ramaswamy@gmail.com' },
  { name: 'Santosh Kumar',          email: 'santosh.kumar@gmail.com' },
  { name: 'Swapna Bhat',            email: 'swapna.bhat@gmail.com' },
  { name: 'Ramesh Murthy',          email: 'ramesh.murthy@gmail.com' },
  { name: 'Archana Shetty',         email: 'archana.shetty@gmail.com' },
  { name: 'Sumit Kaushik',          email: 'sumit.kaushik@gmail.com' },
]

interface RatingEntry { userName: string; score: number; review: string }
interface TopicEntry  { userName: string; title: string; content: string; daysAgo: number }
interface PropertyData {
  citySlug: string
  propertyName: string
  propertyType: string
  address: string
  description: string
  priceMin: number
  priceMax: number
  topic: TopicEntry
  ratings: RatingEntry[]
}


const PROPERTIES3: PropertyData[] = [
  {
    citySlug: 'bengaluru',
    propertyName: 'Birla Evara',
    propertyType: 'APARTMENT',
    address: 'Sarjapur Road, Bangalore 562125',
    description: 'Birla Evara is a large-scale township by Birla Estates on Sarjapur Road offering 1, 2, 3 and 4 BHK apartments across 70+ acres. RERA registered (PR/060225/007487), the project is designed around a 100,000 sq ft clubhouse, 55 acres of open space, and 3 km of internal jogging paths. Phase 1 possession expected in Q4 2027. Sarjapur Road proximity to Electronic City, Whitefield, and Outer Ring Road IT hubs makes this a strategic work-live address.',
    priceMin: 77_00_000,
    priceMax: 3_20_00_000,
    topic: { userName: 'Harish Gowda', title: 'Birla Evara Sarjapur Road - 70-acre township worth the wait until 2027?', content: 'Did a site visit last month and the scale of Birla Evara is genuinely impressive. The 70-acre campus has 55 acres of actual open space not just on paper. The model flat finishes were Birla standard - kitchen cabinetry, bathroom fittings, and flooring were all noticeably better than comparable projects. At 77L for a 1BHK on Sarjapur Road with RERA PR/060225/007487 and Birla track record, the risk is low. Clubhouse at 1 lakh sq ft is bigger than most full projects. Possession in 2027 is a wait but with this developer I am comfortable.', daysAgo: 30 },
    ratings: [
      { userName: 'Meera Balachandran', score: 5, review: 'Visited the site office last week. 55 acres of open space is genuine you can see the land. Birla quality assured.' },
      { userName: 'Suresh Anand',       score: 5, review: 'RERA registered and Birla Estates credibility. 77L entry for Sarjapur township is strong value.' },
      { userName: 'Deepa Murthy',       score: 4, review: '3 km internal jogging path and 100K sq ft clubhouse - amenities at this scale are rare in Bangalore.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Sobha Altair',
    propertyType: 'APARTMENT',
    address: 'Sarjapur Road, Bangalore 562125',
    description: 'Sobha Altair is an ultra-premium residential tower by Sobha Limited on Sarjapur Road offering 3 and 4 BHK apartments starting from 2900 sq ft. RERA registered PR/070126/008388. The project features signature Sobha in-house construction quality, triple-height entrance lobbies, and a residents-only sky deck on the 40th floor. Possession expected in Q1 2028. Sobhas self-reliant construction model ensures superior finish consistency.',
    priceMin: 2_96_00_000,
    priceMax: 4_20_00_000,
    topic: { userName: 'Rahul Shetty', title: 'Sobha Altair Sarjapur - is 3Cr justified for their sky deck towers?', content: 'Sobha Altair is priced at 3Cr+ and the question is whether it justifies itself. Having visited three other Sobha projects before this, the finish quality is consistently superior. The sample unit at Altair had the same attention to detail - bathroom tiling perfectly aligned, kitchen countertop granite without visible seams, wooden flooring without gaps. The sky deck on the 40th floor is genuinely spectacular with views towards Sarjapur lake. RERA PR/070126/008388 is filed and Sobha has never defaulted on possession.', daysAgo: 45 },
    ratings: [
      { userName: 'Aparna Reddy',        score: 5, review: 'Sobhas in-house construction means the finish you see in the sample is what you get. Rare assurance.' },
      { userName: 'Vinay Krishnamurthy', score: 5, review: 'Sky deck on 40th floor - visited at dusk and the view was something else. Worth every rupee.' },
      { userName: 'Padma Venkataramaiah',score: 4, review: '3BHK at 3Cr from Sobha on Sarjapur Road. Premium but backed by their unmatched quality track record.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Adarsh Welkin Park',
    propertyType: 'VILLA',
    address: 'Sarjapur Road, Bangalore 562125',
    description: 'Adarsh Welkin Park is a gated villa community by Adarsh Developers on Sarjapur Road offering 4 and 5 BHK independent villas with private gardens and swimming pools. RERA registered PR/020923/006224. The 35-acre project features 160 premium villas with Italian marble flooring, a dedicated club with spa, and 24x7 concierge services. Possession commenced for early buyers; remaining inventory expected to be handed over by Q2 2026.',
    priceMin: 3_50_00_000,
    priceMax: 8_50_00_000,
    topic: { userName: 'Sathish Kumar', title: 'Adarsh Welkin Park Sarjapur - independent villa with private pool at this price?', content: 'Welkin Park is one of very few projects in Bangalore where you get a genuine independent villa with your own private pool within a gated community. Visited the show villa - Italian marble throughout, the private garden is 800 sq ft and feels like your own slice of property. Adarsh Developers RERA PR/020923/006224 have been building in Bangalore for 30+ years and Welkin Park shows their maturity. At 3.5Cr for a 4BHK villa with private pool on Sarjapur it is extraordinary. First possession batches have already happened.', daysAgo: 25 },
    ratings: [
      { userName: 'Lata Shankar',    score: 5, review: 'Private pool in your own garden inside a gated community - at 3.5Cr this is not available anywhere else in Bangalore.' },
      { userName: 'Vikram Hegde',    score: 5, review: 'Adarsh 30-year track record and RERA compliance. Villa community with true independent character.' },
      { userName: 'Preeti Dasgupta', score: 4, review: 'Italian marble, private garden, spa club. This is true villa living not a ground-floor flat called villa.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Kolte-Patil Lakeside 24',
    propertyType: 'APARTMENT',
    address: 'Hennur Road, Bangalore 560043',
    description: 'Kolte-Patil Lakeside 24 is a lake-facing residential project by Kolte-Patil Developers on Hennur Road offering 2 and 3 BHK apartments. RERA registered PR/060324/006667. The project is built around direct lake frontage with lake-view decks accessible to all residents. Hennur Roads infrastructure development including flyovers has significantly improved connectivity to Manyata Tech Park and Hebbal. Possession expected by Q3 2027.',
    priceMin: 1_10_00_000,
    priceMax: 3_20_00_000,
    topic: { userName: 'Arjun Chandrasekhar', title: 'Kolte-Patil Lakeside 24 Hennur - genuine lake frontage or just a marketing claim?', content: 'I was skeptical about lake view claims from developers but visited Lakeside 24 to check for myself. The lake is actually there and is well-maintained. The lake-view deck on the 5th floor has a direct sightline to the water not obscured by buildings or walls. Kolte-Patil RERA PR/060324/006667 has solid delivery credentials in Pune and is building this reputation in Bangalore. Hennur Road flyovers have genuinely improved the commute to Manyata Tech Park. 2BHK at 1.1Cr for lake-facing in this area is competitive.', daysAgo: 20 },
    ratings: [
      { userName: 'Nisha Bhat',          score: 5, review: 'Lake frontage is genuine - walked the site and the water is right there. No marketing exaggeration.' },
      { userName: 'Keshav Subramaniam',  score: 4, review: 'Hennur Road connectivity has improved a lot. Manyata Tech Park commute is manageable now.' },
      { userName: 'Bhavana Rao',         score: 4, review: 'Kolte-Patil RERA filed and delivery track record is clean. 1.1Cr lake-facing is good value.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Total Environment In That Quiet Earth',
    propertyType: 'APARTMENT',
    address: 'Hennur Road, Bangalore 560077',
    description: 'Total Environment In That Quiet Earth is a unique forest-themed luxury residential project on Hennur Road offering 3 and 4 BHK apartments with cascading green terraces and 40% tree canopy coverage. RERA registered PR/310125/007467. The project features Total Environments signature biophilic architecture with trees growing through balconies and living walls in every apartment. Possession expected in Q4 2027. Total Environment has delivered six projects without a single delay in Bangalore.',
    priceMin: 1_95_00_000,
    priceMax: 5_75_00_000,
    topic: { userName: 'Chetan Naik', title: 'Total Environment Quiet Earth Hennur - living with trees growing through your flat?', content: 'Total Environment projects are unlike anything else in Indian real estate and Quiet Earth is their most ambitious yet. The concept of trees literally growing through balconies and living walls in every flat sounds like a brochure gimmick but I visited their delivered project Windmills of Your Mind nearby and it is exactly as described. The air quality and temperature inside the campus is measurably different - the tree canopy genuinely cools the microclimate. At 2Cr for a 3BHK with this level of biophilic integration on Hennur Road, RERA PR/310125/007467 is filed and Total Environment has never delayed.', daysAgo: 35 },
    ratings: [
      { userName: 'Revathi Balakrishnan', score: 5, review: 'Visited their Windmills project first - trees through balconies is real. Quiet Earth will be even better.' },
      { userName: 'Naveen Gowda',         score: 5, review: '40% tree canopy means the campus is noticeably cooler. Biophilic living is not a marketing phrase here.' },
      { userName: 'Pradeep Shenoy',       score: 4, review: 'Six delivered projects with zero delays. Total Environment credibility is Bangalores best. Worth the premium.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Sobha Victoria Park',
    propertyType: 'APARTMENT',
    address: 'Thanisandra Road, Bangalore 560077',
    description: 'Sobha Victoria Park is a premium residential project by Sobha Limited on Thanisandra Road near Manyata Tech Park, offering 2 and 3 BHK apartments with British colonial-inspired architecture and landscaping. RERA registered PR/310322/004800. The project features 80% open space, a 20,000 sq ft clubhouse with indoor cricket, and walkable access to Manyata Tech Park campus. Handover of remaining units ongoing with major possession completed.',
    priceMin: 1_27_00_000,
    priceMax: 3_85_00_000,
    topic: { userName: 'Shalini Rao', title: 'Sobha Victoria Park Thanisandra - walk to Manyata Tech Park a reality?', content: 'Victoria Park was my first choice because of the Manyata Tech Park walking distance - I work there and the commute math was simple. After booking and moving in as a resident, I can confirm: the walk to Manyata Gate 1 is 12 minutes. The campus itself is beautiful - the colonial architecture is distinctive and the 80% open space claim is accurate. The 20,000 sq ft clubhouse has an indoor cricket pitch which is unexpected and very popular with residents. Sobhas construction quality is industry-leading. RERA PR/310322/004800 is clean.', daysAgo: 15 },
    ratings: [
      { userName: 'Ranjit Nair',    score: 5, review: '12 minutes walk to Manyata Gate 1 confirmed by a resident. No better commute in North Bangalore.' },
      { userName: 'Ananya Suresh',  score: 5, review: 'Indoor cricket pitch in the clubhouse - my kids love it. Sobha quality makes every corner special.' },
      { userName: 'Santosh Kumar',  score: 4, review: '80% open space is genuine - the campus feels airy and green. Colonial architecture is unique in Bangalore.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Birla Tisya',
    propertyType: 'APARTMENT',
    address: 'Rajajinagar, Bangalore 560010',
    description: 'Birla Tisya is a luxury residential project by Birla Estates in Rajajinagar, one of Bangalores most established west-side localities, offering 3 and 4 BHK apartments. RERA registered PR/211022/004371. The project features a 50,000 sq ft clubhouse with rooftop pool, sky garden on the 30th floor, and walkable access to Rajajinagar Metro Station. Possession expected December 2026.',
    priceMin: 1_17_00_000,
    priceMax: 2_59_00_000,
    topic: { userName: 'Mohan Krishnaswamy', title: 'Birla Tisya Rajajinagar - luxury west Bangalore with metro at your doorstep?', content: 'Rajajinagar is an established locality and Birla Tisya is the most premium project this area has seen. The sample flat was exceptional - 3BHK at 1800 sq ft with 9-foot ceilings felt genuinely spacious. The rooftop pool and sky garden on the 30th floor are the highlights. Walking distance to Rajajinagar Metro is a real advantage - the purple line metro here is well-connected. At 1.17Cr for a 2BHK from Birla Estates in established Rajajinagar, RERA filed, possession December 2026 - this is a compelling buy.', daysAgo: 55 },
    ratings: [
      { userName: 'Kavitha Ramaswamy',  score: 5, review: 'Rajajinagar Metro walkable - purple line is well-connected and removes Bangalore traffic stress completely.' },
      { userName: 'Swapna Bhat',        score: 4, review: 'Established locality plus Birla quality. This combination is rare - usually luxury goes to greenfield areas.' },
      { userName: 'Ramesh Murthy',      score: 4, review: 'Rooftop pool with 30th floor sky garden. Birla Tisya is the most aspirational address in west Bangalore.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Birla Ojasvi',
    propertyType: 'APARTMENT',
    address: 'Rajarajeshwari Nagar, Bangalore 560098',
    description: 'Birla Ojasvi is a premium residential project by Birla Estates in RR Nagar offering 1, 2, 3, and 4 BHK apartments. RERA registered PR/040924/006989. The project sits adjacent to the Kengeri Metro Station and features a 45,000 sq ft clubhouse with rooftop infinity pool and sky garden. Analysts have noted 27% price appreciation since launch. Possession expected Q2 2027.',
    priceMin: 68_00_000,
    priceMax: 3_00_00_000,
    topic: { userName: 'Harish Gowda', title: 'Birla Ojasvi RR Nagar - 27% appreciation since launch, still worth buying now?', content: 'Birla Ojasvi has seen 27% price appreciation since launch and the question is whether the remaining upside justifies buying at current prices. I think yes - RR Nagar is genuinely transforming with metro and the Kengeri Station adjacency is a real long-term advantage. The 1BHK at 68L from Birla Estates with RERA PR/040924/006989 in an area undergoing this kind of infrastructure upgrade is still a compelling buy. The 45K sq ft clubhouse and rooftop pool are full luxury amenities at a price point that starts at 68L. End-user demand is strong because metro makes the area practical for IT workers.', daysAgo: 40 },
    ratings: [
      { userName: 'Meera Balachandran', score: 5, review: '27% appreciation in under a year tells the story. Metro plus Birla quality in RR Nagar is the right combination.' },
      { userName: 'Deepa Murthy',       score: 4, review: 'Kengeri Metro adjacency will only get more valuable as ridership grows. Birla Ojasvi is a smart long-term hold.' },
      { userName: 'Rahul Shetty',       score: 4, review: '68L entry for Birla Estates with rooftop pool in metro-connected RR Nagar. Best value in west Bangalore.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Purva Park Hill',
    propertyType: 'APARTMENT',
    address: 'Kanakapura Road, Bangalore 560062',
    description: 'Purva Park Hill is a nature-inspired luxury residential project by Puravankara on Kanakapura Road near JP Nagar, offering 3 BHK apartments with direct views of the Turahalli State Forest. The project features tri-deck balconies, a 1-acre rooftop forest garden, and 6 km of forest-edge walking paths. Turahalli is a state forest reserve so forest views cannot be blocked by future construction. Possession expected Q4 2026.',
    priceMin: 2_15_00_000,
    priceMax: 2_30_00_000,
    topic: { userName: 'Aparna Reddy', title: 'Purva Park Hill Kanakapura Road - Turahalli Forest views that cannot be blocked?', content: 'Purva Park Hill is designed around one thing: the Turahalli State Forest on its boundary. I visited specifically to verify whether the forest view can be blocked by future construction. The answer is no - Turahalli is a state forest reserve and construction within it is not permitted. The forest views from the upper floors are permanent. The tri-deck balconies on the 3BHK sample unit gave a layered view of the forest canopy in the morning light - genuinely beautiful. The 1-acre rooftop forest garden and 6-km walking paths along the forest edge make this the most nature-integrated project in south Bangalore.', daysAgo: 28 },
    ratings: [
      { userName: 'Vinay Krishnamurthy',  score: 5, review: 'State forest reserve means views are permanently protected. No other project in Bangalore can guarantee this.' },
      { userName: 'Padma Venkataramaiah', score: 5, review: 'Tri-deck balconies with forest view at dawn - the experience is transformative. Worth every rupee of the premium.' },
      { userName: 'Sathish Kumar',        score: 4, review: '6-km forest-edge walking path is already maintained. Puravankara delivery track record in Bangalore is solid.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Century Mirai',
    propertyType: 'APARTMENT',
    address: 'Marathahalli, Outer Ring Road, Bangalore 560037',
    description: 'Century Mirai is an exclusive boutique luxury tower by Century Real Estate on Marathahallis Outer Ring Road offering only 475 premium 3 and 4 BHK residences. RERA registered PR/181025/008182. The 50-storey tower features floor-to-ceiling glass facades, a private sky lounge on the 45th floor, and ORR IT corridor views. The limited-inventory format means no overcrowding and genuine exclusivity. Possession expected Q2 2028.',
    priceMin: 2_17_00_000,
    priceMax: 6_04_00_000,
    topic: { userName: 'Lata Shankar', title: 'Century Mirai Marathahalli ORR - only 475 homes in a 50-storey tower, worth it?', content: 'Century Mirai is intentionally limited to 475 homes in a 50-storey tower - so each floor has very few units and common areas are genuinely uncrowded. I have seen large township projects where the amenities are always full and the elevators always busy. Mirai boutique model avoids that completely. RERA PR/181025/008182 is filed and Century Real Estate has delivered well in Bangalore. The ORR IT corridor views from the 45th floor sky lounge are spectacular - you can see from Bellandur lake to Manyata Tech Park on a clear day.', daysAgo: 22 },
    ratings: [
      { userName: 'Vikram Hegde',        score: 5, review: '475 homes only in a 50-storey tower means genuine exclusivity - amenities never crowded. Premium that makes sense.' },
      { userName: 'Preeti Dasgupta',     score: 5, review: 'ORR IT corridor views from the sky lounge are worth the premium alone. Century Mirai is a landmark project.' },
      { userName: 'Arjun Chandrasekhar', score: 4, review: 'Century Real Estate delivery track record in Bangalore is clean. RERA filed. Boutique format is the differentiator.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Assetz Sora and Saki',
    propertyType: 'APARTMENT',
    address: 'Bagalur, Aerospace Park, Bangalore 562149',
    description: 'Assetz Sora and Saki is a twin-tower residential project by Assetz Property Group in Bagalurs Aerospace Park SEZ, offering 2 and 3 BHK apartments. RERA registered PR/060324/006692. The project is designed around 75% open space with a central nature trail, sky garden, and observation deck. The Aerospace Park SEZ hosts Boeing, Honeywell, and HAL, making this a walk-to-work address for aerospace and defence sector professionals. Possession expected Q4 2026.',
    priceMin: 1_59_00_000,
    priceMax: 2_14_00_000,
    topic: { userName: 'Nisha Bhat', title: 'Assetz Sora and Saki Bagalur - Aerospace Park walk-to-work, is the location ready?', content: 'I work at Boeing Bagalur campus and Assetz Sora and Saki is my shortlist top choice specifically because of the walk-to-work advantage. The Aerospace Park SEZ is already operational with Boeing, Honeywell, HAL, and several other large aerospace companies. Infrastructure in Bagalur has improved significantly - roads, power supply, and water are all in place. Assetz RERA PR/060324/006692 has delivered three Bangalore projects on time. The 75% open space with central nature trail is visible on-site not a marketing claim.', daysAgo: 35 },
    ratings: [
      { userName: 'Keshav Subramaniam', score: 5, review: 'Boeing, Honeywell, HAL all in Aerospace Park - if you work there, Sora and Saki is the obvious home choice.' },
      { userName: 'Bhavana Rao',        score: 4, review: 'Assetz delivery record is clean in Bangalore. RERA filed. 75% open space confirmed on site visit.' },
      { userName: 'Chetan Naik',        score: 4, review: 'Bagalur infrastructure has matured fast. Location criticism from two years ago is no longer valid.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Godrej Ananda',
    propertyType: 'APARTMENT',
    address: 'Bagalur, Bangalore 562149',
    description: 'Godrej Ananda is a large residential development by Godrej Properties in Bagalur near the Aerospace Park, offering 1, 2, and 3 BHK apartments across multiple phases. Phase 3 commenced handover in January 2026. The project features Godrej signature green building standards with rooftop solar, rainwater harvesting, and 60% open space. Proximity to KIADB Aerospace Park, Devanahalli town, and the upcoming Namma Metro extension makes this a well-positioned long-term investment.',
    priceMin: 75_00_000,
    priceMax: 1_28_00_000,
    topic: { userName: 'Revathi Balakrishnan', title: 'Godrej Ananda Bagalur - Phase 3 handing over, is north Bangalore finally ready?', content: 'Godrej Ananda Phase 3 started handing over in January 2026 and I collected my keys last month. The construction quality is Godrej standard - which means above average for this price range. Rooftop solar panels, rainwater harvesting, and the green building certification are all operational. The area around Bagalur has developed significantly - Phase 1 buyers who complained about lack of social infrastructure no longer have that problem. Schools, supermarkets, and a hospital are now within 3 km. At 75L for a 1BHK from Godrej in a delivered community, the risk is essentially zero.', daysAgo: 18 },
    ratings: [
      { userName: 'Naveen Gowda',   score: 4, review: 'Phase 3 resident here - possession was on time and construction quality is solid Godrej standard.' },
      { userName: 'Pradeep Shenoy', score: 4, review: 'Social infrastructure around Bagalur has improved a lot since Phase 1. Good time to be a buyer here.' },
      { userName: 'Shalini Rao',    score: 3, review: '75L from Godrej is very accessible pricing. Rooftop solar is operational and reduces electricity bills noticeably.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Prestige Finsbury Park',
    propertyType: 'APARTMENT',
    address: 'Bagalur, Aerospace Park, Bangalore 562149',
    description: 'Prestige Finsbury Park is an affordable residential township by Prestige Group in Bagalurs Aerospace Park, offering 1 and 2 BHK apartments starting from 35 lakhs. It is widely considered the most affordable Prestige project in Bengaluru, making the brand accessible to first-time buyers and young professionals. The 70-acre township features a 60,000 sq ft clubhouse, cycling track, and multiple sports facilities. Phased possession from Q2 2026 onwards.',
    priceMin: 35_00_000,
    priceMax: 1_10_00_000,
    topic: { userName: 'Ranjit Nair', title: 'Prestige Finsbury Park Bagalur - cheapest Prestige in Bangalore, is quality compromised?', content: 'Prestige Finsbury Park at 35L starting is a genuinely unusual proposition - Prestige Group quality at budget pricing. I was skeptical and visited specifically to check whether they have cut corners. The construction quality is the same Prestige standard I saw at their Whitefield project - no visible compromise. The 70-acre campus scale means the clubhouse and amenities feel substantial even at this price. The affordability comes from the Bagalur location, not from reducing quality. For a first-time buyer who wants Prestige brand assurance without the 1Cr+ outlay, Finsbury Park is exceptional value.', daysAgo: 42 },
    ratings: [
      { userName: 'Ananya Suresh',      score: 5, review: 'Prestige quality at 35L - inspected the construction and there is no compromise. This is Prestige standard throughout.' },
      { userName: 'Mohan Krishnaswamy', score: 5, review: 'Most affordable Prestige in Bangalore. First-time buyers who want brand assurance have no better option.' },
      { userName: 'Kavitha Ramaswamy',  score: 4, review: '70-acre campus with 60K sq ft clubhouse at budget pricing. Bagalur location is improving rapidly.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Prestige Gardenia Estates',
    propertyType: 'PLOT',
    address: 'Devanahalli, Bangalore 562110',
    description: 'Prestige Gardenia Estates is a premium plotted development by Prestige Group in Devanahalli, offering 516 villa plots ranging from 1200 to 4500 sq ft. RERA registered PR/200525/007761. The gated community features boulevard roads, underground utilities, a community centre, and landscaped parks. Located 5 km from Kempegowda International Airport and adjacent to the ITIR zone, plots here are among the highest-demand residential land parcels in north Bangalore.',
    priceMin: 90_00_000,
    priceMax: 3_20_00_000,
    topic: { userName: 'Swapna Bhat', title: 'Prestige Gardenia Estates Devanahalli - 516 plots near airport, genuine investment or hype?', content: 'Prestige entering the plotted development segment in Devanahalli is significant. 516 plots with RERA PR/200525/007761 from a group that has never failed on a project - this is credibility that smaller plotted developers cannot match. I attended the pre-launch event and the site plan is impressive: boulevard roads at 40 feet wide, underground utilities so no overhead wires, and the plots are properly demarcated with GPS coordinates in the sale agreement. 5 km from the airport and adjacent to ITIR zone means future commercial development will further push values.', daysAgo: 12 },
    ratings: [
      { userName: 'Ramesh Murthy',  score: 5, review: 'Prestige in plotted development - unmatched credibility. RERA filed and site demarcation is GPS-precise.' },
      { userName: 'Archana Shetty', score: 5, review: '5 km from airport and ITIR zone adjacency. Long-term appreciation from Devanahalli plots is well documented.' },
      { userName: 'Sumit Kaushik',  score: 4, review: 'Boulevard roads and underground utilities in a plotted community are rare. Prestige doing this right.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Brigade Eternia',
    propertyType: 'APARTMENT',
    address: 'Yelahanka, NH44, Bangalore 560064',
    description: 'Brigade Eternia is a premium residential project by Brigade Group on NH44 near Yelahanka, offering 3 and 4 BHK apartments in twin high-rise towers. RERA registered PR/070325/007559. The project features a 60,000 sq ft Brigade signature clubhouse, rooftop terrace garden, and direct NH44 highway connectivity to the airport in 25 minutes. Yelahankas established social infrastructure including schools, hospitals, and retail makes it one of north Bangalores most liveable addresses. Possession expected Q1 2028.',
    priceMin: 2_21_00_000,
    priceMax: 4_46_00_000,
    topic: { userName: 'Harish Gowda', title: 'Brigade Eternia Yelahanka NH44 - north Bangalore premium with 25-minute airport drive?', content: 'Brigade Eternia on NH44 has two strong arguments: Brigade Group reliability and airport proximity. I drive to the airport frequently for work and the NH44 from Yelahanka is genuinely 25 minutes to Kempegowda Terminal. The sample unit at Eternia had Brigade signature finish quality - the tiling, woodwork, and electrical fittings were all premium grade. Yelahanka is an established locality with good schools, hospital, and retail within 2 km. RERA PR/070325/007559 is fresh and Brigade has never missed a major possession. 3BHK at 2.21Cr for this location and builder is competitive.', daysAgo: 30 },
    ratings: [
      { userName: 'Meera Balachandran', score: 5, review: '25-minute airport drive from Yelahanka NH44 is real - I drove it. Brigade quality is consistent across all their projects.' },
      { userName: 'Suresh Anand',       score: 4, review: 'Established Yelahanka social infrastructure is the hidden advantage. Schools and hospitals already there.' },
      { userName: 'Deepa Murthy',       score: 4, review: 'Brigade Eternia RERA filed fresh and 60K sq ft clubhouse is their signature standard. Strong buy in north Bangalore.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Sattva Lumina',
    propertyType: 'APARTMENT',
    address: 'Yelahanka, Doddaballapur Road, Bangalore 560064',
    description: 'Sattva Lumina is a high-rise residential project by Sattva Group on Doddaballapur Road in Yelahanka, offering 1 and 2 BHK apartments in G+29 towers. The project targets working professionals in the Aerospace Park and Manyata Tech Park corridors with well-designed compact homes and a 30,000 sq ft clubhouse. Located near the proposed Namma Metro Phase 3 alignment, Lumina is positioned to benefit from metro connectivity. Possession expected Q3 2027.',
    priceMin: 62_00_000,
    priceMax: 1_23_00_000,
    topic: { userName: 'Rahul Shetty', title: 'Sattva Lumina Yelahanka - G+29 high-rise at 62L entry, what is the catch?', content: 'Sattva Lumina at 62L entry for a G+29 tower in Yelahanka seems too good and I investigated whether there is a catch. Having visited the site and reviewed the documentation, I do not see one. Sattva Group has delivered consistently in Bangalore across multiple projects. The Doddaballapur Road location is adjacent to the Metro Phase 3 alignment which when delivered will transform connectivity. The 1BHK compact units are genuinely well-designed not cramped. At 62L for a high-rise from Sattva in Yelahanka with metro upside and Q3 2027 possession, this is one of north Bangalores best value propositions right now.', daysAgo: 50 },
    ratings: [
      { userName: 'Aparna Reddy',        score: 4, review: 'Sattva Group delivery record is clean. G+29 high-rise at 62L with Metro Phase 3 upside is excellent value.' },
      { userName: 'Vinay Krishnamurthy', score: 4, review: '1BHK units are compact but intelligently laid out. Sattva gets space utilisation right.' },
      { userName: 'Padma Venkataramaiah',score: 3, review: 'Location is a developing area but metro alignment is confirmed. Medium-term hold will pay off well.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Lodha Mirabelle',
    propertyType: 'APARTMENT',
    address: 'Nagavara, Manyata Tech Park, Bangalore 560045',
    description: 'Lodha Mirabelle is an ultra-luxury residential project by Lodha Group situated within the Manyata Tech Park campus in Nagavara, offering 3 and 4 BHK apartments. The project provides residents with direct gated access to Manyata Tech Parks retail and office campuses while living in a separate residential enclave designed to Lodha World One standards. Features include a residents-only private park, concierge services, and a sky pool on the 35th floor. Possession expected Q3 2027.',
    priceMin: 2_99_00_000,
    priceMax: 3_49_00_000,
    topic: { userName: 'Sathish Kumar', title: 'Lodha Mirabelle Manyata - living inside a tech park campus, is the concept practical?', content: 'Lodha Mirabelle is a novel concept - luxury living inside Manyata Tech Park campus. The question is whether it is practical or a gimmick. Having visited the site, I believe it works. The residential enclave is physically separate from the office campus with its own entrance, security, and amenity zone. But you have direct gated access to Manyata restaurants, retail, and even the office buildings if you work there. For professionals working at Manyata, the zero-commute proposition is genuinely transformative. Lodha quality benchmark is World One Mumbai level and Mirabelle does not compromise.', daysAgo: 38 },
    ratings: [
      { userName: 'Lata Shankar',    score: 5, review: 'Living inside Manyata campus is genuinely practical - restaurants, retail, office all within the gated boundary.' },
      { userName: 'Vikram Hegde',    score: 5, review: 'Lodha World One quality standards in Bangalore. Sky pool on 35th floor with Manyata views is outstanding.' },
      { userName: 'Preeti Dasgupta', score: 4, review: 'Zero commute for Manyata employees - this is the most practical luxury buy in north Bangalore for tech professionals.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Casagrand Vivacity',
    propertyType: 'APARTMENT',
    address: 'Electronic City Phase 2, Bangalore 560100',
    description: 'Casagrand Vivacity is a residential project by Casagrand Builder in Electronic City Phase 2, offering 2 and 3 BHK apartments. RERA registered PR/220424/006830. The project features a 25,000 sq ft clubhouse, rooftop sky walk, and direct access to the elevated Namma Metro Green Line serving the Electronic City corridor. Infosys, Wipro, TCS, and HCL campuses are within 3 km. Casagrand has delivered 80+ projects across South India. Possession expected Q2 2027.',
    priceMin: 75_00_000,
    priceMax: 3_03_00_000,
    topic: { userName: 'Arjun Chandrasekhar', title: 'Casagrand Vivacity Electronic City Phase 2 - metro-connected with Infosys next door?', content: 'Electronic City Phase 2 with metro access is a very different proposition from what it was three years ago. Casagrand Vivacity sits right on the elevated metro line and the commute to central Bangalore has become practical. I work at Infosys campus which is about 2.5 km away - a short auto ride. Casagrand has delivered 80+ projects and their quality is consistent at this price range. RERA PR/220424/006830 is filed. 2BHK at 75L in Electronic City Phase 2 with metro access - the rental yield here is strong because demand from Infosys and Wipro employees is constant.', daysAgo: 28 },
    ratings: [
      { userName: 'Nisha Bhat',         score: 4, review: 'Metro Green Line access has transformed Electronic City commute. Casagrand quality is solid for the price point.' },
      { userName: 'Keshav Subramaniam', score: 4, review: 'Infosys and Wipro proximity drives strong rental demand. RERA filed. Good investment-grade property.' },
      { userName: 'Bhavana Rao',        score: 4, review: 'Casagrand 80+ delivered projects means proven execution. Vivacity rooftop sky walk is a unique feature.' },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Shriram Codename The One',
    propertyType: 'APARTMENT',
    address: 'Chandapura, Hosur Road, Bangalore 560099',
    description: 'Shriram Codename The One is a landmark residential tower by Shriram Properties on Hosur Road near Chandapura, offering 2 and 3 BHK apartments. RERA registered PR/120625/007819. The project features Shriram premium Codename series design with double-height lobbies, a 40,000 sq ft clubhouse with indoor tennis, and views of the Chandapura forest reserve. Electronic City, Bommasandra KIADB, and Hosur Industrial Corridor are within 10 km. Possession expected Q3 2028.',
    priceMin: 1_02_00_000,
    priceMax: 1_60_00_000,
    topic: { userName: 'Chetan Naik', title: 'Shriram Codename The One Chandapura Hosur Road - worth the longer commute for the price?', content: 'Shriram Codename The One is positioned at 1Cr for a 2BHK which undercuts most Bangalore luxury projects significantly. The Chandapura location is on Hosur Road which has a longer Bangalore central commute but the project is specifically positioned for Electronic City and Hosur industrial corridor professionals. I work at a manufacturing firm in Bommasandra KIADB and Chandapura is actually very convenient. Shriram Properties RERA PR/120625/007819 has an excellent delivery track record. The Codename series is their premium offering - the double-height lobby in the sample unit was genuinely impressive.', daysAgo: 20 },
    ratings: [
      { userName: 'Revathi Balakrishnan', score: 4, review: 'Shriram Codename series quality at 1Cr - for Electronic City and Bommasandra workers this is the best priced luxury.' },
      { userName: 'Naveen Gowda',         score: 4, review: 'RERA PR/120625/007819 fresh and Shriram delivery record is clean. Chandapura forest views are a bonus.' },
      { userName: 'Pradeep Shenoy',       score: 3, review: 'Commute to central Bangalore is longer but for Hosur Road professionals it is very practical. Good value for the target buyer.' },
    ],
  },
]

async function main() {
  console.log('Seeding content batch 3 - Bangalore properties...\n')

  const hash = await bcrypt.hash('Password@123', 10)
  const users: Record<string, string> = {}

  for (const u of USERS3) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, role: 'USER' },
    })
    users[u.name] = created.id
    process.stdout.write('  user: ' + u.name + '\n')
  }

  const cities = await prisma.city.findMany()
  const cityMap: Record<string, string> = Object.fromEntries(cities.map((c) => [c.slug, c.id]))
  console.log('\nCities found: ' + cities.map((c) => c.name).join(', ') + '\n')

  let topics = 0, comments = 0, ratings = 0

  for (const p of PROPERTIES3) {
    const cityId = cityMap[p.citySlug]
    if (!cityId) { console.warn('City not found: ' + p.citySlug); continue }

    const userId = users[p.topic.userName]
    if (!userId) { console.warn('User not found: ' + p.topic.userName); continue }

    const topicSlug = toSlug(p.propertyName)
    const createdAt = randomDate(p.topic.daysAgo + 5, p.topic.daysAgo - 2)

    const topic = await prisma.topic.upsert({
      where: { cityId_slug: { cityId, slug: topicSlug } },
      update: {},
      create: {
        cityId,
        userId,
        title: p.topic.title,
        slug: topicSlug,
        propertyName: p.propertyName,
        propertyType: p.propertyType as any,
        description: p.description,
        address: p.address,
        priceMin: p.priceMin,
        priceMax: p.priceMax,
        isPublished: true,
        viewCount: Math.floor(Math.random() * 900) + 100,
        createdAt,
        updatedAt: createdAt,
        metaTitle: p.propertyName + ' Review - ' + (cities.find((c) => c.id === cityId)?.name ?? ''),
        metaDesc: p.description.slice(0, 155),
      },
    })
    topics++

    const commentAt = new Date(createdAt.getTime() + Math.random() * 86400000 * 2)
    const existingComment = await prisma.comment.findFirst({ where: { topicId: topic.id, userId } })
    if (!existingComment) {
      await prisma.comment.create({
        data: { topicId: topic.id, userId, content: p.topic.content, createdAt: commentAt, updatedAt: commentAt },
      })
      comments++
    }

    for (const r of p.ratings) {
      const raterId = users[r.userName]
      if (!raterId) continue
      const existing = await prisma.rating.findUnique({ where: { topicId_userId: { topicId: topic.id, userId: raterId } } })
      if (!existing) {
        await prisma.rating.create({ data: { topicId: topic.id, userId: raterId, score: r.score, review: r.review } })
        ratings++
      }
    }

    const allRatings = await prisma.rating.findMany({ where: { topicId: topic.id } })
    const allComments = await prisma.comment.count({ where: { topicId: topic.id } })
    const avg = allRatings.length ? allRatings.reduce((s, r) => s + r.score, 0) / allRatings.length : 0

    await prisma.topic.update({
      where: { id: topic.id },
      data: { avgRating: Math.round(avg * 100) / 100, ratingCount: allRatings.length, commentCount: allComments },
    })

    console.log('  [bangalore] ' + p.propertyName + ' - avg ' + avg.toFixed(1) + ' (' + allRatings.length + ' ratings)')
  }

  console.log('\nDone. Topics: ' + topics + ' | Comments: ' + comments + ' | Ratings: ' + ratings)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())

