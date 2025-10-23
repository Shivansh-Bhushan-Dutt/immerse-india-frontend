# Travel Dashboard Frontend Deployment Script

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Ensure we're in the frontend directory
cd "$(dirname "$0")"

echo -e "${BLUE}🚀 Travel Dashboard Frontend Deployment${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Vercel CLI is installed
if ! [ -x "$(command -v vercel)" ]; then
  echo -e "${RED}Error: Vercel CLI is not installed.${NC}" >&2
  echo -e "Install it using: ${GREEN}npm install -g vercel${NC}"
  exit 1
fi

# Check Vercel login status
echo -e "${BLUE}Checking Vercel login status...${NC}"
VERCEL_TOKEN=$(vercel whoami 2>/dev/null)
LOGGED_IN=$?

if [ $LOGGED_IN -ne 0 ]; then
  echo -e "${RED}Not logged in to Vercel. Please login first:${NC}"
  echo -e "${GREEN}vercel login${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Logged in as $VERCEL_TOKEN${NC}\n"
fi

# Build the frontend
echo -e "${BLUE}Building the frontend...${NC}"
npm run build
BUILD_RESULT=$?

if [ $BUILD_RESULT -ne 0 ]; then
  echo -e "${RED}Build failed! Please fix the errors and try again.${NC}"
  exit 1
else
  echo -e "${GREEN}✓ Build successful!${NC}\n"
fi

# Deploy to Vercel
echo -e "${BLUE}Deploying to Vercel...${NC}"
vercel --prod

# Final message
echo -e "\n${GREEN}✅ Frontend deployment complete!${NC}"
echo -e "${BLUE}Make sure to configure your environment variables in the Vercel dashboard.${NC}"
echo -e "${BLUE}API URL should point to your Railway backend.${NC}"