import mongoose, { Document, Model, Schema } from 'mongoose'

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

export interface IUser extends Document {
  _id: string
  email: string
  emailVerified?: Date
  password?: string
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

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Date,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: Object.values(UserType),
      default: UserType.ATTENDEE,
    },
    subscriptionTier: {
      type: String,
      enum: Object.values(SubscriptionTier),
      default: SubscriptionTier.FREE,
    },
    profileImage: {
      type: String,
    },
    bio: {
      type: String,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    stripeCustomerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeConnectAccountId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
UserSchema.index({ email: 1 })
UserSchema.index({ userType: 1 })
UserSchema.index({ subscriptionTier: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
