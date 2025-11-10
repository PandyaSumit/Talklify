# Talklify - Quick Start Guide

Get Talklify running in under 5 minutes!

## 🚀 Super Fast Setup (Recommended)

### Option 1: Automated Setup Script

```bash
# Run the interactive setup script
./scripts/setup-env.sh
```

The script will guide you through:
- ✅ Choosing your database (Supabase, Neon, local, etc.)
- ✅ Generating secure secrets automatically
- ✅ Setting up optional services (Google OAuth, Stripe, Email)
- ✅ Creating your .env file

### Option 2: Manual Setup (2 minutes)

**1. Create .env file:**

```bash
cp .env.example .env
```

**2. Get a free database from Supabase:**

- Go to https://supabase.com/
- Sign up and create a new project
- Copy connection string from Settings > Database
- Paste it in your `.env` file as `DATABASE_URL`

**3. Generate a secret:**

```bash
openssl rand -base64 32
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env`

**4. Your minimal .env should look like:**

```env
DATABASE_URL="postgresql://postgres.xxx:PASSWORD@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLATFORM_FEE_PERCENTAGE=15
```

## 📦 Install & Run

```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev
```

Visit: **http://localhost:3000** 🎉

## 🎯 Test the Platform

1. **Create an account**: http://localhost:3000/auth/signup
2. **Sign in**: http://localhost:3000/auth/signin
3. **Start exploring!**

## 🔧 Troubleshooting

**"Can't reach database"**
- Check your DATABASE_URL format
- Verify database is running
- For cloud databases, check connection limits

**"Module not found"**
- Run `npm install` again
- Delete `node_modules` and run `npm install`

**"Prisma Client not found"**
- Run `npx prisma generate`

**Still stuck?**
- See detailed guide: [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- Check `.env.example` for reference

## 📚 Free Database Providers

All have generous free tiers:

| Provider | Free Tier | Best For | Setup Time |
|----------|-----------|----------|------------|
| [Supabase](https://supabase.com) | 500MB, 2GB bandwidth | Quick start | 2 min |
| [Neon](https://neon.tech) | 3GB storage | Serverless | 1 min |
| [Railway](https://railway.app) | $5 free credit | Full features | 2 min |
| [Vercel Postgres](https://vercel.com/storage/postgres) | 60 hours compute | Production | 3 min |

## 🎓 What's Next?

After setup, you can:
- Add Google OAuth for easy sign-in
- Integrate Stripe for payments
- Set up email notifications with Resend
- Deploy to Vercel

See the full [README.md](./README.md) for complete documentation.

## ⚡ One-Liner Setup (if you already have Supabase)

```bash
cp .env.example .env && \
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env && \
npm install && \
npx prisma generate && \
npx prisma migrate dev --name init && \
npm run dev
```

Then just add your `DATABASE_URL` to `.env` and restart!

---

Need help? Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions.
