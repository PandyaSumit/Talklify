import { UserType, SubscriptionTier } from '@/models/User'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      userType: UserType
      subscriptionTier: SubscriptionTier
      isVerified: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    userType?: UserType
    subscriptionTier?: SubscriptionTier
    isVerified?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType?: UserType
    subscriptionTier?: SubscriptionTier
    isVerified?: boolean
  }
}
