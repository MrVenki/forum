/**
 * IndexNow — instant URL submission to Google/Bing after new content is published.
 * Key file must exist at: public/[INDEXNOW_KEY].txt
 * https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = process.env.INDEXNOW_KEY
const SITE_HOST = 'indiapropertytalk.com' // canonical domain — no www

export async function pingIndexNow(urls: string[]): Promise<void> {
  if (!INDEXNOW_KEY) return // skip silently if key not configured
  if (!urls.length) return
  if (process.env.NODE_ENV !== 'production') return // only ping in prod

  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: SITE_HOST,
        key: INDEXNOW_KEY,
        keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000),
      }),
    })
  } catch {
    // Non-critical — indexing delay is acceptable if this fails
  }
}
