/**
 * Stripe integration utilities for Talklify
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})

export interface CreatePaymentIntentParams {
  amount: number
  currency: string
  sessionId: string
  userId: string
  sessionTitle: string
  attendeeEmail: string
}

export interface ProcessRefundParams {
  paymentIntentId: string
  amount?: number // If not provided, full refund
  reason?: string
}

/**
 * Create a Stripe Payment Intent for a session booking
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<Stripe.PaymentIntent> {
  const { amount, currency, sessionId, userId, sessionTitle, attendeeEmail } = params

  // Convert amount to cents (Stripe expects amounts in smallest currency unit)
  const amountInCents = Math.round(amount * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: currency.toLowerCase(),
    metadata: {
      sessionId,
      userId,
      sessionTitle,
      type: 'session_booking',
    },
    description: `Booking for: ${sessionTitle}`,
    receipt_email: attendeeEmail,
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return paymentIntent
}

/**
 * Retrieve a Payment Intent by ID
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.retrieve(paymentIntentId)
}

/**
 * Confirm a Payment Intent (for server-side confirmation)
 */
export async function confirmPaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.confirm(paymentIntentId)
}

/**
 * Process a refund for a booking cancellation
 */
export async function processRefund(
  params: ProcessRefundParams
): Promise<Stripe.Refund> {
  const { paymentIntentId, amount, reason } = params

  const refundParams: Stripe.RefundCreateParams = {
    payment_intent: paymentIntentId,
    reason: reason === 'requested_by_customer' ? 'requested_by_customer' : undefined,
  }

  // If amount specified, do partial refund
  if (amount) {
    refundParams.amount = Math.round(amount * 100)
  }

  const refund = await stripe.refunds.create(refundParams)

  return refund
}

/**
 * Calculate refund amount based on cancellation policy
 * - >48 hours before: 100% refund
 * - 24-48 hours before: 50% refund
 * - <24 hours before: No refund
 */
export function calculateRefundAmount(
  sessionDate: Date,
  paymentAmount: number
): { refundAmount: number; refundPercentage: number } {
  const now = new Date()
  const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilSession > 48) {
    return { refundAmount: paymentAmount, refundPercentage: 100 }
  } else if (hoursUntilSession > 24) {
    return { refundAmount: paymentAmount * 0.5, refundPercentage: 50 }
  } else {
    return { refundAmount: 0, refundPercentage: 0 }
  }
}

/**
 * Check if refund is eligible based on session date
 */
export function isRefundEligible(sessionDate: Date): boolean {
  const now = new Date()
  return sessionDate.getTime() > now.getTime()
}

/**
 * Get Stripe public key for client-side
 */
export function getStripePublicKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined')
  }
  return key
}
