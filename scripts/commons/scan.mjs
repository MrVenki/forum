// Searches Wikimedia Commons for photos of every listed project and prints candidates
// with licence details as JSON. Run in CI (the dev container cannot reach Commons).
import { readFileSync } from 'node:fs'

const UA = 'IndiaPropertyTalk-image-scan/1.0 (https://indiapropertytalk.com)'
const API = 'https://commons.wikimedia.org/w/api.php'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function api(params) {
  const url = API + '?' + new URLSearchParams({ format: 'json', formatversion: '2', origin: '*', ...params })
  for (let i = 0; i < 4; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.ok) return res.json()
    await sleep(2000 * (i + 1))
  }
  throw new Error('Commons API failed: ' + url)
}

// Project names: seed list plus every topic slug in the live sitemap
const names = new Map()
for (const n of readFileSync(new URL('./names.txt', import.meta.url), 'utf8').split('\n').map((s) => s.trim()).filter(Boolean)) {
  names.set(n.toLowerCase(), { name: n })
}
try {
  const xml = await (await fetch('https://indiapropertytalk.com/sitemap.xml', { headers: { 'User-Agent': UA } })).text()
  const urls = [...xml.matchAll(/<loc>https:\/\/indiapropertytalk\.com\/([a-z-]+)\/([a-z0-9-]+)<\/loc>/g)]
  const skip = new Set(['prices', 'compare', 'developers', 'developer', 'tools', 'profile'])
  for (const [, city, slug] of urls) {
    if (skip.has(city) || skip.has(slug)) continue
    const name = slug.replace(/-/g, ' ')
    const key = name.toLowerCase()
    const existing = [...names.keys()].find((k) => k.replace(/[^a-z0-9]+/g, ' ').trim() === key)
    if (existing) names.get(existing).url = `/${city}/${slug}`
    else names.set(key, { name, url: `/${city}/${slug}`, fromSitemap: true })
  }
} catch (e) {
  console.error('sitemap fetch failed', e.message)
}
console.error(`scanning ${names.size} projects`)

const results = []
for (const entry of names.values()) {
  const q = `"${entry.name}"`
  const [files, cats] = await Promise.all([
    api({ action: 'query', list: 'search', srsearch: q, srnamespace: '6', srlimit: '6' }),
    api({ action: 'query', list: 'search', srsearch: q, srnamespace: '14', srlimit: '3' }),
  ])
  const titles = (files.query?.search || []).map((s) => s.title)
  const categories = (cats.query?.search || []).map((s) => s.title)
  if (!titles.length && !categories.length) { await sleep(150); continue }
  let images = []
  if (titles.length) {
    const info = await api({ action: 'query', prop: 'imageinfo', titles: titles.join('|'), iiprop: 'url|extmetadata|size', iiurlwidth: '1200' })
    images = (info.query?.pages || []).map((p) => {
      const ii = p.imageinfo?.[0] || {}
      const m = ii.extmetadata || {}
      const v = (k) => (m[k]?.value || '').replace(/<[^>]+>/g, '').trim()
      return {
        title: p.title, page: ii.descriptionurl, thumb: ii.thumburl, width: ii.width, height: ii.height,
        license: v('LicenseShortName'), licenseUrl: v('LicenseUrl'), artist: v('Artist'), credit: v('Credit'),
        description: v('ImageDescription').slice(0, 200), categories: v('Categories').slice(0, 300),
      }
    })
  }
  results.push({ ...entry, images, categories })
  await sleep(150)
}
console.log('COMMONS_SCAN_JSON_START')
console.log(JSON.stringify(results))
console.log('COMMONS_SCAN_JSON_END')
console.error(`projects with any hit: ${results.length}`)
