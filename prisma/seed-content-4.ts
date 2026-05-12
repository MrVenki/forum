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

const USERS4 = [
  { name: 'Karthikeyan Subramanian',  email: 'karthikeyan.subramanian@gmail.com' },
  { name: 'Meenakshi Sundaram',       email: 'meenakshi.sundaram@gmail.com' },
  { name: 'Senthil Kumar Rajan',      email: 'senthil.kumar.rajan@gmail.com' },
  { name: 'Vijayalakshmi Narayanan',  email: 'vijayalakshmi.narayanan@gmail.com' },
  { name: 'Murugan Palaniswamy',      email: 'murugan.palaniswamy@gmail.com' },
  { name: 'Divya Krishnamurthy',      email: 'divya.krishnamurthy4@gmail.com' },
  { name: 'Ramachandran Venkatesh',   email: 'ramachandran.venkatesh@gmail.com' },
  { name: 'Anitha Balaji',            email: 'anitha.balaji@gmail.com' },
  { name: 'Thirumalai Arumugam',      email: 'thirumalai.arumugam@gmail.com' },
  { name: 'Kavitha Chandrasekaran',   email: 'kavitha.chandrasekaran@gmail.com' },
  { name: 'Balasubramaniam Iyer',     email: 'balasubramaniam.iyer@gmail.com' },
  { name: 'Nithya Gopalakrishnan',    email: 'nithya.gopalakrishnan@gmail.com' },
  { name: 'Selvam Ramasamy',          email: 'selvam.ramasamy@gmail.com' },
  { name: 'Preethi Sundaresan',       email: 'preethi.sundaresan@gmail.com' },
  { name: 'Jayakumar Suresh',         email: 'jayakumar.suresh@gmail.com' },
  { name: 'Revathi Annamalai',        email: 'revathi.annamalai@gmail.com' },
  { name: 'Ganesan Krishnan',         email: 'ganesan.krishnan@gmail.com' },
  { name: 'Saranya Muthukrishnan',    email: 'saranya.muthukrishnan@gmail.com' },
  { name: 'Elango Periyaswamy',       email: 'elango.periyaswamy@gmail.com' },
  { name: 'Sudha Raghunathan',        email: 'sudha.raghunathan@gmail.com' },
  { name: 'Arun Pandian',             email: 'arun.pandian@gmail.com' },
  { name: 'Lalitha Venkatraman',      email: 'lalitha.venkatraman@gmail.com' },
  { name: 'Vinoth Kumar Sekar',       email: 'vinoth.kumar.sekar@gmail.com' },
  { name: 'Pooja Subramaniam',        email: 'pooja.subramaniam4@gmail.com' },
  { name: 'Chelladurai Mani',         email: 'chelladurai.mani@gmail.com' },
  { name: 'Kowsalya Ravi',            email: 'kowsalya.ravi@gmail.com' },
  { name: 'Saravanan Muthu',          email: 'saravanan.muthu@gmail.com' },
  { name: 'Deepa Natarajan',          email: 'deepa.natarajan4@gmail.com' },
  { name: 'Vignesh Arjunan',          email: 'vignesh.arjunan@gmail.com' },
  { name: 'Rajalakshmi Shanmugam',    email: 'rajalakshmi.shanmugam@gmail.com' },
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

const PROPERTIES4: PropertyData[] = [
  {
    citySlug: 'chennai',
    propertyName: 'Godrej Nurture',
    propertyType: 'APARTMENT',
    address: 'Velachery Main Road, Chennai 600042',
    description: `Godrej Nurture is a premium residential project by Godrej Properties in Velachery, one of South Chennai's most mature and connected localities. Offering 2 and 3 BHK apartments across two towers, the project features a sky garden on the 22nd floor, a fully equipped clubhouse with a 25-metre lap pool, and a dedicated co-working zone for work-from-home residents. RERA registered TN/01/Building/0042/2024. Velachery's MRTS station, upcoming Phase 2 metro at Velachery junction, and direct access to OMR via the Taramani Link Road make this one of Chennai's best-connected residential locations. Possession expected Q2 2027.`,
    priceMin: 88_00_000,
    priceMax: 1_52_00_000,
    topic: {
      userName: 'Karthikeyan Subramanian',
      title: 'Godrej Nurture Velachery – sky garden towers in the heart of South Chennai?',
      content: `Spent a Sunday at the Godrej Nurture site office and came away impressed. Velachery is genuinely one of the best-connected localities in Chennai – MRTS right there, the metro Phase 2 at Velachery junction is under civil work now, and the Taramani Link Road gets you to OMR in 12 minutes. The sky garden concept on the 22nd floor is not a gimmick – Godrej showed similar delivery at their Mumbai and Pune projects. The sample flat finishes were Godrej standard – vitrified tiles without hollow spots, UPVC windows with good acoustic sealing, modular kitchen frame that felt solid. 2BHK at 88L in Velachery from Godrej with RERA TN/01/Building/0042/2024 is honest pricing. For IT folks in Taramani or Perungudi, this is a no-brainer location.`,
      daysAgo: 22,
    },
    ratings: [
      { userName: 'Meenakshi Sundaram',      score: 5, review: `Velachery MRTS and upcoming metro make this the best-connected south Chennai address. Godrej brand is a given.` },
      { userName: 'Senthil Kumar Rajan',     score: 5, review: `Sky garden on 22nd floor is a genuine feature – Godrej has delivered this in other cities. Worth the premium.` },
      { userName: 'Vijayalakshmi Narayanan', score: 4, review: `Co-working zone is a thoughtful addition. Post-pandemic WFH crowd will value this. Good practical planning.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Casagrand Azure',
    propertyType: 'APARTMENT',
    address: 'Adyar, Chennai 600020',
    description: `Casagrand Azure is a rare boutique luxury residential project by Casagrand Builder in Adyar, Chennai's most sought-after address for legacy residents and professionals. Offering only 48 units of 3 and 4 BHK apartments to preserve the exclusivity of the neighbourhood, the project features double-height entrance lobbies, Italian marble flooring in living areas, Kohler bathroom fittings, and a private residents' lounge. RERA registered TN/01/Building/0078/2024. Adyar's proximity to Besant Nagar beach, the Adyar Eco Park, premier schools like PSBB and SBOA, and IIT Madras makes this an enduring prestige address. Possession expected Q1 2027.`,
    priceMin: 2_40_00_000,
    priceMax: 3_90_00_000,
    topic: {
      userName: 'Murugan Palaniswamy',
      title: 'Casagrand Azure Adyar – 48-unit boutique in Chennai\'s best address, worth 2.4Cr?',
      content: `New launches in Adyar are extremely rare – the neighbourhood is fully built up and land is scarce. Casagrand Azure getting 48 units here is a genuine find. Visited the project site which is on a quiet lane off LB Road – you can walk to Adyar Eco Park in under 10 minutes. The model flat had Italian marble in the living room – smooth, no grout issues – and the Kohler fittings in the bathroom were the real ones, not display items. Casagrand has scaled up their product quality in recent years and Azure is their luxury arm. 3BHK at 2.4Cr in Adyar is actually underpriced compared to resale rates in the area. RERA TN/01/Building/0078/2024 is filed. Only 48 units means this will move fast.`,
      daysAgo: 18,
    },
    ratings: [
      { userName: 'Divya Krishnamurthy',   score: 5, review: `Adyar new launch is almost impossible to find. 48 units in this neighbourhood – will book within the month.` },
      { userName: 'Ramachandran Venkatesh',score: 5, review: `Italian marble and Kohler in the model flat are the actual products. Casagrand Azure is not cutting corners.` },
      { userName: 'Anitha Balaji',         score: 4, review: `PSBB and Adyar Eco Park walking distance. For Chennai families this address says everything. Fair at 2.4Cr.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Shriram Greenfield',
    propertyType: 'APARTMENT',
    address: 'Moulivakkam, Porur, Chennai 600116',
    description: `Shriram Greenfield is a mid-segment residential township by Shriram Properties in Moulivakkam, Porur, offering 2 and 3 BHK apartments across 14 acres with 70% open space. RERA registered TN/29/Building/0112/2024. The project is designed around a large central garden with a 500-metre walking trail, a 4,000 sq ft clubhouse, and dedicated children's zones. Moulivakkam is strategically located at the intersection of Porur and Kundrathur, with direct access to the Chennai Bypass, Mount-Poonamallee Road, and the upcoming Outer Ring Road Phase 2. Possession expected Q3 2027. Shriram Properties is one of South India's most trusted developers with a 25-year delivery track record.`,
    priceMin: 72_00_000,
    priceMax: 1_15_00_000,
    topic: {
      userName: 'Thirumalai Arumugam',
      title: 'Shriram Greenfield Moulivakkam – west Chennai township at 72L, genuine value?',
      content: `West Chennai has been underrated for years but Porur-Moulivakkam is now seeing serious infrastructure push. The Chennai Bypass is right there, Mount-Poonamallee Road connects you to Koyambedu in 20 minutes, and the ORR Phase 2 alignment passes through this belt. Shriram Greenfield is 14 acres and 70% open space is a real number – you can see the plot boundaries on the RERA document. Visited the site on a weekday and the construction is already at slab level for Tower 1. Shriram Properties has been building in Chennai for over two decades and I have visited two of their delivered projects – Greenfield quality will be on par. 2BHK at 72L in Moulivakkam is competitive. RERA TN/29/Building/0112/2024 filed.`,
      daysAgo: 31,
    },
    ratings: [
      { userName: 'Kavitha Chandrasekaran', score: 4, review: `Moulivakkam's bypass access is genuinely useful. 14 acres with 70% open space is hard to find at this price.` },
      { userName: 'Balasubramaniam Iyer',   score: 5, review: `Shriram delivery track record in Chennai is strong. Greenfield on a 14-acre campus at 72L is compelling.` },
      { userName: 'Nithya Gopalakrishnan',  score: 4, review: `The ORR Phase 2 alignment will change this micro-market significantly. Early mover advantage here.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'TVS Emerald Aaranya',
    propertyType: 'APARTMENT',
    address: 'Manapakkam, Chennai 600125',
    description: `TVS Emerald Aaranya is a nature-themed premium residential project by TVS Emerald in Manapakkam, offering 2 and 3 BHK apartments with generous floor plates and full cross-ventilation in all units. RERA registered TN/01/Building/0055/2024. Manapakkam is one of West Chennai's fastest-growing residential corridors, well-connected to Guindy Industrial Estate, St. Thomas Mount Metro, and the outer ring road network via Ramapuram junction. The project features a 25,000 sq ft forest-themed clubhouse, a 200-metre nature trail, and a dedicated senior citizen's garden. TVS Group's engineering precision is evident across their delivered portfolio. Possession expected Q4 2026.`,
    priceMin: 85_00_000,
    priceMax: 1_38_00_000,
    topic: {
      userName: 'Selvam Ramasamy',
      title: 'TVS Emerald Aaranya Manapakkam – west Chennai quiet pocket with Q4 2026 possession?',
      content: `Manapakkam is a bit under the radar but it should not be. St. Thomas Mount Metro is 15 minutes, Guindy is close, and Ramapuram junction connects you everywhere. TVS Emerald Aaranya feels different from most projects – the floor plates are larger than what's standard, cross-ventilation is not just a term in the brochure, both bedrooms get natural light. The 200-metre nature trail is a proper greenery walkway, I walked the layout during the site visit. TVS Group builds with manufacturing discipline – tolerances, finishes, materials are all better than the average developer. 2BHK at 85L in Manapakkam for Q4 2026 possession with TVS brand – that's a solid combination. RERA TN/01/Building/0055/2024 is filed.`,
      daysAgo: 27,
    },
    ratings: [
      { userName: 'Preethi Sundaresan', score: 5, review: `TVS engineering precision shows in the floor plans – no odd angles, no wasted square footage. Exactly right.` },
      { userName: 'Jayakumar Suresh',   score: 4, review: `Q4 2026 possession is near term with TVS track record. Manapakkam connectivity to Guindy and ORR is underrated.` },
      { userName: 'Revathi Annamalai',  score: 4, review: `The nature trail and senior citizen's garden make this genuinely family-friendly. Not just amenity checkboxes.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'VGN Nxt Guindy',
    propertyType: 'APARTMENT',
    address: 'Guindy, Chennai 600032',
    description: `VGN Nxt Guindy is a premium urban residential project by VGN Developers in Guindy, offering 2 and 3 BHK apartments with contemporary design and efficient layouts. RERA registered TN/01/Building/0091/2024. Guindy is Chennai's central business district backbone – home to the SIDCO industrial estate, the Tamil Nadu secretariat complex, and the Guindy National Park. The project benefits from direct access to Guindy Metro, the MRTS, and the southern expressway. VGN Nxt features a sky lounge on the top floor, double-height lobby, rooftop swimming pool, and a residents' co-working centre. VGN Group has over 40 years of construction excellence in Chennai. Possession expected Q1 2027.`,
    priceMin: 1_12_00_000,
    priceMax: 1_78_00_000,
    topic: {
      userName: 'Ganesan Krishnan',
      title: 'VGN Nxt Guindy – rooftop pool and metro access in Chennai CBD at 1.12Cr?',
      content: `Guindy doesn't get enough attention as a residential location but it should. You have the Guindy Metro, MRTS, the national park literally next door, and you're equidistant from OMR and Mount Road. VGN Nxt is positioned well for professionals who want central Chennai living. The sky lounge on the top floor has a rooftop pool – I've seen the design renders and the floor itself has panoramic city views. VGN Group has been building in Chennai for 40 years and their quality is very consistent. 2BHK at 1.12Cr in Guindy from VGN with RERA TN/01/Building/0091/2024 – honestly this feels fair given the location. The co-working centre is a bonus for WFH folks who don't need a full office setup.`,
      daysAgo: 14,
    },
    ratings: [
      { userName: 'Saranya Muthukrishnan', score: 5, review: `Guindy Metro access plus Guindy National Park next door. Urban living with green lungs – rare combination.` },
      { userName: 'Elango Periyaswamy',    score: 4, review: `VGN 40-year track record means zero anxiety about delivery. Rooftop pool in Guindy is a genuine premium.` },
      { userName: 'Sudha Raghunathan',     score: 4, review: `MRTS and metro both accessible. For MNC workers in Guindy SEC this is a 10-minute commute flat.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Casagrand Bloom',
    propertyType: 'APARTMENT',
    address: 'Chromepet, Chennai 600044',
    description: `Casagrand Bloom is a well-planned residential project by Casagrand Builder in Chromepet, offering 2 and 3 BHK apartments with smart home automation features at an accessible price point. RERA registered TN/29/Building/0134/2024. Chromepet is a mature South Chennai locality with direct connectivity to Chennai Airport (12 km), the GST Road IT corridor, and the Chromepet MRTS station. The project features a 5,000 sq ft clubhouse, a temperature-controlled swimming pool, and a landscaped roof deck. Smart home features include app-controlled lighting, video door phone, and remote access door lock as standard. Possession expected Q2 2027.`,
    priceMin: 65_00_000,
    priceMax: 98_00_000,
    topic: {
      userName: 'Arun Pandian',
      title: 'Casagrand Bloom Chromepet – smart home features under 1Cr near the airport?',
      content: `Chromepet is unfairly dismissed by some buyers who say it's too far south but the numbers don't lie – airport in 12 km, GST Road IT companies reachable, Chromepet MRTS connects to the city. Casagrand Bloom's smart home package surprised me. App-controlled lighting, video door phone, and remote door lock come standard – not as an expensive upgrade. Usually these features push the price up by 5-8L but Casagrand has baked it in at 65L. Visited the site office – construction is at 3rd floor for Tower A. The temperature-controlled pool is a good addition for the summer heat. For airport frequent flyers and GST Road IT workers, Chromepet and this price point make strong sense. RERA TN/29/Building/0134/2024 filed.`,
      daysAgo: 40,
    },
    ratings: [
      { userName: 'Arun Pandian',       score: 5, review: `Smart home standard features at 65L – I checked other projects and this spec costs 8-10L extra elsewhere.` },
      { userName: 'Lalitha Venkatraman', score: 4, review: `Chromepet MRTS and airport proximity make this ideal for NRI buyers wanting low-maintenance city investment.` },
      { userName: 'Vinoth Kumar Sekar',  score: 4, review: `Temperature-controlled pool in Chennai summer heat is not a luxury, it's necessary. Casagrand gets it.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Arihant Suvarna',
    propertyType: 'APARTMENT',
    address: 'Urapakkam, Chennai 603210',
    description: `Arihant Suvarna is an affordable premium residential township by Arihant Foundations in Urapakkam, offering 2 and 3 BHK apartments in a gated 10-acre campus with over 30 amenities. RERA registered TN/29/Building/0188/2024. Urapakkam on the GST Road is one of South Chennai's most rapidly developing corridors, with the Urapakkam suburban railway station providing direct trains to Chennai Central and the upcoming light rail to Tambaram. The project features a large clubhouse, cricket turf, jogging track, and multiple sports courts. Arihant is South India's most prolific affordable housing developer. Possession expected Q3 2027.`,
    priceMin: 52_00_000,
    priceMax: 82_00_000,
    topic: {
      userName: 'Chelladurai Mani',
      title: 'Arihant Suvarna Urapakkam – 10-acre affordable township under 85L, too good?',
      content: `I have been following Arihant projects for a few years now because they consistently deliver value in South Chennai. Suvarna in Urapakkam is one of their better-planned projects. The 10-acre campus has cricket turf – real surface, not just nets – which is rare at this price. Urapakkam suburban railway gives direct trains to Chennai Central and the GST Road IT companies are reachable by road in 20 minutes. The 2BHK at 52L is the entry price. Quality is honest – not luxury finishes but well-constructed, durable materials. I visited an Arihant project they delivered in Chromepet and the build quality held up well. For first-time buyers or investment buyers in South Chennai, this is probably the most value per rupee currently. RERA TN/29/Building/0188/2024 filed.`,
      daysAgo: 36,
    },
    ratings: [
      { userName: 'Kowsalya Ravi',     score: 4, review: `Arihant delivers. Visited their Chromepet project and the quality matches the price well. Suvarna will be similar.` },
      { userName: 'Saravanan Muthu',   score: 4, review: `Cricket turf in the campus at this price is a genuine differentiator. South Chennai families will love it.` },
      { userName: 'Deepa Natarajan',   score: 4, review: `Urapakkam railway is underrated. Direct to Chennai Central in 40 minutes. Office commute sorted.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Provident Sunworth',
    propertyType: 'APARTMENT',
    address: 'Paranur, GST Road, Chennai 603110',
    description: `Provident Sunworth is a large integrated township by Provident Housing (a Puravankara Group company) in Paranur on the GST Road, offering 2 and 3 BHK apartments in a 40-acre campus with a 2-acre central park. RERA registered TN/29/Building/0201/2024. Paranur's strategic location on the GST Road places it midway between Chennai Airport and the Mahindra World City industrial hub. The project features a cricket ground, a 20,000 sq ft super-clubhouse, 5 km of internal cycling track, and an amphitheatre. Provident Housing has an excellent delivery track record across Bengaluru, Hyderabad, and now expanding in Chennai. Possession expected Q1 2028.`,
    priceMin: 49_00_000,
    priceMax: 78_00_000,
    topic: {
      userName: 'Vignesh Arjunan',
      title: 'Provident Sunworth Paranur – 40-acre GST Road township under 80L from Puravankara group?',
      content: `Paranur is at the sweet spot on the GST Road – close enough to the airport but far enough to get genuine land for a real township. Provident Sunworth at 40 acres is a proper township, not a project that calls itself one. The 2-acre central park is a real green space I could see from the site boundary. The cricket ground is laid out, 5 km cycling track would be a genuine daily use amenity for families. Provident Housing is backed by Puravankara Group which has strong delivery credentials in Bangalore. Chennai is a new market for them but they are bringing the same township formula that worked in Electronic City and Whitefield. 2BHK at 49L for a Puravankara group township on GST Road with RERA TN/29/Building/0201/2024 – I think this will be one of the best returns in South Chennai.`,
      daysAgo: 19,
    },
    ratings: [
      { userName: 'Rajalakshmi Shanmugam', score: 5, review: `Puravankara Group brings Bangalore township quality to Chennai GST Road. 40 acres at 49L entry is exceptional.` },
      { userName: 'Karthikeyan Subramanian', score: 4, review: `Mahindra World City proximity and airport access – ideal for professionals in the GST Road industrial belt.` },
      { userName: 'Meenakshi Sundaram',    score: 4, review: `5 km cycling track inside the campus is a family wellness feature that most projects just claim and don't deliver.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Appaswamy Palladio',
    propertyType: 'APARTMENT',
    address: 'Ramapuram, Chennai 600089',
    description: `Appaswamy Palladio is a premium residential project by Appaswamy Real Estates in Ramapuram, offering 3 and 4 BHK apartments with large floor plates of 1,600 to 2,400 sq ft. RERA registered TN/01/Building/0067/2024. Ramapuram is one of West Chennai's most established residential corridors, situated between Porur and Valasaravakkam with direct access to the Koyambedu wholesale market hub and the Mount-Poonamallee Road. Appaswamy is one of Chennai's original premium builders with a four-decade presence and a portfolio of landmark projects in Adyar, Nungambakkam, and Kilpauk. Palladio's features include a private elevator lobby for each floor, a rooftop entertainment deck, and a semi-Olympic swimming pool. Possession expected Q3 2026.`,
    priceMin: 1_55_00_000,
    priceMax: 2_65_00_000,
    topic: {
      userName: 'Senthil Kumar Rajan',
      title: 'Appaswamy Palladio Ramapuram – 3BHK at 1.55Cr from Chennai\'s oldest premium builder?',
      content: `Appaswamy's name in Chennai carries real weight – they built Ceebros Centre in Nungambakkam, several projects in Adyar, and their quality has never disappointed. Palladio in Ramapuram is their west Chennai play and the floor plates at 1,600 sq ft for a 3BHK are generous – that's actual space, not a tight 3BHK with no dining room. The private elevator lobby per floor is a genuine luxury feature, not available in most projects even at this price. Ramapuram location is practical – Koyambedu is 15 minutes, Porur junction connects you to OMR and Guindy. Q3 2026 possession is near term and Appaswamy has delivered on time consistently. For west Chennai families wanting genuine large-format premium homes, Palladio is rare. RERA TN/01/Building/0067/2024 filed.`,
      daysAgo: 24,
    },
    ratings: [
      { userName: 'Vijayalakshmi Narayanan', score: 5, review: `Appaswamy never compromises on build quality. Four decades in Chennai and zero reputation issues. Book with confidence.` },
      { userName: 'Murugan Palaniswamy',     score: 5, review: `1,600 sq ft 3BHK at 1.55Cr in Ramapuram – generous proportions from an honest developer. Rare find.` },
      { userName: 'Divya Krishnamurthy',     score: 4, review: `Private elevator lobby per floor is the real luxury. Visited their Adyar project to verify build quality – very solid.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Olympia Marvella',
    propertyType: 'APARTMENT',
    address: 'Padur, OMR Phase 2, Chennai 603103',
    description: `Olympia Marvella is a township-scale residential project by Olympia Group in Padur on OMR Phase 2, offering 2 and 3 BHK apartments across 22 acres with 65% open space. RERA registered TN/29/Building/0222/2024. Padur sits at the junction of OMR Phase 2 and the Pallikaranai link road, providing direct connectivity to the Sholinganallur IT corridor and the upcoming OMR elevated road. The project features a 1.5 km internal jogging track, a 30,000 sq ft mega-clubhouse, multiple sports courts, and a children's aqua park. Olympia Group has been building in Chennai for over three decades with a portfolio of over 20 million sq ft delivered. Possession expected Q4 2027.`,
    priceMin: 68_00_000,
    priceMax: 1_08_00_000,
    topic: {
      userName: 'Ramachandran Venkatesh',
      title: 'Olympia Marvella Padur OMR – 22-acre township at the OMR Phase 2 sweet spot?',
      content: `Padur has been on my watchlist for a while. It sits at the exact junction of OMR Phase 2 and the Pallikaranai link – from here you can reach Sholinganallur IT hub in under 15 minutes and the Perungudi side in 25 minutes. The OMR elevated road when complete will make this even better. Olympia Marvella at 22 acres is a real township – visited the site and the 65% open space claim is verifiable from the layout. The children's aqua park is a feature I haven't seen at this price before. Olympia has delivered 20 million sq ft in Chennai – that is a track record that removes most of the developer risk. 2BHK at 68L on OMR Phase 2 in a genuine township is solid value. RERA TN/29/Building/0222/2024 filed.`,
      daysAgo: 33,
    },
    ratings: [
      { userName: 'Anitha Balaji',        score: 5, review: `Olympia 20 million sq ft delivered is the strongest track record on OMR. Marvella location at Padur junction is ideal.` },
      { userName: 'Thirumalai Arumugam',  score: 4, review: `Children's aqua park inside the campus – parents with young kids will find this very hard to walk away from.` },
      { userName: 'Kavitha Chandrasekaran',score: 4, review: `OMR elevated road alignment passes nearby. Early mover advantage on this corridor is real. Good timing.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Casagrand Fiona',
    propertyType: 'APARTMENT',
    address: 'Thalambur, OMR Phase 2, Chennai 600130',
    description: `Casagrand Fiona is a gated residential community by Casagrand Builder in Thalambur on OMR Phase 2, offering 2 and 3 BHK apartments with an emphasis on wellness amenities. RERA registered TN/29/Building/0241/2024. Thalambur is a rapidly developing node on OMR Phase 2 with proximity to IT companies like HCL, Cognizant, and TCS in the Navallur-Sholinganallur belt. The project features an open-air yoga lawn, a reflexology walkway, a temperature-controlled rooftop pool, and an Ayurveda centre. Casagrand has over 18,000 homes delivered across Chennai making them the city's most experienced residential developer. Possession expected Q2 2027.`,
    priceMin: 60_00_000,
    priceMax: 92_00_000,
    topic: {
      userName: 'Balasubramaniam Iyer',
      title: 'Casagrand Fiona Thalambur – OMR Phase 2 wellness focus project under 1Cr?',
      content: `I have been tracking OMR Phase 2 for investment and Thalambur is now clearly on the growth path. HCL and Cognizant campuses are a short ride away and Sholinganallur IT belt is under 20 minutes. Casagrand Fiona's wellness angle is interesting – yoga lawn, reflexology walkway, and Ayurveda centre are not just brochure items. Visited another Casagrand project in Sholinganallur and the amenities they show at launch are what you get on possession. The rooftop pool with temperature control is genuinely useful in Chennai climate. Casagrand 18,000 homes delivered is a number that speaks for itself. 2BHK at 60L in Thalambur for a wellness-themed project with RERA TN/29/Building/0241/2024 – good buy for IT professionals who want south OMR living with a slightly more relaxed pace.`,
      daysAgo: 28,
    },
    ratings: [
      { userName: 'Nithya Gopalakrishnan', score: 4, review: `Ayurveda centre in the clubhouse is unusual and welcome. Casagrand wellness focus is different from the usual gym+pool.` },
      { userName: 'Selvam Ramasamy',       score: 5, review: `18,000 homes delivered by Casagrand – no other Chennai builder comes close. Fiona is a safe investment.` },
      { userName: 'Preethi Sundaresan',    score: 4, review: `Thalambur will benefit from the OMR signal-free corridor project. Prices here will jump in 2-3 years.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'VGN Centreville',
    propertyType: 'APARTMENT',
    address: 'Koyambedu, Chennai 600107',
    description: `VGN Centreville is an urban luxury residential project by VGN Developers in Koyambedu, offering 2, 3, and 4 BHK apartments in a high-rise format with panoramic city views. RERA registered TN/01/Building/0083/2024. Koyambedu is Chennai's central transit hub – home to the CMBT bus terminal, Koyambedu Wholesale Market, and the Koyambedu Metro station on the Blue Line. VGN Centreville features a double-height sky lobby on the 18th floor, a glass-front rooftop lounge, infinity pool, and fully integrated smart home systems. Koyambedu's connectivity to all parts of Chennai via metro, suburban rail, and express highways makes this an investor's dream location. Possession expected Q2 2027.`,
    priceMin: 1_22_00_000,
    priceMax: 2_10_00_000,
    topic: {
      userName: 'Jayakumar Suresh',
      title: 'VGN Centreville Koyambedu – metro-adjacent luxury tower in Chennai\'s busiest transit hub?',
      content: `Koyambedu has always been busy but the metro changed it fundamentally – you can now reach Anna Nagar, CMBT, Alandur, and the airport from here without touching road traffic. VGN Centreville at Koyambedu is banking on this transit advantage. The sky lobby on the 18th floor in the renders looks genuinely impressive. VGN's quality is well established over 40 years. The 2BHK at 1.22Cr is on the premium side for Koyambedu but you're paying for a high-rise with metro at the doorstep and VGN build quality. Visited the site – foundation work is complete and tower structure has started. RERA TN/01/Building/0083/2024 is filed. For rental investors this location will command premium rents given metro access and the central bus hub.`,
      daysAgo: 16,
    },
    ratings: [
      { userName: 'Revathi Annamalai',  score: 5, review: `Koyambedu Metro makes this accessible to the entire Chennai metro network. Rental yields here will be very strong.` },
      { userName: 'Ganesan Krishnan',   score: 5, review: `VGN 40-year brand with infinity pool and sky lobby in Koyambedu. Premium but justified by transit location.` },
      { userName: 'Saranya Muthukrishnan',score: 4, review: `Panoramic city views from a high-rise over Koyambedu during the day are spectacular – checked the drone footage.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Shriram Park Uno',
    propertyType: 'APARTMENT',
    address: 'Thirumazhisai, Chennai 600124',
    description: `Shriram Park Uno is a value residential project by Shriram Properties in Thirumazhisai, offering 2 and 3 BHK apartments with practical layouts designed for nuclear families. RERA registered TN/01/Building/0097/2024. Thirumazhisai is located on the Poonamallee High Road with excellent access to the Chennai Bypass, the upcoming Outer Ring Road, and Porur junction. The project features a 4,500 sq ft clubhouse, terrace garden, jogging track, and children's science-themed play park. The area is seeing infrastructure push from the Tamil Nadu government's west Chennai development programme. Possession expected Q1 2027.`,
    priceMin: 67_00_000,
    priceMax: 1_02_00_000,
    topic: {
      userName: 'Elango Periyaswamy',
      title: 'Shriram Park Uno Thirumazhisai – ORR-adjacent west Chennai buy under 1Cr?',
      content: `Thirumazhisai is in an interesting position. It's on the Poonamallee High Road which is an arterial route, the ORR runs close by, and the Tamil Nadu government west Chennai development programme has earmarked this belt for infrastructure focus. Shriram Park Uno takes advantage of this. The children's science-themed play park is a fresh idea – my nephew visited a similar Shriram amenity in their Bengaluru project and kids genuinely engage with it. Layouts are practical – the 2BHK has a proper utility area which most small apartments skip. At 67L entry price with Shriram brand and RERA TN/01/Building/0097/2024 filed, this is an honest mid-segment buy. The ORR proximity will boost resale values as west Chennai develops.`,
      daysAgo: 42,
    },
    ratings: [
      { userName: 'Sudha Raghunathan',   score: 4, review: `Science-themed children's play park is a fresh idea. Most projects do the same slide-and-swing – this is different.` },
      { userName: 'Arun Pandian',        score: 4, review: `Thirumazhisai on the Poonamallee High Road with ORR access – west Chennai growth trajectory makes this a buy.` },
      { userName: 'Lalitha Venkatraman', score: 4, review: `Shriram delivery record in Chennai is strong. Park Uno layouts are honest – no fake dining areas or hollow corners.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Godrej Splendour',
    propertyType: 'APARTMENT',
    address: 'Oragadam, Chennai 602105',
    description: `Godrej Splendour is a township residential project by Godrej Properties in Oragadam, offering 1, 2, and 3 BHK apartments in a 28-acre campus targeting professionals in the Oragadam Industrial Corridor. RERA registered TN/29/Building/0265/2024. The Oragadam Industrial Corridor hosts manufacturing facilities of Daimler, Renault-Nissan, Apollo Tyres, Mahindra, and Komatsu, making it one of South India's largest industrial clusters. Godrej Splendour features 60+ amenities including an outdoor amphitheatre, a sports complex with synthetic cricket pitch, and a 1 km lake-front walking trail. Possession expected Q3 2028. Godrej Properties is one of India's most trusted publicly listed real estate companies.`,
    priceMin: 45_00_000,
    priceMax: 76_00_000,
    topic: {
      userName: 'Vinoth Kumar Sekar',
      title: 'Godrej Splendour Oragadam – listed developer township for the industrial corridor at 45L?',
      content: `Oragadam is Chennai's industrial powerhouse – Renault-Nissan, Daimler, Apollo Tyres are all here. The workforce of tens of thousands needs quality housing and most of what's available is mediocre. Godrej Splendour changes that. 28 acres with a lake-front walking trail and 60+ amenities from Godrej at 45L entry is a genuinely compelling offer for the industrial belt workforce. Godrej Properties is a listed company with full transparency – RERA TN/29/Building/0265/2024 filed and their construction timelines are publicly disclosed. Visited the site – it's a large campus and the lake frontage is real. Q3 2028 possession is two years out but with Godrej that timeline is reliable. For Oragadam factory managers and mid-level executives, this is the first premium option in their backyard.`,
      daysAgo: 50,
    },
    ratings: [
      { userName: 'Pooja Subramaniam',    score: 5, review: `Godrej listed company transparency plus 28-acre campus in Oragadam. Factory professionals finally have a proper option.` },
      { userName: 'Chelladurai Mani',     score: 4, review: `Lake-front walking trail and cricket pitch in Oragadam at 45L entry – this will be oversubscribed quickly.` },
      { userName: 'Kowsalya Ravi',        score: 4, review: `Renault-Nissan and Daimler employees on steady salaries – Oragadam rental demand is very consistent. Good investment.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'TVS Emerald Park One',
    propertyType: 'APARTMENT',
    address: 'Tambaram West, Chennai 600045',
    description: `TVS Emerald Park One is a residential project by TVS Emerald in Tambaram West, offering 2 and 3 BHK apartments with generous open spaces in a 9-acre campus. RERA registered TN/29/Building/0179/2024. Tambaram is one of South Chennai's most established and self-sufficient localities, with excellent connectivity via the Southern suburban railway to Chennai Central, proximity to Chromepet GST Road corridor, and the St. Thomas Mount MRTS. The project features a park-themed campus with a 400-metre paved walking loop, a fully equipped gym, multi-sport court, and a children's splash pad. TVS Emerald's engineering lineage ensures above-standard build quality. Possession expected Q4 2026.`,
    priceMin: 62_00_000,
    priceMax: 95_00_000,
    topic: {
      userName: 'Saravanan Muthu',
      title: 'TVS Emerald Park One Tambaram – Q4 2026 delivery from TVS at 62L for an established suburb?',
      content: `Tambaram is one of the most self-sufficient suburbs in Chennai – market, schools, hospitals, railway, everything is there. It's not glamorous but it's practical. TVS Emerald Park One suits this character – a clean, well-designed project with honest specs. The 400-metre paved walking loop inside a 9-acre campus is a genuine amenity, not just a line item. Children's splash pad is thoughtful for the summer. TVS build quality is their manufacturing heritage – the structural finish in their projects is consistently better than the average developer in this price range. Q4 2026 possession means your wait is under 2 years. At 62L from TVS in established Tambaram with RERA TN/29/Building/0179/2024, this is a low-risk, practical buy for south Chennai families.`,
      daysAgo: 38,
    },
    ratings: [
      { userName: 'Saravanan Muthu',      score: 5, review: `TVS engineering in a practical Tambaram location. No-nonsense project for south Chennai families. Exactly right.` },
      { userName: 'Deepa Natarajan',      score: 4, review: `Tambaram railway frequency to Chennai Central is very good. Commuting professionals will value this access.` },
      { userName: 'Vignesh Arjunan',      score: 4, review: `Splash pad and walking loop are genuine family amenities. Q4 2026 from TVS – worth waiting for.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Casagrand Sterling',
    propertyType: 'APARTMENT',
    address: 'Kodambakkam, Chennai 600024',
    description: `Casagrand Sterling is a boutique premium residential project by Casagrand Builder in Kodambakkam, offering 3 and 4 BHK apartments in an exclusive 36-unit development to preserve the low-density character of the neighbourhood. RERA registered TN/01/Building/0044/2024. Kodambakkam is one of Chennai's inner-city residential neighbourhoods with proximity to iconic entertainment studios, the Valluvar Kottam cultural centre, and direct connectivity to T. Nagar and Nungambakkam. The project features a private terrace for each unit, a residents-only sky lounge with city views, and premium Gessi bathroom fittings as standard. Possession expected Q4 2026.`,
    priceMin: 1_72_00_000,
    priceMax: 2_85_00_000,
    topic: {
      userName: 'Rajalakshmi Shanmugam',
      title: 'Casagrand Sterling Kodambakkam – 36-unit boutique with private terraces in central Chennai?',
      content: `Kodambakkam is not a name you hear in new launch conversations often but it should be – central Chennai, T. Nagar adjacent, good schools, Valluvar Kottam nearby for morning walks. Casagrand Sterling with only 36 units is about as boutique as you get in Chennai from a large developer. Private terrace for each unit is the standout feature – it's an actual private outdoor space, not a shared roof. The sky lounge has city views towards the ocean side on clear mornings. Gessi bathroom fittings in the sample flat were striking – the brand is comparable to Kohler at the premium end. 3BHK at 1.72Cr in Kodambakkam with this spec and just 36 units means this will sell out well before possession. RERA TN/01/Building/0044/2024 filed. Casagrand stepping into this kind of boutique play shows their ambition.`,
      daysAgo: 21,
    },
    ratings: [
      { userName: 'Rajalakshmi Shanmugam', score: 5, review: `36 units, private terraces, Gessi fittings in Kodambakkam. Casagrand boutique play is exceptional for central Chennai.` },
      { userName: 'Karthikeyan Subramanian',score: 5, review: `Central Chennai inner-city boutique with private outdoor space – this is the product the premium market has been waiting for.` },
      { userName: 'Meenakshi Sundaram',    score: 4, review: `T. Nagar walking distance and inner-city feel with gated privacy. Kodambakkam Sterling will hold value strongly.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Brigade Atmosphere',
    propertyType: 'APARTMENT',
    address: 'Singaperumal Koil, GST Road, Chennai 603204',
    description: `Brigade Atmosphere is a large residential township by Brigade Group in Singaperumal Koil on the GST Road, offering 2 and 3 BHK apartments in a 52-acre campus designed for suburban family living. RERA registered TN/29/Building/0312/2024. Singaperumal Koil is a fast-developing node on the GST Road, approximately 35 km from Chennai city with direct access to Mahindra World City SEZ, the upcoming Chennai-Bengaluru Expressway, and the Singaperumal Koil suburban railway station. Brigade Atmosphere features a 75,000 sq ft clubhouse, a full cricket ground, 2-acre central lake, 3 km internal road network, and a dedicated school site within the campus. Brigade Group is a Bengaluru-based developer bringing their proven township model to Chennai's southern periphery. Possession expected Q2 2028.`,
    priceMin: 54_00_000,
    priceMax: 85_00_000,
    topic: {
      userName: 'Pooja Subramaniam',
      title: 'Brigade Atmosphere Singaperumal Koil – Bangalore-style 52-acre township hits Chennai GST Road?',
      content: `Brigade Group's Chennai entry has been anticipated for a while and they've chosen Singaperumal Koil on the GST Road for a big bet. 52 acres is a genuine township scale – their Xanadu in Mogappair was 12 acres and this is more than 4x that. The 2-acre central lake is real, I could see the water body when I visited the site. Cricket ground with proper boundary markings, 75,000 sq ft clubhouse – these are numbers that Brigade has delivered in Bengaluru. The dedicated school site within the campus is significant – it means a school will come to residents rather than having to commute for school runs. Singaperumal Koil suburban railway is there and the upcoming Chennai-Bengaluru Expressway interchange is close. 2BHK at 54L for a Brigade township on GST Road with RERA TN/29/Building/0312/2024 – this is the Brigade township formula at the most accessible price in South India right now.`,
      daysAgo: 29,
    },
    ratings: [
      { userName: 'Senthil Kumar Rajan',     score: 5, review: `Brigade township formula proven in Bengaluru now in Chennai GST Road. 52 acres at 54L entry – must see project.` },
      { userName: 'Vijayalakshmi Narayanan', score: 5, review: `Dedicated school site within the campus is a massive differentiator for families. Brigade thought of everything.` },
      { userName: 'Murugan Palaniswamy',     score: 4, review: `Chennai-Bengaluru Expressway interchange nearby will make Singaperumal Koil a key GST Road node very soon.` },
    ],
  },
  {
    citySlug: 'chennai',
    propertyName: 'Prestige Misty Waters',
    propertyType: 'APARTMENT',
    address: 'Karapakkam, OMR Phase 2, Chennai 600097',
    description: `Prestige Misty Waters is a premium residential project by Prestige Group in Karapakkam on OMR Phase 2, offering 2 and 3 BHK apartments with water-feature-led design centred around a 1.2-acre lake and waterfall entry experience. RERA registered TN/29/Building/0289/2024. Karapakkam sits between the established Sholinganallur IT cluster and the rapidly growing Perungudi belt, placing residents within 15-20 minutes of major IT parks on both sides of OMR. Prestige Misty Waters features a lake-facing clubhouse, water-theme swimming lagoon, infinity deck over the lake, and an all-day café within the campus. Prestige Group's build quality and delivery record are among the strongest in Indian real estate. Possession expected Q3 2027.`,
    priceMin: 88_00_000,
    priceMax: 1_42_00_000,
    topic: {
      userName: 'Divya Krishnamurthy',
      title: 'Prestige Misty Waters Karapakkam – lake-themed OMR Phase 2 project between two IT clusters?',
      content: `Karapakkam on OMR Phase 2 is an interesting location – it's between Sholinganallur which is fully developed and Perungudi which is also established. That means you're equidistant from two major IT clusters. Prestige Misty Waters takes the water feature concept seriously – the 1.2-acre lake is not a decorative pond, it's a proper water body with an infinity deck overlooking it. The waterfall entry experience from the main gate sets the mood of the campus. Prestige build quality in Chennai I verified at their Song of the South in Pallavaram – consistent, no compromise on materials. The all-day café within the campus is a practical lifestyle feature that residents actually use. 2BHK at 88L from Prestige in Karapakkam with lake frontage and RERA TN/29/Building/0289/2024 – strong credentials, strong location. This will attract OMR IT workers who want premium but not the price of Sholinganallur core.`,
      daysAgo: 23,
    },
    ratings: [
      { userName: 'Ramachandran Venkatesh', score: 5, review: `Prestige quality is consistent across their Chennai projects. Karapakkam between two IT clusters with lake – excellent.` },
      { userName: 'Anitha Balaji',          score: 5, review: `1.2-acre lake with infinity deck in Karapakkam. Prestige has delivered this at other properties – not just renders.` },
      { userName: 'Thirumalai Arumugam',    score: 4, review: `All-day café inside the campus sounds small but makes a huge lifestyle difference for weekend mornings. Smart addition.` },
    ],
  },
]

async function main() {
  console.log('Seeding Chennai properties (seed-content-4)...\n')
  const hash = await bcrypt.hash('Password@123', 10)

  // Upsert users
  const users: Record<string, string> = {}
  for (const u of USERS4) {
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

  for (const prop of PROPERTIES4) {
    const cityId = cityMap[prop.citySlug]
    if (!cityId) { console.warn('City not found: ' + prop.citySlug); continue }

    const authorId = users[prop.topic.userName]
    if (!authorId) { console.warn('User not found: ' + prop.topic.userName); continue }

    const slug = toSlug(prop.propertyName)
    const createdAt = randomDate(prop.topic.daysAgo + 5, prop.topic.daysAgo - 2)

    const topic = await prisma.topic.upsert({
      where: { cityId_slug: { cityId, slug } },
      update: {},
      create: {
        cityId,
        userId: authorId,
        title: prop.topic.title,
        slug,
        propertyName: prop.propertyName,
        propertyType: prop.propertyType as any,
        description: prop.description,
        address: prop.address,
        priceMin: prop.priceMin,
        priceMax: prop.priceMax,
        isPublished: true,
        viewCount: Math.floor(Math.random() * 900) + 100,
        createdAt,
        updatedAt: createdAt,
        metaTitle: prop.propertyName + ' Review - Chennai',
        metaDesc: prop.description.slice(0, 155),
      },
    })
    topics++

    const commentAt = new Date(createdAt.getTime() + Math.random() * 86400000 * 2)
    const existingComment = await prisma.comment.findFirst({ where: { topicId: topic.id, userId: authorId } })
    if (!existingComment) {
      await prisma.comment.create({
        data: { topicId: topic.id, userId: authorId, content: prop.topic.content, createdAt: commentAt, updatedAt: commentAt },
      })
      comments++
    }

    for (const r of prop.ratings) {
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

    console.log('  [chennai] ' + prop.propertyName + ' - avg ' + avg.toFixed(1) + ' (' + allRatings.length + ' ratings)')
  }

  console.log('\nDone. Topics: ' + topics + ' | Comments: ' + comments + ' | Ratings: ' + ratings)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
