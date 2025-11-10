#!/bin/bash

# Talklify Environment Setup Script
# This script helps you create your .env file interactively

echo "🚀 Talklify Environment Setup"
echo "=============================="
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 1
    fi
fi

# Create .env file
echo "Creating .env file..."
echo ""

# Database URL
echo "📊 DATABASE SETUP"
echo "=================="
echo "Choose your database option:"
echo "1) Local PostgreSQL"
echo "2) Supabase (recommended for quick start)"
echo "3) Neon"
echo "4) Railway"
echo "5) Custom connection string"
echo ""
read -p "Enter option (1-5): " db_option

case $db_option in
    1)
        echo ""
        echo "Local PostgreSQL selected."
        echo "Make sure PostgreSQL is installed and running."
        echo ""
        read -p "Database name [talklify]: " db_name
        db_name=${db_name:-talklify}

        read -p "Database user [talklify_user]: " db_user
        db_user=${db_user:-talklify_user}

        read -sp "Database password: " db_password
        echo ""

        read -p "Database host [localhost]: " db_host
        db_host=${db_host:-localhost}

        read -p "Database port [5432]: " db_port
        db_port=${db_port:-5432}

        DATABASE_URL="postgresql://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}?schema=public"
        ;;
    2)
        echo ""
        echo "Supabase selected."
        echo "Go to https://supabase.com and create a project."
        echo "Then copy the connection string from Project Settings > Database"
        echo ""
        read -p "Paste your Supabase connection string: " DATABASE_URL
        ;;
    3)
        echo ""
        echo "Neon selected."
        echo "Go to https://neon.tech and create a project."
        echo ""
        read -p "Paste your Neon connection string: " DATABASE_URL
        ;;
    4)
        echo ""
        echo "Railway selected."
        echo "Go to https://railway.app and create a PostgreSQL database."
        echo ""
        read -p "Paste your Railway connection string: " DATABASE_URL
        ;;
    5)
        echo ""
        read -p "Enter your custom connection string: " DATABASE_URL
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🔐 NEXTAUTH SETUP"
echo "================="
echo "Generating secure NEXTAUTH_SECRET..."
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "✓ Generated!"

echo ""
read -p "NextAuth URL [http://localhost:3000]: " NEXTAUTH_URL
NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}

echo ""
echo "🌐 APP CONFIGURATION"
echo "===================="
read -p "Public app URL [http://localhost:3000]: " NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL:-http://localhost:3000}

read -p "Platform fee percentage [15]: " PLATFORM_FEE_PERCENTAGE
PLATFORM_FEE_PERCENTAGE=${PLATFORM_FEE_PERCENTAGE:-15}

echo ""
echo "📧 OPTIONAL: OAuth & Services"
echo "============================="
read -p "Add Google OAuth? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Google Client ID: " GOOGLE_CLIENT_ID
    read -p "Google Client Secret: " GOOGLE_CLIENT_SECRET
fi

echo ""
read -p "Add Stripe? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Stripe Secret Key: " STRIPE_SECRET_KEY
    read -p "Stripe Publishable Key: " STRIPE_PUBLISHABLE_KEY
    read -p "Stripe Webhook Secret: " STRIPE_WEBHOOK_SECRET
fi

echo ""
read -p "Add Resend Email? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Resend API Key: " RESEND_API_KEY
    read -p "Email From Address [noreply@talklify.com]: " EMAIL_FROM
    EMAIL_FROM=${EMAIL_FROM:-noreply@talklify.com}
fi

# Write .env file
echo ""
echo "📝 Writing .env file..."

cat > .env << EOF
# Database
DATABASE_URL="${DATABASE_URL}"

# NextAuth
NEXTAUTH_URL="${NEXTAUTH_URL}"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"

# OAuth Providers
${GOOGLE_CLIENT_ID:+GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID}"}
${GOOGLE_CLIENT_SECRET:+GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET}"}

# Stripe
${STRIPE_SECRET_KEY:+STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY}"}
${STRIPE_PUBLISHABLE_KEY:+STRIPE_PUBLISHABLE_KEY="${STRIPE_PUBLISHABLE_KEY}"}
${STRIPE_WEBHOOK_SECRET:+STRIPE_WEBHOOK_SECRET="${STRIPE_WEBHOOK_SECRET}"}

# Email (Resend)
${RESEND_API_KEY:+RESEND_API_KEY="${RESEND_API_KEY}"}
${EMAIL_FROM:+EMAIL_FROM="${EMAIL_FROM}"}

# Application
NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}"
PLATFORM_FEE_PERCENTAGE=${PLATFORM_FEE_PERCENTAGE}
EOF

echo ""
echo "✅ .env file created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Run: npx prisma generate"
echo "2. Run: npx prisma migrate dev --name init"
echo "3. Run: npm run dev"
echo "4. Visit: ${NEXT_PUBLIC_APP_URL}"
echo ""
echo "For more details, see SETUP_GUIDE.md"
