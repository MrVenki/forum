export { default } from 'next-auth/middleware'

export const config = {
  matcher: ['/new-topic', '/profile/:path*'],
}
