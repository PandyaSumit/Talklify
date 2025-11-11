# Talklify Implementation Documentation

## Overview
This document provides a complete reference of all implemented pages, components, APIs, and functionality in the Talklify platform.

---

## 📄 Pages & Routes

### 1. **Homepage** (`/`)
**File**: `src/app/page.tsx`

**Features**:
- Hero section with prominent search bar
- Quick stats display (1000+ sessions, 500+ hosts, etc.)
- "Upcoming Free Sessions" carousel (next 7 days)
- "Featured Sessions" carousel with ⭐ badge
- "Browse by Category" grid (8 categories with icons & session counts)
- "Popular Paid Masterclasses" carousel (sorted by attendees)
- CTA section for hosts

**Data Sources**:
- Fetches from `/api/sessions/homepage`
- Uses MongoDB aggregations for optimized queries

**Key Components Used**:
- `SessionCarousel` - Horizontal scrolling carousel
- `SessionCard` - Individual session display cards
- Category cards with Lucide icons

---

### 2. **Advanced Search Page** (`/sessions/search`)
**File**: `src/app/sessions/search/page.tsx`

**Features**:
- Full-text search across session titles and descriptions
- Collapsible filters sidebar with:
  - **Category**: Checkboxes for 8 categories (Tech, Design, Business, Marketing, Health, Career, Finance, Other)
  - **Price**: Range inputs ($0-$500) + "Free Only" toggle
  - **Date Range**: Presets (Today/This Week/This Month/Custom)
  - **Difficulty**: Beginner/Intermediate/Advanced checkboxes
  - **Duration**: 30min, 1hr, 1.5hr, 2hr, 2hr+ checkboxes
  - **Availability**: Toggle to show only sessions with available spots

**Sort Options**:
- Relevance (text score or views)
- Date (nearest first)
- Price (low-to-high / high-to-low)
- Most Popular (by attendees)

**Pagination**: 20 sessions per page

**Data Sources**:
- Fetches from `/api/sessions/search`
- Uses query parameters for all filters
- MongoDB text search with indexes

**Responsive**:
- Sidebar toggles on mobile
- Full-width on tablet/desktop

---

### 3. **Session Detail Page** (`/sessions/[slug]`)
**File**: `src/app/sessions/[slug]/page.tsx`

**Features**:
- Full session information display
- Cover image with gradient fallback
- Session details: date, time, timezone, duration, price
- Host profile card with avatar
- Category, difficulty, and tags badges
- Attendee count display
- Meeting link (only visible to host or booked attendees)
- "Book Now" / "Register Now" CTA button

**Enhanced Features**:
- Timezone display
- "Almost full" warning when < 5 spots left
- Rating display (if available)
- Booking status check

**Data Sources**:
- Fetches from `/api/sessions/[slug]`
- Decrypts meeting link server-side for authorized users

**Security**:
- Meeting links are encrypted in database
- Only shown to session host or booked attendees

---

### 4. **Session List Page** (`/sessions`)
**File**: `src/app/sessions/page.tsx`

**Features**:
- Browse all published sessions
- Search bar with live filtering
- Category, difficulty, and price filters
- Sort options (date, price, popularity)
- Session cards in responsive grid
- Filter results count

**Data Sources**:
- Fetches from `/api/sessions`
- Client-side filtering and sorting

---

### 5. **Host Dashboard - Session Creation** (`/host/sessions/create`)
**File**: `src/app/(dashboard)/host/sessions/create/page.tsx`

**Features**: Multi-step session creation form

**Step 1 - Basics**:
- Title (max 100 characters)
- Description (50-2000 characters)
- Category dropdown (8 options)
- Difficulty level (Beginner/Intermediate/Advanced)
- Tags (max 5, 30 characters each)

**Step 2 - Schedule**:
- Session date picker
- Time selection
- Timezone display (auto-detected)
- Duration selection (30/60/90/120/180 minutes)
- Max attendees (10-1000)
- Meeting platform (Zoom/Google Meet/Microsoft Teams)
- Meeting link (encrypted before storage)

**Step 3 - Pricing**:
- Free/Paid toggle
- Price input ($5-$5000)
- Currency selector (USD/EUR/GBP)
- Fee breakdown display:
  - Platform fee: 12%
  - Stripe fee: ~3%
  - Host receives: calculated amount

**Validation**:
- Published sessions must be 2+ hours in future
- All required fields enforced
- Character limits enforced

**Data Submission**:
- Posts to `/api/sessions/create`
- Meeting links encrypted with AES-256-CBC
- Redirects to host dashboard on success

---

### 6. **Host Dashboard - Session List** (`/host/sessions`)
**File**: `src/app/(dashboard)/host/sessions/page.tsx`

**Features**:
- View all sessions created by host
- Filter by status (draft/published/completed/cancelled)
- Quick actions: Edit, View, Cancel
- Session analytics display

---

## 🔌 API Endpoints

### Session APIs

#### 1. **Homepage Data** - `GET /api/sessions/homepage`
**File**: `src/app/api/sessions/homepage/route.ts`

**Returns**:
```json
{
  "success": true,
  "data": {
    "upcomingFree": [...],      // Next 7 days, free sessions
    "popularPaid": [...],        // Sorted by attendees + views
    "featured": [...],           // isFeatured = true
    "categoryCounts": [...]      // Session count per category
  }
}
```

**MongoDB Aggregations**:
- `getUpcomingFreeSessions(limit)` - Aggregates free sessions in next 7 days
- `getPopularPaidSessions(limit)` - Sorts by currentAttendees + viewsCount
- `getFeaturedSessions(limit)` - Filters by isFeatured flag
- `getCategoryCounts()` - Groups by category, counts sessions

---

#### 2. **Advanced Search** - `GET /api/sessions/search`
**File**: `src/app/api/sessions/search/route.ts`

**Query Parameters**:
- `search` - Full-text search query
- `categories` - Comma-separated categories
- `minPrice` / `maxPrice` - Price range
- `freeOnly` - Boolean flag
- `dateFrom` / `dateTo` - Date range (ISO format)
- `difficulty` - Comma-separated levels
- `duration` - Comma-separated minutes
- `availableOnly` - Boolean (show only sessions with spots)
- `sortBy` - relevance/date/price-low/price-high/popular
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20)

**Returns**:
```json
{
  "success": true,
  "sessions": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Features**:
- MongoDB text search on title/description
- Complex filtering with multiple conditions
- Efficient aggregation pipelines
- Pagination support

---

#### 3. **Session Detail** - `GET /api/sessions/[slug]`
**File**: `src/app/api/sessions/[slug]/route.ts`

**Returns**:
```json
{
  "success": true,
  "session": {
    "_id": "...",
    "title": "...",
    "slug": "...",
    "description": "...",
    "sessionDate": "2025-11-15T14:00:00Z",
    "duration": 90,
    "timezone": "America/New_York",
    "meetingPlatform": "Zoom",
    "meetingLink": "https://zoom.us/..." // Only if authorized
    "category": "Tech",
    "tags": ["react", "javascript"],
    "difficultyLevel": "Intermediate",
    "price": 29.99,
    "currency": "USD",
    "maxAttendees": 50,
    "currentAttendees": 35,
    "status": "published",
    "host": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "..."
    },
    "isBooked": false
  }
}
```

**Security**:
- Meeting link decrypted only for:
  - Session host
  - Users who have booked the session (status: CONFIRMED/PENDING)
- Uses `decryptMeetingLink()` utility

**Next.js 15 Compatibility**:
- Awaits `params` promise before accessing slug

---

#### 4. **Session Creation** - `POST /api/sessions/create`
**File**: `src/app/api/sessions/create/route.ts`

**Request Body**:
```json
{
  "title": "Introduction to React Hooks",
  "description": "Learn useState, useEffect...",
  "category": "Tech",
  "tags": ["react", "javascript", "hooks"],
  "difficultyLevel": "Beginner",
  "sessionDate": "2025-11-20T15:00:00Z",
  "duration": 90,
  "timezone": "America/New_York",
  "meetingPlatform": "Zoom",
  "meetingLink": "https://zoom.us/j/123456789",
  "price": 0,
  "currency": "USD",
  "maxAttendees": 50,
  "status": "published"
}
```

**Validation**:
- Title: max 100 chars
- Description: 50-2000 chars
- Tags: max 5, each max 30 chars
- Price: $5-$5000 for paid, $0 for free
- Max attendees: 10-1000
- Duration: 30/60/90/120/180 minutes
- Published sessions: must be 2+ hours in future

**Processing**:
1. Encrypts meeting link with AES-256-CBC
2. Sets `publishedAt` timestamp if status = published
3. Initializes analytics fields (viewsCount, clicksCount)
4. Saves to MongoDB

**Returns**:
```json
{
  "success": true,
  "message": "Session created successfully",
  "sessionId": "...",
  "slug": "introduction-to-react-hooks-abc123"
}
```

---

#### 5. **Session List** - `GET /api/sessions`
**File**: `src/app/api/sessions/route.ts`

**Query Parameters**:
- `category` - Filter by category
- `difficulty` - Filter by difficulty
- `minPrice` / `maxPrice` - Price range
- `search` - Text search

**Returns**: Array of published sessions with host info

---

#### 6. **Seed Sessions** - `POST /api/seed-sessions`
**File**: `src/app/api/seed-sessions/route.ts`

**Purpose**: Create test sessions for development/demo

**Authentication**: Requires logged-in HOST or BOTH user

**Creates**:
- 5 sample sessions across different categories
- Mix of free and paid sessions
- Various difficulty levels and durations
- All sessions 1-14 days in future

**Processing**:
1. Deletes existing sessions by current user
2. Encrypts all meeting links
3. Sets proper enum values (published, Beginner, etc.)
4. Adds timezone and analytics fields

**Returns**:
```json
{
  "success": true,
  "message": "Successfully created 5 test sessions",
  "count": 5
}
```

---

## 🧩 Components

### 1. **SessionCard**
**File**: `src/components/sessions/SessionCard.tsx`

**Props**:
```typescript
interface SessionCardProps {
  _id: string
  title: string
  slug: string
  description: string
  sessionDate: string
  duration: number
  category: string
  tags?: string[]
  difficultyLevel: string
  price: number
  currency: string
  maxAttendees: number
  currentAttendees: number
  coverImage?: string
  viewsCount?: number
  host: {
    name: string
    profileImage?: string
  }
  rating?: number
  reviewCount?: number
  isBookmarked?: boolean
  onBookmark?: (sessionId: string) => void
  onShare?: (sessionId: string) => void
}
```

**Features**:
- Cover image with gradient fallback
- Price badge (FREE or $X USD)
- "Almost full" warning badge (when < 5 spots left)
- Hover effects reveal bookmark & share buttons
- Displays: host avatar, rating, attendee count, difficulty, category, tags
- Responsive card layout
- Links to session detail page

**Styling**:
- 48px height cover image
- Rounded corners (16px)
- Hover: lift effect with shadow
- Dark mode support

---

### 2. **SessionCarousel**
**File**: `src/components/sessions/SessionCarousel.tsx`

**Props**:
```typescript
interface SessionCarouselProps {
  sessions: SessionCardProps[]
  title: string
  subtitle?: string
  onBookmark?: (sessionId: string) => void
  onShare?: (sessionId: string) => void
}
```

**Features**:
- Horizontal scrolling with navigation buttons
- Auto-detects scroll boundaries (disables buttons at edges)
- Mobile touch scroll with indicators
- Customizable title/subtitle
- 6px gap between cards
- Each card: 320px fixed width

**Responsive**:
- Desktop: Left/right navigation buttons
- Mobile: Touch scroll + dot indicators

---

## 🛠️ Utilities & Libraries

### 1. **Session Queries** (`src/lib/sessionQueries.ts`)

**MongoDB Aggregation Functions**:

#### `getUpcomingFreeSessions(limit: number)`
Returns free sessions in next 7 days, sorted by date.

#### `getPopularPaidSessions(limit: number)`
Returns paid sessions sorted by currentAttendees + viewsCount.

#### `getFeaturedSessions(limit: number)`
Returns sessions where `isFeatured = true` and `featuredUntil >= now`.

#### `getCategoryCounts()`
Groups sessions by category, returns count per category.

#### `searchSessions(filters: SessionFilters)`
Advanced search with:
- Full-text search (MongoDB $text)
- Category filter (array $in)
- Price range ($gte, $lte)
- Date range
- Difficulty filter
- Duration filter
- Availability check ($expr for currentAttendees < maxAttendees)
- Sort options with proper indexes
- Pagination

Returns:
```typescript
{
  sessions: SessionDocument[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

#### `getRelatedSessions(sessionId, category, sessionDate, limit)`
Finds sessions in same category within ±3 days of given date.

---

### 2. **Encryption** (`src/lib/encryption.ts`)

**Algorithm**: AES-256-CBC

**Functions**:

#### `encryptMeetingLink(plaintext: string): string`
- Uses 32-byte encryption key (64 hex chars)
- Generates random 16-byte IV
- Returns: `iv:encryptedData` (both hex encoded)
- Fallback: Default dev key if env var not set

#### `decryptMeetingLink(encrypted: string): string`
- Splits IV and encrypted data
- Decrypts using same key
- Returns original plaintext URL

**Environment Variable**: `ENCRYPTION_KEY` (optional, has safe fallback)

---

### 3. **Fee Calculator** (`src/lib/fees.ts`)

#### `calculateFees(price: number, currency: string): FeeCalculation`

**Returns**:
```typescript
{
  originalPrice: number    // Input price
  platformFee: number      // 12% of price
  stripeFee: number        // 2.9% + $0.30
  totalFees: number        // platformFee + stripeFee
  hostReceives: number     // price - totalFees
  currency: string
}
```

**Example**:
- Price: $100
- Platform fee: $12 (12%)
- Stripe fee: $3.20 (2.9% + $0.30)
- Host receives: $84.80

---

## 📊 Database Models

### 1. **Session Model** (`src/models/Session.ts`)

**Schema**:
```typescript
interface ISession {
  _id: string
  hostId: ObjectId              // ref: User
  title: string                 // max 100 chars
  slug: string                  // unique, auto-generated
  description: string           // max 2000 chars
  category: SessionCategory     // Tech, Design, Business, etc.
  tags: string[]                // max 5, each max 30 chars
  difficultyLevel: DifficultyLevel  // Beginner, Intermediate, Advanced
  sessionDate: Date
  duration: number              // 30, 60, 90, 120, 180 minutes
  timezone: string              // IANA timezone
  meetingPlatform: MeetingPlatform  // Zoom, Google Meet, Microsoft Teams
  meetingLinkEncrypted: string  // AES-256 encrypted
  price: number                 // 0-5000
  currency: Currency            // USD, EUR, GBP
  maxAttendees: number          // 10-1000
  currentAttendees: number      // default: 0
  status: SessionStatus         // draft, published, completed, cancelled
  coverImage?: string

  // Analytics
  viewsCount: number            // default: 0
  clicksCount: number           // default: 0

  // SEO & Discovery
  isFeatured: boolean           // default: false
  featuredUntil?: Date

  // Metadata
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
  cancelledAt?: Date
  cancellationReason?: string
}
```

**Enums**:
- `SessionStatus`: draft, published, completed, cancelled
- `DifficultyLevel`: Beginner, Intermediate, Advanced
- `MeetingPlatform`: Zoom, Google Meet, Microsoft Teams
- `SessionCategory`: Tech, Design, Business, Marketing, Health, Career, Finance, Other
- `Currency`: USD, EUR, GBP

**Indexes**:
- `hostId`: Single field index
- `sessionDate`: Single field index
- `category`: Single field index
- `status`: Single field index
- `slug`: Single field index (unique)
- `tags`: Single field index
- `sessionDate + status`: Compound index for dashboard queries
- `title + description`: Text search index

---

### 2. **User Model** (`src/models/User.ts`)

**Schema**:
```typescript
interface IUser {
  _id: string
  email: string                 // unique, lowercase
  emailVerified?: Date
  password?: string
  name: string
  userType: UserType            // HOST, ATTENDEE, BOTH
  subscriptionTier: SubscriptionTier  // FREE, PRO, BUSINESS
  profileImage?: string
  bio?: string
  timezone: string              // default: UTC
  stripeCustomerId?: string     // unique, sparse
  stripeConnectAccountId?: string  // unique, sparse
  isVerified: boolean           // default: false
  createdAt: Date
  updatedAt: Date
}
```

**Indexes**:
- `email`: Automatic (unique: true)
- `userType`: Single field index
- `subscriptionTier`: Single field index

---

## 🎨 Design System

### Color Palette

**Light Mode**:
- Background: `#FAFAFA` (primary), `#F5F5F5` (secondary), `#E8E8E8` (accent)
- Text: `#1F1F1F` (primary), `#5A5A5A` (secondary), `#8B8B8B` (tertiary)
- Brand: `#2563EB` (primary), `#1D4ED8` (hover)
- Borders: `#E5E5E5` (default), `#D4D4D4` (hover)

**Dark Mode**:
- Background: `#1A1A1A` (primary), `#242424` (secondary), `#2E2E2E` (accent)
- Text: `#EDEDED` (primary), `#B4B4B4` (secondary), `#737373` (tertiary)
- Brand: `#3B82F6` (primary), `#60A5FA` (hover)
- Borders: `#333333` (default), `#404040` (hover)

### Typography Scale
- Hero: 56px / 700 weight / -1% letter-spacing
- H1: 48px / 700 weight
- H2: 36px / 600 weight
- H3: 28px / 600 weight
- H4: 24px / 600 weight
- Body Large: 18px / 400 weight
- Body: 16px / 400 weight
- Body Small: 14px / 400 weight
- Caption: 12px / 500 weight / uppercase

### Spacing System (8px base)
- XXS: 4px
- XS: 8px
- SM: 16px
- MD: 24px
- LG: 32px
- XL: 48px
- 2XL: 64px
- 3XL: 96px
- 4XL: 128px

### Border Radius
- Small: 6px (buttons, inputs)
- Medium: 12px (cards)
- Large: 16px (feature sections)
- XL: 24px (hero sections)

### Component Classes

**Buttons**:
- `.btn-primary` - Blue background, white text, hover lift
- `.btn-secondary` - Transparent with border
- `.btn-ghost` - Minimal styling
- `.btn-sm` - 36px height
- `.btn-lg` - 52px height

**Cards**:
- `.card` - Secondary bg, 32px padding, hover lift
- `.card-flat` - No hover effect

**Inputs**:
- `.input` - 48px height, focus ring

**Badges**:
- `.badge` - Base styling
- `.badge-primary` / `.badge-success` / `.badge-warning` / `.badge-error`

**Utilities**:
- `.glass` - Backdrop blur effect
- `.gradient-text` - Brand gradient text
- `.section` - 96px vertical padding
- `.hover-lift` - Hover transform effect

---

## 🔒 Security Features

1. **Meeting Link Encryption**:
   - AES-256-CBC encryption
   - Links never stored in plaintext
   - Only decrypted for authorized users

2. **Access Control**:
   - Meeting links shown only to:
     - Session host
     - Booked attendees (CONFIRMED/PENDING status)

3. **Validation**:
   - Server-side input validation
   - Type checking with TypeScript
   - Enum validation for all status fields

4. **CSRF Protection**:
   - Next.js built-in protections
   - POST requests require authentication

---

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (24px padding)
- **Tablet**: 768px - 1023px (32px padding)
- **Desktop**: 1024px - 1439px (48px padding)
- **Large Desktop**: 1440px+ (max-width container)

---

## 🚀 Getting Started

### 1. Seed Database
```bash
# Login as HOST user, then:
POST /api/seed-sessions
```

### 2. View Homepage
```
Navigate to: http://localhost:3000
```

### 3. Search Sessions
```
Navigate to: http://localhost:3000/sessions/search
```

### 4. Create Session
```
Navigate to: http://localhost:3000/host/sessions/create
```

---

## 📈 Performance Optimizations

1. **MongoDB Aggregations**:
   - Efficient pipelines with proper indexes
   - Limits applied server-side
   - Compound indexes for common queries

2. **Parallel Data Fetching**:
   - Homepage uses `Promise.all()` for concurrent requests
   - Reduces total load time

3. **Pagination**:
   - Search results paginated (20 per page)
   - Prevents loading excessive data

4. **Text Search Indexes**:
   - MongoDB text indexes on title/description
   - Fast full-text search

---

## 🎯 Next Steps / TODO

### Remaining Features (Not Yet Implemented):

1. **Session Detail Enhancements**:
   - Reviews section with pagination
   - Related sessions carousel
   - Share functionality (Twitter, LinkedIn, Copy Link)

2. **Add to Calendar**:
   - .ics file generation
   - Google Calendar link
   - Outlook Calendar link
   - Apple Calendar link

3. **Bookmark System**:
   - Save sessions for later
   - Bookmark model and API
   - User bookmark list page

4. **Reviews & Ratings**:
   - Review model
   - Post-session review form
   - Rating aggregation
   - Display on session cards

5. **Host Analytics**:
   - Dashboard with charts
   - View/click tracking
   - Revenue reports

6. **Session Management**:
   - Edit sessions (restrictions based on status)
   - Cancel sessions with refund logic
   - Duplicate session feature
   - Bulk actions

7. **Payment Integration**:
   - Stripe checkout
   - Payment processing
   - Refund handling

---

## 📝 File Structure Summary

```
src/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── sessions/
│   │   ├── page.tsx                      # Session list
│   │   ├── [slug]/page.tsx               # Session detail
│   │   └── search/page.tsx               # Advanced search
│   ├── (dashboard)/host/sessions/
│   │   ├── page.tsx                      # Host dashboard
│   │   ├── create/page.tsx               # Multi-step creation
│   │   └── new/page.tsx                  # Redirect to create
│   ├── api/
│   │   └── sessions/
│   │       ├── route.ts                  # List sessions
│   │       ├── create/route.ts           # Create session
│   │       ├── [slug]/route.ts           # Get session detail
│   │       ├── homepage/route.ts         # Homepage data
│   │       └── search/route.ts           # Advanced search
│   ├── api/seed-sessions/route.ts        # Seed test data
│   └── globals.css                       # Design system styles
├── components/
│   └── sessions/
│       ├── SessionCard.tsx               # Session card component
│       └── SessionCarousel.tsx           # Carousel component
├── lib/
│   ├── sessionQueries.ts                 # MongoDB aggregations
│   ├── encryption.ts                     # AES-256 encryption
│   └── fees.ts                           # Fee calculator
├── models/
│   ├── Session.ts                        # Session schema
│   └── User.ts                           # User schema
└── styles/
    └── design-system.css                 # Design tokens
```

---

## 🐛 Known Issues / Fixes Applied

1. **Next.js 15 Params Issue**: ✅ Fixed
   - Params are now awaited before accessing properties
   - Updated in `[slug]/route.ts`

2. **Enum Value Mismatches**: ✅ Fixed
   - Standardized to lowercase status (draft, published)
   - Capitalized difficulty (Beginner, Intermediate, Advanced)
   - Updated seed script, APIs, and frontend

3. **Duplicate Mongoose Indexes**: ✅ Fixed
   - Removed redundant index definitions
   - Kept only unique indexes not defined in schema

4. **Encryption Key Fallback**: ✅ Implemented
   - Default dev key if ENCRYPTION_KEY not set
   - Graceful error handling

---

## 📞 Support & Documentation

For questions or issues:
1. Check this documentation first
2. Review code comments in source files
3. Check git commit messages for implementation details

---

**Last Updated**: November 11, 2025
**Version**: 1.0.0
