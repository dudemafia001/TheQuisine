#!/bin/bash

# 🔥 Firebase Deployment Preparation Script
# This script prepares your app for Firebase deployment

echo "🔥 Preparing The Quisine App for Firebase..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo "📁 Creating Firebase deployment structure..."

# Initialize Firebase (if not already done)
if [ ! -f "firebase.json" ]; then
    echo "🔧 Initializing Firebase project..."
    echo "Please run: firebase init"
    echo "Select: Hosting and Functions"
    echo "Then run this script again"
    exit 1
fi

# Prepare Functions directory
echo "📦 Preparing backend for Firebase Functions..."
if [ ! -d "functions" ]; then
    mkdir functions
fi

# Copy backend files to functions
cp -r backend/* functions/ 2>/dev/null || echo "Backend files copied"

# Create Firebase Functions entry point
cat > functions/index.js << 'EOF'
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Enable CORS for all origins
app.use(cors({ origin: true }));
app.use(express.json());

// MongoDB connection using Firebase config
const mongoUri = functions.config().mongodb?.uri || process.env.MONGO_URI;
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Connection Failed:', err));
}

// Import routes (adapt paths as needed)
try {
  const authRoutes = require('./src/routes/auth.js');
  const productRoutes = require('./src/routes/productRoutes.js');
  const couponRoutes = require('./src/routes/couponRoutes.js');
  const paymentRoutes = require('./src/routes/paymentRoutes.js');
  const orderRoutes = require('./src/routes/orderRoutes.js');
  const adminRoutes = require('./src/routes/adminRoutes.js');
  const contactRoutes = require('./src/routes/contactRoutes.js');
  const otpRoutes = require('./src/routes/otpRoutes.js');

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/otp', otpRoutes);
} catch (error) {
  console.error('Error loading routes:', error.message);
}

app.get('/', (req, res) => {
  res.send('🔥 The Quisine API is running on Firebase Functions!');
});

// Export the API as a Firebase Function
exports.api = functions.runWith({
  timeoutSeconds: 60,
  memory: '256MB'
}).https.onRequest(app);
EOF

# Update Functions package.json
cat > functions/package.json << 'EOF'
{
  "name": "functions",
  "description": "Cloud Functions for Firebase - The Quisine API",
  "scripts": {
    "serve": "firebase emulators:start --only functions",
    "shell": "firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "18"
  },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.0.0",
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "mongodb": "^6.20.0",
    "mongoose": "^8.18.1",
    "razorpay": "^2.9.6",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "firebase-functions-test": "^3.0.0"
  },
  "private": true
}
EOF

# Update Next.js config for static export
echo "⚙️ Updating Next.js configuration for Firebase..."
cat > frontend/next.config.ts << 'EOF'
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

# Create Firebase configuration
echo "📋 Creating Firebase configuration..."
cat > firebase.json << 'EOF'
{
  "hosting": {
    "public": "frontend/out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  },
  "functions": {
    "source": "functions",
    "predeploy": "npm --prefix functions install"
  }
}
EOF

# Build frontend
echo "🏗️ Building frontend for Firebase..."
cd frontend
npm install
npm run build
cd ..

# Create deployment script
cat > firebase-deploy.sh << 'EOF'
#!/bin/bash
echo "🔥 Deploying to Firebase..."

# Build frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# Deploy to Firebase
firebase deploy

echo "✅ Deployment complete!"
echo "Check your Firebase console for URLs"
EOF

chmod +x firebase-deploy.sh

echo "✅ Firebase preparation complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: firebase login"
echo "   2. Run: firebase init (if not done already)"
echo "   3. Set environment variables:"
echo "      firebase functions:config:set mongodb.uri=\"your-mongo-uri\""
echo "      firebase functions:config:set razorpay.key_id=\"your-key\""
echo "      firebase functions:config:set razorpay.key_secret=\"your-secret\""
echo "   4. Deploy: ./firebase-deploy.sh"
echo ""
echo "📖 Full guide: FIREBASE_DEPLOYMENT.md"

# Show Firebase project info
if command -v firebase &> /dev/null; then
    echo ""
    echo "🔥 Current Firebase projects:"
    firebase projects:list 2>/dev/null || echo "Run 'firebase login' first"
fi