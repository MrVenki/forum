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
}
