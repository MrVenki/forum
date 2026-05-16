export { default } from 'next-auth/middleware'

export const config = {
  // Protect both the page routes AND the corresponding API routes so there
  // is a middleware-level guard even if a handler-level check is accidentally removed.
  matcher: [
    '/new-topic',
    '/profile/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
}
