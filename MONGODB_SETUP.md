# MongoDB Setup Guide for Talklify

This guide will help you set up MongoDB for the Talklify platform.

## Why MongoDB?

- No Windows permission issues (unlike Prisma)
- Flexible schema for rapid development
- Easy cloud hosting with MongoDB Atlas (free tier)
- Great for prototyping and MVPs

## 🚀 Quick Setup (5 minutes)

### Step 1: Get a Free MongoDB Database

**Option A: MongoDB Atlas (Recommended - Cloud)**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new cluster (M0 Free tier - 512MB)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Option B: Local MongoDB**

1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Your connection string: `mongodb://localhost:27017/talklify`

### Step 2: Configure Environment Variables

1. **Copy the example file:**
```powershell
cp .env.example .env
```

2. **Edit `.env` file:**
```powershell
notepad .env
```

3. **Add your MongoDB connection string:**
```env
# Replace with your actual MongoDB connection string
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/talklify?retryWrites=true&w=majority"

# Generate a secure secret
NEXTAUTH_SECRET="run: node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""

# Other required variables
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLATFORM_FEE_PERCENTAGE=15
```

### Step 3: Generate Secret

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and paste it as `NEXTAUTH_SECRET` in your `.env` file.

### Step 4: Install Dependencies

```powershell
npm install
```

### Step 5: Start Development Server

```powershell
npm run dev
```

Visit: **http://localhost:3000**

## ✅ Complete .env Example

```env
# MongoDB Connection
MONGODB_URI="mongodb+srv://myuser:mypassword@cluster0.mongodb.net/talklify?retryWrites=true&w=majority"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="Kx7vH8pQm4nR9wE3tY6uI5oP2aS1dF0gH8jK7lZ4xC3vB6nM9="

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLATFORM_FEE_PERCENTAGE=15
```

## 🗄️ MongoDB Atlas Setup (Detailed)

### 1. Create Account and Cluster

1. Visit https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose "Shared" → M0 (FREE)
4. Select a cloud provider and region (closest to you)
5. Name your cluster (e.g., "talklify-cluster")
6. Click "Create"

### 2. Create Database User

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `talklify_user`
5. Password: Generate a secure password
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### 3. Whitelist IP Address

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Or add your specific IP for better security
5. Click "Confirm"

### 4. Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<dbname>` with `talklify`

Example:
```
mongodb+srv://talklify_user:YOUR_PASSWORD@talklify-cluster.abcd123.mongodb.net/talklify?retryWrites=true&w=majority
```

## 📊 Database Models

The platform uses the following Mongoose models:

- **User** - User accounts (hosts and attendees)
- **Session** - Live expert sessions
- **Booking** - Session registrations
- **Review** - Session reviews and ratings
- **Payment** - Payment transactions
- **Follow** - User following relationships
- **Notification** - In-app notifications

All models are automatically created when you first use them (no migrations needed!).

## 🔍 View Your Database

### Option 1: MongoDB Atlas UI

1. Go to your cluster in MongoDB Atlas
2. Click "Browse Collections"
3. See all your data in a web interface

### Option 2: MongoDB Compass (Desktop App)

1. Download from https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. Click "Connect"
4. Browse your database visually

### Option 3: VS Code Extension

1. Install "MongoDB for VS Code" extension
2. Click MongoDB icon in sidebar
3. Add connection with your connection string
4. Browse collections in VS Code

## 🧪 Testing the Setup

### 1. Start the dev server:
```powershell
npm run dev
```

### 2. Create a test account:
- Visit http://localhost:3000/auth/signup
- Fill in the form
- Click "Create account"

### 3. Check if user was created:
- Go to MongoDB Atlas
- Browse Collections
- Find "users" collection
- You should see your new user!

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"

**Check:**
- Is your connection string correct?
- Did you replace `<password>` with actual password?
- Is your IP whitelisted in Network Access?
- Is MongoDB Atlas cluster running?

**Solution:**
```powershell
# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected!')).catch(e => console.log('❌ Error:', e.message))"
```

### "Authentication failed"

**Check:**
- Is the username/password correct in connection string?
- Did you URL-encode special characters in password?
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`

**Example:**
```
Password: p@ssw#rd
Encoded: p%40ssw%23rd
```

### "Mongoose model not found"

**Solution:**
Clear Next.js cache and restart:
```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### "Module not found: mongoose"

**Solution:**
```powershell
npm install mongoose
```

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - It's in `.gitignore` by default
   - Use `.env.example` for templates

2. **Use strong database passwords**
   - At least 16 characters
   - Mix of letters, numbers, symbols

3. **Restrict IP access in production**
   - Don't use 0.0.0.0/0 in production
   - Whitelist only your server IPs

4. **Enable audit logs in MongoDB Atlas**
   - Monitor database access
   - Track suspicious activity

## 📈 MongoDB vs Prisma

| Feature | MongoDB + Mongoose | PostgreSQL + Prisma |
|---------|-------------------|---------------------|
| **Setup Time** | 5 minutes | 15+ minutes |
| **Windows Issues** | None | Permission errors |
| **Migrations** | Not needed | Required |
| **Free Hosting** | Atlas 512MB | Supabase 500MB |
| **Schema Changes** | Flexible | Requires migration |
| **Learning Curve** | Easy | Moderate |

## 🎯 Next Steps

After setting up MongoDB:

1. **Test authentication**:
   - Sign up at http://localhost:3000/auth/signup
   - Sign in at http://localhost:3000/auth/signin

2. **Add Google OAuth** (optional):
   - Get credentials from Google Cloud Console
   - Add to `.env`:
     ```env
     GOOGLE_CLIENT_ID="your-client-id"
     GOOGLE_CLIENT_SECRET="your-client-secret"
     ```

3. **Start building features**:
   - Session creation
   - Booking system
   - Payment integration

## 📚 Resources

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose Documentation: https://mongoosejs.com/docs/
- MongoDB Atlas Tutorials: https://www.mongodb.com/docs/atlas/
- MongoDB University (Free Courses): https://university.mongodb.com/

---

Need help? Check the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md)
