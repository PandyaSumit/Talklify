'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SessionCard } from '@/components/sessions/SessionCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Clock,
  Users,
} from 'lucide-react'

const CATEGORIES = ['Tech', 'Design', 'Business', 'Marketing', 'Health', 'Career', 'Finance', 'Other']
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced']
const DURATIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '2+ hours', value: 150 },
]
const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Custom Range', value: 'custom' },
]
const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Date (Nearest First)', value: 'date' },
  { label: 'Price (Low to High)', value: 'price-low' },
  { label: 'Price (High to Low)', value: 'price-high' },
  { label: 'Most Popular', value: 'popular' },
]

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('categories')?.split(',').filter(Boolean) || []
  )
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [freeOnly, setFreeOnly] = useState(searchParams.get('freeOnly') === 'true')
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    searchParams.get('difficulty')?.split(',').filter(Boolean) || []
  )
  const [selectedDurations, setSelectedDurations] = useState<number[]>(
    searchParams.get('duration')?.split(',').map(Number).filter(Boolean) || []
  )
  const [availableOnly, setAvailableOnly] = useState(searchParams.get('availableOnly') === 'true')
  const [dateRange, setDateRange] = useState(searchParams.get('dateRange') || 'all')
  const [customDateFrom, setCustomDateFrom] = useState(searchParams.get('dateFrom') || '')
  const [customDateTo, setCustomDateTo] = useState(searchParams.get('dateTo') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'date')

  // UI states
  const [showFilters, setShowFilters] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 0 })

  // Section collapse states
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    date: true,
    difficulty: true,
    duration: true,
    availability: true,
  })

  useEffect(() => {
    performSearch()
  }, [searchParams])

  const performSearch = async (page: number = 1) => {
    setIsLoading(true)

    // Build query params
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategories.length) params.set('categories', selectedCategories.join(','))
    if (freeOnly) {
      params.set('freeOnly', 'true')
    } else {
      if (minPrice) params.set('minPrice', minPrice)
      if (maxPrice) params.set('maxPrice', maxPrice)
    }
    if (selectedDifficulties.length) params.set('difficulty', selectedDifficulties.join(','))
    if (selectedDurations.length) params.set('duration', selectedDurations.join(','))
    if (availableOnly) params.set('availableOnly', 'true')

    // Date range
    if (dateRange === 'custom' && customDateFrom) {
      params.set('dateFrom', customDateFrom)
      if (customDateTo) params.set('dateTo', customDateTo)
    } else if (dateRange !== 'all') {
      const dates = getDateRangeFromPreset(dateRange)
      if (dates.from) params.set('dateFrom', dates.from.toISOString())
      if (dates.to) params.set('dateTo', dates.to.toISOString())
    }

    params.set('sortBy', sortBy)
    params.set('page', page.toString())
    params.set('limit', '20')

    try {
      const response = await fetch(`/api/sessions/search?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
        setPagination(data.pagination || {})
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getDateRangeFromPreset = (preset: string) => {
    const now = new Date()
    const today = new Date(now.setHours(0, 0, 0, 0))

    switch (preset) {
      case 'today':
        return { from: today, to: new Date(today.getTime() + 24 * 60 * 60 * 1000) }
      case 'week':
        const weekLater = new Date(today)
        weekLater.setDate(weekLater.getDate() + 7)
        return { from: today, to: weekLater }
      case 'month':
        const monthLater = new Date(today)
        monthLater.setMonth(monthLater.getMonth() + 1)
        return { from: today, to: monthLater }
      default:
        return { from: null, to: null }
    }
  }

  const handleSearch = () => {
    performSearch(1)
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setMinPrice('')
    setMaxPrice('')
    setFreeOnly(false)
    setSelectedDifficulties([])
    setSelectedDurations([])
    setAvailableOnly(false)
    setDateRange('all')
    setCustomDateFrom('')
    setCustomDateTo('')
    router.push('/sessions/search')
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const activeFiltersCount =
    selectedCategories.length +
    selectedDifficulties.length +
    selectedDurations.length +
    (minPrice || maxPrice || freeOnly ? 1 : 0) +
    (dateRange !== 'all' ? 1 : 0) +
    (availableOnly ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Sessions
          </h1>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button onClick={handleSearch} size="lg">
              Search
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-full lg:w-80 flex-shrink-0">
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                    <div className="flex gap-2">
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearFilters}
                          className="text-sm"
                        >
                          Clear All
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('category')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">Category</span>
                      {expandedSections.category ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.category && (
                      <div className="space-y-2">
                        {CATEGORIES.map((category) => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategories([...selectedCategories, category])
                                } else {
                                  setSelectedCategories(
                                    selectedCategories.filter((c) => c !== category)
                                  )
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {category}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('price')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Price
                      </span>
                      {expandedSections.price ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.price && (
                      <div className="space-y-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={freeOnly}
                            onChange={(e) => setFreeOnly(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            Free Only
                          </span>
                        </label>
                        {!freeOnly && (
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="number"
                              placeholder="Min $"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Max $"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Date Range Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('date')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Date Range
                      </span>
                      {expandedSections.date ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.date && (
                      <div className="space-y-2">
                        {DATE_RANGES.map((range) => (
                          <label key={range.value} className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="dateRange"
                              value={range.value}
                              checked={dateRange === range.value}
                              onChange={(e) => setDateRange(e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {range.label}
                            </span>
                          </label>
                        ))}
                        {dateRange === 'custom' && (
                          <div className="mt-3 space-y-2">
                            <input
                              type="date"
                              value={customDateFrom}
                              onChange={(e) => setCustomDateFrom(e.target.value)}
                              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm"
                            />
                            <input
                              type="date"
                              value={customDateTo}
                              onChange={(e) => setCustomDateTo(e.target.value)}
                              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Difficulty Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('difficulty')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Difficulty
                      </span>
                      {expandedSections.difficulty ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.difficulty && (
                      <div className="space-y-2">
                        {DIFFICULTIES.map((difficulty) => (
                          <label key={difficulty} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDifficulties.includes(difficulty)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDifficulties([...selectedDifficulties, difficulty])
                                } else {
                                  setSelectedDifficulties(
                                    selectedDifficulties.filter((d) => d !== difficulty)
                                  )
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {difficulty}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Duration Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('duration')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Duration
                      </span>
                      {expandedSections.duration ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.duration && (
                      <div className="space-y-2">
                        {DURATIONS.map((duration) => (
                          <label key={duration.value} className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedDurations.includes(duration.value)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedDurations([...selectedDurations, duration.value])
                                } else {
                                  setSelectedDurations(
                                    selectedDurations.filter((d) => d !== duration.value)
                                  )
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              {duration.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Availability Filter */}
                  <div className="border-t dark:border-gray-700 pt-4">
                    <button
                      onClick={() => toggleSection('availability')}
                      className="flex items-center justify-between w-full mb-3"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Availability
                      </span>
                      {expandedSections.availability ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {expandedSections.availability && (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={availableOnly}
                          onChange={(e) => setAvailableOnly(e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Only show sessions with available spots
                        </span>
                      </label>
                    )}
                  </div>

                  {/* Apply Filters Button */}
                  <Button onClick={handleSearch} className="w-full">
                    Apply Filters
                  </Button>
                </CardContent>
              </Card>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="text-gray-600 dark:text-gray-400">
                {isLoading ? (
                  'Searching...'
                ) : (
                  `${pagination.total || 0} session${pagination.total !== 1 ? 's' : ''} found`
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setTimeout(handleSearch, 0)
                  }}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2">
                {selectedCategories.map((category) => (
                  <Badge key={category} variant="secondary" className="px-3 py-1">
                    {category}
                    <button
                      onClick={() =>
                        setSelectedCategories(selectedCategories.filter((c) => c !== category))
                      }
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {selectedDifficulties.map((difficulty) => (
                  <Badge key={difficulty} variant="secondary" className="px-3 py-1">
                    {difficulty}
                    <button
                      onClick={() =>
                        setSelectedDifficulties(
                          selectedDifficulties.filter((d) => d !== difficulty)
                        )
                      }
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {freeOnly && (
                  <Badge variant="success" className="px-3 py-1">
                    Free Only
                    <button onClick={() => setFreeOnly(false)} className="ml-2">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
              </div>
            ) : sessions.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No sessions found matching your criteria
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {sessions.map((session) => (
                    <SessionCard key={session._id} {...session} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => performSearch(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => performSearch(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
