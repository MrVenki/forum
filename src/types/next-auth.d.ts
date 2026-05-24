import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      username: string | null
      email: string
      image?: string | null
      role: string
      emailVerified: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    username: string | null
    emailVerified: boolean
  }
}
