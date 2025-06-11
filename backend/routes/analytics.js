import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get reports analytics
// @route   GET /api/analytics/reports
// @access  Private (Admin only)
router.get('/reports', protect, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d', type = 'sales' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    let analytics = {};

    switch (type) {
      case 'sales':
        analytics = await getSalesAnalytics(startDate, now);
        break;
      case 'products':
        analytics = await getProductAnalytics(startDate, now);
        break;
      case 'customers':
        analytics = await getCustomerAnalytics(startDate, now);
        break;
      case 'inventory':
        analytics = await getInventoryAnalytics();
        break;
      case 'financial':
        analytics = await getFinancialAnalytics(startDate, now);
        break;
      default:
        analytics = await getSalesAnalytics(startDate, now);
    }

    res.json({
      success: true,
      analytics,
      period,
      type
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics data'
    });
  }
});

// @desc    Get sales overview
// @route   GET /api/analytics/sales-overview
// @access  Private (Admin only)
router.get('/sales-overview', protect, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const overview = await getSalesOverview(startDate, now);

    res.json({
      success: true,
      overview
    });
  } catch (error) {
    console.error('Error fetching sales overview:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales overview'
    });
  }
});

// @desc    Get top products
// @route   GET /api/analytics/top-products
// @access  Private (Admin only)
router.get('/top-products', protect, authorize('admin'), async (req, res) => {
  try {
    const { period = '30d', limit = 10 } = req.query;
    
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const products = await getTopProducts(startDate, now, parseInt(limit));

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top products'
    });
  }
});

// Helper functions
async function getSalesAnalytics(startDate, endDate) {
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    orderStatus: { $ne: 'cancelled' }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return {
    totalRevenue: Math.round(totalRevenue / 100), // Convert from paise
    totalOrders,
    avgOrderValue: Math.round(avgOrderValue / 100),
    revenueGrowth: 12.5, // Mock data - calculate actual growth
    ordersGrowth: 8.3
  };
}

async function getProductAnalytics(startDate, endDate) {
  const totalProducts = await Product.countDocuments();
  const activeProducts = await Product.countDocuments({ isActive: true });
  const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

  return {
    totalProducts,
    activeProducts,
    lowStockProducts,
    inactiveProducts: totalProducts - activeProducts
  };
}

async function getCustomerAnalytics(startDate, endDate) {
  const totalUsers = await User.countDocuments();
  const newUsers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });
  const activeUsers = await User.countDocuments({
    lastLogin: { $gte: startDate, $lte: endDate }
  });

  return {
    totalUsers,
    newUsers,
    activeUsers,
    userGrowth: newUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0
  };
}

async function getInventoryAnalytics() {
  const totalProducts = await Product.countDocuments();
  const lowStockItems = await Product.countDocuments({ stock: { $lte: 10, $gt: 0 } });
  const outOfStockItems = await Product.countDocuments({ stock: 0 });
  
  const stockValueResult = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
      }
    }
  ]);

  const totalStockValue = stockValueResult.length > 0 ? stockValueResult[0].totalValue : 0;

  return {
    totalProducts,
    lowStockItems,
    outOfStockItems,
    totalStockValue: Math.round(totalStockValue / 100)
  };
}

async function getFinancialAnalytics(startDate, endDate) {
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    orderStatus: { $ne: 'cancelled' }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  
  // Mock financial data
  const expenses = totalRevenue * 0.7; // 70% of revenue as expenses
  const profit = totalRevenue - expenses;
  const profitMargin = totalRevenue > 0 ? ((profit / totalRevenue) * 100).toFixed(1) : 0;

  return {
    totalRevenue: Math.round(totalRevenue / 100),
    totalExpenses: Math.round(expenses / 100),
    netProfit: Math.round(profit / 100),
    profitMargin: parseFloat(profitMargin)
  };
}

async function getSalesOverview(startDate, endDate) {
  const orders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    orderStatus: { $ne: 'cancelled' }
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate new customers in period
  const newCustomers = await User.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate }
  });

  return {
    totalRevenue: Math.round(totalRevenue / 100),
    totalOrders,
    newCustomers,
    avgOrderValue: Math.round(avgOrderValue / 100),
    revenueGrowth: 12.5, // Mock data
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    aovGrowth: 4.2,
    conversionRate: 3.2
  };
}

async function getTopProducts(startDate, endDate, limit) {
  const topProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        orderStatus: { $ne: 'cancelled' }
      }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        sales: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' },
    {
      $project: {
        _id: '$product._id',
        name: '$product.name',
        images: '$product.images',
        sales: 1,
        revenue: { $round: [{ $divide: ['$revenue', 100] }, 0] }
      }
    }
  ]);

  return topProducts;
}

export default router;
