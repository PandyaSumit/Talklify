import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()

    const resolvedParams = await params

    const session = await Session.findOne({ slug: resolvedParams.slug })
      .populate('hostId', 'name email profileImage bio')
      .lean()

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    const hostData = session.hostId as any

    const response = {
      _id: session._id.toString(),
      title: session.title,
      slug: session.slug,
      description: session.description,
      category: session.category,
      tags: session.tags,
      difficultyLevel: session.difficultyLevel,
      sessionDate: session.sessionDate.toISOString(),
      duration: session.duration,
      timezone: session.timezone,
      meetingPlatform: session.meetingPlatform,
      price: session.price,
      currency: session.currency,
      maxAttendees: session.maxAttendees,
      currentAttendees: session.currentAttendees,
      status: session.status,
      coverImage: session.coverImage,
      viewsCount: session.viewsCount,
      host: {
        _id: hostData._id.toString(),
        name: hostData.name,
        email: hostData.email,
        profileImage: hostData.profileImage,
        bio: hostData.bio,
      },
    }

    return NextResponse.json({
      success: true,
      session: response,
    })
  } catch (error: any) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch session' },
      { status: 500 }
    )
  }
}
