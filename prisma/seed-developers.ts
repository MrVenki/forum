import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEVELOPERS = [
  {
    name: 'Casagrand Builder',
    slug: 'casagrand',
    foundedYear: 2003,
    hq: 'Chennai',
    totalDelivered: '18,000+ homes across Tamil Nadu',
    description: 'Casagrand Builder is Chennai\'s most prolific residential developer with over 80 delivered projects since 2003. Known for value-for-money pricing, consistent construction quality, and a wide product range from affordable 2BHKs to luxury high-rises. The company has the largest footprint of any developer in Tamil Nadu and has expanded to Bengaluru. Their Casagrand Azure, Sterling, and Bloom series represent the premium end of their portfolio.',
  },
  {
    name: 'TVS Emerald',
    slug: 'tvs-emerald',
    foundedYear: 2010,
    hq: 'Chennai',
    totalDelivered: '3,500+ homes across South India',
    description: 'TVS Emerald is the real estate arm of the legendary TVS Group, one of India\'s most respected industrial conglomerates. The company brings TVS\'s manufacturing precision and quality discipline to residential development. Known for generous floor plates, superior structural quality, and honest specifications, TVS Emerald projects are consistently rated above average for build quality across Chennai and South India.',
  },
  {
    name: 'VGN Developers',
    slug: 'vgn',
    foundedYear: 1991,
    hq: 'Chennai',
    totalDelivered: '8,000+ homes in Tamil Nadu',
    description: 'VGN Developers is one of Chennai\'s most established and trusted builders with over three decades of residential development. Founded in 1991, VGN has delivered landmark projects in Anna Nagar, Mogappair, Koyambedu, and across Chennai\'s prime residential corridors. Their product philosophy emphasises location premium and finish quality. VGN\'s 40-year track record in Chennai makes them one of the most credible developers in Tamil Nadu.',
  },
  {
    name: 'Prestige Group',
    slug: 'prestige',
    foundedYear: 1986,
    hq: 'Bengaluru',
    totalDelivered: '100+ million sq ft across India',
    description: 'Prestige Group is one of India\'s leading listed real estate companies, headquartered in Bengaluru with a pan-India portfolio spanning residential, commercial, retail, and hospitality. Founded by Irfan Razack in 1986, Prestige has delivered over 280 projects across Bengaluru, Chennai, Hyderabad, Mumbai, and other cities. Known for their township model, consistent quality, and strong RERA compliance. Their Prestige City, Song of the South, and Hillcrest series have become benchmarks in their respective markets.',
  },
  {
    name: 'Brigade Group',
    slug: 'brigade',
    foundedYear: 1986,
    hq: 'Bengaluru',
    totalDelivered: '80+ million sq ft across South India',
    description: 'Brigade Group is a Bengaluru-headquartered listed real estate company with a four-decade track record in residential, commercial, and hospitality development. Founded in 1986, Brigade is known for large-format integrated townships that include residences, offices, hotels, and retail — most notably Brigade Gateway and Brigade Orchards in Bengaluru. Their township formula has been successfully applied in Chennai (Xanadu, Atmosphere) and is expanding across South India.',
  },
  {
    name: 'Godrej Properties',
    slug: 'godrej',
    foundedYear: 1990,
    hq: 'Mumbai',
    totalDelivered: '200+ million sq ft across India',
    description: 'Godrej Properties is a listed subsidiary of the 125-year-old Godrej Group, one of India\'s most trusted conglomerates. Operating across 12+ cities, Godrej Properties is India\'s most geographically diversified real estate company. Their projects consistently score high on brand trust, RERA compliance, construction quality, and delivery timelines. The Godrej brand commands a 10–15% premium over comparable projects in most markets, backed by the parent group\'s financial strength.',
  },
  {
    name: 'Shriram Properties',
    slug: 'shriram',
    foundedYear: 1995,
    hq: 'Bengaluru',
    totalDelivered: '25+ million sq ft across South India',
    description: 'Shriram Properties is a Bengaluru-based listed developer focused on the affordable and mid-market residential segments across South India. Part of the diversified Shriram Group, the company operates across Bengaluru, Chennai, Coimbatore, and Kolkata. Known for delivering value-for-money gated communities with practical layouts and reliable construction quality. Their Codename series represents the premium tier of their portfolio.',
  },
  {
    name: 'Olympia Group',
    slug: 'olympia',
    foundedYear: 1992,
    hq: 'Chennai',
    totalDelivered: '20+ million sq ft in Chennai',
    description: 'Olympia Group is one of Chennai\'s most prolific developers with over three decades of residential and commercial development. Founded in 1992, Olympia has an extensive portfolio of delivered projects across OMR, Perambur, Sholinganallur, and North Chennai. Their value-focused approach and consistent delivery track record make them a reliable choice for mid-segment buyers in Chennai\'s competitive market.',
  },
  {
    name: 'Arihant Foundations',
    slug: 'arihant',
    foundedYear: 1992,
    hq: 'Chennai',
    totalDelivered: '10,000+ homes in South India',
    description: 'Arihant Foundations & Housing is one of South India\'s most active affordable housing developers. Founded in 1992 in Chennai, Arihant is known for large township developments at accessible price points across South Chennai\'s growth corridors — Urapakkam, Ambattur, Mogappair, and GST Road. Their township model consistently delivers 30+ amenities at budget price points, making them the go-to developer for first-time buyers in Tamil Nadu.',
  },
  {
    name: 'Provident Housing',
    slug: 'provident',
    foundedYear: 2008,
    hq: 'Bengaluru',
    totalDelivered: '15,000+ homes across South India',
    description: 'Provident Housing is a subsidiary of Puravankara Limited, one of South India\'s most respected listed developers. Provident focuses on the affordable and mid-market segment, offering value-township projects across Bengaluru, Chennai, Hyderabad, and Goa. Their Provident Park Square in Chennai and Welworth City series are known for delivering large-campus living at accessible prices, backed by Puravankara\'s financial strength and RERA compliance.',
  },
  {
    name: 'Appaswamy Real Estates',
    slug: 'appaswamy',
    foundedYear: 1975,
    hq: 'Chennai',
    totalDelivered: '5,000+ homes in Tamil Nadu',
    description: 'Appaswamy Real Estates is one of Chennai\'s oldest and most respected premium developers with a 50-year legacy. Their portfolio includes landmark projects in Adyar, Nungambakkam, Kilpauk, Ramapuram, and other prime Chennai localities. Known for large floor plates, above-average construction quality, and meticulous project execution, Appaswamy commands a strong reputation among established Chennai buyers who prioritise quality over everything else.',
  },
  {
    name: 'Sobha Limited',
    slug: 'sobha',
    foundedYear: 1995,
    hq: 'Bengaluru',
    totalDelivered: '120+ million sq ft across India',
    description: 'Sobha Limited is one of India\'s most respected premium listed developers, unique for its backward-integrated in-house construction model where all manufacturing — interiors, glazing, metal works, concrete — is done by Sobha itself. This self-reliance ensures unmatched consistency in finish quality across every project. Founded by P.N.C. Menon in 1995, Sobha operates in Bengaluru, Chennai, Hyderabad, Gurugram, and other metros. Their Dream Acres in Bengaluru set a record for India\'s fastest-selling residential project.',
  },
  {
    name: 'Birla Estates',
    slug: 'birla',
    foundedYear: 2016,
    hq: 'Mumbai',
    totalDelivered: '5+ million sq ft across India',
    description: 'Birla Estates is the real estate arm of the Aditya Birla Group, one of India\'s largest and most respected conglomerates. Launched in 2016, the company is pursuing premium and ultra-premium residential development in Bengaluru, Mumbai, Gurugram, and other metros. Backed by the Aditya Birla Group\'s balance sheet strength and brand equity, Birla Estates projects are RERA-compliant with strong delivery commitments. Their Birla Trimaya in Bengaluru became one of the largest single-project launches in the city.',
  },
  {
    name: 'Adarsh Developers',
    slug: 'adarsh',
    foundedYear: 1988,
    hq: 'Bengaluru',
    totalDelivered: '15+ million sq ft in South India',
    description: 'Adarsh Developers is a Bengaluru-based developer with over 35 years of experience in residential and commercial real estate. Known for their villa and luxury apartment portfolio, Adarsh projects are characterised by large plot areas, high-quality landscaping, and premium finish specifications. Their Welkin Park on Sarjapur Road is one of Bengaluru\'s most sought-after independent villa communities.',
  },
  {
    name: 'Kolte-Patil Developers',
    slug: 'kolte-patil',
    foundedYear: 1991,
    hq: 'Pune',
    totalDelivered: '50+ million sq ft across India',
    description: 'Kolte-Patil Developers is a Pune-headquartered listed developer with a strong presence across Pune, Bengaluru, and Mumbai. Known for quality construction, design-forward architecture, and RERA compliance, Kolte-Patil has earned a reputation as one of western India\'s most trustworthy developers. Their expansion to Bengaluru — including the Lakeside series on Hennur Road — brings their Pune-tested quality to South India\'s IT capital.',
  },
  {
    name: 'Total Environment',
    slug: 'total-environment',
    foundedYear: 1996,
    hq: 'Bengaluru',
    totalDelivered: '3+ million sq ft in Bengaluru',
    description: 'Total Environment is Bengaluru\'s most distinctive boutique developer, renowned for biophilic architecture that integrates trees and living walls directly into building design. With a philosophy of zero-delay delivery (six consecutive projects without a single day of delay), Total Environment commands a premium of 30–50% over comparable projects. Their landmark projects — Windmills of Your Mind, In That Quiet Earth, and The Nest — are considered collectors\' items in Bengaluru\'s residential market.',
  },
  {
    name: 'Lodha Group',
    slug: 'lodha',
    foundedYear: 1980,
    hq: 'Mumbai',
    totalDelivered: '85+ million sq ft across India',
    description: 'Lodha Group (Macrotech Developers) is India\'s largest residential developer by sales and one of Asia\'s top real estate companies. Founded by Mangal Prabhat Lodha in Mumbai in 1980, Lodha operates in Mumbai, Pune, Hyderabad, Bengaluru, and London. Their luxury portfolio — World One (world\'s tallest residential tower), Altamount Road, and Malabar Hill projects — defines the ultra-premium segment in India. The Lodha Palava City township near Mumbai is one of the world\'s largest mixed-use developments.',
  },
  {
    name: 'Oberoi Realty',
    slug: 'oberoi',
    foundedYear: 1980,
    hq: 'Mumbai',
    totalDelivered: '40+ million sq ft in Mumbai',
    description: 'Oberoi Realty is Mumbai\'s premier luxury residential developer, known for delivering ultra-premium projects in Goregaon, Worli, and other prime Mumbai locations. A listed company with one of the cleanest balance sheets in Indian real estate, Oberoi Realty has never defaulted on a delivery commitment. Their Sky City and Elysian series redefine Mumbai luxury with floor-to-ceiling glazing, sky decks, and Oberoi-brand amenity standards.',
  },
  {
    name: 'Raymond Realty',
    slug: 'raymond',
    foundedYear: 2019,
    hq: 'Mumbai',
    totalDelivered: '2+ million sq ft in Mumbai',
    description: 'Raymond Realty is the real estate arm of Raymond Limited, one of India\'s most iconic fabric and lifestyle brands. Launched in 2019 with the development of their legacy Thane mill land, Raymond Realty has quickly established itself as a premium developer in the Mumbai Metropolitan Region. Their TenX Habitat project in Thane brought Raymond\'s manufacturing quality discipline to residential development, delivering superior finishes at transparent pricing.',
  },
  {
    name: 'Rustomjee',
    slug: 'rustomjee',
    foundedYear: 1996,
    hq: 'Mumbai',
    totalDelivered: '20+ million sq ft in Mumbai',
    description: 'Rustomjee is a Mumbai-based developer with a 28-year track record across the city\'s western suburbs — Bandra, Khar, Juhu, Borivali, and Thane. Known for design-led residential projects, premium amenities, and reliable delivery, Rustomjee has carved a niche in Mumbai\'s mid-to-luxury segment. Their Azziano and Uptown Urbania series represent their township ambitions, while the Elements series targets premium urban buyers.',
  },
  {
    name: 'DLF Limited',
    slug: 'dlf',
    foundedYear: 1946,
    hq: 'New Delhi',
    totalDelivered: '340+ million sq ft across India',
    description: 'DLF Limited is India\'s largest listed real estate company by market capitalisation, with a 78-year legacy spanning Delhi NCR, Chennai, Chandigarh, and other metros. Founded by Chaudhary Raghvendra Singh in 1946, DLF built some of India\'s most iconic residential communities — DLF City in Gurugram, The Camellias ultra-luxury, and Privana series. DLF\'s brand is synonymous with premium residential quality and land ownership credibility in North India.',
  },
  {
    name: 'Tata Housing',
    slug: 'tata-housing',
    foundedYear: 1984,
    hq: 'Mumbai',
    totalDelivered: '80+ million sq ft across India',
    description: 'Tata Housing Development Company is the real estate arm of the Tata Group, India\'s most trusted industrial conglomerate. Operating across Mumbai, Delhi NCR, Bengaluru, Pune, Ahmedabad, and Goa, Tata Housing\'s brand assurance and group backing make it one of the most trusted names for home buyers across India. Their Tata Serein, Carnatica, and Gurgaon Gateway projects have become landmarks in their respective cities.',
  },
  {
    name: 'My Home Corporation',
    slug: 'my-home',
    foundedYear: 1981,
    hq: 'Hyderabad',
    totalDelivered: '30+ million sq ft in Telangana & AP',
    description: 'My Home Corporation is Hyderabad\'s largest and most iconic residential developer, founded in 1981. With a dominant presence across Kondapur, Gachibowli, Financial District, and the HITEC City corridor, My Home has shaped Hyderabad\'s skyline for over four decades. Their Bhooja, Avatar, and Mangala series are flagship projects that have defined premium living standards in Hyderabad. Known for large-format township developments with exceptional amenity quality.',
  },
  {
    name: 'Aparna Constructions',
    slug: 'aparna',
    foundedYear: 1996,
    hq: 'Hyderabad',
    totalDelivered: '20+ million sq ft in Hyderabad',
    description: 'Aparna Constructions and Estates is one of Hyderabad\'s most established mid-to-premium residential developers. Founded in 1996, the company has built an extensive portfolio across Nallagandla, Miyapur, Kondapur, Narsingi, and the Financial District. Known for consistent quality, well-planned layouts, and community-focused amenities, Aparna\'s projects consistently rank among the most sought-after in Hyderabad\'s residential market.',
  },
  {
    name: 'Sattva Group',
    slug: 'sattva',
    foundedYear: 1986,
    hq: 'Bengaluru',
    totalDelivered: '60+ million sq ft across South India',
    description: 'Sattva Group is a Bengaluru-headquartered developer with a diversified portfolio spanning residential, commercial, and mixed-use developments across South India. Known for IT parks and data centres alongside residential townships, Sattva brings institutional real estate discipline to its residential developments. Their Serene Life and Lumina series are positioned at the premium mid-market, offering strong value and consistent quality.',
  },
  {
    name: 'Salarpuria Sattva',
    slug: 'salarpuria-sattva',
    foundedYear: 1986,
    hq: 'Bengaluru',
    totalDelivered: '80+ million sq ft in Bengaluru',
    description: 'Salarpuria Sattva is one of Bengaluru\'s dominant real estate groups, known primarily for IT commercial parks that house some of the world\'s largest technology companies. Their residential arm delivers mid-to-premium apartments and townships primarily in Bengaluru\'s key IT corridors — Outer Ring Road, Whitefield, and Electronic City. The Magnus, Misty Charm, and Cadenza series represent their flagship residential portfolio.',
  },
  {
    name: 'Shapoorji Pallonji',
    slug: 'shapoorji-pallonji',
    foundedYear: 1865,
    hq: 'Mumbai',
    totalDelivered: '100+ million sq ft across India',
    description: 'Shapoorji Pallonji Real Estate is the real estate arm of the 160-year-old Shapoorji Pallonji Group, India\'s most storied construction conglomerate. The group built the iconic Taj Mahal Palace Hotel and Reserve Bank of India buildings. Their residential division — encompassing the Joyville and Shukhobrishti affordable series and the premium Sensorium projects — carries the same construction discipline as their iconic landmark buildings.',
  },
  {
    name: 'Puravankara',
    slug: 'puravankara',
    foundedYear: 1975,
    hq: 'Bengaluru',
    totalDelivered: '50+ million sq ft across South India',
    description: 'Puravankara Limited is a Bengaluru-headquartered listed developer with nearly 50 years of residential real estate experience. Operating across Bengaluru, Chennai, Hyderabad, Mumbai, and Kochi, Puravankara has two distinct brands — Puravankara for the premium segment and Provident for the affordable segment. Known for township developments and RERA compliance, the company\'s consistent delivery track record over nearly five decades gives buyers strong assurance.',
  },
  {
    name: 'Assetz Property Group',
    slug: 'assetz',
    foundedYear: 2006,
    hq: 'Bengaluru',
    totalDelivered: '15+ million sq ft in Bengaluru',
    description: 'Assetz Property Group is a Bengaluru-based developer with a Singapore-heritage management team, bringing international development standards to Indian residential real estate. Known for design-led architecture, biophilic campus planning, and above-average amenity quality, Assetz projects — including Sora & Saki, 63 Degree East, and Soho & Sky — cater to premium buyers on Bengaluru\'s Outer Ring Road and Whitefield corridors.',
  },
  {
    name: 'Hiranandani Group',
    slug: 'hiranandani',
    foundedYear: 1978,
    hq: 'Mumbai',
    totalDelivered: '50+ million sq ft across India',
    description: 'Hiranandani Group is synonymous with large-format integrated township development in India. Their Hiranandani Gardens in Powai, Mumbai, is one of India\'s most successful self-contained townships. Founded by Niranjan Hiranandani in 1978, the group operates in Mumbai, Pune, Hyderabad, Chennai, and has expanded to the logistics sector. Known for premium quality, long-term township planning, and iconic architectural aesthetics.',
  },
  {
    name: 'Merlin Group',
    slug: 'merlin',
    foundedYear: 1984,
    hq: 'Kolkata',
    totalDelivered: '20+ million sq ft in East India',
    description: 'Merlin Group is one of Kolkata\'s most respected residential developers with a 40-year legacy. Founded in 1984, Merlin has built an extensive portfolio across South Kolkata, New Town, Rajarhat, and the EM Bypass corridor. Known for quality construction, honest pricing, and consistent delivery, Merlin is the go-to developer for Kolkata\'s discerning buyers. Their Skyrise, Serenia, and The One series represent their premium offerings.',
  },
  {
    name: 'Piramal Realty',
    slug: 'piramal',
    foundedYear: 2012,
    hq: 'Mumbai',
    totalDelivered: '5+ million sq ft in Mumbai',
    description: 'Piramal Realty is the real estate arm of the Piramal Group, one of India\'s most diversified conglomerates. Launched in 2012, Piramal Realty focuses on the premium and ultra-premium residential segment in Mumbai. Their Aranya and Vantage projects in Byculla and Mulund respectively represent different ends of Mumbai\'s premium market. Backed by the Piramal Group\'s financial strength, their projects offer strong brand assurance for luxury buyers.',
  },
  {
    name: 'Mahindra Lifespaces',
    slug: 'mahindra',
    foundedYear: 1994,
    hq: 'Mumbai',
    totalDelivered: '30+ million sq ft across India',
    description: 'Mahindra Lifespace Developers is a listed subsidiary of the Mahindra Group, one of India\'s largest and most respected industrial conglomerates. Operating in Mumbai, Bengaluru, Pune, Chennai, and Nagpur, Mahindra Lifespaces is known for sustainable green development — all their projects target IGBC Green Home certification. Their Citadel, Zen, and Windchimes series in Bengaluru cater to the premium mid-market buyer seeking quality and brand assurance.',
  },
  {
    name: 'M3M Group',
    slug: 'm3m',
    foundedYear: 2010,
    hq: 'Gurugram',
    totalDelivered: '40+ million sq ft in Delhi NCR',
    description: 'M3M Group is one of Delhi NCR\'s fastest-growing real estate developers, known for ultra-premium residential and mixed-use developments in Gurugram. Founded in 2010, M3M has rapidly established itself as Gurugram\'s most aspirational brand with large-format projects like M3M Golf Estate, Antalya Hills, and Capital Walk. Their focus on international design standards, world-class amenities, and prime Golf Course Road locations drives strong demand from HNI buyers.',
  },
  {
    name: 'Kalpataru Group',
    slug: 'kalpataru',
    foundedYear: 1969,
    hq: 'Mumbai',
    totalDelivered: '30+ million sq ft across India',
    description: 'Kalpataru Group is a Mumbai-based developer with over 55 years of construction heritage. Operating across Mumbai, Pune, Thane, Bengaluru, Hyderabad, and Delhi NCR, Kalpataru is known for premium build quality, design innovation, and transparent delivery. Their Paramount and Vienta series in Navi Mumbai and other locations represent mid-to-premium residential quality at competitive price points.',
  },
  {
    name: 'Runwal Group',
    slug: 'runwal',
    foundedYear: 1978,
    hq: 'Mumbai',
    totalDelivered: '30+ million sq ft in Mumbai',
    description: 'Runwal Group is a Mumbai-based developer with over 45 years of experience in residential and retail real estate. Known for their integrated township model (Runwal My City in Dombivli) and premium projects (Runwal Forests in Kanjurmarg), Runwal serves both the affordable and premium segments. The company also operates a large retail mall portfolio in Mumbai.',
  },
  {
    name: 'ATS Infrastructure',
    slug: 'ats',
    foundedYear: 1998,
    hq: 'Noida',
    totalDelivered: '20+ million sq ft in Delhi NCR',
    description: 'ATS Infrastructure is a Noida-based developer known for premium residential projects in Delhi NCR, particularly in Noida, Greater Noida, and Gurugram. Founded in 1998, ATS has delivered projects like Le Grandiose, Tourmaline, and Pristine to mid-to-luxury segment buyers. Known for quality construction and design-forward architecture in the competitive Delhi NCR market.',
  },
  {
    name: 'Radiance Realty',
    slug: 'radiance',
    foundedYear: 2009,
    hq: 'Chennai',
    totalDelivered: '3,000+ homes in Tamil Nadu',
    description: 'Radiance Realty is a Chennai-based developer focused on the mid-segment residential market across North and Central Chennai. Known for practical layouts, competitive pricing, and transparent dealings, Radiance has built a loyal buyer base in Chennai\'s Perambur, Porur, and suburban corridors.',
  },
  {
    name: 'Akshaya Homes',
    slug: 'akshaya',
    foundedYear: 1995,
    hq: 'Chennai',
    totalDelivered: '5,000+ homes in Tamil Nadu',
    description: 'Akshaya Homes is a Chennai-based developer with a 30-year track record in the city\'s residential market. Known for mid-segment and premium projects across OMR, Sholinganallur, and South Chennai corridors, Akshaya has built a strong reputation for quality construction and customer service. Their Tango series has been well-received in the OMR IT corridor.',
  },
  {
    name: 'DRA Homes',
    slug: 'dra',
    foundedYear: 1993,
    hq: 'Chennai',
    totalDelivered: '4,000+ homes in Tamil Nadu',
    description: 'DRA Homes is a Chennai-based developer operating primarily in the North Chennai and Perambur residential corridors. Founded in 1993, DRA focuses on affordable and mid-segment apartments with reliable construction quality. Their projects are particularly popular among North Chennai buyers seeking value-for-money homes with good connectivity.',
  },
  {
    name: 'Vijay Shanthi Builders',
    slug: 'vijay-shanthi',
    foundedYear: 1979,
    hq: 'Chennai',
    totalDelivered: '8,000+ homes in Tamil Nadu',
    description: 'Vijay Shanthi Builders is one of Tamil Nadu\'s oldest residential developers with over 45 years of construction experience. Founded in 1979, the company has delivered thousands of homes across Chennai and surrounding towns. Known for affordable pricing and a strong presence in the southern suburban corridors — Guduvanchery, Urapakkam, and Tambaram — Vijay Shanthi is trusted by budget-conscious first-time buyers.',
  },
  {
    name: 'Century Real Estate',
    slug: 'century',
    foundedYear: 1973,
    hq: 'Bengaluru',
    totalDelivered: '20+ million sq ft in Bengaluru',
    description: 'Century Real Estate is a Bengaluru-based developer with over 50 years of real estate experience, primarily operating in Bengaluru\'s residential and commercial segments. Their projects — Century Mirai, Ethos, and Indus — target the mid-to-premium segment on Bengaluru\'s key corridors. Known for consistent quality and transparent pricing.',
  },
  {
    name: 'Hiland Group',
    slug: 'hiland',
    foundedYear: 2001,
    hq: 'Kolkata',
    totalDelivered: '5+ million sq ft in Kolkata',
    description: 'Hiland Group is a Kolkata-based residential developer known for mid-segment gated communities across New Town, Rajarhat, and Tollygunge. Founded in 2001, Hiland has carved a niche in Kolkata\'s growing eastern suburban market with quality apartments and township developments.',
  },
  {
    name: 'Ambuja Neotia',
    slug: 'ambuja-neotia',
    foundedYear: 1993,
    hq: 'Kolkata',
    totalDelivered: '10+ million sq ft in East India',
    description: 'Ambuja Neotia is a Kolkata-based developer with a diverse portfolio spanning residential, commercial, hospitality, and healthcare real estate. Founded in 1993, the company is known for integrated township developments and premium residential projects across New Town, Uttarpara, and Greenfield City in Kolkata\'s growing corridors.',
  },
  {
    name: 'Mana Projects',
    slug: 'mana',
    foundedYear: 2008,
    hq: 'Bengaluru',
    totalDelivered: '3+ million sq ft in Bengaluru',
    description: 'Mana Projects is a Bengaluru-based boutique developer known for design-forward residential projects on the Outer Ring Road and Whitefield corridors. Founded in 2008, Mana differentiates through biophilic design, green certification, and above-average finish quality. Their Dale series is particularly popular among IT professionals seeking thoughtfully designed homes.',
  },
  {
    name: 'Arvind SmartSpaces',
    slug: 'arvind',
    foundedYear: 2009,
    hq: 'Ahmedabad',
    totalDelivered: '10+ million sq ft across Gujarat and Bengaluru',
    description: 'Arvind SmartSpaces is a listed developer and real estate arm of the Arvind Group, one of Gujarat\'s most respected conglomerates. Operating in Ahmedabad, Surat, Bengaluru, and Pune, Arvind SmartSpaces brings Arvind Group\'s manufacturing quality discipline to residential development. Known for premium plotted development and villa communities.',
  },
]

// Maps propertyName prefix → developerSlug
// Order matters — more specific prefixes first
const DEVELOPER_PATTERNS: { prefix: string; slug: string }[] = [
  { prefix: 'Salarpuria Sattva', slug: 'salarpuria-sattva' },
  { prefix: 'Shapoorji Pallonji', slug: 'shapoorji-pallonji' },
  { prefix: 'Total Environment', slug: 'total-environment' },
  { prefix: 'Kolte-Patil', slug: 'kolte-patil' },
  { prefix: 'My Home', slug: 'my-home' },
  { prefix: 'Vijay Shanthi', slug: 'vijay-shanthi' },
  { prefix: 'Ambuja Neotia', slug: 'ambuja-neotia' },
  { prefix: 'TVS Emerald', slug: 'tvs-emerald' },
  { prefix: 'Casa Grande', slug: 'casagrand' },
  { prefix: 'Casagrand', slug: 'casagrand' },
  { prefix: 'Prestige', slug: 'prestige' },
  { prefix: 'Brigade', slug: 'brigade' },
  { prefix: 'Godrej', slug: 'godrej' },
  { prefix: 'Shriram', slug: 'shriram' },
  { prefix: 'Olympia', slug: 'olympia' },
  { prefix: 'Arihant', slug: 'arihant' },
  { prefix: 'Provident', slug: 'provident' },
  { prefix: 'Appaswamy', slug: 'appaswamy' },
  { prefix: 'Aparna', slug: 'aparna' },
  { prefix: 'Sobha', slug: 'sobha' },
  { prefix: 'Birla', slug: 'birla' },
  { prefix: 'Adarsh', slug: 'adarsh' },
  { prefix: 'Puravankara', slug: 'puravankara' },
  { prefix: 'Purva', slug: 'puravankara' },
  { prefix: 'Lodha', slug: 'lodha' },
  { prefix: 'Oberoi', slug: 'oberoi' },
  { prefix: 'Raymond', slug: 'raymond' },
  { prefix: 'Rustomjee', slug: 'rustomjee' },
  { prefix: 'DLF', slug: 'dlf' },
  { prefix: 'Tata', slug: 'tata-housing' },
  { prefix: 'Mahindra', slug: 'mahindra' },
  { prefix: 'Sattva', slug: 'sattva' },
  { prefix: 'Assetz', slug: 'assetz' },
  { prefix: 'Hiranandani', slug: 'hiranandani' },
  { prefix: 'Hiland', slug: 'hiland' },
  { prefix: 'Merlin', slug: 'merlin' },
  { prefix: 'Piramal', slug: 'piramal' },
  { prefix: 'M3M', slug: 'm3m' },
  { prefix: 'Kalpataru', slug: 'kalpataru' },
  { prefix: 'Runwal', slug: 'runwal' },
  { prefix: 'ATS', slug: 'ats' },
  { prefix: 'VGN', slug: 'vgn' },
  { prefix: 'Radiance', slug: 'radiance' },
  { prefix: 'Akshaya', slug: 'akshaya' },
  { prefix: 'DRA', slug: 'dra' },
  { prefix: 'Rohan', slug: 'rohan' },
  { prefix: 'PBEL', slug: 'pbel' },
  { prefix: 'Concorde', slug: 'concorde' },
  { prefix: 'Jains', slug: 'jains' },
  { prefix: 'DSR', slug: 'dsr' },
  { prefix: 'Pride', slug: 'pride' },
  { prefix: 'Greata', slug: 'greata' },
  { prefix: 'Pacifica', slug: 'pacifica' },
  { prefix: 'Aliens', slug: 'aliens' },
  { prefix: 'Mana', slug: 'mana' },
  { prefix: 'Arvind', slug: 'arvind' },
  { prefix: 'Century', slug: 'century' },
  { prefix: 'L&T', slug: 'l-and-t' },
  { prefix: 'Ambuja', slug: 'ambuja-neotia' },
]

function detectDeveloper(propertyName: string): string | null {
  for (const { prefix, slug } of DEVELOPER_PATTERNS) {
    if (propertyName.startsWith(prefix)) return slug
  }
  return null
}

async function main() {
  console.log('Seeding Developer records...\n')

  // 1. Upsert all developers
  const developerMap: Record<string, string> = {}
  for (const dev of DEVELOPERS) {
    const created = await prisma.developer.upsert({
      where: { slug: dev.slug },
      update: { name: dev.name, description: dev.description, foundedYear: dev.foundedYear, hq: dev.hq, totalDelivered: dev.totalDelivered },
      create: dev,
    })
    developerMap[dev.slug] = created.name
    process.stdout.write('  developer: ' + dev.name + '\n')
  }

  console.log('\nBackfilling topics with developer info...\n')

  // 2. Fetch all topics
  const topics = await prisma.topic.findMany({ select: { id: true, propertyName: true } })
  let updated = 0
  let unmatched: string[] = []

  for (const topic of topics) {
    const slug = detectDeveloper(topic.propertyName)
    if (slug) {
      const devName = DEVELOPERS.find((d) => d.slug === slug)?.name ?? null
      await prisma.topic.update({
        where: { id: topic.id },
        data: { developerSlug: slug, developerName: devName },
      })
      updated++
    } else {
      unmatched.push(topic.propertyName)
    }
  }

  console.log('Updated: ' + updated + ' topics')
  if (unmatched.length) {
    console.log('Unmatched (' + unmatched.length + '): ' + unmatched.join(', '))
  }
  console.log('\nDone.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
