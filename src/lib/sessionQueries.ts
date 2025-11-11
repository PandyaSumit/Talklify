import Session from '@/models/Session'
import { SessionStatus, SessionCategory } from '@/models/Session'

export interface SessionFilters {
  search?: string
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  freeOnly?: boolean
  dateFrom?: Date
  dateTo?: Date
  difficulty?: string[]
  availableOnly?: boolean
  duration?: number[]
  sortBy?: 'relevance' | 'date' | 'price-low' | 'price-high' | 'popular' | 'rating'
  page?: number
  limit?: number
}

/**
 * Get upcoming free sessions (next 7 days)
 */
export async function getUpcomingFreeSessions(limit: number = 10) {
  const now = new Date()
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const sessions = await Session.aggregate([
    {
      $match: {
        status: SessionStatus.PUBLISHED,
        price: 0,
        sessionDate: {
          $gte: now,
          $lte: sevenDaysLater,
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'hostId',
        foreignField: '_id',
        as: 'host',
      },
    },
    { $unwind: '$host' },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        sessionDate: 1,
        duration: 1,
        category: 1,
        tags: 1,
        difficultyLevel: 1,
        price: 1,
        currency: 1,
        maxAttendees: 1,
        currentAttendees: 1,
        coverImage: 1,
        viewsCount: 1,
        'host.name': 1,
        'host.profileImage': 1,
      },
    },
    { $sort: { sessionDate: 1 } },
    { $limit: limit },
  ])

  return sessions
}

/**
 * Get popular paid masterclasses (sorted by registrations)
 */
export async function getPopularPaidSessions(limit: number = 12) {
  const now = new Date()

  const sessions = await Session.aggregate([
    {
      $match: {
        status: SessionStatus.PUBLISHED,
        price: { $gt: 0 },
        sessionDate: { $gte: now },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'hostId',
        foreignField: '_id',
        as: 'host',
      },
    },
    { $unwind: '$host' },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        sessionDate: 1,
        duration: 1,
        category: 1,
        tags: 1,
        difficultyLevel: 1,
        price: 1,
        currency: 1,
        maxAttendees: 1,
        currentAttendees: 1,
        coverImage: 1,
        viewsCount: 1,
        'host.name': 1,
        'host.profileImage': 1,
      },
    },
    { $sort: { currentAttendees: -1, viewsCount: -1 } },
    { $limit: limit },
  ])

  return sessions
}

/**
 * Get featured sessions (paid promotions)
 */
export async function getFeaturedSessions(limit: number = 6) {
  const now = new Date()

  const sessions = await Session.aggregate([
    {
      $match: {
        status: SessionStatus.PUBLISHED,
        isFeatured: true,
        $or: [
          { featuredUntil: { $exists: false } },
          { featuredUntil: { $gte: now } },
        ],
        sessionDate: { $gte: now },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'hostId',
        foreignField: '_id',
        as: 'host',
      },
    },
    { $unwind: '$host' },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        sessionDate: 1,
        duration: 1,
        category: 1,
        tags: 1,
        difficultyLevel: 1,
        price: 1,
        currency: 1,
        maxAttendees: 1,
        currentAttendees: 1,
        coverImage: 1,
        viewsCount: 1,
        'host.name': 1,
        'host.profileImage': 1,
      },
    },
    { $sort: { viewsCount: -1, sessionDate: 1 } },
    { $limit: limit },
  ])

  return sessions
}

/**
 * Get session counts by category
 */
export async function getCategoryCounts() {
  const now = new Date()

  const counts = await Session.aggregate([
    {
      $match: {
        status: SessionStatus.PUBLISHED,
        sessionDate: { $gte: now },
      },
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ])

  return counts.map((item) => ({
    category: item._id,
    count: item.count,
  }))
}

/**
 * Advanced search with filters
 */
export async function searchSessions(filters: SessionFilters) {
  const {
    search,
    categories,
    minPrice,
    maxPrice,
    freeOnly,
    dateFrom,
    dateTo,
    difficulty,
    availableOnly,
    duration,
    sortBy = 'date',
    page = 1,
    limit = 20,
  } = filters

  const now = new Date()
  const skip = (page - 1) * limit

  // Build match query
  const matchQuery: any = {
    status: SessionStatus.PUBLISHED,
    sessionDate: { $gte: dateFrom || now },
  }

  // Text search
  if (search) {
    matchQuery.$text = { $search: search }
  }

  // Category filter
  if (categories && categories.length > 0) {
    matchQuery.category = { $in: categories }
  }

  // Price filters
  if (freeOnly) {
    matchQuery.price = 0
  } else if (minPrice !== undefined || maxPrice !== undefined) {
    matchQuery.price = {}
    if (minPrice !== undefined) matchQuery.price.$gte = minPrice
    if (maxPrice !== undefined) matchQuery.price.$lte = maxPrice
  }

  // Date range
  if (dateTo) {
    matchQuery.sessionDate.$lte = dateTo
  }

  // Difficulty filter
  if (difficulty && difficulty.length > 0) {
    matchQuery.difficultyLevel = { $in: difficulty }
  }

  // Duration filter
  if (duration && duration.length > 0) {
    matchQuery.duration = { $in: duration }
  }

  // Available spots only
  if (availableOnly) {
    matchQuery.$expr = { $lt: ['$currentAttendees', '$maxAttendees'] }
  }

  // Build sort
  let sortStage: any = {}
  switch (sortBy) {
    case 'relevance':
      if (search) {
        sortStage = { score: { $meta: 'textScore' }, sessionDate: 1 }
      } else {
        sortStage = { viewsCount: -1, sessionDate: 1 }
      }
      break
    case 'date':
      sortStage = { sessionDate: 1 }
      break
    case 'price-low':
      sortStage = { price: 1, sessionDate: 1 }
      break
    case 'price-high':
      sortStage = { price: -1, sessionDate: 1 }
      break
    case 'popular':
      sortStage = { currentAttendees: -1, viewsCount: -1 }
      break
    case 'rating':
      // TODO: Add rating field and sort by it
      sortStage = { sessionDate: 1 }
      break
    default:
      sortStage = { sessionDate: 1 }
  }

  const pipeline: any[] = [
    { $match: matchQuery },
    {
      $lookup: {
        from: 'users',
        localField: 'hostId',
        foreignField: '_id',
        as: 'host',
      },
    },
    { $unwind: '$host' },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        sessionDate: 1,
        duration: 1,
        category: 1,
        tags: 1,
        difficultyLevel: 1,
        price: 1,
        currency: 1,
        maxAttendees: 1,
        currentAttendees: 1,
        coverImage: 1,
        viewsCount: 1,
        'host.name': 1,
        'host.profileImage': 1,
        ...(search && { score: { $meta: 'textScore' } }),
      },
    },
    { $sort: sortStage },
  ]

  // Get total count for pagination
  const countPipeline = [...pipeline, { $count: 'total' }]
  const countResult = await Session.aggregate(countPipeline)
  const total = countResult.length > 0 ? countResult[0].total : 0

  // Add pagination
  pipeline.push({ $skip: skip })
  pipeline.push({ $limit: limit })

  const sessions = await Session.aggregate(pipeline)

  return {
    sessions,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}

/**
 * Get related sessions (same category, similar date range)
 */
export async function getRelatedSessions(
  sessionId: string,
  category: string,
  sessionDate: Date,
  limit: number = 6
) {
  const threeDaysBefore = new Date(sessionDate.getTime() - 3 * 24 * 60 * 60 * 1000)
  const threeDaysAfter = new Date(sessionDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  const now = new Date()

  const sessions = await Session.aggregate([
    {
      $match: {
        _id: { $ne: sessionId },
        status: SessionStatus.PUBLISHED,
        category: category,
        sessionDate: {
          $gte: now,
          $gte: threeDaysBefore,
          $lte: threeDaysAfter,
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'hostId',
        foreignField: '_id',
        as: 'host',
      },
    },
    { $unwind: '$host' },
    {
      $project: {
        _id: 1,
        title: 1,
        slug: 1,
        description: 1,
        sessionDate: 1,
        duration: 1,
        category: 1,
        tags: 1,
        difficultyLevel: 1,
        price: 1,
        currency: 1,
        maxAttendees: 1,
        currentAttendees: 1,
        coverImage: 1,
        'host.name': 1,
        'host.profileImage': 1,
      },
    },
    { $sort: { sessionDate: 1 } },
    { $limit: limit },
  ])

  return sessions
}
