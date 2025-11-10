# Talklify Windows Setup Fix Script
# Run this as Administrator if you have permission issues

Write-Host "🔧 Talklify Windows Fix Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as Administrator" -ForegroundColor Yellow
    Write-Host "For best results, run PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

# Check Node.js version
Write-Host "Checking Node.js version..." -ForegroundColor Green
$nodeVersion = node --version
Write-Host "Node.js version: $nodeVersion" -ForegroundColor White

if (-not $nodeVersion) {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🧹 Cleaning old files..." -ForegroundColor Green

# Clean .next folder
if (Test-Path ".next") {
    Write-Host "  Removing .next folder..."
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
}

# Clean Prisma generated files
if (Test-Path "node_modules\.prisma") {
    Write-Host "  Removing node_modules\.prisma folder..."
    Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
}

# Clean @prisma/client
if (Test-Path "node_modules\@prisma\client") {
    Write-Host "  Removing @prisma/client folder..."
    Remove-Item -Recurse -Force node_modules\@prisma\client -ErrorAction SilentlyContinue
}

Write-Host "✓ Cleanup complete!" -ForegroundColor Green
Write-Host ""

# Check if .env exists
Write-Host "📋 Checking environment configuration..." -ForegroundColor Green
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found!" -ForegroundColor Yellow
    Write-Host ""
    $createEnv = Read-Host "Do you want to create .env from .env.example? (y/n)"
    if ($createEnv -eq "y") {
        Copy-Item .env.example .env
        Write-Host "✓ Created .env file. Please edit it with your database credentials." -ForegroundColor Green
        Write-Host "  Run: notepad .env" -ForegroundColor White
        Write-Host ""
        $editNow = Read-Host "Open .env in Notepad now? (y/n)"
        if ($editNow -eq "y") {
            notepad .env
            Read-Host "Press Enter after you've configured .env"
        }
    }
}

# Generate Prisma Client
Write-Host ""
Write-Host "🔨 Generating Prisma Client..." -ForegroundColor Green
Write-Host "  This may take a minute..." -ForegroundColor White
Write-Host ""

$generateOutput = npx prisma generate 2>&1
Write-Host $generateOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Prisma Client generated successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Prisma generation failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting steps:" -ForegroundColor Yellow
    Write-Host "1. Make sure you're running PowerShell as Administrator" -ForegroundColor White
    Write-Host "2. Check if antivirus is blocking file operations" -ForegroundColor White
    Write-Host "3. Try running: npm install" -ForegroundColor White
    Write-Host "4. See WINDOWS_SETUP.md for more solutions" -ForegroundColor White
    exit 1
}

# Verify Prisma Client was created
Write-Host ""
Write-Host "🔍 Verifying Prisma Client..." -ForegroundColor Green

$prismaClientPath = "node_modules\.prisma\client\index.d.ts"
if (Test-Path $prismaClientPath) {
    Write-Host "✓ Prisma Client files found!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: Prisma Client files not found at expected location" -ForegroundColor Yellow
    Write-Host "  Expected: $prismaClientPath" -ForegroundColor White
}

# Ask if user wants to run migrations
Write-Host ""
$runMigrations = Read-Host "Do you want to run database migrations now? (y/n)"
if ($runMigrations -eq "y") {
    Write-Host ""
    Write-Host "📊 Running database migrations..." -ForegroundColor Green
    npx prisma migrate dev --name init

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migrations complete!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Migrations failed. Check your DATABASE_URL in .env" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Run: npm run dev" -ForegroundColor Cyan
Write-Host "2. Visit: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you encounter any issues, see:" -ForegroundColor White
Write-Host "  - WINDOWS_SETUP.md (Windows-specific fixes)" -ForegroundColor White
Write-Host "  - QUICKSTART.md (Quick start guide)" -ForegroundColor White
Write-Host "  - SETUP_GUIDE.md (Detailed setup)" -ForegroundColor White
Write-Host ""

$startDev = Read-Host "Start development server now? (y/n)"
if ($startDev -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting development server..." -ForegroundColor Green
    Write-Host "   Visit: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Press Ctrl+C to stop" -ForegroundColor White
    Write-Host ""
    npm run dev
}
