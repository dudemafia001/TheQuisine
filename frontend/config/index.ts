import localConfig from './local.config';
import prodConfig from './prod.config';

// Automatically select config based on environment
const isDevelopment = process.env.NODE_ENV === 'development' || 
                     process.env.NODE_ENV === undefined ||
                     typeof window !== 'undefined' && window.location.hostname === 'localhost';

const config = isDevelopment ? localConfig : prodConfig;

// Helper function to build complete API URLs
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  let url = `${config.API_BASE_URL}${endpoint}`;
  
  // Replace URL parameters (e.g., :id with actual id)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, value);
    });
  }
  
  return url;
};

// Helper function to get user orders URL
export const getUserOrdersUrl = (userId: string) => {
  return buildApiUrl(config.ENDPOINTS.ORDERS.USER_ORDERS, { userId });
};

// Helper function to get order status update URL
export const getOrderStatusUrl = (orderId: string) => {
  return buildApiUrl(config.ENDPOINTS.ORDERS.UPDATE_STATUS, { id: orderId });
};

// Helper function to get contact status update URL
export const getContactStatusUrl = (contactId: string) => {
  return buildApiUrl(config.ENDPOINTS.CONTACT.UPDATE_STATUS, { id: contactId });
};

// Export the selected config and commonly used URLs
export default config;

// Pre-built common API URLs for easy use
export const API_URLS = {
  // Auth
  LOGIN: buildApiUrl(config.ENDPOINTS.AUTH.LOGIN),
  SIGNUP: buildApiUrl(config.ENDPOINTS.AUTH.SIGNUP),
  
  // Products
  PRODUCTS: buildApiUrl(config.ENDPOINTS.PRODUCTS.LIST),
  
  // Coupons
  COUPONS_ACTIVE: buildApiUrl(config.ENDPOINTS.COUPONS.ACTIVE),
  COUPONS_VALIDATE: buildApiUrl(config.ENDPOINTS.COUPONS.VALIDATE),
  
  // Payments
  PAYMENT_CREATE_ORDER: buildApiUrl(config.ENDPOINTS.PAYMENTS.CREATE_ORDER),
  PAYMENT_VERIFY: buildApiUrl(config.ENDPOINTS.PAYMENTS.VERIFY),
  PAYMENT_CASH: buildApiUrl(config.ENDPOINTS.PAYMENTS.CASH),
  
  // Admin
  ADMIN_LOGIN: buildApiUrl(config.ENDPOINTS.ADMIN.LOGIN),
  ADMIN_ORDERS: buildApiUrl(config.ENDPOINTS.ADMIN.ORDERS),
  ADMIN_ANALYTICS: buildApiUrl(config.ENDPOINTS.ADMIN.ANALYTICS),
  
  // Contact
  CONTACT_SUBMIT: buildApiUrl(config.ENDPOINTS.CONTACT.SUBMIT),
  CONTACT_MESSAGES: buildApiUrl(config.ENDPOINTS.CONTACT.GET_MESSAGES),
  
  // OTP
  OTP_GENERATE: buildApiUrl(config.ENDPOINTS.OTP.GENERATE),
  OTP_VERIFY: buildApiUrl(config.ENDPOINTS.OTP.VERIFY),
};

// Log current environment (useful for debugging)
if (typeof window !== 'undefined') {
  console.log(`🔧 Environment: ${config.ENVIRONMENT}`);
  console.log(`🌐 API Base URL: ${config.API_BASE_URL}`);
}