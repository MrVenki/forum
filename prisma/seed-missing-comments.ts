import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// --- Comment bank by property type and city tier ---
// Each entry is a pair: [positive-leaning, neutral/negative-leaning]
// Mixed in for realism. Real home buyers share both concerns and appreciation.

const commentsByType: Record<string, string[][]> = {
  APARTMENT: [
    [
      "We visited the site last weekend. Construction quality looks solid and the lobby area is much better than what the brochure shows. The project manager was quite helpful and answered all our questions patiently.",
      "Floor plans are decent but the 2BHK feels a bit cramped once you factor in the walls. The corridor width is narrow. Still considering it because the location is unbeatable for our commute.",
      "Booked a 3BHK here six months ago. So far so good — the updates on the builder app are regular and the structure has reached the 8th floor as promised. Hope they maintain this pace.",
    ],
    [
      "Attended the site visit last month. The sample flat looks great but I noticed the actual flat sizes are about 10% smaller than marketed once you remove the balcony. Keep that in mind.",
      "We've been tracking this project for a while. The location is excellent but the parking allocation feels insufficient for a complex this size. They're promising 1.2 cars per flat on average.",
      "Shortlisted this along with two other projects. The pricing is fair for the area but the maintenance charges post-possession seem on the higher side at ₹4/sqft. Did anyone negotiate this down?",
    ],
    [
      "My brother booked here in the early launch phase. Got a great deal compared to current prices. The amenity floor plan looks impressive — rooftop pool and co-working space are rare in this price range.",
      "Site visit done. The RCC structure feels robust. One concern: the builder hasn't shown clarity on the transformer and power backup specs. Need to clarify before booking.",
      "Has anyone checked the RERA page for this project? Want to confirm the completion date and pending approvals. Would appreciate if someone can share the RERA number.",
    ],
    [
      "Compared this with a neighbouring project. This one wins on green area and setbacks. The open space ratio is genuinely higher. Good choice for families with kids.",
      "The show flat was impressive, especially the vitrified tile quality and the modular kitchen they've provided. But I'd recommend asking for the actual brand specs before you take those as final.",
      "Already signed the AOS. The registration office documentation was surprisingly smooth — their legal team is efficient. Hoping the possession timeline of Q3 2026 holds.",
    ],
  ],
  VILLA: [
    [
      "Visited the villa plots last Sunday. The roads inside the gated community are wide — at least 30 feet for the main roads. The boundary wall is already up which gives you a real sense of security.",
      "Club house infrastructure is still under construction but they showed us the 3D renders. The swimming pool and indoor sports area look genuinely upscale. The landscaping plan also seems thoughtful.",
      "Compared four villa projects in this micro-market. This one scores highest on plot size and setback rules. The minimum plot size of 2400 sqft ensures you won't end up with a postage stamp villa next to you.",
    ],
    [
      "The villa looks good on paper but check the soil test reports before you commit. The area had some waterlogging history in heavy rains. The builder claims it's addressed with drainage but I'd want to see the plan.",
      "Site is great but the approach road from the main highway is still under widening. For the next 12-18 months access will be an inconvenience. After that it should be fine.",
      "We booked and are happy so far. The builder's track record is good — I checked their earlier delivered villa project and the quality held up 3-4 years post-possession, which is the real test.",
    ],
  ],
  PLOT: [
    [
      "RERA registered, all approvals in place — this is the first thing I checked. Plots in this area have appreciated 25% in the last 2 years so even as an investment it looks attractive right now.",
      "Location scouted. The master plan layout is good — corner plots here are genuinely valuable because of the dual road access and better ventilation. Worth the 15% premium they're charging for corners.",
      "Visited twice. The neighbourhood development is picking up fast. Three schools within 2km, and the new arterial road passing 500m away should boost connectivity significantly once it opens.",
    ],
    [
      "My main worry is construction timeline for common amenities. The club house and internal roads should come before you take possession of the plot. Get it in the agreement.",
      "Plots are priced at a premium compared to the surrounding area but the gated community brand commands that. Just make sure you understand the construction timeline stipulations — there's usually a 2-year build window.",
      "The floor area ratio and setback rules the builder has prescribed are restrictive but they ensure uniform aesthetics. Worth checking if you have specific architectural plans in mind.",
    ],
  ],
  COMMERCIAL: [
    [
      "Looked at the office spaces here. The floor plate is large — around 18,000 sqft per floor — which works well for us. The common area maintenance structure is transparent and monthly billing is itemised.",
      "Grade A infrastructure with LEED pre-certification. The power backup is 100% and the fibre connectivity is being handled by two providers. Genuinely impressive for the location.",
      "Visited the showroom spaces on the lower floors. Good foot traffic potential given the residential catchment. The car parking ratio of 1:1000 sqft is standard for the segment.",
    ],
    [
      "The lease terms need careful review. The escalation clause at 15% every 3 years is on the higher side. Other Grade A buildings in the area are offering 12%. Negotiate before you sign.",
      "The loading and unloading zone planning seems insufficient for a retail-heavy building. If you're running a business that needs regular deliveries, this needs to be factored in.",
      "Overall the project is solid but check the exit clause in the agreement. Breaking a 5-year lock-in can be expensive if your business plans change.",
    ],
  ],
}

const genericComments: string[][] = [
  [
    "We visited the site last Sunday with family. The area is well-developed and the project seems on track. The sales team was professional and not pushy — rare these days.",
    "Pricing is justified given the location and developer track record. We compared three projects nearby and this one offers the best value-to-specs ratio.",
    "One concern: the possession timeline is Q4 2026 but construction is still in early stages. Keeping a close eye on the quarterly construction updates.",
  ],
  [
    "Done the site visit. Impressive amenity floor plan — 30+ amenities is more than most in this segment. But quality of execution matters more than count on the brochure.",
    "Booked a unit here after thorough due diligence. RERA registration is clean, previous projects delivered on time. Cautiously optimistic.",
    "The price per sqft is higher than the area average but the quality and brand premium justifies it. Check the carpet area carefully before signing.",
  ],
  [
    "Sample flat is stunning but the actual unit views vary — insisted on seeing the actual floor for our unit before signing. Worth doing.",
    "Bank loan got approved without hiccups — at least three nationalised banks are pre-approved here which shows the financial due diligence is clean.",
    "The project is good but the parking is tight. 1 covered slot per unit is standard but visitor parking feels scarce. Worth asking about.",
  ],
  [
    "Compared against another leading developer nearby — this one wins on open space and green area. Families with children should prioritise this criterion.",
    "Registered the flat 2 months ago. Stamp duty and registration at this price band was significant but the process was smooth. Builder's legal team is well-organised.",
    "Construction update: as of my last visit the structure is up to the 12th floor on Tower A. Seems on schedule for the promised delivery.",
  ],
  [
    "Had a long discussion with the project engineer during site visit. They're using M25 concrete for the frame and the column spacing looks good. No major structural concerns.",
    "The location will only get better — infrastructure projects in this corridor are already underway. Long-term outlook is positive.",
    "My main ask is that the builder maintains quality during the finishing phase. Most issues in new projects emerge at the plastering and electrical stage. Watching closely.",
  ],
  [
    "First time buyer here. Did a lot of research before shortlisting this. The builder's RERA page shows no complaints filed against them which is a good sign.",
    "Negotiated a 2.5% discount off the list price for early payment. Always worth asking even if the answer is no.",
    "The proximity to the metro station (under construction) is the main draw. Once that opens, this location's value will jump significantly.",
  ],
]

// Pick comments from the right bucket, or fall back to generic
function getComments(propertyType: string): string[][] {
  const bucket = commentsByType[propertyType] ?? genericComments
  // shuffle and pick 2-3 pairs
  const shuffled = [...bucket].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 2 + Math.floor(Math.random() * 2)) // 2 or 3
}

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

async function main() {
  // All topics with no comments
  const bareTopics = await prisma.topic.findMany({
    where: { comments: { none: {} } },
    select: {
      id: true,
      propertyName: true,
      propertyType: true,
      userId: true,
      city: { select: { name: true } },
    },
  })
  console.log(`Found ${bareTopics.length} topics with no comments`)

  // Get a pool of users (exclude topic authors where possible)
  const allUsers = await prisma.user.findMany({ select: { id: true, name: true } })
  console.log(`User pool: ${allUsers.length}`)

  let totalComments = 0

  for (const topic of bareTopics) {
    const commentSets = getComments(topic.propertyType ?? 'APARTMENT')

    for (let i = 0; i < commentSets.length; i++) {
      const commentTexts = commentSets[i]
      // Pick a random user (not the topic author)
      const eligible = allUsers.filter(u => u.id !== topic.userId)
      const author = eligible[Math.floor(Math.random() * eligible.length)]

      // Each "comment set" is actually 1 picked comment from the pair
      const text = commentTexts[Math.floor(Math.random() * commentTexts.length)]
      const daysBack = 5 + i * 3 + Math.floor(Math.random() * 7) // spread over past few weeks

      await prisma.comment.create({
        data: {
          topicId: topic.id,
          userId: author.id,
          content: text,
          createdAt: daysAgo(daysBack),
          updatedAt: daysAgo(daysBack),
        },
      })
      totalComments++
    }
  }

  console.log(`\n✅ Added ${totalComments} comments across ${bareTopics.length} topics`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
