/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // 301 redirect www → non-www.
  // All canonical tags and sitemap URLs use https://indiapropertytalk.com (no www),
  // so the redirect must funnel www traffic to that same canonical domain.
  // Previously this was reversed (non-www → www), which caused GSC to flag all
  // www pages as "Alternative page with proper canonical tag" because the canonical
  // pointed to non-www while the redirect sent non-www straight back to www.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.indiapropertytalk.com' }],
        destination: 'https://indiapropertytalk.com/:path*',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'DENY' },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Referrer leakage control
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable unused browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Force HTTPS for 1 year, include subdomains
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Content Security Policy
          // 'unsafe-inline' for styles is required by Tailwind/Next.js inline styles.
          // Scripts are restricted to same-origin + trusted CDNs only.
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js inline scripts + Google Tag + Cloudflare Turnstile widget
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com",
              // Styles: inline is needed by Tailwind
              "style-src 'self' 'unsafe-inline'",
              // Images: Cloudinary + Google avatars + GitHub avatars + data URIs
              "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
              // Fonts: self-hosted only
              "font-src 'self'",
              // API/XHR: same-origin + Cloudinary upload + GA + Cloudflare Turnstile verify
              "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com https://challenges.cloudflare.com",
              // Turnstile renders its challenge inside an iframe from Cloudflare
              "frame-src https://challenges.cloudflare.com",
              // No plugins (Flash etc.)
              "object-src 'none'",
              // No other sites may embed this site in a frame
              "frame-ancestors 'none'",
              // Only serve over HTTPS
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
