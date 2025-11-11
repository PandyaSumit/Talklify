'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, Users, DollarSign, Bookmark, Share2, Star } from 'lucide-react'

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
  isBookmarked?: boolean
  onBookmark?: (sessionId: string) => void
  onShare?: (sessionId: string) => void
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
  viewsCount,
  host,
  rating,
  reviewCount,
  isBookmarked = false,
  onBookmark,
  onShare,
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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'success'
      case 'Intermediate':
        return 'warning'
      case 'Advanced':
        return 'error'
      default:
        return 'default'
    }
  }

  const spotsLeft = maxAttendees - currentAttendees
  const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/sessions/${slug}`}>
        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg">
            {coverImage ? (
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-white text-6xl font-bold opacity-20">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {/* Quick Action Buttons - Show on Hover */}
            {isHovered && (
              <div className="absolute top-3 right-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                {onBookmark && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onBookmark(_id)
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                      isBookmarked
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/80 text-gray-700 hover:bg-white'
                    }`}
                    aria-label="Bookmark session"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      onShare(_id)
                    }}
                    className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-md transition-colors"
                    aria-label="Share session"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute top-3 left-3">
              {price === 0 ? (
                <Badge variant="success" className="font-semibold">
                  FREE
                </Badge>
              ) : (
                <Badge className="bg-white/90 text-gray-900 font-semibold">
                  ${price} {currency}
                </Badge>
              )}
            </div>

            {/* Almost Full Badge */}
            {isAlmostFull && (
              <div className="absolute bottom-3 left-3">
                <Badge variant="warning" className="font-semibold">
                  Only {spotsLeft} spots left!
                </Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between mb-2">
              <Badge variant={getDifficultyColor(difficultyLevel)}>{difficultyLevel}</Badge>
              <Badge variant="secondary">{category}</Badge>
            </div>

            <CardTitle className="text-xl line-clamp-2 group-hover:text-blue-600 transition-colors">
              {title}
            </CardTitle>

            <CardDescription className="line-clamp-2">{description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Session Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  {formatDate(sessionDate)} at {formatTime(sessionDate)}
                </span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{duration} minutes</span>
              </div>

              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>
                  {currentAttendees}/{maxAttendees} registered
                </span>
              </div>

              {/* Rating */}
              {rating && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Star className="w-4 h-4 mr-2 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                  <span>
                    {rating.toFixed(1)} {reviewCount && `(${reviewCount} reviews)`}
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Host Info */}
            <div className="pt-3 border-t dark:border-gray-700 flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mr-2 flex-shrink-0">
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
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                Hosted by <span className="font-medium text-gray-900 dark:text-gray-100">{host.name}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
