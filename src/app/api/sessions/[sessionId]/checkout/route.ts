import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import Booking from '@/models/Booking'
import { authOptions } from '@/lib/auth/auth-options'
import { createPaymentIntent } from '@/lib/stripe'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
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

    const resolvedParams = await params
    const sessionData = await Session.findById(resolvedParams.sessionId)
    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Validate session is available for booking
    if (sessionData.status !== 'published') {
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

    // Check if session is free
    if (sessionData.price === 0) {
      return NextResponse.json(
        { error: 'This is a free session, use the free registration endpoint' },
        { status: 400 }
      )
    }

    // Check for existing booking
    const existingBooking = await Booking.findOne({
      userId: user._id,
      sessionId: resolvedParams.sessionId,
      status: { $in: ['PENDING', 'CONFIRMED'] },
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You have already booked this session' },
        { status: 400 }
      )
    }

    // Create Stripe Payment Intent
    const paymentIntent = await createPaymentIntent({
      amount: sessionData.price,
      currency: sessionData.currency,
      sessionId: resolvedParams.sessionId,
      userId: user._id.toString(),
      sessionTitle: sessionData.title,
      attendeeEmail: user.email,
    })

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: sessionData.price,
      currency: sessionData.currency,
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
