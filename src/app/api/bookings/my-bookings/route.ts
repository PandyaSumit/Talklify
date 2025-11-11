import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
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

    // Fetch all bookings for this user with session details
    const bookings = await Booking.find({ userId: user._id })
      .populate({
        path: 'sessionId',
        select: 'title slug description sessionDate duration meetingPlatform category difficultyLevel status hostId price currency',
        populate: {
          path: 'hostId',
          select: 'name email profileImage',
        },
      })
      .sort({ createdAt: -1 })
      .lean()

    const transformedBookings = bookings
      .filter((b) => b.sessionId) // Filter out bookings where session was deleted
      .map((booking) => {
        const sessionData = booking.sessionId as any
        const now = new Date()
        const sessionDate = new Date(sessionData.sessionDate)

        // Categorize booking status for frontend filtering
        let category: 'upcoming' | 'past' | 'cancelled' = 'upcoming'
        if (booking.status === 'CANCELLED') {
          category = 'cancelled'
        } else if (sessionDate < now) {
          category = 'past'
        }

        return {
          _id: booking._id.toString(),
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          paymentAmount: booking.paymentAmount,
          paymentCurrency: booking.paymentCurrency,
          bookingDate: booking.createdAt.toISOString(),
          cancelledAt: booking.cancelledAt?.toISOString(),
          refundAmount: booking.refundAmount,
          attended: booking.attended,
          reviewLeft: booking.reviewLeft,
          category, // Add category for frontend filtering
          session: {
            _id: sessionData._id.toString(),
            title: sessionData.title,
            slug: sessionData.slug,
            description: sessionData.description,
            sessionDate: sessionData.sessionDate.toISOString(),
            duration: sessionData.duration,
            meetingPlatform: sessionData.meetingPlatform,
            category: sessionData.category,
            difficultyLevel: sessionData.difficultyLevel,
            status: sessionData.status,
            price: sessionData.price,
            currency: sessionData.currency,
            host: {
              name: sessionData.hostId?.name || 'Unknown',
              email: sessionData.hostId?.email || '',
              profileImage: sessionData.hostId?.profileImage,
            },
          },
        }
      })

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
    })
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
