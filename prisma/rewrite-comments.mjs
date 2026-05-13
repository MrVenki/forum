import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// ─── Human review pools per city ─────────────────────────────────────────────
// Mix of: short/long, positive/negative/mixed, typos, regional slang,
// complaints, questions, enthusiasm, frustration, NRI comparisons

const MUMBAI = [
  `Attended the launch two months ago. The 3BHK sample flat looked stunning but honestly every builder dresses up the sample unit. Reality check will come at possession. Fingers crossed.`,
  `Seaview is ONLY from 28th floor and above. Sales bhai told everyone they'd get sea view. Absolute lies. Please go visit and confirm which floors actually face the sea before signing.`,
  `Location is non-negotiable for me. Malabar Hill, Worli, Lower Parel – these addresses hold value even in a down market. Booked 2BHK. No regrets so far.`,
  `Maintenance charges are ₹8 per sqft per month. For a 1200sqft flat that's ₹9600 every month before you've paid a single EMI. Nobody tells you this during the sales pitch.`,
  `My cousin took possession last year in a similar project by this builder. Lobby marble was different from brochure. Flooring was same grade. Overall 7/10.`,
  `Parking allocation is first come first served apparently. Booked on day 1 and still no confirmed stilt parking. Basement only. Big issue for me.`,
  `Price has jumped 40% since 2022 launch. If you got in early hats off. Now it doesn't make sense to me financially. Resale from an early buyer is what I'm looking at.`,
  `Corpus fund is 50 lakh minimum contribution per flat. On top of stamp duty, GST, registration. The all-in cost is nowhere close to the advertised price. Do your math.`,
  `Good quality no doubt. Builder has delivered before. My office colleague lives in their Thane project – zero complaints after 3 years. That gave me confidence.`,
  `Sales team is very very pushy. I said I need time to decide and they called me 11 times in 3 days. Blocked the number after that. Not a good sign.`,
  `Tbh the location alone justifies the price for me. Nothing else available in this micro-market at any price. Bought it knowing it's premium and accepting that.`,
  `Water supply situation in this area needs checking. Ask specifically about MCGM connection vs tanker dependency. Critical for everyday life.`,
  `My father booked a flat here after retirement. He says construction quality is noticeably better than his previous flat in Kandivali from 15 years ago. Good enough reference for me.`,
  `Clubhouse is 18000 sqft on paper. Reality is probably 10000 sqft usable. Pool looks nice in renders. We'll see.`,
  `3BHK at this price in South Mumbai is actually reasonable if you compare to Peddar Road or Cuffe Parade. Rare deal or at least feels like one.`,
  `Delivery was promised December 2024. Now saying March 2025. Small slip but still a slip. Watching carefully.`,
  `Not recommending to anyone looking for investment returns. For self-use and lifestyle – absolutely yes.`,
  `The model apartment photos on their website vs what I saw in person – not very different actually. Give credit where it's due.`,
  `I work in BKC. This location cuts my commute from 1 hour to 20 minutes. Worth every extra rupee to me.`,
  `Amenities list is impressive. Olympic pool, sky lounge, business centre. But 80% of these will be closed for "maintenance" within 5 years – it's India.`,
  `Checked 6 projects before finalising. This one had the best carpet area efficiency at 78%. Most others were 68-70%. That's real money saved.`,
  `RERA registration number is on the website. I verified it on maharera.mahaonline.gov.in. All documents are in order. Rare these days.`,
  `Too expensive for what it is. Similar quality available in Ghodbunder for half the price. You're paying for the postcode only.`,
  `Builder has a track record of 22+ delivered projects. That matters more to me than any brochure image.`,
  `Went for site visit with my wife. She loved it. I thought it was overpriced. We're still arguing.`,
  `Loft-style apartments look amazing but ceiling height is only 9 feet in bedroom. The 12 feet is living room only. Clarify before booking.`,
  `If you're buying for investment and don't plan to live here immediately – check rental yield. This area gives 2.8% max. Not great.`,
  `Construction is solid. I knocked on the walls in the sample unit. No hollow sound. Whoever checked this knows what I mean.`,
  `Finally a Mumbai project without a ridiculous society name. Simple, professional branding.`,
  `Paid 15 lakh booking amount and now builder is asking for next installment 2 months before the milestone. Read your agreement carefully people.`,
]

const DELHI = [
  `Sector 150 Noida is becoming a concrete jungle. When all these towers fill up the traffic situation will be a complete mess. No one is planning for infrastructure.`,
  `Good investment pick. Yamuna Expressway to Agra in 35 minutes is not a joke anymore. Weekend home value will only go up.`,
  `Brochure shows 25m swimming pool. I measured during site visit. It's 18m. Small lie but it erodes trust for bigger things.`,
  `DDA approved and RERA registered. For Delhi NCR this is actually a big deal. Half the projects in Gurgaon don't have proper approvals.`,
  `AQI is 350 in November. No greenery plan can fix Delhi air. Amenities look good on paper but you'll spend winter indoors anyway.`,
  `Went with high hopes. Left disappointed. Sample flat was excellent. Asked where the actual construction site was. 3km away and still at plinth level. Booking open for 3 years already.`,
  `Gurgaon Golf Course Extension is overrated. This project on Dwarka Expressway makes more practical sense for airport connectivity.`,
  `Sales team is trained extremely well. Too well. Every answer sounds rehearsed. Ask uncomfortable questions about delays and watch them squirm.`,
  `Bought this for my parents. Location is good – hospital nearby, market within walking distance, flat road. Practical choice.`,
  `M3M quality in my experience is good. Friend lives in M3M Woodshire. 4 years no major issues. Maintenance is average but livable.`,
  `At 1.8Cr for 3BHK on Dwarka Expressway this is genuinely decent pricing vs what Central Delhi offers for the same money.`,
  `Two water borewells plus Delhi Jal Board connection. Confirmed this from the RWA meeting minutes. This is important – verify before buying.`,
  `The green area is real. I walked the site. Trees are mature not new plantings. This is actually rare for a new project.`,
  `Foundation delay of 4 months because of NGT stay near Aravallis. Builder notified all buyers by email. Transparent at least.`,
  `Society formation process is unclear. Who manages the property before RWA is elected? This is a common gray area – get it in writing.`,
  `Possession in Q3 2025 they say. My contractor friend visited the site. Says Q1 2026 is more realistic looking at current pace.`,
  `Penthouses on top 3 floors are genuinely special. Private terrace, sky view, Delhi pollution notwithstanding. If money is not an object.`,
  `Compared to Singapore or Dubai where I work – affordable luxury doesn't exist there. This project is what affordable luxury looks like in India.`,
  `Don't book only on virtual tour. Go to site. Touch the construction. Talk to labourers if you can. They'll tell you the real story.`,
  `Sports facilities are the USP here. If you have kids this project makes sense. Otherwise similar projects are available cheaper.`,
  `3 months since I raised a service request for a leak in sample flat. Still pending. Not encouraging for post-possession support.`,
  `The road connectivity to IGI Airport improved dramatically after expressway. 30 minutes flat. That's the USP nobody talks about enough.`,
  `Builder gave 6% subvention scheme. Sounds good. Do the math – the base price is 8% higher than market. Not really a deal.`,
  `First floor vs top floor debate – I chose 8th floor. Not too high, good cross ventilation, stairs accessible if lift issues. Logical choice.`,
  `Lost my booking amount in another NCR project last decade. Very careful this time. Checked RERA, builder financials, delivery record. This one passed.`,
]

const HYDERABAD = [
  `Gachibowli office crowd has pushed prices here by 25% in 2 years. If you work in HITEC City this still makes sense. If not – why?`,
  `Pocharam is up and coming they say. Up and coming since 2018. Still coming. Location is genuinely developing but timeline is anyone's guess.`,
  `Telangana RERA is strict. Builder cannot mess around like some other states. This gives me confidence to invest here over Karnataka actually.`,
  `My friend booked here last year. Possession came 3 months early. Rare but happened. Quality checks were thorough per him.`,
  `Price escalation clause in agreement is 4%. Builder already invoked it once. Read clause 8.2 of your agreement very carefully.`,
  `Hyderabad still has the best value for money in top 4 cities. Same money in Mumbai or Bangalore gives half the carpet area.`,
  `Outer ring road connectivity is the real game changer here. 20 minutes to airport, 25 minutes to Hi-Tec city. Sold.`,
  `Sales office is far better than actual project site. Visited both in same day. Site is lagging by at least a year from what they claim.`,
  `Club house and amenities ratio to number of flats is 1:420. Too many families for one pool. Calculate this before falling for amenity renders.`,
  `My Telugu is limited but the local sales guy was patient and explained everything in English. Good experience overall.`,
  `Apartment sizes are generous here vs Bangalore. Same budget gets me 300 sqft more. That's a whole room difference.`,
  `Water table in this area is good. Tanker dependency is low. Checked with existing residents of adjacent society. Important for Hyderabad.`,
  `I rejected 3 projects before this one. This one cleared my checklist: undivided share certificate, RERA registered, occupancy certificate for previous phase, positive resident feedback.`,
  `Construction pace is visibly good. 4 floors per month from what I tracked on Google Maps satellite view over 6 months.`,
  `Exit route is narrow. When 2000 families move in this one lane will be a nightmare. Builder should address this before OC.`,
  `Prestige group name carries weight here. Their Hyderabad projects have all delivered on time from what I've tracked.`,
  `Negotiated 2.5 lakh off on 3BHK and free car parking. Everything is negotiable. Don't accept first price ever.`,
  `Bit far from city centre but the metro extension makes this viable in 2 years. Early mover advantage if you can hold.`,
  `The rooftop terrace garden is genuinely beautiful. Best feature of this project hands down.`,
  `Flat for flat comparison with 5 nearby projects – this one had best carpet area and second best price. Clear winner for me.`,
  `Seepage issues reported in lower floors of Phase 1. Builder fixed it apparently. But it gives me pause about Phase 2.`,
  `My colleague booked 2BHK here and I visited to check. Honestly I regret not booking the same day. Prices have moved since.`,
  `Ground floor – rejected. Basement parking directly below. Noise and fumes will be an issue.`,
  `The green certification is actually meaningful here. Energy savings on AC bills over 20 years is significant.`,
  `IT folks from Amazon, Microsoft, Google are the target buyers. You can see the quality decisions are made for this audience.`,
]

const BENGALURU = [
  `Sarjapur Road traffic is an absolute nightmare. I commute this way daily. Factor in 1.5 to 2 hours each way if you work in Whitefield. Not an exaggeration.`,
  `Prestige delivery record in Bangalore is strong. They've given OC on time for last 5 projects I've tracked. This is the main reason I booked.`,
  `77 lakh for 2BHK on Sarjapur? In 2019 this was 48 lakh. Bangalore prices have lost all logic. I'm looking at Mysore now.`,
  `Green cover is real – not marketing. My balcony literally faces a cluster of old rain trees. No other project in 5km radius has this.`,
  `Borewell + BWSSB dual source confirmed. In Bangalore water is not a small thing. This checked a major box for me.`,
  `Sobha finishes are consistently the best in Bangalore. Not debatable. Their Hartland project in Dubai is same standard. I've seen both.`,
  `Koramangala to this location is 40 minutes on a good day. 90 minutes on a Monday morning. Location works if you WFH or have flexible hours.`,
  `Total Environment has the best concept but slowest delivery. Their Windmills project took 7 years. Beautiful but 7 years.`,
  `Asked the sales manager directly – what was the reason for delay in previous project? He gave me a straight answer. That gave me confidence.`,
  `Bengaluru IT bubble will burst. Property prices here are completely disconnected from real economy. Booking anyway because I need to live somewhere.`,
  `Maintenance ₹5 per sqft per month. For 1600sqft that's ₹8000 monthly before power, water, internet. Budget accordingly.`,
  `Society has already formed in Phase 1. Met the President. She's very active, keeps builder accountable, has a WhatsApp group with 1200 members. This is reassuring.`,
  `I shortlisted this vs Brigade and Godrej in same area. This one had better carpet area, slightly lower price, and faster construction pace. Logic wins.`,
  `Nobody talks about piped gas connection. This project has one. Saves ₹900 monthly on cylinders. Small thing that matters.`,
  `Whitefield is saturated. Sarjapur is the next 5-year growth corridor. Entry point now makes sense for investors with patience.`,
  `Asked to see the quality of construction in an unfinished floor. They allowed it. Concrete quality is good. Slab thickness is proper.`,
  `The rooftop infinity pool is only for penthouses. Everyone else gets the ground floor pool. Read the amenity document carefully.`,
  `Resale in this project already happening at 12% premium over my booking price. That's 2 years before possession. Looks promising.`,
  `NRIs from USA and Canada are the majority buyers in this tower. Prices are being driven by dollar income. Difficult for Bangalore salaried to compete.`,
  `My builder gave OC but not CC (completion certificate). Important distinction. OC means building is complete. CC means it conforms to approved plan. Check both.`,
  `First time buyer here. The process is overwhelming. Took 3 months, 4 lawyers, 2 CAs and 11 site visits before booking. Now booked. Still nervous.`,
  `Good for end use. If you're expecting Gurgaon-style price appreciation in Bangalore, recalibrate expectations.`,
  `Lift is scheduled to serve 24 floors. One lift for every 120 flats. Wait times will be brutal on Monday mornings.`,
  `Assetz Earth and Essence disappointed many buyers last year with spec changes. Check if there's a spec lock clause in your agreement.`,
  `Project is adjacent to a quarry. Not mentioned in brochure. Blasting happens twice a week. Go on a Tuesday or Friday to experience it.`,
  `Amenities are A grade. Construction pace is B grade. Price is C grade (too high). Overall I'm a B. Booked.`,
  `Spoke to the site engineer off the record. He said concrete mix ratio is properly maintained. Reinforcement steel is quality. Informal quality check.`,
]

const CHENNAI = [
  `Metrowater connection is confirmed or borewell? This is the ONLY question that matters in Chennai. Get it in writing. Don't trust verbal assurances.`,
  `OMR traffic from Sholinganallur to this project takes 45 minutes during peak. Factor this in. The road widening project will take another 3 years minimum.`,
  `Chennai builders are generally better at delivery timelines than other cities. This developer has delivered 4 projects within 6 months of promised date. Respectable.`,
  `Undivided share of land percentage is very low here – 4.2% on a 2000sqft flat. In Chennai this is a red flag. Get a lawyer to verify.`,
  `The Dravidian architecture touches in the entrance are actually tasteful. Not gimmicky. Appreciated.`,
  `Karapakkam prices have caught up with Velachery now. Same money, further location. The OMR premium is pricing out middle class buyers.`,
  `Casagrand delivery quality based on my friend's experience in their Pallikaranai project – acceptable but not exceptional. Tiles were slightly different from sample. Minor but noted.`,
  `CMRL Phase 2 to this area is approved not funded. Don't buy assuming metro connectivity will come in 2 years. Official estimate is 5 years.`,
  `Excellent society management from day one in previous phase. RWA is active, accounts are transparent, AGM happens every year. Rare quality.`,
  `The sea breeze in this part of Chennai is a genuine feature. Not marketing language. Cross ventilation in the 2BHK was excellent during my visit.`,
  `My mother lives 3km from here. She checked the construction quality during her evening walk for 2 months. She says it's solid. Better reference than any sales person.`,
  `Club house is massive but located at far end of the campus. 800 metre walk from Tower 3. This will be a problem for daily use.`,
  `Compared with Brigade and Shriram projects on same stretch. This one had best common area quality. Price difference is marginal. This wins.`,
  `Semma project pa. Location, quality, builder name – everything adds up. Booked 3BHK. Family is happy.`,
  `Parking issue – only one car slot per flat. 2BHK families with 2 cars will struggle. Visitor parking is also limited.`,
  `Rain water harvesting and solar panels are functional not just promised. Verified with Phase 1 residents. Electricity bill is ₹800 lower per month they say.`,
  `Don't fall for floor rise charges. Rs 75 per sqft per floor is highway robbery for floors 10 to 25. Negotiate or pick 4th to 9th floor.`,
  `Legal due diligence took me 6 weeks. Title is clean. No litigation on land. I'm satisfied. Don't skip this step people.`,
  `The Sholinganallur junction signal takes 4 minutes to cross during peak. Multiply by 2 trips daily for 20 years. Worth thinking about.`,
  `Appasamy has been building in Chennai since 1975. That's almost 50 years. They've seen market cycles, recessions, everything. Track record matters.`,
  `Purchased for my daughter who works in Perungudi IT park. 12 minute commute. She's very happy. That's what matters ultimately.`,
  `Builder changed the kitchen platform height specification without notifying buyers. Small thing but shows attention to commitments. Be watchful.`,
  `View from 18th floor is stunning – you can see the sea on a clear day from the east-facing units. Not the promised sea view but still beautiful.`,
  `3 year old Chennai project by this builder – friend lives there. Lift breaks once a month. AMC response time is 4 hours. Acceptable I think.`,
  `Tamil Nadu RERA website has all documents updated. Verified. Builder is compliant. This is the baseline minimum before booking anything.`,
  `GST is 5% on under construction. OC received property is GST exempt. Factor ₹3-5 lakh in your comparison between under-construction and ready.`,
]

const KOLKATA = [
  `Kolkata real estate is the most undervalued in India. Same quality flat costs 40% less than Bangalore. This is a fact not an opinion.`,
  `New Town has transformed beyond recognition in 10 years. The investment thesis here is real. My 2015 flat has 3x'd. Booked again.`,
  `PS Group delivery record is consistent. My uncle lives in their Laketown project from 2017. Zero structural issues. Maintenance is decent.`,
  `Rajarhat flooding during monsoon is a real problem. Check the flood zone maps. Some parts of New Town go underwater for days.`,
  `Merlin next construction is superb. I knocked on every wall in sample flat. No hollow spots. Good concrete mix. These things matter.`,
  `Salt Lake prices are comparable to South Mumbai now. The Kolkata premium is gone. People are moving to New Town for better value.`,
  `Bengali professionals buying here is 60% of sales. NRIs from USA/UK buying the rest. Organic demand not investor driven. Healthy sign.`,
  `The metro extension from Salt Lake to New Town has genuinely changed the game. 18 minute commute to Park Street. Unbelievable.`,
  `Club house design is inspired by Kolkata's colonial architecture. Subtle but very well done. Kolkata still has aesthetic sensibility.`,
  `My family is from Ballygunge. We never thought we'd settle in New Town. But the value proposition is undeniable. Booking confirmed.`,
  `Contractor changed mid-construction without buyer notification. Builder says quality is same. I'm monitoring.`,
  `Possession certificate is clear. OC is obtained. Tax receipts from KMC are in order. Rare to have everything clean – appreciate the builder for it.`,
  `Price appreciation in this micro-market has been 8-11% CAGR for 7 years. Steady not spectacular but very stable.`,
  `Kolkata municipality approvals are notoriously slow. This builder has experience navigating it. Delivered previous phase only 2 months late.`,
  `Power backup is full for flats and common areas. In Kolkata power cuts in summer are real. This was a deciding factor for me.`,
  `The wetland adjacent to the project is an ecological sensitive zone. 200 metre buffer is maintained. But long term encroachment risk exists.`,
  `South Kolkata buyers are traditionally reluctant to move North or East. This project is for progressive buyers who prioritise value. I count myself one.`,
  `Hiland Woods amenities are actually being used by residents. Visited on a Sunday – pool was full of kids, gym had 12 people. Alive and active.`,
  `Typical Kolkata market – slow to rise, slow to fall. Not for short term flips. 7 year minimum horizon needed here.`,
  `My colleague is RWA president in Phase 1. She says builder is responsive to complaints within 30 days. That's good by Indian standards.`,
  `Book now regret later or wait and pay more later. Kolkata is finally in growth cycle. I'm not taking the risk of waiting.`,
  `Waterfront view in some units is spectacular. During monsoon the view is cinematic. Worth the extra 8 lakh for east-facing unit.`,
  `Service tax, stamp duty, registration – all-in comes to 11% extra on base price. Factor this in. Nobody mentions this in the sales pitch.`,
  `Ambuja Neotia premium pricing is sometimes hard to justify vs. smaller local builders. But their post-possession service is genuinely better. Paying for peace of mind.`,
  `First time I've seen a project in Kolkata with a rooftop solar farm. 40% of common area electricity from solar. ESG minded builder.`,
]

// ─── Short sharp reactions (used as reply-style or secondary comments) ─────────
const SHORT_REACTIONS = [
  `Visited last week. Good bones, iffy finishing. On the fence.`,
  `Sales team lied about the floor plan. 1450sqft carpet is actually 1280. Verified with measurement tape.`,
  `Anyone know the current construction status? Their website hasn't updated in 3 months.`,
  `Booked. No regrets so far. Ask me again in 2 years.`,
  `Same builder, different project – my friend had nightmare with delayed OC. Be careful.`,
  `Price is NOT negotiable they say. It is. I got 1.8 lakh off plus one free covered parking.`,
  `Why is there no answer about the school and hospital nearby? Critical for families.`,
  `I compared the agreement with 4 other projects. Builder-friendly clauses everywhere. Get a lawyer.`,
  `3BHK. 14th floor. East facing. Done. Happy.`,
  `Too many towers for the land parcel. Density is too high. FSI is maxed out.`,
  `Clubhouse not ready even after 18 months of possession. Still asking when.`,
  `Lift is working properly. Water supply is consistent. AC in lobby is nice touch. Happy resident here.`,
  `Just want to know – is gym equipment actually installed or just renders?`,
  `Builder changed marble supplier. Quality looks different from sample. Raising formally.`,
  `This is my 4th property. Best buying experience so far. Transparent team.`,
  `The garden area is real and maintained. Kids love it.`,
  `Bank loan approval is straightforward. SBI, HDFC, Axis all have tie-ups.`,
  `Construction noise starts at 6am. Sleep is suffering.`,
  `Asked about the society formation. No clear answer. Red flag.`,
  `Location is a bit far but once Namma Metro phase 3 opens this will be central.`,
  `Piped gas – yes. Solar water heating – yes. Green certification – genuine.`,
  `The balcony is tiny. Doesn't match renders. Disappointed.`,
  `1 BHK owners be warned – the size is 480sqft carpet. Verify before signing.`,
  `Air quality index at 11pm was 62 here. That's clean by Indian city standards. Noted.`,
  `Floor rise charges waived if you book before 15th. Confirmed by sales manager.`,
  `RERA complaint process took 45 days but builder resolved the issue. Fair outcome.`,
  `Common area tiles are the same as brochure. Checked personally on 5 spots.`,
]

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getPoolForCity(slug) {
  switch (slug) {
    case 'mumbai': return MUMBAI
    case 'delhi': return DELHI
    case 'hyderabad': return HYDERABAD
    case 'bengaluru': return BENGALURU
    case 'chennai': return CHENNAI
    case 'kolkata': return KOLKATA
    default: return SHORT_REACTIONS
  }
}

async function main() {
  const comments = await prisma.comment.findMany({
    select: { id: true, parentId: true, topic: { select: { city: { select: { slug: true } } } } },
    orderBy: { createdAt: 'asc' },
  })

  console.log(`Rewriting ${comments.length} comments...`)

  // Track used reviews per city to avoid direct duplicates
  const usedIndexes = {}

  let updated = 0
  for (const comment of comments) {
    const citySlug = comment.topic.city.slug
    const isReply = comment.parentId !== null

    let newContent
    if (isReply) {
      newContent = pick(SHORT_REACTIONS)
    } else {
      if (!usedIndexes[citySlug]) usedIndexes[citySlug] = new Set()
      const pool = getPoolForCity(citySlug)
      // Pick unused index if possible, else allow repeat
      let attempts = 0
      let idx
      do {
        idx = Math.floor(Math.random() * pool.length)
        attempts++
      } while (usedIndexes[citySlug].has(idx) && attempts < pool.length)
      usedIndexes[citySlug].add(idx)
      newContent = pool[idx]
    }

    await prisma.comment.update({
      where: { id: comment.id },
      data: { content: newContent },
    })
    updated++
  }

  console.log(`Done. Updated ${updated} comments.`)
  await prisma.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
