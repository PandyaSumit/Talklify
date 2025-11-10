import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import { SessionStatus } from '@/models/Session'

export async function GET(request: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const search = searchParams.get('search')

    // Build query
    const query: any = {
      status: SessionStatus.PUBLISHED,
      sessionDate: { $gte: new Date() }, // Only future sessions
    }

    if (category && category !== 'all') {
      query.category = { $regex: new RegExp(category, 'i') }
    }

    if (difficulty && difficulty !== 'all') {
      query.difficultyLevel = difficulty
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {}
      if (minPrice !== null) query.price.$gte = Number(minPrice)
      if (maxPrice !== null) query.price.$lte = Number(maxPrice)
    }

    if (search) {
      query.$or = [
        { title: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ]
    }

    // Fetch sessions with host information
    const sessions = await Session.find(query)
      .populate('hostId', 'name email image')
      .sort({ sessionDate: 1 })
      .limit(100)
      .lean()

    // Transform data
    const transformedSessions = sessions.map((session) => ({
      _id: session._id.toString(),
      title: session.title,
      slug: session.slug,
      description: session.description,
      sessionDate: session.sessionDate.toISOString(),
      duration: session.duration,
      category: session.category,
      tags: session.tags,
      difficultyLevel: session.difficultyLevel,
      price: session.price,
      currency: session.currency,
      maxAttendees: session.maxAttendees,
      currentAttendees: session.currentAttendees,
      coverImage: session.coverImage,
      host: {
        name: (session.hostId as any)?.name || 'Unknown',
        image: (session.hostId as any)?.image,
      },
    }))

    return NextResponse.json({
      success: true,
      sessions: transformedSessions,
      count: transformedSessions.length,
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
