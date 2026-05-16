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

  // 301 redirect non-www → www so Google only ever indexes one canonical version.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'indiapropertytalk.com' }],
        destination: 'https://www.indiapropertytalk.com/:path*',
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
              // Next.js inline scripts use nonces in production; allow same-origin + Google Tag
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
              // Styles: inline is needed by Tailwind
              "style-src 'self' 'unsafe-inline'",
              // Images: Cloudinary + Google avatars + GitHub avatars + data URIs
              "img-src 'self' data: https://res.cloudinary.com https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
              // Fonts: self-hosted only
              "font-src 'self'",
              // API/XHR: only same-origin + Cloudinary upload endpoint
              "connect-src 'self' https://api.cloudinary.com https://www.google-analytics.com",
              // No plugins (Flash etc.)
              "object-src 'none'",
              // Frames: deny all (same as X-Frame-Options)
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
