'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { SessionCarousel } from '@/components/sessions/SessionCarousel'
import { Card, CardContent } from '@/components/ui/Card'
import { Search, TrendingUp, Award, Users, BookOpen, Briefcase, Heart, DollarSign, Palette } from 'lucide-react'

interface HomepageData {
  upcomingFree: any[]
  popularPaid: any[]
  featured: any[]
  categoryCounts: { category: string; count: number }[]
}

const categoryIcons: { [key: string]: any } = {
  Tech: BookOpen,
  Design: Palette,
  Business: Briefcase,
  Marketing: TrendingUp,
  Health: Heart,
  Career: Award,
  Finance: DollarSign,
  Other: Users,
}

export default function HomePage() {
  const router = useRouter()
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/sessions/homepage')
      if (response.ok) {
        const data = await response.json()
        setHomepageData(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/sessions/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleBookmark = (sessionId: string) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark session:', sessionId)
  }

  const handleShare = (sessionId: string) => {
    // TODO: Implement share functionality
    console.log('Share session:', sessionId)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section with Search */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Expert-Led
              <br />
              <span className="text-blue-200 dark:text-blue-300">Learning Sessions</span>
            </h1>
            <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
              Join live workshops, masterclasses, and Q&A sessions with industry experts
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sessions, topics, or hosts..."
                  className="w-full px-6 py-4 pr-32 rounded-full text-gray-900 dark:text-gray-100 bg-white dark:bg-slate-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm mt-1">Live Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm mt-1">Expert Hosts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm mt-1">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-blue-200 dark:text-blue-300 text-sm mt-1">Free Sessions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : (
          <>
            {/* Upcoming Free Sessions */}
            {homepageData?.upcomingFree && homepageData.upcomingFree.length > 0 && (
              <SessionCarousel
                sessions={homepageData.upcomingFree}
                title="Upcoming Free Sessions"
                subtitle="Join these free sessions happening in the next 7 days"
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            )}

            {/* Featured Sessions */}
            {homepageData?.featured && homepageData.featured.length > 0 && (
              <div className="relative">
                <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                  ⭐ FEATURED
                </div>
                <SessionCarousel
                  sessions={homepageData.featured}
                  title="Featured Sessions"
                  subtitle="Promoted sessions from top hosts"
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                />
              </div>
            )}

            {/* Browse by Category */}
            {homepageData?.categoryCounts && homepageData.categoryCounts.length > 0 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                    Browse by Category
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Explore sessions across different topics
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {homepageData.categoryCounts.map(({ category, count }) => {
                    const Icon = categoryIcons[category] || Users
                    return (
                      <Link key={category} href={`/sessions/search?categories=${category}`}>
                        <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 dark:hover:border-blue-400">
                          <CardContent className="p-6 text-center">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                              {category}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {count} sessions
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-8 text-center">
                  <Link href="/sessions/search">
                    <Button size="lg" variant="outline">
                      View All Sessions
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Popular Paid Masterclasses */}
            {homepageData?.popularPaid && homepageData.popularPaid.length > 0 && (
              <SessionCarousel
                sessions={homepageData.popularPaid}
                title="Popular Paid Masterclasses"
                subtitle="Most attended premium sessions"
                onBookmark={handleBookmark}
                onShare={handleShare}
              />
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-900 rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to share your expertise?
              </h2>
              <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 max-w-2xl mx-auto">
                Join hundreds of hosts who are building their audience and earning through Talklify
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/host/sessions/create">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                    Create Your First Session
                  </Button>
                </Link>
                <Link href="/sessions">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                  >
                    Or Browse Sessions
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
