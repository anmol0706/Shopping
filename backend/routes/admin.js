import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get admin notifications
// @route   GET /api/admin/notifications
// @access  Private (Admin only)
router.get('/notifications', protect, authorize('admin'), async (req, res) => {
  try {
    const notifications = [];

    // Check for low stock products
    const lowStockProducts = await Product.find({ 
      stock: { $lte: 10, $gt: 0 },
      isActive: true 
    }).limit(5);

    if (lowStockProducts.length > 0) {
      notifications.push({
        id: 'low-stock',
        type: 'warning',
        priority: 'high',
        message: `${lowStockProducts.length} products are running low on stock`,
        unread: true,
        createdAt: new Date(),
        data: {
          products: lowStockProducts.map(p => ({ id: p._id, name: p.name, stock: p.stock }))
        }
      });
    }

    // Check for out of stock products
    const outOfStockProducts = await Product.countDocuments({ 
      stock: 0,
      isActive: true 
    });

    if (outOfStockProducts > 0) {
      notifications.push({
        id: 'out-of-stock',
        type: 'error',
        priority: 'high',
        message: `${outOfStockProducts} products are out of stock`,
        unread: true,
        createdAt: new Date()
      });
    }

    // Check for pending orders
    const pendingOrders = await Order.countDocuments({ 
      orderStatus: 'pending' 
    });

    if (pendingOrders > 0) {
      notifications.push({
        id: 'pending-orders',
        type: 'info',
        priority: 'medium',
        message: `${pendingOrders} orders are pending confirmation`,
        unread: true,
        createdAt: new Date()
      });
    }

    // Check for failed payments
    const failedPayments = await Order.countDocuments({ 
      paymentStatus: 'failed',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    if (failedPayments > 0) {
      notifications.push({
        id: 'failed-payments',
        type: 'error',
        priority: 'medium',
        message: `${failedPayments} payment failures in the last 24 hours`,
        unread: true,
        createdAt: new Date()
      });
    }

    // Check for new user registrations today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    if (newUsers > 0) {
      notifications.push({
        id: 'new-users',
        type: 'success',
        priority: 'low',
        message: `${newUsers} new users registered today`,
        unread: true,
        createdAt: new Date()
      });
    }

    // Check for orders requiring attention (processing for more than 2 days)
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const delayedOrders = await Order.countDocuments({
      orderStatus: 'processing',
      createdAt: { $lte: twoDaysAgo }
    });

    if (delayedOrders > 0) {
      notifications.push({
        id: 'delayed-orders',
        type: 'warning',
        priority: 'medium',
        message: `${delayedOrders} orders have been processing for more than 2 days`,
        unread: true,
        createdAt: new Date()
      });
    }

    res.json({
      success: true,
      notifications: notifications.sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// @desc    Mark notification as read
// @route   PATCH /api/admin/notifications/:id/read
// @access  Private (Admin only)
router.patch('/notifications/:id/read', protect, authorize('admin'), async (req, res) => {
  try {
    // In a real implementation, you would update the notification in the database
    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification'
    });
  }
});

// @desc    Get admin dashboard summary
// @route   GET /api/admin/dashboard-summary
// @access  Private (Admin only)
router.get('/dashboard-summary', protect, authorize('admin'), async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Get today's stats
    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: today }
    });

    const todayRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const todayNewUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    // Get this month's stats
    const monthlyOrders = await Order.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thisMonth },
          orderStatus: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    const monthlyNewUsers = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    // Get inventory alerts
    const lowStockCount = await Product.countDocuments({
      stock: { $lte: 10, $gt: 0 },
      isActive: true
    });

    const outOfStockCount = await Product.countDocuments({
      stock: 0,
      isActive: true
    });

    res.json({
      success: true,
      summary: {
        today: {
          orders: todayOrders,
          revenue: todayRevenue.length > 0 ? Math.round(todayRevenue[0].total / 100) : 0,
          newUsers: todayNewUsers
        },
        thisMonth: {
          orders: monthlyOrders,
          revenue: monthlyRevenue.length > 0 ? Math.round(monthlyRevenue[0].total / 100) : 0,
          newUsers: monthlyNewUsers
        },
        alerts: {
          lowStock: lowStockCount,
          outOfStock: outOfStockCount
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard summary'
    });
  }
});

// @desc    Get system health status
// @route   GET /api/admin/system-health
// @access  Private (Admin only)
router.get('/system-health', protect, authorize('admin'), async (req, res) => {
  try {
    const health = {
      database: 'healthy',
      server: 'healthy',
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date()
    };

    // Check database connectivity
    try {
      await User.findOne().limit(1);
      health.database = 'healthy';
    } catch (error) {
      health.database = 'error';
    }

    // Check memory usage
    const memUsage = process.memoryUsage();
    const memUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    
    if (memUsagePercent > 90) {
      health.memory.status = 'critical';
    } else if (memUsagePercent > 70) {
      health.memory.status = 'warning';
    } else {
      health.memory.status = 'healthy';
    }

    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('Error checking system health:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking system health'
    });
  }
});

export default router;
