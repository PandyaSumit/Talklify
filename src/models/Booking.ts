import mongoose, { Document, Model, Schema } from 'mongoose'

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  ATTENDED = 'ATTENDED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
  FAILED = 'FAILED',
}

export interface IBooking extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  sessionId: mongoose.Types.ObjectId
  status: BookingStatus
  paymentStatus: PaymentStatus
  paymentAmount: number
  paymentCurrency: string
  stripePaymentIntentId?: string
  stripeRefundId?: string
  refundAmount?: number
  refundReason?: string
  attended: boolean
  reminderSent24h: boolean
  reminderSent1h: boolean
  cancelledAt?: Date
  cancellationReason?: string
  reviewLeft: boolean
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
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
      index: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    paymentCurrency: {
      type: String,
      default: 'USD',
    },
    stripePaymentIntentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeRefundId: {
      type: String,
      sparse: true,
    },
    refundAmount: {
      type: Number,
    },
    refundReason: {
      type: String,
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
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
    reviewLeft: {
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
