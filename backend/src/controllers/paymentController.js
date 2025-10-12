import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import Order from '../models/Order.js';

dotenv.config();

// Initialize Razorpay only if credentials are provided
let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
} else {
  console.warn('⚠️  Razorpay credentials not found. Online payments will be disabled.');
}

// Create Razorpay order
export const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.'
      });
    }

    const { amount, currency = 'INR', receipt } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Create order options
    const options = {
      amount: amount * 100, // Convert to paisa (Razorpay uses smallest currency unit)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    // Create order with Razorpay
    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = req.body;

    console.log('🔐 Verifying payment signature...');
    console.log('Razorpay Order ID:', razorpay_order_id);
    console.log('Razorpay Payment ID:', razorpay_payment_id);
    console.log('Received signature:', razorpay_signature);
    
    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    console.log('Expected signature:', expectedSignature);
    console.log('Signatures match:', expectedSignature === razorpay_signature);

    // Verify signature
    if (expectedSignature === razorpay_signature) {
      // Payment is verified - save order to database
      console.log('Payment verified successfully');
      
      try {
        // Create order in database
        if (orderDetails) {
          console.log('📋 Creating order for online payment...');
          console.log('Order Details received:', JSON.stringify(orderDetails, null, 2));
          
          const orderId = `ORDER_${Date.now()}`;
          
          // Transform cart items to order items format
          const orderItems = orderDetails.cartItems.map(item => {
            // Extract product ID from item.id (format: "productId_variant" or just "productId")
            const [productId] = item.id.split('_');
            
            return {
              productId: productId,
              productName: item.name || 'Unknown Product',
              variant: item.variant || 'Regular',
              price: item.price || 0,
              quantity: item.quantity || 1,
              totalPrice: (item.price || 0) * (item.quantity || 1)
            };
          });
          
          console.log('📦 Transformed order items:', JSON.stringify(orderItems, null, 2));
          
          const newOrder = new Order({
            orderId,
            orderNumber: orderId, // Set orderNumber to avoid null index conflicts
            userId: orderDetails.userId || 'guest',
            customerInfo: {
              name: orderDetails.customerInfo.fullName,
              phone: orderDetails.customerInfo.phone,
              email: orderDetails.customerInfo.email
            },
            deliveryAddress: {
              address: orderDetails.deliveryAddress?.address || 'No address provided',
              lat: orderDetails.deliveryAddress?.lat,
              lng: orderDetails.deliveryAddress?.lng
            },
            items: orderItems,
            pricing: {
              subtotal: orderDetails.subtotal,
              packagingCharge: orderDetails.packagingCharge || 0,
              couponDiscount: orderDetails.couponDiscount || 0,
              finalTotal: orderDetails.finalTotal
            },
            paymentInfo: {
              method: 'online',
              paymentId: razorpay_payment_id,
              orderId: razorpay_order_id,
              status: 'paid'
            },
            appliedCoupon: orderDetails.appliedCoupon ? {
              code: orderDetails.appliedCoupon.code,
              discount: orderDetails.appliedCoupon.discount_value || 0
            } : {}
          });

          console.log('💾 Saving order to database...');
          await newOrder.save();
          console.log('✅ Order saved successfully:', orderId);
        } else {
          console.log('❌ No orderDetails received in payment verification');
        }
      } catch (dbError) {
        console.error('❌ Error saving order to database:', dbError);
        console.error('Stack trace:', dbError.stack);
        // Continue with success response even if DB save fails
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// Handle cash payment (with minimum order validation)
export const processCashPayment = async (req, res) => {
  try {
    const { orderDetails, amount } = req.body;

    // Validate minimum order amount for cash payment (₹499)
    const minimumAmount = 499;
    
    if (amount < minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount for cash payment is ₹${minimumAmount}`,
        minimum_amount: minimumAmount
      });
    }

    // Process cash order - save to database
    console.log('Cash payment processed for amount:', amount);
    
    try {
      console.log('💰 Creating cash order...');
      console.log('Order Details received:', JSON.stringify(orderDetails, null, 2));
      
      const orderId = `CASH_${Date.now()}`;
      
      // Transform cart items to order items format
      const orderItems = orderDetails.cartItems.map(item => {
        // Extract product ID from item.id (format: "productId_variant" or just "productId")
        const [productId] = item.id.split('_');
        
        return {
          productId: productId,
          productName: item.name || 'Unknown Product',
          variant: item.variant || 'Regular',
          price: item.price || 0,
          quantity: item.quantity || 1,
          totalPrice: (item.price || 0) * (item.quantity || 1)
        };
      });
      
      console.log('📦 Transformed order items:', JSON.stringify(orderItems, null, 2));
      
      const newOrder = new Order({
        orderId,
        orderNumber: orderId, // Set orderNumber to avoid null index conflicts
        userId: orderDetails.userId || 'guest',
        customerInfo: {
          name: orderDetails.customerInfo.fullName,
          phone: orderDetails.customerInfo.phone,
          email: orderDetails.customerInfo.email
        },
        deliveryAddress: {
          address: orderDetails.deliveryAddress?.address || 'No address provided',
          lat: orderDetails.deliveryAddress?.lat,
          lng: orderDetails.deliveryAddress?.lng
        },
        items: orderItems,
        pricing: {
          subtotal: orderDetails.subtotal,
          packagingCharge: orderDetails.packagingCharge || 0,
          couponDiscount: orderDetails.couponDiscount || 0,
          finalTotal: orderDetails.finalTotal
        },
        paymentInfo: {
          method: 'cash',
          status: 'pending'
        },
        appliedCoupon: orderDetails.appliedCoupon ? {
          code: orderDetails.appliedCoupon.code,
          discount: orderDetails.appliedCoupon.discount_value || 0
        } : {}
      });

      const savedOrder = await newOrder.save();
      console.log('Cash order saved to database:', orderId);

      return res.status(200).json({
        success: true,
        message: 'Cash order placed successfully',
        order_id: orderId,
        payment_method: 'cash',
        order: savedOrder
      });
      
    } catch (dbError) {
      console.error('Error saving cash order to database:', dbError);
      return res.status(500).json({
        success: false,
        message: 'Failed to save order',
        error: dbError.message
      });
    }

  } catch (error) {
    console.error('Error processing cash payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process cash payment',
      error: error.message
    });
  }
};

// Get payment status
export const getPaymentStatus = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to environment variables.'
      });
    }

    const { payment_id } = req.params;

    const payment = await razorpay.payments.fetch(payment_id);

    return res.status(200).json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        created_at: payment.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching payment status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message
    });
  }
};