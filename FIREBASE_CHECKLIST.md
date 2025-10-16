# 📋 Firebase Deployment Checklist

Print this out or keep it open while you deploy!

## ✅ Pre-Deployment Checklist

- [ ] **Google Account Ready** (gmail account)
- [ ] **Terminal/Command Prompt Open**
- [ ] **Internet Connection Stable**
- [ ] **MongoDB Atlas Setup** (for database)
- [ ] **Razorpay Account Setup** (for payments)

## 🔥 Firebase Setup Steps

### Step 1: Create Firebase Project
- [ ] Go to [console.firebase.google.com](https://console.firebase.google.com)
- [ ] Click "Create a project"
- [ ] Name: `the-quisine-app`
- [ ] Disable Google Analytics (optional)
- [ ] Click "Create project"
- [ ] Wait for creation to complete
- [ ] Click "Continue"

### Step 2: Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```
- [ ] Run above commands in Terminal
- [ ] Login with Google account in browser
- [ ] See "Login Successful" message

### Step 3: Prepare Your Code
```bash
cd /Users/applemacbookpro/Documents/web/the-quisine-app
./prepare-firebase.sh
```
- [ ] Navigate to project folder
- [ ] Run preparation script
- [ ] See "Firebase preparation complete!" message

### Step 4: Initialize Firebase
```bash
firebase init
```
**Select these options:**
- [ ] ✅ Hosting: Configure files for Firebase Hosting
- [ ] ✅ Functions: Configure a Cloud Functions directory
- [ ] Use existing project → Select your project
- [ ] Functions language: JavaScript
- [ ] ESLint: No
- [ ] Install dependencies: Yes
- [ ] Public directory: `frontend/out`
- [ ] Single-page app: Yes
- [ ] Overwrite index.html: No

### Step 5: Set Environment Variables
Replace with your actual values:
```bash
firebase functions:config:set mongodb.uri="YOUR_MONGODB_CONNECTION_STRING"
firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID"
firebase functions:config:set razorpay.key_secret="YOUR_RAZORPAY_SECRET"
```
- [ ] Set MongoDB connection string
- [ ] Set Razorpay key ID (test keys for now)
- [ ] Set Razorpay secret key

### Step 6: Deploy to Firebase
```bash
./firebase-deploy.sh
```
- [ ] Run deployment script
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Copy the URLs shown at the end
- [ ] Test both frontend and backend URLs

## 🌐 URLs You'll Get

After deployment, you'll receive:
- **Frontend:** `https://your-project-id.web.app`
- **Backend:** `https://us-central1-your-project-id.cloudfunctions.net/api`

## ✅ Testing Checklist

### Frontend Tests:
- [ ] Website loads without errors
- [ ] Products display correctly
- [ ] User can register/login
- [ ] Cart functionality works
- [ ] Location modal works

### Backend Tests:
- [ ] API URL shows "API is running" message
- [ ] Products API works: `your-backend-url/api/products`
- [ ] No error messages in Firebase console

## 🚨 If Something Goes Wrong

### Frontend Not Loading:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

### Backend Not Working:
```bash
cd functions
npm install
firebase deploy --only functions
```

### Check Logs:
```bash
firebase functions:log
```

## 🎯 Custom Domain Setup (Optional)

### After Basic Deployment Works:
- [ ] Go to Firebase Console → Hosting
- [ ] Click "Add custom domain"
- [ ] Enter: `staging.quisine.in`
- [ ] Add DNS records to your domain provider
- [ ] Wait 24-48 hours for activation

## 📊 Success Indicators

You know it's working when:
- ✅ **Frontend URL opens your website**
- ✅ **Backend URL shows API message**
- ✅ **Products load on the main page**
- ✅ **No errors in browser console** (F12)
- ✅ **Firebase console shows "Healthy" status**

## 🔄 Future Updates

### To update your app:
```bash
# Make your code changes, then:
./firebase-deploy.sh
```

## 📞 Get Help

### Useful Commands:
```bash
# Check current project
firebase projects:list

# See function logs
firebase functions:log

# Deploy only frontend
firebase deploy --only hosting

# Deploy only backend  
firebase deploy --only functions
```

### If Stuck:
1. **Check Firebase Console** for error messages
2. **Look at browser console** (F12 → Console)
3. **Check function logs** with command above

## 🎉 You're Done!

When everything is checked off:
- ✅ **Your app is live on the internet!**
- ✅ **Share your URL with anyone**
- ✅ **Test from different devices**
- ✅ **Monitor usage in Firebase console**

**Congratulations! You've successfully deployed your first app to Firebase!** 🔥