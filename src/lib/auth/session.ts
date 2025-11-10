import { getServerSession } from 'next-auth'
import { authOptions } from './auth-options'

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireHost() {
  const user = await requireAuth()

  if (user.userType !== 'HOST' && user.userType !== 'BOTH') {
    throw new Error('Only hosts can perform this action')
  }

  return user
}
