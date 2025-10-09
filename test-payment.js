// Test payment verification endpoint
const testPaymentVerification = async () => {
  const testData = {
    razorpay_order_id: "order_test123",
    razorpay_payment_id: "pay_test123", 
    razorpay_signature: "test_signature",
    orderDetails: {
      userId: "testuser",
      cartItems: [
        {
          id: "product1_Half",
          name: "Test Product", 
          variant: "Half",
          price: 100,
          quantity: 2
        }
      ],
      customerInfo: {
        fullName: "Test User",
        phone: "9999999999",
        email: "test@example.com"
      },
      deliveryAddress: {
        type: "Home",
        address: "Test Address"
      },
      subtotal: 200,
      packagingCharge: 20,
      couponDiscount: 0,
      finalTotal: 220,
      appliedCoupon: null
    }
  };

  try {
    const response = await fetch('http://localhost:5001/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Test Response:', result);
  } catch (error) {
    console.error('Test Error:', error);
  }
};

// Run the test
testPaymentVerification();