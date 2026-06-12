import NextAuth from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),

  // JWT strategy: session encoded in cookie — no DB query needed in Edge proxy
  session: { strategy: 'jwt' },

  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1)

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )
        if (!valid) return null

        return { id: user.id, email: user.email, name: user.name }
      },
    }),
  ],

  callbacks: {
    // Persist user id and email into the JWT
    async jwt({ token, user }) {
      if (user) {
        token.id    = user.id
        token.email = user.email
      }
      return token
    },
    // Expose id and email on the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id    = token.id    as string
        session.user.email = token.email as string
      }
      return session
    },
  },

  pages: {
    signIn:  '/login',
    signOut: '/login',
    error:   '/login',
  },
})
