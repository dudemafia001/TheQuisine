cd /Users/applemacbookpro/Documents/web/the-quisine-app
./prepare-firebase.sh#!/bin/bash

# 🚀 Deployment Preparation Script for Hostinger
# This script prepares your files for upload to Hostinger

echo "🔧 Preparing TheQuisine App for Hostinger Deployment..."

# Create deployment directory
mkdir -p deployment
cd deployment

echo "📁 Creating directory structure..."
mkdir -p backend
mkdir -p frontend-build
mkdir -p docs

echo "📦 Copying backend files..."
cp -r ../backend/* backend/

echo "🏗️ Building frontend..."
cd ../frontend
npm install
npm run build

echo "📋 Copying frontend build files..."
cp -r .next/standalone/* ../deployment/frontend-build/
mkdir -p ../deployment/frontend-build/.next/static
cp -r .next/static/* ../deployment/frontend-build/.next/static/
cp -r public ../deployment/frontend-build/

echo "📄 Creating environment file templates..."
cd ../deployment

# Backend .env template
cat > backend/.env.example << EOF
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/the-quisine
PORT=5000
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FRONTEND_URL=https://staging.quisine.in
NODE_ENV=production
EOF

# Frontend .env template  
cat > frontend-build/.env.local.example << EOF
NODE_ENV=production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EOF

# Create README for deployment
cat > DEPLOYMENT_README.md << EOF
# 📦 Deployment Files Ready

## Upload Instructions:

### Backend (api.staging.quisine.in):
1. Upload all files from \`backend/\` folder to \`public_html/api/\`
2. Rename \`.env.example\` to \`.env\` and update values
3. Create Node.js application in Hostinger
4. Run \`npm install\` in terminal

### Frontend (staging.quisine.in):
1. Upload all files from \`frontend-build/\` folder to \`public_html/staging/\`
2. Rename \`.env.local.example\` to \`.env.local\` and update values  
3. Create Node.js application in Hostinger

## Important:
- Backend startup file: \`server.js\`
- Frontend startup file: \`server.js\`
- Node.js version: 18.x or higher

## Test URLs:
- Frontend: https://staging.quisine.in
- Backend: https://api.staging.quisine.in
EOF

echo "✅ Deployment preparation complete!"
echo ""
echo "📁 Files ready in 'deployment' folder:"
echo "   📦 backend/ - Upload to public_html/api/"
echo "   🌐 frontend-build/ - Upload to public_html/staging/"
echo ""
echo "📋 Next steps:"
echo "   1. Create subdomains in Hostinger"
echo "   2. Upload folders to correct locations"
echo "   3. Configure environment variables"
echo "   4. Create Node.js applications"
echo ""
echo "📖 Full guide: GITHUB_TO_HOSTINGER.md"