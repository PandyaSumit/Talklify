# Windows Setup Fix Guide

## Issue: Prisma Generation Fails on Windows

### Solution 1: Run as Administrator (Quickest)

1. **Close the current terminal**
2. **Open PowerShell as Administrator**:
   - Press `Windows + X`
   - Select "Windows PowerShell (Admin)" or "Terminal (Admin)"
3. **Navigate to your project**:
```powershell
cd C:\SUMIT\Talklify
```
4. **Clean and regenerate**:
```powershell
# Remove generated files
Remove-Item -Recurse -Force node_modules\.prisma -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Generate Prisma Client
npx prisma generate

# Start dev server
npm run dev
```

### Solution 2: Full Clean Install

If Solution 1 doesn't work, do a complete clean install:

```powershell
# As Administrator in PowerShell

# 1. Stop any running processes
# Press Ctrl+C if dev server is running

# 2. Clean everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
Remove-Item -Force package-lock.json

# 3. Reinstall dependencies
npm install

# 4. Generate Prisma Client
npx prisma generate

# 5. Start dev server
npm run dev
```

### Solution 3: Change PowerShell Execution Policy

If you still have permission issues:

```powershell
# Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try Solution 1 again.

### Solution 4: Use WSL2 (Recommended for Development)

If you continue having Windows permission issues, I recommend using WSL2:

1. **Install WSL2**:
```powershell
# Run as Administrator
wsl --install
```

2. **Restart your computer**

3. **Open Ubuntu terminal** and navigate to your project:
```bash
cd /mnt/c/SUMIT/Talklify
npm install
npx prisma generate
npm run dev
```

### Solution 5: Disable Antivirus Temporarily

Sometimes Windows Defender or antivirus software blocks file operations:

1. Temporarily disable Windows Defender/Antivirus
2. Run `npx prisma generate`
3. Re-enable antivirus

## After Fixing Prisma Generation

Once Prisma generates successfully, you should see:

```
✔ Generated Prisma Client (5.x.x) to .\node_modules\@prisma\client
```

Then you can run:
```powershell
npm run dev
```

And visit: http://localhost:3000

## Still Having Issues?

### Check if Prisma Client was generated:
```powershell
Test-Path node_modules\.prisma\client\index.d.ts
```

Should return `True`. If it returns `False`, Prisma client isn't generated.

### Check Node version:
```powershell
node --version
```

Should be 18.x or higher.

### Try using CMD instead of PowerShell:
```cmd
cd C:\SUMIT\Talklify
rmdir /s /q node_modules\.prisma
rmdir /s /q .next
npx prisma generate
npm run dev
```

## Alternative: Use Git Bash

If you have Git for Windows installed:

1. Open Git Bash
2. Navigate to project:
```bash
cd /c/SUMIT/Talklify
```
3. Run commands:
```bash
rm -rf node_modules/.prisma .next
npx prisma generate
npm run dev
```

## Need More Help?

If none of these work, share the output of:
```powershell
node --version
npm --version
Get-ExecutionPolicy -List
```
