'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Users, DollarSign } from 'lucide-react'

export interface SessionCardProps {
  _id: string
  title: string
  slug: string
  description: string
  sessionDate: string
  duration: number
  category: string
  tags?: string[]
  difficultyLevel: string
  price: number
  currency: string
  maxAttendees: number
  currentAttendees: number
  coverImage?: string
  viewsCount?: number
  host: {
    name: string
    profileImage?: string
  }
  rating?: number
  reviewCount?: number
  isFeatured?: boolean
}

export function SessionCard({
  _id,
  title,
  slug,
  description,
  sessionDate,
  duration,
  category,
  tags,
  difficultyLevel,
  price,
  currency,
  maxAttendees,
  currentAttendees,
  coverImage,
  host,
  isFeatured,
}: SessionCardProps) {
  const [isHovered, setIsHovered] = useState(false)

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

  const spotsLeft = maxAttendees - currentAttendees

  return (
    <Link href={`/sessions/${slug}`}>
      <div
        className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cover Image */}
        <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-purple-50">
          {coverImage ? (
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-indigo-200 text-6xl font-bold">
                {title.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {price === 0 ? (
              <div className="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-md">
                FREE
              </div>
            ) : (
              <div className="px-3 py-1 bg-gray-900 text-white text-sm font-semibold rounded-md">
                ${price} {currency}
              </div>
            )}
            {isFeatured && (
              <div className="px-3 py-1 bg-amber-400 text-gray-900 text-sm font-semibold rounded-md">
                FEATURED
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Description */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Metadata */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formatDate(sessionDate)} at {formatTime(sessionDate)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{duration} minutes</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-gray-400" />
              <span>
                {currentAttendees}/{maxAttendees} attendees
              </span>
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center pt-4 border-t border-gray-200">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-sm mr-3">
              {host.profileImage ? (
                <img
                  src={host.profileImage}
                  alt={host.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                host.name.charAt(0)
              )}
            </div>
            <p className="text-sm text-gray-700 font-medium truncate">
              {host.name}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}
