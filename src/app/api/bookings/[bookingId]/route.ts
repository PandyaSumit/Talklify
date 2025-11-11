import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import { authOptions } from '@/lib/auth/auth-options'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const resolvedParams = await params

    // Fetch booking with populated session and host details
    const booking = await Booking.findById(resolvedParams.bookingId)
      .populate({
        path: 'sessionId',
        select: 'title slug description sessionDate duration meetingPlatform meetingLinkEncrypted category difficultyLevel status price currency hostId maxAttendees currentAttendees',
        populate: {
          path: 'hostId',
          select: 'name email profileImage bio',
        },
      })
      .populate({
        path: 'userId',
        select: 'name email',
      })
      .lean()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify user has access to this booking
    const userId = (booking.userId as any)._id.toString()
    const sessionHostId = (booking.sessionId as any)?.hostId?._id?.toString()
    const currentUserId = session.user.id

    if (userId !== currentUserId && sessionHostId !== currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Transform booking data
    const sessionData = booking.sessionId as any
    const attendeeData = booking.userId as any
    const hostData = sessionData?.hostId || {}

    // Determine if meeting link should be revealed
    // Meeting link revealed 1 hour before session
    const now = new Date()
    const sessionDate = new Date(sessionData.sessionDate)
    const oneHourBefore = new Date(sessionDate.getTime() - 60 * 60 * 1000)
    const showMeetingLink = now >= oneHourBefore && booking.status === 'CONFIRMED'

    const response = {
      _id: booking._id.toString(),
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      paymentAmount: booking.paymentAmount,
      paymentCurrency: booking.paymentCurrency,
      bookingDate: booking.createdAt.toISOString(),
      cancelledAt: booking.cancelledAt?.toISOString(),
      cancellationReason: booking.cancellationReason,
      refundAmount: booking.refundAmount,
      refundReason: booking.refundReason,
      attended: booking.attended,
      reviewLeft: booking.reviewLeft,
      session: {
        _id: sessionData._id.toString(),
        title: sessionData.title,
        slug: sessionData.slug,
        description: sessionData.description,
        sessionDate: sessionData.sessionDate.toISOString(),
        duration: sessionData.duration,
        meetingPlatform: sessionData.meetingPlatform,
        meetingLink: showMeetingLink ? sessionData.meetingLinkEncrypted : null,
        category: sessionData.category,
        difficultyLevel: sessionData.difficultyLevel,
        status: sessionData.status,
        price: sessionData.price,
        currency: sessionData.currency,
        maxAttendees: sessionData.maxAttendees,
        currentAttendees: sessionData.currentAttendees,
        host: {
          _id: hostData._id?.toString(),
          name: hostData.name || 'Unknown',
          email: hostData.email || '',
          profileImage: hostData.profileImage,
          bio: hostData.bio,
        },
      },
      attendee: {
        _id: attendeeData._id.toString(),
        name: attendeeData.name,
        email: attendeeData.email,
      },
    }

    return NextResponse.json({
      success: true,
      booking: response,
    })
  } catch (error: any) {
    console.error('Error fetching booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
