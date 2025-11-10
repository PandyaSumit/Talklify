import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IReview extends Document {
  _id: string
  sessionId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
ReviewSchema.index({ userId: 1, sessionId: 1 }, { unique: true })
ReviewSchema.index({ sessionId: 1 })
ReviewSchema.index({ userId: 1 })

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)

export default Review
