import { formatINR } from '@/lib/utils/format'

interface SeoInput {
  propertyName: string
  cityName: string
  avgRating: number
  ratingCount: number
  commentCount: number
  priceMin: number | null
  priceMax: number | null
  now?: Date
}

const TITLE_LIMIT = 46 // the site title template appends " | IndiaPropertyTalk"
const DESC_LIMIT = 155

function clip(text: string, limit: number): string {
  if (text.length <= limit) return text
  const cut = text.slice(0, limit - 1)
  return cut.slice(0, cut.lastIndexOf(' ') > 40 ? cut.lastIndexOf(' ') : cut.length).replace(/[,\s.-]+$/, '') + '…'
}

/** Search-result title and description that lead with the query people type: "<project> reviews". */
export function buildTopicSeo(input: SeoInput) {
  const year = (input.now ?? new Date()).getFullYear()
  const { propertyName: name, cityName: city } = input

  let title = `${name} Reviews, ${city} (${year})`
  if (title.length > TITLE_LIMIT) title = `${name} Reviews (${year})`
  if (title.length > TITLE_LIMIT) title = `${clip(name, TITLE_LIMIT - ' Reviews'.length)} Reviews`

  const facts: string[] = []
  if (input.ratingCount > 0 && input.avgRating > 0) {
    facts.push(`${input.avgRating.toFixed(1)}/5 from ${input.ratingCount} rating${input.ratingCount !== 1 ? 's' : ''}`)
  }
  if (input.commentCount > 0) {
    facts.push(`${input.commentCount} buyer comment${input.commentCount !== 1 ? 's' : ''}`)
  }
  if (input.priceMin) {
    facts.push(
      input.priceMax && input.priceMax !== input.priceMin
        ? `price ${formatINR(input.priceMin)} – ${formatINR(input.priceMax)}`
        : `price from ${formatINR(input.priceMin)}`
    )
  }

  const lead = facts.length > 0 ? `${name}, ${city}: ${facts.join(', ')}.` : `${name}, ${city}: buyer reviews and discussion.`
  const description = clip(`${lead} Honest views on possession, construction quality and maintenance before you buy.`, DESC_LIMIT)

  return { title, description }
}
