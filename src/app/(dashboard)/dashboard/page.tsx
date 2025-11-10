'use client'

import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

export default function DashboardPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  const { user } = session

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Welcome back, {user.name}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Account Type</CardDescription>
            <CardTitle className="text-3xl">
              {user.userType === 'HOST' ? 'Host' : user.userType === 'ATTENDEE' ? 'Attendee' : 'Host & Attendee'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Subscription</CardDescription>
            <CardTitle className="text-3xl">{user.subscriptionTier}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Verification</CardDescription>
            <CardTitle className="text-3xl">
              {user.isVerified ? '✓ Verified' : 'Pending'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Status</CardDescription>
            <CardTitle className="text-3xl text-green-600">Active</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        {(user.userType === 'HOST' || user.userType === 'BOTH') && (
          <Card>
            <CardHeader>
              <CardTitle>Host a Session</CardTitle>
              <CardDescription>
                Share your expertise with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/host/sessions/new">
                <Button className="w-full">Create New Session</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Browse Sessions</CardTitle>
            <CardDescription>
              Discover upcoming sessions from experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sessions">
              <Button variant="outline" className="w-full">
                Explore Sessions
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Bookings</CardTitle>
            <CardDescription>
              View your registered sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/bookings">
              <Button variant="outline" className="w-full">
                View Bookings
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile">
              <Button variant="outline" className="w-full">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest actions and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Account created</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Welcome to Talklify!</p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Just now</span>
            </div>
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>Start exploring sessions to see more activity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
