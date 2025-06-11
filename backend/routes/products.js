import express from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// @desc    Get all products with filtering, sorting, and pagination
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 12,
      featured
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name')
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews')
      .select('-__v');

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViewCount();

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// @desc    Get all products for admin (includes inactive)
// @route   GET /api/products/admin/all
// @access  Private (Admin only)
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20,
      featured
    } = req.query;

    // Build filter object (no isActive filter for admin)
    const filter = {};

    if (search) {
      filter.$text = { $search: search };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name')
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// @desc    Get inventory data for admin
// @route   GET /api/products/admin/inventory
// @access  Private (Admin only)
router.get('/admin/inventory', protect, authorize('admin'), async (req, res) => {
  try {
    const {
      search,
      category,
      stockFilter,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 20
    } = req.query;

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    // Stock filter logic
    if (stockFilter) {
      switch (stockFilter) {
        case 'out-of-stock':
          filter.stock = 0;
          break;
        case 'low-stock':
          filter.stock = { $gt: 0, $lte: 10 };
          break;
        case 'in-stock':
          filter.stock = { $gt: 10 };
          break;
      }
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select('name brand category stock price images isActive')
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory data'
    });
  }
});

// @desc    Get inventory statistics
// @route   GET /api/products/admin/inventory/stats
// @access  Private (Admin only)
router.get('/admin/inventory/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const lowStockItems = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } });
    const outOfStockItems = await Product.countDocuments({ stock: 0 });

    // Calculate total stock value
    const stockValueResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$stock', '$price'] } }
        }
      }
    ]);

    const totalStockValue = stockValueResult.length > 0 ? stockValueResult[0].totalValue : 0;

    res.json({
      success: true,
      stats: {
        totalProducts,
        lowStockItems,
        outOfStockItems,
        totalStockValue: Math.round(totalStockValue / 100) // Convert from paise to rupees
      }
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching inventory statistics'
    });
  }
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user._id
    };

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product'
    });
  }
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
});

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
        deletedAt: new Date(),
        updatedBy: req.user._id
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
});

// @desc    Permanently delete product (hard delete)
// @route   DELETE /api/products/:id/permanent
// @access  Private (Admin only)
router.delete('/:id/permanent', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product permanently deleted'
    });
  } catch (error) {
    console.error('Error permanently deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error permanently deleting product'
    });
  }
});

export default router;
