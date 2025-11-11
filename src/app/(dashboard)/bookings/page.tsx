'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import {
  Calendar,
  Clock,
  Video,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'

interface Booking {
  _id: string
  status: string
  paymentStatus: string
  paymentAmount: number
  paymentCurrency: string
  bookingDate: string
  session: {
    _id: string
    title: string
    slug: string
    description: string
    sessionDate: string
    duration: number
    meetingPlatform: string
    meetingLink: string
    category: string
    difficultyLevel: string
    status: string
    host: {
      name: string
      email: string
    }
  }
}

export default function MyBookingsPage() {
  const { data: session } = useSession()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [error, setError] = useState('')
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  useEffect(() => {
    if (session) {
      fetchBookings()
    }
  }, [session])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/bookings/my-bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
      } else {
        setError('Failed to load bookings')
      }
    } catch (err) {
      setError('Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setCancellingId(bookingId)
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
      })

      if (response.ok) {
        // Refresh bookings
        await fetchBookings()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to cancel booking')
      }
    } catch (err) {
      setError('Failed to cancel booking')
    } finally {
      setCancellingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'CANCELLED':
        return 'error'
      case 'ATTENDED':
        return 'default'
      default:
        return 'secondary'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success'
      case 'PENDING':
        return 'warning'
      case 'FAILED':
        return 'error'
      case 'REFUNDED':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const isSessionUpcoming = (sessionDate: string) => {
    return new Date(sessionDate) > new Date()
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return isSessionUpcoming(booking.session.sessionDate) && booking.status === 'CONFIRMED'
    if (filter === 'past') return !isSessionUpcoming(booking.session.sessionDate)
    return booking.status === filter
  })

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter((b) => isSessionUpcoming(b.session.sessionDate) && b.status === 'CONFIRMED').length,
    completed: bookings.filter((b) => !isSessionUpcoming(b.session.sessionDate) && b.status === 'CONFIRMED').length,
    cancelled: bookings.filter((b) => b.status === 'CANCELLED').length,
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            My Bookings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage your registered sessions
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Bookings</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Upcoming</CardDescription>
              <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
                {stats.upcoming}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-green-600 dark:text-green-400">
                {stats.completed}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Cancelled</CardDescription>
              <CardTitle className="text-3xl text-red-600 dark:text-red-400">
                {stats.cancelled}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </Button>
          <Button
            variant={filter === 'past' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('past')}
          >
            Past
          </Button>
          <Button
            variant={filter === 'CANCELLED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('CANCELLED')}
          >
            Cancelled
          </Button>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all'
                ? "You haven't booked any sessions yet"
                : `No ${filter} bookings found`}
            </p>
            <Link href="/sessions">
              <Button>Browse Sessions</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isUpcoming = isSessionUpcoming(booking.session.sessionDate)
              const canCancel = booking.status === 'CONFIRMED' && isUpcoming

              return (
                <Card key={booking._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between gap-4">
                      {/* Session Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link href={`/sessions/${booking.session.slug}`}>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer mb-2">
                                {booking.session.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Badge variant={getPaymentStatusColor(booking.paymentStatus)}>
                                {booking.paymentStatus}
                              </Badge>
                              <Badge variant="secondary">{booking.session.category}</Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                          {booking.session.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{formatDate(booking.session.sessionDate)}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>
                              {formatTime(booking.session.sessionDate)} ({booking.session.duration} min)
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Video className="w-4 h-4 mr-2" />
                            <span>{booking.session.meetingPlatform.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 mr-2" />
                            <span>Host: {booking.session.host.name}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span>
                              {booking.paymentAmount === 0
                                ? 'Free'
                                : `$${booking.paymentAmount} ${booking.paymentCurrency}`}
                            </span>
                          </div>
                        </div>

                        {/* Meeting Link for Confirmed Bookings */}
                        {booking.status === 'CONFIRMED' && isUpcoming && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-blue-700 dark:text-blue-300">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                <span className="text-sm font-medium">Meeting link available</span>
                              </div>
                              <a
                                href={booking.session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                              >
                                Join Session
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                        <Link href={`/sessions/${booking.session.slug}`} className="flex-1 lg:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        {canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
