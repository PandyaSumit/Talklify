import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'

export async function POST(
  request: Request,
  { params }: { params: { bookingId: string } }
) {
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

    // Find the booking
    const booking = await Booking.findById(params.bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify booking belongs to user
    if (booking.attendeeId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if booking can be cancelled
    if (booking.status === 'CANCELLED') {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (booking.status === 'ATTENDED') {
      return NextResponse.json(
        { error: 'Cannot cancel attended sessions' },
        { status: 400 }
      )
    }

    // Get session details
    const sessionData = await Session.findById(booking.sessionId)
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if session has already passed
    if (new Date(sessionData.sessionDate) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot cancel past sessions' },
        { status: 400 }
      )
    }

    // Update booking status
    booking.status = 'CANCELLED'
    await booking.save()

    // Update session attendee count
    if (sessionData.currentAttendees > 0) {
      sessionData.currentAttendees -= 1
      await sessionData.save()
    }

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
