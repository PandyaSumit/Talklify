# Talklify Setup Guide - Environment Configuration

## Step 1: Create Your .env File

Copy the example file to create your actual `.env` file:

```bash
cp .env.example .env
```

## Step 2: Choose Your Database Option

You have several options for PostgreSQL:

### Option A: Local PostgreSQL (Development)

**Install PostgreSQL locally:**

**On macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**On Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**On Windows:**
Download from: https://www.postgresql.org/download/windows/

**Create your database:**
```bash
# Access PostgreSQL
psql postgres

# Create database and user
CREATE DATABASE talklify;
CREATE USER talklify_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE talklify TO talklify_user;
\q
```

**Your DATABASE_URL will be:**
```env
DATABASE_URL="postgresql://talklify_user:your_secure_password@localhost:5432/talklify?schema=public"
```

### Option B: Supabase (Free Tier - Recommended for Development)

1. Go to https://supabase.com/
2. Click "Start your project"
3. Create a new project
4. Wait for database to provision (~2 minutes)
5. Go to Project Settings > Database
6. Copy the "Connection string" under "Connection pooling"
7. Replace `[YOUR-PASSWORD]` with your database password

**Your DATABASE_URL will look like:**
```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

### Option C: Neon (Free Tier - Serverless PostgreSQL)

1. Go to https://neon.tech/
2. Sign up and create a new project
3. Copy the connection string from the dashboard

**Your DATABASE_URL will look like:**
```env
DATABASE_URL="postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### Option D: Railway (Free Trial)

1. Go to https://railway.app/
2. Create new project
3. Add PostgreSQL database
4. Copy the connection string from Variables tab

**Your DATABASE_URL will look like:**
```env
DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:7432/railway"
```

### Option E: Vercel Postgres (Paid, but free tier available)

1. Go to https://vercel.com/
2. Create a new Postgres database in Storage
3. Copy the connection string

## Step 3: Generate Secure Secrets

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output to your `.env` file.

## Step 4: Complete Your .env File

Here's a **minimal working configuration** for local development:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://talklify_user:your_secure_password@localhost:5432/talklify?schema=public"

# NextAuth (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_FROM_STEP_3"

# App (REQUIRED)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLATFORM_FEE_PERCENTAGE=15

# OAuth (OPTIONAL - can add later)
# GOOGLE_CLIENT_ID="your-google-client-id"
# GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe (OPTIONAL - can add later)
# STRIPE_SECRET_KEY="sk_test_..."
# STRIPE_PUBLISHABLE_KEY="pk_test_..."
# STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (OPTIONAL - can add later)
# RESEND_API_KEY="re_..."
# EMAIL_FROM="noreply@talklify.com"
```

## Step 5: Set Up Optional Services (Later)

### Google OAuth Setup

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

### Stripe Setup

1. Go to https://dashboard.stripe.com/register
2. Get your API keys from Developers > API keys
3. For webhooks: Developers > Webhooks > Add endpoint
4. URL: `http://localhost:3000/api/webhooks/stripe`
5. Copy webhook secret to `.env`

### Resend Email Setup

1. Go to https://resend.com/
2. Sign up and verify your account
3. Get API key from API Keys section
4. Add to `.env`

## Step 6: Initialize Database

Once your `.env` is configured with the database:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) View your database
npx prisma studio
```

## Quick Start Example (Supabase - Fastest)

1. **Create Supabase account**: https://supabase.com/
2. **Create new project** and wait ~2 mins
3. **Get connection string** from Settings > Database
4. **Create `.env`:**

```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLATFORM_FEE_PERCENTAGE=15
```

5. **Run setup:**
```bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

6. **Visit**: http://localhost:3000

## Troubleshooting

### "Can't reach database server"
- Check if PostgreSQL is running: `pg_isready`
- Verify connection string format
- Check firewall settings
- For cloud databases, check IP whitelist

### "Authentication failed"
- Verify username and password in DATABASE_URL
- Check if user has proper permissions

### "Database does not exist"
- Create the database first
- Verify database name in connection string

### "SSL connection required"
- Add `?sslmode=require` to the end of your DATABASE_URL

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | ✅ Yes | PostgreSQL connection string |
| NEXTAUTH_URL | ✅ Yes | Your app URL (localhost:3000 for dev) |
| NEXTAUTH_SECRET | ✅ Yes | Random secret for session encryption |
| NEXT_PUBLIC_APP_URL | ✅ Yes | Public app URL |
| PLATFORM_FEE_PERCENTAGE | ✅ Yes | Commission percentage (default: 15) |
| GOOGLE_CLIENT_ID | ❌ Optional | For Google OAuth |
| GOOGLE_CLIENT_SECRET | ❌ Optional | For Google OAuth |
| STRIPE_SECRET_KEY | ❌ Optional | For payments |
| STRIPE_PUBLISHABLE_KEY | ❌ Optional | For payments |
| STRIPE_WEBHOOK_SECRET | ❌ Optional | For Stripe webhooks |
| RESEND_API_KEY | ❌ Optional | For emails |
| EMAIL_FROM | ❌ Optional | Sender email address |

## Next Steps

After setting up your `.env`:

1. Run `npx prisma generate` to generate Prisma Client
2. Run `npx prisma migrate dev` to create database tables
3. Run `npm run dev` to start the development server
4. Visit http://localhost:3000
5. Try creating an account at http://localhost:3000/auth/signup

## Need Help?

- Check DATABASE_URL format: https://www.prisma.io/docs/reference/database-reference/connection-urls
- Prisma troubleshooting: https://www.prisma.io/docs/guides/troubleshooting
- NextAuth setup: https://next-auth.js.org/getting-started/introduction
