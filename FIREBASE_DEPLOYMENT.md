# 🔥 Firebase Deployment Guide for The Quisine App

## Overview
Firebase is perfect for testing your app for free! We'll use:
- **Firebase Hosting** - For your Next.js frontend
- **Firebase Functions** - For your Node.js backend
- **MongoDB Atlas** - For your database (free tier)

## 🚀 Benefits of Firebase
- ✅ **Free tier** with generous limits
- ✅ **Custom domain support** (staging.quisine.in)
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Easy deployment**

## 📋 Prerequisites
- ✅ Google account
- ✅ Node.js installed
- ✅ Your code ready

## 🔧 Step 1: Setup Firebase Project

### 1.1 Create Firebase Project
1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Project name:** `the-quisine-app`
4. **Enable Google Analytics** (optional)
5. **Click "Create project"**

### 1.2 Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

## 🌐 Step 2: Deploy Frontend (Firebase Hosting)

### 2.1 Initialize Firebase in Your Project
```bash
cd the-quisine-app
firebase init
```

**Select:**
- ✅ **Hosting: Configure files for Firebase Hosting**
- ✅ **Functions: Configure a Cloud Functions directory** (for backend)

**Configuration:**
- **Project:** Select your created project
- **Public directory:** `frontend/out` 
- **Configure as SPA:** Yes
- **Overwrite index.html:** No
- **Functions language:** JavaScript
- **ESLint:** No
- **Install dependencies:** Yes

### 2.2 Update Next.js for Static Export
**Update `frontend/next.config.ts`:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-project-id-default-rtdb.firebaseio.com',
  },
};

export default nextConfig;
```

### 2.3 Update Firebase Configuration
**Create/Update `firebase.json`:**
```json
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
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

### 2.4 Build and Deploy Frontend
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

## 🔧 Step 3: Deploy Backend (Firebase Functions)

### 3.1 Setup Functions Directory
```bash
# Copy your backend code to functions directory
cp -r backend/* functions/
cd functions

# Update package.json for Firebase Functions
npm init -y
```

### 3.2 Update Functions Package.json
**Edit `functions/package.json`:**
```json
{
  "name": "functions",
  "description": "Cloud Functions for Firebase",
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
```

### 3.3 Create Firebase Function Entry Point
**Create `functions/index.js`:**
```javascript
const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

// Import your existing server code (we'll adapt it)
const app = express();

// Enable CORS for all origins (adjust for production)
app.use(cors({ origin: true }));
app.use(express.json());

// Import your existing routes
// You'll need to adapt your existing routes here
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

app.get('/', (req, res) => {
  res.send('The Quisine API is running on Firebase Functions!');
});

// Export the API as a Firebase Function
exports.api = functions.https.onRequest(app);
```

### 3.4 Install Dependencies and Deploy
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

## ⚙️ Step 4: Update Configuration for Firebase

### 4.1 Update Production Config
**Update `frontend/config/prod.config.ts`:**
```typescript
// Production configuration for Firebase
const prodConfig = {
  API_BASE_URL: 'https://us-central1-your-project-id.cloudfunctions.net/api', // Your Firebase Functions URL
  FRONTEND_URL: 'https://your-project-id.web.app',     // Your Firebase Hosting URL
  ENVIRONMENT: 'production',
  
  // ... rest of your endpoints remain the same
};

export default prodConfig;
```

### 4.2 Get Your Firebase URLs
After deployment, you'll get:
- **Frontend URL:** `https://your-project-id.web.app`
- **Backend URL:** `https://us-central1-your-project-id.cloudfunctions.net/api`

## 🔐 Step 5: Environment Variables

### 5.1 Set Firebase Environment Variables
```bash
firebase functions:config:set \
  mongodb.uri="mongodb+srv://username:password@cluster.mongodb.net/database" \
  razorpay.key_id="rzp_test_xxxxx" \
  razorpay.key_secret="xxxxx" \
  frontend.url="https://your-project-id.web.app"
```

### 5.2 Access Environment Variables in Functions
**Update your backend code to use Firebase config:**
```javascript
const functions = require('firebase-functions');

// Instead of process.env.MONGO_URI
const mongoUri = functions.config().mongodb.uri;

// Instead of process.env.RAZORPAY_KEY_ID
const razorpayKeyId = functions.config().razorpay.key_id;
```

## 🌐 Step 6: Custom Domain (staging.quisine.in)

### 6.1 Add Custom Domain
1. **Go to Firebase Console → Hosting**
2. **Click "Add custom domain"**
3. **Enter:** `staging.quisine.in`
4. **Follow verification steps**

### 6.2 Update DNS Records
**Add these records to your domain DNS:**
```
Type: A
Name: staging
Value: 151.101.1.195

Type: A  
Name: staging
Value: 151.101.65.195
```

## 🚀 Step 7: Complete Deployment Script

**Create `firebase-deploy.sh`:**
```bash
#!/bin/bash

echo "🔥 Deploying The Quisine App to Firebase..."

# Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Frontend: https://your-project-id.web.app"
echo "🔧 Backend: https://us-central1-your-project-id.cloudfunctions.net/api"
```

## 📊 Step 8: Testing Your Deployment

### Test URLs:
- **Frontend:** `https://your-project-id.web.app`
- **Backend API:** `https://us-central1-your-project-id.cloudfunctions.net/api`
- **Products API:** `https://us-central1-your-project-id.cloudfunctions.net/api/api/products`

### Test Checklist:
- [ ] ✅ Frontend loads correctly
- [ ] ✅ Products display
- [ ] ✅ User registration works
- [ ] ✅ Cart functionality works
- [ ] ✅ Payment integration works
- [ ] ✅ API responses are correct

## 🔍 Alternative: Firebase + Railway/Render

If Firebase Functions are complex, you can also use:
- **Frontend:** Firebase Hosting (free)
- **Backend:** Railway or Render (free tiers available)

**Railway/Render backend URLs:**
- Railway: `https://your-app-name.railway.app`
- Render: `https://your-app-name.onrender.com`

## 💰 Cost Comparison

### Firebase (Recommended for testing):
- **Hosting:** Free (1GB storage, 10GB bandwidth)
- **Functions:** Free (125K invocations, 40K GB-seconds)
- **Custom Domain:** Free

### Alternative Free Options:
1. **Vercel** (Frontend) + **Railway** (Backend)
2. **Netlify** (Frontend) + **Render** (Backend)
3. **GitHub Pages** (Frontend) + **Railway** (Backend)

## 🎯 Quick Start Commands

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools
firebase login

# 2. Initialize Firebase
firebase init

# 3. Deploy
firebase deploy
```

## 🚨 Troubleshooting

**Common Issues:**
1. **Function timeout:** Increase timeout in Firebase Console
2. **CORS errors:** Update CORS settings in functions
3. **Environment variables:** Use Firebase config instead of .env

Firebase is perfect for testing and can handle production traffic too. Plus, you get monitoring, analytics, and easy scaling!

Would you like me to help you set up Firebase deployment step by step?