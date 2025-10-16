# The Quisine App - Hosting Deployment Guide

## Required Changes for Hosting

Your application requires several changes to be production-ready. Here's what has been prepared and what you need to do:

## 🔧 Files Created/Modified

### ✅ Configuration Files Created:
- `backend/Dockerfile` - Backend Docker configuration
- `frontend/Dockerfile` - Frontend Docker configuration  
- `docker-compose.yml` - Multi-service orchestration
- `.env.example` - Environment variables template
- `ENVIRONMENT_SETUP.md` - Detailed environment setup guide
- `frontend/app/utils/api.ts` - Dynamic API URL configuration

### ✅ Files Modified:
- `frontend/next.config.ts` - Added production optimizations
- `backend/server.js` - Updated CORS for production

## 🚀 Deployment Options

### Option 1: Vercel + Railway/Render (Recommended)
**Frontend (Vercel):**
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```
4. Deploy automatically

**Backend (Railway/Render):**
1. Connect repository to Railway or Render
2. Set environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   RAZORPAY_KEY_ID=your_key
   RAZORPAY_KEY_SECRET=your_secret
   PORT=5000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

### Option 2: Docker + VPS (DigitalOcean/AWS/GCP)
1. Set up environment variables in `.env` files
2. Run: `docker-compose up -d`
3. Configure reverse proxy (Nginx)

### Option 3: Platform-as-a-Service
- **Heroku**: Use buildpacks for Node.js
- **Netlify**: For frontend only
- **DigitalOcean App Platform**: Full-stack deployment

## 📋 Critical Action Items

### 1. ⚠️ Update Hardcoded API URLs
**URGENT**: Replace all `http://localhost:5001` URLs in your frontend code:

In these files, replace hardcoded URLs with the API utility:
- `frontend/app/checkout/page.tsx`
- `frontend/app/checkout/success/page.tsx` 
- `frontend/app/page.tsx`
- `frontend/app/orders/page.js`

**Example change:**
```typescript
// OLD (hardcoded)
fetch('http://localhost:5001/api/products')

// NEW (dynamic)
import { API_ENDPOINTS } from '../utils/api';
fetch(API_ENDPOINTS.products)
```

### 2. 🔐 Set Up Environment Variables
Create these files (DO NOT commit to Git):

**backend/.env:**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/the-quisine
PORT=5000
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
FRONTEND_URL=https://your-frontend-domain.com
```

**frontend/.env.local:**
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxxxx
```

### 3. 🗄️ Database Setup
- Set up MongoDB Atlas cluster
- Whitelist your hosting platform's IP addresses
- Create production database user

### 4. 💳 Payment Gateway
- Switch to Razorpay LIVE keys for production
- Update webhook URLs if using payment webhooks
- Test payment flow on staging environment

## 🔒 Security Checklist

- [ ] Environment variables configured properly
- [ ] MongoDB connection secured
- [ ] CORS origins updated for production domains
- [ ] API keys are LIVE versions (not test)
- [ ] Remove console.log statements from production code
- [ ] Enable HTTPS on hosting platform
- [ ] Set up proper error monitoring

## 📊 Performance Optimizations

### Next.js Optimizations (Already Applied):
- ✅ Standalone output for Docker
- ✅ Image optimization configured
- ✅ Environment variable handling

### Additional Recommendations:
- Enable compression on your hosting platform
- Set up CDN for static assets
- Configure caching headers
- Monitor performance with tools like Lighthouse

## 🔄 Deployment Workflow

1. **Development**: Test locally with `.env` files
2. **Staging**: Deploy to staging environment first
3. **Production**: Deploy to production after testing
4. **Monitoring**: Set up logging and error tracking

## 📞 Support Services to Set Up

1. **MongoDB Atlas** - Database hosting
2. **Razorpay** - Payment processing  
3. **Google Maps API** - Location services
4. **Error Tracking** - Sentry or LogRocket (recommended)
5. **Monitoring** - Uptime monitoring service

## 🎯 Next Steps

1. Fix the hardcoded API URLs using the provided utility
2. Choose a hosting platform from the options above
3. Set up your production database
4. Configure environment variables
5. Test the entire flow in staging before going live

Need help with any specific hosting platform setup? Let me know which option you'd prefer!