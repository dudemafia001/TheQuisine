# The Quisine App - Environment Variables Template

## Backend (.env file in /backend directory)
```
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/the-quisine
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Frontend (.env.local file in /frontend directory)  
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Instructions

1. **Backend Environment Variables:**
   - Copy the backend template above into a new file: `backend/.env`
   - Replace `your-username`, `your-password`, `your-cluster` with your MongoDB Atlas credentials
   - Add your actual Razorpay API keys

2. **Frontend Environment Variables:**
   - Copy the frontend template above into a new file: `frontend/.env.local`
   - Replace `your-backend-domain.com` with your deployed backend URL
   - Add your Google Maps API key for location features

3. **Security Notes:**
   - Never commit `.env` files to Git
   - Use your hosting platform's environment variable settings in production
   - Keep your API keys secure and rotate them regularly