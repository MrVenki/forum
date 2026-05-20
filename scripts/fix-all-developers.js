/**
 * fix-all-developers.js
 *
 * Comprehensive fix for incorrect / fabricated property topics identified during
 * cross-verification of ALL major developers against official sites + portals
 * (99acres, Housing.com, MagicBricks, developer websites).
 *
 * Covers: Godrej, Prestige, Brigade, Sobha, Birla, Mahindra, Tata, Shapoorji,
 * Rustomjee, Piramal, ATS, Kolte-Patil, Salarpuria, My Home, Aparna, Sattva,
 * Assetz, Merlin, Supertech, VGN, TVS Emerald, Shriram, Puravankara, Provident,
 * Olympia, Arihant, Appaswamy, DRA
 *
 * SECTION 1 — DELETE FABRICATED (~31 entries)
 * SECTION 2 — FIX WRONG CITY (~15 entries)
 * SECTION 3 — FIX ADDRESS / LOCALITY / TYPE (same city, ~20 entries)
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('=== Comprehensive Developer Data Fix ===\n')

  // ─── Load city IDs keyed by slug ─────────────────────────────────────────
  const cityRecords = await prisma.city.findMany({ select: { id: true, slug: true, name: true } })
  const city = Object.fromEntries(cityRecords.map(c => [c.slug, c.id]))
  console.log(`Loaded ${cityRecords.length} cities: ${cityRecords.map(c => c.slug).join(', ')}\n`)

  let totalDeleted = 0
  let totalFixed   = 0

  async function del(where, label) {
    const r = await prisma.topic.deleteMany({ where })
    totalDeleted += r.count
    console.log(`  🗑️  ${label}: removed ${r.count}`)
  }

  async function fix(where, data, label) {
    const r = await prisma.topic.updateMany({ where, data })
    totalFixed += r.count
    console.log(`  ✓  ${label}: updated ${r.count}`)
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 1 — DELETE FABRICATED TOPICS
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Section 1: Delete Fabricated Topics ─────────────────────────────\n')

  // ── Godrej Properties ─────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'godrej' }, title: { contains: 'Green Cove',      mode: 'insensitive' } }, 'Godrej Green Cove Kharghar')
  await del({ developerSlug: { contains: 'godrej' }, title: { contains: 'Nurture',          mode: 'insensitive' }, city: { slug: 'nagpur'  } }, 'Godrej Nurture Nagpur')
  await del({ developerSlug: { contains: 'godrej' }, title: { contains: 'Nurture',          mode: 'insensitive' }, city: { slug: 'mumbai'  }, address: { contains: 'Kalyan', mode: 'insensitive' } }, 'Godrej Nurture Kalyan West')
  await del({ developerSlug: { contains: 'godrej' }, title: { contains: 'Nurture',          mode: 'insensitive' }, city: { slug: 'chennai' } }, 'Godrej Nurture Chennai')
  // Karjat (plots) — city not in our DB, topic is misleading as apartment
  await del({ developerSlug: { contains: 'godrej' }, title: { contains: 'Woodside',         mode: 'insensitive' } }, 'Godrej Woodside Karjat (plots, city not in DB)')

  // ── Prestige + Brigade ────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'prestige' }, title: { contains: 'Hillcrest',      mode: 'insensitive' }, city: { slug: 'chennai' } }, 'Prestige Hillcrest Chennai')
  await del({ developerSlug: { contains: 'prestige' }, title: { contains: 'Misty Waters',   mode: 'insensitive' }, city: { slug: 'chennai' } }, 'Prestige Misty Waters Chennai')
  await del({ developerSlug: { contains: 'prestige' }, title: { contains: 'Song of the',    mode: 'insensitive' } },                           'Prestige Song of the South Chennai')
  await del({ developerSlug: { contains: 'brigade'  }, title: { contains: 'Atmosphere',     mode: 'insensitive' }, city: { slug: 'chennai' } }, 'Brigade Atmosphere Chennai')
  await del({ developerSlug: { contains: 'brigade'  }, title: { contains: 'Parkside',       mode: 'insensitive' } },                           'Brigade Parkside Perungudi')

  // ── Mahindra ──────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'mahindra' }, title: { contains: 'Happinest',      mode: 'insensitive' }, city: { slug: 'nashik'  } }, 'Mahindra Happinest Nashik')

  // ── Piramal ───────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'piramal'  }, title: { contains: 'Vantage',        mode: 'insensitive' } }, 'Piramal Vantage Kurla West')

  // ── ATS (both Lucknow entries are fabricated — real project is in Noida) ──
  await del({ developerSlug: { contains: 'ats'       }, title: { contains: 'Pious Orchards', mode: 'insensitive' }, city: { slug: 'lucknow' } }, 'ATS Pious Orchards (Lucknow) — both entries')

  // ── Kolte-Patil ───────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'kolte'     }, title: { contains: 'iTowers',        mode: 'insensitive' }, city: { slug: 'nashik'  } }, 'Kolte-Patil iTowers Nashik (real project is in Bengaluru)')

  // ── Merlin ────────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'merlin'    }, title: { contains: 'Skyrise',        mode: 'insensitive' } }, 'Merlin Skyrise')

  // ── Puravankara (Gainz = commercial office space, not residential) ─────────
  await del({ developerSlug: { contains: 'puravankara' }, title: { contains: 'Gainz',        mode: 'insensitive' } }, 'Purva Gainz (commercial office, not residential)')

  // ── VGN ───────────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'vgn'       }, title: { contains: 'Centreville',    mode: 'insensitive' } }, 'VGN Centreville Koyambedu')
  await del({ developerSlug: { contains: 'vgn'       }, title: { contains: 'Nxt',            mode: 'insensitive' } }, 'VGN Nxt Guindy')

  // ── TVS Emerald ───────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'tvs'       }, title: { contains: 'Park One',        mode: 'insensitive' } }, 'TVS Emerald Park One Tambaram West')

  // ── Shriram ───────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'shriram'   }, title: { contains: 'Greenfield',      mode: 'insensitive' }, city: { slug: 'chennai' } }, 'Shriram Greenfield Chennai (real project is in Bangalore)')
  await del({ developerSlug: { contains: 'shriram'   }, title: { contains: 'Park Uno',         mode: 'insensitive' } }, 'Shriram Park Uno Thirumazhisai')

  // ── Provident Housing ─────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'provident' }, title: { contains: 'Park Square',     mode: 'insensitive' }, city: { slug: 'chennai'    } }, 'Provident Park Square Kelambakkam (real project in Kanakapura, Bangalore)')
  await del({ developerSlug: { contains: 'provident' }, title: { contains: 'Sunworth',         mode: 'insensitive' }, city: { slug: 'chennai'    } }, 'Provident Sunworth Paranur Chennai (real project in Mysore Road, Bangalore)')
  await del({ developerSlug: { contains: 'provident' }, title: { contains: 'Sunworth',         mode: 'insensitive' }, city: { slug: 'hyderabad'  } }, 'Provident Sunworth Patancheru Hyderabad (no such project)')

  // ── Olympia Group ─────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'olympia'   }, title: { contains: 'Evara',            mode: 'insensitive' } }, 'Olympia Evara Sholinganallur')
  await del({ developerSlug: { contains: 'olympia'   }, title: { contains: 'Marvella',          mode: 'insensitive' } }, 'Olympia Marvella Padur')

  // ── Arihant Foundations ───────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'arihant'   }, title: { contains: 'Anaika',            mode: 'insensitive' } }, 'Arihant Anaika Ambattur (this is a Mumbai project by Arihant Superstructures)')
  await del({ developerSlug: { contains: 'arihant'   }, title: { contains: 'Tridev',            mode: 'insensitive' } }, 'Arihant Tridev Mogappair East')

  // ── Appaswamy ─────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'appaswamy' }, title: { contains: 'Palladio',          mode: 'insensitive' } }, 'Appaswamy Palladio Ramapuram (no such project; real one is The Broadstone)')

  // ── DRA Homes ─────────────────────────────────────────────────────────────
  await del({ developerSlug: { contains: 'dra'       }, title: { contains: 'Trident',            mode: 'insensitive' } }, 'DRA Trident Perambur')

  console.log(`\nSection 1 done — deleted ${totalDeleted} fabricated topics\n`)

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 2 — FIX WRONG CITY (reassign cityId to correct city)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Section 2: Fix Wrong City ────────────────────────────────────────\n')

  // ── Godrej Properties ─────────────────────────────────────────────────────
  // Godrej Infinity — Hyderabad → Pune (Keshav Nagar, Mundhwa)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Infinity', mode: 'insensitive' }, cityId: city['hyderabad'] },
    { cityId: city['pune'], address: 'Keshav Nagar, Mundhwa, Pune 411036' },
    'Godrej Infinity: Hyderabad → Pune (Keshav Nagar, Mundhwa)'
  )
  // Godrej Nirvaan — Nashik → Mumbai (Kasarvadavali, Ghodbunder Road, Thane)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Nirvaan', mode: 'insensitive' } },
    { cityId: city['mumbai'], address: 'Kasarvadavali, Ghodbunder Road, Thane West 400615' },
    'Godrej Nirvaan: Nashik → Mumbai (Thane West, Ghodbunder Road)'
  )
  // Godrej River Royale — wrong city → Pune (Mahalunge, Balewadi)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'River Royale', mode: 'insensitive' } },
    { cityId: city['pune'], address: 'Mahalunge, near Balewadi, Pune 411045' },
    'Godrej River Royale: → Pune (Mahalunge, near Balewadi)'
  )
  // Godrej Splendour — Chennai → Bengaluru (Whitefield); the real Splendour is in Whitefield
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Splendour', mode: 'insensitive' }, cityId: city['chennai'] },
    { cityId: city['bengaluru'], address: 'Whitefield, Bengaluru 560066' },
    'Godrej Splendour: Chennai (Oragadam) → Bengaluru (Whitefield)'
  )
  // Godrej United — Hyderabad → Bengaluru (Shivajinagar)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'United', mode: 'insensitive' }, cityId: city['hyderabad'] },
    { cityId: city['bengaluru'], address: 'Shivajinagar, Bengaluru 560001' },
    'Godrej United: Hyderabad → Bengaluru (Shivajinagar)'
  )
  // Godrej Woods — Lucknow → Ghaziabad (real project is in Sector 43, Noida)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Woods', mode: 'insensitive' }, cityId: city['lucknow'] },
    { cityId: city['ghaziabad'], address: 'Sector 43, Noida, Gautam Buddha Nagar 201303' },
    'Godrej Woods: Lucknow → Ghaziabad/Noida (Sector 43)'
  )

  // ── Sobha ─────────────────────────────────────────────────────────────────
  // Sobha Aranya — listed as Bengaluru, actually in Gurugram (NCR) — use Delhi
  await fix(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Aranya', mode: 'insensitive' } },
    { cityId: city['delhi'], address: 'Sector 80, Gurugram, Haryana 122004' },
    'Sobha Aranya: Bengaluru → Delhi/NCR (Gurugram, Sector 80)'
  )

  // ── Birla Estates ─────────────────────────────────────────────────────────
  // Birla Arnaa — listed as Faridabad; real project is Devanahalli, Bengaluru
  await fix(
    { developerSlug: { contains: 'birla' }, title: { contains: 'Arnaa', mode: 'insensitive' } },
    { cityId: city['bengaluru'], address: 'Devanahalli, North Bengaluru 562110' },
    'Birla Arnaa: → Bengaluru (Devanahalli)'
  )

  // ── Mahindra Lifespaces ───────────────────────────────────────────────────
  // Mahindra Antheia — Indore → Pune (Ravet, Pimpri-Chinchwad)
  await fix(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Antheia', mode: 'insensitive' } },
    { cityId: city['pune'], address: 'Ravet, Pimpri-Chinchwad, Pune 412101' },
    'Mahindra Antheia: Indore → Pune (Ravet)'
  )
  // Mahindra Aura — Jaipur → Delhi/NCR (Gurugram, Sector 110A)
  await fix(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Aura', mode: 'insensitive' } },
    { cityId: city['delhi'], address: 'Sector 110A, Gurugram, Haryana 122017' },
    'Mahindra Aura: Jaipur → Delhi/NCR (Gurugram, Sector 110A)'
  )
  // Mahindra Citadel — Mumbai → Pune (Pimpri)
  await fix(
    { developerSlug: { contains: 'mahindra' }, title: { contains: 'Citadel', mode: 'insensitive' } },
    { cityId: city['pune'], address: 'Pimpri, Pune 411018' },
    'Mahindra Citadel: Mumbai → Pune (Pimpri)'
  )

  // ── Tata Housing ──────────────────────────────────────────────────────────
  // Tata Amantra — Kolkata/Hooghly → Mumbai (Bhiwandi, Thane District)
  await fix(
    { developerSlug: { contains: 'tata' }, title: { contains: 'Amantra', mode: 'insensitive' } },
    { cityId: city['mumbai'], address: 'Bhiwandi, Thane District, Maharashtra 421302' },
    'Tata Amantra: Kolkata → Mumbai (Bhiwandi, Thane)'
  )

  // ── Shapoorji Pallonji ────────────────────────────────────────────────────
  // SP Sensorium — Mumbai (Mira Road) → Pune (Hinjewadi Phase 2)
  await fix(
    { developerSlug: { contains: 'shapoorji' }, title: { contains: 'Sensorium', mode: 'insensitive' } },
    { cityId: city['pune'], address: 'Hinjewadi Phase 2, Pune 411057' },
    'SP Sensorium: Mumbai (Mira Road) → Pune (Hinjewadi Phase 2)'
  )

  // ── My Home Constructions ─────────────────────────────────────────────────
  // My Home Apas — Visakhapatnam → Hyderabad (Kokapet)
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Apas', mode: 'insensitive' } },
    { cityId: city['hyderabad'], address: 'Kokapet, Hyderabad 500075' },
    'My Home Apas: Visakhapatnam → Hyderabad (Kokapet)'
  )
  // My Home Vihanga — Visakhapatnam → Hyderabad (Gachibowli)
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Vihanga', mode: 'insensitive' } },
    { cityId: city['hyderabad'], address: 'Gachibowli, Hyderabad 500032' },
    'My Home Vihanga: Visakhapatnam → Hyderabad (Gachibowli)'
  )

  // ── Aparna Constructions ──────────────────────────────────────────────────
  // Aparna Elina — Hyderabad (Nallagandla) → Bengaluru (Yeshwanthpur)
  await fix(
    { developerSlug: { contains: 'aparna' }, title: { contains: 'Elina', mode: 'insensitive' } },
    { cityId: city['bengaluru'], address: 'Yeshwanthpur, Bengaluru 560022' },
    'Aparna Elina: Hyderabad → Bengaluru (Yeshwanthpur)'
  )

  // ── Sattva Group ──────────────────────────────────────────────────────────
  // Sattva Serene Life — Hyderabad → Bengaluru (Shettigere, Devanahalli); type PLOT
  await fix(
    { developerSlug: { contains: 'sattva' }, title: { contains: 'Serene Life', mode: 'insensitive' } },
    { cityId: city['bengaluru'], address: 'Shettigere, Devanahalli Taluk, North Bengaluru 562157', propertyType: 'PLOT' },
    'Sattva Serene Life: Hyderabad → Bengaluru (Shettigere); APARTMENT → PLOT'
  )

  // ── TVS Emerald ───────────────────────────────────────────────────────────
  // TVS Emerald Jardin — Chennai (Anna Nagar) → Bengaluru (Singasandra, Hosur Road)
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Jardin', mode: 'insensitive' } },
    { cityId: city['bengaluru'], address: 'Singasandra, Hosur Road, Bengaluru 560068' },
    'TVS Emerald Jardin: Chennai (Anna Nagar) → Bengaluru (Singasandra, Hosur Road)'
  )

  // ── Supertech ─────────────────────────────────────────────────────────────
  // Supertech Cape Town — Agra → Ghaziabad/Noida (Sector 74, Noida)
  await fix(
    { developerSlug: { contains: 'supertech' }, title: { contains: 'Cape Town', mode: 'insensitive' } },
    { cityId: city['ghaziabad'], address: 'Sector 74, Noida, Gautam Buddha Nagar 201304' },
    'Supertech Cape Town: Agra → Ghaziabad/Noida (Sector 74)'
  )

  console.log(`\nSection 2 done — ${totalFixed} city-reassignment fixes\n`)

  // ══════════════════════════════════════════════════════════════════════════
  // SECTION 3 — FIX ADDRESS / LOCALITY / TYPE (same city, wrong micro-location)
  // ══════════════════════════════════════════════════════════════════════════
  console.log('─── Section 3: Fix Address / Locality / Type (same city) ────────────\n')

  // ── Godrej Properties ─────────────────────────────────────────────────────
  // Park Retreat: Kanakapura Rd → Sarjapur Rd (both south Bengaluru)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Park Retreat', mode: 'insensitive' } },
    { address: 'Sarjapur Road, off Carmelaram, Bengaluru 560035' },
    'Godrej Park Retreat: locality corrected to Sarjapur Road, Bengaluru'
  )
  // Sky Terraces: Vikhroli → Chembur (both east Mumbai)
  await fix(
    { developerSlug: { contains: 'godrej' }, title: { contains: 'Sky Terraces', mode: 'insensitive' } },
    { address: 'Chembur, Mumbai 400074' },
    'Godrej Sky Terraces: locality corrected to Chembur, Mumbai'
  )

  // ── Prestige Group ────────────────────────────────────────────────────────
  // ELM Park: Electronic City → Whitefield (both Bengaluru); price also corrected
  await fix(
    { developerSlug: { contains: 'prestige' }, title: { contains: 'ELM Park', mode: 'insensitive' } },
    { address: 'Whitefield, Bengaluru 560066', priceMin: 6500000, priceMax: 14000000 },
    'Prestige ELM Park: locality corrected to Whitefield; price updated (₹65L–₹140L)'
  )
  // High Fields: Kokapet → Gachibowli (both southwest Hyderabad)
  await fix(
    { developerSlug: { contains: 'prestige' }, title: { contains: 'High Fields', mode: 'insensitive' } },
    { address: 'Gachibowli, Hyderabad 500032' },
    'Prestige High Fields: locality corrected to Gachibowli, Hyderabad'
  )

  // ── Rustomjee ─────────────────────────────────────────────────────────────
  // Azziano: Andheri West → Majiwada, Thane West (same Mumbai metro)
  await fix(
    { developerSlug: { contains: 'rustomjee' }, title: { contains: 'Azziano', mode: 'insensitive' } },
    { address: 'Majiwada, Thane West 400601' },
    'Rustomjee Azziano: locality corrected to Majiwada, Thane West'
  )

  // ── ATS Infrastructure ────────────────────────────────────────────────────
  // Destinaire: address shows Ghaziabad but actually Greater Noida West
  await fix(
    { developerSlug: { contains: 'ats' }, title: { contains: 'Destinaire', mode: 'insensitive' } },
    { address: 'Greater Noida West (Noida Extension), Gautam Buddha Nagar 201306' },
    'ATS Destinaire: locality corrected to Greater Noida West'
  )

  // ── Kolte-Patil ───────────────────────────────────────────────────────────
  // 24K Opula: Wakad → Pimple Nilakh (both Pune)
  await fix(
    { developerSlug: { contains: 'kolte' }, title: { contains: 'Opula', mode: 'insensitive' } },
    { address: 'Pimple Nilakh, Pimpri-Chinchwad, Pune 411027' },
    'KP 24K Opula: locality corrected to Pimple Nilakh, Pune'
  )

  // ── Salarpuria Sattva ─────────────────────────────────────────────────────
  // Cadenza: Hebbal → Kudlu Gate, Hosur Road (both Bengaluru)
  await fix(
    { developerSlug: { contains: 'salarpuria' }, title: { contains: 'Cadenza', mode: 'insensitive' } },
    { address: 'Kudlu Gate, Hosur Road, Bengaluru 560068' },
    'Salarpuria Cadenza: locality corrected to Kudlu Gate, Hosur Road, Bengaluru'
  )
  // Misty Charm: Sarjapur Rd → Kanakapura Rd (both south Bengaluru)
  await fix(
    { developerSlug: { contains: 'salarpuria' }, title: { contains: 'Misty Charm', mode: 'insensitive' } },
    { address: 'Kanakapura Road, South Bengaluru 560062' },
    'Salarpuria Misty Charm: locality corrected to Kanakapura Road, Bengaluru'
  )

  // ── My Home Constructions ─────────────────────────────────────────────────
  // Avatar: Kokapet → Puppalaguda, Financial District (adjacent, Hyderabad)
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Avatar', mode: 'insensitive' } },
    { address: 'Puppalaguda, Financial District, Hyderabad 500089' },
    'My Home Avatar: locality corrected to Puppalaguda, Hyderabad'
  )
  // Bhooja: Kokapet (VILLA) → HITEC City (APARTMENT)
  await fix(
    { developerSlug: { contains: 'my-home' }, title: { contains: 'Bhooja', mode: 'insensitive' } },
    { address: 'HITEC City, Hyderabad 500081', propertyType: 'APARTMENT' },
    'My Home Bhooja: locality corrected to HITEC City; VILLA → APARTMENT'
  )

  // ── Assetz Property ───────────────────────────────────────────────────────
  // 63 Degree East: Hoskote → Kodathi, Sarjapur Road (both east Bengaluru)
  await fix(
    { developerSlug: { contains: 'assetz' }, title: { contains: '63 Degree East', mode: 'insensitive' } },
    { address: 'Kodathi, Sarjapur Road, Bengaluru 560035' },
    'Assetz 63 Degree East: locality corrected to Kodathi, Sarjapur Road, Bengaluru'
  )
  // Soho & Sky: Koramangala → Jakkur, Hebbal (both Bengaluru)
  await fix(
    { developerSlug: { contains: 'assetz' }, title: { contains: 'Soho', mode: 'insensitive' } },
    { address: 'Jakkur, near Hebbal, North Bengaluru 560064' },
    'Assetz Soho & Sky: locality corrected to Jakkur, Hebbal, Bengaluru'
  )

  // ── Merlin Group ──────────────────────────────────────────────────────────
  // Serenia: Rajarhat → BT Road (both Kolkata)
  await fix(
    { developerSlug: { contains: 'merlin' }, title: { contains: 'Serenia', mode: 'insensitive' } },
    { address: 'BT Road, Bonhooghly, North Kolkata 700058' },
    'Merlin Serenia: locality corrected to BT Road, North Kolkata'
  )

  // ── VGN Developers ───────────────────────────────────────────────────────
  // Fairmont: Anna Nagar West → Guindy; price corrected
  await fix(
    { developerSlug: { contains: 'vgn' }, title: { contains: 'Fairmont', mode: 'insensitive' } },
    { address: 'Thiru Vi Ka Industrial Estate, Guindy, Chennai 600032', priceMin: 11400000, priceMax: 38000000 },
    'VGN Fairmont: locality corrected to Guindy; price corrected (₹114L–₹380L)'
  )
  // Stafford: Madhavaram → Thirumullaivoyal, Ambattur; price corrected
  await fix(
    { developerSlug: { contains: 'vgn' }, title: { contains: 'Stafford', mode: 'insensitive' } },
    { address: 'Thirumullaivoyal, Ambattur, Chennai 600071', priceMin: 5600000, priceMax: 8000000 },
    'VGN Stafford: locality corrected to Ambattur/Thirumullaivoyal; price corrected (₹56L–₹80L)'
  )

  // ── TVS Emerald ───────────────────────────────────────────────────────────
  // Aaranya: Manapakkam → Medavakkam; type APARTMENT → VILLA
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Aaranya', mode: 'insensitive' } },
    { address: 'Medavakkam/Vengaivasal, Chennai 600100', propertyType: 'VILLA' },
    'TVS Emerald Aaranya: locality corrected to Medavakkam; APARTMENT → VILLA'
  )
  // Hamlet: Guduvanchery → Karapakkam OMR; type APARTMENT → PLOT; price corrected
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Hamlet', mode: 'insensitive' } },
    { address: 'Karapakkam, OMR, Chennai 600097', propertyType: 'PLOT', priceMin: 22200000, priceMax: 35000000 },
    'TVS Emerald Hamlet: locality corrected to Karapakkam OMR; APARTMENT → PLOT; price corrected'
  )
  // Verde (Verde Vista): Perungudi → Padur, OMR Phase 2
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Verde', mode: 'insensitive' } },
    { address: 'Padur, OMR Phase 2, Chennai 603103' },
    'TVS Emerald Verde: locality corrected to Padur, OMR Phase 2'
  )
  // TVS Emerald Park (Isle of Trees): price correction (actual ₹190L+, not ₹80L–₹150L)
  await fix(
    { developerSlug: { contains: 'tvs' }, title: { contains: 'Park', mode: 'insensitive' }, city: { slug: 'bengaluru' } },
    { priceMin: 19000000, priceMax: 35000000 },
    'TVS Emerald Isle of Trees (Park): price corrected (₹190L–₹350L)'
  )

  // ── Shriram Properties ────────────────────────────────────────────────────
  // Park 63: Poonamallee → Perungalathur; price corrected
  await fix(
    { developerSlug: { contains: 'shriram' }, title: { contains: 'Park 63', mode: 'insensitive' } },
    { address: 'Perungalathur, GST Road, Chennai 600063', priceMin: 6500000, priceMax: 18000000 },
    'Shriram Park 63: locality corrected to Perungalathur; price corrected (₹65L–₹180L)'
  )

  // ── Puravankara ───────────────────────────────────────────────────────────
  // Atmosphere: address fix Hebbal → Thanisandra; price heavily understated → correct
  await fix(
    { developerSlug: { contains: 'puravankara' }, title: { contains: 'Atmosphere', mode: 'insensitive' } },
    { address: 'Thanisandra Main Road, near Hebbal, Bengaluru 560077', priceMin: 28500000, priceMax: 45000000 },
    'Purva Atmosphere: locality corrected to Thanisandra; price corrected (₹285L–₹450L)'
  )
  // Zenium: location correct (Bagalur); price massively understated → correct
  await fix(
    { developerSlug: { contains: 'puravankara' }, title: { contains: 'Zenium', mode: 'insensitive' } },
    { priceMin: 10300000, priceMax: 24300000 },
    'Purva Zenium: price corrected (₹103L–₹243L; was ₹50L–₹85L)'
  )

  // ── Provident Housing ─────────────────────────────────────────────────────
  // Deansgate: Yelahanka → IVC Road; type APARTMENT → VILLA; price corrected
  await fix(
    { developerSlug: { contains: 'provident' }, title: { contains: 'Deansgate', mode: 'insensitive' } },
    { address: 'IVC Road, North Bangalore 560064', propertyType: 'VILLA', priceMin: 19000000, priceMax: 25000000 },
    'Provident Deansgate: locality corrected to IVC Road; APARTMENT → VILLA; price corrected (₹190L–₹250L)'
  )

  // ── Olympia Group ─────────────────────────────────────────────────────────
  // Opaline: Perambur → Navalur, OMR (both Chennai, very different areas)
  await fix(
    { developerSlug: { contains: 'olympia' }, title: { contains: 'Opaline', mode: 'insensitive' } },
    { address: 'Navalur, OMR, Chennai 600130' },
    'Olympia Opaline: locality corrected to Navalur, OMR (not Perambur)'
  )

  // ── Appaswamy Real Estates ────────────────────────────────────────────────
  // Mapleton: Medavakkam → Pallikaranai (adjacent localities, Chennai south)
  await fix(
    { developerSlug: { contains: 'appaswamy' }, title: { contains: 'Mapleton', mode: 'insensitive' } },
    { address: 'Pallikaranai, Chennai 600100' },
    'Appaswamy Mapleton: locality corrected to Pallikaranai (not Medavakkam)'
  )

  // ── Sobha Limited ─────────────────────────────────────────────────────────
  // Neopolis: type VILLA → APARTMENT (it's a premium apartment complex, not villas)
  await fix(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Neopolis', mode: 'insensitive' } },
    { propertyType: 'APARTMENT' },
    'Sobha Neopolis: type corrected VILLA → APARTMENT'
  )

  // ── Price-only corrections (major understatements) ────────────────────────
  // Sobha Altus — reported ₹160L–₹280L, actual ₹650L–₹964L
  await fix(
    { developerSlug: { contains: 'sobha' }, title: { contains: 'Altus', mode: 'insensitive' } },
    { priceMin: 65000000, priceMax: 96400000 },
    'Sobha Altus: price corrected (₹650L–₹964L; was ₹160L–₹280L)'
  )
  // Birla Navya — reported ₹140L–₹250L, actual ₹318L–₹802L
  await fix(
    { developerSlug: { contains: 'birla' }, title: { contains: 'Navya', mode: 'insensitive' } },
    { priceMin: 31800000, priceMax: 80200000 },
    'Birla Navya: price corrected (₹318L–₹802L; was ₹140L–₹250L)'
  )
  // Rustomjee Elements — significantly understated
  await fix(
    { developerSlug: { contains: 'rustomjee' }, title: { contains: 'Elements', mode: 'insensitive' } },
    { priceMin: 35000000, priceMax: 90000000 },
    'Rustomjee Elements: price corrected (₹350L–₹900L)'
  )
  // Oberoi Elysian — ultra-luxury, prices severely understated
  await fix(
    { developerSlug: { contains: 'oberoi' }, title: { contains: 'Elysian', mode: 'insensitive' } },
    { priceMin: 75000000, priceMax: 200000000 },
    'Oberoi Elysian: price corrected (₹750L–₹2000L; ultra-luxury)'
  )
  // Oberoi Sky City — premium Borivali project, severely understated
  await fix(
    { developerSlug: { contains: 'oberoi' }, title: { contains: 'Sky City', mode: 'insensitive' } },
    { priceMin: 25000000, priceMax: 55000000 },
    'Oberoi Sky City: price corrected (₹250L–₹550L)'
  )

  console.log(`\nSection 3 done — ${totalFixed} address/type/price fixes\n`)

  // ── Final summary ─────────────────────────────────────────────────────────
  const remaining = await prisma.topic.count({ where: { isPublished: true } })
  const byCity    = await prisma.topic.groupBy({ by: ['cityId'], _count: { _all: true } })

  console.log('═══════════════════════════════════════════════════════════════')
  console.log('DONE')
  console.log(`  Total deleted : ${totalDeleted}`)
  console.log(`  Total updated : ${totalFixed}`)
  console.log(`  Published topics remaining: ${remaining}`)
  console.log(`  Cities with topics        : ${byCity.length}`)
  console.log('═══════════════════════════════════════════════════════════════')
}

main()
  .catch(err => { console.error('Fatal error:', err); process.exit(1) })
  .finally(() => prisma.$disconnect())
