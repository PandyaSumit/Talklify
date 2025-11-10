import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(d)
}

export function calculatePlatformFee(amount: number, feePercentage: number = 15): number {
  return Math.round(amount * feePercentage) / 100
}

export function calculateHostAmount(amount: number, feePercentage: number = 15): number {
  return amount - calculatePlatformFee(amount, feePercentage)
}

export function isSessionUpcoming(sessionDate: Date | string): boolean {
  const date = typeof sessionDate === 'string' ? new Date(sessionDate) : sessionDate
  return date > new Date()
}

export function getTimeUntilSession(sessionDate: Date | string): string {
  const date = typeof sessionDate === 'string' ? new Date(sessionDate) : sessionDate
  const now = new Date()
  const diff = date.getTime() - now.getTime()

  if (diff < 0) return 'Session has passed'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
