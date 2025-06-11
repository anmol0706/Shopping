import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Initialize Stripe conditionally (for demo purposes)
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'your_stripe_secret_key') {
    const Stripe = (await import('stripe')).default;
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch (error) {
  console.log('Stripe not configured - payment features will be limited');
}

// Validation rules
const createPaymentIntentValidation = [
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
  body('currency').optional().isIn(['inr', 'usd']).withMessage('Invalid currency'),
  body('items').isArray({ min: 1 }).withMessage('Items are required'),
  body('shippingAddress').isObject().withMessage('Shipping address is required')
];

// @desc    Create payment intent
// @route   POST /api/payment/create-intent
// @access  Private/Public (guest checkout)
router.post('/create-intent', createPaymentIntentValidation, async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        success: false,
        message: 'Payment processing is currently unavailable. Please try Cash on Delivery.'
      });
    }

    const { amount, currency = 'inr', items, shippingAddress, guestInfo } = req.body;

    // Validate items and calculate amount
    let calculatedAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.price * item.quantity;
      calculatedAmount += itemTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        variant: item.variant || {}
      });
    }

    // Add GST (18%)
    const gstAmount = calculatedAmount * 0.18;

    // Add shipping cost (free over ₹2000)
    const shippingCost = calculatedAmount >= 2000 ? 0 : 99;

    const totalAmount = calculatedAmount + gstAmount + shippingCost;

    // Verify the amount matches what was sent
    if (Math.abs(amount - totalAmount) > 1) { // Allow 1 rupee difference for rounding
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch. Please refresh and try again.'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to paise
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user?._id?.toString() || 'guest',
        itemCount: items.length.toString(),
        subtotal: calculatedAmount.toString(),
        gstAmount: gstAmount.toString(),
        shippingCost: shippingCost.toString(),
        guestEmail: guestInfo?.email || '',
        guestName: guestInfo?.name || ''
      },
      shipping: {
        name: req.user?.name || guestInfo?.name || 'Customer',
        address: {
          line1: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: shippingAddress.country || 'IN'
        }
      },
      receipt_email: req.user?.email || guestInfo?.email
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    next(error);
  }
});

// @desc    Confirm payment and create order
// @route   POST /api/payment/confirm
// @access  Private/Public (guest checkout)
router.post('/confirm', async (req, res, next) => {
  try {
    const {
      paymentIntentId,
      items,
      shippingAddress,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes,
      guestInfo
    } = req.body;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Validate products and stock again
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product} not found or inactive`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: item.price,
        quantity: item.quantity,
        variant: item.variant || {}
      });
    }

    // Create order
    const orderData = {
      items: orderItems,
      shippingAddress,
      paymentMethod: 'card',
      paymentStatus: 'paid',
      paymentDetails: {
        transactionId: paymentIntent.id,
        paymentGateway: 'stripe',
        paidAt: new Date()
      },
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes,
      orderStatus: 'confirmed' // Paid orders are automatically confirmed
    };

    // Add user or guest info
    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.guestInfo = guestInfo;
    }

    const order = new Order(orderData);
    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, salesCount: item.quantity } }
      );
    }

    // Clear user cart if authenticated
    if (req.user) {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [], totalItems: 0, totalAmount: 0 } }
      );
    }

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images brand');

    res.json({
      success: true,
      message: 'Payment confirmed and order created',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    next(error);
  }
});

// @desc    Handle Stripe webhooks
// @route   POST /api/payment/webhook
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);

        // Update order status if needed
        const order = await Order.findOne({
          'paymentDetails.transactionId': paymentIntent.id
        });

        if (order && order.paymentStatus !== 'paid') {
          await order.updatePaymentStatus('paid', {
            transactionId: paymentIntent.id,
            paymentGateway: 'stripe',
            paidAt: new Date()
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);

        // Update order status
        const failedOrder = await Order.findOne({
          'paymentDetails.transactionId': failedPayment.id
        });

        if (failedOrder) {
          await failedOrder.updatePaymentStatus('failed');
        }
        break;

      case 'charge.dispute.created':
        const dispute = event.data.object;
        console.log('Dispute created:', dispute.id);
        // Handle dispute logic here
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// @desc    Get payment methods
// @route   GET /api/payment/methods
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
        name: 'Digital Wallets',
        description: 'Paytm, Mobikwik, Amazon Pay',
        icon: 'wallet',
        enabled: true,
        processingFee: 0,
        estimatedTime: 'Instant'
      },
      {
        id: 'cod',
        name: 'Cash on Delivery',
        description: 'Pay when your order is delivered',
        icon: 'truck',
        enabled: true,
        processingFee: 0,
        estimatedTime: '5-7 business days'
      }
    ];

    res.json({
      success: true,
      paymentMethods
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Refund payment
// @route   POST /api/payment/refund
// @access  Private (Admin only)
router.post('/refund', protect, async (req, res, next) => {
  try {
    const { orderId, amount, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.paymentMethod !== 'card' || !order.paymentDetails.transactionId) {
      return res.status(400).json({
        success: false,
        message: 'Order is not eligible for refund'
      });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: order.paymentDetails.transactionId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason: reason || 'requested_by_customer',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    // Update order status
    await order.updatePaymentStatus('refunded');
    await order.updateStatus('returned', `Refund processed: ${refund.id}`);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    next(error);
  }
});

// @desc    Get payment analytics (Admin)
// @route   GET /api/payment/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, async (req, res, next) => {
  try {
    const { period = '30d', startDate, endDate } = req.query;

    // Calculate date range
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
      dateFilter = {
        createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
      };
    }

    // Total revenue and orders
    const totalStats = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Payment method breakdown
    const paymentMethodStats = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          avgAmount: { $avg: '$totalAmount' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Payment status breakdown
    const paymentStatusStats = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Daily revenue trend
    const dailyRevenue = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Failed payments analysis
    const failedPayments = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'failed' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          lostRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Top performing hours
    const hourlyStats = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { $hour: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Refund statistics
    const refundStats = await Order.aggregate([
      { $match: { ...dateFilter, paymentStatus: 'refunded' } },
      {
        $group: {
          _id: null,
          totalRefunds: { $sum: 1 },
          refundAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalRevenue: totalStats[0]?.totalRevenue || 0,
          totalOrders: totalStats[0]?.totalOrders || 0,
          avgOrderValue: totalStats[0]?.avgOrderValue || 0,
          totalRefunds: refundStats[0]?.totalRefunds || 0,
          refundAmount: refundStats[0]?.refundAmount || 0
        },
        paymentMethods: paymentMethodStats,
        paymentStatus: paymentStatusStats,
        dailyRevenue,
        failedPayments,
        hourlyStats,
        period
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payment success rate
// @route   GET /api/payment/success-rate
// @access  Private (Admin only)
router.get('/success-rate', protect, async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;

    const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 365;
    const dateFilter = {
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) }
    };

    const successRate = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: 1 },
          successful: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$paymentStatus', 'failed'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          successRate: {
            $multiply: [
              { $divide: ['$successful', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    res.json({
      success: true,
      successRate
    });
  } catch (error) {
    next(error);
  }
});

export default router;
