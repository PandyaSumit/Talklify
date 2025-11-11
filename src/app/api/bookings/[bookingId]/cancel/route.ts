import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'
import { processRefund, calculateRefundAmount } from '@/lib/stripe'
import { BookingStatus, PaymentStatus } from '@/models/Booking'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingId: string }> }
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

    // Find the booking
    const booking = await Booking.findById(resolvedParams.bookingId)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Verify booking belongs to user
    if (booking.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if booking can be cancelled
    if (booking.status === BookingStatus.CANCELLED) {
      return NextResponse.json(
        { error: 'Booking is already cancelled' },
        { status: 400 }
      )
    }

    if (booking.status === BookingStatus.ATTENDED) {
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

    // Calculate refund amount based on cancellation policy
    const { refundAmount, refundPercentage } = calculateRefundAmount(
      new Date(sessionData.sessionDate),
      booking.paymentAmount
    )

    let refundId: string | undefined
    let actualRefundAmount = 0

    // Process refund if payment was made and refund is eligible
    if (
      booking.stripePaymentIntentId &&
      booking.paymentStatus === PaymentStatus.COMPLETED &&
      refundAmount > 0
    ) {
      try {
        const refund = await processRefund({
          paymentIntentId: booking.stripePaymentIntentId,
          amount: refundAmount,
          reason: 'requested_by_customer',
        })
        refundId = refund.id
        actualRefundAmount = refund.amount / 100 // Convert from cents
      } catch (refundError: any) {
        console.error('Refund processing error:', refundError)
        return NextResponse.json(
          { error: 'Failed to process refund. Please contact support.' },
          { status: 500 }
        )
      }
    }

    // Parse request body for cancellation reason
    const body = await request.json().catch(() => ({}))
    const { reason } = body

    // Update booking status
    booking.status = BookingStatus.CANCELLED
    booking.cancelledAt = new Date()
    booking.cancellationReason = reason || 'Cancelled by attendee'

    if (actualRefundAmount > 0) {
      booking.paymentStatus =
        actualRefundAmount === booking.paymentAmount
          ? PaymentStatus.REFUNDED
          : PaymentStatus.PARTIALLY_REFUNDED
      booking.refundAmount = actualRefundAmount
      booking.stripeRefundId = refundId
      booking.refundReason = `${refundPercentage}% refund based on cancellation policy`
    }

    await booking.save()

    // Update session attendee count atomically
    await Session.findByIdAndUpdate(
      booking.sessionId,
      { $inc: { currentAttendees: -1 } },
      { new: true }
    )

    // TODO: Send cancellation confirmation email
    // await sendCancellationEmail(user.email, booking, sessionData, actualRefundAmount)

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully',
      refund: {
        amount: actualRefundAmount,
        percentage: refundPercentage,
        processed: actualRefundAmount > 0,
      },
    })
  } catch (error: any) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
