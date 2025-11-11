/**
 * Fee calculation utilities for Talklify platform
 */

const PLATFORM_FEE_PERCENTAGE = 0.12 // 12% platform fee
const STRIPE_FEE_PERCENTAGE = 0.029 // 2.9% Stripe fee
const STRIPE_FIXED_FEE = 0.30 // $0.30 fixed Stripe fee

export interface FeeCalculation {
  originalPrice: number
  platformFee: number
  stripeFee: number
  totalFees: number
  hostReceives: number
  currency: string
}

/**
 * Calculate fees and host payout for a session
 * @param price - Session price
 * @param currency - Currency code (USD, EUR, GBP)
 * @returns Fee breakdown and host payout
 */
export function calculateFees(price: number, currency: string = 'USD'): FeeCalculation {
  if (price === 0) {
    return {
      originalPrice: 0,
      platformFee: 0,
      stripeFee: 0,
      totalFees: 0,
      hostReceives: 0,
      currency,
    }
  }

  const platformFee = price * PLATFORM_FEE_PERCENTAGE
  const stripeFee = (price * STRIPE_FEE_PERCENTAGE) + STRIPE_FIXED_FEE
  const totalFees = platformFee + stripeFee
  const hostReceives = Math.max(0, price - totalFees)

  return {
    originalPrice: price,
    platformFee: Number(platformFee.toFixed(2)),
    stripeFee: Number(stripeFee.toFixed(2)),
    totalFees: Number(totalFees.toFixed(2)),
    hostReceives: Number(hostReceives.toFixed(2)),
    currency,
  }
}

/**
 * Format currency value with symbol
 * @param amount - Amount to format
 * @param currency - Currency code
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  }

  const symbol = symbols[currency] || '$'
  return `${symbol}${amount.toFixed(2)}`
}

/**
 * Get currency symbol
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
  }
  return symbols[currency] || '$'
}
