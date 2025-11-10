import mongoose, { Document, Model, Schema } from 'mongoose'

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

export interface ISession extends Document {
  _id: string
  hostId: mongoose.Types.ObjectId
  title: string
  slug: string
  description: string
  sessionDate: Date
  duration: number
  meetingPlatform: MeetingPlatform
  meetingLink: string
  category: string
  tags: string[]
  difficultyLevel: DifficultyLevel
  price: number
  currency: string
  maxAttendees: number
  currentAttendees: number
  status: SessionStatus
  coverImage?: string
  createdAt: Date
  updatedAt: Date
}

const SessionSchema = new Schema<ISession>(
  {
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    meetingPlatform: {
      type: String,
      enum: Object.values(MeetingPlatform),
      required: true,
    },
    meetingLink: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    difficultyLevel: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    maxAttendees: {
      type: Number,
      required: true,
    },
    currentAttendees: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(SessionStatus),
      default: SessionStatus.DRAFT,
    },
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
SessionSchema.index({ hostId: 1 })
SessionSchema.index({ sessionDate: 1 })
SessionSchema.index({ category: 1 })
SessionSchema.index({ status: 1 })
SessionSchema.index({ slug: 1 })
SessionSchema.index({ tags: 1 })

const Session: Model<ISession> =
  mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema)

export default Session
