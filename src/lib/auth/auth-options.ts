import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { compare } from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        await connectDB()

        const user = await User.findOne({ email: credentials.email })

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.profileImage,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB()

        // Check if user exists
        let existingUser = await User.findOne({ email: user.email })

        if (!existingUser) {
          // Create new user from Google OAuth
          existingUser = await User.create({
            email: user.email,
            name: user.name,
            profileImage: user.image,
            emailVerified: new Date(),
            userType: 'ATTENDEE',
            subscriptionTier: 'FREE',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
            isVerified: true,
          })
        }

        user.id = existingUser._id.toString()
      }

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }

      // Fetch user data and add to token
      if (token.id) {
        await connectDB()
        const dbUser = await User.findById(token.id).select('userType subscriptionTier isVerified')
        if (dbUser) {
          token.userType = dbUser.userType
          token.subscriptionTier = dbUser.subscriptionTier
          token.isVerified = dbUser.isVerified
        }
      }

      // Update token when session is updated
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          userType: token.userType as string,
          subscriptionTier: token.subscriptionTier as string,
          isVerified: token.isVerified as boolean,
        }
      }

      return session
    },
  },
}
