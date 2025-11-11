import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
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

    // Get current user
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is a host
    if (user.userType !== 'HOST' && user.userType !== 'BOTH') {
      return NextResponse.json(
        { error: 'Only hosts can seed sessions' },
        { status: 403 }
      )
    }

    // Create test sessions
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(14, 0, 0, 0)

    const nextWeek = new Date(now)
    nextWeek.setDate(nextWeek.getDate() + 7)
    nextWeek.setHours(15, 0, 0, 0)

    const twoWeeks = new Date(now)
    twoWeeks.setDate(twoWeeks.getDate() + 14)
    twoWeeks.setHours(16, 0, 0, 0)

    const sessions = [
      {
        hostId: user._id,
        title: 'Introduction to React Hooks',
        slug: `intro-react-hooks-${Date.now()}`,
        description:
          'Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks. Perfect for beginners looking to modernize their React skills. We will cover practical examples and best practices for building efficient React applications.',
        sessionDate: tomorrow,
        duration: 90,
        meetingPlatform: 'ZOOM',
        meetingLink: 'https://zoom.us/j/123456789',
        category: 'programming',
        tags: ['react', 'javascript', 'hooks', 'frontend'],
        difficultyLevel: 'BEGINNER',
        price: 0,
        currency: 'USD',
        maxAttendees: 50,
        currentAttendees: 0,
        status: 'PUBLISHED',
      },
      {
        hostId: user._id,
        title: 'Advanced TypeScript Patterns',
        slug: `advanced-typescript-${Date.now()}`,
        description:
          'Deep dive into advanced TypeScript patterns including generics, decorators, and advanced type inference. Learn how to build type-safe applications with confidence. Includes real-world examples from production codebases.',
        sessionDate: nextWeek,
        duration: 120,
        meetingPlatform: 'GOOGLE_MEET',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        category: 'programming',
        tags: ['typescript', 'javascript', 'types', 'advanced'],
        difficultyLevel: 'ADVANCED',
        price: 29.99,
        currency: 'USD',
        maxAttendees: 30,
        currentAttendees: 0,
        status: 'PUBLISHED',
      },
      {
        hostId: user._id,
        title: 'Building RESTful APIs with Node.js',
        slug: `nodejs-rest-api-${Date.now()}`,
        description:
          'Learn how to build scalable RESTful APIs using Node.js and Express. We will cover authentication, database integration with MongoDB, error handling, and API best practices. Suitable for intermediate developers.',
        sessionDate: twoWeeks,
        duration: 120,
        meetingPlatform: 'MICROSOFT_TEAMS',
        meetingLink: 'https://teams.microsoft.com/l/meetup-join/123',
        category: 'programming',
        tags: ['nodejs', 'express', 'api', 'backend'],
        difficultyLevel: 'INTERMEDIATE',
        price: 19.99,
        currency: 'USD',
        maxAttendees: 40,
        currentAttendees: 0,
        status: 'PUBLISHED',
      },
      {
        hostId: user._id,
        title: 'UI/UX Design Fundamentals',
        slug: `uiux-fundamentals-${Date.now()}`,
        description:
          'Master the basics of user interface and user experience design. Learn about design principles, color theory, typography, and user research. Perfect for developers wanting to improve their design skills or designers starting their journey.',
        sessionDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        duration: 60,
        meetingPlatform: 'ZOOM',
        meetingLink: 'https://zoom.us/j/987654321',
        category: 'design',
        tags: ['ui', 'ux', 'design', 'fundamentals'],
        difficultyLevel: 'BEGINNER',
        price: 0,
        currency: 'USD',
        maxAttendees: 100,
        currentAttendees: 0,
        status: 'PUBLISHED',
      },
      {
        hostId: user._id,
        title: 'Data Science with Python',
        slug: `data-science-python-${Date.now()}`,
        description:
          'Introduction to data science using Python. Learn pandas, numpy, matplotlib, and scikit-learn. We will cover data cleaning, visualization, and building your first machine learning model. Includes hands-on exercises and real datasets.',
        sessionDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        duration: 150,
        meetingPlatform: 'ZOOM',
        meetingLink: 'https://zoom.us/j/111222333',
        category: 'data science',
        tags: ['python', 'data science', 'machine learning', 'pandas'],
        difficultyLevel: 'INTERMEDIATE',
        price: 39.99,
        currency: 'USD',
        maxAttendees: 25,
        currentAttendees: 0,
        status: 'PUBLISHED',
      },
    ]

    // Delete existing test sessions (optional - comment this out if you want to keep them)
    // await Session.deleteMany({ hostId: user._id })

    // Create sessions
    const createdSessions = await Session.insertMany(sessions)

    return NextResponse.json(
      {
        success: true,
        message: `Successfully created ${createdSessions.length} test sessions`,
        count: createdSessions.length,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error seeding sessions:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed sessions' },
      { status: 500 }
    )
  }
}
