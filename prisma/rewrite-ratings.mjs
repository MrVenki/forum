import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Human rating reviews — short (1-3 sentences), varied sentiment, real Indian English
// Indexed roughly by star score feel (but randomly assigned)

const REVIEWS_5_STAR = [
  `Best decision I've made. Not a single complaint after 14 months.`,
  `Superb location, superb quality. Builder kept every promise. Rare.`,
  `Possession on time. Flat exactly as promised. 5 stars no question.`,
  `Excellent project. My family is thrilled. Highly recommend.`,
  `Top class finishing. Neighbours are good people too. Happy all around.`,
  `Dream home achieved. Worth every paisa.`,
  `They delivered what they showed in the model flat. That itself deserves 5 stars.`,
  `0 issues after 2 years. Maintenance team is responsive. Keep it up.`,
  `Location is unbeatable, connectivity is superb, builder is reliable. What else?`,
  `My parents are living here. They are very happy. That's my rating criteria.`,
  `Best value I found after checking 9 projects. Very satisfied.`,
  `Even the watchman is professional here. That's when you know management is good.`,
  `Lifted OC in record time. No pending issues. Honest builder.`,
  `Society life is wonderful. We have festivals together. Community feel is real.`,
  `Club house is actually usable unlike most projects. Pool is clean, gym is equipped.`,
]

const REVIEWS_4_STAR = [
  `Good project overall. Only gripe is parking – not enough visitor spots.`,
  `Quality is solid. Delivery was 2 months late but builder communicated throughout. Acceptable.`,
  `Great location, good construction. Slight variation in tile shade vs sample. Minor.`,
  `4 stars because maintenance charges are high. Everything else is excellent.`,
  `Happy with the purchase. Metro connectivity once it opens will make this perfect.`,
  `Nice project but sales team was pushy initially. Post booking experience is much better.`,
  `Good builder, good location. Wish the windows were bigger. Otherwise no complaints.`,
  `4/5. Would be 5 if the road outside was smoother. Internal roads are great though.`,
  `Landscaping is beautiful. Gym could use more equipment but decent for daily use.`,
  `Value for money is good. Not luxury but honest mid-segment quality.`,
  `Possession came early by 3 weeks. Small surprise but a good one.`,
  `Society is well managed. Only issue – intercom system was broken for first 3 months.`,
  `Great buy for end use. Investment returns will be moderate – don't expect 20% appreciation.`,
  `Plumbing quality is good. Electrical points are well placed. Thought went into design.`,
  `Happy overall. The rooftop garden is genuinely a good feature.`,
]

const REVIEWS_3_STAR = [
  `Average. Not bad not great. Location saves it.`,
  `Some promises kept, some not. Like every builder honestly.`,
  `Okay project. Expected better finishing for the price.`,
  `3 stars. Builder was slow to respond to complaints for first 6 months.`,
  `Mixed feelings. Flat is good. Common areas are below expectation.`,
  `Decent construction but the lobby is underwhelming for the price point.`,
  `Mid-range quality for premium pricing. Do your research before committing.`,
  `Society management is average. Accounts not transparent enough.`,
  `Fine for now. Let's see how it holds up in 5 years.`,
  `Nothing exceptional but nothing terrible either. Safe choice.`,
  `Was expecting better soundproofing between floors. Hear everything from above.`,
  `Clubhouse is nice but 90% of time it's locked for maintenance. Frustrating.`,
  `Okay buy if this is your budget range. Don't compare to luxury projects.`,
  `Location is good. Building quality is average. Management is okay. Overall 3.`,
  `Not what I expected but livable. Kids are happy which matters most.`,
]

const REVIEWS_2_STAR = [
  `Disappointed. Several spec changes made without proper notification.`,
  `Possession delayed by 11 months. Barely got any compensation. Frustrating experience.`,
  `Quality issues found during snag inspection. Builder slow to fix. Not acceptable.`,
  `Parking allocation is unfair. First-come-first-serve is not first-come in reality.`,
  `Sales team overpromised. Post-sale support is terrible. Classic builder problem.`,
  `2 stars for the location. Would be 1 star for everything else.`,
  `Leakage in bathroom after 8 months. Builder says it's our responsibility. Shocking.`,
  `Common area lights don't work properly. Swimming pool still not operational after 14 months.`,
  `Tile quality different from sample flat. Raised complaint, no resolution for 3 months.`,
  `They increased maintenance charges 35% in year 2 without adequate notice. Wrong.`,
  `Construction quality visible issues – cracks in plastering on some walls. Not what I paid for.`,
  `The promised 24-hour security is actually 2 guards for the whole complex. Misleading.`,
]

const REVIEWS_1_STAR = [
  `Stay away. Possession 18 months late. RERA complaint filed. Builder not responding.`,
  `Worst purchase of my life. Fake promises, poor quality, no accountability.`,
  `Do not buy. They will take your money and forget you exist.`,
  `1 star for teaching me to read every clause in the agreement. Lesson learned the hard way.`,
  `Structural cracks visible. Builder blaming settling. Not acceptable for a 3-year-old building.`,
  `Society not formed after 2 years of possession. Builder still controlling maintenance and overcharging.`,
  `Flooring tiles are nothing like sample flat. Doors don't close properly. Pathetic quality control.`,
  `Run away from this project. I say this as someone who made the mistake of buying.`,
]

const ALL_REVIEWS = [
  ...REVIEWS_5_STAR,
  ...REVIEWS_5_STAR, // weight towards positive
  ...REVIEWS_4_STAR,
  ...REVIEWS_4_STAR,
  ...REVIEWS_3_STAR,
  ...REVIEWS_2_STAR,
  ...REVIEWS_1_STAR,
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Pick review roughly matching star score
function pickForScore(score) {
  if (score >= 5) return pick(REVIEWS_5_STAR)
  if (score === 4) return pick(REVIEWS_4_STAR)
  if (score === 3) return pick(REVIEWS_3_STAR)
  if (score === 2) return pick(REVIEWS_2_STAR)
  return pick(REVIEWS_1_STAR)
}

async function main() {
  const ratings = await prisma.rating.findMany({
    select: { id: true, score: true },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`Rewriting ${ratings.length} rating reviews...`)

  for (const rating of ratings) {
    await prisma.rating.update({
      where: { id: rating.id },
      data: { review: pickForScore(rating.score) },
    })
  }

  console.log('Done.')
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
