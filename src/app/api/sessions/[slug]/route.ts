import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import Booking from '@/models/Booking'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'
import { decryptMeetingLink } from '@/lib/encryption'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB()

    // Await params in Next.js 15+
    const { slug } = await params

    const session = await getServerSession(authOptions)
    let userId: string | null = null

    if (session?.user?.email) {
      const user = await User.findOne({ email: session.user.email })
      userId = user?._id.toString() || null
    }

    // Find session by slug and populate host
    const sessionData = await Session.findOne({ slug })
      .populate('hostId', 'name email image')
      .lean()

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if current user has booked this session
    let isBooked = false
    if (userId) {
      const booking = await Booking.findOne({
        sessionId: sessionData._id,
        attendeeId: userId,
        status: { $in: ['CONFIRMED', 'PENDING'] },
      })
      isBooked = !!booking
    }

    // Check if user is the host
    const isHost = userId && sessionData.hostId._id.toString() === userId

    // Decrypt meeting link only for authorized users (host or booked attendees)
    let meetingLink: string | undefined = undefined
    if ((isHost || isBooked) && sessionData.meetingLinkEncrypted) {
      try {
        meetingLink = decryptMeetingLink(sessionData.meetingLinkEncrypted)
      } catch (error) {
        console.error('Failed to decrypt meeting link:', error)
        // Don't expose meeting link if decryption fails
      }
    }

    const transformedSession = {
      _id: sessionData._id.toString(),
      title: sessionData.title,
      slug: sessionData.slug,
      description: sessionData.description,
      sessionDate: sessionData.sessionDate.toISOString(),
      duration: sessionData.duration,
      timezone: sessionData.timezone,
      meetingPlatform: sessionData.meetingPlatform,
      meetingLink, // Only included if user is authorized
      category: sessionData.category,
      tags: sessionData.tags,
      difficultyLevel: sessionData.difficultyLevel,
      price: sessionData.price,
      currency: sessionData.currency,
      maxAttendees: sessionData.maxAttendees,
      currentAttendees: sessionData.currentAttendees,
      status: sessionData.status,
      host: {
        _id: (sessionData.hostId as any)?._id.toString(),
        name: (sessionData.hostId as any)?.name || 'Unknown',
        email: (sessionData.hostId as any)?.email || '',
        image: (sessionData.hostId as any)?.image,
      },
      isBooked,
    }

    return NextResponse.json({
      success: true,
      session: transformedSession,
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch session details' },
      { status: 500 }
    )
  }
}
