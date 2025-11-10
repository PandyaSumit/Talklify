export const CATEGORIES = [
  'Marketing',
  'Business',
  'Technology',
  'Design',
  'Personal Development',
  'Health & Fitness',
  'Finance',
  'Career Coaching',
  'Sales',
  'Leadership',
  'Entrepreneurship',
  'Software Development',
  'Data Science',
  'AI & Machine Learning',
  'Other',
] as const

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const

export const PLATFORM_FEE_PERCENTAGE = 15 // 15% commission

export const SUBSCRIPTION_PRICES = {
  FREE: {
    monthly: 0,
    sessionsPerMonth: 2,
    features: [
      'Up to 2 sessions per month',
      'Basic analytics',
      'Email support',
      'Standard search placement',
    ],
  },
  PRO: {
    monthly: 29,
    sessionsPerMonth: -1, // unlimited
    features: [
      'Unlimited sessions',
      'Priority search placement',
      'Advanced analytics',
      'Email list export',
      'Custom branding',
      'Priority support',
    ],
  },
  BUSINESS: {
    monthly: 99,
    sessionsPerMonth: -1, // unlimited
    features: [
      'Everything in Pro',
      'Team accounts',
      'API access',
      'White-label pages',
      'Dedicated support',
      'Custom domain',
    ],
  },
} as const

export const SESSION_DURATIONS = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
] as const

export const MAX_ATTENDEES_OPTIONS = [
  10, 25, 50, 100, 250, 500, 1000,
] as const

export const REMINDER_INTERVALS = {
  HOURS_24: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  HOURS_1: 60 * 60 * 1000, // 1 hour in milliseconds
} as const
