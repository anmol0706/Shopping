import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect, authorize } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

// Order validation rules
const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
  body('shippingAddress.name').notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.phone').notEmpty().withMessage('Shipping phone is required'),
  body('shippingAddress.street').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').notEmpty().withMessage('Shipping city is required'),
  body('shippingAddress.state').notEmpty().withMessage('Shipping state is required'),
  body('shippingAddress.zipCode').notEmpty().withMessage('Shipping ZIP code is required'),
  body('paymentMethod').isIn(['cod', 'upi', 'card', 'netbanking', 'wallet', 'razorpay']).withMessage('Invalid payment method'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be non-negative'),
  body('gstAmount').isFloat({ min: 0 }).withMessage('GST amount must be non-negative'),
  body('shippingCost').isFloat({ min: 0 }).withMessage('Shipping cost must be non-negative'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative')
];

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
router.get('/', protect, async (req, res, next) => {
  try {
    // Disable caching
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching orders for user:', req.user._id);

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log('Found orders:', orders.length);
    console.log('First order items:', orders[0]?.items);

    const total = await Order.countDocuments({ user: req.user._id });
    console.log('Total orders count:', total);

    const response = {
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    console.log('Response orders length:', response.orders.length);
    console.log('Response JSON size:', JSON.stringify(response).length);

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images brand category')
      .populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order (or is admin)
    if (order.user && order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Public (guest checkout)
router.post('/', createOrderValidation, async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes,
      guestInfo
    } = req.body;

    // Validate products and stock
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
      paymentMethod,
      subtotal,
      gstAmount,
      shippingCost,
      totalAmount,
      orderNotes
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

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, note);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Check if order can be cancelled
    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    order.cancellationReason = reason;
    await order.updateStatus('cancelled', `Order cancelled by user. Reason: ${reason}`);

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity, salesCount: -item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
  try {
    const stats = await Order.getOrderStats(req.user._id);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
});

// Admin routes

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = {};
    if (status) {
      filter.orderStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get order analytics (Admin)
// @route   GET /api/orders/admin/analytics
// @access  Private (Admin only)
router.get('/admin/analytics', protect, authorize('admin'), async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusStats,
        monthlyStats
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
