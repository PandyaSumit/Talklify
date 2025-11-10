import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Session from '@/models/Session'
import User from '@/models/User'
import { authOptions } from '@/lib/auth/auth-options'

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
      sessionDate,
      duration,
      meetingPlatform,
      meetingLink,
      category,
      tags,
      difficultyLevel,
      price,
      currency,
      maxAttendees,
      status,
    } = body

    // Validate required fields
    if (!title || !description || !sessionDate || !duration || !meetingPlatform || !meetingLink || !category || !difficultyLevel || maxAttendees === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate date is in the future
    const sessionDateTime = new Date(sessionDate)
    if (sessionDateTime <= new Date()) {
      return NextResponse.json(
        { error: 'Session date must be in the future' },
        { status: 400 }
      )
    }

    // Generate unique slug
    const slug = generateSlug(title)

    // Create session
    const newSession = await Session.create({
      hostId: user._id,
      title,
      slug,
      description,
      sessionDate: sessionDateTime,
      duration,
      meetingPlatform,
      meetingLink,
      category,
      tags: tags || [],
      difficultyLevel,
      price: price || 0,
      currency: currency || 'USD',
      maxAttendees,
      currentAttendees: 0,
      status: status || 'DRAFT',
    })

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
