'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert'
import { Badge } from '@/components/ui/Badge'
import {
  AlertCircle, CheckCircle, ChevronLeft, ChevronRight,
  Calendar, Clock, DollarSign, FileText, Settings
} from 'lucide-react'
import { calculateFees, formatCurrency } from '@/lib/fees'

const CATEGORIES = ['Marketing', 'Tech', 'Business', 'Health', 'Design', 'Career', 'Finance', 'Other']
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
const DURATIONS = [30, 60, 90, 120, 180]
const PLATFORMS = ['Zoom', 'Google Meet', 'Microsoft Teams']
const CURRENCIES = ['USD', 'EUR', 'GBP']

interface FormData {
  // Step 1: Basics
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]

  // Step 2: Schedule
  sessionDate: string
  sessionTime: string
  duration: number
  maxAttendees: number
  meetingPlatform: string
  meetingLink: string

  // Step 3: Pricing
  isFree: boolean
  price: number
  currency: string
}

export default function CreateSessionPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Tech',
    difficulty: 'Beginner',
    tags: [],
    sessionDate: '',
    sessionTime: '',
    duration: 60,
    maxAttendees: 50,
    meetingPlatform: 'Zoom',
    meetingLink: '',
    isFree: true,
    price: 0,
    currency: 'USD',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'maxAttendees' || name === 'duration' ? Number(value) : value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleAddTag = () => {
    const tag = tagInput.trim()
    if (tag && formData.tags.length < 5 && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters'
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Description must be 2000 characters or less'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.sessionDate) {
      newErrors.sessionDate = 'Session date is required'
    } else {
      const sessionDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`)
      const minDate = new Date()
      minDate.setHours(minDate.getHours() + 2)

      if (sessionDateTime <= minDate) {
        newErrors.sessionDate = 'Session must be at least 2 hours in the future'
      }
    }

    if (!formData.sessionTime) {
      newErrors.sessionTime = 'Session time is required'
    }

    if (!formData.meetingLink.trim()) {
      newErrors.meetingLink = 'Meeting link is required'
    } else {
      try {
        new URL(formData.meetingLink)
      } catch {
        newErrors.meetingLink = 'Please enter a valid URL'
      }
    }

    if (formData.maxAttendees < 10 || formData.maxAttendees > 1000) {
      newErrors.maxAttendees = 'Max attendees must be between 10 and 1000'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.isFree) {
      if (formData.price < 5 || formData.price > 5000) {
        newErrors.price = 'Price must be between $5 and $5000'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    let isValid = false

    if (currentStep === 1) {
      isValid = validateStep1()
    } else if (currentStep === 2) {
      isValid = validateStep2()
    } else if (currentStep === 3) {
      isValid = validateStep3()
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!isDraft && !validateStep3()) {
      return
    }

    try {
      setIsLoading(true)
      setError('')

      const sessionDateTime = new Date(`${formData.sessionDate}T${formData.sessionTime}`)
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        difficultyLevel: formData.difficulty,
        tags: formData.tags,
        sessionDate: sessionDateTime.toISOString(),
        duration: formData.duration,
        timezone,
        meetingPlatform: formData.meetingPlatform,
        meetingLink: formData.meetingLink.trim(),
        maxAttendees: formData.maxAttendees,
        price: formData.isFree ? 0 : formData.price,
        currency: formData.currency,
        status: isDraft ? 'draft' : 'published',
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

      router.push('/host/sessions')
    } catch (err: any) {
      setError(err.message || 'Failed to create session')
    } finally {
      setIsLoading(false)
    }
  }

  const feeCalculation = formData.isFree ? null : calculateFees(formData.price, formData.currency)

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
            Follow the steps to create your session
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step <= currentStep
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step}</span>
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Basics</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Schedule</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">Pricing</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basics */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Session Basics
              </CardTitle>
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
                placeholder="e.g., Advanced React Performance Optimization"
                error={errors.title}
                maxLength={100}
              />
              <div className="text-right text-sm text-gray-500">
                {formData.title.length}/100 characters
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={8}
                  maxLength={2000}
                  placeholder="Provide a detailed description of what participants will learn in this session..."
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                )}
                <div className="mt-1 text-right text-sm text-gray-500">
                  {formData.description.length}/2000 characters
                </div>
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
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags (Max 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTag()
                      }
                    }}
                    placeholder="Add a tag..."
                    maxLength={30}
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    disabled={formData.tags.length >= 5 || !tagInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Schedule */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule & Meeting Details
              </CardTitle>
              <CardDescription>
                Set when and where your session will take place
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

              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Your timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {DURATIONS.map((dur) => (
                      <option key={dur} value={dur}>
                        {dur} minutes ({dur / 60} {dur === 60 ? 'hour' : 'hours'})
                      </option>
                    ))}
                  </select>
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
                    min="10"
                    max="1000"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.maxAttendees && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.maxAttendees}</p>
                  )}
                </div>
              </div>

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
                  {PLATFORMS.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🔒 Meeting link will be encrypted and only shared with registered attendees
              </p>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Pricing */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Pricing & Revenue
              </CardTitle>
              <CardDescription>
                Set your session price and see your earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isFree: true, price: 0 }))}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-center transition-all ${
                    formData.isFree
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="text-lg font-semibold">Free Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, isFree: false, price: 19.99 }))}
                  className={`flex-1 px-4 py-3 rounded-lg border-2 text-center transition-all ${
                    !formData.isFree
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <span className="text-lg font-semibold">Paid Session</span>
                </button>
              </div>

              {!formData.isFree && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="5"
                        max="5000"
                        step="0.01"
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency *
                      </label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {CURRENCIES.map((curr) => (
                          <option key={curr} value={curr}>
                            {curr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {feeCalculation && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                        Revenue Breakdown
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Session Price:</span>
                          <span className="font-medium">{formatCurrency(feeCalculation.originalPrice, feeCalculation.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Platform Fee (12%):</span>
                          <span className="text-red-600 dark:text-red-400">-{formatCurrency(feeCalculation.platformFee, feeCalculation.currency)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Stripe Fee (~3%):</span>
                          <span className="text-red-600 dark:text-red-400">-{formatCurrency(feeCalculation.stripeFee, feeCalculation.currency)}</span>
                        </div>
                        <div className="pt-2 border-t border-blue-300 dark:border-blue-700 flex justify-between">
                          <span className="font-semibold text-gray-900 dark:text-gray-100">You'll receive:</span>
                          <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                            {formatCurrency(feeCalculation.hostReceives, feeCalculation.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {formData.isFree && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-green-800 dark:text-green-200 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    This will be a free session - no payment required from attendees
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-4">
            {currentStep === 3 && (
              <Button
                variant="outline"
                onClick={() => handleSubmit(true)}
                disabled={isLoading}
              >
                Save as Draft
              </Button>
            )}

            {currentStep < 3 ? (
              <Button onClick={handleNext} disabled={isLoading}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={() => handleSubmit(false)} disabled={isLoading} isLoading={isLoading}>
                Publish Session
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
