export const INDIAN_CITIES = [
  { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', tier: 'METRO' as const },
  { name: 'Delhi', slug: 'delhi', state: 'Delhi', tier: 'METRO' as const },
  { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', tier: 'METRO' as const },
  { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', tier: 'METRO' as const },
  { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', tier: 'METRO' as const },
  { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal', tier: 'METRO' as const },
  { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', tier: 'TIER1' as const },
  { name: 'Pune', slug: 'pune', state: 'Maharashtra', tier: 'TIER1' as const },
  { name: 'Surat', slug: 'surat', state: 'Gujarat', tier: 'TIER1' as const },
  { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan', tier: 'TIER1' as const },
  { name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh', tier: 'TIER1' as const },
  { name: 'Kanpur', slug: 'kanpur', state: 'Uttar Pradesh', tier: 'TIER1' as const },
  { name: 'Nagpur', slug: 'nagpur', state: 'Maharashtra', tier: 'TIER1' as const },
  { name: 'Indore', slug: 'indore', state: 'Madhya Pradesh', tier: 'TIER1' as const },
  { name: 'Bhopal', slug: 'bhopal', state: 'Madhya Pradesh', tier: 'TIER1' as const },
  { name: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh', tier: 'TIER1' as const },
  { name: 'Patna', slug: 'patna', state: 'Bihar', tier: 'TIER1' as const },
  { name: 'Vadodara', slug: 'vadodara', state: 'Gujarat', tier: 'TIER1' as const },
  { name: 'Ghaziabad', slug: 'ghaziabad', state: 'Uttar Pradesh', tier: 'TIER1' as const },
  { name: 'Ludhiana', slug: 'ludhiana', state: 'Punjab', tier: 'TIER1' as const },
  { name: 'Agra', slug: 'agra', state: 'Uttar Pradesh', tier: 'TIER1' as const },
  { name: 'Nashik', slug: 'nashik', state: 'Maharashtra', tier: 'TIER1' as const },
]

export const METRO_CITIES = INDIAN_CITIES.filter((c) => c.tier === 'METRO')
export const TIER1_CITIES = INDIAN_CITIES.filter((c) => c.tier === 'TIER1')
