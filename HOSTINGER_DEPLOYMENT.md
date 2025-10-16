# 🚀 Hostinger Deployment Guide for staging.quisine.in

## Overview
Your application is now configured with automatic environment detection. It will use:
- **Local**: `http://localhost:5001` (when running locally)
- **Production**: `https://api.staging.quisine.in` (when deployed to Hostinger)

## 📋 Pre-Deployment Checklist

### 1. ✅ Configuration System (COMPLETED)
- ✅ Created `/frontend/config/local.config.ts`
- ✅ Created `/frontend/config/prod.config.ts` 
- ✅ Created `/frontend/config/index.ts` (auto-detects environment)
- ✅ Updated checkout page to use new config system
- ✅ Updated main page to use new config system
- ✅ Updated success page to use new config system

### 2. 🔐 Environment Variables Setup

**Backend (.env file in backend/ folder):**
```env
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/the-quisine
PORT=5000
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FRONTEND_URL=https://staging.quisine.in
NODE_ENV=production
```

**Frontend (.env.local file in frontend/ folder):**
```env
NODE_ENV=production
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## 🏗️ Hostinger Deployment Steps

### Option 1: Subdomain Setup (Recommended)

#### **Frontend Deployment (staging.quisine.in)**
1. **Create Subdomain in Hostinger**
   - Login to Hostinger Control Panel
   - Go to Domain → Subdomains
   - Create subdomain: `staging.quisine.in`
   - Point to a new folder: `public_html/staging`

2. **Build and Upload Frontend**
   ```bash
   # In your local frontend folder
   npm run build
   
   # Upload the contents of .next/standalone to public_html/staging/
   # Also upload .next/static to public_html/staging/.next/static/
   # Upload public folder to public_html/staging/public/
   ```

3. **Create Node.js Application**
   - In Hostinger Control Panel → Node.js
   - Create new Node.js app
   - Node version: 18.x or higher
   - Startup file: `server.js`
   - Application root: `/public_html/staging`

#### **Backend Deployment (api.staging.quisine.in)**
1. **Create Backend Subdomain**
   - Create subdomain: `api.staging.quisine.in`
   - Point to folder: `public_html/api`

2. **Upload Backend Files**
   ```bash
   # Upload entire backend folder to public_html/api/
   ```

3. **Create Backend Node.js Application**
   - Create new Node.js app for backend
   - Startup file: `server.js`
   - Application root: `/public_html/api`

### Option 2: Single Domain Setup

If you prefer to use paths instead of subdomains:
- Frontend: `staging.quisine.in`
- Backend: `staging.quisine.in/api`

**Update production config accordingly:**
```typescript
// In frontend/config/prod.config.ts
const prodConfig = {
  API_BASE_URL: 'https://staging.quisine.in/api',  // Changed this line
  FRONTEND_URL: 'https://staging.quisine.in',
  // ... rest of config
};
```

## 🔧 File Structure on Hostinger

```
public_html/
├── staging/                    # Frontend files (staging.quisine.in)
│   ├── server.js              # Next.js server
│   ├── .next/                 # Built Next.js files
│   ├── public/                # Static assets
│   └── .env.local             # Frontend environment variables
└── api/                       # Backend files (api.staging.quisine.in)
    ├── server.js              # Express server
    ├── src/                   # Backend source code
    ├── node_modules/          # Backend dependencies
    └── .env                   # Backend environment variables
```

## 📝 Deployment Commands

### Local Development
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```

### Production Build
```bash
# Frontend build
cd frontend
npm run build

# Backend preparation
cd backend
npm install --production
```

## 🔒 Security Configuration

### 1. CORS Settings (Already Updated)
Your backend server.js now includes:
```javascript
const allowedOrigins = [
  "http://localhost:3000", 
  "http://localhost:3001",
  "https://staging.quisine.in"  // Your production domain
];
```

### 2. Environment Variables Security
- ✅ `.env` files are in `.gitignore`
- ✅ Never commit sensitive data to Git
- ✅ Use Hostinger's environment variable settings

## 🗄️ Database Setup

### MongoDB Atlas Configuration
1. **Create Production Cluster**
   - Login to MongoDB Atlas
   - Create new cluster for production
   - Add IP addresses to whitelist:
     - Hostinger server IPs
     - 0.0.0.0/0 (if needed for initial testing)

2. **Create Production Database User**
   - Create dedicated user for production
   - Use strong password
   - Grant appropriate permissions

3. **Update Connection String**
   ```env
   MONGO_URI=mongodb+srv://prod-user:strong-password@prod-cluster.mongodb.net/the-quisine-prod
   ```

## 💳 Payment Gateway Setup

### Razorpay Production Configuration
1. **Switch to Live Keys**
   ```env
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   ```

2. **Update Webhook URLs** (if using)
   - Test webhook: `https://api.staging.quisine.in/webhooks/razorpay`
   - Live webhook: Update in Razorpay dashboard

## 🔍 Testing Checklist

### Before Going Live:
- [ ] Test user registration/login
- [ ] Test product loading
- [ ] Test cart functionality  
- [ ] Test coupon validation
- [ ] Test payment flow (use test cards first)
- [ ] Test order placement
- [ ] Test admin panel access
- [ ] Test contact form submission
- [ ] Verify all API endpoints work
- [ ] Test on mobile devices

### Performance Testing:
- [ ] Page load speeds
- [ ] Image optimization
- [ ] API response times

## 🚨 Troubleshooting

### Common Issues:

1. **API Not Working**
   - Check CORS settings
   - Verify subdomain DNS propagation
   - Check Node.js app status in Hostinger

2. **Environment Variables Not Loading**
   - Verify .env file location
   - Check file permissions
   - Restart Node.js applications

3. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist
   - Check connection string format
   - Verify database user permissions

4. **Payment Integration Issues**
   - Verify Razorpay keys are live versions
   - Check webhook configurations
   - Test with Razorpay test cards first

## 📊 Monitoring & Maintenance

### Set up monitoring for:
- Server uptime
- API response times
- Error logs
- Payment transaction logs
- User activity

### Recommended Tools:
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics
- **Performance**: Google PageSpeed Insights

## 📞 Support & Next Steps

1. **Deploy to staging environment first**
2. **Test all functionality thoroughly**
3. **Set up monitoring and backups**
4. **Plan for scaling if needed**

## 🎯 Quick Start Commands

```bash
# 1. Build frontend
cd frontend && npm run build

# 2. Install backend dependencies
cd backend && npm install --production

# 3. Upload files to Hostinger
# - Upload frontend build to public_html/staging/
# - Upload backend files to public_html/api/

# 4. Configure Node.js apps in Hostinger panel
# 5. Set up environment variables
# 6. Test all functionality
```

**Your domains:**
- 🌐 **Frontend**: https://staging.quisine.in
- 🔧 **Backend**: https://api.staging.quisine.in

Need help with any specific step? The configuration system will automatically handle the environment switching!