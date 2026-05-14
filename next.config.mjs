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
  // Eliminates "Alternative page with proper canonical tag" GSC warnings.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'indiapropertytalk.com' }],
        destination: 'https://www.indiapropertytalk.com/:path*',
        permanent: true, // 301 — tells Google this is the canonical location
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
