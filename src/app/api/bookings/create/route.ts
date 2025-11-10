import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'

export async function POST(request: Request) {
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

    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Find the session
    const sessionData = await Session.findById(sessionId)
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Validate session is available
    if (sessionData.status !== 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Session is not available for booking' },
        { status: 400 }
      )
    }

    if (sessionData.currentAttendees >= sessionData.maxAttendees) {
      return NextResponse.json(
        { error: 'Session is full' },
        { status: 400 }
      )
    }

    if (new Date(sessionData.sessionDate) < new Date()) {
      return NextResponse.json(
        { error: 'Cannot book past sessions' },
        { status: 400 }
      )
    }

    // Check if user already booked this session
    const existingBooking = await Booking.findOne({
      sessionId,
      attendeeId: user._id,
      status: { $in: ['CONFIRMED', 'PENDING'] },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this session' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await Booking.create({
      sessionId,
      attendeeId: user._id,
      paymentAmount: sessionData.price,
      paymentCurrency: sessionData.currency,
      status: sessionData.price === 0 ? 'CONFIRMED' : 'PENDING',
      paymentStatus: sessionData.price === 0 ? 'COMPLETED' : 'PENDING',
    })

    // Update session attendee count
    sessionData.currentAttendees += 1
    await sessionData.save()

    return NextResponse.json(
      {
        success: true,
        message: 'Session booked successfully',
        booking: {
          _id: booking._id.toString(),
          status: booking.status,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
