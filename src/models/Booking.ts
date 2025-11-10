import mongoose, { Document, Model, Schema } from 'mongoose'

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  FAILED = 'FAILED',
}

export interface IBooking extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  paymentStatus: PaymentStatus
  paymentAmount: number
  stripePaymentIntentId?: string
  attended: boolean
  reminderSent24h: boolean
  reminderSent1h: boolean
  createdAt: Date
  updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Session',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    attended: {
      type: Boolean,
      default: false,
    },
    reminderSent24h: {
      type: Boolean,
      default: false,
    },
    reminderSent1h: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
BookingSchema.index({ userId: 1, sessionId: 1 }, { unique: true })
BookingSchema.index({ userId: 1 })
BookingSchema.index({ sessionId: 1 })
BookingSchema.index({ paymentStatus: 1 })

const Booking: Model<IBooking> =
  mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)

export default Booking
