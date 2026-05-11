export const CITY_DEFAULT_IMAGES: Record<string, string> = {
  mumbai: '/cities/mumbai.svg',
  delhi: '/cities/delhi.svg',
  bengaluru: '/cities/bengaluru.svg',
  hyderabad: '/cities/hyderabad.svg',
  chennai: '/cities/chennai.svg',
  kolkata: '/cities/kolkata.svg',
  ahmedabad: '/cities/ahmedabad.svg',
  pune: '/cities/pune.svg',
  surat: '/cities/surat.svg',
  jaipur: '/cities/jaipur.svg',
  lucknow: '/cities/lucknow.svg',
  kanpur: '/cities/kanpur.svg',
  nagpur: '/cities/nagpur.svg',
  indore: '/cities/indore.svg',
  bhopal: '/cities/bhopal.svg',
  visakhapatnam: '/cities/visakhapatnam.svg',
  patna: '/cities/patna.svg',
  vadodara: '/cities/vadodara.svg',
  ghaziabad: '/cities/ghaziabad.svg',
  ludhiana: '/cities/ludhiana.svg',
  agra: '/cities/agra.svg',
  nashik: '/cities/nashik.svg',
}

export function getCityDefaultImage(citySlug?: string | null): string {
  return (citySlug && CITY_DEFAULT_IMAGES[citySlug]) || '/cities/default.svg'
}
