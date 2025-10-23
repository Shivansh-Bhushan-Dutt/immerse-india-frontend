# Travel Dashboard Frontend Deployment Script (PowerShell)

# Set current directory to the script location
Set-Location -Path $PSScriptRoot

Write-Host "🚀 Travel Dashboard Frontend Deployment" -ForegroundColor Blue
Write-Host "========================================`n" -ForegroundColor Blue

# Check if Vercel CLI is installed
if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: Vercel CLI is not installed." -ForegroundColor Red
    Write-Host "Install it using: npm install -g vercel" -ForegroundColor Green
    exit 1
}

# Check Vercel login status
Write-Host "Checking Vercel login status..." -ForegroundColor Blue
$vercelResult = vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Not logged in to Vercel. Please login first:" -ForegroundColor Red
    Write-Host "vercel login" -ForegroundColor Green
    exit 1
} else {
    Write-Host "✓ Logged in as $vercelResult" -ForegroundColor Green
    Write-Host ""
}

# Build the frontend
Write-Host "Building the frontend..." -ForegroundColor Blue
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix the errors and try again." -ForegroundColor Red
    exit 1
} else {
    Write-Host "✓ Build successful!`n" -ForegroundColor Green
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Blue
vercel --prod

# Final message
Write-Host "`n✅ Frontend deployment complete!" -ForegroundColor Green
Write-Host "Make sure to configure your environment variables in the Vercel dashboard." -ForegroundColor Blue
Write-Host "API URL should point to your Railway backend." -ForegroundColor Blue