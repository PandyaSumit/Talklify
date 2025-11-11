import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import {
  getUpcomingFreeSessions,
  getPopularPaidSessions,
  getFeaturedSessions,
  getCategoryCounts,
} from '@/lib/sessionQueries'

export async function GET(request: Request) {
  try {
    await connectDB()

    // Fetch all homepage data in parallel
    const [upcomingFree, popularPaid, featured, categoryCounts] = await Promise.all([
      getUpcomingFreeSessions(10),
      getPopularPaidSessions(12),
      getFeaturedSessions(6),
      getCategoryCounts(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        upcomingFree,
        popularPaid,
        featured,
        categoryCounts,
      },
    })
  } catch (error) {
    console.error('Error fetching homepage data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch homepage data' },
      { status: 500 }
    )
  }
}
