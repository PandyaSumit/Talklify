import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Fetch all sessions for this host
    const sessions = await Session.find({ hostId: user._id })
      .sort({ sessionDate: -1 })
      .lean()

    const transformedSessions = sessions.map((s) => ({
      _id: s._id.toString(),
      title: s.title,
      slug: s.slug,
      sessionDate: s.sessionDate.toISOString(),
      duration: s.duration,
      category: s.category,
      difficultyLevel: s.difficultyLevel,
      price: s.price,
      maxAttendees: s.maxAttendees,
      currentAttendees: s.currentAttendees,
      status: s.status,
    }))

    return NextResponse.json({
      success: true,
      sessions: transformedSessions,
    })
  } catch (error) {
    console.error('Error fetching host sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}
