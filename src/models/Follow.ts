import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IFollow extends Document {
  _id: string
  followerId: mongoose.Types.ObjectId
  followeeId: mongoose.Types.ObjectId
  createdAt: Date
}

const FollowSchema = new Schema<IFollow>(
  {
    followerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    followeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
FollowSchema.index({ followerId: 1, followeeId: 1 }, { unique: true })
FollowSchema.index({ followerId: 1 })
FollowSchema.index({ followeeId: 1 })

const Follow: Model<IFollow> =
  mongoose.models.Follow || mongoose.model<IFollow>('Follow', FollowSchema)

export default Follow
