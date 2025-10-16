# 🚀 Deploy from GitHub to Hostinger Subdomain (staging.quisine.in)

## Overview
You'll deploy your GitHub repository to Hostinger using their File Manager and Node.js hosting features.

## 📋 Prerequisites
- ✅ Code pushed to GitHub repository
- ✅ Hostinger hosting account
- ✅ Domain quisine.in added to your Hostinger account

## 🔧 Step 1: Setup Subdomains in Hostinger

### 1.1 Create Frontend Subdomain
1. **Login to Hostinger Control Panel**
2. **Navigate to Domains → Subdomains**
3. **Create New Subdomain:**
   - Subdomain: `staging`
   - Domain: `quisine.in`
   - Document Root: `public_html/staging`
4. **Click "Create"**

### 1.2 Create Backend API Subdomain
1. **Create Another Subdomain:**
   - Subdomain: `api.staging`
   - Domain: `quisine.in`  
   - Document Root: `public_html/api`
2. **Click "Create"**

**Result:** You now have:
- 🌐 Frontend: `staging.quisine.in` → `public_html/staging/`
- 🔧 Backend: `api.staging.quisine.in` → `public_html/api/`

## 📥 Step 2: Download Code from GitHub

### Option A: Using Hostinger File Manager (Recommended)
1. **Open File Manager** in Hostinger Control Panel
2. **Navigate to public_html**
3. **Create directories:**
   ```
   public_html/
   ├── staging/     (for frontend)
   └── api/         (for backend)
   ```

### Option B: Using Git Clone (If available)
1. **Open Terminal** in Hostinger (if available)
2. **Navigate to public_html**
   ```bash
   cd public_html
   git clone https://github.com/dudemafia001/TheQuisine.git temp
   ```

## 🏗️ Step 3: Deploy Backend (api.staging.quisine.in)

### 3.1 Upload Backend Files
1. **Download your repository** to your local computer
2. **In Hostinger File Manager:**
   - Navigate to `public_html/api/`
   - Upload all files from `backend/` folder:
     ```
     public_html/api/
     ├── server.js
     ├── package.json
     ├── src/
     ├── data/
     └── createAdmin.js
     ```

### 3.2 Create Backend Environment File
1. **In File Manager, navigate to `public_html/api/`**
2. **Create new file: `.env`**
3. **Add content:**
   ```env
   MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/the-quisine
   PORT=5000
   RAZORPAY_KEY_ID=rzp_live_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   FRONTEND_URL=https://staging.quisine.in
   NODE_ENV=production
   ```

### 3.3 Setup Backend Node.js Application
1. **In Hostinger Control Panel → Node.js**
2. **Click "Create Application"**
3. **Configure:**
   - **Application Root:** `/public_html/api`
   - **Startup File:** `server.js`
   - **Node.js Version:** 18.x or higher
   - **Application Mode:** Production
4. **Click "Create"**

### 3.4 Install Backend Dependencies
1. **In Node.js section, click "Open Terminal"**
2. **Run:**
   ```bash
   npm install
   ```

### 3.5 Start Backend Application
1. **Click "Start Application"**
2. **Verify it's running** - status should show "Active"

## 🌐 Step 4: Deploy Frontend (staging.quisine.in)

### 4.1 Build Frontend Locally
**On your local machine:**
```bash
cd frontend
npm install
npm run build
```

### 4.2 Upload Frontend Files
1. **Upload these folders to `public_html/staging/`:**
   ```
   From .next/standalone/ → public_html/staging/
   From .next/static/ → public_html/staging/.next/static/
   From public/ → public_html/staging/public/
   ```

2. **File structure should be:**
   ```
   public_html/staging/
   ├── server.js
   ├── .next/
   ├── public/
   └── package.json
   ```

### 4.3 Create Frontend Environment File
1. **In `public_html/staging/` create `.env.local`:**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

### 4.4 Setup Frontend Node.js Application
1. **Create another Node.js Application**
2. **Configure:**
   - **Application Root:** `/public_html/staging`
   - **Startup File:** `server.js`
   - **Node.js Version:** 18.x or higher
   - **Application Mode:** Production
3. **Start Application**

## 🗄️ Step 5: Setup Production Database

### 5.1 MongoDB Atlas Setup
1. **Login to MongoDB Atlas**
2. **Create Production Cluster**
3. **Create Database User:**
   - Username: `produser`
   - Password: Strong password
   - Role: readWrite to your database

### 5.2 Network Access
1. **Add IP Addresses:**
   - Get your Hostinger server IP from control panel
   - Add it to MongoDB Atlas whitelist
   - Or use `0.0.0.0/0` for initial testing

### 5.3 Update Connection String
**Update your backend `.env` file:**
```env
MONGO_URI=mongodb+srv://produser:yourpassword@yourcluster.mongodb.net/the-quisine-prod
```

## 🔒 Step 6: Security & Final Configuration

### 6.1 SSL Certificates
- Hostinger automatically provides SSL for subdomains
- Wait 15-30 minutes for SSL to activate
- Verify: `https://staging.quisine.in` and `https://api.staging.quisine.in`

### 6.2 Test Your Deployment
**Frontend Tests:**
- ✅ Visit `https://staging.quisine.in`
- ✅ Check if products load
- ✅ Test user registration/login
- ✅ Test cart functionality

**Backend Tests:**
- ✅ Visit `https://api.staging.quisine.in` (should show "API is running...")
- ✅ Test API endpoints: `https://api.staging.quisine.in/api/products`

## 🚨 Troubleshooting

### Common Issues:

**1. "Application Failed to Start"**
```bash
# Check logs in Node.js section
# Verify package.json and dependencies
# Check server.js file paths
```

**2. "Cannot Connect to Database"**
```bash
# Verify MONGO_URI format
# Check MongoDB Atlas IP whitelist
# Verify database user permissions
```

**3. "CORS Errors"**
```bash
# Your backend already has CORS configured for staging.quisine.in
# Restart backend application if needed
```

**4. "Module Not Found"**
```bash
# In Node.js terminal:
npm install
# Then restart application
```

## 📊 Monitoring

### Check Application Status:
1. **Node.js Section** - Both apps should show "Active"
2. **Logs** - Check for any error messages
3. **Resource Usage** - Monitor CPU/RAM usage

## 🎯 Quick Deployment Checklist

- [ ] ✅ Created subdomains (staging.quisine.in & api.staging.quisine.in)
- [ ] ✅ Uploaded backend files to `public_html/api/`
- [ ] ✅ Created backend `.env` file
- [ ] ✅ Setup backend Node.js application
- [ ] ✅ Built frontend locally
- [ ] ✅ Uploaded frontend files to `public_html/staging/`
- [ ] ✅ Setup frontend Node.js application
- [ ] ✅ Configured MongoDB Atlas
- [ ] ✅ Tested both frontend and backend
- [ ] ✅ Verified SSL certificates

## 🔄 Future Updates

**To update your code:**
1. **Push changes to GitHub**
2. **Download updated repository**
3. **Replace files in Hostinger**
4. **Restart Node.js applications if needed**
5. **For frontend changes: rebuild and re-upload**

## 📞 Need Help?

If you encounter issues:
1. **Check Node.js application logs** in Hostinger
2. **Verify file permissions** and paths
3. **Test API endpoints** individually
4. **Check browser developer console** for frontend errors

Your domains will be:
- 🌐 **Frontend**: https://staging.quisine.in
- 🔧 **Backend API**: https://api.staging.quisine.in

The configuration system will automatically detect production environment and use the correct URLs!