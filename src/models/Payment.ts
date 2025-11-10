import mongoose, { Document, Model, Schema } from 'mongoose'
import { PaymentStatus } from './Booking'

export interface IPayment extends Document {
  _id: string
  bookingId: mongoose.Types.ObjectId
  hostId: mongoose.Types.ObjectId
  amount: number
  platformFee: number
  hostAmount: number
  currency: string
  stripePaymentIntentId: string
  status: PaymentStatus
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
    },
    hostAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Create indexes
PaymentSchema.index({ hostId: 1 })
PaymentSchema.index({ status: 1 })

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema)

export default Payment
