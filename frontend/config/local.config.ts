// Local development configuration
const localConfig = {
  API_BASE_URL: 'http://localhost:5001',
  FRONTEND_URL: 'http://localhost:3000',
  ENVIRONMENT: 'development',
  
  // API Endpoints
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

export default localConfig;