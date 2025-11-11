import mongoose, { Document, Model, Schema } from 'mongoose'

export enum SessionStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum DifficultyLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum MeetingPlatform {
  ZOOM = 'Zoom',
  GOOGLE_MEET = 'Google Meet',
  MICROSOFT_TEAMS = 'Microsoft Teams',
}

export enum SessionCategory {
  MARKETING = 'Marketing',
  TECH = 'Tech',
  BUSINESS = 'Business',
  HEALTH = 'Health',
  DESIGN = 'Design',
  CAREER = 'Career',
  FINANCE = 'Finance',
  OTHER = 'Other',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
}

export interface ISession extends Document {
  _id: string
  hostId: mongoose.Types.ObjectId
  title: string
  slug: string
  description: string
  category: SessionCategory
  tags: string[]
  difficultyLevel: DifficultyLevel
  sessionDate: Date
  duration: number
  timezone: string
  meetingPlatform: MeetingPlatform
  meetingLinkEncrypted: string
  price: number
  currency: Currency
  maxAttendees: number
  currentAttendees: number
  status: SessionStatus
  coverImage?: string

  // Analytics fields
  viewsCount: number
  clicksCount: number

  // SEO & Discovery
  isFeatured: boolean
  featuredUntil?: Date

  // Metadata
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
}

const SessionSchema = new Schema<ISession>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      maxLength: 100,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    category: {
      type: String,
      enum: Object.values(SessionCategory),
      required: true,
      index: true,
    },
    tags: {
      type: [{ type: String, maxLength: 30 }],
      default: [],
      validate: {
        validator: function(v: string[]) {
          return v.length <= 5
        },
        message: 'Maximum 5 tags allowed'
      }
    },
    difficultyLevel: {
      type: String,
      enum: Object.values(DifficultyLevel),
      default: DifficultyLevel.BEGINNER,
    },
    sessionDate: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      required: true,
      enum: [30, 60, 90, 120, 180],
    },
    timezone: {
      type: String,
      required: true,
    },
    meetingPlatform: {
      type: String,
      enum: Object.values(MeetingPlatform),
      required: true,
    },
    meetingLinkEncrypted: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
      max: 5000,
    },
    currency: {
      type: String,
      enum: Object.values(Currency),
      default: Currency.USD,
    },
    maxAttendees: {
      type: Number,
      required: true,
      min: 10,
      max: 1000,
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.DRAFT,
      index: true,
    },
    coverImage: {
      type: String,
    },

    // Analytics fields
    viewsCount: {
      type: Number,
      default: 0,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },

    // SEO & Discovery
    isFeatured: {
      type: Boolean,
      default: false,
    },
    featuredUntil: {
      type: Date,
    },

    // Metadata
    publishedAt: {
      type: Date,
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes (individual field indexes are already defined with "index: true" above)
SessionSchema.index({ sessionDate: 1, status: 1 }) // Compound index for dashboard queries
SessionSchema.index({ title: 'text', description: 'text' }) // Text search

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)

export default Session
