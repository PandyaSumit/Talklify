'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import {
  Calendar,
  Clock,
  Users,
  DollarSign,
  Video,
  Tag,
  User,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'

interface SessionDetails {
  _id: string
  title: string
  slug: string
  description: string
  sessionDate: string
  duration: number
  meetingPlatform: string
  category: string
  tags: string[]
  difficultyLevel: string
  price: number
  currency: string
  maxAttendees: number
  currentAttendees: number
  status: string
  host: {
    _id: string
    name: string
    email: string
    image?: string
  }
  isBooked: boolean
}

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchSessionDetails()
  }, [params.slug, session])

  const fetchSessionDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/sessions/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setSessionDetails(data.session)
      } else {
        setError('Session not found')
      }
    } catch (err) {
      setError('Failed to load session details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!session) {
      router.push('/signin')
      return
    }

    try {
      setIsBooking(true)
      setError('')
      setSuccess('')

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionDetails?._id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book session')
      }

      setSuccess('Successfully booked! Check your email for details.')
      setSessionDetails((prev) =>
        prev
          ? {
              ...prev,
              isBooked: true,
              currentAttendees: prev.currentAttendees + 1,
            }
          : null
      )
    } catch (err: any) {
      setError(err.message || 'Failed to book session')
    } finally {
      setIsBooking(false)
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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return 'success'
      case 'INTERMEDIATE':
        return 'warning'
      case 'ADVANCED':
        return 'error'
      default:
        return 'default'
    }
  }

  const isSessionFull = sessionDetails && sessionDetails.currentAttendees >= sessionDetails.maxAttendees
  const isSessionPast = sessionDetails && new Date(sessionDetails.sessionDate) < new Date()
  const canBook = sessionDetails && !sessionDetails.isBooked && !isSessionFull && !isSessionPast && sessionDetails.status === 'PUBLISHED'

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error && !sessionDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-6">
            <Link href="/sessions">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sessions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionDetails) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/sessions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Button>
          </Link>
        </div>

        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-8 flex items-center justify-center">
          <span className="text-white text-8xl font-bold opacity-20">
            {sessionDetails.title.charAt(0)}
          </span>
        </div>

        {/* Alerts */}
        {success && (
          <Alert variant="success" className="mb-6">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Description */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <Badge variant={getDifficultyColor(sessionDetails.difficultyLevel)}>
                      {sessionDetails.difficultyLevel}
                    </Badge>
                    <Badge variant="secondary">{sessionDetails.category}</Badge>
                    {sessionDetails.price === 0 && (
                      <Badge variant="success">FREE</Badge>
                    )}
                  </div>
                  {sessionDetails.isBooked && (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Booked
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{sessionDetails.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {sessionDetails.description}
                </p>
              </CardContent>
            </Card>

            {/* Session Details */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(sessionDetails.sessionDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatTime(sessionDetails.sessionDate)} ({sessionDetails.duration} min)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Video className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Platform</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {sessionDetails.meetingPlatform.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Attendees</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {sessionDetails.currentAttendees} / {sessionDetails.maxAttendees}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {sessionDetails.tags.length > 0 && (
                  <div className="pt-4 border-t dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sessionDetails.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Host Information */}
            <Card>
              <CardHeader>
                <CardTitle>About the Host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                    {sessionDetails.host.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {sessionDetails.host.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sessionDetails.host.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="text-center">
                  {sessionDetails.price === 0 ? (
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      FREE
                    </div>
                  ) : (
                    <div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        ${sessionDetails.price}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {sessionDetails.currency}
                      </p>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {sessionDetails.isBooked ? (
                  <Button disabled className="w-full" size="lg">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Already Booked
                  </Button>
                ) : isSessionFull ? (
                  <Button disabled className="w-full" size="lg">
                    Session Full
                  </Button>
                ) : isSessionPast ? (
                  <Button disabled className="w-full" size="lg">
                    Session Ended
                  </Button>
                ) : sessionDetails.status !== 'PUBLISHED' ? (
                  <Button disabled className="w-full" size="lg">
                    Not Available
                  </Button>
                ) : !session ? (
                  <Link href="/signin">
                    <Button className="w-full" size="lg">
                      Sign In to Book
                    </Button>
                  </Link>
                ) : (
                  <Button
                    onClick={handleBooking}
                    isLoading={isBooking}
                    disabled={isBooking}
                    className="w-full"
                    size="lg"
                  >
                    {sessionDetails.price === 0 ? 'Register Now' : 'Book Now'}
                  </Button>
                )}

                <div className="pt-4 border-t dark:border-gray-700 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                    <span>Instant confirmation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                    <span>Meeting link via email</span>
                  </div>
                  {sessionDetails.price === 0 && (
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                      <span>Free to attend</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
