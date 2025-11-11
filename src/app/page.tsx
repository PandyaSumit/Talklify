'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SessionCarousel } from '@/components/sessions/SessionCarousel'
import {
  Search,
  TrendingUp,
  Award,
  Users,
  BookOpen,
  Briefcase,
  Heart,
  DollarSign,
  Palette,
  Star,
  ChevronRight,
  CheckCircle,
  Calendar
} from 'lucide-react'

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

const testimonials = [
  {
    quote: "Talklify helped me grow my audience from 0 to 5,000 followers in just 6 months. The platform makes it incredibly easy to monetize my expertise.",
    author: "Sarah Chen",
    role: "Marketing Consultant",
    avatar: "SC",
    rating: 5
  },
  {
    quote: "I've hosted over 50 sessions and the experience has been seamless. The payment system is reliable and attendees love the quality.",
    author: "Michael Rodriguez",
    role: "Tech Educator",
    avatar: "MR",
    rating: 5
  },
  {
    quote: "As an attendee, I've learned more from Talklify sessions than any online course. The live interaction makes all the difference.",
    author: "Emily Watson",
    role: "Product Designer",
    avatar: "EW",
    rating: 5
  }
]

export default function HomePage() {
  const router = useRouter()
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    fetchHomepageData()

    // Handle scroll for sticky nav
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-md shadow-sm'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-16">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Talklify</span>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/sessions"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Browse Sessions
              </Link>
              <Link
                href="/host/sessions/create"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Host a Session
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link href="/signin">
                <button className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                  Sign in
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  Get started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20" />

      {/* Hero Section */}
      <section className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-16 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Learn from Experts,
            <br />
            Share Your Knowledge
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join live workshops, masterclasses, and Q&A sessions with industry experts worldwide
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sessions, topics, or hosts..."
                className="w-full h-16 pl-14 pr-6 rounded-full border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 shadow-md transition-all"
              />
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-sm text-gray-500">Live Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-sm text-gray-500">Expert Hosts</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-sm text-gray-500">Attendees</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-2">200+</div>
              <div className="text-sm text-gray-500">Free Sessions</div>
            </div>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <>
          {/* Upcoming Free Sessions */}
          {homepageData?.upcomingFree && homepageData.upcomingFree.length > 0 && (
            <section className="bg-gray-50 py-24">
              <div className="max-w-7xl mx-auto px-16">
                <div className="mb-12">
                  <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                    Upcoming Free Sessions
                  </h2>
                  <p className="text-base text-gray-600">
                    Join these free sessions happening in the next 7 days
                  </p>
                </div>

                <SessionCarousel sessions={homepageData.upcomingFree} variant="clean" />
              </div>
            </section>
          )}

          {/* Browse by Category */}
          {homepageData?.categoryCounts && homepageData.categoryCounts.length > 0 && (
            <section className="bg-white py-24">
              <div className="max-w-7xl mx-auto px-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                    Browse by Category
                  </h2>
                  <p className="text-base text-gray-600">
                    Explore sessions across different topics
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {homepageData.categoryCounts.map(({ category, count }) => {
                    const Icon = categoryIcons[category] || Users
                    return (
                      <Link key={category} href={`/sessions/search?categories=${category}`}>
                        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center hover:border-gray-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                          <div className="flex justify-center mb-4">
                            <Icon className="w-12 h-12 text-gray-700" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {category}
                          </h3>
                          <p className="text-sm text-gray-500">{count} sessions</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </section>
          )}

          {/* How It Works */}
          <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                  How It Works
                </h2>
                <p className="text-base text-gray-600">
                  Start learning or teaching in three simple steps
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-12 relative">
                {/* Step 1 */}
                <div className="text-center relative">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-indigo-600">1</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Browse & Discover
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Explore thousands of live sessions across various topics and find experts who match your learning goals
                  </p>

                  {/* Arrow - Desktop only */}
                  <div className="hidden md:block absolute top-10 -right-6">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                </div>

                {/* Step 2 */}
                <div className="text-center relative">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-indigo-600">2</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Register in One Click
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Simple, secure booking process. Get instant confirmation and calendar invites for your registered sessions
                  </p>

                  {/* Arrow - Desktop only */}
                  <div className="hidden md:block absolute top-10 -right-6">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                </div>

                {/* Step 3 */}
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-4xl font-bold text-indigo-600">3</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    Join Live Session
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Attend interactive sessions, ask questions in real-time, and connect with a community of learners
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Paid Masterclasses */}
          {homepageData?.popularPaid && homepageData.popularPaid.length > 0 && (
            <section className="bg-white py-24">
              <div className="max-w-7xl mx-auto px-16">
                <div className="mb-12">
                  <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                    Popular Paid Masterclasses
                  </h2>
                  <p className="text-base text-gray-600">
                    Most attended premium sessions from top instructors
                  </p>
                </div>

                <SessionCarousel sessions={homepageData.popularPaid} variant="clean" />
              </div>
            </section>
          )}

          {/* Testimonials */}
          <section className="bg-gray-50 py-24">
            <div className="max-w-7xl mx-auto px-16">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-semibold text-gray-900 mb-3">
                  What Hosts Say
                </h2>
                <p className="text-base text-gray-600">
                  Hear from our community of experts and learners
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-2xl p-8 hover:shadow-md transition-all duration-300"
                  >
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-base text-gray-700 italic mb-6 leading-relaxed">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-500">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Host CTA */}
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 py-24 mx-16 my-24 rounded-3xl">
            <div className="max-w-4xl mx-auto px-16 text-center">
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Ready to share your expertise?
              </h2>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Join hundreds of hosts building their audience and earning through Talklify
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/host/sessions/create">
                  <button className="h-12 px-8 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Create Your First Session
                  </button>
                </Link>
                <Link href="/sessions">
                  <button className="h-12 px-8 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    Or Browse Sessions
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-16">
          <div className="grid md:grid-cols-4 gap-12 mb-8">
            {/* Column 1 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/sessions" className="text-sm text-gray-600 hover:text-gray-900">
                    Browse Sessions
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/help" className="text-sm text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="text-sm text-gray-600 hover:text-gray-900">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-sm text-gray-600 hover:text-gray-900">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-600 hover:text-gray-900">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">© 2025 Talklify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
