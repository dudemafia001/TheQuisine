#!/bin/bash

# 🔥 Build Frontend for Firebase Web Console Upload
# This script prepares your frontend for drag-and-drop upload to Firebase

echo "🔥 Building frontend for Firebase web console upload..."

# Navigate to frontend directory
cd frontend

# Update Next.js config for static export (required for Firebase hosting)
echo "⚙️ Updating Next.js configuration..."
cat > next.config.ts << 'EOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
};

export default nextConfig;
EOF

echo "📦 Installing dependencies..."
npm install

echo "🏗️ Building frontend..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Files ready for Firebase upload:"
    echo "   📂 Location: frontend/out/"
    echo "   📊 Size: $(du -sh out | cut -f1)"
    echo ""
    echo "🔥 Next steps:"
    echo "   1. Go to console.firebase.google.com"
    echo "   2. Create a new project"
    echo "   3. Go to Hosting → Get Started"
    echo "   4. Drag and drop the 'out' folder contents"
    echo ""
    echo "📋 Files to upload:"
    ls -la out/
else
    echo "❌ Build failed!"
    echo "Check the error messages above"
    exit 1
fi

# Create a README file in the out directory
cat > out/UPLOAD_INSTRUCTIONS.md << 'EOF'
# Upload Instructions

## These files are ready for Firebase Hosting

### How to upload:
1. Go to https://console.firebase.google.com
2. Create a new project (if not done already)
3. Go to Hosting → Get Started  
4. Skip CLI installation steps
5. Drag and drop ALL files from this folder
6. Your site will be live!

### Your site will be available at:
https://your-project-name.web.app

### After upload:
- Test the website loads
- Check if products display
- Verify all functionality works

### Need Backend?
Your frontend is configured to connect to:
- Local development: http://localhost:5001
- Production: Set NEXT_PUBLIC_API_URL environment variable

For free backend hosting, consider:
- Railway.app
- Render.com
- Vercel (for serverless functions)
EOF

echo ""
echo "📖 Full guide available in: FIREBASE_WEB_CONSOLE_DEPLOY.md"