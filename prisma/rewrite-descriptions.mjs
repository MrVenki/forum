import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Rewrite topic descriptions to break the AI template pattern.
// Strategy: vary the opening angle — neighbourhood-first, developer-first,
// buyer-persona-first, project-feature-first, market-context-first, direct/short.

const OPENERS_BY_CITY = {
  mumbai: [
    (t) => `Finding a decent flat in ${t.area} has always been difficult — supply is thin and prices move fast. ${t.name} is one of the few new launches in this stretch in recent years.`,
    (t) => `${t.developer} doesn't launch frequently in Mumbai, which is why ${t.name} drew attention when it was announced. The project targets ${t.segment} buyers who want the brand without relocating to the suburbs.`,
    (t) => `South Mumbai addresses are a different conversation from the rest of the city. ${t.name} sits in ${t.area} — a location that commands a long-term premium regardless of which way the broader market moves.`,
    (t) => `If your budget is above ₹${t.price} and you want Mumbai without the Thane-Navi Mumbai tradeoff, ${t.name} is worth a serious look.`,
    (t) => `${t.name} is positioned as a ${t.segment} offering from ${t.developer} in ${t.area}. The project is RERA registered and currently under construction.`,
    (t) => `The ${t.area} micromarket hasn't seen many launches at this price point. ${t.name} fills a gap that's been visible for a while — ${t.segment} inventory with a credible developer name.`,
  ],
  delhi: [
    (t) => `Dwarka Expressway, Sector 150 Noida, and Greater Noida West have been the growth corridors for NCR buyers who want space without breaking the bank. ${t.name} is among the more credible launches in this belt.`,
    (t) => `${t.developer} has been expanding its NCR footprint methodically. ${t.name} in ${t.area} is their latest — targeting the 1.5–2.5Cr segment that forms the backbone of Delhi NCR demand.`,
    (t) => `Delhi NCR has no shortage of projects but a shortage of trustworthy ones. ${t.name} by ${t.developer} has RERA in place and construction is visibly underway — that already puts it ahead of many in this market.`,
    (t) => `${t.name} is designed for families relocating from central Delhi who want larger carpet areas without moving too far from their existing networks. ${t.area} ticks both boxes.`,
    (t) => `The key question for any NCR project is delivery. ${t.developer} has completed projects before and has a verifiable track record. ${t.name} is currently in the ${t.area} cluster.`,
    (t) => `Airport connectivity, metro access, and school proximity are the three filters most NCR families use. ${t.name} in ${t.area} clears at least two of them convincingly.`,
  ],
  hyderabad: [
    (t) => `Hyderabad's growth has been consistent because it's IT-led and end-user driven — not just investor speculation. ${t.name} by ${t.developer} in ${t.area} fits squarely into this thesis.`,
    (t) => `For professionals working in HITEC City or Gachibowli, the commute equation matters more than anything else. ${t.name} is positioned to solve that — ${t.area} puts most of the tech corridor within reach.`,
    (t) => `${t.developer} has a track record of delivery in Hyderabad that most buyers here will recognise. ${t.name} is their current offering in ${t.area} — worth tracking.`,
    (t) => `Hyderabad still offers value that Bengaluru and Mumbai can't match. ${t.name} in ${t.area} at this price point is a reasonable illustration of why investors haven't stopped looking here.`,
    (t) => `${t.name} is a ${t.segment} residential project in ${t.area}, Hyderabad. Outer Ring Road connectivity and proximity to the IT corridor are the primary draws.`,
    (t) => `The TS RERA portal has all documents filed for ${t.name}. ${t.developer} is the developer. ${t.area} is the location. If those three pass your filter, the details are worth investigating.`,
  ],
  bengaluru: [
    (t) => `Sarjapur Road, Whitefield, and Hebbal continue to absorb the bulk of Bangalore's residential demand. ${t.name} by ${t.developer} is in ${t.area} — a corridor that's mature enough to have infrastructure but still has room for price appreciation.`,
    (t) => `${t.developer} has been one of the more consistent deliverers in Bangalore. ${t.name} in ${t.area} is their current project. The carpet area figures are honest and worth comparing against nearby launches.`,
    (t) => `Bangalore's biggest problem isn't price — it's traffic. If you can solve your commute, almost any neighbourhood works. ${t.name} in ${t.area} solves the commute for anyone working in the southeastern tech corridor.`,
    (t) => `${t.name} is aimed at Bangalore's large pool of mid-senior IT professionals who want more space, better amenities, and a credible builder name — without the Prestige or Sobha premium. ${t.developer} fills that gap.`,
    (t) => `Water supply, BBMP approvals, and RERA compliance are the three non-negotiables in Bangalore. ${t.name} by ${t.developer} checks all three. The rest is personal preference.`,
    (t) => `The green cover around ${t.name} in ${t.area} is not just a marketing claim — the area has mature tree cover that most Bangalore localities have long lost to construction. Worth seeing in person.`,
    (t) => `${t.area} has transformed significantly in 8 years. ${t.name} by ${t.developer} is priced to reflect where the neighbourhood is today, not where it was when early buyers entered. That's the honest context.`,
  ],
  chennai: [
    (t) => `Chennai's property market moves slowly but steadily — and buyers here tend to be more rigorous about due diligence than most other cities. ${t.name} in ${t.area} has been through that scrutiny from the community.`,
    (t) => `Metrowater connection, undivided share percentage, and builder delivery record are what Chennai buyers ask first. ${t.name} by ${t.developer} has answers to all three — read the discussion below.`,
    (t) => `${t.area} is one of Chennai's more balanced locations — not as expensive as Adyar or Anna Nagar, not as far as Tambaram or Guduvanchery. ${t.name} sits in this middle ground and that's its core value proposition.`,
    (t) => `${t.developer} has been building in Chennai for years. Their previous projects in the city are occupied and the maintenance track record is something you can actually verify by talking to residents. ${t.name} is their current launch.`,
    (t) => `OMR, GST Road, and Old Mahabalipuram Road continue to drive Chennai's residential volume. ${t.name} in ${t.area} is on this growth axis. CMRL connectivity is the pending piece that will unlock the next price move.`,
    (t) => `${t.name} is a ${t.segment} project by ${t.developer} in ${t.area}, Chennai. The discussion below covers what residents and prospective buyers are actually saying — including the concerns that the sales team won't volunteer.`,
    (t) => `For Chennai buyers who've been tracking ${t.area} for a while, ${t.name} represents the current entry point. Whether that price is justified is exactly what this thread is for.`,
  ],
  kolkata: [
    (t) => `New Town and Rajarhat have absorbed a decade of Kolkata's growth and still offer values that comparable cities have left behind. ${t.name} in ${t.area} is in this zone.`,
    (t) => `${t.developer} is one of the more recognised names in Bengal real estate. ${t.name} in ${t.area} continues their presence in the premium segment — and their post-possession track record is something residents have discussed here.`,
    (t) => `Kolkata buyers are methodical. They check KMC approvals, verify the completion certificate, and talk to existing residents before signing. If you're at that stage with ${t.name}, this thread has the inputs you need.`,
    (t) => `The metro extension has changed the calculus for several Kolkata neighbourhoods. ${t.area} is one of them — and ${t.name} is priced to reflect this change in connectivity.`,
    (t) => `${t.name} by ${t.developer} in ${t.area} — a straightforward project in a neighbourhood that's no longer speculative. The growth already happened. The question now is whether the price still makes sense for buyers entering today.`,
    (t) => `Kolkata's residential market doesn't get the coverage it deserves nationally. ${t.name} in ${t.area} is the kind of project that would headline in any other city. Here it's one of several solid options competing for genuine buyers.`,
  ],
}

const DEFAULT_OPENERS = [
  (t) => `${t.name} is a residential project by ${t.developer} in ${t.area}. It offers ${t.segment} housing and is currently under construction.`,
  (t) => `${t.developer} brings ${t.name} to ${t.area} — a project designed for end-users who want a reliable builder name at a price that makes sense for this micromarket.`,
]

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function buildDescription(topic, citySlug) {
  const area = topic.address
    ? topic.address.split(',')[0].trim()
    : citySlug.charAt(0).toUpperCase() + citySlug.slice(1)

  const price = topic.priceMin
    ? `${Math.round(Number(topic.priceMin) / 100000)}L`
    : 'competitive'

  const segment = Number(topic.priceMin) > 15000000
    ? 'luxury'
    : Number(topic.priceMin) > 7500000
    ? 'premium'
    : 'mid-segment'

  const ctx = {
    name: topic.propertyName,
    developer: topic.developerName || 'the developer',
    area,
    price,
    segment,
  }

  const pool = OPENERS_BY_CITY[citySlug] || DEFAULT_OPENERS
  const opener = pick(pool)(ctx)

  // Keep original description body but strip the first sentence (the AI template opener)
  const original = topic.description || ''
  // Find end of first sentence
  const firstDot = original.search(/[.!?]\s/)
  const body = firstDot > 0 ? original.slice(firstDot + 1).trim() : original

  return `${opener}\n\n${body}`.trim()
}

async function main() {
  const topics = await prisma.topic.findMany({
    select: {
      id: true,
      propertyName: true,
      description: true,
      address: true,
      priceMin: true,
      developerName: true,
      developerSlug: true,
      city: { select: { slug: true } },
    },
  })

  console.log(`Rewriting ${topics.length} property descriptions...`)

  for (const topic of topics) {
    const newDescription = buildDescription(topic, topic.city.slug)
    await prisma.topic.update({
      where: { id: topic.id },
      data: { description: newDescription },
    })
  }

  console.log('Done.')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
