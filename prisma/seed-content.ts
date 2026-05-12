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

const USERS = [
  { name: 'Rahul Sharma',    email: 'rahul.sharma@gmail.com' },
  { name: 'Priya Iyer',      email: 'priya.iyer@gmail.com' },
  { name: 'Vikram Mehta',    email: 'vikram.mehta@gmail.com' },
  { name: 'Ananya Krishnan', email: 'ananya.krishnan@gmail.com' },
  { name: 'Suresh Nair',     email: 'suresh.nair@gmail.com' },
  { name: 'Deepika Rajput',  email: 'deepika.rajput@gmail.com' },
  { name: 'Amit Gupta',      email: 'amit.gupta@gmail.com' },
  { name: 'Kavya Reddy',     email: 'kavya.reddy@gmail.com' },
  { name: 'Rohan Joshi',     email: 'rohan.joshi@gmail.com' },
  { name: 'Meera Pillai',    email: 'meera.pillai@gmail.com' },
  { name: 'Arjun Singh',     email: 'arjun.singh@gmail.com' },
  { name: 'Neha Agarwal',    email: 'neha.agarwal@gmail.com' },
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

const PROPERTIES: PropertyData[] = [
  // ── MUMBAI ───────────────────────────────────────────────────────────────
  {
    citySlug: 'mumbai',
    propertyName: 'Lodha Malabar',
    propertyType: 'PENTHOUSE',
    address: 'Malabar Hill, Mumbai 400006',
    description: `Lodha Malabar is a rare ultra-luxury residential tower on the iconic Malabar Hill, offering sprawling penthouses and sky residences with panoramic views of the Arabian Sea and Marine Drive. Each home is curated by internationally acclaimed designers with private terraces, 12-foot ceilings, and bespoke interiors. The project brings five-star amenities including a rooftop infinity pool, private concierge, and temperature-controlled wine cellar.`,
    priceMin: 18_50_00_000,
    priceMax: 55_00_00_000,
    topic: {
      userName: 'Vikram Mehta',
      title: 'Lodha Malabar – worth the price or just a brand name?',
      content: `Attended the invite-only launch event last month. The model apartment is genuinely stunning – 14 foot ceilings, private lift lobby for each unit. Sea view from the 38th floor is breathtaking. But honestly the pricing at 18Cr starting feels aggressive even for Malabar Hill. Comparing with Raheja Imperia nearby which offers similar spec at a lower cost. Anyone else went for the preview?`,
      daysAgo: 55,
    },
    ratings: [
      { userName: 'Vikram Mehta', score: 4, review: `Location and product quality is top notch. Price is steep but Lodha always delivers on promise.` },
      { userName: 'Amit Gupta',   score: 3, review: `Looked at it, great views but maintenance cost will also be huge. Think twice.` },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Godrej Alive',
    propertyType: 'APARTMENT',
    address: 'Mulund West, Mumbai 400080',
    description: `Godrej Alive is a thoughtfully designed residential community in Mulund West, offering 2 and 3 BHK apartments surrounded by a 10-acre natural reserve. The project emphasizes sustainable living with rainwater harvesting, solar panels, and over 60% open space. Residents enjoy a clubhouse, jogging track through a forest trail, and excellent connectivity to the Eastern Express Highway.`,
    priceMin: 1_49_00_000,
    priceMax: 2_90_00_000,
    topic: {
      userName: 'Rahul Sharma',
      title: 'Godrej Alive Mulund – good value for a self-use home?',
      content: `Visited the site this weekend. The location is genuinely green – there is a creek on one side and the Sanjay Gandhi reserve is close by. The 2BHK at 1.5Cr is well laid out, RERA carpet area is around 680sqft which is decent for Mulund. Godrej quality on construction is consistent in my experience. The highway road can get congested during peak hours but that is the tradeoff.`,
      daysAgo: 42,
    },
    ratings: [
      { userName: 'Rahul Sharma', score: 4, review: `Solid mid-segment project. Carpet area is honest, no gimmicks. Good for end use.` },
      { userName: 'Priya Iyer',   score: 5, review: `Went for site visit twice. Construction quality looks good and the green cover is refreshing for Mumbai.` },
      { userName: 'Rohan Joshi',  score: 4, review: `Fair pricing for Mulund. Eastern highway connectivity is a big plus for IT folks heading to BKC.` },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Rustomjee Elements',
    propertyType: 'APARTMENT',
    address: 'Andheri West, Mumbai 400053',
    description: `Rustomjee Elements is a premium residential project in Andheri West offering spacious 2, 3, and 4 BHK apartments with modern architecture and high-end finishes. Located minutes from the Western Express Highway and JVLR, it provides excellent access to key Mumbai business districts. Amenities include a rooftop sky lounge, business center, Olympic-size pool, and smart home automation across all units.`,
    priceMin: 2_60_00_000,
    priceMax: 5_80_00_000,
    topic: {
      userName: 'Neha Agarwal',
      title: 'Rustomjee Elements Andheri W – honest review after site visit',
      content: `The showroom flat they have done up is 4BHK and looks great, but do not get carried away – the standard 2BHK is more compact. Flooring and fixtures quality seems above average for the price. Location is the real selling point – 7 mins to the highway, Lokhandwala market walking distance. Basement parking is properly planned. One concern is the narrow lane leading to the project which has traffic issues in the morning.`,
      daysAgo: 38,
    },
    ratings: [
      { userName: 'Neha Agarwal', score: 4, review: `Great location. Construction quality is above average. A bit pricey but Andheri West commands premium.` },
      { userName: 'Arjun Singh',  score: 3, review: `Good project but narrow approach road is going to be a problem when the society is full.` },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Piramal Aranya',
    propertyType: 'APARTMENT',
    address: 'Byculla, Mumbai 400027',
    description: `Piramal Aranya is a landmark luxury development in Byculla, reviving one of Mumbai's most storied neighbourhoods. The project features three iconic towers with 3 and 4 BHK residences overlooking the Veermata Jijabai Bhosale Udyan. Residents enjoy an 80,000 sq ft amenity deck, a 3-acre forest garden, an entertainment hub, and direct access to the upcoming Byculla-Worli metro corridor.`,
    priceMin: 3_20_00_000,
    priceMax: 7_50_00_000,
    topic: {
      userName: 'Deepika Rajput',
      title: 'Piramal Aranya Byculla – is the metro connectivity story real?',
      content: `Byculla is genuinely changing. Went for the site preview last week and the tower height and zoo-facing view is unlike anything in this price range. Piramal build quality from their earlier projects has been good. My concern is that Byculla has infrastructure gaps still and the metro line they are banking on is a few years away. The 3BHK at 3.5Cr looks attractive compared to similar specs in Lower Parel which is 5Cr plus. Risky bet but possibly good returns if metro comes through.`,
      daysAgo: 29,
    },
    ratings: [
      { userName: 'Deepika Rajput', score: 4, review: `Bold project in an evolving location. Piramal brand gives confidence. Long term play for sure.` },
      { userName: 'Meera Pillai',   score: 3, review: `Byculla infrastructure still needs work. Zoo facing view is genuinely beautiful though.` },
      { userName: 'Suresh Nair',    score: 4, review: `Compared 4-5 projects in this range. Piramal Aranya has the best view and amenity deck.` },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Oberoi Sky City',
    propertyType: 'APARTMENT',
    address: 'Borivali East, Mumbai 400066',
    description: `Oberoi Sky City is a sprawling integrated township in Borivali East, developed across 25 acres with 3 and 4 BHK sky residences. The project is part of Oberoi's signature Sky series featuring expansive floor plates, double-height lobbies, and hotel-inspired concierge services. Located close to the national park with metro station and railway station within a short drive.`,
    priceMin: 2_40_00_000,
    priceMax: 4_80_00_000,
    topic: {
      userName: 'Rohan Joshi',
      title: 'Oberoi Sky City Borivali – Phase 2 launched, good time to buy?',
      content: `Phase 1 residents seem happy based on the Facebook group discussions. Went for phase 2 launch last month. Oberoi quality is honestly among the best in Mumbai – the lobby of phase 1 looks hotel-grade. The 3BHK at 2.6Cr is their most value offering. Main concern is their delivery track record – Exquisite in Goregaon got delayed by 3 years. But for phase 2 of an ongoing project the risk is lower.`,
      daysAgo: 20,
    },
    ratings: [
      { userName: 'Rohan Joshi',  score: 4, review: `Oberoi quality is undeniable. Phase 2 pricing is fair. Long delivery timelines are the only risk.` },
      { userName: 'Kavya Reddy',  score: 5, review: `Best amenities in Borivali by a long shot. The clubhouse is massive. Visited Phase 1 and was impressed.` },
    ],
  },
  {
    citySlug: 'mumbai',
    propertyName: 'Raymond TenX Habitat',
    propertyType: 'APARTMENT',
    address: 'Pokhran Road No 2, Thane West 400606',
    description: `Raymond TenX Habitat is a smartly designed 1, 2, and 3 BHK residential community in Thane, developed under the Raymond Realty brand. Spread across 14 acres with 10 towers, it offers over 50 lifestyle amenities including a cricket pitch, amphitheatre, co-working spaces, and a dedicated kids learning centre. Raymond's corporate backing ensures strong project governance.`,
    priceMin: 98_00_000,
    priceMax: 2_20_00_000,
    topic: {
      userName: 'Arjun Singh',
      title: 'Raymond TenX Habitat Thane – genuine budget option in MMR?',
      content: `The 1BHK under 1Cr in Thane is increasingly rare and Raymond TenX delivers that. Brand credibility of Raymond is a plus – they are relatively new to real estate but corporate backing means less risk of project stalling. Went for site visit – the 14 acre campus plan looks solid. Amenity list is impressive for this price range. The Pokhran Road location is decent, Thane station is 15 mins. For first time buyers this makes sense.`,
      daysAgo: 48,
    },
    ratings: [
      { userName: 'Arjun Singh',     score: 4, review: `Best value in Thane currently. 1BHK under 1Cr is hard to find from a credible builder.` },
      { userName: 'Rahul Sharma',    score: 4, review: `Went for site visit. Campus is huge. Raymond brand gives confidence for first-time buyers.` },
      { userName: 'Ananya Krishnan', score: 3, review: `Thane connectivity is improving but still far from South Mumbai offices. Only for Thane job holders.` },
    ],
  },

  // ── DELHI / NCR ───────────────────────────────────────────────────────────
  {
    citySlug: 'delhi',
    propertyName: 'DLF The Arbour',
    propertyType: 'APARTMENT',
    address: 'Sector 63, Golf Course Extension Road, Gurugram 122018',
    description: `DLF The Arbour is a super-luxury residential development on Golf Course Extension Road, Gurugram, offering premium 4 BHK apartments with private terraces. Each residence spans over 3,500 sq ft with Italian marble flooring, European modular kitchen, and a private terrace with plunge pool provision. The project is designed around 85% open green spaces with a 60,000 sq ft clubhouse.`,
    priceMin: 7_50_00_000,
    priceMax: 14_50_00_000,
    topic: {
      userName: 'Amit Gupta',
      title: 'DLF The Arbour Gurgaon – Phase 2 launch experience',
      content: `Got an invite to the private preview. DLF reputation on Golf Course Extension is well established. The 4BHK unit at 7.5Cr is actually competitive for GCR given what M3M and Sobha charge. The model flat is done by Gauri Khan Design – genuinely tasteful, not over the top. Maintenance charges at Rs 8 per sqft will add up but expected for this tier. DLF build quality I have seen in sector 42 and 77 is consistent.`,
      daysAgo: 60,
    },
    ratings: [
      { userName: 'Amit Gupta',  score: 5, review: `DLF quality on GCR is proven. The Arbour is one of the better launches in Gurgaon this year.` },
      { userName: 'Arjun Singh', score: 4, review: `Solid product, great location. Gurgaon luxury market has depth so resale should be good.` },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'M3M Capital Walk',
    propertyType: 'COMMERCIAL',
    address: 'Sector 113, Dwarka Expressway, Gurugram 122017',
    description: `M3M Capital Walk is an iconic 1-km high-street retail development in Sector 113, Gurugram by M3M Group on Dwarka Expressway. The project features 876 boutique shops, double-height flagship showrooms, a hypermarket, food court, entertainment zone, and Grade-A offices. Designed as an open-air retail boulevard, it targets premium brands and draws heavy footfall from the densely populated Dwarka Expressway corridor.`,
    priceMin: 1_85_00_000,
    priceMax: 3_80_00_000,
    topic: {
      userName: 'Priya Iyer',
      title: 'M3M Capital Walk Dwarka Expressway – worth it for investment?',
      content: `Dwarka Expressway has appreciated well since metro connectivity improved. M3M has delivered projects in Gurgaon before but they have also had some delays. The concept here is mixed-use which is trendy but also means a busier ground floor. The 2BHK at 1.85Cr on Dwarka Expressway is fair pricing. For rental income the proximity to IGI airport zone companies is good. Investment grade but check RERA before booking.`,
      daysAgo: 35,
    },
    ratings: [
      { userName: 'Priya Iyer',  score: 3, review: `Good investment logic on Dwarka expressway. M3M delivery track record needs checking before committing.` },
      { userName: 'Neha Agarwal', score: 4, review: `Mixed use concept is solid. The high street retail will help with resale value.` },
      { userName: 'Vikram Mehta', score: 4, review: `Visited site. Construction is moving fast. Good connectivity once Dwarka metro phase 2 opens fully.` },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'Sobha City Gurgaon',
    propertyType: 'APARTMENT',
    address: 'Sector 108, Dwarka Expressway, Gurugram 122017',
    description: `Sobha City is a large-format integrated township on Dwarka Expressway developed by Sobha Limited using their in-house backward integration model – construction, fixtures, and finishes are all done by Sobha's own teams ensuring consistent quality. The project offers 2, 3, and 4 BHK residences across multiple towers with a town square, sports arenas, and a 5-acre central park.`,
    priceMin: 1_60_00_000,
    priceMax: 3_20_00_000,
    topic: {
      userName: 'Kavya Reddy',
      title: 'Sobha City Gurgaon Sector 108 – quality vs price breakdown',
      content: `Sobha is probably the one builder in India where the construction quality is genuinely above average and provably so – their in-house model means the tiles, wood, plumbing are all Sobha controlled. Visited the site and the construction looks clean. Sector 108 is a bit away from the main Gurugram CBD but with work from home demand it is less of an issue. The 3BHK at 2.5Cr seems fair. Township scale means the internal amenities will be very complete.`,
      daysAgo: 22,
    },
    ratings: [
      { userName: 'Kavya Reddy', score: 5, review: `Sobha quality is unmatched. Best finishes in this price range on Dwarka Expressway.` },
      { userName: 'Suresh Nair', score: 4, review: `Township scale gives confidence. Location is a bit peripheral now but will improve as DXP develops.` },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'Godrej Tropical Isle',
    propertyType: 'APARTMENT',
    address: 'Sector 146, Noida 201301',
    description: `Godrej Tropical Isle is a nature-inspired residential development in Noida's Sector 146, offering 2 and 3 BHK apartments with extensive tropical landscaping and water features across the complex. The project is designed around a central 2-acre water body with cascading pools and tropical gardens. Located adjacent to the Noida-Greater Noida expressway junction with metro connectivity.`,
    priceMin: 1_28_00_000,
    priceMax: 2_65_00_000,
    topic: {
      userName: 'Rohan Joshi',
      title: 'Godrej Tropical Isle Noida Sec 146 – site visit notes',
      content: `Noida Sector 146 is a developed pocket with good internal roads and the metro is literally walking distance. Godrej brand in Noida has been strong since their sector 43 project. The 2BHK at 1.3Cr is reasonably priced for this location. The tropical garden concept looks nice in renders. My flat calculation works out to around 7100 per sqft all-in which is market rate for sector 146. Recommended for Noida buyers.`,
      daysAgo: 33,
    },
    ratings: [
      { userName: 'Rohan Joshi',     score: 4, review: `Metro walking distance, Godrej quality, fair pricing. Solid choice for Noida.` },
      { userName: 'Ananya Krishnan', score: 5, review: `Loved the landscaping concept. Went with family, the 3BHK layout has zero wasted space.` },
      { userName: 'Deepika Rajput',  score: 4, review: `Expressway access is great. 146 is a good sector – not too remote, not too crowded.` },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'ATS Le Grandiose',
    propertyType: 'APARTMENT',
    address: 'Sector 150, Noida 201310',
    description: `ATS Le Grandiose is a premium residential project in Sector 150, Noida, offering 4 BHK spacious apartments with private servant quarters and double-height living rooms. The project is spread across 15 acres with 8 towers and a grand 1-acre entrance boulevard. Residents benefit from proximity to the Noida-Greater Noida Expressway and the upcoming Aqua Line metro extension.`,
    priceMin: 1_95_00_000,
    priceMax: 3_90_00_000,
    topic: {
      userName: 'Meera Pillai',
      title: 'ATS Le Grandiose Sec 150 – worth the premium over other projects?',
      content: `Sector 150 has become the premium pocket of Noida – wider roads, greener, less density. ATS has delivered well in Noida (Paradiso, Advantage) so brand credibility is okay. The 4BHK with servant quarter and 2700sqft carpet is genuinely spacious. At 2Cr for this size it is Delhi NCR best value in my view. The double-height living room is the USP. My only concern – ATS had financial issues a few years ago but they have stabilised since.`,
      daysAgo: 17,
    },
    ratings: [
      { userName: 'Meera Pillai',  score: 4, review: `Sec 150 location is excellent. 4BHK at 2Cr with this space is hard to find anywhere in NCR.` },
      { userName: 'Rahul Sharma',  score: 3, review: `Good product but do check ATS recent RERA compliance before booking. Some older projects had issues.` },
    ],
  },
  {
    citySlug: 'delhi',
    propertyName: 'Prestige City Noida',
    propertyType: 'APARTMENT',
    address: 'Sector 150, Noida 201310',
    description: `Prestige City Noida marks the Bengaluru-based Prestige Group's landmark entry into Delhi NCR with an integrated township in Sector 150. The project spans 60 acres featuring premium 3 and 4 BHK apartments along with villas, a retail high street, five-star hotel, and a convention centre. The township ensures self-sufficiency with schools, medical facilities, and sports infrastructure within the campus.`,
    priceMin: 2_20_00_000,
    priceMax: 5_50_00_000,
    topic: {
      userName: 'Arjun Singh',
      title: 'Prestige City Noida – South India builder entering Delhi market',
      content: `Prestige entering Noida is a big deal. Their track record in Bangalore is excellent – Prestige Shantiniketan, Prestige Lakeside Habitat are well-regarded. The township scale at 60 acres in Sector 150 is ambitious and the integrated nature (residential plus retail plus hotel) gives it strong long-term value. Pricing at 2.2Cr for 3BHK is at a premium to the sector but the brand and scale justify it.`,
      daysAgo: 52,
    },
    ratings: [
      { userName: 'Arjun Singh', score: 5, review: `Prestige brings Bangalore quality to Noida. Township scale and brand make this a standout.` },
      { userName: 'Amit Gupta',  score: 4, review: `Sector 150 plus Prestige brand plus township scale equals strong investment logic. RERA registered.` },
      { userName: 'Priya Iyer',  score: 4, review: `Best project currently in Noida Sec 150 in my view. Prestige brand is very reassuring.` },
    ],
  },

  // ── BENGALURU ────────────────────────────────────────────────────────────
  {
    citySlug: 'bengaluru',
    propertyName: 'Sobha Neopolis',
    propertyType: 'VILLA',
    address: 'Panathur Road, Varthur, Bengaluru 560087',
    description: `Sobha Neopolis is a marquee luxury residential development on Panathur Road, one of Bengaluru's most sought-after IT corridors. Offering 3 and 4 BHK sky villas and duplexes, the project features a 1.5 lakh sq ft podium amenity deck, private theatre, sky gym, and curated landscaping by an international design firm. Its proximity to EPIP Zone, Whitefield IT parks, and the upcoming Whitefield metro makes it ideal for tech professionals.`,
    priceMin: 2_20_00_000,
    priceMax: 5_50_00_000,
    topic: {
      userName: 'Kavya Reddy',
      title: 'Sobha Neopolis Panathur – premium for the Whitefield IT crowd',
      content: `Panathur Road has become expensive fast. Sobha Neopolis is their answer to the demand from senior IT folks who want luxury without going to Koramangala or Indiranagar. The 3BHK sky villa at 2.5Cr is what most people are buying. Carpet area is honest – around 1750sqft for 3BHK. The amenity deck at 1.5 lakh sqft is genuinely massive. Whitefield metro connectivity clinches it for daily commuters. Visited last month and construction pace is good – typical Sobha.`,
      daysAgo: 44,
    },
    ratings: [
      { userName: 'Kavya Reddy',     score: 5, review: `Sobha quality plus Panathur location plus metro connectivity. Best luxury product in East Bengaluru.` },
      { userName: 'Ananya Krishnan', score: 4, review: `Slightly overpriced but Sobha always holds resale value well. Worth it for 5 plus year horizon.` },
      { userName: 'Meera Pillai',    score: 4, review: `My husband and I are IT professionals in Whitefield. This one ticks all boxes. Booked 3BHK.` },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Prestige Raintree Park',
    propertyType: 'APARTMENT',
    address: 'Whitefield, Bengaluru 560066',
    description: `Prestige Raintree Park is a premium township in Whitefield offering 3 and 4 BHK apartments and villas across 80 acres of thoughtfully planned green space. Named after the majestic rain trees native to Bengaluru, the project integrates 40% green cover with 200 plus lifestyle amenities. The township includes a dedicated school campus, sports courts, and a retail promenade, located on ITPL main road with direct metro station access.`,
    priceMin: 1_95_00_000,
    priceMax: 4_80_00_000,
    topic: {
      userName: 'Suresh Nair',
      title: 'Prestige Raintree Park Whitefield – 80 acres township worth a look',
      content: `Prestige township projects are generally well executed – Prestige Shantiniketan was proof. Raintree Park continues that tradition in Whitefield. 80 acres is big enough to have proper internal roads, not just narrow lanes. The 3BHK at 2Cr is priced well relative to standalone apartments in Whitefield. School within campus is a big plus for families. ITPL road gets congested but the metro station nearby helps. Best option in Whitefield currently.`,
      daysAgo: 58,
    },
    ratings: [
      { userName: 'Suresh Nair',  score: 4, review: `Township scale with school campus and metro access. Prestige delivers consistently.` },
      { userName: 'Rohan Joshi',  score: 5, review: `Visited with my parents. The green cover is real, not just renders. 40 percent green in Whitefield is rare.` },
      { userName: 'Rahul Sharma', score: 4, review: `Fair pricing for Whitefield. Prestige brand means construction quality will not disappoint.` },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Brigade Valencia',
    propertyType: 'APARTMENT',
    address: 'Hosur Road, Electronic City Phase 1, Bengaluru 560100',
    description: `Brigade Valencia is a thoughtfully planned mid-premium residential community on Hosur Road, Bengaluru offering 2 and 3 BHK apartments in a Mediterranean-inspired architectural design. The project spans 9 acres with multiple towers, featuring a temperature-controlled swimming pool, sky garden, clubhouse, and dedicated EV charging infrastructure throughout. Excellent connectivity to Electronic City, Koramangala, and Silk Board junction.`,
    priceMin: 1_10_00_000,
    priceMax: 2_40_00_000,
    topic: {
      userName: 'Deepika Rajput',
      title: 'Brigade Valencia Hosur Road – honest review for IT professionals',
      content: `If you work in Electronic City this is probably the most sensible buy right now. 2BHK at 1.1Cr on Hosur Road with Brigade build quality is hard to beat. The Mediterranean design is a bit showy but the internals are practical. Kitchen size is good, bathroom tiling is above average. Only gripe is the Hosur Road traffic – but anyone buying here knows that. EV charging in basement is a thoughtful touch. Brigade has good RERA compliance record.`,
      daysAgo: 26,
    },
    ratings: [
      { userName: 'Deepika Rajput', score: 4, review: `Best value on Hosur Road for IT workers. Brigade quality at mid-market price.` },
      { userName: 'Vikram Mehta',   score: 4, review: `Solid project. EV infrastructure is a big plus. Layout is practical.` },
      { userName: 'Neha Agarwal',   score: 3, review: `Good project but Hosur Road traffic will test your patience daily. Price makes up for it.` },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Godrej Woodscapes',
    propertyType: 'APARTMENT',
    address: 'Budigere Cross, Bengaluru 562129',
    description: `Godrej Woodscapes is a forest-themed residential development at Budigere Cross offering 1, 2, and 3 BHK homes amidst 12 acres of curated natural landscape. The project introduces a 1 km forest trail within the campus for residents. Designed for the young professional community, it features co-working pods, a gaming arena, and pet-friendly spaces.`,
    priceMin: 72_00_000,
    priceMax: 1_65_00_000,
    topic: {
      userName: 'Ananya Krishnan',
      title: 'Godrej Woodscapes Budigere Cross – budget option in Bengaluru?',
      content: `Budigere Cross is far from the main tech hubs but prices are significantly lower. Godrej Woodscapes at 72L for a 1BHK is among the most affordable new launches from a branded developer in Bengaluru right now. The forest trail concept is genuinely nice – the renders show an actual wooded area, not just potted plants. Good for first-time buyers or those working remotely. Connectivity to the new terminal 2 area via Bellary Road is a bonus.`,
      daysAgo: 40,
    },
    ratings: [
      { userName: 'Ananya Krishnan', score: 4, review: `Most affordable branded option in Bengaluru. Forest concept is genuine. Perfect for remote workers.` },
      { userName: 'Priya Iyer',      score: 4, review: `Location is a bit far but the price and quality justify it. Good for 5-7 year investment.` },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Mana Dale',
    propertyType: 'APARTMENT',
    address: 'Sarjapur Road, Bengaluru 562125',
    description: `Mana Dale is a popular residential community on Sarjapur Road by Mana Projects, offering value-for-money 2 and 3 BHK apartments. With over 40 amenities including a large clubhouse, multipurpose courts, jogging tracks, and a swimming pool, the project is designed for families. Its location on Sarjapur Road ensures excellent connectivity to Wipro, Infosys, and other IT campuses.`,
    priceMin: 85_00_000,
    priceMax: 1_55_00_000,
    topic: {
      userName: 'Meera Pillai',
      title: 'Mana Dale Sarjapur Road – should you buy or rent nearby?',
      content: `Sarjapur Road rental yield is actually quite good. If you are working in the IT corridor here the rent vs EMI math is interesting – rent for a 2BHK nearby is around 25k, EMI on Mana Dale 2BHK at 85L would be roughly 72k. So buying makes sense only if you are staying 8 plus years or expect strong appreciation. The project itself is solid – Mana has delivered well in this area before. Clubhouse quality looks good for the price point.`,
      daysAgo: 31,
    },
    ratings: [
      { userName: 'Meera Pillai', score: 4, review: `Good value on Sarjapur Road. Mana has local credibility and delivers on time.` },
      { userName: 'Suresh Nair',  score: 3, review: `Decent project but Sarjapur Road traffic is brutal. Calculate commute time before buying.` },
      { userName: 'Arjun Singh',  score: 4, review: `Best in class for the price on Sarjapur. 3BHK at 1.4Cr is genuinely good value.` },
    ],
  },
  {
    citySlug: 'bengaluru',
    propertyName: 'Arvind Bel Air',
    propertyType: 'APARTMENT',
    address: 'Jalahalli Cross, Bengaluru 560013',
    description: `Arvind Bel Air is a thoughtfully curated residential community in North Bengaluru's Jalahalli Cross by Arvind SmartSpaces. The project focuses on open-space design with 80% of the land area devoted to landscaping, sports courts, and walking paths. With seamless connectivity to Peenya Industrial Area and the International Airport via the elevated expressway.`,
    priceMin: 78_00_000,
    priceMax: 1_42_00_000,
    topic: {
      userName: 'Vikram Mehta',
      title: 'Arvind Bel Air Jalahalli – North Bangalore hidden gem?',
      content: `North Bengaluru is often overlooked by south-focused buyers but the infrastructure is genuinely improving. Jalahalli Cross is well connected and Arvind SmartSpaces has done good projects in Gujarat. The 2BHK at 78L is excellent value. 80 percent open space claim – I verified during site visit and it is largely accurate. The sports infrastructure including cricket nets, badminton, and tennis is impressive for this price range. Downside – Jalahalli can feel disconnected from main Bengaluru.`,
      daysAgo: 23,
    },
    ratings: [
      { userName: 'Vikram Mehta',  score: 4, review: `Hidden gem in North Bengaluru. Arvind quality is good, open space is genuine.` },
      { userName: 'Rahul Sharma',  score: 3, review: `Good value but connectivity to South Bengaluru offices is challenging.` },
    ],
  },

  // ── HYDERABAD ────────────────────────────────────────────────────────────
  {
    citySlug: 'hyderabad',
    propertyName: 'My Home Bhooja',
    propertyType: 'VILLA',
    address: 'Kokapet, Hyderabad 500075',
    description: `My Home Bhooja is the most anticipated ultra-luxury launch in Hyderabad, located in the premium Financial District-Kokapet corridor. Offering limited-edition 4 BHK sky villas with private pools and 5 BHK penthouses with stunning views of Gandipet lake. The project features a 3 lakh sq ft amenity club – the largest in Hyderabad – with an Olympic pool, squash courts, private wine room, and fine-dining restaurant.`,
    priceMin: 3_80_00_000,
    priceMax: 11_00_00_000,
    topic: {
      userName: 'Kavya Reddy',
      title: 'My Home Bhooja Kokapet – is Hyderabad ready for this price point?',
      content: `My Home Corporation has delivered consistently in Hyderabad (My Home Avatar, My Home Jewel). Bhooja is their most ambitious product yet and the launch price of 3.8Cr starting for a 4BHK seemed steep but actually sold through fast. Went for the preview event – the 3 lakh sqft club is insane, genuinely hotel level. Kokapet location is proven gold – Financial District companies walking distance. Gandipet lake view from upper floors is the best in Hyderabad real estate right now.`,
      daysAgo: 67,
    },
    ratings: [
      { userName: 'Kavya Reddy',    score: 5, review: `Best luxury project in Hyderabad currently. My Home delivers, lake view is unreal.` },
      { userName: 'Rohan Joshi',    score: 5, review: `Kokapet plus luxury plus My Home equals Hyderabad strongest real estate bet. Booked a 4BHK.` },
      { userName: 'Deepika Rajput', score: 4, review: `Pricey but justified. The 3 lakh sqft club is genuinely the best in the city.` },
    ],
  },
  {
    citySlug: 'hyderabad',
    propertyName: 'Aparna Sarovar Grande',
    propertyType: 'APARTMENT',
    address: 'Nallagandla, Hyderabad 500019',
    description: `Aparna Sarovar Grande is a premium lake-facing residential community in Nallagandla, developed by Aparna Constructions, Hyderabad's most trusted local developer. Offering 3 and 4 BHK apartments with balconies overlooking the Nallagandla lake, the project spans 14 acres with a 45,000 sq ft clubhouse, floating meditation deck, infinity pool, and children's water park.`,
    priceMin: 1_60_00_000,
    priceMax: 3_20_00_000,
    topic: {
      userName: 'Amit Gupta',
      title: 'Aparna Sarovar Grande – lake-facing apartments in Nallagandla',
      content: `Nallagandla is one of those Hyderabad locations that has grown steadily without the hype. Aparna is the most reliable name in Hyderabad real estate – they have never stalled a project. Lake facing 3BHK at 1.8Cr is very competitive. The actual lake view from upper floors during site visit was beautiful. Clubhouse plans look impressive. For Hyderabad residents Aparna is the safe choice – consistent quality, no drama.`,
      daysAgo: 36,
    },
    ratings: [
      { userName: 'Amit Gupta',      score: 5, review: `Aparna is Hyderabad most reliable builder. Lake view plus fair price equals must consider.` },
      { userName: 'Ananya Krishnan', score: 4, review: `Nallagandla is a well-developed area. Lake facing apartments are rare and this is good value.` },
      { userName: 'Priya Iyer',      score: 4, review: `Aparna always delivers on time. That alone makes this stand out in Hyderabad.` },
    ],
  },
  {
    citySlug: 'hyderabad',
    propertyName: 'Vertex Panache',
    propertyType: 'APARTMENT',
    address: 'Narsingi, Hyderabad 500075',
    description: `Vertex Panache is a stylish premium residential development in Narsingi, Hyderabad offering spacious 3 and 4 BHK apartments with designer interiors. The project is designed around a central 40,000 sq ft leisure deck with an infinity edge pool, sky bar, rooftop cinema, and co-working hub. Located just off the Outer Ring Road with quick access to IKEA Hyderabad, Financial District, and the Gachibowli sports complex.`,
    priceMin: 1_75_00_000,
    priceMax: 3_60_00_000,
    topic: {
      userName: 'Neha Agarwal',
      title: 'Vertex Panache Narsingi – new premium launch, worth investigating',
      content: `Narsingi is basically the extension of the Financial District corridor and prices have been rising. Vertex is a Hyderabad-based developer, less known than Aparna or My Home but their previous project Vertex Nova had decent reviews. The product here is good – rooftop cinema and sky bar concepts are genuinely cool for the price. 3BHK at 1.8Cr on ORR side is fair. Do verify the developer track record and check RERA registration before booking.`,
      daysAgo: 19,
    },
    ratings: [
      { userName: 'Neha Agarwal', score: 3, review: `Good product but lesser-known developer. Verify RERA and past project delivery before committing.` },
      { userName: 'Suresh Nair',  score: 4, review: `Narsingi location on ORR is excellent. Vertex has delivered before in Hyderabad so trust is okay.` },
    ],
  },
  {
    citySlug: 'hyderabad',
    propertyName: 'Aliens Space Station',
    propertyType: 'APARTMENT',
    address: 'Tellapur, Hyderabad 502032',
    description: `Aliens Space Station is a futuristic-themed luxury residential project near Hyderabad's Outer Ring Road at Tellapur. The project features space-inspired architecture, sky bridges between towers, an observatory deck, and themed amenity zones. Spread across 50 acres with 5,000 plus apartments across multiple phases, it is one of the largest gated communities near the Financial District corridor.`,
    priceMin: 95_00_000,
    priceMax: 1_85_00_000,
    topic: {
      userName: 'Rohan Joshi',
      title: 'Aliens Space Station Tellapur – unique concept but practical?',
      content: `The space theme is eye-catching but the actual product is solid once you get past the marketing. Tellapur is a bit further from Financial District than Narsingi or Kokapet but prices are significantly lower. 2BHK at 1.1Cr with Aliens build quality (which is decent) works. Sky bridges are an actual architectural feature not just a render. The community is massive – 5000 plus units means great internal amenities but also more traffic.`,
      daysAgo: 47,
    },
    ratings: [
      { userName: 'Rohan Joshi',  score: 4, review: `Unique product, good value for Hyderabad. The community scale makes amenities great.` },
      { userName: 'Kavya Reddy',  score: 3, review: `Cool concept. A bit far from main FD offices. Good for people who work from home or Gachibowli side.` },
    ],
  },
  {
    citySlug: 'hyderabad',
    propertyName: 'Sattva Serene Life',
    propertyType: 'APARTMENT',
    address: 'Gachibowli, Hyderabad 500032',
    description: `Sattva Serene Life is a residential project in Hyderabad's prime IT hub of Gachibowli by Sattva Group, the trusted Bengaluru-based developer. Offering 2 and 3 BHK apartments with smart home features pre-installed, the project spans 8 acres with a 30,000 sq ft lifestyle clubhouse, infinity pool, and private work-from-home pods for residents. Located 5 minutes from DLF Cybercity and Microsoft campus.`,
    priceMin: 1_50_00_000,
    priceMax: 2_80_00_000,
    topic: {
      userName: 'Arjun Singh',
      title: 'Sattva Serene Life Gachibowli – Bengaluru builder in Hyderabad',
      content: `Sattva Bengaluru projects are excellent and they are now expanding to Hyderabad. Gachibowli location is the best in Hyderabad for IT professionals – Microsoft, DLF, Goldman are all close. The 2BHK at 1.5Cr is at a slight premium to area average but Sattva quality justifies it. Smart home features come standard which is nice. WFH pods in the community is a thoughtful addition. Good for Hyderabad IT folks who want quality without going all the way to Kokapet.`,
      daysAgo: 14,
    },
    ratings: [
      { userName: 'Arjun Singh',  score: 4, review: `Sattva quality in prime Gachibowli. Smart home standard feature is a bonus.` },
      { userName: 'Amit Gupta',   score: 5, review: `Gachibowli location is unbeatable for IT crowd. Sattva brand quality gives confidence.` },
      { userName: 'Vikram Mehta', score: 4, review: `Walked to Microsoft campus from site. 8 minute walk. Location is genuinely as advertised.` },
    ],
  },

  // ── CHENNAI ──────────────────────────────────────────────────────────────
  {
    citySlug: 'chennai',
    propertyName: 'Casagrand Verdant',
    propertyType: 'APARTMENT',
    address: 'Perungudi, OMR, Chennai 600096',
    description: `Casagrand Verdant is a lush green residential development on OMR, Chennai's IT corridor, offering 2 and 3 BHK apartments with 70% open space and tropical landscaping. The project is IGBC gold pre-certified for sustainable design with rainwater harvesting, solar panels, and an organic waste converter. With 55 plus amenities including a lakeside deck, jogging track, and sports hub.`,
    priceMin: 80_00_000,
    priceMax: 1_50_00_000,
    topic: {
      userName: 'Priya Iyer',
      title: 'Casagrand Verdant OMR – budget premium in Chennai IT belt',
      content: `Casagrand is one of Chennai largest developers and Verdant continues their formula – good green cover, honest pricing, standard quality. OMR Perungudi is closer to the city than the far end of OMR so commute is manageable. 2BHK at 80L for IGBC certified green project on OMR is fair. The lakeside deck is a real feature, verified it during site visit. For Chennai IT folks working in this corridor this is an easy recommendation.`,
      daysAgo: 39,
    },
    ratings: [
      { userName: 'Priya Iyer',  score: 4, review: `Casagrand quality is consistent. OMR Perungudi location is convenient, not too far out.` },
      { userName: 'Meera Pillai', score: 4, review: `Green rating adds value. Lakeside deck is a genuine feature. Good price for OMR.` },
      { userName: 'Suresh Nair',  score: 5, review: `Bought a 3BHK here. Construction is moving well. Green amenities are better than most in OMR.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Brigade Xanadu',
    propertyType: 'APARTMENT',
    address: 'Mogappair West, Chennai 600037',
    description: `Brigade Xanadu is an expansive luxury residential township in Mogappair West, bringing Brigade's proven township model to Chennai. Spread across 12 acres with 2, 3, and 4 BHK homes, the project features a 1 lakh sq ft Grand Clubhouse – Chennai's largest – with an Olympic pool, indoor badminton, squash courts, and a rooftop jogging track. Ideally located near CMBT with metro and Anna Nagar connectivity.`,
    priceMin: 1_40_00_000,
    priceMax: 2_90_00_000,
    topic: {
      userName: 'Ananya Krishnan',
      title: 'Brigade Xanadu Mogappair – Bangalore developer in Chennai',
      content: `Brigade Chennai entry through Xanadu is significant. Mogappair is a prime residential area – Anna Nagar adjacent, CMBT walkable, metro coming soon. The 1 lakh sqft clubhouse claim is accurate based on site visit – they have earmarked a huge plot for it. 2BHK at 1.4Cr is premium for Mogappair but Brigade quality justifies it. The floor plans are efficient – no odd cuts or wasted corners. For north Chennai buyers this is probably the best product currently.`,
      daysAgo: 53,
    },
    ratings: [
      { userName: 'Ananya Krishnan', score: 5, review: `Best product in North Chennai. Brigade quality plus Mogappair location equals strong buy.` },
      { userName: 'Rohan Joshi',     score: 4, review: `Went for Chennai on a work trip and visited. Brigade quality is consistent. Good for NRI buyers.` },
      { userName: 'Deepika Rajput',  score: 4, review: `1 lakh sqft clubhouse is the real deal. Chennai has not seen this scale before.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'VGN Fairmont',
    propertyType: 'APARTMENT',
    address: 'Anna Nagar West, Chennai 600040',
    description: `VGN Fairmont is a prestigious ultra-luxury residential development in Anna Nagar West by VGN Group, one of Chennai's most respected developers. The project offers limited-edition 3 and 4 BHK residences with floor-to-ceiling glazing, Italian marble flooring, Hacker modular kitchen, and a private lift lobby for upper floors. Set in Chennai's most coveted residential neighbourhood.`,
    priceMin: 2_40_00_000,
    priceMax: 5_20_00_000,
    topic: {
      userName: 'Meera Pillai',
      title: 'VGN Fairmont Anna Nagar – luxury at Anna Nagar prices, is it real?',
      content: `Anna Nagar West is Chennai premium address and VGN has been here for decades. Fairmont is their luxury play. The Hacker modular kitchen (German brand) and Italian marble is not just a marketing claim – saw the sample in the model flat. 3BHK at 2.5Cr in Anna Nagar for this spec is actually reasonable compared to Mumbai or Delhi. VGN track record is excellent – no project delays I have heard of. For Chennai buyers looking at premium this is the best bet in a prime location.`,
      daysAgo: 28,
    },
    ratings: [
      { userName: 'Meera Pillai',  score: 5, review: `Best luxury product in Chennai. VGN has never disappointed. Anna Nagar location is unbeatable.` },
      { userName: 'Arjun Singh',   score: 4, review: `Premium finishes, premium location. Worth every rupee for the right buyer.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Prestige Hillcrest',
    propertyType: 'APARTMENT',
    address: 'Sholinganallur, OMR, Chennai 600119',
    description: `Prestige Hillcrest is a smart premium residential project on OMR Sholinganallur, developed by the renowned Prestige Group. The project offers thoughtfully designed 3 BHK homes with dedicated workspace alcoves, a 50,000 sq ft clubhouse, sky gardens on alternate floors, and a dedicated EV charging hub for 100% of parking slots. Located steps from the Sholinganallur MRTS station.`,
    priceMin: 1_65_00_000,
    priceMax: 2_85_00_000,
    topic: {
      userName: 'Vikram Mehta',
      title: 'Prestige Hillcrest Sholinganallur – solid choice for OMR IT workers',
      content: `Prestige entering Sholinganallur is good news – the area needed a quality developer. The dedicated workspace alcoves are a genuinely useful WFH feature, not just cosmetic. EV charging for 100 percent parking is Chennai first – significant for future proofing. 3BHK at 1.75Cr on OMR is fair. The MRTS station connectivity to the city is the hidden advantage people overlook. Good project, Prestige brand makes it safe.`,
      daysAgo: 16,
    },
    ratings: [
      { userName: 'Vikram Mehta',  score: 4, review: `Prestige quality on OMR with EV charging and WFH features. Future proof buy.` },
      { userName: 'Kavya Reddy',   score: 4, review: `Good layout. Workspace alcove in 3BHK is genuinely well designed for home office setup.` },
      { userName: 'Amit Gupta',    score: 3, review: `OMR Sholinganallur gets flooded sometimes during rains. Check the project elevation before buying.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Olympia Opaline',
    propertyType: 'APARTMENT',
    address: 'Perambur, North Chennai 600011',
    description: `Olympia Opaline is a value-for-money residential project in Perambur, North Chennai, developed by Olympia Group. Offering well-proportioned 2 and 3 BHK apartments with contemporary finishes, the project includes a clubhouse, swimming pool, children's play area, and landscaped garden. Located in one of Chennai's most densely connected residential areas with Perambur railway station and upcoming Phase 2 metro.`,
    priceMin: 68_00_000,
    priceMax: 1_20_00_000,
    topic: {
      userName: 'Suresh Nair',
      title: 'Olympia Opaline Perambur – most affordable North Chennai option?',
      content: `Perambur is genuinely underrated for affordability and connectivity. The railway station makes it well connected to Chennai Central and Marina Beach area. Olympia is a known Chennai developer. The 2BHK at 68L is probably the most affordable new launch from a recognised developer in Chennai right now. Quality is standard, not luxury, but at this price that is expected. Good for first-time buyers or rental investment given the connectivity.`,
      daysAgo: 50,
    },
    ratings: [
      { userName: 'Suresh Nair',  score: 3, review: `Most affordable new project in Chennai from a known developer. Quality is standard, not premium.` },
      { userName: 'Priya Iyer',   score: 4, review: `Perambur railway connectivity is excellent. Good for rental investment in North Chennai.` },
    ],
  },

  // ── KOLKATA ──────────────────────────────────────────────────────────────
  {
    citySlug: 'kolkata',
    propertyName: 'Godrej Habitat',
    propertyType: 'APARTMENT',
    address: 'Anandapur, EM Bypass, Kolkata 700107',
    description: `Godrej Habitat is a premium residential launch in Anandapur on the EM Bypass, offering 2 and 3 BHK apartments with modern architecture and quality finishes. The project spans 8 acres with a 25,000 sq ft clubhouse, infinity pool, and over 30 amenities designed for urban professionals. Located on the EM Bypass with excellent connectivity to Ruby Hospital, Kasba, and Salt Lake IT hub.`,
    priceMin: 1_10_00_000,
    priceMax: 2_20_00_000,
    topic: {
      userName: 'Arjun Singh',
      title: 'Godrej Habitat Kolkata – premium brand entering EM Bypass',
      content: `Kolkata has not had many Godrej projects and this one is generating a lot of interest. Anandapur on EM Bypass is a genuinely good location – Ruby hospital nearby, Salt Lake IT hub 20 mins, and the metro development is improving accessibility. 2BHK at 1.1Cr is Kolkata premium market but Godrej quality at this price is competitive with local developers. Went to the launch event – RERA registered and Godrej track record speaks for itself.`,
      daysAgo: 45,
    },
    ratings: [
      { userName: 'Arjun Singh',     score: 5, review: `Godrej quality in Kolkata. EM Bypass location is excellent. Strong buy for the city.` },
      { userName: 'Rahul Sharma',    score: 4, review: `Kolkata needed this. Godrej standard of construction is noticeably higher than local builders.` },
      { userName: 'Ananya Krishnan', score: 4, review: `Anandapur location is ideal. Infinity pool is a first for this area. Good project.` },
    ],
  },
  {
    citySlug: 'kolkata',
    propertyName: 'PS Equinox',
    propertyType: 'APARTMENT',
    address: 'New Town Rajarhat, Kolkata 700156',
    description: `PS Equinox is a well-designed premium residential project in New Town Rajarhat by PS Group, Kolkata's most trusted developer. Offering 2 and 3 BHK residences in a contemporary tower with smart home integration and energy-efficient design, the project boasts a grand 40,000 sq ft clubhouse, rooftop observatory deck, yoga pavilion, and an indoor games floor. Located in Action Area 2 with direct metro connectivity.`,
    priceMin: 1_25_00_000,
    priceMax: 2_40_00_000,
    topic: {
      userName: 'Deepika Rajput',
      title: 'PS Equinox New Town – is New Town Rajarhat growing up?',
      content: `New Town has transformed in the past 5 years – from an empty planned city to a bustling IT and residential hub. Metro connectivity is a game changer. PS Group is Kolkata most reliable builder – no project stalling, on-time deliveries. Equinox at 1.3Cr for a 2BHK in New Town with metro access is genuinely competitive. The smart home integration is better than most – saw it in the demo unit. Rooftop observatory is a nice touch. Recommended for Kolkata buyers.`,
      daysAgo: 27,
    },
    ratings: [
      { userName: 'Deepika Rajput', score: 5, review: `PS Group never disappoints. New Town metro plus smart home equals best value in Kolkata right now.` },
      { userName: 'Vikram Mehta',   score: 4, review: `New Town is Kolkata fastest growing area. PS Equinox is the standout project there.` },
      { userName: 'Neha Agarwal',   score: 4, review: `Rooftop observatory is unique for Kolkata. Smart home features actually work well in the demo.` },
    ],
  },
  {
    citySlug: 'kolkata',
    propertyName: 'Ambuja Neotia Utalika',
    propertyType: 'APARTMENT',
    address: 'Mukundapur, EM Bypass, Kolkata 700099',
    description: `Ambuja Neotia Utalika is an iconic luxury residential destination on the EM Bypass at Mukundapur, developed by the prestigious Ambuja Neotia Group. The project offers lavish 3 and 4 BHK residences with panoramic views of the city skyline and the Ozone lakes. A 75,000 sq ft private members' club with spa, fine dining, gourmet deli, and an art gallery makes Utalika one of Kolkata's most exclusive addresses.`,
    priceMin: 2_10_00_000,
    priceMax: 4_80_00_000,
    topic: {
      userName: 'Meera Pillai',
      title: 'Ambuja Neotia Utalika – Kolkata most premium address?',
      content: `Ambuja Neotia is the gold standard in Kolkata luxury. Utalika is their flagship and the private members club model is genuinely differentiated – not something any other Kolkata project offers. Lake view 3BHK at 2.3Cr is at a premium but for Kolkata luxury this is justified. The spa, fine dining, and art gallery within the complex attract a certain clientele. For NRI Kolkatan buyers this is probably the most aspirational address available.`,
      daysAgo: 62,
    },
    ratings: [
      { userName: 'Meera Pillai',  score: 5, review: `Ambuja Neotia quality is unmatched in Kolkata. Utalika is the most complete luxury product in the city.` },
      { userName: 'Kavya Reddy',   score: 4, review: `Members club concept is unique. Lake view from upper floors is stunning. Best in Kolkata.` },
    ],
  },
  {
    citySlug: 'kolkata',
    propertyName: 'Merlin The One',
    propertyType: 'APARTMENT',
    address: 'Salt Lake Sector V, Kolkata 700091',
    description: `Merlin The One is a premium residential tower in Salt Lake Sector V, the heart of Kolkata's IT hub, developed by Merlin Group. Offering 2 and 3 BHK high-rise apartments with floor-to-ceiling glass, the project features a sky lounge on the 30th floor, rooftop jacuzzi, co-working cafe, and an enclosed sky garden. Located walking distance from multiple IT campuses, the DLF IT Park, and the Sector V metro station.`,
    priceMin: 1_40_00_000,
    priceMax: 2_60_00_000,
    topic: {
      userName: 'Rahul Sharma',
      title: 'Merlin The One Sector V – Kolkata first genuine work-live tower?',
      content: `Salt Lake Sector V IT hub concentration is Kolkata biggest advantage for tech workers. Merlin The One puts you walking distance from the office which is rare anywhere in India. The sky lounge and co-working cafe within the building is genuinely useful for remote/hybrid workers. 2BHK at 1.4Cr in Sector V is premium for Kolkata but the walk-to-work advantage is priceless. Floor-to-ceiling glass in a high-rise – electric bills might be higher though.`,
      daysAgo: 34,
    },
    ratings: [
      { userName: 'Rahul Sharma',  score: 4, review: `Walk to office from home is the USP. Best located IT-worker apartment in Kolkata.` },
      { userName: 'Suresh Nair',   score: 4, review: `Sky lounge on 30th floor is impressive. Sector V location is ideal for IT professionals.` },
      { userName: 'Priya Iyer',    score: 3, review: `Good product but Sector V gets congested. Check if your office is walkable or still needs a commute.` },
    ],
  },
  {
    citySlug: 'kolkata',
    propertyName: 'Hiland Woods',
    propertyType: 'APARTMENT',
    address: 'New Town Action Area III, Kolkata 700135',
    description: `Hiland Woods is a nature-infused residential township in New Town Action Area III, developed by Hiland Group – a trusted Kolkata brand known for thoughtful green projects. Spread across 18 acres with 2 and 3 BHK apartments, the project integrates 200 tree varieties within the campus. Features a lakeside clubhouse, bamboo grove walking trail, and organic kitchen garden for residents.`,
    priceMin: 88_00_000,
    priceMax: 1_60_00_000,
    topic: {
      userName: 'Rohan Joshi',
      title: 'Hiland Woods New Town – genuinely green or just marketing?',
      content: `Hiland group has always done greenery-focused projects in Kolkata – Hiland Park near Tollygunge is proof it works. Woods promises 200 tree varieties and the site visit showed they have already planted in Phase 1 blocks. 18 acres in New Town AA3 with real green cover is special. 2BHK at 90L is excellent value for a branded township. The bamboo grove and lakeside clubhouse are real features. For families wanting a quieter green environment this is the project.`,
      daysAgo: 21,
    },
    ratings: [
      { userName: 'Rohan Joshi',  score: 4, review: `Green cover is real, not just marketing. Hiland delivers on nature-themed promise.` },
      { userName: 'Arjun Singh',  score: 4, review: `Lakeside clubhouse is beautiful. 18-acre green township at this price is hard to find.` },
      { userName: 'Meera Pillai', score: 5, review: `Best green residential project in Kolkata. Bought a 3BHK for family. Very happy with the decision.` },
    ],
  },
]

async function main() {
  console.log('Seeding content...\n')

  const hash = await bcrypt.hash('Password@123', 10)
  const users: Record<string, string> = {}

  for (const u of USERS) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hash, role: 'USER' },
    })
    users[u.name] = created.id
    process.stdout.write(`  user: ${u.name}\n`)
  }

  const cities = await prisma.city.findMany({ where: { tier: 'METRO' } })
  const cityMap: Record<string, string> = Object.fromEntries(cities.map((c) => [c.slug, c.id]))
  console.log(`\nMetro cities found: ${cities.map((c) => c.name).join(', ')}\n`)

  let topics = 0, comments = 0, ratings = 0

  for (const p of PROPERTIES) {
    const cityId = cityMap[p.citySlug]
    if (!cityId) { console.warn(`City not found: ${p.citySlug}`); continue }

    const userId = users[p.topic.userName]
    if (!userId) continue

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
        metaTitle: `${p.propertyName} Review – ${cities.find((c) => c.id === cityId)?.name}`,
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

    console.log(`  [${p.citySlug}] ${p.propertyName} – ⭐ ${avg.toFixed(1)} (${allRatings.length} ratings)`)
  }

  console.log(`\nDone. Topics: ${topics} | Comments: ${comments} | Ratings: ${ratings}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
