// User Types
export enum UserType {
  HOST = 'HOST',
  ATTENDEE = 'ATTENDEE',
  BOTH = 'BOTH',
}

export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  BUSINESS = 'BUSINESS',
}

export interface User {
  id: string
  email: string
  name: string
  userType: UserType
  subscriptionTier: SubscriptionTier
  profileImage?: string
  bio?: string
  timezone: string
  stripeCustomerId?: string
  stripeConnectAccountId?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// Session Types
export enum SessionStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum MeetingPlatform {
  ZOOM = 'ZOOM',
  GOOGLE_MEET = 'GOOGLE_MEET',
  MICROSOFT_TEAMS = 'MICROSOFT_TEAMS',
}

export interface Session {
  id: string
  hostId: string
  host?: User
  title: string
  description: string
  sessionDate: Date
  duration: number // in minutes
  meetingPlatform: MeetingPlatform
  meetingLink: string
  category: string
  tags: string[]
  difficultyLevel: DifficultyLevel
  price: number // 0 for free sessions
  currency: string
  maxAttendees: number
  currentAttendees: number
  status: SessionStatus
  coverImage?: string
  createdAt: Date
  updatedAt: Date
}

// Booking Types
export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export interface Booking {
  id: string
  userId: string
  sessionId: string
  user?: User
  session?: Session
  paymentStatus: PaymentStatus
  paymentAmount: number
  stripePaymentIntentId?: string
  attended: boolean
  reminderSent24h: boolean
  reminderSent1h: boolean
  createdAt: Date
  updatedAt: Date
}

// Review Types
export interface Review {
  id: string
  sessionId: string
  userId: string
  session?: Session
  user?: User
  rating: number // 1-5
  comment: string
  createdAt: Date
  updatedAt: Date
}

// Payment Types
export interface Payment {
  id: string
  bookingId: string
  hostId: string
  amount: number
  platformFee: number
  hostAmount: number
  currency: string
  stripePaymentIntentId: string
  status: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

// Analytics Types
export interface SessionAnalytics {
  sessionId: string
  views: number
  clicks: number
  registrations: number
  conversionRate: number
  revenue: number
  date: Date
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Filter Types
export interface SessionFilters {
  category?: string
  priceMin?: number
  priceMax?: number
  dateFrom?: Date
  dateTo?: Date
  difficultyLevel?: DifficultyLevel
  hostId?: string
  search?: string
}
