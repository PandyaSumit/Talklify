import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'
import { encryptMeetingLink, isValidUrl } from '@/lib/encryption'

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim() + '-' + Date.now().toString(36)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Check if user is a host
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.userType !== 'HOST' && user.userType !== 'BOTH') {
      return NextResponse.json(
        { error: 'Only hosts can create sessions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      difficultyLevel,
      tags,
      sessionDate,
      duration,
      timezone,
      meetingPlatform,
      meetingLink,
      maxAttendees,
      price,
      currency,
      status,
    } = body

    // Validate required fields
    if (!title || !description || !category || !difficultyLevel || !sessionDate || !duration || !timezone || !meetingPlatform || !meetingLink || maxAttendees === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate title length
    if (title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      )
    }

    // Validate description length
    if (description.length < 50 || description.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be between 50 and 2000 characters' },
        { status: 400 }
      )
    }

    // Validate tags
    if (tags && tags.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 tags allowed' },
        { status: 400 }
      )
    }

    // Validate meeting link is a valid URL
    if (!isValidUrl(meetingLink)) {
      return NextResponse.json(
        { error: 'Invalid meeting link URL' },
        { status: 400 }
      )
    }

    // Validate max attendees range
    if (maxAttendees < 10 || maxAttendees > 1000) {
      return NextResponse.json(
        { error: 'Max attendees must be between 10 and 1000' },
        { status: 400 }
      )
    }

    // Validate price range
    if (price && (price < 5 || price > 5000)) {
      return NextResponse.json(
        { error: 'Price must be between $5 and $5000' },
        { status: 400 }
      )
    }

    // Validate date is at least 2 hours in the future when publishing
    const sessionDateTime = new Date(sessionDate)
    const minDate = new Date()
    minDate.setHours(minDate.getHours() + 2)

    if (status === 'published' && sessionDateTime <= minDate) {
      return NextResponse.json(
        { error: 'Published sessions must be at least 2 hours in the future' },
        { status: 400 }
      )
    }

    // Encrypt meeting link
    const encryptedMeetingLink = encryptMeetingLink(meetingLink)

    // Generate unique slug
    const slug = generateSlug(title)

    // Prepare session data
    const sessionData: any = {
      hostId: user._id,
      title,
      slug,
      description,
      category,
      difficultyLevel,
      tags: tags || [],
      sessionDate: sessionDateTime,
      duration,
      timezone,
      meetingPlatform,
      meetingLinkEncrypted: encryptedMeetingLink,
      maxAttendees,
      currentAttendees: 0,
      price: price || 0,
      currency: currency || 'USD',
      status: status || 'draft',
      viewsCount: 0,
      clicksCount: 0,
      isFeatured: false,
    }

    // Set publishedAt timestamp if publishing
    if (status === 'published') {
      sessionData.publishedAt = new Date()
    }

    // Create session
    const newSession = await Session.create(sessionData)

    return NextResponse.json(
      {
        success: true,
        message: 'Session created successfully',
        session: {
          _id: newSession._id.toString(),
          slug: newSession.slug,
          title: newSession.title,
          status: newSession.status,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    )
  }
}
