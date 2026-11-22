import { prisma } from '@/lib/prisma'
import { generateTopicSlug } from '@/lib/utils/slugify'

/**
 * Tier 2 cities and their first project listings (added Nov 2026).
 *
 * Facts come from public property listings that print each project's RERA registration
 * number (housing.com, ghar.tv, squareyards, homes247, aurumproptech). They were not
 * checked on the RERA portals, and each description says so. No prices, possession dates,
 * reviews or photos are invented: a field is left empty when no listing gave it.
 *
 * Runs on server start-up (see instrumentation.ts). A city is created together with its
 * projects in one write, and only if the city does not exist yet, so a restart never
 * re-adds a listing that an admin later edited or deleted.
 */

type SeedType = 'APARTMENT' | 'VILLA' | 'PLOT'

interface SeedProject {
  name: string
  developer: string
  locality: string
  pincode?: string
  type: SeedType
  /** Plain facts, e.g. "2 and 3 BHK flats, 20 units in one building" */
  config: string
  rera: string
  /** What the listing says about progress, e.g. "possession due in June 2027" */
  status?: string
  priceMin?: number
  priceMax?: number
}

interface SeedCity {
  name: string
  slug: string
  state: 'Andhra Pradesh' | 'Telangana'
  projects: SeedProject[]
}

export const TIER2_SEED: SeedCity[] = [
  {
    name: 'Nellore', slug: 'nellore', state: 'Andhra Pradesh',
    projects: [
      { name: 'Teknomin Tekno Towers', developer: 'Teknomin Construction Ltd', locality: 'Ramji Nagar', type: 'APARTMENT', config: '2 and 3 BHK flats', rera: 'P09480425053', status: 'completion is due in June 2027' },
      { name: 'SL Haven', developer: 'SL Habitat LLP', locality: 'Bheemulavaripalem (Pudi)', pincode: '524401', type: 'APARTMENT', config: '1, 2 and 3 BHK flats, 50 units across three five-floor blocks', rera: 'P09460180092', status: 'it is ready to move in, with possession from December 2020' },
      { name: 'AR Camellia', developer: 'AR Constructions', locality: 'Kondayapalem', pincode: '524236', type: 'APARTMENT', config: '2 and 3 BHK flats, 20 units in one four-floor building', rera: 'P09250090577' },
      { name: 'Manor Block B', developer: 'DRK Builders', locality: 'Vanam Thopu, ISKCON City', pincode: '524004', type: 'APARTMENT', config: '2 and 3 BHK flats, 15 units in one four-floor building', rera: 'P09250160099', status: 'it is ready to move in, with possession from December 2020' },
      { name: 'ESR Srikala Emerald', developer: 'ESR Constructions and Developers', locality: 'Ranganayakulapet', type: 'APARTMENT', config: '1 BHK flats', rera: 'P09250090532', status: 'it is ready to move in' },
      { name: 'Multiversal Dharani Residency', developer: 'Multiversal Infra Pvt Ltd', locality: 'Kottur, Podalakur Road', pincode: '524004', type: 'APARTMENT', config: '3 BHK flats, 20 units in one five-floor building', rera: 'P09250090505', status: 'possession was due in April 2022' },
    ],
  },
  {
    name: 'Tirupati', slug: 'tirupati', state: 'Andhra Pradesh',
    projects: [
      { name: 'CPR Park Heights', developer: 'CPR Constructions Pvt Ltd', locality: 'Avilala', pincode: '517508', type: 'APARTMENT', config: '2 and 3 BHK flats, 224 units on about 3 acres', rera: 'P10260132766', status: 'it is under construction' },
      { name: 'Aaditri Empress', developer: 'Aaditri Housing Pvt Ltd', locality: 'Tiruchanur', type: 'APARTMENT', config: '2 and 3 BHK flats, 350 units on about 3.7 acres', rera: 'P10260150879' },
      { name: 'Varshitha Lake View Villas', developer: 'Varshitha Constructions', locality: 'Royal Nagar', pincode: '517501', type: 'PLOT', config: '16 residential plots', rera: 'P10260014795', status: 'it is under construction, with possession due in January 2030' },
    ],
  },
  {
    name: 'Guntur', slug: 'guntur', state: 'Andhra Pradesh',
    projects: [
      { name: 'SR Emerald Heights', developer: 'SR India Projects', locality: 'Koppuravuru', pincode: '522508', type: 'APARTMENT', config: '2 BHK flats, 40 units in one five-floor building', rera: 'P07270011077' },
      { name: 'DSR Medarametla Residency', developer: 'DSR Constructions', locality: 'Arundelpet', pincode: '522002', type: 'APARTMENT', config: '3 BHK flats, 10 units in one five-floor building', rera: 'P07260060382', status: 'possession was due in June 2021' },
      { name: 'Prabhuteja Lakshmi Fortune', developer: 'Prabhuteja Projects', locality: 'Pattabhipuram', type: 'APARTMENT', config: '3 BHK flats, 10 units', rera: 'P07260065097', status: 'it is under construction, with possession due in April 2027' },
      { name: 'Tummeti Residency', developer: 'Battula Srilakshmi', locality: 'Vidya Nagar', type: 'APARTMENT', config: '2 BHK flats', rera: 'P07260061368', status: 'it is ready to move in' },
    ],
  },
  {
    name: 'Kakinada', slug: 'kakinada', state: 'Andhra Pradesh',
    projects: [
      { name: 'Home Tree Raj Towers', developer: 'Home Tree Constructions Pvt Ltd', locality: 'Ramanayyapeta', pincode: '533005', type: 'APARTMENT', config: '3 BHK flats, 30 units in two five-floor blocks', rera: 'P04670291841', status: 'possession was due in October 2023' },
      { name: 'Lansum Gatti Residency', developer: 'Lansum Properties LLP', locality: 'Ramanayyapeta', pincode: '533005', type: 'APARTMENT', config: '3 BHK flats, 10 units in one five-floor building', rera: 'P04230110331', status: 'it is ready to move in, with possession from March 2022' },
      { name: 'Indraprastha Anantham', developer: 'Indraprastha Constructions', locality: 'Ramanayyapeta', type: 'APARTMENT', config: '3 BHK flats, 10 units in one five-floor building', rera: 'P04230070539', status: 'possession was due in July 2021' },
    ],
  },
  {
    name: 'Rajahmundry', slug: 'rajahmundry', state: 'Andhra Pradesh',
    projects: [
      { name: 'Cubatic Arte', developer: 'Cubatic Projects Pvt Ltd', locality: 'Aditya Nagar', pincode: '533107', type: 'APARTMENT', config: '2 and 3 BHK flats and 3 BHK villas, 260 units in all', rera: 'P04290060464', status: 'possession was due in April 2025' },
      { name: 'K B Luxuria', developer: 'K B Estates', locality: 'Venkateswara Nagar, Morampudi', type: 'APARTMENT', config: '3 BHK flats, 80 units in one five-floor building', rera: 'P04650103714', status: 'it is under construction, with possession due in May 2029', priceMin: 6525000, priceMax: 11200000 },
      { name: "Rushi's Royale", developer: 'Rushi Constructions', locality: 'Morampudi', type: 'APARTMENT', config: '3 BHK flats, 10 units in one five-floor building', rera: 'P04650404747', status: 'it is under construction, with possession due in February 2027' },
      { name: "RJ's Mayfair", developer: 'RJ Developers', locality: 'Morampudi', pincode: '533103', type: 'APARTMENT', config: '2 BHK flats, 15 units in one four-floor building', rera: 'P04290070389', status: 'it is ready to move in, with possession from August 2021' },
    ],
  },
  {
    name: 'Warangal', slug: 'warangal', state: 'Telangana',
    projects: [
      { name: "Siri's Chiara", developer: "Siri's Green Projects Pvt Ltd", locality: 'Kazipet', pincode: '506003', type: 'VILLA', config: '3 BHK villas, 48 units on about 5.6 acres', rera: 'P00300007498', status: 'it is under construction, with possession due in October 2028' },
      { name: "Siri's Delight", developer: "Siri's Green City", locality: 'Deshaipet', pincode: '506006', type: 'APARTMENT', config: '2 BHK flats, 40 units in one six-floor tower', rera: 'P00300008098', status: 'it is under construction, with possession due in March 2027' },
      { name: 'Pakka Royalty', developer: 'Pakka Realtors', locality: 'Naimnagar, Hanamkonda', pincode: '506001', type: 'APARTMENT', config: '3 BHK flats, 10 units in one five-floor building', rera: 'P00300008219', status: 'possession was due from August 2026' },
      { name: 'APR Tulips Emerland', developer: 'APR Constructions', locality: 'Hanamkonda', pincode: '506002', type: 'APARTMENT', config: 'flats', rera: 'P00300004298', status: 'it is under construction, with possession due in December 2027' },
      { name: 'Laxmi Kakatiya Grand', developer: 'Laxmi Constructions', locality: 'Girmajipet', type: 'APARTMENT', config: '2 BHK flats in one six-floor building', rera: 'P00300001840', status: 'possession was due in January 2026' },
    ],
  },
  {
    name: 'Karimnagar', slug: 'karimnagar', state: 'Telangana',
    projects: [
      { name: 'Pragnya Edla Laxmi Nilayam', developer: 'Pragnya Constructions', locality: 'Vavilalapally', pincode: '505001', type: 'APARTMENT', config: '3 BHK flats in one six-floor building', rera: 'P02700001644', status: 'possession was due in August 2025' },
      { name: 'Vasavi Nandanam', developer: 'Vasavi Apartment', locality: 'Rekurthi', pincode: '505001', type: 'APARTMENT', config: '2 and 3 BHK flats, 15 units over five floors', rera: 'P02700009466', status: 'completion is due in January 2028' },
      { name: 'Raja Rajeshwara Green Homes', developer: 'Green Homes', locality: 'Chaitanyapuri', pincode: '505001', type: 'APARTMENT', config: '2 BHK flats, 15 units over five floors', rera: 'P02700005518', status: 'completion is due in July 2027' },
    ],
  },
]

const TEAM_EMAIL = 'team@indiapropertytalk.com'

const TYPE_WORD: Record<SeedType, string> = {
  APARTMENT: 'residential apartment project',
  VILLA: 'villa project',
  PLOT: 'plotted residential layout',
}

export function describe(p: SeedProject, city: SeedCity): string {
  const rera = city.state === 'Telangana' ? 'TG RERA' : 'AP RERA'
  const where = `${p.locality}, ${city.name}${p.pincode ? ` ${p.pincode}` : ''}`
  const lines = [
    `${p.name} is a ${TYPE_WORD[p.type]} by ${p.developer} in ${where}. It offers ${p.config}.`,
    `Public property listings show it with ${rera} registration number ${p.rera}${p.status ? `, and say ${p.status}` : ''}.`,
    `These details come from public listings and have not been checked by IndiaPropertyTalk. Confirm the registration on the ${rera} portal and read the builder's approved plans before you pay a booking amount.`,
    `Do you live here, have you visited the site, or have you booked a home? Share what you found below so other buyers in ${city.name} can decide with real information.`,
  ]
  return lines.join('\n\n')
}

async function teamUserId(): Promise<string> {
  const user = await prisma.user.upsert({
    where: { email: TEAM_EMAIL },
    update: {},
    // No password and isSeeded, so the account cannot sign in and never receives email
    create: { name: 'IndiaPropertyTalk Team', email: TEAM_EMAIL, isSeeded: true },
  })
  return user.id
}

export async function seedTier2Cities(): Promise<void> {
  let userId: string | null = null
  for (const city of TIER2_SEED) {
    const exists = await prisma.city.findUnique({ where: { slug: city.slug }, select: { id: true } })
    if (exists) continue
    userId ??= await teamUserId()
    const uid = userId
    // One nested create, so the city and its projects are written together or not at all
    await prisma.city.create({
      data: {
        name: city.name, slug: city.slug, state: city.state, tier: 'TIER2',
        topics: {
          create: city.projects.map((p) => ({
            userId: uid,
            title: `${p.name} — Reviews & Discussion`,
            slug: generateTopicSlug(p.name),
            propertyName: p.name,
            propertyType: p.type,
            description: describe(p, city),
            address: `${p.locality}, ${city.name}${p.pincode ? ` ${p.pincode}` : ''}, ${city.state}`,
            priceMin: p.priceMin ?? null,
            priceMax: p.priceMax ?? null,
            developerName: p.developer,
          })),
        },
      },
    })
    console.log(`[tier2Seed] added ${city.name} with ${city.projects.length} projects`)
  }
}
