import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Initialize Razorpay
let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
} catch (error) {
  console.log('Razorpay not configured - payment features will be limited');
}

// Validation rules
const createOrderValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isIn(['INR']).withMessage('Invalid currency'),
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
];

// @desc    Create Razorpay order
// @route   POST /api/razorpay/create-order
// @access  Private/Public (guest checkout)
router.post('/create-order', createOrderValidation, async (req, res, next) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay payment processing is currently unavailable. Please try Cash on Delivery.'
      });
    }

    const {
      amount,
      currency = 'INR',
      items,
      shippingAddress,
      guestInfo
    } = req.body;

    // Validate items and calculate total
    let calculatedAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedAmount += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant || null
      });
    }

    // Calculate GST (18% for demo)
    const gstAmount = calculatedAmount * 0.18;
    
    // Calculate shipping cost
    const shippingCost = calculatedAmount >= 500 ? 0 : 50;
    
    // Total amount
    const totalAmount = calculatedAmount + gstAmount + shippingCost;

    // Validate amount matches
    if (Math.abs(totalAmount - amount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch. Please refresh and try again.'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: currency,
      receipt: `order_${Date.now()}`,
      notes: {
        userId: req.user?._id?.toString() || 'guest',
        itemCount: items.length.toString(),
        subtotal: calculatedAmount.toString(),
        gstAmount: gstAmount.toString(),
        shippingCost: shippingCost.toString(),
        guestEmail: guestInfo?.email || '',
        guestName: guestInfo?.name || ''
      }
    });

    res.status(200).json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      calculatedAmount,
      gstAmount,
      shippingCost,
      totalAmount
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// @desc    Verify payment and create order
// @route   POST /api/razorpay/verify-payment
// @access  Private/Public (guest checkout)
router.post('/verify-payment', async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shippingAddress,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes,
      guestInfo
    } = req.body;

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
    if (payment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: 'Payment not captured'
      });
    }

    // Validate items again and update stock
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      // Update product stock
      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant || null
      });
    }

    // Create order
    const order = new Order({
      user: req.user?._id || null,
      items: orderItems,
      shippingAddress,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      paymentDetails: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      },
      orderNotes,
      guestInfo: !req.user ? guestInfo : null,
      status: 'confirmed'
    });

    await order.save();

    // Clear user's cart if logged in
    if (req.user) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

// @desc    Get payment methods
// @route   GET /api/razorpay/methods
// @access  Public
router.get('/methods', async (req, res, next) => {
  try {
    const paymentMethods = [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Visa, Mastercard, RuPay, American Express',
        icon: 'credit-card',
        enabled: true,
        processingFee: 0,
        estimatedTime: 'Instant'
      },
      {
        id: 'upi',
        name: 'UPI',
        description: 'Google Pay, PhonePe, Paytm, BHIM',
        icon: 'smartphone',
        enabled: true,
        processingFee: 0,
        estimatedTime: 'Instant'
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        description: 'All major Indian banks',
        icon: 'building',
        enabled: true,
        processingFee: 0,
        estimatedTime: 'Instant'
      },
      {
        id: 'wallet',
        name: 'Wallets',
        description: 'Paytm, Mobikwik, Freecharge',
        icon: 'wallet',
        enabled: true,
        processingFee: 0,
        estimatedTime: 'Instant'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: 'truck',
        enabled: true,
        processingFee: 25,
        estimatedTime: '3-7 business days'
      }
    ];

    res.status(200).json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods'
    });
  }
});

export default router;
