'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, Users, DollarSign, Plus, Edit, Trash2 } from 'lucide-react'

interface Session {
  _id: string
  title: string
  slug: string
  sessionDate: string
  duration: number
  category: string
  difficultyLevel: string
  price: number
  maxAttendees: number
  currentAttendees: number
  status: string
}

export default function HostSessionsPage() {
  const { data: session } = useSession()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (session) {
      fetchHostSessions()
    }
  }, [session])

  const fetchHostSessions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/host/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'success'
      case 'DRAFT':
        return 'secondary'
      case 'COMPLETED':
        return 'default'
      case 'CANCELLED':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'all') return true
    return s.status === filter
  })

  const stats = {
    total: sessions.length,
    published: sessions.filter((s) => s.status === 'PUBLISHED').length,
    draft: sessions.filter((s) => s.status === 'DRAFT').length,
    completed: sessions.filter((s) => s.status === 'COMPLETED').length,
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              My Sessions
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your upcoming and past sessions
            </p>
          </div>
          <Link href="/host/sessions/new">
            <Button size="lg" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Session
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Sessions</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Published</CardDescription>
              <CardTitle className="text-3xl text-green-600 dark:text-green-400">
                {stats.published}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Drafts</CardDescription>
              <CardTitle className="text-3xl text-yellow-600 dark:text-yellow-400">
                {stats.draft}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl text-blue-600 dark:text-blue-400">
                {stats.completed}
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
            variant={filter === 'PUBLISHED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('PUBLISHED')}
          >
            Published
          </Button>
          <Button
            variant={filter === 'DRAFT' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('DRAFT')}
          >
            Drafts
          </Button>
          <Button
            variant={filter === 'COMPLETED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('COMPLETED')}
          >
            Completed
          </Button>
        </div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {filter === 'all'
                ? 'You haven\'t created any sessions yet'
                : `No ${filter.toLowerCase()} sessions found`}
            </p>
            <Link href="/host/sessions/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Session
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((sessionItem) => (
              <Card key={sessionItem._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-4">
                    {/* Session Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link href={`/sessions/${sessionItem.slug}`}>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                              {sessionItem.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={getStatusColor(sessionItem.status)}>
                              {sessionItem.status}
                            </Badge>
                            <Badge variant="secondary">{sessionItem.category}</Badge>
                            <Badge variant={sessionItem.difficultyLevel === 'BEGINNER' ? 'success' : sessionItem.difficultyLevel === 'INTERMEDIATE' ? 'warning' : 'error'}>
                              {sessionItem.difficultyLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(sessionItem.sessionDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{sessionItem.duration} min</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users className="w-4 h-4 mr-2" />
                          <span>
                            {sessionItem.currentAttendees}/{sessionItem.maxAttendees}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{sessionItem.price === 0 ? 'Free' : `$${sessionItem.price}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2">
                      <Link href={`/host/sessions/${sessionItem._id}/edit`} className="flex-1 lg:flex-none">
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Link href={`/sessions/${sessionItem.slug}`} className="flex-1 lg:flex-none">
                        <Button variant="ghost" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
