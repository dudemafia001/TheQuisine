// Production configuration - Auto-detects Firebase or custom domain
const prodConfig = {
  // Firebase Functions URL (replace 'your-project-id' with actual Firebase project ID)
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://us-central1-your-project-id.cloudfunctions.net/api',
  
  // Frontend URL - works with Firebase Hosting or custom domain
  FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://your-project-id.web.app',
  
  ENVIRONMENT: 'production',
  
  // API Endpoints (same structure as local, but will use production base URL)
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      SIGNUP: '/api/auth/signup',
      LOGOUT: '/api/auth/logout',
    },
    
    // Product endpoints
    PRODUCTS: {
      LIST: '/api/products',
      DETAILS: '/api/products/:id',
    },
    
    // Coupon endpoints
    COUPONS: {
      ACTIVE: '/api/coupons/active',
      VALIDATE: '/api/coupons/validate',
    },
    
    // Payment endpoints
    PAYMENTS: {
      CREATE_ORDER: '/api/payments/create-order',
      VERIFY: '/api/payments/verify',
      CASH: '/api/payments/cash',
    },
    
    // Order endpoints
    ORDERS: {
      USER_ORDERS: '/api/orders/user',
      CREATE: '/api/orders',
      UPDATE_STATUS: '/api/orders/:id/status',
    },
    
    // Admin endpoints
    ADMIN: {
      LOGIN: '/api/admin/login',
      ORDERS: '/api/admin/orders',
      ANALYTICS: '/api/admin/analytics',
    },
    
    // Contact endpoints
    CONTACT: {
      SUBMIT: '/api/contact',
      GET_MESSAGES: '/api/contact',
      UPDATE_STATUS: '/api/contact/:id/status',
    },
    
    // OTP endpoints
    OTP: {
      GENERATE: '/api/otp/generate',
      VERIFY: '/api/otp/verify',
    },
  },
};

export default prodConfig;