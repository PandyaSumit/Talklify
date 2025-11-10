import mongoose, { Document, Model, Schema } from 'mongoose'

export enum NotificationType {
  SESSION_REMINDER = 'SESSION_REMINDER',
  NEW_BOOKING = 'NEW_BOOKING',
  SESSION_CANCELLED = 'SESSION_CANCELLED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  NEW_SESSION_FROM_HOST = 'NEW_SESSION_FROM_HOST',
}

export interface INotification extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  message: string
  read: boolean
  data?: any
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
NotificationSchema.index({ userId: 1 })
NotificationSchema.index({ read: 1 })

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
