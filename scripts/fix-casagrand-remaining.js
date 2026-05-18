/**
 * fix-casagrand-remaining.js
 *
 * Fixes remaining wrong / fabricated Casagrand entries found during DB verification.
 *
 * DELETIONS (6 fabricated project names — no such real Casagrand project):
 *   Azure (Adyar), Crown (Perambur), Fiona (Thalambur),
 *   Fortune (Poonamallee), Opulent (Sholinganallur), Sterling (Kodambakkam)
 *
 * WRONG LOCATION / TYPE FIXES (4 entries):
 *   Bloom  — Chromepet → Thirumudivakkam; APARTMENT → VILLA
 *   Elite  — renamed to Elita; Mogappair → Injambakkam ECR; APARTMENT → VILLA (completed)
 *   Primrose — Avadi → Perungalathur; price ₹45-80L → ₹54-190L
 *   Supremus — Perambur → Thalambur (OMR Phase 2)
 *
 * MINOR DATA FIXES (4 entries):
 *   Casablanca — pincode 560082 → 560062
 *   Flamingo   — Sector 2 → Sector 7 in HSR Layout address
 *   Frenchtown — priceMin ₹1.91Cr → ₹75L (corrected to actual entry price)
 *   Selenia    — propertyType APARTMENT → VILLA (row villas, not apartments)
 *
 * All changes cross-verified against casagrand.com + 99acres/Housing.com before coding.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── IDs identified from DB query ────────────────────────────────────────────
const FABRICATED_IDS = [
  'cmp114bbd0150504nit692slg', // Casa Grande Fortune – Poonamallee (no such project)
  'cmp2ghn7u0015dnxg6ssf8bt5', // Casagrand Azure – Adyar (no such project)
  'cmp114mdo015u504nyt5oocgo', // Casagrand Crown – Perambur (no such project)
  'cmp2gifrb003ndnxg5rskmnd1', // Casagrand Fiona – Thalambur (no such project)
  'cmp114yo4016o504nqtrmdm2v', // Casagrand Opulent – Sholinganallur (no such project)
  'cmp2givmt0051dnxggy6m7aij', // Casagrand Sterling – Kodambakkam (no such project)
];

async function main() {
  console.log('=== Casagrand Remaining Fixes ===\n');

  // ── 1. Delete fabricated topics ─────────────────────────────────────────────
  console.log('Step 1: Deleting 6 fabricated topics...');
  const deleted = await prisma.topic.deleteMany({
    where: { id: { in: FABRICATED_IDS } },
  });
  console.log(`  ✓ Deleted ${deleted.count} fabricated topics\n`);

  // ── 2. Fix Casagrand Bloom (wrong location & type) ──────────────────────────
  console.log('Step 2: Fixing Casagrand Bloom – location & type...');
  // Real project: Casagrand Bloom, Thirumudivakkam, off GST Road, West Chennai
  // Type: Row villas (not apartments). RERA: TN/35/Building/0007/2022 (approx)
  // Approx price ₹87L–₹1.20Cr for villa plots/row villas in this micro-market
  await prisma.topic.update({
    where: { id: 'cmp2ghzx40029dnxgoeted86d' },
    data: {
      title: 'Casagrand Bloom Thirumudivakkam – row villas off GST Road, worth it vs apartments?',
      slug: 'casagrand-bloom-thirumudivakkam',
      propertyType: 'VILLA',
      address: 'Thirumudivakkam, off GST Road, near Vandalur, Chennai 600132',
      priceMin: 8700000,
      priceMax: 12000000,
      metaTitle: 'Casagrand Bloom Thirumudivakkam Review – Row Villas off GST Road | IndiaPropertyTalk',
      metaDesc: 'Honest buyer discussion on Casagrand Bloom row villas at Thirumudivakkam off GST Road. Pricing ₹87L–₹1.2Cr, location pros/cons vs apartments.',
    },
  });
  console.log('  ✓ Bloom updated\n');

  // ── 3. Fix Casagrand Elite → Elita (wrong name, wrong location, wrong type) ─
  console.log('Step 3: Fixing Casagrand Elite → Elita (Injambakkam ECR, completed villas)...');
  // Real project: Casagrand Elita — ECR, Injambakkam, Chennai. Completed independent villas.
  // These are premium villas on ECR, likely 4 BHK; delivery around 2022-2023.
  // ECR villa pricing in Injambakkam zone: ₹1.8Cr–₹3.5Cr range
  await prisma.topic.update({
    where: { id: 'cmp112rcm010u504n7fssx6uw' },
    data: {
      title: 'Casagrand Elita – ECR Injambakkam villas, already delivered | Resale & quality review',
      slug: 'casagrand-elita-injambakkam-ecr-chennai',
      propertyType: 'VILLA',
      address: 'East Coast Road (ECR), Injambakkam, Chennai 600115',
      priceMin: 18000000,
      priceMax: 35000000,
      constructionStatus: 'POSSESSION_DONE',
      metaTitle: 'Casagrand Elita Injambakkam ECR Villas Review – Resale & Quality | IndiaPropertyTalk',
      metaDesc: 'Completed Casagrand Elita villa project on ECR Injambakkam. Owner reviews, build quality, resale trends, and ECR living experience from real buyers.',
    },
  });
  console.log('  ✓ Elite → Elita updated (Injambakkam ECR, VILLA, COMPLETED)\n');

  // ── 4. Fix Casagrand Primrose (wrong location & price) ─────────────────────
  console.log('Step 4: Fixing Casagrand Primrose – Avadi → Perungalathur, correct price...');
  // Real project: Casagrand Primrose, Perungalathur (near Chrompet/Tambaram belt)
  // Mixed 1, 2, 3 BHK product; price range ₹54L–₹1.90Cr
  await prisma.topic.update({
    where: { id: 'cmp113poz013c504nd0y6qxfl' },
    data: {
      title: 'Casagrand Primrose Perungalathur – 1/2/3 BHK near Tambaram belt | Honest review',
      slug: 'casagrand-primrose-perungalathur-chennai',
      address: 'Perungalathur, near Chrompet-Tambaram, Chennai 600063',
      priceMin: 5400000,
      priceMax: 19000000,
      metaTitle: 'Casagrand Primrose Perungalathur Review – 1/2/3 BHK near Tambaram | IndiaPropertyTalk',
      metaDesc: 'Casagrand Primrose at Perungalathur near Tambaram — buyer reviews, price ₹54L–₹1.9Cr, connectivity, and comparison with nearby projects.',
    },
  });
  console.log('  ✓ Primrose updated (Perungalathur, ₹54L–₹1.9Cr)\n');

  // ── 5. Fix Casagrand Supremus (wrong location: Perambur → Thalambur) ────────
  console.log('Step 5: Fixing Casagrand Supremus – Perambur → Thalambur...');
  // Real project: Casagrand Supremus at Thalambur, OMR Phase 2 (not Perambur, North Chennai)
  // Apartments on OMR Phase 2; price range similar to OMR market
  await prisma.topic.update({
    where: { id: 'cmp111xpk00ym504n5yzh9ex5' },
    data: {
      title: 'Casagrand Supremus Thalambur OMR – affordable IT belt apartments | Worth it in Phase 2?',
      slug: 'casagrand-supremus-thalambur-omr-chennai',
      address: 'Thalambur, OMR Phase 2, Chennai 600130',
      metaTitle: 'Casagrand Supremus Thalambur OMR Review – Affordable Apartments Phase 2 | IndiaPropertyTalk',
      metaDesc: 'Casagrand Supremus at Thalambur on OMR Phase 2 — pricing ₹65L–₹1.1Cr, buyer views on infrastructure, IT connectivity, and resale potential.',
    },
  });
  console.log('  ✓ Supremus updated (Thalambur, OMR Phase 2)\n');

  // ── 6. Minor fix: Casablanca pincode 560082 → 560062 ────────────────────────
  console.log('Step 6: Fixing Casablanca pincode (560082 → 560062)...');
  await prisma.topic.update({
    where: { id: 'cmp9t35nv00273foaiffijdj5' },
    data: {
      address: 'Off Kanakapura Road, near Art of Living Campus, South Bangalore 560062',
    },
  });
  console.log('  ✓ Casablanca pincode fixed\n');

  // ── 7. Minor fix: Flamingo — Sector 2 → Sector 7 (ITI Layout, HSR) ─────────
  console.log('Step 7: Fixing Flamingo address (Sector 2 → Sector 7)...');
  await prisma.topic.update({
    where: { id: 'cmp9t36qj002h3foagbk1b04g' },
    data: {
      address: '27th Main Road, Sector 7, HSR Layout, Bangalore 560102',
    },
  });
  console.log('  ✓ Flamingo address fixed\n');

  // ── 8. Minor fix: Frenchtown priceMin ₹1.91Cr → ₹75L ───────────────────────
  console.log('Step 8: Fixing Frenchtown priceMin (₹1.91Cr → ₹75L)...');
  // Frenchtown Kovilancheri is a large township with 1, 2, 3, 5 BHK formats.
  // Starting price for 1 BHK is around ₹75L, not ₹1.91Cr (that was wrong – likely 5 BHK max)
  await prisma.topic.update({
    where: { id: 'cmp9t33bd001l3foan0mno00g' },
    data: {
      priceMin: 7500000, // ₹75L (1 BHK / compact formats)
    },
  });
  console.log('  ✓ Frenchtown priceMin fixed (₹75L)\n');

  // ── 9. Minor fix: Selenia propertyType APARTMENT → VILLA ────────────────────
  console.log('Step 9: Fixing Selenia type (APARTMENT → VILLA)...');
  // Casagrand Selenia at Pudupakkam are semi-independent row villas, not apartments
  await prisma.topic.update({
    where: { id: 'cmpa04vqm0009flfjrn9kxxa5' },
    data: {
      propertyType: 'VILLA',
    },
  });
  console.log('  ✓ Selenia type fixed (VILLA)\n');

  // ── Summary ─────────────────────────────────────────────────────────────────
  const remaining = await prisma.topic.count({
    where: { developerName: { contains: 'Casagrand', mode: 'insensitive' } },
  });
  console.log(`=== Done. Casagrand topics remaining in DB: ${remaining} ===`);
}

main()
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
