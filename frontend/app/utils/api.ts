// API configuration utility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/api/products`,
  coupons: {
    active: `${API_BASE_URL}/api/coupons/active`,
    validate: `${API_BASE_URL}/api/coupons/validate`,
  },
  payments: {
    createOrder: `${API_BASE_URL}/api/payments/create-order`,
    verify: `${API_BASE_URL}/api/payments/verify`,
    cash: `${API_BASE_URL}/api/payments/cash`,
  },
  orders: {
    user: (userId: string) => `${API_BASE_URL}/api/orders/user/${userId}`,
  },
  auth: `${API_BASE_URL}/api/auth`,
  contact: `${API_BASE_URL}/api/contact`,
};

export default API_BASE_URL;