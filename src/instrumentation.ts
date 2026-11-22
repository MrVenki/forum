/** Runs once when the Next.js server starts. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  try {
    const { ensureSchema } = await import('@/lib/ensureSchema')
    await ensureSchema()
  } catch (err) {
    // Never block start-up; review replies just stay unavailable until this succeeds
    console.error('[ensureSchema] failed:', err)
  }
  try {
    const { ensureCommunitySchema } = await import('@/lib/ensureSchema')
    await ensureCommunitySchema()
  } catch (err) {
    // Never block start-up; community pages show an empty list until this succeeds
    console.error('[ensureSchema] community tables failed:', err)
  }
  try {
    const { ensureCityTiers } = await import('@/lib/ensureSchema')
    await ensureCityTiers()
    const { seedTier2Cities } = await import('@/lib/tier2Seed')
    await seedTier2Cities()
  } catch (err) {
    // Never block start-up; the new city pages just show "not found" until this succeeds
    console.error('[tier2Seed] failed:', err)
  }
}
