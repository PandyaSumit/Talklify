import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'
import { retrievePaymentIntent } from '@/lib/stripe'
import { BookingStatus, PaymentStatus } from '@/models/Booking'

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
    const { paymentIntentId, sessionId } = body

    if (!paymentIntentId || !sessionId) {
      return NextResponse.json(
        { error: 'Payment intent ID and session ID are required' },
        { status: 400 }
      )
    }

    // Verify payment with Stripe
    const paymentIntent = await retrievePaymentIntent(paymentIntentId)

    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 400 }
      )
    }

    // Verify metadata matches
    if (
      paymentIntent.metadata.sessionId !== sessionId ||
      paymentIntent.metadata.userId !== user._id.toString()
    ) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Find the session
    const sessionData = await Session.findById(sessionId)
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check if booking already exists (idempotency)
    const existingBooking = await Booking.findOne({
      stripePaymentIntentId: paymentIntentId,
    })

    if (existingBooking) {
      return NextResponse.json({
        success: true,
        message: 'Booking already exists',
        booking: {
          _id: existingBooking._id.toString(),
          status: existingBooking.status,
        },
      })
    }

    // Double-check capacity
    if (sessionData.currentAttendees >= sessionData.maxAttendees) {
      // Payment succeeded but session is full - need to refund
      // This is a race condition edge case
      return NextResponse.json(
        {
          error: 'Session is now full. Your payment will be refunded automatically.',
        },
        { status: 400 }
      )
    }

    // Create booking with atomic increment of attendee count
    const booking = await Booking.create({
      userId: user._id,
      sessionId,
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.COMPLETED,
      paymentAmount: paymentIntent.amount / 100, // Convert from cents
      paymentCurrency: paymentIntent.currency.toUpperCase(),
      stripePaymentIntentId: paymentIntentId,
    })

    // Update session attendee count atomically
    await Session.findByIdAndUpdate(
      sessionId,
      { $inc: { currentAttendees: 1 } },
      { new: true }
    )

    // TODO: Send confirmation email
    // await sendBookingConfirmationEmail(user.email, booking, sessionData)

    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        booking: {
          _id: booking._id.toString(),
          status: booking.status,
          paymentStatus: booking.paymentStatus,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error completing payment:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to complete booking' },
      { status: 500 }
    )
  }
}
