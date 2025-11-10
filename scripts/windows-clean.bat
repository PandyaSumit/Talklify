@echo off
REM Talklify Windows Clean Script
REM Run this if you need to completely reset the project

echo Talklify Windows Clean Script
echo ==============================
echo.

echo Cleaning build artifacts...
if exist .next rmdir /s /q .next
if exist node_modules\.prisma rmdir /s /q node_modules\.prisma
if exist node_modules\@prisma\client rmdir /s /q node_modules\@prisma\client

echo.
echo Clean complete!
echo.
echo Next steps:
echo 1. Run: npx prisma generate
echo 2. Run: npm run dev
echo.
pause
