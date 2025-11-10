'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, DollarSign, Users, Video, Tag, AlertCircle } from 'lucide-react'

export default function CreateSessionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sessionDate: '',
    sessionTime: '',
    duration: 60,
    meetingPlatform: 'ZOOM',
    meetingLink: '',
    category: 'programming',
    tags: '',
    difficultyLevel: 'BEGINNER',
    price: 0,
    currency: 'USD',
    maxAttendees: 50,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ['programming', 'design', 'business', 'marketing', 'data science', 'productivity', 'other']
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']
  const platforms = ['ZOOM', 'GOOGLE_MEET', 'MICROSOFT_TEAMS']
  const durations = [30, 45, 60, 90, 120, 180]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'maxAttendees' || name === 'duration' ? Number(value) : value,
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (formData.title.length < 10) newErrors.title = 'Title must be at least 10 characters'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (formData.description.length < 50) newErrors.description = 'Description must be at least 50 characters'
    if (!formData.sessionDate) newErrors.sessionDate = 'Session date is required'
    if (!formData.sessionTime) newErrors.sessionTime = 'Session time is required'
    if (!formData.meetingLink.trim()) newErrors.meetingLink = 'Meeting link is required'
    if (formData.maxAttendees < 1) newErrors.maxAttendees = 'Max attendees must be at least 1'
    if (formData.price < 0) newErrors.price = 'Price cannot be negative'

    // Validate future date
    const sessionDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`)
    if (sessionDateTime <= new Date()) {
      newErrors.sessionDate = 'Session must be scheduled in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, publish: boolean = false) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      setError('Please fix the errors in the form')
      return
    }

    try {
      setIsLoading(true)

      // Combine date and time
      const sessionDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`)

      // Process tags
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        sessionDate: sessionDateTime.toISOString(),
        duration: formData.duration,
        meetingPlatform: formData.meetingPlatform,
        meetingLink: formData.meetingLink.trim(),
        category: formData.category,
        tags: tagsArray,
        difficultyLevel: formData.difficultyLevel,
        price: formData.price,
        currency: formData.currency,
        maxAttendees: formData.maxAttendees,
        status: publish ? 'PUBLISHED' : 'DRAFT',
      }

      const response = await fetch('/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create session')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/host/sessions')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Create New Session
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your expertise with the community
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <Alert variant="success" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your session has been created successfully. Redirecting...
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={(e) => handleSubmit(e, true)}>
          {/* Basic Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide the essential details about your session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Session Title *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Introduction to React Hooks"
                error={errors.title}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Describe what participants will learn in this session..."
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {formData.description.length} characters (minimum 50)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficultyLevel"
                    value={formData.difficultyLevel}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <Input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="react, hooks, javascript (comma-separated)"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Add relevant tags separated by commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Duration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule & Duration
              </CardTitle>
              <CardDescription>
                When will your session take place?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Date *
                  </label>
                  <input
                    type="date"
                    name="sessionDate"
                    value={formData.sessionDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.sessionDate && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sessionDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Session Time *
                  </label>
                  <input
                    type="time"
                    name="sessionTime"
                    value={formData.sessionTime}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.sessionTime && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sessionTime}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (minutes) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {durations.map((dur) => (
                    <option key={dur} value={dur}>
                      {dur} minutes ({dur / 60} {dur === 60 ? 'hour' : 'hours'})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Meeting Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Meeting Details
              </CardTitle>
              <CardDescription>
                Where will the session be held?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meeting Platform *
                </label>
                <select
                  name="meetingPlatform"
                  value={formData.meetingPlatform}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Meeting Link *"
                name="meetingLink"
                value={formData.meetingLink}
                onChange={handleChange}
                placeholder="https://zoom.us/j/123456789"
                error={errors.meetingLink}
              />
            </CardContent>
          </Card>

          {/* Pricing & Capacity */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Capacity
              </CardTitle>
              <CardDescription>
                Set your pricing and attendance limits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Set to 0 for a free session
                  </p>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Attendees *
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    min="1"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.maxAttendees && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxAttendees}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              className="flex-1"
            >
              Publish Session
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={(e) => handleSubmit(e, false)}
              disabled={isLoading}
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
