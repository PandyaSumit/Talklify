import { NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import User, { UserType } from '@/models/User'
import { hashPassword } from '@/lib/auth/password'

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  userType: z.nativeEnum(UserType).default(UserType.ATTENDEE),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    await connectDB()

    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await User.create({
      email: validatedData.email,
      password: hashedPassword,
      name: validatedData.name,
      userType: validatedData.userType,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    })

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          userType: user.userType,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
